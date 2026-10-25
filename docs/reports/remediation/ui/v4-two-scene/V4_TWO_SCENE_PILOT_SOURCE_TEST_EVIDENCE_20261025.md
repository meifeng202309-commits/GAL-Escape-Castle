# V4 Two-Scene Isolated Pilot — Source/Test Evidence

**CD checkpoint:** CD-152  
**Authorized by:** `agent-comms/CA_to_CD_GA_20261025T030000Z_v4-pilot-isolated-source-authorized.md`  
**Design gate:** `agent-comms/GA_to_CA_CD_20261024T173500Z_v4-two-scene-pilot-design-gate.md`  
**Starting baseline:** `b813ce8667f05beea7df5911790c08dd8cf6b8ca`  
**Exact implementation baseline:** `5d11f1e`
**Date:** 2026-10-25

## Scope and isolation

The pilot is a removable shell under `pilots/v4-two-scene/`. It imports the real `src/game/app.js`, preserves the production element IDs and uses an isolated presentation adapter. The browser driver intercepts RPC calls with synthetic authoritative projections; it creates no room and writes no database, Storage, Pages or production state.

No change was made to `index.html`, `teacher.html`, `src/game/app.js`, the production renderer, backend semantics, migrations, assets or deployment configuration.

## Measured baseline versus V4 adapter

Both paths consumed the same ACT10 projection and 1.2-second production polling cadence for more than five seconds at 1366×768.

| Measurement | Unmodified production renderer | V4 shell + bounded adapter |
|---|---:|---:|
| Draft value | retained | retained |
| Focus | retained | retained |
| Selection `[1,2]` | retained | retained |
| Earlier-message scroll anchor `40px` | reset to `0px` | retained at `40px` |
| Horizontal overflow | none | none |

ACT3 numeric draft `739`, focus and selection `[1,2]` were retained across more than two polls. The adapter also replaces prior projected discussion/Pocket nodes rather than accumulating stale controls.

## Functional evidence

- ACT10: three isolated Player contexts, one per role, each sent exactly three messages; all three identities and all nine messages reached the shared projection.
- ACT10 typing pause: a focused draft and selection remained intact for 5.2 seconds across repeated polls.
- Teacher: the current `teacher.html` issued exactly one `s6_teacher_open_vote` with the expected run, phase, step, round and discussion identity; the shared projection acknowledged `discussion → voting` and `act10_discussion → act10_final_vote`.
- ACT3: the partial code submitted exactly once as `41739` (locked prefix `41` plus entered `739`).
- Pocket: inspect and flip bindings each fired exactly once; the refreshed panel retained an expanded item state.
- Responsive gate: ACT10 and ACT3 each passed 1440×900, 1366×768, 1280×720 and 768×1024 without horizontal overflow.

## Validation receipts

Passed:

```text
node tests/v4-two-scene-pilot-static-check.js
node tests/v4-two-scene-pilot-browser.mjs
node tests/a1-player-polling-static-check.js
node tests/a1-player-polling-browser.mjs
node tests/ca284-act10-teacher-open-vote-static-check.js
node tests/ca284-act10-teacher-open-vote-policy.test.js
node tests/ca284-act10-teacher-open-vote-browser.mjs
node tests/sprint6-static-check.js
node tests/structural-package-a-static-check.js
git diff --check
```

Browser receipt:

```json
{"act10Messages":9,"teacherOpenVote":1,"act3Submits":1,"pocketInspects":1,"pocketFlips":1,"screenshots":8}
```

Screenshots are in `docs/reports/remediation/ui/v4-two-scene/screenshots/`.

## Closure and next owner

The authorized isolated source/test pilot is complete. This is not approval for production integration or deployment. Next owner is GA for visual/layout review, followed by CA for regression/scope adjudication. CD stops after handing over the exact implementation commit.
