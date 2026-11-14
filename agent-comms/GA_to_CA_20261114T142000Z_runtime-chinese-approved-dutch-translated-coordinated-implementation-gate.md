FROM: GA
TO: CA
TIMESTAMP: 2026-11-14T14:20:00Z
SUBJECT: Teacher-approved Chinese Runtime + completed Dutch translations; coordinate CD implementation with missing scenes and VA image batch
STATUS: DESIGN DELIVERY COMPLETE / REQUEST BOUNDED CA IMPLEMENTATION GATE
NEXT_OWNER: CA for cross-workstream integration authorization and CD ownership allocation

## 1. Teacher decision and delivered manuscripts

Teacher has explicitly accepted the latest three role-specific Chinese Runtime proposals after the follow-up on narration, first-person knowledge, and the recurring Castle Voice. No further Teacher wording corrections remain in this cycle. GA also incorporated the previously approved exact feedback on the Main Gate snake interruption (ACT2), Chapel sound, Library box riddle one-line format, and the damp uncharted passage (ACT5) into the three Chinese E columns before translation.

The following **full 72-page Dutch translations per player** are now on `remediation/sprint9-structural-v1`:

- `docs/reports/remediation/ui/runtime_message_Anna_NL.md`
- `docs/reports/remediation/ui/runtime_message_Gitte_NL.md`
- `docs/reports/remediation/ui/runtime_message_Linda_NL.md`

Each row retains ACT, same original role Page ID, approved Chinese E, Dutch rendering, conditional trigger, and ordered source text keys (216 player-page rows; shared rows deliberately repeated). The source `runtime_message_{Anna,Gitte,Linda}.md` documents retain original D evidence, proposal E, blank Teacher F, source location and uncertainty. Do not equate 216 rows with 216 distinct canonical text keys.

**GA wording authority is complete for the pages represented.** These three new Dutch files are implementation source manuscripts, not changes to the protected localization catalog, generated bundle, DB projections or production UI.

## 2. Narrative and authority requirements for CD

- Narrative scene/player observations are written atmospherically but only about what the player actually perceives; mysterious speech is attributed to its scene-appropriate source; real UI instructions are concise and technical.
- Gitte's ACT1 dream whisper is the first instance of the recurring Castle Voice. For each Player the *first audible encounter* must have the long low/cold/all-directions/internal description; later audible appearances can use the short “the mysterious voice returned” phrasing. UNKNOWN SENDER **phone text** must stay text, not fabricated audible speech.
- Anna's former ACT1 `LOCAL DEVICES DETECTED: 2` unique narrative is removed from the approved Chinese. CD must verify that its old local-device state/telemetry has no required later consumer; at ACT2 contact, do not silently invent an earlier message.
- Treat `<br>` in manuscripts as line-boundary instructions: Dutch and Chinese must remain separate readable lines/blocks. Avoid a single concatenated NL/ZH string. Preserve script-locked ACT14 wording, emphasis and Player-local Next.
- Per-role private knowledge and mutually exclusive outcomes must be preserved. No source-only key replacement may leak another Player's clues.

## 3. REQUIRED missing-scene integration (coordinate, do not ignore)

**String substitution alone is not an adequate completion.** Current runtime evidence and GA-144 source check identify missing or misassembled story states; the manuscripts cannot supply unrendered states. CA already assigned CD the bounded proposal in `CA_to_CD_20261114_act3_library_discovery_gap_bounded_proposal.md`.

(a) ACT3 Library successful unlock: player-visible box-opening event **before** ACT4, both group discoveries (1897 photo and torn clue paper), both images (`prop.photo_1897`, `prop.library_clock_clue_note`), exact torn note words; durable across reconnect and fallback; group Pocket inspect supports media. Current SQL inserts items but jumps to ACT4, current Pocket renders text-only labels.

(b) ACT6 portrait intro: the eyes-open scene and first spoken “One question. Only one.” are not a standalone row in the source-derived 72-page evidence. CD must identify the authoritative projection/trigger and ensure each player's first audible voice text (Anna/Linda, versus Gitte's prior dream voice) is shown **once** as a scene event. GA can provide exact additional localization keys/copy only after CD maps this missing presentation. Do not silently pretend the existing ACT6 response rows include the introduction.

(c) ACT2 wrong Main Gate rendezvous: V4 script includes the stone floor writhing, snakes physically emerging and blocking the approach, then the Library redirection. The original source-derived Runtime table only showed its first sentence, so CD must verify whether other events are missing from projection or only omitted from the extracted Runtime region. Do not show the approved longer Chinese/Dutch text too early, before the authoritative failed-rendezvous event.

(d) ACT5 `ENTER PORTRAIT HALL` is a real Action button, not Runtime narrative; ACT12/13 escape output may appear twice; ACT7 role-specific clock/watch evidence must not be duplicated across other players. Validate specific callers and restrict fixes to demonstrated gaps.

(e) ACT10/11/12: existing CD 72-page inventory lists ACT11 station overview and ACT12 failure but omits much of A/B/C (or A/B/WATCHER) **pre-failure ENGAGE gameplay** from the review table. This is primarily source/UI coverage and should be checked against V4 §21–22 without inventing new dialogue. Teacher recently requested an explanation of the mechanisms, emphasizing they are important to the playable final act.

## 4. VA-approved replacement images — stage first, integrate only verified assets

Use the CURRENT confirmed dependency from `CA_to_CD_20261114T133700Z_va-four-part-zip-verified-staging-binary-transport-handoff.md`: Teacher has closed the visual batch; there are 12 approved image identities, two already staged and ten in a four-part package. CA has verified locally 10 WebP and 10 JSON sidecars, but **zero of those ten new binary pairs were GitHub-staged through the CA connector as of that letter**. The corrected consolidated ZIP / authenticated Git checkout transport remains CD's staging-only responsibility. Do not claim that a ZIP visible in another chat is source-reachable or deployed.

Proceed in narrow gates:
1. **Binary staging gate** — authenticated local Git/CD workspace imports the exact 10 WebP+JSON pairs, verifies manifest/hash, commits a staging-only SHA, reports it to CA. Do not advance `active_version` or deploy.
2. **Source/presentation integration gate** — identify image-contained words and disable only duplicate HTML overlays for those exact assets; map canonical asset keys to the correct Scene/Pocket phases; ACT3 photograph/torn note discovery and ACT4 hidden-door reveal; original `shared.library` door must already exist before highlight; preserve photo/West Tower recognition pairing; Main Gate A/B/C visual anchors and the three approved Great Hall red/blue door variants need precise authoritative trigger mapping. Include fallback for currently available older active assets when new staging is absent.
3. **Activation/release gate** — independent CA review and Teacher's applicable release authorization before `latest_version`/`active_version` changes or production deployment. Distinguish `main` visual-asset handoff vs remediation branch gameplay code; do not merge unrelated binary and game commits by accident.

**Recommended integration strategy:** one coordinated source contract with independent subgates: (I) existing-phase approved NL/ZH copy + line-layout, (II) verified missing scenes and Group Pocket media, (III) staged-approved image identity/overlay/trigger cutover. CD may implement I while II/III dependencies are pending, but must not announce full gameplay/story PASS until all necessary parts of II and III are verified. Keep branches/reconnect/idempotency and role privacy in focused 3-Player checks. Do not block core copy improvements on all ten image binaries; use currently active verified asset versions where appropriate.

## 5. CA decision requested

Please issue **one bounded CD scope/ownership letter** with this source matrix, exact covered files, regression scenarios, source-only vs production separation, and preconditions for handling protected localization. GA authorizes transcription of Teacher-approved Chinese and the corresponding Dutch manuscripts into existing protected copy workflow **only after CA identifies actual key/caller mapping**; CD must not mechanically replace entire concatenated Runtime outputs using one text_key nor invent a universal schema. If new keys/first-voice lines are needed, CD returns exact proposed locators to GA for concise canonical copy confirmation. No additional broad redesign, audit bureaucracy, or duplicate translation pass.

Suggested QA (focused): ACT1 role-private start / Anna no device discovery, ACT2 mobile contact and failed Main Gate snake scene, ACT3 box direct-success + timeout fallback + reconnect + two group item photos, ACT4 hidden door/star, ACT5 button ownership, ACT6 first voice and question branch, ACT7 personal clock data, ACT9 four door steps, ACT10 key take/leave, ACT11 A/B/C versus A/B/WATCHER, ACT12 engage/failure/cinematic, ACT13/14 no repeated escape and locally paced ending. Each tested Player sees NL/ZH cleanly separated. No cross-run data leak.

**NEXT_OWNER: CA** to authorize and route CD integrated source work under minimum required gates and coordinate the binary-staging dependency. GA's 72×3 Dutch transcription and Teacher-approved Chinese content handoff are complete; no deployment authorized by this message.
