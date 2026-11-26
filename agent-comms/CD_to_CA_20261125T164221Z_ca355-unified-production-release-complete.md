# CD → CA — CA-355 unified CA-338 production release complete

FROM: CD — Coding Agent  
TO: CA — Code Audit Agent  
TIMESTAMP: 2026-11-25T16:42:21Z  
STATUS: **DEPLOYMENT COMPLETE / CA RELEASE RECONCILIATION REQUIRED**  
NEXT_OWNER: **CA**

Teacher confirmed no human game was active; unresolved old `active` rows were retained as historical records and were not deleted.

## Production result

- Applied migration `ca347_runtime_consumer_integration_079`; prior production baseline was through 078.
- Published and activated the nine CA-355 images. All nine public Storage downloads exactly matched their approved local SHA-256 values.
- Registry readback: 31 rows, one digest `1b2d1630a078d8c629a2a0068a0244ebed1508b29c8185db2d7e0b5b07c977ed`.
- New active outcomes: six v002 props, `shared.main_gate` v003, `shared.library.hidden_door_ajar` v001, and `prop_linda_watch_back` v003.
- Preserved `shared.library` v002, ACT9 red-first/both-open v001, Linda watch face v001, and all six prior audio key/version/path/hash identities.
- Temporary reviewer and publication room cleanup both read back zero.
- Saved Pages rollback ref `safety/pages-before-ca355-20261126` at prior head `8a1fd0b7fb91dd30bbcb34e3ddeb05af86c3219e`.
- Published the exact four-file Pages payload. Release commit `1e87b55239bcd480451d2fa0388b2aa059010220`; its first Pages deploy built successfully but the GitHub deploy step failed during a reported platform incident. One empty-tree retry commit `d530f830186572e1cc623ce3ac71f8e5bc53af00` succeeded in Pages run `45654674163`.
- Canonical public LF hashes exactly equal the raw Git blobs at `d530f83`: app `a84a4e2e...`, CSS `f76beb54...`, localization `c46d90bf...`, Runtime Page text `f1b4a017...`. The four reviewed Windows checkout hashes remain those frozen in CA-343.

## Live verification

- Existing Chrome rendered the canonical public Player Join controls.
- One unique production smoke room admitted actual `GAL-A`, `GAL-B`, and `GAL-C`; all three read active at `act1_wake_up` under run `ae9fc287-393c-4612-af6f-efc4153f7650`.
- Exact fixture cleanup read back `rooms=0`, `runs=0`, `players=0`.
- Registry/candidate resolver readback returned all nine exact active versions, paths and SHA values; the nine public objects downloaded byte-for-byte correctly.
- Automated bulk Chrome image-decode output was inconclusive and is recorded **NOT_RUN**, not PASS. Visual confirmation of original Library before Inspect First, ajar after Inspect First, Main Gate v003, ACT9, and completed-session switch/replay remains for CA/next human public-browser pass. Previously accepted candidate browser evidence is unchanged, but was not misreported as a fresh live production visual pass.

No unrelated production mutation or historical cleanup was performed. Ownership transfers to CA for release reconciliation and disposition of the explicitly named live-visual remainder.

