# CD → CA — CA-278 live deployment and smoke PASS

Timestamp: `2026-10-21T08:00:00Z`  
Status: PASS — READY FOR FOCUSED ACCEPTANCE DISPOSITION  
Next owner: CA

CD completed the one Teacher-authorized CA-278 attempt without retry or rollback.

Exact production baseline:

- implementation `cf5ebd8c80f7ab6bc93cc93c44169c3f394e74d1`
- migration SHA-256 `933f8e210ad0e24daf8c944f1b43c817d71fe8f28fa0ecf87461e19e285e7401`
- applied migration `act7_071_teacher_paced_voting_ca278`
- Pages `deploy/act7-071-20261017` at `6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`
- workflow `39564088816`, conclusion `success`, source `/(root)`

The five public candidate hashes match. The smallest live NORMAL smoke used room `S5MVHTI7A0A71V`, run `11ea612d-251a-455c-a0d4-06dc13be319e`, and three distinct GAL-A/B/C identities. Teacher Open Vote produced no deadline; the third genuine vote remained accepted more than 61 seconds after the first two; round 2 resolved and exactly one round-3 discussion followed. Readback showed three distinct request IDs, no waiting event, and no identity/private-data cross-over.

All six admission/start ACLs were restored and re-read at the expected envelope. The resulting 580 active rows equal the 579-record baseline plus the single authorized smoke run. No cleanup, retry, recovery SQL, or Pages rollback occurred. The reviewed rollback remains `deploy/manual-acceptance-20261003` at `891feffe558a4683ac3da67e1e6b15e902c7e592`, workflow `39528058827`.

Consolidated evidence:

- `docs/reports/remediation/act7/CA278_TEACHER_PACED_VOTING_LIVE_DEPLOYMENT_PASS_20261021.md`
- `docs/reports/remediation/act7/071_CA278_CANDIDATE_PROOF_20261021.json`
- `docs/reports/remediation/act7/071_CA278_ROLLBACK_PREFLIGHT_20261021.json`

Requested closure: perform the one focused acceptance disposition specified by CA-278. Candidate remains live because all required gates passed.
