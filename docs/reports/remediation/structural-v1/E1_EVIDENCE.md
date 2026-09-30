# E1 — full deterministic browser regression evidence

## Checkpoint

- Branch: `remediation/sprint9-structural-v1`
- Exact tested implementation SHA: `97f5ed362c58defb45edf19c18319417cb70b93f`
- Browser harness: `tests/remediation-e1-browser.mjs`
- Canonical run: `20260930035214`
- Evidence JSON: `e1/20260930035214_E1.json`
- Browser: system Chrome through Playwright, headless, QUIC disabled for deterministic HTTPS asset transport

## Browser-level result

E1 passed the complete frozen-plan coverage on 2026-09-30:

1. Teacher created room `E1F6CAC7`; GAL-A, GAL-B, and GAL-C joined in staggered order and all remained in the pre-run waiting state.
2. Formal start exposed three distinct, role-private ACT1 surfaces.
3. ACT4 rendered the canonical Castle Map / Library comparison, the ACTIVE `library_unknown_door` marker, Linda-only recognition, a two-player accepted/waiting state, and the exact server-projected three-role reveal.
4. ACT5 terminal handoff, first-player ACT6 entry waiting, all-player DiscussionRoom start, and the early Pocket/evidence shell passed in room `PDMUNKKDLWR48K`.
5. ACT9 DiscussionRoom and representative ACT9, ACT10, ACT11, and ACT12 accepted/locked waiting barriers passed.
6. The Main Gate remained usable through the explicit placeholder-first path: the scene carried `trial-asset-placeholder`, while the localized station legend remained visible and readable.
7. A stale Sprint6 status sentinel was cleared by the next successful authoritative render.
8. ACT14 finalization returned HTTP 200; the canonical end reveal and completed-run reconnect both passed in room `S5MUNKLC5UVR2H`.

The evidence directory contains 15 full-page screenshots covering these states.

## Console and network evidence

- Material browser errors: `0`.
- Supabase RPC responses observed: `1007`.
- RPC status distribution: `200 = 1007`; no RPC failure was present in the canonical run.
- The sole recorded browser decoration error is the local static server's missing `favicon.ico` (HTTP 404). It does not affect an application module, canonical media, or RPC.
- Canonical `shared.library` media loaded successfully for all three ACT4 player contexts.

## Final regression matrix

- Structural Package A/B/C/D static checks — PASS.
- Sprint4 and Sprint6 static checks — PASS.
- `node --check src/game/app.js` — PASS.
- `node --check tests/remediation-e1-browser.mjs` — PASS.
- `git diff --check` — PASS.

## Explicit external media state

`shared.main_gate` remains `NO_ACTIVE_ASSET` in the live Asset Manager projection. The exact Teacher-approved v002 repository binary and sidecar remain available, but this execution environment has no existing publication credential. E1 therefore proves the approved placeholder-first trial path; it does not claim publication or ACTIVE promotion.
