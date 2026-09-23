# Sprint3C Focused Level 1 CA Re-audit

Baseline: `401a65847e94c534cd5e5458b865a304e510b74c`  
Scope: narrow correction of S3C-CA-001 and S3C-CA-002 plus adjacent regression risk  
Audit level: Level 1 — Focused re-audit  
Decision: **PASS / SPRINT3C VERIFIED**

## 1. Inputs and independence

CA froze the correction commit named above and re-derived the changed behavior from:

- `database/016_sprint3c_level1_narrow_corrections.sql`
- `database/017_sprint3c_override_act2_entry_correction.sql`
- the unchanged deployed `database/015_sprint3c_minimal_safe_teacher_override.sql`
- final Sprint3B action wrappers / event loggers
- Sprint3C static/live test changes

CD's reported test results are supporting evidence only; closure below is based first on source/control-flow reconstruction.

## 2. S3C-CA-001 — FIXED_VERIFIED

The ACT1 override path now has one atomic transaction:

1. `teacher_apply_override_pre016(...)` authenticates Teacher, locks the active run/scene, preserves existing real ACT1 evidence, marks only genuinely missing first-choice behavior as `invalid_teacher_override`, and advances the formal scene to ACT2.
2. The migration-016 wrapper then sets every remaining non-complete ACT1 player to `act1_stage='complete'`.
3. Because the wrapper and delegated function execute in the same PostgreSQL statement transaction while the run lock remains held, external clients cannot observe the prior impossible state (ACT2 global scene with a real-choice player still in ACT1 consequence).
4. Existing choice/timestamp/validity values are not rewritten by the wrapper.
5. Migration 017 makes canonical ACT1 completion stage, rather than presence of a fabricated `act1_locked_at`, the ACT2 entry prerequisite.
6. Stale ACT1 requests still fail the authoritative scene guard; any pre-log inside a failing wrapper rolls back with the failed transaction.

Result: all unfinished ACT1 players reach the canonical completed Game Track state without synthetic player evidence.

## 3. S3C-CA-002 — FIXED_VERIFIED

Before correction, downstream formal Sprint3B events and DiscussionRoom events used two logging families with inconsistent override provenance.

Migration 016 redefines the internal `s2_log_event(...)` family so it:

- reads `game_runs.active_override_id`;
- resolves the active `teacher_overrides` row;
- adds `context_provenance.upstream_teacher_override=true`;
- records override id, source scene/phase and action;
- preserves actor, validity and behavior-scoring semantics supplied by the underlying DiscussionRoom path.

Together with the migration-015 `s3b_log_formal_event_at_context(...)` enrichment, the existing ACT1–5 player-behavior event paths now have override provenance across both logging families.

Direct `runtime_events` writes remaining in the reviewed path are server/system transition or override records rather than uncovered player-behavior event paths.

## 4. Adjacent regression / migration review

- deployed migration 015 blob is unchanged between the failed baseline and correction baseline;
- deployed 014b blob is also unchanged;
- corrections are additive migrations 016 and 017;
- migration 016 does not require schema created by 017;
- migration 017 preserves player authentication, server scene guard, first-meeting one-shot lock, timing evidence and player-authored formal event logging;
- no Teacher Override allowlist entry was added;
- no second browser-callable Teacher override authority was introduced.

CD reports:
- static suites PASS;
- Sprint1 40/40 PASS;
- Sprint2 23/23 PASS;
- Sprint3A 15/15 PASS;
- Sprint3B 44/44 PASS;
- Sprint3C 15/15 PASS;
- migrations 016 and 017 deployed successfully.

CA did not independently execute the Supabase live suite in the available audit runtime. Physical three-student + Teacher simultaneous device UX remains NOT VERIFIED.

## 5. Codex Recurring-Error Pattern Scan

| Pattern | Result | Focused re-audit result |
|---|---|---|
| A — local correctness / cross-module handoff | PASS | ACT1 per-player completion and global ACT2 transition now converge within one transaction; ACT2 entry recognizes canonical completion without fabricating ACT1 input. |
| B — stale / retry / concurrency | PASS | run/scene serialization remains authoritative; stale ACT1 work cannot cross the override boundary; no new replay writer introduced. |
| C — UI rule vs server invariant | PASS | corrected stage/entry/provenance semantics are enforced in server functions, not only client UI. |
| D — current state vs historical evidence | PASS | downstream formal and DiscussionRoom player behavior event families both carry active upstream override provenance. |
| E — authority accretion / legacy reachability | PASS | pre016 override implementation is internalized/revoked from public/anon/authenticated callers; migration 017 replaces the active first-meeting RPC rather than creating a parallel public writer. |
| F — self-confirming tests | PASS with boundary | CD added regression checks for the two previously missed cross-path cases; CA independently traced the shared helpers. Live execution remains CD-reported rather than CA-executed. |

## 6. Gate disposition

**Sprint3C = VERIFIED PASS**

The two Level 1 findings are closed:

- S3C-CA-001 MEDIUM — FIXED_VERIFIED
- S3C-CA-002 HIGH — FIXED_VERIFIED

Next unused migration number: **018**.

The next canonical roadmap item is **Sprint 4 — Asset Manager V2**. CD may proceed with Sprint4 scope planning and submit a bounded implementation proposal for normal CA scope review. This PASS does not pre-authorize an unspecified broad Asset Manager implementation beyond the canonical Sprint4/V4.0 boundaries.

## 7. Next-Scope Risk Forecast — Sprint4 Asset Manager V2

Risk-only forecast; no implementation mechanism or CA attack recipe is prescribed.

| Risk ID | Area / interface | Why high-risk | Invariant / failure class to watch |
|---|---|---|---|
| S4-R1 | Asset Registry ↔ runtime metadata | The project already has a canonical machine identity/version authority and Asset Manager will add runtime persistence. | Avoid duplicate sources of truth or asset-key reconstruction drift. |
| S4-R2 | latest / approved / active version lifecycle | Candidate creation, approval and runtime activation are distinct authorities and may occur asynchronously. | Runtime must not confuse newest candidate with active version or expose partial promotion states. |
| S4-R3 | Upload / Storage authorization | Browser upload adds a new externally reachable write surface. | UI restrictions must not substitute for server/storage assignment, path and role boundaries; secrets must remain out of browser code. |
| S4-R4 | Missing/failed asset resolution ↔ gameplay | Asset loading is non-core presentation infrastructure but touches scene rendering/audio. | Missing/corrupt/unavailable assets must degrade safely without blocking or mutating core gameplay state. |
| S4-R5 | Paired assets and UI anchors | Visual pairs/overlays depend on metadata coherence across versions. | Activation must not create an internally inconsistent visual/anchor set. |
| S4-R6 | VA staging → Teacher review → runtime publishing | This is a multi-actor authority handoff with prior human-transfer error risk. | Canonical `asset_key`, version and approval provenance must survive the handoff without manual reinterpretation. |
| S4-R7 | Asset tests | Config/string tests can agree with implementation while runtime resolves a different version/path. | Avoid self-confirming tests that never exercise active-version resolution, fallback and permission boundaries. |

