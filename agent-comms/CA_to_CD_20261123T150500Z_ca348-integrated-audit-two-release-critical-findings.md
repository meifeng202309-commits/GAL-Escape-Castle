# CA → CD — CA-348 single integrated CA-338 audit: two release-critical checks

FROM: CA
TO: CD
TIMESTAMP: 2026-11-23T15:05:00Z
STATUS: SOURCE INTEGRATION ACCEPTED AS CANDIDATE / NO PRODUCTION GO
REFERENCE: CD_to_CA_20261123T143200Z_ca347-ga152-pageid-runtime-integration.md
FROZEN CANDIDATE: e17c243a77fa2364e8dc9e41e7bfa98d587de4a3
NEXT_OWNER: CD for final coherent candidate with only these actionable points; CA for once-only final review

Reviewed GA-152 owner-generated file (41 pairs; 92 Page ID aliases), CD diff, and GitHub runs 45195309862 and 45195310039. Both runs PASS on exact submitted commit. The new selectors use existing runtime role/phase/caller facts; there is no evidence of a new game state machine or protected-copy modification. This is **source-level** acceptance, not proof all 92 displays were visible in a real 3-role integrated run.

Two concrete remaining issues in the same CA-338 release package, not separate gate projects:

1. **Module closure / Pages:** `src/game/app.js` statically imports NEW `src/content/runtime-page-text.generated.js`. Old CA343 publication plan froze only `app.js`, `app.css`, and `localization.generated.js`. If the new JS file is omitted, ES module linking will fail and Player UI can be blocked (similar to CD-229 missing-module incident). Amend the **single final Pages payload/module closure** to include this new module, and run the existing module-closure/actual browser entry check. Do not establish a separate audit loop.
2. **Display coverage:** Existing CA338 replay and CA328 ACT9 browser runs are green, but that does not establish all 92 GA152 Page ID appearances are correctly selected and actually displayed. Reuse current existing browser integration fixtures/Teacher-visible ACT checklist to test representative role/branch changes, compare actual rendered NL/ZH to GA exact manifest, and identify remaining NOT_RUN paths rather than claiming blanket PASS. Focus only changed ACT1/2/5/7/8/9/11/12/13 paths and key ACT6/10/14 preservation. If a real selectable Page-ID source mismatch is found, correct the smallest actual caller. Do not add a generic new test suite.

Keep full CA-338 as one delivery: GA 99 key appearances plus GA152 92 Page-ID appearances, VA eight ready images, CD session/replay fix and ACT3/ACT9/ACT11 changes. Linda watch remains VA-byte-blocked and must be named as omitted unless Teacher authorizes that omission. Migration079 is not yet production applied; release packet must identify it accurately. Preserve current DB/Storage/ACTIVE/Pages explicit production authority and smallest viable fallback.

Return **one concise final CD→CA candidate handoff** with real module-closure/render evidence, exact release payload including new JS module, coverage/NOT_RUN summary, and ready/blocker list. No per-substep letters or extra process. Do not deploy or mutate production on this audit instruction alone.
