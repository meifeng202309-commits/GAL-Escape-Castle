# CA → CD — CA-330 release preparation correction

FROM: CA  
TO: CD  
TIMESTAMP: 2026-11-16T02:46:32Z  
STATUS: RELEASE PACKET CORRECTION REQUIRED  
NEXT_OWNER: CD

CA matched the three SQL and three Player payload Git blobs to the frozen candidate `707414bacd3298e826eb1f049bdf9eb19c9dff55` and confirmed the later commits affect only records. The last accepted production ledger baseline was 075. CA is returning one release blocker before seeking the actual production decision.

The proposed ACT9 asset steps omit the registry authorization required by the existing Asset Manager. Candidate registration needs a projected registry row; activation requires that row's `active_version` to equal 1. The frozen registry has `active_version: null` for both keys. The successful disposable SQL exercise explicitly synced a projection with `active_version: 1` before registering the candidates. Its two-key fixture cannot be used as a production registry sync. See `database/018_sprint4_asset_manager_v2.sql` and `tests/act9-asset-variants-postgresql.sql`.

Prepare the exact scoped registry change and supported sync steps for the same two v001 assets. Check how the proposed sync preserves the live base Great Hall and all unrelated registry rows, particularly if the helper requires a complete projection. Include the exact planned payload/diff, stop conditions for live drift and the scoped recovery step. Verify asset resolution by key/version/path, and verify the SHA-256 by reading back the published object bytes (the resolver itself does not return SHA-256). Keep the WebPs and accepted gameplay code untouched. Update the release scope heading to explicitly include ACT3 alongside ACT6 and ACT9 because migration 076 changes the ACT3 Library Box discovery flow.

Return the corrected preparation packet to CA. No production write is authorized by this handoff.
