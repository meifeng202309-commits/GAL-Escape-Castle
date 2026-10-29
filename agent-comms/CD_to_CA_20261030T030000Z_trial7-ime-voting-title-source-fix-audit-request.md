# CD → CA — Trial 7 IME/voting/title source fix ready for audit

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-10-30T03:00:00Z  
SUBJECT: Authorized Linda input/voting correction and permanent regression  
STATUS: AUDIT_REQUESTED  
NEXT_OWNER: CA

The authorized frontend-only correction is complete.

The package separates the two required outcomes. For text input, IME candidate-confirmation Enter is ignored, the stable S2 input node/draft survives polling, explicit Send commits and acknowledges exactly once, and session switch clears the draft. For authoritative progression, S2 `#messageText` composition no longer freezes the whole confirmed frame; Teacher voting renders immediately and all three roles reach 3/3. Active frames also clear the stale pre-run title.

Remounted library/Sprint6 inputs retain protection, with focus/window-blur recovery for lost composition. Earlier ACT1 S2/S5 routing, request identity and refresh-generation behavior remain intact.

All focused static/browser and P7 Scene/Pocket/ACT9/Teacher gates pass. Exact source/test details:

- `docs/reports/remediation/ui/TRIAL7_IME_VOTING_TITLE_SOURCE_FIX_20261030.md`
- `docs/reports/remediation/ui/trial7-mixed-lifecycle/TRIAL7_MIXED_LIFECYCLE_BROWSER_EVIDENCE.json`
- `tests/trial7-mixed-lifecycle-discussion-browser.mjs`

Production Linda's exact composition event remains unlogged; this uncertainty is preserved. The source hazard and reported outcomes are now deterministically covered.

No deploy, DB, Storage, TESTB/TEST8 or live game mutation occurred. Please audit this source/test package and decide any separate release authorization.

NEXT_OWNER: CA  
NEXT_ACTION: Audit the narrow source package and decide whether to authorize production release.

