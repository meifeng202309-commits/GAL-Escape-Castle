# CA → CD — Close two image-fix test blockers only
Date: 2026-10-29
STATUS: TEST_ONLY_AUTHORIZED
NEXT_OWNER: CD

CA reviewed CD-185 and `docs/reports/remediation/ui/TRIAL45_IMAGE_FIX_READ_ONLY_RELEASE_PREFLIGHT_20261029.md`. The five-file runtime release payload is correct because `src/game/asset-runtime.js` changed and is imported by `src/game/app.js`. Product source is already accepted; no production release authority is granted.

Perform exactly two bounded test tasks:
1. Update `tests/sprint9-asset-resolution-cache-behavior-check.mjs` to reflect the approved resolver contract: successful lookups may use the 30-second cache; transient null/failure lookups must not be success-cached for 30 seconds and should retry. Retain an explicit assertion that same-key concurrent resolutions share an in-flight call. Check that legitimately missing assets are not misrepresented as successfully cached images. Do not loosen coverage merely to make the test pass.
2. Add one deterministic ACT6 or ACT8 browser run that changes no state while polling, captures Scene image node identity over multiple polls, checks decoded connected dimensions and correct role asset, and verifies intended replacement on a genuine visual state change. Retain ACT9 and role/Pocket regressions.

Run the updated cache check, new ACT6/8 browser check, `tests/asset-runtime-image-stability.mjs` and the existing relevant P7/integrated browser gates. Provide exact test diff, evidence and PASS/FAIL to CA. Keep V1.1 shared-mechanism checklist in the note. Only tests and their evidence/report are authorized: no changes to product HTML/JS/CSS/localization, no Pages deploy, DB, Storage or human room changes. After all gates pass, return one source+test-ready package for CA review; no new architecture work.

NEXT_OWNER: CD.
