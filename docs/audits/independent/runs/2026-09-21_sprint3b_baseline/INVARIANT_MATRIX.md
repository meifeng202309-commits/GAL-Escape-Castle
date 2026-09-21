# Invariant Protection Matrix

Audit run: 2026-09-21_sprint3b_baseline  
Frozen product baseline: `3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe`

Legend:
- **PROTECTED** — demonstrable server-side enforcement exists for the implemented scope.
- **PARTIAL / NOT VERIFIED** — some protection exists, but the complete invariant cannot be verified in this baseline.
- **VIOLATED** — a confirmed finding demonstrates a reachable violation.

| # | Mandatory invariant | DB constraint / trigger | RPC protection | Transaction / lock | RLS / direct access | Client | Test evidence | Result / linked finding |
|---:|---|---|---|---|---|---|---|---|
| 1 | First Choice LOCK | legacy/formal decision uniqueness; per-player progress PK; runtime decision unique identity | submit RPCs write only when choice field is NULL; duplicate vote/choice rejects | Sprint3B progress trigger serializes per-run gates | direct table writes blocked | submitted choices replaced by locked state | Sprint1 C3; Sprint2 A8; Sprint3B replay checks | **PROTECTED** |
| 2 | Missing player input is never synthesized | no DB default creates player decision rows | timeout moves vote to WAITING_FOR_MISSING_PLAYER; system fallback uses outcome/resolution metadata, not fake vote; Sprint3B all-player gates wait | discussion session row locks | direct decision writes blocked | UI shows waiting state | Sprint2 D2/D3; fallback E1/E3/E4 | **PROTECTED for implemented baseline**; Teacher Override not yet implemented |
| 3 | Room != Run | `game_runs.run_id` UUID identity; formal evidence FK to run; run identity trigger | active run resolved server-side from room; client never supplies arbitrary run_id | room lock prevents concurrent active-run start | direct formal tables RLS-protected | client stores room/session but reads server run_id | Sprint2 A1/A5; Sprint3A A8; Sprint3B B21 | **PROTECTED** |
| 4 | NORMAL != AUDIT | `s2_protect_run_identity` blocks run_mode / dataset eligibility changes | start validates mode; audit helpers reject NORMAL | run identity protected after creation | same schema, direct writes blocked | Teacher shows frozen run mode | Sprint2 D1 plus normal-run assertions; Sprint3A audit fixture tests | **PROTECTED** |
| 5 | System/Teacher resolution != player behavior | player vote rows separate from discussion outcome/runtime events | system fallback uses `resolution_id/resolution_source=system_fallback`; no synthetic player choice row | resolution occurs while discussion row locked | direct inserts blocked | resolved UI can display outcome separately | Sprint2 E1/E3/E4; Sprint3B B16 | **PROTECTED for system fallback**; Teacher Override is outside frozen baseline |
| 6 | Real pre-resolution evidence is preserved | append-only message/vote rows; new discussion_session/vote_round on re-vote; separate run evidence | fold-back preserves `final_meeting_result`; resolution does not rewrite prior votes/messages | row locks serialize outcome creation | direct destructive access blocked | history/reconnect renders prior state | Sprint2 C1/C2/E2; Sprint3B B11/B12 | **PROTECTED** |
| 7 | Physical item ownership != knowledge | separate `s3_player_items`, observations, knowledge, shared-photo tables; provenance validation | knowledge writer validates source semantics; share does not mutate knowledge/ownership | item view row locked for FLIP | direct state tables protected | Pocket categories separate | Sprint3A A3/A4/A5/A7 | **PROTECTED** |
| 8 | SHARE PHOTO != ownership transfer | `s3_shared_photos` is separate copy ledger; no ownership FK rewrite | share requires physical owner/current view and inserts only shared-photo row | conflict key prevents duplicate copy row for same source view/recipient | direct writes protected | receiver sees SHARED PHOTOS not MY ITEMS | Sprint3A A4/A6 | **PROTECTED for ownership semantics**; scene permission defect is IDA-008 |
| 9 | One logical transition resolves once | unique decision identities; group-item conflict keys; per-run player progress PK | scene/result guards reject reapply; correct puzzle solve rejects later solve | game_run / runtime-scene / run-state locks serialize group resolutions | direct writes blocked | buttons disable while request active, but server remains authority | Sprint3B B6r/B6ur/B6b/B6c/B13b/B20 | **PROTECTED for implemented state transitions**; response-loss duplicate non-transition submissions tracked by IDA-010/011 |
| 10 | Old-phase mutations are rejected | phase guard triggers on Sprint3B tables | Sprint3B wrappers inspect current scene/phase; however generic DiscussionRoom and SHARE PHOTO lack canonical scene binding; Discussion player RPCs bind to latest session rather than expected session | locks prevent simultaneous state races but do not identify stale client intent | direct table writes blocked | UI normally follows current state but stale/fail-open paths exist | replay tests cover many Sprint3B calls but not stale-round retarget | **VIOLATED** — IDA-003, IDA-005, IDA-008, IDA-009 |
| 11 | Formal reset/restart preserves prior run evidence | formal evidence keyed by run_id; legacy reset deletes only `s1_player_decisions` | `s1_reset_room` does not touch formal tables | — | formal tables protected | Teacher reset explicitly labels Sprint1 reset | Sprint1 C8 proves legacy reset only in legacy scope; no completed formal restart test | **PARTIAL / NOT VERIFIED** — current baseline has no complete formal finalization/restart path |
| 12 | Private unrevealed behavior is not exposed to Teacher in NORMAL mode | no direct Teacher table access through browser; RLS | Sprint1 Teacher getter hides choice labels pre-reveal; Sprint2 Teacher getter hides vote choice until resolved; Sprint3A Teacher getter returns counts, not private clue content | — | direct formal tables blocked | Teacher UI only renders fields returned by protected getters | Sprint1 C1; Sprint2 A7; Sprint3A A7 | **PROTECTED** |

# Detailed notes

## Invariant 1 — First Choice LOCK

Protection is layered:
- server canonical option validation;
- update/insert only if no prior decision;
- database uniqueness for formal vote identity;
- per-run serialization for Sprint3B progress.

Client button disabling is convenience only; correctness remains server-side.

IDA-006 does **not** mean ACT1 choice lock fails. It means the response-latency evidence required alongside that locked choice cannot be reconstructed.

## Invariant 2 — Missing input never synthesized

Discussion timeout does not auto-create absent votes. It transitions to `waiting_for_missing_player`.

System fallbacks are represented in session outcome metadata and runtime events, not inserted as a player's decision.

Sprint3B private gates require actual player rows/flags before automatic group progression.

Sprint3C Teacher Override semantics are canonicalized but not implemented in the frozen Sprint3B baseline, so Teacher-override-specific synthesis protection is not claimed as runtime-verified here.

## Invariant 3 — Room != Run

The current model correctly treats room as a stable multiplayer container and run as formal-session identity.

All Sprint2/3/3B evidence is keyed by `run_id`, while player identity remains room-assigned.

No inspected player RPC accepts an arbitrary run UUID from the browser.

## Invariant 4 — NORMAL != AUDIT

`run_mode` and `behavior_dataset_eligible` are immutable after run start through the run-identity trigger.

AUDIT helper RPCs inspect the active run mode and reject NORMAL.

The audit does not treat use of the same schema/runtime code for both modes as a violation; that is canonical.

## Invariant 5 — System/Teacher resolution != player behavior

System fallback is first-class:
- `resolution_source = system_fallback`;
- fallback outcome need not have `choice_id`;
- no player decision row is fabricated.

Teacher Override runtime is not in baseline. Its canonical contract therefore remains a future implementation requirement rather than a baseline PASS claim.

## Invariant 6 — Real pre-resolution evidence preserved

Re-vote creates a new discussion session / vote round rather than overwriting the old one.

Fold-back preserves the original resolved meeting result while moving operational route targets to Library.

Legacy `s1_reset_room` cannot erase formal run tables.

IDA-001 can leave Game Track progression incomplete after a valid resolved vote, but it does not erase the real vote evidence.

## Invariant 7 — Physical ownership != knowledge

The data model keeps:
- physical items;
- observations;
- knowledge acquisition;
- shared-photo copies;
- group items

as separate semantics.

Knowledge provenance validation prevents a knowledge row from merely standing in for physical ownership.

## Invariant 8 — SHARE PHOTO != ownership transfer

Sharing creates a copy record with provenance; the original `s3_player_items` owner remains unchanged.

IDA-008 is orthogonal: the ownership semantics are correct, but **when** sharing is allowed is not server-enforced.

## Invariant 9 — One logical transition resolves once

For state transitions/resolutions, exactly-once is protected by row locks plus state changes.

Examples:
- third route ACK advances once;
- meeting apply commits once;
- fold-back commits once;
- correct Library solve resolves once;
- ACT5 apply commits once;
- post-inspection terminal commit succeeds once.

IDA-010/011 show that **non-transition submissions** still lack request-idempotency identities under response loss.

## Invariant 10 — Old-phase mutations rejected

This is the principal invariant currently violated across layers.

Confirmed paths:
- IDA-005 — generic Teacher discussion can be opened outside canonical discussion phase;
- IDA-008 — SHARE PHOTO can run outside canonical sharing phase;
- IDA-009 — stale DiscussionRoom message/vote request can be applied to the newest session/round;
- IDA-003 — formal layer failure can expose callable legacy interaction.

Sprint3B's own guarded transition RPCs are substantially stronger, but the project invariant applies to the whole executable surface.

## Invariant 11 — Formal reset/restart preserves prior run evidence

Positive evidence:
- legacy reset is scoped to legacy tables;
- formal evidence is run-keyed and not deleted by that reset.

Boundary:
- Sprint8 finalization/export is not implemented;
- there is no complete current formal “finish run → start next formal run in same room” lifecycle to exercise.

Result remains **PARTIAL / NOT VERIFIED**, not a defect claim.

## Invariant 12 — Private unrevealed behavior not exposed to Teacher in NORMAL

Verified server behavior:
- Sprint1 pre-reveal Teacher state returns submission metadata but omits choice fields;
- Sprint2 unresolved votes return submitted/locked metadata without choice ID/label;
- Sprint3A Teacher state returns counts only and omits private observation/knowledge content.

Discussion text messages are not private unrevealed decisions: they are intentionally group-visible communication and may be visible to Teacher.

# Method 3 conclusion

All 12 mandatory invariants have been evaluated.

- 9 are demonstrably server-protected for the implemented baseline.
- 1 is protected for implemented state transitions but has adjacent request-idempotency findings (Invariant 9).
- 1 is **VIOLATED** across reachable cross-layer paths (Invariant 10).
- 1 is **PARTIAL / NOT VERIFIED** because formal restart/finalization is not implemented (Invariant 11).

No new issue ID is created solely by Method 3; existing findings already capture the reachable violations.
