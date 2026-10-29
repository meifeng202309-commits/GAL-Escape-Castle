# Trial 7 mixed lifecycle/discussion P0 diagnosis

Date: 2026-10-29  
Authority: `CA_to_CD_20261029T235000Z_trial7-mixed-lifecycle-discussion-vote-p0-investigation.md`  
Disposition: read-only diagnosis and mocked candidate only; no product/live mutation

## Room and authoritative state

The screenshot room is confirmed as `TESTB`, not TEST8.

- Room created: `2026-10-29 13:16:49.825476+00`.
- Active run: `c6a0912e-35de-4226-8ad2-c6d8ee27d5af`, started `13:17:50.439134+00`, authoritative run scene/phase/step `generic-discussion / discussion / generic-vote`.
- Discussion: `86fab00e-a1d0-4021-8fa3-be58d6bc41a2`, `meeting_discussion / final_meeting`, round 1, started `13:21:09.885997+00`, status `voting`, free text and final vote enabled.
- Teacher opened voting at `13:25:16.517919+00`.
- Anna/GAL-B locked a valid `library` vote at `13:25:23.526838+00`.
- Gitte/GAL-A locked a valid `library` vote at `13:25:52.963350+00`.
- Linda/GAL-C has no decision row and no `s2_submit_vote` event.
- All three completed ACT1 and first-meeting/grab/leave progression. All three sent at least one valid discussion message: Linda 1, Anna 3, Gitte 2.

The server phase is therefore not pre-run and Teacher Open Vote did advance the authoritative round. Linda was not rejected by the vote RPC; her browser never issued the vote request.

## Production transport evidence

From `13:21:00–13:35:30Z`:

- all Player projection endpoints returned HTTP 200;
- `s2_get_player_state`: 655 responses, max origin time 1148 ms;
- `s3b_get_player_state`: 654 responses, max 1222 ms;
- `s5_get_player_state`: 653 responses, max 1549 ms;
- `s6_get_player_state`: 653 responses, max 981 ms;
- `s8_get_player_state`: 1307 responses, max 1482 ms;
- five `s2_submit_vote` calls returned HTTP 200, but they resolved to the two unique Anna/Gitte decisions; no Linda vote lock exists.

There is no projection error explaining a server-side pre-run fallback. The 1–1.5 second tails across sequential/parallel frame reads do explain why a committed frame can take several seconds, but not an indefinite role-specific freeze by themselves.

## First client/server divergence

Two client presentation defects combine into the reported mixed screen.

### 1. Stale lifecycle title (direct source fact)

`renderLifecycleNotice("pre-run")` writes `sceneTitle = "Waiting for formal run"`. The active Sprint3b renderer never updates or clears `sceneTitle`. A later correct active discussion frame therefore displays an active Discussionroom beside the stale pre-run title. This title is retained presentation state, not a server lifecycle state.

### 2. Whole-frame IME deferral (source fact plus exact deterministic reproduction)

`commitPlayerFrame()` returns without committing any confirmed frame whenever `playerCompositionActive` is true. This applies even to the stable top-level S2 `#messageText` input, which is not remounted by `renderDiscussion()`. If Teacher opens voting while that input is composing—and composition end is delayed or lost on focus/visibility transition—the authoritative voting frame is stored only in `deferredCompositionFrame`. The old discussion composer and “voting opens after discussion” UI remain, no vote buttons are created, and no `s2_submit_vote` can be sent.

Production logs cannot record browser DOM composition events, so the exact Linda composition event is an inference. It is the bounded code path that reproduces all observed facts simultaneously: continuous successful polling/last-seen activity, no vote RPC, stale discussion controls after authoritative voting, and role-specific delay/freeze. Gitte's long waits are consistent with the same all-frame deferral plus multi-projection latency; Anna's browser did not remain deferred.

## Deterministic three-role test

`tests/trial7-mixed-lifecycle-discussion-browser.mjs` serves the real product source and runs three roles through pre-run → start/discussion → Teacher voting.

Baseline with Linda composing in `#messageText`:

- title: `Waiting for formal run`;
- composer visible: true;
- vote buttons: 0;
- accepted votes: 0.

In-memory candidate only:

- clears the lifecycle title on confirmed active frame commit;
- does not defer the entire frame for the stable S2 `#messageText` node;
- composer hidden at voting: true;
- Linda vote button present: 1;
- GAL-A, GAL-B and GAL-C each submit once; accepted unique votes: 3.

Evidence: `docs/reports/remediation/ui/trial7-mixed-lifecycle/TRIAL7_MIXED_LIFECYCLE_BROWSER_EVIDENCE.json`.

## Smallest repair proposal

1. On every confirmed active frame, clear or replace lifecycle-only `sceneTitle`; do not let a pre-run title survive active rendering.
2. Narrow composition protection to DOM that is actually remounted. Specifically, do not defer the whole S2 frame while stable `#messageText` is composing. Preserve the node/draft, commit phase/voting controls, and prevent user input from blocking authoritative progression.
3. Keep deferral/preservation for dynamically remounted inputs (`#libraryCode`, Sprint6 composer) until separately proven safe, and add blur/cancel recovery so no composition can freeze frames indefinitely.
4. Add the three-role regression permanently, including role/session switching and refresh generation checks before release consideration.

No database or RPC change is indicated. Do not ask a blocked Player to retry; the client must render the already-authoritative voting frame.

## Mutation statement

No product source, production database, Storage, TESTB/TEST8, room, vote, message or game state was changed. The candidate existed only in the test HTTP response.

