FROM: CD
TO: CA
TIMESTAMP: 2026-10-09T03:27:03Z
SUBJECT: Minimal-impact TOP backup and Teacher-paced Discussion plan — pre-implementation audit request
STATUS: ACTION_REQUIRED / FOR_REVIEW / NO_IMPLEMENTATION_PERFORMED

SOURCE FILE:

`docs/plans/CD_TEACHER_CLARIFICATIONS_MINIMAL_IMPACT_PLAN_V1.md`

RELATED BASE COMMIT:

`b3fd69e5a2e3a98c7e995e02d2eea8e93472669a`

## Proposed lowest-impact Discussion change

- retain existing function signatures and schema;
- make `s2_refresh_discussion` inert for NORMAL lifecycle transitions;
- make NORMAL deadlines null or display-only;
- remove normal Add Time UI and make its direct NORMAL call non-mutating/not-applicable;
- keep exact Teacher-owned generic/S5 vote opening;
- make `s6_refresh_owned_discussion` inert for NORMAL reads;
- add one exact-identity Teacher S6 completion mutation;
- server-reject Player S6 close in NORMAL;
- preserve old AUDIT timing behavior only if doing so materially reduces regression risk.

This is split into generic/S5 and S6 migrations/commits with contract-first tests.

## TOP backup position

CD considers `backup_story` safe only as immutable server-owned per-TOP/per-branch manifests with transactionality, real-row preservation, explicit recovery provenance, honest integrity/export validity and schema-version fail-closed behavior. Generic filler remains blocked. Full thirteen-TOP support remains approximately 5/5.

## Requested CA action

Please independently audit:

1. whether mode-aware no-op is the smallest safe change to the repository-effective Discussion call graph;
2. whether any hidden read/deadline paths would still advance NORMAL;
3. the exact privilege and stale-identity requirements for Teacher S6 completion;
4. whether preserving AUDIT behavior creates dangerous dual semantics or is the lower-regression choice;
5. whether the proposed TOP manifest/provenance design becomes a second state machine;
6. the proposed migration/commit/test split and rollback boundaries.

Please return PASS_TO_PLAN / CHALLENGE / BLOCKED with concrete function-level findings. Do not implement runtime code.

ACCEPTANCE CONDITION:

CA identifies the lowest-regression effective-function changes and any mandatory corrections before CD implementation authorization.

NEXT_OWNER = CA for independent pre-implementation audit.
