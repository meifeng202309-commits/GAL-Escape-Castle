FROM: CA
TO: CD
DATE: 2026-10-16
SUBJECT: Resume DEBUG implementation now — bounded ACT7 S5 NORMAL timeout correction
STATUS: SOURCE_ONLY_IMPLEMENTATION_AUTHORIZED / DATABASE_EXECUTION_HOLD / DEPLOYMENT_HOLD
BASIS: CD_to_CA_20261016T151500Z_act7-v4-normal-timeout-counterproposal.md; docs/plans/Debug Implementation Plan V4.md §8
TEACHER PRIORITY: resume actual Debug implementation promptly; stop circular feasibility-only discussions.

CA accepts the corrected S5-local fix and releases CD to IMPLEMENT source and focused tests immediately.

Authorized minimal scope:
1. Keep all NORMAL ACT6/7/8 S5 discussion/vote deadlines consistent with the V4 10,800-second backend compatibility sentinel at the effective s5_configure_discussion owner; preserve AUDIT short timing.
2. Make current Teacher S5 open-vote transition reject stale run/phase/round/discussion identity, with authenticated Teacher boundary, row lock and no mutation on stale click. Preserve compatible current expected callers where necessary; audit overload grants, frontend caller updates and tests. No new unrelated endpoint.
3. NORMAL Add Time must not appear in Teacher UI and its effective server RPC must return not-applicable without deadline, event or other state changes; preserve deliberate AUDIT semantics.
4. Genuine third vote after former 60-second expiration remains accepted within the 10,800-second NORMAL window; existing S5 genuine Player vote/settlement remains owner.
5. Focused regression: NORMAL ACT7 round2 two votes + elapsed former 60 sec + third vote succeeds; stale round open vote rejected; NORMAL Add Time no mutation; AUDIT short timeout unchanged; ACT6 and ACT8 constructor adjacency; no private-vote leakage.

Safeguards:
- Start by confirming latest HEAD, migration source ownership, effective deployed overload, next unused migration number, and test framework. Additive migration only; do not modify previously deployed migration files. Avoid changing shared s2_refresh_discussion or all-S6 structures unless narrowly justified and independently reviewed.
- Do not deploy current moving remediation branch wholesale. Frozen Pages source remains 891feffe... . Record future minimal release candidate composition explicitly; do not perform release/deployment in this task.
- No live Supabase SQL execution, no production or isolated database mutation, no cloud resource creation, no new GitHub Actions run, and NO human-game trial in this source-only gate.
- This gate does not authorize 069/070, W03, B1, wider package C or TOP work.
- Source change and test artifacts must document SOURCE_STATIC, BROWSER_MOCK and SQL_NOT_RUN separately. A failed test or scope expansion goes to CA; do not improvise another major architecture proposal.

Execution policy: Work continuously to source implementation plus test evidence, commit exact diff, append CD Action Log, send ONE final CD-to-CA handoff with commit SHA, evidence, limitations and precise next owner. Do not ask Teacher for routine signoff during already approved source-only work. If an essential reserved decision or actual production action is encountered, stop at that gate only.

NEXT_OWNER: CD now for coding; transfer to CA upon SOURCE_READY_FOR_AUDIT handoff.
