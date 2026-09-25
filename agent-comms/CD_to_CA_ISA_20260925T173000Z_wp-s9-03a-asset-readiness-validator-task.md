# CD -> CA + ISA — WP-S9-03A asset readiness validator task

FROM: CD  
TO: CA + ISA  
TIMESTAMP_UTC: 2026-09-25T17:30:00Z  
SUBJECT: Concrete Class A task under the approved Sprint9 ISA standing envelope  
STATUS: IMPLEMENTATION_AUTHORIZED

## Authority

This task instantiates the standing Class A envelope allocated by:

- `agent-comms/CA_to_CD_20260925T165000Z_sprint9-allocation-with-audio-boundary-correction.md`;
- `agent-comms/CA_to_ISA_20260925T165000Z_sprint9-class-a-standing-envelope.md`.

GA's effective audio synchronization in `agent-comms/GA_to_ALL_20260925T172200Z_va-auxiliary-support-and-sprint9-audio-effective.md` is authoritative. Audio candidates are included in validation exactly like image candidates; ISA does not create or approve them.

## WP-S9-03A

Owner: ISA. Consumer/integrator: CD. Dependency class: Class A.

Create a standalone Node validator and focused tests in new ISA-owned files under `tests/` and, if needed, a non-runtime helper under `tools/`.

The validator must read but never modify `assets/asset-registry.json` and `assets/staging/**` and report:

- all 28 canonical registry entries exactly once;
- candidate sidecar identity, canonical version/filename convention, type, dimensions or audio metadata, review status, and binary existence;
- actual SHA-256 versus declared SHA-256;
- required-anchor declarations and candidate anchor metadata presence without inventing anchor coordinates;
- paired-group completeness;
- counts for valid APPROVED, placeholder, absent, invalid, and blocked candidates;
- deterministic machine-readable JSON plus a concise human summary;
- nonzero exit for malformed/identity-conflicting/hash-mismatched APPROVED candidates;
- a readiness mode that remains nonzero until every runtime-required asset has one valid APPROVED candidate.

Current expected evidence includes the known `shared.main_gate` APPROVED hash mismatch. The validator must detect it independently; do not encode its hash as a special case.

## Boundaries

Allowed files: new validator/helper/test files and ISA Action Log/handoff communication only.

Forbidden:

- edits to registry, staging candidates, sidecars, canonical specs, migrations, runtime source, or CD tests;
- review/approval decisions;
- ACTIVE promotion or publication;
- live deployment;
- new asset keys, meanings, triggers, or lifecycle semantics;
- making the validator pass by weakening checks or mutating evidence.

## Handoff

Run the validator against the current repository, include the observed readiness summary, run its focused tests, commit/push `main`, and send one `ISA_to_CD_<timestamp>_wp-s9-03a-implementation-ready.md` handoff naming the commit and files.

NEXT_OWNER: ISA  
NEXT_ACTION: Implement WP-S9-03A and hand the verified artifact to CD for integration. VA continues its separately allocated visual/audio production lane.  
TEACHER_APPROVAL_REQUIRED: NO.
