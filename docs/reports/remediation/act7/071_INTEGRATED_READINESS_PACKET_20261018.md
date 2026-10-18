# Migration 071 integrated readiness packet

Status: `READY_FOR_ONE_INTEGRATED_CA_AUDIT / PRODUCTION_HOLD`  
Authority: CA-238, CA-239 work-packet 1  
Prepared from remediation baseline: `b8b41434c0149ba961010bc245fcbd93599a8e38`

## 1. Authority boundary

This packet is source/document/test readiness only. It does not authorize or report a new SQL deployment, ACL change, Pages switch, production acceptance run, synthetic cleanup, CRLF rewrite or UI redesign. Production remains on frozen Pages `891feffe558a4683ac3da67e1e6b15e902c7e592`; migration 071 is not deployed. Preserve 577 historical ACTIVE runs plus the two retained synthetic prepared-state runs.

## 2. Exact candidate composition

Database candidate:

- `database/071_act7_v4_normal_teacher_paced_vote.sql` only.
- Explicitly excluded: 069, 070, all other migrations and all table/business-row changes.

Frozen client candidate:

- base: `deploy/manual-acceptance-20261003@891feffe558a4683ac3da67e1e6b15e902c7e592`;
- candidate proof commit: `deploy/act7-071-20261017@6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`;
- exact diff: only `teacher.html` (2 changed lines) and `src/teacher/teacher-console.js` (15 changed lines);
- no Player client, CSS, asset, 069/070 or moving-remediation-tree content.

Candidate public-byte SHA-256 manifest:

| Path | Frozen baseline | Candidate |
|---|---|---|
| `index.html` | `1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4` | unchanged |
| `teacher.html` | `d2f7b8f0bfc07912fb484004d2aff8a87a20d3e8d99b0f98e25fd5a28b72950f` | `628bb101a23e312d5f69d992d0c1212665350a130f1c124af04460b1afdb6cf3` |
| `src/game/app.js` | `9f19c27f92be9835ea5d9b48e196803dcee85eae032feb0f9e65fe3e97b323fa` | unchanged |
| `src/teacher/teacher-console.js` | `ce8fb816caf2c362311772a6eb70944b1c645eff18a64aad8b221aaa2dce474d` | `4dd355ede45e5e29619da93becb5c0e47d2e9f93c9cf544edc20e876181df1ad` |
| `src/styles/app.css` | `3a375c87aeec797e2b32f8ba383d91af9ef6f9e9d01bb40cf0e3faa0f04ead7c` | unchanged |

## 3. Corrected acceptance sequence

Executable: `tests/act7-071-controlled-acceptance.js` (default closed; requires a separately approved `ACT7_071_PRODUCTION_AUTHORIZED=YES`).

NORMAL:

1. create/join one synthetic three-Player room;
2. finish ACT1–5, assert ACT6 prepared state has no canonical discussion;
3. each Player observes ACT5 handoff then enters ACT6; assert no discussion at 0/1/2 and exactly one stable identity/deadline at 3;
4. verify ACT6 NORMAL stored 10,800/10,800; complete two ACT6 rounds and enter ACT7;
5. create ACT7 round 2, identity-bound Open Vote, two genuine votes, wait 61 seconds, verify still voting/no lost controls, submit genuine third vote;
6. verify one next round, stale prior payload rejection, NORMAL Add Time no-op, invalid token rejection;
7. solve ACT7, enter ACT8 final vote and verify 10,800/10,800 adjacency.

AUDIT:

1. use the same current three-Player barrier and two ACT6 rounds;
2. enter ACT7 and verify stored 15/60;
3. deliberately expire discussion, verify voting/approximately 60 seconds;
4. wait 61 seconds, verify `waiting_for_missing_player`;
5. Add Time must return applicable and reopen voting with a future deadline.

Protected exact row/event evidence is supplied by `071_ACCEPTANCE_READONLY_INVARIANTS.sql`; browser projections alone are not promoted to SQL PASS.

## 4. Requirement-to-evidence matrix

| Requirement | Source/local evidence | Future protected evidence | Current label |
|---|---|---|---|
| ACT5→ACT6 0/1/2/3 barrier and once-only identity | controlled fixture + static assertions | Q1 snapshots | `SOURCE_STATIC_PASS / SQL_NOT_RUN` |
| NORMAL ACT6/7/8 10,800 timing | migration + fixture | Q1 stored rows | `SOURCE_STATIC_PASS / SQL_NOT_RUN` |
| exact Teacher run/phase/round/discussion identity | migration, fixture, browser intercepted payload | Q1 + Teacher event count | `SOURCE_STATIC_PASS / BROWSER_MOCK_PASS / SQL_NOT_RUN` |
| genuine late third vote after 61 seconds | fixture | Q1/Q2, no waiting event | `SOURCE_PRESENT / MULTIPLAYER_NOT_RUN` |
| exactly one resolution effect | fixture expectation | Q3 | `SQL_NOT_RUN` |
| stale Open Vote nonmutation | fixture rejection | paired Q1 hashes/counts | `SOURCE_PRESENT / SQL_NOT_RUN` |
| NORMAL Add Time nonmutation | SQL early return + hidden UI + fixture | paired Q1 hashes/counts | `SOURCE_STATIC_PASS / BROWSER_MOCK_PASS / SQL_NOT_RUN` |
| invalid token nonmutation | fixture rejection | paired Q1 hashes/counts | `SOURCE_PRESENT / SQL_NOT_RUN` |
| AUDIT ACT7 15/60, timeout, Add Time | corrected fixture + static coverage | Q4 | `SOURCE_STATIC_PASS / SQL_NOT_RUN` |
| rollback exactness | reviewed recovery + fingerprint analysis | fresh pre/post catalog | `SOURCE_READY / EXECUTION_NOT_AUTHORIZED` |

## 5. Definition fingerprints and recovery boundary

The 2026-10-16 catalog recorded CRLF-body raw MD5 values. Recovery installed semantically identical LF bodies. Read-only substitution of current LF `prosrc` to CRLF exactly reproduces all four historical hashes:

| Function | Current LF raw MD5 | Historical CRLF raw MD5 |
|---|---|---|
| configure | `4cf7dd872a634dcc4a06b98b222a073f` | `6789065a3f46b7771c1f7608ee80b391` |
| Teacher state | `f4168be69f971c54b491334b01498182` | `352e1dd5729fa0ababd7f332aa3de1e5` |
| Add Time | `e71b9488e2970ba405126d0cbdb48ddf` | `b66ea3897c710cb381be330d6797bc30` |
| old Open Vote | `33f2df3abac4d12a985ce267b10762a2` | `d63a8861832ee33092632553eacc753c` |

For any future gate, the recovery target is the **fresh immediate prechange catalog**, currently expected to be the LF raw values—not a blind rewrite to historical CRLF. Record both raw MD5 and a newline-normalized body hash. Any mismatch beyond newline representation is STOP. No function may be rewritten merely to match the older raw fingerprint without separate authority.

## 6. Maintenance containment checklist

Before any mutation, all must PASS freshly:

- Teacher/operator attests no privileged/service-role automation or operator writes for the full window; CD is uninterrupted coordinator.
- Capture 579 ACTIVE rows and prove the 577 historical plus two retained synthetic identities remain unchanged; do not require or perform cleanup.
- Declared observation interval shows zero new admissions, player last-seen activity, gameplay/events/dialogue/receipts/overrides; any delta is STOP.
- No external non-idle database sessions, relevant queued/running GitHub Actions or Edge Functions; available API/Realtime evidence is recorded, with any accepted observability residual explicit.
- Capture owner, SECURITY DEFINER, raw and normalized definition hashes, full ACL and effective privileges for migration functions and the six admission functions.
- Verify Pages source and five frozen fingerprints plus rollback branch/commit.
- Verify `071_RECOVERY.sql`, Pages rollback operation and connector availability before freeze.

Freeze exactly these signatures by revoking PUBLIC/anon/authenticated/service_role, transactionally: `s1_create_room(text,text,text,text,text)`, `s1_join_player(text,text)`, `s9_start_formal_game(text,text,text)`, `s1_reset_room(text,text)`, `s3b_initialize_flow(text,text)`, `s2_start_run(text,text,text)`. Verify all effective denies and no PUBLIC grant. Repeat activity checks before 071.

## 7. Bounded execution and STOP gates

1. Apply only 071 transactionally; verify five expected identities, owners, definer flags, definitions and ACLs.
2. Publish only candidate `6e3bbd1…`; verify source commit and all five public hashes.
3. Restore the exact six admission ACLs before the one controlled acceptance while operational admission remains closed.
4. Run the gated fixture plus Q0–Q4 read-only evidence at labelled boundaries.
5. STOP and recover on catalog drift, activity delta, privilege mismatch, Pages mismatch, missing protected evidence, any assertion failure or inability to restore.

Pre-freeze admission ACL restoration:

- grant anon/authenticated/service_role to create, join, formal-start and reset;
- restore PUBLIC/anon/authenticated/service_role to initialize;
- restore service_role only to direct start;
- no PUBLIC on the other five; verify original owner/MD5/ACL exactly.

## 8. Exact rollback recipe

On failure after deployment:

1. keep operational admission closed; capture failure evidence and do not delete gameplay rows;
2. switch Pages to `deploy/manual-acceptance-20261003@891feffe…`, trigger build, verify the five frozen hashes;
3. execute `docs/reports/remediation/act7/071_RECOVERY.sql` transactionally;
4. verify six-argument Open Vote absent, four pre-071 signatures/owners/definer/ACL restored, and definitions equal the fresh immediate prechange baseline modulo only the separately recorded newline representation;
5. restore/verify the six admission ACL snapshot;
6. preserve all synthetic rows pending a separate cleanup decision and report exact result to CA.

Git revert alone is never database recovery.

## 9. Local commands/results

- `node --check tests/act7-071-controlled-acceptance.js` — PASS.
- `node --check tests/act7-v4-normal-timeout-browser.mjs` — PASS.
- `node tests/act7-v4-normal-timeout-static-check.js` — PASS.
- bundled Playwright, local loopback `tests/act7-v4-normal-timeout-browser.mjs` — PASS.
- Live acceptance flag — NOT USED.

## 10. Exact packet files and requested CA gate

Packet implementation/evidence files:

- `database/071_act7_v4_normal_teacher_paced_vote.sql`
- `tests/act7-071-controlled-acceptance.js`
- `tests/act7-v4-normal-timeout-static-check.js`
- `tests/act7-v4-normal-timeout-browser.mjs`
- `docs/reports/remediation/act7/071_ACCEPTANCE_READONLY_INVARIANTS.sql`
- `docs/reports/remediation/act7/071_RECOVERY.sql`
- this packet and the referenced root-cause/source evidence reports.

Requested next gate: one independent CA integrated packet audit. No production release is requested or implied until CA separately approves a fresh high-risk maintenance gate.
