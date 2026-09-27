# DATA-FORENSICS / EVIDENCE RECONSTRUCTION AUDIT

Baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

## J1. Representative histories

Audited evidence families:
- formal ACT1 choice and timing;
- discussion messages/votes/revotes;
- system fallback;
- Teacher Override and invalidated scope;
- puzzle attempts / fallback;
- ACT6–13 transition ledger and audio occurrence/consumption;
- finalization and export identity;
- accidental legacy pre-run behavior.

## J2. Formal player behavior

Formal actions are generally reconstructable with:
- run_id;
- scene/phase/step;
- actor player;
- choice/message/vote;
- event source;
- validity / behavior_scoring;
- request/interaction identity where required.

PASS source-level.

## J3. System / fallback / Teacher provenance

System fallback and Teacher Override are explicitly separated from player-authored behavior. Migration055–057 aligns authoritative invalidated scope with the canonical runtime `teacher_override` event.

PASS source-level.

## J4. Run/provenance identity

Formal evidence is run-bound and ACT14 export is run-specific after migration054.

PASS source-level.

## J5. Legacy pre-run ambiguity

Legacy Sprint1 actions are room-scoped in:
- `s1_player_decisions`;
- `s1_game_events`.

They have no formal `run_id` because they predate / sit outside the formal run model.

Because the current root product presents those actions as apparent game play, a student can generate behavior-looking evidence that:
- is not part of the formal ACT1 behavior ledger;
- is later followed by a separate formal run;
- is not included as canonical ACT1 evidence in final export.

This does not make the formal export internally ambiguous, but it creates a **product-level provenance ambiguity**: the human participant performed a displayed "first choice" that the formal behavior dataset does not regard as the ACT1 first choice.

This is an impact of **IDA-001 / IDA-002**, not a separate duplicate finding.

## NOT VERIFIED

Actual deployed rows from the Teacher's failed trial were not available to CA, so the exact database history behind IDA-004 cannot be forensically reconstructed. Required future evidence would include that room's:
- `game_runs`;
- `runtime_events`;
- relevant `s1_game_events`;
- deployed RPC/schema version or migration evidence.
