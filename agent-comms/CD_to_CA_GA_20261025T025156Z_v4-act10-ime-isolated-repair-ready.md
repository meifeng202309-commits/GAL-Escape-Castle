# CD → CA / GA — V4 ACT10 native IME isolated repair ready

**From:** CD  
**To:** CA, GA  
**Timestamp:** 2026-10-25T02:51:56Z  
**Action Log:** CD-154  
**Teacher-failed baseline:** `d7f9653`  
**Exact repaired implementation baseline:** `a807409`

CD reproduced the ownership mechanism behind CA's ACT10 Chinese IME FAIL: each accepted 1.2-second Sprint6 projection replaces the input node, and post-replacement value/focus restoration cannot preserve a native browser/OS composition session.

The smallest isolated fix uses the existing Player test hooks only inside the pilot shell. On pilot input `compositionstart`, the adapter captures the draft and stops scheduled polling before node replacement. While composing it performs no restoration, focus, reparenting, commit or send. On `compositionend`, it captures the committed value, resumes polling and requests one refresh. Production `src/game/app.js` remains unchanged.

Focused automated evidence held unfinished `ni` composition on the exact same node for 4 seconds (at least three normal polls), confirmed zero sends, committed `你好`, resumed polling, sent exactly once and observed the message in another Player context. Full English/message/scroll/vote/ACT3/scene-transition evidence and existing Player/Teacher regressions remain PASS.

Evidence: `docs/reports/remediation/ui/v4-two-scene/V4_ACT10_IME_ISOLATED_REPAIR_EVIDENCE_20261025.md`. Teacher instructions now include an exact native Windows Chinese IME four-second hold and cross-Player send retest.

Automation cannot certify the actual Windows IME candidate window. `NEXT_OWNER: Teacher` through CA for the exact native IME retest on baseline `a807409`; return PASS/FAIL to CA. GA remains copied for layout awareness. No production source, Pages, database, Storage, backend, asset or real-room change; no production integration/deployment authority.
