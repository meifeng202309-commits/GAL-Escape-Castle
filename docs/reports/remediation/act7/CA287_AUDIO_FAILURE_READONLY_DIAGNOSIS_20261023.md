# CA287 audio failure read-only diagnosis

Date: 2026-10-23  
Owner: CD  
Authorization: `agent-comms/CA_to_CD_20261023T100000Z_audio-minimal-diagnosis.md`

## Result

The reported inaudible cues have one production-proven common cause: none of the six canonical audio assets has an ACTIVE production asset. The client never reaches URL construction, `new Audio(...)`, volume assignment, or `play()` for those cues. This is independent of the accepted CA285 code/database release.

No source, canonical registry, database, storage, Pages branch, or production gameplay state was changed.

## Production evidence

Read-only queries against intended project `qdcbdcjobzytzhnhfwyn` show for every canonical audio key:

| Asset key | Latest | Active | Production candidates | `NO_ACTIVE_ASSET` events |
|---|---:|---:|---:|---:|
| `audio.gate_opening` | 2 | null | 0 | 136 |
| `audio.mechanism_clang` | 2 | null | 0 | 134 |
| `audio.old_alarm_bell` | 2 | null | 0 | 142 |
| `audio.snake_hiss_short` | 1 | null | 0 | 134 |
| `audio.snakes_approaching` | 2 | null | 0 | 134 |
| `audio.wet_scraping` | 1 | null | 0 | 140 |

The most recent production event samples explicitly record `asset_load_failed`, version `null`, reason `NO_ACTIVE_ASSET`. This agrees with the earlier independent authority audit, which recorded all six audio ACTIVE rows as absent.

The deployed client behavior is deterministic:

1. `hydrateSprint6` calls `asset_resolve` for the authoritative `feedback_audio_key`.
2. If resolution is not `ok`, it marks that durable occurrence `stopped` and returns.
3. Therefore `playSprint6Audio` is not called. Browser autoplay policy, volume mode, the fade-in, polling/rerender, and network access to a resolved storage URL cannot be causal for these observed occurrences.

Repeated polling/arming explains multiple `asset_load_failed` telemetry rows, but it does not create the silence. A previously marked `stopped` occurrence is intentionally not replayed after later activation; validation must use a fresh audio occurrence/new trial.

## Affected canonical scenes

All six runtime-required cues are affected:

- Great Hall wrong action: `audio.snake_hiss_short`.
- ACT10 Take Golden Key alarm payoff: `audio.old_alarm_bell`.
- ACT12 pressure cinematic start: `audio.wet_scraping`.
- ACT12 pre-blackout danger approach: `audio.snakes_approaching`.
- ACT12 final mechanism payoff: `audio.mechanism_clang`.
- ACT12 gate opening immediately after clang: `audio.gate_opening`.

This matches the Teacher report of silence in more than one scene and rules out a single-scene trigger defect as the primary cause.

## Existing files and browser reachability

No new user-supplied assets are required. The exact canonical binaries already exist and are tracked on the deployed Pages branch:

- latest v2 for alarm bell, approaching snakes, mechanism clang, and gate opening;
- canonical v1 for short hiss and wet scraping.

All ten versioned MP3s in the repository match their sidecar SHA-256 values. Read-only HEAD checks against the current production Pages origin returned HTTP 200 with `audio/mp3` and the exact byte lengths for the six intended versions.

A real headless Chrome metadata smoke loaded and decoded all six intended production-Pages files with `muted=false`, `volume=1`, and durations of approximately 4.911, 14.864, 1.411, 4.310, 0.850, and 3.400 seconds respectively. This distinguishes valid browser-decodable files from the missing ACTIVE lifecycle state; it does not claim acoustic loudness from a headless environment. Sidecar measurements put five cues near normal peaks and `snakes_approaching` near -6.17 dBFS, so quiet mastering is not a credible explanation for total silence across all scenes.

## Minimal repair and acceptance proposal

No playback framework or CA285 source change is indicated. The narrow repair is an authorized asset-lifecycle publication:

1. Canonical asset owner sets the six intended `active_version` values (v2/v2/v2/v1/v2/v1 as listed above) without altering keys or scene contracts.
2. Under the existing Asset Manager authority workflow, register exact checksum-matching candidates, publish the existing binaries to the approved public storage paths, and activate them. Do not bypass review/activation gates with direct table edits.
3. Verify each `asset_resolve` returns `ok`, the intended version/path/hash and browser HTTP/decode success.
4. Use a fresh guarded run/occurrence to test explicit user-activation playback at Full volume for all six triggers; verify no console/network/media errors, exact-once consumption/reconnect suppression, the wet-scraping fade, and the clang-to-gate sequence.
5. Retain the present CA285 Pages/database baselines. Roll back only the six asset activations if an asset gate fails.

This is not a source-only change and production asset mutation was not authorized by CA287. CA should obtain the required canonical-owner/Teacher release authorization and issue a bounded publication/activation instruction before CD acts.

Disposition: **diagnosis PASS; production repair authorization required.**
