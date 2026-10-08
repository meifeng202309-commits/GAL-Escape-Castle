# Authority pre-freeze deployed evidence — execution context

- Authorization: `agent-comms/CA_to_CD_20261007T142500Z_bounded-deployed-authority-evidence-acquisition.md`
- Fixed primary query source: `docs/plans/authority-field-audit-v2/AUTHORITY_PREFREEZE_READONLY_PROBES_V1.0.sql`
- Deployed provider: Supabase
- Project reference: `qdcbdcjobzytzhnhfwyn`
- Project label: `GAL's Castle Escape`
- Branch/environment shown by Supabase: `main` / `PRODUCTION`
- Execution window (UTC): `2026-10-07T15:00:27Z` through `2026-10-08T02:35:06Z`
- Executed by: CD — Code Development Agent
- Repository comparison branch: `remediation/sprint9-structural-v1`
- Repository comparison HEAD: `27faa786f634acbfb6ea6683a204513c92cf5b51`
- Semantic comparison baseline: `docs/plans/ROUND1_CANONICAL_AUTHORITY_REGISTRY_V0.3_FREEZE_CANDIDATE.md`
- Repository-last-definition source: `docs/plans/authority-field-audit-v2/phase2/SQL_LAST_DECLARATION_SNAPSHOT_V1.0.json`

## Safety declaration

**NO DATABASE MUTATION PERFORMED.**

Every database statement executed for this package was a `SELECT`. No `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `CREATE`, `CREATE OR REPLACE`, `DROP`, `GRANT`, `REVOKE`, migration, mutating RPC, normalization, cleanup, repair, or remediation statement was executed.

**NO REMEDIATION PERFORMED.**

The SQL Editor was configured with `No limit` before the high-row-count probes were captured. Complete CSV exports were used where Supabase's virtualized results grid could otherwise hide rows or right-side columns.

## Evidence layout

- `RAW_QUERY_OUTPUT.md`: exact query text followed by exact raw CSV output for each probe.
- `TECHNICAL_DECLARATIONS.csv`: bounded objective declarations and interpretations using CA's authorized vocabulary.
- `RAW_FILE_MANIFEST.csv`: byte length, SHA-256, and capture/write timestamp for every raw CSV.
- `raw/`: unmodified CSV capture for each primary or authorized supplemental probe.

The timestamps in `RAW_FILE_MANIFEST.csv` are the per-capture/write UTC timestamps. A1 and B4 were captured on 2026-10-07; the remaining captures were completed on 2026-10-08 after the browser session was resumed. No cross-probe snapshot-isolation claim is made.

## Function-body comparison method

For A3, each deployed `pg_get_functiondef` body was compared with the repository-last definition identified by `SQL_LAST_DECLARATION_SNAPSHOT_V1.0.json`. The comparison removed SQL whitespace only outside single-quoted literals and preserved all literal contents and non-whitespace tokens. All ten deployed bodies matched their repository-last bodies under that formatting-insensitive, literal-preserving comparison.
