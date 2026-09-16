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
