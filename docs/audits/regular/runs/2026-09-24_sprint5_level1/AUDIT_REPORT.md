# Sprint5 ACT 6–8 + visual-dynamic UI — Level 1 CA Audit

Baseline: `f8fdaabadd39f87fd48f965f06d85eca658c0c10`  
Scope: Sprint5 ACT 6–8 + visual-dynamic UI  
Audit level: Level 1 — Regular CA Audit  
Decision: **FAIL / BLOCKED — FOUR BLOCKERS**

## 1. Inputs and independence

CA froze the submitted baseline and independently reconstructed the Sprint5 implementation from:

- `database/027_sprint5_act6_8_runtime.sql`;
- `database/028_sprint5_round_event_link.sql`;
- `src/game/app.js`;
- `src/styles/app.css`;
- `src/teacher/teacher-console.js`;
- `tests/sprint5-live-e2e.js`;
- `tests/sprint5-static-check.js`;
- current V4.0 ACT6–8 canonical sections;
- current Codex V2.3 localization / Sprint5 / workflow contracts;
- current Asset Registry anchor metadata;
- prior DiscussionRoom and Teacher Override authority code.

The verified Sprint4 code baseline remains preserved. Migrations 027 and 028 are reported deployed and are treated as immutable history.

CD-reported deployed E2E/static results are supporting evidence. Source/control-flow findings below are independently reproducible from the submitted baseline.

## 2. Decision summary

Confirmed blockers:

- **S5-CA-001 HIGH** — canonical DiscussionRoom / information-sharing phases are not implemented; direct voting replaces required discussion behavior.
- **S5-CA-002 HIGH** — Sprint5 bypasses the hard localization contract and omits required canonical scene/presentation transitions.
- **S5-CA-003 MEDIUM** — visual-dynamic UI does not consume approved anchor geometry and reintroduces a prohibited CSS-generated portrait-eye substitute.
- **S5-RC-001 MEDIUM** — Sprint5 round/audit compatibility creates split or stale DiscussionRoom/evidence state, including an unresolved ACT6 fallback round.

Sprint5 must remain blocked until these are closed.

## 3. S5-CA-001 HIGH — required DiscussionRoom and asymmetric evidence flow are missing

### Canonical requirement

ACT6 requires a 90-second DiscussionRoom before the fixed question vote, with:

- silent texting;
- free text;
- Pocket access;
- SHARE PHOTO;
- one fresh 15-second discussion/revote after a 1:1:1 tie.

ACT7 requires each 1:1:1 tie to touch no clock and open a fresh 15-second Discussion before the next vote round.

ACT8 requires:

- immutable private first choice;
- reveal after all three choices;
- when the three are not unanimously Main Gate or unanimously West Tower, a 180-second DiscussionRoom;
- Pocket access;
- Memories & Observations access;
- SHARE PHOTO;
- only then the final Main Gate / West Tower vote.

ACT8 is specifically an asymmetric-information scene: Linda's Closure Order remains private unless actively shared.

### Submitted implementation

`s5_rounds` is a direct vote-round container. It has no canonical discussion deadline/message/share semantics.

`s5_submit_vote(...)` accepts votes immediately while the round is in its nominal `discussion` status.

`renderSprint5(...)` renders vote buttons directly for `act6_vote`, `act7_vote` and `act8_final_vote`.

After ACT8 private choices disagree, `s5_submit_private_choice(...)` directly creates `act8_final_vote`; no 180-second DiscussionRoom exists between reveal and final vote.

The Sprint5 client exposes no Pocket / Memories & Observations / SHARE PHOTO path in these scenes.

The existing legacy DiscussionRoom panel is not integrated as the canonical Sprint5 interaction. Migration 028 creates synthetic resolved rows only for audit-FK compatibility; they do not supply the required behavior.

### Impact

This removes the intended collaboration surface rather than merely shortening a timer.

For ACT8 in particular it prevents the game from observing:

- whether Linda shares private closure evidence;
- whether the others request or inspect evidence;
- how players reason after private initial stance;
- information integration before the final group decision.

The submitted live E2E test actually confirms the noncanonical path by moving directly from private choices to final route voting.

### Closure condition

ACT6, ACT7 tie rounds and ACT8 disagreement must execute their canonical DiscussionRoom behavior before the corresponding vote is accepted. Required messaging/time-window/evidence-access/share semantics and provenance must be preserved across reconnect/retry. Private evidence must remain private until a real sharing action occurs.

CA is not prescribing the implementation structure.

## 4. S5-CA-002 HIGH — hard localization contract and canonical presentation flow are bypassed

### Localization contract

Codex V2.3 defines the runtime localization catalog as the sole GAL-facing text source and treats the contract as a HARD REQUIREMENT:

- scene/content config references canonical `text_key`;
- runtime resolves the canonical catalog;
- ordinary GAL runtime displays Nederlands + 中文;
- English master is not ordinary student-facing runtime text;
- CD must not create a second hardcoded translation/text source.

### Submitted implementation

Sprint5 creates a second English-only UI source in `src/game/app.js`, including:

- ACT6 question labels;
- ACT7 Clock A/B/C labels and wall text;
- ACT8 private-choice labels;
- route-board text;
- vote/continuation/status text.

`renderSprint5(...)` does not consume the current `s3_runtime_scene_state.text_key` that the server sets through `s5_set_scene(...)`.

As a result, several canonical transitions are also absent rather than merely untranslated.

Examples:

- ACT6 fixed answer is set server-side, but the answer text is not rendered by the Sprint5 client;
- ACT6 does not display the required Castle Map highlight / “Clock Room is marked…” / FOLLOW MAP transition before ACT7;
- ACT7 wall copy omits `TOUCH THE ONE THAT REMEMBERS.`;
- ACT7 wrong-attempt progression skips the second canonical hint (“A stopped watch in someone's Pocket may matter.”) and jumps from the first hint to the later hint;
- ACT7 solved state does not present the required deep click + moving stone + `WEST TOWER → WAY OUT` + CHECK THE MAP sequence;
- ACT8 evidence screen and route consequence exact texts/signs/buttons are not rendered as specified.

### Impact

This is not a cosmetic localization defect. It changes what students are told, removes canonical evidence/prompt transitions, and violates the project's hard runtime text authority boundary.

### Closure condition

All GAL-facing Sprint5 text and transition content must derive from the current canonical localization/text-key system and display according to the approved language policy. The ACT6–8 canonical presentation sequence must be complete; no required step may be silently skipped merely because server state can advance without it.

CA is not prescribing the renderer architecture.

## 5. S5-CA-003 MEDIUM — visual-dynamic UI ignores approved anchors and uses a prohibited substitute

Sprint5 was explicitly released as ACT6–8 **plus visual-dynamic UI**.

### Portrait

Canonical ACT6 requires:

- `shared.portrait_hall`;
- paired `overlay.portrait_eyes_open`;
- overlay positioned from approved UI anchor geometry;
- no CSS-generated realistic eye substitute.

The submitted client renders:

`<div class="portrait-eyes">● &nbsp; ●</div>`

and animates it through CSS.

It also renders the real overlay with:

`position:absolute; inset:0`

rather than consuming the resolved `portrait_main_face` anchor metadata.

`asset_resolve(...)` supplies `ui_anchors`, but `hydrateS5Assets(...)` uses only `storage_path`.

### Clock Room

The Asset Registry defines:

- `clock_A_face`;
- `clock_B_face`;
- `clock_C_face`.

The submitted client instead places three independent CSS circles in a separate `.clock-wall` layout. They are not overlaid on the resolved Clock Room image and do not consume the approved face anchors.

### Impact

Dynamic exact UI can drift independently from the reviewed artwork geometry. This defeats the anchor contract introduced specifically to keep overlays stable across approved asset versions.

### Closure condition

Sprint5 dynamic overlays must be geometrically bound to the resolved production asset/version using the approved anchor contract. The portrait animation must not rely on a separate CSS-drawn eye substitute. Missing/fallback assets must fail explicitly without silently applying exact overlays to unrelated geometry.

CA is not prescribing coordinate math or DOM structure.

## 6. S5-RC-001 MEDIUM — DiscussionRoom / round audit state is semantically split

Migration 028 was added after the deployed live path exposed the `runtime_events.discussion_session_id` foreign-key dependency.

Its compatibility strategy mirrors every `s5_rounds` row into the legacy semantic table `discussion_sessions`.

Each mirror row is immediately written as:

- `status='resolved'`;
- `outcome.type='sprint5_audit_link'`;
- `tie_policy='NO_TIE_POSSIBLE'`;
- 5-second discussion/vote values;

regardless of the real `s5_rounds.status`.

### A. Legacy “current discussion” selection can become stale or synthetic

Existing `s2_get_player_state(...)` and `s2_get_teacher_state(...)` choose the current legacy discussion by:

`order by vote_round desc limit 1`

Legacy DiscussionRoom uses a run-wide increasing `vote_round`.

Sprint5 resets `vote_round` per phase (ACT6 starts at 1, ACT7 starts at 1, ACT8 starts at 1).

Therefore the legacy state reader can:

- continue returning an older ACT2/ACT5 discussion with a numerically higher round; or
- return a synthetic Sprint5 mirror row marked resolved rather than the real Sprint5 interaction.

The player refresh path calls `renderDiscussion(discussionState)` before `renderSprint5(...)`, so this split is GAL-visible, not only an internal FK detail.

### B. ACT6 fallback leaves its real Sprint5 round unresolved

On the second ACT6 1:1:1 tie, `s5_submit_vote(...)` advances the authoritative run to:

- `act6_resolution='portrait_fixed_fallback'`;
- `phase_key='act6_answer'`;

but does not mark the current `s5_rounds` row resolved or record a fallback `resolution_source/resolved_at`.

It then returns:

- `resolved=false`;
- `tie=true`;

even though the game state has resolved via fallback.

Meanwhile its migration-028 mirror row is already marked `resolved`.

This produces contradictory persisted truths about the same interaction.

### Closure condition

The audit/event-link requirement must not fabricate or expose a semantic DiscussionRoom state that disagrees with the real canonical interaction. Player/Teacher “current discussion” state must identify the actual current interaction, not a stale numerically larger legacy round or a synthetic FK row. A fallback that advances the game must leave one coherent resolved history and response semantics.

CA is not prescribing table layout or FK strategy.

## 7. Areas that pass or materially improved

- Sprint5 initialization is teacher-authorized and rejects runs that have not completed ACT1–5.
- S5 direct tables have RLS enabled and are accessed through server-authoritative functions.
- vote/private-choice RPCs validate player sessions against the room's active formal run.
- run-row locking serializes Sprint5 mutations.
- vote requests carry expected discussion identity + expected round and reject stale identities before a new mutation.
- request IDs provide idempotent replay semantics for committed vote/private-choice requests.
- ACT8 private first choice is single-submit and remains hidden until all three players submit.
- unanimous A/B private choices can directly select the matching route, consistent with the canonical fast path.
- final ACT8 route state is server-authoritative and fold-backs to Great Hall.
- the existing Teacher Override RPC still falls through to “unsupported” for ACT6+; Sprint5 does not widen the ACT1–5 override allowlist.
- migrations 018–026 remain preserved; 027/028 are additive.

## 8. Evidence / verification boundary

CD reports:

- migration 027 deployed;
- migration 028 deployed after detecting the event-FK integration problem;
- Sprint5 live E2E PASS;
- Sprint2 static PASS;
- Sprint3B remediation static PASS;
- Sprint4 static PASS;
- Sprint5 static PASS;
- player/teacher syntax checks PASS;
- `git diff --check` PASS.

These results establish that the submitted direct path executes against Supabase.

They do **not** close the findings above because the current tests do not assert:

- required 90s / 15s / 180s DiscussionRoom phases;
- free-text transcript / Pocket / Memories / SHARE PHOTO semantics;
- ACT8 asymmetric-information privacy and active sharing;
- Dutch + Chinese canonical rendering;
- complete ACT6–8 text/transition sequence;
- UI-anchor placement against resolved assets;
- absence of CSS eye substitutes;
- coherence between `s5_rounds`, mirror `discussion_sessions`, player/teacher state, and ACT6 fallback history.

Physical three-device Sprint5 browser behavior is **NOT VERIFIED** by CA in this audit.

Actual visual geometry against final ACTIVE Sprint5 artwork is **NOT VERIFIED**; several relevant registry entries are not ACTIVE in the canonical registry snapshot, and formal art completion is not required to block core gameplay.

## 9. Mandatory recurring-error pattern scan

| Pattern | Result | Sprint5 audit result |
|---|---|---|
| A — local correctness / cross-module handoff | **FINDING** | New S5 rounds and legacy DiscussionRoom are bridged for FK purposes but disagree on semantic current-state meaning; ACT8 jumps from private choice straight to final vote without the required discussion/evidence handoff. |
| B — happy-path / distributed assumptions | PASS for implemented direct vote RPCs; **FINDING for canonical scope** | request identity and stale-round checks are good, but the required timed/revote DiscussionRoom path does not exist, so its reconnect/timing behavior cannot be audited. |
| C — UI rule mistaken for server rule | PASS for vote/private-choice locking | core lock/route authority is server-side; the current blockers are mostly omitted canonical behavior/presentation rather than UI-only enforcement. |
| D — current state vs historical evidence | **FINDING** | ACT6 fallback advances current state while its S5 round remains open; migration-028 mirror says resolved independently. |
| E — authority accretion / legacy reachability | **FINDING** | migration 028 reuses legacy semantic DiscussionRoom rows as an audit FK bridge, creating a second representation that old state readers interpret as gameplay state. |
| F — self-confirming tests | **FINDING** | live E2E exercises direct voting and therefore confirms the implemented shortcut; static tests mostly assert source-string presence and do not falsify the missing canonical discussion/localization/anchor/evidence behavior. |

## 10. Gate disposition

**Sprint5 remains BLOCKED.**

Open blockers:

- S5-CA-001 HIGH — canonical DiscussionRoom / asymmetric evidence flow missing;
- S5-CA-002 HIGH — localization authority + canonical presentation flow bypassed/incomplete;
- S5-CA-003 MEDIUM — visual-dynamic anchor contract not implemented;
- S5-RC-001 MEDIUM — split/stale DiscussionRoom and round-resolution evidence state.

No Sprint6 implementation should begin.

Migrations `027` and `028` are reported deployed and must now remain immutable. Any DB correction begins at **029+**.

Next owner: **CD**.

CD should correct only the four Sprint5 blockers plus directly adjacent regression coverage, preserve verified Sprint1–4 behavior and deployed migrations, run the relevant static/live/browser regressions, and submit the exact correction baseline/deployment evidence for focused Level 1 re-audit.
