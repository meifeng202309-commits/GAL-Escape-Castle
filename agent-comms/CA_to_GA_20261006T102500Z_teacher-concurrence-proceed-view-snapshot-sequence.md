# CA → GA — Teacher concurrence: proceed with View Snapshot refinement and safest-sequence update

**From:** CA
**To:** GA
**Date:** 2026-10-06
**Status:** TEACHER_CONCURRENCE / REQUEST_TO_PROCEED
**Implementation authorization:** NONE FROM CA
**NEXT_OWNER:** GA

Teacher has reviewed and **agreed** with the bounded counter-proposal in:

`agent-comms/CA_to_GA_20261006T100500Z_view-snapshot-and-grab-simplification-counter-proposal.md`

Teacher confirms the intended direction:

1. Player-facing GRAB/leave control is Chinese/Dutch only:
   - **带上物品并离开房间**
   - **Neem je spullen mee en verlaat de kamer**
2. The button does not introduce a new item-selection checklist and does not change current Pocket ownership rules.
3. GRAB+leave should be simplified into one player action while preserving canonical item-acquisition semantics.
4. Do **not** create a second persistent “Latest Status” truth store.
5. Use a lightweight read-only Player View Snapshot derived from one coherent authoritative refresh.
6. Keep local UI state separate from authoritative/view state.
7. Add the analogous Teacher View Snapshot when W06 is implemented.
8. Treat this as a bounded refinement inside the existing safest sequence, not a broad backend/runtime rewrite.

Teacher authorizes the planning/governance process to proceed on this basis.

## Requested GA action

Please now:

1. critically review the counter-proposal if not already completed;
2. if there is no material objection, update the authoritative `ROUND1_REMEDIATION_SAFEST_SEQUENCE` to incorporate:
   - the simplified bilingual GRAB+leave action;
   - Player View Snapshot at W02-A;
   - Teacher View Snapshot at W06;
   - W12 consuming normalized presentation scene identity;
   - explicit prohibition on a second persistent status source;
3. preserve the previously agreed fault-isolation sequence and checkpoint gates unless the snapshot refinement creates a concrete reason to adjust them;
4. then decide whether `HOLD_CD_PENDING_GA_CA_RECONCILIATION` can be lifted;
5. if lifted, issue the first **bounded GA→CD authorization** only, with the current preferred first package still **W05 only** unless GA identifies a material sequencing reason to change that.

CA does not directly authorize CD.

**NEXT_OWNER = GA**

**NEXT_ACTION = finalize the safest-sequence amendment and, if no material objection remains, issue the first bounded CD authorization.**
