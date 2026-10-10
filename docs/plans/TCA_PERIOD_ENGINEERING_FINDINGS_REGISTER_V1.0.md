# GAL Escape Castle — TCA Period Engineering Findings Register V1.0
**Owner:** GA; technical verification: CA; eventual remediation owner: CD **only after authorized resume**.  
**Status:** ACTIVE RECORD OF INVESTIGATION FINDINGS / NOT AN IMPLEMENTATION ORDER.  
**Purpose:** Retain valuable engineering by-products discovered during TCA-related feasibility, independent reviews and code inspections, even when the proposed TCA Pack fails the production-value gate. This document records facts separately from hypotheses, recommended verification and any separately authorized fix. It must not bypass normal V4 package order, CA gates, ownership or the frozen CD checkpoint.

## Usage rules
- New findings get stable IDs `TBF-###`, severity *hypothesis* and an evidence grade: `DECLARED_CANONICAL`, `SOURCE_STATIC`, `TEST_MOCK`, `DEPLOYED_VERIFIED`. Quote exact source path + blob/commit, owner and acceptance test; avoid unsupported declarations of deployed bugs.
- Status progression: `OPEN_INVESTIGATION` → `CONFIRMED_DEFECT` / `EXPECTED_BY_DESIGN` / `SUPERSEDED` / `NOT_REPRODUCIBLE` → `AUTHORIZED_FIX` → `VERIFIED_CLOSED`. Do not equate source mismatch with verified runtime defect.
- During CD freeze GA/CA/TCA can record and review only; do not directly edit production, database/RPC, deployment or CD-owned tests. Future CD reads this register at **normal, explicitly authorized resume**, triages each item against latest code/deployment and current V4 plan, and reports existing resolution or a bounded remediation proposal to CA as needed. A finding is not itself an automatic stop or execution authorization.
- To avoid code inflation, prefer an existing V4 work package and consumer over a standalone fix/utility. On closure include changed commit, tests and CA review evidence. Record negative outcomes too.
- Scope can include defect hypotheses, test blind spots, stale contracts, duplicate functionality risks and avoidable integration costs. Clearly separate “actual source defect” from “proposed design not yet implemented.”

## TBF-001 — Teacher location projection may show stale early-domain location in late ACTs
**Class:** SOURCE_STATIC semantic mismatch / suspected runtime defect (**not live-confirmed**).  
**Priority:** High for B-min/W05 acceptance, *not* emergency unfreeze.  
**State:** `OPEN_INVESTIGATION`.  
**Detection:** GA B-min path feasibility pilot; independently confirmed as source risk by CA and TCA.
**Required semantic contract:** `docs/plans/Debug Implementation Plan V4.md` §6, `docs/plans/W05_OPERATIONAL_LOCATION_SEMANTIC_CONTRACT_V1.0.md`. Through the per-Player ACT5→6 barrier S3B owns physical location; after all required Players enter ACT6, activated S5 owns shared location; valid S6 owns later shared location. Station A/B/C/WATCHER is an assignment, not a physical room. Teacher NORMAL should not expose private unrevealed choices.
**Source evidence:**
- `src/teacher/teacher-console.js` blob `b276e049ba98718b62f7b81f48657211a02ca37e` `loadOperationsState` reads `s7_get_teacher_console`; `renderOperationsState` renders `p.player_location`. **SOURCE_STATIC** only.
- `database/043_sprint7_teacher_console.sql` blob `56a077b53d162372671472ac3f83a964a8f6f76f` defines `s7_get_teacher_console` with Player JSON `player_location: pp.player_location` via `s3b_player_progress`.
- `database/044_sprint7_focused_level1_corrections.sql` blob `8b954cd3c86a3b152066e12e10a2fc855a3f40fb` **replaces the same function signature** and still emits `pp.player_location`, according to CA independent source review. Thus 043 is **not** last among 043/044. Full repository-last effective function/overload/grants and deployed DB state remain **NOT_VERIFIED**.
**Failure hypothesis:** Late ACT6–13 Teacher may display the historically correct S3B location as the *current* physical location rather than domain-owned S5/S6 location; role/status and location could be conflated. No live reproduction has been performed.
**Required future verification, not a prescribed fix:** CA/CD verify all effective `s7_get_teacher_console` migrations/overloads and grants, actual deployed definition, same-run producer ownership and current Teacher consumer. Reproduce ACT5→6 one/two/three entrants, ACT7 shared location, ACT11/12 Main Gate with independent station assignment, privacy negative, missing/contradictory owner case. Confirm whether W05 work already fixes it; do not install another location authority, new RPC or schema solely for this record.
**Potential remedy boundary (ADVISORY):** Under approved B-min scope, versioned shadow projection from domain-owned physical/transition/assignment/task states via existing Teacher read; cut over affected location/status binding and remove displaced old binding in same change. No implementation authorization or locked design from this suggestion.
**Dependencies / next owner:** CA validates effective authority when permitted; CD addresses within authorized B-min/W05 work; GA owns meaning/acceptance, not SQL implementation.
**Sources:** `docs/plans/B_MIN_IMPLEMENTATION_PATH_FEASIBILITY_V0.1_GA_PILOT.md` §8; `agent-comms/CA_to_GA_20261010T165000Z_implementation-path-v10-text-and-bmin-pilot-audit.md`; `agent-comms/TCA_to_GA_20261010T145000Z_bmin-feasibility-practitioner-review.md`.

## TBF-002 — Multi-domain Teacher read may combine inconsistent per-run transition facts
**Class:** TEST_GAP / architecture hazard (**not confirmed in current execution**).  
**Priority:** High for B-min acceptance. **State:** `OPEN_INVESTIGATION`. **Evidence:** `SOURCE_STATIC` + INFERRED risk, no deployed evidence.
**Concern:** As Teacher read assembles S3B, S5 and S6 facts during ACT5→6 or S5→S6 transitions, individually correct values from different state moments could falsely imply a physically impossible combination. A version tag by itself does not guarantee coherent snapshot or run identity.
**Reproduction / test obligation:** Use authoritative run identity and same-run ownership prerequisites; test one/two/third entrant, late S5/S6 handoff, overlapping polling, response-order reversal, partial/missing producer state and concurrent movement. Check effective SQL read transaction/snapshot semantics before suggesting synchronization. If existing single-statement SQL already guarantees consistency for scoped facts, document that and close without a fix.
**Owner:** CA review / later authorized CD implementation. **Sources:** same B-min CA/TCA reviews and corrected feasibility report §8.
**Boundary:** Do not create a new snapshot RPC, persisted mirror or cross-domain state engine without separate approved justification.

## TBF-003 — No verified consumer of proposed B-min shadow fields; prevent unused Pack output
**Class:** INTEGRATION_VALUE_GATE / not a bug in existing runtime.  
**Priority:** Before any TCA production Pack. **State:** `OPEN_INVESTIGATION`.
**Evidence:** Teacher `renderOperationsState` currently consumes legacy `player_location`; no pinned new-field adapter/cutover has been verified. A standalone formatter or projection helper would risk duplicating P01's unused five-slot output.
**Required closure evidence:** Real future consuming callsite or owner-approved stable adapter seam; an acceptance test which fails without new field and passes after proposed integration; net integration/test cost plausibly lower than CD direct work. Otherwise close as `NO_PACK_JUSTIFIED`, without writing module.
**Owner:** GA initial value check; TCA Pass-2; CA independent Pass-3. **Sources:** CA/TCA B-min reviews, P01 value-gate report.
**Boundary:** No new coding authorization implied.

## CD resume checklist for these findings
When CD is formally released, it should: (1) read active onboarding + current release boundary and this register; (2) check whether a later commit/deployment already resolves the item; (3) separate reproduced defect from source-static risk; (4) fold valid findings into the existing B-min/W05 work plan and tests; (5) follow CA authorization and normal logs/handoff; (6) mark each finding's resolution with evidence. Do not change frozen work solely because this register exists.

**Register history:** 2026-10-10: GA opened TBF-001–003 from B-min CA/TCA independent review. No production changes.
