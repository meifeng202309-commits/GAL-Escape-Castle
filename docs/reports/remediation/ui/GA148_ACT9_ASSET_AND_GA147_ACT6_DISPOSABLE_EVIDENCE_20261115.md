# GA-148 ACT9 asset binding + GA-147 ACT6 disposable evidence

Date: 2026-11-15  
Owner: CD  
Authorized by: CA-326 / GA-149  
Frozen source baseline: `af23f2102ae8812161fa6c4192c848c25cead8c2`

## ACT9 implementation

- Consumed GA canonical localization commit `cf24af175a3502ed5b7e06315c32623ef27d9219` without modifying protected copy.
- Registered source-only v001 candidates `shared.great_hall.red_first` and `shared.great_hall.both_open`; neither is ACTIVE and no production publication occurred.
- Copied only the two CA-authorized VA binaries from `e1fdccfa921aad403a95278bba213763e888b875`.
- Verified WebP SHA-256:
  - red_first: `af463e9ae529d5f7de8935f7e7794b4879cd2f15635d9617139fb52fb7ac9936`
  - both_open: `338bbed29fd64537741615e76f5ddd52f688263ae23c734de3ffb63b42381284`
- Player selection uses server-confirmed flags only:
  - neither flag: `shared.great_hall`
  - red only: `shared.great_hall.red_first`
  - red + blue: `shared.great_hall.both_open`
  - blue without red: base image (defensive unreachable-state fallback)
- Variant load failure retries the existing base asset. The UI continues using approved base anchor percentages for exact door labels while suppressing duplicate HTML open-door visual effects.
- `blue_first` remains unregistered and unused.

## ACT6 disposable execution

GitHub Actions run: `43712447203`  
Workflow: `GA147 ACT6 disposable PostgREST lifecycle`  
Conclusion: `success`

The workflow created ephemeral PostgreSQL 16 + PostgREST, synthetic roles/data, and applied repository migrations 001–077. It refused the known production hostname.

Passed lifecycle evidence:

1. real ACT1 start and three role choices;
2. ACT2 meeting and identity-bound combined grab/leave;
3. ACT3 Library resolution/discovery acknowledgement;
4. ACT4 choices and authoritative ACT5 terminal state;
5. per-player `s9_observe_act5_handoff` / `s9_enter_act6` barrier;
6. canonical ACT6 discussion and Teacher vote opening;
7. pre-ack vote rejection;
8. stale-run acknowledgement rejection;
9. three-player acknowledgement and idempotent retry;
10. reconnect/state projection preserves acknowledgement;
11. post-ack votes progress to `act6_answer`.

Earlier runs `43711828240` and `43712249350` failed only in disposable harness plumbing. The latter proved migrations and PostgREST startup, then exposed the Supabase gateway `/rest/v1` versus direct PostgREST root mismatch. Commit `9b2acdd1c6f481870d174d6e82f4115a746ad62b` corrected that disposable-only route before the PASS run.

## Local validation

PASS:

- `node --check src/game/app.js`
- `node --check tests/ga147-canonical-copy-integration-live-e2e.js`
- `node tests/act9-asset-variant-static-check.js`
- `node tests/sprint6-static-check.js`
- `node tests/sprint9-trial-placeholder-static-check.js`
- `node tests/sprint9-asset-readiness-validator.test.mjs`
- readiness validator: 30/30 valid approved, 0 invalid, 0 blocked, readiness true
- GA147, ACT3, Sprint5 and Sprint8 targeted static suites
- `git diff --check`

## Remaining authority boundary

No production asset publication/activation, database deployment or Pages release is included. CA independently audits this baseline and decides any subsequent nonproduction publication or release gate.
