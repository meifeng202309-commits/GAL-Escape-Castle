# CA Sprint 3B Migration 012 Re-audit

Date: 2026-09-19  
Auditor: CA — Coding Audit Agent  
Re-audit request: `agent-comms/CD_to_CA_20260919T173858Z_sprint3b-migration012-reaudit-request.md`  
Correction commit: `3387a75839cb92f56955b694c98dc0d2a926ea00`  
Verification/report commit: `286b79c9d6c16c32ff5bbb6f4cb5dd7b1f89983e`

Result: **PASS — SPRINT 3B ACCEPTED**

## 1. Re-audit scope

This review is limited to the two blockers left by:

- `docs/reports/sprint-3b/CA-Sprint-3B-Second-Correction-Reaudit-20260919.md`
- `agent-comms/CA_to_CD_20260919T172215Z_sprint3b-second-correction-reaudit-fail-two-blockers.md`

The required fixes were:

1. remove browser execution access from all renamed `*_pre011` implementation helpers;
2. make ACT 2 authoritative route-update delivery/acknowledgement per-player, with global advance only after all three GALs receive/acknowledge it.

---

# 2. Blocker A — internal *_pre011 execution

**PASS**

Migration 012 explicitly revokes EXECUTE from:

- PUBLIC
- anon
- authenticated

for all 12 renamed implementation helpers:

- `s3b_initialize_flow_pre011`
- `s3b_submit_first_meeting_pre011`
- `s3b_grab_pre011`
- `s3b_leave_start_room_pre011`
- `s3b_apply_meeting_resolution_pre011`
- `s3b_complete_foldback_pre011`
- `s3b_follow_sign_pre011`
- `s3b_submit_library_code_pre011`
- `s3b_submit_act4_choice_pre011`
- `s3b_apply_act5_resolution_pre011`
- `s3b_choose_post_inspection_route_pre011`
- `s3b_get_player_state_pre011`

This closes the privilege inheritance created by PostgreSQL function rename.

The guarded public wrapper names remain the intended browser-callable API.

The live suite now directly probes representative renamed implementations and records that they are not browser-executable.

This resolves the server-authority bypass.

---

# 3. Blocker B — three-player route-update delivery

**PASS**

Migration 012 adds per-player:

`route_update_ack_at`

to `s3b_player_progress`.

The public route-update acknowledgement now:

- authenticates the specific player;
- locks the formal run row;
- records that player's acknowledgement once;
- rejects duplicate acknowledgement by the same player;
- counts distinct player acknowledgements;
- keeps the global scene in `route_update` for ACK counts 1 and 2;
- advances to `route_consequence` only when ACK count reaches 3.

This matches V4.0's requirement that all three GALs see:

- `act02.032`
- `act02.033`

before the shared flow advances.

The UI hides CONTINUE only for a player who has already acknowledged while preserving the global route-update scene for players who have not.

The live suite verifies:

- first ACK does not advance;
- duplicate first ACK is rejected;
- second ACK does not advance;
- unacknowledged player's reconnect still sees the same route update;
- third distinct ACK advances exactly once.

No behavior-scoring event or new private behavior choice is created by this acknowledgement.

---

# 4. Regression evidence

Recorded post-deployment evidence:

- Sprint 1 static: PASS
- Sprint 1 live: **40/40 PASS**
- Sprint 2 static: PASS
- Sprint 2 live: **23/23 PASS**
- Sprint 3A static: PASS
- Sprint 3A live: **15/15 PASS**
- Sprint 3B static: PASS
- Sprint 3B live: **44/44 PASS**
- localization generation: deterministic **333 entries PASS**
- JavaScript syntax: PASS
- `git diff --check`: PASS

Migration 012 is additive. Prior deployed migrations were not rewritten.

---

# 5. Prior Sprint 3B corrections retained

The following previously accepted repairs remain intact:

- ACT 1 opening/action/consequence/complete delivery model;
- all-three ACT 1 completion gate;
- canonical ACT 2 queued-message templates;
- canonical route-update text;
- server-side stale/replay guards through public wrappers;
- real server-owned Library Box locked-prefix semantics;
- 90/105/120/135/150 second system fallback;
- no synthetic player attempt on timeout;
- Inspect First as intermediate state only;
- post-inspection Known/Unknown Game Track decision;
- canonical `item.*` labels;
- GA-approved DiscussionRoom localization;
- player-majority `choice_id` versus system-fallback `resolution_id` distinction.

---

# 6. Non-blocking documentation note

The current Sprint 3B testing report still contains one historical sentence saying the “complete 39-check suite” passed after the post-011 assertion alignment, while the current suite is 44/44 after migration 012.

This is a stale report sentence only.

It does not affect runtime semantics, deployment evidence, or this PASS decision.

Per project governance, no separate corrective audit is required for that wording.

---

# 7. Remaining boundaries

Sprint 3B PASS does not mean full Sprint 3 is complete.

Still pending:

- Sprint 3C — Minimal Safe Teacher Deblock / Override;
- downstream behavior-validity/context provenance for override paths;
- physical three-student + teacher device walkthrough;
- classroom latency/packet-loss testing;
- long-duration classroom testing.

Physical multi-device verification remains:

**NOT VERIFIED**

Asset Manager runtime publishing, ACT 6–14, and final export remain outside Sprint 3B.

---

# 8. Final result

**PASS — SPRINT 3B ACCEPTED**

Sprint 3B may now be treated as accepted implementation.

Sprint 3C may proceed as the next Sprint 3 slice.
