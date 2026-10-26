# Trial run report 4 — CA intake from original six-slide PPTX

Date: 2026-10-27
Primary source: Teacher-uploaded `GAL trial run report 4.pptx`, exact same filename on main at `docs/audits/independent/GAL trial run report 4.pptx` (Git blob `f067c15c6a4dba38a0d5acd22d44926ef5a51330`).

CA successfully parsed and visually reviewed **all six slides** of the direct user-uploaded PPTX after the GitHub connector could not decode it. This is a report inventory, NOT a confirmed root-cause analysis.

Teacher's normative window vocabulary must be preserved independently of the current renderer: Scene = environment/pictures/visual observation; Action = choices/input/submit/progression controls; Runtime/Story = exposition/task narrative/learned outcomes; Discussion = discussion and vote; Pocket = possessed/inspectable items. The report refers to **expected** placements, not existing DOM.

## Slide-indexed observations

1. Slide 1: The room/background picture renders in the Castle Escape Runtime panel instead of upper Scene. Teacher explicitly says prototype positioning differs and asks for comparison. Screenshot shows runtime holding bedroom image while Scene region text/display is sparse; this is a layout/content ownership complaint, not evidence of a broken asset.
2. Slide 2: In Gitte's room, choosing "研究地图" (study map) should show the map picture in Scene. Explanatory narrative belongs to Runtime, while Doorgaan/Continue button belongs to Action. Teacher notes **same issue for all three Players**. Actual screenshots show description and Continue in Action and room images in Runtime. Treat as content-routing misallocation, not an instruction to rewrite gameplay.
3. Slide 3: A small cipher-note image should appear (currently the note content is presented text-only); Anna's servant diary image took an unreasonably long time to load; Linda's Pocket showed the stopped watch but not the other items, and Teacher generalizes that each Player Pocket seems to display only its first item. Screenshot collage includes a pocket item list, a partial image, and a map image; determine whether this is click/expand affordance, loading, registry, or renderer-state issue before claiming an underlying bug. This is potentially gameplay-relevant clue visibility.
4. Slide 4: Teacher intentionally engineered a tied first vote; after the second discussion/vote round appears, prepend the meaning of: "第一轮投票没有形成共识，请再进行讨论，然后做第二轮投票" before the existing "讨论结束后开放投票". Current discussion content indicates continuation without clear explanation. Likely small narrative/feedback task, not a vote algorithm defect.
5. Slide 5: ACT9 still has an explicit remaining-time countdown (screenshot displays approximately 58 seconds). Teacher flags this as contrary to intended ACT9 time policy. Inspect scene/rule first; do not assume any timer is merely cosmetic.
6. Slide 6: ACT9 Runtime scroll bar automatically returns to top roughly one second after the user scrolls; screenshot shows scene media with Runtime scrollbar. High-impact reading/interactivity issue, likely polling/render but root cause not yet established.

## Audit priorities / boundaries

P1: ACT9 automatic scroll reset and any timer that actually blocks progression; Pocket missing/inaccessible clues and delayed key image if materially affecting comprehension/progression.
P2: Scene/Runtime/Action content ownership across Players, missing cipher-note media, tied-vote repeat-round feedback.
P3: nonblocking visual refinements, if any.

These are investigation priorities, not decisions to edit code. Please verify actual game phase, authoritative state and minimal cause before CD changes. Avoid full architecture reviews, broad database audits and unrelated safety controls. Do not declare report conclusions or a human trial PASS/FAIL without the PPT evidence and precise outcome.

This inventory is sourced from uploaded original PPTX, slide text and visible screenshots; exact detailed imagery remains in the original six-slide deck.