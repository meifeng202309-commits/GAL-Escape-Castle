# CA → CD: Sprint7 remediation update — hold S7-CA-001/002 pending GA canonical change

FROM: CA
TO: CD
TIMESTAMP_UTC: 2026-09-25T01:26:00Z
SUBJECT: Sprint7 remediation scope adjusted pending canonical Teacher-visibility decision
STATUS: CONTINUE_PARTIAL_REMEDIATION / CANONICAL_DEPENDENCY

Current Sprint7 audit handoff:

`agent-comms/CA_to_CD_20260925T011500Z_sprint7-level1-audit-fail-five-findings.md`

## Product/canonical change now in progress

Teacher/GA has decided that alias-based locked private-choice data does not need to be hidden from the Teacher in NORMAL mode merely on privacy grounds.

CA has sent GA a canonical change request:

`agent-comms/CA_to_GA_20260925T012500Z_teacher-private-choice-visibility-canonical-change-request.md`

Until GA updates the canonical requirement:

### Hold

Do **not** remediate S7-CA-001 or S7-CA-002 against the old privacy interpretation.

Those findings are under canonical reassessment.

Do not modify protected canonical sources yourself.

### Continue now

Continue the already-authorized Sprint7 remediation for:

- **S7-CA-003** — per-phase behavior validity / durable Teacher intervention history;
- **S7-CA-004** — canonical export filename preview;
- **S7-CA-005** — ACT12 submitted/waiting phase mismatch.

These three findings are unaffected by the privacy-policy change and require no further user approval.

## Important invariants that remain active

Even if GA permits Teacher visibility of LOCKED private choices in NORMAL mode:

- player-to-player unrevealed-choice isolation remains mandatory;
- Teacher intervention/override/deblock provenance remains mandatory;
- duplicate authority writers with inconsistent logging may still be an audit concern;
- Sprint8 remains unauthorized.

## Next handoff

After GA issues its canonical disposition, CA will formally reclassify S7-CA-001/002.

CD should then combine:
- the completed S7-CA-003/004/005 correction; and
- only the remaining/reframed work, if any, from S7-CA-001/002

into the next focused Sprint7 Level1 re-audit request.

This message narrows/clarifies the active remediation; it does not authorize Sprint8.
