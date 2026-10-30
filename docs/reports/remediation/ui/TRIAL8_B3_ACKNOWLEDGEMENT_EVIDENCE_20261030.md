# Trial 8 B3 immediate processing acknowledgement

CA authorization: `CA_to_CD_20261030T170500Z_B3.md`. Source change is confined to `src/game/app.js`. On ACT2 chat/vote and S6 actions (including ACT9 RED and ACT10 LEAVE/Continue), the existing status node now shows catalog key `act01-g.033` (Waiting / Wachten / 等待中) with `role=status` and `aria-busy=true` immediately on click. It is a processing indication, not an accepted vote, committed message, or Scene transition. The status remains through the authoritative refresh, including an older frame discarded by the refresh coordinator. RPC failure removes the busy state and displays the existing error; existing request identities and retry handling remain. A changed player session/epoch cannot retain the old indicator.

| 250 ms injected projection delay, one local Chrome sample | Before: authoritative target visible (B2) | After: processing visible | After: authoritative target visible |
|---|---:|---:|---:|
| ACT2 chat transcript | 834 ms | 62 ms | 860 ms |
| ACT2 vote locked | 824 ms | 28 ms | 837 ms |
| ACT9 RED → DO NOT ENTER | 1081 ms | 70 ms | 1137 ms |
| ACT10 LEAVE → discussion | 1125 ms | 47 ms | 1119 ms |
| ACT10 result Continue → ACT11 Station | 1112 ms | 44 ms | 1109 ms |

Before B3 there was no processing status; these B2 target timings are comparison points, not paired performance measurements. The after timings are single mocked-browser samples. The patch improves perceived response, not authoritative projection latency, and makes no production percentile or live-room claim. The delayed-read fixtures assert that the processing status appears before transcript, locked vote, or new Scene. The existing stale-identity browser regression passed with one accepted decision and idempotent retry. Teacher gate timing is unchanged; Station remains unavailable during ACT10 discussion.

Verification: `tests/trial8-latency-decomposition-browser.mjs`, `tests/trial8-t2-transition-latency-browser.mjs`, `tests/trial8-teacher-retained-room-start-browser.mjs`, `tests/trial6-act1-vote-stale-identity-browser.mjs` all passed. No database, migration, live room, or deployment change.
