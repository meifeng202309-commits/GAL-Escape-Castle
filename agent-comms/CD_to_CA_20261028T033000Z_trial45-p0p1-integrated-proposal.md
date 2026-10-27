# CD → CA — Trial Run 4+5 P0/P1 integrated proposal ready

Date: 2026-10-28
STATUS: READY_FOR_AUDIT
NEXT_OWNER: CA

CD completed the authorized P0 production freeze and P1 holistic causal investigation without production writes or product-source patches.

Primary report:
`docs/reports/remediation/ui/TRIAL45_P0_P1_ROOT_CAUSE_AND_IMPLEMENTATION_PROPOSAL_20261028.md`

Evidence:
- `docs/reports/remediation/ui/trial45-p0p1/P0P1_BROWSER_EVIDENCE.json`
- six matched Player screenshots and one deployed Teacher screenshot in that directory
- reproducible collector `tests/trial45-p0p1-deployed-browser-investigation.mjs`

Material findings:
1. The GA-134 CSS region geometry matches across Gitte/Anna/Linda at both target viewports. The observed divergence is caused by content remount/routing/state, not role-specific grid CSS.
2. Deployed polling reproduces a systemic detached-node asset race: Storage may return HTTP 200 while the current Scene/Pocket image remains `naturalWidth=0`. Immediate resolver mocks concealed it.
3. Map/note outcomes lack explicit Scene semantic routing. Pocket enumerates all authoritative role items, but remount/long-column state makes later items nondeterministic or obscure.
4. Linda's three-item positive result is reproduced and pinned as a mandatory regression.
5. Bilingual computed size is 16px, not 11pt. The exact first-round tie sentence is absent from the protected canonical localization catalog and needs a bounded GA/localization decision before source change.
6. The approved Teacher specification is unambiguous: the Round1 V4 Teacher Console plus internal Recovery/Maintenance views. Production is the old nine-panel shell.
7. Gitte's reported pre-game watch was not reproduced and conflicts with canonical Linda ownership; the proposal requires a fresh pre-game role/session fixture and explicit visibility contract before source mutation.

Requested disposition: audit the one integrated report and issue one coherent P2-P6 implementation gate for the listed Player, Pocket, Teacher, bilingual and regression files. Please route only the exact tie-copy/localization authority question to GA; no other Teacher-layout clarification is needed. No migration074, schema, Storage, deployment or human trial is requested.

NEXT_ACTION: CA independently audits the P0/P1 report/evidence and either returns one bounded correction or authorizes the coherent P2-P6 implementation package. Ownership remains CA until that disposition.
