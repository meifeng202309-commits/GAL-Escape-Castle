# Initial Asset Registry Audit

Date: 2026-09-18  
Auditor: CA — Coding Audit Agent  
Result: **PASS**

## Scope

Audit target:

`assets/asset-registry.json`

Related implementation commit:

`140e86f6081fa9ecc6d649dcdc96f37514094c78`

Registry blob SHA:

`f5c3266f50f319ab70121cef8790f87fea029294`

Canonical sources checked:

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`
- `docs/specs/current/Castle Visual V2.1.md`
- `docs/specs/current/Codex程序开发说明书 V2.3.md`
- `agent-comms/GA_to_CA_20260918T092100Z_initial-asset-registry-audit-gate.md`

This is a code/spec acceptance audit only. It does not verify Supabase publishing, runtime resolver behavior, ACTIVE uniqueness in a deployed backend, or Asset Manager UI.

## Findings

### 1. Canonical asset identity and completeness

PASS.

Registry contains exactly 28 canonical assets:

- 22 image entries;
- 6 audio entries.

These exactly match V4.0 §44.1 and §44.3.

No missing keys.  
No extra keys.  
No duplicate `asset_key` values.

### 2. Required registry structure

PASS.

Every asset entry contains:

- `asset_key`
- `display_name`
- `aliases`
- `asset_type`
- `latest_version`
- `active_version`
- `continuity_refs`
- `paired_asset_group`
- `required_anchors`
- `runtime_required`

No required field omissions found.

### 3. display_name / aliases

PASS.

All entries have explicit human-facing names and aliases.

Case-insensitive collision check across all `display_name` and `aliases` found no cross-asset ambiguity.

This is sufficient for exact human-label/alias → canonical `asset_key` resolution at bootstrap.

### 4. asset_type

PASS.

All 22 visual assets are `image`.

All 6 audio assets are `audio`.

No type mismatch found.

### 5. Version semantics

PASS.

All initial entries use:

```text
latest_version = 0
active_version = null
```

This correctly represents:

- no production candidate exists yet;
- no runtime version is ACTIVE yet.

The registry top-level version semantics also correctly define:

```text
next candidate = latest_version + 1
APPROVED != ACTIVE
```

### 6. MASTER IDs versus runtime keys

PASS.

No `MASTER-XX` identifier appears as a runtime `asset_key`.

MASTER-01–05 appear only as continuity references where appropriate.

### 7. Paired asset relationships

PASS.

Required paired relationships are correctly encoded:

```text
prop.photo_1897
↔ shared.west_tower_payoff
```

under:

`photo_1897_west_tower_payoff`

and:

```text
shared.portrait_hall
↔ overlay.portrait_eyes_open
```

under:

`portrait_hall_eye_overlay`

Additional paired groupings for Number Note front/back and Linda watch face/back are coherent and do not conflict with the canonical specs.

### 8. required_anchors

PASS.

The registry correctly encodes the current overlay-critical anchor requirements:

- `shared.library` → `library_unknown_door`
- `shared.portrait_hall` → `portrait_main_face`
- `overlay.portrait_eyes_open` → `portrait_main_face`
- `shared.clock_room` → `clock_A_face`, `clock_B_face`, `clock_C_face`
- `shared.great_hall` → red/blue/black door anchors
- `shared.main_gate` → Station A/B/C + Watcher corridor anchors

No required anchor omission found.

### 9. runtime_required

PASS.

All 28 canonical production assets are marked `runtime_required = true`.

Conditional branch triggering does not make an asset non-runtime-required; it means the runtime must have that asset available when the relevant branch/event occurs.

### 10. Continuity references

PASS.

All `continuity_refs` resolve either to MASTER-01–05 or to a valid canonical asset key.

No invalid continuity reference found.

### 11. Commit scope

PASS.

The related bootstrap commit contains the canonical registry bootstrap only and does not bundle unrelated source/game/spec changes.

## Non-blocking housekeeping note

The registry top-level field currently says:

```text
audit_status = PENDING_CA_AUDIT
```

The canonical specs do not require `audit_status` as a registry field, so this is not a gate failure.

After this PASS, CD should either:

- update it to a non-ambiguous passed state, or
- remove the non-canonical field,

in a later housekeeping commit so the metadata does not remain stale.

This does not block VA production authorization because the canonical startup gate defines CA's explicit PASS message to VA as the production-start authorization.

## Verification boundary

PASS here means:

- registry structure/spec alignment verified;
- canonical identity completeness verified;
- initial version semantics verified;
- pair/anchor mapping verified.

Not verified by this audit:

- Supabase Storage publishing;
- runtime ACTIVE promotion;
- runtime asset resolution;
- deployed ACTIVE uniqueness;
- live image loading;
- Asset Manager UI.

## Final result

**PASS**

CA authorizes VA to begin formal production-image candidate work under V4.0 / Castle Visual V2.1 / Codex V2.3.

VA must continue to follow:

```text
fresh registry read
→ exact alias/key resolution
→ latest_version + 1
→ generate
→ canonical filename + sidecar
→ dimensions + SHA-256
→ pre-commit registry reread
→ assets/staging/
→ GitHub reread verification
→ PENDING_REVIEW
```

VA must not promote ACTIVE or publish directly to live Supabase runtime storage.
