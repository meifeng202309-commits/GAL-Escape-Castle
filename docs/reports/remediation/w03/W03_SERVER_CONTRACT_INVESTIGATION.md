# W03 focused server-contract investigation

Timestamp: 2026-10-11T14:10:00Z
Pinned baseline: `ae59227`
Evidence tier: repository `SOURCE_STATIC`; deployed functions/ACL/runtime are `NOT_VERIFIED`
Authorization: `agent-comms/CA_to_CD_20261011T135000Z_w03-focused-server-contract-investigation-only.md`

## Effective repository-source chain

- Repository-last public definitions are `public.s3b_grab(text,text)` and `public.s3b_leave_start_room(text,text)` in `database/014b_sprint3b_targeted_closure_corrections.sql` (`s3b_grab`, `s3b_leave_start_room`). Each authenticates through `s1_get_player_by_session`, selects the active `game_runs` row `FOR UPDATE`, captures scene context, writes one canonical `runtime_events` row, and delegates to its `*_pre014` function in the same SQL transaction.
- `*_pre014` is the migration-011 phase guard. It authenticates again, resolves the active run, requires ACT2 `private_first_meeting`, rejects an already-complete individual action, and delegates to `*_pre011`.
- `*_pre011` is the migration-007 mutation body. GRAB inserts mandatory role items with conflict-safe inserts and sets `s3b_player_progress.grab_complete`. The migration-009 `s3b_optional_grab_item` trigger adds `gitte_flashlight` only on the false-to-true transition and only when canonical fact `gitte_flashlight_found` exists. Leave requires locked first meeting plus GRAB, sets `left_start_room=true` and `player_location='corridor'`, evaluates the three-Player barrier, and creates ACT2 Discussion only when none exists.
- Migration 008's `s3b_player_progress_serialize_gate` locks the run's `s3b_run_state` row before every progress mutation. Repository-last 014b additionally locks the active `game_runs` row before either wrapper. Thus concurrent second/third Player calls serialize by run before the base leave barrier check. The existing `NOT EXISTS` check and unique Discussion identity constrain duplicate creation, but this is source reasoning, not executed concurrency evidence.
- Durable canonical outcomes are: Player/item rows and item view state; `grab_complete`; `left_start_room`; `player_location='corridor'`; `runtime_events.event_type` values `grab_completed` and `start_room_left`; and the single `discussion_sessions` ACT2 row plus transitioned scene. `runtime_events.client_request_id` exists but has no observed uniqueness or stored response contract for these actions.
- Internal `pre011` and `pre014` functions are explicitly revoked from `public`, `anon`, and `authenticated`. Public wrappers are explicitly granted to `anon,authenticated`; no explicit `PUBLIC` revoke for the public wrappers was found in the inspected chain, so effective deployed ACL must be verified rather than inferred.

## Existing request identity and replay patterns

- `src/game/app.js::requestIdentity(kind, identity, payload)` stores `{payload JSON, requestId}` in `sessionStorage`. Equal payload under the same key reuses the UUID; changed payload generates a new UUID. `runSprint3bAction` does not currently use it. This helper supports same-tab lost-response retry but does not provide server idempotence, durable reconnect recovery, or conflicting-UUID detection.
- S3B's closest server pattern is `s3b_submit_library_code`: require non-null UUID, find prior `(run_id, submitted_by, client_request_id)`, reject content conflict, and return an idempotent replay. Its unique partial index prevents duplicate receipt identity but the attempt row is domain-specific.
- The stronger reusable shape is `s6_action_receipts`: primary key `(run_id,player_id,request_id)` with `action_key`, canonical payload and stored result, checked before mutation; same identity/different action or payload fails, same identity/same payload returns stored result. The table itself is S6-owned and should not be reused cross-domain. W03 needs an equivalently narrow S3B-owned durable receipt, not a generic workflow engine. Exact table/migration identity remains for a later implementation gate.

## Minimal candidate contract

Candidate public input, without freezing an RPC name or migration number:

- room code;
- Player session token;
- one non-null logical-action request UUID;
- expected run UUID to reject delayed requests from an older run.

No optional-item list is proposed. Current source proves only server-derived mandatory items and one discovered-fact-gated Flashlight; it proves no persisted selection contract. Any selectable optional-item parameter requires separate canonical semantics before implementation.

Transaction contract:

1. Authenticate Player and lock the expected active `game_runs` row; reject room/run mismatch.
2. Check the S3B-owned receipt by `(run_id, player_id, request_uuid)` before phase rejection. Same action and canonical payload returns the stored committed response with `idempotent_replay=true`; reuse with different action/payload fails.
3. Require ACT2 `private_first_meeting`, locked first-meeting choice, and neither combined action already completed unless a matching receipt exists. Lock/read Player progress under the existing run serialization boundary.
4. In the same transaction, acquire mandatory items and only source-proven discovered eligible optional items; transition `grab_complete`; write exactly one `grab_completed` event carrying the request UUID; transition `left_start_room` and location; write exactly one `start_room_left` event carrying the same UUID.
5. Evaluate the all-Player barrier once. When the caller is the third committed Player, create/retain exactly one ACT2 Discussion and transition the scene. Run-level locking makes simultaneous final Players serialize.
6. Store the complete response in the receipt and return canonical state: request/run/player identity, acquired item keys, GRAB/leave completion, location, barrier readiness and Discussion identity when ready.

Do not implement the combined path by invoking the two public 014b wrappers blindly: receipt validation must precede their existing already-complete guards, and event UUID/once-only behavior must be controlled by the combined transaction. The established pre014/pre011 domain mutations may be reused only if a later implementation proves that their wrapper layering cannot duplicate events or authority.

Lost response: the client retains the UUID via `requestIdentity`; retry returns the receipt. Reconnect/new tab recovers from `s3b_get_player_state` canonical progress even without the old UUID, hides the completed action, and sees the Discussion/queued messages. A new UUID after commit must not synthesize duplicate events; it should return a deterministic already-committed/stale error unless canonical recovery semantics are explicitly authorized.

Minimal error taxonomy: `REQUEST_ID_REQUIRED`, `EXPECTED_RUN_MISMATCH`, `NO_ACTIVE_RUN`, `PLAYER_AUTH_FAILED` (existing auth behavior), `ACTION_OUT_OF_PHASE`, `FIRST_MEETING_NOT_LOCKED`, `REQUEST_ID_CONFLICT`, `ACTION_ALREADY_COMMITTED`, and `OWNER_STATE_INVARIANT_BREACH`. Exact external strings/codes remain unfrozen.

## Negative-test matrix for a future implementation gate

| Vector | Required assertion |
|---|---|
| Normal per role | mandatory items, both progress facts/events, corridor, one stored response |
| Discovered Flashlight | included only for GAL-A with `gitte_flashlight_found`; absent otherwise |
| Same UUID replay | same response, no duplicate item/event/Discussion |
| Same UUID changed payload/action | conflict before mutation |
| Double-click | one commit and one replay |
| Lost response/retry | receipt returns committed outcome |
| New UUID after commit | no duplicated canonical effects; deterministic committed/stale error |
| Wrong/stale run UUID | rejected without touching current run |
| Out of phase / first meeting unlocked | rejected atomically; no provisional event remains |
| Concurrent second and third Players | serialized commits; exactly one third-player transition |
| Two simultaneous final calls | exactly one ACT2 Discussion and scene transition |
| Failure between GRAB and leave | entire transaction, both events and receipt roll back |
| Reconnect after commit | canonical state suppresses action and exposes current Discussion state |
| Direct internal call | pre011/pre014 remain inaccessible to client roles |

## Genuine uncertainties and boundary

- Deployed definitions, owner and effective ACL are not verified.
- No executed database proof establishes the inferred lock/concurrency behavior.
- Current source has no proven optional-item selection persistence beyond discovered Flashlight eligibility; do not invent broader selection semantics.
- A dedicated S3B receipt is needed for stored-result replay; its exact schema/name is not frozen here.
- Whether legacy two-RPC endpoints remain temporarily callable, are revoked, or become compatibility adapters is an implementation/release decision requiring CA authorization.
- Migration 069 is unrelated: it wraps the Teacher console and reads operational state. W03 uses S3B source contracts established in migrations 007–014b and has no source dependency on unapplied B1 migration 069.

No code, SQL, tests, schema, asset, environment or deployment was changed by this investigation.

