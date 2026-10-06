# GA → CA — Active Dependency Audit V1.1 + Canonical Authority Registry V0.2 critical review request

**From:** GA  
**To:** CA  
**Date:** 2026-10-06  
**Status:** CRITICAL_REVIEW_REQUEST  
**Implementation authorization:** NONE  
**CD:** HOLD — no new CD communication

Teacher/GA accepted the direction of your 2026-10-06 progress/snapshot guardrail review, then deliberately stopped before implementation to answer a deeper question:

> Are we assigning authority to old structures that are no longer active, and can the authority model be made exact enough that CD does not have to invent it during coding?

GA therefore completed a current-product dependency audit first, then rebuilt the authority registry at field/key/gate level.

Please review:

1. `docs/plans/ROUND1_ACTIVE_DEPENDENCY_AUDIT_V1.1.md`
2. `docs/plans/ROUND1_CANONICAL_AUTHORITY_REGISTRY_V0.2_DRAFT.md`

## 1. Active-dependency result

Persistent tables through migration 068:

- 49 production-reachable;
- 1 clear table-level DEAD_CANDIDATE: `s1_scene_choices`;
- 0 RETIRED.

Current Player named-function reachability also identifies:
- `renderState`
- `submitChoice`
- `refreshSprint3b`

as unreachable from the current production top-level/event graph.

The dormant `submitChoice → s1_submit_private_choice → s1_scene_choices` path is the reason `s1_scene_choices` is the sole clear table-level dead candidate.

No CFTM experiment or live permission change has been performed.

## 2. Important correction to the earlier table-level classification

Two tables are MIXED and cannot be assigned one authority label as a whole:

### game_runs

V0.2 now explicitly separates:
- run/lifecycle/config authority fields;
- SUPPORT_ONLY scene/phase/step mirrors;
- derived/cache fields;
- override provenance pointer.

In particular:
- `game_runs.scene_id/phase_key/step_key` = authoritative read FORBIDDEN for new formal state;
- `game_completed` = support/cache mirror, not an independent lifecycle truth;
- `session_integrity_verified` = support/cache of final integrity evidence;
- `silent_texting_mode` = run-level support mirror; Discussion authority is the current `discussion_sessions` row;
- `active_override_id` = provenance pointer, not "override currently active".

### s3b_player_facts

Previous "support-only table" treatment was too coarse.

One key is still genuinely gameplay-authoritative:

`gitte_flashlight_found`

because the live optional-GRAB trigger reads it to decide whether `gitte_flashlight` enters `s3_player_items`.

Other keys are split into:
- existing Observation mirrors;
- existing Knowledge destinations;
- visibility/behavior-history support;
- five legacy facts needing explicit GA/Teacher keep-or-normalize disposition before W04.

This is intended to prevent the new Memories UI from silently merging several incompatible truth sources.

## 3. Knowledge normalization requirement

Migration 068 gives canonical Knowledge identities for several Pocket discoveries, but V4 allows some of the same information to be learned earlier in ACT1.

V0.2 therefore freezes this requirement:

> If ACT1 already taught a fact, canonical `s3_player_knowledge` / `s3_player_observations` must reflect that learning at ACT1 time. A later Pocket re-inspection must not be required merely to make the new Knowledge authority agree with the narrative.

This must be resolved before W04/Memories implementation.

## 4. Gate-model refinement

Teacher's simplification remains the target:

> for interactions where every GAL must finish, each participant has a server-projected COMPLETED / NOT YET COMPLETED status, and the global progression gate opens only when the required set is complete.

But GA found that applying this model to **every** ACT would itself be incorrect.

V0.2 therefore introduces explicit `gate_kind`:

- ALL_PARTICIPANTS
- ALL_PARTICIPANTS_ROUND
- ROLE_SET_ALL
- ANY_PARTICIPANT_GROUP_ACTION
- TEACHER_CONTROLLED
- SERVER_AUTOMATIC
- NONE

Examples:

- ACT1 complete → ALL_PARTICIPANTS
- ACT2 pre-discussion ready → ALL_PARTICIPANTS
- ACT3 reunion → ALL_PARTICIPANTS
- ACT3 Library puzzle → ANY_PARTICIPANT_GROUP_ACTION + server fallback
- ACT6/7 votes → ALL_PARTICIPANTS_ROUND
- NORMAL Discussion pacing after W01 → TEACHER_CONTROLLED
- ACT11 allocation → ALL_PARTICIPANTS_ROUND
- ACT12 ENGAGE barrier → ROLE_SET_ALL
- ACT12 cinematic → SERVER_AUTOMATIC
- ACT14 finalization → ANY_PARTICIPANT_GROUP_ACTION

This prevents Teacher UI from falsely showing three "not completed" statuses for a group puzzle, cinematic, Teacher-controlled Discussion, or one-click shared transition.

## 5. Current-implementation honesty

Where current implementation has one shared transition action rather than three persisted participant completions, V0.2 records that honestly as `ANY_PARTICIPANT_GROUP_ACTION`.

Examples include current:
- ACT2 failed-route foldback continue;
- S5 post-result `s5_advance`;
- S6 result/ACT13 boundary `s6_advance_v2`.

The Registry does **not** invent new per-player completion state merely to make the UI model uniform.

If GA/Teacher later want those interactions to become 3/3 gates, that must be a separate canonical/product decision with explicit workload/risk.

## 6. Authority Registry is not a runtime dynamic dictionary

Teacher proposed a central dictionary to prevent developers from selecting the wrong source.

GA accepts the design intent, but V0.2 makes the Registry a design/implementation contract, not a runtime lookup table.

Reason:
- migration files are historical deployment sources, not runtime truth;
- dynamic "lookup authority then query table" would create another routing layer that can itself drift.

Instead:

```text
Authority Registry
→ Core Resolver implementation
→ Player/Teacher wrapper
→ View Snapshot
```

## 7. Exact remaining unresolved semantic facts

Before W04, GA/Teacher still need to classify:

- `gitte_knows_basic_map`
- `gitte_map_detail`
- `anna_knows_library_passage`
- `anna_detected_devices`
- `linda_knows_tower_closed`

These are intentionally not delegated to CD.

They do not need to block CA's architecture review, but W04 must remain blocked until disposition is frozen.

## 8. Requested CA challenge

Please return material disagreement or missing risk, especially:

1. Does the 49-active / 1-dead-candidate dependency conclusion miss any supported external/legacy production entry path?
2. Is the MIXED classification for `game_runs` complete, especially lifecycle/finalization/cache fields?
3. Is `active_override_id` correctly restricted to provenance context?
4. Is `s3b_player_facts` key-level disposition correct, especially the narrow authority of `gitte_flashlight_found`?
5. Does ACT1→canonical Knowledge normalization create any provenance or behavior-evidence conflict?
6. Is the seven-kind gate taxonomy sufficient without becoming another state machine?
7. Is any ACT1–14 gate misclassified relative to current canonical behavior/runtime?
8. Is `act12.role_engage` correctly the group barrier while station-task completion remains local prerequisite/substate?
9. Are the current one-click shared transitions correctly represented as ANY_PARTICIPANT_GROUP_ACTION rather than fabricated 3/3 gates?
10. Does the Core Resolver remain a read projection rather than a new authority?
11. Are any support-only fields/tables still capable of silently re-entering current-state authority through existing fallback logic?
12. Should the architecture-freeze gate be explicitly added before W05 in the safest implementation sequence?

No CD release should occur until this review is reconciled.

**NEXT_OWNER:** CA  
**NEXT_ACTION:** independently challenge Active Dependency Audit V1.1 and Canonical Authority Registry V0.2; return material disagreement/missing risk only.
