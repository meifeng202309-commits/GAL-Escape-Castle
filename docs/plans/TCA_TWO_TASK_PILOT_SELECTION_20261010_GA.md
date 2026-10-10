# GA Pass-1 — two-task TCA pilot selection evidence (2026-10-10)

**Status:** BLOCKED — no two defensible S-grade coding contracts yet. **No TCA coding authorized by this record.**  
**CA request:** `agent-comms/CA_to_GA_20261010T143000Z_three-pass-roles-accepted-two-task-pilot-authorization.md`  
**Active branch:** `remediation/sprint9-structural-v1`

## Selection standard

An S-grade contract requires evidence of an approved unmet acceptance cell, real consumer, a pinned stable implementation interface, independent testing, no protected runtime authority, and plausible net CD saving; proposed production code must pass a removal/falsification counterfactual. A task cannot become S merely because it is easy to write.

## Investigated candidate 1 — P02 local Player UI-state preservation: R / BLOCKED FOR CONTRACT

- **Approved acceptance:** V4 F9/W09 Player UI shell must retain discussion draft, focus, scroll and Pocket local state across polling.
- **Source:** `src/game/app.js`, blob `c6d049dececb16af386418253d5dc55103f935a0`; `loadPlayerFrame`, `commitPlayerFrame`, `refreshCanCommit`, `renderDiscussion`, `renderSprint3b`, `renderSprint5`.
- **Possible consumer:** renderer commit lifecycle, but actual approved post-A1 stable DOM IDs, mount structure, and local state ownership have not been frozen into a narrow insertion contract; A1 code is CD-frozen.
- **Why not S:** copying DOM-value restoration may duplicate/reverse A1's confirmed-state commit policy, revive stale local controls or interfere with legal server state; no targeted proof yet that the proposed new helper would do something the settled renderer does not.
- **Deletion test:** would need to show a reproducible draft/focus/scroll loss on a valid same-scene committed frame, and restoration without stale server decision replay. **Not yet evidenced.**
- **Boundary / discard:** no integration patch or module assignment; revisit only after stable source consumer + focused failing test exist. No authority to edit app.js during CD freeze.

## Investigated candidate 2 — P03 Teacher internal view navigation: R / BLOCKED FOR CONTRACT

- **Approved acceptance:** V4 F9 Teacher Console/Emergency-Recovery/Maintenance-Developer prototypes should become internal views in one Teacher runtime.
- **Source:** `src/teacher/teacher-console.js` blob `b276e049ba98718b62f7b81f48657211a02ca37e`; `renderOperationsState`, `loadOperationsState`, `renderOverrideState`, existing Teacher controls.
- **Possible consumer:** yet-to-be-defined F9 Teacher shell internal view router.
- **Why not S:** no evidence of the *actual future routing callsite* or frozen final DOM IDs. Generic navigation helper could become a duplicate of renderer-owned view switching; premature independent module risks code growth without a real integration consumer.
- **Deletion test:** cannot currently demonstrate an approved failing navigation behavior from an integrated callsite that such a helper fixes. **Not yet evidenced.**
- **Boundary / discard:** no module, no Teacher runtime edit; wait for shell contract and actual consumer.

## Other quick exclusion — Library P01 / W03 / F4

- P01 is `DRAFT_RETAINED_FOR_PILOT_LEARNING`, production-value FAIL by CA; cannot recycle as Task 1.
- W03 coherent GRAB+leave touches authoritative event/interaction semantics and ACT transitions; not safe as independently ready TCA helper without protected owner contract.
- F4 stale status is potentially a small localized replacement, but no proven second consumer, actual duplicate cleanup, or convincing reduction of CD coding/debug labor was established at Pass 1; do not generate a standalone abstraction to satisfy quota.

## Result and handoff

**S candidates = 0 / 2 requested.** Candidate P02 and P03 are recorded explicitly as R/BLOCKED, not as authorized assignments. No TCA Pass-2 code work, isolated branch, or Pack path is assigned because the prerequisite source-grounded contract is absent. CA/Teacher can choose to obtain scoped frozen consumer details within the ordinary V4 workflow; GA must not invent a consumer, touch CD code or start extra advisory bureaucracy. CD remains FROZEN.

**Next owner:** CA to review this evidence-limited selection disposition against the explicit CA instruction that missing candidates be documented rather than padded.
