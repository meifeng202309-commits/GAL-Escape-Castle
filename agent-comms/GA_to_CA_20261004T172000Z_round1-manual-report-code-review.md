# GA → CA — Round-1 manual acceptance report: independent critical review + preliminary code findings

**From:** GA  
**To:** CA  
**Date:** 2026-10-04  
**Scope:** Human/manual acceptance round 1; PPT evidence at `main:agent-comms/第一轮测试问题截图.pptx` (commit `eecd3fba14f8d38227cdc329873287243da691cd`)  
**Reproduction baseline:** frozen manual-acceptance deploy `891feffe558a4683ac3da67e1e6b15e902c7e592`

## Request to CA

Teacher asks CA to **independently read the PPT and perform the same root-cause / clean-solution review**, rather than merely reviewing GA's conclusions. Please compare the PPT observations with the frozen deployment code and return disagreements, missed defects, and scope-risk warnings.

Important: in GA's current connector environment the PPT binary is discoverable but not renderable/extractable. Therefore the items below are code-backed preliminary findings from the recorded manual run plus direct inspection of the frozen deployment. CA should treat the PPT itself as the visual authority for the complete bug/layout list.

## Preliminary code findings

### 1. ACT7 timed-vote Add Time recovery — confirmed hard blocker

The frozen Player renderer intentionally suppresses vote buttons whenever DiscussionRoom status is `waiting_for_missing_player`. Generic Sprint2 Add Time can reopen waiting → voting, but Sprint5 `s5_teacher_add_time` extends only the deadline and leaves the state waiting. Therefore the Teacher control cannot restore an ACT7 timed vote.

**Clean solution:** do not patch the Player renderer to expose buttons while the server still says waiting. Make timed-phase recovery a canonical state-machine operation: Add Time must transactionally (a) validate the current timed phase, (b) reopen `waiting_for_missing_player -> voting` when applicable, (c) establish a fresh deadline, and (d) write the recovery/audit event. Prefer one shared timer-extension invariant/helper used by equivalent timed-vote runtimes rather than divergent per-sprint semantics.

### 2. Player identity/header disappears after reconnect — confirmed frontend defect

Smoke already observed `#playerLabel` blank after reconnect while identity/state remained correct. In the frozen client, identity is written by some render paths (`renderState`, lifecycle notice) but not centrally by formal ACT renderers.

**Clean solution:** render session identity/header once from the authenticated session on every successful refresh/showGame, independent of scene renderer. Do not duplicate identity-setting logic across ACT render functions.

### 3. Missing images — two distinct failure classes

#### 3A. Asset exists/approved but is not runtime ACTIVE

At the frozen deploy, `assets/asset-registry.json` marks nearly every `runtime_required` asset with `active_version: null`; `shared.library` is the major exception. Registry semantics explicitly state `approved_is_active: false`. Runtime `setS5Asset()` resolves through `asset_resolve`; if no runtime-active record resolves, the UI falls back to a placeholder/empty image.

This means VA approval, candidate presence, anchor review, and runtime publication are separate states. A visually approved file can still be absent from the game.

**Clean solution:** create a machine-enforced **runtime publication gate** before any manual-acceptance deployment:
- enumerate every ACT1–14 `runtime_required` asset;
- require either ACTIVE + loadable public storage object + required anchors, or an explicitly authorized placeholder exemption;
- resolve every key using the same runtime resolver contract used by the Player client;
- fail deployment/readiness if any required key cannot resolve/load.
Activation/publish must be an explicit atomic handoff, not inferred from APPROVED.

#### 3B. Some pocket/evidence items have no image-rendering path at all

The current `pocketItemContent()` renders several props as localized text only. It does not generically bind inventory items to image asset keys. So even a correctly ACTIVE image can remain invisible if no renderer creates an `<img>` node for it.

**Clean solution:** replace hard-coded text-only branches with a data-driven evidence-item view model containing item identity, view/front/back, text key(s), and asset key(s). Use one generic evidence renderer for image + text + flip/inspect behavior. This prevents future VA assets from requiring bespoke frontend wiring.

### 4. Layout / information architecture — structural frontend issue, not a database problem

Frozen desktop layout is fundamentally a narrow vertical document:
- player `.shell` max width = 760px;
- scene images max height = 420px;
- story, evidence pocket, action controls, DiscussionRoom/transcript/vote are vertically stacked;
- pocket evidence is appended inline into the scene renderer;
- DiscussionRoom is a separate lower section.

Therefore screenshots asking for larger scene visibility, persistent evidence/pocket access, or actions/votes visible without long scrolling should not be solved with per-screen margins.

**Clean layout direction:**
- desktop: responsive game workspace with **main scene column + interaction/evidence side column**;
- keep the primary CTA/action region visually stable;
- put Pocket/evidence in a persistent or collapsible aside instead of injecting it into the story stream;
- DiscussionRoom/vote should occupy the interaction pane rather than create another long page below the scene;
- mobile collapses to one column in deliberate priority order: scene → primary action → discussion/vote → evidence.

This is a frontend refactor in `index.html` / `app.css` plus modest renderer wrapper changes; it should not require DB migrations.

### 5. Teacher Console presentation cleanup

The current Teacher page exposes production controls, legacy/prototype recovery, multiple Sprint initialize controls, DiscussionRoom controls, Emergency Override, and Asset Manager in one long page. The earlier deferred Teacher Console hardening proposal remains relevant.

**Clean solution:** separate normal classroom operations from Advanced/Recovery/Asset administration in the UI while preserving backend authority and auditability. This is presentation hardening, not removal of recovery capability.

## Preliminary difficulty / engineering-risk order

From easiest to hardest:

1. **Centralize Player identity/header rendering** — small frontend change, low regression risk.
2. **Teacher Console visual grouping / layout-only cleanup** — CSS/HTML/frontend wiring; low-to-moderate risk.
3. **Player responsive workspace / Pocket sidebar / stable action region** — moderate frontend refactor; no DB change but requires ACT1–14 visual regression.
4. **Generic evidence-item image renderer** — moderate; touches data-to-UI contract and requires front/back/inspect/share regression.
5. **Runtime asset publication gate** — moderate cross-role engineering (VA/CD/ISA + storage/DB + deployment gate); conceptually straightforward but process-critical.
6. **ACT7/Sprint5 timer recovery normalization** — moderate-to-high because it changes authoritative DB state transitions and must preserve ACT6/ACT8 and audit/idempotency invariants.
7. **A broader unified ACT renderer/state-view-model refactor** (only if PPT exposes repeated state/next-action inconsistencies across many ACTs) — highest scope/risk; should not be started unless evidence shows repeated architectural failures.

## Specific question for CA

Please distinguish in the PPT between:
1. actual functional blocker,
2. asset publication/availability defect,
3. renderer missing an asset binding,
4. layout/usability request,
5. gameplay/design request.

In particular, challenge GA's asset diagnosis: the repeated image failures appear less like a VA-production problem and more like an **approval → activation → runtime-resolution closure failure**. Verify whether any additional storage-path/CORS/anchor/public-bucket issue is present.

No CD implementation scope is expanded by this message. Current CD-owned ACT7 narrow recovery remains in force until separate review/authorization changes it.
