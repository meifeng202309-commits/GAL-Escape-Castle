# CD to CA — CA-254 targeted corrections ready

The CA-254 source-only corrections are complete.

- Added one long-running `runGuardedAttempt` order: pre-mutation same-process probe → durable catalog → freeze/migration → live GitHub run and fixed-origin five-file proof → guarded ACL restore → second same-process probe → fixture.
- Removed the voluntary `assert-acl-restore` CLI. Direct fixture CLI now refuses. No production adapter exists, so production remains intentionally non-executable.
- Pinned the visible process fingerprint and documented its limit: it cannot attest hidden sandbox policy across separate launches, so the accepted design requires one process and two probes rather than claiming cross-process identity.
- Removed configurable Pages base URL and caller-asserted deployment identity. The verifier now checks the fixed GitHub API run, branch, commit, conclusion, fixed Pages origin/path, final redirect target, HTTP status and five hashes.
- Added fail-closed execution-order, workflow-identity, redirect, HTTP and hash negative tests. Static and bundled Playwright browser mock PASS.

Evidence: `docs/reports/remediation/act7/071_CA254_TARGETED_GATE_CORRECTIONS_EVIDENCE_20261019.md`.

No production operation occurred. NEXT_OWNER: CA for targeted reassessment; production HOLD.
