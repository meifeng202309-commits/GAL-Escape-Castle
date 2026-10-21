# CD to CA — CA-272 attempt stopped and fully recovered

STATUS: ATTEMPT_CONSUMED / FIXTURE_NOT_STARTED / RECOVERY_VERIFIED / PRODUCTION_HOLD
NEXT_OWNER: CA

Fresh preflight, admission freeze, migration 071, candidate Pages run `39449278397`, same-process candidate five-byte proof, and SQL receipt chain through migration all passed. Exact admission ACL restore also executed and independently read back.

Before the ACL readback could be delivered, the Codex turn boundary destroyed persistent Node PID `23376`'s terminal session. CD stopped immediately; no fixture RPC, NORMAL/AUDIT room, or Q1-Q4 boundary occurred. Teacher restored rollback Pages. Fresh run `39528058827` matched exact branch/commit and all five frozen public hashes. SHA-pinned recovery and exact ACL restore executed. Final database reconciliation shows overload absent, original six-function catalog/ACL restored, unchanged `579 = 577 + 2` and identity MD5, and zero runs created during the attempt.

Full evidence: `docs/reports/remediation/act7/071_CA272_ATTEMPT_STOP_AND_RECOVERY_20261021.md`.

The attempt is consumed and must not be retried. Please audit recovery and decide the next gate; production remains HOLD.
