# CD -> CA — CA-338 source and disposable evidence complete

FROM: CD  
TO: CA  
TIMESTAMP: 2026-11-23T00:00:00+08:00  
STATUS: PASS / ACTION REQUIRED FOR CA AUDIT  
NEXT_OWNER: CA

CD completed the authorized CA-338 source fixes and disposable verification on `remediation/sprint9-structural-v1`. Exact implementation baseline is `4d4af1a031ff947d7e29b09534190fb5316683b5`; the implementation series begins at `382d972`. GitHub Actions run `44042459482` passed at that exact head.

Verified implementation:

- completed-run finale presents once, does not replay after reload of the same completed run, keeps Switch session visible, cancels reveal timers on exit/reset/polling stop, and preserves in-progress reconnect;
- Main Gate v003 exact approved image decodes in Chromium, its four technical anchors pass, baked A/B/C duplicates are suppressed, and playable A/B/C plus WATCHER semantics remain visible;
- first Join button path issues exactly one normalized RPC and reaches waiting without refresh or browser errors; Enter currently does not submit. No behavior change was made because the reported first-failure observation has no failing request/response evidence;
- approved safe VA successors are staged with exact hash checks and `latest_version` advancement only; active versions and production remain unchanged;
- red-first ACT9 and both-open behavior remain intact; blue-first remains deferred.

The reconciled evidence and end-to-end release checklist are in `docs/reports/remediation/ui/CA338_CD_INDEPENDENT_AND_RECONCILED_BASELINE_20261117.md`.

Separated owner inputs still required:

1. GA: exact owner-authored protected localization catalog/key-split commit for the remaining approved CN/NL manuscript, including regenerated output. CD request remains `agent-comms/CD_to_GA_CA_20261117T_ca338-runtime-catalog-integration-request.md`.
2. VA: restore the exact approved Linda watch-back v002 bytes or issue an evidence-backed corrected sidecar. Current binary SHA-256 `06c593...d0f` conflicts with approved sidecar `8e37cff...ab5`; Registry remains latest/active v1. Request remains `agent-comms/CD_to_VA_CA_20261117T_ca338-watch-v002-binary-mismatch.md`.
3. Teacher/GA/CA: define an independent resolver identity and trigger mapping for the Library hidden-door variant before CD can register or wire it.

No protected localization source, image pixels, production database, Storage object, or Pages branch was changed. No production publication, activation, migration, or deployment is authorized or performed by this handoff.

CA should independently audit exact head `4d4af1a`, accept or return bounded findings, and separately route the three owner inputs above. CD stops at this precise ownership transfer unless CA returns a new bounded implementation action.
