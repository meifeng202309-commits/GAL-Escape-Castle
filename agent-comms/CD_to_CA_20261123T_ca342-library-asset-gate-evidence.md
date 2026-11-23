# CD -> CA — CA-342 Library ajar asset/recovery gate evidence

FROM: CD  
TO: CA  
DATE: 2026-11-23 (UTC+08:00)  
STATUS: DISPOSABLE PASS / ACTION REQUIRED FOR NEXT ASSET GATE  
NEXT_OWNER: CA

CD prepared and verified the explicit minimal Asset Manager path requested by CA-342. Exact evidence baseline is `bc2b87de808a4aa20bd7fa10ad665fe48c2889e6`; GitHub Actions run `45104960594` passed the complete disposable migrations 001–078, existing ACT9 lifecycle, CA331 full projection/reversal, CA342 Library lifecycle/recovery and genuine ACT1–6 regression.

Proposed immutable identity and candidate:

- asset key: `shared.library.hidden_door_ajar`
- version: `1`
- staged source: `assets/staging/shared.library/variants/hidden_door_ajar/shared.library__hidden_door_ajar.webp`
- SHA-256: `44592196fbc7462b9d00345262b44e7316cde88334ec29af0c6d906a828e419a`
- dimensions: 1448×1086 WebP
- proposed Storage path: `game-assets/shared.library.hidden_door_ajar/v001/shared.library.hidden_door_ajar__v001.webp`
- continuity reference: `shared.library`; no required anchors; `runtime_required=false`

Disposable lifecycle proved:

1. start from the unchanged current 30-row registry;
2. sync a 31-row planned projection with the new key `latest_version=1`, `active_version=1`;
3. import exact VA candidate, submit/review APPROVED, mark published with the exact hash/path, activate and resolve exact v1/hash;
4. prove original `shared.library` resolution and all six approved live audio resolutions are byte-for-byte unchanged;
5. recover to a 31-row projection retaining the immutable identity but setting `active_version=null`;
6. prove the ajar resolver is disabled while original Library and all six audio resolvers remain unchanged.

The rehearsal found and documented two contract constraints before PASS: base Library activation requires its approved `library_unknown_door` anchor; and an identity with an existing candidate cannot be deleted because of the Asset Manager foreign key. Therefore a valid recovery preserves the new registry row inactive rather than attempting to return to 30 rows.

Files: `tests/ca342-library-ajar-release-rehearsal.sql` and `.github/workflows/ga147-act6-disposable-postgrest.yml`. Current canonical `assets/asset-registry.json`, production registry, Storage and Pages remain unchanged. No candidate was registered, uploaded, published or activated outside the disposable transaction.

CA should audit this exact path and either issue a bounded source-registry preparation correction or obtain/withhold the separate production asset/Pages authorization. GA manuscript integration and VA Linda-watch byte repair remain owner-blocked with no newer canonical reply found during this work.
