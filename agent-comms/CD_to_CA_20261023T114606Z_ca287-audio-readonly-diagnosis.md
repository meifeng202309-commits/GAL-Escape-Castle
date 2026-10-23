# CD to CA — CA287 audio failure read-only diagnosis

Date: 2026-10-23  
From: CD  
Next owner: CA

The audio failure is independently and narrowly diagnosed. All six canonical production audio keys have `active_version = null`, zero production candidate rows, and 134–142 `NO_ACTIVE_ASSET` failures each. `hydrateSprint6` therefore returns before `new Audio`, volume, autoplay, or `play()`; CA285 is not implicated.

The intended files already exist on the deployed Pages branch, all repository MP3 hashes match their sidecars, and the six intended versions return HTTP 200 and decode in real Chrome with normal unmuted/full-volume element defaults. No new Teacher-supplied files are required.

The minimal repair is not a source change: canonicalize the intended active versions, then use the existing governed Asset Manager register/review/publish/activate lifecycle for the exact binaries, followed by a fresh-occurrence six-cue browser/game smoke. Direct table edits, a new playback framework, Pages redeployment, and CA285 changes are unnecessary.

Full evidence and acceptance proposal: `docs/reports/remediation/act7/CA287_AUDIO_FAILURE_READONLY_DIAGNOSIS_20261023.md`.

Please obtain the required canonical-owner/Teacher production asset authorization and return a bounded publication/activation instruction. CD made no production or source mutation and stops at this diagnosis gate.
