# Sprint 1 Live End-to-End Acceptance Report

Date: 2026-09-17 Asia/Shanghai
Repository: `meifeng202309-commits/GAL-Escape-Castle`
Branch: `main`
Supabase project: `qdcbdcjobzytzhnhfwyn`
Status: `VERIFIED PASS`

Sprint 2 was not started.

## 1. Scope

This acceptance pass verifies the deployed Sprint 1 hardening migration and closes the remaining gaps in the original acceptance matrix. No migration or application behavior was changed because the added checks found no defect.

Evidence is separated into automated RPC E2E checks, actual browser interaction checks, and trusted database-side checks.

## 2. Automated RPC E2E

Command:

```text
node tests/sprint1-live-e2e.js
```

Result:

```text
Sprint 1 live E2E passed: 40 checks.
```

The original 26 checks remain in place. Fourteen additional checks cover the acceptance gaps:

| Area | Verified result |
|---|---|
| Student privacy before reveal | Gitte sees only her own locked decision; Anna and Linda cannot see it; all three receive an empty `revealed_decisions` array. |
| Student reveal | All three players report `revealed`, receive all three decisions and canonical labels, and receive identical reveal state. |
| Final state transition | Three valid Scene 2 choices trigger reveal; teacher advance keeps `current_scene = 2` and sets `phase = completed`; all player states and teacher state report `completed`. |
| Session recovery security | After teacher release, the old Gitte session token is rejected as invalid/expired; rejoin creates a distinct token and the new session succeeds. |
| Event-table privacy | Anonymous direct access to `s1_game_events` returns zero visible rows. |

The 40 checks also continue to verify GitHub Pages availability, create-only room behavior, join-code validation, correct role assignment, claimed-role takeover rejection, teacher-side privacy, canonical choices, one-choice locking, collecting-phase advance rejection, teacher-side reveal, reconnect, reset, concurrent join locking, and invalid-choice rejection.

## 3. Actual Browser Interaction

Deployed page tested:

```text
https://meifeng202309-commits.github.io/GAL-Escape-Castle/teacher.html
```

The Teacher token control was exercised in a real browser:

| Step | Input type | Button text | Result |
|---|---|---|---|
| Initial | `password` | `Show` | VERIFIED |
| Click Show | `text` | `Hide` | VERIFIED |
| Click Hide | `password` | `Show` | VERIFIED |

This is a behavioral interaction test, not an HTML-presence check.

## 4. Database-Side Event Check

The automated recovery test generated room `RUZ88TA5D3`. A trusted read-only query was run in the authenticated Supabase SQL Editor against `public.s1_game_events`.

Observed row:

| event_id | room_code | event_type | details | created_at |
|---|---|---|---|---|
| 87 | `RUZ88TA5D3` | `teacher_released_player_session` | `{"role_slot":"GAL-A"}` | `2026-09-17 01:36:20.227991+00` |

Result: `VERIFIED`.

No public event-read policy or browser event-reading RPC was added. Direct anonymous event-table access remains blocked by RLS.

## 5. Regression

Required commands:

```text
node tests/sprint1-static-check.js
node --check tests/sprint1-live-e2e.js
node tests/sprint1-live-e2e.js
```

Results:

| Test | Result |
|---|---|
| Static project check | VERIFIED PASS |
| Live E2E JavaScript syntax | VERIFIED PASS |
| Live GitHub Pages + Supabase E2E | VERIFIED PASS, 40 checks |
| Teacher token browser interaction | VERIFIED PASS |
| Database-side recovery event | VERIFIED PASS |

## 6. Defect Handling

No defect was found by the gap-closure tests. Therefore:

- `database/001_sprint1_core.sql` was not modified;
- no Supabase redeployment was required;
- no Sprint 1 runtime code was modified;
- no Sprint 2 functionality was introduced.

## 7. Required Acceptance Outcomes

| Requirement | Status |
|---|---|
| Teacher-side privacy | VERIFIED |
| Student-side privacy | VERIFIED |
| Teacher-side reveal | VERIFIED |
| Student-side reveal | VERIFIED |
| Scene 1 to Scene 2 transition | VERIFIED |
| Final Scene 2 to `completed` transition | VERIFIED |
| Old released session invalidation | VERIFIED |
| Successful recovery rejoin | VERIFIED |
| Recovery event logging | VERIFIED |
| Actual Teacher token Show/Hide interaction | VERIFIED |
| Existing 26 E2E checks still pass | VERIFIED |

## 8. Known Limitations

- Automated tests use independent session tokens rather than three physical student devices.
- Teacher access remains prototype-level room-token protection, not production account authentication.
- An unused join code is still a classroom credential and can be mis-shared.
- Sprint 1 uses polling rather than Supabase Realtime.

## 9. Conclusion

Sprint 1 acceptance gap closure is `VERIFIED PASS` for the complete requested Sprint 1 scope.

Sprint 2 remains unauthorized pending explicit user approval.
