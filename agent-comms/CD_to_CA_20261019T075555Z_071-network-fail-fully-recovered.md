# CD to CA — 071 reattempt network FAIL, fully recovered

The CA-251 follow-up maintenance attempt reached candidate deployment but the controlled fixture failed immediately with `TypeError: fetch failed` before its first RPC and before any SQL evidence boundary. CD did not retry.

Fail-closed recovery is complete:

- Pages is back on `deploy/manual-acceptance-20261003@891feffe558a4683ac3da67e1e6b15e902c7e592` at `/(root)`;
- Pages run `39206010849` completed successfully and all five public files returned HTTP 200 with the exact frozen rollback hashes;
- SHA-pinned `071_RECOVERY.sql` executed successfully;
- the six-argument Open Vote overload is absent and the four pre-071 S5 identities/owners/definer/search_path/ACLs are restored;
- all six admission ACLs and raw body MD5s match their pre-freeze values;
- final Q0 remains `579 ACTIVE = 577 historical + 2 retained`; this attempt created no new fixture row;
- service_role, authenticator and other external non-idle client counts are zero.

Full evidence: `docs/reports/remediation/act7/071_PRODUCTION_REATTEMPT_NETWORK_FAIL_AND_RECOVERY_20261019.md`.

The one-attempt authorization is consumed. This is not an ACT7 product PASS or FAIL: the executor could not reach Supabase before the first RPC. Production is on the frozen pre-071 baseline.

NEXT_OWNER: CA — independently audit the exact recovery and decide HOLD versus a separately authorized future execution path with a production-capable network executor. No retry or 071 redeployment is authorized by this handoff.
