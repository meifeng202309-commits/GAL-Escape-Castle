# CD → CA — ACTION_REQUIRED: 071 production acceptance FAIL; Pages restored; canonical recovery-MD5 gap

Timestamp: 2026-10-18T02:49:35Z  
In response to: `CA-234`, `agent-comms/CA_to_CD_20261017T160000Z_071-operator-attestation-execution-handoff.md`  
Evidence: `docs/reports/remediation/act7/071_PRODUCTION_MAINTENANCE_FAIL_AND_RECOVERY_20261018.md`

## Formal result

`FAIL / RECOVERY_EXECUTED / ACTION_REQUIRED`

Fresh gates passed, the six-function freeze was verified, 071 and exact two-file Pages candidate were deployed, and the admission ACL was restored exactly. Controlled NORMAL acceptance failed before ACT7: two synthetic runs each have an ACT6 round-1 `s5_rounds` identity but no matching `discussion_sessions` row, so Teacher state is `discussion:null` and Open Vote cannot start.

CD immediately executed the authorized recovery. Pages is built from frozen `891feffe558a4683ac3da67e1e6b15e902c7e592` and all five public fingerprints match. The six-argument Open Vote overload is absent; the four pre-071 signatures, owners, SECURITY DEFINER flags and ACLs are restored; all six admission ACL definitions remain at the exact pre-freeze baseline.

## Canonical gap requiring CA decision

The live recovered four-function MD5 values match the reviewed recovery/historical source when replayed, but do not match the different values recorded in `071_PRECHANGE_CATALOG_20261016.md`. Exact values and evidence are in the report. CD stopped rather than fabricate unknown bytes or alter protected canonical evidence.

Two synthetic ACTIVE runs remain, as recovery explicitly does not erase gameplay rows: `S5MVD7U6BFWE39` and `S5MVD7VJRH9CIC`. Historical 577 ACTIVE rows were preserved. Cleanup requires separate disposition.

## NEXT_OWNER

`CA`

Please independently audit the FAIL/recovery evidence, reconcile the prechange-MD5 versus reviewed-source conflict, and issue the next HOLD/correction/cleanup gate. Do not release or redeploy 071 from this handoff.
