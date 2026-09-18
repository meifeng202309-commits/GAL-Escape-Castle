# CA Sprint 2 Re-audit — Reusable DiscussionRoom

Date: 2026-09-19  
Auditor: CA — Coding Audit Agent  
Correction commit: `a74a5b25d5cf9081cdd0f7320c0c724b47ae08b6`  
Verification/report commit: `0a4dda4fca3a8df70d31e1f6eed6a876786614fc`  
Re-audit request: `agent-comms/CD_to_CA_20260918T163529Z_sprint2-reaudit-request.md`  
Result: **PASS — SPRINT 2 ACCEPTED**

## 1. Re-audit scope

This re-audit focuses on the three blocking findings from:

`docs/reports/sprint-2/CA-Sprint-2-Audit-20260918.md`

The three required corrections were:

1. allow non-option `fallback_resolution` for ACT 6;
2. decouple local `round_no` from run-wide `vote_round`;
3. isolate the current DiscussionRoom transcript by `discussion_session_id`.

Also reviewed:

- additive migration strategy;
- expanded test coverage;
- Sprint 1 regression evidence;
- deployment-evidence traceability;
- previously recorded physical-device boundary.

---

# 2. Finding A — fallback_resolution semantics

**PASS**

Migration:

`database/003_sprint2_discussionroom_audit_fix.sql`

removes the former requirement that:

`fallback_resolution`

must match a configured player vote option ID.

The corrected contract now accepts a non-empty server-authored fallback identifier for:

`SINGLE_REVOTE_THEN_FALLBACK`

while player-submitted `choice_id` remains validated exclusively against `vote_options`.

The expanded live test source explicitly covers:

- ACT2-style option fallback;
- ACT5-style option fallback;
- ACT6 non-option fallback:
  `portrait_fixed_fallback`.

This resolves the original ACT 6 incompatibility.

---

# 3. Finding B — local re-vote round semantics

**PASS**

A new independent DiscussionRoom now inserts:

`round_no = 1`

while `vote_round` remains monotonic within the run.

On a tie re-vote:

`round_no = previous round_no + 1`

and:

`vote_round = previous vote_round + 1`.

The re-vote allowance is evaluated from local `round_no`, so a later independent DiscussionRoom no longer loses its own permitted re-vote because earlier discussions occurred in the same run.

The expanded test source explicitly checks:

- a second independent DiscussionRoom in the same run;
- its local `round_no === 1`;
- first 1:1:1 creates the allowed re-vote;
- second 1:1:1 falls back when `max_revotes = 1`.

This resolves the original run-global round coupling defect.

---

# 4. Finding C — current transcript isolation

**PASS**

Both:

- `s2_get_player_state()`
- `s2_get_teacher_state()`

now filter current `messages` by:

`discussion_session_id = current discussion_session_id`.

Teacher state separately returns:

`message_history`

as the run-wide historical transcript.

The expanded live test source explicitly checks that:

- discussion B current transcript excludes discussion A;
- discussion A remains persisted in teacher `message_history`.

This resolves the original run-wide current-transcript defect.

---

# 5. Additive migration discipline

**PASS**

The correction is implemented in:

`database/003_sprint2_discussionroom_audit_fix.sql`

The deployed-history files:

- `database/001_sprint1_core.sql`
- `database/002_runtime_runs_discussion.sql`

were not rewritten as part of the correction commit.

The fix uses `CREATE OR REPLACE FUNCTION` for the affected Sprint 2 RPCs and preserves existing formal run / vote / message history.

This complies with the repository's additive-migration rule.

---

# 6. Test coverage review

**PASS**

The updated `tests/sprint2-live-e2e.js` contains 23 named acceptance checks:

- 20 direct `pass(...)` cases;
- 3 expected-rejection cases.

The newly added coverage includes:

- SINGLE_REVOTE_THEN_FALLBACK;
- ACT2 option fallback;
- ACT5 option fallback;
- ACT6 `portrait_fixed_fallback`;
- exactly one allowed re-vote;
- second independent discussion local round reset;
- transcript isolation;
- preserved teacher message history;
- invalid `choice_id` rejection;
- anonymous direct table write rejection.

The static test was also expanded to require migration 003 and check the corrected SQL structure.

---

# 7. Reported deployment / live evidence

CD reports, after migration 003 deployment:

- Sprint 1 live regression: **40/40 PASS**
- Sprint 2 live E2E: **23/23 PASS**
- Supabase SQL Editor migration result: **Success. No rows returned**

The correction and verification GitHub commit SHAs are valid and traceable in this re-audit.

CA did not independently re-execute the external Supabase live suite in this review session; the live results above are accepted as repository-recorded post-deployment evidence supported by the updated test source and traceable verification report.

This distinction must remain visible.

---

# 8. Non-blocking semantic note

Fallback outcomes currently use:

`outcome.type = "fallback"`

which correctly distinguishes them from player-majority outcomes.

However, the fallback identifier is still serialized under a JSON field named:

`choice_id`

even when the value is a system resolution such as:

`portrait_fixed_fallback`.

This is **not a Sprint 2 blocker** because:

- it is not inserted into `runtime_player_decisions` as a player choice;
- `outcome.type = "fallback"` preserves the immediate semantic distinction.

Before Sprint 3 / formal state-machine binding consumes these outcomes broadly, CD should prefer an explicit downstream contract such as:

- `resolution_id` or `fallback_resolution`;
- plus `resolution_source = system_fallback`.

This prevents future code/export logic from misreading a system fallback as a genuine player-selected option.

---

# 9. Boundaries that remain NOT VERIFIED

The following remain **NOT VERIFIED** and are not upgraded by this Sprint 2 PASS:

- three separate physical student devices plus one teacher device;
- classroom Wi-Fi/mobile latency and packet-loss behavior;
- long-duration classroom session behavior.

Also still outside Sprint 2:

- Pocket / Knowledge;
- full ACT 1–14 state-machine binding;
- final export;
- Asset Manager runtime publishing;
- Agent analysis;
- localization integration into full scene runtime.

---

# 10. Localization boundary

PASS.

The Sprint 2 correction did not absorb the newly canonical localization layer.

The canonical catalog remains a prerequisite for later scene-text integration:

`docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`

This is consistent with GA's explicit boundary and Codex V2.3.

---

# 11. Final result

**PASS — SPRINT 2 ACCEPTED**

The corrected reusable DiscussionRoom now satisfies the three blocking requirements from the original CA audit.

Sprint 2 can be treated as accepted at the code/spec + repository-recorded automated deployment/E2E evidence level.

This PASS does **not** itself authorize Sprint 3. The project should still follow the existing rule:

`CA PASS + user approval → next Sprint`.

The physical classroom/device verification boundary remains explicitly open.
