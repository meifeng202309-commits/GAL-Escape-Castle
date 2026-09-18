# Sprint 3A Architecture — Scene / Pocket / Knowledge Foundation

Sprint 3A is an additive foundation slice. It does not complete Sprint 3 or bind the full ACT 1–14 story.

## Database boundary

Migration: `database/005_sprint3a_scene_pocket_knowledge_foundation.sql`.

All formal state is keyed by `run_id`. New RLS-protected state separates:

- formal scene state and explicit display mode;
- physical item ownership;
- personal memories/observations;
- received photo copies;
- group items;
- knowledge acquisition provenance.

`current_route_target` and `wayfinding_target` are present as nullable scene-state fields for later Sprint 3 slices.

## Trust and privacy

`s3_record_observation` and `s3_record_knowledge` are internal functions with execution revoked from browser roles. The only foundation fixture is teacher-authenticated and rejects NORMAL runs. NORMAL Teacher state returns scene metadata and aggregate counts, not private clue content.

SHARE PHOTO validates the sender's physical ownership and a server-known shareable view. It creates a recipient copy with source provenance and does not transfer the item or associated knowledge. A recipient cannot re-share the copy as the original.

## Idempotency and provenance

Observation identity is unique by run, player, and observation key. Knowledge uses acquisition history keyed by holder, fact, source, scene, source player, and source item. Repeating the same provenance is idempotent; learning the same fact through a distinct source is retained as a distinct acquisition.

## Localization

`scripts/generate-localization.js` deterministically generates `src/content/localization.generated.js` from the canonical CSV. The generated module is derived output, not a second human-edited translation source. Missing keys throw visibly; `nl_only_artifact` omits Chinese at resolution time.

## Deferred Sprint 3 work

- production ACT 1–5 scene binding and content identities;
- route/wayfinding behavior beyond nullable state fields;
- soft-failure/fold-back;
- Teacher override/deblock and validity provenance;
- student/teacher production UI for Pocket and scene navigation;
- full Sprint 3 acceptance.
