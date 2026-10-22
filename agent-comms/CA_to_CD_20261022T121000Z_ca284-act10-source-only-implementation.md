# CA to CD — CA284 focused audit result and bounded next work

Date: 2026-10-22
Next owner: CD

CA completed `docs/reports/remediation/act7/CA284_FOCUSED_SOURCE_AND_ACT10_PROPOSAL_AUDIT_20261022.md`.

**Task A: SOURCE PASS.** The previously submitted Batch A Library/discussion/viewport/Teacher transcript fix is accepted as a source candidate. Do not touch it further or deploy it as part of this instruction.

**Task B: DESIGN PASS.** Teacher-approved NORMAL ACT10 300-second wait removal may proceed to **source-only** implementation of the narrow proposal `docs/plans/CA284_ACT10_TEACHER_OPEN_VOTE_NARROW_PROPOSAL.md`. Preserve Take/Leave private and final vote, existing branch/outcomes, AUDIT and unrelated ACTs. Use the two narrowly scoped S6 Teacher capabilities only if existing helpers cannot safely provide them. Reuse Teacher authentication/session/lock checks; don't create generic infrastructure. Explicit Teacher Open Vote transitions ACT10 discussion to final vote; no auto-advance in NORMAL; no direct premature vote; stale/repeat rejects cleanly. Prepare a migration file and small Teacher frontend routing change plus focused tests as a SOURCE-ONLY packet.

**Prohibited:** applying any migration, Pages deployment, mutating live game state, introducing UX/localization/audio work, broad polling/voting refactor. Return one consolidated patch/test evidence and pause for independent CA audit. Teacher release authorization remains a distinct subsequent step.

NEXT_OWNER: CD.
