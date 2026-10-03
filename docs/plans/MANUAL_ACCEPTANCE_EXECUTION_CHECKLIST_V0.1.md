# Manual Acceptance Execution Checklist V0.1

Authority:
- `docs/plans/MANUAL_ACCEPTANCE_READINESS_PLAN_V0.2.md`
- CA concurrence: `agent-comms/CA_to_GA_20261003T114500Z_manual-acceptance-v02-concurrence.md`

Purpose:
Execute the bounded public deployment/readiness work before the human/manual acceptance run.

## A. Deployment preparation — CD

- [x] Create frozen deployment ref:
  - `deploy/manual-acceptance-20261003`
  - exact target: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- [x] Record current GitHub Pages source branch/folder.
- [x] Record exact current source commit.
- [x] Record current public Player URL.
- [x] Record current public Teacher URL.
- [x] Record pre-switch public fingerprints for:
  - `index.html`
  - `teacher.html`
  - `src/game/app.js`
  - `src/teacher/teacher-console.js`
  - `src/styles/app.css`
- [x] If the current Pages source may move during the window, create a safety ref at the exact currently served commit.

## B. Publish frozen frontend — CD

- [x] Switch GitHub Pages to the frozen deployment ref / agreed folder.
- [x] Wait for Pages publication completion.
- [x] Verify public Player and Teacher entry points resolve.
- [x] Compare public runtime-critical file fingerprints against the frozen deployment tree.
- [x] Do not continue if identity mismatches.

## C. Disposable public smoke — CD with GA protocol ownership

- [x] Player page loads without material application errors.
- [x] Teacher page loads without material application errors.
- [x] Teacher can create/watch disposable room.
- [x] Three independent Player contexts can join.
- [x] Formal start works.
- [x] All three Players receive the correct role-private ACT1 surface.
- [x] Capture one ACT1 screenshot for EACH role:
  - GAL-A / Gitte
  - GAL-B / Anna
  - GAL-C / Linda
- [x] Supabase is reachable.
- [x] One Player refresh/reconnect preserves the run.
- [x] No obvious recurrence of legacy pre-run/lifecycle defects.

## D. Recovery readiness — bounded

- [x] Confirm ordinary Teacher controls render.
- [x] Confirm ordinary session/reconnect controls.
- [ ] Optional: in sacrificial room, verify one projected ACT1 Emergency Override only if `allowed_actions` exposes it.
- [x] Do NOT manufacture later runtime-group failures to test recovery.
- [x] Do NOT use `Advance legacy scene / s1_advance_scene` for formal ACT1–14 recovery.

## E. Rollback readiness — CD

- [x] Confirm exact pre-switch Pages source identity is recorded.
- [x] Confirm rollback procedure is operational:
  1. restore prior branch/folder;
  2. wait for Pages publish;
  3. verify restored public fingerprints;
  4. record completion.

## F. Release boundary

CD work stops after:
- frozen deployment is publicly reachable;
- identity verification passes;
- disposable smoke passes;
- rollback identity is preserved.

No runtime/gameplay/database/media/placeholder/timer/Teacher Console change is authorized in this package.

After CD handoff, GA/Teacher owns the human/manual acceptance run and evidence capture.
