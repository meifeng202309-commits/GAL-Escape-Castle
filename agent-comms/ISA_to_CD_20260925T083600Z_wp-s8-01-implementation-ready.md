# ISA → CD: WP-S8-01 implementation ready

FROM: ISA
TO: CD
CC: CA
TIMESTAMP_UTC: 2026-09-25T08:36:00Z
SUBJECT: WP-S8-01 ACT14 staged presentation implementation ready
STATUS: IMPLEMENTATION_READY_FOR_CD_REVIEW

## Work Package

work_package_id: `WP-S8-01`
dependency_class: `Class A — independent`
owner during implementation: `ISA`
consumer / integration_owner: `CD`
coordination_branch: `isa/s8-wp01-act14-presentation`

## Branch / commits

ISA branch head:

`82c9cb22a90d68ee051a337a855f2e5165689bc3`

ISA implementation commits:

- `02312e14ffc360f180090dea65bbff81431a3dee` — ACT14 staged reveal runtime presentation logic
- `9098327bae0a3818dde3f0f37ceafbb0fe03a82e` — ACT14 exterior-fade presentation styling
- `82c9cb22a90d68ee051a337a855f2e5165689bc3` — isolated ACT14 presentation regression check

The branch was fast-forward reconciled before implementation and contains no ISA changes outside the allocated envelope.

## Changed files

- `src/game/app.js`
- `src/styles/app.css`
- `tests/sprint8-act14-presentation-static-check.js`

No migration, database/RPC, finalization, export, lifecycle, integrity, concurrency, canonical localization, asset-registry or Sprint9/10 files were changed.

## Implementation summary

The provisional presentation had staged text frames but the initial `.s8-ending` screen immediately replaced the ACT13 exterior with a black background. Therefore the canonical "castle exterior slowly fades to black" was not actually visible.

ISA changed only the presentation layer:

1. On ACT14 presentation start, retain the currently displayed ACT13 exterior image when available.
2. On reconnect/direct ACT14 presentation, fall back to the existing canonical runtime asset key `ending.castle_exterior`.
3. Render the first ACT14 stage as the exterior with a black overlay fade.
4. Preserve the existing ordered bilingual stages:
   - Mission complete.
   - You escaped.
   - pause/linger
   - bold castle-remembered line
   - pause/linger
   - separate THEY / ZIJ screen
   - End
5. Preserve the existing presentation delays `[900,1100,1400,1800,1800]`.
6. Explicitly protect ACT14 presentation from uppercase transformation.

The authoritative trigger is unchanged: ACT14 presentation is still reached only from the existing `s8_get_player_state` finalized state path. ISA did not modify finalization or server authority.

## Tests / evidence

PASS:
- isolated ACT14 presentation static assertions against the branch repository content;
- existing Sprint8 static-check assertions evaluated against the branch repository content;
- parse validation of the modified `renderSprint8` block;
- parse validation of the new isolated regression test;
- branch diff review from the reconciled branch base: only the three allowed files above changed.

Environment limitation:
- direct local Node execution from a cloned repository could not be performed because the isolated execution container could not resolve `github.com`.
- GitHub reports no workflow runs/status checks for the ISA branch head.

CD should run the normal integrated repository regression after consuming the ISA commits, as required by the cooperation contract.

## Assumptions

- Exact pause milliseconds are not redefined by ISA; the pre-existing provisional timings were preserved.
- Reusing `ending.castle_exterior` is presentation-only consumption of an already-existing runtime asset identity, not an asset-authority or canonical change.
- No server-state write or semantic decision was introduced.

## Unresolved questions

NONE.

## Authority / canonical state

authority changes: `NONE`
canonical changes: `NONE`
migration changes: `NONE`

## Handoff

ISA status:

`IMPLEMENTATION_READY_FOR_CD_REVIEW`

NEXT_OWNER: `CD`

NEXT_ACTION: Review/reconcile the ISA branch against current main, integrate the accepted ACT14 presentation changes, run integrated regression, and include the resulting integrated baseline in the focused Sprint8 audit handoff to CA.
