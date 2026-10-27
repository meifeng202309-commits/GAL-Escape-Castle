# Trial Run 4+5 P0/P1 root-cause and integrated implementation proposal

Date: 2026-10-28  
Owner: CD  
Authority: `CA_to_CD_20261028T020000Z_trial4-trial5-systematic-debug-p0-p1.md`  
Status: P0/P1 complete; P2-P6 require one coherent CA implementation gate; no production mutation performed.

## 1. Frozen production baseline

- Pages candidate: `deploy/trial4-player-act9-20261027@727ed7cd360c970b20874c7d5d0fc1b64826a92b`
- Pages build: `1319041359`
- Production database receipt: `20261027151620_act9_normal_teacher_paced_vote_073`
- Prior release evidence commit: `2abcb247dd5e02385677f9d3cd5a44cbcd36d75a`
- Public Player/Teacher URL: `https://meifeng202309-commits.github.io/GAL-Escape-Castle/`
- Browser matrix: Gitte/GAL-A, Anna/GAL-B and Linda/GAL-C at matched `act3_library/library_box`, each at 1366x768 and 1280x720; Teacher at 1366x768.
- Machine-readable evidence: `docs/reports/remediation/ui/trial45-p0p1/P0P1_BROWSER_EVIDENCE.json`; seven screenshots are in the same directory. Collector: `tests/trial45-p0p1-deployed-browser-investigation.mjs`.

The matched-role geometry is identical. At 1366x768 the measured boxes are Scene `(40,267,741)`, Runtime `(40,498,741)`, Action `(793,267,533)`, Discussion `(793,476,533)` and Pocket `(793,514,533)`. At 1280x720 the left/right origins are 33/744 and widths are 699/503. This confirms the deployed CSS grid itself implements GA-134; observed visual divergence originates in remounted content, missing media, phase semantics, and overflow state rather than a role-specific grid definition.

## 2. Causal findings

### 2.1 Confirmed systemic render/media race

`renderSprint3b`, `renderSprint5` and `renderSprint6` replace region HTML during polling and invoke asynchronous media hydration without awaiting it. `setS5Asset` and `hydratePocketAssets` capture an element, await `asset_resolve`, then assign `src` even if a subsequent poll has detached that element. `routeFormalPresentation()` also moves freshly rendered nodes after the render. The next poll repeats the cycle.

The deployed browser reproduced the complete failure chain: Storage returned HTTP 200 `image/webp` for `shared.library`, while every role/viewport retained `s3bSceneImage naturalWidth=0` and invisible after the observation window. Pocket showed the same nondeterminism: Linda's three images loaded at both viewports, Anna's diary loaded at both, while Gitte alternated between map and note loading despite valid item enumeration and successful image responses. An earlier test passed because its resolver mock completed immediately and therefore removed the production timing window.

### 2.2 Semantic routing gaps

`renderSprint3b` chooses ACT1 Scene imagery from the opening room/role state only. The `study_map` and note consequences do not update a semantic Scene presentation state, so the map/note can exist in Pocket but cannot deterministically become the main Scene visual. Prose and action routing is performed by moving generic rendered children after the fact, rather than by a phase/action presentation contract. This makes ownership vulnerable to render order and phase differences.

### 2.3 Pocket state and visibility

The authoritative Pocket projection and fixture data enumerate all owned role items: Gitte map+number note, Anna diary, Linda watch+star key+closure order. The deployed matched fixtures rendered exactly those item keys. The current UI expands inspected media into one long scrolling column and replaces it on every poll; it does not preserve open item, scroll position, or hydrated nodes. This explains “only first item” perception and compounds the media race.

The reported pre-game Gitte watch was not reproduced and conflicts with canonical role ownership (the watch belongs to Linda). Current projection exposes owned items when Pocket is active but does not itself define a pre-game visibility policy. P2 must add an explicit role/phase visibility contract and P6 must use a true pre-game fixture to determine whether the report arose from stale session/role identity or UI gating. No database change is presently justified.

### 2.4 Bilingual, tie feedback, ACT9 and scroll

- Deployed `.bilingual` computed font size is 16px for every role, not 11pt (approximately 14.67px). NL and ZH are separate elements, but blank block spacing is not governed by one reusable component contract.
- The required Chinese tie instruction is absent from the canonical catalog. Only `讨论结束后开放投票。` is present. The generated file identifies `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv` as its protected source; do not edit `src/content/localization.generated.js` directly. Exact NL/ZH text and trigger require a bounded GA/localization authority decision routed by CA.
- Migration073 already supplies NORMAL Teacher-paced behavior and preserves AUDIT 180/60 timing; no new database work is proposed.
- The ACT9 scroll jump was not independently reproduced in P0/P1, but full-region replacement on polling is a credible mechanism. P5 should only add keyed scroll capture/restore if the real polling fixture reproduces it.

### 2.5 Teacher canonical recovered without ambiguity

The approved source is `docs/prototypes/round1-ui-v4/Teacher_Console.html`, with `Teacher_Emergency_Recovery.html` and `Teacher_Maintenance_Developer.html` as its internal supplementary views. `GA_to_CD_20261004T235500Z*` approves the five Teacher pages; `GA_to_CD_20261005T005500Z*` requires one runtime `teacher.html` with internal views rather than separate production applications.

Production is the obsolete console: width 1040, nine generic `.panel` elements, and none of canonical `.top`, `.main`, or `.collapsed` structure. The authority is therefore unambiguous and no GA clarification is needed for layout recovery.

## 3. R4/R5 root-cause matrix

| Item | P0/P1 disposition | Root cause / next implementation |
|---|---|---|
| R4-01, R5-04 | reproduced | Detached-node async image hydration leaves Scene empty; semantic visual is not phase/action keyed. Stable frame composer plus identity-guarded hydration. |
| R4-02 | source gap confirmed | `study_map` does not select map as Scene visual. Add phase/outcome presentation manifest. |
| R4-03, R5-05, R5-06 | geometry passes at matched phase; routing fragile | Grid is shared and correct; post-render node movement/remount causes ownership instability. Render directly into persistent Scene/Runtime/Action mounts. |
| R4-04 | source gap confirmed | Note has Pocket asset mapping but no Scene transition. Add note outcome mapping and visible-dimension gate. |
| R4-05, R5-03 | race reproduced | Asset URL/HTTP success is insufficient; detached target never loads visibly. Preserve node and measure resolve/network/decode/visible timings. |
| R4-06, R5-08 | positive baseline reproduced | Linda enumerates and visibly loads all three Pocket images at both viewports. Preserve as mandatory regression. |
| R4-07, R5-07 | enumeration passes; access UX/race fails | All items exist, but long-column expansion, remount and nondeterministic hydration obscure later items. Stable item selector/detail view with retained state. |
| R4-08 | missing source confirmed | Exact tie instruction absent from canonical catalog/trigger. Requires bounded canonical localization authorization, then authoritative round transition mapping. |
| R4-09 | prior server evidence passes | Keep migration073 unchanged; rerun NORMAL/AUDIT browser and server matrices in P6. |
| R4-10 | not reproduced | Poll remount can reset scroll. Add fixture and conditional keyed restoration only on reproduction. |
| R5-01 | not reproduced / identity conflict | Gitte cannot canonically own watch. Add pre-game role/session/phase fixture and explicit visibility policy before changing source. |
| R5-02 | reproduced | 16px computed style and no single bilingual block contract. Apply 11pt component with NL line, ZH line, blank inter-block spacing. |
| R5-09 | reproduced | Production Teacher uses old shell. Recompose existing single runtime to approved V4 structure, preserving controls and event wiring. |

## 4. One cohesive P2-P6 design

1. **Persistent frame composer (`src/game/app.js`, `index.html`)**: create stable mounts once; render keyed content directly into its owner. Eliminate post-render ownership moves. Preserve the active node when payload identity is unchanged.
2. **Race-safe asset hydration (`src/game/app.js`)**: bind each request to `{renderGeneration, assetKey, element}`; after every await verify the element remains connected, belongs to the current generation, and still requests the same key. Cache resolved URLs, avoid clearing an already correct `src`, and expose resolve/network/decode/visible status to tests.
3. **Semantic presentation manifest (`src/game/app.js`)**: map authoritative phase plus action outcome to Scene visual, Runtime bilingual narrative, and Action controls. Include Gitte map/note and Anna diary paths explicitly.
4. **Stable Pocket (`src/game/app.js`, `src/styles/app.css`)**: render a role-aware item selector and one detail surface, preserve selected item/view/scroll across polling, and enforce explicit pre-game/phase visibility. Do not change database ownership records without new evidence.
5. **Teacher canonical composition (`teacher.html`, `src/teacher/teacher-console.js`, shared CSS as applicable)**: reproduce approved `.top`/`.main`/collapsible organization inside the existing runtime while preserving IDs, controls, polling, Recovery and Maintenance access.
6. **Bilingual contract (`src/styles/app.css`, render helpers)**: exact computed `11pt`; Dutch and Chinese on separate lines; blank spacing between bilingual blocks; apply to static and dynamically rendered text.
7. **Tie copy/trigger**: after CA obtains the bounded canonical decision, edit `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`, regenerate via `scripts/generate-localization.js`, and map the key to the authoritative first-round tie transition before vote-opening guidance.
8. **ACT9 state stability**: preserve migration073. Capture/restore Runtime scroll by content identity only if the P5 real-poll fixture reproduces the jump.

No migration074, schema change, Storage mutation, or asset replacement is indicated by P0/P1.

## 5. One-to-one P6 verification contract

| Test ID | Mandatory assertion |
|---|---|
| T-R4-01/R5-03/04 | Every role at both viewports: expected Scene key, connected `<img>`, HTTP 200, decode complete, `naturalWidth/Height>0`, visible rectangle after multiple polls/reconnect. |
| T-R4-02 | Gitte `study_map`: map becomes Scene main visual; Runtime contains explanation; Action contains only controls. |
| T-R4-03/R5-05/06 | All roles at equivalent phases: computed Scene/Runtime/Action/Pocket boxes match GA-134 and content owner selectors. |
| T-R4-04 | Note consequence displays number-note visual in Scene with positive natural dimensions. |
| T-R4-05 | Anna diary records resolver, network, decode and visible timing; survives at least two polling cycles. |
| T-R4-06/R5-08 | Linda preserves correct regions and watch/key/order access and visible media at both viewports. |
| T-R4-07/R5-07 | Gitte 2, Anna 1, Linda 3 item selectors; select every item/front-back where applicable; selection and scroll survive polls. |
| T-R4-08 | First-round tie shows exact authorized NL/ZH instruction before vote-opening guidance, once and in correct order. |
| T-R4-09 | NORMAL has no 180/60 auto-expiry and requires Teacher progression; AUDIT retains 180/60 behavior. |
| T-R4-10 | User-set ACT9 Runtime scroll remains stable through >2 polling intervals/reconnect; conditional fix asserted only after fixture reproduction. |
| T-R5-01 | Fresh pre-game sessions for all role slots expose no unauthorized item; role identity and authoritative item keys recorded. |
| T-R5-02 | Every relevant dynamic block has NL line, ZH line, blank inter-block gap and computed `font-size: 11pt`. |
| T-R5-09 | Teacher screenshot/DOM matches approved V4 regions; all existing operational controls still dispatch and refresh correctly. |

P7 remains CA's single holistic audit. Human retest and deployment remain prohibited until every row is independently PASS and separately authorized.
