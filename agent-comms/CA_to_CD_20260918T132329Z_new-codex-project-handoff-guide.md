FROM: CA
TO: CD
TIMESTAMP: 20260918T132329Z
SUBJECT: new-codex-project-handoff-guide
STATUS: ACTION_REQUIRED

# New Codex Project Handoff Guide

This message is written for a NEW Codex instance taking over the existing GAL Escape Castle repository.

Do not assume you have reliable context from any previous Codex conversation.

Your source of truth is GitHub.

Repository:

```text
meifeng202309-commits/GAL-Escape-Castle
```

Branch:

```text
main
```

IMPORTANT:

- fetch current `main` first;
- do not force-reset the repository to an older audit baseline;
- preserve changes made by CA / VA / GA after the Sprint 2 implementation commit;
- inter-Agent communication must happen through `agent-comms/` under the active protocol;
- do not ask the user to manually relay Agent messages.

---

# 1. Your identity and role

You are:

```text
CD = Codex
```

Your responsibility:

- implement approved code/database/runtime changes;
- write additive migrations;
- maintain tests;
- deploy/verify when explicitly required;
- report exact evidence;
- follow canonical specifications;
- communicate with CA / VA / GA through GitHub.

You are NOT the Coding Audit Agent.

CA independently audits your work.

Current aliases:

```text
CA = Coding Audit Agent
VA = Visual Agent
GA = Game Design Agent
CD = Codex
```

---

# 2. FIRST: understand repository navigation and communication

Read these first, in this order.

## 2.1 `README.md`

Function:

Project-level map and current implementation summary.

It tells you:

- canonical specification paths;
- repository directory roles;
- current Sprint 1 / Sprint 2 implementation location;
- the fact that database migrations must be applied in numeric order.

Use it as the entry map, not as the detailed implementation spec.

---

## 2.2 `docs/README.md`

Function:

Repository storage and documentation rules.

You must understand:

```text
docs/specs/current/ = current canonical specifications
docs/specs/archive/ = historical/read-only specifications
docs/reports/       = audits/testing/completion evidence
docs/setup/         = deployment/setup notes
assets/             = registry/staging
agent-comms/        = Agent communication only
```

Hard rule:

Do not recreate current specs or ad-hoc reports in repository root.

Do not edit archived specs as if they were current.

---

## 2.3 Highest ACTIVE `agent-comms/inter_agent_talk_protocol V*.md`

Current known version at this handoff:

```text
agent-comms/inter_agent_talk_protocol V1.md
```

Function:

Defines all CA / VA / GA / CD communication.

It defines:

- aliases;
- sender/receiver filename format;
- timestamp convention;
- reply rule;
- broadcast rule;
- source-of-truth rule;
- safety rules.

Normal message filename:

```text
<sender>_to_<receiver>_<YYYYMMDDTHHmmssZ>_<subject>.md
```

Before communicating, always check whether a higher ACTIVE protocol version exists.

Do not reuse the old ROUND-* test convention.

---

## 2.4 `agent-comms/CA_to_ALL_20260918T112610Z_github-only-inter-agent-communication.md`

Function:

Records the user's standing directive that all work instructions, handoffs, audit requests, audit results, and cross-Agent information exchange must use GitHub protocol messages.

This means:

- do not depend on the user copying your output to CA/VA/GA;
- write the message yourself;
- reread critical handoffs after writing.

---

# 3. Canonical specifications — MUST READ

The current canonical set is under:

```text
docs/specs/current/
```

Do not code from old root copies or archived versions.

## 3.1 `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`

Function:

This is the authoritative game/narrative/interaction behavior specification.

It defines WHAT the game must do.

For Codex, especially read the sections by TITLE, not remembered line numbers:

- `# 5. 正式选择 / 投票 / Re-vote 规则`
- `# 8. 总体状态机`
- `# 9–24. ACT 1–14`
- `# 11. 通用 DiscussionRoom 组件`
- `# 24. ACT 14 ... Session Finalization`
- `# 31. Codex 实现规格`
- `# 32. Teacher Console`
- `# 33. 数据完整性与断线恢复`
- `# 38. Multiplayer Execution Rules`
- `# 40. Audio Safety / Accessibility`
- `# 42. Production Detail Rule`
- `# 44. 场景分类：图片 / UI / 音效`
- `# 50. Game Asset Manager`
- `§50.7 Visual Asset Generation / Naming / Transfer Workflow`
- `§50.8 All-Agent Communication Governance`
- `§50.9 ~5% Rule-Change Threshold`

Important current main-game boundary:

```text
ACT 1–14 only
```

Post-game Behavior Trace / prediction modules are not active runtime scope.

Important DiscussionRoom facts include:

- one vote per player per vote round;
- re-vote creates a new vote_round;
- tie-break discussion creates a new discussion_session_id;
- missing vote is never synthesized;
- ACT2 / ACT5 / ACT6 use SINGLE_REVOTE_THEN_FALLBACK;
- ACT7 / Great Hall use REPEAT_UNTIL_MAJORITY;
- tie behavior is scene-configurable, not global.

If code conflicts with V4.0, do not silently reinterpret V4.0.

Report the conflict through Agent communication.

---

## 3.2 `docs/specs/current/Codex程序开发说明书 V2.3.md`

Function:

This is your primary engineering implementation guide.

It defines HOW Codex must extend the repository.

Read the whole file before starting a new Sprint.

Critical sections:

- `# 0. 文件地位与阅读顺序`
- `# 1. 当前 Repository 基线：Sprint 1 已验证，不得重做`
- `§1.2 HARD COMPATIBILITY BOUNDARY`
- `§1.3 数据库 migration 原则`
- `# 4. Room vs Run / architecture principles`
- `# 5. Runtime State`
- `# 6. DiscussionRoom V4.0 合同`
- `# 7. Pocket / Knowledge`
- `# 8. Group Action`
- `# 11. Asset Manager`
- `§11.2 Canonical Visual Asset Workflow`
- `# 12. Database 增量计划`
- `# 13. Sprint 2 起的实施顺序`
- `# 15. Logging / Observability`
- `# 16. Testing`
- `# 17. Teacher / Security`
- `# 18. Codex 每个 Sprint 的交付报告`
- `# 19. Devil Check`
- `# 20. 下一步执行指令`
- `# 21. Definition of Done`

Database rule:

```text
extend, do not replace
```

`database/001_sprint1_core.sql` is a deployed verified baseline.

Use additive migrations:

```text
002_...
003_...
004_...
```

Do not rewrite Sprint 1 semantics.

---

## 3.3 `docs/specs/current/Castle Visual V2.1.md`

Function:

Visual production and visual/runtime boundary.

CD must read it because code is responsible for:

- HTML/SVG/CSS overlays;
- exact text/numbers/labels;
- UI anchors;
- runtime asset integration;
- image/audio Asset Manager behavior;
- keeping visual production separate from live publishing.

VA owns visual generation.

CD owns later runtime integration.

Important boundaries:

```text
VA
→ GitHub staging + candidate metadata + Teacher review

CD / Asset Manager
→ approved candidate verification
→ Supabase Storage
→ runtime metadata
→ unique ACTIVE
→ runtime resolver
→ fallback / telemetry
```

Do not ask VA to promote ACTIVE.

Do not burn exact gameplay text into AI images.

---

## 3.4 `docs/specs/current/从创意到游戏成品的研发流程V1.0.md`

Function:

Project-wide development and quality-gate process.

This is not just background reading.

It requires a multi-view Devil Check before a deliverable is called complete.

It defines:

- prototype-first iterative development;
- failure discovery;
- logic review;
- version-level Devil Check;
- software/gameplay/educational test layers;
- visual workflow;
- parallel development dependencies.

Before declaring your corrected Sprint 2 complete, perform the code/system Devil Check required by this document.

---

# 4. Machine asset authority

## 4.1 `assets/asset-registry.json`

Function:

Canonical machine identity/version authority for assets.

It owns:

- asset_key;
- display_name;
- aliases;
- asset_type;
- latest_version;
- active_version;
- continuity_refs;
- paired_asset_group;
- required_anchors;
- runtime_required.

Important rules:

- asset_key is opaque;
- never invent/translate/normalize it;
- latest_version controls new candidate numbering;
- active_version controls runtime;
- APPROVED != ACTIVE;
- MASTER reference IDs are not automatically runtime asset keys.

Initial registry bootstrap already passed CA audit.

Do not undo that validated structure casually.

---

# 5. Implementation baseline you must inspect before editing

## 5.1 `database/001_sprint1_core.sql`

Function:

Verified legacy Sprint 1 database/RPC baseline.

Status:

```text
VERIFIED PASS
```

Contains:

- rooms;
- player/session identity;
- private choice;
- reveal;
- reconnect;
- teacher recovery;
- Sprint 1 RLS/RPC hardening.

Do not modify it unless CA/GA identifies a concrete compatibility/security defect.

---

## 5.2 `database/002_runtime_runs_discussion.sql`

Function:

Deployed Sprint 2 reusable DiscussionRoom migration.

Contains:

- game_runs;
- discussion_sessions;
- dialogue_messages;
- runtime_player_decisions;
- runtime_events;
- Sprint 2 RPCs;
- run identity;
- voting;
- deadlines;
- reconnect state;
- RLS boundary.

IMPORTANT:

This migration has already been reported as deployed.

CA has found defects in its behavior.

Do not simply edit deployed history and pretend the database changed.

Use an additive correction migration.

Recommended next migration:

```text
database/003_sprint2_discussionroom_audit_fix.sql
```

---

## 5.3 `index.html`

Function:

Current student GitHub Pages entry.

It includes the Sprint 1 UI and generic Sprint 2 DiscussionRoom UI container.

Preserve existing tested entry path.

---

## 5.4 `teacher.html`

Function:

Current Teacher Console entry.

Contains current Sprint 1 controls plus Sprint 2 generic run/discussion controls.

Preserve tested entry path.

---

## 5.5 `src/game/app.js`

Function:

Student client behavior.

Currently handles:

- Sprint 1 player state;
- DiscussionRoom polling;
- transcript rendering;
- vote rendering;
- reconnect through persisted session.

One current audit defect is related to transcript rendering/state shape.

Read the CA Sprint 2 audit before changing this file.

---

## 5.6 `src/teacher/teacher-console.js`

Function:

Teacher client behavior.

Currently handles:

- room/player Sprint 1 controls;
- formal run start;
- generic discussion configuration;
- vote opening;
- Add Time;
- teacher observation rendering.

One current audit defect is also visible here because the teacher renders the run-wide `messages` array as the current DiscussionRoom transcript.

---

## 5.7 `src/supabase/client.js`

Function:

Browser-side RPC transport to Supabase.

Read before changing API calls.

Do not introduce service-role credentials into browser source.

---

## 5.8 `src/supabase/config.js`

Function:

Public Supabase frontend configuration.

Do not replace public/browser-safe configuration with private server credentials.

---

## 5.9 `src/content/scenes.js`

Function:

Current lightweight Sprint 1 content definition.

Do not mistake it for the final ACT 1–14 story implementation.

Full V4.0 scene foundation belongs to later Sprint 3 work after Sprint 2 acceptance.

---

## 5.10 `src/styles/app.css`

Function:

Current student/teacher styling, including DiscussionRoom UI.

Avoid broad redesign while fixing Sprint 2 logic.

---

# 6. Automated tests you must read and preserve

## 6.1 `tests/sprint1-static-check.js`

Function:

Protects verified Sprint 1 repository structure/contracts.

Must remain PASS.

---

## 6.2 `tests/sprint1-live-e2e.js`

Function:

Live regression suite for the deployed Sprint 1 behavior.

Current established evidence:

```text
40/40 PASS
```

After Sprint 2 corrections, rerun it.

A Sprint 2 fix that breaks Sprint 1 is not acceptable.

---

## 6.3 `tests/sprint2-static-check.js`

Function:

Static presence/security/contract checks for Sprint 2.

Current limitation:

It mainly checks for required fragments and does not prove the canonical SINGLE_REVOTE_THEN_FALLBACK behavior.

Expand it if useful, but do not treat string-presence checks as sufficient live behavior evidence.

---

## 6.4 `tests/sprint2-live-e2e.js`

Function:

Live deployed Supabase E2E for generic DiscussionRoom.

Current established result before CA audit:

```text
17/17 PASS
```

However, CA found that the suite does not test:

- SINGLE_REVOTE_THEN_FALLBACK;
- ACT6 non-option fallback;
- second independent SINGLE_REVOTE discussion in one run;
- current transcript isolation between independent discussions.

You must add those cases.

Recommended additional live tests:

- invalid choice_id rejection;
- direct anonymous write blocked by RLS.

---

# 7. Reports you must read

Reports are evidence/status documents.

They do not override canonical specs.

## 7.1 Sprint 1 reports

Read:

```text
docs/reports/sprint-1/sprint-1-architecture.md
docs/reports/sprint-1/sprint-1-testing.md
```

Function:

Explain what Sprint 1 already verified and therefore what you must not regress.

---

## 7.2 Sprint 2 reports

Read:

```text
docs/reports/sprint-2/sprint-2-architecture.md
docs/reports/sprint-2/sprint-2-testing.md
docs/reports/sprint-2/Sprint-2-Completion-Report.md
```

Function:

Document the implementation intent, test procedure, claimed evidence, limitations, and deployment boundary for the current Sprint 2 version.

Do not blindly trust the word VERIFIED.

Compare each claim with code/tests and CA audit.

---

## 7.3 `docs/reports/sprint-2/CA-Sprint-2-Audit-20260918.md`

Function:

This is the current independent CA audit result.

Current result:

```text
FAIL — CORRECTIONS REQUIRED
```

This report is your immediate engineering task specification.

Read it fully before editing code.

---

# 8. Agent messages that currently matter to CD

## 8.1 `agent-comms/CA_to_CD_20260918T132305Z_sprint2-audit-fail-corrections-required.md`

Function:

Formal CA correction request.

This is the highest-priority current CD instruction.

Do not start Sprint 3 until this is fixed and CA re-audits.

---

## 8.2 `agent-comms/VA_to_CD_20260918T131200Z_add-master-reference-identities-for-staging.md`

Function:

A separate pending VA request.

The user has approved MASTER-01 and MASTER-02 and VA wants to stage them, but the current registry has no canonical identities for those master-reference files.

VA asks CD to:

- add exact canonical registry identities for MASTER-01 and MASTER-02;
- choose exact asset_key values under registry authority;
- commit and reread;
- reply to VA with exact keys and commit SHA.

This is independent of Sprint 3.

If you act on it, keep it as a narrow separate registry commit and do not mix it into the Sprint 2 database fix.

Do not ask VA to invent keys.

---

# 9. CURRENT PROJECT STATUS

At this handoff:

## Sprint 0

```text
CLOSED
```

Do not redo repository audit.

## Sprint 1

```text
VERIFIED PASS
```

Live regression baseline: 40 checks.

Preserve it.

## Initial Asset Registry

```text
CA PASS
```

VA formal production was authorized.

## Visual production

```text
ACTIVE / parallel work
```

VA may produce formal candidates under V4.0 workflow.

There is a current VA→CD request for MASTER-01 / MASTER-02 canonical registry identities.

## Sprint 2

Implementation exists and was deployed/tested.

Previous evidence:

```text
Sprint 2 live E2E: 17/17 PASS
```

But independent CA audit result is now:

```text
FAIL — CORRECTIONS REQUIRED
```

This means:

- do not delete Sprint 2;
- do not restart from scratch;
- correct the reusable DiscussionRoom;
- re-run regression/E2E;
- request CA re-audit.

## Sprint 3

```text
NOT AUTHORIZED
```

Do not begin Scene/Pocket/Knowledge Foundation yet.

## Asset Manager / Supabase runtime assets

Full Sprint 4 Asset Manager publishing is not implemented.

Do not claim:

- Supabase Storage publishing VERIFIED;
- runtime ACTIVE promotion VERIFIED;
- runtime asset resolver VERIFIED.

---

# 10. YOUR IMMEDIATE PRIORITY — FIX SPRINT 2 AUDIT FAIL

Read:

```text
docs/reports/sprint-2/CA-Sprint-2-Audit-20260918.md
```

There are three required corrections.

## Fix A — fallback_resolution semantics

Current bug:

`s2_open_discussion()` requires SINGLE_REVOTE_THEN_FALLBACK `fallback_resolution` to equal a vote option ID.

But V4.0 ACT 6 uses:

```text
portrait_fixed_fallback
```

which is a system resolution, not a vote option.

Required:

- allow server-authored fallback identifiers that are not vote choices;
- preserve canonical option validation for player submissions;
- add ACT2/ACT5/ACT6-style tests.

---

## Fix B — round_no must be local to one re-vote chain

Current bug:

initial `round_no` is set from run-global `vote_round`.

Later independent DiscussionRooms may therefore skip their one allowed re-vote.

Required:

- initial independent discussion: `round_no = 1`;
- tie-break discussion increments local `round_no`;
- `max_revotes` uses local round semantics;
- `vote_round` remains immutable decision-round identity;
- test two independent discussions inside the same run.

---

## Fix C — current transcript isolation

Current bug:

student/teacher state currently returns every message for the run and renders it as the current DiscussionRoom transcript.

Required:

- current transcript must be scoped to current `discussion_session_id`;
- older messages remain persisted;
- optional history may be exposed separately;
- add sequential-discussion transcript-isolation test.

---

# 11. Required migration strategy

Because `002_runtime_runs_discussion.sql` is already reported deployed:

Do not rewrite deployment history.

Create an additive migration such as:

```text
database/003_sprint2_discussionroom_audit_fix.sql
```

Use CREATE OR REPLACE FUNCTION and only the minimum schema changes necessary.

Do not change:

```text
database/001_sprint1_core.sql
```

Do not destructively delete existing formal run history.

---

# 12. Required validation after the fix

At minimum run:

Static:

```text
node tests/sprint1-static-check.js
node tests/sprint2-static-check.js
node --check src/game/app.js
node --check src/teacher/teacher-console.js
node --check tests/sprint2-live-e2e.js
```

After applying additive migration to the intended Supabase project and publishing any frontend change:

Live:

```text
node tests/sprint1-live-e2e.js
node tests/sprint2-live-e2e.js
```

Re-audit evidence must explicitly cover:

- Sprint 1 regression still PASS;
- 3:0 / 2:1;
- 1:1:1 repeat-until-majority;
- SINGLE_REVOTE_THEN_FALLBACK;
- exactly one re-vote before fallback where max_revotes=1;
- ACT6 non-option fallback;
- sequential independent discussions in one run;
- current transcript isolation;
- reconnect;
- pre-vote privacy;
- duplicate submit rejection;
- missing-player deadline;
- Add Time;
- RLS direct read protection;
- no final export generation.

Recommended:

- invalid choice_id live rejection;
- direct anonymous write rejection.

---

# 13. Deployment evidence rule

The previous CD audit request cited:

```text
a4fb10b6d70e92615b73c344f7ae72f04f921bb9
```

as a deployment acceptance report commit.

CA could not resolve that SHA through GitHub.

In your re-audit request:

- use only valid traceable GitHub commit SHAs;
- do not repeat an unresolvable SHA;
- distinguish GitHub commit evidence from Supabase deployment evidence;
- distinguish automated E2E from physical-device verification.

Physical multi-device classroom test remains:

```text
NOT VERIFIED
```

unless actually performed.

---

# 14. How to finish your current task

When corrections are complete:

1. commit the additive migration + code/test/report changes;
2. reread the changed GitHub files;
3. verify exact commit SHA;
4. update Sprint 2 reports accurately;
5. send CA a new protocol message:

```text
CD_to_CA_<UTC>_sprint2-reaudit-request.md
```

Include:

- correction commit;
- migration path;
- exact changed functions/files;
- static results;
- Sprint 1 live result;
- expanded Sprint 2 live result;
- deployment evidence;
- known limitations;
- physical-device NOT VERIFIED boundary.

Wait for CA result.

Do not begin Sprint 3 before:

```text
CA PASS
+
user approval to continue
```

---

# 15. Separate pending VA request

After or alongside the Sprint 2 correction, you may process the independent narrow request:

```text
agent-comms/VA_to_CD_20260918T131200Z_add-master-reference-identities-for-staging.md
```

Keep this work isolated from the Sprint 2 fix.

If completed:

- update `assets/asset-registry.json`;
- validate JSON and identity collisions;
- commit;
- reread GitHub;
- send:

```text
CD_to_VA_<UTC>_<subject>.md
```

with exact new asset_key values and commit SHA.

Do not enter Sprint 4 Asset Manager implementation just because the registry changes.

---

# 16. Files you should NOT use as current authority

Do not use:

- old root copies of game/visual/Codex specs;
- `docs/specs/archive/` as current instructions;
- historical ROUND-* messages as active workflow;
- remembered content from an earlier Codex session;
- sprint reports as replacements for canonical specs.

When sources disagree:

```text
latest explicit user directive
> canonical current specs
> machine authority where applicable
> active inter-Agent protocol
> current approved implementation constraints
> reports/history
```

If the conflict is material, write to the responsible Agent instead of guessing.

---

# 17. Minimal takeover checklist

Before editing:

```text
[ ] fetch latest main
[ ] read README.md
[ ] read docs/README.md
[ ] read highest ACTIVE inter_agent_talk_protocol
[ ] read all 4 current canonical specs
[ ] read assets/asset-registry.json
[ ] read Sprint 1 architecture/testing reports
[ ] read Sprint 2 architecture/testing/completion reports
[ ] read CA Sprint 2 audit report
[ ] read latest CA→CD correction message
[ ] read latest VA→CD pending request
[ ] inspect database/001 + database/002
[ ] inspect current student/teacher source
[ ] inspect Sprint 1 + Sprint 2 tests
[ ] confirm current main HEAD before creating a branch/commit
```

Then:

```text
fix Sprint 2 via additive migration
→ expand tests
→ deploy/verify
→ request CA re-audit
```

COMMIT/WRITE STATUS: NEW_CODEX_HANDOFF_READY
