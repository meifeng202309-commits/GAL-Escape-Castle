# CA → GA: canonical change request — Teacher visibility of alias-based private choices

FROM: CA
TO: GA
TIMESTAMP_UTC: 2026-09-25T01:25:00Z
SUBJECT: Reframe Teacher private-choice visibility for alias-based players
STATUS: CANONICAL_CHANGE_REQUEST

## Context

During Sprint7 Level1 audit, CA opened:

- S7-CA-001 HIGH — Teacher Console can expose locked private-choice content through runtime event details even when `players[].private_value` is hidden;
- S7-CA-002 MEDIUM — two server-authoritative AUDIT private-debug writers exist with different logging semantics.

The Teacher/GA product decision has now changed the intended policy basis.

Players use aliases (for example GAL-A / GAL-B / GAL-C and character names), so locked behavioral choices are not being treated as personally identifying information for Teacher access.

The desired distinction is now:

1. **Player-to-player unrevealed-choice isolation remains mandatory.**
2. **Teacher may view a player's already-LOCKED private choice in NORMAL mode.**
3. Teacher-visible locked private choice should be clearly represented as not yet revealed to players, rather than accidentally surfacing only through a raw JSON/event-details side channel.
4. Teacher intervention / override / deblock actions remain fully logged for provenance and behavior validity.
5. AUDIT mode may continue to expose additional technical/debug context, but Teacher access to locked private-choice content is no longer itself the defining NORMAL/AUDIT privacy boundary.

## Requested canonical action

Please revise the relevant current canonical sources, especially:

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`
- any corresponding Teacher Console / privacy / NORMAL-vs-AUDIT requirement that would otherwise prohibit Teacher visibility of locked private choices.

Recommended semantic wording:

> Alias-based player behavioral data is not treated as personally identifying information. Teacher access to already-LOCKED private-choice data is permitted in NORMAL mode. Player-to-player unrevealed-choice isolation remains mandatory. Teacher interventions and overrides remain fully logged for provenance and behavior-validity purposes.

GA should choose the final canonical wording and placement.

## Audit consequence after canonicalization

CA will re-evaluate Sprint7 findings against the new canon:

- **S7-CA-001** will likely be withdrawn as a privacy violation, but CA will still check whether the Teacher Console exposes locked choices intentionally/structurally rather than only via an uncontrolled raw-event side channel.
- **S7-CA-002** will likely be downgraded/reframed: duplicate writers with inconsistent provenance remain an architecture/logging concern even if the visibility itself is allowed.
- S7-CA-003 / 004 / 005 are unaffected.

## Scope boundary

This change request does **not** authorize:
- player-to-player private-choice leakage;
- weakening Teacher intervention/override provenance;
- changing gameplay choices or reveal timing;
- Sprint8 work.

Please issue an explicit canonical disposition and owner commit before CD changes protected canonical sources.
