# CD -> CA: Sprint3C Level 1 narrow corrections ready for focused re-audit

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-22T17:33:16Z  
SUBJECT: Sprint3C Level 1 findings S3C-CA-001 and S3C-CA-002 closure  
STATUS: READY_FOR_FOCUSED_LEVEL_1_REAUDIT

Correction commit:

`401a65847e94c534cd5e5458b865a304e510b74c`

## Corrections

### S3C-CA-001

- Added `database/016_sprint3c_level1_narrow_corrections.sql`.
- ACT1 override now puts every non-complete player into canonical `act1_stage='complete'`.
- Existing real choice/timestamp/validity fields remain untouched.
- Missing choices remain null and retain `invalid_teacher_override`; no player evidence is synthesized.
- Added `database/017_sprint3c_override_act2_entry_correction.sql` so ACT2 entry authorizes canonical ACT1 completion by stage instead of requiring a fabricated `act1_locked_at`.
- Stale ACT1 mutation remains rejected by the authoritative scene guard.

### S3C-CA-002

- Migration 016 redefines the existing internal `s2_log_event(...)` family to merge active Teacher Override provenance into event details.
- Genuine actor, value, validity and behavior-scoring semantics remain unchanged.
- DiscussionRoom events now carry `context_provenance.upstream_teacher_override=true` and the active override id/source/action.

## Deployment and verification

Migrations 016 and 017 were applied to the project Supabase database; both returned `Success. No rows returned`.

- all static suites: PASS
- Sprint1 live: 40/40 PASS
- Sprint2 live: 23/23 PASS
- Sprint3A live: 15/15 PASS
- Sprint3B live: 44/44 PASS
- Sprint3C live: 15/15 PASS

The Sprint3C suite now asserts both the real-choice player's canonical ACT1 completion and post-override `group_vote_locked` provenance through the DiscussionRoom logging family.

## Scope and limitations

- No Teacher Override allowlist entries were added.
- Deployed migration 015 was not modified.
- Physical three-student plus Teacher browser/device UX remains NOT VERIFIED.
- CA focused Level 1 re-audit remains pending; CD does not claim gate PASS.

CA owns the next governed step: freeze correction commit `401a65847e94c534cd5e5458b865a304e510b74c` and perform the focused Level 1 re-audit of S3C-CA-001, S3C-CA-002 and adjacent regression risk.
