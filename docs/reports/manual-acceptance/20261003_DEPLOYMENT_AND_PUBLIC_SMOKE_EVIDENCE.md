# Manual Acceptance Deployment and Public Smoke Evidence — 2026-10-03

## Outcome

`PASS` — the frozen manual-acceptance frontend is publicly served, its runtime-critical files match the frozen tree, and the bounded disposable public-entry smoke completed successfully.

This evidence does not claim completion of the human ACT1–ACT14 manual acceptance run. That run now belongs to GA/Teacher.

## Frozen deployment identity

- Frozen commit: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- Pages source: `deploy/manual-acceptance-20261003` / `/(root)`
- Remote deployment ref verified at: `891feffe558a4683ac3da67e1e6b15e902c7e592`
- GitHub Pages workflow run: `37120974327`
- GitHub UI reported deployment time: `2026-10-03 19:51 GMT+8`
- Player: <https://meifeng202309-commits.github.io/GAL-Escape-Castle/>
- Teacher: <https://meifeng202309-commits.github.io/GAL-Escape-Castle/teacher.html>

## Pre-switch identity and rollback anchor

- Prior Pages source: `main` / `/(root)`
- Prior source commit: `652b7c4cc49bf247e4ce7e59620f05ffe8a16825`
- Safety ref: `safety/pages-before-manual-acceptance-20261003`
- Remote safety ref verified at: `652b7c4cc49bf247e4ce7e59620f05ffe8a16825`

Pre-switch public SHA-256:

| File | SHA-256 |
|---|---|
| `index.html` | `1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4` |
| `teacher.html` | `0d3d61ab59295ba3ae69b14a5fcabb6ed2ecf951fc1c3a12c5505101040c088f` |
| `src/game/app.js` | `6d6fa7a7792560b077f1ea6dd089148c5455731b5631aae7555884f5bccbb6b5` |
| `src/teacher/teacher-console.js` | `c7f0e0d2b84cc216bf2a399059b1ca34dad1b4be1ed8dd555278621bf964772b` |
| `src/styles/app.css` | `cedf9c6b36c8a38bae35ae8cd68ecaac7f13c50dabbfa8bd960669ebd8244bb6` |

## Post-switch public fingerprint proof

All URLs returned HTTP `200`. The following public SHA-256 values exactly match the frozen deployment tree:

| File | Public/frozen SHA-256 |
|---|---|
| `index.html` | `1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4` |
| `teacher.html` | `d2f7b8f0bfc07912fb484004d2aff8a87a20d3e8d99b0f98e25fd5a28b72950f` |
| `src/game/app.js` | `9f19c27f92be9835ea5d9b48e196803dcee85eae032feb0f9e65fe3e97b323fa` |
| `src/teacher/teacher-console.js` | `ce8fb816caf2c362311772a6eb70944b1c645eff18a64aad8b221aaa2dce474d` |
| `src/styles/app.css` | `3a375c87aeec797e2b32f8ba383d91af9ef6f9e9d01bb40cf0e3faa0f04ead7c` |

## Disposable public smoke

- Canonical smoke room: `MAAFF3B4`
- Start: `2026-10-03T11:56:55.684Z`
- End: `2026-10-03T11:57:11.725Z`
- Result: `PASS`
- Browser topology: one isolated Teacher context plus three isolated Player contexts
- Join order: Gitte, Anna, Linda, staggered
- Teacher room creation/watch: passed
- Formal start: passed
- Three distinct role-private ACT1 surfaces: passed
- Supabase reachability through public frontend: passed
- Gitte refresh/reconnect: stored `GAL-A` identity and exact private ACT1 surface preserved
- Ordinary controls: formal start and refresh operations visible; three release-session controls rendered
- Material browser errors: `0`
- Ignored non-application noise: public root `favicon.ico` returned `404`

Canonical machine-readable evidence:

- `docs/reports/manual-acceptance/20261003-public-smoke/20261003115655_public-smoke.json`
- `docs/reports/manual-acceptance/20261003-public-smoke/20261003115655_teacher-pre-run-three-players.png`
- `docs/reports/manual-acceptance/20261003-public-smoke/20261003115655_act1-gitte.png`
- `docs/reports/manual-acceptance/20261003-public-smoke/20261003115655_act1-anna.png`
- `docs/reports/manual-acceptance/20261003-public-smoke/20261003115655_act1-linda.png`
- `docs/reports/manual-acceptance/20261003-public-smoke/20261003115655_act1-gitte-after-reconnect.png`
- `docs/reports/manual-acceptance/20261003-public-smoke/20261003115655_teacher-after-formal-start.png`

Test driver:

- `tests/manual-acceptance-public-smoke.mjs`

## Non-blocking observation

After the Gitte page reload, the `#playerLabel` chrome was blank. The saved session still identified `GAL-A` / Gitte, the complete role-private ACT1 surface was byte-for-byte equal to the pre-reload surface, the ACT1 action remained available, and the client did not return to the pre-run lifecycle. This is recorded as a presentation observation, not a lost-session or semantic failure. No runtime change was made because the released package explicitly forbids gameplay/frontend changes.

## Rollback procedure

If rollback is required:

1. In GitHub Pages settings, select `safety/pages-before-manual-acceptance-20261003` and `/(root)`.
2. Save and wait for the Pages workflow to finish.
3. Verify the five public fingerprints equal the pre-switch table above.
4. Record the rollback workflow run and completion time.

The exact rollback ref is remotely reachable and was verified after deployment.

## Boundary and ownership

The CD deployment package is complete. No runtime, gameplay, database, media, placeholder, timer, or Teacher Console implementation was changed. Ownership transfers to GA/Teacher for the human/manual ACT1–ACT14 acceptance run and its evidence capture.
