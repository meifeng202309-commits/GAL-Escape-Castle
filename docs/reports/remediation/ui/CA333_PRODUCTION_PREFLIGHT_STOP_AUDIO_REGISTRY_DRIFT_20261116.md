# CA-333 production preflight — STOP on live audio registry drift

UTC checkpoint: 2026-11-16T12:23:08Z  
Disposition: STOP before first production write

## Authorized candidate

CA-333 authorized the bounded ACT3/ACT6/ACT9 release at reviewed packet head `0733685a86342192c2c4259405ba50af55034bc5`, subject to fresh production-baseline and no-human-game checks. The authorization requires only the two ACT9 variant activation semantics to change and requires unrelated registry semantic fields to remain unchanged.

## Passing preflight checks

- Supabase project `qdcbdcjobzytzhnhfwyn` is `ACTIVE_HEALTHY`, PostgreSQL `17.11.0.003`.
- Migration ledger ends at `20261114060753 teacher_trial_p1_room_reuse_075`; migrations 076–078 are not present.
- During the 30-minute fresh window: rooms `0`, runs `0`, events `0`. The database retains 594 legacy rows with `status='active'`, consistent with the project's established recent-activity gate and Teacher's explicit statement that no human game is running.
- Live Asset Manager projection has 28 rows and one projection digest, `7fdbd7ba29e65a30cd3ace1c704ef155cb4f9b404ccc6a363811a0993eafbe41`.
- Both ACT9 variant projection/candidate rows are absent, matching the accepted pre-sync starting state.
- `shared.great_hall` remains v002 ACTIVE at `game-assets/shared.great_hall/v002/shared.great_hall__v002.webp`, candidate SHA-256 `7a4770c7209e6ebb7452ec0080cd9c9d18f629a02207f532a07d821a2dffdb1d`, with all three approved anchors.
- Effective Asset Manager function owners, SECURITY DEFINER posture and ACLs match the reviewed 024/025 entry points.
- Health advisors returned no findings. Existing security advisor findings predate this release and were not changed.

## Blocking drift

The frozen complete 30-row registry payload sets all six audio keys to `active_version:null`. Production has all six keys ACTIVE and resolvable:

| Key | Live version | Storage path | Candidate SHA-256 |
|---|---:|---|---|
| `audio.gate_opening` | 2 | `game-assets/audio.gate_opening__v002.mp3` | `e2afea0715eb8df87fb20c5df3f77233957489be4fa40a5b29b34e92e7af3e55` |
| `audio.mechanism_clang` | 2 | `game-assets/audio.mechanism_clang__v002.mp3` | `598e52b667a712c100294de4b7d874362e18a27713b3318ee55112baee3df834` |
| `audio.old_alarm_bell` | 2 | `game-assets/audio.old_alarm_bell__v002.mp3` | `b2fb2793f3bf5cf731e20cf997b11ae9b45140f901dd03f91f9f4d894ca3b0bf` |
| `audio.snake_hiss_short` | 1 | `game-assets/audio.snake_hiss_short__v001.mp3` | `6e09da063bdec6da79a495ca96784ec7bbd9e0e8be0b2c40d38a64fff7aafdf6` |
| `audio.snakes_approaching` | 2 | `game-assets/audio.snakes_approaching__v002.mp3` | `f70052670176e50e631313e8c388de414a201e53b625358dfd282e232e99d8e8` |
| `audio.wet_scraping` | 1 | `game-assets/audio.wet_scraping__v001.mp3` | `fbe5707576b680ff01363f3ac4cee9c4f2c717b5f98f362b34ee1654e846c0f9` |

Because the effective 024 sync replaces the complete projection, executing the reviewed payload would disable all six production audio resolvers. That is an unrelated semantic change outside CA-333 and contradicts the packet's preservation gate. Correcting the payload to preserve these six active versions changes the approved full-array RPC apply/recovery digests and therefore requires CA review and a renewed exact decision.

## Mutation statement

STOP occurred before migration 076. No migration, registry sync, candidate import, Storage upload, Asset Manager review/publication/activation, Pages deployment, room creation, smoke fixture, cleanup, recovery, or other production write occurred.

NEXT_OWNER: CA to reconcile the canonical registry with the six live audio activations, issue exact revised full-array RPC digests and recovery payload, and renew or withhold the bounded production decision.
