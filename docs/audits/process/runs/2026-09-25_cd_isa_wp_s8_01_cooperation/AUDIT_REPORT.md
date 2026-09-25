# CD / ISA Cooperation Audit — WP-S8-01

Date: 2026-09-25  
Scope: first active CD/ISA cooperation cycle after ISA activation  
Active governance: `GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0.md` + Action Log Rules V1.1  
Decision: **PARTIALLY CONFORMING — execution boundary mostly correct; scheduling efficiency weak; CD Action Log noncompliant**

## 1. Reconstructed timeline

| UTC | Event | Evidence |
|---|---|---|
| 04:06:42 | CD committed `d3177ff9`, implementing migration048 corrections and a provisional ACT14 presentation | Git commit `d3177ff9` |
| 06:24 | GA activated ISA governance | `GA_to_ALL_20260925T062400Z_isa-role-activated.md` |
| 06:35 | CA allocated `WP-S8-01` ACT14 presentation to ISA as Class A | `CA_to_ISA_20260925T063500Z...` |
| 08:14:03 | CD committed `b8e8ace2`, strengthening Sprint5/Sprint8 live closure coverage | Git commit `b8e8ace2` |
| 08:14:31 | CD told ISA the provisional ACT14 implementation predated allocation, stopped further writes on the allocated presentation surfaces, and instructed ISA to continue | `CD_to_ISA_20260925T081431Z...` |
| 08:31–08:36 | ISA processed allocation, reconciled its branch, implemented presentation/CSS/test, and handed off | ISA-001..ISA-008 + `ISA_to_CD_20260925T083600Z...` |
| 09:36:34 | CD integrated ISA's three commits into main | `7632924`, `f8c5d51`, `ec44c36` |
| 09:37:59 | CD marked WP-S8-01 integrated and submitted Sprint8 focused re-audit baseline | CD→ISA + CD→CA messages |

## 2. Was CD incorrectly waiting for ISA?

**No — repository evidence does not support the claim that CD waited for ISA before starting its own Sprint8 work.**

The opposite is true for this first cycle:

- CD's main remediation commit `d3177ff9` predates ISA activation and CA allocation.
- After CA allocation, CD still committed `b8e8ace2` before ISA had processed the Work Package.
- `b8e8ace2` touched only CD-owned live-test coverage, not ISA's allocated ACT14 presentation surface.
- CD then explicitly stopped further writes on the allocated presentation surface and let ISA remain Active Writer.
- CD waited for ISA only at the **integration dependency**, which is correct: CD cannot integrate ISA work before ISA returns it.

The cooperation rule requires parallel opportunity; it does not require both agents to manufacture work simultaneously when one lane is already complete.

A future Class A violation would be:

> CD has unfinished independent CD-owned work but deliberately postpones it solely until ISA finishes an unrelated independent Work Package.

No such behavior is proven here.

## 3. However, the first cycle achieved little true parallel labor saving

Although post-allocation coordination was compliant, CA's first allocation happened **after CD had already authored a provisional fix for S8-CA-006** inside `d3177ff9`.

ISA therefore did not take a completely untouched task off CD's workload. It:
- inherited a main baseline that already contained staged ACT14 work;
- identified that the fade did not preserve the exterior;
- reworked the presentation;
- added a focused regression check.

This was useful correction/review work, but it was not the intended maximum-labor-saving pattern.

### Governance self-review

`GOVERNANCE_SELF_REVIEW_REQUIRED`

Root cause:
- CA checked agent-comms for newer CD handoffs before the first ISA allocation;
- but CA did not perform a sufficient **allocation preflight diff/commit check** against the open remediation baseline;
- therefore CA did not notice that CD had already implemented the intended ISA task.

This is a CA allocation-timing defect, not a CD/ISA product-authority violation.

### Required future control

Before allocating an ISA package against an already-open remediation gate, CA should verify:
1. current HEAD since the frozen failed baseline;
2. whether the target finding/files have already been materially implemented by CD;
3. whether the proposed ISA package still removes work rather than duplicates it.

If already implemented:
- allocate complementary tests/tooling;
- allocate another untouched finding;
- or do not allocate that package.

## 4. Single-writer / authority compliance

**PASS.**

After allocation:
- ISA remained Active Writer for ACT14 presentation;
- CD stopped further presentation writes until integration;
- CD's post-allocation `b8e8ace2` changed live tests, not ISA's allocated presentation files;
- ISA changed only `src/game/app.js`, `src/styles/app.css`, and one isolated presentation test;
- ISA changed no migration/canonical/server authority;
- CD retained migration048, DB semantics, lifecycle, integrity, export and final integration ownership.

## 5. Dependency-class compliance

**PASS.**

WP-S8-01 was correctly treated as Class A:
- ISA did not require unfinished CD output to implement its allocated presentation layer;
- no Class B plan/interface approval was fabricated;
- CD's finalized-state trigger remained the authority boundary;
- ISA escalated no semantic change.

## 6. Integration accountability

**PASS.**

CD:
- reviewed ISA branch head;
- consumed identifiable ISA commits;
- created distinct integration commits;
- declared `INTEGRATED_BY_CD`;
- included ISA provenance in the Sprint8 audit request;
- remained final implementation handoff owner.

This matches V1.0.

## 7. Process finding COOP-001 — CD Action Log is stale

Severity: **PROCESS MEDIUM**  
Status: **OPEN**

`CD_ACTION_LOG.csv` currently ends at `CD-026`.

Yet after Action Log Rules V1.1 became ACTIVE, CD performed multiple recordable actions, including:
- substantive commit `b8e8ace2`;
- formal CD→ISA coordination message;
- three runtime integration commits;
- formal CD→ISA integrated message;
- formal CD→CA focused re-audit request.

V1.1 §4 requires records for repository writes, formal inter-Agent messages, implementation-unit completion and responsibility handoff.

V1.1 §11 additionally requires commit-time reconciliation before substantive GitHub writes.

Therefore CD's cooperation trace is not compliant with the Action Log rules.

This does **not** erase the reconstructable commit/message provenance, but it weakens the exact shared-memory mechanism the ISA model depends on.

### Closure

Before CD's next substantive repository write, CD must:
- reconcile its own missing Action Log entries under the forgotten-entry rule;
- use current logging timestamps rather than falsifying historical timestamps;
- continue the CD sequence after `CD-026`.

CA should not write CD's log on CD's behalf.

## 8. ISA Action Log compliance

**PASS for the implementation interval reviewed.**

ISA-001..ISA-008 reconstruct:
- allocation intake;
- CD coordination;
- branch reconciliation;
- implementation commits;
- validation;
- handoff.

The subsequent CD integration message has not yet been processed/logged by ISA in the evidence inspected. Because Agents do not run autonomously in the background, that is not yet evidence of an ISA violation; it becomes recordable when ISA processes the message in an active ISA turn.

## 9. Cooperation-model disposition

The model itself remains sound.

The first trial shows two operational lessons:

1. **Do not confuse “parallel-capable” with “must always be simultaneously coding.”** Waiting at a true integration dependency is correct.
2. **Allocation must happen before duplicate implementation.** CA must preflight repository state before assigning an ISA package.

No change is needed to the core principles:
- CA allocates ownership envelopes;
- CD owns architecture/integration;
- ISA owns bounded support implementation;
- CD breaks circular dependencies;
- CA audits integrated output independently.

A small governance refinement — allocation preflight against current implementation state — should be considered by GA.
