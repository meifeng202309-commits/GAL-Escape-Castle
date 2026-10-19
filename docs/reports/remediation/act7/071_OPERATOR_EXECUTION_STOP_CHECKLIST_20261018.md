# 071 one-page operator execution / STOP / rollback checklist

Status: template only — `PRODUCTION_HOLD` until new Teacher authorization and CA release

CA-253 source-gate hardening: before any future authorized attempt, use
`scripts/act7-071-source-gates.js` to persist/re-read the pre-freeze catalog,
verify the exact five candidate public files, and run `assert-acl-restore` before
restoring admission ACLs. The controlled fixture revalidates both artifacts and
performs its Supabase reachability probe inside the same Node process before its
first mutating RPC. Missing or mismatched proof is a mandatory STOP.

Roles: Teacher/account owner authorizes and freezes external privileged work; CD is uninterrupted coordinator/operator; CA independently dispositions evidence. Record every check with UTC time and evidence path.

## Before any write

- [ ] Exact Teacher authorization cites the approved packet; prior authorization is not reused.
- [ ] All service-role key holders/jobs/operators identified and positively paused; no class/rehearsal; CD continuity confirmed.
- [ ] Source/recovery/evidence/fixture hashes and `891feffe…` / `6e3bbd1…` refs match.
- [ ] Fresh Q0 preserves all 579 existing ACTIVE identities; no cleanup.
- [ ] Fresh observation interval, DB sessions, Edge/cron/Actions, catalog/ACL/MD5 and public Pages hashes all pass.
- [ ] SQL recovery, Pages rollback and exact six-function ACL restore are executable and independently recorded.
- [ ] Any drift, activity, missing attestation or rollback uncertainty → **STOP; no write**.

## Freeze, deploy, verify

- [ ] Transactionally revoke PUBLIC/anon/authenticated/service_role EXECUTE on the six exact admission/start signatures.
- [ ] Verify effective deny and no PUBLIC; negative permission probes only; repeat activity/Q0 checks.
- [ ] Apply SHA-pinned migration 071 only; verify exact signature/owner/definer/ACL/definition poststate.
- [ ] Publish only `6e3bbd1…`; verify exact five public hashes; admit no Player between SQL and Pages.
- [ ] Restore exact pre-freeze six-function ACLs while general admission remains operationally closed; verify.
- [ ] Any SQL/ACL/Pages mismatch or unexpected activity → **STOP and rollback immediately**.

## Controlled evidence

- [ ] Set both exact startup flags; allow exactly one new NORMAL and one new AUDIT synthetic run.
- [ ] NORMAL: Q1 at all ten boundaries; Q2/Q3 at third-vote resolution; record the first **61-second wait** start/end.
- [ ] AUDIT: Q4 at voting, after the second **61-second wait**, and after Add Time; record wait start/end.
- [ ] Press Enter only after the SQL result file and SHA-256 are recorded. Missing/failed evidence → **STOP**.
- [ ] Final Q0 reports the preserved 579 existing identities and the two new runs separately; delete nothing.

## Rollback on any failure

- [ ] Keep admission closed; capture failure and preserve every row.
- [ ] Restore Pages `891feffe…`; verify five frozen hashes.
- [ ] Execute SHA-pinned `071_RECOVERY.sql`; verify fresh prechange definitions/owner/definer/ACL.
- [ ] Restore/verify exact six-function ACL snapshot and final Q0/identity digest.
- [ ] No retry under the same authorization. Send complete success or rollback evidence to CA; CA owns disposition and reopening decision.
