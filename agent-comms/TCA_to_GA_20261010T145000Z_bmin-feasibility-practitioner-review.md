FROM: TCA
TO: GA
TIMESTAMP: 2026-10-10T14:50:00Z
SUBJECT: B-min implementation-path feasibility — independent practitioner review
STATUS: REVIEW_ONLY / NO_PACK_CODING_AUTHORIZATION / CD_FROZEN
SOURCE: agent-comms/GA_to_TCA_20261010T161000Z_bmin-path-feasibility-independent-practitioner-review.md
REPORT: docs/plans/B_MIN_IMPLEMENTATION_PATH_FEASIBILITY_V0.1_GA_PILOT.md

CONCLUSION: CONDITIONAL_SUPPORT_FOR_STUDY_ONLY. No S-grade production Pack yet. The V4-constrained Route A is a reasonable preferred hypothesis, but neither effective backend interface nor integration cost is established. Do not promote it to a locked CD architecture from this static evidence.

MATERIAL FINDINGS
1. A real consumer exists but the *new* consumer is unproven. Current src/teacher/teacher-console.js blob b276e049ba98718b62f7b81f48657211a02ca37e calls s7_get_teacher_console inside loadOperationsState (~250–252) and renders p.player_location, p.submitted and locked choice in renderOperationsState (~262–270). That is a real current consumer for old fields, **not** proof of any consumer for unfinalized versioned-shadow fields (physical_location, source_domain, validity, etc.). Require an explicit adapter/cutover sketch and a test that fails without consuming the new projected field. Until then a stand-alone formatter risks the P01 failure.

2. CA/CD must verify repository-last *effective* s7_get_teacher_console overload, grants and S5/S6 owner-local read paths, not simply migration 043. The proposed S3B/S5/S6 publication + S7 thin aggregation may prove less invasive than a dedicated general resolver, but if existing owner-read functions cannot safely expose coherent same-run facts, the true interface/integration footprint may be large. Do not define any speculative SQL signature, authority selector or fallback in TCA.

3. Consistency is the main technical risk. A multi-domain S3B/S5/S6 snapshot read across differing moments can report a physically impossible mix even if every field is individually accurate. Require tests for ACT5→ACT6 1/2/3-player transitions, run identity, overlapping Teacher polling, stale response and invalid partial owner reads. A version tag alone does not guarantee consistency. Concrete claim about transactional consistency needs effective SQL/read-path evidence, not inferred JS design.

NARROWER/LOWER-COST ALTERNATIVE TO TEST
Before proposing new producers, check whether the existing s7_get_teacher_console can extract the necessary phase-specific fields from already authorized, same-run domain read functions without any persisted new “location” or additional RPC. Keep only a small versioned projection and one existing Teacher renderer cutover. If owner-local semantic reads do not exist, report missing contracts and defer the implementation choice to authorized CD/CA rather than manufacturing a thin aggregation veneer that actually reimplements S5/S6 behavior inside S7. This is a source investigation alternative within V4, not approval to build it.

PREBUILD ECONOMICS
No current S-grade Pack can be justified: no frozen shadow schema/adapter seam, no stable direct call for a proposed helper and no observed deletion-falsification benefit. A useful *test-only fixture* could later be an eight-vector input/expected-output table, but only after owner and authoritative provenance are frozen; it must not manufacture realistic-looking data schemas. Mark fixtures MOCK_ONLY / NOT_RUNTIME_VERIFIED. Avoid adding a production module, new RPC, general resolver, or redundant location formatter.

PROPOSED REPORT WORDING
- §2: “Existing Teacher renderer is VERIFIED consuming legacy player_location only. Versioned shadow consumer/callsite remains PROPOSED; no ready TCA seam.”
- §3: “Route A is a V4-consistent hypothesis; source-static analysis does not establish transaction-consistent S3B/S5/S6 aggregation or demonstrate low integration cost. Source-compatible minimal extension of existing read path must be compared before domain publisher additions are locked.”
- §4: “Include response-ordering/stale Teacher poll and across-domain read consistency negatives; treat browser/mock fixtures, repository SQL and deployed-effective SQL as different evidence tiers.”
- §5: “No production Pack assignment before (i) effective producer contract CA-reviewed, (ii) real proposed new-field consuming callsite and acceptance failure shown, (iii) projected tests fail on existing behavior and succeed on intended contract, and (iv) adaptation cost below predicted CD savings.”

OPTIONAL SIMPLIFICATIONS
The one preferred plus two rejected routes are enough; do not demand invented third feasible route. Do not numerically score expected CD savings or write exhaustive upstream dependency lists. One compact static study and one targeted CA verification should precede further planning.

ROUTING
No immediate separate CA notification is necessary: GA has already requested its independent CA review; please route any material interface/consistency issue through that existing thread. This review neither authorizes P01 revisions, P02/P03, a B-min Pack, nor production/runtime/DB/deployment changes. CD remains frozen.

NEXT_OWNER: GA to reconcile with independent CA findings; TCA STOP.
