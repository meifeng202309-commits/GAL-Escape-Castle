# Slides 7, 9, 10 and 19 bounded investigation

UTC checkpoint: 2026-11-14T04:09:25Z

Source: original 26-slide `debug report 13 Nov.pptx`. The deck embeds the relevant screenshots as slide 7/image5, slide 9/image7, slide 10/image8 and slide 19/image19.

## Slide 7 — blank Number Note illustration

- Evidence: the embedded screenshot shows `prop_gitte_number_note_front` as a deliberately blank paper image.
- Source path: ACT1 `study_number_note` selects that asset in `renderSprint3b()`; canonical Game Script V4.0 explicitly says the exact `41739` is supplied by HTML. The asset registry therefore is not missing baked-in words.
- Root cause: presentation-contract mismatch. The image is art-only by design, while `act01-g.007` is rendered as adjacent Runtime/Pocket HTML, not an overlay on the paper. The screenshot proves the asset loaded, so this is not a loading failure.
- Smallest correction: retain the canonical art and add/position the existing `act01-g.007` HTML as an accessible visual overlay or unmistakably adjacent clue text, subject to GA/Teacher presentation approval. Do not edit the bitmap or invent copy.
- Test: Gitte chooses Number Note and later opens it from Pocket at both supported viewports; assert decoded image plus exactly one visible `41739` associated with the note.

## Slide 9 — duplicated/missing numeric clue

- Evidence: the screenshot shows `4 – 1 – 7 – 3 – 9` twice in one Pocket presentation while the report notes another similar page with none.
- Source path: the only canonical number string is localization key `act01-g.007`. `pocketItemContent()` emits it for inspected `gitte_number_note`; ACT1 consequence keys also include the same key. The front bitmap intentionally contains no digits.
- Root cause: duplicate delivery paths can render the same canonical key in Runtime consequence and Pocket detail; the earlier repeated-node routing defect amplified repeated presentation and is addressed in frozen Player blob `198b3af...`. The missing-number variant is consistent with displaying only the blank art before/without its adjacent HTML detail. The screenshot alone cannot prove which poll/frame produced the missing case.
- Smallest correction: release the already-tested Runtime dedupe first; then ensure the Number Note component owns exactly one `act01-g.007` display per visible clue instance. Do not alter the numeric content.
- Test: exercise initial consequence, inspected Pocket front, flip back/front and five refreshes; count exactly one number string inside the active note detail and verify no blank-detail state.

## Slide 10 — GAL-A/GAL-C diary buttons

- Evidence: screenshot shows two buttons labeled Servant Diary for GAL-A and GAL-C, reported nonresponsive.
- Canonical ownership: the diary is Anna/GAL-B's `anna_servant_diary`, rendered from `prop_anna_diary_open` and `act01-a.010`. GAL-A and GAL-C here are target-recipient share controls, not separate canonical diary objects.
- Handler path: `pocketEvidencePanel()` creates target buttons only when `pocket.scene.allow_share_photo` is true; `bindPocketActions()` binds `[data-share-role]` to `shareSprint5Photo()`. Thus a handler exists. The screenshot label combines item name and backend target role, which makes the controls look like GAL-A/GAL-C inventory items.
- Failure condition/uncertainty: if the projection exposes share controls outside the phase accepted by the share RPC, or a stable rerender replaces nodes before binding, the click can appear inert. The screenshot contains no error/status and cannot distinguish rejected RPC from absent binding. No canonical script evidence supports duplicate GAL-A/GAL-C diary props.
- Smallest correction: first reproduce with RPC/console capture and phase payload. If RPC rejection, align `allow_share_photo` with the server-accepted phase. If binding is absent, restore binding after the stable render. Separately relabel recipients with player names only after GA approval; do not create new diary objects.
- Test: Anna opens the diary in the permitted share phase, sends separately to Gitte and Linda, observes request/acknowledgement, and verifies the shared-photo projection for only the selected recipient each time; negative test outside the permitted phase.

## Slide 19 — Teacher technical/status lines

| Visible line | Source and purpose | Recommendation |
| --- | --- | --- |
| NORMAL · ACT 8 | `operationsBadge`; mode and current act | Retain. Operational orientation. |
| Room code, 3/3 connected | Teacher state header | Retain. Required start/reconnect gate. |
| Per-player Connected, waiting, role and time | player cards/teacher state | Retain names, connection and Submitted/Waiting. Hide backend GAL role and timestamp from the primary line unless troubleshooting. |
| Live operations refreshed | `operationsStatus` | Retain transiently as refresh acknowledgement; clear or soften after success. |
| Current ACT and scene ID | `renderOperationsState()` current block | Retain ACT; place raw scene ID in a secondary diagnostic disclosure. |
| phase/step/discussion status | same current block | Retain because it explains vote/action availability; present a readable label first and raw identifiers second. |
| Route and countdown | same current block | Retain. Directly useful to facilitation. |
| physical location/source domain/validity | player-card operational metadata | Keep collapsed/secondary. Useful for diagnosing stuck players, not primary teaching flow. |
| Pockets and group items | collapsed details | Retain collapsed. Useful for evidence/state diagnosis. |
| Audio trigger debug | collapsed details | Retain collapsed and label as troubleshooting. |
| Teacher interventions and validity | collapsed details | Retain collapsed. Required audit/recovery evidence. |
| Export filename and finalization state | final export line | Retain in export/session tools; it explains why export is unavailable. |
| Discussion run/session UUID, round, raw status/topic | discussion observation | Keep round and status visible; move UUIDs and raw topic key into a diagnostic disclosure. |

Root cause is information hierarchy, not useless data. The console mixes essential facilitation state with raw identifiers in the primary scan path. The smallest correction is progressive disclosure and readable labels while preserving raw diagnostics; no diagnostic should be deleted before an operator test.

Test with an active ACT8 discussion and a completed run: Teacher must identify room readiness, each Player's submission state, current phase, route/countdown and export readiness without expanding diagnostics; expanding troubleshooting must still expose raw IDs, Pocket/group state, audio and validity data.

## Boundary

No Runtime wording, localization catalog, Game Script, asset registry, narrative semantics, production data or Pages code was changed. Slide 10 remains a factual diagnosis with an explicit reproduction requirement before any product correction.
