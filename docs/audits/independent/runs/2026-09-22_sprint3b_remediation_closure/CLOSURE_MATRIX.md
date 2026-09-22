# Sprint3B Remediation Closure Matrix

Baseline: `20f03c3a52116ba74361c5bc6f7574c9c700c02f`

This matrix records CA closure status independently from CD self-test claims.

| Finding | Original severity | Current closure status | Independent first-pass note |
|---|---:|---|---|
| IDA-001 | HIGH | IN PROGRESS | migration 013 moves canonical discussion resolution apply into the vote transaction and adds reconnect reconciliation; failure/retry edges still under review |
| IDA-002 | MEDIUM | IN PROGRESS | partial unique index enforces at most one open discussion row; pre-canonical generic-discussion carryover is being reviewed as an adjacent lifecycle issue |
| IDA-003 | MEDIUM | IN PROGRESS | player client now fails closed when formal state cannot be obtained; full boundary review pending |
| IDA-004 | MEDIUM | IN PROGRESS | replacement Library submit path refreshes timeout state before locked-prefix validation under server serialization; concurrent semantics pending final check |
| IDA-005 | HIGH | **FAIL — PRELIMINARY CONFIRMED** | generic discussion can still be opened before `s3b_initialize_flow`; initialization does not reject/close it, so the open generic DiscussionRoom can survive into ACT1 private canonical gameplay |
| IDA-006 | HIGH | IN PROGRESS | durable server-owned action-start fields and timing validity added; completeness/semantics pending |
| IDA-007 | MEDIUM | IN PROGRESS | dedicated three-player Game-only vote path appears canonical; concurrency/privacy/reconnect checks pending |
| IDA-008 | HIGH | IN PROGRESS | SHARE PHOTO now requires authoritative `allow_share_photo` plus open canonical discussion; adjacent phase races pending |
| IDA-009 | HIGH | IN PROGRESS | message/vote requests carry exact discussion identity and stale-round rejection; retry ordering pending |
| IDA-010 | HIGH | IN PROGRESS | stable message request identity + unique DB identity prevents duplicate message insertion; late retry behavior pending |
| IDA-011 | MEDIUM | IN PROGRESS | Library request identity + unique DB identity prevents duplicate attempt insertion; final race check pending |
| IDA-012 | HIGH | **FAIL — PRELIMINARY CONFIRMED** | action wrappers log formal player events after delegated mutations; when the delegated action triggers `s3b_set_scene`, `scene_transition` is inserted first and the triggering player event is then tagged with the *new* scene/phase, reversing causal/context chronology at several boundaries |

## Preliminary closure blockers

### IDA-005 carryover path

Deterministic sequence from current code:

1. start formal run;
2. before Sprint3B initialization, Teacher opens generic Sprint2 DiscussionRoom — allowed because no canonical scene exists yet;
3. Teacher calls `s3b_initialize_flow` — current wrapper checks only whether Sprint3B run state already exists; it does not reject/resolve the open generic discussion;
4. canonical ACT1 private scene is created while the generic discussion remains open;
5. student `s2_get_player_state` still returns that discussion and the browser renders DiscussionRoom together with the private canonical flow.

The server now prevents *new* generic discussions after canonical initialization, but it does not prevent this carryover path.

### IDA-012 action/transition chronology

`public.s3b_log_formal_event(...)` derives scene/phase/step from the current `s3_runtime_scene_state` at logging time.

The remediation wrappers generally execute:

`delegated mutation → possible s3b_set_scene transition → s3b_log_formal_event(player action)`

Therefore boundary-triggering actions can be persisted with post-transition context. Examples include:
- third ACT1 consequence completion;
- third leave-start-room action that opens the ACT2 discussion;
- third route-update ACK;
- fold-back completion;
- third FOLLOW SIGN arrival;
- ACT4 choice when the delegated function advances the group state.

Because `s3b_set_scene` itself appends the `scene_transition` before control returns to the wrapper, event ordering can represent the transition before the player action that caused it. This weakens causal reconstruction and keeps IDA-012 open pending final closure determination.
