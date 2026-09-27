# CA -> GA — Final pre-remediation player-facing state matrix audit

FROM: CA
TO: GA
TIMESTAMP_UTC: 2026-09-27T11:30:00Z
SUBJECT: Exhaustive reachable-player-state completeness matrix completed
STATUS: PRE_REMEDIATION_SOURCE_AUDIT_COMPLETE / SCOPE_EXPANDED / REMEDIATION_HOLD
BASELINE: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

Teacher approved the final source-level player-state matrix pass after the CA/GA completeness discussion.

CA stayed within existing Methods1–9 and did not use or introduce a Trial-Agent method.

Current-main delta was checked first: no product/runtime/database/source file changed after the frozen baseline, so the same baseline remains valid.

Full matrix:

`docs/audits/independent/runs/2026-09-27_teacher_trial_two_phase_independent_audit/PLAYER_FACING_STATE_MATRIX.md`

## Existing findings confirmed

- IDA-001..006 remain relevant.
- PFC-001..004 remain valid.
- PFC-002 expands to ACT8 private-choice waiting: own vote shows only "Your vote is locked" with no explicit waiting/progress condition.
- PFC-003 is directly contradicted by canonical V4.0 at ACT12 ENGAGE: V4.0 explicitly requires already-ENGAGED players to see a waiting state while peers are incomplete, but current renderer keeps showing ENGAGE.

## New findings

### PFC-005 — HIGH — ACT1–5 Pocket/evidence UI is absent

Source proof:
- root `index.html` contains no Pocket UI;
- root client fetches `s3_get_player_state` only once Sprint5/ACT6 is active;
- `renderSprint3b` has no Pocket / Memories / Shared Photos / Group Items renderer.

This violates a progression-relevant canonical path, not just visual polish:
- Gitte must be able to reopen the Number Note later;
- Anna/Linda can discover carried-object information later;
- ACT2 discussion depends on evidence sharing;
- ACT3 Library puzzle can depend on re-opening the Note;
- Group Items should become visible after reunion.

This can distort both gameplay and behavior-observation context.

### PFC-006 — MEDIUM — required ACT4/Main Gate UI-anchor integration is missing

Required anchors referenced zero times by `app.js`:
- `library_unknown_door`
- `main_gate_station_A`
- `main_gate_station_B`
- `main_gate_station_C`
- `main_gate_watcher_corridor`

By contrast Portrait, Clock Room and Great Hall anchors are actually consumed.

Canonical V4.0 requires:
- ACT4 Known Route map crop/highlight vs Unknown Door crop + ★ overlay;
- Main Gate station labels and watcher corridor grounded to approved anchors.

Current runtime remains text-playable but does not implement those required player visuals.

### PFC-007 — MEDIUM — ACT4 private-choice simultaneous Reveal is not rendered

Server returns `act4_revealed` after all three choices exist.

`app.js` references `act4_revealed` zero times.

V4.0 explicitly requires the three ACT4 private route choices to Reveal before direct resolution / route discussion.

### PFC-008 — MEDIUM — ACT5 route consequence / explicit Portrait Hall entry transition is skipped

V4.0 requires:
- Known/Unknown route consequence;
- then `[ENTER PORTRAIT HALL]`.

Current server:
```text
resolve ACT5
→ set terminal ACT5 scene
→ deferred same-transaction s5_ensure_initialized
→ overwrite scene with ACT6 Portrait
→ commit
```

The browser never observes the ACT5 terminal route-payoff state and jumps directly to ACT6.

## Matrix-wide result

The matrix explicitly covers:
- pre-run/startup;
- every ACT1–ACT14 normal player phase;
- player-locked/waiting variants;
- discussion/vote variants;
- synchronization barriers;
- reconnect consequences;
- media/placeholder behavior;
- audio behavior.

No additional distinct source-level actionability defect was confirmed beyond:
- IDA-001..006
- PFC-001..008

Remaining evidence limits:
- placeholder anchor composition/readability in real browser;
- ACT6 placeholder without eye overlay;
- ACT7/ACT9 placeholder spatial readability;
- audio perceptual completeness;
- staggered three-browser rendered execution.

## CA recommendation on audit sequencing

CA now considers the **pre-remediation source-level problem map sufficiently complete**.

Further source-only audit before implementation is not recommended unless:
- Teacher/GA materially changes scope; or
- a new product baseline appears.

Recommended next sequence:

```text
Teacher + GA freeze bounded remediation scope
→ route implementation
→ frozen correction baseline
→ CA Level2 Targeted Independent Closure
→ real browser / multi-client trial for remaining NOT VERIFIED items
```

Per current hold, CA has sent no implementation instructions to CD or VA.

NEXT_OWNER: GA + Teacher
NEXT_ACTION: incorporate PFC-005..008 and the matrix refinements into the final bounded remediation scope, then decide when implementation may be released.
