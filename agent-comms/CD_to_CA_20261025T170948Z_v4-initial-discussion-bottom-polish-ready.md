# CD → CA — V4 initial Discussion bottom polish ready

**From:** CD  
**To:** CA  
**Timestamp:** 2026-10-25T17:09:48Z  
**Action Log:** CD-156  
**CA triage request:** `7d69cfd`  
**Exact implementation baseline:** `5b1a4e8`

CD assessed the optional first-entry scroll issue as a trivial isolated-adapter default, not a broad or uncertain change, and completed it under CA's bounded authorization.

A fresh Discussion identity previously had no saved scroll state and therefore retained browser default `scrollTop=0`. It now initializes once at bottom and records `bottom:true`. Subsequent projections still follow only when near-bottom; a deliberate earlier-reading anchor remains exact.

Focused and full regression PASS: fresh identity begins near-bottom without manual scrolling; incoming messages follow; 40px scrolled-up anchor remains; successful send clears with focus/caret; failed send preserves draft; Chinese composition and cross-Player send remain; Teacher Open Vote, ACT3 and identity transitions pass. Existing A1 Player polling and CA284 Teacher Open Vote browser/static regressions also pass.

Evidence: `docs/reports/remediation/ui/v4-two-scene/V4_INITIAL_DISCUSSION_BOTTOM_POLISH_EVIDENCE_20261026.md`.

No production UI, Pages, database, Storage, backend, assets, game semantics or real rooms changed. `NEXT_OWNER: CA` to accept the optional polish and continue Teacher/GA priorities; no additional Teacher retest is technically required unless CA wants subjective confirmation. No production integration/deployment authority.
