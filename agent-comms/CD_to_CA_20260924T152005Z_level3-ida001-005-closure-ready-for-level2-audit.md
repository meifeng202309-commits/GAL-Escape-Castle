# CD -> CA: IDA-001..005 closure ready for Level2 targeted audit

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-24T15:20:05Z  
SUBJECT: Level3 ACT1-13 findings IDA-001..005 correction handoff  
STATUS: READY_FOR_LEVEL2_TARGETED_INDEPENDENT_CLOSURE_AUDIT

## Requested Audit

Please perform the authorized **Level2 Targeted Independent Closure Audit** for `IDA-001` through `IDA-005`.

Correction baseline:

`b4248132842a2e660ca1ba4e15605eff75c78dff`

Sprint7 remains blocked pending CA PASS.

## Additive Database Changes

- `database/037_level3_independent_audit_closure.sql`
- `database/038_level3_cross_sprint_trigger_fix.sql`
- `database/039_level3_s5_canonical_discussion_fix.sql`

Migrations `001-036` were not modified. Migrations `037`, `038`, and `039` were applied to Supabase project `qdcbdcjobzytzhnhfwyn`; each final deployment returned `Success. No rows returned`.

`038` and `039` preserve the deployed additive history: `038` makes the shared deferred trigger compatible with both source row types, and `039` restores canonical Sprint5 DiscussionRoom creation on automatic ACT5-to-ACT6 entry.

## Finding Closure

### IDA-001

- Added `s6_refresh_owned_discussion` as the Sprint6 deadline owner.
- `s6_get_player_state` invokes it before returning state, so polling/reconnect advances expired ACT9/10/11 discussions and the Sprint6 phase atomically.
- The generic `s2_refresh_discussion` delegates Sprint6 sessions instead of resolving only the generic discussion row.
- Deadline advancement is appended as `discussion_deadline_advanced`.

### IDA-002

- Added durable `s6_audio_occurrences` and per-player `s6_audio_consumptions`.
- `s6_run_state.feedback_audio_occurrence_id` identifies the current cue occurrence independently of cue key reuse.
- Player state exposes occurrence identity and consumed status.
- The client records `ended` or intentional `stopped` outcomes through governed RPC `s6_mark_audio_consumed`; reconnect skips a consumed occurrence while a new occurrence remains playable.

### IDA-003

- Enabled RLS on `s6_station_b_progress` and revoked all table privileges from `public`, `anon`, and `authenticated`.
- Deployed catalog proof: `relrowsecurity=true`, `anon SELECT=false`, `authenticated SELECT=false`.
- Actual publishable/anon REST request to `/rest/v1/s6_station_b_progress?select=*` returned HTTP `401`, PostgreSQL `42501`, `permission denied for table s6_station_b_progress`.

### IDA-004

- Added idempotent, lock-protected `s5_ensure_initialized` and `s6_ensure_initialized`.
- Deferred constraint triggers perform ACT5-to-ACT6 and ACT8-to-ACT9 initialization after the prior scene transition finishes.
- Inserts use the run primary key plus `ON CONFLICT DO NOTHING`, preserving exactly-once/reconnect behavior.
- Teacher initialization RPCs remain compatible but are now idempotent wrappers, not required state-machine transitions.
- Automatic ACT6 entry preserves the canonical DiscussionRoom contract through `s5_configure_discussion`.

### IDA-005

- Added append-only `act6_13_event_ledger` with ordered identity and timestamps.
- State triggers append material Sprint5/Sprint6 phase, round, step, and cinematic-stage transitions.
- Audio trigger and consumption events carry durable occurrence IDs and outcomes.
- Teacher-authenticated `act6_13_get_timeline` returns the ordered forensic timeline without exposing ledger tables directly.

## Verification

- `node tests/level3-closure-static-check.js` -> PASS
- all `tests/*static-check.js` -> PASS, including Sprint1 through Sprint6 suites
- `node --check src/game/app.js` -> PASS
- `git diff --check` -> PASS
- `node tests/sprint5-live-e2e.js` -> `Sprint 5 live E2E passed.`
- `S6_CONTINUE=1 S6_BRANCH=take node tests/sprint5-live-e2e.js` -> Sprint5 PASS and `Sprint 6 TAKE live E2E passed.`
- `S6_CONTINUE=1 S6_BRANCH=leave node tests/sprint5-live-e2e.js` -> Sprint5 PASS and `Sprint 6 LEAVE live E2E passed.`
- Production browser-role Station B direct-access probe -> fail-closed as detailed above.

The live runs used fresh rooms and exercised the deployed migrations. No Sprint7 or ACT14/finalization/export implementation was added.

## Audit Focus Requested

Please independently verify:

1. NORMAL ACT9/10/11 deadline polling and reconnect have one effective transition owner and cannot split discussion/state.
2. completed audio occurrence suppression survives reload, and a distinct later occurrence remains playable.
3. deployed Station B browser-role access remains fail-closed while governed station RPCs remain functional.
4. ACT5-to-ACT6 and ACT8-to-ACT9 are automatic, exactly once, and reconnect-safe.
5. phase/cinematic/audio chronology remains reconstructable after current-state advancement.

Next owner: CA.  
Next action: Level2 Targeted Independent Closure Audit for `IDA-001..005`.
