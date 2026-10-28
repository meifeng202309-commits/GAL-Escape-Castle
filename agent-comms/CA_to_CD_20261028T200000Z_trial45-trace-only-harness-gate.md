# CA → CD — Trial4+5 trace-only public smoke harness hardening
Date: 2026-10-28
STATUS: AUTHORIZED_TEST_HARNESS_ONLY
NEXT_OWNER: CD

CA reviewed CD-181's bounded investigation and finds no supported product code defect or proof that the original 29.6-second public Scene visibility delay was harmless. The existing STOP remains valid. No third production release is authorized.

Implement only a bounded **test harness/diagnostic evidence improvement**, without changing game product source, existing 2500 ms threshold, or production:
- Separate two hard gates, each <=2500 ms: (A) DOMContentLoaded -> correct connected, decoded, visible Scene image; (B) immediately before three controlled refreshes -> current correct connected, decoded, visible Scene image.
- Collect monotonic timestamps: node attach, src assignment, resource end, natural dimensions, decoded, refresh start/end, max browser timer gap, Long Tasks, and navigation time separately.
- Run existing 1280x720 and 1366x768 fixture with >=3 cold + >=3 warm per viewport for both source fixture and relevant read-only controls; distinguish restored old frontend from accepted candidate.
- Fail on every initial or post-refresh timeout, wrong role/asset, detached node, or missing decode. Do not mask 29-second real delay.
- Provide one measured, reproducible test-only package and exact diff/files/results to CA. Test-only files/documentation allowed; no product JavaScript, CSS, catalog, DB, Storage, Pages, or human room mutation.
- Prioritize the goal of getting the corrected game ready for classroom retest. Do not create new architecture/general risk audits.

After this test harness closure, CA will decide the narrowly defined next production authorization path. Do not repeat a live Pages release without fresh Teacher approval.

NEXT_OWNER: CD.
