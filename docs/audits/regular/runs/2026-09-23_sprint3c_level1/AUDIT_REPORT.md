# Sprint3C Level 1 CA Audit

Baseline: `c8387242b086732560c5f807080cb1a80d963a3e`  
Scope: Sprint 3C — Minimal Safe Teacher Deblock / Override  
Audit level: Level 1 — Regular CA Audit  
Decision: **FAIL / BLOCKED**

## 1. Scope reviewed

Changed implementation surface:

- `database/015_sprint3c_minimal_safe_teacher_override.sql`
- `teacher.html`
- `src/teacher/teacher-console.js`
- `tests/sprint3b-static-check.js`
- `tests/sprint3c-static-check.js`
- `tests/sprint3c-live-e2e.js`

Canonical source:

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md §5.5`

Implemented allowlist reviewed:

- `act1_wake_up / private_first_action` + `SKIP_CURRENT_INTERACTION`
- `act2_route_update / route_update` + `SKIP_CURRENT_INTERACTION`
- `act3_library / library_box` + `RESOLVE_AND_CONTINUE`

The intentionally minimal three-entry allowlist is within the previously approved Sprint3C implementation boundary. The audit failure is not caused by the limited number of entries.

---

## 2. Findings

### S3C-CA-001 — ACT1 SKIP can advance the global scene while leaving a real-choice player in an unfinished ACT1 stage

Severity: **MEDIUM**  
Status: **CONFIRMED**

Canonical requirement:

V4.0 §5.5.1 requires ACT1 `SKIP_CURRENT_INTERACTION` to preserve any real first choice but advance **every player who has not completed ACT1** to complete; only players whose first choice never existed receive missing/invalid behavior fields. The transition to ACT2 occurs after all three are complete.

Current implementation:

`teacher_apply_override(...)` does:

- build invalidated scope only for rows where `act1_choice_id is null`;
- set `act1_stage='complete'` only where `act1_choice_id is null`;
- then unconditionally transition the run to `act2_first_contact / private_first_meeting`.

A player who already submitted a real choice but has not yet completed its ACT1 consequence therefore keeps `act1_stage='consequence'` while the authoritative scene is already ACT2.

This is reachable in the submitted Sprint3C live test itself:

1. GAL-A acknowledges ACT1 opening;
2. GAL-A submits `study_map`;
3. Teacher applies ACT1 SKIP before GAL-A calls ACT1 completion;
4. the test checks that the real choice is preserved but does not require GAL-A's ACT1 stage to become complete;
5. the scene advances to ACT2 and later ACT2 input is accepted.

Impact:

- canonical ACT1 completion semantics are violated;
- per-player progress and global scene authority disagree;
- reconnect/export/state-forensics can observe an impossible combination: ACT2 current scene with an unfinished ACT1 stage;
- stale ACT1 mutation is blocked by the scene guard, so this does not currently permit old-phase mutation after override.

Closure condition:

After ACT1 SKIP, every player who was not already ACT1-complete must be in canonical ACT1-complete Game Track state, while:

- existing real first choice/timestamp evidence remains unchanged and valid;
- only behavior that never occurred because of override remains null / `invalid_teacher_override`;
- no synthetic choice or response evidence is created;
- stale ACT1 player actions remain unable to mutate post-override state.

---

### S3C-CA-002 — downstream override provenance is incomplete for DiscussionRoom behavior events

Severity: **HIGH**  
Status: **CONFIRMED**

Canonical requirement:

V4.0 §5.5 states that after a Teacher Override that advances Game Track, subsequent genuine behavior events remain real/valid but carry:

`context_provenance.upstream_teacher_override = true`

with source override context.

Current implementation:

Migration 015 enriches only `s3b_log_formal_event_at_context(...)` with `game_runs.active_override_id` provenance.

However the existing DiscussionRoom path continues to record player behavior through `s2_log_event(...)`. That helper, unchanged from migration 014, writes the supplied `details` directly and does not add active override provenance.

Examples include later real DiscussionRoom behavior such as `group_vote_locked` (and the same logging family used by DiscussionRoom behavioral events). Therefore a run may contain:

Teacher Override → later genuine player behavior in DiscussionRoom

while those later behavior rows do not identify that their upstream Game Track context was Teacher-overridden.

Impact:

- later behavior remains player-authored, but its required causal context is incomplete;
- behavior analysis/export can incorrectly treat post-override DiscussionRoom behavior as if it arose from an uninterrupted ordinary Game Track path;
- multiple event families now have inconsistent provenance semantics depending on which logging helper they use.

Closure condition:

For every behavior-bearing event path already present in ACT1–5, a genuine player behavior occurring downstream of an active Teacher Override must retain its real actor/value/validity and also expose unambiguous upstream Teacher Override provenance. The requirement applies across logging families, not only to events emitted by Sprint3B action wrappers.

---

## 3. State / authority / concurrency / privacy review

### PASS — server-owned override authority

- client supplies only room/token/action/reason;
- destination/result is server-selected from the allowlist;
- unsupported scene/action combinations reject server-side;
- Teacher authentication is server-side;
- no player choice/vote/attempt is synthesized by the three implemented override branches.

### PASS — serialization / stale work for reviewed branches

The override locks the active run and scene. Existing ACT1, route-update and Library puzzle mutations also converge on authoritative run/scene guards. The submitted source supports exactly-one successful concurrent override for the same interaction and stale old-phase rejection.

CA did not independently execute the live Supabase concurrency suite; this PASS is source/control-flow based with CD live evidence as support.

### PASS — Teacher NORMAL/AUDIT privacy boundary

Migration 015 wraps the previously repaired Teacher state rather than reopening private behavior output. The override operational payload/history contains override metadata and invalidated semantic scope, not unrevealed choice values.

### PASS — migration history discipline

Sprint3C is additive migration 015. No deployed 013/014/014a/014b migration is modified by the implementation commit.

---

## 4. Regression / test adequacy

CD reports:

- all static suites PASS;
- Sprint1 40/40 PASS;
- Sprint2 23/23 PASS;
- Sprint3A 15/15 PASS;
- Sprint3B 44/44 PASS;
- Sprint3C 14/14 PASS.

These are supporting CD-reported behavioral results, not CA-executed live evidence.

The Sprint3C live suite is useful but has two material blind spots exposed by this audit:

1. its partial-ACT1 test verifies preservation of the real choice but does not assert canonical completion of the player who already chose;
2. its downstream-provenance test checks one `first_meeting_choice_locked` event emitted through the newly enriched Sprint3B helper, but does not challenge a later DiscussionRoom behavior event emitted through `s2_log_event(...)`.

---

## 5. Codex Recurring-Error Pattern Scan

| Pattern | Result | Audit result |
|---|---|---|
| A — local correctness / cross-module handoff | **FINDING** | S3C-CA-001: local preservation of real ACT1 choice is correct, but the handoff from partial per-player ACT1 state to global ACT2 scene leaves inconsistent progress. |
| B — response loss / stale / retry / concurrency | **PASS** | Reviewed override serialization, source-interaction uniqueness and stale scene guards; no additional deterministic defect found in the three implemented branches. |
| C — UI rule vs server invariant | **PASS** | allowlist, auth, reason validation and unsupported-action rejection are server-enforced; UI disabling is not the authority. |
| D — current state vs historical evidence | **FINDING** | S3C-CA-002: post-override behavior provenance is not consistently durable across all logging paths. |
| E — authority accretion / legacy reachability | **PASS** | new Teacher override authority is distinct from player mutation authority; no second browser-callable override writer was found for the implemented branches. |
| F — self-confirming tests | **FINDING** | tests validate the new helper path and choice preservation but miss the unfinished-stage handoff and the older DiscussionRoom logging path that lacks provenance. |

---

## 6. NOT VERIFIED boundaries

- physical three-student + Teacher simultaneous browser/device UX;
- CA-independent execution of the live Supabase test suites;
- future unimplemented V4.0 §5.5 allowlist entries.

These are not the reason for the current FAIL; the two blockers above are deterministic source/control-flow findings.

---

## 7. Gate disposition

**Sprint3C = FAIL / BLOCKED**

Required correction scope is narrow:

- S3C-CA-001;
- S3C-CA-002;
- directly adjacent regression tests needed to prove those two closure conditions.

No expansion into additional Teacher Override allowlist entries is required for this correction.

After CD submits the narrow correction, CA should perform a focused Level 1 re-audit of these two findings plus adjacent regression risk. No additional user approval is required merely to execute that governed re-audit step.
