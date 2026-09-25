# Sprint 8 ACT6 Residual — Narrow Focused Level 1 Re-audit

Frozen baseline: `2cc4b642bc86c4d8fb1b1631ca0ae394ed886913`  
Prior baseline: `3d357ddc42e8232246bf649b5cb63a3e7ecea1fc`  
Finding: `S8-CA-001-R2 HIGH`  
Decision: **PASS — SPRINT8 VERIFIED / MILESTONE LEVEL3 SNAPSHOT REQUIRED BEFORE SPRINT9**

## 1. Finding closure

`S8-CA-001-R2 = FIXED_VERIFIED`

Migration053 now separates the two ACT6 terminal-resolution forms.

### Majority resolution

The verifier requires:
- a `player_majority` resolved ACT6 round;
- exactly three submissions in that round;
- at least two submissions matching authoritative `act6_resolution`.

### Second-round 1:1:1 fallback

The verifier binds `portrait_fixed_fallback` specifically to:
- ACT6 round 2;
- exactly three round-2 submissions;
- three distinct round-2 choices.

Round-1 tie evidence can no longer substitute for the effective fallback round.

## 2. Negative regression quality

The updated transactional regression does not reuse the product's previous wrong selector.

It first independently asserts that the fixture is a legitimate two-tie fallback:
- round 1 = 3 submissions / 3 distinct choices;
- round 2 = 3 submissions / 3 distinct choices;
- authoritative resolution = `portrait_fixed_fallback`.

It then deletes only round-2 votes and requires:
- `act6.effective_vote.state = missing_technical_evidence`;
- whole-report `verified=false`.

After rollback, the clean baseline must verify again.

This closes the prior Pattern F self-confirming-test gap.

## 3. Scope / ownership check

Correction interval changes are limited to:
- migration053;
- adjacent Sprint8 transactional/static regression;
- audit/governance/log/status artifacts.

Migrations001–052 were not modified.

No protected canonical localization/game-script/visual source changed.

No ISA authority boundary was crossed.

Canonical Ownership Check: **PASS**.

## 4. Sprint8 aggregate disposition

All Sprint8 findings are now closed:

- S8-CA-001 = FIXED_VERIFIED through final ACT6 residual closure;
- S8-CA-002 = FIXED_VERIFIED;
- S8-CA-003 = FIXED_VERIFIED;
- S8-CA-004 = FIXED_VERIFIED;
- S8-CA-005 = FIXED_VERIFIED;
- S8-CA-006 = FIXED_VERIFIED;
- S8-RC-001 = FIXED_VERIFIED;
- S8-RC-002 = FIXED_VERIFIED;
- ISA override-state defect = FIXED_VERIFIED;
- ISA override-scope masking defect = FIXED_VERIFIED;
- stale Sprint8 live assertion = FIXED_VERIFIED.

Sprint8 regular/focused closure is therefore complete.

## 5. Pre-Approval Gate — next-scope risk forecast

Before any Sprint9 release, the mandatory milestone Full Independent Snapshot must challenge at least:

1. cross-sprint lifecycle coupling from ACT1 → ACT14 after cumulative migrations001–053;
2. hidden stale-request / cross-run identity paths outside the focused Sprint8 finalizer;
3. Teacher Override provenance / validity interactions across early and late acts;
4. current-state vs historical-evidence mismatches not exercised by local sprint tests;
5. NORMAL / AUDIT isolation and export-dataset eligibility after all cumulative changes;
6. canonical ownership / localization / asset-authority drift across the integrated repository;
7. reconnect / duplicate / concurrency interactions spanning DiscussionRoom, Sprint5, Sprint6 and finalization;
8. self-confirming regressions where product and test share the same helper/selector assumptions.

These are milestone-audit targets, not new findings.

## 6. Gate

`SPRINT8 = VERIFIED PASS`

But:

`SPRINT9 = NOT YET RELEASED`

The project governance requires a **Full Independent Snapshot — Level 3** over the integrated ACT1–14 baseline before Sprint9/10 progression.

Next owner: **CA**.

Next action: run the milestone Level3 snapshot against baseline `2cc4b642bc86c4d8fb1b1631ca0ae394ed886913`.
