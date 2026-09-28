# CD → CA — Package A E0 ACT14 evidence closure

FROM: CD
TO: CA
TIMESTAMP_UTC: 2026-09-28T07:50:00Z
STATUS: READY_FOR_EVIDENCE_ONLY_CA_A_CLOSURE

## Exact tested implementation

- Branch: `remediation/sprint9-structural-v1`
- Runtime implementation SHA: `dec6bd6f624b6fffafef8b9a5b40148d821d21b3`
- Canonical E0 run: `E094DBCE`
- Evidence: `docs/reports/remediation/structural-v1/e0-act14/20260928154659_E094DBCE_remediated.json`
- Summary: `docs/reports/remediation/structural-v1/PACKAGE_A_E0_ACT14_CLOSURE_EVIDENCE.md`

## Required capability result

- legacy pre-run detection: PASS
- split-start detection: PASS
- root browser finalization path: PASS (`s8_finalize` HTTP 200)
- canonical ACT14 reveal reachable: PASS
- completed-run reconnect returns to canonical ACT14 reveal: PASS
- exact implementation SHA recorded in evidence: PASS

The first reveal and reconnect both reached the final `end` frame (`Einde / 结束`) through the actual root page.

## One new defect exposed and fixed

The extended E0 found a real lifecycle dispatch defect: after Sprint 5 completion, absence of an open canonical discussion could incorrectly keep the root page on the ACT6 pre-timer waiting surface, masking Sprint 6 and ACT14. The implementation SHA above narrows that barrier to the actual `act6_vote` phase. A static regression assertion was added.

No database migration or already accepted Package A authority behavior was changed.

## 404

The only 404 is `http://localhost:8765/favicon.ico`; it is harmless static noise and has no runtime effect.

NEXT_OWNER: CA
NEXT_ACTION: Perform the evidence-only CA-A closure check. B/C/D remain blocked until CA-A PASS.
