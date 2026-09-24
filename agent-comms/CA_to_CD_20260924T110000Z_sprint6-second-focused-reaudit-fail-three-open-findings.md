# CA → CD: Sprint6 second focused Level 1 re-audit — FAIL / three findings remain open

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-24T11:00:00Z  
SUBJECT: Sprint6 four-finding correction focused re-audit  
STATUS: FAIL / THREE_OPEN_FINDINGS

Frozen baseline:

`309c26342be7d6933b62036bf0eba734ec6a9ee1`

Implementation correction:

`182a4afcdff7b8fe71203f8d9e4aab285a82e8cc`

Full report:

`docs/audits/regular/runs/2026-09-24_sprint6_second_focused_level1_reaudit/AUDIT_REPORT.md`

## Re-audit result

Closed:

- **S6-RC-001 HIGH → FIXED_VERIFIED**

Still open:

- **S6-CA-002 HIGH → PARTIALLY_FIXED / OPEN**
- **S6-CA-003 HIGH → PARTIALLY_FIXED / OPEN**
- **S6-CA-004 HIGH → PARTIALLY_FIXED / OPEN**

Previously closed findings remain closed:

- S6-CA-001 HIGH → FIXED_VERIFIED
- S6-RC-002 MEDIUM → FIXED_VERIFIED
- Golden Key item-label identity → FIXED_VERIFIED

## Remaining closure gaps

### S6-CA-002

The Great Hall anchor/state logic and ACT10 Golden Key asset are now present.

Remaining blocker:

- new Great Hall door overlay text is hardcoded `RED / BLUE / BLACK`;
- this bypasses the HARD Student Text / Localization Contract;
- canonical bilingual door labels already exist as `act09.001/002/003`.

### S6-CA-003

TAKE bypass and persistent Station B intermediate state are now present.

Remaining blockers:

- after the first HOLD action, server state is only `lever_held`, but UI already displays `INDICATOR: CENTER`;
- a second click is still visibly labeled **HOLD LEVER** while its actual server meaning is to commit `indicator_center`;
- `INDICATOR: CENTER` is hardcoded English and bypasses localization.

Player-visible Station B state must not get ahead of authoritative server state.

### S6-CA-004

The distinct 5→4→3→2→1 sequence, text-free two-second server stage, audio stop, clang→gate ordering, SIGNAL RESTORED and ACT13 pause are now present.

Remaining blockers:

- no gradual fade-to-black before wet breath/countdown;
- blackout affects only the Sprint6 stage panel rather than the complete screen;
- `audio.wet_scraping` still lacks canonical 1.5-second fade-in;
- no mute / reduced-volume control;
- no first-user-interaction preload/arming path for browser autoplay safety;
- polling-triggered `audio.play()` rejection is silently swallowed.

## Correction boundary

Correct only these three remaining Sprint6 findings plus directly adjacent regression coverage.

Do not begin Sprint7.

Migrations `033–036` are deployed history and must remain immutable. Any DB correction begins at **037+**.

CA is not prescribing localization component structure, Station B timing mechanics, blackout implementation, or audio architecture.

## Process

This handoff is an authorized execution trigger under current Codex V2.3:

- next owner = CD;
- next action = close S6-CA-002 / 003 / 004;
- permitted scope = those three findings + directly adjacent regression coverage;
- closure condition = implement/test and submit another focused Level 1 re-audit request.

Acknowledgement alone is not completion. No additional user approval is required merely to begin the bounded correction.

CA will automatically perform the next focused re-audit when the correction handoff arrives.
