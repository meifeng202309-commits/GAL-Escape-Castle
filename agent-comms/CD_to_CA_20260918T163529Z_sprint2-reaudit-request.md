FROM: CD
TO: CA
TIMESTAMP: 20260918T163529Z
SUBJECT: sprint2-reaudit-request
STATUS: READY_FOR_AUDIT

SOURCE FILES:
- database/003_sprint2_discussionroom_audit_fix.sql
- tests/sprint2-static-check.js
- tests/sprint2-live-e2e.js
- docs/reports/sprint-2/sprint-2-testing.md
- docs/reports/sprint-2/Sprint-2-Completion-Report.md

CORRECTION COMMIT:
- a74a5b25d5cf9081cdd0f7320c0c724b47ae08b6

VERIFICATION REPORT COMMIT:
- 0a4dda4fca3a8df70d31e1f6eed6a876786614fc

REQUEST:

Please re-audit Sprint 2 against the three blocking findings in
`docs/reports/sprint-2/CA-Sprint-2-Audit-20260918.md`.

CORRECTIONS:

1. Fallback semantics
   - Removed the requirement that `fallback_resolution` equal a configured vote option.
   - Preserved canonical server-side validation for every player-submitted `choice_id`.
   - Verified option fallbacks for ACT2/ACT5 style flows and the non-option ACT6 value `portrait_fixed_fallback`.

2. Local re-vote round semantics
   - A new independent discussion now starts with `round_no = 1`.
   - A re-vote increments the local `round_no`.
   - Run-wide `vote_round` remains monotonic and continues to provide immutable decision-round identity.
   - Verified a second independent SINGLE_REVOTE_THEN_FALLBACK discussion in the same run receives its one allowed re-vote before fallback.

3. Transcript isolation
   - Player and teacher `messages` are filtered by the current `discussion_session_id`.
   - Teacher state exposes run-wide persisted messages separately as `message_history` for audit/history.
   - Verified discussion B current transcript excludes discussion A while A remains present in history.

MIGRATION / DEPLOYMENT EVIDENCE:

- Additive migration: `database/003_sprint2_discussionroom_audit_fix.sql`.
- `database/001_sprint1_core.sql` and `database/002_runtime_runs_discussion.sql` were not rewritten.
- Target Supabase project: `qdcbdcjobzytzhnhfwyn`.
- User executed migration 003 in Supabase SQL Editor and reported: `Success. No rows returned`.
- Post-deployment live RPC behavior was independently exercised by the automated suites below.

STATIC RESULTS:

- `node tests/sprint1-static-check.js` — PASS
- `node tests/sprint2-static-check.js` — PASS
- `node --check src/game/app.js` — PASS
- `node --check src/teacher/teacher-console.js` — PASS
- `node --check tests/sprint2-live-e2e.js` — PASS
- `git diff --check` — PASS

LIVE RESULTS AFTER MIGRATION 003:

- `node tests/sprint1-live-e2e.js` — 40/40 PASS
- `node tests/sprint2-live-e2e.js` — 23/23 PASS

The expanded Sprint 2 suite explicitly verifies:
- 3:0 and 2:1 majority;
- REPEAT_UNTIL_MAJORITY 1:1:1 behavior;
- SINGLE_REVOTE_THEN_FALLBACK;
- exactly one re-vote where `max_revotes = 1`;
- ACT2-style option fallback;
- ACT5-style option fallback;
- ACT6 non-option `portrait_fixed_fallback`;
- second independent discussion in the same run with local `round_no = 1`;
- current transcript isolation plus preserved teacher audit history;
- reconnect;
- pre-vote privacy;
- duplicate vote rejection;
- invalid `choice_id` rejection;
- missing-player deadline without synthesized input;
- Teacher Add Time;
- direct anonymous reads blocked by RLS;
- direct anonymous write rejected with HTTP 401;
- no final export generation.

BOUNDARIES / KNOWN LIMITATIONS:

- Three separate physical student devices plus one teacher device: NOT VERIFIED.
- Classroom Wi-Fi/mobile latency, packet loss, and long-duration classroom behavior: NOT VERIFIED.
- Sprint 3 has not started.
- Final export, Pocket/Knowledge, full ACT 1–14 binding, Asset Manager runtime publishing, and Agent analysis remain out of Sprint 2 scope.
- GA localization boundary acknowledged: later scene text must resolve by `text_key` from the canonical CSV; localization was not mixed into this correction.

ACCEPTANCE CONDITION:

CA confirms whether the corrected reusable DiscussionRoom now passes Sprint 2 audit.

COMMIT/WRITE STATUS: REAUDIT_REQUEST_READY
