# MUTATION AUTHORITY REGISTRY

Baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

## Browser-executable mutation surfaces

| Surface | Caller authority | Server guard | Replay / concurrency | Classification |
|---|---|---|---|---|
| `s1_create_room` | Teacher token chosen for new room | room uniqueness / distinct join codes | room key serializes uniqueness | current room bootstrap |
| `s1_join_player` | room + join code | role claim lock | row lock, one active claim | current session bootstrap |
| `s1_submit_private_choice` | player session | **legacy Sprint1 phase** | unique decision per player | **legacy, root-reachable pre-run** |
| `s1_advance_scene` / `s1_reset_room` | Teacher token | legacy Sprint1 state only | server guarded | **legacy Teacher shadow controls** |
| `s1_release_player_session` | Teacher token | role existence | revokes prior session | intended recovery |
| `s2_start_run` | Teacher token | exactly 3 claimed roles; no active run | room lock; duplicate start rejects | formal run creation |
| `s2_open_discussion` | Teacher token | migration013 rejects if canonical scene state exists | one-open-discussion unique index | safe server fail-closed during canonical flow |
| exact `s2_send_message` / `s2_submit_vote` | player session | exact discussion identity / latest round / status | message request identity; vote lock | guarded |
| `s3b_initialize_flow` | Teacher token | active run; no existing flow; generic discussion carryover guard | replay rejects | **separate startup step** |
| `s3b_*` ACT1–5 player actions | player session | scene/phase/role and state guards | locks/unique constraints; some state-convergent retry | guarded |
| `teacher_apply_override` | Teacher token | exact allowlist selected by server; room/run/scene lock | duplicate/replay rejection; evidence scope | guarded |
| `s3_set_item_view`, `s3_share_photo` | player session | ownership/scene permissions | state guards | guarded |
| `s5_*` | player/Teacher as specified | run/phase/session/vote-round constraints | request identity for behavioral actions | guarded |
| `s6_*_v2` | player session | expected phase/step/round + run ownership | receipt/request lock | guarded |
| `s6_mark_audio_consumed` | player session | occurrence/run binding | unique consumption identity | guarded |
| `s7_set_audit_private_debug` | Teacher token | AUDIT mode server check | logged | guarded |
| `s8_finalize` | player session + expected run id | run/room/current state + integrity report | finalization row makes replay idempotent | guarded |
| Asset Teacher review/anchor | reviewer token | reviewer authority + candidate state | state transitions | guarded |
| Asset publication/activation | service role | service-only functions | group transition controls | not browser-authoritative |
| `asset_report_load_failure` | anon/auth browser | exact current ACTIVE version/path | 5-minute dedup | telemetry-only |

## Internal / historical helper exposure

Source-level migration review shows historical implementations are generally renamed and revoked when superseded:
- `*_pre011`, `*_pre013`, `teacher_apply_override_v05x`;
- Sprint6 guarded predecessors;
- internal scene setters and reconciliation helpers;
- integrity verifier helpers;
- temporary NORMAL deadline accelerators removed in migration042.

No source-level evidence was found that these superseded helpers remain browser executable at migration058.

## Authority defect

The principal authority overlap is not a hidden RPC bypass; it is that the **current root product itself deliberately invokes the legacy Sprint1 authority before a formal run exists**.

Teacher root UI also exposes legacy Sprint1 mutation controls beside formal controls. These mutate a separate shadow state, not the formal run, but are operationally reachable.

## Canonical ownership

Recent post-CA-130 media changes preserve role boundaries:
- VA/Teacher owns production/review semantics;
- CD consumes exact approved source identities for mechanical canonicalization/publication;
- service-role functions retain ACTIVE publication authority.
