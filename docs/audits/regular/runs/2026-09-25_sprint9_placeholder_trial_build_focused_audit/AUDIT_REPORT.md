# Sprint9 Placeholder-First Trial Build — Focused CA Audit

## Audit identity

- **Audit owner:** CA
- **Audit type:** Focused trial-build audit
- **Trigger:** `agent-comms/CD_to_CA_20260925T180000Z_sprint9-placeholder-trial-build-audit-request.md`
- **Frozen implementation baseline:** `d94abcaf9ed27e6c8de5dfb4dbc8ca7d63a39216`
- **Parent:** `36a183ff2705d2ef3405d6e7dfad73b0139d5dd1`
- **User objective:** make the game runnable for repeated Teacher trial runs before final student-provided media arrives
- **Decision:** **FAIL / TRIAL-RUN RELEASE BLOCKED by one bounded finding**
- **Canonical Ownership Check:** **PASS**

## Scope reviewed

The audit independently reviewed:

- image placeholder fallback;
- preservation of Asset Manager authority;
- explicit trial-placeholder files;
- missing-audio safe consumption;
- repeated render/poll behavior;
- adjacent trial-runtime interaction surfaces.

This is **not** final Sprint9 asset acceptance.

## Accepted behavior

### Image fallback

The client remains resolver-first:

```text
asset_resolve(asset_key)
→ if ACTIVE asset exists: use runtime storage path
→ if no usable ACTIVE asset: render a visibly distinct trial placeholder
```

The placeholder path does not mutate registry, candidate status, review state, or ACTIVE state.

Explicit placeholder files referenced for ACT1 openings and ending exterior exist in the frozen repository baseline.

Generic fallback remains visibly marked through:

- `trial-asset-placeholder`;
- `data-placeholder-asset-key`;
- alt text beginning `Temporary media placeholder:`.

### Audio fallback

The missing-audio path uses the existing occurrence identity and writes the existing legal `stopped` consumption outcome.

The authoritative database contract explicitly permits:

```text
outcome in ('ended','stopped')
```

Therefore missing audio does not block polling/finalization and does not fabricate successful playback.

### Authority preservation

No migration, asset key, review status, ACTIVE version, canonical gameplay meaning, or runtime publication authority changed in the trial patch.

Canonical Ownership Check = **PASS**.

---

# Finding

## S9-TRIAL-001 — MEDIUM
### Poll-amplified placeholder telemetry turns an expected trial condition into high-frequency failure writes

### Evidence chain

The player runtime polls every **1.2 seconds**:

```text
startPolling()
→ setInterval(refreshState, 1200)
```

Each refresh re-renders the current scene and calls `setS5Asset(...)` again for visible image slots.

For a missing/non-ACTIVE image:

```text
setS5Asset()
→ rpc("asset_resolve")
→ NO_ACTIVE_ASSET
→ applyTrialPlaceholder(...)
```

But the authoritative `asset_resolve` RPC records an `asset_load_failed` event every time it resolves a registry key with no ACTIVE candidate.

Thus an intentionally missing image during the placeholder-first trial phase is not merely represented once as an expected temporary absence; normal UI polling repeatedly creates new failure events for the same unchanged condition.

With three player clients, a single persistent missing image slot can generate roughly:

```text
3 clients × 50 polls/minute ≈ 150 failure-event writes/minute
```

Scenes showing multiple unresolved assets can multiply this further.

### Why this blocks repeated Teacher trial runs

The User explicitly wants **several trial runs** before final media exists. During this phase, missing production assets are expected.

Poll-amplified logging therefore:

- creates large volumes of low-information failure telemetry;
- makes expected placeholder state look like repeated new runtime failures;
- increases unnecessary database writes during every trial;
- makes real asset/runtime failures harder to distinguish in later diagnosis.

This is directly contrary to the purpose of the trial phase: surface meaningful gameplay/runtime defects without manufacturing telemetry noise from the temporary-media strategy itself.

### Closure condition

CD must correct only this polling/telemetry behavior.

The corrected trial runtime must satisfy all of the following:

1. a stable missing/non-ACTIVE asset may still produce observable missing-asset evidence;
2. ordinary 1.2-second polling/rendering must **not** create a fresh `asset_load_failed` record on every refresh for the same unchanged missing-asset condition;
3. a genuinely new or changed failure condition must remain observable;
4. an ACTIVE asset whose storage object actually fails to load must not be silently conflated with the expected NO_ACTIVE placeholder condition;
5. placeholder rendering remains resolver-first and does not mutate Asset Manager authority.

CA is not prescribing cache structure, deduplication location, RPC shape, or internal implementation.

### Required regression evidence

At minimum, submit evidence for:

- repeated refresh/render against one unchanged missing asset showing bounded telemetry rather than one failure record per poll;
- an ACTIVE-asset load failure remaining distinguishable/observable from expected NO_ACTIVE trial placeholder behavior;
- existing placeholder rendering and missing-audio `stopped` behavior remaining intact.

---

## Non-blocking trial limitation

The client currently references 14 of the 22 runtime-required image asset keys directly; eight prop-image keys are not yet bound as image elements in the current player client.

This is **not opened as a second trial-release blocker** because the current request is a temporary gameplay trial build, not final Sprint9 asset acceptance, and the affected prop information currently has textual/runtime representations.

However final Sprint9 asset integration must not treat those unbound runtime-required image identities as already complete merely because the placeholder-first trial build is runnable.

---

## Pattern review

- **Pattern A — cross-module handoff:** PASS for placeholder and audio fallback.
- **Pattern B — stale/retry/repetition:** **FAIL narrowly** because normal polling amplifies one stable absence into repeated failure events.
- **Pattern C — UI vs server authority:** PASS; placeholders do not modify Asset Manager authority.
- **Pattern D — historical evidence:** PASS for audio occurrence consumption; image telemetry quality is the bounded finding above.
- **Pattern E — authority accretion:** PASS.
- **Pattern F — verification quality:** PARTIAL; the new static test verifies fallback tokens/order but does not exercise repeated polling against authoritative failure telemetry.

## Final disposition

```text
Placeholder rendering                = ACCEPTED
Missing-audio stopped fallback       = ACCEPTED
Asset Manager authority preservation = ACCEPTED
Canonical Ownership Check            = PASS

S9-TRIAL-001 MEDIUM                  = OPEN

Teacher repeated-trial release       = BLOCKED pending narrow correction
Final Sprint9 asset acceptance       = NOT EVALUATED
Sprint10                             = NOT RELEASED
```

## Next owner

**NEXT_OWNER = CD**

Correct only `S9-TRIAL-001`, preserve the accepted placeholder/audio behavior, add direct repeated-refresh telemetry evidence, and submit one frozen narrow re-audit baseline.

No Teacher approval is required for this bounded correction.
