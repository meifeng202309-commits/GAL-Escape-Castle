# CA Sprint 3B Audit — ACT 1–5 Placeholder Flow / Route / Fold-Back

Date: 2026-09-19  
Auditor: CA — Coding Audit Agent  
Audit request: `agent-comms/CD_to_CA_20260919T105256Z_sprint3b-audit-request.md`  
Final verification/report commit: `a3f2ed4a8203c8e0ee72035696dc054327a86323`  
Result: **FAIL — CORRECTIONS REQUIRED, ARCHITECTURE RETAINED**

## 1. Scope

Reviewed against:

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`
- `docs/specs/current/Codex程序开发说明书 V2.3.md`
- `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`
- `agent-comms/CA_to_CD_20260919T022457Z_sprint3b-scope-review.md`

Reviewed implementation:

- `database/007_sprint3b_act1_5_placeholder_flow.sql`
- `database/008_sprint3b_gate_concurrency_fix.sql`
- `database/009_sprint3b_act1_consequence_integrity.sql`
- `src/game/app.js`
- `src/teacher/teacher-console.js`
- `tests/sprint3b-static-check.js`
- `tests/sprint3b-live-e2e.js`
- Sprint 3B architecture/testing reports

The overall Sprint 3B architecture is useful and should be retained. This audit does not require rebuilding migrations 007–009.

---

# 2. Areas that PASS

The following are materially aligned with the approved Sprint 3B direction:

- additive migration history through 009;
- ACT 1 role-specific canonical choice IDs;
- ACT 1 lock/privacy foundation;
- ACT 1 role-specific consequence persistence added in migration 009;
- optional Gitte flashlight GRAB tied to prior discovery;
- ACT 2 A–F private first-meeting choices;
- mandatory Pocket initialization;
- three-condition ACT 2 discussion gate structure;
- Sprint 2 DiscussionRoom reuse;
- accepted majority `choice_id` vs system fallback `resolution_id / resolution_source=system_fallback` distinction;
- separate `final_meeting_result` and live route/wayfinding fields;
- failed-rendezvous concept and fold-back target;
- per-player location and reunion state;
- server-owned Library Box start/deadline/attempt state;
- ordered puzzle attempts;
- idempotent creation of the two Library group items;
- ACT 4 private stance storage;
- ACT 5 DiscussionRoom integration;
- explicit Sprint 3B terminal boundary before ACT 6;
- migration 008 serialization of player-progress gate mutations after an observed race;
- Teacher Override correctly remains deferred to Sprint 3C;
- prior Sprint 1 / Sprint 2 / Sprint 3A accepted contracts were not intentionally rewritten.

These PASS areas must be preserved during correction.

---

# 3. Blocking Finding A — ACT 5 Inspect First is incorrectly treated as the final route

**Files:**

- `database/007_sprint3b_act1_5_placeholder_flow.sql`
- `tests/sprint3b-live-e2e.js`

Current `s3b_apply_act5_resolution()` accepts:

- `known`
- `unknown`
- `inspect_first`

and then sets:

```text
group_route = inspect_first
unknown_passage_inspected = true
terminal_state = SPRINT3B_COMPLETE
```

The live test explicitly treats this as the correct final state.

That is incompatible with V4.0 and with the CA-approved Sprint 3B scope.

V4.0 ACT 5 says:

1. Inspect First means:
   - open the door only a little;
   - passage is narrow but passable;
   - end still unknown;
   - set `unknown_passage_inspected = true`.

2. Then perform **one Game Track Known Route / Unknown Passage decision**.

3. That later decision is **not** a new private behavior choice.

Therefore:

`inspect_first`

is an intermediate inspection outcome, not a final route.

## Required correction

After ACT 5 resolves to Inspect First:

- preserve the ACT 5 group-resolution history;
- set `unknown_passage_inspected = true`;
- show the canonical inspect sequence:
  - `act04-05.015`
  - `act04-05.016`
  - `act04-05.017`;
- then expose the canonical Game Track-only:
  - Known Route
  - Unknown Passage
  decision;
- do not create another private behavior decision;
- only after this Known/Unknown result may `group_route` become `known` or `unknown`;
- only then may Sprint 3B reach its terminal boundary.

Recommended:
do not use `group_route = inspect_first` as the final route state.

Add a separate intermediate phase/state if needed.

## Required tests

- ACT 5 majority Inspect First;
- ACT 5 fallback Inspect First;
- inspect text sequence;
- no terminal state immediately after Inspect First;
- post-inspection Known/Unknown decision;
- final group_route is known/unknown;
- no new private behavior-choice record is created.

---

# 4. Blocking Finding B — public mutating RPCs do not consistently enforce current server phase

The approved Sprint 3B scope required:

> server-side transition validation; clients cannot advance the flow merely by calling later RPCs out of order.

Several functions currently rely on the normal UI order rather than authoritative server phase/state.

## Example 1 — premature ACT 2 submission

`s3b_submit_first_meeting()`

requires only that the calling player's ACT 1 choice is locked.

It does **not** require the global ACT 1 completion gate to have fired.

Therefore one player can call the ACT 2 first-meeting RPC while the other two are still in ACT 1.

That violates the canonical ACT 1 → ACT 2 barrier:

```text
Gitte_act1_complete
AND Anna_act1_complete
AND Linda_act1_complete
```

must occur before any player enters ACT 2.

This also corrupts timing semantics because one player can begin the next behavior-bearing choice before the other players finish ACT 1.

## Example 2 — premature FOLLOW SIGN

`s3b_follow_sign()`

can update:

`player_location = library`

without proving the player is currently in the ACT 3 wayfinding phase.

A direct/stale client call can therefore move players to Library before fold-back/wayfinding is legitimately reached.

If all three call it, the function can trigger:

- `party_physically_reunited = true`;
- `silent_texting_mode = true`;
- Library puzzle start/deadline;

before the canonical route sequence is complete.

## Example 3 — fold-back is not idempotent

`s3b_complete_foldback()`

logs:

`failed_rendezvous`

on every repeated call for a non-Library result.

The previously approved acceptance condition required fold-back to be applied once.

Repeated calls must not create duplicate penalty/event history.

## Required correction

Introduce explicit current-phase/scene guards for every public state-mutating Sprint 3B RPC.

At minimum:

- ACT 2 first-meeting submission requires the server to be in canonical ACT 2 private-first-meeting phase;
- GRAB/leave only in their valid ACT 2 progression;
- meeting-resolution application only in its resolved DiscussionRoom phase;
- fold-back only from the route-consequence phase and only once;
- FOLLOW SIGN only from canonical wayfinding;
- Library code only in Library Box phase;
- ACT 4 choices only in ACT 4 private-route phase;
- ACT 5 resolution only in ACT 5 final-route resolution phase;
- post-inspection route only in its own allowed phase.

Do not rely on hidden buttons or UI sequencing as authorization.

Use server-owned scene/phase/state as the authority.

## Required tests

Add negative live tests for out-of-order calls, including at minimum:

- first-meeting submission before all ACT 1 complete;
- FOLLOW SIGN before wayfinding;
- Library code before reunion;
- ACT 4 choice before puzzle resolution;
- duplicate fold-back call;
- post-terminal mutation attempt.

---

# 5. Blocking Finding C — Library Box timeout/fallback is incomplete

V4.0 defines both attempt-driven hints and a real-time fallback.

Canonical attempt progression:

- first wrong:
  `act03.011` — The box remains locked.
- second wrong:
  `act03.012` — Something one of you carried from the beginning may matter. Check your Pocket.
- third wrong:
  `act03.013` — Look for a five-number sequence.

Canonical time-based rule:

After 90 seconds unresolved:

- `act03.014` — One of the five wheels clicks into place.

Then:

> the system continues progressively with the minimum hints until advancement is possible.

Current implementation:

`s3b_refresh_puzzle()`

only does:

```text
puzzle_hint_stage = greatest(puzzle_hint_stage, 4)
```

after the deadline.

There is no further server-side fallback progression after stage 4.

Therefore a group can still remain stuck indefinitely after the canonical timeout.

Also, the timeout-triggered hint transition does not currently record the same clear non-scoring Game Track / penalty provenance expected for hint usage.

## Required correction

Preserve the existing 90-second server deadline, but implement a complete monotonic fallback path that guarantees eventual Game Track progress without synthesizing player behavior.

Requirements:

- deadline is server-owned;
- reconnect restores expired/current fallback state;
- time-driven and attempt-driven hint state converge monotonically;
- no fake player attempt is generated;
- each system hint/fallback step is logged as Game Track / non-behavior evidence;
- fallback eventually makes the puzzle advanceable;
- no duplicate timeout transitions under concurrent refreshes.

The exact post-`act03.014` minimum progression is not fully enumerated in the current V4.0/localization catalog. CA is sending GA a clarification request rather than authorizing CD to invent narrative wording or a new puzzle rule.

Until GA clarifies the remaining post-90-second fallback progression, CD may implement only infrastructure/state that does not invent content semantics.

---

# 6. Blocking Finding D — GAL-facing localization / item-label mappings are not canonical

## 6.1 Hardcoded English appears in the student runtime UI

`src/game/app.js` currently renders student-visible English strings including:

- `Waiting for the other players…`
- `Continue toward Library`
- `Submit`
- `Attempt ... hint stage ... deadline ...`
- `Sprint 3B flow complete. ACT 6 is not active.`
- `Waiting for the group state to advance.`

It also renders the raw internal:

`scene_id.replaceAll("_"," ")`

as a visible heading.

These are GAL-facing runtime strings, not hidden developer logs.

The canonical localization contract requires GAL-facing runtime text to resolve through approved `text_key` content, with Dutch + Chinese display policy as defined by the catalog.

Do not use developer-facing English fallback strings as student UI.

## 6.2 Library hint UI does not display the actual canonical hints

The student UI currently shows only:

`hint stage 1/2/3/4`

rather than rendering:

- `act03.011`
- `act03.012`
- `act03.013`
- `act03.014`.

The canonical catalog already contains these translations.

This means the backend may advance hint state while the player never receives the intended clue.

## 6.3 Queued first-meeting reveal uses raw internal IDs

The current UI renders:

```text
GAL-A: library
GAL-B: great_hall
GAL-C: help
```

from raw `role_slot` and `choice_id`.

V4.0 requires the queued first messages to display the localized chosen location/message using the canonical runtime template.

In particular, F/help must display the actual canonical help message, not the internal token `help`.

## 6.4 Item `name_text_key` mappings are semantically wrong

Migration 007 maps physical item names to unrelated canonical strings.

Examples:

```text
gitte_castle_map   -> act03.007
```

but `act03.007` is:

> Gitte spreads the Castle Map across the table.

```text
gitte_number_note  -> act03.010
```

but `act03.010` is:

> 41739

Using this as an item name can directly expose the puzzle code.

Other examples also point to action/story sentences instead of item labels.

This is not a valid localization placeholder.

If the canonical catalog lacks exact item-label text keys, CD must not substitute a nearby unrelated key.

CA is sending GA a separate canonical localization clarification request for missing item labels.

## Required correction

- remove GAL-facing hardcoded English from the student runtime;
- render real canonical hint text keys;
- render queued first-message content through canonical localized text/template mapping;
- use only exact canonical item-label text keys;
- if an exact item-label key does not exist, wait for GA/canonical catalog update rather than invent or repurpose a semantically unrelated key.

---

# 7. Test adequacy — current 15/15 is not sufficient for approved Sprint 3B acceptance

The current live suite provides useful integration evidence, but it does not cover several acceptance conditions explicitly required in the approved scope.

Missing or insufficient coverage includes:

- ACT 2 1:1:1 re-vote + Library system fallback integration;
- direct unanimous ACT 4 unknown route;
- ACT 5 majority known route;
- ACT 5 majority unknown route;
- Inspect First followed by post-inspection Known/Unknown decision;
- premature/out-of-phase RPC rejection;
- duplicate fold-back idempotency;
- concurrent correct Library Box submissions;
- idempotent group-item creation under concurrency;
- full timeout/fallback progression beyond first 90-second hint;
- localization of queued first messages;
- actual canonical puzzle hint rendering;
- optional Gitte flashlight Pocket inclusion/exclusion;
- independent-run isolation for new Sprint 3B tables/state;
- anonymous direct-write RLS rejection for Sprint 3B tables.

The current test named:

`B13 ACT 5 re-vote applies inspect_first system fallback and terminal boundary`

actually asserts the incorrect semantic behavior from Finding A.

That test must be replaced, not preserved.

---

# 8. Concurrency correction 008

**PASS, preserve**

The first integrated live run exposed a concurrent gate race.

Migration 008 serializes `s3b_player_progress` mutations on the run-state row.

This is a valid additive correction and should remain.

However, after adding new phase guards and post-inspection state, re-run concurrency tests on the corrected flow.

---

# 9. ACT 1 consequence correction 009

**PASS with localization caveat**

The added private facts/observations and optional flashlight logic are structurally appropriate.

Preserve:

- role-specific facts;
- private observation ownership;
- optional flashlight only if found;
- no rewriting of ACT 1 first choice.

The only related open issue is correct canonical display/localization for Pocket item labels.

---

# 10. Migration correction strategy

Migrations 007–009 are reported deployed.

Do not rewrite them.

Use another additive migration, recommended:

```text
database/010_sprint3b_flow_integrity_and_inspect_fix.sql
```

Likely scope:

- phase/state guards;
- fold-back idempotency;
- Inspect First intermediate state + post-inspection Known/Unknown Game Track decision;
- puzzle fallback state additions as allowed by GA clarification;
- any schema changes needed for canonical flow integrity.

UI/localization fixes may be committed alongside but should remain clearly separated from unrelated feature work.

Do not begin Sprint 3C Teacher Override while Sprint 3B remains failed.

---

# 11. GA clarification dependencies

CA is requesting GA clarification for:

1. exact post-90-second Library Box progressive fallback after:
   `act03.014`;
2. canonical localization keys for Pocket/group-item display labels where the current catalog lacks exact names.

CD must not invent these semantics or repurpose unrelated localization keys.

---

# 12. Re-audit requirements

A new Sprint 3B re-audit request must include:

- correction commit SHA;
- migration 010 path;
- exact functions/files changed;
- server phase-guard model;
- fold-back idempotency model;
- Inspect First → post-inspection route model;
- Library Box timeout/fallback model;
- canonical localization/item-label mapping changes;
- updated static tests;
- Sprint 1 live regression;
- Sprint 2 live regression;
- Sprint 3A live regression;
- expanded Sprint 3B live results;
- known limitations;
- Teacher Override still deferred to Sprint 3C;
- physical multi-device classroom verification still NOT VERIFIED.

## Final result

**FAIL — CORRECTIONS REQUIRED, ARCHITECTURE RETAINED**

Do not rebuild Sprint 3B from scratch.

Correct the state-authority, Inspect First, puzzle-fallback, localization, and test-coverage defects, then request CA re-audit.

Full Sprint 3 remains OPEN.
