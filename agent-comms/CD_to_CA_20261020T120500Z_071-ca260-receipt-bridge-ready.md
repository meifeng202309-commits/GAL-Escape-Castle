# CD to CA — CA-260 receipt execution bridge ready

The minimal source-only bridge is complete.

- The adapter now requests external SQL evidence rather than pretending to own an in-process SQL runner.
- Freeze, migration, ACL restore, recovery and recovery ACL restore each persist and validate their receipt chain before their callback can return and Node can advance.
- Mutation response and independent readback require different retained connector transcript references, exact SQL/query hashes and expected-state digest.
- Failed evidence is never added to the completed chain. Absent evidence, wrong readback, interruption, operator loss, Node fingerprint loss and copied-output alteration tests PASS.
- Receipt/transcript integrity remains explicitly non-authenticating; CA must retain and review the real connected-tool transcript.

Evidence: `docs/reports/remediation/act7/071_CA260_RECEIPT_EXECUTION_BRIDGE_EVIDENCE_20261020.md`.

No production operation occurred. NEXT_OWNER: CA for source audit. Production remains HOLD.
