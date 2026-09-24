# Sprint5 ACT 6–8 + visual-dynamic UI — Second Focused Level 1 Re-audit

Baseline: `407aea6975f4450851426ff34b3fc57dc44ba78c`  
Scope: closure of `S5-CA-001`, `S5-CA-002`, `S5-CA-003`, `S5-RC-001`, `S5-RC-002`, plus directly adjacent regression risk  
Audit level: Level 1 — Focused re-audit  
Decision: **FAIL / BLOCKED — FOUR FINDINGS CLOSED; ONE CANONICAL BLOCKER REMAINS**

## 1. Inputs and independence

CA froze the submitted correction baseline and independently reconstructed the correction from:

- `database/031_sprint5_focused_reaudit_corrections.sql`;
- `database/032_sprint5_discussion_creation_restore.sql`;
- `src/game/app.js`;
- `src/styles/app.css`;
- `src/teacher/teacher-console.js`;
- `tests/sprint5-live-e2e.js`;
- `tests/sprint5-static-check.js`;
- current V4.0 ACT6–8 canonical sections;
- prior Sprint2 DiscussionRoom, Sprint3A evidence/view/share, Sprint3B share-authority, and Sprint5 migrations 027–030.

Migrations 031 and 032 are reported deployed and are treated as immutable history.

## 2. Closure matrix

| Finding | Re-audit status | Result |
|---|---|---|
| S5-CA-001 HIGH | **PARTIALLY_FIXED / OPEN** | Server-side ACT6 SHARE PHOTO authority and ACT8 evidence rendering improved, but ACT6/ACT7 still do not expose the required Pocket/evidence interaction in the actual GAL UI. |
| S5-CA-002 HIGH | **FIXED_VERIFIED** | ACT6 now renders the Castle Map identity with Portrait Hall → Clock Room route presentation; ACT8 renders Castle Map + 1897 Photograph evidence before route choice. Canonical localization-key usage remains intact. |
| S5-CA-003 MEDIUM | **FIXED_VERIFIED** | Clock B now uses the actual `.counterclockwise` CSS animation class; prior anchor-authority correction remains present. |
| S5-RC-001 MEDIUM | **FIXED_VERIFIED** | Teacher Console now resolves and controls the exact current Sprint5 session through Sprint5-specific teacher RPCs rather than legacy global-max vote-round selection. |
| S5-RC-002 MEDIUM | **FIXED_VERIFIED** | Replay recognition now occurs before terminal discussion-status rejection; focused live E2E explicitly retries the committed final vote and observes `idempotent_replay`. |

No new adjacent blocker was confirmed.

## 3. S5-CA-001 HIGH — one remaining canonical gap

### What is fixed

The correction materially closes several parts of the prior finding:

- `s5_configure_discussion(...)` now authorizes SHARE PHOTO for ACT6 and ACT8;
- migration 032 restores canonical `discussion_sessions` creation for new Sprint5 rounds after migration 031's first version omitted the insert path;
- current Sprint5 evidence rendering includes:
  - owned items;
  - group items;
  - observations;
  - received shared-photo labels;
- generic item-specific SHARE PHOTO buttons now use each owned item's current server-authoritative view;
- ACT8 still preserves Linda's private evidence until explicit sharing.

### What remains open

The actual GAL evidence panel is still only interpolated into the ACT8 branch of `renderSprint5(...)`.

The relevant control flow is:

- `pocketState` is fetched for every active Sprint5 phase;
- `pocketHtml` is constructed;
- but `pocketHtml` is appended only inside the ACT8 visual branch.

It is **not** appended to the ACT6 or ACT7 visual branches.

Therefore:

#### ACT6

Canonical V4.0 requires the 90-second DiscussionRoom to have:

- `allow_pocket = true`;
- `allow_share_photo = true`.

The server now authorizes these capabilities, but the GAL UI exposes neither the Pocket evidence panel nor the item-specific share buttons during ACT6.

A capability that exists only in server state is not an executable student interaction.

#### ACT7

Canonical V4.0 requires all players to be able to open:

- `GROUP FOUND ITEMS → Torn Note`.

Linda must also be able to open:

- `MY ITEMS → Stopped Watch`;
- inspect front `23:49`;
- if not previously flipped, use `[FLIP]` and discover the back-side evidence.

The current ACT7 renderer prints canonical labels such as `act07.006` / `act07.007`, but it does not expose the actual Pocket state, item inspection, current-view state, or `s3_set_item_view(...)` interaction.

Thus the puzzle can display the names of the relevant evidence while still preventing the player from actually opening/inspecting it.

### Why this remains blocking

ACT7's intended reasoning chain depends on the stopped watch and its inspectable state. This is not optional presentation polish.

Likewise ACT6 explicitly authorizes Pocket/SHARE PHOTO as part of its canonical DiscussionRoom behavior.

The closure condition from the prior re-audit was:

> ACT6/7/8 must expose the canonical evidence controls to the GALs in the scenes where they are allowed. ACT6 SHARE PHOTO must be authorized. ACT7 puzzle evidence must be inspectable.

Only the server-authorization part is now closed.

### Closure condition

ACT6 and ACT7 must expose the canonical evidence interaction to the GALs, not merely fetch the data or print evidence labels.

Specifically:

- ACT6 must provide usable Pocket access and SHARE PHOTO controls while the canonical DiscussionRoom is open;
- ACT7 must provide usable group-item / Linda-item inspection sufficient to inspect the Stopped Watch and perform the permitted FLIP/current-view transition.

Reconnect must render the current authoritative item view rather than resetting or inventing evidence state.

CA is not prescribing UI layout, button design, or component architecture.

## 4. S5-CA-002 HIGH — FIXED_VERIFIED

The prior presentation gap is materially closed.

### ACT6

`act6_answer` now renders:

- the approved Castle Map asset identity `prop_gitte_castle_map`;
- a clear Portrait Hall → Clock Room route presentation;
- canonical `act06.011`;
- canonical `act06.012` transition control.

This satisfies the prior closure requirement that the transition no longer be text-only.

### ACT8

Before route choice, the renderer now requests:

- `prop_gitte_castle_map`;
- `prop.photo_1897`;

and displays them in the ACT8 evidence screen.

The existing private/group evidence model remains separate from this public evidence presentation.

No new hardcoded canonical English replacement was found in the corrected Sprint5 branch.

## 5. S5-CA-003 MEDIUM — FIXED_VERIFIED

The previous class/style mismatch is closed.

Clock B markup now uses:

`class="hand counterclockwise"`

and CSS defines:

`.counterclockwise { animation: clock-turn ... reverse }`.

The previously verified anchor contract remains:

- Portrait base + paired overlay use `portrait_main_face`;
- Clock A/B/C use their approved face anchors;
- missing ACTIVE assets/anchors degrade explicitly rather than applying exact overlays to unknown geometry.

Production-pixel alignment against final ACTIVE artwork remains **NOT VERIFIED** where required assets are not ACTIVE; this is an asset-availability boundary rather than a code blocker.

## 6. S5-RC-001 MEDIUM — FIXED_VERIFIED

Migration 031 adds Sprint5-specific Teacher authority/read paths:

- `s5_get_teacher_discussion_state(...)`;
- `s5_teacher_open_vote(...)`;
- `s5_teacher_add_time(...)`.

They derive the exact current session from:

- current `s5_run_state.phase_key`;
- current `s5_run_state.vote_round`;
- matching `s5_rounds.discussion_session_id`.

Teacher Console now detects active Sprint5 state and uses those RPCs instead of legacy `s2_get_teacher_state` / global maximum vote-round semantics.

Focused live E2E also asserts that Teacher and GAL resolve the same exact Sprint5 session.

The previous player/Teacher split-current-session defect is closed.

## 7. S5-RC-002 MEDIUM — FIXED_VERIFIED

Migration 031 restores replay-first behavior.

The wrapper now checks the persisted `s5_votes` request identity before delegating to the prior discussion-status-gated implementation.

If the same request ID and same choice already committed, it returns:

`idempotent_replay = true`

even when the vote was terminal and the DiscussionRoom has since become resolved.

Conflicting request-ID reuse with a different choice still fails.

The focused live E2E explicitly repeats the third/terminal vote after resolution using the same request ID and verifies replay success.

The lost-response retry regression is closed.

## 8. Migration 032 review

Migration 031 initially redefined `s5_configure_discussion(...)` as an update-only function. That would have failed for newly created `s5_rounds` rows that did not yet have a `discussion_sessions` row.

Migration 032 forward-fixes this by restoring:

- `insert into public.discussion_sessions ... on conflict do nothing`;
- followed by the authoritative update.

This is consistent with the established Sprint5 round/session identity model.

No modification to deployed migrations 027–030 was found.

## 9. Test / evidence review

CD reports:

- migrations 031 and 032 deployed successfully;
- Sprint5 static check PASS;
- Sprint5 live E2E PASS against production Supabase;
- focused E2E asserts exact Teacher/current-session identity;
- focused E2E asserts resolved-round lost-response replay;
- `git diff --check` PASS.

These results support closure of S5-RC-001 and S5-RC-002 and are consistent with source review.

However, the submitted tests still do not demonstrate:

- ACT6 Pocket UI visibility;
- ACT6 user-executable SHARE PHOTO from the GAL browser;
- ACT7 Torn Note / Stopped Watch inspection from the GAL browser;
- ACT7 FLIP/current-view interaction.

The current static check only proves that evidence-related strings exist somewhere in `app.js`; it does not prove that the evidence panel is mounted in ACT6/ACT7.

## 10. Mandatory recurring-error pattern scan

| Pattern | Result | Focused result |
|---|---|---|
| A — local correctness / cross-module handoff | **FINDING** | Server evidence/share authority is corrected, but ACT6/ACT7 client presentation does not expose those capabilities. |
| B — happy-path / distributed boundary | PASS | Terminal vote replay is restored and exact-session Teacher state is covered by focused live evidence. |
| C — UI rule mistaken for server rule | **FINDING** | The reverse form appears here: server capability exists, but the required user interaction is absent from the UI. |
| D — current state vs historical evidence | PASS | Teacher exact-session selection and terminal round state are coherent in the reviewed correction. |
| E — authority accretion / legacy reachability | PASS | Teacher Sprint5 no longer depends on legacy global-max discussion semantics for current state. |
| F — self-confirming tests | **FINDING** | Static presence checks accept evidence code that is only mounted in ACT8, so they do not falsify missing ACT6/ACT7 interaction. |

## 11. Gate disposition

**Sprint5 remains BLOCKED.**

Closed in this re-audit:

- `S5-CA-002 HIGH → FIXED_VERIFIED`;
- `S5-CA-003 MEDIUM → FIXED_VERIFIED`;
- `S5-RC-001 MEDIUM → FIXED_VERIFIED`;
- `S5-RC-002 MEDIUM → FIXED_VERIFIED`.

Remaining:

- `S5-CA-001 HIGH → PARTIALLY_FIXED / OPEN`.

No Sprint6 implementation is authorized.

Migrations `027–032` are deployed history and must remain immutable. Any DB correction begins at **033+**.

Next owner: **CD**.

CD should correct only the remaining ACT6/ACT7 evidence-interaction gap plus directly adjacent regression coverage, preserve verified Sprint1–4 behavior and deployed migrations, run relevant static/live/browser regressions, and submit one more focused Level 1 re-audit request.
