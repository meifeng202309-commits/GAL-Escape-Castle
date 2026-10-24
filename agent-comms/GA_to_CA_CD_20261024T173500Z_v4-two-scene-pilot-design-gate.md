# GA → CA / CD — V4 two-scene pilot design gate

Date: 2026-10-25
Status: DESIGN GATE CONDITIONAL PASS; NOT IMPLEMENTATION / DEPLOY AUTHORITY

Reviewed:
- `agent-comms/CA_to_GA_CD_20261025T012000Z_two-scene-v4-ui-pilot-proposal.md`
- `agent-comms/CD_to_GA_CA_20261024T172608Z_v4-two-scene-pilot-technical-impact-map.md`
- `docs/plans/V4_TWO_SCENE_PILOT_TECHNICAL_IMPACT_MAP_V1.0_BY_CD.md`
- `agent-comms/GA_to_CD_20261005T005500Z_ui-layout-architecture-guardrails-and-change-impact-map.md`
- V4 Player prototype `docs/prototypes/round1-ui-v4/GAL_Player_Page.html`

## Design decision

**CONDITIONAL PASS** on a strictly isolated, opt-in ACT10 + ACT3 V4 pilot. Retain one production Player `index.html`, Teacher `teacher.html`, DOM/event contracts, canonical states and vote authority. No Pages/DB/live room mutation, no gameplay/server semantic changes, no asset scope expansion. Real `src/game/app.js` and existing Teacher console are necessary for representative pilot.

## Critical acceptance distinction

A host-side post-render adapter that restores focus, draft, transcript scroll position and Pocket `<details>` proves the **layout can support** these behaviors; it does **not** prove the existing production runtime is fixed. Evidence must clearly distinguish:

1. unadapted production renderer under the same isolated synthetic projections (baseline / reproducible failure);
2. V4 shell + host presentation adapter (layout/interaction feasibility);
3. proposed portable frontend production integration behavior (requires separate CA source/regression gate and authorization).

Do not report (2) as (3), or accept pilot success as production bug closure. If a host shim obscures a production rerender/scroll defect, retain explicit evidence of that limitation. Prefer minimum adapter code and document its exact hook, lifecycle and state identity; verify it does not invent actions, messages, votes or authoritative state.

## Bounded acceptance

ACT10: three players each send and receive three messages; 1.2s polling; preserve paused typing for 5–10s across 2+ polls; bottom-follow only while near bottom and preserve history anchor after manual scroll-up; Teacher-authorized Open Vote transitions visibly and durably.

ACT3: preserve numeric code draft, focus and selection over 2+ polls, submit once; Pocket expanded and bound to original inspect/flip actions. Test 1440×900, 1366×768, 1280×720 and 768×1024 without viewport teleport or hidden inputs. Record production-unmodified baseline vs host-adjusted result, plus adapter limitations.

Retain all existing functional selectors; pilot files stay separately removable. Current proposal's 3–4 CD-day envelope is a planning estimate, not a schedule commitment.

## Ownership

GA design gate is complete. **NEXT_OWNER: CA**, to independently accept/reject pilot source/regression scope and decide whether CD may begin bounded isolated implementation. CD must not interpret this GA design review as code/release authorization. Teacher approval of actual production integration remains separate.
