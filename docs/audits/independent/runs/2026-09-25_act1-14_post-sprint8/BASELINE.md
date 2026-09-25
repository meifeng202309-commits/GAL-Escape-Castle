# ACT1–14 Post-Sprint8 Full Independent Snapshot — Baseline

Audit level: **Level 3 — Full Independent Snapshot**  
Audit date: 2026-09-25  
Frozen product baseline: `2cc4b642bc86c4d8fb1b1631ca0ae394ed886913`  
Last completed regular gate: **Sprint8 VERIFIED PASS**  
Next development scope: Sprint9, **NOT RELEASED** pending this snapshot.

## Scope

Integrated formal runtime:

```text
ACT1 → ACT14
Player clients
DiscussionRoom
Pocket / Knowledge / Shared Photo / Group Items
Teacher Override
Asset Manager runtime surfaces already implemented
ACT6–13 runtime
Teacher Console
ACT14 finalization
JSON / CSV export
NORMAL / AUDIT
sequential formal runs in one room
```

The snapshot includes cumulative migrations `001–053`.

The prior ACT1–13 full independent snapshot findings `IDA-001..IDA-006` were previously closed. This audit does not reopen them by assumption; it tests whether Sprint7/8 and migrations043–053 created new cross-layer failures around the previously verified runtime.

## New authority/evidence domains since the prior full snapshot

- Sprint7 Teacher Console: migrations043–045;
- Sprint8 finalization/export: migrations046–053;
- completed-run lifecycle;
- run-bound finalization;
- semantic session-integrity verifier;
- canonical JSON/CSV export;
- CD/ISA integrated verification-support tests.

## Freeze verification

The latest product commit is:

`2cc4b642bc86c4d8fb1b1631ca0ae394ed886913 — Bind ACT6 integrity to effective round`

Later commits visible during the audit are CA audit/status/communication artifacts only. No later CD product implementation was observed.

## Canonical sources

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`
- `docs/specs/current/Codex程序开发说明书 V2.4.md`
- `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`
- `docs/specs/current/Castle Visual V2.1.md`
- `assets/asset-registry.json`

## Evidence classes used

- static control-flow proof;
- migration/schema/RPC proof;
- existing live-E2E evidence reviewed adversarially;
- client/Teacher cross-layer trace;
- commit-history/canonical provenance;
- regression/test blind-spot analysis.

Physical three-device RC and full production asset/audio acceptance remain future Sprint9/10 evidence boundaries and are not converted into current defects merely because they are not yet verified.
