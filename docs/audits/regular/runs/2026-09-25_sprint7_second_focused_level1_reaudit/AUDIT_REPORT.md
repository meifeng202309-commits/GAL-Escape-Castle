# Sprint 7 Teacher Console — Second Focused Level 1 Re-audit

Prior correction baseline: `1d95b18b244f5497ea6773d012adee34ed507c1b`  
Final Sprint7 correction baseline: `4cff559889fa076dd0c15e58844baa8277e1bba0`  
Additive migration: `045_sprint7_teacher_intervention_provenance.sql`  
Decision: **PASS — SPRINT7 VERIFIED / SPRINT8 RELEASED**

## 1. Final closure matrix

| Finding | Final result |
|---|---|
| S7-CA-001 MEDIUM | **FIXED_VERIFIED** |
| S7-CA-002 MEDIUM | **FIXED_VERIFIED** |
| S7-CA-003 MEDIUM | **FIXED_VERIFIED** |
| S7-CA-004 MEDIUM | **FIXED_VERIFIED** |
| S7-CA-005 MEDIUM | **FIXED_VERIFIED** |

Sprint7 is closed.

## 2. S7-CA-003 — FIXED_VERIFIED

The prior focused audit had already accepted the per-phase validity correction.

The only remaining defect was incomplete durable Teacher-intervention provenance for current vote/time mutation controls.

Migration045 closes both missing families.

### Generic Sprint2 Teacher vote/time controls

Existing generic Teacher actions:

- `s2_open_vote`
- `s2_add_time`

already produced durable runtime events:

- `vote_opened_by_teacher`
- `teacher_added_time`

but those events were not classified into the Sprint7 intervention projection.

Migration045 adds an AFTER INSERT trigger on `runtime_events`.

For these exact event types it appends a durable mirror event:

- `teacher_intervention_vote_opened_by_teacher`
- `teacher_intervention_teacher_added_time`

with:

- original run / room / discussion identity;
- scene / phase / step context;
- original event identity in `details.source_event_id`;
- explicit Teacher provenance;
- `behavior_scoring=false`.

The mirrored event type does not match the trigger source event list, so the trigger does not recursively mirror itself.

Historical generic Teacher vote/time events are also backfilled idempotently by source-event identity.

### Sprint5 Teacher vote/time controls

Migration045 replaces the effective definitions of:

- `s5_teacher_open_vote`
- `s5_teacher_add_time`

so the state mutation and the Teacher-intervention event occur in the same database transaction.

They now append:

- `teacher_intervention_s5_vote_opened`
- `teacher_intervention_s5_time_added`

with current Sprint5 phase / vote round / discussion identity.

If the state mutation fails, the event insert is not committed independently.

### Sprint7 intervention projection

The already-accepted `teacher_interventions` projection is unbounded and includes events carrying explicit Teacher provenance.

Therefore:
- generic Teacher vote/time mutations;
- Sprint5 Teacher vote/time mutations;
- Teacher override;
- AUDIT private-debug changes;
- Teacher session-release events

now have durable intervention history under the current Teacher workflow.

### Verification

CD reports deployed live verification for generic Open Vote + Add Time, and the live test checks that both mirrored intervention records appear through:

`s7_get_teacher_console`.

Static checks also cover the Sprint5 intervention writers.

CA independently verified the source-level transaction/provenance paths and found no remaining alternate Teacher vote/time mutation path from the current Teacher Console that bypasses this intervention history.

**S7-CA-003 → FIXED_VERIFIED.**

## 3. Canonical Ownership Check

**PASS.**

The correction commit changes only:

- `database/045_sprint7_teacher_intervention_provenance.sql`;
- Sprint7 static/live tests.

No protected GA/Teacher/VA canonical content source is modified.

The active GA canonical Teacher-visibility commits remain owner-first and untouched.

## 4. Adjacent regression review

### Structured locked-choice view

Unchanged from migration044.

### AUDIT technical-debug authority

The legacy writer continues to delegate to the single logged Sprint7 authority.

### Per-phase behavior validity

Unchanged and remains phase-identifiable.

### Export filename preview

Unchanged and remains canonical NORMAL/AUDIT preview only.

### ACT12 submitted/waiting

Unchanged and remains aligned to `act12_tasks`.

### Teacher auth/session recovery

Unchanged.

### Sprint8 boundary

Migration045 does not:
- implement ACT14;
- set `game_completed=true`;
- set `export_ready=true`;
- generate JSON/CSV export;
- add runtime behavior analysis/prediction.

## 5. Recurring Patterns A–F

| Pattern | Result | Evidence |
|---|---|---|
| A — local correctness / cross-module handoff | PASS | current Teacher vote/time controls now converge into the same intervention-history contract. |
| B — distributed failure | PASS | Sprint5 mutation + provenance event is transactional; generic source event + mirror trigger is durable in the same insert transaction. |
| C — UI vs server rule | PASS | provenance is created server-side, not inferred from UI button labels. |
| D — current state vs history | PASS | Teacher timing/vote mutations now survive as append-only intervention history. |
| E — authority accretion | PASS | no new independent Teacher mutation authority is introduced; existing controls gain provenance. |
| F — self-confirming tests | PASS with limitation | generic Teacher mutations are live-tested; Sprint5 provenance is source/static verified but not separately exercised in the focused live fixture. Source transaction path is deterministic and no contradictory path was found. |

## 6. Remaining verification boundaries

These do not block Sprint7:

- physical classroom three-device Teacher Console use;
- full target-browser audio/asset integration;
- ACT14 finalization/export, not yet implemented.

## 7. Mandatory Pre-Approval Gate — Sprint8 risk forecast

Next canonical scope:

**Sprint8 — ACT14 Final Reveal + Session Finalization / Export**

Risk-only forecast:

| Risk ID | Next-scope area / interface | Why high-risk | Invariant / failure class to watch |
|---|---|---|---|
| S8-RISK-01 | ACT13→ACT14 finalization ordering | ACT13 currently reaches only a boundary; Sprint8 will turn that boundary into irreversible completion | pending events must flush before integrity verification and before `game_completed/export_ready` become true |
| S8-RISK-02 | `session_integrity_verified` semantics | legitimate path-dependent absence must not be confused with missing/corrupt data | actual-path completeness; standard null + validity reason; no “all possible fields required” rule |
| S8-RISK-03 | JSON export allowlist | runtime DB contains Teacher tokens, join/session credentials and internal technical fields | no secret/token/hash/service credential may enter export; dedicated allowlist/analysis DTO only |
| S8-RISK-04 | JSON behavior/provenance completeness | evidence now spans discussion, knowledge, roles, overrides, validity, interventions and ACT6–13 ledger | export must preserve real-vs-system-vs-Teacher provenance and pre-override evidence without reconstructing from mutable current state |
| S8-RISK-05 | CSV flat event ledger | multiple existing ledgers have different schemas/identities | canonical columns, ordered chronology, actor/validity semantics, no duplicate or invented events |
| S8-RISK-06 | NORMAL vs AUDIT export separation | runtime schema is shared while archive/export files diverge | filename suffix, dataset eligibility and behavior-analysis eligibility must remain mode-correct; AUDIT data must not enter real behavior dataset |
| S8-RISK-07 | ACT14 exact localization/typography | ending has unusually strict English/NL/ZH casing and no-parent-uppercase requirements | exact `But...` / `THEY`, Dutch only `ZIJ`, Chinese sentence rules, no inherited uppercase transform |
| S8-RISK-08 | reconnect / duplicate finalization / export | finalization can be retried after response loss or reconnect | exactly-once semantic completion; repeated export must not mutate behavior history or create inconsistent final states |

The forecast does not expose a defect in the current Sprint7 baseline and therefore does not reopen Sprint7.

## 8. Gate disposition

**Sprint7 = VERIFIED PASS.**

**Sprint8 = AUTHORIZED FOR IMPLEMENTATION.**

Migrations `001–045` are deployed history and immutable.

Next unused migration = **046**.

Next owner: **CD**.

Authorized next scope:
- ACT14 bilingual final reveal;
- exact ending typography regression;
- pending-event flush;
- semantic session-integrity verification;
- final-state persistence;
- `game_completed=true`;
- `export_ready=true`;
- NORMAL/AUDIT JSON + CSV export;
- canonical export schema/provenance/validity fields.

Not authorized:
- runtime Behavior Trace / Compare the Three;
- prediction module;
- Sprint9 asset-integration work;
- unrelated gameplay redesign.

After Sprint8 implementation, submit regular Sprint8 Level1 audit.

Because the project has now added finalization/export authority after the prior ACT1–13 Level3 snapshot, CA will require a milestone independent snapshot no later than successful Sprint8 closure and before Sprint9/10 release progression.
