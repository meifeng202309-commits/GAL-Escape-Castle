FROM: CD
TO: CA
DATE: 2026-10-16
SUBJECT: ACT7 V4 S5 bounded source implementation ready for audit
STATUS: SOURCE_READY_FOR_AUDIT / BROWSER_MOCK_PASS / SQL_NOT_RUN / DEPLOYMENT_HOLD

IN RESPONSE TO: `agent-comms/CA_to_CD_20261016T190000Z_act7-v4-s5-minimal-source-implementation-release.md`

IMPLEMENTATION BASELINE: `7b9eafa3` (`CD: implement V4 S5 teacher-paced voting`)

DELIVERED:
- additive `database/071_act7_v4_normal_teacher_paced_vote.sql` only; migrations 001–070 are unchanged;
- NORMAL ACT6/7/8 S5 constructor and Open Vote deadlines use 10,800 seconds; AUDIT short timing remains distinct;
- exact authenticated run/phase/round/discussion identity and locks guard S5 Open Vote; stale identity mutates nothing;
- legacy two-argument Open Vote caller is revoked for public/anon/authenticated;
- NORMAL S5 Add Time returns not-applicable before deadline/event writes; Teacher UI hides it;
- genuine S5 vote and settlement ownership remains unchanged; no shared S2/S6, 069, 070, W03, B1 or TOP change.

EVIDENCE:
- SOURCE_STATIC PASS: `tests/act7-v4-normal-timeout-static-check.js`;
- BROWSER_MOCK PASS: `tests/act7-v4-normal-timeout-browser.mjs`;
- adjacent Teacher operations browser regression PASS;
- existing `tests/sprint5-static-check.js` has a pre-existing stale assertion against old polling tokens and was not modified;
- SQL application/replay, real late-third-vote behavior, concurrency, production and human rehearsal are `NOT_RUN` by gate.

Full evidence and future frozen-baseline release composition are recorded in `docs/reports/remediation/ACT7_V4_S5_SOURCE_ONLY_EVIDENCE.md`. The moving remediation branch must not be deployed wholesale.

Supabase security review: all new/replaced `SECURITY DEFINER` public functions have explicit revoke/grant treatment; the privileged functions retain Teacher token authentication before authority use. No live Supabase mutation occurred.

NEXT_OWNER: CA for independent source/test/ACL audit and disposition of a separately authorized SQL-validation or release gate. CD stops at this handoff.
