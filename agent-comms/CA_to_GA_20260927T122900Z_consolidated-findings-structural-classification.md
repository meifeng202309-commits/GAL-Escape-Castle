# CA -> GA — Consolidated findings + structural classification

FROM: CA
TO: GA
TIMESTAMP_UTC: 2026-09-27T12:29:00Z
SUBJECT: Merge CA-135/136/137 findings and distinguish structural vs localized defects
STATUS: ANALYSIS_COMPLETE / REMEDIATION_SCOPE_INPUT
BASELINE: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

Teacher requested CA to:
1. merge all findings from the recent audit rounds;
2. distinguish overall structural problems from localized coding defects;
3. send the resulting report to GA.

Full report:

`docs/audits/independent/runs/2026-09-27_teacher_trial_two_phase_independent_audit/CONSOLIDATED_FINDINGS_AND_STRUCTURAL_CLASSIFICATION.md`

## 1. Consolidated material finding set

The de-duplicated remediation set contains **14 material findings**:

```text
IDA-001..006
PFC-001..008
```

Separate acceptance/evidence gaps:
- IDA-007 — live Asset Manager ACTIVE/runtime publication state NOT VERIFIED;
- NV-PF-01 — placeholder/anchor rendered usability NOT VERIFIED;
- NV-PF-02 — audio perceptual completeness NOT VERIFIED;
- real staggered three-client browser experience NOT VERIFIED.

## 2. Structural vs localized classification

Mutually exclusive count:

```text
Structural runtime/product: 9
Structural QA/test:          1
Localized:                   3
Pending diagnosis:           1
Total:                      14
```

Therefore **10/14 material findings belong to structural families**, 3 are localized confirmed defects, and 1 cannot yet be classified until live diagnosis.

## 3. Structural families

### S1 — Legacy/formal lifecycle not cleanly separated
Explains:
- IDA-001
- IDA-002
- IDA-005
- PFC-001

Core issue:
the root product uses legacy Sprint1 as the default when no active formal run exists. That conflates pre-run, completed-run and legacy-prototype states and also leaves legacy Teacher controls on the formal operator surface.

### S2 — Fragmented formal transition ownership
Explains:
- IDA-003
- PFC-008
- relevant context for IDA-004

Core issue:
backend modules can be locally correct while the handoff between modules does not guarantee one valid player-visible completion boundary.

Examples:
- start run vs initialize ACT1;
- ACT5 terminal payoff overwritten by same-transaction ACT6 initialization.

### S3 — No unified per-player accepted/locked/waiting contract
Explains:
- PFC-002
- PFC-003

Core issue:
after one player's action is accepted while a group barrier remains pending, different runtime generations render inconsistent states:
- button disappears with no waiting explanation;
- or button reappears as though the action was never accepted.

This repeats across enough ACTs that it should not be treated as a set of isolated waiting-text bugs.

### S4 — Pocket/evidence not implemented as a cross-ACT player capability
Explains:
- PFC-005

Backend evidence state exists, but ACT1–5 root client does not fetch/render Pocket, Memories, Shared Photos or Group Items.

This affects gameplay evidence, later object inspection and behavior-analysis context.

### S5 — QA is RPC-centric rather than browser-journey-centric
Explains:
- IDA-006

Direct-RPC E2E validates backend contracts but bypasses the composed root UI journey where the actual failures occur.

## 4. Localized defects

### PFC-004
Sprint6 stale status is not cleared on successful render/progression.

Classification: small localized code correction.

### PFC-006
Specific ACT4/Main Gate canonical anchors/composites are not consumed.

Classification: localized/moderate integration gap; the general resolver/anchor framework already exists and works elsewhere.

### PFC-007
Server already projects `act4_revealed`; client simply never renders it.

Classification: localized client-rendering gap.

## 5. Pending diagnosis

### IDA-004
Live Teacher trial showed:
`Run started → No active run → No active formal run`.

The symptom is real, but static source cannot identify the deployed root cause.

Do not classify this as structural or local until live reproduction/deployment inspection resolves it.

## 6. Important planning consequence

CA's conclusion is:

> The project is **not mainly suffering from fourteen independent small bugs**.

Most findings are downstream manifestations of a few cross-cutting architecture mismatches.

CA recommends GA freeze remediation scope by root structural family first, rather than by raw issue-ID order:

```text
A. lifecycle / legacy-formal separation
B. transition ownership / handoff boundaries
C. per-player submitted-locked-waiting contract
D. Pocket/evidence cross-ACT capability
E. browser-level product journey validation

then localized corrections:
F. stale-status clearing
G. ACT4/Main Gate anchor/UI integration
H. ACT4 Reveal rendering

plus:
I. reproduce IDA-004
J. live/browser acceptance for remaining NOT VERIFIED items
```

This is scope architecture only. CA is **not** prescribing CD's algorithm, schema, helper decomposition, SQL layout, or exact implementation sequence.

## 7. Rewrite assessment

The findings do **not** support a full restart/rewrite.

Large parts of the formal backend remain reusable and source-level sound:
- role-specific ACT1;
- canonical DiscussionRoom;
- player privacy;
- later mutation authority;
- Teacher Override provenance;
- finalization/export integrity;
- asset resolver/anchor framework.

The appropriate interpretation is:

> **bounded structural refactor + localized corrections**, not rewrite from zero.

No CD/VA implementation instructions were sent.

NEXT_OWNER: GA + Teacher
NEXT_ACTION: use the consolidated report to freeze the bounded remediation scope; once scope is decided, route implementation without reducing the structural families to symptom-level patch tickets.
