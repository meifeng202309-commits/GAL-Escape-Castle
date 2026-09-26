# GAL ESCAPE CASTLE — CURRENT STATUS

> L3 operational snapshot.  
> Not a canonical gameplay/spec source.  
> Last refreshed: 2026-09-26T01:52:00Z
> Updated by: GA

---

## 1. Project dashboard

```text
CURRENT_SPRINT        = Sprint9 — Full Asset Integration / Visual Continuity Acceptance
CURRENT_GATE          = SPRINT9_PLACEHOLDER_TRIAL_RUNTIME_RELEASED
CURRENT_OWNER         = Teacher trial phase + CD runtime support; VA final-media replacement + ISA Class A support continue independently
NEXT_REQUIRED_ACTION  = Teacher/User may begin repeated end-to-end game trials with temporary media; CD supports and remediates concrete runtime defects discovered during trials while preserving released placeholder/audio fallback behavior; VA/CD continue final-media replacement/integration separately; final Sprint9 asset acceptance remains pending; migrations001–058 immutable next059+; Sprint10 remains future gate

MEMORY_SYSTEM         = ACTIVE
MEMORY_SYSTEM_START   = GA-001 / 2026-09-20
ISA_STATUS            = ACTIVE — Sprint9 Class A standing non-authoritative validation/tooling envelope allocated
```

Visual production continues in parallel.

---

## 2. Action Log checkpoints

GA has completed its latest checkpoint through GA-030. CA has completed its latest checkpoint through CA-130.

```text
GA_CHECKPOINT = GA-030
CA_CHECKPOINT = CA-130
CD_CHECKPOINT = NONE
VA_CHECKPOINT = NONE
ISA_CHECKPOINT = NONE
```

Universal cold-start entry:

```text
docs/onboarding/START_HERE.md
```

---

## 3. Current canonical / governance set

```text
L1 / current canonical:
docs/specs/current/古堡逃脱游戏脚本 V4.0.md
docs/specs/current/Codex程序开发说明书 V2.4.md
docs/specs/current/Castle Visual V2.1.md
docs/specs/current/从创意到游戏成品的研发流程V1.0.md
docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv
assets/asset-registry.json

L2 / governance:
agent-comms/inter_agent_talk_protocol V4.md
docs/onboarding/START_HERE.md
docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md
docs/onboarding/GAL_ESCAPE_CASTLE_Agent_Action_Log_Rules_V1.1.md
docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.4.md
docs/onboarding/GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0.md
```

CA audit cadence:

```text
Level 1 = Regular CA Audit
Level 2 = Targeted Independent Closure Audit
Level 3 = Full Independent Snapshot Audit at accumulated/milestone scope
```

Procedural autonomy:

```text
When workflow already defines next owner + next action + permitted scope + closure condition,
execute without duplicate user approval.

ISA governance:
ISA is ACTIVE as a bounded implementation-support role.
CA allocates ownership envelopes; CD owns architecture/interfaces/final integration; ISA works only inside approved/frozen scope.
Procedural CA/CD/ISA steps already authorized by the cooperation model do not require duplicate user/Teacher approval.

Communication scope:
Use the minimum necessary recipient set. Send only to Agents who influence the current decision, whose active work/authority is materially changed, or who are the required next executor/auditor. FYI-only messages are prohibited; ALL is reserved for changes that materially affect every active role.
```

Canonical ownership hardening:

```text
CD implementation need ≠ canonical write authority.
Other-role canonical sources require owner-first canonicalization.
Owner canonical commit and CD consumer implementation commit must be separate.
Every substantive CA audit performs a mandatory Canonical Ownership Check.
Unauthorized protected-source modification => BLOCKED — CANONICAL AUTHORITY VIOLATION.
```

---

## 4. Sprint / verification snapshot

```text
Sprint 0  = CLOSED
Sprint 1  = VERIFIED PASS
Sprint 2  = PASS
Sprint 3A = PASS
Sprint 3B = REMEDIATION CLOSURE PASS
Sprint 3C = VERIFIED PASS
Sprint 4  = VERIFIED PASS
Sprint 5  = VERIFIED PASS
Sprint 6  = VERIFIED PASS
Sprint 7  = VERIFIED PASS
Sprint 8  = VERIFIED PASS
Sprint 9  = RELEASED
Sprint 10 = FUTURE NORMAL GATE
```

Sprint3C verified correction baseline:

```text
401a65847e94c534cd5e5458b865a304e510b74c
```

Sprint3C migration chain:

```text
database/015_sprint3c_minimal_safe_teacher_override.sql
database/016_sprint3c_level1_narrow_corrections.sql
database/017_sprint3c_override_act2_entry_correction.sql
```

Do not modify deployed migrations 001–017. At Sprint3C closure, migration 018 was next; current next unused migration is 054.

Do not modify deployed migrations 013 / 014 / 014a / 014b / 015. Any DB correction must remain additive.

---

## 5. Sprint3C closure / Sprint4 next gate

```text
S3C-CA-001 MEDIUM = FIXED_VERIFIED
S3C-CA-002 HIGH   = FIXED_VERIFIED
Sprint3C gate     = PASS
```

Focused Level 1 re-audit:

```text
docs/audits/regular/runs/2026-09-23_sprint3c_level1_reaudit/AUDIT_REPORT.md
```

Formal CA→CD PASS handoff:

```text
agent-comms/CA_to_CD_20260923T010444Z_sprint3c-focused-level1-reaudit-pass.md
```

Sprint4 was subsequently implemented and is now VERIFIED PASS; current gate is Sprint5 implementation.


---

Sprint4 scope approval:

```text
agent-comms/CA_to_CD_20260923T014439Z_sprint4-asset-manager-v2-scope-approved-with-canonical-coverage.md
```

Binding scope conditions:

```text
S4-SCOPE-01 = all 8 canonical lifecycle meanings must be supported
S4-SCOPE-02 = V4.0 §50.3 metadata + §50.7.5 sidecar minimum contracts preserved
S4-SCOPE-03 = registry/runtime identity+version authority must not silently split
```

## 6. Sprint4 closure / Sprint5 gate

```text
S4-CA-001 HIGH   = FIXED_VERIFIED
S4-CA-002 HIGH   = FIXED_VERIFIED
S4-CA-003 HIGH   = FIXED_VERIFIED
S4-CA-004 HIGH   = FIXED_VERIFIED
S4-CA-005 MEDIUM = FIXED_VERIFIED
S4-CA-006 MEDIUM = FIXED_VERIFIED
S4-CA-007 MEDIUM = FIXED_VERIFIED
S4-RC-001 MEDIUM = FIXED_VERIFIED
S4-RC-002 MEDIUM = FIXED_VERIFIED
S4-RC-003 MEDIUM = FIXED_VERIFIED
Sprint4 gate     = VERIFIED PASS
```

Third focused Level 1 re-audit:

```text
docs/audits/regular/runs/2026-09-24_sprint4_third_focused_level1_reaudit/AUDIT_REPORT.md
```

Formal CA→CD PASS handoff:

```text
agent-comms/CA_to_CD_20260924T011000Z_sprint4-third-focused-level1-reaudit-pass-release-sprint5.md
```

Deployed migrations `018–036` are immutable. Next unused migration is `054`.

Sprint5 next-scope risk forecast has been delivered to CD.
---


## 7. Sprint5 closure / Sprint6 gate

```text
S5-CA-001 HIGH   = FIXED_VERIFIED
S5-CA-002 HIGH   = FIXED_VERIFIED
S5-CA-003 MEDIUM = FIXED_VERIFIED
S5-RC-001 MEDIUM = FIXED_VERIFIED
S5-RC-002 MEDIUM = FIXED_VERIFIED
Sprint5 gate     = VERIFIED PASS
```

Final focused Level 1 re-audit:

```text
docs/audits/regular/runs/2026-09-24_sprint5_fourth_focused_level1_reaudit/AUDIT_REPORT.md
```

Formal CA→CD PASS handoff:

```text
agent-comms/CA_to_CD_20260924T052400Z_sprint5-final-focused-reaudit-pass-release-sprint6.md
```

Verified correction baseline:

```text
e38db52e04211e746628f884f88bcbfd0bb7be50
```

Migrations `027–036` are immutable. Next unused migration is `054`.

Sprint6 risk-only forecast has been delivered to CD. Sprint6 canonical scope is ACT 9–13; ACT14 finalization/export and Sprint7 Teacher Console expansion remain outside this release.

---

## 8. Sprint6 historical closure / Level3 remediation closure

Sprint6 focused Level1 remains VERIFIED PASS. The higher-level ACT1–13 Level3 finding set has now been fully closed by targeted Level2 re-audits.

```text
IDA-001 HIGH   = FIXED_VERIFIED
IDA-002 MEDIUM = FIXED_VERIFIED
IDA-003 HIGH   = FIXED_VERIFIED
IDA-004 HIGH   = FIXED_VERIFIED
IDA-005 HIGH   = FIXED_VERIFIED
IDA-006 HIGH   = FIXED_VERIFIED

Level2 final closure gate = PASS
ACT1–13 integrated gate = CLOSED
Sprint7 gate = RELEASED
```

Final Level2 closure report:

```text
docs/audits/independent/runs/2026-09-24_level2_final_ida_closure/AUDIT_REPORT.md
```

Formal CA→CD PASS / Sprint7 release:

```text
agent-comms/CA_to_CD_20260924T174800Z_level2-final-closure-pass-release-sprint7.md
```

Final correction baseline:

```text
96dd6a867aa0edab25cd3a68a30b2710a99fdcbe
```

Migrations `001–042` are deployed history and immutable. Next unused migration is `054`.

Sprint7 is now the authorized implementation scope. Sprint8 remains unauthorized.

---

## 8A. Sprint7 Level1 gate

```text
S7-CA-001 MEDIUM = FIXED_VERIFIED
S7-CA-002 MEDIUM = FIXED_VERIFIED
S7-CA-003 MEDIUM = FIXED_VERIFIED
S7-CA-004 MEDIUM = FIXED_VERIFIED
S7-CA-005 MEDIUM = FIXED_VERIFIED

Sprint7 gate = VERIFIED PASS
Sprint8 gate = RELEASED / IMPLEMENTATION AUTHORIZED
```

Final Sprint7 re-audit report:

```text
docs/audits/regular/runs/2026-09-25_sprint7_second_focused_level1_reaudit/AUDIT_REPORT.md
```

Formal CA→CD PASS / Sprint8 release:

```text
agent-comms/CA_to_CD_20260925T033700Z_sprint7-pass-release-sprint8.md
```

Final Sprint7 correction baseline:

```text
4cff559889fa076dd0c15e58844baa8277e1bba0
```

Migrations `001–045` are deployed history and immutable. Next unused migration is `054`.

Sprint8 is now the authorized implementation scope. Sprint9/10 remain unauthorized.

---

## 8B. Sprint8 Level1 gate

```text
S8-CA-001-R2 HIGH = OPEN — ACT6 second-round 1:1:1 fallback can be certified using prior round-1 tie evidence
S8-RC-001 HIGH    = FIXED_VERIFIED
S8-RC-002 MEDIUM  = FIXED_VERIFIED
ISA override-state defect = FIXED_VERIFIED
ISA override-scope defect = FIXED_VERIFIED
stale Sprint8 live assertion = FIXED_VERIFIED

Sprint8 gate = FAIL / BLOCKED — one narrow residual
Sprint9/10 gate = BLOCKED
```

Focused re-audit report:

```text
docs/audits/regular/runs/2026-09-25_sprint8_wp-s8-02_focused_level1_reaudit/AUDIT_REPORT.md
```

Formal CA→CD handoff:

```text
agent-comms/CA_to_CD_20260925T140900Z_sprint8-wp-s8-02-focused-reaudit-one-act6-residual.md
```

Frozen audit baseline:

```text
3d357ddc42e8232246bf649b5cb63a3e7ecea1fc
```

Migrations `001–052` are immutable deployed history. Next unused migration is `054`.

Milestone independent snapshot remains scheduled after Sprint8 regular closure and before Sprint9/10 progression.

## 8C. Post-Sprint8 ACT1–14 milestone Level3

```text
Sprint8 local gate = VERIFIED PASS
Milestone Level3 = FAIL / BLOCKED

IDA2-001 HIGH   = OPEN — canonical ACT1–5 Teacher Override hard allowlist only partially implemented
IDA2-002 HIGH   = OPEN — canonical ACT3 Library Box override cannot pass ACT14 integrity
IDA2-003 HIGH   = OPEN — Teacher Console export control remains disabled after completion
IDA2-004 HIGH   = OPEN — semantic integrity can miss authoritative group outcome loss/mismatch
IDA2-005 HIGH   = OPEN — export remains room-scoped and older completed runs lose addressability
IDA2-006 MEDIUM = OPEN — exported_at records finalization time, not export-generation time

Sprint9 = BLOCKED
Sprint10 = BLOCKED
```

Audit run:

```text
docs/audits/independent/runs/2026-09-25_act1-14_post-sprint8/
```

Formal CA→CD handoff:

```text
agent-comms/CA_to_CD_20260925T144500Z_level3-act1-14-post-sprint8-fail-six-findings.md
```

Frozen product baseline:

```text
2cc4b642bc86c4d8fb1b1631ca0ae394ed886913
```

Migrations `001–053` are immutable. Next unused migration is `054`.

Next audit after remediation is **Level2 Targeted Independent Closure**, not another automatic full Level3 rerun.

## 8D. IDA2-001..006 Level2 targeted closure

```text
Frozen remediation baseline = 40223199e8c7934216b09d78aa86d4375d101e0f
Level2 Targeted Closure = FAIL / BLOCKED

IDA2-002 = CLOSED at code-level trace
IDA2-003 = CLOSED at code-level trace
IDA2-004 = CLOSED at code-level trace
IDA2-006 = CLOSED at code-level trace

IDA2-001-R1 HIGH   = OPEN — ACT2 meeting Teacher resolution omits canonical current_route_target=library; GAL route-update location can render blank
IDA2-001-R2 HIGH   = OPEN — ACT2/ACT5 Teacher-resolved discussions do not explicitly mark unsubmitted final votes invalid_teacher_override in exported validity evidence
IDA2-005-R1 MEDIUM = OPEN — Teacher completed-run selector is reset to newest run by ordinary 1.2s polling

Canonical Ownership Check = PASS
Sprint9 = BLOCKED
Sprint10 = BLOCKED
```

Audit report:

```text
docs/audits/independent/runs/2026-09-25_ida2_001_006_level2_targeted_closure/AUDIT_REPORT.md
```

Formal CA→CD handoff:

```text
agent-comms/CA_to_CD_20260925T153800Z_level2-ida2-targeted-closure-fail.md
```

Migrations `001–054` are immutable deployed history. Next additive database migration is `055+`.

Next audit is a **narrow Level2 re-audit** of the three residuals after CD submits one frozen correction baseline. No duplicate Teacher approval is required.


---

## 8E. Narrow Level2 residual re-audit

```text
Frozen correction baseline = 3b76246d5c0fa6678aaf22a785b56780cd52f5bb

IDA2-001-R1 = CLOSED
IDA2-005-R1 = CLOSED
IDA2-001-R2 = OPEN only for canonical teacher_override runtime-event invalidated_scope consistency

Narrow Level2 re-audit = FAIL / BLOCKED
Canonical Ownership Check = PASS
Sprint9 = BLOCKED
Sprint10 = BLOCKED
```

Audit report:

```text
docs/audits/independent/runs/2026-09-25_ida2_residual_narrow_level2_reaudit/AUDIT_REPORT.md
```

Formal CA→CD handoff:

```text
agent-comms/CA_to_CD_20260925T161500Z_level2-residual-reaudit-one-event-evidence-gap.md
```

Migrations `001–056` are immutable deployed history. Next additive database migration is `057+`.

Next audit is one final narrow Level2 closure check of this event-evidence residual only.

---

## 8F. Final IDA2 narrow closure PASS

```text
Final frozen correction baseline = 04fea9719003edecfd5bcb3c10fa04eea42fe7ce

IDA2-001-R1    = CLOSED
IDA2-001-R2    = CLOSED
IDA2-001-R2-E1 = CLOSED
IDA2-002       = CLOSED
IDA2-003       = CLOSED
IDA2-004       = CLOSED
IDA2-005-R1    = CLOSED
IDA2-006       = CLOSED

Final narrow Level2 closure = PASS
Canonical Ownership Check = PASS
Post-Sprint8 Level3 blocker = CLOSED
Sprint9 = RELEASED
Sprint10 = future normal gate
```

Audit report:

```text
docs/audits/independent/runs/2026-09-25_ida2_001_r2_e1_final_narrow_closure/AUDIT_REPORT.md
```

Formal CA→CD handoff:

```text
agent-comms/CA_to_CD_20260925T163000Z_ida2-final-closure-pass-sprint9-released.md
```

Migrations `001–057` are immutable deployed history. Next additive database migration is `058+`.

---

## 8G. Sprint9 allocation

```text
Sprint9 = ACTIVE

WP-S9-01
Owner = VA
Scope = visual candidate integrity/completion only
Key immediate defect = shared.main_gate v001 WebP/sidecar SHA-256 mismatch
Also = four temporary visual placeholders + nine absent image candidates
Audio = EXCLUDED from VA

WP-S9-02
Owner = CD
Scope = validate/publish/activate/runtime-integrate approved coherent assets
Final integration owner = CD
Migrations = 001–057 immutable; next 058+

WP-S9-03
Owner = ISA
Class = A standing envelope
Scope = isolated path/hash/checksum validators, anchor tooling, loading/fallback regression harnesses, non-authoritative evidence tooling
No Class B plan/interface approval required inside this envelope

Audio production
Status = PARTIAL BLOCK only for binary production/sourcing
Reason = V4.0 §44.3 and Castle Visual V2.1 explicitly exclude audio from VA, while current canonical sources do not name another production-agent owner
GA = requested to provide narrow canonical owner/workflow clarification

All unaffected Sprint9 work proceeds in parallel.
Sprint10 = future normal gate
```

Allocation messages:

```text
agent-comms/CA_to_CD_20260925T165000Z_sprint9-allocation-with-audio-boundary-correction.md
agent-comms/CA_to_VA_20260925T165000Z_sprint9-visual-production-allocation.md
agent-comms/CA_to_ISA_20260925T165000Z_sprint9-class-a-standing-envelope.md
agent-comms/CA_to_GA_20260925T165000Z_sprint9-audio-production-owner-clarification.md
```

---

## 8H. User-directed VA auxiliary support role

```text
User decision = VA may take Sprint9 audio candidate production because its primary visual workload is nearly complete.

Persistent role intent:
VA primary role = Visual Agent.
VA auxiliary role = bounded fragmented / temporary non-authoritative production/support tasks explicitly allocated by project workflow.

Hard boundaries remain:
- no gameplay/canonical meaning invention
- no database/runtime authority
- no migration authority
- no localization authority
- no asset identity invention
- no review/approval authority
- no ACTIVE promotion / live publication

Sprint9 audio:
VA candidate production = approved in principle by User
Teacher review = unchanged
CD Asset Manager publication/ACTIVE/runtime integration = unchanged
Formal execution = pending GA minimum canonical synchronization

Previous audio-owner ambiguity request = superseded by User decision
```

User-direction message to GA:

```text
agent-comms/CA_to_GA_20260925T170500Z_user-direction-expand-va-fragmented-temporary-support.md
```

---

## 8I. Placeholder-first Teacher trial strategy

```text
User goal = run the game several times before final student-provided media is available.

Temporary trial policy:
- student-supplied images may use temporary placeholders;
- canonical asset keys / scene bindings remain unchanged;
- placeholders are not final production approval;
- unavailable production audio must not block trial execution; use the existing safe fallback path;
- later student-provided/final media replace placeholders through the existing candidate/staging/review/publish workflow.

CD = make the full game trial-runnable now.
VA = stop treating final media production as a prerequisite for the trial build; preserve clean replacement targets and process final media later.
ISA = existing Class A support unchanged.

Final Sprint9 asset acceptance = still required after trial phase.
Sprint10 release = not implied by placeholder-based trial readiness.
```

Direct CA messages:

```text
agent-comms/CA_to_CD_20260925T174500Z_user-directed-placeholder-first-trial-runs.md
agent-comms/CA_to_VA_20260925T174500Z_pause-final-media-use-placeholders-for-trials.md
```

---

## 8J. Sprint9 placeholder trial focused audit

```text
Audited baseline = d94abcaf9ed27e6c8de5dfb4dbc8ca7d63a39216

Accepted:
- resolver-first image placeholder fallback
- visibly distinct temporary placeholder presentation
- no Asset Manager registry/review/ACTIVE mutation
- missing audio consumed using existing legal stopped outcome
- Canonical Ownership Check PASS

Open:
S9-TRIAL-001 MEDIUM
= 1.2s client polling repeatedly calls asset_resolve for unchanged NO_ACTIVE image slots
= authoritative asset_resolve writes asset_load_failed on every call
= expected placeholder state becomes poll-amplified telemetry/database writes

Teacher repeated-trial release = BLOCKED pending narrow correction
Final Sprint9 asset acceptance = NOT EVALUATED
Sprint10 = future normal gate
```

Audit report:

```text
docs/audits/regular/runs/2026-09-25_sprint9_placeholder_trial_build_focused_audit/AUDIT_REPORT.md
```

CA -> CD handoff:

```text
agent-comms/CA_to_CD_20260925T181500Z_sprint9-placeholder-trial-audit-one-telemetry-finding.md
```

---

## 8K. S9-TRIAL-001 narrow re-audit

```text
Audited baseline = b2788fe52a658abb99a8c96af7eb3f3505f5034c

Verified fixed:
- main scene-image resolver path uses 30s per-client cache
- migration058 validates exact current ACTIVE metadata
- ACTIVE storage-object failure telemetry is distinct and 5min deduplicated
- accepted placeholder rendering unchanged
- missing-audio stopped fallback unchanged

Residual:
S9-TRIAL-001-R1 MEDIUM
= ACT6 overlay.portrait_eyes_open still calls raw asset_resolve
= if Portrait Hall base becomes ACTIVE while overlay remains missing,
  1.2s polling recreates poll-amplified NO_ACTIVE asset_load_failed writes

Teacher repeated-trial release = BLOCKED pending one final narrow correction
Final Sprint9 asset acceptance = NOT EVALUATED
Sprint10 = future normal gate

Migrations001–058 immutable; next059+
```

Audit report:

```text
docs/audits/regular/runs/2026-09-25_s9_trial_001_narrow_reaudit/AUDIT_REPORT.md
```

CA -> CD handoff:

```text
agent-comms/CA_to_CD_20260925T184500Z_s9-trial-001-narrow-reaudit-one-overlay-residual.md
```

---

## 8L. Placeholder-first repeated trial release

```text
Final narrow audited baseline = 6b8730f999a7de4aa58f0444d9a2f75f76377302

S9-TRIAL-001    = FIXED_VERIFIED
S9-TRIAL-001-R1 = FIXED_VERIFIED

Verified:
- main poll-driven image resolution uses 30s bounded resolver cache
- ACT6 overlay.portrait_eyes_open also uses the bounded resolver
- ACTIVE storage-object failures remain separately observable via migration058
- placeholder rendering remains resolver-first and non-authoritative
- missing audio remains safe through legal stopped consumption
- Canonical Ownership Check PASS

Placeholder-first runtime = RELEASED
Repeated Teacher trial runs = RELEASED

Final Sprint9 asset acceptance = still pending
Student/final media replacement = still pending under existing workflow
Sprint10 = future normal gate

Migrations001–058 immutable; next059+
```

Final narrow audit:

```text
docs/audits/regular/runs/2026-09-25_s9_trial_001_r1_final_narrow_reaudit/AUDIT_REPORT.md
```

CA -> CD release:

```text
agent-comms/CA_to_CD_20260925T191500Z_s9-trial-001-r1-final-pass-trial-runs-released.md
```

---

## 9. Visual / asset snapshot

Visual production may continue under Castle Visual V2.1 + `assets/asset-registry.json` governance.

```text
MASTER identities = canonical visual references
MASTER identities ≠ automatic runtime asset_keys
```

---

## 10. Memory-system adoption

Active adoption message:

```text
agent-comms/GA_to_ALL_20260920T153000Z_project-memory-system-adopted.md
```

Role Action Logs:

```text
docs/logs/GA_ACTION_LOG.csv
docs/logs/CA_ACTION_LOG.csv
docs/logs/CD_ACTION_LOG.csv
docs/logs/VA_ACTION_LOG.csv
```

---

## 11. When this snapshot is stale

Use, in order:

1. newer relevant Action Log entries after the recorded checkpoint;
2. newer valid agent-comms gate/handoff messages;
3. current canonical specs / repository state;
4. then refresh this L3 snapshot.

CURRENT STATUS must remain a short dashboard, not a development diary.
