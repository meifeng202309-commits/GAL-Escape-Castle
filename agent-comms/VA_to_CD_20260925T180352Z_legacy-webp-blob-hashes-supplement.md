# VA -> CD — Supplemental legacy WebP Git-blob hashes

FROM: VA
TO: CD
TIMESTAMP_UTC: 2026-09-25T18:03:52Z
SUBJECT: Reusable Git blobs now exist for seven recovered legacy visual candidates
STATUS: SUPPLEMENTAL_HANDOFF / NEXT_OWNER_CD

This supplements:

`agent-comms/VA_to_CD_20260925T175207Z_legacy-visual-binary-ingestion-handoff.md`

After that ownership handoff, VA found a working transport path and created Git blobs for seven recovered legacy candidates. They are currently dangling Git objects (not yet attached to the repository tree), so CD may reuse these blob SHAs directly when performing the already-assigned mechanical staging step.

No visual semantics, asset identity, Teacher state, ACTIVE state, or runtime authority changes here.

| asset_key | candidate | dimensions | WebP SHA-256 | Git blob SHA | review state |
|---|---|---:|---|---|---|
| `prop_linda_watch_face` | v001 | 448x613 | `362d91f5423515a9906f6f08eed3c7d0bc4f6ed188e24b49e46d63fe44ec182a` | `e3c3d88020a52f62cdb73c87a33f64d203fc9e67` | APPROVED |
| `prop_linda_watch_back` | v001 | 792x1024 | `744cfff64a84cdeb86bc274ba0cf8bd78d30dc6c1ad4e9508cba8fb69be5bce8` | `6a9b31a2f24544518d96371e1ae19770e771a0ad` | APPROVED |
| `prop_linda_closure_order` | v001 | 1023x1024 | `f2ee8acd24d795b03ea4f8828f38e7e2887437744c22bea607f231e2bf9b02f3` | `01681b17f69417bc4b5aaf3e70f371376404109e` | APPROVED |
| `prop_linda_star_key` | v001 | 1024x768 | `63beeac34468b32db1c74b76f78e53fe1dd95ac7d719eedbc19f32b93497677f` | `8372ee63ae48b59818b487feaefbfe7625dad066` | APPROVED |
| `prop.photo_1897` | v001 | 1024x648 | `6d3c5b7fa95c0bbbc35e041e9ceb4dce0abf0dc26ce78b609bea39c708f4dd55` | `301f0a7079c65b3a5a2ac257a7a6338d662ef809` | PENDING_REVIEW |
| `prop.library_clock_clue_note` | v001 | 1024x768 | `844a7b60e71b66e0aaecc0421f50354d6a1899ce8085eb605a9a5252e5e890eb` | `1219cd5c6feb9fdb2d1382f13dba70bd024f25ea` | PENDING_REVIEW |
| `prop.golden_key` | v001 | 1024x768 | `64051ae487c480b35def8099f1f5b3d4a5e0edb8805471897ae637cc58a47ac8` | `51053f13ad73c5547b30b8b8f72ebb2e340e3154` | APPROVED |

All seven are mechanical WebP conversions from the recovered source bytes recorded in the prior handoff; no content redesign was performed.

The Main Gate blob created during transport experimentation is intentionally **not** offered here because the prior handoff already fixes the source identity for the Main Gate integrity repair. Follow that handoff for Main Gate rather than substituting an exploratory blob.

NEXT_OWNER: CD

NEXT_ACTION: reuse these blobs if useful while completing the already-transferred staging/sidecar/Registry/validator work. Return only the genuinely PENDING_REVIEW candidates to VA/Teacher review under the existing workflow.
