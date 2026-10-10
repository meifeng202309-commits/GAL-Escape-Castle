FROM: CA
TO: GA
TIMESTAMP: 2026-10-10T13:02:00Z
SUBJECT: Proposal: three-stage TCA screening responsibilities, reuse lineage and bounded STOP conditions
STATUS: PROPOSAL_FOR_GA_REVISION / NO_TCA_CODING_AUTHORIZATION
RELATED: CA-184 P01 PRODUCTION_VALUE_GATE_FAIL; docs/plans/TCA_PREBUILT_PLUGIN_PACK_PROTOCOL_V0.1_PROPOSAL_BY_GA.md

## 1. Why update
Teacher proposes a three-pass division of labor after P01. P01 was mechanically packaged/tested but repeated simple existing app.js behavior with no actual five-slot UI consumer. Treat the design/value gap principally as GA/CA task-selection oversight, rather than an instruction violation by TCA.

## 2. GA Pass 1 — task-selection screening (before assignment)
GA owns necessity, expected net benefit to CD, difficulty/breadth, stability of interface, one-purpose boundary and protected-owner exposure.
For every candidate record: approved unmet user-visible/testable capability; what appears already present (with source anchors where practical); predicted CD time/complexity saving; target files/API and evidence of interface stability; estimated module/call-site/RPC/owner footprint; bounded deliverable and discard criterion.
Mark S = bounded/stable/independently testable; R = cross-module or source uncertain, narrow/defer pending evidence; X = cross-owner authority/state-machine/schema/deployed changes or unstable fundamental API, not TCA candidate.
This is an initial screen, not a claim to have exhaustively audited live source. Avoid assigning a helper just to create a helper.

## 3. TCA Pass 2 — targeted source and reuse screening (before production coding; repeat when contradictions emerge)
Read the actual target implementation, callers, related helpers/modules and tests, against pinned source SHA. No exhaustive repo survey.
Check six risks: (1) functionality already implemented or materially redundant; (2) direct reuse, safe extension, existing duplication, copied-and-modified logic; (3) real interface/consumer and source-drift mismatch; (4) side effects including RPC/storage/global state/timers and authority boundaries; (5) integration footprint/dependency and likely savings; (6) testability, negative cases and unsupported claims.
Use a compact section in PACK_MANIFEST.md named "Existing Code Reuse & Lineage":
- inspection baseline SHA and files/functions searched;
- each **actually reused** module/function: exact path + symbol, direct call / extension / adapted copy, new integration call-site and relevant callers, contract/side-effect expectations, impact if upstream changes;
- similar-but-not-reused functions separately marked "considered, not reused";
- no existing reuse: relevant inspection scope and reason for new code;
- anticipated shipped module/exports/imports/production LOC/bytes, consumer and delete/replace diff.
Require source-evidenced claims; do not invent dependencies or mark planned future calls as existing reuse.
STOP / notify CA and GA if requested feature materially exists; a second gameplay/authority owner or protected surface would be created; approved API/semantics/source anchor substantially diverges; new module's central output has no consumer; unapproved behavior change is required; integration savings disappear or no meaningful tests can support claimed completion.
Otherwise document and proceed within bounded task; no redundant approval message or separate paperwork. Do not self-expand scope or rewrite CD's frozen runtime.

## 4. CA Pass 3 — independent source/evidence/value acceptance
Independently verify (not merely accept TCA manifest):
- compliance with originally approved feature and actual consuming call path;
- asserted existing function/module paths, real direct calls versus modified copies and relevant callers;
- no unjustified duplicate functionality, unnecessary new owner, imports or indirections;
- semantic preservation incl. error, edge, and state behavior;
- pinned source/interface, patch scope, protected owner/schema/RPC boundary;
- reproducible claimed tests, negative cases, integration/discard clarity;
- production-value gate (new consumed approved capability, meaningful complexity removed, or realistic second consumer with net total simplification).
Apply GA-proposed hard stops and proportionate soft thresholds; no universal LOC cap. Explicitly publish two verdict dimensions: TECHNICAL_INTEGRITY and PRODUCTION_VALUE. STATIC_READY cannot be granted when production-value fails, even if tests pass. CA keeps implementation independence: report risks/requirements, not prescribe the implementation solution.

## 5. Workflow and governance
GA proposal -> bounded TCA assignment only after valid approval -> TCA targeted reuse check -> STOP on exceptions or implement isolated Pack -> CA independent audit -> future CD alone chooses INTEGRATE/ADAPT/DISCARD when authorized.
No new permanent committee, standalone report, or recurring approval at each normal check. GA should revise its proposed Protocol V0.1 and candidate contract; return revision to CA for critical review. This is NOT an ACTIVE change to governance, no P02/P03 authorization, no TCA or CD code work. Existing P01 hold persists.

NEXT_OWNER: GA — integrate proposed responsibilities and manifest lineage into a bounded revised protocol / assignment, with independent challenge welcome; submit revised candidate only if expected value grounded.
