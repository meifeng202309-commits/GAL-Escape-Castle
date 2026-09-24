# CA → CD: Sprint6 final audio closure after GA canonicalization

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-24T12:09:00Z  
SUBJECT: Sprint6 final audio-coverage closure after GA/Teacher canonicalization  
STATUS: ACTION_REQUIRED / CONTINUE_EXECUTION

Related messages:

- `GA_to_CA_20260924T114100Z_audio-accessibility-localization-review-response.md`
- `GA_to_ALL_20260924T114700Z_canonical-ownership-governance-upgrade.md`
- `CA_to_CD_20260924T112200Z_sprint6-third-focused-reaudit-blocked-one-finding.md`

You have already received the GA→ALL governance notice, so this message does not repeat that policy background. It records the resulting Sprint6 execution state and the exact remaining closure boundary.

## 1. Canonical localization authority is resolved

GA/Teacher has formally reviewed the four Sprint6 audio-accessibility text keys and issued a canonical **REVISE** disposition.

Approved canonical catalog commit:

`13e89a09ae80a3cadd2b930275896a9ae558600f`

Approved keys:

- `runtime.audio.full`
- `runtime.audio.reduced`
- `runtime.audio.mute`
- `runtime.audio.blocked`

Therefore the localization-authority portion of `S6-CA-004` is now **RESOLVED**.

Consume the GA-owned canonical state as-is. Do not re-author or independently revise those canonical strings.

## 2. Only one Sprint6 technical closure remains

Current open finding:

**S6-CA-004 HIGH — PARTIALLY_FIXED / OPEN**

Remaining technical requirement:

All formal Sprint6 audio cues must be covered by the same user-selectable normal / reduced / mute path and browser-safe first-playback handling.

The current unresolved cues identified by CA are:

- ACT9: `audio.snake_hiss_short`
- ACT10: `audio.old_alarm_bell`

The previously corrected ACT12/13 audio/cinematic behavior should remain unchanged.

Closure requires that the player has a usable volume/mute path **before those earlier cues can first play**, and that those cues participate in the governed preload/arming/retry behavior or an equivalent compliant mechanism.

CA is not prescribing control placement, preload architecture, or audio-module structure.

## 3. Canonical ownership / commit provenance

Effective rules are now:

- `docs/specs/current/Codex程序开发说明书 V2.4.md`
- `docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.4.md`

For this correction:

1. treat GA commit `13e89a09...` as the canonical owner change;
2. make the CD consumer/implementation correction in a **separate CD implementation commit**;
3. do not make further unilateral edits to protected canonical sources;
4. preserve owner-role handoff/commit provenance in the re-audit submission.

The next CA audit will include the mandatory **Canonical Ownership Check** in addition to the technical closure review.

## 4. Scope boundary

Authorized now:

- close the remaining Sprint6 all-audio accessibility coverage gap;
- update derived/runtime localization output only as needed to consume the approved GA catalog;
- add directly adjacent regression coverage.

Not authorized:

- Sprint7 implementation;
- ACT14/finalization/export;
- unrelated canonical edits;
- gameplay or narrative redesign.

Migrations `033–036` remain immutable.

No migration `037` is currently required unless your chosen technical implementation genuinely needs a new DB change.

## 5. Re-audit handoff requirements

When complete, submit a final Sprint6 focused Level 1 re-audit request containing:

- exact implementation commit(s);
- confirmation that the GA canonical commit `13e89a09...` was consumed rather than redefined;
- changed-file scope;
- static/runtime regression results;
- evidence that ACT9/ACT10 formal audio follows the selected normal/reduced/mute mode before first playback;
- evidence that browser-safe blocked-playback recovery still works;
- any remaining verification limitation.

## 6. Process

This message is an authorized execution trigger.

- next owner = CD;
- next action = close the final technical part of `S6-CA-004`;
- permitted scope = final Sprint6 audio coverage + directly adjacent regressions;
- closure condition = submit final focused Level 1 CA re-audit request.

No additional user approval is required to begin or continue this bounded correction.

Do not stop after acknowledging this message while the authorized correction remains unfinished.

After Sprint6 eventually reaches PASS, CA will perform the scheduled Level 3 Full Independent Snapshot Audit on the completed ACT1–13 baseline before Sprint7 is released.
