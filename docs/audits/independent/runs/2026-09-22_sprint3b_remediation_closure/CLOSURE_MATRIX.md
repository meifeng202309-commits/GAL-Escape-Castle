# Sprint3B Remediation Closure Matrix

Baseline: `20f03c3a52116ba74361c5bc6f7574c9c700c02f`

Audit level: **Level 2 — Targeted Independent Closure Audit**

This matrix records CA closure status independently from CD self-test claims.

## 1. Original IDA finding closure

| Finding | Original severity | Closure result | CA evidence / boundary |
|---|---:|---|---|
| IDA-001 | HIGH | **FIXED_VERIFIED** | migration 013 makes final vote resolution and canonical ACT2/ACT5 Game Track apply part of the same server transaction; reconnect re-application is idempotent. Updated Sprint3B live flow reaches route-update state without any browser apply RPC. |
| IDA-002 | MEDIUM | **FIXED_VERIFIED** | partial unique index `discussion_sessions_one_open_per_run` makes the one-open-session property a database invariant across generic/canonical insert paths. The remaining generic→canonical carryover problem is IDA-005, not duplicate-open persistence. |
| IDA-003 | MEDIUM | **FIXED_VERIFIED** | formal player refresh now determines formal-run status before rendering interactive legacy controls and hides all interaction surfaces on formal-state failure. Deterministic client control-flow re-test passes; physical browser fault injection was not independently repeated by CA. |
| IDA-004 | MEDIUM | **FIXED_VERIFIED** | replacement Library submission acquires the run serialization boundary, refreshes timeout state, then re-reads/locks `s3b_run_state` before locked-prefix validation and attempt insertion. The original check-before-refresh TOCTOU path is removed. |
| IDA-005 | HIGH | **REMAINS_OPEN** | a generic Sprint2 discussion can still be opened after formal run start but before `s3b_initialize_flow`; initialization does not reject/close it, so that discussion survives into canonical ACT1 private gameplay and is returned/rendered alongside the private phase. |
| IDA-006 | HIGH | **FIXED_VERIFIED** | durable server-owned start timestamps + validity fields now exist for ACT1/ACT2/ACT4. ACT1 start is per-player acknowledgement; ACT2/ACT4 starts are written when the authoritative phase becomes actionable; reconnect state returns persisted values. CD live evidence verifies authoritative timing persistence; CA did not repeat the original three-player staggered timing experiment independently. |
| IDA-007 | MEDIUM | **FIXED_VERIFIED** | old one-player route-commit authority is revoked. Dedicated per-player Game-only votes remain unresolved after 1–2 submissions and server majority resolves only after the third. Updated Sprint3B live suite exercises a 2:1 terminal result and conflicting replay rejection. |
| IDA-008 | HIGH | **FIXED_VERIFIED** | SHARE PHOTO now requires authoritative `allow_share_photo=true`, a matching open canonical discussion, physical ownership/current view/shareability, and recipient validity. Existing live evidence covers allowed canonical sharing and direct-RPC rejection outside the allowed scene. Exact packet-level race injection against discussion closure was not independently repeated by CA. |
| IDA-009 | HIGH | **FIXED_VERIFIED** | message/vote mutations now carry exact `discussion_session_id` + `vote_round`; server compares them to the current authoritative interaction before mutation. Old signatures are revoked. A stale request can no longer be silently retargeted into a newer round. |
| IDA-010 | HIGH | **FIXED_VERIFIED** | dialogue messages now carry stable client request identity with DB uniqueness; same logical retry returns the original committed message result instead of inserting a duplicate. CD live remediation suite exercises the commit/retry identity behavior. |
| IDA-011 | MEDIUM | **FIXED_VERIFIED** | Library submissions now carry stable request identity; server checks committed identity before new attempt mutation and DB uniqueness prevents duplicate logical attempts. Response-loss retry cannot increment attempt/hint state twice. |
| IDA-012 | HIGH | **REMAINS_OPEN** | append-only event coverage was added, but boundary-triggering player actions are logged *after* delegated mutation/scene transition. `s3b_log_formal_event` reads current scene context at log time, so the transition event can precede the causal player action and the action can be tagged with the new scene/phase. Full chronological reconstruction is therefore still semantically incorrect. |

### Closure total

- **10 / 12 original findings FIXED_VERIFIED**
- **2 / 12 remain open: IDA-005, IDA-012**

## 2. IDA-005 deterministic carryover reproduction

1. Start a formal run.
2. Before Sprint3B initialization, Teacher opens a generic Sprint2 DiscussionRoom. This is allowed because no canonical `s3_runtime_scene_state` exists yet.
3. Teacher calls `s3b_initialize_flow`.
4. Initialization creates the ACT1 private canonical scene but does not reject/resolve the already-open generic discussion.
5. `s2_get_player_state` still returns the generic open discussion.
6. Formal student refresh renders both the DiscussionRoom and Sprint3B private scene.

The remediation prevents **new** generic discussions after canonical initialization but does not prevent this carryover across the initialization boundary.

## 3. IDA-012 deterministic chronology failure

`public.s3b_log_formal_event(...)` derives scene/phase/step from the current `s3_runtime_scene_state` at logging time.

The remediation wrappers generally execute:

`delegated mutation → possible s3b_set_scene transition/event → s3b_log_formal_event(player action)`

Boundary examples include:
- third ACT1 consequence completion;
- third leave-start-room action opening meeting discussion;
- third route-update ACK;
- fold-back completion;
- third FOLLOW SIGN arrival;
- ACT4 choice when group state advances.

For these paths, persisted event order/context can say the scene transitioned before the causal player action, and can place that player action in the destination scene. This fails the original requirement that the completed run be chronologically reconstructable from persisted evidence alone.

## 4. Evidence boundaries

CA did not repeat the complete CD live suite from an independently controlled Supabase environment in this Level 2 audit. CD's reported real-backend test results were reconciled against source/test control flow after CA first-pass hypotheses were frozen.

The gate failure is not based on missing dynamic evidence: IDA-005, IDA-012, RCA-001 and RCA-002 are deterministic source/history proofs.
