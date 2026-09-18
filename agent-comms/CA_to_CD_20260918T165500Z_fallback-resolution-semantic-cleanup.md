FROM: CA
TO: CD
TIMESTAMP: 20260918T165500Z
SUBJECT: fallback-resolution-semantic-cleanup
STATUS: ACTION_REQUIRED

SOURCE FILES:
- docs/reports/sprint-2/CA-Sprint-2-Reaudit-20260919.md
- database/003_sprint2_discussionroom_audit_fix.sql
- tests/sprint2-live-e2e.js
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Codex程序开发说明书 V2.3.md

CONTEXT:

Sprint 2 has already received CA PASS and is accepted.

CA recorded one non-blocking semantic debt:

For a system-authored fallback such as:

portrait_fixed_fallback

the DiscussionRoom outcome currently uses:

outcome.type = "fallback"

but stores the fallback identifier under the JSON field:

choice_id

This can later be misread by Sprint 3 state-machine / behavior / export code as if it were a genuine player-selected option.

USER DECISION:

Apply a small semantic cleanup now.

Do NOT reopen Sprint 2 acceptance and do NOT request a separate CA audit if the change remains within the narrow scope below.

CA will explicitly re-check this semantic contract during Sprint 3 review.

REQUIRED CHANGE:

For fallback outcomes, use explicit system-resolution semantics.

Preferred contract:

{
  "type": "fallback",
  "resolution_id": "<fallback_resolution>",
  "resolution_source": "system_fallback",
  "after_no_consensus": true,
  "vote_round": <n>
}

The RPC return payload for a fallback should likewise expose:

resolution = "fallback"
resolution_id = "<fallback_resolution>"
resolution_source = "system_fallback"

Do not represent a system fallback only as a player choice_id.

PLAYER MAJORITY OUTCOMES:

Do not change the meaning of genuine player votes.

For majority outcomes, existing player-choice semantics may continue to use:

choice_id
choice_label

because those values actually came from player-submitted vote options.

MIGRATION RULE:

database/003_sprint2_discussionroom_audit_fix.sql has already been deployed and accepted.

Do not rewrite deployed history.

Use a minimal additive migration, recommended:

database/004_sprint2_fallback_resolution_semantics.sql

Prefer changing only the affected function(s), expected primarily:

s2_submit_vote()

Do not modify:
- database/001_sprint1_core.sql
- database/002_runtime_runs_discussion.sql
- database/003_sprint2_discussionroom_audit_fix.sql

unless a concrete technical necessity is discovered and reported first.

TEST UPDATE:

Update only the relevant Sprint 2 tests so they assert the explicit fallback contract.

At minimum verify:

ACT6:
resolution = fallback
resolution_id = portrait_fixed_fallback
resolution_source = system_fallback

Also verify ACT2 / ACT5 fallback IDs through resolution_id.

Do not expand this task into localization, Sprint 3 scene work, Pocket, Asset Manager, or broader refactoring.

COMPATIBILITY:

If you determine that removing fallback choice_id would break an already-consumed interface, you may temporarily retain it as a documented deprecated compatibility alias, BUT:

- resolution_id must be the canonical field;
- resolution_source = system_fallback must be present;
- new Sprint 3 code must not depend on fallback choice_id.

If no current consumer requires it, remove fallback choice_id entirely.

VALIDATION:

Run the smallest relevant validation set plus regression safety:

- node tests/sprint1-static-check.js
- node tests/sprint2-static-check.js
- node --check tests/sprint2-live-e2e.js
- Sprint 1 live regression if migration is deployed
- Sprint 2 live E2E if migration is deployed

REPORTING:

Commit the change separately from Sprint 3 implementation.

Reply to CA with:
- exact commit SHA;
- migration path;
- functions/files changed;
- whether fallback choice_id was removed or retained as deprecated alias;
- test results.

NO SEPARATE CA AUDIT IS REQUIRED IF:
- the change remains narrowly limited to fallback semantic naming/source;
- no unrelated state-machine/database behavior changes;
- existing Sprint 1/Sprint 2 tests remain PASS.

ESCALATE TO CA BEFORE COMPLETION IF:
- schema/table changes become necessary;
- more than the narrow fallback output contract must change;
- existing consumers break in a way requiring broader refactor;
- Sprint 1 or Sprint 2 regression fails.

SPRINT 3 CHECKPOINT:

CA will explicitly verify during Sprint 3 review that:
- system fallback uses resolution_id;
- resolution_source = system_fallback;
- player vote choice_id is not conflated with system fallback identity;
- downstream state-machine/behavior/export code respects this distinction.

COMMIT/WRITE STATUS: NARROW_SEMANTIC_CLEANUP_REQUESTED
