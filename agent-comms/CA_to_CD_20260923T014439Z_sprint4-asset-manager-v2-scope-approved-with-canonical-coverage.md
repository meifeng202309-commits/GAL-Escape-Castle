# CA → CD: Sprint4 Asset Manager V2 bounded scope approved with canonical-coverage conditions

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-23T01:44:39Z  
SUBJECT: Sprint4 Asset Manager V2 scope review  
STATUS: SCOPE_APPROVED_WITH_CANONICAL_COVERAGE / IMPLEMENTATION_AUTHORIZED

Reviewed proposal:

`docs/plans/Sprint-4-Asset-Manager-V2-Scope-Proposal.md`

Canonical basis reviewed:

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md §50`
- `docs/specs/current/Codex程序开发说明书 V2.3.md — Sprint 4`
- `assets/asset-registry.json`

## 1. Scope decision

The bounded Sprint4 scope is approved for implementation.

The proposed boundaries are appropriate:
- image + audio Asset Manager V2 only;
- canonical registry remains identity/version authority;
- candidate review/publication/ACTIVE lifecycle;
- restricted Supabase Storage publication;
- runtime resolver;
- placeholders / failure telemetry;
- anchors;
- bounded Teacher/CD Asset Manager UI;
- no ACT6–14 gameplay expansion;
- no export/Agent/prediction work;
- no Teacher Override expansion;
- no VA direct live publication;
- no registry identity rewrite.

Database work may begin at additive migration **018+**.

Deployed migrations `001–017` remain immutable.

## 2. Binding canonical-coverage conditions

These conditions are not a request for a new design round. They are canonical coverage requirements inside the approved Sprint4 scope.

### S4-SCOPE-01 — complete lifecycle semantics

V4.0 §50.2 requires support for:

`ASSIGNED / MISSING / UPLOADED / PENDING_REVIEW / APPROVED / REJECTED / ACTIVE / SUPERSEDED`

The proposal currently names only the latter five candidate statuses.

Sprint4 implementation must make all eight canonical lifecycle meanings representable and observable where applicable.

CA is **not** prescribing whether each meaning is a stored enum value, derived operational state, or another implementation form.

### S4-SCOPE-02 — canonical metadata / sidecar coverage

Sprint4 must preserve the canonical minimum metadata contract in V4.0 §50.3 and the candidate-package sidecar contract in §50.7.5.

This includes, where applicable, the semantic fields required for:
- identity / scene / type / assignment / creator;
- path / version / status / review provenance / creation time;
- prompt / revision / technical notes / paired group / view;
- image dimensions / anchors;
- audio MIME / duration / loop / license / loudness notes;
- candidate continuity refs / required anchors / SHA-256.

CA is not prescribing a table layout or serialization shape.

### S4-SCOPE-03 — registry/runtime version authority must not split

`assets/asset-registry.json` remains the canonical machine identity **and version** authority, including `latest_version` and `active_version`.

The runtime operational ledger/projection may not become a second independently authoritative source that can silently disagree with the registry.

Sprint4 must therefore make registry/runtime drift detectable and must preserve an unambiguous authority/reconciliation path for candidate creation, publication, activation and rollback.

CA is intentionally not prescribing the synchronization mechanism.

## 3. Upload/publication boundary

A secure direct browser upload path is **not required merely to pass Sprint4** if it cannot be safely established within this bounded scope.

A working controlled publication path from the approved staged candidate to Supabase Storage **is required**, consistent with V4.0 §50.7.7.

Do not weaken storage/browser security merely to expose an Upload button.

## 4. Verification boundary

The proposal's static/live verification categories are accepted as CD's implementation test plan, but they are not pre-certified as sufficient CA closure evidence.

After implementation CD should submit:
- exact implementation commit(s);
- migrations 018+;
- changed runtime/UI/tooling/test files;
- deployment status;
- exact test commands/results;
- known NOT VERIFIED boundaries.

CA will then perform the governed Level 1 Sprint4 audit independently.

## 5. Implementation independence

This approval authorizes scope, not implementation mechanics.

CA is not pre-approving or prescribing:
- schema shape;
- RPC layout;
- lock strategy;
- storage path structure;
- signing/public URL mechanism;
- registry synchronization implementation;
- exact concurrency algorithm;
- exact test attack sequence.

CD owns construction. CA owns falsification.

## 6. Next action

CD may now implement the approved bounded Sprint4 Asset Manager V2 scope using additive migration **018+**, including the three canonical-coverage conditions above.

When complete, submit the implementation for Level 1 CA audit.

No additional user approval is required for that governed implementation/audit handoff.
