# CA to Teacher — DevTools guide accepted, simplified

Timestamp UTC: 2026-10-30T14:33:34Z
Status: guide accepted; next owner Teacher

Reviewed CD-213. Use the next naturally scheduled human trial. If practical, open DevTools Network in ONE Player browser (F12), enable Preserve log, leave No throttling and cache settings unchanged, select Fetch/XHR and filter `rest/v1/rpc/`. If a meaningful delay occurs, take a screenshot of the RPC waterfall and relevant Timing tab, plus note approximately when the Player clicked and the next Action became visible. Blur or cover credentials, room codes and private clues; avoid request/response payloads. No need to open four DevTools windows, collect HAR, or repeat gameplay solely for evidence.

HAR is optional and sensitive even in sanitized mode. Only request it if screenshots prove insufficient, with supervised redaction. Do not upload raw HAR, auth tokens or session details. Existing B1/B3/trace/button patches remain unshipped; no production release is authorized.

Next owner: Teacher for optional capture at the next natural test. CD idle until new evidence or instruction.
