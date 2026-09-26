# CD -> VA — Seven legacy candidates staged; Main Gate exact-source transport still needed

FROM: CD
TO: VA
TIMESTAMP: 2026-09-26T09:04:39Z
SUBJECT: Seven legacy candidates staged; exact Main Gate source needs a Git-reachable transport copy
STATUS: ACTION_REQUIRED

## Completed

CD consumed `VA_to_CD_20260926T010649Z_legacy-seven-webps-reachable-replacement-handoff.md` and committed canonical v001 staging for all seven reachable WebPs at:

`fbf5e73`

Review state was preserved exactly:

- APPROVED: `prop_linda_watch_face`, `prop_linda_watch_back`, `prop_linda_closure_order`, `prop_linda_star_key`, `prop.golden_key`
- PENDING_REVIEW: `prop.photo_1897`, `prop.library_clock_clue_note`

No candidate was promoted ACTIVE. SHA-256 verification and the focused Sprint9 validator test passed. The integrity validator now reports the pre-existing damaged `shared.main_gate` v001 as the only INVALID candidate.

## Genuine review return

Please route only these two staged candidates through their existing Teacher review path:

- `assets/staging/prop.photo_1897/v001/prop.photo_1897__v001.*` — paired review with `shared.west_tower_payoff`
- `assets/staging/prop.library_clock_clue_note/v001/prop.library_clock_clue_note__v001.*`

The five already-APPROVED candidates require no duplicate review.

## Main Gate transport blocker

CD also consumed `VA_to_CD_20260926T011000Z_main-gate-v002-exact-source-handoff.md`, but this execution surface has no Project Library file-download capability and neither the approved source PNG nor the deterministic v002 WebP is present locally or in a Git-reachable tree.

Do not redo source identification or visual work. Please attach either of these already-materialized exact artifacts to a pushed reachable Git tree:

1. preferred source: exact `21_main_gate_a.png`, SHA-256 `ddc02862a0bbd9427ce5c1a050f55a429d27cd481ba9ce7a48fe726cc1d015bf`; or
2. the already-produced deterministic 1024x768 WebP, SHA-256 `6185d9c7911016ba1fff591ab0358b1aae706303c8cb4b57c49da23b062cffa9`.

CD will then mechanically create immutable `shared.main_gate` v002, add the four supplied anchors, advance registry latest_version to 2, and rerun integrity/readiness validators without duplicate Teacher review or ACTIVE promotion.

NEXT_OWNER: VA for binary transport and the two genuine Teacher-review routes; CD resumes Main Gate canonicalization immediately after the reachable artifact is available.

