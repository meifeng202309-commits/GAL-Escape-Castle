# Package C — C-CA-001 Narrow Recheck

## Audit identity

- Audit owner: CA
- Branch: `remediation/sprint9-structural-v1`
- Prior B/C checkpoint: `e692dfa7de8130caefb2cae5a9534cf06a7a7471`
- Corrected implementation SHA: `949ab1d4d840729f0969e36b0f9dfef15f275a2f`
- CD handoff: `agent-comms/CD_to_CA_20260929T042417Z_package-c-c-ca-001-corrected-narrow-recheck.md`
- Prior finding: `C-CA-001 HIGH`
- Decision: **PASS — C-CA-001 CLOSED; Package C PASS; Package D RELEASED**

## Scope

This is the bounded recheck required by the prior Packages B/C checkpoint. CA independently checked the original residual, changed authority/interface surfaces, reconnect persistence, hidden-information boundary, provenance, and adjacent Package A/B regression evidence. This is not the final integrated Level2 closure.

## Independent findings

### 1. Canonical Pocket inspection is now a real player action

The root client no longer treats most carried objects as name-only Pocket entries. Uninspected owned items render an explicit inspect action. After authoritative inspection, canonical internal content is rendered from existing localization keys.

Verified mappings include:
- Gitte Castle Map;
- Gitte Number Note;
- Gitte Flashlight;
- Anna Servant Diary;
- Linda Stopped Watch;
- Linda Silver Key;
- Linda Municipal Closure Order.

The Number Note front uses existing canonical `act01-g.007`; its back uses `act01-g.029`. Diary and Closure Order likewise reuse existing canonical localization content. No new canonical prose is introduced by the correction.

### 2. The original Number Note failure is closed

The correction adds server-authoritative `s9_inspect_pocket_item`.

For the Number Note:
- carrying alone does not create number-code or star-symbol knowledge;
- inspection requires physical ownership;
- front inspection records only `gitte_number_code`;
- FLIP is rejected before inspection;
- an actual back-view transition records `gitte_star_symbol`;
- current view and inspection state are returned by `s3_get_player_state`.

This closes the prior failure where Gitte could carry the Number Note but could not reopen it later to recover `41739`.

### 3. Hidden-information and authority boundaries remain intact

The new inspect RPC validates `physical_owner_id` server-side. The live test includes a foreign-item inspection rejection.

Inspect state is keyed by `run_id + player_id + item_key`; therefore room/run and player ownership are not collapsed.

The client does not manufacture inspection success or knowledge. Knowledge creation remains server-side through the existing provenance mechanism with source `pocket_inspection` and source item identity.

Front inspection does not auto-reveal back-only information.

### 4. Reconnect contract is materially covered

`s3_get_player_state` now projects `inspected_item_keys` alongside authoritative items/current views/knowledge.

CD's live E2E evidence exercises:
- Number Note inspect and FLIP;
- Diary inspect;
- Closure Order inspect;
- Watch inspect and FLIP;
- foreign-item rejection;
- pre-inspect FLIP rejection;
- transition to ACT9 and reconnect persistence.

The test specifically checks that Linda's inspected Watch/Closure Order state and Watch back view survive the cross-ACT reconnect.

### 5. Adjacent regression boundary

The correction is bounded to Package C and directly affected tests/migration/client behavior. CD reports Package A live regression PASS, Package B live regression PASS, Sprint3A authority/provenance live regression PASS, affected static checks PASS, JavaScript parse PASS, and diff hygiene PASS.

CA source review found no contradictory evidence reopening Package A or Package B at this checkpoint.

## Disposition

```text
C-CA-001 = CLOSED
Package C = PASS
Package B = remains PASS
Package D = RELEASED
NEXT_OWNER = CD
```

Per `docs/plans/CD_STRUCTURAL_REMEDIATION_EXECUTION_PLAN_V0.1.md`, Package D may now proceed as the localized correction package:
- D1 / PFC-004: stale Sprint6 status/error clearing;
- D2 / PFC-006: consume existing canonical ACT4/Main Gate visual anchors/composite requirements;
- D3 / PFC-007: render already-projected `act4_revealed` without creating new reveal authority.

After Package D, the frozen sequence remains E1 full deterministic browser regression → integrated correction baseline → CA Level2 targeted independent closure. Package D release does not itself constitute final remediation PASS.
