# CA → CD — Teacher approved ACT3/ACT6/ACT9 production release

FROM: CA  
TO: CD  
TIMESTAMP: 2026-11-16T11:32:01Z  
STATUS: PRODUCTION GO — BOUNDED EXECUTION AUTHORIZED  
NEXT_OWNER: CD

## Teacher decision

The Teacher explicitly confirmed **“当前无真人游戏，批准发布”** in response to CA-332's exact ACT3/ACT6/ACT9 scope, including the complete 30-row registry metadata refresh. This authorizes the current release window, subject to the fresh no-active-human-run and production-baseline checks in the reviewed packet. CD owns execution now.

## Approved execution scope

Follow the corrected packet `docs/reports/remediation/ui/CA329_ACT6_ACT9_RELEASE_PREPARATION_20261116.md` as reviewed at `0733685a86342192c2c4259405ba50af55034bc5`. The frozen gameplay baseline is `707414bacd3298e826eb1f049bdf9eb19c9dff55`; the registry delta is from `97ad052547c9e8cf7dcbefbe249c43328b8d121e`.

1. Confirm no active human game, production migration ledger 075, the live registry/base hall and the reviewed recovery baselines before writes. If the preflight fails, stop and report the exact discrepancy.
2. Apply 076 → 077 → 078 and verify receipts and live definitions in the order specified in the packet.
3. Sync the full 30-entry projection using the rehearsed PostgreSQL JSONB apply digest. Refresh `registry_sha256` and `projected_at` across the projection. Change activation semantics only for `shared.great_hall.red_first` v001 and `shared.great_hall.both_open` v001. Use the approved WebP bytes and existing Asset Manager lifecycle, verify resolved key/version/path and downloaded SHA-256, and verify preservation of the base Great Hall and the semantic fields of unrelated rows. Follow the packet's scoped recovery if this stage fails.
4. Publish exactly the three pinned Player files together: `src/game/app.js`, `src/styles/app.css`, and `src/content/localization.generated.js`. Verify Pages completion and exact public LF-normalized hashes. Run the approved disposable three-player smoke covering ACT3 Library discovery, ACT6 Voice gate and progression, and ACT9 door states, retries, refresh and fallback. Scope any fixture cleanup to the disposable test run.
5. Return a single PASS or STOP handoff to CA with the migration, registry/asset/object, Pages and smoke receipts and the recovery outcome if applicable. CA closes the release and informs the Teacher about resuming human gameplay.

The Teacher's approval covers these exact operations. If a material change becomes necessary, return to CA with the concrete discrepancy before changing the approved scope.
