# Sprint7 Level1 — Canonical Reclassification Addendum

Original audit baseline: `62cf2c363798462e90758aa5ba3116d435287fc2`

Original audit report:

`docs/audits/regular/runs/2026-09-25_sprint7_level1/AUDIT_REPORT.md`

Canonical owner disposition:

`agent-comms/GA_to_CA_20260925T014000Z_teacher-private-choice-visibility-canonical-disposition.md`

Canonical commits:

- Game / Teacher Console semantics: `5d7d2b673140ca32ed01834145b661c9f88b0f75`
- Engineering NORMAL/AUDIT + Sprint7 alignment: `dd44e13ad1c0c925044ec315dc85abc69e969eb7`

## 1. Canonical change now in force

Teacher may read an already-submitted and LOCKED private choice in both NORMAL and AUDIT before player-facing reveal.

That read-only visibility:
- is not treated as personally identifying information in this alias/role-based project context;
- is not player reveal;
- does not alter lock/timestamp/validity/reveal timing;
- must not leak to other players;
- must show waiting/null for unsubmitted players.

Teacher Console must expose the LOCKED value intentionally and structurally, with a state equivalent to:

`LOCKED / NOT YET REVEALED TO PLAYERS`.

Raw event JSON may contain the same allowed value, but may not be the only access path.

`audit_private_debug_view` is now reserved for additional technical/private debug context in AUDIT and still requires explicit Teacher-event provenance.

## 2. S7-CA-001 reclassification

### Prior classification

**HIGH / OPEN — privacy leak**

That classification is superseded by the new canon.

Teacher visibility of a real already-LOCKED private choice in NORMAL is no longer a privacy violation.

### Current classification

**MEDIUM / OPEN — structured Teacher visibility contract missing**

At baseline 043:

- `players[].private_value` remains null in NORMAL;
- the real locked value is available only incidentally through raw `runtime_events.details.choice_id`;
- the Teacher Console does not structurally present the locked value;
- it does not mark the status as `LOCKED / NOT YET REVEALED TO PLAYERS` or equivalent.

Therefore the original HIGH privacy rationale is withdrawn, but the implementation still violates the newly canonicalized Sprint7 Teacher Console contract.

### Closure condition

For already-submitted + LOCKED private choices:
- NORMAL and AUDIT Teacher Console must expose the actual value through an intentional read-only structured field/view;
- unrevealed state must be clearly labelled;
- unsubmitted remains waiting/null;
- no player-to-player reveal is introduced;
- raw event details must not be the sole access path.

## 3. S7-CA-002 reclassification

### Prior classification

**MEDIUM / OPEN — duplicate private-debug writer bypasses logging**

### Current classification

**MEDIUM / OPEN — unchanged in substance, reframed as AUDIT debug authority/provenance**

The visibility-policy change does not close this finding.

The current baseline still has two effective writers for:

`game_runs.audit_private_debug_view`

- new `s7_set_audit_private_debug(...)`, which logs `teacher_audit_private_debug_changed`;
- legacy `s3b_audit_set_private_debug_view(...)`, which can mutate the same AUDIT technical-debug flag without the Sprint7 event log.

Under the new canon, `audit_private_debug_view` is specifically reserved for additional technical/private debug context and its use must be explicit and logged.

Thus duplicate writers with inconsistent provenance remain a valid architecture/governance defect.

### Closure condition

Every effective server-authoritative path that changes `audit_private_debug_view` must preserve the same explicit Teacher-event provenance semantics, or obsolete writers must no longer remain effective.

## 4. Unchanged findings

The canonical reframe does not affect:

- `S7-CA-003 MEDIUM` — per-phase behavior validity / durable Teacher intervention history;
- `S7-CA-004 MEDIUM` — canonical export filename preview;
- `S7-CA-005 MEDIUM` — ACT12 submitted/waiting authoritative phase mismatch.

## 5. Revised Sprint7 finding set

| Finding | Revised severity | Status |
|---|---:|---|
| S7-CA-001 | MEDIUM | OPEN — structured locked-choice Teacher view missing |
| S7-CA-002 | MEDIUM | OPEN — AUDIT debug writer/provenance inconsistency |
| S7-CA-003 | MEDIUM | OPEN |
| S7-CA-004 | MEDIUM | OPEN |
| S7-CA-005 | MEDIUM | OPEN |

There is no remaining HIGH Sprint7 finding after this canonical reclassification.

Sprint7 nevertheless remains BLOCKED until all five implementation findings are closed.

Sprint8 remains unauthorized.
