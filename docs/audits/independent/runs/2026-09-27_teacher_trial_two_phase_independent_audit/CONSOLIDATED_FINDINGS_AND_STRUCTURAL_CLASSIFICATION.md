# Consolidated Audit Findings and Structural Classification

## 0. Purpose

This report consolidates all issues identified by CA across:

- CA-135 — Protocol v1.3 Level3 independent audit;
- CA-136 — supplemental player-facing completeness review;
- CA-137 — exhaustive player-facing state completeness matrix.

Frozen product baseline:

`93bd15ca36dd985685a0706bad9ec56ba4002a6e`

No product/runtime/database source changed between that frozen baseline and the final state-matrix review.

This report answers two questions:

1. What is the complete, de-duplicated issue list?
2. Which issues are manifestations of **overall structural problems** versus **localized code defects**?

Important distinction:

> **Structural** does not mean "rewrite the whole game."

It means the defect comes from a cross-cutting runtime/lifecycle/state architecture and is likely to recur if repaired only as individual screens or buttons.

---

# 1. Complete consolidated issue list

## 1.1 Confirmed / material findings

| ID | Severity | Status | Consolidated problem |
|---|---:|---|---|
| **IDA-001** | HIGH | CONFIRMED | Root player uses legacy Sprint1 gameplay when no active formal run exists; this occurs before formal start and is the same root mechanism that later affects post-completion dispatch. |
| **IDA-002** | HIGH | CONFIRMED | The reachable legacy root path reveals all three legacy first choices player-to-player, violating current formal privacy semantics. |
| **IDA-003** | HIGH | CONFIRMED | Formal startup is split into `s2_start_run` and a separate `s3b_initialize_flow`, creating a committed active-run state in which canonical ACT1 is not yet available; generic Sprint2 discussion can also interfere in that gap. |
| **IDA-004** | HIGH | LIVE SYMPTOM CONFIRMED / ROOT CAUSE NOT VERIFIED | Teacher trial showed `Run started → No active run → No active formal run`, which the frozen static contract cannot legitimately produce under one consistent deployed DB/runtime. |
| **IDA-005** | MEDIUM | CONFIRMED | Production Teacher Console still exposes legacy Sprint1 Advance/Reset shadow-state controls beside formal controls. |
| **IDA-006** | MEDIUM | CONFIRMED | Regression suite does not exercise the actual browser journey; direct-RPC E2E bypasses the product orchestration states where the real failures occur. |
| **PFC-001** | HIGH | CONFIRMED | After successful ACT14 finalization, the run becomes completed before client refresh; root dispatch then sees no active run and falls to legacy Sprint1, so the canonical ACT14 final reveal is normally unreachable and reconnect also returns to the wrong surface. |
| **PFC-002** | MEDIUM | CONFIRMED | Multiple peer-synchronization barriers lack explicit player acknowledgement/waiting state after the player's own action completes. Confirmed across ACT2, ACT3, ACT4 and ACT8. |
| **PFC-003** | MEDIUM | CONFIRMED | Multiple ACT9–ACT12 actions remain visibly selectable after the player's action has already been accepted/locked while peers are pending. Includes ACT9 console, ACT10 private/final vote, ACT11 allocation, ACT12 pressure and ENGAGE. |
| **PFC-004** | LOW | CONFIRMED | Sprint6 stale error/status messages are not cleared on successful render/progression, so obsolete errors can remain visible after recovery. |
| **PFC-005** | HIGH | CONFIRMED | ACT1–5 root player UI does not fetch/render canonical Pocket / Memories & Observations / Shared Photos / Group Items, affecting evidence access, delayed object inspection, ACT2 information sharing, ACT3 puzzle evidence recovery and behavior-context validity. |
| **PFC-006** | MEDIUM | CONFIRMED | Required ACT4 and Main Gate UI/anchor composites are not integrated. `library_unknown_door` and Main Gate station/watcher anchors exist canonically but are never consumed by `app.js`. |
| **PFC-007** | MEDIUM | CONFIRMED | Server projects `act4_revealed`, but client never renders it; the required simultaneous ACT4 private-choice reveal is absent. |
| **PFC-008** | MEDIUM | CONFIRMED | ACT5 route consequence and explicit `[ENTER PORTRAIT HALL]` transition are overwritten by same-transaction automatic Sprint5 initialization, so players jump directly into ACT6. |

Total material findings in remediation scope:

```text
14 findings
= IDA-001..006
+ PFC-001..008
```

---

## 1.2 Findings that are observations / evidence gaps, not yet confirmed code defects

These should not be mixed into the 14 confirmed remediation findings.

### IDA-007 — media runtime readiness NOT VERIFIED

Repository candidate state is source-consistent, but CA could not independently verify:
- live Asset Manager ACTIVE publication state;
- deployed runtime publication completeness;
- binary SHA-256 recomputation through the current connector.

This is an acceptance/readiness item, not a confirmed source defect.

### NV-PF-01 — placeholder/anchor rendered usability NOT VERIFIED

Still requires browser evidence for:
- ACT6 placeholder without eye overlay;
- ACT7 placeholder with Clock A/B/C anchor positioning skipped;
- ACT9 placeholder with Great Hall door-anchor positioning skipped.

### NV-PF-02 — audio perceptual completeness NOT VERIFIED

Source proves audio failure does not block canonical progression, but actual first-time-player comprehension under:
- autoplay block;
- missing audio;
- delayed audio;
- retry

requires real browser evidence.

### Three-client/browser experience NOT VERIFIED

Responsive layout, asynchronous timing and real staggered three-player interaction still require physical/browser acceptance after remediation.

---

# 2. Structural classification

## 2.1 Structural Problem Family S1 — Legacy and formal runtime are not cleanly separated at the product lifecycle boundary

### Findings explained by this family

- **IDA-001**
- **IDA-002**
- **IDA-005**
- **PFC-001**

### Structural evidence

The root product effectively uses:

```text
formal run active?
  YES → formal Castle Escape
  NO  → legacy Sprint1
```

That is too coarse to represent the real product lifecycle.

"No active formal run" currently conflates at least:
- joined but formal game not started;
- formal startup incomplete;
- formal game completed;
- potentially other recovery/error states.

Legacy Sprint1 is therefore not isolated as a prototype/test surface; it is used as the default product fallback.

Teacher Console has the same authority accretion problem:
- legacy Advance/Reset;
- formal runtime controls;
- both visible in one operator product.

### Why this is structural

A patch such as:

> hide legacy choices before start

would fix only IDA-001's first symptom.

It would not automatically fix:
- completed-run fallback at ACT14;
- reconnect after completion;
- Teacher legacy shadow controls;
- provenance ambiguity from legacy behavior.

The runtime needs a coherent lifecycle boundary that distinguishes current formal product states from legacy prototype states.

### Classification

**STRUCTURAL — high priority**

This is the strongest architectural root cause in the audit.

---

## 2.2 Structural Problem Family S2 — Formal start and cross-Sprint transition ownership are fragmented

### Findings explained by this family

- **IDA-003**
- **PFC-008**
- part of the risk context behind **IDA-004**

### Structural evidence

At startup:

```text
Teacher action 1 → create active formal run
Teacher action 2 → initialize ACT1–5 canonical state
```

These are separate committed operations with a player-visible invalid intermediate state.

At ACT5→ACT6:

```text
ACT5 writes terminal route consequence
→ deferred cross-Sprint trigger initializes Sprint5
→ same transaction overwrites player scene
→ browser never observes required ACT5 terminal presentation
```

Thus two different lifecycle boundaries suffer from the same deeper problem:

> **state ownership and player-visible transition ownership are not aligned.**

Backend modules are individually correct, but the handoff between modules does not guarantee a valid player-visible boundary.

### Why this is structural

Fixing only the Teacher startup buttons does not address ACT5→ACT6.

Fixing only the ACT5 cinematic does not address startup.

The common issue is the architecture of:
- lifecycle ownership;
- transition completion boundary;
- when a state is considered committed and player-visible;
- which subsystem owns the next transition.

### Classification

**STRUCTURAL — high priority**

---

## 2.3 Structural Problem Family S3 — No unified per-player "submitted / locked / waiting" presentation contract

### Findings explained by this family

- **PFC-002**
- **PFC-003**
- portions of reconnect behavior across those states

### Structural evidence

The same defect repeats across two different runtime generations:

### Sprint3B style
After own action succeeds:
- the control disappears;
- global phase stays unchanged;
- no replacement player-state is shown.

Examples:
- ACT2 leave;
- ACT2 route acknowledgement;
- ACT3 follow sign;
- ACT4 private choice;
- ACT8 private choice has only partial acknowledgement.

### Sprint6 style
After own action succeeds:
- global phase stays unchanged;
- client recreates the original action button;
- the player appears not to have submitted.

Examples:
- ACT9 console choice;
- ACT10 private/final vote;
- ACT11 allocation;
- ACT12 pressure;
- ACT12 ENGAGE.

V4.0 explicitly requires a waiting state after ENGAGE, proving this is not merely a style preference.

### Why this is structural

There are too many independent occurrences for the correct remediation to be:

> add a waiting sentence to each individual screen.

The product lacks a consistent cross-runtime rule:

> after a player's action is accepted but the global barrier is still pending, what exact player-facing state is projected and rendered?

Without a shared contract, the same bug will recur in new phases.

### Classification

**STRUCTURAL — medium/high priority**

The server integrity is mostly protected, but usability and behavior-observation validity are affected across many scenes.

---

## 2.4 Structural Problem Family S4 — Pocket/evidence exists as backend state but is not a first-class cross-ACT player capability

### Finding explained by this family

- **PFC-005**

### Structural evidence

Canonical V4.0 treats Pocket/evidence as persistent runtime capability:

```text
experience / discovery
→ knowledge or object state
→ Pocket / Memories / Group Items
→ optional sharing
→ later use
```

But current player client effectively introduces the evidence UI only once Sprint5 / ACT6 becomes active.

ACT1–5 therefore have:
- backend Pocket state;
- backend knowledge/memory state;
- progression-dependent objects;
- no corresponding root player UI.

This is not one missing button in ACT3. It disconnects the early-game UI from a persistent subsystem.

### Why this is structural

Correct behavior spans:
- GRAB;
- later object reinspection;
- memories;
- shared photos;
- group items;
- DiscussionRoom information-sharing context;
- reconnect.

A one-scene patch at the Library puzzle would not restore the intended evidence model.

### Classification

**STRUCTURAL — high priority**

---

## 2.5 Structural Problem Family S5 — Product validation is RPC-centric rather than browser-journey-centric

### Finding explained by this family

- **IDA-006**

### Structural evidence

Current live E2E tests mostly:
- call RPCs directly;
- initialize phases programmatically;
- validate server contracts.

They do not drive:

```text
root UI
→ create room
→ staggered three-player join
→ pre-run waiting
→ formal start
→ cross-ACT UI progression
→ completed-run ending
```

This allowed:
- legacy root fallback;
- startup invalid state;
- ACT14 unreachable final reveal;
- repeated waiting/acknowledgement UI defects

to coexist with passing direct-RPC tests.

### Why this is structural

This is not one missing assertion.

The test architecture is validating backend correctness while leaving the composed product journey largely untested.

### Classification

**STRUCTURAL — development/QA architecture**

It should be addressed alongside runtime remediation, otherwise structural regressions can return.

---

# 3. Localized / scattered defects

These findings are real, but the underlying framework needed to fix them already exists. They do not by themselves require redesigning the overall runtime architecture.

## L1 — PFC-004: stale Sprint6 status is not cleared

Current cause:
- `renderSprint6` does not clear `sprint3bStatus`.

Comparable renderers already clear it.

### Classification

**LOCALIZED / small code correction**

---

## L2 — PFC-006: missing ACT4/Main Gate anchor usage

The generic asset resolver and anchor framework already work for:
- Portrait Hall;
- Clock Room;
- Great Hall.

The problem is that specific canonical anchors are simply not consumed in:
- ACT4 Known/Unknown composite;
- Main Gate Station A/B/C;
- Watcher corridor.

### Classification

**LOCALIZED INTEGRATION GAP / moderate code correction**

Important nuance:

PFC-006 is larger than a one-line bug because ACT4 needs a composed comparison surface, but it does **not** require replacing the asset/anchor architecture. The existing architecture can support it.

---

## L3 — PFC-007: ACT4 Reveal projection is not rendered

Server already returns:

`act4_revealed`

Client ignores it.

### Classification

**LOCALIZED / small-to-moderate client rendering correction**

No new backend authority model is required.

---

# 4. Findings that look local but should NOT be patched independently

## IDA-002

The privacy violation is visible in legacy Sprint1, but treating it as:

> remove the legacy Reveal

would be the wrong level of repair.

The deeper issue is S1: legacy Sprint1 should not be the current formal product fallback.

Therefore:

**IDA-002 is a structural-family symptom, not a standalone local bug.**

## PFC-001

One could locally move `s8_get_player_state` outside the active-run branch.

That may repair ACT14 immediately, but it would leave the broader S1 lifecycle ambiguity intact.

Therefore:

**PFC-001 is a structural-family symptom even if one local patch appears possible.**

## PFC-008

One could add a special delay or extra transition around ACT5.

But the same class of handoff problem already exists at formal startup.

Therefore:

**PFC-008 belongs to S2 and should not be treated as an isolated cinematic bug.**

## PFC-002 / PFC-003

Each occurrence can be individually patched, but there are enough repeated occurrences across separate Sprint runtimes to prove a missing common player-state contract.

Therefore:

**these are structural-family symptoms, not a collection of unrelated waiting-text bugs.**

---

# 5. Items that cannot yet be classified as structural vs local

## IDA-004 — deployed active-run contradiction

The live symptom is confirmed.

The root cause is not.

Possible categories could include:
- deployment version mismatch;
- wrong Supabase project/config;
- stale frontend;
- inconsistent migration deployment;
- separate runtime state issue.

CA deliberately does **not** select one without reproduction.

### Classification

**PENDING DIAGNOSIS**

Do not redesign architecture around a guessed cause.

---

## IDA-007 / NV-PF-01 / NV-PF-02

These are acceptance/readiness uncertainties, not confirmed defects.

### Classification

**PENDING LIVE / BROWSER VERIFICATION**

---

# 6. Consolidated root-cause map

```text
STRUCTURAL FAMILY S1
Legacy/formal lifecycle not cleanly separated
    ├─ IDA-001 legacy pre-run gameplay
    ├─ IDA-002 legacy first-choice reveal
    ├─ IDA-005 Teacher shadow controls
    └─ PFC-001 post-completion fallback / ACT14 unreachable


STRUCTURAL FAMILY S2
Fragmented transition ownership across runtime modules
    ├─ IDA-003 split formal startup
    └─ PFC-008 ACT5 terminal payoff overwritten by ACT6 auto-init


STRUCTURAL FAMILY S3
No unified per-player accepted/locked/waiting contract
    ├─ PFC-002 controls disappear without wait explanation
    └─ PFC-003 accepted actions remain actionable


STRUCTURAL FAMILY S4
Pocket/evidence not implemented as cross-ACT player capability
    └─ PFC-005 ACT1–5 evidence UI absent


STRUCTURAL FAMILY S5
RPC-centric validation; no real product-journey browser harness
    └─ IDA-006


LOCALIZED DEFECTS
    ├─ PFC-004 stale Sprint6 status
    ├─ PFC-006 missing specific ACT4/Main Gate anchor/UI integration
    └─ PFC-007 missing ACT4 Reveal rendering


PENDING DIAGNOSIS / ACCEPTANCE
    ├─ IDA-004 deployed active-run contradiction
    ├─ IDA-007 live Asset Manager ACTIVE state
    ├─ NV-PF-01 placeholder rendered readability
    └─ NV-PF-02 audio perceptual completeness
```

---

# 7. Quantitative classification

Among the **14 material remediation findings**:

### Structural-family findings

```text
11 / 14
```

- IDA-001
- IDA-002
- IDA-003
- IDA-005
- IDA-006
- PFC-001
- PFC-002
- PFC-003
- PFC-005
- PFC-008
- plus IDA-004 remains unclassified pending diagnosis, so it is not counted as structural here

More precisely:

```text
10 confirmed structural-family findings
+ 1 structural QA finding (IDA-006)
= 11
```

### Localized confirmed findings

```text
3 / 14
```

- PFC-004
- PFC-006
- PFC-007

### Pending diagnosis within the 14

```text
1 / 14
```

- IDA-004

Because IDA-004 is included in the 14, the categories overlap only if one counts structural QA separately. The clean mutually exclusive count is:

```text
Structural runtime/product = 10
Structural QA/test = 1
Localized = 2? 
```

That expression is misleading because PFC-006 and PFC-007 are both localized and PFC-004 is localized.

The correct mutually exclusive count is therefore:

```text
Structural runtime/product: 9
Structural QA/test:          1
Localized:                   3
Pending diagnosis:           1
Total:                      14
```

Structural runtime/product IDs:
- IDA-001
- IDA-002
- IDA-003
- IDA-005
- PFC-001
- PFC-002
- PFC-003
- PFC-005
- PFC-008

Structural QA/test:
- IDA-006

Localized:
- PFC-004
- PFC-006
- PFC-007

Pending:
- IDA-004

---

# 8. CA assessment

## 8.1 Is the project mainly suffering from many small bugs?

**No.**

The audit evidence points to a smaller number of architectural mismatches:

1. legacy prototype and formal product share the same root lifecycle surface;
2. formal transitions are owned by separate modules without one player-visible completion boundary;
3. per-player waiting/lock acknowledgement has no shared runtime contract;
4. persistent evidence/Pocket state is not treated as a first-class capability across all ACTs;
5. validation focuses on RPC correctness rather than composed browser behavior.

Those structural conditions generate many apparently unrelated symptoms.

## 8.2 Does this imply a full rewrite?

**No.**

The formal server implementations for:
- role-specific ACT1;
- canonical discussion;
- privacy;
- later mutation authority;
- Teacher Override provenance;
- finalization/export integrity;
- asset resolver/anchor framework

are largely reusable.

The audit supports a **bounded structural refactor**, not a restart-from-zero rewrite.

## 8.3 Why patching symptoms first is risky

If CD repairs the findings as independent tickets without recognizing the structural families:

- IDA-001 may be hidden while PFC-001 remains;
- one waiting screen may improve while the same ambiguity remains in later acts;
- ACT3 may get a special Number Note button while the persistent Pocket model remains absent;
- ACT5 may get a cinematic delay while transition ownership stays fragmented;
- server tests may all pass again without proving the real browser journey.

That would increase exactly the risk the Teacher has raised:

> code accumulates fixes without the implementer holding a coherent model of the product.

---

# 9. Recommended remediation planning principle for GA

This report does **not** prescribe implementation mechanics to CD.

For scope planning, CA recommends that GA organize remediation by **root structural families first**, not by raw issue-ID order:

```text
A. lifecycle / legacy-formal separation
B. transition ownership / formal handoff boundaries
C. per-player submitted-locked-waiting contract
D. Pocket/evidence cross-ACT capability
E. browser-level product journey validation

then

F. localized integration defects
   - stale status clearing
   - ACT4/Main Gate anchor/UI integration
   - ACT4 Reveal rendering

and separately

G. reproduce IDA-004
H. live/browser acceptance for NOT VERIFIED media/audio items
```

This gives CD the problem architecture without telling CD the exact algorithm, schema, helper decomposition or implementation sequence.

---

# 10. Final conclusion

The combined CA audits show that the current Castle Escape problems are **predominantly structural rather than a random accumulation of small coding mistakes**.

The most important remediation decision is therefore not:

> "How do we patch 14 findings?"

but:

> "How do we correct the small number of cross-cutting lifecycle/state/player-surface structures that generated most of those findings, while preserving the already-correct canonical backend contracts?"

CA considers this classification sufficient for GA + Teacher to freeze a bounded remediation scope.
