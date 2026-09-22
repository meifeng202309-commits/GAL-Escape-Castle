# Data-Forensics / Evidence Reconstruction Audit

Audit run: `2026-09-21_sprint3b_baseline`  
Frozen product baseline: `3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe`

Goal: determine whether a completed implemented history can be reconstructed from persisted server evidence without guessing.

# J1 — Representative controlled histories

Representative histories selected:
1. ACT1 private first action and consequence.
2. ACT2 first-meeting → DiscussionRoom → final route → route update.
3. Failed rendezvous / fold-back to Library.
4. Library puzzle player attempts + system fallback.
5. ACT4 private route choices → direct resolution or ACT5 discussion / Inspect First.

Cross-cutting:
- run identity;
- player/system attribution;
- provenance;
- missing data;
- chronology.

# J2 — Player behavior evidence

## J2.1 ACT1 first choice

Persisted:
- `run_id`;
- `player_id`;
- `act1_choice_id`;
- `act1_locked_at`;
- consequence facts with `discovered_at`;
- selected observations with `discovered_at`.

Attribution:
- choice is attributable to a real authenticated player.

Reconstructable:
- which choice was locked;
- who chose it;
- submission timestamp;
- downstream fact/observation consequences.

Not reconstructable:
- canonical response latency because actionable-start timestamp is missing.

Finding: **IDA-006**.

## J2.2 ACT2 first-meeting stance

Persisted:
- `first_meeting_choice`;
- `first_meeting_locked_at`;
- player identity.

Queued “first messages” are rendered later from the persisted choice/template rather than stored as separate dialogue rows.

Reconstructable:
- the player's locked initial meeting stance/content template;
- submission timestamp.

Not durably reconstructable:
- canonical first-meeting response time;
- exact timing of later GRAB/leave actions because those are booleans without action timestamps/events.

Findings:
- response latency → **IDA-006**;
- action/transition chronology → **IDA-012**.

## J2.3 Discussion messages

Persisted `dialogue_messages` contains:
- run;
- discussion_session_id;
- scene/phase/step;
- player;
- text;
- created_at.

`runtime_events` additionally records `dialogue_message_sent` with actor and message_id.

Ordinary attribution is strong.

Forensic ambiguity:
- response-loss retry can create a second genuine-looking row/event for one real-world action;
- the database cannot distinguish deliberate duplicate text from uncertain retry duplication.

Finding: **IDA-010**.

## J2.4 Votes / re-votes

Persisted `runtime_player_decisions` contains:
- run;
- discussion_session_id;
- scene/phase/step;
- vote_round;
- player;
- choice;
- locked_at;
- validity/context fields.

Discussion sessions preserve each round and outcome.

Ordinary re-vote chronology is reconstructable.

Forensic corruption path:
- stale requests are server-retargeted to the latest discussion/round, so persisted identity may not match the interaction the player actually acted on.

Finding: **IDA-009**.

# J3 — System / fallback evidence

## J3.1 Discussion fallback

Strong evidence:
- `discussion_sessions.outcome` stores fallback result;
- `resolution_source = system_fallback`;
- `vote_resolved_fallback` event has null player actor;
- actual player votes remain separate.

Attribution: SYSTEM.

Result: reconstructable.

## J3.2 Failed rendezvous / fold-back

For non-Library routes:
- original `final_meeting_result` remains;
- `failed_rendezvous` event is appended with route and `behavior_scoring=false`;
- operational route/current scene later folds to Library.

Reconstructable:
- original group decision;
- that a system/game-track fold-back penalty occurred.

Gap:
- the scene transition sequence itself is not append-only logged; final current-scene row overwrites prior scene timing.

Finding: **IDA-012**.

## J3.3 Puzzle player attempts

`s3b_library_attempts` stores:
- run;
- attempt_number;
- submitted_by;
- submitted_value;
- submitted_at;
- correct.

This is strong attempt evidence.

Ambiguity:
- uncertain response retry of a wrong attempt creates another numbered attempt indistinguishable from a genuinely repeated real attempt.

Finding: **IDA-011**.

## J3.4 Puzzle system fallback

Strong system evidence:
- each overdue locked-wheel stage writes `puzzle_fallback_hint`;
- actor is null;
- payload contains hint_stage, locked_prefix, text_key, `resolution_source=system_fallback`, `behavior_scoring=false`;
- final automatic open writes `puzzle_resolved_system_fallback`;
- no fake player attempt is added.

Attribution: SYSTEM.

Result: reconstructable and materially stronger than most other Sprint3B Game Track transitions.

# J4 — Route / group decision / provenance / run identity

## J4.1 ACT2 meeting result

Discussion evidence can reconstruct:
- all messages;
- votes/re-votes;
- resolved majority/fallback and `ended_at`.

`s3b_run_state.final_meeting_result` preserves the applied historical route.

But the separate Game Track apply time is not append-only logged:
- discussion may resolve at T1;
- client may call `s3b_apply_meeting_resolution` at T2;
- after later state changes, T2 is not durably recoverable.

This is particularly important to IDA-001 because a split-state interval can disappear from later current state.

Finding: **IDA-012**; cross-layer failure remains **IDA-001**.

## J4.2 Route update

Per-player ACK evidence:
- `route_update_ack_at` gives durable timestamps.

Third ACK deterministically triggers the next scene.

However:
- there is no append-only scene-transition event;
- later `s3_runtime_scene_state.updated_at` no longer retains route-update→route-consequence history.

Finding: **IDA-012**.

## J4.3 ACT4 private choices

Persisted:
- each `act4_choice_id`;
- each `act4_locked_at`.

A unanimous Known/Unknown direct group route can be inferred deterministically from the three rows and the latest choice timestamp.

But:
- direct group-route application / terminal scene transition is not appended as an explicit event;
- response latency lacks a durable start boundary.

Findings: **IDA-006**, **IDA-012**.

## J4.4 ACT5 discussion / Inspect First

Discussion messages/votes/outcome are reconstructable through Sprint2 evidence.

Game Track apply to Known/Unknown/Inspect First lacks a dedicated append-only apply/transition event → **IDA-012**.

Post-inspection route is better:
- `post_inspection_group_route` event records route and `submitted_by`.

Post-audit canonical clarification (2026-09-22):
- V4.0 §14.4 now defines this as a three-player Game-only Step Vote;
- all three real players submit one locked known/unknown vote;
- shared route resolves only after all three votes, by 3:0 or 2:1 majority;
- no single player owns the final group resolution.

Current implementation still accepts the first valid player's p_route as the shared group route.

Finding: **IDA-007 MEDIUM / CONFIRMED**.

## J4.5 Pocket / knowledge provenance

Backend persistence is strong:
- physical item owner + acquired_at;
- observations + discovered_at_scene/discovered_at;
- knowledge + source/source_player/source_item/delivered_at;
- shared photo + shared_by/received_by/source_view/shared_at;
- group items + acquired_at;
- provenance writer validates cross-room/source semantics.

Current Sprint3B student client has no Pocket/FLIP/SHARE PHOTO bindings, so full production Pocket user history is **not an active ACT1–5 client path** in this frozen baseline.

Backend provenance is reconstructable for exercised Sprint3A/AUDIT fixture paths.

Scene-level permission defect remains **IDA-008** if SHARE PHOTO is called directly.

## J4.6 Run identity

Strong evidence:
- `game_runs.run_id`;
- room_code;
- run_started_at;
- immutable run_mode;
- immutable behavior_dataset_eligible;
- one active run per room;
- all formal evidence tables key to run_id.

Attribution:
- room is access container;
- run is formal playthrough.

Result: reconstructable.

# J5 — Missing data / attribution boundaries

## Real player

Strongly attributable:
- discussion messages;
- votes;
- private choices;
- puzzle attempts;
- shared-photo sender/recipient;
- post-inspection submitter as implementation currently records it.

Caveats:
- IDA-009 stale retarget can persist a real player action under the wrong interaction identity.
- IDA-010/011 can turn one real-world attempt into multiple stored rows.

## System

Strongly attributable:
- discussion fallback;
- puzzle timeout hints/auto-resolution;
- failed-rendezvous event.

System Game Track transitions that lack events are not fully chronological → IDA-012.

## Teacher

Current frozen Sprint3B has:
- run start;
- initialization;
- generic discussion controls;
- Add Time;
- AUDIT helpers.

Sprint3C Teacher Override is not implemented; Teacher-override forensic completeness is outside this frozen baseline.

## Technical failure / missing behavior

Current Sprint3B normal flow mainly blocks/waits rather than completing through missing player behavior.

The generalized future validity model (`missing_technical`, `invalid_teacher_override`, `not_applicable`) is not yet fully implemented for ACT1–5 state rows in this Sprint3B baseline.

This remains a future implementation boundary rather than a separate Sprint3B defect because:
- Teacher Override is Sprint3C;
- final semantic integrity/export is Sprint8.

## Chronology verdict

Can reconstruct without guessing:
- run identity;
- ACT1 submitted choice timestamp/content;
- ACT2/ACT5 discussion messages, votes and fallback outcomes;
- puzzle attempts and system fallback;
- core knowledge/provenance records.

Cannot fully reconstruct without guessing:
- response latency for implemented private behavior choices → IDA-006;
- complete Sprint3B player/Game Track/scene transition chronology → IDA-012;
- whether duplicate message/wrong attempt rows represent multiple real actions → IDA-010/011;
- intended interaction identity for stale DiscussionRoom requests → IDA-009;
- canonical actor semantics for post-inspection route → IDA-007.

# Method 9 conclusion

Representative implemented histories were reconstructed from persisted evidence.

A new systemic evidence finding is confirmed:
- **IDA-012 HIGH — Sprint3B formal history is not append-only reconstructable.**

Existing IDA-006 is broadened rather than duplicated:
- response-latency evidence gap applies beyond the original ACT1 example.

Method 9 COMPLETE.
