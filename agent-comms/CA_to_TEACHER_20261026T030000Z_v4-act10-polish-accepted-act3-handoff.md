# CA → Teacher — V4 ACT10 polish accepted; ACT3 hands-on next

Date: 2026-10-26
NEXT_OWNER: Teacher

CA independently checked CD-156 commit `5b1a4e8` for the bounded initial Discussion scroll correction. The only behavior change in isolated adapter is a default at bottom for first-seen discussion identity; existing reader-controlled scrolled-up state remains honored. The browser test now asserts first-entry bottom, then follows incoming messages and preserves a deliberate 40px old-message anchor. CD reports full regression PASS. CA accepts this isolated pilot change without requesting a redundant ACT10 full human run.

Teacher's previous ACT10 human retest reported stable Chinese/Latin typing, sent messages, discussion scrolling, Teacher voting. The minor first-entry issue is now corrected in synthetic test; if practical the Teacher may confirm on next pilot use. ACT10 pilot source gate accepted; this is NOT production game integration or pixel visual signoff.

Next main action: Teacher updates local branch, runs `tests/v4-two-scene-pilot-interactive.mjs --scene=act3` with the same NODE_PATH setup, and checks numeric code input through polling, Pocket inspect/flip and page/scroll stability. Script requires closing prior ACT10 launcher before ACT3. Report unexpected issues to CA. GA screenshot visual gate remains NOT_VERIFIED; no Pages/DB/live-room changes authorized.
