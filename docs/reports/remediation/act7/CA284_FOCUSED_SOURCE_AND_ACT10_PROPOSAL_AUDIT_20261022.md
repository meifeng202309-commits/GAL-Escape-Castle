# CA-284 focused review — Batch A and ACT10

Date: 2026-10-22
Basis: CD commit `44373b6d23b8`, source/test diff, `CA284_BATCH_A_CLIENT_SOURCE_EVIDENCE_20261022.md` and `CA284_ACT10_TEACHER_OPEN_VOTE_NARROW_PROPOSAL.md`.
Policy: Function First, UI/UX Last; avoid disproportionate scope.

## Task A: SOURCE PASS (not deployed)
Reviewed two app/Teacher source diffs and existing browser test extensions. The Library input draft identity is limited by run, scene, phase, locked prefix and unresolved state. ACT9/10/11 message draft identity is run, phase and discussion session. Station A viewport restoration applies only while its A task remains pending; Teacher transcript preserves near-bottom-follow or earlier scroll offset. State transitions invalidate old drafts. There is no new framework or server semantics change. CD reported static, syntax and headless-browser PASS; CA reviewed patches and test assertions but did not independently rerun the browser environment. No audit blocker identified.

Acceptance condition for eventual deployment: public served bytes match audited candidate and isolated real-browser smoke confirms Library code, message composer, viewport and Teacher scroll. No independent SQL or broad polling redesign.

## Task B: DESIGN PASS — SOURCE-ONLY IMPLEMENTATION AUTHORIZABLE, NO RELEASE
ACT10 NORMAL 300-second discussion deadline is intentional existing SQL contract. Teacher-approved removal requires changing the server timer owner and adding a guarded ACT10 Open Vote action. Existing S2/S5 Teacher RPCs are not S6 ACT10 owners, so blindly routing through them is not acceptable. CD proposal's two narrow additions — read-only S6 Teacher phase projection and one teacher-authorized transition — are proportionate if they reuse existing Teacher token validation, run/session guards and logging helpers. Keep ACT10 private selection and final Take/Leave outcome unchanged. Set NORMAL ACT10 deadline null and disable NORMAL automatic advancement only in this phase; preserve ACT9, ACT11 and AUDIT timings. Stale/repeated RPCs must fail without mutation; no historical/backfill rewrite.

Implementation gate: source-only SQL migration draft and minimal Teacher frontend code/tests; verify contracts via local/isolated checks, **no** production database or Pages operations. Before any live release CA must audit exact SQL, grants, immutable history, NORMAL/AUDIT negative controls, and existing active session handling. The proposal is a design, not a runtime PASS.

## Deferred
No extra prompt/localization/style/audio or Teacher Live Operations overhaul. No additional security framework, generalized vote refactor or migration sweep.

Disposition: TASK A PASS / TASK B DESIGN PASS; next_owner CD for bounded source/test implementation of Task B. Teacher separate release decision required.
