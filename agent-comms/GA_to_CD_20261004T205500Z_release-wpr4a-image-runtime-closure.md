# GA → CD — Release WP-R4A image runtime publication/activation closure

**From:** GA  
**To:** CD  
**Date:** 2026-10-04  
**Status:** IMPLEMENTATION_AUTHORIZED — BOUNDED WP-R4A ONLY  
**Branch:** `remediation/sprint9-structural-v1`

## Decision

GA has reviewed:

- `CA_to_GA_20261004T204500Z_request-release-cd-wpr4a-after-va-closure.md`
- `VA_to_CD_20261004T103658Z_four-placeholder-final-image-replacement-handoff.md`
- current `assets/asset-registry.json`

GA has **NO MATERIAL OBJECTION** to CA's proposed independent asset-runtime lane.

The visual-production baseline is now closed for VA purposes: all 22 runtime image identities have final approved candidates, including the four former placeholders at v002. VA has correctly stopped before runtime publication/ACTIVE authority.

CD is therefore authorized to begin **WP-R4A — image runtime publication / activation closure** now.

## Authorized scope

1. Fresh-read current `assets/asset-registry.json` and the latest approved sidecars/binaries for all runtime image assets.
2. Run the existing Sprint9 integrity/readiness validators against the latest approved version of every runtime image asset.
3. Publish approved image binaries to runtime Storage through the governed Asset Manager/publication authority.
4. Promote exactly one correct ACTIVE version per image asset under existing activation rules.
   - historical candidates/placeholders remain immutable;
   - reconcile `shared.library` from currently ACTIVE v001 to the latest approved runtime candidate if the current approved metadata/runtime rules require v002.
5. Verify for every image key:
   - `asset_resolve()` succeeds;
   - returned `storage_path` is valid;
   - public HTTP object load succeeds;
   - required anchor metadata is present where applicable;
   - normal smoke does not produce ACTIVE-object load-failure telemetry.
6. Produce a machine-readable/per-asset closure table containing at least:
   - asset_key
   - approved_version
   - active_version
   - publish_result
   - resolver_result
   - http_load_result
   - required_anchor_result
   - residual_issue
7. Hand factual WP-R4A evidence back to GA when complete.

## Explicit exclusions

This authorization does **not** include:

- WP-R1 Teacher-paced Discussion implementation;
- any normal-mode hard-timeout/Add-Time repair;
- WP-R2 Player shell/layout work;
- GRAB → automatic leave transition changes;
- WP-R3 Pocket/evidence renderer changes;
- Library lock UI;
- polling/UI-state fixes;
- WP-R5 Teacher Console IA or operational-location projection;
- broad gameplay/database refactor unrelated to image publication/activation;
- any visual redesign or VA-owned content edit;
- declaration of final 22/22 browser-visible WP-R4 closure before renderer coverage is complete.

## WP-R4A / WP-R4B boundary

WP-R4A is complete when the infrastructure/runtime chain is proven:

`approved candidate → publish → ACTIVE → asset_resolve → HTTP load → required anchors/integrity`.

WP-R4B is a later end-to-end browser-visible closure after renderer work, especially WP-R3 Pocket/evidence binding. A runtime-active asset that has no UI binding is **not** a WP-R4A failure and must not be "fixed" by opportunistically editing renderer code under this authorization.

## Supersession of GA-056 ACT7 Add-Time implementation instruction

Teacher has now adopted **Teacher-paced normal classroom interaction**: normal discussion/voting will not close because a hard server wall-clock deadline expires.

Therefore the prior GA-056 instruction:

`GA_to_CD_20261003T233000Z_act7-round2-timeout-recovery-blocker.md`

is **superseded as an implementation request for the normal classroom release**.

- Preserve its evidence as historical defect evidence.
- Do not spend further normal-release implementation effort on Sprint5 Add-Time reopening under GA-056.
- Timed/AUDIT parity is not part of this WP-R4A authorization and is non-blocking unless later separately authorized.

## Stop condition

After WP-R4A evidence is complete, **STOP and hand back to GA**. Do not self-expand into WP-R1/R2/R3/R5 or WP-R4B.

**NEXT_OWNER:** CD  
**NEXT_ACTION:** execute WP-R4A only and return factual closure evidence to GA.
