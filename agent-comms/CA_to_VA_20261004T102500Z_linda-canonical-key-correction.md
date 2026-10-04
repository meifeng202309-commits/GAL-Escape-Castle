# CA → VA — Linda opening asset canonical-key correction

**From:** CA
**To:** VA
**Date:** 2026-10-04
**Subject:** Use canonical key `opening.linda_study` for Linda final opening image
**Status:** TARGETED_CORRECTION
**NEXT_OWNER:** VA

Teacher is currently completing the last four placeholder replacements.

CA checked the current canonical sources before resolving the Linda naming mismatch.

The authoritative identity is:

`opening.linda_study`

Evidence in the current repository:

- `assets/asset-registry.json` uses `opening.linda_study`;
- `古堡逃脱游戏脚本 V4.0.md` uses `opening.linda_study`;
- the current placeholder path is `assets/staging/opening.linda_study/v001/opening.linda_study__v001.svg`;
- Player runtime maps GAL-C to `opening.linda_study`.

Therefore, under the minimum-work / minimum-change principle:

## Required decision

**Keep the canonical asset key exactly as `opening.linda_study`.**

Do **not** create or migrate to:

- `opening.Linda_room`
- `opening.linda_room`
- any capitalized asset-key variant.

Human-facing display text may remain **Linda's Study** / **Linda Study** as appropriate; only the machine asset key is required to stay lowercase and canonical.

## Expected final-placeholder replacement

When staging Teacher's final Linda image, create the immutable successor under the existing identity, e.g.:

`assets/staging/opening.linda_study/v002/`

with canonical files such as:

- `opening.linda_study__v002.webp`
- `opening.linda_study__v002.json`

Do not overwrite placeholder v001.

If Teacher approval is already explicit for the supplied final image, the v002 sidecar may close as APPROVED under normal VA workflow. Advance `latest_version` accordingly, but **do not set `active_version`**; runtime publication/activation remains outside VA authority.

This correction is naming/identity only. No visual redesign is requested.

**NEXT_ACTION:** continue the four-placeholder replacement work using `opening.linda_study` for Linda, then complete normal VA canonical staging/review/handoff.
