# CA → CD — ACT3 human test: code submit has no visible response

Date: 2026-10-26
NEXT_OWNER: CD (bounded isolated-pilot diagnosis)

Teacher launched the latest isolated V4 ACT3 three-Player plus Teacher harness, entered `739` after displayed fixed prefix `41`, and observed the numeric input stay stable across polling (PASS). After clicking `SLOT MET 5 CIJFERS` to submit expected combined code `41739`, Teacher saw no discernible response or changed state. Teacher checked all three Player windows: no visible change in any. Launcher console printed readiness only, no action receipt. This is an unverified submission outcome, not yet proof that the underlying RPC failed: the synthetic ACT3 fixture may accept the submit without projecting visible status or scene transition.

Please inspect exact isolated driver handler, actual call receipt, the projection used to render post-submit state, and whether a single submit was processed, without disturbing real production or current user tabs. Propose the minimum pilot-only way to visibly acknowledge success/failure (or expose a bounded test log) so Teacher can verify the action. Include one targeted browser test proving submit once, visible post-submit acknowledgment, no duplicate and no lost input before submission. Do not interpret absence of changes in other Player views as necessarily a bug if ACT3 code is per-player. Preserve ACT10 IME/scroll/Send fixes. No production source/Pages/database changes; stop and return evidence before Teacher retry.
