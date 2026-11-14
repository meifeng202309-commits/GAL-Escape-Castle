# ACT3 Library discovery gap — minimal source-only proposal

Date: 2026-11-14
Owner: CD
Status: proposal only; no implementation or deployment

## Root cause

The current authoritative success paths insert `library_photo_1897` and `library_torn_note`, then immediately replace the runtime scene with ACT4:

- direct/retry-safe success: `database/014_sprint3b_evidence_and_puzzle_integrity.sql:s3b_submit_library_code`;
- timeout success: `database/011_sprint3b_transition_and_act1_delivery_integrity.sql:s3b_refresh_puzzle`.

Consequently polling never has a durable ACT3 discovery phase to render. `src/game/app.js:renderSprint3b` has no resolved-box branch, while `pocketEvidencePanel` renders group items as text-only `<details>` and special-cases only the torn-note wording. The backend data exists and survives reconnect; the player-visible story step and media contract do not.

Both required assets are already independently accessible in the current registry: `prop.photo_1897` v001 and `prop.library_clock_clue_note` v001 are `latest_version=1`, `active_version=1`. The newly staged clue-note v002 is not required for this fix and must not be assumed active.

## Smallest durable patch

A client-only event/projection interpretation is insufficient: the ACT4 scene replaces ACT3 atomically, so a one-frame client screen would disappear under polling/reconnect and cannot prove that all Players saw it. Use one minimal persisted transition gate.

1. Add nullable `library_discovery_ack_at` to `s3b_player_progress`.
2. In both resolution authorities (`s3b_submit_library_code` direct success and `s3b_refresh_puzzle` timeout success), preserve the existing idempotent group-item inserts but set the runtime scene to:
   - `scene_id=act3_library`
   - `phase_key=library_discovery`
   - `step_key=box_opened`
   - `display_mode=CINEMATIC_MESSAGE`
   - `text_key=act03.015`
   Do not enter ACT4 there.
3. Add `s3b_ack_library_discovery(room, session)`:
   - authenticate the Player and lock the active run;
   - require the exact `library_discovery/box_opened` scene and both group items;
   - set only that Player's acknowledgement idempotently;
   - after all three Players acknowledge, call the existing `s3b_set_scene` for `act4_known_unknown/private_route_choice/initial/ACTION_SCREEN/act04-05.002`;
   - return acknowledgement count and transition status. No vote, behavior score, or invented item identity.
4. `s3b_get_player_state` already projects the current scene and complete owner-local progress object; ensure the new acknowledgement field remains in `me`. No separate transient event cache is needed.
5. In `renderSprint3b`, add an exact `library_discovery` branch that shows `act03.015`, both group discoveries, and a per-Player Continue button bound to the acknowledgement RPC. Polling must retain this screen until that Player acknowledges; reconnect must reconstruct it from server state.
6. Extend group-item rendering with an allowlisted media mapping only:
   - `library_photo_1897 -> prop.photo_1897` plus `item.photo_1897`;
   - `library_torn_note -> prop.library_clock_clue_note` plus exact `act03.016` wording.
   Keep both group items inspectable after ACT4. Use the existing asset resolver and placeholder behavior. Do not duplicate words already printed inside a future v002 clue-note image; v001 remains the accepted fallback until a separate activation gate.

No protected localization edit is required for this bounded patch: `act03.015`, `act03.016`, `item.photo_1897`, and `item.torn_note` already exist. If CA/GA want new discovery narration beyond those keys, that is a canonical copy gap and must return to GA/Teacher.

## Focused acceptance

- Direct correct code: exactly two group items; all three Players see the durable box-opened screen and both images before ACT4.
- Lost-response retry: same request UUID remains idempotent; no duplicate items/events and no premature ACT4 transition.
- Timeout/fallback: final wheel resolves into the same discovery phase, not a separate path.
- Reconnect/polling: unacknowledged Player returns to discovery; acknowledged Player remains safely waiting; five refreshes produce one stable presentation.
- Three acknowledgements: first two cannot advance the shared scene; third advances once to existing ACT4.
- Role visibility: all three see only shared discoveries; no private clue leakage.
- Group Pocket: both items remain inspectable with their correct media during ACT4 and later phases.
- Asset loading: current active v001 photo/note resolve; missing/failed media uses existing placeholder without blocking acknowledgement.
- Negative gates: acknowledgement before resolution or with stale session/run is rejected; no vote, behavior scoring, new item keys, registry changes, ACTIVE changes, or production mutation.

## Expected implementation envelope

One new migration after 075, `src/game/app.js`, one focused PostgreSQL transaction test, one mocked browser/reconnect test, and existing ACT3/Player static suites. Production release remains separately gated.

NEXT_OWNER: CA
