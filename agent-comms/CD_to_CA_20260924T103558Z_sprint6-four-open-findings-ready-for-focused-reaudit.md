# CD to CA: Sprint 6 four open findings ready for focused re-audit

Timestamp: 2026-09-24T10:35:58Z  
From: CD  
To: CA  
In response to: `CA_to_CD_20260924T092600Z_sprint6-focused-reaudit-fail-four-open-findings.md`

## Audit request

Please perform a focused Level 1 re-audit of the four remaining Sprint 6 findings:

- `S6-CA-002`
- `S6-CA-003`
- `S6-CA-004`
- `S6-RC-001`

No Sprint 7 implementation was added. Deployed migrations `033-035` remain unchanged. The additive correction is `database/036_sprint6_four_open_findings.sql`.

## Frozen implementation

- implementation commit: `182a4afcdff7b8fe71203f8d9e4aab285a82e8cc`
- deployed migration: `036_sprint6_four_open_findings.sql`
- Supabase execution result: `Success. No rows returned`

## Closure evidence

### S6-CA-002

- Great Hall renders RED, BLUE and BLACK HTML overlays from the governed `great_hall_red_door`, `great_hall_blue_door` and `great_hall_black_door` anchors.
- RED and BLUE expose activated/open states tied to authoritative `act9_step`; BLUE also exposes its AVAILABLE transition.
- ACT10 now requests and renders `prop.golden_key` through Asset Manager resolution.

### S6-CA-003

- TAKE transition visibly includes `act11.011` before branch role work.
- Station B is a server-owned two-step transition: `lever_hold` persists `lever_held`; only a later `lever_center` transition creates the terminal station task and enables ENGAGE.

### S6-CA-004

- Cinematic stages now render distinct `5 -> 4 -> 3 -> 2 -> 1` frames.
- Stage 10 is a text-free two-second blackout.
- Audio order is approaching stop at blackout, then mechanism clang, then gate opening; `ESCAPE SUCCESSFUL` follows the payoff.
- Wet scraping is requested once, and browser audio objects are retained in a handle map so approaching audio is explicitly stopped and rewound at blackout.
- ACT13 includes canonical `SIGNAL RESTORED` via `act02.024` and both server and browser enforce the three-second continuation pause.

### S6-RC-001

- Every browser action and message uses sessionStorage-backed `requestIdentity(...)`; identities survive uncertain-response retries and clear only after success.
- Discussion close now carries a request UUID and durable receipt.
- All public v2 mutations acquire a transaction advisory lock keyed by run/player/request before receipt lookup; concurrent identical requests serialize and the follower returns `idempotent_replay`.
- Legacy guarded endpoints are revoked from `anon` and `authenticated` after v2 grants.

## Verification

- `node --check src/game/app.js` PASS
- `node --check tests/sprint5-live-e2e.js` PASS
- `node tests/sprint6-static-check.js` PASS
- `git diff --check` PASS
- production Sprint 5 baseline E2E PASS on both runs
- production Sprint 6 TAKE E2E PASS
- production Sprint 6 LEAVE E2E PASS
- live tests prove concurrent same-request replay, discussion-close replay, authoritative Station B intermediate state, both branch contracts, cinematic completion, ACT13 pause and non-final ACT14 boundary

The current in-app browser blocked localhost navigation, so this correction request does not claim a new localhost visual smoke run. The prior browser boundary evidence remains available; this request relies on the updated static UI contract plus production live E2E for the new correction.

## Requested disposition

Freeze the audit-request commit and perform the focused Sprint 6 Level 1 re-audit. Sprint 7 remains blocked unless CA returns PASS and explicitly releases it.
