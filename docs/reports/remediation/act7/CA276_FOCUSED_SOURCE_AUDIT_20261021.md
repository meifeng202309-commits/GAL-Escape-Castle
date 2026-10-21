# CA-276 — Teacher-paced NORMAL voting focused source audit

Date: 2026-10-21
Audit type: one concentrated Level 1 source-only P0 review
CD request: agent-comms/CD_to_CA_20261021T033500Z_ca276-teacher-paced-voting-source-ready.md
Baseline: 0c79e26c3f9973cd76b709cad1bc0d7f420c14db
Implementation: cf5ebd8c80f7ab6bc93cc93c44169c3f394e74d1

## Decision

**SOURCE PASS / PRODUCTION NOT VERIFIED.**
This authorizes no live write or game deployment. The previously known P0 remains present on the currently deployed public game until a separately authorized, coordinated release and minimal live check. No additional source-correction packet is requested.

## Scope and evidence

Actual implementation commit changes exactly six files: migration 071; its rollback SQL; two existing support/acceptance tests; the production-adapter's two hashes; and one lightweight source-policy test.

- Sprint5 NORMAL discussion setup sets a null phase deadline; exact-identity Teacher Open Vote sets a null NORMAL vote deadline.
- The older generic pre-037 refresh authority now ignores NORMAL discussion/voting deadline progression and generic Teacher Open Vote sets a null NORMAL vote deadline.
- The Sprint6 routing wrapper remains untouched; AUDIT timed branches remain.
- Existing voting/resolution code was not changed, limiting risk to entry and timer transitions.
- Recovery SQL updates both additional generic functions and preserves the previous Sprint5 restoration procedure.
- No protected role-owned canonical spec or localization change: canonical ownership check PASS.

## Patterns A–F, bounded

A: PASS source scope, existing transition owner is reused.
B: NOT VERIFIED live concurrency/reconnect at revised production migration; not a new predeployment source task.
C: PASS source: Teacher calls remain server-owned and bound to role/token; Sprint5 six-argument identity preserved.
D: PASS scope: no message/vote mutation or history deletion added.
E: PASS scope: no second new source-of-truth layer or additional runtime subsystem.
F: limitation: late-vote JS policy test models SQL behavior and searches policy strings; it is not an actual database execution. Live controlled acceptance was explicitly not run. Accordingly only SOURCE PASS is justified.

## Deployment boundary and next owner

The real public game remains the pre-071 database/Pages baseline; do not claim the P0 is fixed for Teacher yet.

CD reports coordinated revised 071 SQL + matching Pages candidate are necessary because current production lacks the six-argument Sprint5 Open Vote endpoint. The next legitimate decision is **Teacher authorization of one bounded coordinated deployment and immediate smoke**, with simple reviewed rollback on failure. No complex new framework, migration 072, Restart Vote or extra code audit is required just from this source review.

NEXT_OWNER: Teacher — authorize or decline the limited release. If authorized, CD is the implementation operator; return to CA only on evidenced deployment result or new P0.
