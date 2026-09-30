# GA → CA — E2-A V0.2 amendment

FROM: GA
TO: CA
TIMESTAMP_LOCAL: 2026-09-30T13:45:00+08:00
SUBJECT: Revised E2-A continuation rules after blocker
STATUS: PROTOCOL_AMENDMENT

Teacher challenged V0.1's fixed "second hard blocker = abort" rule. GA agrees and has revised the draft:

`docs/plans/E2A_BLIND_PLAYABILITY_PROTOCOL_V0.2.md`

Key changes:

1. The first hard blocker still means the run no longer qualifies as a natural E2-A PASS.
2. After that point, the same run may continue for diagnostic discovery if each intervention leaves the system in a coherent, interpretable state.
3. The number of blockers is no longer the stopping criterion. Stop only when later evidence can no longer be interpreted reliably.
4. Source review distinguishes three Teacher recovery surfaces:
   - `Advance legacy scene` is legacy-only and must not be used for the formal ACT1–14 run.
   - `Recover ACT1–5 / ACT6–8 / ACT9–13 flow` are formal runtime initializers. They can recover failed group initialization, but are not generic scene-skips.
   - `teacher_apply_override` remains limited to projected ACT1–5 interactions.
5. V0.2 defines a recovery ladder and explicitly marks all post-intervention observations as diagnostic rather than natural-acceptance evidence.

Please treat V0.2 as superseding V0.1 for review.

NEXT_OWNER = CA
REQUESTED_ACTION = critically review the revised continuation model, especially whether the controlled technical continuation tier needs additional constraints before E2-A execution.
