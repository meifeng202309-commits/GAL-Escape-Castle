FROM: VA
TO: CD
TIMESTAMP: 2026-10-04T11:23:00Z
SUBJECT: Current image status after final placeholder replacement
STATUS: ACTION_REQUIRED

# Current image status

VA has completed the current image-production and canonical-staging work up to the VA authority boundary.

## 1. Four former explicit placeholders

The four image identities that were still represented by explicit v001 placeholders now all have immutable Teacher-approved v002 successors:

| asset_key | latest candidate | review state | Registry active_version |
|---|---|---|---|
| `opening.gitte_room` | v002 | APPROVED | null |
| `opening.anna_room` | v002 | APPROVED | null |
| `opening.linda_study` | v002 | APPROVED | null |
| `ending.castle_exterior` | v002 | APPROVED | null |

Canonical staging paths are under:

`assets/staging/<asset_key>/v002/`

Each has a matched WebP binary and JSON sidecar.

The old v001 placeholder candidates remain preserved as immutable history and were not overwritten.

Anna v002 is the Teacher-requested corrected image with the candle unlit and warm candle illumination removed.

Linda uses the canonical machine identity `opening.linda_study`; no `opening.Linda_room` or `opening.linda_room` variant was created.

Related VA handoff:
`agent-comms/VA_to_CD_20261004T103658Z_four-placeholder-final-image-replacement-handoff.md`

Related staging commit:
`975f23cd3fe441d2c7cd1d1ad16d2d1744594c3e`

## 2. Current Registry runtime-selection state

The current Asset Registry contains 22 image assets.

At this moment:
- only `shared.library` has a non-null `active_version` (`active_version = 1`);
- the other 21 image assets have `active_version = null`;
- therefore APPROVED/staged image availability is not the same as runtime publication/activation closure.

This is consistent with the previously identified manual-acceptance image failure mode: the remaining problem is publication / ACTIVE selection / resolver-runtime closure, not missing VA production for the four former placeholders.

## 3. VA authority boundary

VA has not:
- published these assets to live runtime storage;
- changed runtime metadata;
- assigned ACTIVE versions;
- changed resolver/fallback behavior.

Those actions remain under CD / Asset Manager authority.

## REQUESTED ACTION

CD should now:
1. re-read the latest staged image candidates and sidecars;
2. run the Sprint9 image integrity/readiness validator;
3. publish approved runtime-required image candidates to runtime storage as required;
4. assign unique ACTIVE versions under Asset Manager authority;
5. verify resolver/fallback/HTTP loading and renderer visibility;
6. confirm the four former explicit placeholders no longer appear in runtime;
7. report any asset that cannot be activated, with the exact blocker and asset key.

NEXT_OWNER: CD
