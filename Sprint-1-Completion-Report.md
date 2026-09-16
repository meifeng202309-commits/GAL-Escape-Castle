# Sprint 1 Completion Report

Date: 2026-09-16  
Local branch at report time: `master`  
Repository remote at report time: `NOT CONFIGURED`  
Sprint 2 status: `NOT STARTED`

Hardening revision status: `IMPLEMENTED LOCALLY, NOT YET DEPLOYED OR END-TO-END VERIFIED`

Important status note:

Sprint 1 must not be considered approved for Sprint 2 until the hardened migration is deployed to Supabase and the real multiplayer/security test matrix passes.

## 0. Sprint 1 Hardening Revision

Hardening changes implemented after the initial Sprint 1 completion report:

- `s1_create_room` is now create-only. It raises a clear room-exists error instead of overwriting an existing room.
- Join codes are validated server-side for non-empty values and mutual distinctness.
- `s1_room_players` now enforces unique join-code hashes within a room.
- Reusing an already claimed join code no longer rotates the active session token or takes over a role.
- Prototype recovery is teacher-authenticated: the teacher must explicitly release a role session before that join code can be used again.
- `s1_advance_scene` now requires the room phase to be `revealed`.
- Emergency advance from `collecting` is not included in Sprint 1.
- Choices are canonicalized server-side through `s1_scene_choices`; browser-supplied labels are no longer trusted.
- Teacher token input is now `type="password"` with a show/hide control.

Hardening files modified:

| File | Purpose |
|---|---|
| `database/001_sprint1_core.sql` | Create-only room creation, join-code uniqueness, claimed-role protection, session release RPC, advance guard, canonical choices. |
| `teacher.html` | Password/show-hide teacher token input and recovery controls. |
| `src/teacher/teacher-console.js` | Show/hide teacher token and teacher-authenticated session release calls. |
| `src/styles/app.css` | Password row and small button styling. |
| `docs/sprint-1-architecture.md` | Documents hardening architecture. |
| `docs/sprint-1-testing.md` | Adds hardening tests. |
| `CHANGELOG.md` | Adds Sprint 1 Hardening entry. |
| `tests/sprint1-static-check.js` | Checks the new release-session RPC. |

Additional database object:

```text
s1_scene_choices
```

Purpose:

- Server-side canonical choice validation for Sprint 1 scenes.
- Primary key: `(scene_id, choice_id)`.
- RLS enabled.
- No broad public table policy added.

Hardening security status:

| Check | Status |
|---|---|
| Existing room cannot be overwritten by create-room | NOT VERIFIED |
| Already claimed join code cannot take over active session | NOT VERIFIED |
| Teacher can release a lost student session | NOT VERIFIED |
| Advance from collecting is rejected | NOT VERIFIED |
| Invalid browser-supplied choice is rejected | NOT VERIFIED |
| Teacher token is password/show-hide UI | NOT VERIFIED |

Hardening Devil Check:

| Issue | Severity | Cause | Fix | Retest result |
|---|---|---|---|---|
| Create-room could overwrite teacher token, room state, and join codes | Critical | `on conflict do update` in `s1_create_room` | Create-only semantics; existing room raises error | NOT TESTED |
| Reused join code could rotate active session token | Critical | `s1_join_player` generated a new token every time | Reject already claimed role; require teacher release | NOT TESTED |
| Teacher could accidentally advance from collecting | Major | `s1_advance_scene` did not require reveal | Require `phase = revealed` | NOT TESTED |
| Empty/duplicate join codes were not rejected server-side | Major | Missing validation and uniqueness | Non-empty/distinct validation plus unique room join-code hash | NOT TESTED |
| Browser-supplied choice label was trusted | Major | `s1_submit_private_choice` stored client label | Validate `choice_id`; store canonical server label | NOT TESTED |
| Teacher token was visible as ordinary text | Minor | Input type was text | Password input plus show/hide | NOT TESTED |

Current overall Sprint 1 status after hardening:

```text
FAIL / NOT VERIFIED
```

Reason:

The hardening code and migration are implemented locally and static checks pass, but Supabase deployment and real multiplayer/security tests are still not complete.

## 1. Sprint 1 Scope

Sprint 1 was approved to implement only:

- room/session
- authoritative shared state
- private-choice lock
- reveal
- reconnect
- player identity separated from display name
- teacher access protection
- initial RLS/security improvement

Later features explicitly not implemented:

- DiscussionRoom
- behavior analysis
- six-pattern Agent aggregation
- prediction system
- Asset Manager
- final game artwork
- full Castle Escape story scenes
- final vote
- inventory/clue engine
- synchronized discussion deadlines

## 2. What I Changed

Sprint 1 adds a lightweight static web implementation that can run on GitHub Pages without npm or a build pipeline.

Runtime flow:

1. The teacher opens `teacher.html`.
2. The teacher creates a room with:
   - `room_code`
   - room-specific `teacher_token`
   - one join code for Gitte
   - one join code for Anna
   - one join code for Linda
3. Supabase stores the room in `s1_rooms`, initializes authoritative state in `s1_room_state`, and creates three player records in `s1_room_players`.
4. A student opens `index.html` and enters:
   - the shared room code
   - their teacher-assigned join code
5. Supabase validates the join code and returns a generated `session_token`.
6. The browser stores that token in `localStorage`.
7. On refresh, the student page restores the session token and asks Supabase for current player state.
8. Private choices are submitted through `s1_submit_private_choice`.
9. Supabase stores the private choice in `s1_player_decisions` with a uniqueness constraint.
10. Once all three current-scene private choices exist, Supabase changes the authoritative phase to `revealed`.
11. Before reveal, the teacher state response exposes only submitted/waiting status.
12. After reveal, player and teacher responses include the three choice labels.

Room creation / identification:

- Room identity is `room_code`, normalized to uppercase.
- The authoritative room records live in Supabase, not in browser memory.

Gitte, Anna, and Linda identification:

- Display names are `Gitte`, `Anna`, and `Linda`.
- Role slots are `GAL-A`, `GAL-B`, and `GAL-C`.
- Underlying identity is `player_id uuid`.
- Students do not freely choose a role in the formal Sprint 1 implementation.

Session tokens:

- A valid join code returns a generated `session_token`.
- The token is hashed in Supabase.
- The raw token is stored only in the student's browser `localStorage`.

Reconnect:

- `index.html` calls `loadSession()` at startup.
- If a saved token exists, it calls `s1_get_player_state`.
- The server restores room, player identity, current scene, phase, locked choice, and reveal state.

Authoritative room state:

- Stored in `s1_room_state`.
- The browser does not decide reveal.
- Supabase moves phase from `collecting` to `revealed`.

Private-choice storage and lock:

- Stored in `s1_player_decisions`.
- Lock is enforced by:
  `unique(room_code, scene_id, player_id, decision_type)`.

Reveal trigger:

- `s1_submit_private_choice` counts submitted decisions for the current scene.
- When the count reaches three, Supabase updates `s1_room_state.phase` to `revealed`.

Private choices before reveal:

- Student state returns only the student's own locked choice before reveal.
- Teacher state returns only `player_id` and `locked_at` before reveal, not choice labels.

Teacher access:

- Teacher controls require `room_code + teacher_token`.
- The frontend does not hard-code a reusable teacher PIN or secret.
- This is a prototype-level room token, not a full login system.

## 3. Files Changed / Created

| File | Created/Modified | Purpose |
|---|---|---|
| `.env.example` | Created | Documents public Supabase config shape without secrets. |
| `CHANGELOG.md` | Created | Records Sprint 1 changes. |
| `Sprint-1-Completion-Report.md` | Created | Records Sprint 1 completion and audit status. |
| `index.html` | Created | Formal Sprint 1 student client. |
| `teacher.html` | Created | Formal Sprint 1 teacher console. |
| `database/001_sprint1_core.sql` | Created | Sprint 1 Supabase tables, constraints, RLS enablement, and RPC functions. |
| `docs/sprint-0-repository-audit.md` | Created/Modified | Sprint 0 audit record and Sprint 1 authorization note. |
| `docs/sprint-1-architecture.md` | Created | Sprint 1 architecture decisions. |
| `docs/sprint-1-testing.md` | Created | Sprint 1 manual and static test instructions. |
| `src/content/scenes.js` | Created | Placeholder scene data for Sprint 1. |
| `src/game/app.js` | Created | Student runtime flow and polling/reconnect behavior. |
| `src/state/session.js` | Created | Browser `localStorage` session persistence. |
| `src/styles/app.css` | Created | Shared student/teacher styling. |
| `src/supabase/client.js` | Created | Supabase RPC fetch wrapper and error handling. |
| `src/supabase/config.js` | Created | Public Supabase URL and publishable key. |
| `src/teacher/teacher-console.js` | Created | Teacher room creation, watch, advance, and reset UI. |
| `src/utils/html.js` | Created | HTML escaping helper. |
| `tests/sprint1-static-check.js` | Created | No-dependency static project check. |

Fallback prototype status:

- `02_player_v2.html` remains available in the repository root as a validated fallback prototype.
- `03_teacher_v2.html` remains available in the repository root as a validated fallback prototype.
- They were not moved to `/legacy` because Sprint 1 has not yet been end-to-end verified on Supabase/GitHub Pages.

## 4. Database Changes

Migration created:

```text
database/001_sprint1_core.sql
```

### `s1_rooms`

- Purpose: room identity and teacher token hash.
- Primary key: `room_code`.
- Important foreign keys: referenced by room state, players, decisions, events.
- Unique constraints: primary key on `room_code`.
- RLS: enabled. No broad public table policy added.

### `s1_room_players`

- Purpose: maps each room's three role slots to display names, join codes, session tokens, and player identities.
- Primary key: `player_id uuid`.
- Important foreign keys: `room_code` references `s1_rooms(room_code)` with cascade delete.
- Unique constraints: `unique(room_code, role_slot)`.
- RLS: enabled. No broad public table policy added.

### `s1_room_state`

- Purpose: authoritative current scene and phase.
- Primary key: `room_code`.
- Important foreign keys: `room_code` references `s1_rooms(room_code)` with cascade delete.
- Unique constraints: primary key on `room_code`.
- RLS: enabled. No broad public table policy added.

### `s1_player_decisions`

- Purpose: locked private choices.
- Primary key: `decision_id`.
- Important foreign keys:
  - `room_code` references `s1_rooms(room_code)` with cascade delete.
  - `player_id` references `s1_room_players(player_id)` with cascade delete.
- Unique constraints:
  - `unique(room_code, scene_id, player_id, decision_type)`.
- RLS: enabled. No broad public table policy added.

### `s1_game_events`

- Purpose: room, player, reveal, teacher reset/advance event log.
- Primary key: `event_id`.
- Important foreign keys:
  - `room_code` references `s1_rooms(room_code)` with cascade delete.
- Unique constraints: none beyond primary key.
- RLS: enabled. No broad public table policy added.

Duplicate private submissions are prevented by:

```text
unique(room_code, scene_id, player_id, decision_type)
```

Session identity is represented by:

- `player_id uuid`
- hashed `session_token_hash`
- browser-held raw `session_token`

Private choices before reveal are protected by:

- no direct table read policy
- RPC response filtering in `s1_get_player_state`
- RPC response filtering in `s1_get_teacher_state`

Unrestricted public DELETE/reset:

- No unrestricted table DELETE/reset is added in Sprint 1.
- Room reset is exposed only through `s1_reset_room(room_code, teacher_token)`.

Secrets:

- No service-role key is included in the migration or frontend.
- The publishable Supabase key remains in browser code, which is expected for Supabase browser clients.

## 5. Security / RLS Review

| Question | Answer | Status |
|---|---|---|
| Can one student read another player's private choice before reveal? | RPC design does not return other players' choice labels before reveal. Direct table reads should be blocked because RLS is enabled and no broad select policy is added. | NOT VERIFIED |
| Can one student submit as another player? | Submission requires a valid `session_token` for that player. Students do not choose role slot directly. A student with another player's join code can still claim that role. | KNOWN LIMITATION |
| Can an unauthenticated browser reset/delete a room? | There is no public table DELETE policy. Reset requires teacher token through RPC. | NOT VERIFIED |
| Can students access Teacher Console controls? | The page is public, but controls require room-specific teacher token. A student with the token can use controls. | KNOWN LIMITATION |
| Is any secret/service-role key present in frontend code? | No service-role key is present. Only the publishable Supabase key is present. | VERIFIED |
| What security remains prototype-level? | Teacher token is manually managed; join codes are classroom credentials; no full auth account system exists. | KNOWN LIMITATION |

## 6. Tests Run

| Test | Result | Evidence / Notes |
|---|---|---|
| Static file presence check | PASS | `node tests/sprint1-static-check.js` returned `Sprint 1 static check passed.` |
| JavaScript syntax check | PASS | `node --check` ran against `src` and `tests` JS files with no errors. |
| A. Normal multiplayer: Gitte joins | NOT TESTED | Requires migration deployed to Supabase. |
| A. Normal multiplayer: Anna joins | NOT TESTED | Requires migration deployed to Supabase. |
| A. Normal multiplayer: Linda joins | NOT TESTED | Requires migration deployed to Supabase. |
| A. All three submit once | NOT TESTED | Requires migration deployed to Supabase. |
| A. Choices remain private | NOT TESTED | Requires migration deployed to Supabase and browser flow. |
| A. Reveal occurs only when conditions are met | NOT TESTED | Requires migration deployed to Supabase. |
| B. Player attempts second submission | NOT TESTED | Requires deployed database uniqueness test. |
| B. Refresh after submission | NOT TESTED | Requires browser test. |
| B. Duplicate browser/tab | NOT TESTED | Requires browser test. |
| C. Refresh page reconnect | NOT TESTED | Requires browser test. |
| C. Close/reopen browser reconnect | NOT TESTED | Requires browser test. |
| C. Temporary disconnect | NOT TESTED | Requires browser/network test. |
| D. Attempt another player's role/session | NOT TESTED | Requires deployed join/session flow. |
| D. Invalid or reused join code/token | NOT TESTED | Requires deployed join/session flow. |
| E. Student browser cannot use teacher controls | NOT TESTED | Requires deployed teacher RPC test. |
| E. Teacher access succeeds | NOT TESTED | Requires deployed teacher RPC test. |
| F. Different browsers see same authoritative phase | NOT TESTED | Requires multi-browser test. |
| F. Scene/reveal not dependent only on browser memory | NOT TESTED | Requires deployed shared state test. |
| G. Existing Supabase connection works | NOT TESTED for Sprint 1 schema | Previous Three Doors REST test worked, but Sprint 1 migration is not deployed. |
| G. GitHub Pages deployment works | NOT TESTED for Sprint 1 | Files have not been pushed/uploaded to GitHub Pages yet. |

## 7. Devil Check

### Gitte viewpoint

Issue: Gitte can only join if teacher gives correct join code.  
Severity: Minor  
Cause: Join-code model is intentionally teacher-assigned.  
Fix: Teacher testing instructions must clearly map role to join code.  
Retest result: NOT TESTED

### Anna viewpoint

Issue: If Anna receives Linda's join code by mistake, Anna will become Linda's underlying session.  
Severity: Major  
Cause: Sprint 1 has no personal account verification.  
Fix: Teacher must distribute codes carefully; later sprint could add printed role cards or one-time invite links.  
Retest result: NOT TESTED

### Linda viewpoint

Issue: Refresh recovery depends on browser `localStorage`; private/incognito windows may lose session when closed.  
Severity: Minor  
Cause: Browser storage behavior.  
Fix: Student can rejoin using the same join code if needed; later sprint can support recovery links.  
Retest result: NOT TESTED

### Three-player team viewpoint

Issue: Reveal depends on all three submissions. If one student joins wrong role or stalls, reveal waits.  
Severity: Major  
Cause: Strict three-player reveal rule.  
Fix: Teacher console can observe submitted/waiting and later should support controlled intervention with event logging.  
Retest result: NOT TESTED

### Teacher viewpoint

Issue: Teacher token is simple room-level protection, not full login.  
Severity: Major  
Cause: Sprint 1 chose no external auth/build system.  
Fix: Keep token private; consider stronger auth before production classroom use.  
Retest result: NOT TESTED

### Server/state machine viewpoint

Issue: `s1_submit_private_choice` changes phase to `revealed` after count reaches three; current implementation assumes exactly three players in a room.  
Severity: Minor  
Cause: Sprint 1 scope fixed to three players.  
Fix: If group size becomes configurable, store expected player count in `s1_rooms`.  
Retest result: NOT TESTED

### Future Codex maintainer viewpoint

Issue: Current scene content is placeholder JS, not full data-driven ACT content.  
Severity: Minor  
Cause: Sprint 1 intentionally avoids full story implementation.  
Fix: Sprint 3 should move story content into structured content files.  
Retest result: NOT TESTED

## 8. Acceptance Criteria

| Criterion | Status |
|---|---|
| Three remote players can join | NOT TESTED |
| Identity survives refresh | NOT TESTED |
| Player identity is separate from display name | PASS |
| Private choice can only be submitted once | NOT TESTED |
| Private choices remain hidden before reveal | NOT TESTED |
| Reveal is based on authoritative shared state | PASS by implementation design, NOT TESTED end-to-end |
| Refresh/reconnect restores state | NOT TESTED |
| Students cannot freely reset/delete the room | NOT TESTED |
| Teacher controls are protected | PASS by implementation design, NOT TESTED end-to-end |
| No secret/service-role key is exposed | PASS |
| Current implementation remains lightweight modular JavaScript | PASS |
| No Sprint 2 functionality was unintentionally added | PASS |
| Existing prototype remains recoverable | PASS |
| CHANGELOG updated | PASS |
| README / architecture documentation updated where required | PASS for architecture docs; README root not yet updated |

Overall Sprint 1 status:

```text
FAIL / NOT VERIFIED
```

Reason:

The Sprint 1 code, migration, and hardening changes are implemented locally and static checks pass, but database deployment and end-to-end browser/security tests are not yet complete. Sprint 1 must not be marked PASS until those real tests pass.

## 9. Known Issues / Technical Debt

### Must fix before Sprint 2

- Deploy `database/001_sprint1_core.sql` to Supabase.
- Run real three-browser or three-device Sprint 1 tests.
- Verify RLS/RPC behavior against actual Supabase project.
- Confirm GitHub Pages serves `index.html` and `teacher.html`.

### Can defer

- Replace placeholder scenes with structured Castle Escape content.
- Improve UI polish.
- Move fallback prototypes to `/legacy` after equivalent Sprint 1 flow is verified.

### Production/security issue

- Teacher token is not full authentication.
- Join codes can be mis-shared.
- Anyone with teacher token can access teacher controls.
- No rate limiting exists at frontend level.

### UX issue

- Teacher must manually create and distribute join codes.
- Student recovery in incognito/private windows depends on re-entering join code.
- Teacher flow still requires technical familiarity with room token and migration setup.

## 10. What I Did NOT Change

Sprint 1 did not implement or redesign:

- DiscussionRoom
- behavior analysis
- six-pattern Agent aggregation
- prediction system
- Asset Manager
- final game artwork
- full Castle Escape story scenes

No exception was made for these items.

## 11. Architecture Decision Summary

Frontend structure:

- `index.html` for students.
- `teacher.html` for teacher.
- Lightweight ES modules in `/src`.
- No npm.
- No build pipeline.
- GitHub Pages root deployment remains compatible.

Player session model:

- Teacher creates role-specific join codes.
- Student exchanges join code for generated session token.
- `player_id` is the real identity.
- `display_name` is separate from identity.

Room-state model:

- `s1_room_state` is authoritative.
- Browser polls server state.
- Browser does not own reveal decision.

Reconnect strategy:

- Store session token in `localStorage`.
- On load, call `s1_get_player_state`.

Teacher-access strategy:

- Room-specific teacher token.
- Token checked by Supabase RPC.
- No hard-coded frontend PIN.

Supabase access pattern:

- Browser calls `SECURITY DEFINER` RPC functions.
- Tables have RLS enabled.
- No broad public table policies are added.
- No service-role key in browser code.

Polling/realtime strategy:

- Sprint 1 uses polling every ~1.2 seconds.
- Supabase Realtime is not introduced in Sprint 1.

## 12. Repository / Deployment State

Branch:

```text
master
```

Latest commit hash:

```text
NOT AVAILABLE BEFORE INITIAL COMMIT
```

GitHub Pages student URL:

```text
https://meifeng202309-commits.github.io/GAL-Escape-Castle/index.html
```

Teacher Console URL:

```text
https://meifeng202309-commits.github.io/GAL-Escape-Castle/teacher.html
```

Supabase project:

```text
https://qdcbdcjobzytzhnhfwyn.supabase.co
```

Migration status:

```text
CREATED LOCALLY
NOT DEPLOYED
NOT TESTED END-TO-END
```

Deployment status:

```text
LOCAL FILES CREATED
NOT PUSHED TO GITHUB
NOT DEPLOYED TO GITHUB PAGES
```

## 13. Recommended Next Step

Sprint 2 should not begin yet.

Blocking items first:

1. Commit Sprint 1 files and this report.
2. Configure GitHub remote if repository push is desired.
3. Push/upload Sprint 1 files to GitHub.
4. Run `database/001_sprint1_core.sql` in Supabase SQL Editor.
5. Test:
   - teacher room creation
   - three student joins
   - private-choice locking
   - reveal
   - refresh/reconnect
   - teacher access protection
   - no pre-reveal choice leakage

Only after these pass should Sprint 2 be approved.
