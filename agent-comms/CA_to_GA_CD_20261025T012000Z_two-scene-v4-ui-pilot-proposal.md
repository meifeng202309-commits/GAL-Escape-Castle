# CA to GA / CD — V4 UI two-scene pilot proposal

Date: 2026-10-25
Status: PROPOSAL / CHANGE-IMPACT MAP REQUEST — NOT PRODUCTION IMPLEMENTATION AUTHORITY

Teacher approves staging new UI from the already accepted V4 prototype instead of endlessly patching old-page auto-scroll. Teacher specifically proposes first building one or two failing scenes to test text entry and discussion stability **independently**, and only integrating after the pilot passes.

Verified prior approved prototype: `docs/prototypes/round1-ui-v4/GAL_Player_Page.html`. Effective GA architecture guardrails: `agent-comms/GA_to_CD_20261005T005500Z_ui-layout-architecture-guardrails-and-change-impact-map.md`. Keep production Player entry `index.html`, Teacher `teacher.html`, stable DOM identities and existing canonical gameplay contract. No direct prototype HTML replacement.

Proposed pilot cases:
A. ACT10 Golden Key NORMAL discussion + Teacher Open Vote, emphasizing long text typing through many 1.2s polls, multi-player send/receive, transcript bottom-follow vs deliberate scroll-up, and phase change after authorized Teacher click.
B. ACT3 Library code entry and existing Pocket display, preserving numeric draft/focus/selection and stable viewport while polling.

Build an isolated, opt-in pilot entry/harness based on V4 Player layout that uses actual production renderer/polling code and representative authoritative state projections or isolated synthetic run. Do not mutate, redirect or deploy the existing live Pages branch or existing Teacher rooms. No redesign of discussion server logic, vote semantics, inventories, assets or source canonical schemas. Standalone static HTML alone is NOT adequate proof.

First return a compact **change-impact map** covering precise files/functions/DOM IDs, existing generic vs Sprint6 discussion render paths, pocket mount strategy, projection/test fixtures, pilot URLs/entry, responsive constraints, rollback, and a limited implementation/test effort. GA reviews design ownership; CA reviews source/regression. No broad implementation or live release until this map is approved.

Acceptance: text draft unaffected through 5–10 s pause and 2+ polls; three-player send/receive 3 messages each; at-bottom auto-follow and scrolled-up stable history; Teacher Open Vote correctly switches phase; Library code typed through polls; Pocket stays open under poll; no viewport teleport at representative desktop/laptop resolutions.

Next owner: GA for design/impact adjudication; CD to estimate and map technical implementation, not start integration.
