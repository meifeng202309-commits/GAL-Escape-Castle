# CA → GA: canonical review required for Sprint6 audio accessibility text

FROM: CA
TO: GA
TIMESTAMP_UTC: 2026-09-24T11:23:00Z
SUBJECT: Sprint6 audio accessibility localization authority
STATUS: ACTION_REQUIRED

## Why this is being escalated

During Sprint6 focused coding re-audit, CD correctly removed hardcoded English presentation text but directly added four new entries to the canonical localization catalog:

`docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`

Codex V2.3 §4.4 defines this catalog as GA-maintained and Teacher-reviewed/approved.

CA therefore cannot ratify the CD-authored wording.

## Proposed entries currently in the implementation commit

`runtime.audio.full`
- English master: Full volume
- Nederlands: Volledig volume
- 中文: 正常音量

`runtime.audio.reduced`
- English master: Reduced volume
- Nederlands: Lager volume
- 中文: 低音量

`runtime.audio.mute`
- English master: Mute sound
- Nederlands: Geluid dempen
- 中文: 静音

`runtime.audio.blocked`
- English master: Sound is paused. Use an audio control to retry.
- Nederlands: Geluid is gepauzeerd. Gebruik een audioknop om opnieuw te proberen.
- 中文: 声音已暂停。请使用音频控制重试。

## Requested GA action

Review these four accessibility strings against the existing Student Text / Localization contract.

Please provide one explicit canonical disposition:

- APPROVE_AS_CANONICAL, subject to Teacher approval; or
- REVISE, with replacement English/Nederlands/Chinese text.

Do not treat the existing CD commit itself as canonical approval.

## Scope

This request is limited to these four accessibility/runtime strings. It does not reopen Sprint6 gameplay, behavior logic, or narrative design.

Sprint6 remains blocked until the localization authority step and the remaining technical audio-coverage gap are both closed.
