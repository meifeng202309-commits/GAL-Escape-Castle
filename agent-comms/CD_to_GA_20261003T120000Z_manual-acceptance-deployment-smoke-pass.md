# CD → GA — frozen manual-acceptance deployment and public smoke PASS

Timestamp: `2026-10-03T12:00:00Z`

## Authority

- `agent-comms/GA_to_CD_20261003T195500Z_release-manual-acceptance-deployment-package.md`
- `docs/plans/MANUAL_ACCEPTANCE_READINESS_PLAN_V0.2.md`
- `docs/plans/MANUAL_ACCEPTANCE_EXECUTION_CHECKLIST_V0.1.md`
- User action-time authorization to save the GitHub Pages source

## Result

`PASS`

CD completed the bounded deployment/readiness package and transfers ownership to GA/Teacher for the human ACT1–ACT14 manual acceptance run.

## Deployment identity

- Pages source: `deploy/manual-acceptance-20261003` / `/(root)`
- Frozen commit: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- Pages workflow: `37120974327`
- Player: <https://meifeng202309-commits.github.io/GAL-Escape-Castle/>
- Teacher: <https://meifeng202309-commits.github.io/GAL-Escape-Castle/teacher.html>
- All five required public runtime fingerprints match the frozen tree exactly.

Rollback is preserved by `safety/pages-before-manual-acceptance-20261003` at `652b7c4cc49bf247e4ce7e59620f05ffe8a16825` (the exact prior `main` Pages source commit).

## Public smoke

- Canonical disposable room: `MAAFF3B4`
- One Teacher plus three isolated Player contexts
- Staggered Gitte / Anna / Linda joins: PASS
- Formal start: PASS
- Three distinct role-private ACT1 surfaces: PASS
- Supabase public path: PASS
- Gitte refresh/reconnect retained stored `GAL-A` identity and exact private ACT1 surface: PASS
- Ordinary Teacher/session controls: PASS
- Material browser errors: `0`

Evidence:

- `docs/reports/manual-acceptance/20261003_DEPLOYMENT_AND_PUBLIC_SMOKE_EVIDENCE.md`
- `docs/reports/manual-acceptance/20261003-public-smoke/20261003115655_public-smoke.json`
- six canonical screenshots in the same evidence directory

## Non-blocking presentation observation

After Player reload, the `#playerLabel` chrome is blank even though the saved Gitte / `GAL-A` identity, exact ACT1 role-private surface, and action remain intact. CD classified this as non-blocking presentation evidence, not reconnect/session loss. It is explicitly recorded for the human run. No implementation change was made under this no-code deployment package.

## Ownership

- New owner: `GA / Teacher`
- Next action: execute the human/manual ACT1–ACT14 acceptance run under the frozen plan and record the required evidence, defects, extensions, interventions, and final classification.
- CD stops here unless GA returns a narrowly evidenced implementation residual.
