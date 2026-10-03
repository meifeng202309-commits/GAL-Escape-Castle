# Manual Acceptance Residual — ACT7 Round 2 vote cannot reopen after timeout

Date: 2026-10-03  
Room observed by Teacher: `TEST01`  
Frozen public frontend: `891feffe558a4683ac3da67e1e6b15e902c7e592`  
Scope: human/manual acceptance run

## Observed player-facing symptom

In ACT7 Clock Room, vote round 2, all three Player pages showed the canonical DiscussionRoom but no vote buttons.

The visible state included:

- `Stemronde 2 / 第 2 轮投票`;
- `WACHTEN OP EEN SPELER DIE NOG NIET HEEFT INGEDIEND / 等待尚未提交的玩家`;
- `0/3 stemmen ontvangen / 已收到 0/3 票`;
- countdown values reaching 0;
- message composer visible on captured Player pages;
- no selectable Clock A / Clock B / Clock C voting controls.

Teacher therefore could not continue natural ACT7 voting.

## Source diagnosis

The frozen frontend intentionally renders **no vote buttons** when canonical discussion status is `waiting_for_missing_player`:

- `src/game/app.js` → `renderVote(state)`
- for `discussion.status === "waiting_for_missing_player"`, the UI renders only the warning/progress notice.

The generic Sprint2 Teacher time-extension authority, `s2_add_time`, explicitly reopens a timed-out missing-player vote:

```sql
set status = case
  when status = 'waiting_for_missing_player' then 'voting'
  else status
end,
phase_deadline = ...
```

The Sprint5 Teacher time-extension authority used in ACT6–8, `s5_teacher_add_time`, does **not** perform that status transition. It only extends `phase_deadline` while allowing status in:

`discussion / voting / waiting_for_missing_player`

Therefore, once ACT7 reaches `waiting_for_missing_player`, adding time can leave the session in `waiting_for_missing_player`; the Player renderer continues to suppress vote buttons.

The Sprint5 `Open vote now` authority is also not a recovery path from this state because `s5_teacher_open_vote` only updates rows currently in `discussion`.

Current projected Emergency Override coverage is limited to specific ACT1–5 states and does not provide an ACT7 recovery action.

Runtime-group initializer `s5_initialize` is not a valid recovery for an already initialized ACT6–8 runtime.

## Classification

**HARD BLOCKER — authorized Teacher recovery unavailable**

Under `MANUAL_ACCEPTANCE_READINESS_PLAN_V0.2.md`:

- natural ACT1→ACT14 acceptance cannot continue through ordinary Player action;
- no existing authorized Teacher recovery restores ACT7 voting from this state;
- ad hoc DB/RPC mutation is prohibited.

Therefore this manual run should stop at this boundary rather than invent an ungoverned continuation.

## Narrow correction target

Expected behavioral contract:

> For Sprint5 ACT6–8 canonical discussions, when a Teacher validly adds time while the session is `waiting_for_missing_player`, the discussion must reopen to `voting` with a fresh deadline so missing Players can submit.

This should be validated at minimum for the shared Sprint5 discussion authority, including ACT7 round > 1.

No broader timer redesign, ACT7 duration-policy change, gameplay rewrite, or Teacher Console hardening is requested by this finding.

## Regression coverage expected after correction

A focused test should prove:

1. ACT7 vote reaches `waiting_for_missing_player`.
2. Teacher adds time.
3. authoritative status becomes `voting`.
4. fresh deadline is present.
5. missing Player sees Clock A/B/C vote buttons again.
6. already submitted votes remain preserved where applicable.
7. the missing Player can submit and the round resolves/continues normally.
8. ACT6 and ACT8 shared Sprint5 add-time behavior do not regress.

## Evidence status

Teacher supplied three Player screenshots in the live acceptance chat showing ACT7 round 2 with no vote controls and `0/3` waiting state at countdown values near/at zero.

Repository binary copies of those chat screenshots are not part of this note; the source-level mismatch above independently identifies the recovery defect.
