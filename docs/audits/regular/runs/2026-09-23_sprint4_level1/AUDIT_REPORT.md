# Sprint4 Asset Manager V2 — Level 1 CA Audit

Baseline: `3a2ccffe4631e5e6e98b4330c24729da75dcf679`  
Scope: bounded Sprint4 Asset Manager V2  
Audit level: Level 1 — Regular CA Audit  
Decision: **FAIL / BLOCKED — NARROW CORRECTIONS REQUIRED**

## 1. Scope reviewed

Implementation commits declared by CD:

- `48d0371c03c5d766fd7ed2b813f1aab5ec4eb97a`
- `bfd3fd6aef2b087ccefad2305c427ccfbebbae39`
- `4119bad5ad864661af885c6f0cab7cce2c4c42e8`
- `3a2ccffe4631e5e6e98b4330c24729da75dcf679`

Changed implementation surface reviewed:

- migrations `018`–`023`;
- `assets/asset-registry.json`;
- `scripts/publish-asset-candidate.mjs`;
- Teacher Asset Manager UI/runtime code;
- Sprint4 static/live tests;
- prior Sprint1 Teacher-room authority boundary.

Canonical / approved-scope basis:

- Game Script V4.0 §50;
- Codex Guide V2.3 Sprint4;
- CA Sprint4 scope approval with S4-SCOPE-01/02/03.

All deployed Sprint4 migrations 018–023 are unchanged from the commits that introduced them. Any correction must therefore be additive at migration **024+**.

## 2. Findings

### S4-CA-001 — HIGH — Global Asset Manager Teacher authority can be self-issued through public room creation

The browser-facing global Asset Manager functions `asset_manager_review(...)`, `asset_manager_state(...)`, and `asset_manager_save_anchors(...)` accept a Teacher token if its hash exists in **any** `s1_rooms` row.

However `s1_create_room(...)` is intentionally executable by `anon, authenticated`, and the caller chooses the Teacher token for the new room.

Therefore an anonymous browser can:

1. create an arbitrary new Sprint1 room with a Teacher token it chose;
2. use that token as valid global Asset Manager Teacher authority;
3. read global candidate IDs/state;
4. approve/reject PENDING candidates or alter anchors on PENDING/APPROVED candidates.

This is not merely a UI issue; the server authorization predicate itself confers global asset authority from a self-created room credential.

Impact:

- semantic review authority is not restricted to the project Teacher/operator;
- pending asset review evidence can be forged or destroyed;
- approved candidate anchor metadata can be altered before activation;
- global asset governance can be mutated by an unauthenticated Internet client.

Closure condition:

Global Asset Manager semantic-review/anchor authority must not be obtainable solely by creating an ordinary playable room. Existing room-scoped Teacher semantics must remain intact.

CA is not prescribing the replacement identity/authentication mechanism.

---

### S4-CA-002 — HIGH — Controlled publisher automatically performs the Teacher semantic approval decision

`scripts/publish-asset-candidate.mjs` performs, in one automated execution:

1. register candidate;
2. upload binary to Storage;
3. call `asset_manager_review(..., 'APPROVED', ...)`;
4. mark candidate published.

The script supplies the fixed reviewer label `Teacher-approved staging evidence`.

This violates the approved Sprint4 authority split and explicit exclusion of automatic semantic approval:

- Teacher/user owns semantic Review → Approve/Reject;
- CD/Asset Manager owns APPROVED → publish/copy → runtime metadata/ACTIVE path.

The presence of `ASSET_MANAGER_TEACHER_TOKEN` in an operator environment does not itself prove that a human semantic review occurred, and the generated runtime approval record does not bind to immutable external review evidence.

Impact:

- an operator publication command can create APPROVED state without a separate Teacher review act;
- review provenance claims a Teacher decision that the system did not independently observe;
- publication and semantic approval authorities collapse into one executable path.

Closure condition:

Publication must consume an already valid semantic approval state/evidence; the publication operation itself must not manufacture that approval.

---

### S4-CA-003 — HIGH — Paired-asset gate still permits a one-sided ACTIVE runtime pair

Migration 022 is described as preventing one-sided paired activation, but its partner predicate accepts a partner candidate whose status is any of:

`APPROVED / ACTIVE / SUPERSEDED`

provided that it is published and its registry projection points to the same numeric version.

Consequently candidate A can become `ACTIVE` while paired candidate B remains merely `APPROVED`.

At that moment:

- A resolves successfully as ACTIVE;
- B's registry may already name the target `active_version`;
- B's candidate is not ACTIVE, so `asset_resolve(B)` returns fallback;
- the paired set is internally inconsistent.

This directly contradicts the Sprint4 risk/invariant that ACTIVE promotion must not create an inconsistent paired visual set.

Closure condition:

When canonical metadata requires a pair to function as a coherent runtime set, the activation transition must not expose one member as ACTIVE while its required partner is non-ACTIVE/incoherent.

CA does not prescribe whether the implementation uses grouped activation, a readiness state, delayed visibility, or another mechanism.

---

### S4-CA-004 — HIGH — Registry drift evidence is caller-asserted and can silently represent mixed/stale projection state

`asset_manager_sync_registry(p_registry_sha256, p_assets)` stores the supplied 64-character hash but does not prove that:

- the hash actually corresponds to `p_assets`;
- `p_assets` corresponds to the committed `assets/asset-registry.json`;
- every existing projection key is present exactly once.

The end check compares only:

`seen == count(asset_registry_projection)`

A payload with one duplicated key and one omitted existing key can keep those counts equal. The omitted key remains stale while touched rows receive the new caller-supplied hash.

Thus the projection can contain mixed/stale canonical state while the sync returns success.

This violates binding S4-SCOPE-03: registry/runtime identity+version authority must not silently split, and drift evidence must be meaningful.

Closure condition:

A successful projection/sync must make omission, duplication and content/hash disagreement detectably fail or otherwise leave an unambiguous non-success reconciliation state.

---

### S4-CA-005 — MEDIUM — Teacher anchor UI cannot complete multi-anchor canonical assets

The Teacher UI always selects:

`candidate.required[0]`

as the anchor being drawn/replaced.

For canonical assets with multiple required anchors — including Clock Room, Great Hall and Main Gate — reopening the tool continues to edit only the first required anchor. There is no UI selection/iteration over the second and later required anchors.

The DB activation guard correctly requires every required anchor name, so candidates without pre-populated sidecar anchors can become impossible to complete through the provided Teacher marking workflow.

Closure condition:

The bounded Teacher anchor workflow must allow every required canonical anchor for a candidate to be marked/reviewed, not only the first array entry.

---

### S4-CA-006 — MEDIUM — Upload lifecycle skips canonical states and leaves a non-retriable partial-failure state

The publisher registers a candidate as `PENDING_REVIEW` **before** attempting the Storage upload.

If the upload fails:

- the DB row remains PENDING_REVIEW although the object does not exist;
- the canonical `UPLOADED` stage was never represented;
- retrying the same sidecar through the same tool attempts to register the same `(asset_key, version)` again and hits the unique constraint.

In addition, the active implementation never transitions candidate rows through `ASSIGNED` or `UPLOADED`; the UI only derives some labels. This does not fully satisfy S4-SCOPE-01's requirement that all eight canonical lifecycle meanings be supported as actual workflow semantics where applicable.

Impact:

- network/storage failure can strand a candidate in a misleading reviewable state;
- normal retry is not idempotent/recoverable;
- Teacher may see PENDING_REVIEW for a candidate that never uploaded.

Closure condition:

The candidate lifecycle must distinguish the canonical pre-upload/uploaded/review-ready meanings and recover safely from a publication interruption without reusing or fabricating a different candidate identity.

---

### S4-CA-007 — MEDIUM — Generic publication path does not verify the published object checksum before recording publication

The canonical binary identity rule is:

reviewed SHA-256 = staged/published SHA-256.

The publisher verifies the local binary against the sidecar SHA before upload, but after Storage returns success it does not re-read/hash the stored object.

`asset_manager_mark_published(...)` only compares the caller-supplied SHA with the candidate row's expected SHA; it does not verify the bytes at `p_storage_path`.

CD separately reports a post-upload HTTP/SHA verification for `shared.library v1`, which is useful evidence for that one object, but the reusable publication path itself does not enforce this invariant.

Closure condition:

A candidate must not be recorded as successfully published unless the runtime publication evidence establishes that the published object identity matches the reviewed candidate SHA-256.

## 3. Areas that passed source review

### PASS — deployed migration immutability

Migrations 018–023 remain byte-identical to the commits in which each was introduced.

### PASS — service-role secret boundary in browser code

The browser Teacher code does not contain the Supabase service-role credential. Service-only registration/publication/activation functions are revoked from public/anon/authenticated and granted to `service_role`.

### PASS — one-ACTIVE row DB uniqueness for a single asset_key

The partial unique index prevents more than one `asset_candidates.status='ACTIVE'` row for the same asset key.

This does not cure S4-CA-003 because paired-set coherence is a cross-key invariant.

### PASS — exact-key resolver behavior

The resolver does not infer or normalize unknown asset keys and uses the projected canonical `active_version`.

### PASS — missing-asset explicit fallback path

Known assets without a matching ACTIVE candidate return explicit fallback metadata and log `asset_load_failed`; unknown keys fail explicitly.

## 4. Test / evidence review

CD reports:

- static suites PASS;
- Sprint4 live 10/10 PASS;
- Sprint1 40/40 PASS;
- Sprint2 23/23 PASS;
- Sprint3A 15/15 PASS;
- Sprint3B 44/44 PASS;
- Sprint3C 15/15 PASS;
- one real `shared.library v1` publication with post-upload SHA evidence.

These are supporting CD-reported results, not CA-executed live evidence.

Important test blind spots corresponding to the findings:

- the live test creates a normal room and then treats that room token as global Asset Manager authority; it therefore confirms the current authority path rather than challenging whether that authority should exist;
- no test separates human semantic review from operator publication;
- paired promotion is explicitly NOT VERIFIED live and source review shows the gate is insufficient;
- no duplicate/omitted/mismatched-hash projection test;
- no multi-anchor Teacher UI completion test;
- no upload-failure/retry test;
- no generic post-upload checksum enforcement test.

CD's declared NOT VERIFIED boundaries remain accurately disclosed; they are not by themselves the reason for this FAIL.

## 5. Recurring-error pattern scan

| Pattern | Result | Sprint4 audit result |
|---|---|---|
| A — local correctness / cross-module handoff | **FINDING** | paired candidates individually validate but the pair can become runtime-incoherent; GitHub canonical version state and runtime projection can diverge. |
| B — network / retry / distributed boundary | **FINDING** | register-before-upload can strand PENDING_REVIEW and makes normal retry fail on candidate uniqueness. |
| C — UI rule mistaken for authority | **FINDING** | server auth itself is too broad: any self-created room Teacher token becomes global asset-review authority. |
| D — mutable state / provenance | **FINDING** | automatic approval and caller-asserted registry hash weaken semantic-review and canonical-drift evidence. |
| E — authority accretion | **FINDING** | room-scoped Teacher credentials were reused as global Asset Manager authority without a separate authority boundary. |
| F — self-confirming tests | **FINDING** | tests validate intended helper paths but do not challenge the authority, review-separation, paired-state, retry or drift conditions above. |

## 6. Gate disposition

**Sprint4 = FAIL / BLOCKED**

Correction scope should remain limited to:

- S4-CA-001 through S4-CA-007;
- directly adjacent regression coverage.

Do not expand into Sprint5 ACT6–8 gameplay while this gate is open.

Any DB correction must be additive at migration **024+**. Do not modify deployed migrations 018–023.

After CD submits the narrow correction, CA will perform the already-governed focused Level 1 re-audit without waiting for further user approval.
