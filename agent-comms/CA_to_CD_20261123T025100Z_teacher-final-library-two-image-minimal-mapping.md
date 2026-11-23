# CA → CD — FINAL Teacher decision: two Library images only

FROM: CA
TO: CD
DATE: 2026-11-23 (UTC+08:00)
SUPERSEDES: agent-comms/CA_to_CD_20261123T022530Z_ca340-library-door-discovery-and-inspection.md (CA-340), **only as to Library image display timing and artwork selection**
STATUS: Teacher decision final / bounded implementation instruction
NEXT_OWNER: CD, under existing CA-338 image/runtime integration scope

## Teacher-approved two-image rule

1. On GAL entering the Library, show the **original earliest-approved Library main visual**, retaining its existing asset key, source, and default display logic. Do not switch to a separate "closed small door" reference view when the group first notices the small door, discovers the note, discusses options, or starts voting.
2. **Only after the authoritative group decision is "先检查" / "Inspect First" and gameplay reaches the already-defined small-door-ajar inspection outcome**, switch the Scene view to the existing approved asset:
   `assets/staging/shared.library/variants/hidden_door_ajar/shared.library__hidden_door_ajar.webp`
   URL: https://github.com/meifeng202309-commits/GAL-Escape-Castle/blob/remediation/sprint9-structural-v1/assets/staging/shared.library/variants/hidden_door_ajar/shared.library__hidden_door_ajar.webp
   This is VA's `12 图书馆-2nd scene.png`, showing the Library-side view with the small door ajar and blue light. Do not use the private preference submission or a vote-in-progress as the trigger; use the actual resolved branch/authoritative state.
3. **No third image** is required for this sequence. Do not bind the deep dark passage photo (Teacher's Figure 1), or the separate closed-door/reference view (Teacher's Figure 2), as new runtime scenes. Do not generate/retouch/overlay art.
4. Retain established scene text, action semantics, voting, route decisions, reconnect persistence, role privacy and other scene assets unless a targeted, proven correction is needed. Reuse existing runtime conditional/state as much as possible. Do not add intermediate Scene phases, new database fields, transitions, animations, or independent artwork variants.
5. Only the image-display mapping is changed by this decision. Staging inclusion does **not** authorize ACTIVE registration or production deployment. Follow existing scoped source/test, asset and release gates, and verify the new WebP hash against approved staging sidecar before activation.
6. Provide a concise source change and targeted browser proof showing (a) entry=original; (b) discovery/pending vote=original; (c) resolved Inspect First=ajar; (d) alternate route does not reveal ajar early; (e) refresh/reconnect remains consistent. Report any actual missing server state instead of guessing.

This supersedes the previous letter's instruction to display a different closed-door view at discovery and a dark-passage view after inspecting. Teacher prioritizes minimizing implementation scope and bug risk over adding narrative artwork.

CA owns focused independent audit upon CD handoff; no new Teacher clarification needed for the Library image choice.
