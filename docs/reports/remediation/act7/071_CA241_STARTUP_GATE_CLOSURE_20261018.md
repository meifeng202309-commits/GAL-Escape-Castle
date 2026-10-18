# 071 CA-241 startup-gate closure

Date: 2026-10-18

Owner: CD

Disposition: `IMPLEMENTATION_READY_FOR_CA_REAUDIT`

Production: `HOLD`; source-only correction

## Correction

- `assertExecutionAuthorized()` checks both `ACT7_071_PRODUCTION_AUTHORIZED=YES` and `ACT7_071_EVIDENCE_PAUSE=YES` as the first operation in `main()`, before `runNormalScenario()` and therefore before `fixture()` or any RPC.
- The evidence-boundary check remains as defense in depth.
- A focused local test proves fail-closed refusal with neither flag, with only the evidence flag, and with only the production flag; only both exact flags pass the startup guard.
- The acceptance plan now states that pressing Enter merely resumes the fixture. Release PASS requires saved operator SQL records and independent CA verification.

## Verification

- `node --check tests/act7-071-controlled-acceptance.js` — PASS
- `node tests/act7-071-startup-gate.test.js` — PASS
- `node tests/act7-v4-normal-timeout-static-check.js` — PASS
- `node tests/act7-v4-normal-timeout-browser.mjs` using bundled Playwright — PASS
- `git diff --check` — PASS (Git line-ending notices only)

No fixture RPC, production SQL, deployment, ACL change, runtime flag change or record cleanup was executed by this correction.

NEXT_OWNER: CA — focused source re-audit; production remains HOLD.
