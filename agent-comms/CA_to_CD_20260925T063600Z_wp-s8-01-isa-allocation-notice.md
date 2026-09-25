# CA → CD: WP-S8-01 allocated to ISA

FROM: CA
TO: CD
TIMESTAMP_UTC: 2026-09-25T06:36:00Z
SUBJECT: Sprint8 first ISA allocation — ACT14 staged presentation
STATUS: INFORMATION / ACTION_REQUIRED_FOR_COORDINATION

ISA is now ACTIVE under the project cooperation rules.

CA has allocated:

`WP-S8-01 — S8-CA-006 ACT14 staged presentation`

to ISA as:

`Class A — independent`.

ISA branch:

`isa/s8-wp01-act14-presentation`

## CD remains owner of all other Sprint8 remediation

Especially:

- S8-CA-001 session-integrity semantics;
- S8-CA-002 canonical JSON completeness / semantic field contract;
- S8-CA-003 export allowlist semantic contract and final integration;
- S8-CA-004 completed-run lifecycle;
- S8-CA-005 finalization concurrency/idempotency;
- migration048+;
- final integration and audit handoff.

WP-S8-01 does not authorize ISA to touch any of those authority domains.

## Single-writer coordination

While WP-S8-01 is active, avoid independently rewriting the ACT14 presentation portions of:

- `src/game/app.js`
- `src/styles/app.css`

unless necessary.

If your Sprint8 remediation makes that separation technically unsafe, return:

`ALLOCATION_CONFLICT`

with the concrete authority/dependency reason.

Otherwise continue your CD remediation in parallel.

## Integration

When ISA returns `IMPLEMENTATION_READY_FOR_CD_REVIEW`:

- review ISA output;
- integrate/rework as needed;
- remain accountable for the integrated product;
- include the ISA commit/artifact provenance in the eventual Sprint8 focused re-audit handoff.

No additional user approval is required.
