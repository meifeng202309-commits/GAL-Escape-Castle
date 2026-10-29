# Trial 8 ACT1–ACT13 interaction matrix and latency root-cause report

Date: 2026-10-30  
Evidence: current `src/game/app.js`, `src/teacher/teacher-console.js`, canonical specs, and production read-only room `T2` / run `ef10d5dd-0906-4989-9e06-b6df43d46dbd`

## Client timing architecture

Every Player mutation handler awaits its RPC and then generally awaits `refreshState()`. A committed active frame performs two serial authority reads (`s8_get_player_state`, then `s2_get_player_state`), five parallel projections, and up to two conditional projections. Only after that frame completes does the next periodic poll wait 1200 ms. Therefore the normal poll interval is **frame duration + 1200 ms**, not a fixed 1200 ms. Overlapping refreshes coalesce to one queued generation and stale generations are discarded correctly; this protects identity but can delay visibility behind an in-flight frame. Stable `#messageText` composition no longer blocks authoritative voting, while remounted inputs still defer a frame until bounded composition recovery.

Teacher `loadState()` fetches `s1_get_teacher_state`, renders, then waits for discussion and operations groups. Its interval is 1200 ms, but overlapping async interval calls are not explicitly serialized. Mutation handlers also refresh their own state after RPC completion.

## Complete interaction inventory

“Measured” means a production authoritative timestamp exists; it is not a click→DOM measurement unless explicitly stated.

| ACT | Actor / interaction | Client handler → RPC owner | Subsequent read / expected visible response | Timer/gate | T2 or test evidence |
|---|---|---|---|---|---|
| Setup | Teacher create room | `createRoom` → `s1_create_room` | `watchRoom/loadState`; room and 3 slots visible | none | T2 room 15:00:35Z; PASS |
| Setup | Players join/switch session | `joinRoom` → `s1_join_player` | full Player frame; pre-run notice | 1200 ms polling after frame | T2 joins 15:00:50–15:01:16Z; PASS |
| Setup | Teacher Start Formal Run | `startRun` → `s9_start_formal_game` | Teacher discussion state; Player ACT1 frame | 3-player readiness | T2 run 15:01:27Z. TESTC retained-page button P0 confirmed; no RPC attempted there. |
| ACT1 | Acknowledge opening | `runSprint3bAction` → ACT1 acknowledgement RPC | s3b projection; private action choices | no deliberate timer | T2 acknowledgements measured; uninstrumented DOM latency |
| ACT1 | Private first choice | `runSprint3bAction` → ACT1 choice RPC | local consequence / Pocket | per-player barrier | T2 response-duration 2.184–5.470s (human response clock, not RPC latency) |
| ACT1 | Complete consequence | `runSprint3bAction` → consequence RPC | next player stage; all-three transition to ACT2 | 3-player barrier | T2 final transition atomic at 15:02:51.960Z |
| ACT2 | First-meeting route choice | `runSprint3bAction` → first-meeting RPC | private lock/wait | 3-player barrier | T2 response clocks 5.307s, 30.576s, 57.535s; mostly participant pacing |
| ACT2 | GRAB + LEAVE | `runSprint3bAction` → `s3b_grab_and_leave` | combined receipt; discussion when all complete | 3-player barrier | T2 final combined action and discussion transition same timestamp 15:03:53.892Z |
| ACT2 | Share Pocket photo | `shareSprint5Photo` → `s3_share_photo` | recipient Pocket/photo indication | none | T2 five near-identical star shares in 20 ms: duplicate-action lead; click count unknown |
| ACT2 | Send discussion message | `sendMessage` → `s2_send_message` | transcript acknowledgement via refresh | Teacher opens vote | T2 messages accepted; no request/DOM clocks |
| ACT2 | Teacher Open Vote | `openVote` → `s2_open_vote` | voting frame/buttons | Teacher-paced | Open 15:05:03.064Z |
| ACT2 | Final vote | `submitVote` → `s2_submit_vote` | submitted count; majority transition | 3 votes | Third vote and route transition atomic 15:05:29.685Z |
| ACT2 | Route update acknowledge | `runSprint3bAction` → route ack RPC | per-player ack; rendezvous after all | 3-player barrier | 15:05:45, 15:08:21, 15:08:38; long span is participant pacing |
| ACT2/3 | Route consequence / follow sign | `runSprint3bAction` → progression RPC | ACT3 wayfinding then library lock | 3-player barrier | final follow at 15:09:14.875Z atomically enters library box |
| ACT3 | Library code submit | `submitLibraryCode` → `s3b_submit_library_code` | attempt feedback or ACT4 | none | Correct attempt and ACT4 transition atomic 15:10:10.685Z |
| ACT3 | Pocket inspect/flip/share | `inspectPocketItem`, `flipSprint5Item`, share handlers → S9/S3 RPCs | stable Pocket detail/media | asset resolve/network/decode | Public deterministic Pocket gate PASS; T2 click-to-visible unmeasured |
| ACT4 | Private known/unknown choice | `runSprint3bAction` → ACT4 choice RPC | waiting; ACT5 when all lock | 3-player barrier | response clocks 50.117–82.922s are phase-start→human choice, not transport |
| ACT5 | Route discussion/message/vote | `sendMessage` / `submitVote` → S5 RPCs | transcript/vote/route | Teacher-paced, 3 votes | T2 canonical flow prepared automatically; detailed ACT5 vote not separately observed |
| ACT5→6 | Enter Portrait Hall | `runSprint5Action` → `s5_advance` | waiting barrier; ACT6 discussion | 3-player barrier | 15:11:43, 15:11:55, 15:12:02; final entry and ACT6 start atomic |
| ACT6 | Messages | `sendMessage` → `s5_send_message` | transcript ack | Teacher-paced | six T2 messages accepted |
| ACT6 | Teacher Open Vote | `openVote` → `s5_teacher_open_vote` | vote buttons | Teacher-paced | 15:14:49.497Z |
| ACT6 | Portrait vote | `runSprint5Action`/`submitVote` → `s5_submit_vote` | count/result | 3 votes / tie policy | third vote and answer transition atomic 15:15:09.763Z |
| ACT6→7 | Advance answer | `runSprint5Action` → `s5_advance` | ACT7 voting | none | transition 4.516s after result event; click/DOM clocks absent |
| ACT7 | Teacher Open Vote + clock vote | Teacher S5 open; Players S5 vote | solved answer | 3 votes / repeat policy | third vote and solved transition atomic 15:16:20.475Z |
| ACT7→8 | Advance | `runSprint5Action` → `s5_advance` | ACT8 private buttons | none | transition 6.837s after solved event; user reaction included |
| ACT8 | Private route choices | `runSprint5Action` → `s5_submit_private_choice` | wait/reveal route | 3-player barrier | third choice and route transition atomic 15:17:10.592Z |
| ACT8→9 | Advance / S6 init | `runSprint5Action` → `s5_advance` | ACT9 discussion | automatic S6 initialization | route→S6/ACT9 transitions at 15:17:14.225Z |
| ACT9 | Discussion message | `sendSprint6Message` → `s6_send_message_v2` | transcript ack | Teacher-paced | T2 messages accepted |
| ACT9 | Teacher Open Vote | `openVote` → `s6_teacher_open_vote` | console action buttons | NORMAL Teacher-paced | rounds opened at 15:18:04, 15:20:25, 15:23:17 |
| ACT9 | Door group choice | `runSprint6Action` → `s6_submit_group_choice_v2` | submitted count / next action step | 3 votes | RED third vote resolved atomically 15:24:14.776Z; first DO NOT ENTER submission 7.925s later. This is an upper bound including poll+reading+human reaction, not proof of 7.925s DOM delay. |
| ACT9 | DO NOT ENTER / next door / enter | same group-choice RPC | next action step or ACT10 | 3 votes each | Server resolves on each third vote immediately; long 2m01 gap between first and second DO NOT ENTER submissions is participant pacing, not transition latency |
| ACT10 | Private gold-key choice | `runSprint6Action` → `s6_submit_private_choice_v2` | discussion after 3 choices | 3-player barrier | third LEAVE at 15:28:24.288Z returned discussion id immediately |
| ACT10 | Discussion messages | `sendSprint6Message` → S6 message RPC | transcript ack | Teacher-paced | messages at 15:28:47–15:29:04 |
| ACT10 | Teacher Open Vote | `openVote` → S6 teacher vote RPC | final vote buttons | Teacher-paced | 15:29:13.811Z, 49.523s after third private choice; expected human Teacher gate, not automatic delay |
| ACT10 | Final group vote | `runSprint6Action` → group choice RPC | result/advance action | 3 votes | third vote resolved atomically 15:29:34.104Z |
| ACT10→11 | Continue | `runSprint6Action` → `s6_advance_v2` | ACT11 discussion/allocation path | canonical phase rules | advance accepted 15:29:43.937Z; first allocation only at 15:35:39.285Z. Logs cannot partition this 5m55s into Teacher gate, reading, projection or UI delay. |
| ACT11 | Discussion/message | S6 message RPC | transcript | Teacher close/advance semantics | two messages observed; close/open operation not represented in runtime events |
| ACT11 | Allocation choice | `runSprint6Action` → `s6_submit_allocation_v2` | count; ACT12 tasks after valid 3-role allocation | 3 players, unique roles | third allocation validates immediately 15:35:49.714Z |
| ACT12 | Station task input/buttons | `submitSprint6Station` / `runSprint6Action` → `s6_complete_station_v2` | per-station completion/engage | B lever has intentional 1200 ms local center timer | C, B and A tasks accepted; B lever center 2.417s after hold includes intentional 1.2s plus polling/user/runtime |
| ACT12 | Engage | `runSprint6Action` → `s6_engage_v2` | engaged count; pressure after third | 3 stations | third engage starts pressure atomically 15:36:35.730Z |
| ACT12 | Pressure private choice | `runSprint6Action` → private-choice RPC | submitted count; cinematic/ACT13 | 3 choices | response latency 5.039–16.838s; third accepted 15:36:52.568Z |
| ACT13 | Cinematic/continue availability | render driven by S6 state; button only when `act13_continue_at <= now` | continue button | intentional server continue-at gate and cinematic stages | T2 scene transition to ACT13 15:37:13.909Z; gate duration not logged in client |
| ACT13 | Continue | `runSprint6Action` → `s6_advance_v2` | ACT14 boundary | continue-at precondition | accepted 15:37:20.178Z |
| Any | Periodic Player refresh | coordinator → projection reads | confirmed frame / DOM | full-frame duration + 1200 ms | Structural source fact; p50/p95 not measured |
| Any | Teacher periodic refresh | `setInterval(loadState,1200)` | room/discussion/operations DOM | possible overlapping loads | Source fact; stale Start reset bug reproduced by retained state |

## Root-cause ranking

1. **Confirmed P0 state leak:** stale Teacher control disabled state. Smallest safe correction is two explicit resets plus retained-page test.
2. **Confirmed systemic latency exposure:** a mutation's visible acknowledgement waits for a full multi-projection frame, and the next poll is scheduled only after frame completion plus 1200 ms. This can amplify any slow projection. It is a mechanism, not yet a measured 60-second cause.
3. **Confirmed Teacher/player barriers misread as latency:** ACT10 third private choice immediately created discussion, then waited ~49.5s for Teacher Open Vote; many other large intervals are between different players' submissions. These must retain semantics.
4. **Possible duplicate action feedback weakness:** five identical T2 photo-share events within 20 ms and repeated messages exist. They may represent repeated human clicks, retries, or insufficient immediate disable/ack. No universal cause is proven.
5. **External asset tails:** prior public Scene diagnostics measured healthy candidate decode around 0.95–1.58s and one untraced 29.6s initial visibility outlier. Do not conflate asset/network tails with RPC progression.

## Missing evidence and next test gate

Production logs lack browser `performance.now()` marks, request start/finish, projection-level completion and DOM-visible timestamps. Therefore no honest p50/p95 can be calculated for click→visible latency. T8-B2 should add test-only timing capture around existing mocked and isolated synthetic paths, with injected per-projection delay. It must report each decomposition component and preserve Teacher-paced gates. A database-backed synthetic room is useful only under separate authorization; this investigation did not mutate T2/TESTC.

## Proposed acceptance bounds (measurement protocol, not product SLA)

- For deterministic local mocked tests, disclose p50/p95/worst for each interaction family with 0/250/1000 ms injected projection delays.
- Assert authoritative server transition is not delayed after the final required submission.
- Assert DOM visibility delay is attributable to at most one confirmed refresh generation; record any queued in-flight predecessor separately.
- Never count participant or Teacher waiting time as RPC/UI latency.
- Preserve intentional ACT12 lever 1200 ms and ACT13 continue/cinematic gates.

No source, database, room, Storage or deployment change was made.
