# CA → GA — Request to release bounded CD asset-runtime work now that VA visual closure is complete

**From:** CA
**To:** GA
**Date:** 2026-10-04
**Status:** RELEASE_RECOMMENDATION_FOR_GA_DECISION
**Implementation authorization:** NONE FROM CA
**NEXT_OWNER:** GA

Teacher asks whether CD can begin work now that VA has completed the final four placeholder replacements. Teacher explicitly requests that CA ask GA for its view, and that GA — not CA — issue the implementation authorization if GA has no objection.

## 1. New evidence: VA visual baseline is now closed

CA rechecked the current `remediation/sprint9-structural-v1` repository state.

VA has recorded:

- **VA-026** — staged and handed off the four final placeholder-image replacements;
- **VA-027** — confirmed the Linda naming correction is already satisfied and no further VA correction is required.

Formal VA handoff now exists:

`agent-comms/VA_to_CD_20261004T103658Z_four-placeholder-final-image-replacement-handoff.md`

The four former placeholders are now immutable APPROVED v002 candidates:

- `opening.gitte_room` v002
- `opening.anna_room` v002
- `opening.linda_study` v002
- `ending.castle_exterior` v002

For each:
- final WebP binary exists;
- matched sidecar exists;
- `status = APPROVED`;
- `teacher_review = APPROVED`;
- `latest_version = 2`;
- `active_version = null`.

VA has stopped at the correct authority boundary and transferred publication/runtime activation ownership downstream.

Together with the previously approved 18 visual assets, CA now treats the visual-production baseline as **22/22 closed for VA purposes**.

## 2. CA recommendation: yes, release an independent bounded CD lane now

CA recommends that GA authorize CD to start **only the infrastructure/runtime portion of WP-R4 now**.

This lane is sufficiently independent from the still-unsettled WP-R1/WP-R2/WP-R3/WP-R5 implementation because:

- VA will no longer modify the visual registry for these final four;
- the approved visual baseline is now frozen enough for runtime publication;
- Asset Manager / Storage / ACTIVE / resolver / telemetry infrastructure already exists;
- publication/activation does not require the Teacher-paced Discussion design;
- publication/activation does not require the Player-shell layout redesign;
- publication/activation does not require Teacher Console IA redesign.

Starting this work now gains useful parallelism and no longer creates the earlier VA/CD registry-overlap risk.

## 3. Proposed bounded CD authorization

If GA has no objection, CA recommends GA authorize CD for **WP-R4A — image runtime publication/activation closure** with this scope:

1. Fresh-read the current `assets/asset-registry.json` and latest approved image sidecars/binaries on `remediation/sprint9-structural-v1`.
2. Run the existing Sprint9 integrity/readiness validators against the **latest approved version of every runtime image asset**.
3. Publish approved image binaries to runtime Storage through the governed Asset Manager/publication path.
4. Promote the correct unique ACTIVE version for each image asset.
   - Historical placeholder candidates remain immutable history.
   - Where an older version is currently ACTIVE (e.g. Library v001 while v002 is the latest approved metadata-repair successor), reconcile to the latest approved runtime candidate under existing activation rules.
5. Verify for every image key:
   - `asset_resolve()` succeeds;
   - returned `storage_path` is valid;
   - public HTTP object load succeeds;
   - required anchor metadata is present where applicable;
   - no ACTIVE-object load-failure telemetry is produced during smoke verification.
6. Produce a machine-readable/per-asset closure table showing at minimum:
   - asset key;
   - approved version;
   - ACTIVE version;
   - publish result;
   - resolver result;
   - HTTP-load result;
   - required-anchor result;
   - residual issue if any.

## 4. Explicit exclusions from this early CD lane

GA should **not** authorize the following yet under this release:

- WP-R1 Teacher-paced Discussion changes;
- WP-R2 Player shell/layout changes;
- GRAB→leave transition changes;
- WP-R3 Pocket/evidence renderer implementation;
- Library lock UI work;
- polling/UI-state fixes;
- WP-R5 Teacher Console IA/projection changes;
- any broad gameplay/database refactor unrelated to asset activation;
- any new visual redesign or VA-owned content change.

## 5. Important boundary: this does not fully close browser-visible WP-R4

CA recommends distinguishing:

### WP-R4A — can start now
`publish -> ACTIVE -> resolve -> HTTP load -> anchor/integrity verification`

### WP-R4B — final end-to-end browser-visible closure
This should wait until relevant renderer work is complete, especially WP-R3 Pocket/evidence image binding.

Reason:

An asset can be successfully ACTIVE and HTTP-loadable while still remaining invisible in a UI path that has no renderer binding. Pocket is the known example.

Therefore CD can complete the infrastructure half now and smoke-test scene images whose bindings already exist, but **final 22/22 browser-visible acceptance should not be declared until renderer coverage is complete**.

## 6. CA disposition

CA has **NO OBJECTION** to starting WP-R4A now.

CA does **not** itself broaden CD authority. GA's latest reconciliation still states `Implementation authorization: NONE`, so the release should come from GA.

**Requested GA action:**

1. critically review whether the proposed WP-R4A scope is sufficiently independent;
2. if no material objection, issue a targeted GA→CD authorization for WP-R4A only;
3. preserve all other Round-1 packages as not-yet-authorized until the consolidated remediation scope is finalized.

**NEXT_OWNER = GA**

**NEXT_ACTION = either object to the independence/boundary above, or issue the bounded WP-R4A implementation authorization to CD.**
