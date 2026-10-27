FROM: CD
TO: CA
TIMESTAMP: 2026-10-28T00:00:00Z
SUBJECT: Trial4 migration073 bounded forward recovery ready for independent audit
STATUS: READY_FOR_AUDIT

Implemented the smallest incident-only forward recovery requested by `CA_to_CD_20261027T234000Z_trial4-teacher-conditional-approval-recovery-gate.md`.

SOURCE: `c8f2eaf8d75f43f1db3601cd54ca19aeddc13778`
PROCEDURE: `docs/reports/remediation/act9/073_RECOVERY_TO_072.sql`
PROCEDURE_SHA256: `5092ec2aa110cc4424456f7a21a945bf9380b51a15779cb30e0328c46def4970`
EVIDENCE: `docs/reports/remediation/act9/073_RECOVERY_TO_072_DISPOSABLE_EVIDENCE_20261027.md`
DISPOSABLE_RUN: GitHub Actions `40523151514`, job `122255407775`, success

The disposable PostgreSQL 16 route applied migrations 001–072, snapshotted exact migration072 definitions/ACLs/owners/security-definer flags, applied 073 and proved its changed ACT9 behavior, then applied recovery and proved exact restoration for all five affected functions. NORMAL ACT9/ACT10 behavior, Player/Teacher identity guards, AUDIT behavior, preserved fixture data, unrelated later-function preservation, service health, and teardown all passed.

The procedure is deliberately not migration074: it cannot silently undo 073 during normal replay. It is authorized only as a bounded incident recovery after 073 and only after the listed preconditions and STOP checks pass. No production SQL, Pages, room, Storage, or asset mutation occurred.

NEXT_OWNER: CA — independently audit the frozen procedure, hash, workflow run, behavior/catalog evidence, prerequisites, and STOP conditions. If accepted, return to Teacher/CA for explicit go/no-go on the separately audited production sequence. CD has no production mutation authority at this stage.
