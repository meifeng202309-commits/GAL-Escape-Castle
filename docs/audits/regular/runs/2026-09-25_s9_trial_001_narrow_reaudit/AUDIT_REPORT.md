# S9-TRIAL-001 Narrow Re-audit

## Audit identity

- **Audit owner:** CA
- **Audit type:** Narrow re-audit
- **Trigger:** `agent-comms/CD_to_CA_20260925T183000Z_s9-trial-001-narrow-reaudit-request.md`
- **Frozen baseline:** `b2788fe52a658abb99a8c96af7eb3f3505f5034c`
- **Finding:** `S9-TRIAL-001`
- **Decision:** **PARTIALLY FIXED / ONE RESIDUAL REMAINS**
- **Repeated Teacher trial release:** **BLOCKED pending one final narrow correction**
- **Canonical Ownership Check:** **PASS**

## What is fixed

The main scene-image path now uses a 30-second per-client/per-asset resolver cache:

```text
setS5Asset()
→ trialAssetResolver.resolve(assetKey)
→ cache hit for unchanged key/result within 30s
→ no new asset_resolve call on every 1.2s render
```

The supplied executable behavior test demonstrates that 20 unchanged resolves generate one `asset_resolve` call, with another resolve after TTL expiry.

Migration058 adds a distinct ACTIVE-object load-failure reporting path:

```text
asset_report_load_failure(asset_key, version, storage_path)
```

The RPC:

- accepts only metadata matching the current ACTIVE candidate;
- requires a published ACTIVE candidate;
- labels the event `ACTIVE_STORAGE_OBJECT_LOAD_FAILED`;
- deduplicates the same ACTIVE identity/path for five minutes under an advisory lock;
- does not accept the expected NO_ACTIVE trial-placeholder condition.

This preserves observability of a real storage-object failure while separating it from expected placeholder state.

Accepted behavior from the parent audit remains intact:

- trial placeholders remain resolver-first;
- placeholders do not mutate review/ACTIVE state;
- missing audio still uses the legal `stopped` consumption path;
- migrations001–057 remain immutable;
- migration058 is additive.

## Residual

### S9-TRIAL-001-R1 — MEDIUM
#### ACT6 Portrait eye overlay bypasses the new resolver cache

The main image slots were converted to `trialAssetResolver.resolve(...)`, but `hydrateS5Assets` still resolves the required Portrait Hall eye overlay directly:

```text
rpc("asset_resolve", { p_asset_key: "overlay.portrait_eyes_open" })
```

This path is reached whenever:

- ACT6 Portrait Hall base image resolves successfully; and
- `overlay.portrait_eyes_open` is still missing/non-ACTIVE.

Because `refreshState` polls every 1.2 seconds and re-renders ACT6, that direct resolver call recreates the exact original failure mode:

```text
1.2s poll
→ ACT6 render
→ base image resolves
→ direct overlay asset_resolve
→ NO_ACTIVE_ASSET
→ asset_load_failed row
→ repeat
```

The Asset Registry confirms:

```text
overlay.portrait_eyes_open
runtime_required = true
active_version = null
```

At the frozen baseline, `shared.portrait_hall` itself is also not ACTIVE, so the residual is not currently exercised because the function returns before overlay resolution.

However the User's placeholder-first trial strategy explicitly allows assets to be replaced progressively. If the base Portrait Hall asset becomes ACTIVE before its paired overlay, the poll-amplified telemetry defect immediately reappears.

Therefore the original finding is not fully closed at the code-path level.

## Closure condition

Correct only the remaining direct image resolver path so that every poll-driven runtime-required image resolution that may encounter expected NO_ACTIVE trial state uses the bounded resolver behavior.

At minimum:

1. `overlay.portrait_eyes_open` must not bypass the bounded resolver path;
2. repeated ACT6 renders with ACTIVE Portrait Hall base + missing overlay must not create one NO_ACTIVE telemetry event per poll;
3. a genuine ACTIVE overlay storage-object load failure must remain distinguishable/observable;
4. accepted placeholder and audio behavior remain unchanged;
5. no unrelated Sprint9 asset or gameplay work is reopened.

A focused executable regression should include the ACT6 base-active / overlay-missing case.

## Migration state

```text
001–058 = immutable deployed history
next additive migration = 059+
```

No migration is necessarily required for this residual.

## Final disposition

```text
S9-TRIAL-001 main path      = FIXED / VERIFIED
S9-TRIAL-001-R1 overlay path = OPEN

Teacher repeated-trial release = BLOCKED pending one final narrow correction
Final Sprint9 asset acceptance = NOT EVALUATED
Sprint10 = NOT RELEASED
```

## Next owner

**NEXT_OWNER = CD**

Correct only the ACT6 overlay cache bypass, add direct regression evidence, and submit one final narrow re-audit baseline.

No Teacher approval is required.
