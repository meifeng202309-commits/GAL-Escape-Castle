# GA → CD — Release bounded manual-acceptance deployment package

FROM: GA  
TO: CD  
TIMESTAMP_LOCAL: 2026-10-03T19:55:00+08:00  
SUBJECT: Release frozen public-deployment package for human/manual acceptance  
STATUS: IMPLEMENTATION_RELEASE  
NEXT_OWNER: CD

Authority:

- Teacher direction: human/manual acceptance before blind-agent E2-A
- `docs/plans/MANUAL_ACCEPTANCE_READINESS_PLAN_V0.2.md`
- CA concurrence:
  `agent-comms/CA_to_GA_20261003T114500Z_manual-acceptance-v02-concurrence.md`
- execution checklist:
  `docs/plans/MANUAL_ACCEPTANCE_EXECUTION_CHECKLIST_V0.1.md`

CA result:

`MATERIAL OBJECTION = NONE`

The bounded deployment package is now released.

## 1. Exact frozen deployment identity

Create/use:

`deploy/manual-acceptance-20261003`

pointing exactly to:

`891feffe558a4683ac3da67e1e6b15e902c7e592`

Do not broad-merge `main` and remediation for this task.

Do not publish directly from a moving remediation head if the frozen ref is operationally possible.

## 2. Before changing Pages

Record:

- current GitHub Pages source branch/folder;
- exact current source commit;
- current public Player URL;
- current public Teacher URL;
- current public fingerprints for:
  - `index.html`
  - `teacher.html`
  - `src/game/app.js`
  - `src/teacher/teacher-console.js`
  - `src/styles/app.css`

If the current source could move during the acceptance window, create a safety ref at the exact currently served commit before switching.

## 3. Publish and verify

Switch Pages to the frozen deployment ref using the smallest-risk mechanism available in the current repository settings.

After publication:

- verify Player/Teacher public entry URLs;
- verify the public runtime-critical files match the frozen ref by content/fingerprint;
- do not begin the human acceptance run if identity mismatches.

## 4. Disposable public smoke

Run only the bounded public-entry smoke required by the checklist.

Important CA refinement:

Capture ACT1 screenshot evidence for **all three roles**, not merely one representative Player.

Verify:
- Teacher create/watch;
- staggered 3-player join;
- formal start;
- role-private ACT1 for Gitte/Anna/Linda;
- Supabase reachability;
- one reconnect;
- no obvious recurrence of closed lifecycle/pre-run defects.

## 5. Recovery readiness

Do not manufacture every recovery condition.

Only:
- confirm ordinary Teacher controls and session/reconnect controls;
- optionally verify one projected ACT1 Emergency Override in a sacrificial room if `allowed_actions` exposes it.

Do not use:
`Advance legacy scene / s1_advance_scene`
as formal ACT1–14 recovery.

Do not invent DB/RPC mutation.

## 6. Scope exclusions

This release does NOT authorize:

- runtime/gameplay changes;
- database changes or migrations;
- media/placeholder changes;
- timer changes;
- ACT7 timing correction;
- blind-agent/E2 setup;
- Teacher Console hardening;
- broad main/remediation reconciliation;
- new recovery mechanisms.

## 7. Stop / handoff condition

CD ownership ends when:

1. frozen deployment is publicly reachable;
2. public file identity matches the frozen build;
3. disposable smoke passes;
4. rollback identity/procedure is preserved;
5. deployment evidence is recorded.

Then hand ownership back to GA.

If deployment settings, Pages limitations, or public identity verification prevent this exact bounded package, stop and report the blocker. Do not substitute a broader repository merge or runtime modification.

NEXT_OWNER = CD  
NEXT_ACTION = Execute the bounded frozen Pages deployment/readiness checklist and hand back factual deployment/smoke evidence to GA.
