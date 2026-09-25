# ACT1–14 Post-Sprint8 Level3 Findings

Decision: **FAIL / BLOCKED — SIX FINDINGS**

## IDA2-001 — HIGH — Canonical ACT1–5 Teacher Override allowlist is only partially implemented

### Canonical authority

V4.0 §5.5 is explicitly labeled:

`ACT 1–5 Teacher Override Safe-Resolution Allowlist — Sprint 3C HARD RULE`

It defines ten supported scene/phase/action combinations across ACT1–5.

The full canonical map was committed on 2026-09-19 in:

`529f042e96d93593034d8d7f61a19a6c4ffce4e5 — Define Sprint 3C ACT1-5 safe override map`

The implementation migration arrived later, on 2026-09-22:

`c8387242b086732560c5f807080cb1a80d963a3e — Implement Sprint 3C minimal teacher override`

### Effective runtime

The effective `teacher_apply_override` recognizes only:

1. `act1_wake_up / private_first_action / SKIP_CURRENT_INTERACTION`;
2. `act2_route_update / route_update / SKIP_CURRENT_INTERACTION`;
3. `act3_library / library_box / RESOLVE_AND_CONTINUE`.

The Teacher state exposes only the same three combinations.

No migration043–053 redefines `teacher_apply_override`.

Therefore seven canonical supported combinations remain unavailable, including:
- ACT2 private-first-meeting skip;
- ACT2 meeting-discussion safe resolution;
- ACT2 route-consequence fold-back;
- ACT3 wayfinding skip;
- ACT4 private-route-choice skip;
- ACT5 route-discussion safe resolution;
- ACT5 post-inspection route safe resolution.

### Impact

A Teacher can reach a canonical deblock point and receive “unsupported” even though the current game script explicitly authorizes that action.

This is not a UI-only omission: the server allowlist itself is incomplete.

### Closure condition

The effective server-owned Teacher Override capability and Teacher-facing allowed-action projection must conform to the current V4.0 ACT1–5 hard allowlist, while preserving the existing no-impersonation / no-fabricated-player-evidence invariants.

---

## IDA2-002 — HIGH — Canonical ACT3 Library Box override cannot pass ACT14 session integrity

### Canonical behavior

V4.0 explicitly allows:

`act3_library / library_box / RESOLVE_AND_CONTINUE`

with safe resolution `41739`.

The canonical rule also explicitly requires:
- resolve the Game Track puzzle;
- **do not create a player attempt**;
- do not fabricate submitted_by or response time.

The current override implementation follows that rule:
- sets `puzzle_resolved_at`;
- creates group items;
- advances to ACT4;
- creates no `s3b_library_attempts` player attempt.

### Finalization verifier conflict

The effective Sprint8 verifier still defines `act3.puzzle_resolution` as present only when:

- `puzzle_resolved_at is not null`; **and**
- at least one `s3b_library_attempts.correct` row exists.

Its override fallback asks for semantic field `act3_puzzle_resolution` in `teacher_override_validity`.

But the ACT3 Library Box is a Game Track puzzle, so the canonical override correctly has no invalidated player behavior field and the current implementation inserts no such validity row.

### Deterministic legal failure

A run can therefore:

```text
legally reach Library Box
→ Teacher uses canonical RESOLVE_AND_CONTINUE
→ puzzle resolves with zero fabricated player attempts
→ run proceeds legitimately to ACT14
→ s8_verify_integrity reports act3.puzzle_resolution missing_technical_evidence
→ finalization is rejected
```

The deblock path and finalization path disagree about the same canonical run.

### Test blind spot

Sprint3C live E2E correctly proves that the Library override creates zero player attempts, but it stops before ACT14.

Sprint8 override E2E exercises an ACT1 override, not the ACT3 Game Track override.

Each local test is correct; their composition is not tested.

### Closure condition

A canonically resolved ACT3 Game Track override must remain distinguishable from a real player attempt and must be accepted by ACT14 semantic integrity without fabricating player evidence.

---

## IDA2-003 — HIGH — Teacher Console cannot enable Export after successful finalization

### Server state

Successful finalization sets:

`game_runs.status = 'completed'`

and:

`export_ready = true`.

`s8_get_finalization_state` can fall back to a completed run and correctly report export readiness.

### Teacher Console cross-layer trace

`loadOperationsState()` does:

1. call `s7_get_teacher_console`;
2. call `s8_get_finalization_state`;
3. attach the export state;
4. call `renderOperationsState(state)`.

But `s7_get_teacher_console` selects only `status='active'`.

After finalization there is no active run, so it returns:

`active=false`.

Then `renderOperationsState` immediately executes:

`if(!state.active) ... return;`

The line that enables/disables the export button occurs **after** that return:

`exportSessionButton.disabled=!(exp.export_ready||exp.enabled)`.

The HTML button starts disabled.

### Result

The direct export RPC is ready, but the supported Teacher UI can remain disabled exactly when the canonical workflow says:

`game_completed=true + export_ready=true → Teacher Console enables EXPORT SESSION DATA`.

The same early-return logic also prevents the completed-run export state from being rendered.

### Test blind spot

Current Sprint8 live tests call `s8_export_session` directly.

Sprint7 static tests prove the button exists, not that it becomes actionable after a run transitions from active to completed.

### Closure condition

The real Teacher Console must expose and enable the authorized completed-run export workflow after ACT14 finalization, without weakening server-side export authorization.

---

## IDA2-004 — HIGH — Session integrity can certify loss/mismatch of authoritative group outcomes

### ACT2 concrete defect

Migration049 originally required:

`s3b_run_state.final_meeting_result is not null`

as part of ACT2 integrity.

Migration050 replaces the entire `act2.meeting_resolution` obligation with a historical evidence projection requiring:
- a resolved ACT2 discussion;
- its outcome;
- three attributable decision rows.

It then recalculates whole-report `verified`.

The replacement no longer requires `final_meeting_result`.

Therefore, after a valid run has progressed, a technical loss of the authoritative `final_meeting_result` field can coexist with intact historical DiscussionRoom rows and still produce:

`verified=true`.

That contradicts the canonical requirement that actual-path required fields/events must either exist or carry an explicit absence/validity reason.

### Adjacent coherence gap

The same architectural pattern remains visible later:
- ACT8 final-vote integrity requires three vote rows but does not prove their majority matches the authoritative route result;
- ACT10 final-vote integrity requires three vote rows and an internally coherent branch state, but does not prove the vote choices resolve to that branch outcome.

Thus presence of evidence and coherence of authority are not consistently the same gate.

### Impact

The post-game dataset can contain:
- valid-looking historical player evidence;
- a missing or contradictory authoritative group result;
- `session_integrity_verified=true`.

That undermines the meaning of “semantic” session integrity.

### Closure condition

For each actual-path group decision used as authoritative Game Track state, session integrity must detect missing or contradictory authoritative outcome/evidence relationships rather than validating only the presence of both sides independently.

---

## IDA2-005 — HIGH — Export authority is still room-scoped and loses addressability of older completed runs

### Canonical invariant

`Room != Run`.

V4.0 explicitly allows sequential formal runs in the same room and makes `run_id` the export identifier.

### Effective export target

`s8_export_session(room, teacher_token)` accepts no run identifier.

It always calls:

`s8_latest_completed_run(room)`

which selects exactly one completed run:

`ORDER BY completed_at DESC ... LIMIT 1`.

### Deterministic failure

```text
Run A completes
→ A can be exported
→ Run B starts and completes in same room
→ latest completed run becomes B
→ s8_export_session(room, token) can export B
→ no supported export RPC can select A
```

Run A's raw rows remain in the database, but the canonical Teacher export workflow can no longer address that formal run.

The earlier Sprint8 regression only proves A remains exportable while B is merely active; it does not complete B and then re-export A.

### Impact

Formal run identity is preserved in storage but collapses back to room identity at the export boundary.

This is the same class of Room/Run authority error previously corrected in finalization, now present in export.

### Closure condition

Sequential completed runs in one room must remain independently addressable through the authorized export workflow by formal run identity, without cross-run ambiguity.

---

## IDA2-006 — MEDIUM — Canonical JSON `exported_at` records finalization time, not export time

The canonical header requires:

`exported_at`.

The effective exporter writes:

`'exported_at', f.finalized_at`

where `f.finalized_at` is the durable session-finalization timestamp.

A Teacher may export or re-export later, but the JSON will still label the earlier finalization time as `exported_at`.

### Impact

This does not corrupt gameplay, but it makes canonical post-game forensic metadata semantically false:
- finalization time;
- completion time;
- export-generation time

are no longer distinguishable by their named fields.

Repeated exports cannot be temporally reconstructed correctly from the canonical header.

### Closure condition

The canonical export header must preserve distinct, truthfully named lifecycle timestamps so `exported_at` represents the export event rather than finalization.
