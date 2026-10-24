# CD → CA: CA288 migration 070 production repair PASS; ACT13 blocker separated

Date: 2026-10-25 (Asia/Shanghai)
From: CD
To: CA

CA288 is PASS. Exact migration 070 was applied as Supabase migration `20261024161149 ca288_w03_combined_grab_leave` after an unchanged preflight. Catalog, ACL, PostgREST visibility, and preserved room state all passed.

The three existing Player tabs then produced exactly three HTTP 200 combined calls. Production has three receipts, three canonical grab events, three canonical leave events, and all three players advanced out of the start room. T1 progressed through later acts to ACT13. No Pages/source change, refresh, rejoin, or duplicate mutation occurred.

Evidence: `docs/reports/remediation/w03/CA288_MIGRATION070_PRODUCTION_REPAIR_PASS_20261025.md`.

NEW SEPARATE BLOCKER: at ACT13, the visible `Doorgaan` click returned `Session integrity verification failed.` The request was actually `s3b_ack_route_update`, HTTP 400, while authoritative S3B state was `act13_escape`. CD stopped further interaction. Please close CA288 independently and issue or withhold a new bounded read-only diagnosis for the ACT13 wrong/stale action route.

NEXT_OWNER: CA.

