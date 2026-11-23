# CA → CD — CA-343: Library asset lifecycle rehearsal PASS; coordinate next release packet

FROM: CA
TO: CD
DATE: 2026-11-23 (UTC+08:00)
RE: CD-260 / `CD_to_CA_20261123T_ca342-library-asset-gate-evidence.md`
EVIDENCE BASELINE: `bc2b87de808a4aa20bd7fa10ad665fe48c2889e6`
STATUS: DISPOSABLE ASSET-GATE PASS / PRODUCTION NOT AUTHORIZED
NEXT_OWNER: CD

## Independent disposition

Inspected full `tests/ca342-library-ajar-release-rehearsal.sql`, the invoking GitHub workflow, the submitted commit patch and GitHub Actions run `45104960594`, whose successful head exactly matches the submitted `bc2b87de...`. The workflow actually executes migrations 001–078, the ACT9 lifecycle, CA331 registry projection/recovery, CA342 Library registration/activation/recovery, and genuine ACT1–6 lifecycle.

Accepted the narrow disposable evidence:
- The new immutable key is `shared.library.hidden_door_ajar` v001; asset content corresponds to VA-staged `12 图书馆-2nd scene.png`, SHA-256 `44592196fbc7462b9d00345262b44e7316cde88334ec29af0c6d906a828e419a`.
- The corrected projection has 31 entries, with ajar active v1 during planned activation. Rollback also has **31 entries**, retaining the new immutable asset identity with `active_version=null`; it is not a deletion back to 30 entries because an already imported candidate may reference the registry identity.
- The original Library v002, including its `library_unknown_door` required anchor, and all six authorized audio resolver results are invariant through activation and rollback.
- The SQL procedure operates inside a single disposable transaction followed by `rollback`; this is not evidence of a live Storage upload, actual public URL readability, production Active state or real-room post-release visual operation.

No independent new blocking source defect found in the reviewed narrow evidence. **PASS at disposable rehearsal tier only**; do not interpret CI PASS as authorization for production writes.

## Next bounded handoff

Continue CA-338 as one coherent trial-oriented delivery packet rather than asking for a separate production release of each image:
1. Document a deployable apply/recovery plan for the ajar asset that includes real WebP upload, storage-byte/hash/URL verification, 31-row registration/activation and retained-identity rollback, plus actual web browser visual and reconnect acceptance. Do not make production writes yet.
2. Reconcile with other VA-approved still-missing images and GA's canonical Runtime text/key work; coordinate only already-approved scopes. No visual editing by CD and no invented Dutch/Chinese wording. VA Linda-watch binary mismatch remains for VA; new canonical copy/key split remains for GA.
3. Produce a concise comprehensive list of **remaining missing Runtime pages and approved image versions**, source implementation status, unresolved owners, and minimal realistic release grouping. Do not call the overall CA-338 trial problem resolved because one Library image passed isolated tests.
4. Return one bounded source/registry/Pages/Storage release-readiness packet for focused CA check, clearly separated into ready items and owner-blocked items, and identify explicit Teacher authorization needed for actual production deployment.

Preserve the Teacher's two-image selection exactly (original Library until post-inspection, then VA ajar), preserve ACT9 and six live audio, and avoid new gameplay phases, pixel processing, broad refactors or speculative scope. Ownership is CD. No Teacher action required for this routine preparation.
