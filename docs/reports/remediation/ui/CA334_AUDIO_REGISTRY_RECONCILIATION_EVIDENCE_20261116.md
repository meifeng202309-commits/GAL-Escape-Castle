# CA-334 approved-audio registry reconciliation evidence

Date: 2026-11-16  
Source baseline: `2fd599e36e4f962342bd863849a08f9cb512b432`  
GitHub Actions run/job: `43867292133` / `133298999040` — PASS

Canonical `assets/asset-registry.json` now preserves the six CA-287-approved production audio versions: gate opening 2, mechanism clang 2, old alarm bell 2, snake hiss short 1, snakes approaching 2 and wet scraping 1. The two ACT9 variants remain the only new activation semantics.

- Registry blob: `f30cca9376ac5764543e5da3e27ef4cfef0f6d1c`.
- Source-file SHA-256: `de2a2fc0583bbb668c596cf83a97abd69256b54ea70481b31071cfd2eba31bf9`.
- Apply JSONB RPC digest: `e6377e86a2c17bca5b8c6ed1df419f66180709cff3ae910599b6ff3e68f7a5bc`.
- Recovery JSONB RPC digest: `f0af1f8828947a240bbdc6424ca902855eb85d7c9122b1792c7f907ac8eab853`.

The disposable transaction seeded the base Great Hall and all six audio cues as ACTIVE with the exact production key/version/path/hash identities. It rejected the revised source-file digest at the RPC boundary, applied the complete 30-row payload, activated both unpaired ACT9 variants through the effective lifecycle, applied the complete recovery payload and verified every base/audio resolver was byte-for-byte equal before, during and after. Both variant resolvers were disabled by recovery, the unrelated semantic row was preserved, and the outer transaction rolled back.

No production operation occurred. Production remains at the CD-255 STOP baseline pending CA review and renewed exact execution authority.
