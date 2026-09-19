# Sprint 3C Scope Proposal — Minimal Safe Teacher Deblock / Override

## Objective

Add the minimum server-authoritative Teacher deblock capability required by V4.0 and Codex Development Specification V2.3 without implementing ACT 6+, export, arbitrary scene navigation, player impersonation, or a general-purpose workflow editor.

## Proposed server contract

- Additive migration 013 only; do not rewrite migrations 001–012.
- One teacher-authenticated RPC: `teacher_apply_override(room_code, teacher_token, override_action, reason)`.
- Accepted actions only: `SKIP_CURRENT_INTERACTION` and `RESOLVE_AND_CONTINUE`.
- The client never supplies a target scene, phase, player identity, player choice, answer, or resolution payload.
- The server resolves the current `scene_id` + `phase_key` against an allowlisted scene-owned override configuration.
- Unsupported scene/action combinations are rejected without state mutation or event creation.
- Serialize on the active formal run row and reject stale/replayed override requests.

## Proposed data/evidence model

- Preserve all pre-override player choices, messages, votes, timings, facts, items, and events.
- Record a separate `teacher_override` event with action, source scene/phase, server-selected resolution, reason, timestamp, invalidated scope, and `behavior_scoring=false`.
- Never write a player actor, player choice, player vote, response time, or player-authored message for an override.
- Missing behavior fields caused by the override remain null and carry `invalid_teacher_override` validity metadata.
- NORMAL remains NORMAL and dataset-eligible at run level; only the affected fields/scopes are invalidated.
- AUDIT remains dataset-ineligible and retains full technical evidence.
- Record an active upstream override context on the run so later genuine events can carry `context_provenance.upstream_teacher_override=true` without becoming invalid automatically.

## Proposed Teacher UI

- Default-collapsed `ADVANCED / EMERGENCY OVERRIDE` section.
- Display only actions allowed by the current server response.
- Both actions require the specified second confirmation.
- Reason is required and sent as evidence only, never interpreted as a target/result.
- After success show action, source scene/phase, timestamp, reason, and invalidated scope.
- GAL UI shows only the normal server-selected narrative result.

## Required tests

- invalid teacher token and unsupported action/scene rejection;
- client cannot supply arbitrary target/player/result;
- override before any input and after partial real input;
- real pre-override data preserved;
- missing values remain null with `invalid_teacher_override`;
- no player impersonation/event synthesis;
- exactly one teacher_override event under replay/concurrency;
- NORMAL/AUDIT semantics retained;
- downstream genuine event remains real with upstream context provenance;
- reconnect restores authoritative post-override state and Teacher evidence;
- prior Sprint 1/2/3A/3B regressions remain green.

## Required canonical input

GA must identify the exact ACT 1–5 scene/phase/action allowlist and the safe server-selected result for each supported entry. CD will not infer narrative destinations or treat behavior choices as correct answers.

CA should approve the authority, validity, provenance, concurrency, and test boundaries before migration 013 implementation.
