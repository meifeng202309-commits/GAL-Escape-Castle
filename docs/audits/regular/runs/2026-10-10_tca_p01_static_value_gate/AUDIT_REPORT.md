# CA Audit — TCA P01 Static / Production-Value Gate

**Date:** 2026-10-10  
**Role:** CA — Code Audit Agent  
**Result:** P01 source/package mechanically PASS; production-value gate FAIL; NOT STATIC_READY  
**Runtime effect:** none — P01 patch remains unapplied; CD remains frozen.

## 1. Trigger

- `agent-comms/GA_to_CA_20261010T205000Z_tca-plugin-pack-v01-proposal-and-pilot-candidates.md`
- `agent-comms/GA_to_CA_20261010T124000Z_p01-value-and-pack-growth-critical-review.md`
- `agent-comms/TCA_to_CA_20261010T122500Z_p01-packaging-correction-submitted.md`

GA requested an independent CA decision on P01 utility, Pack-growth controls and the pilot protocol. TCA separately requested the held STATIC_READY re-audit after correcting its self-contained integration patch.

## 2. Exact scope / baseline

Active remediation branch before this audit:
- `remediation/sprint9-structural-v1`
- HEAD `48ab9acab85b54d5506a1611207565641b75a71c`

Isolated TCA branch:
- `tca/p01-library-five-slot-draft-20261010`
- reviewed branch HEAD `2d393dd01acf1f4f0dcaadd60f8b0098733a6046`
- Pack: `tca-packs/P01_library-five-slot-input-model/`

Exact active target source:
- `src/game/app.js` blob `c6d049dececb16af386418253d5dc55103f935a0`
- the same blob is still present on the active remediation branch.

Reviewed P01 artifacts:
- `PACK_MANIFEST.md`
- `implementation/library-code-model.mjs`
- `tests/library-code-model.test.mjs`
- `integration.patch`
- `INTEGRATE_OR_DISCARD.md`

No active runtime file, database object, migration, grant, deployment or CD-owned source was changed by P01 preparation.

## 3. Authoritative / governing sources

- `docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md`
- `docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.4.md`
- `docs/onboarding/GAL_ESCAPE_CASTLE_Agent_Action_Log_Rules_V1.1.md`
- `agent-comms/inter_agent_talk_protocol V4.md`
- `docs/plans/Debug Implementation Plan V4.md`, especially F5/F9 Library input acceptance
- `docs/plans/TCA_PREBUILT_PLUGIN_PACK_PROTOCOL_V0.1_PROPOSAL_BY_GA.md` — proposal only, not ACTIVE governance.

## 4. Independent verification

### 4.1 Source-anchor / packaging

PASS.

The active `app.js` blob still equals the Pack's frozen target blob. The corrected `integration.patch` now contains the new runtime module hunk as well as the import/use changes, so the earlier packaging defect is closed.

### 4.2 Pure unit tests

PASS.

CA independently reran on Node v22.16.0:
- `node --check implementation/library-code-model.mjs`
- `node --check tests/library-code-model.test.mjs`
- `node --test tests/library-code-model.test.mjs`

Result: **7/7 tests passed**.

This verifies the isolated pure model only. Browser integration, Supabase/RPC behavior, deployment and full regressions remain NOT VERIFIED because the patch is intentionally unapplied.

## 5. Findings

### P01-CAV-001 — MEDIUM — production utility / abstraction value gate FAIL

The current active runtime already:
- reads `puzzle_locked_prefix`;
- computes `remaining = 5 - locked.length`;
- constrains the single suffix input length/pattern;
- composes `lockedPrefix + input.value`;
- submits through the existing authoritative RPC.

P01 adds a new production module/import and a richer five-position `slots` model, but the proposed integration patch does **not consume `slots`** and leaves the current single text input unchanged.

The current V4 F9 acceptance requires the Library to show its fixed prefix, **five input slots**, and submit affordance. P01 therefore does not itself deliver that user-visible acceptance cell. It mostly relocates already-working simple client composition into a new module.

No demonstrated second consumer or meaningful existing-complexity removal offsets the extra production surface.

**Disposition:** source-correct but economically negative as a present production abstraction.

### P01-CAV-002 — MEDIUM — proposed integration changes client failure semantics

The unapplied patch:
- silently returns when the model is incomplete instead of preserving the existing server submission/rejection path;
- can throw `TypeError` before the existing RPC `try/catch`.

These are not current runtime defects because the patch is not applied. They are additional reasons not to label the current Pack production-ready.

## 6. Canonical Ownership Check

**PASS.**

No protected canonical source was changed by the TCA Pack. No gameplay, localization, database, asset identity, deployment or runtime authority was claimed. P01 exists only as isolated optional draft material.

## 7. Recurring-error pattern scan

Because this is an isolated, unapplied TCA Pack rather than a CD runtime implementation:
- cross-module/distributed/reconnect mutation patterns are **NOT APPLICABLE to the current runtime**;
- authority/provenance boundary is **PASS**;
- test-evidence claim is **PASS for source/unit level**, while browser/runtime integration is **NOT VERIFIED**;
- future integration would require normal CD + CA review rather than inheriting this audit.

## 8. Pilot Pack value / growth rule

For the TCA pilot, STATIC_READY must not mean merely “the helper is syntactically correct.” Before promotion, a Pack must also pass a proportional utility/complexity gate.

At least one entry-value condition must be evidenced:
1. a net-new approved user-visible or testable capability is actually consumed by the target diff; or
2. meaningful existing complexity/duplication is removed; or
3. a real second consumer/reuse case reduces total complexity.

Hard reject/hold conditions include:
- equivalent existing functionality with no material improvement;
- unused core output or a new module whose principal value is not consumed;
- undeclared authority/network/storage/schema side effects;
- behavior changes outside approved semantics;
- inability to integrate/discard independently;
- unsupported test/verification claims.

Soft review triggers, not universal caps:
- more than one new production module for one small-purpose Pack;
- more than three exports or a new transitive runtime dependency;
- production LOC added roughly >2× LOC removed/replaced without clear new capability;
- >5 KB unminified shipped JS for a small UI helper;
- >2 unrelated production call sites / maintenance touchpoints.

Substantial functionality, necessary invariant protection and test-only fixtures may justify exceeding those prompts.

## 9. Final decision

```text
P01_SOURCE_PACKAGING        = PASS
P01_PURE_UNIT_TESTS         = PASS (CA independently reran 7/7)
P01_CANONICAL_OWNERSHIP     = PASS
P01_BROWSER_RUNTIME         = NOT VERIFIED / NOT APPLIED
P01_PRODUCTION_VALUE_GATE   = FAIL
P01_STATUS                  = DRAFT_RETAINED_FOR_PILOT_LEARNING
P01_STATIC_READY            = DENIED
P01_PRODUCTION_INTEGRATION  = NOT RECOMMENDED
```

The GA TCA protocol proposal is acceptable only as a **bounded pilot framework with the utility/complexity gate added before STATIC_READY**. It is not promoted to global governance by this audit.

P02/P03 are **not authorized automatically**. P02 remains entangled with still-evolving Player polling/render integration; P03 still depends on Teacher shell DOM/view choices. No substitute coding task is invented by CA.

## 10. Next ownership

- **TCA:** STOP P01; no further P01 rework and no P02/P03 coding.
- **CD:** remains FROZEN; no TCA coordination or runtime integration.
- **GA:** revise the pilot proposal to include the utility/complexity gate and either return one higher-value, source-stable candidate for CA review or explicitly defer further TCA coding until such a unit exists.
- **CA:** re-enters only on the next legitimate GA/TCA audit trigger.
