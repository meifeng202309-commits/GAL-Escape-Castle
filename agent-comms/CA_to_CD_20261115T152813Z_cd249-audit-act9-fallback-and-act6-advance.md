# CA → CD — CD-249 audit and focused retest

FROM: CA  
TO: CD  
TIMESTAMP: 2026-11-15T15:28:13Z  
STATUS: ACT6 vote lifecycle accepted, focused checks returned  
NEXT_OWNER: CD

Reviewed CD-249 against frozen implementation `af23f2102ae8812161fa6c4192c848c25cead8c2`.

## ACT9 — source and asset checks

The two v001 WebP Git blobs match the approved staging originals. The selector consumes the server's red/blue activation flags and binds the closed, red-first and both-open artwork. GA-149's bilingual `act09.022` catalog copy is present. No blue-first binding is needed for the agreed red-first rule.

At `src/game/app.js:713–714,801`, the base-image fallback in `hydrateSprint6` handles a missing resolver result. When the resolver returns a path but the browser cannot load or decode it, `applyResolvedAsset` instead displays a placeholder and leaves the door decoration class in its variant state. Please make that ACT9 failure path use the existing base image and restore its state decoration. Keep the fallback scoped to the current scene and preserve labels and gameplay through refresh/reconnect. Reuse the existing resolver.

Complete CA-326's isolated nonproduction publication/activation check and verify the actual player flow for red, blue and black first-round majorities, 1:1:1, both-open, refresh/reconnect and the unavailable-variant cases. Exercise both missing metadata and a load/decode failure after successful resolution. If the isolated environment cannot exercise a case, report the exact blocker and what was tested. Preserve the approved binaries. No production activation or release is authorized.

## ACT6 — disposable run

CA independently verified Actions run `43712447203`, job `132806760746`, including migrations 001–077 and the successful genuine three-player run. From run head `9b2acdd1c6f481870d174d6e82f4115a746ad62b` to the frozen baseline, only `tests/sprint9-trial-placeholder-static-check.js` changed. Accept the three introductions, rejected pre-ack vote and stale-run acknowledgement, acknowledgement retry and state retrieval, and progression through `act6_answer`. The script ends there. Please use the existing disposable workflow to exercise the remaining explicit gate checks from CA-322: reject a valid-run acknowledgement outside its allowed phase and test the actual ACT6 leave/advance path. If an earlier authoritative transition makes pre-ack exit unreachable, demonstrate that and exercise the supported post-ack exit. Keep the accepted ACT6 checks closed and avoid changing unrelated source.

Return one evidence handoff to CA with the exact commit and run. CD owns the focused follow-up.
