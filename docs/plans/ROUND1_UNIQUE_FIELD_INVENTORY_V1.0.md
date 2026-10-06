# Round-1 Unique Persistent Field Inventory V1.0 — extraction summary

Date: 2026-10-06

- Persistent tables reconstructed: **50**
- Current persistent fields reconstructed: **432**
- Unique column names: **230**
- Column names appearing in more than one table: **55**
- Exact inventory: `docs/plans/ROUND1_UNIQUE_FIELD_INVENTORY_V1.0.csv`

## Duplicate-name field groups

These are candidates for later SAME-FACT / SAME-NAME-DIFFERENT-MEANING review. Duplicate name alone does not establish semantic equivalence.

| Column name | Table count | Locations |
|---|---:|---|
| `run_id` | 36 | `act6_13_event_ledger#02`, `dialogue_messages#02`, `discussion_sessions#02`, `game_runs#01`, `runtime_events#02`, `runtime_player_decisions#02`, `s3_group_items#01`, `s3_player_item_view_state#01`, `s3_player_items#01`, `s3_player_knowledge#02`, `s3_player_observations#01`, `s3_runtime_scene_state#01`, `s3_shared_photos#02`, `s3b_library_attempts#01`, `s3b_player_facts#01`, `s3b_player_progress#01`, `s3b_post_inspection_route_votes#02`, `s3b_run_state#01`, `s5_act8_private_choices#01`, `s5_rounds#02`, `s5_run_state#01`, `s5_votes#01`, `s6_action_receipts#01`, `s6_allocation_attempts#02`, `s6_allocations#01`, `s6_audio_occurrences#02`, `s6_choices#01`, `s6_engagements#01`, `s6_private_clues#01`, `s6_run_state#01`, `s6_station_b_progress#01`, `s6_station_tasks#01`, `s8_finalizations#01`, `s9_pocket_item_inspections#01`, `teacher_override_validity#02`, `teacher_overrides#02` |
| `player_id` | 24 | `act6_13_event_ledger#07`, `dialogue_messages#07`, `runtime_player_decisions#08`, `s1_player_decisions#04`, `s1_room_players#01`, `s3_player_item_view_state#02`, `s3_player_knowledge#03`, `s3_player_observations#02`, `s3b_player_facts#02`, `s3b_player_progress#02`, `s3b_post_inspection_route_votes#03`, `s5_act8_private_choices#02`, `s5_votes#04`, `s6_action_receipts#02`, `s6_allocation_attempts#04`, `s6_allocations#02`, `s6_audio_consumptions#02`, `s6_choices#04`, `s6_engagements#03`, `s6_private_clues#02`, `s6_station_b_progress#02`, `s6_station_tasks#03`, `s9_pocket_item_inspections#02`, `teacher_override_validity#03` |
| `phase_key` | 13 | `act6_13_event_ledger#05`, `dialogue_messages#05`, `discussion_sessions#04`, `game_runs#08`, `runtime_events#10`, `runtime_player_decisions#05`, `s3_runtime_scene_state#03`, `s5_rounds#03`, `s5_run_state#03`, `s5_votes#02`, `s6_audio_occurrences#04`, `s6_choices#02`, `s6_run_state#03` |
| `created_at` | 11 | `asset_candidates#12`, `asset_events#06`, `asset_manager_reviewers#04`, `dialogue_messages#09`, `game_runs#11`, `runtime_events#08`, `s1_game_events#06`, `s1_rooms#03`, `s5_rounds#08`, `s6_action_receipts#07`, `teacher_overrides#12` |
| `scene_id` | 11 | `asset_candidates#05`, `asset_registry_projection#05`, `dialogue_messages#04`, `discussion_sessions#03`, `game_runs#07`, `runtime_events#09`, `runtime_player_decisions#04`, `s1_player_decisions#03`, `s1_scene_choices#01`, `s3_player_knowledge#06`, `s3_runtime_scene_state#02` |
| `client_request_id` | 8 | `dialogue_messages#10`, `runtime_events#16`, `s3b_library_attempts#07`, `s5_act8_private_choices#04`, `s5_votes#06`, `s6_allocations#04`, `s6_choices#06`, `s8_finalizations#04` |
| `choice_id` | 7 | `runtime_player_decisions#10`, `s1_player_decisions#06`, `s1_scene_choices#02`, `s3b_post_inspection_route_votes#05`, `s5_act8_private_choices#03`, `s5_votes#05`, `s6_choices#05` |
| `locked_at` | 7 | `runtime_player_decisions#12`, `s1_player_decisions#08`, `s3b_post_inspection_route_votes#09`, `s5_act8_private_choices#05`, `s5_votes#07`, `s6_allocations#05`, `s6_choices#09` |
| `room_code` | 7 | `game_runs#02`, `runtime_events#03`, `s1_game_events#02`, `s1_player_decisions#02`, `s1_room_players#02`, `s1_room_state#01`, `s1_rooms#01` |
| `updated_at` | 7 | `s1_room_state#04`, `s1_rooms#04`, `s3_player_item_view_state#05`, `s3_runtime_scene_state#09`, `s3b_run_state#13`, `s5_run_state#09`, `s6_run_state#18` |
| `step_key` | 6 | `dialogue_messages#06`, `discussion_sessions#05`, `game_runs#09`, `runtime_events#11`, `runtime_player_decisions#06`, `s3_runtime_scene_state#04` |
| `discussion_session_id` | 5 | `dialogue_messages#03`, `discussion_sessions#01`, `runtime_events#04`, `runtime_player_decisions#03`, `s5_rounds#01` |
| `item_key` | 5 | `s3_group_items#02`, `s3_item_catalog#01`, `s3_player_item_view_state#03`, `s3_player_items#02`, `s9_pocket_item_inspections#03` |
| `vote_round` | 5 | `discussion_sessions#07`, `runtime_player_decisions#07`, `s5_rounds#04`, `s5_run_state#04`, `s5_votes#03` |
| `act_no` | 4 | `act6_13_event_ledger#04`, `s5_run_state#02`, `s6_private_clues#03`, `s6_run_state#02` |
| `details` | 4 | `act6_13_event_ledger#08`, `asset_events#05`, `runtime_events#07`, `s1_game_events#05` |
| `event_id` | 4 | `act6_13_event_ledger#01`, `asset_events#01`, `runtime_events#01`, `s1_game_events#01` |
| `event_type` | 4 | `act6_13_event_ledger#03`, `asset_events#03`, `runtime_events#05`, `s1_game_events#03` |
| `role_key` | 4 | `s6_allocation_attempts#05`, `s6_allocations#03`, `s6_engagements#02`, `s6_station_tasks#02` |
| `round_no` | 4 | `discussion_sessions#06`, `s6_allocation_attempts#03`, `s6_choices#03`, `s6_run_state#05` |
| `status` | 4 | `asset_candidates#09`, `discussion_sessions#09`, `game_runs#06`, `s5_rounds#06` |
| `validity` | 4 | `runtime_events#13`, `runtime_player_decisions#13`, `s3b_post_inspection_route_votes#08`, `teacher_override_validity#06` |
| `asset_key` | 3 | `asset_candidates#02`, `asset_events#02`, `asset_registry_projection#01` |
| `behavior_scoring` | 3 | `runtime_events#14`, `s3b_post_inspection_route_votes#07`, `teacher_overrides#11` |
| `choice_label` | 3 | `runtime_player_decisions#11`, `s1_player_decisions#07`, `s1_scene_choices#03` |
| `completed_at` | 3 | `game_runs#17`, `s5_run_state#08`, `s6_station_tasks#05` |
| `decision_type` | 3 | `runtime_player_decisions#09`, `s1_player_decisions#05`, `s3b_post_inspection_route_votes#06` |
| `knowledge_key` | 3 | `s3_knowledge_catalog#01`, `s3_player_knowledge#04`, `s6_private_clues#04` |
| `occurrence_id` | 3 | `act6_13_event_ledger#06`, `s6_audio_consumptions#01`, `s6_audio_occurrences#01` |
| `acquired_at` | 2 | `s3_group_items#04`, `s3_player_items#04` |
| `act6_entered_at` | 2 | `s3b_player_progress#22`, `s5_run_state#10` |
| `actor_player_id` | 2 | `runtime_events#06`, `s1_game_events#04` |
| `allow_share_photo` | 2 | `discussion_sessions#29`, `s3_runtime_scene_state#10` |
| `asset_type` | 2 | `asset_candidates#04`, `asset_registry_projection#04` |
| `assigned_to` | 2 | `asset_candidates#06`, `asset_registry_projection#06` |
| `cinematic_stage` | 2 | `s6_audio_occurrences#05`, `s6_run_state#21` |
| `continuity_refs` | 2 | `asset_candidates#26`, `asset_registry_projection#09` |
| `decision_id` | 2 | `runtime_player_decisions#01`, `s1_player_decisions#01` |
| `delivered_at` | 2 | `s3_player_knowledge#09`, `s6_private_clues#06` |
| `discovered_at` | 2 | `s3_player_observations#06`, `s3b_player_facts#04` |
| `display_name` | 2 | `asset_registry_projection#02`, `s1_room_players#04` |
| `display_text_key` | 2 | `s3_observation_catalog#02`, `s3_player_observations#04` |
| `label_text_key` | 2 | `s3_group_items#03`, `s3_shared_photos#07` |
| `observation_key` | 2 | `s3_observation_catalog#01`, `s3_player_observations#03` |
| `outcome` | 2 | `discussion_sessions#13`, `s6_audio_consumptions#03` |
| `override_id` | 2 | `teacher_override_validity#01`, `teacher_overrides#01` |
| `paired_asset_group` | 2 | `asset_candidates#16`, `asset_registry_projection#10` |
| `request_id` | 2 | `s6_action_receipts#03`, `s6_allocation_attempts#06` |
| `required_anchors` | 2 | `asset_candidates#27`, `asset_registry_projection#11` |
| `resolution_source` | 2 | `s5_rounds#07`, `teacher_overrides#08` |
| `silent_texting_mode` | 2 | `discussion_sessions#26`, `game_runs#10` |
| `source_item_key` | 2 | `s3_player_knowledge#08`, `s3_shared_photos#05` |
| `submitted_at` | 2 | `s3b_library_attempts#05`, `s6_allocation_attempts#07` |
| `text_key` | 2 | `s3_runtime_scene_state#06`, `s6_private_clues#05` |
| `version` | 2 | `asset_candidates#03`, `asset_events#04` |

## Extraction rule

Field IDs are based on the reconstructed current schema after applying CREATE TABLE / ALTER TABLE ADD COLUMN / DROP COLUMN events in migration order. A repeated CREATE TABLE IF NOT EXISTS for an already-created table does not create a second schema.
