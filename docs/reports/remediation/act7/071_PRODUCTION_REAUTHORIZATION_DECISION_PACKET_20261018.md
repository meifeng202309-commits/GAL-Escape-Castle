# Migration 071 bounded production reauthorization decision packet

Status: `READY_FOR_CA_GATE_REVIEW / PRODUCTION_HOLD`

Prepared by: CD

Date: 2026-10-18

This document requests a future Teacher decision. It is not an execution authorization, deployment instruction or report of production acceptance. CA must first audit this exact packet. The prior 071 production authorization was consumed by the 2026-10-18 attempt and rollback and cannot be reused.

## 1. Decision requested after CA review

Authorize exactly one uninterrupted, operator-coordinated production maintenance attempt on Supabase project `qdcbdcjobzytzhnhfwyn` and the existing GitHub Pages site, limited to:

1. fresh read-only preflight and preservation evidence;
2. transactional freeze and exact restoration of six admission/start function ACLs;
3. transactional application of migration 071 only;
4. publication of the exact two-file Pages candidate only;
5. one new synthetic NORMAL run and one new synthetic AUDIT run using fictional codes and no student data;
6. Q0-Q4 SELECT-only snapshots at every fixture boundary;
7. pre-authorized SQL/Pages/ACL rollback if any gate fails.

The decision does not authorize migrations 069/070, any other migration, table/business-row cleanup, deletion of retained fixtures, student/human rehearsal, UI redesign, new infrastructure, unrelated source, asset work or broad Package C work.

## 2. Immutable source envelope

Source-readiness baseline accepted by CA-242:

- CD implementation commit: `02fcac9f603b4245bfc8a688e9bdd2a2de45776c`.
- migration: `database/071_act7_v4_normal_teacher_paced_vote.sql`, SHA-256 `720cb598d7ead56d3ed1ff53bcf7d62af94f795357efe7e60ef1bff504b0ab04`.
- recovery: `docs/reports/remediation/act7/071_RECOVERY.sql`, SHA-256 `e7e74f16885c730ef10d4f577420be486d8d07a774d2d9b43a97ec8a66eff683`.
- evidence SQL: `docs/reports/remediation/act7/071_ACCEPTANCE_READONLY_INVARIANTS.sql`, SHA-256 `f469540d30e69739514420e14ced3513e64c4f093453a533a796a9fc44e4ba94`.
- controlled fixture: `tests/act7-071-controlled-acceptance.js`, SHA-256 `80c48c19147612fb752ae022608cd16df53754fce681cdffd2e87bec62f784df`.

Pages envelope:

- rollback baseline: `deploy/manual-acceptance-20261003@891feffe558a4683ac3da67e1e6b15e902c7e592`;
- candidate: `deploy/act7-071-20261017@6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`;
- exact candidate delta: `teacher.html` and `src/teacher/teacher-console.js` only;
- public hash manifest: use section 2 of `071_INTEGRATED_READINESS_PACKET_20261018.md`; any mismatch is STOP.

The operator must re-hash all four packet files and resolve both Git commits immediately before the window. Any mismatch is STOP and requires CA review.

## 3. Named control and attestations

Before the maintenance window begins, evidence must identify:

- Teacher/account owner approving the exact bounded operation and committing not to use privileged jobs/tools during it;
- one uninterrupted CD technical coordinator from first preflight through success closure or rollback closure;
- every known service-role key holder, automation and privileged operator, each confirmed quiescent for the full window;
- the UTC start time, expected exclusive interval and communication channel used to keep general admission closed.

Technical point-in-time inactivity is insufficient by itself. Missing owner/service-role attestation, coordinator continuity or exclusive-window confirmation is STOP.

## 4. Fresh preflight before any write

Capture and save, without private player payloads:

1. project reference and PostgreSQL version;
2. Q0 count and exact identity digest proving all 579 current ACTIVE rows remain present: 577 historical plus retained rooms `S5MVD7U6BFWE39` and `S5MVD7VJRH9CIC`;
3. a declared observation interval with no new admissions and no changes in player activity, runtime/game events, dialogue, receipts, overrides or ACTIVE identity set;
4. zero relevant queued/running GitHub Actions, Edge Functions, cron work and non-idle external database/service-role sessions;
5. fresh raw and newline-normalized definitions, owner, `prosecdef`, complete ACL and effective privilege matrix for every migration/recovery function and all six freeze functions;
6. current Pages source plus all five frozen public hashes and confirmed ability to restore `891feffe…`;
7. connector/operator ability to execute and verify both `071_RECOVERY.sql` and exact ACL restoration.

Any activity delta, catalog/ACL drift, unexplained function-body difference, Pages mismatch, unavailable rollback route or observability gap not explicitly accepted by the authorized Teacher is STOP before mutation. Do not clean data to make a precondition pass.

## 5. Six-function admission freeze

In one transaction, revoke `EXECUTE` from `PUBLIC`, `anon`, `authenticated` and `service_role` on exactly:

1. `s1_create_room(text,text,text,text,text)`
2. `s1_join_player(text,text)`
3. `s9_start_formal_game(text,text,text)`
4. `s1_reset_room(text,text)`
5. `s3b_initialize_flow(text,text)`
6. `s2_start_run(text,text,text)`

After commit, save proof that `anon`, `authenticated` and `service_role` have no effective EXECUTE on all six and that no PUBLIC grant survives. Only permission-denied negative probes are allowed while frozen. Repeat the activity/identity checks; any delta is STOP and requires exact ACL restoration.

The immediate pre-freeze ACL snapshot is the restoration authority. Expected restoration is:

- `anon`, `authenticated`, `service_role` on create, join, formal-start and reset;
- `PUBLIC`, `anon`, `authenticated`, `service_role` on initialize;
- `service_role` only on direct start;
- no PUBLIC grant on the other five.

If the fresh snapshot differs from this expected matrix, do not improvise: STOP for CA review.

## 6. Bounded forward sequence

Only after every preceding gate passes:

1. Apply only the SHA-pinned migration 071 as its existing transaction.
2. Verify exact poststate: legacy two-argument Open Vote is not executable by PUBLIC/anon/authenticated; the six-argument identity-bound overload exists with reviewed grants; configure remains internal; Add Time and Teacher state retain reviewed roles; all expected owners, SECURITY DEFINER flags and definitions match source.
3. Immediately publish only candidate `6e3bbd1…`; verify the deployed source identity and five public-byte hashes. No Player is admitted between SQL and Pages cutover.
4. Restore and verify the six exact pre-freeze ACLs while keeping general admission operationally closed.
5. Reconfirm Q0 preservation and absence of unrelated activity.
6. Set both `ACT7_071_PRODUCTION_AUTHORIZED=YES` and `ACT7_071_EVIDENCE_PAUSE=YES`; run the SHA-pinned fixture under the named coordinator.
7. Permit the fixture to create exactly one new NORMAL and one new AUDIT synthetic run. Preserve both and all earlier records after the attempt; cleanup is not authorized.
8. At every emitted boundary, execute and save the mapped Q1-Q4 SELECT result before continuing. Pressing Enter merely resumes execution and is not evidence.

## 7. Required acceptance evidence

Evidence records must include boundary label, UTC time, exact query and substituted identities, complete result, project ref, source/candidate SHAs and deployed function fingerprints.

- Q0: before maintenance and before closure/unfreeze disposition; 579 existing ACTIVE identities must remain preserved, with the two new synthetic runs reported separately rather than hidden from totals.
- NORMAL Q1: `ROUND2_OPEN`, `TWO_VOTES`, `AFTER_61S`, `THIRD_VOTE_RESOLVED`, `BEFORE_STALE`, `AFTER_STALE`, `BEFORE_NORMAL_ADD`, `AFTER_NORMAL_ADD`, `BEFORE_INVALID_TOKEN`, `AFTER_INVALID_TOKEN`.
- NORMAL Q2/Q3: at `THIRD_VOTE_RESOLVED`, bound to the original round-2 discussion identity.
- AUDIT Q4: `AUDIT_VOTING`, `AUDIT_AFTER_61S`, `AUDIT_AFTER_ADD`.
- Browser/fixture assertions: current ACT5→ACT6 0/1/2/3 barrier, stable canonical identity, NORMAL 10,800 timing and genuine late third vote, one resolution, stale/auth/Add-Time nonmutation, ACT8 adjacency, and AUDIT 15/60 timeout/Add-Time behavior.

Fixture completion, console output or Enter acknowledgments cannot produce PASS without the saved SQL records. CA alone performs the independent evidence disposition.

## 8. Immediate STOP and rollback

STOP on any preflight drift, unexpected activity/admission, privilege mismatch, migration error, poststate mismatch, Pages/hash mismatch, missing evidence record, assertion failure, operator interruption or inability to verify recovery.

If failure occurs after any production change:

1. keep general admission closed and capture the failure without deleting rows;
2. restore Pages to `891feffe558a4683ac3da67e1e6b15e902c7e592`, trigger build and verify all five frozen hashes;
3. execute the SHA-pinned `071_RECOVERY.sql` transactionally;
4. verify the six-argument overload is absent and the four pre-071 functions equal the fresh immediate prechange owner/definer/ACL/definition baseline, allowing only the already recorded newline representation distinction;
5. restore and verify the exact six-function pre-freeze ACL snapshot;
6. preserve every synthetic and historical row, record final Q0/identity evidence and report to CA.

Git revert is not database recovery. No retry is authorized inside the same decision after rollback; another attempt requires a new gate.

## 9. Closure conditions

Success is only: all forward checks, both synthetic scenarios and complete SQL/browser evidence succeed; exact ACL restoration is verified; preserved-row evidence is complete; general admission remains closed pending CA disposition; CD sends exact evidence to CA. Source readiness alone is not runtime PASS.

Failure closure is only: Pages, SQL and ACL rollback all verify against their fresh baselines; all records are preserved; exact failure evidence is sent to CA. A partial rollback remains an active incident.

In either case, NEXT_OWNER is CA for independent evidence review. Reopening general admission or declaring production acceptance is not delegated to the executor.

## 10. Teacher decision form after CA PASS

The requested approval must identify this exact packet and immutable source envelope and state:

> I authorize one bounded migration-071 production maintenance attempt under this packet, including the six-function ACL freeze/restore, exact two-file Pages candidate, one synthetic NORMAL run, one synthetic AUDIT run, mandatory Q0-Q4 evidence, and immediate reviewed rollback on failure. I confirm the prior authorization is consumed, no broader work or cleanup is authorized, and production remains closed pending CA evidence disposition.

Until that explicit decision is recorded after CA review, `PRODUCTION_HOLD` remains in force.
