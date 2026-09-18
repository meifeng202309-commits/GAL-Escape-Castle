# Execution Report

Date/time: 2026-09-17 Asia/Shanghai  
Repository: `meifeng202309-commits/GAL-Escape-Castle`  
Branch: `main`  
Tested commit: `e940838 Fix Supabase pgcrypto hash lookup`  
Step: Step 1 — Deploy Hardened Migration  
Status: PASS

## 1. Objective

Deploy the hardened Sprint 1 migration from:

```text
database/001_sprint1_core.sql
```

to the existing Supabase project:

```text
https://qdcbdcjobzytzhnhfwyn.supabase.co
```

The deployed migration must include the Sprint 1 hardening pass, the atomic `s1_join_player` fix, and the Supabase `pgcrypto` lookup fix.

## 2. Actions Performed

1. Confirmed GitHub `main` contains the hardened migration.
2. User ran the updated migration in Supabase SQL Editor and reported:

```text
重新执行成功
```

3. Ran Supabase REST/RPC verification against the current project.
4. Checked direct anonymous REST access to the Sprint 1 tables.
5. Confirmed Step 1 is deployed and callable through the intended RPC interface.

## 3. Expected Result

Expected:

- Supabase SQL Editor accepts the updated migration.
- Hardened Sprint 1 RPC functions are callable.
- `s1_create_room` no longer fails on `extensions.digest(...)`.
- `s1_join_player` is deployed with row locking.
- Students and teacher can use RPCs without service-role keys in browser code.
- Direct anonymous table access remains unavailable or restricted.

## 4. Actual Result

The updated migration was rerun successfully by the user.

RPC verification passed:

```json
{
  "create_room": 200,
  "get_teacher_state": 200,
  "teacher_players_count": 3,
  "join_player": 200,
  "get_player_state": 200,
  "player_display_name": "Gitte",
  "submit_private_choice": 200,
  "canonical_choice_label": "Study the map on the wall",
  "advance_from_collecting": "rejected",
  "release_player_session": 200,
  "reset_room": 200,
  "room": "VERIFY0917012108"
}
```

Direct anonymous REST checks for all six Sprint 1 tables returned `404 Not Found`. This is acceptable for Step 1 because RPC access passed and the formal browser implementation is expected to use RPCs, not unrestricted direct table access.

## 5. Evidence

Target Supabase project:

```text
https://qdcbdcjobzytzhnhfwyn.supabase.co
```

SQL Editor:

```text
https://supabase.com/dashboard/project/qdcbdcjobzytzhnhfwyn/sql/new
```

GitHub migration source:

```text
https://raw.githubusercontent.com/meifeng202309-commits/GAL-Escape-Castle/main/database/001_sprint1_core.sql
```

The first deployment attempt exposed this error:

```json
{
  "code": "42883",
  "message": "function digest(text, unknown) does not exist"
}
```

The migration was corrected by qualifying `digest` through the `extensions` schema:

```sql
select encode(extensions.digest(coalesce(value, ''), 'sha256'), 'hex')
```

Direct anonymous REST table checks:

```json
{
  "s1_rooms": "ERROR: Response status code does not indicate success: 404 (Not Found).",
  "s1_room_players": "ERROR: Response status code does not indicate success: 404 (Not Found).",
  "s1_room_state": "ERROR: Response status code does not indicate success: 404 (Not Found).",
  "s1_player_decisions": "ERROR: Response status code does not indicate success: 404 (Not Found).",
  "s1_game_events": "ERROR: Response status code does not indicate success: 404 (Not Found).",
  "s1_scene_choices": "ERROR: Response status code does not indicate success: 404 (Not Found)."
}
```

No service-role key, real teacher token, real player session token, or reusable secret was written to source control or this report.

## 6. Tests

| Test | Expected | Actual | Result |
|---|---|---|---|
| Intended Supabase project confirmed | Project URL is `qdcbdcjobzytzhnhfwyn.supabase.co` | Confirmed from dashboard and repository config | VERIFIED PASS |
| GitHub main migration reachable | Raw migration returns content | Raw migration content was read | VERIFIED PASS |
| Migration includes `FOR UPDATE` | `s1_join_player` locks the target player row | Migration contains row lock | VERIFIED PASS |
| Migration deployed | SQL runs successfully in Supabase SQL Editor | User reported `重新执行成功` | VERIFIED PASS |
| `s1_create_room` | Creates a new room through RPC | HTTP 200 | VERIFIED PASS |
| `s1_get_teacher_state` | Teacher state is returned through RPC | HTTP 200; 3 players returned | VERIFIED PASS |
| `s1_join_player` | Valid join code claims one role | HTTP 200; returned player state for Gitte | VERIFIED PASS |
| `s1_get_player_state` | Player state is available after join | HTTP 200 | VERIFIED PASS |
| `s1_submit_private_choice` | Stores canonical choice | HTTP 200; label returned from server | VERIFIED PASS |
| `s1_advance_scene` from collecting | Must reject accidental advance before reveal | Rejected as expected | VERIFIED PASS |
| `s1_release_player_session` | Releases active player session for prototype recovery | HTTP 200 | VERIFIED PASS |
| `s1_reset_room` | Teacher-authenticated reset works | HTTP 200 | VERIFIED PASS |
| Required tables exist indirectly | RPCs can create/read/write across Sprint 1 tables | Verified through RPC behavior | VERIFIED PASS |
| Direct anonymous table access | Should not be unrestricted | Returned 404 for all checked tables | VERIFIED PASS |

## 7. Problems Found

### Resolved

Severity: Critical

Problem:

`s1_hash_token` originally used an unqualified `digest(...)` call. In the deployed Supabase environment this failed with:

```text
function digest(text, unknown) does not exist
```

Fix:

`database/001_sprint1_core.sql` now creates the `extensions` schema if needed, installs `pgcrypto` there if needed, and calls:

```sql
extensions.digest(...)
```

Retest result:

VERIFIED PASS

## 8. Files Changed

- `database/001_sprint1_core.sql`
- `CHANGELOG.md`
- `docs/codex_reports/STATUS.md`
- `docs/codex_reports/sprint1_validation/01-supabase-deployment.md`

## 9. What Was NOT Changed

- Did not run GitHub Pages browser health check.
- Did not run three independent browser session validation.
- Did not run full Sprint 1 acceptance validation.
- Did not start Sprint 2.
- Did not add DiscussionRoom.
- Did not add Agent analysis.
- Did not add Asset Manager.
- Did not add full story content.

## 10. Next Step

Next allowed step:

Step 2 — Connection / Deployment Health Check.

Sprint 2 remains unauthorized.
