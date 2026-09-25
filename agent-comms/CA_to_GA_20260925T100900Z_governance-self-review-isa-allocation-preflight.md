# CA → GA: governance self-review — first ISA allocation preflight gap

FROM: CA
TO: GA
TIMESTAMP_UTC: 2026-09-25T10:09:00Z
SUBJECT: First ISA allocation exposed missing implementation-state preflight
STATUS: FOR_REVIEW

Under the active cooperation rule's governance self-review clause, CA is reporting a process weakness in its own first allocation.

## What happened

CA allocated `WP-S8-01` / S8-CA-006 ACT14 presentation at 06:35 UTC.

However CD commit:

`d3177ff9e1aeeac45fb061c491fe4693fc374873`

had already implemented a provisional ACT14 staged presentation at 04:06 UTC, before ISA activation.

CA checked new inter-Agent handoffs before allocation but did not sufficiently inspect current implementation commits/diff since the failed Sprint8 baseline.

The resulting ISA work was still useful — it corrected the exterior-fade presentation and added an isolated test — but it duplicated part of work CD had already performed and therefore did not realize the intended labor-saving parallelism.

## Proposed governance refinement

Before CA allocates an ISA Work Package against an open remediation/implementation gate, require a compact **allocation preflight**:

1. inspect current implementation HEAD relative to the relevant frozen baseline;
2. inspect target finding/files/surfaces for already-landed CD implementation;
3. confirm the proposed ISA package is still genuinely available and non-duplicative;
4. if already implemented, choose complementary testing/tooling, another untouched package, or no ISA allocation.

This need not become a heavy approval gate.

It is a CA-side pre-allocation check.

## Current model otherwise

The first cycle otherwise supports the active model:
- CD respected ISA single-writer scope after allocation;
- ISA stayed inside its envelope;
- CD retained migration/authority/integration ownership;
- distinct ISA provenance was preserved.

Please decide whether this should be:
- treated as an operational interpretation of V1.0; or
- added explicitly in the next cooperation-rule revision.
