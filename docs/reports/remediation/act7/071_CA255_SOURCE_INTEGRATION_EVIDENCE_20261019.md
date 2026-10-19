# CA-255 bounded 071 source integration

Timestamp: 2026-10-19T17:20:00Z
Status: **SOURCE-ONLY INTEGRATION COMPLETE / PRODUCTION HOLD**

## Exact adapter envelope

`scripts/act7-071-production-adapter.js` is the sole staged production adapter. It requires a narrow operator object with exactly these entrypoints:

- `captureAdmissionCatalog()` — return the frozen six-function catalog rows;
- `executeExactSql({ name, sha256?, sql })` — execute only the supplied pinned transaction;
- `awaitPagesSelection({ branch, folder, humanRequired, acknowledgement })` — stop for the human Pages operator;
- `runControlledFixture(context)` — call the existing exported `runCoordinatedAcceptance` in the same process.

The adapter verifies the checked-in migration SHA-256 `720cb598…ab04` and recovery SHA-256 `e7e74f16…f683` before any mutation. Freeze and restore transactions name the exact six admission signatures and exact role envelope. It requires `ACT7_071_PRODUCTION_AUTHORIZED=YES`; this source packet does not supply that authorization or a standalone mutation CLI.

## Ordered attempt and human boundaries

Attempt order is: same-process network probe → durable catalog snapshot → exact freeze → exact migration → **human** candidate Pages selection (`deploy/act7-071-20261017`, `/(root)`) → live Actions/five-byte proof → ACL restore → second same-process probe → controlled fixture.

Any exception from the start of the freeze boundary through fixture completion invokes recovery. Recovery is fixed to: **human** rollback Pages selection (`deploy/manual-acceptance-20261003`, `/(root)`) → live rollback Actions/five-byte proof → pinned `071_RECOVERY.sql` → exact ACL restore → catalog recapture and exact comparison with the durable pre-freeze artifact. If recovery fails, the adapter throws an `AggregateError` retaining both causes and does not claim recovery.

## Bypass closure and negative evidence

The public-byte verifier no longer accepts `hashBytes` or any equivalent caller override. Production entrypoints always hash received bytes with Node SHA-256. The shared sequencing test seam is exported only when `NODE_ENV=test`; it cannot alter the verifier and is absent from normal production module exports.

Negative injection covers every mutation boundary: freeze, migration, candidate Pages switch, candidate public proof, ACL restore, fixture network probe and fixture. Every injected failure immediately enters recovery and prevents subsequent attempt stages. A recovery failure preserves the primary and recovery errors. Pre-mutation DNS failure still invokes no mutation and no recovery.

## Validation

PASS:

```text
node --check scripts/act7-071-production-adapter.js
node --check scripts/act7-071-source-gates.js
node tests/act7-071-source-gates.test.js
node tests/act7-071-startup-gate.test.js
node tests/act7-v4-normal-timeout-static-check.js
bundled Node/Playwright tests/act7-v4-normal-timeout-browser.mjs
git diff --check
```

No production database, ACL, Pages, GitHub workflow or real fixture operation occurred.

NEXT_OWNER: CA — independent review of CD-119. A later production attempt requires a separate Teacher authorization.
