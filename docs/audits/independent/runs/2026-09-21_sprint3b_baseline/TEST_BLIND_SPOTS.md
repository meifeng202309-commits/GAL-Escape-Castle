# Test-Suite Blind-Spot / Mutation-Lite Audit

Audit run: `2026-09-21_sprint3b_baseline`  
Frozen product baseline: `3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe`

# G1 — Test inventory

In-scope suites:

| Sprint | Static | Live E2E | Main test style |
|---|---|---|---|
| Sprint1 | `tests/sprint1-static-check.js` | `tests/sprint1-live-e2e.js` | browser asset wiring + live room/session/legacy state |
| Sprint2 | `tests/sprint2-static-check.js` | `tests/sprint2-live-e2e.js` | source-contract fragments + direct Supabase RPC DiscussionRoom |
| Sprint3A | `tests/sprint3a-static-check.js` | `tests/sprint3a-live-e2e.js` | schema/provenance fragments + direct RPC Pocket/provenance |
| Sprint3B | `tests/sprint3b-static-check.js` | `tests/sprint3b-live-e2e.js` | wrapper/revoke/source fragments + direct RPC ACT1–5 flow |

## G1.1 Sprint1 live strengths

Directly exercises:
- Teacher auth;
- room creation collision;
- join-code uniqueness;
- three role joins;
- pre-reveal privacy;
- browser-supplied label canonicalization;
- duplicate private choice;
- reveal barrier;
- reconnect;
- Teacher advance;
- legacy reset;
- Teacher release/rejoin;
- concurrent double-join;
- direct anonymous table isolation.

This suite genuinely exercises server behavior rather than only inspecting source.

## G1.2 Sprint2 live strengths

Directly exercises:
- NORMAL metadata;
- active-run uniqueness;
- three-player transcript;
- reconnect;
- Teacher observation;
- pre-vote privacy;
- duplicate vote;
- 3:0 / 2:1;
- 1:1:1 re-vote;
- repeated re-vote;
- AUDIT metadata;
- missing-player timeout without synthesis;
- Teacher Add Time;
- option and non-option fallback semantics;
- sequential discussion history isolation;
- invalid vote option;
- direct read/write RLS.

## G1.3 Sprint3A live strengths

Directly exercises:
- NORMAL rejecting AUDIT fixture;
- isolated scene/Pocket/observation/knowledge/group fixture;
- current-view sharing;
- physical ownership preserved;
- knowledge not silently transferred;
- re-share by recipient rejected;
- reconnect;
- Teacher private-content isolation;
- run isolation;
- provenance negative probes;
- direct RLS.

## G1.4 Sprint3B live strengths

Directly exercises:
- flow-init replay;
- sampled `*_pre011` browser denial;
- role-specific ACT1 identity;
- early ACT2 rejection;
- ACT1 privacy/consequence;
- all-three gate;
- GRAB/leave and optional-item semantics;
- meeting result apply;
- route-update three-ACK barrier;
- fold-back;
- FOLLOW SIGN;
- puzzle timeout/prefix;
- locked-wheel rejection after refresh;
- ACT4 direct/disagreement branches;
- ACT5 majority/fallback/Inspect First;
- post-inspection terminal;
- timeout auto-resolution;
- concurrent correct Library solves;
- run isolation;
- direct RLS.

# G2 — Test-to-invariant / finding mapping

| Protection / invariant | Strong existing test evidence | Blind spot |
|---|---|---|
| First Choice LOCK | Sprint1 C3; Sprint2 A8; Sprint3B role/replay checks | ACT1 response-latency start is not tested → IDA-006 |
| Missing player input not synthesized | Sprint2 D2/D3; fallback tests | future Teacher Override outside baseline |
| Room != Run | Sprint2 run metadata; Sprint3A A8; Sprint3B B21 | complete formal multi-run restart not available |
| NORMAL != AUDIT | Sprint2 D1; Sprint3A A1 | deployment catalog role state not inspected |
| system fallback != player behavior | Sprint2 E1/E3/E4; Sprint3B B16 | future Teacher Override outside baseline |
| evidence preserved | re-vote/history/fold-back tests | response-loss duplicates can create false extra evidence → IDA-010/011 |
| item ownership != knowledge | Sprint3A A4/A5 | scene sharing permission not tested → IDA-008 |
| SHARE PHOTO != ownership transfer | Sprint3A A4 | `allow_share_photo` condition absent from test and server |
| transition exactly once | Sprint3B replay tests + B20 | response-loss idempotency not covered |
| old phase rejected | B1a/B6a/B13b + wrappers | generic DiscussionRoom, SHARE PHOTO and stale DiscussionRoom identity not covered → IDA-005/008/009 |
| reset/restart preserves formal evidence | legacy reset scoped test only | full formal restart NOT VERIFIED |
| Teacher privacy | Sprint1 C1; Sprint2 A7; Sprint3A A7 | current tests are strong for implemented layers |

# G3 — Static vs behavioral classification

## G3.1 Static tests

The four static suites are valuable regression sentinels, but largely check source fragments:
- function names exist;
- expected SQL fragments exist;
- revoke statements exist;
- frontend binding strings exist;
- removed labels do not appear.

A static fragment check proves **text presence**, not:
- final CREATE OR REPLACE semantics;
- effective deployed ACL;
- transaction ordering;
- browser failure behavior;
- response-loss safety;
- stale-tab behavior.

Examples:
- Sprint3B static check confirms revoke lines exist for internal helpers; only live B0p establishes runtime denial for sampled functions.
- a source check for a row-lock fragment does not prove the entire mutation is correctly serialized.

## G3.2 Live tests

Live tests are much stronger for SQL/RPC semantics.

But Sprint2/3A/3B live suites primarily call RPCs directly. They do not execute the actual browser page as a distributed client.

Therefore they do not naturally detect:
- UI fail-open layering (IDA-003);
- second-RPC bridge dependency (IDA-001) unless the test deliberately omits it;
- stale UI request identity (IDA-009);
- network response-loss retry duplication (IDA-010/011);
- canonical UI permission mismatch such as IDA-005/008 unless direct negative calls are added.

# G4 — Counterfactual mutation review

Mandatory question: **if this guard were removed, which existing test would fail?**

## G4.1 Run-id / run-isolation guard

If player/run state crossed runs:
- Sprint3A A8 should fail.
- Sprint3B B21 should fail.
- RLS direct-access tests provide additional isolation evidence.

Coverage: GOOD.

## G4.2 Phase guard

Examples with behavioral coverage:
- remove FOLLOW SIGN pre-wayfinding guard → Sprint3B B6a should fail.
- permit post-terminal route mutation → B13b should fail.
- permit early ACT2 submission → B1a should fail.

But:
- remove canonical scene restriction from generic DiscussionRoom: there is no such guard and no negative test → IDA-005.
- SHARE PHOTO has no scene permission and no negative phase test → IDA-008.
- stale DiscussionRoom requests do not carry expected phase/session identity → no existing test → IDA-009.

Coverage: PARTIAL.

## G4.3 Row lock / serialization

Puzzle:
- remove serialization around correct solve → B20 is designed to detect multiple successful resolutions/group-item duplication.

Route ACK:
- tests verify 1/2/3 sequential ACK semantics, but do not issue three simultaneous ACKs.

Player-progress run lock:
- ACT1/GRAB/leave/FOLLOW SIGN use several Promise.all paths and validate final state, but tests are not specifically mutation-sensitive to duplicate transition events/discussion creation if the row lock were removed.

Coverage: GOOD for puzzle, PARTIAL for every group gate.

## G4.4 Duplicate-submit protection

Covered:
- legacy private choice C3;
- vote A8;
- flow init B0;
- leave B5r;
- meeting apply B6r;
- route ACK B6ur;
- fold-back B6b;
- FOLLOW SIGN B6c;
- terminal route B13b.

Not covered:
- same logical free-text submission retried after uncertain commit → IDA-010.
- wrong puzzle attempt retried after uncertain commit → IDA-011.

Coverage: STRONG for ordinary duplicate calls; WEAK for distributed retry idempotency.

## G4.5 Fallback/player distinction

Sprint2 E1/E3/E4 explicitly asserts:
- `resolution_source = system_fallback`;
- non-option fallback not represented as `choice_id`.

Sprint3B B16 verifies ACT2 fallback is applied.

Coverage: GOOD.

## G4.6 Internal-helper privilege revoke

Static:
- Sprint3B static check requires revoke source for all listed `*_pre011` helpers.

Live:
- B0p samples three renamed internal functions:
  - `s3b_follow_sign_pre011`
  - `s3b_apply_meeting_resolution_pre011`
  - `s3b_submit_library_code_pre011`

Therefore removing revoke from one of the **unsampled** historical functions could still leave the live suite green while static source might catch the missing line.

Coverage: source-complete, live-sampled.

## G4.7 Reconnect

Strong behavioral coverage:
- Sprint1 C6;
- Sprint2 A5/D4;
- Sprint3A A6;
- Sprint3B route/puzzle reconnect assertions.

Missing recovery case:
- resolved DiscussionRoom with Game Track apply omitted → IDA-001.
- browser formal-layer failure while legacy layer succeeds → IDA-003.

Coverage: STRONG for ordinary persistence, WEAK for split-layer recovery.

## G4.8 Cross-layer atomicity

No current test deliberately:
1. commits final vote;
2. suppresses `s3b_apply_*`;
3. reconnects;
4. asks whether server repairs or safely exposes pending progression.

Therefore removing the client bridge call from `app.js` would not fail the direct-RPC Sprint3B suite, because the suite itself explicitly invokes resolver functions.

Coverage: MISSING for IDA-001.

# G5 — Actual mutation tests / execution boundary

The protocol prefers selected actual mutation tests in an isolated branch/database when practical.

This audit session does not have:
- an isolated Supabase/PostgreSQL test deployment;
- deployment credentials suitable for destructive/mutated schema testing;
- a safe alternate branch wired to an isolated runtime DB.

Therefore **actual mutation injection is NOT VERIFIED / not executed**.

This does not block Method 6 because:
- counterfactual mutation analysis is completed;
- existing live tests are mapped to the guards they exercise;
- every HIGH finding has an explicit missing or existing test target.

## G5.1 Required future high-value tests

Highest priority additions:

1. **IDA-001**
   - final vote commits;
   - suppress next `s3b_apply_*`;
   - reconnect;
   - assert automatic/idempotent repair or explicit recoverable pending transition.

2. **IDA-005**
   - during ACT1/private_first_action call generic `s2_open_discussion`;
   - assert reject/no session/no event.

3. **IDA-006**
   - three players acknowledge ACT1 opening at different controlled times;
   - assert each has server-persisted action-start and reconstructable latency.

4. **IDA-008**
   - after GRAB but before canonical discussion, direct `s3_share_photo`;
   - assert reject/no copy.
   - repeat inside allowed discussion and assert success.

5. **IDA-009**
   - hold a Round-N vote/message request;
   - create Round N+1;
   - deliver stale request;
   - assert reject by interaction identity.

6. **IDA-010**
   - commit dialogue message but drop response;
   - retry same request identity;
   - assert one row/event.

7. **IDA-004 / IDA-011**
   - deadline becomes due without prior refresh, then incompatible code submit;
   - post-commit response-loss wrong-attempt retry;
   - assert locked-prefix and attempt ledger correctness.

# Method 6 conclusion

Existing PASS counts remain valid evidence for scenarios actually executed.

They are **not evidence** that:
- browser orchestration is atomic;
- stale tabs cannot write into newer interactions;
- response-loss retries are idempotent;
- every canonical scene permission is enforced;
- all renamed internal wrappers have been live-tested individually.

No new product finding is created solely from test coverage analysis.

Method 6 completion boundary:
- inventory: COMPLETE;
- invariant map: COMPLETE;
- static-vs-behavior classification: COMPLETE;
- counterfactual mutation review: COMPLETE;
- actual mutation execution: evaluated and explicitly **NOT VERIFIED** due absence of isolated mutable runtime.
