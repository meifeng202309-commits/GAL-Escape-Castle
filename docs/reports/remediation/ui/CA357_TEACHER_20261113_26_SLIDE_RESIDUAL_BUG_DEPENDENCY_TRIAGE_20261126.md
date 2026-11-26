# CA-357 — Teacher Nov 13 26-slide residual-bug causal/dependency triage

Date: 2026-11-26
Status: REVIEWED — ONE BOUNDED CD SOURCE TASK; ALL OTHER RESIDUALS OBSERVE ON NEXT LIVE TRIAL
Source: Teacher `debug report 13 Nov(1).pptx` (26 slides), mirror `TEACHER_TRIAL_20261113_CA_26_SLIDE_FIRST_PASS.md`. AASP-1 and ATAP-1 are *scope labels*, not extra defects. Supplemental 2026-11-17 rejoin and Runtime/image reports also included.
Current release: CA-355 public Pages `d530f830186572e1cc623ce3ac71f8e5bc53af00`; new Runtime and nine images were activated 2026-11-25 according to CD production report. Live full game/human image acceptance remains NOT VERIFIED.
Decision rule approved by Teacher on 2026-11-26: for a residual bug with an independently known cause, limited blast radius, clear requested behavior, and small existing-code fix, authorize CD **now**; for symptoms potentially caused or already influenced by recently modified rendering, assets, scripts, server state, or text, wait for human trial and only then decide. No broad speculative tests, new gates, or immediate deployment.

## Full original 26-slide disposition

| Slide(s) | Symptom / request | Closest supported causal evidence | Dependency judgment | Action |
|---|---|---|---|---|
| 1,26 | Clean/reuse old room code or button not findable | Migration075 + Teacher Watch/Reconnect→Prepare Next Run; two-run live smoke 2026-11-14 | Linked to already-corrected room/session lifecycle | OBSERVE; code/flow fixed, no additional work now |
| 2 | Pocket contains items before formal start | Pre-run Pocket reset + production smoke verified empty | Already corrected lifecycle rendering | OBSERVE, no changes |
| 3 | Five-star image on Linda watch back unsatisfactory | Teacher approved new original v003, CD staged; nine-image CA355 activation reported | Recently changed exact visual asset, no fresh human view | OBSERVE |
| 4,8 | Runtime too compressed, missing context/line breaks; weak phone signal text | GA151/152 canonical bilingual Page-ID content, CD selector and migration079; representative 25 Chromium pages and recent release | Shared Runtime render/catalog updated in package | OBSERVE actual three-role dialogue before further rewriting |
| 5,13,16,18 | Waiting/status/vote lines repeated per poll | Existing routed-node accumulation root cause fixed, five-refresh public smoke after migration075 | Shared renderer already corrected | OBSERVE rather than repatch |
| 6 | Map shows writer-only player position tags | Approved Gitte map v002 now activated according to CD; pixel review NOT RUN live | Image replacement directly targets issue | OBSERVE actual graphic |
| 7,9 | Number paper blank, duplicates/missing digits | HTML clue delivered separately; duplicate Runtime and Pocket paths identified; paper front/back v002 newly activated, dedupe modified | Intertwined asset/text/pocket rendering and user stage | OBSERVE count and position of digits in each visible state; no new overlay code before trial |
| 10 | Anna's share-to-Gitte/Linda buttons seem inert | Chrome proved handler and s3_share_photo request; backend accepts only permitted scene/discussion phase; visible sender success ack missing (source-level). New Runtime/phase behavior still untested live | UI acknowledgement is relatively isolated, but actual click outcome may be server phase/presentation; adding durable sent-state affects server/view model and canonical copy | OBSERVE one real share attempt first; optional *later* one-shot UI-only acknowledgement if successful but unclear; do not touch server now |
| 11 | Overlay/star ugly, detail hard to read | Approved revised watch/other clue artwork activated, browser appearance not checked | Fresh image replacement | OBSERVE |
| 12 | Two pictures unexpectedly at once | No confirmed wrong caller vs script intention; ACT4/5 Library Scene changes recently made | Script/scene dependent | OBSERVE exact screen first |
| 14 | Specific unnecessary Runtime sentence | Approved GA copy batch and Page-ID routing newly shipped; screenshot-specific text not proven present in new version | Canonical text change dependency | OBSERVE and capture exact sentence if it survives |
| 15 | Red error message blocks progress seconds to minutes | Original s2_get_player_state read-only logs returned HTTP200; no retained timeout reproduction; newer lifecycle/latency fixes and production release | Root cause unknown and potentially transient/backend dependent | OBSERVE; only then targeted RPC/time evidence |
| 17 | Ugly/misplaced clock/number overlay | Related Scene/asset binding and later Teacher visual replacements; no definitive screenshot matched to latest rendering | Fresh visuals/overlay behavior | OBSERVE |
| 19 | Too much raw technical info on Teacher Console | Confirmed hierarchy problem and specific secondary-field inventory; useful live operational clues remain, while vote stages also under review | Can change UI only, but would obscure Teacher's live debugging and interact with slide21 vote-info redesign | DEFER until one Teacher trial determines still-cluttering lines; no wholesale hiding now |
| 20 | Door overlays duplicate words on art | Main Gate v003 already has A/B/C baked-in text suppression; Great Hall approved images use art-state display | Core visual replacement/renderer already changed | OBSERVE actual doors |
| 21 | Teacher cannot see individual voting and each of four rounds clearly | Submitted/Waiting and raw phase/step added and tested, but bespoke friendly round progression not established; driven by authoritative vote server stages | Connected to vote semantics and recently modified Teacher UI | OBSERVE Teacher console through rounds; only correct confirmed missing stage/indicators |
| 22 | GAL-A/B/C rather than names; ugly overlay | Role names corrected in Share/Teacher UI, art overlay edits depend on changed imagery | Text component done; image aspect awaiting view | OBSERVE only remaining graphic appearance |
| 23 | AA/BB station instead of A/B | Current GA localization already reads A站/B站 | Resolved in text catalog | NO ACTION unless live mismatch |
| 24 | Dark-screen horror audio needs atmospheric picture | Requires design/canonical image decision; no approved exact art or demonstrated change | Independent from code mechanically but **not executable as CD-only** without new visual source/Teacher art approval | DEFER as P2 visual design, never improvise an image |
| **25** | Ending captions switch too fast; explicit Teacher demand for Next button | Current **public release app.js** `renderSprint8(payload)` still uses automatic `setTimeout` delays `[900,1100,1400,1800,1800]`; no per-screen Next button; separate Switch session control already exists and previous replay bug fixed | **KNOWN, isolated client-only finale display/pacing defect**, clear Teacher-approved behavior, no need to touch game state, DB or art | **CD FIX NOW** within existing `renderSprint8`; see single handoff |
 
## Nov 17 supplemental report disposition

| Symptom | Latest evidence | Decision |
|---|---|---|
| Edge refresh repeats completed ending, Switch session obstructed | CA338 run-id persistence, visible Switch, cleanup of timer, browser test PASS, 2026-11-25 public release | OBSERVE in new human trial; no further code change |
| Chrome first Join fails before refresh | Deterministic first button click issues one normalized RPC in Chrome; no original first-failure request/state; Enter key intentionally not submit | OBSERVE original failing action sequence; do not guess |
| Runtime old/short text, most VA images absent | GA151/152+079 and nine approved images released 2026-11-25, human visual verification NOT RUN | OBSERVE; avoid redoing content/art without finding remaining discrepancy |

## Exact sole immediate CD scope — Slide 25

- Replace **automatic final caption-to-caption advancing** after opening fade with an obvious, keyboard-accessible **Next / 继续 / Volgende** user action using existing approved localization where available (if new user-facing wording is required, use Teacher's explicit approval for the simple Next control and do not author new story prose).
- Keep the approved final caption order and content, the existing first-screen fade/cinematic transition, and the existing **Switch session** accessible at *every* finale step. Do not require a server RPC to advance the local display. No new DB field, migration, action/vote state, or new state machine.
- Persist the existing no-replay-on-refresh behavior and current-session switch/cleanup; avoid a new repeated automatic timer when returning from refresh. Ensure each completed-run Player can advance its own final slide at its own pace; no synchronized player-progress requirement.
- One small existing-browser test addition for: no unattended automatic caption progression; exactly one step per Next click; final stage has no further Next; visible Switch session; refresh/no-replay; Switch cancels pending effects and reveals Join; no impact on in-progress reconnect. Do not make an independent test framework or publish automatically.
- CD returns **one concise source/test handoff** to CA; **no production deployment authority is included**. CA performs only material final diff check and routes one Teacher release decision if warranted.

## Efficiency decision

Only Slide 25 meets all four direct-CD criteria now. Slide 10's missing success acknowledgement is a real but not proven high-priority defect, potentially connected to actual server-phase rejection. Slide 19 could be independently polished but the information needed for slide21 live vote diagnosis and cross-scene usability means adjusting it before trial may lower diagnostic value. Slide 24 needs imagery approval rather than coding. All other remaining symptoms directly interact with newly shipped content/assets/session/vote logic or have no proven reproducible cause.

The goal is a single low-risk change while Teacher proceeds with normal gameplay. Do not frame the other issues as confirmed current production bugs merely because November 13 screenshots once showed them.
