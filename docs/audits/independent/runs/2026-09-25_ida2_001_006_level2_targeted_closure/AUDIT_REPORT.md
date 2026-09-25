# Level2 Targeted Independent Closure — IDA2-001..006

## Audit identity

- **Audit owner:** CA
- **Audit level:** Level2 Targeted Independent Closure
- **Trigger:** `agent-comms/CD_to_CA_20260925T152918Z_level3-ida2-001-006-targeted-closure-request.md`
- **Frozen correction baseline:** `40223199e8c7934216b09d78aa86d4375d101e0f`
- **Parent Level3 baseline:** `2cc4b642bc86c4d8fb1b1631ca0ae394ed886913`
- **Parent findings:** `IDA2-001..006`
- **Decision:** **FAIL / BLOCKED**
- **Sprint9 / Sprint10:** remain blocked

This audit is deliberately targeted. It verifies closure of the six post-Sprint8 Level3 findings, the authority/evidence interfaces changed by remediation, adjacent regressions introduced by those changes, Patterns A–F, and Canonical Ownership Check. It does not reopen unrelated Level3 surface area.

## Disposition summary

| Finding | Disposition | Notes |
|---|---|---|
| IDA2-001 | **OPEN — residuals remain** | Full ACT1–5 override mapping now exists, but two hard canonical semantics remain unsatisfied. |
| IDA2-002 | **FIXED at code-level trace** | ACT3 Library Box override is accepted as Teacher-owned Game Track resolution without synthesizing a player attempt. |
| IDA2-003 | **FIXED at code-level trace** | completed-run export state is handled before the inactive-run return and export can be enabled after completion. |
| IDA2-004 | **FIXED at code-level trace** | ACT2/ACT8/ACT10 authority/evidence coherence checks are now explicit; targeted corruption regressions were added. |
| IDA2-005 | **PARTIALLY FIXED — UI residual remains** | run-bound export authority exists server-side, but the Teacher selector does not stably preserve an older selected run during normal polling. |
| IDA2-006 | **FIXED at code-level trace** | canonical JSON `header.exported_at` is replaced at export generation using `clock_timestamp()`. |

## Residual findings

### IDA2-001-R1 — HIGH — ACT2 Teacher resolution does not populate the canonical route target

V4.0 §5.5 requires the legal:

`act2_first_contact / meeting_discussion / RESOLVE_AND_CONTINUE`

path to set both:

- `final_meeting_result = library`; and
- `current_route_target = library`

before entering `act2_route_update / route_update`.

Migration054 sets `final_meeting_result` and advances the scene, but does not set `s3_runtime_scene_state.current_route_target`.

This is not merely dormant state. The real GAL client renders the route-update location from:

`scene.current_route_target`

and substitutes an empty location when that field is absent. Therefore a legal Teacher resolution can deterministically enter the route-update screen with the canonical destination text missing.

**Closure condition:** after the ACT2 meeting Teacher safe resolution, the authoritative route state and GAL route-update projection must both identify Library exactly as required by V4.0, without creating a player vote or acknowledgement.

---

### IDA2-001-R2 — HIGH — ACT2/ACT5 discussion overrides do not record missing final votes as invalid_teacher_override

V4.0 §5.5 explicitly requires for both:

- ACT2 meeting-discussion safe resolution; and
- ACT5 route-discussion safe resolution

that already-real messages/votes remain valid while any final vote never actually submitted by a player remains absent and is explicitly classified as:

`invalid_teacher_override`.

Migration054 correctly avoids fabricating player vote rows, but both discussion-resolution branches insert the Teacher override with an empty `invalidated_scope` and create no per-player `teacher_override_validity` evidence for missing final votes.

The canonical export serializes `teacher_overrides[].invalidated_scope` and `teacher_overrides[].field_validity`. For these legal Teacher-resolved discussions, the export can therefore show no player vote and no exact invalidation record explaining that absence.

The integrity wrapper also changes ACT2 meeting resolution directly to `present` when the authoritative Teacher outcome matches, so finalization no longer exposes this missing per-player validity through that obligation.

**Closure condition:** real votes/messages must remain real and valid; unsubmitted final votes must remain absent, never be synthesized, and carry explicit Teacher-override invalidation/provenance into the canonical export.

---

### IDA2-005-R1 — MEDIUM — completed-run selector is reset by the Teacher Console polling loop

Migration054 adds a run-bound export RPC and exposes `completed_runs`, which repairs the server-side Room/Run authority defect.

However, the Teacher Console normally enters `watchRoom()`, which executes `loadState()` every 1200 ms. Each `renderOperationsState()` call:

1. replaces `exportRunSelect.innerHTML`;
2. implicitly returns the select control to its first option; and
3. explicitly resets `exportSessionButton.dataset.runId` to `completedRuns[0].run_id`.

The change handler can select an older run, but the next ordinary poll overwrites that selection. Thus the older run is technically addressable at the RPC layer but is not stably addressable through the supported Teacher UI.

This is especially material because `completed_runs` is ordered newest-first, so the reset specifically pushes the workflow back to the latest completed run.

**Closure condition:** after at least two completed runs exist in one room, a Teacher-selected older run must remain the selected export target across ordinary console refresh/poll cycles, and the exported header must identify that selected run.

## Test adequacy / Pattern F

The remediation static test checks for identifying tokens and source ordering but does not execute the new semantic branches.

The existing `tests/sprint3c-live-e2e.js` still exercises the three previously supported combinations:

- ACT1 private-first-action skip;
- ACT2 route-update skip;
- ACT3 Library Box resolve.

It does **not** behaviorally exercise the seven combinations newly introduced by migration054. Therefore the two IDA2-001 residuals above are not contradicted by the reported Sprint3C live pass.

Likewise, the updated Sprint8 live tests verify run-bound export of a prior completed Run A while Run B is active, but do not reproduce the original IDA2-005 terminal case in which Run B also completes and the Teacher then selects/exports older Run A through the real UI.

For the next closure request, evidence must cover the affected canonical behaviors rather than only source-token presence.

## Patterns A–F

- **Pattern A — Cross-module handoff:** FAIL. The ACT2 server override state does not supply the route field consumed by the GAL client.
- **Pattern B — Distributed happy-path / stale / concurrency:** no new blocker found in the bounded remediation. Room advisory locking and duplicate-override rejection are present, but the newly added override branches are not independently live-covered here.
- **Pattern C — UI rule vs server rule:** FAIL. Server-side run selection is repaired, while the polling Teacher UI can overwrite the user's older-run selection.
- **Pattern D — Current state vs historical evidence:** FAIL. Teacher-resolved discussions can preserve current authoritative outcome while omitting explicit validity evidence for player final votes that never occurred.
- **Pattern E — Authority accretion:** PASS within this remediation. The new actions remain server-selected from the canonical ACT1–5 map; no new client authority to choose player identity, route, answer, or destination was found.
- **Pattern F — Self-confirming tests:** FAIL. The new static test is token-oriented and the existing Sprint3C live test does not execute the seven newly added override branches.

## Canonical Ownership Check

**PASS.**

The correction interval does not modify the protected canonical Game Script, Codex development specification, canonical localization catalog, or other protected canonical source to make implementation appear compliant.

Migration054 and Teacher UI/test changes are consumer implementation/remediation changes.

## Evidence classification

Verified directly in repository/static cross-layer trace:

- migration054 effective wrapper logic;
- Teacher Console render/poll/export control flow;
- GAL route-update projection;
- canonical V4.0 hard allowlist;
- Sprint8 integrity/export wrapper composition;
- changed-file boundary and Canonical Ownership Check.

CD reported successful deployed/live regressions, including ACT3-through-ACT14 override finalization and export timestamp checks. This takeover audit did not independently execute the remote Supabase live suite. No live rerun is needed to establish the blocking residuals above because each follows deterministically from the frozen source baseline.

## Gate

```text
IDA2-002 = CLOSED
IDA2-003 = CLOSED
IDA2-004 = CLOSED
IDA2-006 = CLOSED

IDA2-001 = OPEN (R1, R2)
IDA2-005 = OPEN (R1)

Level2 Targeted Closure = FAIL / BLOCKED
Sprint9 = BLOCKED
Sprint10 = BLOCKED
```

## Next owner / permitted scope / closure condition

**NEXT_OWNER = CD**

Permitted scope is bounded to the residual contracts above:

- ACT1–5 Teacher Override canonical state/evidence semantics;
- Teacher completed-run export selection stability;
- directly necessary behavioral regression evidence.

Migrations `001–054` are deployed history and remain immutable. The next additive database migration is `055+`.

CD should submit one new frozen correction baseline. CA then performs a narrow Level2 re-audit of `IDA2-001-R1`, `IDA2-001-R2`, and `IDA2-005-R1`, including the affected non-self-confirming behavioral evidence. No duplicate Teacher approval is required for this procedural continuation.
