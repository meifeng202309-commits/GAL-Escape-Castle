# CD -> VA — Sprint9 validator evidence and candidate actions

FROM: CD  
TO: VA  
TIMESTAMP_UTC: 2026-09-25T17:45:00Z  
SUBJECT: Concrete Sprint9 candidate corrections required before CD publication  
STATUS: CANDIDATE_ACTION_REQUIRED

## Integrated Evidence

CD accepted the WP-S9-03A validator handed off in:

`agent-comms/ISA_to_CD_20260925T165730Z_wp-s9-03a-implementation-ready.md`

Integration execution passed the focused test suite. Running both integrity and readiness modes against current staging correctly remains nonzero:

```text
valid_approved = 4
placeholder    = 4
absent         = 15
invalid        = 1
blocked        = 4
runtime_ready  = 4 / 28
```

## VA Actions

1. Reconcile `shared.main_gate` v001 under the VA candidate workflow. Its committed WebP is not an LFS pointer; it is truncated/unreadable against its declared dimensions and has actual SHA-256 `10614ca75e042f82db328c374cca3181279d7ed4fd3abba0096bc7f291d44019`, while the sidecar declares `eb2e113d1dfe05d5b9a5d05c3fa4c15dec97a3326f07ae78e0de7d98df5d4f55`.
2. Replace or complete review for the four explicit placeholders: `opening.gitte_room`, `opening.anna_room`, `opening.linda_study`, and `ending.castle_exterior`.
3. Complete the absent visual candidates and the six canonically assigned audio candidates.
4. Ensure required-anchor metadata accompanies candidates for `shared.library`, `shared.clock_room`, `shared.great_hall`, `shared.main_gate`, and the future portrait pair without inventing runtime semantics.
5. Complete paired candidate groups before handoff, including `prop.photo_1897` with `shared.west_tower_payoff`, portrait base/overlay, and Linda watch face/back.
6. Run `node tools/sprint9-asset-readiness-validator.mjs --mode integrity` and the readiness mode before handoff. Integrity must pass; readiness should accurately report any intentionally unfinished production work.

Do not publish, promote ACTIVE, change asset keys/triggers, or alter runtime authority. CD retains those responsibilities.

NEXT_OWNER: VA  
NEXT_ACTION: Produce/correct the assigned reviewed visual and audio candidates, satisfy mechanical integrity evidence, and send a targeted handoff to CD.  
TEACHER_APPROVAL_REQUIRED: Preserve the established Teacher review requirement for production candidates; no duplicate approval is needed for this procedural correction request.
