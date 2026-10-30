# Trial 8 Great Gate narrow desk review

Scope: CA's `CA_to_CD_20261030_trial8_devtools_human_observation.md` request. This is a source-and-existing-evidence review only; no product, database, live-room, deployment or Storage change was made.

## Exact authoritative path

1. Each Player's ACT10 final vote calls `s6_submit_group_choice_v2`. The third submission is the three-Player barrier: the guarded RPC resolves the majority and changes `act10_final_vote` to `act10_result`. A TAKE result sets `gold_key=true`, bypasses Station C and enables the Golden Key branch.
2. `renderSprint6` shows only the ACT10 result Continue button in `act10_result`. Clicking it calls `s6_advance_v2`; the server changes the state to `act11_discussion`, opens the Great Gate allocation discussion and, on the TAKE branch, gives it a 45-second deadline.
3. `s6_get_player_state` invokes `s6_refresh_owned_discussion`. Once the ACT11 deadline has passed, that read may advance `act11_discussion` to `act11_allocation`. ACT11 is not one of the NORMAL-mode Teacher-open gates; unlike ACT9/ACT10 discussion, it is deadline-owned. The discussion's enabled Continue action is another valid way to call the guarded close only after the deadline.
4. Only a confirmed Player frame whose `s6_get_player_state` reports `act11_allocation` reaches the allocation branch in `renderSprint6`. The TAKE branch renders **A/B/WATCHER**; **A/B/C** is the LEAVE branch. A later allocation submission is itself a separate three-Player barrier before ACT12 tasks and is not part of making the initial allocation buttons visible.

## Read, poll and render conditions

An immediate action refresh does not commit the S6 projection alone. `loadPlayerFrame` waits serially for S8 lifecycle authority, then S2 state, then a parallel group containing S6 plus four other projections, then the conditional S9 wait-state read. `commitPlayerFrame` renders only after that whole confirmed frame settles. `runSprint6Action` requests this refresh after the mutation response. If another Player caused the authoritative transition, the observing tab normally discovers it on its poll: the next poll is scheduled 1200 ms after the preceding frame settles. If an old refresh is already in flight when an action refresh is requested, the new generation is queued until that old frame finishes.

Existing B4 controlled evidence is consistent with a seconds-scale tail after a gate is already open. ACT10 Continue → ACT11 action visibility measured median/worst 1081/1207 ms with 250 ms injected read latency and 4070/4265 ms with 1000 ms injected read latency. An in-flight old poll with 250 ms per-read delay measured 2038/2055 ms. The human screenshots also contain isolated client-observed TTFB values up to 3.27 s, but they were random samples and cannot be assigned to this transition or decomposed into database time.

## Causal hypothesis and evidence gap

**Bounded hypothesis:** the reported 2–4 seconds is compatible with an already-satisfied ACT11 deadline being observed through the current 1200 ms poll/queued-refresh coordinator and multi-stage confirmed-frame fanout, especially if one critical-path request had the observed near-1-second-or-longer TTFB; it is not evidence of a slow vote mutation or a database defect. **Evidence gap:** there is no timestamped waterfall for the actual transition, no identification of which Player completed or observed the barrier, and the reported A/B/C labels conflict with the canonical TAKE branch's A/B/WATCHER. Therefore the observation cannot distinguish gate timing, poll wait, queued old frame, gateway/network TTFB or one slow projection, and no source fix is justified from it.

Evidence reviewed: `src/game/app.js` (`loadPlayerFrame`, refresh coordinator, `renderSprint6`, `runSprint6Action`); migrations 035, 036, 037 and 073; `古堡逃脱游戏脚本 V4.0.md`; `TRIAL8_B4_TIMESTAMPED_EXPERIMENTS_20261030.md`; and CA's relayed DevTools observation.
