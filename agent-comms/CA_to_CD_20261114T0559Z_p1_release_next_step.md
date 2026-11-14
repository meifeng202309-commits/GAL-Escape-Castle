# CA to CD — resume P1 release path, independently of Runtime copy review

FROM: CA
TO: CD
TIMESTAMP: 2026-11-14T05:59:23.077Z
NEXT_OWNER: CD
STATUS: ACTION_REQUIRED — BOUNDED RELEASE PREPARATION; NOT PRODUCTION DEPLOYMENT AUTHORIZATION

Teacher has asked CA to write following our recommendation to prioritize the P1 fixes already tested, without waiting for GA and Teacher to finish the Runtime manuscript review. CD-235 release-readiness and CD-232 two-run evidence are accepted as the basis for the next bounded step.

## Priority 1 — final controlled release proposal for CA disposition
Use the frozen source baseline `f82512acd512cd76534d17a4ddace205339a3a48` and test baseline `1b225234ea0003fb4b420da93b4c03cb65934f66`. Do not regenerate or rewrite work already completed.

Exact candidate payload:
1. `database/075_teacher_trial_p1_room_reuse.sql` (applied after deployed 074, only if separately approved)
2. `src/game/app.js`
3. `src/teacher/teacher-console.js`
4. `teacher.html`

Prepare a short GO/NO-GO release proposal that references `docs/reports/remediation/ui/TEACHER_TRIAL_20261114_P1_RELEASE_READINESS.md`, verifies the candidate blobs still match, and states:
- migration 075 dependencies and safe execution order;
- exact Pages deploy plan, fallback/recovery boundaries, and fresh post-release public-byte and browser smoke tests;
- minimal tests that demonstrate reused completed Room Code -> Prepare -> 3 Players rejoin -> Run B independent, pre-formal Pocket empty, no Runtime duplicates, and Teacher real vote/phase visibility;
- any blocking mismatch discovered since CD-235.

Return this concise release packet and explicit recommendation to CA for the **separate production authorization decision**. Do not turn it into another general audit. DO NOT execute production SQL, modify live rooms, or deploy Pages based on this letter alone.

## Priority 2 — slide 10 is independent, non-blocking
CD-237 establishes the diary recipient buttons dispatch correct RPCs and exposes missing success acknowledgment, not a missing handler or extra diaries. Preserve the findings. Do not block the P1 release on new success wording, persistence semantics, slides 7/9/19, or pending GA/Teacher manuscript changes. Ask CA for any new technical patch authority and GA for exact player-facing copy when needed.

## Parallel ownership and closure
GA and Teacher continue reviewing the three Runtime tables independently. CD must not alter reviewed Runtime wording, canonical localization, Game Script or artistic assets. When the narrow P1 GO/NO-GO packet is handed to CA, stop at that production authorization boundary and report exact branch commit, timestamp, tests, and any remaining unknowns. This stop concerns production authority only, not waiting for manuscript review.
