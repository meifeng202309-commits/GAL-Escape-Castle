FROM: CA
TO: CD
TIMESTAMP: 20260918T132305Z
SUBJECT: sprint2-audit-fail-corrections-required
STATUS: ACTION_REQUIRED

SOURCE FILES:
- docs/reports/sprint-2/CA-Sprint-2-Audit-20260918.md
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Codex程序开发说明书 V2.3.md
- database/002_runtime_runs_discussion.sql
- tests/sprint2-live-e2e.js

AUDIT BASELINE:
- 21f855afa19695d16ae888588eeb9a95bc28fcd5

IMPLEMENTATION COMMIT:
- 24ebea418c93d76038c477783970df4c53dd3d90

CA RESULT:
- FAIL — CORRECTIONS REQUIRED

BLOCKING FINDINGS:

1. ACT 6 fallback cannot be represented.

In s2_open_discussion(), SINGLE_REVOTE_THEN_FALLBACK currently requires fallback_resolution to match a configured vote option id.

V4.0 ACT 6 requires:
fallback_resolution = portrait_fixed_fallback

That is a system/story fallback identifier, not a player vote option.

Required:
- remove the generic requirement that fallback_resolution must equal vote_options[].id;
- support non-option server-authored fallback identifiers;
- add ACT2/ACT5/ACT6-style fallback tests.

2. round_no is incorrectly coupled to run-global vote_round.

s2_open_discussion() currently initializes:
round_no = v_round
vote_round = v_round

where v_round is max(vote_round across run)+1.

s2_submit_vote() then compares round_no against max_revotes.

Result:
a later independent SINGLE_REVOTE_THEN_FALLBACK discussion can skip its first required re-vote because round_no may already be 2/3/etc.

Required:
- make round_no local to one independent discussion/re-vote chain;
- initial independent discussion round_no = 1;
- re-vote increments round_no;
- do not use run-global vote numbering as max_revotes counter;
- add a sequential-discussion live test.

3. Current DiscussionRoom transcript is run-wide.

s2_get_player_state() and s2_get_teacher_state() return messages WHERE m.run_id = current run.
Student/teacher UI renders the whole array as the current transcript.

This will mix earlier ACT discussion messages into later DiscussionRooms.

Required:
- current transcript must be discussion_session_id-scoped;
- preserve old messages for history/audit separately;
- add a multi-discussion transcript-isolation test.

TEST GAP:

Current 17-check live suite does not test SINGLE_REVOTE_THEN_FALLBACK.
That omission allowed findings 1 and 2 to pass unnoticed.

Add live tests for:
- one re-vote then fallback;
- non-option ACT6 fallback;
- second independent discussion in same run;
- current transcript isolation.

Recommended additional evidence:
- invalid choice_id rejection live test;
- anonymous direct-write RLS rejection test.

DEPLOYMENT TRACEABILITY:

The audit request cites deployment acceptance report commit:
a4fb10b6d70e92615b73c344f7ae72f04f921bb9

GitHub did not resolve that SHA during CA audit.

Correct/provide a valid traceable deployment/report commit reference in the re-audit handoff.

MIGRATION RULE:

database/002_runtime_runs_discussion.sql has already been reported as deployed.

Do not rewrite deployed history merely to clean it up.

Use an additive migration, recommended:
database/003_sprint2_discussionroom_audit_fix.sql

Preserve:
- database/001_sprint1_core.sql unchanged;
- Sprint 1 semantics;
- existing formal history.

RE-AUDIT REQUEST MUST INCLUDE:

- correction commit SHA;
- additive migration path;
- exact functions/files changed;
- static test results;
- Sprint 1 live regression result;
- expanded Sprint 2 live E2E result;
- SINGLE_REVOTE_THEN_FALLBACK evidence;
- sequential-discussion/transcript-isolation evidence;
- corrected deployment/commit evidence;
- physical multi-device boundary still marked NOT VERIFIED.

DO NOT START SPRINT 3.

Full audit report:
docs/reports/sprint-2/CA-Sprint-2-Audit-20260918.md

COMMIT/WRITE STATUS: CA_AUDIT_FAIL_RECORDED
