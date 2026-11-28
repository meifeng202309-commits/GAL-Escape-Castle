# CA → CD — Teacher's Nov28 corrections: after-Library sharing, one timeout diagnosis, remove UNKNOWN diagnostics line

FROM: CA — Code Audit Agent
TO: CD — Coding Agent
TIMESTAMP: 2026-11-28T05:35:00Z
STATUS: TEACHER-REQUESTED SOURCE WORK / QUEUED IN ONE LEAN BATCH
NEXT_OWNER: CD after prior CA357 finale Next work; no extra micro-gates
REFERENCES: Teacher Nov28 annotated screenshots 1–3; CA-358 report, Nov27 trial pages 2–3, 11, 18.
DEVELOPMENT RULE: ACTIVE Lean V0.2, classroom 3 Players + Teacher; no unrelated architectural work.

## A. Pocket share actions and trigger — Teacher screenshot 1

Teacher corrects CA's description: ACT1 phones have no signal. Sharing should **first become possible only after all three GAL physically enter the Library**, not earlier; it is human behavior to share clues after contact is established. Existing UI currently generates buttons as bare `[item] · [other player's name]`, confusing share *recipient* with ownership. Owner direction: label actions explicitly, e.g. **“点击分享地图给 Anna”**, **“点击分享数字纸条给 Linda”**, or concise bilingual equivalent: actual **share** verb + item + **recipient**. No direct player-to-player transfer of physical item ownership: share information/photo view only.

Verified source constraints:
- `src/game/app.js` `pocketEvidencePanel` displays share controls when backend `pocket.scene.allow_share_photo` and owned item has view; current labels omit the share verb.
- Migration014 `s3b_set_scene` sets allow_share_photo in ACT2 meeting discussion and ACT5 route discussion; `s3_share_photo` also requires an open canonical discussion for that scene. **Current behavior is NOT limited to after all players arrive at Library.**
- Do a **small** source+server authoritative gate change so no sharing during ACT1/no signal, ACT2 route/travel/partial arrival; permit appropriate sharing after authoritative `party_physically_reunited` and Library arrival when discussion/contact is genuinely available. Avoid letting user click an action that the server will reject. If the existing open-discussion precondition would block sharing even after all arrive, reconcile the smallest matching allowed Library window rather than weakening other vote/phase authority or inventing fake acknowledgements. Keep sender's physical ownership, recipient knowledge provenance, existing role restrictions. Do not rewrite approved narrative copy.

## B. Recurrent state-read statement timeout — Teacher screenshot 2

Nov27 trial p11 exact error: `s5_get_player_state refresh failed: canceling statement due to statement timeout`, ~1 minute, then next poll recovered. Teacher says this has occurred repeatedly. **Investigate ONCE**: inspect relevant existing query/function chain, available one-time production DB timing/log evidence and any query amplification; report precise culprit if found and implement only an independently proven minimal fix. Do not add speculative indexes/full rewrites/security reviews or repeated monitoring cycles.

If root cannot be determined promptly, Teacher expressly requests a non-alarming, informative progress UI instead of the raw SQL exception. Use **“Processing... a little more patience”** (prefer bilingual UI text when applicable) **only while refresh retry is in progress and last confirmed state remains visible**. Crucial: do not hide a permanently failed request, pretend the action succeeded, or suppress technical details from diagnostics/logs; after bounded retry or persistent failure show a clear actionable failure/retry state. Keep actual server request failure observable to developer/CA; this is an experience workaround, not a DB cure.

Return 1 concise finding: root identified + narrow fix, OR root not found + bounded user-facing retry/progress implementation, with status NOT ROOT-CAUSED.

## C. Teacher Console "UNKNOWN · UNKNOWN · UNKNOWN" line — screenshot 3

Teacher explicitly orders: **delete this line** under each player card. In `src/teacher/teacher-console.js`, `renderOperationsState` appends:
`<small>${escapeHtml(operation.physical_location||"UNKNOWN")} · ${escapeHtml(operation.source_domain||"UNKNOWN")} · ${escapeHtml(operation.validity||"UNKNOWN")}</small>`.
Remove this **display line only**, not the fields from the DB or audit payload. Preserve display names, Connected/Waiting/Submitted and vote progress; no broader layout redesign.

## D. Keep boundaries

- CA independently checked Teacher screenshot 5: when TAKE wins, server writes `golden_key` into `s3_group_items` (Group Found Items), NOT `s3_player_items` individual Pocket. This matches V4.0 script and multiple real runs; do NOT invent personal owner or mutate item logic without Teacher choosing a specific holder. Existing `pocketEvidencePanel` already renders `pocket.group_items` in the Pocket interface.
- ACT4/ACT5 ballot/tie wording Teacher requested in screenshot 4 is **GA-owned**, dispatched separately to GA. Do not write canonical Runtime sentences or update vote SQL from private 2:1 screenshot.
- Continue and finish existing **CA-357 Slide25 finale Next** source task first; coordinate A/B/C as ONE later consolidated low-risk source handoff with confirmed CA-358 visual/Scene fixes if CA explicitly bundles them. Do not interrupt CD to pursue unrelated bugs or add a new audit ladder.
- **No production deployment authorization** here. Send one CD→CA source/test report; production needs one separate Teacher go/no-go.
