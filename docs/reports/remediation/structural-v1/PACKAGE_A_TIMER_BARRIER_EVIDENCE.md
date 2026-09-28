# Package A ACT6 timer-barrier correction evidence

Date: 2026-09-28

Scope is limited to CA finding `A-CA-002-R1`.

## Correction

Migration 061 changes automatic Sprint5 initialization into preparation only:

- creates the Sprint5 state and ACT6 round identity;
- does not create/activate the canonical DiscussionRoom;
- does not start `started_at` or `phase_deadline`;
- preserves the ACT5 terminal scene while players cross the visible boundary.

Each player still observes and enters independently under migration 060. The final player's `s9_enter_act6` call reaches a server-serialized all-player barrier, then:

- configures the canonical ACT6 DiscussionRoom;
- starts the full 90-second deadline;
- transfers the shared scene to ACT6;
- records `act6_discussion_started` with `event_source=all_player_entry_barrier`.

Players who have entered early receive an explicit waiting surface and cannot see or consume the unstarted discussion.

## Verification

- all repository `*static-check.js` suites: PASS;
- Package A structural guard: PASS;
- changed JavaScript parse checks: PASS;
- `git diff --check`: PASS;
- deployment-targeted live test now asserts no discussion before entry, no timer after one player enters, and 85–90 seconds remaining immediately after the third entry.

## Remaining deployment evidence gate

Actual migration execution and remediated browser E0 require a controlled database/frontend deployment. No Supabase CLI, database credential, local Postgres/Docker runtime, deployment workflow, or authenticated management browser session is available in the current CD environment. This report therefore does not claim live verification.
