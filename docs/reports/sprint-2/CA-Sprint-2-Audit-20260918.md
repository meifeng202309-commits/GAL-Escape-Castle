# CA Sprint 2 Audit — Reusable DiscussionRoom

Date: 2026-09-18  
Auditor: CA — Coding Audit Agent  
Audit baseline: `21f855afa19695d16ae888588eeb9a95bc28fcd5`  
Implementation commit: `24ebea418c93d76038c477783970df4c53dd3d90`  
Result: **FAIL — CORRECTIONS REQUIRED**

## 1. Scope

Reviewed against:

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`
- `docs/specs/current/Codex程序开发说明书 V2.3.md`
- Sprint 1 verified compatibility boundary
- Sprint 2 implementation / tests / reports

Reviewed implementation:

- `database/002_runtime_runs_discussion.sql`
- `index.html`
- `teacher.html`
- `src/game/app.js`
- `src/teacher/teacher-console.js`
- `tests/sprint2-static-check.js`
- `tests/sprint2-live-e2e.js`
- Sprint 2 architecture/testing/completion reports

This audit distinguishes:

- code/spec audit;
- reported deployed migration evidence;
- automated live E2E evidence;
- remaining physical multi-device verification.

## 2. Areas that PASS code/spec review

The following implementation areas are materially sound:

- additive Sprint 2 boundary; Sprint 1 schema/RPC semantics preserved;
- server-generated `run_id`;
- one active formal run per room;
- immutable `run_mode` / `behavior_dataset_eligible`;
- RLS enabled on all five new tables;
- public browser access routed through token-checked SECURITY DEFINER RPCs;
- internal helper RPC execution revoked from anon/authenticated;
- no service-role key in browser/runtime source;
- server-timestamped dialogue persistence;
- canonical server-side vote-label resolution from configured options;
- duplicate vote protection;
- pre-resolution vote privacy for other players and teacher;
- 3:0 and 2:1 majority semantics;
- 1:1:1 no-action behavior;
- missing-player deadline -> WAITING_FOR_MISSING_PLAYER;
- no synthesized missing vote;
- teacher-authenticated Add Time;
- reconnect restoration;
- no final export generation;
- no Pocket / Asset Manager / full-story / Agent-analysis scope creep.

The supplied live suite gives useful evidence for these cases, but does not cover the blocking findings below.

---

# 3. Blocking Finding A — SINGLE_REVOTE_THEN_FALLBACK cannot represent ACT 6

**File:** `database/002_runtime_runs_discussion.sql`  
**Function:** `s2_open_discussion(...)`

The function validates that, for `SINGLE_REVOTE_THEN_FALLBACK`, `fallback_resolution` must equal one of the configured vote option IDs.

Current logic raises:

```text
fallback_resolution must match a configured vote option id.
```

That is incompatible with canonical V4.0 ACT 6.

V4.0 ACT 6 explicitly defines:

```text
tie_policy = SINGLE_REVOTE_THEN_FALLBACK
max_revotes = 1
fallback_resolution = portrait_fixed_fallback
```

`portrait_fixed_fallback` is a system/story resolution, not one of the four player question-option IDs.

Therefore the reusable component cannot open the canonical ACT 6 DiscussionRoom with the required configuration.

## Required correction

Treat `fallback_resolution` as a server-authored resolution identifier, not necessarily as a vote option.

Do not require it to match `vote_options[].id`.

If a scene needs a fallback that selects a configured option, that scene may use the same ID voluntarily, but the generic contract must also support non-option system fallback identifiers such as:

```text
portrait_fixed_fallback
```

## Required tests

Add live coverage for at least:

1. ACT2-style fallback that happens to equal a configured option ID;
2. ACT5-style fallback that happens to equal a configured option ID;
3. ACT6-style non-option fallback `portrait_fixed_fallback`;
4. first 1:1:1 -> exactly one re-vote;
5. second 1:1:1 -> fallback resolution.

---

# 4. Blocking Finding B — round_no is incorrectly coupled to run-global vote_round

**File:** `database/002_runtime_runs_discussion.sql`  
**Functions:** `s2_open_discussion(...)`, `s2_submit_vote(...)`

Current initial discussion creation does:

```text
v_round = max(vote_round across the run) + 1

round_no = v_round
vote_round = v_round
```

Later, `SINGLE_REVOTE_THEN_FALLBACK` decides whether another re-vote is allowed using:

```text
v_session.round_no <= max_revotes
```

This makes `round_no` accidentally depend on how many earlier DiscussionRooms happened in the same run.

### Concrete failure

Assume:

- first independent DiscussionRoom already used `vote_round = 1`;
- later ACT 5 or ACT 6 opens a new independent DiscussionRoom;
- `s2_open_discussion` creates it with `round_no = 2`;
- scene config says `max_revotes = 1`;
- first 1:1:1 occurs.

The current condition evaluates:

```text
2 <= 1  -> false
```

so the component skips the one required re-vote and falls back immediately.

This directly conflicts with V4.0, where ACT 2, ACT 5, and ACT 6 each independently allow one re-vote.

## Required correction

Separate the semantics:

- `round_no` = local discussion/re-vote number inside the current interaction chain;
- initial independent DiscussionRoom starts with `round_no = 1`;
- tie-break DiscussionRoom increments to `round_no = 2`, etc.;
- `max_revotes` must be evaluated from this local chain;
- `vote_round` remains the decision identity round and must never overwrite old votes.

The exact numbering strategy for `vote_round` may remain monotonic if desired, but it must not determine the scene-local re-vote allowance.

## Required tests

In one formal run:

1. complete one independent discussion;
2. open a second independent `SINGLE_REVOTE_THEN_FALLBACK` discussion;
3. force 1:1:1;
4. verify a new discussion session is created rather than immediate fallback;
5. force 1:1:1 again;
6. verify fallback occurs exactly after the allowed re-vote.

---

# 5. Blocking Finding C — current DiscussionRoom transcript is run-wide, not session-scoped

**Files:**

- `database/002_runtime_runs_discussion.sql`
- `src/game/app.js`
- `src/teacher/teacher-console.js`

Both `s2_get_player_state` and `s2_get_teacher_state` build `messages` with:

```text
WHERE m.run_id = current run
```

rather than filtering the current `discussion_session_id`.

Both student and teacher UIs then render every returned message directly as the current DiscussionRoom transcript.

The schema deliberately stores `discussion_session_id`, and V4.0 allows multiple discussion periods in one run/scene. In the final ACT 1–14 game, ACT 2 / ACT 5 / ACT 6 / later discussions must not appear as one undifferentiated current chat window.

Without correction, an ACT 2 message can remain visibly mixed into ACT 5 or ACT 6.

## Required correction

For the **current DiscussionRoom transcript**, return/render only messages for the current `discussion_session_id`.

If full historical transcript is desired for audit/export, expose it separately, for example:

```text
current_messages
message_history
```

or another clearly separated history structure.

Do not use one run-wide array as the current-room transcript.

For a tie-break re-vote, the product may intentionally display selected prior context, but that should be an explicit UI/history decision rather than an accidental run-wide query.

## Required tests

Add a multi-discussion test:

1. open discussion A and send messages;
2. resolve it;
3. open independent discussion B;
4. send new messages;
5. current player and teacher transcript for B must not contain A messages;
6. historical A messages must still remain persisted and queryable for audit/history.

---

# 6. Test adequacy finding

The existing `tests/sprint2-live-e2e.js` meaningfully verifies REPEAT_UNTIL_MAJORITY and NO_TIE_POSSIBLE behavior, but it does **not** exercise the canonical `SINGLE_REVOTE_THEN_FALLBACK` path.

Because of this, both Blocking Finding A and Blocking Finding B passed the existing 17-check suite undetected.

The correction must expand automated live coverage before re-audit.

Also recommended:

- invalid `choice_id` rejection test;
- direct anonymous write attempt on at least one Sprint 2 table in addition to direct-read RLS checks.

These two recommendations are not the primary reason for FAIL, but they strengthen the claimed access/canonical-option evidence.

---

# 7. Deployment-evidence traceability issue

The audit request cites:

```text
Deployment acceptance report commit:
a4fb10b6d70e92615b73c344f7ae72f04f921bb9
```

GitHub did not resolve that SHA during CA review.

The deployment/testing reports are present in the final audit baseline and state:

- migration applied successfully;
- Sprint 1 live E2E 40/40;
- Sprint 2 live E2E 17/17;
- GitHub Pages smoke verified.

CA therefore treats the report contents as **reported deployment evidence**, but the specific `a4fb10...` commit reference is **NOT VERIFIED / not traceable**.

Before re-audit, CD should correct the commit reference in the handoff/report or provide the valid traceable commit/deployment reference.

This evidence issue is secondary to the code/spec defects above.

---

# 8. Physical-device boundary

Preserve the existing boundary:

**NOT VERIFIED**

- full joined-state walkthrough on three separate physical student devices plus one teacher device;
- classroom Wi-Fi/mobile latency and packet-loss behavior;
- long-duration classroom session behavior.

A future PASS on the code/spec audit must not silently convert these into verified claims.

---

# 9. Migration correction strategy

`database/002_runtime_runs_discussion.sql` has already been reported as deployed.

Do **not** rewrite deployment history merely to make the file look cleaner.

Use an additive migration, e.g.:

```text
database/003_sprint2_discussionroom_audit_fix.sql
```

to replace/adjust the affected functions and any required schema behavior.

Keep:

- `001_sprint1_core.sql` unchanged;
- Sprint 1 semantics unchanged;
- existing persisted Sprint 2 history non-destructive.

Update tests and reports to describe the additive fix.

---

# 10. Re-audit acceptance condition

CA will re-audit when CD sends a new protocol-compliant request containing:

- correction commit SHA;
- additive migration path;
- exact functions/files changed;
- new static test results;
- Sprint 1 live regression result;
- expanded Sprint 2 live E2E result;
- explicit SINGLE_REVOTE_THEN_FALLBACK tests;
- sequential-discussion / transcript-isolation test;
- valid deployment/commit evidence;
- unchanged physical-device NOT VERIFIED boundary.

## Final result

**FAIL — CORRECTIONS REQUIRED**

Do not begin Sprint 3 yet.

Sprint 2 remains implemented and deployed as a useful prototype, but it is not accepted as the reusable canonical DiscussionRoom until the defects above are corrected and re-audited.
