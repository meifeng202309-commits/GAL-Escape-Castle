# Sprint 4 Asset Manager V2 — Bounded Scope Proposal

Status: PROPOSED / CA_SCOPE_REVIEW_REQUIRED  
Owner after approval: CD  
Canonical basis: Game Script V4.0 §50; Codex Guide V2.3 §11 and Sprint 4  
First permitted future DB migration: `018`

## 1. Objective

Deliver the smallest production-capable Asset Manager V2 slice that publishes reviewed image/audio candidates to Supabase Storage, enforces version and ACTIVE authority, resolves runtime assets by opaque canonical `asset_key`, exposes anchor metadata, and degrades observably without blocking core gameplay for ordinary missing assets.

`assets/asset-registry.json` remains the canonical identity/version authority. Runtime metadata is a deployed projection and operational ledger, not a second manually edited registry.

## 2. Included Capability

### Registry validation and projection

- Validate registry schema, duplicate keys, exact opaque keys, asset types, version semantics, paired groups and required anchors.
- Import/synchronize canonical identity fields into runtime metadata through a server-controlled operation.
- Reject unknown, translated, normalized, filename-derived or MASTER-derived runtime keys.
- Detect projection drift against the committed registry source/hash.

### Candidate lifecycle

- Represent immutable image/audio candidate versions with statuses needed for the bounded workflow: PENDING_REVIEW, APPROVED, REJECTED, ACTIVE and SUPERSEDED.
- Verify staged sidecar identity, version, type and SHA-256 before publication.
- Preserve APPROVED != ACTIVE and allow multiple APPROVED versions.
- Enforce at most one ACTIVE version per `asset_key` transactionally.
- Preserve immutable candidate history during promotion and rollback.

### Authority and storage

- Teacher may review, approve or reject an existing candidate through server-authorized RPCs.
- CD/Asset Manager publication copies only an APPROVED, checksum-matching candidate into restricted Supabase Storage and persists its runtime path/metadata.
- ACTIVE promotion is a separate server-authorized operation.
- Browser code receives no service-role key, storage secret or unrestricted upload authority.
- Any browser upload surface is limited by authenticated role/assignment, canonical path and accepted image/audio constraints; if secure direct upload cannot be proven in this sprint, publication remains server/operator controlled and the limitation is explicit.

### Runtime resolver

- Resolve only `active_version` by exact `asset_key`.
- Return type-specific metadata and a bounded signed/public runtime URL according to the selected storage policy.
- Return image dimensions and `ui_anchors`; return audio MIME/duration/loop metadata when present.
- Never infer a key or silently select latest/APPROVED when ACTIVE is absent.
- Optional generated manifest, if needed, is generated from or validated against the registry and runtime projection.

### Asset Manager UI

- Provide a work-focused Teacher/CD asset list grouped by student, teacher/shared and audio assets.
- Show canonical display name, key, current status, latest candidate, ACTIVE version and readiness.
- Support preview, review decision, explicit ACTIVE promotion/rollback, version history and Teacher anchor marking/preview for required anchors.
- Keep advanced publishing controls role-gated and separate from semantic Teacher review.

### Failure handling and telemetry

- Ordinary missing/corrupt/load-failed assets return a safe typed placeholder and do not block core gameplay.
- Log `asset_load_failed` with exact key, requested version/path and failure class; expose cause in Teacher debug.
- Interaction-critical missing assets may block only with an explicit reason and an already canonical Teacher-deblock path; Sprint 4 does not invent arbitrary scene jumps.
- Track publish, approval, activation, resolution and load-failure events without treating operational actions as player behavior.

## 3. Data and Transaction Invariants

- Deployed migrations `001–017` remain unchanged; schema work is additive at `018+`.
- Candidate identity is unique on `(asset_key, version)` and candidate package SHA-256 is immutable.
- One ACTIVE version maximum per key is database-enforced under concurrent promotion.
- Promotion locks the asset identity/current ACTIVE state and either supersedes the previous ACTIVE plus activates the target atomically, or changes nothing.
- Candidate creation cannot overwrite or reuse an existing version.
- APPROVED eligibility is required before publish/promotion; PENDING_REVIEW and REJECTED cannot resolve at runtime.
- Registry projection cannot raise `latest_version` without a matching immutable candidate package.
- Paired assets and required anchors are validated before a candidate may become ACTIVE when canonical metadata requires them.

## 4. Verification Gate

Static checks:

- registry/schema validation and no second manual authority;
- RLS/grant/secret scan;
- exact-key and type-specific metadata contracts;
- UI uses server-returned authority/status rather than client-only gating.

Live checks:

- image and audio candidate publication with checksum match;
- checksum/type/key/version mismatch rejection;
- Teacher approve/reject authorization and reconnect persistence;
- concurrent ACTIVE promotion yields one winner and one ACTIVE row;
- rollback selects an APPROVED prior version without deleting history;
- runtime resolution uses ACTIVE, never latest or merely APPROVED;
- unknown/no-ACTIVE/corrupt object returns typed fallback and logs telemetry;
- required-anchor and paired-asset validation blocks invalid activation;
- anonymous/direct table and storage writes are denied;
- browser assets contain no service-role secret;
- existing Sprint 1–3C static and live suites remain green.

CA Level 1 audit is required before Sprint 4 is marked VERIFIED.

## 5. Explicit Exclusions

- No ACT 6–14 gameplay implementation or visual-dynamic scene binding.
- No final export, prediction/Agent analysis or release-candidate workflow.
- No expansion of the Sprint 3C Teacher Override allowlist.
- No automatic semantic approval, autonomous ACTIVE promotion or VA direct live publishing.
- No registry key renaming/reconstruction and no MASTER-to-runtime-key inference.
- No regeneration or replacement of existing visual candidates solely for Sprint 4.
- No claim that physical multi-device UX is verified.

## 6. Proposed Delivery Sequence After Approval

1. Add migration `018+` for runtime asset metadata, lifecycle ledger, RLS and server authority.
2. Add registry validator/projection tooling and focused static tests.
3. Add restricted publication and ACTIVE promotion path with concurrency tests.
4. Add runtime resolver, typed placeholders and telemetry.
5. Add the bounded Asset Manager Teacher/CD interface and anchor workflow.
6. Run Sprint 4 live E2E plus Sprint 1–3C regression, then submit exact commits and deployment evidence to CA.

Implementation does not begin until CA approves or narrows this scope.
