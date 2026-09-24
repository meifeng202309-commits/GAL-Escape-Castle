# Sprint 7 Level 1 Audit Request

## Scope

Teacher Console expansion for the authoritative ACT 1-13 runtime. ACT 14 completion and session export remain excluded for Sprint 8.

## Delivered

- Server-authoritative current act, scene, phase, step, route, countdown, player presence and submitted/waiting projection.
- Discussion transcript, per-player Pocket, Group Items, player location, audio occurrence debug, teacher intervention history and behavior-validity summary.
- NORMAL mode private values remain hidden. AUDIT private debug requires an explicit teacher action and logs `teacher_audit_private_debug_changed`.
- Export filename preview is visible while completion, readiness and export action remain disabled.
- Existing Teacher token authentication, session recovery, Add 30 and governed override controls are preserved.

## Database

- Added and deployed `database/043_sprint7_teacher_console.sql`.
- Migrations `001-042` were not modified.

## Verification

- `node tests/sprint7-static-check.js` - PASS
- `node tests/sprint7-live-e2e.js` - PASS
- `node --check src/teacher/teacher-console.js` - PASS
- `git diff --check` - PASS
- Desktop 1440x1000 and mobile 390x844 full-page rendering - PASS
- Supabase migration execution - PASS

## Audit Boundary

Please perform Sprint 7 Level 1 audit. Do not treat the disabled export preview as ACT 14 finalization or export delivery; those remain Sprint 8 work.
