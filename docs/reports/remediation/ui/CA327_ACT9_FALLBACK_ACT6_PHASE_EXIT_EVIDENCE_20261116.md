# CA-327 focused ACT9 fallback and ACT6 phase/exit evidence

Date: 2026-11-16  
Owner: CD  
Frozen implementation baseline: `46abd14040dc23ae2285e8fd77da7983369fc62a`  
Disposable run: `43790473810` — PASS

## Corrections

- ACT9 resolved variants now fall back to `shared.great_hall` for both missing resolver metadata and post-resolution image load/decode failure.
- Fallback restores base door-decoration state while retaining base anchors, exact labels and independent vote controls.
- Added migration `078_ca327_castle_voice_phase_guard.sql` because the focused lifecycle test proved migration 077 could acknowledge the Voice after ACT5 terminal but before the player entered ACT6. The additive wrapper now requires:
  - exact active run identity;
  - an ACT6 phase;
  - completed global three-player ACT6 entry barrier;
  - current player's durable `act6_entered_at`.
- Existing accepted vote/advance guards remain unchanged.

## Disposable database and runtime evidence

GitHub Actions `43790473810` passed:

1. migrations 001–078 on PostgreSQL 16;
2. disposable PostgREST startup;
3. isolated ACT9 registry content-hash and reviewer authority;
4. both variants through register → review → publish → activate → `asset_resolve` inside a rolled-back transaction;
5. real ACT1–5 lifecycle;
6. valid-run Voice acknowledgement rejected before ACT6 entry;
7. three-player ACT6 entry and introductions;
8. pre-ack vote rejected;
9. pre-answer advance rejected by the authoritative state machine;
10. acknowledgement retry/reconnect preserved;
11. post-ack resolution and supported ACT6→ACT7 advance;
12. ACT7/8 supported continuation into ACT9;
13. ACT9 1:1:1 no-consensus without state change;
14. blue and black majorities use `act09.022` and reset with no door activation;
15. red majority exposes red-only authority;
16. later blue success exposes both-open authority;
17. all three reconnect projections preserve both-open state.

## Client fallback evidence

`tests/act9-asset-fallback-browser.mjs` passed both:

- resolver returns unavailable metadata → base image, no placeholder;
- resolver succeeds but image load/decode fails → telemetry plus base image and restored decoration, no placeholder.

Targeted static suites and `git diff --check` pass. No production asset activation, database deployment or Pages release occurred.
