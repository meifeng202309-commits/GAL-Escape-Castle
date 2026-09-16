# Execution Report

Date/time: 2026-09-17 Asia/Shanghai  
Repository: `meifeng202309-commits/GAL-Escape-Castle`  
Branch: `main`  
Tested commit: `f187e3f Make Sprint 1 player join atomic`  
Step: Step 1 — Deploy Hardened Migration  
Status: FAIL

## 1. Objective

Deploy the hardened Sprint 1 migration from:

```text
database/001_sprint1_core.sql
```

to the existing Supabase project:

```text
https://qdcbdcjobzytzhnhfwyn.supabase.co
```

The deployed migration must include the `s1_join_player` `FOR UPDATE` fix and all Sprint 1 hardening changes.

## 2. Actions Performed

1. Confirmed current local Git commit:

```text
git log -1 --oneline
```

2. Confirmed GitHub `main` migration content is readable and includes hardening markers:

```text
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/meifeng202309-commits/GAL-Escape-Castle/main/database/001_sprint1_core.sql' -UseBasicParsing
```

3. Opened Supabase SQL Editor URL:

```text
https://supabase.com/dashboard/project/qdcbdcjobzytzhnhfwyn/sql/new
```

4. Observed that Supabase requires interactive login before SQL Editor can be used.

## 3. Expected Result

Expected:

- Supabase SQL Editor opens for project `qdcbdcjobzytzhnhfwyn`.
- Migration SQL can be pasted and run.
- Tables and functions can be verified.

## 4. Actual Result

After the user logged in and ran the migration in Supabase SQL Editor, RPC verification was attempted through Supabase REST.

Verification failed on the first RPC call because `s1_hash_token` could not resolve `digest()`:

```json
{
  "code": "42883",
  "details": null,
  "hint": "No function matches the given name and argument types. You might need to add explicit type casts.",
  "message": "function digest(text, unknown) does not exist"
}
```

Migration deployment is therefore not accepted.

## 5. Evidence

Target project:

```text
https://qdcbdcjobzytzhnhfwyn.supabase.co
```

SQL Editor attempted:

```text
https://supabase.com/dashboard/project/qdcbdcjobzytzhnhfwyn/sql/new
```

RPC verification command used Supabase REST endpoint:

```text
https://qdcbdcjobzytzhnhfwyn.supabase.co/rest/v1/rpc/s1_create_room
```

GitHub migration source:

```text
https://raw.githubusercontent.com/meifeng202309-commits/GAL-Escape-Castle/main/database/001_sprint1_core.sql
```

Verified GitHub main migration includes:

- `s1_scene_choices`
- `s1_release_player_session`
- `s1_join_player`
- `for update`

No password, real teacher token, real session token, service-role key, or secret was entered or committed. Temporary generated verification values were not written to reports.

## 6. Tests

| Test | Expected | Actual | Result |
|---|---|---|---|
| Intended Supabase project confirmed | Project URL is `qdcbdcjobzytzhnhfwyn.supabase.co` | Confirmed from repository config and dashboard URL | VERIFIED PASS |
| GitHub main migration reachable | Raw migration returns content | Raw migration content was read | VERIFIED PASS |
| Current migration contains `FOR UPDATE` | `s1_join_player` includes row lock | `for update` found in GitHub main migration | VERIFIED PASS |
| Supabase SQL Editor accessible | SQL Editor opens after user login | User reported execution success | VERIFIED PASS |
| Migration deployed | SQL runs successfully | User reported `执行成功` | VERIFIED PASS |
| First RPC verification | `s1_create_room` succeeds | Failed: `function digest(text, unknown) does not exist` | VERIFIED FAIL |
| Required tables exist | All Sprint 1 tables exist after migration | Not tested | NOT TESTED |
| Required RPC/functions exist | All Sprint 1 RPC functions exist after migration | Not tested | NOT TESTED |

## 7. Problems Found

Severity: Critical  

Root cause:

`s1_hash_token` used unqualified `digest(value, 'sha256')`. In this Supabase project, the `pgcrypto` function is not resolved through the function's current search path.

Fix required:

Qualify the pgcrypto function with the `extensions` schema and ensure that schema/extension exists.

Fix implemented:

Updated `database/001_sprint1_core.sql`:

```sql
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create or replace function public.s1_hash_token(value text)
returns text
language sql
stable
as $$
  select encode(extensions.digest(coalesce(value, ''), 'sha256'), 'hex')
$$;
```

Updated `CHANGELOG.md`.

Retest result:

NOT TESTED

## 8. Files Changed

- `database/001_sprint1_core.sql`
- `CHANGELOG.md`
- `docs/codex_reports/STATUS.md`
- `docs/codex_reports/sprint1_validation/01-supabase-deployment.md`

## 9. What Was NOT Changed

- Did not complete accepted migration deployment.
- Did not verify Supabase tables/functions after the fix.
- Did not run GitHub Pages health check.
- Did not run three-player validation.
- Did not run security/failure-path validation.
- Did not start Sprint 2.
- Did not add DiscussionRoom.
- Did not add Agent analysis.
- Did not add Asset Manager.
- Did not add full story content.

## 10. Next Step

Next allowed step:

Commit and push the `pgcrypto` lookup fix, then rerun the updated migration in Supabase SQL Editor.
