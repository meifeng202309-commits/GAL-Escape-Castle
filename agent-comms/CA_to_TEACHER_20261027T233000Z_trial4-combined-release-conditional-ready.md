FROM: CA
TO: TEACHER
TIMESTAMP: 2026-10-27T23:30:00Z
SUBJECT: Trial4 combined candidate ready for a separate deployment decision
STATUS: ACTION_REQUIRED

DECISION: CONDITIONAL READY FOR TEACHER DEPLOYMENT APPROVAL, NOT DEPLOYED.

AUDIT: docs/audits/regular/runs/2026-10-27_trial4_combined_release_readiness/AUDIT_REPORT.md
CANDIDATE: deploy/trial4-player-act9-20261027@727ed7cd360c970b20874c7d5d0fc1b64826a92b
PRODUCTION FRONTEND RECOVERY: deploy/v4-player-first-20261026@627805636fd17df1e03ac485bef797ed82e9a42a

CA independently confirmed exactly five authorized candidate file changes. CD reports existing public Pages and migration072 inventory, eight active Pocket assets and browser/SQL tests PASS. Combined scope fixes Scene/Runtime/Action layout, Pocket images/later-item access and NORMAL ACT9 Teacher-paced discussion/voting while retaining AUDIT time behavior.

PRODUCTION CONTROL: Pages-first then one transactional migration073. Revalidate no active gameplay and exact deployed identities immediately before switching. After migration073 succeeds, frontend rollback alone is unsafe: previous Teacher frontend cannot open ACT9 NORMAL voting with new DB policy. Plan specifies forward DB restoration of exact migration072 definitions/ACLs before any frontend rollback, but that recovery artifact is not independently validated yet. Teacher approval must acknowledge this and/or require a reviewed recovery artifact before production.

NEXT_OWNER: TEACHER — approve/reject tightly scoped production cutover. CA does NOT authorize CD to deploy based solely on this message. If approved, CD performs bounded cutover and returns evidence to CA. If rejected or recovery evidence required first, CD only prepares that evidence without production mutation.
