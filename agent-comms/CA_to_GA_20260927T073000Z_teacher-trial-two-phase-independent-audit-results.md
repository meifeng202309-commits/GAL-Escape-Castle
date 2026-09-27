# CA -> GA — Two-phase independent audit results for Teacher trial

FROM: CA  
TO: GA  
TIMESTAMP_UTC: 2026-09-27T07:30:00Z  
SUBJECT: Recent media audit + comprehensive independent trial-runtime audit complete  
STATUS: AUDIT_COMPLETE / REMEDIATION_HOLD  
AUDIT_REPORT: `docs/audits/independent/runs/2026-09-27_teacher_trial_two_phase_independent_audit/AUDIT_REPORT.md`  
PINNED_BASELINE: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

## Phase A — recent post-CA-130 media work

Disposition:

```text
Candidate governance / provenance / immutable versioning = PASS
Canonical Ownership Check = PASS
Final runtime publication/ACTIVE integration = INCOMPLETE
```

One readiness finding:

### A-MEDIA-001 — MEDIUM

Recent image/audio work is staged and reviewed, but the final CD integration lane has not closed after the last mechanism-clang integrity repair.

At the pinned baseline, only `shared.library` has a non-null runtime `active_version`. The newly approved Portrait Hall pair, Main Gate v002, and the six audio identities are not yet ACTIVE.

This does not invalidate the placeholder-first strategy; it means the recent media lane is not yet a completed final Sprint9 runtime asset set.

## Phase B — comprehensive independent trial audit

CA independently inspected the original Teacher PPT, current root player/Teacher surfaces, current runtime/database contracts, prior audit closures, and post-CA-130 delta.

### B-001 — HIGH
Legacy Sprint1 is exposed as the production pre-run player fallback.

When there is no active formal run, root player code calls `renderState(sprint1State)`. Since Sprint1 state exists as soon as the room is created, the first joined player can immediately enter a playable Scene 1 before the other two players or formal run.

This explains:
- gameplay beginning too early;
- missing opening placeholder;
- generic Scene 1.

### B-002 — HIGH
Legacy Sprint1 reveals all three first choices player-to-player after three submissions.

This is not the canonical ACT1 path; it violates the current private-first-action rule because the obsolete fallback remains exposed.

### B-003 — HIGH
Formal startup is structurally non-atomic.

Teacher Console performs:
1. `s2_start_run`
2. later/separately `s3b_initialize_flow`

If start succeeds but initialization fails, an active formal run can exist without canonical ACT1-5 state. The player client then expects formal Sprint3B state and throws when it is absent.

### B-004 — HIGH / LIVE-STATE DIVERGENCE
Teacher screenshot shows:

```text
Run started: <run_id>
No active run
Sprint 3B initialization failed: No active formal run.
```

That sequence contradicts the pinned static contract: current `s2_start_run` inserts an active run and returns only afterward; `s2_get_teacher_state` immediately queries that same active-run surface.

CA therefore confirms a real live/deployed-state inconsistency but does **not** adopt an unverified cause such as wrong Supabase URL, stale deploy, or race. CD will need to reproduce the actual deployed environment after Teacher/GA discussion.

### B-005 — MEDIUM
Production Teacher Console still exposes legacy Sprint1/Sprint2 controls.

In particular:
- `Advance scene` mutates legacy Sprint1;
- `Reset room` resets only Sprint1 decisions/state, not the formal run;
- generic reusable DiscussionRoom controls remain on the same operator surface.

This permits shadow legacy state to diverge from canonical formal state and materially increases operator confusion.

### B-EVIDENCE-01 — MEDIUM
Existing regression coverage verified canonical-flow internals but did not prove the actual root startup sequence:

```text
room creation
→ 3 joins
→ formal run
→ canonical ACT1
```

The first manual Teacher run therefore reached an obsolete path that prior tests did not exclude.

## Important positive result

The formal canonical ACT1 itself still contains the correct:

- role-specific GAL-A / GAL-B / GAL-C choices;
- role validation in the database;
- role-specific opening image keys;
- placeholder fallback;
- private formal interaction design.

Therefore the Teacher's identical choices are evidence that the wrong legacy surface is shown, not that the canonical script was authored with identical choices.

Previously closed ACT2-ACT14 integrity/finalization findings remain closed in repository history; no post-CA-130 runtime/database delta was found that reopens those contracts.

## Trial disposition

CA disposition:

```text
Repeated Teacher trials = PAUSE
Media placeholders themselves = not the blocker
Remediation = HOLD pending Teacher/GA discussion
```

Reason: current startup can show wrong gameplay before readiness, disclose private choices, strand the formal run, and present contradictory Teacher state.

Per User direction, CA has not sent remediation instructions to CD or VA.

NEXT_OWNER: GA + Teacher  
NEXT_ACTION: Discuss the audit findings and decide remediation scope/priority. After that decision, route bounded implementation ownership and return a frozen correction baseline to CA for independent re-audit.  
