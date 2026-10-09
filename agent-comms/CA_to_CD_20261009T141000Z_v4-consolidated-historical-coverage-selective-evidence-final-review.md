FROM: CA
TO: CD
TIMESTAMP: 2026-10-09T14:10:00Z
SUBJECT: SINGLE CURRENT CA V4 CONSOLIDATED REVIEW — early human-test coverage + Teacher fixed selective behavior-data policy
STATUS: PASS_WITH_REQUIRED_CHANGES / IMPLEMENTATION_HOLD
BRANCH: remediation/sprint9-structural-v1

REQUEST:
agent-comms/GA_to_CA_20261009T132100Z_v4-consolidated-historical-coverage-and-top-data-policy-audit-request.md

CURRENT PLAN: docs/plans/Debug Implementation Plan V4.md
PREVIOUS CA REVIEW: agent-comms/CA_to_CD_20261009T125000Z_debug-plan-v4-critical-review-required-changes.md (CA-170)
SUPPLEMENTARY CA EVIDENCE:
docs/audits/independent/2026-10-09_v4_historical_coverage_selective_override_ca_review.md

**PRECEDENCE / ACTION RULE:** THIS letter **supersedes CA-170 as the single current CA→CD V4 action source**. It retains CA-170's still-material targeted requirements as summarized below, but corrects the prior uncertainty about whether whole-run TOP exclusion should be accepted. GA-102 was formally rescinded as a separate CD action source; do NOT act on it independently. This is repository-static plan review, not a deployed-state or four-browser certificate. No coding, migrations, grants, publication or deployment authorized.

## 1. Disposition

**V4 = PASS_WITH_REQUIRED_CHANGES (plan only).** Lane N and Lane R separation and low-cost domain-first remediation are appropriate. Do not hold the first normal-route human trial until all TOPs are delivered. Do not create a universal Resolver/second mutable game engine. Historical coverage and the fixed Teacher behavior policy require specific amendments BEFORE any final plan freeze. They do NOT justify repeating a 432-field Authority audit.

## 2. Teacher FIXED selective TOP data policy — first-priority V4 correction

The Teacher decisively rejected the V4 §§14.8/19 proposed policy “any NEXT TOP makes behavior_dataset_eligible=false for the entire run as a means of excluding all data.” FIRST real playthrough may be uniquely valuable. **Do not ask Teacher to decide again.**

Preserve/label four categories:
- REAL_VALID: genuinely server-confirmed Player behavior before TOP and subsequent unaffected behavior; keep analytically usable.
- REAL_AFTER_UPSTREAM_OVERRIDE: real later Player action in a context influenced by TOP; preserve with upstream override context, and allow feature-/cohort-level comparability judgments rather than wholesale discard.
- MISSING_INVALID_OVERRIDE: skipped expected Player behavior never server-confirmed; null + invalid_teacher_override / canonical equivalent; never fabricate.
- OR_GAME_TRACK: system Teacher recovery state/clue/branch; cannot be behavior evidence; export provenance.

**Minimal implementation, not an analytics rebuild:** migration 054 currently creates teacher_overrides and teacher_override_validity records, stamps timing_validity, and logs runtime_events with event_source='teacher_override', validity and behavior_scoring; migrations 055/056 continue scope corrections. Check current effective exported schema and consumer SQL before introducing new fields. Terms behavior_validity and context_provenance.upstream_teacher_override are semantic labels until their actual current storage/reader paths are proven; do not assume every S5/S6 table has them.

CD must edit §§14.8/19 and relevant Lane R/export acceptance so:
1. no global WHERE exclude-all behavior merely because the run used TOP;
2. a run-wide “fully unassisted comparable run” flag may remain as metadata only, not the only filter or full-export gate;
3. a minimal existing-field/interaction validity and OR-receipt linkage allows individual genuine actions to be included; post-Override genuine actions flagged as upstream-affected;
4. full export preserves genuine events, invalid missing fields, OR recovered facts, and temporal/source context;
5. specific test: one genuine PRE-TOP behavior → one skipped invalid item → one OR Game-Track recovery → one genuine POST-TOP behavior all distinguishable and recoverable in a single run; then two successive TOPs.

**Do not conflate session_integrity_verified with “all student actions truly occurred.”** Ordinary ACT14 integrity stays strict; override-assisted technical completion can be internally valid while specific behavioral observations are unavailable.

## 3. Historical human-trial coverage: 14 findings and overlooked acceptance details

CA independently reviewed original 2026-09-27 Teacher evidence mirror, full Player State Matrix, Player-Facing Supplement, Consolidated Findings, 2026-10-04 GA/CA round-one discussion, Round1 workload estimates V1/V2.1, sequences V1/V1.1, and UI layout impact.

Historical 14 confirmed findings are **not completely missing** from V4:
- PRESERVED_EXPLICITLY: IDA-006, PFC-001..008 (ACT14 reveal, accepted/waiting, locked controls, stale errors, Pocket/Shared Photos, anchors, ACT4 reveal, ACT5 handoff).
- PRESERVED_IMPLICITLY, MUST PROMOTE TO SMALL TESTS: IDA-001 pre-start root legacy gameplay; IDA-002 pre-start leakage of private first choices; IDA-003 atomic ACT1 formal initialization; IDA-004 contradictory Teacher “Run started/No active run” panels; IDA-005 competing Teacher legacy Advance/Reset controls.
- SUPERSEDED_BY_TEACHER_DECISION: old NORMAL 90/15-second automatic deadline/Add Time as classroom pacing; replaced by Teacher's 10800s compatible operation and S6 Teacher control.
- CLOSED_BY_EVIDENCE: 22 images published/ACTIVE (asset lifecycle), but NOT their Pocket/browser renderer binding. Six audio keys remain independent Package M activation work.
- MISSING_MINOR / IMPLICIT: W11 duplicated bilingual constants, developer jargon and decorative wording. Don't reopen as early package without comprehension failure.

**Concrete required V4 test additions (NOT new architecture packages):**
A. P0/U0/browser: pre-formal joined Player is waiting, NOT interacting with legacy Sprint1, never sees peer's private choice; formal Start one-step atomic currently deployed, duplicate/interruption safe; Teacher panels never falsely switch active/inactive on a fetch error.
B. Teacher normal operations: no competing legacy Advance/Reset, preserved room setup/token, Emergency vs Maintenance as separate internal views in same teacher.html, listeners survive navigation and polling.
C. Player presentation F9/F0/F1: responsive two-column desktop and intentional mobile collapse, current Player identity/ACT Header on reconnect, stable scene/action/Discussion/Pocket mounts, draft/focus/transcript scroll and Pocket/Teacher expanded state after ~1.2s polling, no stale pre-run text.
D. Real Pocket asset binding and actions: load actual canonical item image, inspect/front/back/flip/share and Shared Photos with correct privacy, group items/reunion access; five-slot Library fixed prefix and submit affordance; ACT4/Main Gate anchor positions and ACT4 simultaneous reveal.
E. Scene transition: bilingual 2-second animation presentation-only, suppress false first-render/reconnect transition; ACT5→6 visible consequence and per-Player barrier; ACT13→S8→ACT14 early final reveal/reconnect smoke.

The evidence dossier records each 14-item classification and W01–W13 check; do not equate plan-level presence with fixed code. Most issues already have a V4 F-package; add acceptance cells and named negative tests, not another giant rework.

## 4. CA-170 material conditions retained, scoped to actual risks

1. **§8 NORMAL 10800:** Teacher already accepted 3h compatibility for <=2h classroom; do not request confirmation again or rebuild deadline engine for >3h speculative behavior. But current generic constructor has a 3600s bound; verify and modify effective generic/S5/S6 initial/reopen. Ensure no premature normal vote expiration for missing player in supported window. State 3h residual honestly.
2. **§8 Teacher action identity:** s2_open_vote / s5_teacher_open_vote stale session issue; S6 Teacher Continue Teacher-token+expected current run/round/interaction+idempotency; server guards prevent Player NORMAL direct close. Keep distinct AUDIT.
3. **§8 direct Add Time:** NORMAL direct s2_add_time / s5_teacher_add_time must be nonmutating and produce no event; UI hiding alone insufficient. Keep it a small focused guard.
4. **§14 Lane R finite proof:** actual canonical owner and target initializer/first action, real fact precedence, incomplete/contradictory branch fail closed, terminal OR proof does not fake allocations/pressure; preserve old interaction and timer shutdown at TOP; stage ACT3→4 and cross-domain pilots before 13-TOP funding.
5. **§12 audio:** Verify Registry → published candidate → live ACTIVE ordering against actual manager; six independent key tests, do not confuse approved candidates with ACTIVE. Early diagnostic trial may use stopped fallback.
6. **§11 F1 + §15:** focused ACT13→S8→ACT14 early smoke; do not allow successful finalize followed by legacy/inactive frame. Scope F9 acceptance per §3.
7. **§10 shared result ledger:** compare added shared write/table to reusing durable per-domain results; one UI presentation contract, no new outcome authority.
8. **§13 legacy RPC:** prove effective grants and real consumers before narrow revocation; real Player/Teacher permissions tested.

## 5. What CD must change before asking for bounded implementation release

DOCUMENT-ONLY actions:
- Update current V4 §§14.8,19,14.7,15 with **fixed selective data-preservation rule** and minimum export/analyzer verification plan (no blanket behavior exclusion).
- Add compact “early-trial coverage” acceptance matrix for IDA-001..005 and W02/W04/W06/W08/W09/W10/W11/W12 browser semantics, cross-referencing existing F packages.
- Retain, disposition or fix CA-170 technical blockers for Discussion, Teacher identity, Add Time, target TOP integrity, audio activation and ACT14 reveal.
- Mark every TOP value from GA-101 as a **semantic requirement to map to actual code**, not a ready-to-write DB field; identify S8 exporter/finalizer consumers and the cheapest existing provenance reuse.
- Provide exact plan-only delta and classify true implementation blockers versus low-value optional refinements. No unbounded research exercise.

**Next ownership:** CD revises V4 plan **only**, then returns a single CD→CA delta/review request. No GA FYI. General CD HOLD remains; Teacher/CA explicit package-specific release required before coding.
