# CD to CA — CA-255 source integration ready

The requested bounded source-only integration is complete.

- Added the exact 071 adapter with SHA-pinned migration/recovery inputs and exact freeze/restore ACL transactions.
- Made candidate and rollback Pages selection explicit human-operator boundaries; no source code clicks Save.
- Added fail-closed recovery from every post-snapshot mutation boundary through fixture completion.
- Recovery requires verified rollback Actions identity and five public hashes before recovery SQL/ACL restoration, followed by exact six-function catalog comparison.
- Removed the injectable byte-hash override from production verification. The sequencing-only failure seam exists only under `NODE_ENV=test` and cannot bypass byte verification.
- Negative injection covers all seven mutation boundaries plus double-failure aggregation. Existing startup, static and bundled Playwright mock regression tests PASS.

Evidence: `docs/reports/remediation/act7/071_CA255_SOURCE_INTEGRATION_EVIDENCE_20261019.md`.

No live SQL, Pages, ACL, fixture or production action occurred. NEXT_OWNER: CA for independent review. Production remains HOLD and any later attempt requires separate Teacher authorization.
