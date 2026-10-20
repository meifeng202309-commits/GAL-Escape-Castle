# CA-262 split-boundary read-only operational readiness

Timestamp: 2026-10-20T13:30:00Z
Status: **TECHNICAL READINESS PASS / TEACHER PAGES READINESS PENDING / PRODUCTION HOLD**

Operation ID: `act7-071-readiness-ca262`

## Actual connector handoff rehearsal

Two separately executed Supabase `execute_sql` read-only calls returned the same six-function catalog and effective privilege matrix under the operation ID:

- primary transcript boundary: `untrusted-data-0dcd6b19-69c4-48e7-a73a-6853595fe310`;
- independent corroboration boundary: `untrusted-data-7ddc6fcf-d550-4884-ae71-fb041db4cedf`.

Both contain identical signature, owner, SECURITY DEFINER, search path, raw ACL, effective PUBLIC/anon/authenticated/service_role privileges and raw definition MD5 values. Neither query performed DDL or DML.

The original connected-tool outputs remain in the current Codex task transcript. The repository receipt retains their distinct references and copied normalized rows. This is auditable integrity and cross-check evidence, not cryptographic Supabase origin authentication.

## Same-process Node rehearsal

One external-network Node process (`pid=19232`, visible fingerprint `97f3ac80…ff17`) completed, without restart:

- Supabase REST reachability: HTTP 401;
- GitHub Actions run `39206010849`: HTTP 200, rollback branch `deploy/manual-acceptance-20261003`, exact commit `891feffe558a4683ac3da67e1e6b15e902c7e592`, success;
- public rollback `index.html`: HTTP 200, 2,574 bytes, SHA-256 `1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4`;
- persisted and validated `071_CA262_READONLY_SQL_RECEIPT.json`, SHA-256 receipt digest `76c7afbaa0d3b3e07a0202b8ddf67f387f9ab5f7b968ae96eba84eb93a3eeefb`.

The rehearsal did not call the controlled fixture and did not set any `ACT7_071_PRODUCTION_AUTHORIZED` flag.

## Remaining blocker

No fresh Teacher confirmation establishes that the GitHub Pages settings tab is currently available and the human operator is ready for both candidate Save and immediate rollback. Prior readiness tokens belonged to consumed/closed windows and cannot be reused. Architecture approval alone is not operational availability.

Required non-mutating acknowledgement:

```text
PAGES_OPERATOR_READY: rollback=deploy/manual-acceptance-20261003 candidate=deploy/act7-071-20261017 root=/(root)
```

This acknowledgement must not be accompanied by selecting a branch or clicking Save. Even after it is supplied, production remains HOLD until a separate explicit authorization.

No SQL/ACL mutation, Pages selection/Save, fixture, credential provisioning or production record change occurred.

NEXT_OWNER: Teacher — provide or decline the fresh Pages readiness acknowledgement. Then CA reviews the complete non-mutating readiness packet. Production remains HOLD.
