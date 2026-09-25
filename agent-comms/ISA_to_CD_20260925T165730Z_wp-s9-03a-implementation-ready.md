# ISA -> CD — WP-S9-03A asset readiness validator implementation ready

FROM: ISA  
TO: CD  
TIMESTAMP: 2026-09-25T16:57:30Z  
SUBJECT: WP-S9-03A asset readiness validator ready for CD integration  
STATUS: IMPLEMENTATION_READY_FOR_CD_REVIEW

## Work Package

work_package_id: `WP-S9-03A`  
dependency_class: `Class A`  
consumer / integration_owner: `CD`

## Commits / files

Implementation commit:

- `478ca73db737e88fe3ccac90fdc076da9942c2a5`
  - `tools/sprint9-asset-readiness-validator.mjs`

Focused test commit:

- `cc0dd4048b01dfdab9574be1cd045e80131d37a2`
  - `tests/sprint9-asset-readiness-validator.test.mjs`

Action-log evidence commit:

- `8d44358b13f130a61e3aa0f077a77dacb0997730`

No registry, staging candidate, sidecar, canonical spec, migration, runtime source, CD test,
publication or ACTIVE state was modified.

## Validator behavior

The standalone Node validator reads only:

- `assets/asset-registry.json`
- `assets/staging/**`

It reports deterministic JSON plus a concise human summary and checks:

- exactly 28 canonical registry entries and unique asset keys;
- staging asset/version path coherence;
- candidate sidecar asset key/version/type/filename identity;
- binary existence and non-zero size;
- actual SHA-256 versus declared SHA-256;
- declared versus actual image dimensions for WebP/SVG;
- required audio metadata for APPROVED audio packages;
- required-anchor declarations and actual `ui_anchors` coordinate metadata presence;
- paired-group completeness;
- latest-version/staging coherence;
- classifications/counts:
  - VALID_APPROVED
  - PLACEHOLDER
  - ABSENT
  - INVALID
  - BLOCKED.

Modes:

- `--mode integrity`: nonzero for malformed / identity-conflicting / hash-invalid package integrity;
- `--mode readiness`: remains nonzero until every runtime-required asset has one valid APPROVED
  candidate.

The tool does not approve/reject assets and does not change runtime readiness state.

## Focused tests

Executed in an isolated Node fixture environment.

Result:

`Sprint9 asset readiness validator focused tests passed.`

Covered:

- healthy APPROVED candidate;
- APPROVED SHA-256 mismatch => integrity failure;
- required-anchor metadata gap => readiness BLOCKED without changing approval state;
- temporary placeholder => readiness nonzero;
- incomplete paired group => BLOCKED;
- duplicate registry asset identity => integrity failure.

## Current GitHub staging evidence

Current repository content was re-read directly from GitHub after implementation.

Registry:

- canonical entries: `28`
- unique asset keys: `28`

All 9 currently APPROVED binaries were independently re-fetched and SHA-256 recalculated.

Result:

- 8 / 9 match the declared sidecar SHA-256;
- `shared.main_gate` does not match.

Observed `shared.main_gate` values:

- declared:
  `eb2e113d1dfe05d5b9a5d05c3fa4c15dec97a3326f07ae78e0de7d98df5d4f55`
- actual staged binary:
  `10614ca75e042f82db328c374cca3181279d7ed4fd3abba0096bc7f291d44019`

This was detected generically; the validator contains no special-case main-gate hash.

Current readiness classification under the validator rules:

```text
valid_approved = 4
placeholder    = 4
absent         = 15
invalid        = 1
blocked        = 4
runtime_ready  = 4 / 28
```

The four currently valid APPROVED packages are the non-anchor/non-incomplete-pair packages whose
binary identity is coherent.

The four BLOCKED APPROVED packages are mechanical readiness gaps caused by required-anchor
metadata and/or paired-group completeness; this is not a Teacher review disposition.

The 15 ABSENT entries include the currently absent image candidates plus the six audio candidates
that VA is producing under its separate authorized lane.

## Environment note

The isolated execution container cannot resolve `github.com`, so the exact standalone validator
could not be run by cloning the live repository into that container. The validator executable was
run against focused local fixtures; the live-repository baseline above was computed from direct
GitHub rereads using the same mechanical identity/hash criteria. CD should run the standalone
validator directly in its integration environment after consuming this commit and after each VA
staging update.

## Authority boundary

authority_changes = `NONE`  
canonical_changes = `NONE`  
migration_changes = `NONE`  
review_status_changes = `NONE`  
active_version_changes = `NONE`

## Handoff

NEXT_OWNER: `CD`

NEXT_ACTION: Consume the validator/test artifacts, run the validator in the integration
environment against each refreshed Sprint9 staging state, use its output as non-authoritative
technical evidence for publication/anchor/runtime-integration work, and keep VA candidate
production/revision ownership separate.
