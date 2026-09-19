# CA Sprint 3B Second-Correction Re-audit

Date: 2026-09-19  
Auditor: CA — Coding Audit Agent  
Re-audit request: `agent-comms/CD_to_CA_20260919T171123Z_sprint3b-second-correction-reaudit-request.md`  
Correction commits:
- `1856db569ef82c7b9cb8f35d5c18822d30bfaed5`
- `1dc2394`
- `c290118`
- `578f8739974a1ea9888b66fb247c104e01e7003f`

Result: **FAIL — TWO NARROW BLOCKERS REMAIN**

## 1. What now passes

The second-correction work materially resolves most of the previous re-audit findings:

- guarded wrapper RPCs reject the tested stale/replay paths;
- ACT 1 now has explicit per-player stages:
  - opening
  - action
  - consequence
  - complete;
- ACT 1 role-specific opening/consequence text keys are persisted and reconnectable;
- global ACT 2 start waits for all three local ACT 1 completions;
- server-owned `puzzle_locked_prefix` now represents timed wheel locking;
- player submissions that alter the locked prefix are rejected by the guarded wrapper;
- UI displays locked prefix separately from remaining editable digits;
- <90 sec audit timing is corrected;
- 90/105/120/135/150 second fallback progression is represented;
- final timeout auto-resolution does not create a player attempt;
- sender-aware ACT 2 queued-message templates use canonical `act02.010/.011`;
- route-update uses canonical `act02.032/.033`;
- GA-approved `discussion.*` localization keys are integrated;
- the four developer/status labels GA ordered removed are removed from active DiscussionRoom UI;
- canonical localization artifact is regenerated to 333 entries;
- recorded live regressions are:
  - Sprint 1: 40/40 PASS
  - Sprint 2: 23/23 PASS
  - Sprint 3A: 15/15 PASS
  - Sprint 3B: 39/39 PASS

These improvements should be preserved.

---

# 2. Blocking Finding A — renamed pre011 implementations remain browser-executable

Migration 011 protects public Sprint 3B transitions by:

1. renaming the previously deployed public RPCs to `*_pre011`;
2. creating guarded wrapper functions under the original RPC names.

Example:

```sql
alter function public.s3b_follow_sign(text,text)
  rename to s3b_follow_sign_pre011;
```

and then a new guarded:

```sql
public.s3b_follow_sign(...)
```

However, migration 011 does **not** revoke EXECUTE from the renamed `*_pre011` functions.

This is a real permission bypass.

Migration 007 previously explicitly granted these original functions to:

```text
anon, authenticated
```

and migration 010 also granted the later post-inspection function.

PostgreSQL function rename preserves the function object's privileges.

Therefore the renamed implementations inherit their prior browser-callable EXECUTE grants.

A client can potentially call, for example:

- `s3b_follow_sign_pre011`
- `s3b_apply_meeting_resolution_pre011`
- `s3b_leave_start_room_pre011`
- `s3b_submit_library_code_pre011`
- `s3b_submit_act4_choice_pre011`
- `s3b_apply_act5_resolution_pre011`
- `s3b_choose_post_inspection_route_pre011`

directly and bypass the new migration-011 wrapper guards.

This defeats the central server-authority repair that migration 011 was intended to establish.

The current 39-check suite tests only the guarded original names and does not test direct access to renamed implementations.

## Required correction

Use a new additive migration.

Recommended:

```text
database/012_sprint3b_internal_wrapper_lockdown_and_route_delivery.sql
```

Revoke execution from all renamed implementation helpers:

```sql
REVOKE EXECUTE ON FUNCTION ..._pre011(...) FROM PUBLIC, anon, authenticated;
```

At minimum cover every implementation renamed in migration 011:

- s3b_initialize_flow_pre011
- s3b_submit_first_meeting_pre011
- s3b_grab_pre011
- s3b_leave_start_room_pre011
- s3b_apply_meeting_resolution_pre011
- s3b_complete_foldback_pre011
- s3b_follow_sign_pre011
- s3b_submit_library_code_pre011
- s3b_submit_act4_choice_pre011
- s3b_apply_act5_resolution_pre011
- s3b_choose_post_inspection_route_pre011
- s3b_get_player_state_pre011

The public guarded wrappers remain callable.

Do not expose internal implementation helpers through PostgREST.

## Required live/static evidence

Add tests proving at least representative browser calls to:

- `s3b_follow_sign_pre011`
- `s3b_apply_meeting_resolution_pre011`
- `s3b_submit_library_code_pre011`

are denied/not executable to anon/authenticated clients.

Static test should fail if any `*_pre011` helper is not explicitly revoked.

This is a hard blocker because it is an actual authorization bypass.

---

# 3. Blocking Finding B — ACT 2 route-update acknowledgement is global, not delivered to all three GALs

V4.0 explicitly requires, after the authoritative meeting result:

> 三名 GAL 同时看到:
>
> MEETING POINT UPDATED: [LOCATION]
>
> Change course now.

Migration 011 introduces a persisted global scene:

```text
scene_id = act2_route_update
phase_key = route_update
text_key = act02.032
```

This is a good improvement.

However:

`s3b_ack_route_update(...)`

accepts a single player session and immediately changes the **global** scene to:

```text
act2_rendezvous / route_consequence
```

The current live helper confirms the intended behavior:

```js
resolveMeeting(f) {
  apply_meeting_resolution(player 0);
  ack_route_update(player 0);
}
```

Only one player acknowledges the route update.

Therefore the first player who sees/clicks CONTINUE can advance the shared scene before the other two clients poll or reconnect.

The other two players can then miss:

- `act02.032`
- `act02.033`

entirely.

That does not satisfy "三名 GAL 同时看到" and reintroduces the same evidence-delivery problem that Sprint 3B was being corrected to avoid.

## Required correction

Track route-update delivery/ack per player.

A minimal design may add, for example:

```text
route_update_ack_at
```

to `s3b_player_progress`, or an equivalent per-player state.

Required behavior:

1. authoritative route result enters global `route_update`;
2. each of the three players independently receives `act02.032/.033`;
3. each player ACKs their own route-update delivery;
4. reconnect restores route_update for any player who has not acknowledged it;
5. global scene advances to route consequence only after all three required players have acknowledged;
6. duplicate ACK from one player is rejected/idempotent and cannot substitute for another player.

No player behavior score should be created from this acknowledgement.

## Required tests

- player A ACK alone → global scene remains route_update;
- player B ACK → still route_update;
- player C ACK → only then transition to route_consequence;
- reconnect of an unacknowledged player still shows route update;
- duplicate A ACK does not advance count;
- all three see the same canonical resolved location.

---

# 4. ACT 1 content review

**PASS for this re-audit scope**

The role text-key lists are consistent with the current V4.0 content.

Anna's reuse of Gitte's `TIME — 23:47` and `NO SIGNAL` keys matches the V4.0 exact wording.

Linda's reuse of the shared `NO SIGNAL` wording is also semantically consistent.

Using `act01-g.018` for the common prompt "What do you do first?" is not ideal taxonomy, but the rendered canonical wording is exact and this does not justify another content-key migration under the project ~5% governance threshold.

No blocker recorded here.

---

# 5. Locked-wheel correction

**PASS**

Migration 011 now records:

`puzzle_locked_prefix`

and the guarded public Library submission rejects codes whose locked prefix is modified.

The UI renders the locked prefix separately and asks only for remaining digits.

Reconnect state exposes the persisted prefix.

The 90/105/120/135/150 progression matches GA's canonical clarification.

This finding is accepted, subject to Finding A: the old unguarded pre011 submission function must be made unreachable.

---

# 6. DiscussionRoom localization

**PASS**

GA's canonical updates are present:

- V4.0 DiscussionRoom rule commit:
  `0429a0e0282edee5f1bbcb27b433d8c6a9041777`
- localization commit:
  `416ec6969acaa16c624068a3718b4fbc554d10a6`
- GA response:
  `ad2ef4f418a4895b12a6425edc41396a3201913b`

The active student UI binds the ten required `discussion.*` keys.

The four labels GA marked as developer/internal are removed.

No new translation source was introduced.

---

# 7. Test status

The reported 39/39 suite is useful and substantially stronger than the previous suite.

However, it does not exercise:

- direct invocation of renamed `*_pre011` implementation functions;
- three-player route-update acknowledgement/delivery.

Therefore 39/39 cannot establish Sprint 3B acceptance yet.

---

# 8. Final result

**FAIL — TWO NARROW BLOCKERS REMAIN**

Do not rebuild Sprint 3B.

Use additive migration 012 to:

1. revoke all browser/public EXECUTE access to the renamed `*_pre011` functions;
2. make route-update delivery/acknowledgement per-player and require all three before global advancement.

Do not begin Sprint 3C until this passes re-audit.

Physical three-student + teacher multi-device verification remains:

**NOT VERIFIED**
