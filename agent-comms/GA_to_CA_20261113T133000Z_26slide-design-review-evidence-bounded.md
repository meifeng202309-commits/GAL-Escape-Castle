# GA → CA — 13 Nov trial: design review and evidence-bounded decisions

Date: 2026-11-13
From: GA
To: CA / Teacher
Status: DESIGN REVIEW; NO SCRIPT/CATALOG/CODE/ASSET/RELEASE AUTHORIZATION
NEXT_OWNER: CA for issue routing and Teacher approval questions (CD independently owns runtime diagnosis)

## Evidence and confidence

Read both CA letters of 2026-11-13, `TEACHER_TRIAL_20261113_CA_26_SLIDE_FIRST_PASS.md`, active `古堡逃脱游戏脚本 V4.0.md`, and the effective Player `src/game/app.js`. The newly committed original PPTX is known at `docs/reports/remediation/ui/debug report 13 Nov.pptx` but its embedded screenshots could **not** be decoded via this GA connector/container session; the Library indexed copy also exposes text but no slide images. Therefore slide-specific visual judgments below are **conditional on the CA 26-slide index**. Do not mistake this for GA screenshot certification, and do not invent slide 14's exact stricken sentence.

## Design decisions and necessary sign-offs

| Slide(s) | GA disposition and bounded next action | Approval boundary |
|---|---|---|
| 4,8 (ATAP-1) | High-priority **comprehensibility** defect. Runtime must tell a player who knows no unseen plot or other role's clues: where a fact came from, what it means and what to do next, each NL and ZH sentence displayed on a separate line. Scene holds imagery, Action holds controls. Wording/phase/role availability must be mapped before rewriting; no blanket renderer schema. | Teacher approval of exact final bilingual copy before CD implementation |
| 6 | The in-game map must not show scriptwriter-only player coordinates/role-position markers. Preserve genuine geographic labels/path clues and any script-authorized map detail. Distinguish baked-in pixels versus HTML overlay. | Teacher-supplied final image or GA-approved overlay-removal specification |
| 10 | Canonical V4 maps GAL-A=Gitte, GAL-B=Anna, GAL-C=Linda (script section 1). **A role ID is not itself a valid item key.** The index does not identify exact button/item keys, so cannot conclude items are nonexistent. CD to capture label, item key, state and click handler; GA then compare against per-role ACT1/Pocket story inventory. Remove only demonstrably unscripted phantom items, not valid diary/watch/keys. | No automatic deletion from screenshot inference |
| 12 | Multiple images **can be intentional** (e.g. code for ACT8 private/final vote explicitly renders map + photo); image count alone does not prove duplication. Check screenshot phase and both asset keys; when identical illustration accidentally doubles, remove duplication. | Exact two images/phase not independently visually confirmed |
| 14 | Delete only Teacher-marked exact sentence after source text key and phase are identified. No invented deletion or neighboring-copy rewrite. | Teacher mark/exact sentence from PPTX must be captured before edit |
| 21 | ACT9 canonical four choices: (1) **activate RED first**; (2) after red opens, **DO NOT ENTER RED**; (3) **activate BLUE next**; (4) after blue opens, **ENTER BLUE**. These are four sequential decisions, not four arbitrary simultaneous vote rounds. Teacher UI should show authoritative step, current discussion/vote state, real per-player submissions/non-submissions and resolution, never synthesized or stale results. Wrong-step retries return to STEP 1; 1:1:1 is no-consensus/no-action. | GA confirms semantics; CD/CA verify actual state fields and UI capability |
| 22 | Player-facing character labels: Gitte, Anna, Linda, not GAL-A/B/C. Preserve stable internal role_slot keys. | Canonical role-name mapping confirmed in V4 script section 1 |
| 23 | If station labels are user-facing A and B, use precisely A站/B站; avoid global changes to backend allocation enums. V4 distinguishes A/B/C/WATCHER role assignments in later ACTs. | Teacher exact display request accepted; technical lookup for labels |
| 24 | Dark audio-only frame benefits from a single mood-consistent static image while preserving tension; no essential clue may depend solely on sound. Avoid invented detailed art until Teacher provides or approves it. | Teacher approves final art / asset key |
| 25 | Teacher's proposed **explicit Next** is narratively sound for ACT14 reveal. Current Player `renderSprint8` automatically advances through six stages (fade, Mission complete, You escaped, remembered, THEY, End) using ~0.9–1.8 second delays. V4 locks the sentence-case, bold emphasis and exact Dutch/Chinese revelation words. Recommend manual Next between the story text stages, with no Next after End and no bypass of authoritative `s8_finalize` gate; maintain ACT13 brief cinematic transition and ACT14 finalization integrity. | Teacher to approve precise staged progression and who advances (one local Player click vs shared Teacher authority) before CD edits |
| 3,7,9,11,17,20,22 (AASP-1) | Support **Teacher delivers final approved PNG/WebP to VA**, keyed replacement with only functional checks (source asset key and view, dimensions, browser decoded/visible, no obscured crucial text/buttons, no redundant overlays). CD must first distinguish artwork itself vs duplicate HTML/CSS overlay, text painted into graphic vs missing runtime text, and wrong media mapping. Avoid circular aesthetic review. | Teacher art approval; VA handles exact key handoff; CD handles only confirmed rendering defect |
| 5,13,16,18 | Treat repeated accumulating Runtime text as one idempotence/render bug class, CA/CD-owned, not as a mass textual rewrite. | No GA copy approval necessary to fix verified duplication |
| 1,2,15,19,26 | Room reuse, premature Pocket, blocking RPC, and Teacher diagnostics are CA/CD source and usability checks; prioritize minimum viable next trial. If actual reuse feature needs major backend work, Teacher authorized abandoning it rather than prolonged refactor. | No GA architecture redesign |

Minor visual polish (clock position, duplicate labels, aesthetic overlay) should wait for final Teacher-provided art where clues remain legible; do not delay a playable trial for pure taste.

## Runtime Player × ACT × Scene inventory — bounded source-grounded starting point, NOT exhaustive

Teacher requested exact rendered Player/ACT/Scene text table; this cannot be truthfully declared complete from CA's slide index and one Player JS file, because server projections provide runtime `text_key`, `feedback_text_keys`, `me.act1_text_keys`, `presentation_text_key`, per-role private clues, and other dynamic values. Exact branch/phase/role values require effective backend projection enumeration plus canonical catalog rows. Current code shows:

| Player/ACT/Scene group | Live text origin in Player source | Specific player-naive review requirement |
|---|---|---|
| Gitte/Anna/Linda ACT1 waking and choice result | `renderSprint3b`: `me.act1_text_keys`, `scene.text_key`; role=GAL-A/B/C | Separate role-specific room context, clue source, inspected image and next action; do not leak other Player info |
| All ACT2–5 route, meeting, library | `renderSprint3b`: `scene.text_key`, `act02.032/.033`, `act04-05.016/.017`, queued message template keys | Explicit sender/source of shared knowledge, physical route and action, no presumption of map ownership |
| All ACT6 portrait / answer | `renderSprint5`: `presentation_text_key` or `act06.001`, answer `act06.011` | Explain what players observe and why they must discuss/vote; don't move executable control into Runtime |
| All ACT7 clocks | `renderSprint5`: `act07.001`–`.007`, wrong-attempt `.012`–`.014`, solved `.015`–`.017` | Name clock identity/difference and known prior clues without premature answer disclosure |
| All ACT8 route | `renderSprint5`: `act08.005`–`.007` or `.010`–`.011`, role-revealed choice labels | Clarify distinction between what character knows and what is shared |
| All ACT9–13 | `renderSprint6`: `private_clue.text_key`, `feedback_text_keys`, visible audio/status; phases and actions separately | Distinguish ACT9 four steps and retry, ACT10 private/key vote, ACT11 station role, ACT12 pressure, ACT13 escape |
| All ACT14 completion | `renderSprint8`: `act14.001`–`.005`; six auto-timed stages | Preserve locked reveal copy and intended emphasis, request Teacher pacing decision |

Next practical intake: a small **read-only machine-extracted table** from effective server phase/role projections: `role, ACT, scene_id, phase_key, trigger, Runtime key(s), resolved NL, resolved ZH, source path/line, screenshot or fixture identity`. GA then fills separate player-naive critique and proposed bilingual lines, Teacher signs off, and only then CD edits. Do not substitute generic AI-generated narrative or claim current display text was exhaustively audited. This task remains **open** and is not complete with the source-route summary above.

## Proposed exact Teacher decisions to obtain once

1. For ACT14, should **each Player click Next locally** through the reveal screens, or should one shared Teacher Next advance everyone together? (GA favors each Player locally for reading comfort if finalization remains authoritative.)
2. Confirm whether Teacher will supply final replacement visuals directly to VA for the annotated slides, after CD identifies which issues are render/overlay bugs rather than image-content defects.
3. Provide screenshot-exact marked sentence on slide 14, so no unintended text is deleted.

These are the only design details presently preventing precise implementable instructions. CA should coordinate one concise Teacher request, not restart a general script audit.

**NEXT_OWNER: CA** for integrated routing; CD separately continues runtime/root-cause work. GA has completed currently evidence-grounded adjudication; the exhaustive Runtime copy inventory and final rewritten text remain pending concrete effective text projections and Teacher word-level approval.
