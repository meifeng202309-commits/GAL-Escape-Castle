# CA-276 Teacher-paced voting source evidence

Date: 2026-10-21  
Authority: `agent-comms/CA_to_CD_20261021T032000Z_teacher-paced-voting-minimal-p0-scope.md`  
Scope: source-only; no live SQL, Pages switch, fixture, cleanup, or production write

## Pinned interval

- Base: `0c79e26c3f9973cd76b709cad1bc0d7f420c14db`
- Implementation: `cf5ebd8c80f7ab6bc93cc93c44169c3f394e74d1`
- Migration SHA-256: `933f8e210ad0e24daf8c944f1b43c817d71fe8f28fa0ecf87461e19e285e7401`
- Recovery SHA-256: `335187913459ec322d4dd1efb140a147e431b2d25c54f4a884220623cccf0fcd`

## Minimal correction

The existing 071 migration remains the single source package; no new subsystem or migration layer was introduced.

- NORMAL Sprint 5 ACT6–8 discussions start without an automatic deadline.
- Teacher Open Vote starts NORMAL voting with `phase_deadline = null`; the existing exact run/phase/round/discussion identity binding remains intact.
- The generic pre-Sprint6 discussion owner and `s2_open_vote` now apply the same Teacher-paced policy to analogous earlier-route final votes. The Sprint6 ownership wrapper is not replaced.
- NORMAL refresh returns without time-based `discussion -> voting` or `voting -> waiting_for_missing_player` transitions. Three genuine votes still drive the existing normal resolution/next-ACT logic.
- AUDIT deadlines, timeout-to-waiting behavior, Add Time recovery, message append-only storage, identity checks, vote provenance, committed votes, tie/revote rules, and group resolution were not rewritten.
- Recovery SQL restores both generic functions plus the previous Sprint5 functions and ACLs. Adapter hashes were mechanically rebound to the revised reviewed SQL bytes; no operator behavior was extended.

Changed files:

- `database/071_act7_v4_normal_teacher_paced_vote.sql`
- `docs/reports/remediation/act7/071_RECOVERY.sql`
- `scripts/act7-071-production-adapter.js`
- `tests/act7-071-controlled-acceptance.js`
- `tests/act7-v4-normal-timeout-static-check.js`
- `tests/teacher-paced-voting-policy.test.js`

## Focused validation

PASS:

- `node tests/teacher-paced-voting-policy.test.js` — three sequential NORMAL votes at 61s, 122s and 183s remain legitimate and resolve on the third; AUDIT still times out after 60s and retains the first committed vote.
- `node tests/act7-v4-normal-timeout-static-check.js`
- `node tests/act7-071-source-gates.test.js`
- `node tests/act7-071-startup-gate.test.js`
- `node tests/act7-071-operator-host.test.js`
- `node tests/sprint5-static-check.js`
- `git diff --check`

The controlled acceptance source now requires a null NORMAL vote deadline and retains its real `sleep(61000)` late-third-vote scenario. It was not executed because it is a production fixture test and CA-276 forbids live fixtures/writes. The optional browser mock was not required for this SQL-only behavior change and was unavailable locally because `playwright` is not installed; no UI source changed, and both Player and Teacher countdown renderers already handle a null deadline.

## Deployment and rollback needs

Nothing is deployed by this packet. Production remains on the recovered pre-071 database and frozen Pages baseline.

Any deployment requires separate explicit production authorization. Because current production is pre-071 while current Teacher source uses the identity-bound six-argument Sprint5 Open Vote contract, the revised 071 SQL and matching reviewed Pages candidate must be released as one coordinated baseline. Do not apply only the new frontend caller to the old two-argument database endpoint.

Rollback requires the pinned revised `071_RECOVERY.sql` transaction and restoration/verification of the frozen Pages baseline. The recovery script restores the original automatic deadline functions and previous ACL envelope without deleting discussion messages, votes, rooms, or runs.

