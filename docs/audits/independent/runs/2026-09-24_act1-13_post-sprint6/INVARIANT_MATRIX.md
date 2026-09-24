# INVARIANT_MATRIX — ACT1–13 post-Sprint6

Baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`

Legend:
- PASS = demonstrable server-side authority/protection at current scope;
- FAIL = confirmed violation;
- PARTIAL / NOT VERIFIED = protection cannot yet be fully proven in current implemented scope.

| # | Invariant | DB / RPC / lock protection | Client / tests | Result |
|---|---|---|---|---|
| 1 | First Choice LOCK | ACT1/2/4 per-player progress fields update only from null; ACT8 private choices PK one/player; ACT10 private choices keyed by run/phase/round/player | UI disables/reveals only after lock; Sprint3/5/6 tests cover duplicate paths | PASS |
| 2 | Missing player input never synthesized | Discussion vote waits for three; Sprint5/Sprint6 group choices count real rows; Teacher/system resolution uses separate provenance | live tests cover 3-player resolution/ties; no fabricated vote writer found | PASS |
| 3 | Room != Run | `game_runs.run_id` distinct from room; one active run index; all formal tables keyed by run | player/Teacher state expose run id | PASS |
| 4 | NORMAL != AUDIT | immutable run_mode/eligibility trigger; audit probes explicitly reject non-AUDIT; private debug requires AUDIT | test families cover mode gates | PASS |
| 5 | System/Teacher resolution != player behavior | runtime event provenance, `behavior_scoring=false`, teacher_overrides + validity, S6 group/system resolutions use null actor/system provenance | render does not convert fallback into player choice | PASS |
| 6 | Real pre-resolution evidence preserved | player decisions/messages/votes/attempts/allocations retained separately from group/system state; override validity rows append rather than rewriting choices | tests cover earlier remediation cases | PASS |
| 7 | Physical item ownership != knowledge | separate `s3_player_items` and `s3_player_knowledge` tables/provenance | Pocket render separates item/evidence concepts | PASS |
| 8 | SHARE PHOTO != ownership transfer | shared copy table has sender/receiver/source view; source physical owner row unchanged; server checks owner + shareable view | share-photo tests from Sprint3B/Sprint5 | PASS |
| 9 | One logical transition resolves once / has one effective owner | Most group gates use locks/unique constraints/request receipts. Sprint6 timed discussions have competing generic Sprint2 and Sprint6 completion owners | normal polling triggers generic resolver before S6 owner | **FAIL — IDA-001** |
| 10 | Old-phase mutations rejected | canonical ACT1–5 phase checks; exact discussion IDs; S5 phase/round; S6 expected phase/step/round | retry/stale tests exist for later Sprints | PASS |
| 11 | Formal reset/restart preserves prior run evidence | legacy `s1_reset_room` does not own formal run; no completed-run restart/finalization exists before Sprint8 | no current ACT14 restart path to exercise | PARTIAL / NOT VERIFIED — future Sprint8 boundary |
| 12 | Private unrevealed behavior not exposed to Teacher in NORMAL | `s2_get_teacher_state` filters private-phase runtime events unless AUDIT + private debug; later Sprint private state lacks a NORMAL Teacher private-content endpoint | earlier closure tests cover ACT1–5 private exposure | PASS |
| 13 | SHARE PHOTO permission is server-owned | current scene `allow_share_photo` checked server-side together with ownership/view | UI uses same scene flag | PASS |
| 14 | ACT14 finalization is not performed by Sprint6 | S6 only sets `act14_boundary_reached`; player state returns `game_completed=false`, `export_ready=false` | Sprint6 checks assert boundary | PASS |
| 15 | Canonical localization / protected-source ownership | current audio text has GA-009/010 owner evidence and GA commit before separate CD consumer commit | V2.4 / CA V1.4 active | PASS at frozen baseline |
| 16 | Critical one-shot audio does not replay on reconnect unless restarted | server retains `feedback_audio_key`, but played cue suppression exists only in in-memory `sprint6AudioIdentity` | reload resets identity; no persisted played-cue state/test | **FAIL — IDA-002** |

## D2. Server-side protection observations

Strongest protections at the current baseline are:
- run identity trigger + active-run uniqueness;
- exact discussion-session / round binding for canonical votes;
- Sprint6 expected phase/step/round plus durable action receipts and advisory request serialization;
- explicit actor/source/validity fields for formal evidence;
- dedicated Teacher Override records;
- distinct evidence storage classes;
- server-authoritative asset lifecycle.

The most important weak point is shared `discussion_sessions` ownership: the generic refresher can mutate a Sprint6-owned discussion without owning the corresponding Sprint6 phase transition.

## D3. Test protection observations

Current tests materially cover:
- run/mode creation;
- vote/tie behavior;
- private choice lock;
- route and puzzle paths;
- share-photo/knowledge;
- Teacher override;
- Asset Manager lifecycle;
- Sprint5 branch flow;
- Sprint6 branch/state/replay gates.

However no current test is known to poll through a real Sprint6 discussion deadline using the same browser refresh order; this explains IDA-001.

No current test persists/reloads one-shot playback identity; this explains IDA-002.

## D4. NOT VERIFIED

- completed-run restart semantics cannot be fully evaluated before ACT14/finalization exists;
- deployment-effective PostgreSQL ACL/RLS state awaits Method 4 evidence;
- physical three-device and active-production-audio behavior are outside current independent dynamic access.

## Method 3 disposition

Confirmed:
- IDA-001 HIGH
- IDA-002 MEDIUM

No additional invariant defect opened here.
