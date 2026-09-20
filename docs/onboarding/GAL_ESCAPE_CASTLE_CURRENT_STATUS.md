# GAL ESCAPE CASTLE — CURRENT STATUS

> Operational snapshot for GA / CA / VA / CD  
> Last refreshed: 2026-09-20  
> This file is a fast orientation aid, not a canonical gameplay/spec source.

---

# 1. 当前一句话状态

    Core development:
    Sprint 3B = ACCEPTED
    Sprint 3C = READY FOR IMPLEMENTATION
    GA canonical safe-resolution dependency = SATISFIED
    CD migration 013 implementation / audit handoff = NEXT

Visual production与程序开发并行进行。

---

# 2. Current canonical sources

当前current spec set：

    docs/specs/current/古堡逃脱游戏脚本 V4.0.md
    docs/specs/current/Codex程序开发说明书 V2.3.md
    docs/specs/current/Castle Visual V2.1.md
    docs/specs/current/从创意到游戏成品的研发流程V1.0.md
    docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv
    assets/asset-registry.json
    agent-comms/inter_agent_talk_protocol V1.md

Operational onboarding：

    docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md
    docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md

---

# 3. Sprint status

## Sprint 0 — CLOSED

Repository Audit完成。

不要重做。

## Sprint 1 — VERIFIED PASS

Core multiplayer baseline。

Latest repeatedly reported regression：

    40/40 PASS

## Sprint 2 — PASS

Reusable DiscussionRoom / run metadata。

Latest repeatedly reported regression：

    23/23 PASS

## Sprint 3A — PASS

Scene / Pocket / Knowledge foundation。

Latest repeatedly reported regression：

    15/15 PASS

## Sprint 3B — ACCEPTED

ACT 1–5 placeholder flow / route / fold-back / Library Box / ACT4–5 route logic。

CA final acceptance message：

    agent-comms/CA_to_CD_20260919T174200Z_sprint3b-migration012-reaudit-pass.md

Result：

    PASS — SPRINT 3B ACCEPTED

Latest reported live regression：

    Sprint 3B: 44/44 PASS

Database deployed history currently reaches：

    database/012_sprint3b_internal_wrapper_lockdown_and_route_delivery.sql

## Sprint 3C — READY FOR IMPLEMENTATION

Scope：

    Minimal Safe Teacher Deblock / Override

CA authorization：

    agent-comms/CA_to_CD_20260919T175900Z_sprint3c-scope-review.md

Result：

    READY_FOR_IMPLEMENTATION

GA canonical safe-resolution map has now been added to V4.0 §5.5.

Canonical V4.0 update commit：

    529f042e96d93593034d8d7f61a19a6c4ffce4e5

GA→CD handoff：

    agent-comms/GA_to_CD_20260919T180500Z_sprint3c-safe-resolution-map-response.md

At this snapshot：

    database/013_... DOES NOT YET EXIST

Therefore current next owner is:

**CD**

Expected next sequence：

    CD implements migration 013
    → tests/regressions
    → CD sends CA audit request
    → CA audits Sprint 3C

Do not begin Sprint 4 until the appropriate Sprint 3C gate is satisfied.

---

# 4. Sprint 3C canonical map — orientation only

Do not implement from this summary alone; use V4.0 §5.5.

High-level mapping：

    ACT1 private first action
      SKIP only
      never choose for student

    ACT2 private first meeting
      SKIP only
      missing choice stays null + invalid_teacher_override

    ACT2 meeting discussion
      RESOLVE_AND_CONTINUE
      safe resolution = Library

    ACT2 route update
      SKIP only

    ACT2 route consequence
      SKIP only
      apply canonical fold-back

    ACT3 wayfinding
      SKIP only

    ACT3 Library Box
      RESOLVE_AND_CONTINUE
      safe resolution = 41739
      no fabricated player attempt

    ACT4 private route choice
      SKIP only
      missing choice stays null + invalid_teacher_override

    ACT5 route discussion
      RESOLVE_AND_CONTINUE
      safe resolution = Inspect First

    ACT5 post-inspection Game Track route
      RESOLVE_AND_CONTINUE
      safe resolution = Known Route

All unlisted combinations：

    UNSUPPORTED → server reject

---

# 5. Localization status

Canonical source：

    docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv

Recent canonical additions already include：

- Library Box progressive fallback text；
- exact item-label item.* keys；
- shared DiscussionRoom discussion.* keys。

Important runtime contract：

    English = master/review only
    Dutch + Chinese = normal GAL display

1897 Municipal Closure Order：

    nl_only_artifact

No runtime auto-translation。

---

# 6. Visual / Asset status

Asset registry currently contains：

    28 runtime-required assets

Current registry snapshot：

    active_version != null: 0

So no production asset is yet ACTIVE in runtime authority.

Candidates currently registered (latest_version = 1)：

    opening.gitte_room
    opening.anna_room
    opening.linda_study
    prop_gitte_castle_map
    prop_gitte_number_note_front
    prop_gitte_number_note_back
    shared.library
    shared.main_gate
    ending.castle_exterior

These currently also exist as staging asset directories.

Assets with no candidate yet include, among others：

    prop_anna_diary_open
    prop_linda_watch_face
    prop_linda_watch_back
    prop_linda_closure_order
    prop_linda_star_key
    prop.photo_1897
    prop.library_clock_clue_note
    shared.portrait_hall
    overlay.portrait_eyes_open
    shared.clock_room
    shared.west_tower_payoff
    shared.great_hall
    prop.golden_key
    audio.*

Important governance already settled：

    MASTER-01 / MASTER-02 etc.
    = canonical visual references
    ≠ automatically runtime asset_key

Initial Asset Registry audit previously passed and VA formal production was authorized.

Visual production may continue in parallel with code as allowed by the visual workflow.

---

# 7. Current important visual rules

Use Castle Visual V2.1, not this summary, for production.

High-risk continuity points：

- moonlight is scene artwork's only active light unless a scene explicitly says otherwise；
- abandoned / decayed / damp；
- worn dark oak；
- rusted black iron；
- aged brass；
- no random warm lights；
- no readable AI text；
- exact text/numbers/labels belong to HTML/UI；
- Main Gate requires stable Station A/B/C + Watcher corridor anchors；
- Great Hall requires stable Red/Blue/Black door anchors；
- Portrait Hall main face must support eye overlay；
- 1897 Photograph ↔ West Tower payoff must preserve locked recognition features；
- Final Exterior must derive from MASTER-01 rather than invent a new castle。

---

# 8. Recent critical communication chain

## Sprint 3B acceptance

    CA_to_CD_20260919T174200Z_sprint3b-migration012-reaudit-pass.md

## Sprint 3C request from CD to GA

    CD_to_GA_20260919T175000Z_sprint3c-safe-resolution-map-request.md

## Sprint 3C scope approval from CA

    CA_to_CD_20260919T175900Z_sprint3c-scope-review.md

## GA canonical response

    GA_to_CD_20260919T180500Z_sprint3c-safe-resolution-map-response.md

New sessions normally do not need to read older Sprint 3B FAIL chains unless debugging a regression.

---

# 9. Current known boundaries / NOT VERIFIED

Still not verified as a full classroom production system：

    physical 3-student + Teacher multi-device end-to-end run
    full ACT 1–14
    Sprint 4+ runtime asset manager
    ACT 6–14 implementation
    final export
    full production asset activation
    3-player release candidate

Physical multi-device classroom verification remains：

    NOT VERIFIED

until it is actually performed.

---

# 10. Next expected handoffs

Immediate development：

    CD → implement Sprint 3C migration 013
    CD → run regressions + Sprint 3C tests
    CD → CA audit request
    CA → PASS / exact corrections

Parallel visual work：

    VA / Teacher → produce/revise staging candidates
    → visual review
    → later Asset Manager/runtime integration

GA currently has no unresolved narrative blocker recorded in this snapshot.

---

# 11. If this file becomes stale

Do not debate the stale snapshot.

Check in this order：

1. latest relevant agent-comms gate message；
2. current canonical specs；
3. current database / code / test state；
4. update this file。

This file should remain short enough that a new Agent can understand project position in a few minutes。
