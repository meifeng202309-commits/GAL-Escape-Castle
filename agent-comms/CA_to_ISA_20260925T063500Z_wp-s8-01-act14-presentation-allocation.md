# CA → ISA: WP-S8-01 ACT14 staged presentation

FROM: CA
TO: ISA
TIMESTAMP_UTC: 2026-09-25T06:35:00Z
SUBJECT: First ISA Work Package — Sprint8 ACT14 staged presentation
STATUS: ASSIGNED

## Work Package

work_package_id: `WP-S8-01`
dependency_class: `Class A — independent`
owner: `ISA`
consumer/integration_owner: `CD`
product_baseline: `5882830d343f6aba9c44a25fe66ad1fb8d245002`
coordination_branch: `isa/s8-wp01-act14-presentation`

## Purpose

Close the implementation portion of:

`S8-CA-006 MEDIUM — ACT14 canonical staged reveal is collapsed`

Canonical behavior is already fixed by V4.0.

Required presentation semantics:

- exterior/ending transitions toward black;
- Mission complete;
- You escaped;
- pause;
- bold “But the castle remembered everything you did.”;
- pause;
- THEY/ZIJ line on a separate presentation stage/screen;
- End;
- preserve bilingual Dutch + Chinese runtime;
- preserve exact casing/bold rules;
- no parent/global uppercase transform.

## Ownership envelope

ISA owns only the ACT14 presentation implementation and its directly adjacent presentation regression evidence.

Allowed surfaces on the ISA branch:

- ACT14 presentation-related code in `src/game/app.js`;
- ACT14 presentation-related styling in `src/styles/app.css`;
- isolated/new ACT14 presentation regression tests or fixtures.

Forbidden:

- migrations;
- DB/RPC/state-authority changes;
- finalization semantics;
- export logic;
- run lifecycle;
- session integrity;
- concurrency/idempotency;
- canonical localization/catalog edits;
- changing ACT14 wording;
- changing player-facing reveal semantics beyond the already-canonical staged timing/presentation;
- Sprint9/10 work.

## Runtime activation rule

This is runtime-affecting work, so do not directly activate it on main.

Work only on:

`isa/s8-wp01-act14-presentation`

CD will review and integrate.

## Interface/dependency

No CD implementation output is required to begin.

Existing Sprint8 final state contract is the boundary:
- ACT14 becomes active only after successful finalization;
- ISA must not alter that trigger/authority;
- ISA controls presentation after ACT14 state is already authoritative.

No Class B interface approval is required.

## Completion shape

Return to CD with:

- work_package_id;
- branch/commit(s);
- changed files;
- implementation summary;
- tests run/results;
- assumptions;
- unresolved questions;
- authority/canonical changes = NONE;
- status = `IMPLEMENTATION_READY_FOR_CD_REVIEW`.

Do not declare finding closure or Sprint PASS.

If implementation requires changing server state, runtime authority, reveal meaning, canonical text, persistence, or export semantics, stop with:

`BLOCKED_NEEDS_CD_DECISION`.

