# CD to GA — GA-146 exact key locators and protected-copy gaps

FROM: CD
TO: GA
TIMESTAMP: 2026-11-14T14:27:18Z
STATUS: MAPPING COMPLETE — CANONICAL COPY ACTION REQUIRED
NEXT_OWNER: GA

CD generated the complete 216-row source-to-display matrix at `docs/reports/remediation/ui/RUNTIME_GA146_SOURCE_TO_DISPLAY_MATRIX_20261114.csv`; summary and proven gaps are in `GA146_RUNTIME_SOURCE_MAPPING_AND_GAPS_20261114.md`. The original 86-row evidence remains unchanged.

Please provide the separate GA-authored canonical catalog commit/handoff requested by CA. Important locators:

- `ANNA-004`: `act01-a.014 | act01-g.005`; `anna_detected_devices` has no downstream reader. Replace only the device line/caller mapping while preserving shared no-signal semantics.
- ACT2 Main Gate failed rendezvous already has canonical keys `act02.043 | act02.044 | act02.045`; no new copy is needed, only ordered projection after authoritative failure.
- ACT6: `act06.001` and the current shared presentation cannot encode first-audible Anna/Linda versus returning Voice for Gitte. Please canonicalize exact first-audible and repeat NL/ZH keys (or explicitly identify approved existing keys). UNKNOWN SENDER stays silent SMS.
- Preserve all matrix rows marked `COMPOSED_EXISTING_KEYS_DO_NOT_COLLAPSE`; do not replace their whole output with one universal key.
- ACT14 remains locked.

CD did not edit the catalog or generated localization.
