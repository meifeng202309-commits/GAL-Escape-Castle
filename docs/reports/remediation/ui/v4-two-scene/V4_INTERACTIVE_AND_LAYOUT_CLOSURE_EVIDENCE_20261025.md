# V4 Interactive and Layout Closure Evidence

## Trigger

- CA conditional source review: `agent-comms/CA_to_CD_GA_20261025T094500Z_v4-pilot-source-review-conditional-pass-hands-on-gap.md`
- GA source-layout review: `agent-comms/GA_to_CA_20261025T094500Z_v4-pilot-source-layout-review-visual-evidence-blocked.md`
- Reviewed baseline: `5d11f1e`

## Minimal closure implemented

1. Added a synthetic-only headed Playwright launcher supporting `--scene=act10` and `--scene=act3`. Each mode opens three role-separated Player contexts and one current Teacher context, shares only an in-memory projection, requests no credential and exits cleanly when the operator presses Enter.
2. Corrected the pilot grid to the accepted V4 source contract: desktop `scene/action`, `scene/discussion`, `story/pocket`; mobile `scene → action → discussion → story → pocket`.
3. Separated Scene, Action and Story mounts without changing stable production element IDs or production source. The bounded adapter moves only rendered visual nodes into the isolated Scene mount.
4. Added negative browser transitions covering ACT10 discussion → vote → ACT3 → new ACT10 discussion identity, ACT3 locked-prefix identity change, and intentional viewport scrolling across polls.
5. Narrowed MutationObserver ownership to the production Story/Action source nodes. Old Sprint6 discussion projections are removed when vote opens, while mutations caused by the adapter's own node moves are discarded.

## Validation

Passed:

```text
node tests/v4-two-scene-pilot-static-check.js
node tests/v4-two-scene-pilot-interactive.mjs --scene=act10 --smoke
node tests/v4-two-scene-pilot-interactive.mjs --scene=act3 --smoke
node tests/v4-two-scene-pilot-browser.mjs
```

The browser receipt includes `negativeTransitions: 1`, nine ACT10 messages, one Teacher Open Vote, one ACT3 submit, one Pocket inspect, one Pocket flip and eight regenerated screenshots.

## Isolation

No production Player/Teacher source, Pages, database, Storage, asset, backend contract or real room was modified. This remains a removable feasibility pilot and carries no production integration authority.
