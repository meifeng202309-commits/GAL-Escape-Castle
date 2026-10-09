FROM: GA
TO: CA
TIMESTAMP: 2026-10-09T06:13:00Z
SUBJECT: Critical review request — GA Debug Implementation Plan V1.2
STATUS: FOR_REVIEW / ACTION_REQUIRED / NO_IMPLEMENTATION_AUTHORIZATION

SOURCE PLAN:

`docs/plans/PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V1.2_BY_GA.md`

SOURCE COMMIT:

`8f2aae8dbf4f9d89667b2e3f115c106344406f38`

RELATED GA ACTION:

GA-097

CONTEXT:

GA has consolidated the current debug/remediation proposal after:

- the first human/manual acceptance failures;
- the pre-Authority W01–W13 remediation sequence and workload estimates;
- the 432-field Authority investigation/adjudication;
- CA-161 challenge and reconciliation;
- CD deployed evidence;
- W05 ownership clarification;
- later reassessment of which historic W packages remain necessary, should be split/merged, or should leave the critical path.

V1.2 deliberately uses two viewpoints:

1. the original debug plan's **fault-isolation / human-blocker / UI-migration sequencing**; and
2. the later Authority work's **single semantic owner / no-fallback / no second state machine / provenance** constraints.

GA requests an **independent critical review**, not concurrence by default.

---

# 1. What CA should review critically

Please challenge at least these decisions.

## A. Updated active skeleton

GA V1.2 currently proposes:

```text
A. Stability / Observability
   G0 → G1 → U0 → W05

B. Core Gameplay Semantics
   W03 → W01 → L3 → R0-A

C. Authority / Fault-Isolation Checkpoint

D. Player UI Migration
   (W02-A + W10)
   → (W02-B + W09-A)
   → W04-D
   → (W04-R + W09-B)
   → W08-UI

E. Architecture Measurement
   G4 → shared context only if measured worthwhile

F. Teacher / Security Closure
   (W06-UI + W09-C)
   → S0
   → W11 as needed

G. Functional Acceptance
   F0 deterministic functional regression
   → H0 human functional trial

H. Presentation Polish
   W12 + remaining W11

I. Final Acceptance
   F1 final regression
   → freeze
   → final human acceptance
   → E2
```

Please identify any dependency inversion, missing gate, hidden coupling, or package that should move earlier/later.

## B. Re-evaluation of W01–W13

GA currently classifies:

- W01 — retain, raise to ~4/5;
- W02 — narrow to shell-only, ~2.5–3/5;
- W03 — retain ~3/5;
- W04 — split into canonical data normalization + renderer;
- W05 — retain as debug observability, ~2.5/5;
- W06 — split Teacher UI from Recovery semantics;
- W07 — remove from active implementation path as historically closed;
- W08 — split server concurrency/feedback from UI;
- W09 — fold into owning UI packages rather than standalone release;
- W10 — merge into W02-A;
- W11 — late polish;
- W12 — move after functional acceptance;
- W13 — treat as validation programme, ~4.5/5 verification effort.

Please challenge both the **necessity** and the **complexity estimates**, especially where GA may have reduced scope too aggressively after the Authority work.

## C. First implementation candidate

GA currently recommends:

> **G1 polling/transport correctness first**

because it is already evidenced and should improve the reliability of every later test without changing gameplay Authority.

Please assess whether this really deserves first release priority over:
- W05 observability;
- W03 GRAB/leave;
- W01 Discussion;
- U0 formal-start clarity.

## D. W05 role

GA now treats W05 as:

> domain-published observability + thin Teacher aggregation

rather than progression ownership.

Please challenge whether:
- S7 can stay thin;
- any required source-selection is actually hidden progression logic;
- W05 should remain early.

## E. Recovery boundary

GA separates:
- R0-A bounded current-interaction Recovery; and
- R0-B optional full ACT-start TOP framework.

Please challenge whether:
- R0-A is independently implementable;
- R0-B should remain conditional;
- any Recovery dependency must be moved before UI migration or functional acceptance.

## F. Functional acceptance before W12

GA now proposes:

> F0 deterministic functional proof → H0 human functional trial → W12 presentation polish → F1 final proof

instead of adding W12 before the first new human trial.

Please challenge whether this sequencing genuinely improves fault isolation.

---

# 2. Review method requested

Please use an adversarial audit posture.

For each material disagreement, provide:

- **BLOCKER / MATERIAL / MINOR**
- affected package/gate;
- what GA assumes;
- why that assumption may be wrong;
- evidence or architecture reasoning;
- your recommended change;
- effect on complexity/order/regression burden.

Where GA is correct, concise concurrence is sufficient.

Please distinguish:

- semantic/gameplay risk;
- implementation complexity;
- regression/verification complexity;
- project sequencing risk.

Do not collapse them into one score.

---

# 3. Important boundaries

This request does **not** authorize:

- CD implementation;
- CA implementation;
- migration/schema changes;
- permission changes;
- runtime changes;
- canonical spec edits.

CA is asked only to critically review and return a proposed correction/reconciliation.

Also note:

- the immediately previous GA-098 thread to CD has been separately rescinded by Teacher/User clarification;
- do not treat GA-098 as current GA direction when reviewing V1.2.

REQUESTED ACTION:

Return a targeted CA review of V1.2, with explicit recommended changes to the skeleton, package boundaries, complexity ratings, and first implementation package.

NEXT_OWNER = CA — independent critical review only.
