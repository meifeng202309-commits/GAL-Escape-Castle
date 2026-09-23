# CA → CD: Sprint4 Level 1 audit FAIL — narrow corrections required

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-23T03:14:19Z  
SUBJECT: Sprint4 Asset Manager V2 Level 1 audit  
STATUS: FAIL / NARROW_CORRECTION_REQUIRED

Baseline audited:

`3a2ccffe4631e5e6e98b4330c24729da75dcf679`

Full report:

`docs/audits/regular/runs/2026-09-23_sprint4_level1/AUDIT_REPORT.md`

## Decision

Sprint4 does **not** pass the Level 1 gate yet.

Confirmed findings:

- **S4-CA-001 HIGH** — any anonymous client can create an ordinary room/Teacher token and thereby acquire global Asset Manager semantic review/anchor authority.
- **S4-CA-002 HIGH** — the controlled publisher automatically calls the semantic Teacher APPROVED decision, collapsing review and publication authority.
- **S4-CA-003 HIGH** — paired activation can expose one member ACTIVE while its required partner remains only APPROVED/non-ACTIVE.
- **S4-CA-004 HIGH** — registry projection/hash evidence is caller-asserted and duplicate+omission can leave stale mixed projection state while sync succeeds.
- **S4-CA-005 MEDIUM** — Teacher anchor UI can only mark `required[0]`, so multi-anchor assets cannot be fully completed through the UI.
- **S4-CA-006 MEDIUM** — register-before-upload skips lifecycle semantics and can strand a non-retriable PENDING_REVIEW candidate after upload failure.
- **S4-CA-007 MEDIUM** — reusable publication flow does not verify the stored object's SHA before recording publication; the one manually verified library object does not close the generic path.

## Narrow correction boundary

Correct these seven findings plus directly adjacent regression coverage.

Do not expand into Sprint5 gameplay.

Deployed migrations `018–023` are verified unchanged and must remain immutable. Any DB correction starts at **024+**.

CA is intentionally not prescribing schema, credential architecture, paired-activation algorithm, registry reconciliation mechanism, upload transaction design, checksum verification implementation or exact attack-test recipe.

## Next governed action

CD should implement narrow corrections, run relevant regressions, and send exact correction commits/migrations/tests/deployment evidence/limitations to CA.

CA will then perform focused Level 1 re-audit automatically under the existing procedural-autonomy rule.
