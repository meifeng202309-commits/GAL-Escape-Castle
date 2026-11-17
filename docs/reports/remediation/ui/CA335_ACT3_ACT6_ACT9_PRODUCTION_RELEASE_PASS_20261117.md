# CA-335 ACT3 / ACT6 / ACT9 production release PASS

Date: 2026-11-17  
Owner: CD  
Disposition: PASS  
Next owner: CA

## Authorized baseline

CD executed only the CA-335 envelope from `agent-comms/CA_to_CD_20261116T132737Z_ca335-resume-approved-release-preserving-audio.md`: migrations 076-078, the reconciled 30-row registry projection, two ACT9 image activations, the frozen three-file Player release, and one disposable three-player smoke. Protected localization/narrative sources and approved WebP bytes were not changed. The six live audio candidates were neither republished nor reactivated.

## Database and Asset Manager

- Applied production migrations in order: `20261116135949 act3_library_discovery_gate_076`, `20261116135955 ga147_castle_voice_and_runtime_callers_077`, and `20261116140251 ca327_castle_voice_phase_guard_078`.
- Readback confirmed the affected RPCs remain owned by `postgres`, `SECURITY DEFINER`, with the accepted execute ACLs, and the new `s3b_player_progress` columns exist.
- Synchronized all 30 registry rows with approved RPC digest `e6377e86a2c17bca5b8c6ed1df419f66180709cff3ae910599b6ff3e68f7a5bc`; post-readback returned 30 rows and one exact digest.
- Published and singly activated only `shared.great_hall.red_first` v1 and `shared.great_hall.both_open` v1. Their public Storage objects matched SHA-256 `af463e9ae529d5f7de8935f7e7794b4879cd2f15635d9617139fb52fb7ac9936` and `338bbed29fd64537741615e76f5ddd52f688263ae23c734de3ffb63b42381284`.
- Base `shared.great_hall` v2 and all six live audio key/version/path/hash identities remained unchanged. The temporary reviewer and temporary publication room were removed; readback returned zero for each.

## Player Pages

The deploy branch advanced from `6e08aeacef397ea2b6c5020f8c594c5181a2d854` to exact commit `8a1fd0b7fb91dd30bbcb34e3ddeb05af86c3219e`, replacing only the three authorized Player files. Pages run `43998652561` completed successfully. Canonical public LF hashes matched the frozen contract:

- `src/game/app.js`: `551c0592cca985a04566022230335ab11d6ad5354e0b1e303e778a33abd53676`
- `src/styles/app.css`: `09b97f7242e0223f23f5b78502856c0354a9f1faea4a1aae4ead202580fd2637`
- `src/content/localization.generated.js`: `a0c2e9ce3c22e80de8541e5377fcb30081d864a5a990ffd047a9e1e2f00589ab`

## Bounded smoke and cleanup

Fresh production activity preflight at `2026-11-17T02:15:28Z` returned `rooms_15m=0` and `runs_15m=0`. Disposable room `G147MWK28S6II6`, run `8356d984-7144-4a2c-8e8e-e1a9b459ac71` then passed the genuine three-player lifecycle:

- ACT3 code `41739`, durable `library_discovery/box_opened`, all three acknowledgements, and the supported ACT4/ACT5 transition;
- ACT6 per-role Voice key, pre-ack vote rejection, retry-safe acknowledgement, reconnect projection, three votes, answer, and supported advance;
- ACT9 base, tie, blue/black no-reaction retry with `act09.022`, red-first, both-open, and three-player reconnect persistence.

The existing ACT3, GA147, and ACT9 static gates passed. The public Player entry rendered enabled Room code, Join code, and Join controls with zero browser warnings/errors. Existing local Playwright browser tests could not start because this machine has no `playwright` module; this is not used as PASS evidence and does not displace the previously accepted CA-328 real-browser run. Public variant objects and frozen hashes were independently rechecked, and no `asset_load_failed` event exists for either variant in the smoke window.

Cleanup targeted only the exact generated room/run identities. Final production readback returned `rooms=0`, `runs=0`, and `events=0` for the fixture.

## Closure

CA-335 completed without a recovery action. Production implementation baseline is migrations through 078, the reconciled 30-row projection with both ACT9 variants ACTIVE v1 and six preserved audio activations, and Player Pages head `8a1fd0b7fb91dd30bbcb34e3ddeb05af86c3219e`. Human-trial resumption remains CA/Teacher disposition.
