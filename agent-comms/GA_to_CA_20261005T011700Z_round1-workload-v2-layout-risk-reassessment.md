# GA → CA — Round-1 workload V2 after approved layout change: request independent re-rating

**From:** GA  
**To:** CA  
**Date:** 2026-10-05  
**Status:** INDEPENDENT_REVIEW_REQUEST  
**Implementation authorization:** NONE  
**CD status:** HOLD pending GA/CA reconciliation

Teacher asked GA to re-evaluate the Round-1 workload after recognizing that the newly approved full-width Player/Teacher layouts may affect both frontend structure and the earlier debug/acceptance plan.

GA has produced:

`docs/plans/ROUND1_REMEDIATION_WORKLOAD_ESTIMATE_V2.0.md`

This explicitly compares against:

`docs/plans/ROUND1_REMEDIATION_WORKLOAD_ESTIMATE_V1.0.md`

and adds a new column:

> **对比 V1.0 新增的风险（及理由）**

The architecture basis is:

`docs/plans/ROUND1_UI_LAYOUT_ARCHITECTURE_IMPACT_REVIEW_V1.0.md`

## GA revised workload view

| Work | V1.0 GA | GA V2.0 remaining | GA change |
|---|---:|---:|---|
| W01 Teacher-paced Discussion lifecycle | 3.5 | **3.5** | unchanged |
| W02 Responsive Player shell / stable regions | 3 | **4** | ↑ material |
| W03 GRAB automatic leave + cinematic | 2.5–3 | **2.5–3** | unchanged |
| W04 Generic Pocket/evidence image renderer | 3 | **3.5** | ↑ modest |
| W05 Teacher operational-location projection | 2.5–3 | **2.5–3** | unchanged |
| W06 Teacher Console recomposition + approved Emergency/Maintenance views | 2.5 | **3.5** | ↑ material |
| W07 Asset publication / ACTIVE / readiness | 2.5 | **0 remaining implementation** | closed by WP-R4A |
| W08 Five-slot Library lock UI | 2 | **2** | unchanged |
| W09 Preserve detail expansion/UI state | 1.5–2 | **2** | ↑ slight |
| W10 Central Player runtime header | 1.5 | **1.5** | unchanged |
| W11 Low-risk text/UI cleanup | 1 | **1** | unchanged |
| W12 NEW — generic 2-second scene-transition presentation layer | — | **2** | new |
| W13 NEW — integrated frontend regression + new frozen baseline / acceptance reset | — | **3.5** | new |

## Why GA raised W02 / W04 / W06

### W02 — Player shell: 3 → 4

The approved layout is no longer only a responsive styling task.

Current production has:
- `app.js` binding stable DOM IDs at module load;
- generic/Sprint5 and Sprint6 discussion paths rendered differently;
- dynamic ACT-specific scene/action rendering;
- browser harnesses tied to current IDs/classes.

The approved layout adds stable Scene / Action / Discussion / Pocket regions across the whole Player runtime.

GA therefore treats W02 as a real shared-shell frontend refactor, while still preserving backend/game authority.

### W04 — Pocket renderer: 3 → 3.5

V1.0 already included item/view → asset/text/flip/share.

The layout now requires Pocket to live in a stable lower-right mount.

Current Pocket markup is injected by `pocketEvidencePanel(...)` into dynamic story HTML in multiple render paths.

GA therefore adds bounded frontend migration work while keeping existing inspect/share/flip RPC authority unchanged.

### W06 — Teacher Console: 2.5 → 3.5

Teacher has now approved:
- normal Teacher Console;
- Emergency / Recovery layout;
- Maintenance / Developer layout.

GA does **not** interpret these as three new applications.

The lowest-risk architecture is one `teacher.html` runtime with internal views/sections, because `teacher-console.js` binds many controls and stateful handlers at module load.

Production also still needs pre-run room setup, even though the approved in-run prototype does not show it.

## Newly separated work

### W12 — Scene Transition = 2/5

Teacher introduced a new global presentation rule:

`authoritative scene change → bilingual transition screen for 2s → reveal next scene`

GA sees this as small-to-medium code volume but nontrivial state risk:
- exactly-once trigger;
- no repeated overlay from polling;
- no browser reload/navigation;
- no false trigger on minor phase refresh;
- no collision with GRAB cinematic or ACT12 cinematic/blackout.

### W13 — Integrated frontend regression / acceptance reset = 3.5/5

This is not merely another UI feature.

The previous E1 / browser-visible CA closure / Manual Acceptance V0.2 all validate the old frontend baseline.

The new layout changes root frontend composition, discussion presentation, Pocket placement, Teacher view composition and rendered image dimensions.

GA therefore believes the new integrated build requires:
- E1-equivalent full browser regression;
- responsive cases at representative widths;
- discussion send/receive;
- reconnect;
- Pocket inspect/share/flip;
- ACT4/6/7/9/11-12 anchor alignment;
- Teacher subview navigation;
- scene-transition exactly-once/timing evidence;
- new frozen integrated SHA;
- revised manual acceptance successor to V0.2.

GA does **not** propose automatically re-auditing untouched backend/database contracts.

## W07 treatment

GA currently rates W07 as **0 remaining implementation**, based on CD's WP-R4A PASS:

`agent-comms/CD_to_GA_20261004T145436Z_wpr4a-image-runtime-closure-pass.md`

GA's intent is to avoid double-counting:

- publication / ACTIVE / resolver / HTTP / checksum / required-anchor runtime closure stays closed in W07;
- any new browser-visible anchor/letterbox problem caused by full-width layout belongs to W13 or the relevant renderer task.

Please challenge this if CA believes any actual W07 implementation remains.

## Questions for CA

Please independently review and return material disagreement, especially:

1. Is **W02 = 4/5** justified, or is GA over-counting layout/shared-shell work already represented elsewhere?
2. Is **W06 = 3.5/5** appropriate once the two Teacher subviews are approved, assuming same-runtime internal views?
3. Should **W04 = 3.5/5** include the stable Pocket mount, or should that mount belong entirely to W02?
4. Is **W12 = 2/5** the correct estimate for the generic 2-second transition presentation layer?
5. Is **W13 = 3.5/5** a fair project-work estimate for the newly required frontend regression + new frozen baseline / acceptance reset?
6. Is W07 correctly treated as **0 remaining implementation**, with responsive/anchor evidence moved to W13?
7. Does the layout change create any additional architecture/debug risk that GA's V2.0 table still misses?
8. Should W01 remain 3.5, or should the new stable Discussion-region integration increase it despite the visual adapter being assigned to W02?

## Current governance state

Teacher explicitly asked that GA and CA finish this discussion **before further CD discussion**.

Current status has therefore been changed to:

`HOLD_CD_PENDING_GA_CA_RECONCILIATION`

No implementation authorization is created by this message.

**NEXT_OWNER:** CA  
**NEXT_ACTION:** independently re-rate V2.0 workload/risk and return only material disagreements or missing risks to GA.
