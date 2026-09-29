# Package D — localized correction evidence

## Checkpoint

- Branch: `remediation/sprint9-structural-v1`
- D-COMPLETE implementation SHA: `394238f61850e45cbdb8a1c4896cf64f965acd00`
- Frozen plan: `docs/plans/CD_STRUCTURAL_REMEDIATION_EXECUTION_PLAN_V0.1.md`
- Scope: D1 / PFC-004, D2 / PFC-006, D3 / PFC-007

## Implemented outcomes

### D1 / PFC-004

- Every successful Sprint6 render clears stale status/error content before presenting the new canonical state.
- Audio-blocked status is tagged as Sprint6-owned and is cleared immediately when the queued audio retry succeeds.

### D2 / PFC-006

- ACT4 now renders the canonical two-column Castle Map / unknown Library door comparison.
- The map route, not-on-map warning, and Linda-only Silver Key recognition use existing localization keys.
- The unknown-door marker consumes `library_unknown_door` from resolved `shared.library` metadata.
- ACT11/12 Main Gate overlays consume `main_gate_station_A`, `main_gate_station_B`, `main_gate_station_C`, and `main_gate_watcher_corridor` according to the canonical branch-specific role set.
- A localized station legend remains readable when the approved Main Gate binary is not ACTIVE, preserving the placeholder-first trial path.

### D3 / PFC-007

- The client renders exactly the server-projected `act4_revealed` array only after it contains all three positions.
- Choice labels reuse the canonical `ROUTE_CHOICES` mapping. No reveal state or authority is derived client-side.

## Verification

- `node tests/structural-package-d-static-check.js` — PASS
- `node tests/structural-package-d-live-e2e.js` — PASS
  - room `PDMUMMXYR2JOS6`
  - ACT4 reveal barrier and exact role/choice identity PASS
  - ACTIVE Library `library_unknown_door` projection PASS
  - Main Gate runtime mode recorded as `PLACEHOLDER_NO_ACTIVE`
- `node tests/structural-package-b-live-e2e.js` — PASS
  - room `PBMUMN5K3HJUV8`
- `node tests/structural-package-c-live-e2e.js` — PASS
  - room `PBMUMN7NU9OMBA`
- Structural Package A/B/C/D static checks — PASS
- Sprint4 and Sprint6 static checks — PASS
- `node --check src/game/app.js` — PASS
- `git diff --check` — PASS

## External media state kept explicit

`asset_resolve('shared.main_gate')` currently returns typed `NO_ACTIVE_ASSET`. The database has no `shared.main_gate` candidate row, while the repository contains the exact Teacher-approved v002 binary and complete sidecar. The current execution environment has no existing `SUPABASE_SERVICE_ROLE_KEY` or `ASSET_MANAGER_REVIEWER_TOKEN`.

CD did not bypass Asset Manager controls through direct table mutation or create a replacement reviewer credential. The runtime therefore remains trial-safe through the governed placeholder path; publication/ACTIVE promotion remains a separately visible external-state item rather than a false PASS.

## Next gate

Proceed to E1 full deterministic browser regression on this D-COMPLETE implementation checkpoint, preserving browser-visible placeholder state and the exact tested SHA.
