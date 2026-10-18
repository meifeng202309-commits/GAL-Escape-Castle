# ACT7 migration 071 — source and recovery release packet

Status: `SUPERSEDED_AS_EXECUTION_SUMMARY_BY_071_INTEGRATED_READINESS_PACKET_20261018`; production SQL and Pages deployment remain HOLD. Historical preparation facts below remain evidence, but future execution must use the integrated packet and a fresh immediate prechange snapshot.

## Exact identities and candidate composition

- Frozen deployed Pages baseline: `891feffe558a4683ac3da67e1e6b15e902c7e592` from `deploy/manual-acceptance-20261003` root.
- Original implementation commit: `7b9eafa74f7e2437c668f942a15f2f33e2c11eea`.
- Effective source/recovery preparation commit: `d2ceb19589e71bb848d3f880f97c830dc11f1792`; this adds an explicit transaction around 071 and recovery evidence without changing the accepted behavior.
- Database candidate: only `database/071_act7_v4_normal_teacher_paced_vote.sql` after `d2ceb19`.
- Minimal client candidate: start from frozen `891feffe…` and apply only the `teacher.html` and `src/teacher/teacher-console.js` hunks introduced by `7b9eafa`; do not copy the entire moving remediation tree.
- Verification-only files: the two `tests/act7-v4-normal-timeout-*` tests and the Sprint5 stale-assertion update. They are not public runtime files.
- Explicit exclusions: migrations 069/070, Player `src/game/app.js`, S2/S6/TOP work, assets and every unrelated remediation-branch delta.

## Additive SQL surface

Migration 071 is transaction-bounded and changes no tables or business rows. It:

1. replaces `s5_configure_discussion(uuid,text)`;
2. replaces and revokes anon/authenticated access to legacy `s5_teacher_open_vote(text,text)`;
3. adds `s5_teacher_open_vote(text,text,uuid,text,integer,uuid)` and grants it to anon/authenticated after explicit PUBLIC revoke;
4. replaces `s5_teacher_add_time(text,text,integer)`;
5. replaces `s5_get_teacher_discussion_state(text,text)` to project `phase_key` required by the exact caller.

All are `SECURITY DEFINER`, owner expected `postgres`, `search_path=public`. Internal configure remains postgres/service-role only. Existing add-time and teacher-state ACLs are preserved. The current deployed catalog and exact definition hashes are in `071_PRECHANGE_CATALOG_20261016.md`.

## Expected behavior

Before: NORMAL S5 uses 15/90/180-second discussion and 60-second vote limits; generic refresh can move ACT7 to `waiting_for_missing_player`; frozen Teacher calls an identity-free Open Vote and exposes Add Time.

After: NORMAL ACT6/7/8 stores 10,800 seconds for both discussion and vote; a genuine third vote remains actionable past the former 60-second boundary; Open Vote requires the exact current run/phase/round/discussion; NORMAL Add Time is hidden and returns not-applicable before writes; AUDIT retains short timing and Add Time behavior.

## Verification completed

- `SOURCE_STATIC_PASS`: ACT7-specific static test, repaired Sprint5 static test, A1 polling static test, B-min Teacher projection static test.
- `BROWSER_MOCK_PASS`: ACT7 Teacher identity/Add-Time test and existing B-min Teacher operations browser regression.
- Production catalog snapshot: `READ_ONLY_PASS`; no private/business rows read.
- `SQL_NOT_RUN`, `ISOLATED_SQL_NOT_RUN`, `MULTIPLAYER_NOT_RUN`, `PRODUCTION_NOT_APPLIED`.
- No already-authorized disposable host exists: connected Supabase listed zero branches and only the production project. No project/branch was created and no cost was incurred.

## Maintenance and forward procedure

Reserved for a separately authorized production gate:

1. Declare maintenance; preserve the 577 historical plus two retained synthetic ACTIVE runs. Capture their identities/count and require a fresh no-current-play observation interval plus the approved six-function admission freeze and service-role quiescence. Any new admission/activity or row-identity drift is STOP; do not clean rows to manufacture zero.
2. Re-capture exact prechange function definitions/raw and newline-normalized MD5/owner/ACL. The current LF raw baseline differs from the historical CRLF snapshot by verified newline representation; any semantic mismatch is STOP for CA review.
3. Verify Pages still serves the five frozen `891feffe…` fingerprints and preserve the current Pages source as rollback.
4. Apply only migration 071 as one transaction. If any statement fails, the transaction rolls back; do not deploy client files.
5. Verify postchange signatures: old two-argument Open Vote has no PUBLIC/anon/authenticated execute; the six-argument overload exists with anon/authenticated execute and no PUBLIC execute; configure is internal; add-time/state retain expected roles; all owners are postgres and definitions match the reviewed source.
6. Publish a candidate branch created from `891feffe…` containing only the two minimal client hunks. Do not switch Pages to the moving remediation branch.
7. Verify public fingerprints against the candidate manifest, restore exact admission ACLs while keeping admission operationally closed, then run `tests/act7-071-controlled-acceptance.js` plus `071_ACCEPTANCE_READONLY_INVARIANTS.sql` under a separately authorized gate.
8. Keep maintenance/release status unapproved until SQL, UI identity, late-third-vote, stale-click, authentication, Add-Time nonmutation and AUDIT checks have factual results.

There is an unavoidable compatibility seam during the two-step release: old client cannot call the revoked two-argument endpoint after SQL, while new client cannot call the six-argument endpoint before SQL. The approved no-current-play observation, six-function admission freeze and operational service-role lock are therefore mandatory. Apply SQL first, then switch the client immediately; do not admit Players between steps, and preserve the retained ACTIVE rows unchanged.

## Recovery procedure

- If 071 fails inside its transaction: verify prechange MD5/ACL and retain frozen Pages; no recovery DDL should be needed.
- If 071 succeeds but client publication/fingerprint verification fails: execute `071_RECOVERY.sql` in a separately authorized transaction, verify the exact prechange signatures/ACL/MD5, and keep/switch Pages to frozen `891feffe…`.
- If both deploy but acceptance fails: keep admission frozen, capture failure evidence, restore Pages to `deploy/manual-acceptance-20261003@891feffe…`, execute `071_RECOVERY.sql`, and re-verify the fresh immediate prechange catalog snapshot. The recovery SQL restores code/ACL only; it deliberately does not erase gameplay/events and therefore requires separate disposition for every synthetic-room row.
- Git revert alone is not database recovery.

## Production authorization status

`PRODUCTION HOLD`. The earlier one-operation authorization was consumed by the 2026-10-18 attempted acceptance and rollback and is not reusable. The old zero-active-session premise is also obsolete: 579 ACTIVE rows are intentionally preserved (577 historical plus two retained synthetic fixtures), and no cleanup may be used to manufacture zero.

Any future production attempt requires a new explicit high-risk gate covering exactly:

1. transactional application of reviewed migration 071;
2. Pages switch from frozen `891feffe…` to a manifest-verified candidate containing only the two Teacher client hunks;
3. one synthetic three-Player room acceptance under `071_CONTROLLED_ACCEPTANCE_PLAN.md`;
4. authority to execute `071_RECOVERY.sql` and restore Pages to `891feffe…` if any gate fails.

That future request must use the reviewed no-current-play observation, six-function admission freeze, service-role quiescence, mandatory fixture-boundary SQL capture and rollback envelope. It must not infer authority from the previous gate. No authority exists for 069, 070, broad Package C, new cloud resources, student data, or a human/student rehearsal.
