FROM: CD
TO: CA
TIMESTAMP: 20260919T013625Z
SUBJECT: sprint3b-scope-review
STATUS: FOR_REVIEW

AUTHORIZATION / BASELINE:
- User explicitly authorized continuing to the next development step after Sprint 3A PASS.
- Current baseline commit: c491c8846b5a7322b2c598f3c27ea3adf378d7fc
- Sprint 1: accepted, live 40/40 PASS.
- Sprint 2: accepted, live 23/23 PASS.
- Sprint 3A: CA accepted, live 15/15 PASS.
- Full Sprint 3 remains OPEN.

PROPOSED SLICE:
Sprint 3B — ACT 1–5 Placeholder Flow / Route / Safe Deblock

OBJECTIVE:
Connect the accepted Sprint 2 DiscussionRoom and Sprint 3A scene/Pocket/knowledge foundations into a server-authoritative, reconnectable ACT 1–5 placeholder flow. Close the remaining Sprint 3 route, wayfinding, fold-back, and minimal safe-deblock contracts without entering ACT 6+ or Asset Manager work.

PROPOSED IN-SCOPE WORK:

1. Server-owned ACT 1–5 scene configuration and transitions
- deterministic scene/phase/step identities for ACT 1 through ACT 5;
- explicit display_mode values only: CINEMATIC_MESSAGE, CRITICAL_INFO, ACTION_SCREEN;
- canonical text_key references derived from the approved localization catalog;
- server-side transition validation; clients cannot submit arbitrary next_scene;
- all state keyed by run_id and restored after reconnect.

2. ACT 1 completion gate
- role-specific placeholder first-action submission and LOCK;
- preserve private ACT 1 choices;
- advance to ACT 2 only after all three players complete ACT 1;
- no automatic sharing of another player's ACT 1 choice or clues.

3. ACT 2 First Contact integration
- private first-meeting choice A–F, locked independently from final vote;
- mandatory GRAB and leave-room gates;
- server-authoritative Pocket initialization using canonical item identities;
- reveal queued first messages only after all three players meet the gate;
- reuse Sprint 2 DiscussionRoom for final meeting vote;
- preserve player majority choice_id semantics and system fallback resolution_id semantics;
- write final_meeting_result and current_route_target from the authoritative resolution.

4. Failed rendezvous and fold-back
- Library proceeds directly;
- non-Library ACT 2 outcomes enter a configured local consequence before physical reunion;
- retain original final_meeting_result as history;
- after consequence, atomically set current_route_target = library and wayfinding_target = library;
- record a non-scoring escape_penalty_event / fold-back event without inventing behavior evidence.

5. ACT 3 arrival / wayfinding foundation
- reusable WayfindingPlaque rendered as HTML/CSS, not a new AI image;
- each player must explicitly FOLLOW SIGN;
- track per-player location rather than inferring group location from scene text;
- set party_physically_reunited only after all three reach Library;
- enable silent_texting_mode after reunion;
- expose the already approved shared.library identity through placeholder/fallback-safe rendering, without implementing Asset Manager publishing;
- add the two canonical Library group items after the box placeholder is resolved.

6. ACT 3 placeholder puzzle
- server-authoritative five-digit attempt validation for 41739;
- ordered attempts and submitter provenance;
- deterministic progressive hint/fallback state;
- puzzle hints affect Game Track only and do not become behavior scoring;
- group-item creation is idempotent.

7. ACT 4–5 placeholder route decision
- private ACT 4 first-route choice A–D, locked and hidden until reveal;
- direct-resolution path for unanimous A or unanimous B;
- disagreement/C/D opens the reusable DiscussionRoom;
- ACT 5 final vote A–C with SINGLE_REVOTE_THEN_FALLBACK and system fallback inspect_first;
- final group route stored separately from private first-route choices;
- no ACT 6 transition beyond an explicit Sprint-3B terminal boundary.

8. Minimal safe Teacher deblock
- scene config owns allow_skip / allow_resolve_and_continue and the only permitted resolution/next phase;
- Teacher UI exposes only SKIP CURRENT INTERACTION and RESOLVE & CONTINUE where configured;
- Teacher cannot pass arbitrary next_scene, resolution, choice, player identity, observation, or knowledge;
- action is teacher-token authenticated and logged as teacher_override;
- affected interaction evidence uses null + invalid_teacher_override where canonical evidence is missing;
- downstream context records upstream_teacher_override without automatically invalidating later real player actions.

9. UI / tests / reports
- additive student and Teacher UI sufficient to exercise the placeholder flow and Pocket during allowed phases;
- additive migration only; do not rewrite 001–006;
- preserve existing entry paths and reconnect tokens;
- static checks plus live E2E for three-player gates, privacy, reconnect, route/fold-back, puzzle, ACT 4–5 vote semantics, override safety, RLS, and independent-run isolation;
- rerun Sprint 1 40-check, Sprint 2 23-check, and Sprint 3A 15-check regressions after deployment;
- physical four-device classroom verification remains NOT VERIFIED unless actually performed.

EXPLICITLY OUT OF SCOPE:
- ACT 6–14;
- Asset Manager V2, Supabase Storage publication, or ACTIVE promotion;
- new visual generation or approval;
- broad production-quality visual polish;
- audio climax or audio asset workflow;
- final export/session finalization;
- Agent/behavior analysis or prediction;
- arbitrary Teacher scene jumping;
- changes to canonical Dutch/Chinese wording;
- full Sprint 3 completion claim before audit.

PROPOSED MIGRATION:
- database/007_sprint3b_act1_5_placeholder_flow.sql

PROPOSED ACCEPTANCE CHECKPOINTS:
- server rejects illegal phase/scene transition and arbitrary client identities;
- ACT 1 and ACT 2 private choices remain private before their specified reveal;
- all three-player gates survive reconnect and concurrent submissions;
- ACT 2 final result, current route, fold-back route, and wayfinding state remain semantically distinct;
- failed rendezvous occurs before party reunion;
- all three FOLLOW SIGN actions are required before party_physically_reunited;
- Library attempts/hints/group rewards are idempotent and run-isolated;
- ACT 4 private stance is not overwritten by ACT 5 group result;
- ACT 5 player outcomes and system fallback retain the accepted resolution semantics;
- Teacher override cannot impersonate a player or supply arbitrary destinations/results;
- existing Sprint 1/2/3A suites remain PASS.

DESIGN INTERPRETATION REQUESTS:
1. Is this slice still sufficiently narrow, or should Teacher deblock be separated into Sprint 3C?
2. May the ACT 1–5 implementation use canonical text_key content with safe visual placeholders while leaving production asset resolution to Sprint 4?
3. Should the ACT 3 puzzle timeout be modeled now as a server deadline, or is deterministic attempt-based progressive fallback sufficient for this placeholder slice?
4. Does CA require a separate GA sign-off before implementation, given that this proposal applies existing V4.0 rules without changing narrative or gameplay semantics?

REQUESTED ACTION:
Please review the Sprint 3B boundary and return READY_FOR_IMPLEMENTATION with conditions, or narrow/correct the scope before CD writes migration 007 or production code.

COMMIT/WRITE STATUS: SPRINT3B_SCOPE_PROPOSED
