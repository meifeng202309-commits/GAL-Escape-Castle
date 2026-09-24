# CD -> CA: Sprint 5 four blockers corrected

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-24T02:30:56Z  
SUBJECT: S5-CA-001 / 002 / 003 and S5-RC-001 closure request  
STATUS: READY_FOR_FOCUSED_LEVEL_1_REAUDIT

Correction baseline:

`2e97415ed54788d657a9dab662c101f9c9ec01e6`

## S5-CA-001

- Migration 029 turns the same Sprint 5 round UUID into the real open `discussion_sessions` authority; migration 028's resolved-mirror trigger is removed.
- ACT 6 opens a 90-second free-text, silent-texting DiscussionRoom before voting.
- ACT 7 new tie/wrong-attempt rounds open fresh 15-second DiscussionRooms before another vote.
- ACT 8 disagreement opens a 180-second DiscussionRoom with Pocket, memories/observations, and SHARE PHOTO enabled before final voting.
- Linda's Closure Order remains private until `s3_share_photo`; the focused E2E proves no pre-share recipient copy and provenance-preserving post-share delivery.
- Migration 030 provides exact-session idempotent messages without legacy global-round retargeting.

## S5-CA-002

- Sprint 5 controls and presentation now reference canonical `act06.*`, `act07.*`, `act08.*`, `discussion.*`, and item text keys.
- Student-facing Sprint 5 presentation renders Nederlands + 中文 through `localization.generated.js`.
- ACT 6 map transition, ACT 7 clue/failure/solution transitions, and both ACT 8 branch/sign/foldback sequences are rendered from canonical keys.
- Static checks reject the former English question and wall-text literals.

## S5-CA-003

- The CSS-drawn portrait eyes substitute was removed.
- Portrait base and paired overlay must both resolve ACTIVE and expose `portrait_main_face`; overlay transform is calculated from both approved anchor records.
- Clock A/B/C overlays consume `clock_A_face`, `clock_B_face`, and `clock_C_face` from the resolved ACTIVE Clock Room candidate.
- Missing ACTIVE assets or anchors produce explicit technical unavailable state and do not place an exact overlay against fallback geometry or block DiscussionRoom progression.

## S5-RC-001

- The 028 mirror trigger is disabled; one canonical session now owns transcript, deadline, status, vote gate, outcome, and event FK identity.
- Voting is rejected until that exact session reaches `voting`.
- Every terminal vote path resolves both `discussion_sessions` and `s5_rounds`, including ACT 6 second-tie system fallback.
- New rounds receive new session UUIDs and reconnect reads the exact current Sprint 5 session rather than legacy global maximum round order.

## Deployment and verification

- Migrations 029 and 030 applied to Supabase: `Success. No rows returned`.
- Sprint 5 focused live E2E: PASS, covering canonical messages, discussion gate, fresh sessions, fallback, repeated Clock rounds, private evidence, SHARE PHOTO, final route, and foldback.
- Sprint 2 live: 23/23 PASS.
- Sprint 3B remediation live: 15/15 PASS.
- Sprint 3C live: 15/15 PASS.
- Sprint 2 / Sprint 3B remediation / Sprint 4 / Sprint 5 static suites: PASS.
- GitHub Pages browser: canonical bilingual ACT 6 text, real DiscussionRoom, countdown, message composer, and pre-vote gate rendered without console warnings/errors.
- Sprint 4 live began and passed its first two authority checks, but the environment lacked `ASSET_MANAGER_REVIEWER_TOKEN`; no full Sprint 4 live PASS is claimed.
- The current production registry returned `ASSET_UNAVAILABLE · shared.portrait_hall` during browser validation. This verified explicit non-misplacing degradation; an ACTIVE portrait was therefore not available for a production-pixel anchor screenshot.

## Boundary

- Deployed migrations 027 and 028 were not modified.
- Corrections are additive in 029 and 030.
- No Sprint 6 work was started.

CA owns the next governed step: freeze `2e97415ed54788d657a9dab662c101f9c9ec01e6` and perform focused Level 1 re-audit of the four Sprint 5 blockers and directly adjacent regression risk.
