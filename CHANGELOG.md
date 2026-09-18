# Changelog

## Sprint 1

- Added modular static student client at `index.html`.
- Added protected teacher console at `teacher.html`.
- Added Supabase Sprint 1 migration with room/session/state/private-choice/reveal RPC functions.
- Added reconnect through browser `localStorage` session token.
- Added documentation for Sprint 1 architecture and testing.
- Kept `02_player_v2.html` and `03_teacher_v2.html` as validated fallback prototypes.

## Sprint 1 Hardening

- Changed room creation to create-only: an existing room can no longer be overwritten by `s1_create_room`.
- Added server-side join-code validation for non-empty and mutually distinct codes.
- Added database uniqueness for room join-code hashes.
- Prevented already claimed roles from silently rotating their active session token.
- Made role claiming atomic by locking the selected player row during `s1_join_player`.
- Added teacher-authenticated player-session release as the Sprint 1 recovery mechanism.
- Required `s1_advance_scene` to run only after the room is in `revealed` phase.
- Added `s1_scene_choices` and server-side canonical choice validation.
- Changed Teacher Console token input to password mode with show/hide control.
- Fixed Supabase `pgcrypto` lookup by using `extensions.digest` in `s1_hash_token`.

## Sprint 1 Live Validation

- Added `tests/sprint1-live-e2e.js` to verify the deployed GitHub Pages frontend and Supabase backend.
- Verified room creation hardening, three-player join, private-choice privacy, canonical choice storage, reconnect, reset, teacher release recovery, invalid choice rejection, and concurrent double-join protection.
- Expanded the live E2E suite from 26 to 40 checks to cover student-side pre-reveal privacy, three-player reveal consistency, the final Scene 2 `completed` transition, released-token invalidation, and event-table RLS.
- Behaviorally verified the deployed Teacher token Show/Hide control in a real browser.
- Verified `teacher_released_player_session` with a trusted read-only Supabase SQL Editor query; no public event-log access was added.

## Sprint 2 — Reusable DiscussionRoom

- Added the additive `002_runtime_runs_discussion.sql` migration without changing Sprint 1 schema or reset semantics.
- Added server-generated formal run identity with immutable `run_mode` and persisted `behavior_dataset_eligible`.
- Added reusable discussion sessions, authoritative deadlines, persistent ordered transcripts, and server-timestamped messages.
- Added canonical server-side vote validation, one vote per player per round, and privacy-safe pre-reveal state.
- Added 3:0 and 2:1 majority resolution.
- Added 1:1:1 `NO CONSENSUS. NO ACTION.` handling with a new discussion session and vote round, preserving earlier rounds.
- Added `WAITING_FOR_MISSING_PLAYER` timeout behavior and teacher-authenticated time extension without synthesized player input.
- Added student reconnect restoration and Teacher Console observation/configuration controls.
- Added Sprint 2 static and live E2E suites; updated Sprint 1 static paths after the repository documentation move.
- Removed the stale non-canonical Asset Registry `audit_status` field after CA's recorded PASS.
- Did not add full story scenes, Pocket, Asset Manager runtime publishing, Agent analysis, final exports, prediction, or audio systems.

## Sprint 2 — CA Audit Corrections

- Added additive migration `003_sprint2_discussionroom_audit_fix.sql` without rewriting deployed `001` or `002` history.
- Allowed server-authored non-option fallback identifiers while preserving canonical player vote validation.
- Decoupled local discussion `round_no` from run-wide `vote_round`.
- Scoped current transcripts to the active `discussion_session_id` and exposed teacher-only run-wide message history separately.
- Expanded Sprint 2 live E2E from 17 to 23 checks, including ACT2/ACT5/ACT6 fallback semantics, sequential discussions, transcript isolation, invalid choice rejection, and anonymous direct-write rejection.
- Reverified Sprint 1 at 40/40 and Sprint 2 at 23/23 after deploying migration `003`.
- Added additive migration `004_sprint2_fallback_resolution_semantics.sql` to distinguish system fallback `resolution_id`/`resolution_source` from genuine player `choice_id`; reverified Sprint 1 at 40/40 and Sprint 2 at 23/23 after deployment.
