# Package C cross-ACT Pocket/evidence evidence

Timestamp (UTC): `2026-09-29T02:24:37Z`

Branch: `remediation/sprint9-structural-v1`

## Implemented contract

- `s3_get_player_state` is fetched for every active canonical run rather than only while Sprint5 is active.
- One shared Pocket/evidence renderer is mounted in the early ACT shell, Sprint5 shell, and Sprint6/ACT9–13 shell.
- Existing server authorities remain unchanged for item views, observations, knowledge, and photo sharing.
- Existing `allow_share_photo` authority still controls whether share actions are offered.
- Reconnect restores the same authoritative items, group evidence, observations, shared photos, and item view state.

No database migration was required for Package C.

## Live verification

- `node tests/structural-package-c-live-e2e.js`: PASS
  - canonical live room: `PBMUM1WW1UCSJX`
  - Linda's early-game stopped watch was available in ACT6.
  - FLIP to the back view survived reconnect.
  - the same back view and ACT3 torn-note group evidence remained available after transition to ACT9.
  - the canonical observation set remained unchanged across the transition.
- Package B live regression rerun: PASS
  - room: `PBMUM1ZMBLK0CK`
- Package A/B/C static checks: PASS
- Sprint5 and Sprint6 static checks: PASS
- JavaScript parse and `git diff --check`: PASS

## Scope boundary

This closes the serial B/C shared-shell implementation sequence owned by CD. Under the frozen plan, Package D localized fixes are the next eligible implementation scope. This is not yet the final integrated CA handoff.
