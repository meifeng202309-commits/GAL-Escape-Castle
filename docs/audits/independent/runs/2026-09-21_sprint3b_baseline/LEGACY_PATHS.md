# Dead / Legacy / Reachability Audit

Audit run: `2026-09-21_sprint3b_baseline`  
Frozen product baseline: `3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe`

Classification:
- **ACTIVE** — part of current intended runtime.
- **INTERNAL** — reachable only through protected server composition/triggers.
- **TEST-ONLY** — intended audit/test instrumentation.
- **LEGACY-BUT-REQUIRED** — preserved compatibility baseline still intentionally available.
- **DEAD** — retained but no intended runtime path.
- **DANGEROUSLY-REACHABLE** — old/generic path can still affect current formal runtime in an unsafe or ambiguous way.
- **UNKNOWN** — reachability/authority cannot yet be determined.

# H1/H2 — Classified objects

| Object / path | Classification | Current role | Risk / linked finding |
|---|---|---|---|
| Sprint1 tables + RPC core | LEGACY-BUT-REQUIRED | verified prototype/recovery compatibility boundary | safe as isolated legacy baseline |
| `src/content/scenes.js` two-scene prototype content | LEGACY-BUT-REQUIRED | renders Sprint1 prototype state | becomes misleading formal interaction if exposed; IDA-003 |
| player legacy `choiceArea/revealArea` | DANGEROUSLY-REACHABLE | rendered from Sprint1 before Sprint3B renderer hides it | formal getter failure exposes callable legacy choice; IDA-003 |
| Teacher legacy Advance Scene | LEGACY-BUT-REQUIRED / operationally visible | mutates only Sprint1 room state | can confuse formal operation; material danger is through IDA-003 fail-open path |
| Teacher legacy Reset Room | LEGACY-BUT-REQUIRED / operationally visible | documented Sprint1-only reset | does not delete formal run evidence; should remain clearly segregated |
| Teacher Release Session | ACTIVE | prototype/formal recovery of browser token | required recovery; preserves player_id/formal evidence |
| Sprint2 generic DiscussionRoom component | ACTIVE reusable component | canonical engine reused by multiple acts | component itself required |
| Teacher generic “Open discussion” UI/RPC | DANGEROUSLY-REACHABLE | Sprint2 test/generic control remains available during formal Sprint3B | can create discussion in private phase; IDA-005; can enable IDA-002 |
| Teacher generic “Open vote now” UI/RPC | DANGEROUSLY-REACHABLE / canonical actor ambiguous | can force latest discussion into voting | no separate issue opened: early-vote actor not canonicalized precisely; should be gated/reviewed when Teacher workflow is consolidated |
| Teacher Add Time | ACTIVE | explicitly allowed missing-player recovery | canonical V4 allows Teacher Add 30 sec |
| `game_runs.scene_id/phase_key/step_key` generic fields | ACTIVE legacy-generic truth, NOT formal Sprint3B authority | Sprint2 generic discussion identity | using these as formal scene truth would be dangerous; formal authority is `s3_runtime_scene_state` |
| `game_runs.silent_texting_mode` | ACTIVE | run-level current silent flag | distinct from per-session historical value |
| `discussion_sessions.silent_texting_mode` | ACTIVE | discussion config/history | required historical session truth |
| `*_pre011` twelve historical implementations | INTERNAL | delegated implementation bodies behind migration-011 wrappers | safe only because migration012 revokes browser EXECUTE |
| migration-011/012 guarded Sprint3B wrappers | ACTIVE | formal browser RPC surface | current intended authority layer |
| `s3b_set_scene` / refresh / phase-guard helpers | INTERNAL | server authority and triggers | browser execution revoked |
| `s3_initialize_audit_fixture` | TEST-ONLY | Sprint3A AUDIT fixture | Teacher+AUIDT gated |
| `s3_audit_provenance_probe` | TEST-ONLY | negative provenance tests | Teacher+AUDIT gated |
| `s3b_audit_expire_puzzle` | TEST-ONLY | older coarse puzzle timeout helper used by live B8 | still used; not dead |
| `s3b_audit_set_puzzle_elapsed` | TEST-ONLY | fine-grained timeout staging | Teacher+AUDIT gated |
| schema allowance `s3b_run_state.group_route='inspect_first'` | DEAD/obsolete state allowance | older implementation could store Inspect First as group route; final migration010 uses pending flag + group_route NULL | not currently reachable through public final flow; cleanup candidate, not a current defect |
| old Sprint3B pre-migration010 terminal Inspect First semantics | DEAD | superseded by migration010 intermediate state | renamed/final delegated body is migration010 version, not old migration007 body |
| original migration007 item label keys | DEAD as final truth | corrected by migration010 catalog update/trigger | final labels canonicalized |
| ACT6+ runtime | NOT IMPLEMENTED, not legacy | outside Sprint3B frozen scope | major project NOT VERIFIED boundary, not a dead path |
| ACT15/16 active-game pages | DEAD BY SPEC / FUTURE ANALYSIS ONLY | explicitly removed from V4 active game | must not be reintroduced to runtime |
| old prediction / “Can AI Predict You?” flow | DEAD BY SPEC / FUTURE MODULE ONLY | future privacy module | must not enter Castle Escape active game |

# H3 — Stale client request interaction with legacy paths

## Player formal/legacy layering

The client performs:
1. Sprint1 state read/render;
2. DiscussionRoom read/render;
3. Sprint3B read/render.

When Sprint3B succeeds, it hides legacy choice/reveal controls.

When Sprint3B fails after Sprint1 succeeds, there is no formal-run latch that forces the whole player UI closed. The legacy path remains usable.

This is the principal dangerously reachable legacy path: IDA-003.

## Generic DiscussionRoom vs formal canonical flow

Sprint3B canonical ACT2/ACT5 discussions are created from formal transition code.

The generic Teacher “Open discussion” path:
- is still independently active;
- uses generic run scene/phase fields;
- can coexist semantically with the formal scene model.

This is not dead code. It is an active reusable component with an unsafe generic creation/control surface: IDA-005 and IDA-002.

## Historical `*_pre011` functions

These are intentionally retained implementation bodies.

They are not dead because final wrappers delegate to them.

They are **INTERNAL**:
- direct browser execution is explicitly revoked by migration012;
- final wrappers provide authentication/state/replay checks.

A future cleanup must not simply delete them without inlining/replacing wrapper delegation.

# H4 — Removal / isolation recommendations

## Keep

Keep as required compatibility/internal infrastructure:
- Sprint1 backend baseline;
- session release recovery;
- reusable DiscussionRoom engine;
- final guarded Sprint3B wrappers;
- internal `*_pre011` bodies until safely refactored;
- audit helpers used by regression tests.

## Isolate from production formal UI

Strong candidates for explicit mode/scene isolation:
- Sprint1 player interaction UI once a formal run is active;
- Teacher generic Open Discussion during canonical flow;
- Teacher legacy Advance/Reset controls while formal runtime is active;
- generic Open Vote unless/ until canonical actor/timing authority is explicit.

Isolation should be server-authoritative where the action can mutate formal state; hiding buttons alone is not sufficient.

## Cleanup candidates

Low-risk cleanup candidates after regression coverage:
- obsolete `group_route='inspect_first'` schema allowance;
- old prototype content bundling from formal player UI build, if Sprint1 test entry can be preserved separately;
- explicit labeling/grouping of legacy controls in Teacher Console.

## Do not remove merely because names are old

Do not remove:
- `*_pre011` delegated implementations;
- Sprint1 recovery RPCs;
- audit helpers referenced by live suites.

# Method 7 conclusion

The dominant legacy risk is **not dead code execution**. It is **still-live generic/legacy surfaces sharing the same production UI/API with the formal runtime**.

Confirmed dangerous reachability already has findings:
- IDA-003 — formal player UI → legacy Sprint1 controls on formal-layer failure.
- IDA-005 — generic Teacher DiscussionRoom control during canonical private phase.
- IDA-002 — generic/canonical discussion creation paths can conflict.

No new confirmed issue ID is created solely by Method 7.

One authority ambiguity is retained without new finding:
- Teacher “Open vote now” remains a generic reachable control; the exact canonical actor for voluntary early voting is not defined clearly enough for CA to declare it forbidden.
