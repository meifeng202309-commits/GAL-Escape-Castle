# FINDINGS — Level 3 ACT1–13 post-Sprint6

Baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`

| Issue ID | Severity | Status | Problem description | Evidence / reproduction | Code file(s) | Symbol / function / line range | Baseline SHA | Violated invariant / risk | Recommended fix | Audit method | Owner | Fix commit | Re-test result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IDA-005 | HIGH | CONFIRMED | ACT6–13 later-Sprint phase/cinematic/audio chronology is only partially durable; material transitions overwrite mutable current state without a complete append-only event history | `s3b_set_scene` only upserts current scene; `s5_advance` mutates phase without transition events; `s6_tick_cinematic` repeatedly overwrites stage/timestamp/audio key; S5/S6 log only selected events. V2.4 §15 requires phase transitions and asset/audio events | `database/007_sprint3b_act1_5_placeholder_flow.sql`; `database/027_sprint5_act6_8_runtime.sql`; `database/035_sprint6_focused_audit_corrections.sql`; `database/036_sprint6_four_open_findings.sql` | `s3b_set_scene`; `s5_advance`; S5 vote transitions; `s6_close_discussion_guarded`; `s6_advance_guarded/v2`; `s6_tick_cinematic`; `feedback_audio_key` | `2acfe324d05c8bea2fb96d7132ba29f894270b38` | Pattern D / V2.4 Logging: current state must not replace reconstructable transition/audio history needed for integrity/export | Preserve append-only, timestamped provenance for material ACT6–13 phase transitions and audio trigger/outcome history so Sprint8 can export observed chronology without guessing from current rows | Methods 7, 9; recurring Pattern D | CD |  | NOT RETESTED |
| IDA-004 | HIGH | CONFIRMED | Canonical ACT5→6 and ACT8→9 handoffs require out-of-band Teacher initialization instead of automatic state-machine continuation | ACT1–5 terminal writes only `SPRINT3B_COMPLETE`; ACT8 terminal writes only `s5_run_state.phase_key='complete'`; only Teacher Console calls `s5_initialize` / `s6_initialize`, both requiring Teacher token. Player/server terminal transitions never call them | `database/027_sprint5_act6_8_runtime.sql`; `database/029_sprint5_canonical_discussion_localization.sql`; `database/031_sprint5_focused_reaudit_corrections.sql`; `database/035_sprint6_focused_audit_corrections.sql`; `src/teacher/teacher-console.js` | `s5_initialize`; `s5_advance`; `s6_initialize`; `initializeSprint5`; `initializeSprint6` | `2acfe324d05c8bea2fb96d7132ba29f894270b38` | Canonical ACT1→13 state-machine continuity; automatic DiscussionRoom opening; Teacher must not be an undocumented required gameplay actor | Make canonical cross-ACT continuation owned by the formal game state machine so a valid completed ACT5/ACT8 deterministically enters the next ACT exactly once without hidden Teacher intervention | Methods 1, 5, 7, 8 | CD |  | NOT RETESTED |
| IDA-003 | HIGH | NOT_VERIFIED | New authoritative `s6_station_b_progress` table is the only formal runtime table created without RLS; effective anon/authenticated direct table privileges are not independently verified | Migration036 creates table used by Station B gate but never enables RLS and contains no table-level revoke; all other formal runtime tables created in 001–035 enable RLS. Production catalog/default grants unavailable to CA | `database/036_sprint6_four_open_findings.sql` | `s6_station_b_progress`; `s6_complete_station_v2`; table DDL / RLS boundary | `2acfe324d05c8bea2fb96d7132ba29f894270b38` | Direct DB authority / RLS boundary; a browser role must not bypass station-task RPC invariants | Establish deployment-effective fail-closed protection for direct access to this authoritative table and verify anon/authenticated cannot read/write it outside governed RPCs | Methods 3, 4, 6 | CD |  | NOT VERIFIED — production ACL required |
| IDA-002 | MEDIUM | CONFIRMED | Sprint6 critical one-shot audio replay suppression is browser-memory-only and resets on reload/reconnect | `sprint6AudioIdentity` starts empty on each page load; server `feedback_audio_key` remains present during ACT9 failure / ACT10 alarm / cinematic stages; reconnect re-hydrates same cue and can replay it after next user interaction | `src/game/app.js`; `database/035_sprint6_focused_audit_corrections.sql`; `database/036_sprint6_four_open_findings.sql` | `sprint6AudioIdentity`; `hydrateSprint6`; `playSprint6Audio`; `s6_run_state.feedback_audio_key` | `2acfe324d05c8bea2fb96d7132ba29f894270b38` | V4.0 Audio Safety: reconnect must not repeat completed critical one-shot audio unless scene restart | Make completed one-shot playback identity recoverable across reconnect/reload and ensure reconnect distinguishes already-consumed cue from a new scene/cue occurrence | Methods 1, 5, 6, 8 | CD |  | NOT RETESTED |
| IDA-001 | HIGH | CONFIRMED | Generic Sprint2 deadline refresh can resolve Sprint6 no-vote DiscussionRooms without advancing Sprint6 phase, deadlocking ACT9/10/11 | Sprint6 opens `require_final_vote=false` discussion; player refresh calls `s2_get_player_state` first; at deadline `s2_refresh_discussion` sets row resolved; `s6_get_player_state` then exposes no discussion while `s6_run_state.phase_key` remains discussion; `s6_close_discussion_v2` requires that exact row still be discussion | `database/002_runtime_runs_discussion.sql`; `database/035_sprint6_focused_audit_corrections.sql`; `database/036_sprint6_four_open_findings.sql`; `src/game/app.js` | `s2_refresh_discussion`; `s2_get_player_state`; `s6_open_discussion`; `s6_close_discussion_guarded/v2`; `s6_get_player_state`; `refreshState` | `2acfe324d05c8bea2fb96d7132ba29f894270b38` | Cross-layer authority conflict; one logical transition must have one owner; NORMAL progression must not deadlock at canonical deadline | Ensure generic discussion refresh cannot independently consume a Sprint6-owned deadline; Sprint6 exact-session owner must remain able to perform the canonical phase transition exactly once | Methods 1, 2, 5, 6, 7, 8 | CD |  | NOT RETESTED |

## IDA-001 — Generic Sprint2 deadline refresh deadlocks Sprint6 timed discussions

### Severity / status

**HIGH / CONFIRMED**

### Deterministic control-flow proof

Sprint6 `s6_open_discussion(...)` creates ACT9/10/11 DiscussionRoom rows in the shared `discussion_sessions` table with:

- `status='discussion'`;
- `require_final_vote=false`;
- a finite `phase_deadline`.

The Sprint6-owned close path is `s6_close_discussion_v2 → s6_close_discussion_guarded`.

That path verifies:
- expected Sprint6 phase/step/round;
- exact `discussion_session_id`;
- current row still has `status='discussion'`;
- NORMAL deadline has elapsed;

then resolves the exact discussion and advances `s6_run_state.phase_key` to the next canonical phase.

But the normal browser polling path runs:

`refreshState → s2_get_player_state → ... → s6_get_player_state`.

Generic `s2_get_player_state` invokes `s2_refresh_discussion` on the latest discussion. At/after the deadline, `s2_refresh_discussion` sees `require_final_vote=false` and independently changes the Sprint6 discussion to:

- `status='resolved'`;
- `phase_deadline=null`;
- `outcome.type='discussion_complete'`.

It does **not** update `s6_run_state.phase_key`.

The next `s6_get_player_state` query exposes only a discussion whose status remains `discussion`. It therefore returns `discussion=null`.

The browser renderer provides the Sprint6 close control only when that discussion object exists. The run is left in the Sprint6 discussion phase without a valid advancing action.

Calling `s6_close_discussion_v2` directly afterward does not recover the run because the guarded close rejects a discussion that is no longer `status='discussion'`.

### Affected canonical phases

The same ownership conflict applies to:

- ACT9 initial / tie / soft-failure discussion;
- ACT10 reveal discussion;
- ACT11 allocation discussion.

### Why this is not just a UI defect

The database row itself is consumed by the wrong resolver. Reconnecting from another browser sees the same split authoritative state.

### Closure condition

There must be one effective owner for Sprint6 timed-discussion completion. Generic deadline refresh must not consume a Sprint6-owned discussion in a way that leaves `s6_run_state` behind. The exact Sprint6 phase transition must remain idempotent/recoverable after deadline and reconnect.

### Re-test requirement

Re-test at least one normal deadline in each Sprint6 discussion class (ACT9, ACT10, ACT11), including a poll/reconnect at or after expiry, and verify the run advances through the authoritative Sprint6 transition without losing the exact discussion identity or inventing player input.


## IDA-002 — Sprint6 one-shot audio can replay after reload/reconnect

### Severity / status

**MEDIUM / CONFIRMED**

### Evidence

The only played-cue suppression identity in the player runtime is:

`let sprint6AudioIdentity = ""`

and the check in `hydrateSprint6(...)` compares the current:

`phase_key + cinematic_stage + feedback_audio_key`

against that in-memory variable.

There is no persisted per-run/per-player played-cue identity in the inspected Sprint6 DB tables, runtime event path, localStorage or reconnect payload.

The server can retain `feedback_audio_key` for a non-trivial interval, for example:

- Great Hall wrong-action hiss during the 60-second discussion;
- Golden Key alarm while ACT10 result remains on screen;
- cinematic stage audio while that stage remains current.

After a page reload/new browser reconnect:

1. server state still exposes the same `feedback_audio_key`;
2. `sprint6AudioIdentity` is reset to empty;
3. `hydrateSprint6` treats the same cue as new;
4. after audio is armed/user interacts, the cue can play again.

V4.0 Audio Safety explicitly requires reconnect not to replay an already completed critical one-shot unless the scene restarts.

### Closure condition

Reconnecting/reloading must recover enough playback identity to suppress an already-consumed critical one-shot while still allowing a genuinely new cue occurrence or explicit scene restart to play.

### Re-test requirement

Trigger each class of one-shot (at minimum ACT9 hiss, ACT10 alarm and one ACT12 cue), reload/reconnect while the authoritative state still carries that cue, and verify it is not replayed; then verify a genuinely new occurrence can still play.


## IDA-003 — Station B progress table lacks RLS; deployed direct-access protection not verified

### Severity / status

**HIGH / NOT_VERIFIED**

### Source evidence

Migration `036_sprint6_four_open_findings.sql` creates:

`public.s6_station_b_progress`

with authoritative Station B intermediate state:
- player_id;
- `lever_held`;
- `indicator_center`;
- timestamps.

The table is read and written by `s6_complete_station_v2`, so it participates directly in whether Station B can reach its terminal station task.

Unlike every other formal runtime table created in migrations 001–035, migration036 never executes:

`ALTER TABLE public.s6_station_b_progress ENABLE ROW LEVEL SECURITY`.

It also contains no explicit table-level revoke from browser roles.

### Why status is NOT_VERIFIED rather than CONFIRMED direct exposure

CA does not currently have independent access to the deployed PostgreSQL privilege catalog/default privilege configuration.

Therefore this audit does not claim that anon/authenticated can definitely write the production table.

What is confirmed is the source-level protection gap: the authoritative table is outside the otherwise consistent RLS boundary.

### Risk if deployed grants permit direct table mutation

A browser client could potentially alter the intermediate Station B state without passing through the guarded v2 station-task RPC, undermining the server-authoritative HOLD → center gate.

### Closure condition

Provide deployment-effective proof that anon/authenticated direct access is fail-closed, or bring this authority-bearing table under an equivalent explicit server-side direct-access protection. Re-test using the effective deployed role privileges, not source inspection alone.


## IDA-004 — ACT5→6 and ACT8→9 require noncanonical Teacher initialization

### Severity / status

**HIGH / CONFIRMED**

### Evidence

The V4.0 active state machine is continuous:

`ACT 5 → ACT 6 → ACT 7 → ACT 8 → ACT 9`.

V4.0 also states that after the Library reunion, when formal discussion is needed the system automatically opens the reusable DiscussionRoom rather than relying on ad-hoc Teacher explanation/intervention.

At the frozen implementation:

- ACT1–5 completion stores `s3b_run_state.terminal_state='SPRINT3B_COMPLETE'`.
- Nothing in the player/server terminal transition creates Sprint5 state.
- `s5_initialize(room, teacher_token)` is the only transition that creates ACT6 state/discussion and requires Teacher authority.
- ACT8 completion through `s5_advance` stores `s5_run_state.phase_key='complete'`.
- Nothing in that terminal transition creates Sprint6 state.
- `s6_initialize(room, teacher_token)` is the only transition that creates ACT9 state/private clues/discussion and requires Teacher authority.
- The only runtime callers of those two initializers are Teacher Console buttons.

Therefore a normal valid player run cannot progress continuously across these boundaries without an out-of-band Teacher action not present in the canonical gameplay state machine.

### Why this matters

This is not merely a deployment button:
- it is required for progression;
- the Teacher becomes an undocumented gameplay actor;
- a Teacher disconnect or missed click leaves all players parked at a cross-Sprint boundary;
- the transition is not represented as a canonical Teacher Override and should not be needed as one.

### Closure condition

A valid formal run completing ACT5 and ACT8 must transition into the next canonical ACT exactly once under server-authoritative game flow, without requiring a hidden/manual Teacher initialization step. Existing initialization primitives may remain as internal/idempotent infrastructure if they are no longer an out-of-band progression dependency.

### Re-test requirement

Run the ACT5 terminal transition and ACT8 terminal transition through the actual player/browser orchestration with no Teacher button press, including reconnect immediately after each boundary, and verify ACT6/ACT9 state plus their canonical DiscussionRoom/private delivery is reached exactly once.


## IDA-005 — ACT6–13 phase/audio chronology is not fully durable

### Severity / status

**HIGH / CONFIRMED**

### Canonical requirement

Codex V2.4 §15 Logging / Observability requires at minimum:
- phase transitions;
- private decisions / vote rounds / discussions;
- role assignment / role engaged / pressure choice;
- teacher intervention / validity/provenance;
- asset / audio events.

This history is required before Sprint8 can truthfully verify `session_integrity_verified` and emit the flat event ledger.

### Source evidence

`s3b_set_scene(...)` updates the one current `s3_runtime_scene_state` row but does not itself append a transition event.

Sprint5 adds some good durable evidence:
- vote rows;
- round rows;
- private-choice rows;
- selected runtime events.

But `s5_advance(...)` changes:
- ACT6 answer → ACT7 vote;
- ACT7 solved → ACT8 private;
- ACT8 route → complete;

without a general append-only phase-transition event. Some transition time can be inferred indirectly from later rows, but the exact chronology is not uniformly preserved.

Sprint6 also has strong dedicated evidence tables for choices, allocations, tasks, engagements and receipts.

However `s6_tick_cinematic(...)` repeatedly overwrites:
- `cinematic_stage`;
- `stage_started_at`;
- `feedback_audio_key`.

Only the latest state remains. There is no inspected append-only audio trigger/playback event ledger for the ACT9/10/12 cues.

Thus a later exporter cannot reconstruct every required phase/audio event from durable observed records without inference or loss.

### Why this is distinct from IDA-002

IDA-002 concerns replaying the same one-shot audio after reconnect.

IDA-005 concerns historical evidence: even a correctly played cue/transition is not durably recorded as an append-only event.

### Closure condition

Material ACT6–13 phase transitions and formal audio events must have durable timestamped provenance suitable for later integrity verification/export. The history must represent what actually occurred rather than requiring Sprint8 to infer prior state from a mutable current row.

### Re-test requirement

Execute representative ACT6–13 branches and verify a post-run forensic query can reconstruct ordered phase transitions and formal audio trigger/outcome history after current state has advanced beyond them.
