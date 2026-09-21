# Test Blind Spots — Initial Pass

Baseline: 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe
Status: INITIAL — Method 6 continuing

## 1. Important distinction

The current static checks provide useful regression assertions, but many of them verify that source text/fragments exist.

A source-fragment PASS is not equivalent to executing final database semantics after all migrations.

The live E2E suites exercise Supabase RPC behavior directly and are stronger for server logic, but this also means they bypass several browser orchestration risks.

## 2. Blind spot related to IDA-001

tests/sprint3b-live-e2e.js separates:

    vote(...)
    resolveMeeting(...)

and ACT 5 tests separately call s3b_apply_act5_resolution.

Therefore the suite assumes the bridge RPC will be invoked.

Missing test:
- final s2_submit_vote commits;
- simulated client dies before s3b_apply_*;
- reconnect occurs;
- verify server self-recovers or exposes a safe recoverable pending state.

## 3. Blind spot related to IDA-002

No current Sprint 3B live path found in the initial pass that:

- opens a generic Teacher DiscussionRoom;
- leaves it open;
- then drives Sprint 3B into its direct ACT 2 or ACT 5 DiscussionRoom creation.

Missing assertion:
- at most one open discussion/vote session exists per run, regardless of which creation path is used.

## 4. Blind spot related to IDA-003

Current live tests call RPCs directly.

They do not execute src/game/app.js in a browser and therefore cannot detect:

- Sprint 1 UI rendering before Sprint 3B state;
- transient failure of only s3b_get_player_state;
- legacy controls becoming visible during a formal run;
- overlapping refreshState calls or out-of-order browser rendering.

## 5. Mutation-lite questions queued

The later test audit will answer:

- if the final-vote → game-track apply call is removed from app.js, which test fails?
- if a generic open discussion coexists with an ACT 2 discussion, which test fails?
- if s3b_get_player_state fails while Sprint 1 remains healthy, which test fails?
- if a phase guard is removed from a Sprint 3B wrapper, which test fails?
- if an old internal wrapper regains EXECUTE permission, which live test detects it?

## 6. Current interpretation of prior PASS counts

The existing PASS counts remain valid evidence for the scenarios they actually execute.

They must not be interpreted as proof that:
- cross-RPC atomicity is safe;
- browser failure windows are safe;
- all creation paths share database invariants;
- mixed legacy/formal UI states are impossible.
