# S9-TRIAL-001-R1 Final Narrow Re-audit

## Audit identity

- **Audit owner:** CA
- **Audit type:** Final narrow re-audit
- **Trigger:** `agent-comms/CD_to_CA_20260925T190000Z_s9-trial-001-r1-final-narrow-reaudit-request.md`
- **Frozen baseline:** `6b8730f999a7de4aa58f0444d9a2f75f76377302`
- **Finding:** `S9-TRIAL-001-R1`
- **Decision:** **PASS / FIXED_VERIFIED**
- **Repeated Teacher trial release:** **RELEASED**
- **Canonical Ownership Check:** **PASS**

## Closure verification

The residual was:

```text
ACT6 overlay.portrait_eyes_open
→ direct rpc("asset_resolve")
→ repeated 1.2s rendering could recreate poll-amplified NO_ACTIVE telemetry
```

Baseline `6b8730f` replaces that direct path with:

```text
trialAssetResolver.resolve("overlay.portrait_eyes_open")
```

Therefore both the ACT6 Portrait Hall base and required eye overlay use the same 30-second per-client bounded resolver behavior.

## Regression evidence reviewed

The executable cache behavior test now explicitly models:

```text
shared.portrait_hall = ACTIVE
overlay.portrait_eyes_open = NO_ACTIVE
20 repeated ACT6 render-equivalent resolutions
```

Expected result is enforced:

```text
Portrait Hall base asset_resolve calls = 1
missing overlay asset_resolve calls     = 1
within the cache window
```

The static integration test also requires:

- overlay use of `trialAssetResolver.resolve`;
- absence of direct `rpc("asset_resolve")` in the ACT6 overlay branch;
- distinct ACTIVE overlay storage-object failure reporting.

## ACTIVE storage-object failure behavior

The overlay `onerror` path now invokes:

```text
trialAssetResolver.reportActiveLoadFailure(overlay)
```

This preserves the migration058 distinction:

```text
expected NO_ACTIVE trial fallback
!=
genuine ACTIVE_STORAGE_OBJECT_LOAD_FAILED
```

The existing migration058 server-side authority checks remain unchanged:

- exact current ACTIVE asset key/version/path required;
- published candidate required;
- unchanged failure deduplicated for five minutes.

## Accepted parent behavior preserved

Verified unchanged from the parent audit chain:

- resolver-first placeholder behavior;
- temporary placeholders remain visually distinct;
- placeholders do not mutate registry/review/ACTIVE state;
- missing production audio uses the legal `stopped` outcome;
- no canonical asset-key/gameplay meaning drift;
- no migration059 introduced.

## Pattern review

- **Pattern A — cross-module handoff:** PASS.
- **Pattern B — stale/retry/repetition:** PASS; both base and overlay poll-driven image resolution are bounded.
- **Pattern C — UI vs server authority:** PASS.
- **Pattern D — historical evidence:** PASS; NO_ACTIVE and ACTIVE object failures remain distinct.
- **Pattern E — authority accretion:** PASS.
- **Pattern F — verification quality:** PASS for this narrow closure; direct executable fixture covers the previously missing progressive-replacement case.
- **Canonical Ownership Check:** PASS.

## Migration state

```text
001–058 = immutable deployed history
next additive migration = 059+
```

## Final disposition

```text
S9-TRIAL-001             = FIXED_VERIFIED
S9-TRIAL-001-R1          = FIXED_VERIFIED

Placeholder-first trial runtime = RELEASED
Repeated Teacher trial runs      = AUTHORIZED / RELEASED

Final Sprint9 asset acceptance   = NOT YET COMPLETE
Student/final media replacement  = STILL PENDING under existing workflow
Sprint10                         = NOT RELEASED
```

The User may now run the game repeatedly using temporary media to discover gameplay/runtime defects before final student-provided media is installed.

## Next owner

**NEXT_OWNER = CD + Teacher trial phase**

- Teacher/User may begin repeated trial runs.
- CD owns runtime remediation for concrete defects discovered during those runs.
- VA/CD continue the separate final-media replacement/integration workflow.
- CA re-enters only when a new audit trigger is submitted or a trial defect requires independent audit.

No duplicate Teacher approval is required.
