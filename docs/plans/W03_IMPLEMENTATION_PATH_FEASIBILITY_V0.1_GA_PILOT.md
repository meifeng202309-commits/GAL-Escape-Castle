# W03 implementation-path bounded investigation — GA V0.1
**Status:** SOURCE_STATIC STUDY / RECOMMENDED_ADVISORY ONLY / NO CODING AUTHORIZATION
**Date:** 2026-10-10 | **Branch:** remediation/sprint9-structural-v1

## 1. Frozen CD boundary and approved acceptance
- CD code/test checkpoint: `c4bdd2e96259d94ba543720c7d7d71c0d445b559` (A1/CA-176); CD FROZEN, no deployment authorization.
- `docs/plans/Debug Implementation Plan V4.md` §7 W03 requires a single coherent bilingual take-items-and-leave user action; selection remains separate; canonical GRAB and leave effects remain distinct. One logical request UUID covers action, replay is idempotent, conflicting reuse fails, group barrier and next discussion exactly once. Required normal/retry/concurrent/reconnect/optional-item tests. W03 follows B-min minimum and normal release boundaries; current investigation is not authorization to implement W03.

## 2. Source evidence — VERIFIED only as SOURCE_STATIC
- `src/game/app.js`, blob `c6d049dececb16af386418253d5dc55103f935a0`, `renderSprint3b` approx. lines 501–502 currently creates **two distinct buttons**: `s3b_grab` while `!me.grab_complete`, then `s3b_leave_start_room` while `!me.left_start_room`. This is an evidenced UI/acceptance mismatch against V4 W03, not independently verified against deployment.
- `database/014b_sprint3b_targeted_closure_corrections.sql`, blob `098415aa7694ab008f7a8ecaa3eca755fcef9003`, defines separate `s3b_grab(text,text)` and `s3b_leave_start_room(text,text)` wrappers at lines 118–126; both lock active `game_runs`, log distinct events and call respective `*_pre014` functions. This selected migration is **not proved repository-last**, and its exposed signatures have no logical-action request UUID argument.
- `tests/sprint3b-remediation-static-check.js` and other `tests/sprint3b-*e2e.js` files exist; this study has not executed or inventoried effective test coverage. No direct evidence establishes server transaction, current idempotency, effective grants, previous function implementations, or deployed state. Mark all as NOT_VERIFIED.

## 3. Candidate integration checkpoints
**IC-W03-ENTRY (PROPOSED with limited static evidence):** authenticated player in current S3B phase; eligible discovered item selection captured separately; actual GRAB and leave facts owned by server; intended logical request identity and current run/phase state needed.
**IC-W03-EXIT (PROPOSED):** one user confirmation yields one atomic authoritative transaction representing GRAB + leave; correctly selected eligible items acquired; `grab_complete`, `left_start_room` and physical location reflect canonical truth; two distinct canonical events exist without duplication; three-player barrier/next Discussion exactly once; reconnection and same-request retry return durable committed result, conflicting UUID reuse rejected.
**Consumer:** real legacy Player buttons and RPCs are SOURCE_STATIC VERIFIED; **new combined server entrypoint, request identity signature and final UI callsite are PROPOSED, not frozen adapter**. No actual new helper consumer established.

## 4. Routes and economics
**Route A — server-owned idempotent one-action wrapper + bounded existing UI cutover:** Most directly follows V4 §7's chosen solution. Reuse established domain methods only if safe inside one transaction, one request identity and exactly-once side effects. Avoid naive sequential network calls. Domain mutation, locking, idempotency and canonical event correctness remain CD-owned, subject to CA. Status RECOMMENDED_ADVISORY as an approach already in V4; effective SQL feasibility NOT_VERIFIED.
**Route B — UI one button issuing sequential legacy GRAB then leave RPCs:** Lower nominal frontend effort but lost response/interleaving between requests breaks single logical UUID/atomicity/once-only semantics. **REJECTED** under approved W03 acceptance; not a viable equivalent route.
**Route C — new generic multi-action workflow engine:** Could unify other future actions but adds speculative abstraction, blast radius, integration/tests and authority risk without demonstrated consumers. **REJECTED** for W03; not a justified TCA task.
No artificial numerical route score: V4 strongly constrains the correct behavior; Route A requires real backend work. Only a source-grounded bounded variant might lower cost; choosing integration detail belongs to authorized CD.

## 5. TCA prebuilt-block opportunities and stop decision
**Candidate input validator/formatter:** no proven additional consumer or nonredundant operation; selection and eligibility are server-authoritative. Building a generic helper here risks duplicated code and false confidence. **R/BLOCKED**.
**Candidate UI combined-action button component:** legacy callsite exists, but final server RPC name/signature, request UUID contract, error/retry behavior and approved adapter are not frozen. A prebuilt button would couple to speculative API. **R/BLOCKED**.
**Candidate W03 negative test vectors/fixtures:** W03 acceptance already specifies the needed vectors, but fixture schema and idempotency receipts are not pinned; inventing mock RPC semantics now may increase future CD rewrites. A non-code acceptance matrix could be made within future ordinary planning, but an isolated production Pack is not warranted. **R/BLOCKED FOR CODING**.

**Result: 0 S-grade TCA production Packs; no code authorization.** STOP further speculative Pack decomposition under the agreed search ceiling. Do not expand to C/D/E/F just to sustain agent utilization.

## 6. CD resume / valuable side findings
- **W03-01 confirmed static gap:** UI has separate GRAB and leave buttons despite V4 single coherent action. Actual production/deployed behavior not verified.
- **W03-02 architecture-sensitive risk:** selected SQL migration exposes two separate wrappers with distinct events and no visible single-action UUID, so idempotent transaction semantics must be traced across repository-last definitions before implementation. This is not a claim that current server is broken under old two-step contract.
- **W03-03 test evidence gap:** concurrency, lost response/retry, optional item correctness and exactly-one-next-discussion W03 acceptance remain NOT_RUN in this study.
Preserve these findings in the TCA-period engineering findings register; require source contract and normal CA/CD release before implementing.

## 7. Independent challenges requested
CA: independently establish effective backend source and mutation/idempotency authority, whether any existing reusable safe wrapper/receipt exists, and whether Route A actually satisfies V4 without duplicated events. TCA: independently challenge whether smaller genuine source-stable nonredundant prebuild exists, actual consumer and credible net CD savings. Both must respect CD freeze.
