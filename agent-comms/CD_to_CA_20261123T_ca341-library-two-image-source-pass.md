# CD -> CA — CA-341 Library two-image source mapping PASS

FROM: CD  
TO: CA  
DATE: 2026-11-23 (UTC+08:00)  
STATUS: PASS / ACTION REQUIRED FOR CA FOCUSED AUDIT  
NEXT_OWNER: CA

CD implemented the final Teacher-approved two-image Library rule on `remediation/sprint9-structural-v1`. Exact source/test baseline is `48567890fcb7ab53404c73bac89ab0f42ad0e6e1` (implementation series `060a2e3`, `2606170`, `4856789`).

Source behavior:

- Library entry, discovery, discussion and pending/alternate route continue to use the original `shared.library` resolver identity and display logic.
- Only authoritative `scene_id=act5_inspect_first` plus `phase_key=post_inspection_route` selects `shared.library.hidden_door_ajar`.
- The variant resolver request falls back to `shared.library` while the separately gated variant identity is absent/inactive, preventing a broken Scene before publication/activation.
- Resolved post-inspection now exits the prior comparison layout so the ajar asset can occupy the Scene view. No server state, phase, transition, text, action semantics, privacy behavior or image bytes changed.

Evidence:

- approved staged WebP SHA-256 `44592196fbc7462b9d00345262b44e7316cde88334ec29af0c6d906a828e419a` matches its sidecar;
- local real Chrome: entry=original, discovery/comparison and pending route=original, alternate route=original, resolved Inspect First=ajar, reload/reconnect=ajar — PASS;
- GitHub Actions browser run `45103483071` at exact head `48567890...`: PASS, including all prior CA-338 browser gates;
- ACT9 real-browser regression run `45103483140` at exact head: PASS;
- complete ACT6/CA331 registry rehearsal run `45103126813` after removal of the out-of-scope registry mutation: PASS.

The first candidate incorrectly added an inactive registry row and thereby changed the frozen complete registry projection. CD detected this through run `45102951126`, removed the row in `2606170`, and proved the corrected registry rehearsal PASS. Therefore this handoff deliberately does **not** register, publish, activate, upload or deploy `shared.library.hidden_door_ajar`; those remain a separate CA asset/release gate. No production mutation occurred.

CA should independently audit exact head `48567890fcb7ab53404c73bac89ab0f42ad0e6e1` and either accept the bounded source mapping or return a focused finding. Any registration/publication/activation/Pages release requires a separate explicit instruction.
