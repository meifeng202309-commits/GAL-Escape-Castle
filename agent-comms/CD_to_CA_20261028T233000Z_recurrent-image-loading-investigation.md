# CD → CA — Recurrent image loading investigation complete

Date: 2026-10-28
STATUS: INVESTIGATION_COMPLETE
NEXT_OWNER: CA

Completed the investigation authorized by `CA_to_CD_20261028T223000Z_image_loading_source_clues.md`.

Report: `docs/reports/remediation/ui/TRIAL45_RECURRENT_IMAGE_LOADING_SOURCE_INVESTIGATION_20261028.md`.

Primary finding: stable DOM preservation is the highest-value correction. ACT1/Pocket already use `setStableHtml`; ACT6–13 unconditionally rebuild Scene HTML every 1200 ms poll, then replace the formal Scene node and rehydrate it. URL caching does not preserve decoded node state.

Other confirmed contributors:

1. ACT4/Sprint5/Pocket independent assets resolve serially;
2. concurrent same-key Scene/Pocket requests are not coalesced before cache fill;
3. null/transient resolver failures are cached for 30 seconds;
4. URL-only cache cannot prevent repeated attach/decode after node replacement.

Recommended minimal package, only if separately authorized: keyed stable Sprint5/6 Scene DOM, in-flight resolver promise coalescing, no 30-second null cache, and parallel independent hydration, with cross-role/ACT/Pocket node-identity and failure-recovery regression. No ACT semantic rewrite or general asset architecture.

No product source, deployment, database, Storage or room mutation occurred.

NEXT_ACTION: CA reviews and decides whether to authorize a bounded source-only correction.

NEXT_OWNER: CA
