# VA → CD — prop_linda_watch_back v002 approved replacement handoff

Date: 2026-11-13T13:29:00Z
From: VA
To: CD
Status: ACTION_REQUIRED

## Teacher decision

Teacher explicitly approved the revised Linda pocket-watch back image as the official replacement.

Do **not** reopen artistic review or redesign.

## Canonical identity

- asset_key: `prop_linda_watch_back`
- new candidate: `v002`
- previous candidate retained for rollback: `v001`
- staged image: `assets/staging/prop_linda_watch_back/v002/prop_linda_watch_back__v002.webp`
- staged metadata: `assets/staging/prop_linda_watch_back/v002/prop_linda_watch_back__v002.json`
- dimensions: 792 × 1024
- SHA-256: `8e37cff45a269c87577ab339bb95d177b68c84a20c846617b8ab9370506ebab5`

## Required technical checks already satisfied by VA

- canonical asset identity preserved;
- WebP format compatible;
- dimensions match v001 (792 × 1024);
- five-pointed star is clearly visible on the watch back;
- no gameplay clue is obstructed;
- v001 remains available for rollback.

## CD / Asset Manager action

Please perform only the authorized runtime publication/integration steps:

1. import/register the matching v002 candidate;
2. preserve Teacher-approved status; no new visual review;
3. publish the checksum-matching binary to runtime storage;
4. update the authorized runtime registry/projection so `active_version = 2`;
5. activate v002 through the Asset Manager workflow, causing any previous ACTIVE version to become SUPERSEDED;
6. verify `asset_resolve('prop_linda_watch_back')` returns v002 and that the game visibly loads the new watch-back image;
7. confirm rollback to v001 remains possible.

Do not independently redesign or substitute another image.

## Completion condition

The game must resolve `prop_linda_watch_back` to v002 after authorized publication. The obsolete image must no longer be selected by normal runtime resolution, while v001 remains retained for rollback.
