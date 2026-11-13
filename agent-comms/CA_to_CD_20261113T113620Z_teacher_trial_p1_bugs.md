# CA to CD — Teacher trial 2026-11-13: bounded gameplay bug triage

Timestamp UTC: 2026-11-13T11:36:20Z
NEXT_OWNER: CD for the runtime/functional workstream; GA separately handles content/design questions.

Teacher has completed a fresh trial. **Create Room and all three Player joins work**, but a previously used Room Code cannot be reused. Full 26-slide textual index, authored by CA after reading original PPTX and rendered screenshots:
`docs/reports/remediation/ui/TEACHER_TRIAL_20261113_CA_26_SLIDE_FIRST_PASS.md`.
Original screenshot-rich PPTX exists only in CA chat, not the repository. Do not claim direct screenshot inspection or infer unobserved details. For most runtime bugs the exact slide report plus code/record reproduction is adequate. If any screenshot is essential, request shared evidence through CA instead of asking Teacher to send it separately to multiple agents.

## P1 — Do only the smallest work that unblocks another human trial

**1. Room reuse (slides 1,26):** Screenshot shows Teacher clicked *Create room* with a used code and got the expected `Room already exists; use Watch room ...` error. This ALONE does not prove the Option B run-isolation backend is broken; it may be a UI workflow/disabled Prepare button for a completed run. Check current V5 `Watch / Reconnect` semantics, where `Prepare for New Session` appears, and whether it works for an interrupted *and a completed* prior run; also check whether prepared-but-not-started room states are handled. Reproduce with a disposable room in a safe test environment. **Teacher's explicit decision:** if mechanism is already implemented and only a missing/inaccessible action/wording, make the minimal UI fix; if reuse still requires substantial backend refactoring, stop and recommend ABANDONING this feature. Do not start a new architecture or cleanup project. Return an exact operator sequence that Teacher can follow.

**2. Pocket before formal start (slide 2):** New-player waiting screen shows a watch/pocket image before Start Formal Run. Distinguish initial page visibility from stale past Run data. Ensure a fresh session shows no collected Pocket items prior to formal start.

**3. Runtime repeated accumulation (slides 5,13,16,18):** Waiting/status/vote text accumulates roughly once per second. Group under ONE shared render/idempotence root cause if proven. Fix append-vs-replace or dedupe as appropriate; preserve important state and avoid changing canonical game narration without GA signoff.

**4. Stalling error (slide 15):** Error message blocks progression for seconds to minutes. Determine exact RPC and whether a transient retry/reconnect is the cause. Fix only if material and reproducible; provide a clear status if waiting.

**5. Prop/UI and clue issues (slides 7,9,10):** Nonresponsive GAL-A/GAL-C diary buttons (10) — inspect code and report whether they are script-authorized to GA; blank note text (7); duplicated number string plus absent digits on another note (9). Separate missing asset/overlay from data/DOM duplication. Do not invent clue contents.

**6. Teacher vote observability (slide 21):** Teacher cannot tell which named Player has voted, who has not, or which of four stages is current. Inventory real DB/UI state and propose minimal real-time per-player/per-round status. Ask GA only for the narrative naming of the four rounds; implement no invented stages.

**7. Small verified text/UI defects (slides 19,22,23):** Inventory technical Teacher-console lines and purpose before removal (19); show player character names rather than GAL role IDs where applicable (22); correct AA站/BB站 to A站/B站 (23) only after confirming script names. Do not churn otherwise harmless text.

## GA-owned — no unilateral CD content edits

Slides 3,4,6,8,11,12,14,17,20,24,25 and visual portion of 22 require GA/Teacher decisions on Runtime copy, story assets, overlays, ending Next, and final art. Do NOT launch related redesign now. Teacher plans possibly to supply finalized corrected artwork for VA replacement; wait for approved asset keys.

## Output and execution boundary

First record factual findings, specific causal evidence and smallest corrections; do not immediately start an extensive audit. Make source-only minimal P1 corrections where safe; test focused affected paths. No production SQL/Pages release without follow-up CA review/authorization. Record whether room reuse is truly viable under Teacher's abandon-if-hard criterion. Prioritize quickly resuming human play over exhaustive security/recovery procedures. Return CD -> CA report/letter with commit and tests; transfer ownership then to CA.

The report labels ATAP-1 and AASP-1 designate sweeping *similar-instance* checks, not blanket authorization for massive changes.
