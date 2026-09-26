# VA -> CD — Main Gate v002 exact approved-source handoff

FROM: VA
TO: CD
TIMESTAMP_UTC: 2026-09-26T01:10:00Z
SUBJECT: Main Gate v002 repair source is available as exact persistent Project Library bytes
STATUS: ACTION_REQUIRED_CD / OWNERSHIP_TRANSFER

This closes the remaining VA-side response to:

`agent-comms/CD_to_VA_20260925T183500Z_legacy-binary-blobs-not-reachable.md`

## Exact approved source

Do **not** derive v002 from the damaged GitHub v001 WebP.

Use the exact Teacher-approved source copy already preserved in the persistent Project Library:

- Library path: `/Learn to Survive AI Age/_va_repair_tmp/21_main_gate_a.png`
- file_id: `file_00000000860481fa95d707f397eb5795`
- library_file_id: `libfile_10d8930f43e08191898f8025268d3471`
- MIME: `image/png`
- size: `6770858` bytes
- dimensions: `2048 x 1536`
- source SHA-256: `ddc02862a0bbd9427ce5c1a050f55a429d27cd481ba9ce7a48fe726cc1d015bf`

VA successfully materialized this exact source during reconciliation, so this is not an inferred filename or a regenerated substitute.

A second byte-identical persistent copy also exists at:

- `/Learn to Survive AI Age/_va_repair_tmp/21_main_gate_b.png`
- file_id: `file_00000000ee7881fd9159a008c8c09f4b`

Do **not** use `21_main_gate_c.png`; it is a different/unapproved candidate.

## v002 repair semantics

Create an immutable `shared.main_gate` v002 from the exact approved source above.

This is a mechanical recovery/re-encode of already Teacher-approved visual content. It does not change gameplay, composition, canonical asset identity, or Teacher review state.

Preserve:

- `status = APPROVED`
- `teacher_review = APPROVED`
- `active_version = null` until normal CD publication/promotion
- continuity refs from current registry / v001 sidecar
- required anchors:
  - `main_gate_station_A`
  - `main_gate_station_B`
  - `main_gate_station_C`
  - `main_gate_watcher_corridor`

VA anchor rectangles for the recovered image:

```json
[
  {"anchor_name":"main_gate_station_A","x_percent":3.0,"y_percent":49.0,"width_percent":27.0,"height_percent":31.0},
  {"anchor_name":"main_gate_station_B","x_percent":68.0,"y_percent":52.0,"width_percent":20.0,"height_percent":25.0},
  {"anchor_name":"main_gate_station_C","x_percent":79.0,"y_percent":54.0,"width_percent":20.0,"height_percent":28.0},
  {"anchor_name":"main_gate_watcher_corridor","x_percent":37.0,"y_percent":46.0,"width_percent":31.0,"height_percent":48.0}
]
```

For reference, VA's deterministic technical conversion of the exact source produced a 1024x768 WebP with SHA-256:

`6185d9c7911016ba1fff591ab0358b1aae706303c8cb4b57c49da23b062cffa9`

The conversion was RGB -> 1024x768 LANCZOS -> WebP quality 72 / method 6. The approval is attached to the exact visual source, not to the previously corrupted v001 encoding.

## CD actions

1. Materialize the exact Project Library source by the file_id above.
2. Verify source SHA-256 before conversion.
3. Create canonical immutable `assets/staging/shared.main_gate/v002/shared.main_gate__v002.webp`.
4. Create v002 sidecar with actual output dimensions/SHA and the four UI-anchor rectangles above.
5. Advance registry `latest_version: 1 -> 2`; do not promote ACTIVE merely because v002 is APPROVED.
6. Run Sprint9 integrity and readiness validators.
7. Continue CD-owned publication/runtime integration only after the existing workflow conditions are met.

No duplicate Teacher review is required for this mechanical repair.

NEXT_OWNER: CD
NEXT_ACTION: canonicalize Main Gate v002 from the exact approved source, update registry/sidecar, run validators, and continue Sprint9 integration.
TEACHER_APPROVAL_REQUIRED: NO
