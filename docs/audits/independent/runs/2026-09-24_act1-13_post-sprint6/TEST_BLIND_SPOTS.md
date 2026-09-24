# TEST_BLIND_SPOTS — ACT1–13 post-Sprint6

Baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`

## G1. Test inventory

Repository test files:

- Sprint1: static + live E2E.
- Sprint2: static + live E2E.
- Sprint3A: static + live E2E.
- Sprint3B: static + live E2E + remediation static/live.
- Sprint3C: static + live E2E.
- Sprint4: static + live E2E + SQL DB regression.
- Sprint5: static + live E2E.
- Sprint6: static checks embedded alongside Sprint5 live continuation.

There is no standalone real-browser automated Sprint6 deadline/reconnect suite in the repository.

## G2. Test-to-invariant observations

Strong coverage exists for:
- first-choice lock;
- stale vote identity;
- tie/re-vote;
- Pocket/share provenance;
- Teacher override privacy/provenance;
- Asset Manager lifecycle;
- Sprint5 branch semantics;
- Sprint6 stale action/replay/branch/allocation/station/ENGAGE/cinematic endpoint.

## G3. Static vs behavioral proof

`tests/sprint6-static-check.js` primarily asserts source-string presence/absence:
- v2 RPC names;
- anchors/assets;
- audio cue inclusion;
- localization strings;
- CSS markers.

This is useful regression coverage but does not execute:
- browser refresh ordering;
- deadline ownership;
- reload persistence;
- direct-table RLS.

## G4. Counterfactual / blind-spot analysis

### IDA-001 — why live E2E passes

The Sprint6 live continuation:
- starts the run in `audit` mode;
- manually calls `s6_initialize`;
- calls helper `s6close(...)` directly;
- `s6_close_discussion_v2` permits AUDIT close before the deadline.

Therefore the test never performs the NORMAL sequence:
deadline expires → normal player refresh calls generic `s2_get_player_state` first.

If generic Sprint2 ownership wrongly resolves the discussion, this E2E still passes.

### IDA-004 — test encodes the defect as setup

The live fixture explicitly calls:
- `s5_initialize(...teacher...)`;
- later `s6_initialize(...teacher...)`.

The Sprint5 static suite even asserts that the Teacher Sprint5 initialization button is wired.

Thus the test treats manual Teacher cross-Sprint initialization as a premise rather than checking canonical ACT5→6 / ACT8→9 continuity.

### IDA-002 — no reload playback identity test

Sprint6 static checks prove six cue names, volume modes and audio code exist, but do not reload/reconnect with the same `feedback_audio_key` and assert one-shot suppression.

### IDA-003 — RLS omission not asserted

Sprint6 static checks assert that `s6_station_b_progress` exists, but do not assert:
- RLS enabled;
- effective anon/authenticated table privileges;
- direct REST write rejection.

## G5. Actual mutation-test limitation

This Level3 run does not have an isolated mutable Supabase clone for destructive/mutation testing.

Therefore:
- production privilege mutation tests are NOT VERIFIED;
- packet-loss/browser-kill injection is NOT VERIFIED;
- source/control-flow counterfactual analysis is used instead.

## Pattern F result

**FINDING.**

Current tests can be green while:
- NORMAL Sprint6 deadline deadlocks;
- cross-Sprint progression still requires Teacher buttons;
- one-shot audio repeats on reload;
- Station B progress table direct-access protection remains unknown.

## Method 6 disposition

No new product issue ID was required beyond IDA-001/002/003/004, but current test coverage does not falsify any of them.
