FROM: GA
TO: CA
TIMESTAMP: 2026-11-14T09:00:00Z
SUBJECT: ACT3 Library successful code skips discovery and image presentation
STATUS: ACTION_REQUIRED
NEXT_OWNER: CA

Teacher reports that entering the correct Library box code does not show the discovery of the 1897 Photograph and Torn Note or either image. GA inspected the V4.0 Library Box spec (§12.3–12.5), current branch SQL and Player app.js.

**Source-backed mismatch:**
- V4 §12.5 requires post-resolution discovery of exactly two group found items: 1897 Photograph (`prop.photo_1897`) and Torn Note (`prop.library_clock_clue_note`), with precise note text via UI.
- `database/014_sprint3b_evidence_and_puzzle_integrity.sql` function `s3b_submit_library_code` on correct code inserts group item keys `library_photo_1897` and `library_torn_note` and **immediately** calls `s3b_set_scene(...'act4_known_unknown','private_route_choice'...)`. No distinct post-unlock discovery phase is retained.
- The older fallback path in `database/011_sprint3b_transition_and_act1_delivery_integrity.sql` similarly inserts the two items and immediately transitions to ACT4. Do not introduce a bug in the timeout/Teacher override paths.
- `src/game/app.js` `submitLibraryCode` simply refreshes state after successful RPC. `pocketEvidencePanel` renders `group_items` as summary + `act03.016` only for torn note and summary-only for photo; no image element/asset hydration for either key. `hydratePocketAssets` only hydrates media with `data-pocket-asset`, which the group-items renderer does not produce. Later ACT8 `renderSprint5` loads `prop.photo_1897`; this is not the required ACT3 discovery presentation.
- This is a SOURCE_STATIC finding on the reviewed branch, not a fresh live E2E reproduction or proof of production deployment state.

**Design intent/implementation request:**
Provide an explicit, player-readable ACT3 successful unlock moment to all three players, before requiring them to decide about the unknown Library door in ACT4. Show that the box contains (1) 1897 photograph image, (2) torn paper image, and the exact paper text; both remain available in GROUP FOUND ITEMS for later inspection. Distinguish event narrative and clue images from Action controls; preserve role visibility, existing group ownership and subsequent ACT4 route rules. Use existing canonical keys/assets/catalog text; do not invent narrative wording, item identities or a new vote. Avoid unnecessary DB changes if an existing server projection plus bounded Player UI presentation can accomplish the required sequencing, but CA/CD must verify whether an actual durable transition/ack is needed to prevent missing the event under polling/reconnect.

CA please assign CD the smallest source investigation/implementation proposal with focused success, fallback, reconnect, ACT4 transition and asset-decoding checks. Return any protected wording requirement to GA for owner-first canonical text authorization. Do not divert CD from a higher-priority already authorized current task or infer production deployment permission from this letter.

NEXT_OWNER: CA for a bounded CD technical scope/gate. GA's functional discrepancy investigation is complete; final implementation solution and acceptance remain CA/CD-owned.
