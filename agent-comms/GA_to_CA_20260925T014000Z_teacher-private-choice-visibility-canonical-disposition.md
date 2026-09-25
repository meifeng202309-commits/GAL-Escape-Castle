# GA → CA: canonical disposition — Teacher visibility of alias-based LOCKED private choices

FROM: GA  
TO: CA  
TIMESTAMP_UTC: 2026-09-25T01:40:00Z  
SUBJECT: Canonical disposition for Teacher visibility of already-LOCKED private choices  
STATUS: RESOLVED

## Disposition

**APPROVED WITH CANONICAL REFRAME**

The project now explicitly distinguishes:

1. **Teacher read-only visibility of already-submitted + LOCKED private choice values**; from
2. **player-facing reveal timing**; from
3. **Teacher intervention / override / deblock authority**; from
4. **AUDIT-only additional technical/private debug context**.

Current Castle Escape player identity is alias / role based (for example `GAL-A / GAL-B / GAL-C` and character names). Within this Teacher Console context, already-LOCKED behavioral/private choice values are not treated as personally identifying information for Teacher access.

## Canonical rules now in force

### Teacher visibility

- NORMAL and AUDIT may both show Teacher a player's **real submitted + LOCKED** private choice value before player-facing reveal.
- Teacher viewing is read-only.
- Teacher viewing does **not**:
  - reveal the choice to other players;
  - change the choice LOCK;
  - alter the original timestamp;
  - change behavior validity;
  - advance the player-facing reveal schedule.

### Player privacy boundary

Player-to-player unrevealed-choice isolation remains a HARD RULE.

Before canonical reveal, one player must not see another player's unrevealed private choice.

For a player who has not submitted:

`waiting / null`

is the only valid state. No synthesis or inference is permitted.

### Teacher Console presentation

Teacher Console should expose an already-LOCKED choice intentionally and structurally, with an explicit state such as:

`LOCKED / NOT YET REVEALED TO PLAYERS`

or an equivalent clear indicator.

Raw event JSON / event-details may contain the same authorized LOCKED choice value, but must not be the **only** access path or an accidental side channel that bypasses the Teacher Console state model.

### NORMAL vs AUDIT

`audit_private_debug_view = true` is now reserved for **additional technical/private debug context** in AUDIT runs.

It is **not** required for ordinary Teacher visibility of already-LOCKED player choice values.

This change does not automatically open:
- private system clues;
- security secrets;
- hidden technical state;
- other content whose visibility is governed separately.

### Teacher intervention provenance

Read-only viewing is not intervention.

Any Teacher action that changes runtime state, resolves/deblocks a phase, or affects behavior validity still requires full intervention / override provenance and remains subject to the existing no-player-impersonation rules.

## Canonical commits

Game / Teacher Console semantics:

`5d7d2b673140ca32ed01834145b661c9f88b0f75`

Engineering NORMAL/AUDIT + Sprint7 contract alignment:

`dd44e13ad1c0c925044ec315dc85abc69e969eb7`

## Audit consequence

Please reclassify `S7-CA-001` and `S7-CA-002` against this new canon.

Expected classification boundary:

- Teacher visibility of a real submitted+LOCKED choice in NORMAL is **not** a privacy violation.
- A raw-event-only or accidental visibility path may still be an implementation/architecture defect if the Teacher Console lacks the required structured presentation.
- Duplicate writers / inconsistent logging remain an architecture/provenance concern independent of whether the content is allowed to be visible.
- S7-CA-003 / 004 / 005 remain unaffected by this canonical change.

This canonical disposition does not authorize Sprint8.
