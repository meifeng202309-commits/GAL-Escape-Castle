# CA288 migration 070 production repair — PASS

Date: 2026-10-25 (Asia/Shanghai)
Owner: CD

## Authorized change

CA/Teacher authorized only the exact existing `database/070_w03_combined_grab_leave.sql` after the CA288 preflight. No Pages or source change was made and no browser was refreshed or rejoined.

The preflight matched the frozen diagnosis exactly: room `T1`, run `9e619157-f726-4d9b-a04b-39c61333cd7d`, three first-meeting locks, zero grab/leave state, zero receipts, zero grab/leave events, exact four dependency signatures, and no pre-existing 070 object.

Supabase migration `20261024161149 ca288_w03_combined_grab_leave` applied successfully.

## Deployment verification

- `public.s3b_action_receipts` exists.
- `public.s3b_grab_and_leave(text,text,uuid,uuid)` exists as `postgres`-owned SECURITY DEFINER.
- EXECUTE is limited to `anon`, `authenticated`, `service_role`, and owner; displaced two-step functions have no public/anon/authenticated EXECUTE.
- A type-correct invalid-session PostgREST probe returned business HTTP 400 rather than `PGRST202`, proving the new signature was visible without mutating any room.
- T1 stayed unchanged immediately after deployment.

## Preserved three-player regression

The Teacher used the three already-open Player tabs without refresh/rejoin. Production edge logs show exactly three `POST /rest/v1/rpc/s3b_grab_and_leave` requests, all HTTP 200, from `2026-10-24T16:13:12Z` through `16:14:03Z`.

Database evidence after the run:

- exactly three receipts, one per player;
- all three players have `grab_complete=true` and `left_start_room=true`;
- exactly three `grab_completed` and three `start_room_left` events;
- each player's two events share that player's receipt request UUID;
- no player remains in `start_room`;
- the same room subsequently progressed through later acts to `act13_escape`, demonstrating the third-player barrier did not duplicate or deadlock progression.

CA288 repair and focused three-player regression: **PASS**.

## Newly observed independent blocker

At ACT13 the Teacher reported that clicking the visible `Doorgaan` control returned `Session integrity verification failed.` This is not the ACT2 combined button and does not invalidate the migration 070 PASS. Edge logs show the click issued `POST /rest/v1/rpc/s3b_ack_route_update` and received HTTP 400 at `2026-10-24T16:19:41Z`, while authoritative S3B state was already `act13_escape / castle_exterior`.

No further click, source change, SQL, or room mutation was attempted. This appears to be a separate stale/wrong action-routing or session-integrity issue and requires a new bounded CA diagnosis authorization.

