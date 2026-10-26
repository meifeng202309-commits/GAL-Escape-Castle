# GA → CA — Teacher-directed Trial 4 reprioritization and Player left-column layout

Date: 2026-10-27
From: GA
To: CA
Status: TEACHER-DIRECTED DESIGN PRIORITY UPDATE; no production edit authorization
NEXT_OWNER: CA

Teacher has explicitly reordered the six issues after reading GA's direct six-slide report (GA-132). This **supersedes GA-130/131/132's proposed work order**, not the factual observations.

## Binding priority order

1. **Scene / Runtime / Action ownership, left column top-to-bottom.** Scene at upper left contains the **main scene visual AND key clue images** (e.g. ACT1 study map, key, watch). Runtime at middle left contains **scene/event explanation and guidance on what the player should do next**. Action at lower left contains **executable controls**: Continue, voting, choices, submissions. The right-side Discussion/Pocket arrangement is not re-authorized for unrelated redesign. This explicitly updates the previously described V4 prototype's left-column ordering (which had Scene above Story, with Action on the right); do not apply the older grid blindly. Keep existing canonical gameplay/DOM/RPC ownership, but CA should request a tightly bounded DOM layout/content-placement impact map from CD before source edits. Clarify actual responsive fit at 100% zoom. Teacher's examples refer to key image display in Scene, not removal of items from Pocket.
2. **ACT9 countdown:** verify against approved ACT9 time policy, and determine whether displayed countdown reflects actual enforced time or stale presentation. Avoid presumptively changing server timing.
3. **Scene clue image loading:** check root cause for paper-slip, diary, watch and other key clue visuals failing or loading slowly; compare canonical asset mapping, loaded URL, rendering placement and image decode before editing.
4. **Pocket beyond first item:** inspect all three Players' item access, second and later items' **image/detail loading** and expansion. Screenshot showed several names, so don't assume inventory loss merely from absent detail images.
5. **ACT9 scroll-reset:** **defer standalone patch initially**. After moving Scene to top with the full main picture visible and Runtime/Action correctly below, retest actual ACT9 runtime scrolling. If reset persists and affects reading, fix the remaining polling/scroll problem; do not declare it fixed based on layout assumption.
6. **Tie explanation and other incomplete game copy:** **defer to a subsequent consolidated narrative/instruction-text pass**. Do not make ad hoc one-line edits now; scope applies to many incomplete in-game explanations.

## Scope discipline

These six are prioritized **investigation/implementation work packages**, not confirmed root causes. In particular, Scene relocation may reduce page scrolling but does not logically prove Runtime scroll reset is resolved: Runtime can still have long text and DOM replacement. The desired left-column order may require a targeted update to the approved V4 layout contract; record the Teacher direction as the current design decision, preserving existing one-entry runtime and stable IDs.

Request CA to independently define minimal CD source investigation and implementation admission consistent with the above order and next playable full-game run. No speculative redesign, backend restructuring or additional compliance process. GA design clarification is complete.

**NEXT_OWNER: CA** for scope and execution handoff to CD.
