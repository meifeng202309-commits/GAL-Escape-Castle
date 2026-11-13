# Teacher trial report 2026-11-13 — CA first-pass index (26 slides)

Source: Teacher-uploaded `debug report 13 Nov(1).pptx`, 26 pages. CA reviewed extracted slide text and rendered slide screenshots. **The original PPTX binary and its screenshots are available in the CA chat attachment, NOT embedded in or attached to this Git repository.** This is a faithful issue index and action-routing mirror, NOT an assertion that GA or CD can see the PPT screenshots. Screenshot-exact visual approval must use the original PPTX supplied once to a shared repository location, or request specific extracts from Teacher; do not invent visual details. Preserve slide/page numbers.

Labels: **AASP-1** = Applicable to all similar problem-1; **ATAP-1** = Applicable to all pages-1. These are Teacher's scope labels, not separate bugs.

## First-pass dispositions
| Slide | Teacher report / request | CA first-pass category and intended owner |
|---|---|---|
| 1 | No visible Clean Room/reuse button. If only a missing button, fix; if run-reuse mechanism buggy, **abandon feature** rather than spend more time. | P1 trial blocker. CD/CA: bounded reproduction; discriminate wrong Create Room workflow, absent/disabled Prepare button for completed run, and backend failure. No refactor. |
| 2 | Pocket populated before Start Formal Run. | P1 state leak; CD/CA investigate fresh-session UI vs server data, fix minimally. |
| 3 | Five-star watch-back overlay omitted/poor. Teacher proposes preparing satisfactory images, hand to VA, direct replacement without cumbersome review. | GA/CA + VA asset workflow decision; accept Teacher-supplied final assets with essential size/path/functional check, avoid redundant approval loop. |
| 4 | **ATAP-1** Runtime text piled together; one bilingual sentence per line; wording too brief or unclear, signal should say 'no mobile signal', room provenance for clues; GA should produce Player × ACT/Scene inventory: col A actual Runtime words, col B player's-naive-view critique/rewrite, Teacher approves final, CD implements. | GA/CA design/copy authority; CD after signoff. |
| 5 | 'Wachten op de anderen… / 等待其他人…' repeatedly printed, should appear once. | CD/CA P1 dedupe/idempotence. |
| 6 | Map contains scriptwriter-only Player position markers; remove these from in-game graphic. | GA/CA design authority, likely Teacher/VA replacement. |
| 7 | Paper illustration has no visible words. **AASP-1**. | CD/CA asset-text completeness investigation; distinguish missing baked-in text vs overlay/load failure, GA/VA if art required. |
| 8 | **ATAP-1** Runtime clue copy hard to understand; Teacher provides intended Chinese wording: phone signal restored but unstable; contact companions; select latest message in Action area. | GA/CA wording review for all roles/scenes; CD after approval. |
| 9 | Numerical string duplicated below graphic; similar illustration has no string. **AASP-1**. | CD/CA display/asset text dedupe and missing clue visibility. |
| 10 | GAL-A/GAL-C item buttons do not respond; apparently not script-defined props. | CD/CA functional bug + GA/CA decide whether items exist in canonical script. |
| 11 | Star/overlaid clue ugly, details illegible; perhaps separate enlarged detail image. **AASP-1**. | GA/CA visual decision and Teacher/VA replacement; CD display only. |
| 12 | Two scene pictures displayed simultaneously; user asks whether script calls for two or bug. | GA/CA resolve storyboard intent, then CD only if mismatch. |
| 13 | Waiting for Linda, Runtime text appends repeatedly ~once/sec, and Linda had not decided. | CD/CA P1 idempotent status/render and actual wait-condition evidence; do not assume Linda action submitted. |
| 14 | Specific marked Runtime sentence should be removed. | GA/CA content validation; CD remove after signoff. |
| 15 | Red error message stalls progress for seconds to minutes. | CD/CA P1 diagnose timestamp/ACT/RPC impact; fix if reproducible and material. |
| 16 | Runtime same content emitted once/sec. | CD/CA cross-cutting dedupe (group with slides 5,13,18). |
| 17 | Clock/number overlay is ugly and misplaced; Teacher marks preferred lower location. | GA/CA/VA final image/overlay positioning; CD implement if approved. |
| 18 | After vote, same block repeatedly emitted. | CD/CA repeated rendering P1 (group 5,13,16). |
| 19 | Teacher Console shows technical/status lines whose purpose is unclear; review each, remove useless ones. | CD/CA inventory of actual diagnostics and utility, GA/CA decide Teacher-facing informational content if needed. |
| 20 | Door labels/graphics overlaid too heavily; original image already clear. **AASP-1**. | GA/CA/VA remove redundant overlays where underlying art sufficient; CD implement after approval. |
| 21 | Teacher Console does not show which student voted, who has not, whether each of 4 successive vote rounds has ended/started. | P1/P2 Teacher observability; CD/CA audit current data & UI, minimally display actual per-round state; GA/CA verify vote semantics, no invented stage state. |
| 22 | Use names Anna/Gitte/Linda instead of GAL-A/B/C; overlay ugly. **AASP-1**. | CD/CA correct display identity; GA/CA visual art. |
| 23 | 'AA站/BB站' should be 'A站/B站'. | CD/CA trivial copy correction after verify canonical station naming. |
| 24 | During dark-screen + horror audio, use thematically fitting picture. | GA/CA scene/art design then Teacher/VA. |
| 25 | Ending several screens after '你们终于逃出来了，但是城堡记住你了…' pass too fast. Teacher requests Next button advancing on student click. | GA/CA pacing/mechanics decision; CD implementation only after defined screen sequence/authority. |
| 26 | Reusing Room Code failed. UI shows Create Room 'Room already exists ... Watch room ... future teacher-authenticated reinitialize'; Teacher does not understand Watch room or re-initialize location. | P1 priority; CD/CA: Create Room being rejected for existing room is expected. Investigate usability/visibility/enablement of Watch/Reconnect & Prepare Next Run for both active and completed runs. Respect slide 1 abandon-if-backend-broken instruction. |

## Prioritization and boundaries
- Priority 1: room reuse usability/mechanism (1,26); pre-formal Pocket state (2); nonresponsive props (10); repeated Runtime accumulation (5,13,16,18); blocking error (15); Teacher vote visibility (21).
- Content/visual GA-first: 3,4,6,8,11,12,14,17,20,24,25, plus script identity aspect of 10 and semantics of 21.
- Small CD-only after validation: 7,9,19,22,23, and others as exact scoped instruction.
- Report screenshots are observations, not proof of backend cause. Avoid speculative fixes and broad audits. Honor Teacher's explicit wish: if Run reuse requires renewed major engineering, abandon it; improve trial usability instead. Keep Scene/Runtime/Action boundaries consistent with previously approved project definitions.
- For artworks, distinguish **Teacher-supplied approved final replacement** from speculative CD-created overlays; minimal technical review (asset correct content, dimension, load path) still needed to avoid blank scenes.

## Evidence handoff limitation
GA and CD **cannot assume they can open a PPTX uploaded into the CA chat**. They can immediately act on this 26-slide shared textual index. For image-specific decisions, the original report must be uploaded once to a common GitHub path or made accessible through an explicit shared attachment. CA does not claim an image-rich copy was committed.
