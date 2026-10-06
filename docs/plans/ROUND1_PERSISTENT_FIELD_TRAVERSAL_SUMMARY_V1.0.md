# Round-1 Persistent Field Traversal Summary V1.0

Date: 2026-10-06  
Owner: GA  
Status: RAW STATIC INVENTORY — no authority assignment yet  
Implementation authorization: NONE

## 1. Coverage

The traversal covered the entire repository code/script set at the audited branch state:

- **50 persistent tables**
- **432 reconstructed current persistent fields**
- **140 code/script files**
  - 73 SQL files (70 database migrations + 3 SQL tests)
  - 58 JS/MJS source/test/tool files
  - 9 HTML files
- **55 duplicated column-name groups**
- **257 fields whose column name occurs in more than one table**
- **175 fields whose column name occurs only once**

Primary inventory:
- `docs/plans/ROUND1_UNIQUE_FIELD_INVENTORY_V1.0.csv`
- `docs/plans/ROUND1_FIELD_READ_WRITE_OVERVIEW_V1.0_part1.csv`
- `docs/plans/ROUND1_FIELD_READ_WRITE_OVERVIEW_V1.0_part2.csv`
- `docs/plans/ROUND1_FIELD_AMBIGUOUS_REFERENCES_V1.0.csv`

Line-level machine evidence remains in:
- `docs/tmp files/authority-field-audit/schema_batch_1.json` … `schema_batch_5.json`
- `docs/tmp files/authority-field-audit/access_sql_batch_1.json` … `access_sql_batch_5.json`
- `docs/tmp files/authority-field-audit/access_test_sql_batch_6.json`
- `docs/tmp files/authority-field-audit/access_code_batch_1.json` … `access_code_batch_5.json`

## 2. Raw read/write counts

These counts are **not authority decisions**.

- fields with no confirmed production WRITE location in the raw historical/script scan: **56**
- fields with exactly one confirmed production WRITE location: **74**
- fields with more than one confirmed production WRITE location: **302**
- fields with no confirmed production READ location in the SQL scan: **64**
- fields with neither confirmed production SQL read nor write location: **10**
- fields satisfying the very raw condition "column name unique + exactly one production write location": **15**

Important limitation:

The SQL counts include historical migration definitions and later superseded function definitions because the current step intentionally traverses **all scripts**. Therefore "74 fields with one writer" is not yet equivalent to "74 fields with one current effective writer."

## 3. The 15 raw unique-name + single-write-location candidates

These are only candidates for later Single Canonical Slot testing:

- `game_runs#04` = `game_runs.run_mode`
- `game_runs#05` = `game_runs.behavior_dataset_eligible`
- `s1_room_players#03` = `s1_room_players.role_slot`
- `s1_room_players#05` = `s1_room_players.join_code_hash`
- `s1_rooms#02` = `s1_rooms.teacher_token_hash`
- `s1_scene_choices#04` = `s1_scene_choices.active`
- `s3_player_observations#05` = `s3_player_observations.discovered_at_scene`
- `s3b_player_progress#10` = `s3b_player_progress.act4_choice_id`
- `s3b_player_progress#11` = `s3b_player_progress.act4_locked_at`
- `s3b_player_progress#14` = `s3b_player_progress.route_update_ack_at`
- `s3b_player_progress#17` = `s3b_player_progress.first_meeting_started_at`
- `s3b_player_progress#19` = `s3b_player_progress.act4_choice_started_at`
- `s5_run_state#06` = `s5_run_state.act7_wrong_attempts`
- `s6_audio_occurrences#03` = `s6_audio_occurrences.cue_key`
- `s6_station_b_progress#05` = `s6_station_b_progress.centered_at`

They are **not automatically marked AUTHORITY yet**, because the next pass must still distinguish:
- direct fact creation;
- default/cache/derived write;
- historical superseded writer;
- test/fixture or compatibility semantics.

## 4. Fields with no confirmed production SQL read/write in this pass

- `asset_manager_reviewers#01` = `asset_manager_reviewers.token_hash`
- `asset_manager_reviewers#02` = `asset_manager_reviewers.label`
- `asset_manager_reviewers#03` = `asset_manager_reviewers.enabled`
- `asset_manager_reviewers#04` = `asset_manager_reviewers.created_at`
- `s1_game_events#01` = `s1_game_events.event_id`
- `s1_game_events#06` = `s1_game_events.created_at`
- `s1_rooms#03` = `s1_rooms.created_at`
- `s6_allocation_attempts#01` = `s6_allocation_attempts.attempt_id`
- `s6_allocation_attempts#07` = `s6_allocation_attempts.submitted_at`
- `s6_station_b_progress#04` = `s6_station_b_progress.held_at`

These are investigation targets, not automatic DEAD fields. A field can still be used indirectly by:
- constraints/defaults;
- triggers;
- positional row operations;
- generated JSON;
- external supported clients;
- currently unresolved duplicate-name client references.

## 5. Ambiguity deliberately preserved

The scanner did **not** guess when mapping was unsafe.

Current unresolved/ambiguous evidence includes:
- duplicate-name property/key references in JS/HTML;
- trigger `NEW.field` references whose read/write mode cannot be mechanically proven;
- same-name fields that may or may not mean the same fact.

These are listed in:
`docs/plans/ROUND1_FIELD_AMBIGUOUS_REFERENCES_V1.0.csv`

The scanner therefore follows the agreed rule:

> Mechanical traversal records evidence. It does not infer semantic identity or invent authority.

## 6. What this pass proves

We now have a reproducible base for the next architecture step:

```text
all persistent fields
        ↓
permanent Field IDs
        ↓
all raw script read/write/reference locations
        ↓
same-name candidate groups
        ↓
semantic SAME FACT / DIFFERENT FACT review
        ↓
Single Canonical Slot assignment
```

The next pass should **not** start with same-meaning/different-name inference.

Per Teacher direction, it should first review the 55 same-name groups and determine:
1. SAME FACT;
2. SAME NAME / DIFFERENT FACT;
3. unresolved — needs explicit business review.

Only after that should possible same-meaning/different-name fields be listed for a separate review.
