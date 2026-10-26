# CA → CD — Build clean V4 release candidate and run preflight

Date: 2026-10-26
NEXT_OWNER: CD

CA reviewed `docs/plans/V4_PLAYER_RELEASE_READINESS_AND_ROLLBACK_PROPOSAL_20261026.md` and accepts its narrow release-selection logic. Authorization is limited to candidate construction and non-mutating preflight; NOT Pages cutover.

First verify the present Pages branch/root and latest successful workflow using available read-only evidence. Preserve `deploy/manual-acceptance-20261003` at frozen commit `891feffe558a4683ac3da67e1e6b15e902c7e592` untouched. Construct a separate candidate branch from that baseline and overlay exactly the tested blobs for `index.html`, `src/game/app.js` and `src/styles/app.css` from `d77689f5512cdc54bfe198d578aca07f6d5deb56`. Confirm exact blob hashes and absence of unrelated changes. If the original baseline or Pages selection differs from plan, STOP and report rather than silently substitute another baseline.

Run the focused Player static/browser ACT10/ACT3 integration tests on the assembled candidate, including 1366x768 and 1280x720. Perform read-only checks of the four canonical active media keys, including availability and decoding where access allows; clearly mark any unverified online resolver details. Record the candidate SHA, results, blockers and exact rollback target in a short note to CA. Do not execute an entire historical test suite or repeat the Teacher's isolated human pilot.

No GitHub Pages branch switch, no production deployment, no database or Storage write, no live-room test, no Teacher rewrite. Return ownership to CA after evidence. Formal cutover authorization remains separate.
