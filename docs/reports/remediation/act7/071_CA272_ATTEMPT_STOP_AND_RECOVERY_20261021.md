# CA-272 migration 071 attempt — STOP and verified recovery

Status: `ATTEMPT_CONSUMED / FIXTURE_NOT_STARTED / RECOVERY_VERIFIED / PRODUCTION_HOLD`

Operation ID: `071-20261020T152029Z-ca272`

## Fresh preflight

- Teacher confirmed a live exclusive production window and Pages candidate/rollback availability.
- At `2026-10-20T15:18:41Z`, production held `579 ACTIVE = 577 historical + 2 retained`, identity MD5 `32b2dded3d01c8821d8a539411840aea`; seven recent-activity categories and other non-idle sessions were zero.
- Supabase was `ACTIVE_HEALTHY`; Edge Functions were empty; pg_cron absent; queued/in-progress GitHub Actions empty.
- Ten reviewed functions matched owner, SECURITY DEFINER, search path, ACL and definition baseline; the 071 overload was absent.
- Migration/recovery SHA-256 values matched the pinned adapter and all three operator/source/startup test files passed.

## Attempt and STOP

1. Persistent Node PID `23376` saved the durable prefreeze snapshot and same-process network proof.
2. Admission freeze executed and its independent effective-deny readback was receipt-validated.
3. SHA-pinned migration 071 executed and its independent Open Vote contract readback was receipt-validated.
4. Teacher selected candidate Pages. Run `39449278397` succeeded for exact branch `deploy/act7-071-20261017` and commit `6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`; the same Node verified all five candidate public files before requesting ACL restore.
5. Exact admission ACL restore executed and an independent readback returned the original six-function privilege matrix.
6. Before that readback could be delivered to PID `23376`, the Codex turn boundary destroyed the persistent terminal session (`Unknown process id 56831`). Continuity was therefore lost. CD STOPPED before the fixture. No NORMAL/AUDIT room or Q1-Q4 boundary was created.

This authorization is consumed and must not be retried.

## Verified recovery

- Teacher selected `deploy/manual-acceptance-20261003` at `/(root)`.
- Fresh run `39528058827` completed successfully for exact commit `891feffe558a4683ac3da67e1e6b15e902c7e592`.
- All five rollback public files returned HTTP 200 and exact frozen SHA-256 values; proof digest `773295056fbd009a8f82a1472f8573fe342f46fa5d085412a376053b23c2e114`.
- SHA-pinned `071_RECOVERY.sql` executed, followed by exact admission ACL restore.
- Final readback at `2026-10-21T01:43:01Z` found the 071 overload absent; all six admission definitions/owner/definer/search-path/ACL values restored; `579 = 577 + 2`; identity MD5 unchanged; and `runs_created_during_attempt=0`.

## Evidence boundaries

- freeze response/readback: `untrusted-data-4c4b5ea1-40d5-4dec-ace4-597057b0b3e1` / `untrusted-data-78cbe738-c90a-4eb3-a03e-db8b1baa05ef`
- migration response/readback: `untrusted-data-aa5c03d1-7844-4a0b-b82f-7d1b73b035ef` / `untrusted-data-84827531-2da1-4a01-b574-dbda94d0877c`
- ACL restore response/readback: `untrusted-data-6f851219-5a92-4f34-9152-683219b8c524` / `untrusted-data-5ed2c133-ab11-4c3a-9823-d2ceeacad1ef`
- recovery response: `untrusted-data-ce036e30-cbfb-4d48-a7d9-5b3fccc22f54`
- recovery ACL response: `untrusted-data-400ab2fb-4482-4e24-92c0-691a2e71b0b9`
- final reconciliation: `untrusted-data-526e33e5-6ac2-4e02-a519-c5984077ae72`

NEXT_OWNER: CA

NEXT_ACTION: Audit the STOP/recovery evidence and persistent-session loss. Production remains HOLD; no retry is authorized.
