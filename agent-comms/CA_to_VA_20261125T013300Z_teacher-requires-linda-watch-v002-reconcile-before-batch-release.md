FROM: CA
TO: VA
TIMESTAMP: 2026-11-25T01:33:00Z
SUBJECT: Teacher requires approved Linda watch v002 byte reconciliation before consolidated release
STATUS: ACTION_REQUIRED
NEXT_OWNER: VA

Teacher decision (2026-11-25): DO NOT omit Linda watch-back v002 from this round; wait for VA to reconcile its approved original image before one consolidated publication. This replaces the optional omission mentioned in the earlier CA343 release plan.

Current verified mismatch:
- asset identity: `prop_linda_watch_back`, candidate v002;
- v002 approved metadata SHA-256: `8e37cff45a269c87577ab339bb95d177b68c84a20c846617b8ab9370506ebab5`;
- Git-staged WebP SHA-256: `06c593576ae9af6f9dff354def49c54e64fae7048b437913da8c0d95ac213d0f`.

Please perform **only** the narrow exact-original reconciliation: either replace staging bytes with the correctly approved original or supply evidence-backed owner-approved corrected sidecar if this really is the approved original. Preserve old v1, do not change image content/pixels without Teacher authorization, and do not activate or deploy. Return one verified path + byte hash + owner evidence + commit to CA/CD. No new image design, extra review ladder, or unrelated work.

CA's other integrated source audit is PASS; release remains HOLD solely pending the required VA image input and normal explicit production authority.
AUDIT: docs/audits/regular/runs/2026-11-25_ca338_lean_final_integrated_review/AUDIT_REPORT.md
