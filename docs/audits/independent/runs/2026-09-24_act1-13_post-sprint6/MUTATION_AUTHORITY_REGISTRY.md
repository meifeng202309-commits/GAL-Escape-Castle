# MUTATION_AUTHORITY_REGISTRY — ACT1–13 post-Sprint6

Baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`

## Method 2 summary

The effective runtime exposes several generations of mutation APIs, but most superseded internal/helper surfaces are explicitly revoked from `public`, `anon`, and `authenticated`. The main current authority conflict is not an exposed helper: it is the still-active generic Sprint2 refresher mutating a Sprint6-owned discussion row (IDA-001).

No additional confirmed browser-reachable internal-helper bypass was found in Method 2.

## C1. External mutation inventory

### Sprint1 legacy / room

| Family | Caller auth | Principal mutations | Current role |
|---|---|---|---|
| `s1_create_room` | Teacher-created room flow | room, players, prototype state | legacy verified room bootstrap |
| `s1_join_player` | join code | session binding / last seen | active access authority |
| `s1_submit_private_choice` | player session | Sprint1 prototype decision | legacy verified prototype only |
| `s1_advance_scene` | Teacher token | Sprint1 prototype state | legacy prototype only |
| `s1_release_player_session` | Teacher token | player session binding | active recovery |
| `s1_reset_room` | Teacher token | Sprint1 prototype rows | must not reset formal run |

Formal Castle progression does not use `s1_room_state` as its scene authority.

### Sprint2 formal run / generic DiscussionRoom

| RPC | Auth | State guard / identity | Replay/concurrency notes |
|---|---|---|---|
| `s2_start_run` | Teacher token | requires exactly 3 joined players; rejects existing active run | room row + unique active-run index serialize run start |
| `s2_open_discussion` | Teacher token | migration013 rejects when canonical `s3_runtime_scene_state` exists | generic creation unavailable during canonical gameplay |
| `s2_open_vote` | Teacher token | picks latest discussion; requires status discussion + require_final_vote | still externally callable; not canonical-owner aware |
| `s2_add_time` | Teacher token | picks latest open discussion | externally callable Teacher timing operation |
| `s2_send_message` exact-id form | player session | exact discussion_session_id + vote_round; latest-round check | client_request_id idempotency |
| `s2_submit_vote` exact-id form | player session | exact discussion + round, current voting state | row lock + one vote/player/round |

Important: `s2_get_player_state` is nominally a read but invokes `s2_refresh_discussion`, so it is a state-changing surface in practice. That mutation is the source of IDA-001.

### ACT1–5 / Pocket / knowledge

Player mutation surfaces authenticate via `s1_get_player_by_session`, bind to active run, and mostly verify canonical scene/phase before writing.

Key current families:
- ACT1 acknowledgement/choice/completion;
- ACT2 first-meeting choice / route acknowledgement;
- grab / leave / fold-back / follow-sign;
- Library code attempt with request identity after remediation;
- ACT4 first choice;
- post-inspection 3-player route vote;
- item view change;
- SHARE PHOTO.

`s3_share_photo` is server-gated by current canonical `allow_share_photo`, physical ownership and shareable current view after Sprint3B remediation.

AUDIT-only puzzle/private-debug controls require Teacher token and `run_mode='audit'`.

### Teacher Override

`teacher_apply_override`:
- requires Teacher token;
- validates current canonical source scene/phase/step;
- uses a bounded ACT1–5 allowlist;
- records override + invalidated semantic scope;
- preserves player evidence;
- later event logging carries upstream override provenance.

No ACT6–13 arbitrary override path is exposed by this function.

### Asset Manager

Public browser/reviewer surfaces:
- `asset_manager_review`;
- `asset_manager_state`;
- `asset_manager_save_anchors`;
- `asset_resolve` (read).

Review/state/anchor writes require reviewer-token authority after migration024.

Service-role-only surfaces include:
- registry sync;
- candidate import/submission;
- activation group;
- rollback group.

Internal group transition helper is revoked even from service_role and called only through SECURITY DEFINER wrappers.

### Sprint5 ACT6–8

Player mutations:
- `s5_send_message`;
- `s5_submit_vote`;
- `s5_submit_private_choice`;
- `s5_advance`.

Teacher:
- `s5_initialize`;
- `s5_teacher_open_vote`;
- `s5_teacher_add_time`;
- AUDIT expiry probe.

Sprint5 state is bound through current `s5_run_state.phase_key/vote_round` and exact `s5_rounds.discussion_session_id`.

### Sprint6 ACT9–13

Browser-authorized mutations are the `*_v2` layer:

- `s6_send_message_v2`;
- `s6_close_discussion_v2`;
- `s6_submit_group_choice_v2`;
- `s6_submit_private_choice_v2`;
- `s6_submit_allocation_v2`;
- `s6_complete_station_v2`;
- `s6_engage_v2`;
- `s6_advance_v2`.

Each authenticates the player session, derives active run, acquires a request-scoped advisory lock where applicable, and binds mutation to expected current phase/step/round or exact discussion identity.

Teacher mutation:
- `s6_initialize` only.

## C2. Internal / helper exposure

Verified source-level revocation:

- Sprint3 historical `*_pre013` / internal resolution wrappers are not browser executable.
- `s3b_log_formal_event_at_context` is internal.
- Sprint6 `s6_set_scene`, `s6_deliver_clues`, `s6_open_discussion`, `s6_assert_identity`, `s6_tick_cinematic`, `s6_request_lock` are internal.
- Sprint6 first-generation unguarded writes are revoked from anon/authenticated by migration035.
- Sprint6 guarded layer is then revoked from anon/authenticated by migration036; only v2 is browser-authorized.
- Asset transition helper is internal; service-role wrappers own external publication/activation.

Deployment-effective PostgreSQL ACL remains a later Method 4 NOT VERIFIED boundary unless the production catalog can be independently inspected.

## C3. Authentication / authorization

Observed patterns:

- player mutations obtain the player through room + session token;
- Teacher mutations call `s1_assert_teacher`;
- AUDIT-specific probes additionally verify `run_mode='audit'`;
- asset reviewer operations use reviewer-token lookup;
- publication/activation flows are service-role restricted;
- Sprint6 role-specific station/ENGAGE operations verify server allocation and role task.

No caller-supplied player id is accepted as identity for normal player mutations.

## C4. Phase / state guards

Strong server-side phase checks exist for:
- ACT1–5 canonical scene transitions;
- Sprint5 phase/round and exact discussion;
- Sprint6 phase/step/round + exact discussion/session;
- allocation branch/role;
- station task;
- ENGAGE;
- ACT13 pause/boundary.

Confirmed exception:
- generic `s2_refresh_discussion` has no ownership guard distinguishing a generic/Sprint5 discussion from a Sprint6-owned no-vote discussion. It can therefore consume the same row under a different transition model (IDA-001).

## C5. Replay / stale behavior

### Strong areas

- Sprint2 exact messages/votes reject stale session/round and deduplicate messages by client request id.
- Sprint5 vote retries compare request identity/content.
- Sprint6 v2 mutations use durable `s6_action_receipts`, expected interaction identity, stable browser request IDs, and transaction advisory serialization.
- stale Sprint6 step/phase actions are rejected rather than retargeted.

### Remaining issue

IDA-001 is not a duplicate-request bug; it is a competing resolver bug. Reconnect cannot recover because generic resolution permanently changes the shared discussion status without advancing the owning Sprint6 state.

## C6. Concurrency semantics

- active run creation is serialized by room lock + one-active-run unique index;
- discussion/vote resolution uses row locks;
- Sprint3 group gates use run/state locks after remediation;
- Sprint5 current vote/round tables provide one player submission per phase/round;
- Sprint6 v2 same-request calls serialize with advisory request lock and state-row locks;
- Sprint6 cinematic poll advancement locks `s6_run_state`;
- asset group transitions use server-side group transition wrappers.

No second concurrency defect was confirmed in this method.

## Method 2 disposition

Confirmed finding supported:
- **IDA-001 HIGH** — competing Sprint2/Sprint6 discussion completion authority.

No additional mutation-authority finding opened in Method 2.
