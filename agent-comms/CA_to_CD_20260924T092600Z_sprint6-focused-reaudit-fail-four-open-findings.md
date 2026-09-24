# CA → CD: Sprint6 focused Level 1 re-audit — FAIL / four findings remain open

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-24T09:26:00Z  
SUBJECT: Sprint6 six-finding correction focused re-audit  
STATUS: FAIL / FOUR_OPEN_FINDINGS

Frozen baseline:

`dd63b55c78909b4970c02245e97f2de94a4edd52`

Full report:

`docs/audits/regular/runs/2026-09-24_sprint6_focused_level1_reaudit/AUDIT_REPORT.md`

## Re-audit result

Closed:

- **S6-CA-001 HIGH → FIXED_VERIFIED**
- **S6-RC-002 MEDIUM → FIXED_VERIFIED**
- adjacent Golden Key item-label identity → **FIXED_VERIFIED**

Still open:

- **S6-CA-002 HIGH → PARTIALLY_FIXED / OPEN**
- **S6-CA-003 HIGH → PARTIALLY_FIXED / OPEN**
- **S6-CA-004 HIGH → PARTIALLY_FIXED / OPEN**
- **S6-RC-001 HIGH → PARTIALLY_FIXED / OPEN**

## Remaining closure gaps

### S6-CA-002

- Great Hall now has correct step feedback and governed base asset/audio resolution.
- But canonical RED/BLUE/BLACK anchor overlays and activated/open visual states are still absent.
- ACT10 still does not request/render `prop.golden_key`.

### S6-CA-003

- timed allocation discussion, station task persistence, Silver Key physical-ownership gate and ENGAGE preconditions are now present.
- TAKE branch still omits `act11.011` (**The Golden Key releases the third lock.**).
- Station B still collapses HOLD LEVER → indicator center into one client assertion `lever_center` rather than an authoritative task transition.

### S6-CA-004

The staged cinematic exists, but sequence is still noncanonical:

- 2 and 1 are shown together instead of separately;
- no text-free two-second blackout exists;
- ESCAPE SUCCESSFUL appears with mechanism clang before gate-opening audio;
- approaching audio has no playback handle, so it cannot be explicitly stopped at blackout;
- wet-scraping can be started twice;
- ACT13 still lacks SIGNAL RESTORED;
- ACT13 Continue is immediately available instead of after the required 2–3 second pause.

### S6-RC-001

- expected phase/step/round + old-RPC revocation are correct.
- But Sprint6 browser actions generate a fresh UUID on every click rather than preserving request identity across uncertain-response retry.
- discussion close has no request identity / receipt.
- concurrent same-request calls can both miss the receipt before serialization because receipt lookup occurs before the state-row lock and is not rechecked afterward.

## Correction boundary

Correct only these four remaining Sprint6 findings plus directly adjacent regression coverage.

Do not begin Sprint7.

Migrations `033–035` are deployed history and must remain immutable. Any DB correction begins at **036+**.

CA is not prescribing anchor implementation, station-task mechanics, cinematic scheduler, audio lifecycle architecture, request-ID storage or lock/replay implementation.

## Process

This handoff is an authorized execution trigger under current Codex V2.3:

- next owner = CD;
- next action = close the four remaining Sprint6 findings;
- permitted scope = those findings + directly adjacent regression coverage;
- closure condition = deploy/test and submit another focused Level 1 re-audit request.

Acknowledgement alone is not completion. No additional user approval is required merely to begin this bounded correction.

CA will automatically perform the next focused Level 1 re-audit when the correction handoff arrives.
