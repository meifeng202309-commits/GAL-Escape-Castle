# GA147 canonical-copy source integration evidence

## Result

CD completed the bounded source-only caller integration authorized by `CA_to_CD_20261114T153000Z_ga147-canonical-copy-source-integration-gate.md`.

- Implementation baseline: `d9ba744763a773b66df6555ab96553cc89ab16cc`
- Catalog-owner provenance: GA catalog `9df1e81a622abc7d751b8f46dab2e173c70e1be2`; generated localization `788ed5abeecddedf2e19874b6c57668c1fbfffe8`
- Production/database deployment: **NOT PERFORMED / NOT AUTHORIZED**
- Migration 076 merge/deploy: **NOT PERFORMED**
- Protected catalog/localization edits by CD: **NONE**

## Exact integration

1. Anna `check_phone` now projects `act01-a.014`, unchanged shared `act01-g.005`, then `act01-a.014b`.
2. Migration 077 adds durable per-run/per-Player `castle_voice_heard_at` and ACT6 acknowledgement state. Gitte is marked heard when ACT1 flow initializes; Anna and Linda remain unheard until their ACT6 acknowledgement. The projection selects `runtime.castle_voice.first_audible` versus `runtime.castle_voice.returning` from that durable state.
3. The acknowledgement RPC locks and checks the active run identity and ACT6 phase, is retry-safe, and rejects missing Player progress. No SMS/UNKNOWN SENDER caller mutates audible-voice state.
4. The failed ACT2 Main Gate `route_consequence` caller alone renders `act02.043`, `act02.044`, `act02.045` in order.
5. ACT6 keeps shared `act06.001` after the role-specific Voice introduction; the introduction is explicitly acknowledged and does not redisplay after reconnect.

## Validation

PASS:

- `node --check src/game/app.js`
- `node tests/ga147-canonical-copy-integration-static-check.js`
- `node tests/teacher-trial-20261113-p1-static-check.js`
- `node tests/v4-player-integration-static-check.js`
- `node tests/v4-two-scene-pilot-static-check.js`
- `git diff --check`

Authored but NOT RUN:

- `tests/ga147-canonical-copy-integration-transaction.sql`: requires an equipped disposable PostgreSQL/Supabase test environment. It checks the three role boundaries, Anna key order, first/returning Voice classification, durable acknowledgement, retry behavior, and stale-run rejection.
- Focused browser acceptance requested by CA remains **NOT VERIFIED** in this local environment because Playwright is unavailable. CA should run the source baseline in an equipped nonproduction environment before any release decision.

## Preserved boundaries

- No production release, migration application, image activation, registry mutation, or Pages change.
- No broad manuscript adoption or protected canonical-source mutation.
- ACT3 migration 076 remains under CA audit and is not merged/deployed by this work.
- ACT14 locked semantics and all unrelated runtime callers remain unchanged.

## Handoff

Next owner is CA for independent source audit and equipped nonproduction transaction/browser qualification. The implementation closure condition for CD's authorized source-only scope is met; release authority is not implied.
