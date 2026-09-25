# Level3 Cross-Layer Traces

## Trace A — Canonical ACT3 Teacher Override → ACT14 finalization

```text
V4.0 allows ACT3 Library Box RESOLVE_AND_CONTINUE
→ teacher_apply_override resolves puzzle without player attempt
→ puzzle_resolved_at exists
→ correct library attempt count remains 0 by design
→ later ACT14 calls s8_verify_integrity
→ act3.puzzle_resolution requires puzzle_resolved_at + correct player attempt
→ no player-behavior override-validity row exists because puzzle is Game Track
→ missing_technical_evidence
→ finalization rejected
```

Result: **FINDING IDA2-002**.

## Trace B — ACT14 finalization → Teacher export UI

```text
player finalization succeeds
→ game_runs.status = completed
→ export_ready = true
→ Teacher polling calls s7_get_teacher_console
→ no status=active run → state.active=false
→ Teacher polling also calls s8_get_finalization_state → completed run is export_ready
→ renderOperationsState sees state.active=false and returns
→ exportSessionButton enable logic is never reached
→ button remains disabled
```

Result: **FINDING IDA2-003**.

## Trace C — sequential runs → export target

```text
Room R / Run A completed
→ latest completed = A
→ export R selects A

Run B created in same room
→ while B active, latest completed still A

Run B completed
→ latest completed = B
→ export R selects B
→ public export interface has no expected_run_id / run selector
→ A cannot be selected through supported workflow
```

Result: **FINDING IDA2-005**.

## Trace D — ACT2 historical vote evidence → semantic integrity

```text
ACT2 DiscussionRoom resolves
→ 3 player decision rows persist
→ discussion outcome persists
→ authoritative s3b_run_state.final_meeting_result drives Game Track

migration050 integrity wrapper
→ reconstructs meeting evidence from discussion + 3 decisions
→ replaces act2.meeting_resolution obligation
→ does not require final_meeting_result
→ recomputes verified from obligation states

technical loss of final_meeting_result
→ historical rows still satisfy replacement obligation
→ report can remain verified
```

Result: **FINDING IDA2-004**.

## Trace E — current canonical Teacher allowlist → runtime authority

Canonical V4.0 provides ten supported ACT1–5 combinations.

Effective server implementation exposes only three.

The mismatch exists in server authority itself; it is not merely hidden UI.

Result: **FINDING IDA2-001**.
