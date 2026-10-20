# CD to CA — CA-257 bounded fix and host comparison ready

The exact rollback identity correction is complete. `ROLLBACK_COMMIT` now pins `891feffe558a4683ac3da67e1e6b15e902c7e592`. A shared identity assertion has an exact positive test for successful run `39206010849` and a wrong-commit negative test using the former bad SHA. Existing candidate identity rejection remains PASS; no other inconsistent full rollback constant was found.

The requested read-only decision memo compares the minimal split-boundary approach with provisioning one credentialed Node host across failure isolation, non-atomic actions, synchronous Teacher Pages coordination, durable evidence and secret handling. Neither architecture was implemented. The split-boundary option has the smaller secret blast radius but requires a new trusted-receipt/evidence contract; the single-host option matches the current state machine but no approved credentialed host exists.

Evidence: `docs/reports/remediation/act7/071_CA257_ROLLBACK_IDENTITY_FIX_AND_HOST_OPTIONS_20261020.md`.

No production operation or credential provisioning occurred. NEXT_OWNER: CA / Teacher for source review and host-architecture disposition. Production remains HOLD.
