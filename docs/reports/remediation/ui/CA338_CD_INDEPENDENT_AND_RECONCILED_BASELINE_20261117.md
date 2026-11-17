# CA-338 CD production/manuscript/asset baseline

Status: IN PROGRESS  
Owner: CD  
Starting production: Player `8a1fd0b7fb91dd30bbcb34e3ddeb05af86c3219e`, migrations through 078

## Evidence-order limitation

CA-338 required CD to preserve a blind independent record before opening the two CA reports. During mail synchronization, the handoff and both linked reports were printed by one command, so that blind-order condition was not met. This document does not claim a blind audit. CD instead rebuilt each result from repository objects, production receipts, manifests, sidecars and executable tests, and labels facts not independently exercised.

## Reconciled findings

| Area | CD evidence | CA comparison | Disposition |
|---|---|---|---|
| Production text delta | The prior and CA-335 Player payload differ only by the frozen localization/app/CSS release; the 216-row manuscripts are not a completed catalog-key patch. Matrix dispositions include 132 repeated role rows with single-key candidates and 80 with composed keys. | Agrees with R1-R5: CA-335 integrated only the bounded subset, not the whole approved manuscript. | GA protected-source patch requested; CD will not invent composed-key boundaries. |
| Gitte map / Anna diary / ACT2 signal | Current callers still use the older ordered keys cited by the matrix; the page-level manuscripts contain longer approved prose. | Agrees with CA examples R2-R4. | Await exact GA key patch; caller order will then be verified rather than changed speculatively. |
| Completed-run replay | `s8_get_player_state` returns the old completed projection on reload; the only replay guard was an in-memory run id. The fixed full-screen finale covered the toolbar Switch session control and its timer survived `stopPolling`. | Agrees with CA-337 A. | Source fix implemented: persisted last-presented run, visible finale switch, timer cancellation, in-progress reconnect preserved. |
| Chrome first Join | No code path requires refresh; button click reads both fields and reports RPC failure. Enter does not submit. No first-failure request/response evidence exists. | Agrees with CA-337 B. | Diagnostic only; no behavior change without reproduction evidence. |
| Approved VA binaries | Exact sidecar/file validation passes for the ten-binary batch plus Castle Map v002 and Main Gate v003, except Linda watch back v002. | Adds a concrete binary-integrity finding beyond the CA table. | Safe candidates staged; version successors advance `latest_version` only. No activation/deployment authorized. |
| Linda watch back v002 | Sidecar expects `8e37cff45a269c87577ab339bb95d177b68c84a20c846617b8ab9370506ebab5`; committed 15,009-byte WebP is `06c593576ae9af6f9dff354def49c54e64fae7048b437913da8c0d95ac213d0f`. | CA listed v002 as approved but did not report this mismatch. | STOP for this identity; Registry remains latest/active v1; VA exact-byte repair requested. |
| Library hidden-door variant | Approved bytes exist only under a `shared.library` variant path. No independent runtime key/resolver contract exists. | Agrees with CA: no runtime variant binding. | Mapping decision required before registration; no guessed hard-coded path. |
| Main Gate v003 | Sidecar hash passes and requires validation of four anchors against changed composition; current runtime also renders station labels. | Agrees with CA duplicate/anchor risk. | Staged and latest-version ready; activation remains blocked on focused anchor/label browser evidence. |
| Great Hall variants | Red-first and both-open are active and bound to authoritative state; blue-first bytes are present but the Teacher-approved rule defers it. | Agrees. | Preserve red-first rule; do not register/activate blue-first. |

## Focused validation receipts

- GitHub Actions run `44037368534`: PASS. Real Chromium verified first finale presentation, a persistently visible finale Switch session control, cancellation of the active finale timer on exit, same-run reload without replay, and preservation of pre-run/in-progress reconnect behavior.
- Main Gate v003 source validation: approved image SHA-256 `f68ea8c1f86a1fa3345fbb2e7842fd34e8e66c1256d71030c993366ea5068de4` matches; four bounded v003 anchors were added as CD technical metadata. Because the artwork already contains A/B/C, runtime suppresses duplicate A/B/C overlay and legend text while retaining assignment highlighting, accessible/action controls, and the non-baked WATCHER label. Browser validation is pending the triggered Actions run.
- Chrome Join diagnostic is intentionally evidence-only: a mocked first click must issue one normalized `s1_join_player`, transition immediately to the waiting lifecycle without reload, and emit no browser errors; a separate Enter-key probe records the current no-submit behavior. No Join behavior change is authorized from the incomplete human observation alone.

## Current source baseline

- Imported the exact approved ten-WebP staging commit `e1fdccfa921aad403a95278bba213763e888b875` without activation.
- Imported the separate approved Castle Map v002 and Linda watch-back v002 histories. The latter was stopped at integrity validation and its registry successor was not accepted.
- Registry `latest_version` is advanced, while current `active_version` is preserved, for Castle Map, closure order, number-note front/back, Anna diary, library clue note and Main Gate. Publication/activation remains a separate release operation.
- No protected localization catalog, image pixels, production database, Storage object or Pages branch was changed by CA-338 source work.
