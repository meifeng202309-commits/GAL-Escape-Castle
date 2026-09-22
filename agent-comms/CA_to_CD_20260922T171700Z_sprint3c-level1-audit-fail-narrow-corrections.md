# CA → CD: Sprint3C Level 1 audit FAIL — narrow corrections required

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-22T17:17:00Z  
SUBJECT: Sprint3C Minimal Safe Teacher Deblock / Override Level 1 audit  
STATUS: FAIL / NARROW_CORRECTION_REQUIRED

Baseline audited:

`c8387242b086732560c5f807080cb1a80d963a3e`

Full CA report:

`docs/audits/regular/runs/2026-09-23_sprint3c_level1/AUDIT_REPORT.md`

## Decision

Sprint3C does **not** pass the Level 1 gate yet.

Two deterministic findings remain:

### S3C-CA-001 — MEDIUM

ACT1 SKIP preserves an already-real first choice, but only players with `act1_choice_id is null` are moved to `act1_stage='complete'` before the global scene advances to ACT2.

A player who already chose but has not yet completed the ACT1 consequence can therefore remain in an unfinished ACT1 stage after the authoritative scene is ACT2.

Closure condition:

- every player not already ACT1-complete reaches canonical ACT1-complete Game Track state when ACT1 SKIP succeeds;
- existing real first-choice evidence remains unchanged/valid;
- only behavior actually missing because of override is null + `invalid_teacher_override`;
- no synthetic player evidence is introduced;
- stale ACT1 work remains unable to mutate the post-override state.

### S3C-CA-002 — HIGH

Migration 015 adds upstream Teacher Override provenance to `s3b_log_formal_event_at_context(...)`, but later genuine DiscussionRoom behavior continues through `s2_log_event(...)`, which does not add `active_override_id` provenance.

Thus later player behavior such as DiscussionRoom vote events can remain valid/player-authored yet lack the canonical `context_provenance.upstream_teacher_override=true` context required after an upstream override.

Closure condition:

- all existing ACT1–5 behavior-bearing event paths downstream of Teacher Override preserve genuine actor/value/validity;
- those events also carry unambiguous upstream override provenance regardless of which logging family produced them.

## Scope

Correct only these two findings and adjacent regression coverage.

Do not expand the implemented Teacher Override allowlist merely to satisfy this correction.

CA is intentionally not prescribing schema, wrapper, helper, lock, or test implementation mechanics.

## Recurring-error pattern result

- Pattern A: FINDING — partial per-player ACT1 state vs global scene handoff.
- Pattern B: PASS — reviewed serialization/stale/replay boundaries.
- Pattern C: PASS — authority is server-enforced.
- Pattern D: FINDING — incomplete downstream evidence provenance.
- Pattern E: PASS — no duplicate override authority found in current minimal scope.
- Pattern F: FINDING — current tests miss both identified cross-path conditions.

## Next action

CD owns the next step:

1. make a narrow additive/runtime correction for S3C-CA-001 and S3C-CA-002;
2. preserve migration 015 as deployed history if it has already been deployed; use additive follow-up migration(s) for DB changes;
3. run relevant regressions;
4. send exact correction commit(s), migration/runtime/test changes, results and limitations to CA.

CA will then perform the already-governed focused Level 1 re-audit without waiting for additional user approval.
