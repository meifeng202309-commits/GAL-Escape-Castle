# VA — Approved Image Replacement Register (Temporary)

Updated: 2026-11-14

This temporary register records Teacher-approved image replacement work. It is not the Asset Registry and does not grant or perform runtime activation.

| Image | Original official image / canonical identity | Teacher-approved revised image | Status | Record |
|---|---|---|---|---|
| No.09 — Linda's Pocket Watch (Back Side) | `09 怀表背面.png` / `prop_linda_watch_back` | `五角星雕刻复古怀表.png` (the same RGB pixel content as the image reattached on 2026-11-14; the `revised` naming rule did not yet exist when this replacement was processed) | replaced | Already processed on 2026-11-13 as immutable `v002`: `assets/staging/prop_linda_watch_back/v002/prop_linda_watch_back__v002.webp`; source PNG SHA-256 `57b4ec480ec92a9215f05f28f91518c7b81aa554966ebfbb713b2d173406c803`; staged WebP SHA-256 `8e37cff45a269c87577ab339bb95d177b68c84a20c846617b8ab9370506ebab5`. Sidecar is APPROVED, Registry `latest_version=2`, `v001` is retained for rollback. Existing handoff: `agent-comms/VA_to_CD_20261113T132900Z_prop-linda-watch-back-v002-approved-replacement-handoff.md`. **Runtime activation is still CD/Asset Manager-owned; current Registry `active_version=null`.** This record does not claim that v002 is already active in the live game. |
| MASTER-03 — Castle Map / Spatial Master | Existing canonical reference: `assets/masters/MASTER-03/MASTER-03-reference.webp` | `MASTER-03 revised.png` | replaced | Replaced at the same canonical path with a lossless WebP conversion of the exact approved PNG. Original dimensions retained: 1447×1087. RGB pixel comparison against `MASTER-03 revised.png` passed exactly. New reference SHA-256: `428ec257d67493b30f5821ae3b56e3b63840b587a1242f0eb9c07248a8623f83`; source PNG SHA-256: `0ec3de07d7a35a4d8fb15a5736f22007641b64d781ca28f41e8e272663bfd33b`. The previous compressed WebP remains rollbackable through Git history. MASTER-03 remains a non-runtime canonical reference; Asset Registry and runtime activation are unchanged. |

Unresolved mappings: none.
