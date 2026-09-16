# Sprint 1 Revision Completion Report

Date: 2026-09-16  
Repository: https://github.com/meifeng202309-commits/GAL-Escape-Castle  
Branch: `main`  
Sprint 2 status: `NOT STARTED`

Validation update: `VERIFIED PASS` on 2026-09-17 after deploying the current Sprint 1 hardening migration to the existing Supabase project and running the live Sprint 1 E2E matrix against GitHub Pages + Supabase.

Validation report:

```text
docs/codex_reports/sprint1_validation/02-live-e2e-acceptance.md
```

This report documents the Sprint 1 Hardening / Revision pass requested after the initial Sprint 1 completion report.

## 1. Revision Scope

Sprint 1 was not approved for Sprint 2. The revision pass was limited to hardening existing Sprint 1 features:

- room/session
- authoritative shared state
- private-choice lock
- reveal
- reconnect
- player identity separated from display name
- teacher access protection
- initial RLS/security improvement

The revision explicitly did not start:

- DiscussionRoom
- Agent analysis
- six-pattern behavior aggregation
- prediction system
- Asset Manager
- full Castle Escape story scenes
- final vote
- inventory/clue engine

## 2. Required Hardening Items

| Required Item | Revision Result | Status |
|---|---|---|
| `s1_create_room` must never overwrite an existing room without authenticating the existing teacher | Changed to create-only. Existing room now raises a clear error. | VERIFIED |
| Reused player join code must not silently rotate active session token | Claimed role now rejects a second join. | VERIFIED |
| Define safe prototype recovery mechanism | Added teacher-authenticated `s1_release_player_session`. | VERIFIED |
| `s1_advance_scene` should normally require `revealed` state | Now rejects advance unless room phase is `revealed`. | VERIFIED |
| Validate join codes on server | Added non-empty validation, mutually distinct validation, and room-level join-code hash uniqueness. | VERIFIED |
| Do not blindly trust browser choice label | Added `s1_scene_choices`; server validates `choice_id` and stores canonical `choice_label`. | VERIFIED |
| Teacher token UI should be password/show-hide style | Teacher token input changed to password field with Show/Hide button. | VERIFIED |

## 3. Files Changed In Revision

| File | Purpose |
|---|---|
| `database/001_sprint1_core.sql` | Hardened room creation, join sessions, server-side choice validation, advance rules, recovery RPC. |
| `teacher.html` | Added password/show-hide teacher token field and prototype session recovery controls. |
| `src/teacher/teacher-console.js` | Added teacher token visibility toggle and release-session action. |
| `src/styles/app.css` | Added styles for password row and small buttons. |
| `docs/sprint-1-architecture.md` | Documented hardening architecture. |
| `docs/sprint-1-testing.md` | Added required hardening tests. |
| `CHANGELOG.md` | Added Sprint 1 Hardening entry. |
| `tests/sprint1-static-check.js` | Added static check for `s1_release_player_session`. |
| `Sprint-1-Completion-Report.md` | Updated with hardening status and later live validation result. |

This report file:

```text
Sprint-1 revision-Completion-Report.md
```

was created to summarize the revision pass separately.

## 4. Database Revision Summary

Migration file:

```text
database/001_sprint1_core.sql
```

Important revision changes:

- `s1_create_room` no longer uses `ON CONFLICT DO UPDATE`.
- Existing `room_code` now returns:

```text
Room already exists. Use Watch room with the existing teacher token, or use a future teacher-authenticated reinitialize action.
```

- `s1_room_players` now has room-level join-code hash uniqueness.
- A compatibility `DO` block adds the unique constraint if an earlier Sprint 1 migration had already created the table.
- `s1_join_player` rejects empty join code.
- `s1_join_player` rejects joins for already claimed roles.
- `s1_join_player` now locks the selected `s1_room_players` row with `FOR UPDATE` before checking and writing `session_token_hash`, so concurrent joins cannot both claim the same role.
- `s1_release_player_session` allows teacher-authenticated recovery of a lost browser session.
- `s1_advance_scene` requires `phase = 'revealed'`.
- `s1_scene_choices` stores canonical Sprint 1 choice labels.
- `s1_submit_private_choice` validates `choice_id` against `s1_scene_choices` for the current scene and stores the server-side label.

## 5. Security / RLS Review

| Question | Revision Answer | Status |
|---|---|---|
| Can create-room overwrite an existing room? | It now fails if the room exists. | VERIFIED |
| Can one student reuse a join code to take over an already claimed role? | It now fails unless the teacher releases that role session. | VERIFIED |
| Can two concurrent joins both claim the same role? | The matching player row is locked with `FOR UPDATE`; live concurrent test allowed exactly one claim. | VERIFIED |
| Can one student submit as another player? | Requires that player's session token. Mis-distributed unused join codes remain a classroom credential risk. | KNOWN LIMITATION |
| Can students reset/delete a room directly? | No unrestricted public table DELETE was added; reset requires teacher token RPC. | VERIFIED |
| Can teacher advance from collecting? | It now fails; emergency override is intentionally not part of Sprint 1. | VERIFIED |
| Are browser-supplied choice labels trusted? | No; server stores canonical label from `s1_scene_choices`. | VERIFIED |
| Is any service-role key in browser code? | No service-role key is present. | VERIFIED |
| Is teacher token fully secure authentication? | No. It is a room-level prototype token. | KNOWN LIMITATION |

## 6. Tests Run

| Test | Result | Evidence / Notes |
|---|---|---|
| Static project check | PASS | `node tests/sprint1-static-check.js` returned `Sprint 1 static check passed.` |
| JavaScript syntax check | PASS | `node --check` ran against `src` and `tests` JS files without errors. |
| GitHub raw migration availability | PASS | `database/001_sprint1_core.sql` returned HTTP 200 after push. |
| GitHub Pages teacher page availability | PASS | `teacher.html` returned HTTP 200 after push. |
| Supabase migration deployment | PASS | Current migration was deployed and verified through live RPC behavior. |
| Real three-player multiplayer flow | PASS | `node tests/sprint1-live-e2e.js` verified Gitte, Anna, and Linda join with correct roles. |
| Existing-room create rejection | PASS | Existing `room_code` returned room-already-exists error and original room remained readable. |
| Reused join code takeover rejection | PASS | Already claimed role rejected second join before teacher release. |
| Concurrent/double-join race rejection | PASS | Two simultaneous joins with the same code produced exactly one success and one already-claimed rejection. |
| Teacher session release recovery | PASS | Teacher-authenticated release allowed rejoin after rejecting takeover. |
| Advance from collecting rejection | PASS | `s1_advance_scene` rejected collecting-phase advance. |
| Invalid choice rejection | PASS | Invalid `choice_id` was rejected. |
| Teacher token show/hide browser UI | PASS | Deployed Teacher Console page loaded with Teacher token field and Show button. |

## 7. Devil Check

| Viewpoint | Issue | Severity | Fix | Retest Result |
|---|---|---|---|---|
| Gitte | Reused join code could take over active session | Critical | Reject claimed role; require teacher release | VERIFIED PASS |
| Gitte | Two simultaneous joins could race to claim the same role | Critical | Lock selected player row with `FOR UPDATE` before token check/write | VERIFIED PASS |
| Anna | Mis-distributed unused join code can still claim wrong role | Major | Teacher must distribute codes carefully; future invite-link UX recommended | KNOWN LIMITATION |
| Linda | Lost incognito session cannot reconnect through localStorage | Minor | Teacher can release role session, then student rejoins | VERIFIED PASS |
| Team | Teacher could accidentally advance before all choices | Major | `s1_advance_scene` now requires `revealed` | VERIFIED PASS |
| Teacher | Teacher token was visible in plain text | Minor | Password field plus Show/Hide | VERIFIED PASS |
| Server/state machine | Existing room could be overwritten | Critical | `s1_create_room` create-only | VERIFIED PASS |
| Server/state machine | Browser choice labels were trusted | Major | Canonical server-side choices | VERIFIED PASS |
| Future maintainer | Emergency override is not implemented | Minor | Explicitly deferred; future override must be separate logged intervention | KNOWN LIMITATION |

## 8. Current Sprint 1 Status

Current status:

```text
VERIFIED PASS
```

Reason:

The revision code has been implemented, pushed, deployed to the existing Supabase project, and verified through live Sprint 1 E2E testing against GitHub Pages + Supabase.

Sprint 1 hardening is verified for the tested scope.

Sprint 2 must not begin without user approval.

## 9. Repository / Deployment State

Latest pushed commits at revision time:

```text
def7227 Update Sprint 1 hardening report status
06729b6 Harden Sprint 1 room and session security
08f39b6 Merge remote-tracking branch 'origin/main'
```

GitHub Pages URLs:

```text
Student:
https://meifeng202309-commits.github.io/GAL-Escape-Castle/index.html

Teacher:
https://meifeng202309-commits.github.io/GAL-Escape-Castle/teacher.html
```

Supabase project:

```text
https://qdcbdcjobzytzhnhfwyn.supabase.co
```

Migration status:

```text
HARDENED, PUSHED TO GITHUB, DEPLOYED TO SUPABASE
VERIFIED END-TO-END FOR SPRINT 1 SCOPE
```

## 10. Remaining Blocking Items Before Sprint 2

1. User reviews Sprint 1 live validation report.
2. User decides whether Sprint 1 is approved for Sprint 2.

## 11. Recommended Next Step

Do not start Sprint 2.

Next step:

Review the Sprint 1 live validation report and decide whether to approve Sprint 2.
