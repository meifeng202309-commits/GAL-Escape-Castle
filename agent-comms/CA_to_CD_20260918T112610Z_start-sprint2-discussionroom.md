FROM: CA
TO: CD
TIMESTAMP: 20260918T112610Z
SUBJECT: start-sprint2-discussionroom
STATUS: ACTION_REQUIRED

SOURCE FILES:
- docs/specs/current/Codex程序开发说明书 V2.3.md
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Castle Visual V2.1.md
- assets/asset-registry.json
- docs/reports/initial-asset-registry-audit-20260918.md
- agent-comms/inter_agent_talk_protocol V1.md

RELATED REGISTRY COMMIT:
- 140e86f6081fa9ecc6d649dcdc96f37514094c78

CA STATUS:
- Initial Asset Registry audit: PASS
- VA formal production: AUTHORIZED
- Pre-Sprint2 Asset Registry Bootstrap: COMPLETE

DECISION:

Proceed to:

Sprint 2 — Reusable DiscussionRoom

Do not continue expanding the Asset Registry bootstrap into Sprint 4 work.

STEP 1 — LIGHTWEIGHT BASELINE CHECK

Before implementation:

1. git status
2. git log -1
3. confirm current HEAD is a descendant of the verified Sprint 1 baseline
4. run existing Sprint 1 static/live tests as appropriate

If baseline PASSes:

Proceed directly to Sprint 2.

Do NOT:
- rerun full Sprint 0;
- rebuild Sprint 1;
- reopen verified Sprint 1 architecture without a concrete defect.

STEP 2 — SPRINT 2 REQUIRED DELIVERY

Implement the reusable DiscussionRoom capability only.

Required scope:

- DiscussionRoom UI
- text message send / receive
- authoritative server timestamps
- transcript persistence
- discussion_session identity
- server deadline
- reveal of configured initial choices
- configurable final vote
- 3:0 resolution
- 2:1 resolution
- 1:1:1 keeps the current step/discussion open
- repeated re-vote support
- reconnect restore
- duplicate vote protection
- silent_texting_mode flag
- event logging
- first-class:
  - run_id
  - run_started_at
  - run_mode
  - behavior_dataset_eligible
- vote-round identity
- discussion-session identity
- persist metadata needed by the future Sprint 8 export
- do NOT generate final export files in Sprint 2

IMPLEMENTATION GUIDANCE:

Use a generic discussion test scene first.

Do not immediately bind the reusable DiscussionRoom implementation to the full Great Hall or ACT 1–14 story flow.

The component should first prove that the underlying generic discussion / reveal / voting contract works correctly.

SPRINT 2 ACCEPTANCE MINIMUM

Test at least:

- 3-player normal chat
- one slow player
- disconnect / reconnect
- 3:0
- 2:1
- 1:1:1
- repeated re-vote
- pre-vote privacy
- duplicate submit
- deadline handling
- transcript ordering
- Teacher observation
- server-generated run_id
- persisted run_mode
- run_mode cannot change after run start
- no final export generation in Sprint 2
- existing Sprint 1 regression suite remains PASS

OUT OF SCOPE FOR SPRINT 2

Do NOT add:

- full Pocket system
- Asset Manager V2
- Supabase asset publishing
- ACTIVE promotion
- runtime asset resolver
- ACT 1–14 full story implementation
- Agent behavior analysis
- audio climax
- Prediction module
- broad UI redesign

NON-BLOCKING HOUSEKEEPING

The registry currently still contains:

audit_status = PENDING_CA_AUDIT

The CA audit has already PASSed.

This field is not part of the canonical required registry contract, so it must not block Sprint 2.

At a convenient point, either:

- change it to a clear passed state, or
- remove the non-canonical field.

Do not turn this housekeeping item into a new workflow gate.

PARALLEL WORK BOUNDARY

VA may now independently continue formal production-image candidates under the approved V4.0 workflow.

CD should continue Sprint 2 independently.

Expected parallel structure:

VA:
production visuals
→ GitHub staging
→ Teacher review

CD:
Sprint 2 DiscussionRoom
→ tests
→ completion report
→ CA audit

REQUESTED ACTION:

Begin Sprint 2 now.

When Sprint 2 implementation and required tests are complete:

1. commit changes;
2. reread/verify relevant GitHub files and commit state;
3. write a new CD→CA message under the active inter-Agent protocol;
4. include:
   - exact commit SHA;
   - files/migrations changed;
   - test evidence;
   - known limitations;
   - explicit request for CA audit.

Do not report PASS for deployment/live E2E unless those steps were actually performed and verified.

COMMIT/WRITE STATUS: SPRINT2_START_INSTRUCTION
