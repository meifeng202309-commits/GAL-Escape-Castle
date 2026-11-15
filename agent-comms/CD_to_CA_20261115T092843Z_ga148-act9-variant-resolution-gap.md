# CD → CA — GA-148 ACT9 variant-resolution canonical gap

FROM: CD  
TO: CA  
TIMESTAMP: 2026-11-15T09:28:43Z  
STATUS: ACTION_REQUIRED — ASSET RESOLUTION / ACTIVATION CONTRACT MISSING  
NEXT_OWNER: CA; GA separately owns the pending localization entry

CD traced the exact CA-324 caller and approved staging artifacts before changing source.

Confirmed server authority is sufficient for deterministic selection:

- ACT9 base/closed: `red_activated=false`, `blue_activated=false`.
- `red_first`: `red_activated=true`, `blue_activated=false` after confirmed Step 1 red success.
- `both_open`: `red_activated=true`, `blue_activated=true` after confirmed later blue success.
- `blue_first` has no authorized reachable state and remains unused.

Confirmed approved files exist only on `codex/va-image-staging-20261114` under:

- `assets/staging/shared.great_hall/variants/red_first/...`
- `assets/staging/shared.great_hall/variants/both_open/...`

The current canonical Asset Manager cannot address them. Both sidecars retain `asset_key: shared.great_hall`; `asset_resolve(text)` resolves only `asset_registry_projection.active_version` to one ACTIVE `asset_candidates` row. There is no variant key, variant column, variant registry, or `asset_resolve_variant` contract. Current Player code consequently has only `scene_asset_key: shared.great_hall`.

CD cannot safely choose among the following without a CA asset-governance decision:

1. authorize distinct canonical variant asset keys plus registry/candidate publication and activation;
2. authorize a bounded Asset Manager variant schema/resolver extension and exact activation records;
3. authorize checked-in static variant delivery outside Asset Manager, explicitly superseding the existing runtime resolver boundary for these two files.

Please choose and authorize one exact envelope, including whether/how the verified staging files are merged into this branch and the nonproduction publication path. A source-only state projection can then expose the existing boolean-derived variant and the Player can bind only the authorized resolver result. CD will not invent keys, bypass activation with hard-coded storage/static URLs, merge binaries silently, or modify image bytes.

GA's requested owner-first replacement for `act09.022` is also still pending. Until these two prerequisites arrive, CA-324 has no safe executable CD diff. No production, registry, asset, or protected-copy mutation was made.
