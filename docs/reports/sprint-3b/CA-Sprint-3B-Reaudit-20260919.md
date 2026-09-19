# CA Sprint 3B Re-audit — ACT 1–5 Placeholder Flow / Route / Fold-Back

Date: 2026-09-19  
Auditor: CA — Coding Audit Agent  
Re-audit request: `agent-comms/CD_to_CA_20260919T121916Z_sprint3b-reaudit-request.md`  
Correction commit: `16dc097cf95dd00ac644697ad9cd8aff89a56213`  
Verification/report commit: `e1d43be5fb9831d2e0ee47a3d37bc8291a779077`  
Result: **FAIL — SECOND NARROW CORRECTION REQUIRED**

## 1. What is now fixed

The following findings from the first Sprint 3B audit are materially corrected and should be preserved:

- GA-approved Library Box fallback timings/text keys are integrated;
- dedicated `item.*` display-label mappings are integrated;
- generated localization now reflects the 323-entry canonical CSV;
- Inspect First is no longer treated as a final route;
- post-inspection Known/Unknown is Game Track-only;
- fold-back itself now has an explicit phase check and duplicate call rejection;
- first-meeting submission before the global ACT 1 scene gate is rejected;
- premature FOLLOW SIGN from the first ACT 2 route-consequence state is rejected;
- optional Gitte flashlight inclusion/exclusion is covered;
- ACT 2 1:1:1 re-vote → Library system fallback is covered;
- direct ACT 4 known/unknown and ACT 5 known/unknown majority paths are covered;
- concurrent correct Library Box submissions do not duplicate group items;
- Sprint 3B direct read/write RLS coverage is improved;
- Teacher Override remains correctly deferred to Sprint 3C.

These corrections are accepted.

However, four blocking integrity problems remain.

---

# 2. Blocking Finding A — transition guards still permit stale/repeated RPC state rewind

Migration 010 uses mutation triggers that check phase only when selected fields change.

That is not sufficient to make the RPC itself phase-authoritative.

## A1. s3b_apply_meeting_resolution can be replayed after ACT 2

The original function remains:

`s3b_apply_meeting_resolution(...)`

It does not read/validate the current scene before acting.

On its first call:

- `final_meeting_result` changes NULL → value;
- the migration-010 trigger validates ACT 2 phase.

On a later stale/repeated call:

- `final_meeting_result=coalesce(final_meeting_result,v_result)` leaves the field unchanged;
- therefore the trigger's NULL→value guard does not fire;
- the function still executes:
  - current_route_target reset;
  - wayfinding_target reset;
  - `s3b_set_scene(... act2_rendezvous ...)`.

Therefore a stale client can rewind a run from a later ACT back to ACT 2 rendezvous.

## A2. s3b_follow_sign can be replayed after reunion and rewind to Library Box

The function does not validate its current scene.

Once a player already has:

`player_location = library`

a later stale call writes the same value, so the trigger sees no location change and does not reject it.

If all three players already have library location, the function again executes the all-three branch:

- party_physically_reunited=true;
- silent_texting_mode=true;
- `s3b_set_scene(... act3_library / library_box ...)`.

Thus a stale FOLLOW SIGN call after ACT 4/5 can rewind the run to the Library Box.

## A3. s3b_leave_start_room can mutate later location backward

A later stale call can set:

`player_location = corridor`

even after the player has reached Library.

The migration-010 trigger only guards location change when the new value is `library`; it does not reject a later transition back to `corridor`.

## A4. s3b_initialize_flow remains replayable

Teacher initialization currently always calls:

`s3b_set_scene(... act1_wake_up ...)`

even when the Sprint 3B state already exists.

A repeated initialization can therefore reset the visible scene without resetting formal progress.

This is a state-consistency hazard.

## Required correction

Do not rely only on change-sensitive table triggers.

Add explicit current-scene/phase/state checks inside each public transition RPC before it mutates state.

At minimum rework:

- `s3b_initialize_flow`;
- `s3b_grab`;
- `s3b_leave_start_room`;
- `s3b_apply_meeting_resolution`;
- `s3b_follow_sign`.

Also review every other public mutating Sprint 3B RPC under the same stale/replay model.

Principle:

> A transition RPC is legal because the current server state authorizes that transition, not because a particular column happens to change on this invocation.

A repeated call may be:
- explicitly idempotent and return current state without side effects; or
- rejected as out-of-phase/already-complete.

It must never rewind or corrupt scene/location/history.

## Required tests

Add live negative tests that prove:

- replay `s3b_apply_meeting_resolution` after wayfinding/reunion is rejected and scene does not rewind;
- replay `s3b_follow_sign` after Library Box/ACT 4 is rejected and scene does not rewind;
- replay `s3b_leave_start_room` after Library arrival is rejected and player location remains Library;
- repeated `s3b_initialize_flow` after progress is rejected or harmlessly idempotent without resetting scene/progress.

---

# 3. Blocking Finding B — timed fallback says wheels are locked, but no wheel is actually locked

GA's canonical clarification added a HARD RULE:

90/105/120/135/150 sec:

- wheel 1/2/3/4/5 are progressively server-set to 4/1/7/3/9;
- each due wheel becomes a server-owned fixed wheel;
- players may operate only unlocked wheels.

Migration 010 currently stores only:

`puzzle_hint_stage`

and displays the corresponding text.

The current Library UI remains a free five-digit input:

```html
<input ... maxlength="5" pattern="[0-9]{5}">
```

The server's `s3b_submit_library_code()` also still accepts an arbitrary five-digit `p_code`.

Therefore after 90 sec the story says wheel 1 is locked to 4, but the player can still submit a code whose first digit is not 4.

The same applies to later locked wheels.

This is a real game-mechanic mismatch, not merely a rendering issue.

## Required correction

Implement actual server-authoritative locked-wheel semantics.

A minimal design may derive the fixed prefix from `puzzle_hint_stage` rather than storing five new columns, provided the contract is unambiguous and reconnect-safe.

For example:

- stage < 4 → no timeout-locked wheels;
- stage 4 → fixed prefix `4`;
- stage 5 → fixed prefix `41`;
- stage 6 → fixed prefix `417`;
- stage 7 → fixed prefix `4173`;
- stage 8 → fixed prefix `41739` and auto-resolved.

The server must prevent/ignore client attempts to alter the fixed positions.

The student UI must visually show fixed/locked digits and allow input only for remaining unlocked positions, or otherwise provide an equivalent interaction where locked positions cannot be edited.

Do not convert timeout lock actions into player attempts.

## Required tests

At minimum:

- stage 4 exposes fixed first digit 4;
- client cannot alter locked wheel 1;
- stage 5 fixes 41;
- stage 6 fixes 417;
- stage 7 fixes 4173;
- reconnect returns the same locked state;
- attempt_number changes only for genuine player submissions;
- stage 8 auto-resolves with zero fabricated player attempt.

---

# 4. Blocking Finding C — ACT 1 knowledge/evidence is persisted before the player is actually shown the canonical information

This is the most important behavior-validity problem in the current UI.

Migration 009 writes baseline facts/observations such as:

- Gitte heard Chapel warning;
- Gitte knows basic map / Number Note visible;
- Anna knows Great Hall outer lock;
- Linda knows Tower closure / visible objects;

and choice-specific consequences.

However, the current Sprint 3B student renderer starts the shared scene using:

`text_key = common.001`

and then immediately renders the role-specific ACT 1 action buttons.

It does not render the full role-specific ACT 1 canonical opening / automatic-visible information before the choice.

Examples:

For Gitte, canonical runtime includes:

- `act01-g.001`
- `act01-g.002`
- `act01-g.003`
- `act01-g.004`
- `act01-g.005`
- visible Number Note/map information, etc.

Yet the server can already persist:

`chapel_warning`

and other facts without those lines being shown in the Sprint 3B flow UI.

After a player submits the ACT 1 choice, migration 009 immediately persists the choice consequence, but the UI currently changes to a generic waiting message when the global scene is still ACT 1, and once all three choices are locked it advances the shared scene to ACT 2.

Therefore a fast/global transition can result in:

> database says player knows/saw/heard X  
> but the player was never shown X in the implemented flow.

That directly corrupts later:

- `player_knowledge_state`;
- information-sharing validity;
- original-vs-learned provenance;
- behavior analysis.

It also means the implemented gate is effectively:

`all three choices locked`

rather than V4.0's:

`each player's local ACT 1 consequence completed → player ACT 1 complete → all-three completion gate`.

## Required correction

Implement role-specific ACT 1 content delivery as part of Sprint 3B semantics, not merely database facts.

At minimum each player must receive, through canonical text_keys:

1. role-specific opening/automatic visible information;
2. private first action;
3. the canonical local consequence of that locked action;
4. explicit local completion/continue state;
5. only then `act1_complete=true`.

The global ACT 1 → ACT 2 transition must depend on all three players' actual ACT 1 completion, not merely their first-choice lock.

Reconnect must restore a player to the appropriate role-specific ACT 1 step/consequence until completion.

Facts/Observations that claim a player saw/heard/read something must be synchronized with the corresponding content delivery/completion event.

Do not fabricate behavior knowledge purely because a choice row exists.

This can remain a placeholder visual flow, but not a placeholder semantic flow.

## Required tests

For each role:

- automatic/baseline information is delivered before first action;
- choice-specific consequence is delivered after lock;
- other players cannot see it;
- reconnect during consequence restores it;
- player is not ACT 1 complete until consequence completion;
- one fast player cannot enter ACT 2 while another remains in ACT 1 consequence;
- all-three ACT 1 completion advances exactly once;
- every persisted ACT 1 observation/fact used for later analysis corresponds to content the player was actually sent.

---

# 5. Blocking Finding D — localization cleanup is incomplete in the active ACT 2 / ACT 5 DiscussionRoom

The Sprint 3B-specific panel removed several previously audited English strings.

However ACT 2 and ACT 5 now use the shared DiscussionRoom as active GAL runtime UI, and that component still displays hardcoded English/developer text such as:

- `Initial choices revealed`;
- `No messages yet.`;
- `Voting opens after the discussion.`;
- `WAITING FOR MISSING PLAYER`;
- `Vote resolved`;
- `Your vote is locked`;
- `Final vote`;
- `Previous vote rounds`;
- `Discussion complete.`;
- `vote round`;
- `silent texting`;
- submission-count/status prose.

The canonical localization catalog currently does not contain exact keys for many of these generic component strings.

Because these are now directly visible during ACT 2/5, they fall under the canonical GAL-facing localization contract.

## D1. Queued first-message template is still incomplete

The current UI renders only the localized choice/help text.

It omits the canonical player-name template.

The catalog already provides:

- `act02.010` = `{player_display_name} → {location}`
- `act02.011` = `{player_display_name} → Help! ...`

Use these templates.

For A–E, the `location` variable must already be localized.

Do not render only `library` / the standalone choice sentence without sender identity.

## D2. Required route-update message is not represented as an explicit transition

After ACT 2 final resolution, V4.0 requires the three GALs to receive:

- `act02.032` — MEETING POINT UPDATED: {location}
- `act02.033` — Change course now.

The current `s3b_apply_meeting_resolution()` moves directly into route consequence/Library wayfinding content.

Preserve the server route update, but ensure the canonical update message is actually delivered before the local consequence/fold-back phase.

## Required correction

- use canonical templates `act02.010/011` for queued first messages;
- deliver `act02.032/033` at the route update transition;
- remove or canonicalize active DiscussionRoom hardcoded English.

CA is sending GA a narrow request for generic DiscussionRoom UI localization keys where no canonical key currently exists.

Where a generic developer label is not necessary for gameplay, removing it from the GAL UI is acceptable and preferable to inventing wording.

CD must not create new Dutch/Chinese translations independently.

---

# 6. Non-blocking test-helper defect

`s3b_audit_set_puzzle_elapsed(...)` currently sets:

```text
puzzle_deadline =
now() - greatest(0, elapsed_seconds - 90)
```

For an audit request with elapsed < 90 sec, this sets the deadline to `now()`, which can make the refresh logic treat the first timeout stage as due.

This helper is AUDIT-only and the current 151-second test does not expose the defect, so it is not a production blocker.

Since migration 011 will be required anyway, correct the probe to preserve:

`puzzle_deadline = puzzle_started_at + 90 sec`

for all elapsed values.

Add at least one <90-sec test.

---

# 7. Test adequacy

The expanded 29-check suite is a substantial improvement.

Accepted new coverage includes:

- premature first-meeting rejection;
- duplicate fold-back rejection;
- ACT 2 re-vote/fallback;
- optional flashlight;
- direct ACT 4 unknown;
- ACT 5 known/unknown majority;
- non-terminal Inspect First;
- concurrent puzzle solve;
- run isolation;
- anonymous writes.

However the suite currently does not cover the stale/replay failures described in Finding A, real locked-wheel mechanics in Finding B, or ACT 1 content-delivery/evidence validity in Finding C.

The re-audit therefore cannot pass on 29/29 alone.

---

# 8. Correction strategy

Migrations 007–010 are now reported deployed.

Do not rewrite them.

Use another additive migration, recommended:

`database/011_sprint3b_transition_and_act1_delivery_integrity.sql`

Likely responsibilities:

- explicit transition-level phase/replay guards;
- ACT 1 per-player completion/content state;
- actual timed locked-wheel mechanics;
- any server fields required for canonical route-update delivery.

UI changes should:

- implement ACT 1 role-specific canonical text flow;
- show locked wheel state;
- use canonical ACT 2 templates;
- remove/canonicalize DiscussionRoom English.

Do not begin Sprint 3C while Sprint 3B remains failed.

---

# 9. Final result

**FAIL — SECOND NARROW CORRECTION REQUIRED**

This is not a request to rebuild Sprint 3B.

Migration 010 fixed the first audit's principal architecture problems, but current transition replay, wheel-lock mechanics, ACT 1 evidence validity, and active DiscussionRoom localization remain inconsistent with the canonical contracts.

After correction, submit a new CD→CA Sprint 3B re-audit request with:

- migration 011;
- stale/replay transition tests;
- ACT 1 content/completion model;
- locked-wheel model;
- queued-message/template evidence;
- route-update display evidence;
- DiscussionRoom localization changes;
- Sprint 1/2/3A regressions;
- expanded Sprint 3B result;
- Teacher Override still deferred;
- physical multi-device testing still NOT VERIFIED.
