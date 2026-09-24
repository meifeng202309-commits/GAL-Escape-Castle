# FAILURE_MATRIX — ACT1–13 post-Sprint6

Baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`

| Mutation / transition | Pre-request failure | During mutation / race | Post-commit / response loss | Retry / reconnect | Result |
|---|---|---|---|---|---|
| join/session claim | no server change | role/session claim hardened by locks/constraints | reconnect can recover assigned session state | Teacher release/rejoin supported | PASS |
| ACT1 first choice | no choice | null-only update locks once | committed choice survives | retry may report locked; reconnect exposes committed state | PASS |
| generic ACT2/5 message/vote | no mutation | exact discussion/round row locks | request ids prevent duplicate message/vote | reconnect uses server session | PASS |
| Library puzzle | no attempt | run-state row lock serializes attempts | request identity after remediation avoids duplicate attempt semantics | reconnect sees authoritative attempts/hint | PASS |
| SHARE PHOTO / item view | no change | server ownership/current-view/scene permission | durable shared-copy/item-view row | reconnect restores | PASS |
| Teacher Override | no change | source scene/phase/action allowlist + lock | durable override/provenance | stale/replay rejected or represented | PASS |
| Asset activation/rollback | candidate remains previous state | group/registry lock & event transition | lifecycle/event state durable | retry paths governed | PASS within source-level proof |
| Sprint5 vote / final route | no vote | exact session/round + state locks | request replay protected | reconnect sees round/route | PASS |
| Sprint5→Sprint6 boundary | players stop at completed ACT8 | no automatic owner invokes next Sprint | Teacher response/action required | reconnect remains at completed Sprint5 until Teacher init | **FAIL — IDA-004** |
| Sprint6 timed discussion deadline | before deadline normal state | first post-deadline generic poll can resolve shared row under wrong owner | split state commits | reconnect cannot recover exact S6 close because row already resolved | **FAIL — IDA-001** |
| Sprint6 group/private/allocation/station/ENGAGE | no mutation | v2 advisory request lock + state row lock | durable action receipt | stable browser request identity enables replay | PASS |
| Sprint6 cinematic polling | no stage change | row lock serializes ticks | stage state durable, but historical stages overwritten | current stage recovers | gameplay PASS; forensic gap IDA-005 |
| Sprint6 one-shot audio playback | no playback | client handle prevents same-page duplicate identity | playback success itself not durably acknowledged | page reload resets identity and can replay same cue | **FAIL — IDA-002 / history aspect IDA-005** |
| Station B direct-table boundary | governed RPC path safe | table participates in authoritative gate | n/a | effective direct privilege unknown | **NOT VERIFIED — IDA-003** |
| ACT13→ACT14 boundary | pause enforced | v2 advance serialized | receipt durable | reconnect sees boundary | PASS; finalization intentionally absent |

## I2–I5 conclusions

Strongest failure handling:
- later Sprint request identity;
- exact discussion/round identity;
- row/advisory locks;
- durable evidence tables;
- server-reconstructed reconnect.

Weakest failure boundaries:
1. competing resolver at Sprint6 deadline;
2. out-of-band Teacher dependency at Sprint boundaries;
3. browser-memory-only audio playback identity;
4. unverified direct-table protection for Station B progress.

Packet-loss/browser-kill injection against production was not independently executed in this Level3 run; conclusions use deterministic transaction/reconnect control-flow evidence and prior live-test structure.

## Method 8 disposition

No new issue beyond IDA-001/002/003/004/005.
