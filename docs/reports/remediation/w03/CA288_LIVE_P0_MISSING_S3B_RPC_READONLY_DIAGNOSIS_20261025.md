# CA288 LIVE P0 missing S3B RPC — read-only diagnosis

Date: 2026-10-25 (Asia/Shanghai)  
Owner: CD  
Scope: read-only production/catalog/log/source diagnosis only

## Diagnosis

This is a confirmed partial-deployment interface drift, not a stale PostgREST cache and not an obsolete/renamed endpoint.

- Deployed Player source commit `d09f7c7` renders one combined action and calls `public.s3b_grab_and_leave` with `p_room_code`, `p_session_token`, `p_client_request_id`, and `p_expected_run_id`.
- Repository migration `database/070_w03_combined_grab_leave.sql` defines that exact four-argument RPC and `public.s3b_action_receipts`, but its header is explicitly `UNAPPLIED`. Earlier CD/CA evidence also kept 070 `NOT_RUN` / production HOLD.
- Production catalog on project `qdcbdcjobzytzhnhfwyn` contains zero `s3b_grab_and_leave` overloads and `to_regclass('public.s3b_action_receipts')` is null.
- The required 070 dependencies exist with the expected signatures: `s1_get_player_by_session(text,text)`, `s3b_log_formal_event_at_context(uuid,text,uuid,text,text,text,text,jsonb,text,boolean,uuid,uuid)`, `s3b_grab_pre014(text,text)`, and `s3b_leave_start_room_pre014(text,text)`.
- Therefore Pages was advanced to the combined W03 client before its independently held database migration was deployed.

## Preserved live-room evidence

No room, run, phase, row, Pages setting, or browser tab was changed.

- Human room: `T1`; run `9e619157-f726-4d9b-a04b-39c61333cd7d` remains active.
- S3B scene is `act2_first_contact / private_first_meeting / signal_unstable`.
- All three players have `first_meeting_locked_at`; all three remain `grab_complete=false`, `left_start_room=false`, `player_location=start_room`.
- There is no ACT2 discussion session and no grab/leave event for this run, proving the missing endpoint caused no partial mutation.
- Edge logs record repeated real requests from the current Pages origin between `2026-10-24T15:45:50Z` and `15:48:01Z`: every POST to `/rest/v1/rpc/s3b_grab_and_leave` returned HTTP 404 with `PGRST202`. The three browser user-agent streams align with the three-player report.

## Smallest repair proposal — requires separate CA approval

Do not change Player source. Authorize a bounded database-only deployment of the already-audited `database/070_w03_combined_grab_leave.sql`, using its exact repository blob, after one immediate read-only preflight confirms the combined function and receipt table are still absent and the four dependency signatures are unchanged.

The migration is the matching owner contract: one transaction, stable request UUID, expected-run binding, canonical legacy grab/leave owner mutations, exactly-once receipt, two canonical events, third-player barrier behavior, and retirement of the displaced public two-RPC path. No guessed semantics or new RPC design is needed.

Stop conditions: any catalog drift, any existing partial 070 object, dependency signature/body/owner drift, live run no longer matching the preserved pre-state, SQL error, or unexpected ACL. On STOP, roll back the SQL transaction and do not touch Pages or the room.

## Focused three-player regression after approval

1. Confirm PostgREST exposes the exact four-argument RPC and `anon`/`authenticated` EXECUTE while old public `s3b_grab` and `s3b_leave_start_room` are not callable.
2. Without refresh/rejoin, retry the existing combined button once in each preserved Player tab. Failed requests retained their per-player stable request UUID, so retry should be safe.
3. Require three HTTP 200 responses; per player require one receipt, `grab_complete=true`, `left_start_room=true`, `player_location=corridor`, and exactly one `grab_completed` plus one `start_room_left` event linked to that request.
4. Require Players 1–2 to wait and Player 3 to create/enter exactly one ACT2 discussion barrier; no duplicate discussion/session/transition.
5. Reconnect or poll all three and verify canonical state persists with no duplicate event. Replay one identical request and require `idempotent_replay=true`; separately use a disposable synthetic run for different-payload/different-request conflict negatives rather than disturbing the human room.

Local static contract check passed. The browser fixture could not run in this environment because the local `playwright` package is absent; this does not replace the required post-deployment real three-tab regression.

## Deferred lower-priority observations

Missing watch/map/diary images, Teacher Pocket dropdown polling collapse, and missing confirmed-state feedback for Teacher Open Discussion/Open Vote remain deferred until this Function-First P0 is closed.

