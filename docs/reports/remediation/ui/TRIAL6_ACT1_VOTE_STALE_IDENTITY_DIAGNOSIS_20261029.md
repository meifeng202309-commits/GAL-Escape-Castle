# Trial 6 ACT1 vote stale-identity diagnosis

Date: 2026-10-29  
Scope: CA `CA_to_CD_20261029T170000Z_trial6-act1-vote-stale-identity-priority.md`  
Result: root cause reproduced; narrow candidate passes locally; no product/live mutation

## Direct TEST8 evidence

- Active run: `1dd274ac-5a7d-4d18-8eb4-106cd254d7d2`, created `2026-10-29 02:13:13.31773+00`, scene `generic-discussion`, phase `discussion`, step `generic-vote`.
- Authoritative discussion: `76aeca69-7ad1-4d0f-bd5e-579274df560f`, phase `meeting_discussion`, step `final_meeting`, vote round 1, status `voting`.
- TEST8 has no `s5_run_state` and no `s5_rounds`. It therefore has no authoritative Sprint5 vote identity.
- `runtime_player_decisions` contains exactly two valid decisions for this discussion: GAL-A/Gitte chose `library` at `02:33:02.559933+00`; GAL-C/Linda chose `great_hall` at `02:33:12.955262+00`. GAL-B/Anna has no decision. This matches the reported Teacher 2/3 state.
- Runtime events show Teacher opened voting and only GAL-A/GAL-C vote locks. A rejected RPC does not create a vote-lock event.
- The final slide of `trial run report 6.pptx` was not present in this checkout. The CA letter's quoted final-slide observations were used as governance evidence; no unavailable slide content was invented.

## Exact first divergence

The authoritative server and the newly confirmed browser frame agree that TEST8 is an S2 generic discussion. The first divergence is client-side RPC ownership selection after that frame is committed:

1. `loadPlayerFrame()` correctly chooses `discussionState` when `sprint5State.active` is false.
2. `commitPlayerFrame()` renders that S2 discussion but does not clear the module-global `currentSprint5State` last written by `renderSprint5()`.
3. `submitVote()` and `sendMessage()` choose their RPC from historical `currentSprint5State?.active`, not from the ownership of the confirmed frame/current discussion.
4. A browser that previously rendered Sprint5 therefore sends the current ACT1 discussion UUID to `s5_submit_vote`.
5. The server correctly rejects it in `database/027_sprint5_act6_8_runtime.sql` because no matching current `s5_rounds` row exists, producing the exact reported `Stale Sprint 5 discussion identity.`

This is not a server identity corruption and not a TEST8 data repair problem. The repair layer is Player client routing/state commit. The server stale-identity guard must remain unchanged.

## Deterministic local baseline and candidate

`tests/trial6-act1-vote-stale-identity-browser.mjs` drives the real Player page with mocked RPC boundaries:

- first commits an active Sprint5 frame so `currentSprint5State.active` is true;
- then commits an authoritative S2 ACT1 voting frame with two votes already submitted;
- baseline click calls `s5_submit_vote`, receives the exact stale-identity error, and stays 2/3;
- candidate is applied only to the HTTP-served in-memory copy of `src/game/app.js`; repository product source is untouched;
- candidate atomically sets `currentSprint5State` from every confirmed active frame before rendering;
- Anna's retry calls `s2_submit_vote` with the current ACT1 discussion identity and advances the synthetic Teacher projection to 3/3.

Evidence: `docs/reports/remediation/ui/trial6-act1-vote/TRIAL6_ACT1_VOTE_BROWSER_EVIDENCE.json`.

Command result: `Trial 6 ACT1 stale identity baseline/candidate browser gate passed.`

## Minimal implementation proposal

In `commitPlayerFrame(frame)`, before rendering an active frame, assign:

```js
currentSprint5State = frame.sprint5State?.active ? frame.sprint5State : null;
```

Also clear stage-specific routing state on non-active lifecycle commits/leave as defense in depth. Keep RPC selection tied to the same confirmed frame that supplied `currentDiscussion`; do not infer ownership from a prior render. Add the browser regression above to the permanent gate. No migration is required.

CA must separately authorize the product edit and release. No frontend, production database, Storage, room, or gameplay state was changed during this investigation.

## Deferred observations (not investigated here)

Room-code reuse/clean-room behavior, Pocket before formal run, repeated Runtime, watch flip, missing star, and missing text/digits remain separate Trial 6 observations outside this urgent root-cause scope.

