# Sprint5 ACT 6–8 + visual-dynamic UI — Focused Level 1 Re-audit

Baseline: `2e97415ed54788d657a9dab662c101f9c9ec01e6`  
Scope: closure of `S5-CA-001`, `S5-CA-002`, `S5-CA-003`, `S5-RC-001`, plus directly adjacent regression risk  
Audit level: Level 1 — Focused re-audit  
Decision: **FAIL / BLOCKED — FOUR ORIGINAL FINDINGS REMAIN PARTIALLY OPEN; ONE NEW ADJACENT BLOCKER**

## 1. Inputs and independence

CA froze the submitted correction baseline and independently reconstructed the correction from:

- `database/029_sprint5_canonical_discussion_localization.sql`;
- `database/030_sprint5_exact_session_messages.sql`;
- `src/game/app.js`;
- `src/styles/app.css`;
- `tests/sprint5-live-e2e.js`;
- `tests/sprint5-static-check.js`;
- current V4.0 ACT6–8 canonical sections;
- current Codex V2.3 localization / workflow contracts;
- existing Sprint2 DiscussionRoom, Sprint3A evidence/share, Sprint3B share-permission and Sprint4 Asset Manager behavior.

Migrations 029 and 030 are reported deployed and are treated as immutable history.

CD-reported live/browser results are supporting evidence. Findings below are independently reproducible from the submitted source/control flow.

## 2. Closure matrix

| Finding | Re-audit status | Result |
|---|---|---|
| S5-CA-001 HIGH | **PARTIALLY_FIXED / OPEN** | Real timed DiscussionRoom, exact-session messaging and ACT8 DB-level share semantics now exist, but required evidence access/share behavior is still missing from the actual GAL UI and ACT6 SHARE PHOTO remains disabled. |
| S5-CA-002 HIGH | **PARTIALLY_FIXED / OPEN** | Sprint5 text now largely uses canonical localization keys, but required map/evidence presentation steps are still absent, including ACT6 map highlight and ACT8 evidence screen. |
| S5-CA-003 MEDIUM | **PARTIALLY_FIXED / OPEN** | CSS eye substitute was removed and approved anchors are consumed, but Clock B is still wired to a non-existent CSS class and therefore does not run backward as specified. |
| S5-RC-001 MEDIUM | **PARTIALLY_FIXED / OPEN** | Mirror-trigger split and ACT6 fallback round history are corrected for the player path, but Teacher Console still resolves “current discussion” through the legacy global-max vote-round reader and can show a stale session during Sprint5. |
| S5-RC-002 MEDIUM | **NEW / CONFIRMED** | 029 places the discussion-status gate before the pre-existing request-id replay check, breaking idempotent retry after a terminal vote commits but its response is lost. |

## 3. S5-CA-001 HIGH — canonical discussion exists, but the required evidence interaction is still incomplete

### What is fixed

Migration 029 materially improves the model:

- Sprint5 round UUID is now also the real `discussion_sessions` UUID;
- ACT6 opens a 90-second discussion;
- ACT7 new rounds open 15-second discussions;
- ACT8 disagreement opens a 180-second discussion;
- vote submission is blocked until the exact session reaches `voting`;
- migration 030 supplies exact-session message identity / replay protection;
- ACT8 server permission enables SHARE PHOTO;
- focused E2E verifies that Linda's Closure Order does not appear in Anna's `shared_photos` before a real share and does appear afterward.

These are valid corrections.

### What remains open

The canonical behavior surface is still not available to students as required.

#### A. ACT6 SHARE PHOTO is still disabled

V4.0 ACT6 explicitly configures:

- `allow_free_text = true`;
- `allow_pocket = true`;
- `allow_share_photo = true`.

But `s5_configure_discussion(...)` sets:

`allow_share_photo = (p_phase = 'act8_final_vote')`.

The Sprint3B `s3_share_photo(...)` authority additionally requires `s3_runtime_scene_state.allow_share_photo = true`.

Sprint5 only explicitly turns that scene flag on after ACT8 disagreement.

Therefore ACT6 still cannot perform the canonical SHARE PHOTO action.

#### B. ACT6 and ACT7 Pocket/evidence access is not rendered

`refreshState(...)` fetches `s3_get_player_state(...)`, but `renderSprint5(...)` only interpolates `pocketHtml` inside the ACT8 visual branch.

ACT6 and ACT7 therefore receive no actual Pocket/evidence panel in their Sprint5 UI.

This matters directly in ACT7 because the canonical puzzle requires players to be able to inspect:

- `GROUP FOUND ITEMS → Torn Note`;
- Linda's `MY ITEMS → Stopped Watch`;
- the watch front value;
- the back/FLIP evidence if not previously discovered.

The current UI cannot show those contents or perform that inspection.

#### C. ACT8 Memories / shared evidence is not rendered

The Sprint3A state contains:

- `observations`;
- `knowledge`;
- `shared_photos`;
- personal items;
- group items.

But current `pocketHtml` renders only:

- `pocket.items`;
- `pocket.group_items`.

It does not render `observations`, `knowledge` or `shared_photos`.

So Linda can create a valid shared-photo record, and the recipient can possess that copy in server state, but Gitte/Anna cannot actually see the received photo in the GAL interface. Likewise `MY MEMORIES & OBSERVATIONS` remains inaccessible.

### Impact

The database now records some canonical evidence operations, but the actual collaborative behavior surface is still incomplete. This is especially material in ACT8, whose purpose is to observe information integration before a final route decision.

### Closure condition

ACT6/7/8 must expose the canonical evidence controls to the GALs in the scenes where they are allowed. ACT6 SHARE PHOTO must be authorized. ACT7 puzzle evidence must be inspectable. ACT8 must visibly expose Memories & Observations and received shared-photo evidence while preserving privacy/provenance.

CA is not prescribing UI layout or component structure.

## 4. S5-CA-002 HIGH — localization authority improved, but canonical presentation flow remains incomplete

### What is fixed

The former English-only Sprint5 choice/wall strings have largely been replaced with localization keys. Static checks now reject several prior hardcoded canonical strings.

The main response/choice text path now resolves Nederlands + 中文 through the canonical localization representation.

### What remains open

Required canonical presentation steps are still absent.

#### A. ACT6 map transition is text-only

After the Portrait answer, V4.0 requires:

- show `prop_gitte_castle_map`;
- highlight Portrait Hall → Clock Room in HTML/SVG;
- display `act06.011`;
- then `act06.012` FOLLOW MAP.

The correction displays `act06.011` and the button, but the client contains no Castle Map reference/highlight path. `hydrateS5Assets(...)` still resolves `shared.portrait_hall` for ACT6 based only on `act_no===6`.

So the canonical visual transition is still missing.

#### B. ACT8 evidence screen is still not implemented

Before ACT8 private first choice, V4.0 requires a combined evidence screen including:

- group-visible Castle Map;
- `GROUP FOUND ITEMS → prop.photo_1897`;
- Linda's private Closure Order for Linda only unless she shares it.

When `act_no===8` and no route has yet been selected, `hydrateS5Assets(...)` selects no asset because `route_taken_act8` is null.

The current ACT8 pre-route UI therefore does not present the required map/photo evidence screen; it mainly shows private-choice state and item labels.

### Impact

This is not only visual polish. ACT8's route choice is explicitly based on comparing the map, 1897 photograph and Linda's private closure evidence. Omitting the evidence presentation changes the decision context.

### Closure condition

The missing canonical ACT6 map transition and ACT8 evidence presentation must be present and driven by approved canonical asset/text identities. No required evidence step may be reduced to a label-only placeholder if the player must inspect it to make the canonical decision.

CA is not prescribing rendering architecture.

## 5. S5-CA-003 MEDIUM — anchor contract is now used, but Clock B still does not run backward

### What is fixed

The correction removes the former CSS `● ●` portrait-eye substitute.

`hydrateS5Assets(...)` now:

- requires ACTIVE asset resolution;
- reads `ui_anchors`;
- consumes `portrait_main_face` on both base and paired overlay;
- consumes `clock_A_face`, `clock_B_face`, `clock_C_face`;
- explicitly reports unavailable asset/anchor state rather than placing exact overlays against unknown geometry.

This closes the main anchor-authority portion of the original finding.

### Remaining defect

The ACT7 markup renders Clock B as:

`<i class="hand counter"></i>`

but current CSS defines the reverse animation class as:

`.counterclockwise { animation: clock-turn ... reverse }`

There is no `.counter` rule.

Therefore Clock B's second hand receives no reverse animation and does not satisfy the canonical:

`second_hand = counter-clockwise animation`.

The focused static test does not check this class-to-style connection.

### Closure condition

Clock B must actually receive the counter-clockwise animation in the rendered implementation, with the class/style wiring verified by regression coverage.

Actual pixel alignment against final ACTIVE Portrait/Clock production assets remains **NOT VERIFIED** because the production registry currently lacks the required ACTIVE portrait set. That external asset availability does not by itself block core Sprint5 code closure.

## 6. S5-RC-001 MEDIUM — player current-session semantics improved; Teacher current-session semantics remain stale

### What is fixed

- migration 029 disables the migration-028 mirror trigger;
- the same Sprint5 UUID now owns real DiscussionRoom state and event FK identity;
- terminal paths update both `discussion_sessions` and `s5_rounds`;
- the ACT6 second-tie fallback now leaves a resolved history;
- player refresh uses `s5_get_discussion_state(...)` rather than relying on legacy run-wide max vote round.

### What remains open

Teacher Console still calls:

`s2_get_teacher_state(...)`

through `loadDiscussionState(...)`.

The legacy teacher-state reader selects:

`discussion_sessions where run_id = ... order by vote_round desc limit 1`.

Sprint5 intentionally resets `vote_round` at each phase:

- ACT6 starts at 1;
- ACT7 starts at 1;
- ACT8 final vote starts at 1.

Therefore an older ACT6 round 2 — or an earlier legacy canonical discussion with a numerically larger run-wide round — can remain the row selected by the Teacher Console while the actual Sprint5 interaction is now ACT7 or ACT8.

The player path is exact-session; the Teacher path is still global-max-round.

### Impact

The project has two different “current discussion” truths depending on whether the consumer is a GAL or the Teacher Console. This is exactly the split/stale state class the original finding required to close.

### Closure condition

Teacher current-discussion state must identify the same authoritative Sprint5 interaction as the player runtime, not a stale row selected by unrelated numeric vote-round ordering.

CA is not prescribing whether this is solved by a new teacher RPC, an existing-state wrapper or another compatible mechanism.

## 7. S5-RC-002 MEDIUM — terminal vote retry loses idempotency

The original Sprint5 vote function deliberately checked `client_request_id` replay identity before rejecting the interaction as stale.

Migration 029 adds a wrapper around that function.

The wrapper first performs:

`select ... discussion_sessions ... for update`

then rejects unless:

`ds.status in ('voting','waiting_for_missing_player')`.

Only after that does it call `s5_submit_vote_pre029(...)`, where the existing request-id replay check lives.

A deterministic failure sequence is:

1. player submits the final vote of a round;
2. transaction commits;
3. DiscussionRoom becomes `resolved`;
4. network response is lost;
5. client retries the same request ID and same payload;
6. 029 wrapper sees `resolved` and raises “Sprint 5 voting is not open”;
7. pre029 never reaches the idempotent replay branch.

No duplicate vote is created, but the established retry contract is broken precisely at the most important uncertain-response boundary.

### Closure condition

A committed vote retried with the same request identity and identical content must remain safely recognizable as an idempotent replay even after that vote resolved/advanced the round. A conflicting reuse of the same request identity must still fail.

CA is not prescribing wrapper order or transaction structure.

## 8. Test / evidence review

CD reports:

- migrations 029 and 030 deployed successfully;
- Sprint5 focused live E2E PASS;
- Sprint2 live 23/23 PASS;
- Sprint3B remediation live 15/15 PASS;
- Sprint3C live 15/15 PASS;
- Sprint2 / Sprint3B remediation / Sprint4 / Sprint5 static suites PASS;
- GitHub Pages browser verified bilingual ACT6, a real DiscussionRoom, countdown, message composer and pre-vote gate;
- no full Sprint4 live PASS is claimed because `ASSET_MANAGER_REVIEWER_TOKEN` was unavailable;
- current production registry returned `ASSET_UNAVAILABLE · shared.portrait_hall`, so no production-pixel anchor screenshot is claimed.

These results support the parts marked fixed above.

They do not challenge:

- ACT6 photo sharing;
- ACT6/7 actual Pocket evidence UI;
- ACT8 Memories & Observations / received shared-photo rendering;
- ACT6 Castle Map highlight;
- ACT8 map + 1897 photograph evidence screen;
- Clock B class-to-animation wiring;
- Teacher exact-current Sprint5 session selection;
- same-request retry after the terminal vote already committed and resolved the session.

The current focused E2E also validates shared-photo persistence by querying server state, not by proving that the recipient can see/inspect the received evidence in the rendered GAL UI.

## 9. Mandatory recurring-error pattern scan

| Pattern | Result | Focused result |
|---|---|---|
| A — local correctness / cross-module handoff | **FINDING** | DB-level share/pocket state exists but the GAL evidence UI does not expose the same semantics; player exact discussion state and Teacher current discussion still diverge. |
| B — happy-path / distributed boundary | **FINDING** | S5-RC-002: final-vote commit + lost response + same-request retry is no longer idempotent because the wrapper rejects resolved sessions before replay recognition. |
| C — UI rule mistaken for server rule | **FINDING** | ACT6 `allow_share_photo` is still false at server authority while the canonical interaction says true; several evidence capabilities exist only as server data and are not usable GAL interactions. |
| D — current state vs historical evidence | PASS for ACT6 fallback closure; **FINDING adjacent** | ACT6 fallback now resolves both histories, but Teacher still exposes stale legacy “current discussion” semantics. |
| E — authority accretion / legacy reachability | **FINDING** | Player Sprint5 state moved to exact-session authority while Teacher Console remains coupled to legacy global-max-round semantics. |
| F — self-confirming tests | **FINDING** | Tests verify server persistence and source-string presence but do not falsify recipient visibility, map/evidence rendering, Clock B animation wiring, Teacher stale-session selection or terminal replay after response loss. |

## 10. Gate disposition

**Sprint5 remains BLOCKED.**

Open findings:

- `S5-CA-001 HIGH` — **PARTIALLY_FIXED / OPEN**;
- `S5-CA-002 HIGH` — **PARTIALLY_FIXED / OPEN**;
- `S5-CA-003 MEDIUM` — **PARTIALLY_FIXED / OPEN**;
- `S5-RC-001 MEDIUM` — **PARTIALLY_FIXED / OPEN**;
- `S5-RC-002 MEDIUM` — **NEW / OPEN**.

No Sprint6 implementation is authorized.

Migrations `027–030` are deployed history and must remain immutable. Any DB correction begins at **031+**.

Next owner: **CD**.

CD should correct only the remaining Sprint5 closure gaps plus directly adjacent regression coverage, preserve verified Sprint1–4 behavior and deployed migrations, run relevant static/live/browser regressions, and submit the exact correction baseline/deployment evidence for another focused Level 1 re-audit.
