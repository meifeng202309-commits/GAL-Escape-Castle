# Trial 4 six-item source impact diagnosis

Date: 2026-10-27  
Analysis baseline: `615bfeefcb9ebd7805ede68244d7c972c310069f`  
Authority: `agent-comms/CA_to_CD_20261027T061000Z_trial4-six-items-bounded-source-investigation.md`  
Disposition: source-grounded investigation only; no runtime source, migration, asset, Pages, Storage, or live-room mutation.

## Executive disposition

The six observations do not share one root cause.

| Priority | Source finding | Minimum implementation boundary | Admission dependency |
|---|---|---|---|
| 1 | Formal ACT1-13 scene media and narrative are co-rendered into `#sprint3bText`, which lives in Runtime/Story. Action already renders separately into the upper-right `#sprint3bActions`. | Player-only `index.html`, `src/game/app.js`, `src/styles/app.css`, and focused Player tests. | CA source authorization. |
| 2 | ACT9 countdown is authoritative, not cosmetic: NORMAL ACT9 opens 180/60-second deadlines and Player reads can advance expired discussion. Migration072 exempts only NORMAL ACT10. | Separate migration073+ plus Player/Teacher source/tests if Teacher-paced ACT9 is approved. | GA/canonical confirmation and separate CA DB/source authorization. |
| 3 | Several clue assets are ACTIVE and present locally, but only map, diary, and watch have Pocket media mappings. Number-note front/back, closure order, and star key are text-only. Rebuilding Pocket every poll also recreates image nodes. | Player-only mapping/render lifecycle and browser media/decode tests; no asset publication required for the confirmed keys. | CA source authorization; live resolver/decode remains a release preflight. |
| 4 | Later Pocket inventory is projected. Uninspected entries are buttons; inspected entries are open details. The constrained Pocket scroll can place later content below the fold. This is access/affordance and missing-media mapping, not inventory loss. | Same Player-only Pocket boundary as item 3. | CA source authorization. |
| 5 | Runtime scroll state is not captured. Every 1.2-second Sprint6 render replaces `#sprint3bText.innerHTML`, so `.v4-story-region` returns to its initial scroll position. | Retest after item 1; if reproduced, preserve story scroll by stable runtime identity in `src/game/app.js` and focused browser test. | Conditional CA authorization after layout retest. |
| 6 | Tie explanation is localized narrative work and was explicitly deferred. | No edit in the next source package. | Later consolidated copy authorization. |

## 1. Scene / Runtime / Action routing

Stable roots are declared in `index.html:40-69`:

- Scene owns `#sceneText` and `#revealArea`.
- Action owns `#choiceArea`, `#sprint3bActions`, and statuses.
- Runtime/Story owns `#sprint3bText`.
- Discussion and Pocket have independent right-column roots.

The grid in `src/styles/app.css:19` currently places `scene` upper-left, `action` below it, `story` lower-left, Discussion upper-right, and Pocket lower-right. The corrected Teacher contract instead requires Scene upper-left, Runtime below Scene, and Action upper-right while retaining Discussion/Pocket regions.

The material issue is renderer ownership, not only grid order:

- `renderSprint3b` writes scene image/comparison and narrative together to `sprint3bText` at `src/game/app.js:508-513`.
- It writes controls to `sprint3bActions` at `src/game/app.js:514-542`.
- `renderSprint5` writes scene media and narrative together to `sprint3bText` at `src/game/app.js:585-600` and controls to `sprint3bActions`.
- `renderSprint6` constructs scene media, private clue, feedback, and audio controls in one body and assigns it to `sprint3bText`; controls are assigned to `sprint3bActions` at `src/game/app.js:658`.
- `renderSprint8` also writes final presentation frames to `sprint3bText` at `src/game/app.js:661-691`.

Minimal proposal: introduce stable formal Scene and Runtime submounts without changing existing RPC or control IDs; route scene/composite media to Scene, narrative/guidance to Runtime, and retain all controls in Action. Discussion/Pocket remain independent. Do not duplicate media or infer content ownership from CSS selectors.

Estimated implementation/testing effort: 2.5-3.5 engineering days because ACT1-5, ACT6-8, ACT9-13, and ACT14 need representative routing checks at 1366x768 and 1280x720, plus mobile single-column behavior. No database change is needed for this item.

## 2. ACT9 countdown policy boundary

The displayed `58s` is generated from the server `phase_deadline` by `sprint6Discussion` and `formatDeadline` at `src/game/app.js:626` and `855-858`.

The deadline also enforces state:

- migration035 opens initial/no-consensus ACT9 discussion with 180 seconds and wrong-step reset with 60 seconds;
- `s6_refresh_owned_discussion` advances an expired ACT9 discussion to `act9_console`;
- `s6_get_player_state` invokes that refresh, so ordinary Player polling can cause the transition;
- migration072 makes only NORMAL `act10_discussion` deadline-free and explicitly leaves ACT9 unchanged.

Therefore hiding the countdown would leave enforcement intact and is not a valid fix. The current source is inconsistent with the broader recorded Teacher-paced NORMAL discussion direction, but changing ACT9 is a server gameplay-policy change. It must be a separate migration073+ package if GA confirms that NORMAL ACT9 is Teacher-paced.

Estimated effort after policy approval: 1.5-2.5 engineering days for guarded ACT9 Teacher progression, null-deadline-safe messaging/reads, stale identity checks, Player countdown suppression for null deadline, Teacher control projection, isolated SQL/ACL tests, and focused browser regression. AUDIT behavior should remain bounded unless separately changed.

## 3-4. Clue media and later Pocket items

`pocketEvidencePanel` at `src/game/app.js:571-581` maps every projected item. Uninspected items are inspect buttons; inspected items become open `<details>`. `renderPocket` preserves open state across refresh at `src/game/app.js:584`. This disproves inventory loss at the renderer boundary.

The real media gap is `pocketItemContent` at `src/game/app.js:558-569`:

- mapped: `gitte_castle_map`, `anna_servant_diary`, `linda_stopped_watch`;
- text-only despite existing ACTIVE assets: `gitte_number_note` front/back, `linda_closure_order`, `linda_star_key`;
- text-only by current evidence: `gitte_flashlight`.

The repository contains ACTIVE v001 entries and local WebPs for both number-note faces, diary, both watch faces, closure order, and star key. File sizes are modest (about 32-357 KB), so the reported diary delay cannot be attributed to a missing repository binary. Runtime resolution, public-object response, decode, and repeated node recreation remain the relevant test points.

Minimal proposal:

1. Extend the existing item-to-asset mapping for number-note front/back, closure order, and star key.
2. Preserve server-owned inspection/current-view authority and existing resolver-first failure behavior.
3. Do not promote or mutate assets.
4. Add a browser fixture with at least three items per role, expand second/later items, verify image natural dimensions, flip/reconnect where applicable, and verify internal Pocket scrolling at both desktop gates.
5. Measure resolver calls and image node/src stability across polling before deciding whether a small stable-node optimization is necessary.

Estimated effort: 1-1.5 engineering days. No database change is indicated.

## 5. ACT9 Runtime scroll

Discussion transcript scroll already has identity-bound capture/restore at `src/game/app.js:270-278` and `550-551`. Runtime/Story scroll has no equivalent. `renderSprint6` replaces all of `#sprint3bText` on every committed refresh, and polling continues approximately every 1.2 seconds. That mechanism matches the reported one-second return-to-top symptom.

Per Teacher sequencing, this should be retested after item 1 because the amount and location of scrollable content will change. If still reproducible, the minimum correction is an identity-bound `.v4-story-region` scroll capture/restore around formal rendering, preserving near-bottom versus deliberate earlier-reading intent. It should not introduce a global observer or freeze authoritative refreshes.

Estimated conditional effort: 0.5-1 day plus a focused repeated-refresh browser case.

## 6. Deferred narrative

No tie-copy or other narrative change belongs in the next package. The report records the observation but preserves the Teacher decision to handle it in one consolidated copy pass.

## Recommended admission sequence

1. Authorize one Player-only package for routing plus confirmed Pocket media/access gaps.
2. Run focused real-root browser gates across three role projections and required viewports.
3. Retest ACT9 Runtime scrolling; admit only the bounded scroll correction if still reproduced.
4. Independently resolve ACT9 NORMAL policy with GA, then authorize a separate migration073+ package if required.
5. Keep narrative copy deferred.

P1 blockers for the next playable human run are the formal Scene/Runtime routing and reliable access to clue media. ACT9 countdown is also a blocker if GA confirms Teacher-paced NORMAL semantics; it cannot be honestly closed by a Player-only display change.

