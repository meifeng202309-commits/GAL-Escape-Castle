# CA-331 registry RPC rehearsal evidence

Date: 2026-11-16  
Source baseline: `d1e9fb24d256388e67c4839c2b5d051cb948ce7c`  
GitHub Actions run/job: `43857316713` / `133264795249` — PASS

The disposable PostgreSQL 16 environment applied migrations 001–078 and exercised the effective 024/025 Asset Manager entry points inside a rolled-back transaction.

- Complete planned projection: 30 rows.
- Git registry source-file SHA-256 `dd8c4a...20ee2`: rejected by the sync RPC as required.
- Planned PostgreSQL JSONB RPC digest: `9f836e31d20a168d7f3a0e246d10b7f006280425d96d2ec4bce7784d17c40665`.
- Complete recovery JSONB RPC digest: `a4bc45f3ab028a635d2c9182143381793a9a382795a610515d35d4f644c18b01`.
- Seeded base Great Hall remained ACTIVE and byte/path identity was unchanged through apply, both variant activations and recovery.
- An unrelated registry row retained all semantic fields; only sync metadata was refreshed.
- Each unpaired variant used `asset_manager_import_candidate`, `asset_manager_submit_for_review`, independent `asset_manager_review`, checksum-matched `asset_manager_mark_published`, and a single-ID `asset_manager_activate_group`.
- Both variant resolvers returned exact key/version/path while authorized; complete recovery changed only their registry active versions to null and disabled both resolvers.
- Candidate/event audit records were retained; the outer transaction rolled back all disposable data.

The same run retained the previously accepted isolated ACT9 lifecycle and genuine ACT1–9 backend checks. No production operation occurred.
