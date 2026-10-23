# CA287 six-audio governed activation — PASS

Date: 2026-10-23  
Owner: CD  
Authorization: `agent-comms/CA_to_CD_20261023T123000Z_ca287-six-audio-publication-authorized.md`

## Result

All six Teacher-approved canonical audio binaries are published in the production `game-assets` bucket and ACTIVE through the existing Asset Manager lifecycle. Resolver, public HTTP/hash, Chrome explicit-user-activation playback, durable occurrence consumption and reconnect suppression checks passed. No source, migration, Pages, CA285 database contract, or unrelated asset was changed.

## Authority and preflight

- GA's effective ownership synchronization assigns the six bounded audio candidates to VA production/Teacher review and retains publication/ACTIVE/runtime authority with CD.
- VA Action Log and formal VA-to-CD handoffs prove Teacher approval of the exact target versions. The repaired `audio.mechanism_clang` v2 binary matches its already-approved sidecar.
- All six binary SHA-256 values matched their sidecars before publication.
- The exact CA-authorized versions are v2 gate opening, v2 mechanism clang, v2 old alarm bell, v1 short snake hiss, v2 snakes approaching, and v1 wet scraping.

## Governed publication and activation

The Supabase Dashboard uploaded the six exact existing MP3 files to public bucket `game-assets`. CD then used only the existing Asset Manager functions for registry sync, candidate import, submit-for-review, review, mark-published and single-asset group activation. A temporary reviewer identity and disposable, unstarted Teacher room were used exactly as in the repository's established WP-R4A workflow; the reviewer row was removed after activation and read back as zero remaining.

| Asset | Version | Production asset ID | Public storage path | SHA-256 |
|---|---:|---|---|---|
| `audio.gate_opening` | 2 | `a80a5faf-f26d-445e-a990-3714fbc0970a` | `game-assets/audio.gate_opening__v002.mp3` | `e2afea0715eb8df87fb20c5df3f77233957489be4fa40a5b29b34e92e7af3e55` |
| `audio.mechanism_clang` | 2 | `338e46b5-d5a8-4f5e-8b51-74ca16f83a12` | `game-assets/audio.mechanism_clang__v002.mp3` | `598e52b667a712c100294de4b7d874362e18a27713b3318ee55112baee3df834` |
| `audio.old_alarm_bell` | 2 | `500cebb4-1b06-4108-934e-213e9a551ff2` | `game-assets/audio.old_alarm_bell__v002.mp3` | `b2fb2793f3bf5cf731e20cf997b11ae9b45140f901dd03f91f9f4d894ca3b0bf` |
| `audio.snake_hiss_short` | 1 | `06b8356a-acf4-4f57-afe9-e2d8137a2db2` | `game-assets/audio.snake_hiss_short__v001.mp3` | `6e09da063bdec6da79a495ca96784ec7bbd9e0e8be0b2c40d38a64fff7aafdf6` |
| `audio.snakes_approaching` | 2 | `e10f032c-32a0-474b-8bdb-7c11f7d4a13d` | `game-assets/audio.snakes_approaching__v002.mp3` | `f70052670176e50e631313e8c388de414a201e53b625358dfd282e232e99d8e8` |
| `audio.wet_scraping` | 1 | `c332f784-85f6-4607-ada9-0bbb011545d9` | `game-assets/audio.wet_scraping__v001.mp3` | `fbe5707576b680ff01363f3ac4cee9c4f2c717b5f98f362b34ee1654e846c0f9` |

Each candidate is `ACTIVE`, registry `active_version` equals the intended version, `asset_resolve` returns `ok` with the exact path/version/MIME/duration, and each asset has exactly one new `activated` event. Since activation, all six have zero new `NO_ACTIVE_ASSET` events.

## Validation

- Public Supabase URLs returned the exact expected byte lengths and SHA-256 values for all six objects.
- Real Chrome, launched with user-gesture-required autoplay policy, explicitly clicked one control per cue. All six `Audio.play()` promises resolved, `currentTime` advanced, `readyState=4`, `volume=1`, and `muted=false`. Observed decoded durations match metadata (approximately 4.310, 1.411, 4.911, 0.850, 14.864 and 3.400 seconds).
- `tests/level3-closure-static-check.js` PASS: durable occurrence, consumption and reconnect suppression contracts remain present.
- `tests/sprint6-static-check.js` PASS: wet-scraping 1.5-second fade, cue preload/trigger coverage, volume controls and cinematic behavior remain present; canonical clang then gate cue ordering is unchanged.
- Existing CA285 synthetic run `c2856ada-cc2e-4000-8000-000000000001` exposed durable alarm occurrence `d2905750-d72c-43aa-ae5f-00b6794afe71`. After actual activation, its player state resolved the alarm cue; marking it ended produced exactly one consumption row. Two consecutive polls and reconnect readback all returned `audio_consumed=true`, proving replay suppression.

The legacy full Level 3 live script was also attempted against a disposable room. Its old `s2_start_run` call was correctly denied by current ACL; an in-memory mapping to `s9_start_formal_game` then encountered current formal-start initialization and NORMAL Teacher-gate differences before reaching audio. No ACL was relaxed and no real room was touched. The accepted static suites plus current synthetic occurrence were used instead of rewriting or weakening the production contract.

## Limitations and recovery

- Browser automation proves browser decode and playback progression but cannot prove subjective audibility or classroom speaker loudness. Teacher should perform one short human Full-volume listening pass across the six canonical scenes.
- Per CA instruction, the repository canonical file was not edited; its audio `active_version` fields remain source-null while the authorized production projection is ACTIVE. CA/canonical owner should decide whether a separate source reconciliation is required rather than having CD violate the no-source-edit boundary.
- Each audio is an independent activation unit. If a later listening gate fails, restore only the affected asset through the governed Asset Manager workflow; do not roll back CA285, Pages, other audio assets or unrelated images.

Disposition: **production activation and objective playback gates PASS; subjective listening remains a Teacher acceptance limit.**
