# CA to GA — Teacher trial 2026-11-13: design and visual decisions

Timestamp UTC: 2026-11-13T11:35:32Z
STATUS: GA_DESIGN_REVIEW_REQUEST
NEXT_OWNER: GA (for this design workstream); CD owns separate runtime investigation.

Teacher tested GAL Escape Castle: Create Room plus 3-player join succeeded; reused same Room Code failed. Teacher supplied a 26-slide PPTX to CA. CA examined every slide and its screenshots. **Shared 26-slide issue index**:
`docs/reports/remediation/ui/TEACHER_TRIAL_20261113_CA_26_SLIDE_FIRST_PASS.md`.
The original PPTX binary/screenshots are presently only in CA chat and NOT Git-reachable, so do not claim to have viewed them. This text mirror is sufficient to begin script/copy review. Ask for a shared PPT if visual precision is indispensable; do not delay all other work.

## GA action requests (Teacher marked GA/CA, or design authority needed)

1. **Runtime text comprehensibility and layout (slides 4,8; ATAP-1):** build an exhaustive but bounded table by Player × ACT × Scene of currently rendered Runtime strings, with (A) exact current literal text and source location, (B) critique/rewrite from a player who knows NOTHING about later plot/other players, explicitly identifying where found clues originate, (C) proposed one bilingual sentence per line. Do not change code or final script yet. Teacher wants to discuss and approve the exact Runtime wording/format, then CD implements. Respect Scene=imagery, Runtime=narration/instructions, Action=interactions; do not assume current CD layout is authoritative.
2. **Story/graphic correctness:** slide 6 remove scriptwriter-only player-location markers from map; slide 12 decide whether two simultaneous images match script or are duplicated; slide 14 Teacher requests deletion of a specific Runtime sentence (see index); slide 10 investigate whether GAL-A/GAL-C diary prop entries are canonical scripted items or erroneous UI.
3. **Asset replacement process (slides 3,7,9,11,17,20,22; AASP-1):** Teacher proposes personally preparing final corrected visuals, passing them to VA for direct replacement instead of repeated aesthetic revisions/audits. Review and propose minimalist VA handoff: Teacher's accepted final PNG or equivalent; check only correct asset key, resolution, load, no obscured clickable cues, and legacy overlay removed if redundant. Avoid automatic bypass of ALL technical validation. Clarify which slides need original art replacement vs a small rendering fix. Watch-back five-star overlay, map, empty note, duplicate/missing number strings, unreadable close-up, clock placement, door overlays, station labels.
4. **Scene/pacing decisions:** slide 24 horror audio/dark scene wants evocative still image; slide 25 ending frames too fast, Teacher proposes explicit Next progression; decide narrative pacing and precise trigger rules before CD work.
5. **Teacher observability semantics (slide 21):** clarify sequence/labels for four noted vote rounds (red door opening; not entering red; opening blue; entering blue); distinguish storyline semantics from technical state so CD can expose actual round status, not invented progress.
6. **Names and labels:** Teacher wants human character names, not GAL-A/B/C where player-facing (slide 22), and A站/B站, not AA站/BB站 (slide 23). Confirm stable canonical character-to-role mapping from script; do not guess.

## Return
A critical, concise design review identifying (i) decisions GA can recommend, (ii) items requiring Teacher signoff, (iii) exact implementation instructions that can later go to CD/VA, (iv) things that are merely minor visual imperfections not worth fixing. Prioritize legibility and coherent story without another large redesign.

No code or production deployment authorization in this letter. On completion return written GA -> CA / Teacher decision brief in `agent-comms/` and refer to exact index slide numbers. Ownership of GA review transfers to GA at this time.
