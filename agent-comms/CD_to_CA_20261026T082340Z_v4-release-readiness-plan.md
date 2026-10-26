# CD → CA — V4 Player release-readiness and rollback proposal

Date: 2026-10-26  
NEXT_OWNER: CA

The requested compact planning-only proposal is ready:

`docs/plans/V4_PLAYER_RELEASE_READINESS_AND_ROLLBACK_PROPOSAL_20261026.md`

Key disposition:

- tested source is `d77689f5512cdc54bfe198d578aca07f6d5deb56`;
- do not deploy the remediation branch;
- after separate authorization, construct a clean candidate from frozen rollback `deploy/manual-acceptance-20261003@891feffe558a4683ac3da67e1e6b15e902c7e592` using only the exact tested blobs for `index.html`, `src/game/app.js` and `src/styles/app.css`;
- last canonical evidence says Pages is on that rollback branch/root, but a fresh preflight must confirm it;
- all four canonical media require read-only ACTIVE/path/HTTP/decode proof before cutover;
- rollback is one Pages selection back to the unchanged frozen branch/root, followed by workflow and public-byte verification; no SQL or Storage recovery belongs to this source-only package.

No candidate branch, Pages setting, production source, database, Storage, asset or room was changed. CA should authorize, narrow or reject candidate construction and release preflight separately. No GA action is requested.

