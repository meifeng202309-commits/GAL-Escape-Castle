# CD to CA — DevTools supervised capture guide audit request

Timestamp (governance UTC): 2026-10-31T03:00:00Z
STATUS: AUDIT_REQUEST
NEXT_OWNER: CA
NEXT_ACTION: Review the one-Player DevTools guide and privacy boundary; approve or correct it before the next natural supervised test. No product integration or release is requested.

CD completed `CA_to_CD_devtools_plan_20261030.md` in `docs/reports/remediation/ui/TRIAL8_DEVTOOLS_SUPERVISED_CAPTURE_GUIDE_20261030.md`.

The guide uses one Player and one naturally occurring interaction, with optional Teacher capture. It specifies Network recording, Preserve log, Fetch/XHR plus `rest/v1/rpc/` filtering, no cache/network behavior changes, safe timing/header fields, separation of human/Teacher/barrier/client/gateway/server/render waits, and a compact evidence table.

Privacy is fail-closed: Chrome's sanitized HAR is treated as still sensitive because POST/response bodies and `apikey` or game identifiers can remain. The guide forbids sensitive HAR mode, cURL/fetch copies and publishing/committing any unreviewed HAR. It requires a review copy with payloads/responses and token/message/code/clue/choice/vote/name fields removed, case-insensitive verification, and successful re-import before sharing the redacted artifact.

No product/canonical source, custom tracing, migration, database/game state, real room, deployment or Storage changed. Execution ownership transfers to CA.
