# Trial 6 ACT1 vote routing source fix

Date: 2026-10-29  
Authorization: `CA_to_CD_20261029T183000Z_authorize-act1-vote-client-routing-source-fix.md`  
Disposition: source and test package only; no production release

## Product change

Only two production lines changed in `src/game/app.js`:

- line 242: `commitPlayerFrame()` now derives `currentSprint5State` atomically from the latest confirmed active frame and clears it for every non-S5 or lifecycle frame;
- line 975: `stopPolling()` clears `currentSprint5State`, covering leave, join/session replacement and explicit polling invalidation.

The S2/S5 RPC names, arguments, request-identity behavior and server stale-identity guards are unchanged. No database, migration, Storage, live room, Teacher code, Scene, Runtime or Pocket source changed.

## Permanent regression

`tests/trial6-act1-vote-stale-identity-browser.mjs` now serves the repository product source directly; it no longer performs the earlier in-memory candidate transform.

The regression proves:

1. A confirmed Sprint5 frame routes message and vote to `s5_send_message` and `s5_submit_vote` with the Sprint5 discussion identity and request UUIDs.
2. `stopPolling()` clears lifecycle routing ownership.
3. A subsequent confirmed ACT1/S2 frame routes only to `s2_submit_vote` with its own discussion identity.
4. A synthetic lost response after the server commits Anna's vote re-enables retry; the retry is accepted as the existing vote, produces one unique Anna decision, and moves the Teacher projection from 2/3 to 3/3.
5. No ACT1 retry is sent to `s5_submit_vote`.

Evidence: `docs/reports/remediation/ui/trial6-act1-vote/TRIAL6_ACT1_VOTE_BROWSER_EVIDENCE.json`.

## Regression results

- `node tests/a1-player-polling-static-check.js` — PASS
- `node tests/sprint2-static-check.js` — PASS
- `node tests/v4-player-integration-static-check.js` — PASS
- `tests/trial6-act1-vote-stale-identity-browser.mjs` — PASS
- `tests/v4-player-integrated-runtime-browser.mjs` — PASS: three roles, ACT6/8 image cycle, ACT9 Runtime scroll stability, ACT10 discussion, ACT3 Pocket inspect/flip and five decoded later-item media.
- `tests/trial45-p2p6-browser.mjs` — PASS: three roles at both viewports, selected Pocket media, pre-run isolation, tie lifecycle and Teacher layout gate.
- `git diff --check` — PASS

Generated P7 screenshots/timestamp evidence were restored after the successful run so the narrow package contains no unrelated binary churn.

## Release boundary

No production deployment is authorized or performed. CA must audit this package and issue a separate production-release authorization before any release action.

