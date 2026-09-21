# Failure / Concurrency Snapshot Matrix

Audit run: `2026-09-21_sprint3b_baseline`  
Frozen product baseline: `3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe`

Evidence classes:
- **LIVE-COVERED** — existing live E2E executes the relevant concurrency/replay property.
- **STATIC-PROVEN** — deterministic transaction/control-flow proof is sufficient for the stated result.
- **DEFECT** — linked confirmed finding.
- **NOT VERIFIED DYNAMICALLY** — scenario is specified but this audit session cannot inject the required network/browser fault.

# I1 — Four failure windows per high-value mutation

| Mutation | Before request | During mutation | After commit / before response | After response / before refresh |
|---|---|---|---|---|
| player join | no claim | DB transaction atomic | role claimed but token can be lost; Teacher release/rejoin recovery | localStorage save occurs immediately; loss before save has same recovery |
| ACT1 opening ACK | no stage change | atomic player-progress update | stage=action persists; retry rejects; poll recovers | next poll renders action |
| ACT1 choice | no choice | atomic locked update + trigger | choice persists; retry rejects; poll recovers | consequence state recovers |
| first-meeting choice | no choice | atomic lock | persists; retry rejects | poll recovers |
| GRAB | no item/progress | atomic transaction + trigger | items/grab persist; replay rejects | poll recovers |
| leave room | no leave | serialized player progress | leave/discussion creation persists | poll sees discussion |
| message send | no message | insert/event atomic | **retry can duplicate behavior — IDA-010** | refresh displays committed message |
| vote submit | no vote | row-locked decision/resolution | locked vote persists; duplicate same-round rejects | if final vote, next client apply RPC may be lost/omitted — IDA-001 |
| meeting apply | resolved discussion remains pending | transaction applies route | route_update persists; replay rejects | poll reconstructs |
| route ACK | no ACK | run-locked ACK | ACK/third transition persists; replay rejects | poll reconstructs |
| fold-back | old route consequence | runtime scene/run locks | fold-back persists; replay rejects | poll reconstructs |
| FOLLOW SIGN | player location unchanged | per-run serialization | location/reunion persists | poll reconstructs |
| wrong Library attempt | no attempt | run-state locked write | **uncertain retry can double-count — IDA-011** | poll shows attempt/hint |
| correct Library solve | unresolved | run-state lock; one winner | resolved/ACT4 persists; retry rejects | poll reconstructs |
| ACT4 private choice | no stance | per-run serialized lock | stance persists; replay rejects | third player may create discussion/direct route |
| ACT5 apply | resolved discussion pending | runtime-scene lock | group/intermediate state persists; replay rejects | poll reconstructs |
| post-inspection route | pending route | runtime-scene lock | first route commit persists; later rejects | authority semantics pending IDA-007 |
| SHARE PHOTO | no copy | insert atomic | unique copy row survives; same-copy replay row-idempotent | recipient poll restores copy; scene permission defect IDA-008 |
| Teacher generic discussion | no session | active-run lock | generic discussion persists | players poll/display it; private-phase use = IDA-005 |
| Teacher Add Time | no extension | discussion-row lock | extension persists; uncertain retry can add twice | poll shows new deadline |

# I2 — Mandatory scenarios

## I2.1 Duplicate request

Ordinary duplicate protections:
- locked behavior choices reject;
- route ACK rejects duplicate;
- fold-back/FOLLOW SIGN/post-terminal route reject;
- correct puzzle solve rejects after scene advances;
- same SHARE PHOTO copy does not duplicate row.

Defects:
- free-text message has no logical request identity → IDA-010.
- wrong puzzle attempt has no logical request identity → IDA-011.

Teacher Add Time is intentionally repeatable and therefore cannot infer retry vs deliberate second click; no player-evidence finding is opened.

## I2.2 Simultaneous final submissions

Discussion votes:
- row lock on discussion session serializes final resolution.
- one final transaction creates resolution/re-vote.

Sprint3B all-player gates:
- migration008 run-state lock serializes player-progress updates.

Route ACK:
- game-run lock serializes three ACKs.

Correct puzzle solve:
- existing live B20 sends three concurrent correct codes;
- exactly one succeeds and group items exist once.

Status: core simultaneous-final semantics LIVE-COVERED / STATIC-PROVEN.

## I2.3 Stale tab

Sprint3B transition RPCs generally carry state implicitly through server phase checks and reject old-phase calls.

DiscussionRoom messages/votes are the major exception:
- request does not carry expected discussion_session_id/vote_round;
- server chooses latest session;
- stale action can become new-round evidence.

DEFECT: IDA-009.

Formal-vs-legacy stale/failure UI:
- higher-layer failure can expose legacy controls.

DEFECT: IDA-003.

## I2.4 Disconnect / reconnect

Ordinary persisted state:
- choices;
- discussion;
- route ACK;
- locations;
- puzzle;
- ACT4/5;
- Pocket/photo
restore from server.

Exceptions:
- resolved DiscussionRoom cannot automatically repair missing Game Track apply → IDA-001.
- released old token requires explicit recovery/rejoin.
- layered formal fetch failure can fail open → IDA-003.

## I2.5 Response loss

Deterministic unsafe cases:
- dialogue message → IDA-010.
- wrong puzzle attempt → IDA-011.
- final vote followed by lost/aborted client control flow before apply → IDA-001.

Safe/idempotent-by-state cases:
- private locked choices;
- route ACK;
- fold-back;
- FOLLOW SIGN;
- correct puzzle solve;
- final route apply.

## I2.6 Teacher/player race

Discussion state:
- open-vote/add-time/vote/message operations converge on discussion row locking; no separate write-race defect proven.

Generic discussion vs formal canonical discussion creation:
- they do not share one creation invariant/lock contract.
- a generic Teacher session and Sprint3B direct discussion can both exist.

DEFECT: IDA-002; canonical private-phase activation also IDA-005.

Teacher release vs in-flight player request:
- request authenticated before release may finish;
- subsequent calls using released token fail.
- canonical recovery contract does not require cancellation of already-running transaction; no new finding.

## I2.7 Retry after uncertain result

Safe when committed state itself acts as replay guard:
- choices;
- ACK;
- scene transitions.

Unsafe without request identity:
- messages IDA-010;
- wrong puzzle attempts IDA-011.

Cross-layer uncertainty:
- final vote result can be certain in DB while application progression remains uncertain: IDA-001.

## I2.8 Terminal transition race

ACT4 direct unanimous route:
- serialized third choice performs terminal transition once.

ACT5 Known/Unknown apply:
- runtime scene lock + scene mutation allows one apply.

Post-inspection:
- runtime scene lock + conditional group_route update allows one route commit.
- later conflicting request rejects.
- whether first valid player is legitimate decision owner remains IDA-007, not a database race.

Existing B13b verifies post-terminal replay rejection.

# I3 — High-value fault cases and verification level

| Scenario | Result | Evidence |
|---|---|---|
| three concurrent correct puzzle solves | one resolution | LIVE-COVERED B20 |
| duplicate route ACK | reject | LIVE-COVERED B6ur |
| duplicate fold-back | reject | LIVE-COVERED B6b |
| stale FOLLOW SIGN | reject | LIVE-COVERED B6a/B6c |
| post-terminal route replay | reject | LIVE-COVERED B13b |
| final-vote commit then browser dies before Game Track apply | unsafe split state | STATIC-PROVEN IDA-001; dynamic fault injection NOT VERIFIED |
| deadline crosses during Library wrapper prefix check | stale-prefix acceptance window | STATIC-PROVEN IDA-004; timing injection NOT VERIFIED |
| generic discussion races canonical creation | multiple open semantic sessions possible | STATIC-PROVEN IDA-002; simultaneous live injection NOT VERIFIED |
| stale old-round vote arrives during new round | retarget possible | STATIC-PROVEN IDA-009; delayed-request injection NOT VERIFIED |
| committed message loses response then retry | duplicate message possible | STATIC-PROVEN IDA-010; network loss injection NOT VERIFIED |
| committed wrong puzzle attempt loses response then retry | duplicate attempt possible | STATIC-PROVEN IDA-011; network loss injection NOT VERIFIED |

# I4 — Dynamic execution boundary

No isolated mutable runtime/database is available in this audit session.

Therefore the following mechanisms were **not directly injected**:
- packet/HTTP response loss;
- delayed delivery of a captured old request;
- browser termination between sequential RPCs;
- controlled database scheduling of two specific transactions;
- forced partial frontend fetch failures.

The control-flow proofs remain CONFIRMED findings where the unsafe sequence follows deterministically from the inspected code.

No finding is downgraded merely because destructive/network fault injection is unavailable.

# Method 8 conclusion

Every implemented critical state-changing path has documented:
- duplicate behavior;
- concurrent behavior;
- stale behavior;
- reconnect behavior;
- response-loss behavior;
- relevant Teacher/player race;
- terminal behavior.

Where dynamic injection is unavailable, the matrix states NOT VERIFIED DYNAMICALLY.

No new issue ID is created solely by Method 8.
