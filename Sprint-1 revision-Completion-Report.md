# Sprint 1 Revision Completion Report

Date: 2026-09-16  
Repository: https://github.com/meifeng202309-commits/GAL-Escape-Castle  
Branch: `main`  
Sprint 2 status: `NOT STARTED`

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
| `s1_create_room` must never overwrite an existing room without authenticating the existing teacher | Changed to create-only. Existing room now raises a clear error. | IMPLEMENTED, NOT VERIFIED |
| Reused player join code must not silently rotate active session token | Claimed role now rejects a second join. | IMPLEMENTED, NOT VERIFIED |
| Define safe prototype recovery mechanism | Added teacher-authenticated `s1_release_player_session`. | IMPLEMENTED, NOT VERIFIED |
| `s1_advance_scene` should normally require `revealed` state | Now rejects advance unless room phase is `revealed`. | IMPLEMENTED, NOT VERIFIED |
| Validate join codes on server | Added non-empty validation, mutually distinct validation, and room-level join-code hash uniqueness. | IMPLEMENTED, NOT VERIFIED |
| Do not blindly trust browser choice label | Added `s1_scene_choices`; server validates `choice_id` and stores canonical `choice_label`. | IMPLEMENTED, NOT VERIFIED |
| Teacher token UI should be password/show-hide style | Teacher token input changed to password field with Show/Hide button. | IMPLEMENTED, NOT VERIFIED |

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
| `Sprint-1-Completion-Report.md` | Updated status to `FAIL / NOT VERIFIED` after hardening. |

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
- `s1_release_player_session` allows teacher-authenticated recovery of a lost browser session.
- `s1_advance_scene` requires `phase = 'revealed'`.
- `s1_scene_choices` stores canonical Sprint 1 choice labels.
- `s1_submit_private_choice` validates `choice_id` against `s1_scene_choices` for the current scene and stores the server-side label.

## 5. Security / RLS Review

| Question | Revision Answer | Status |
|---|---|---|
| Can create-room overwrite an existing room? | It should now fail if the room exists. | NOT VERIFIED |
| Can one student reuse a join code to take over an already claimed role? | It should now fail unless the teacher releases that role session. | NOT VERIFIED |
| Can one student submit as another player? | Requires that player's session token. Mis-distributed unused join codes remain a classroom credential risk. | KNOWN LIMITATION |
| Can students reset/delete a room directly? | No unrestricted public table DELETE was added; reset requires teacher token RPC. | NOT VERIFIED |
| Can teacher advance from collecting? | It should now fail; emergency override is intentionally not part of Sprint 1. | NOT VERIFIED |
| Are browser-supplied choice labels trusted? | No; server stores canonical label from `s1_scene_choices`. | NOT VERIFIED |
| Is any service-role key in browser code? | No service-role key is present. | VERIFIED |
| Is teacher token fully secure authentication? | No. It is a room-level prototype token. | KNOWN LIMITATION |

## 6. Tests Run

| Test | Result | Evidence / Notes |
|---|---|---|
| Static project check | PASS | `node tests/sprint1-static-check.js` returned `Sprint 1 static check passed.` |
| JavaScript syntax check | PASS | `node --check` ran against `src` and `tests` JS files without errors. |
| GitHub raw migration availability | PASS | `database/001_sprint1_core.sql` returned HTTP 200 after push. |
| GitHub Pages teacher page availability | PASS | `teacher.html` returned HTTP 200 after push. |
| Supabase migration deployment | NOT TESTED | Blocked because Supabase dashboard was on login page. |
| Real three-player multiplayer flow | NOT TESTED | Requires deployed migration. |
| Existing-room create rejection | NOT TESTED | Requires deployed migration. |
| Reused join code takeover rejection | NOT TESTED | Requires deployed migration. |
| Teacher session release recovery | NOT TESTED | Requires deployed migration. |
| Advance from collecting rejection | NOT TESTED | Requires deployed migration. |
| Invalid choice rejection | NOT TESTED | Requires deployed migration. |
| Teacher token show/hide browser UI | NOT TESTED | Requires browser UI verification. |

## 7. Devil Check

| Viewpoint | Issue | Severity | Fix | Retest Result |
|---|---|---|---|---|
| Gitte | Reused join code could take over active session | Critical | Reject claimed role; require teacher release | NOT TESTED |
| Anna | Mis-distributed unused join code can still claim wrong role | Major | Teacher must distribute codes carefully; future invite-link UX recommended | KNOWN LIMITATION |
| Linda | Lost incognito session cannot reconnect through localStorage | Minor | Teacher can release role session, then student rejoins | NOT TESTED |
| Team | Teacher could accidentally advance before all choices | Major | `s1_advance_scene` now requires `revealed` | NOT TESTED |
| Teacher | Teacher token was visible in plain text | Minor | Password field plus Show/Hide | NOT TESTED |
| Server/state machine | Existing room could be overwritten | Critical | `s1_create_room` create-only | NOT TESTED |
| Server/state machine | Browser choice labels were trusted | Major | Canonical server-side choices | NOT TESTED |
| Future maintainer | Emergency override is not implemented | Minor | Explicitly deferred; future override must be separate logged intervention | KNOWN LIMITATION |

## 8. Current Sprint 1 Status

Current status:

```text
FAIL / NOT VERIFIED
```

Reason:

The revision code has been implemented and pushed, but Supabase migration deployment and real end-to-end multiplayer/security testing have not yet been completed.

Sprint 1 must not be marked PASS until the real test matrix passes.

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
HARDENED LOCALLY AND PUSHED TO GITHUB
NOT DEPLOYED TO SUPABASE
NOT VERIFIED END-TO-END
```

## 10. Remaining Blocking Items Before Sprint 2

1. Log in to Supabase dashboard.
2. Run the hardened migration:

```text
database/001_sprint1_core.sql
```

3. Run full Sprint 1 test matrix:
   - teacher creates room
   - Gitte joins
   - Anna joins
   - Linda joins
   - all three submit once
   - choices remain private before reveal
   - reveal occurs only after all three submit
   - refresh/reconnect restores state
   - duplicate private submission is rejected
   - reused join code cannot take over claimed role
   - teacher session release recovery works
   - advance from collecting is rejected
   - invalid choice is rejected
   - teacher token controls are protected

4. Update `Sprint-1-Completion-Report.md` and this revision report from `NOT VERIFIED` to `VERIFIED` only for tests that actually pass.

## 11. Recommended Next Step

Do not start Sprint 2.

Next step:

Deploy the hardened Supabase migration and run the real Sprint 1 end-to-end test matrix.
