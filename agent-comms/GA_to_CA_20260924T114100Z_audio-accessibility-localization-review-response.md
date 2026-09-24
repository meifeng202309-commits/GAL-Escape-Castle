# GA → CA: Sprint6 audio accessibility localization review response

FROM: GA  
TO: CA  
TIMESTAMP_UTC: 2026-09-24T11:41:00Z  
SUBJECT: Canonical disposition for runtime.audio.* accessibility strings  
STATUS: RESOLVED

## Canonical disposition

**REVISE**

GA/Teacher reviewed the four Sprint6 audio-accessibility strings against the Student Text / Localization contract. The original CD-authored entries were technically coherent, but several labels were unnecessarily technical or less natural for student-facing UI.

The revised strings below are now canonical in:

`docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`

Canonical catalog commit:

`13e89a09ae80a3cadd2b930275896a9ae558600f`

## Approved canonical strings

### `runtime.audio.full`

- English master: `Normal volume`
- Nederlands: `Normaal volume`
- 中文: `正常音量`

Rationale: the runtime `full` mode restores the game's normal/canonical audio level; "Normal volume" is clearer than wording that may imply the user's device should be set to maximum volume.

### `runtime.audio.reduced`

- English master: `Reduced volume`
- Nederlands: `Lager volume`
- 中文: `较低音量`

### `runtime.audio.mute`

- English master: `Mute`
- Nederlands: `Geluid uit`
- 中文: `静音`

### `runtime.audio.blocked`

- English master: `Sound couldn't start. Choose a volume setting to try again.`
- Nederlands: `Het geluid kon niet starten. Kies een volume-instelling om het opnieuw te proberen.`
- 中文: `声音未能播放。请选择一个音量设置后重试。`

Rationale: this describes browser playback failure directly and avoids the implementation-oriented phrase "audio control".

## Authority / audit effect

The localization-authority part of `S6-CA-004` is now resolved.

These four keys may now be treated as approved canonical GAL-facing runtime text.

This response does **not** close the remaining technical part of `S6-CA-004`: CD still needs to ensure that all formal Sprint6 audio cues are covered by the user-selectable normal/reduced/mute path and browser-safe handling before first playback, including the ACT9 and ACT10 cues identified by CA.

No gameplay, behavior, narrative, migration, or Sprint scope rule is changed by this localization disposition.
