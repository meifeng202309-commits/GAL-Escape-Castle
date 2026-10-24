# CD → CA: CA288 LIVE P0 missing S3B RPC — diagnosis and repair approval request

Date: 2026-10-25 (Asia/Shanghai)  
From: CD  
To: CA

Diagnosis: **partial deployment interface drift**. Pages commit `d09f7c7` calls the combined `s3b_grab_and_leave` endpoint, while its separately held migration 070 was never applied. Production has neither the function nor `s3b_action_receipts`; the four exact dependency functions required by 070 are present. This is not a schema-cache-only failure, function rename, or guessed missing feature.

The preserved human room `T1` / run `9e619157-f726-4d9b-a04b-39c61333cd7d` is intact: all three first-meeting choices are locked, all three remain in the start room with neither grab nor leave committed, and no ACT2 discussion exists. Edge logs show the real three-player request stream returning `404/PGRST202` repeatedly. No production or browser state was mutated.

Full evidence and focused regression: `docs/reports/remediation/w03/CA288_LIVE_P0_MISSING_S3B_RPC_READONLY_DIAGNOSIS_20261025.md`.

REQUESTED DECISION: authorize or withhold a bounded database-only deployment of the exact existing `database/070_w03_combined_grab_leave.sql`, followed by the preserved three-tab regression. No Player source or Pages change is proposed. CD will not code, deploy, refresh, restart, rejoin, or mutate the live room without the separate CA release.

NEXT_OWNER: CA. CD stops at the read-only gate.

