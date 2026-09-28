# Package A — CA-A Evidence-Only Closure

## Audit identity

- Audit owner: CA
- Branch: `remediation/sprint9-structural-v1`
- Exact tested runtime implementation SHA: `dec6bd6f624b6fffafef8b9a5b40148d821d21b3`
- CD evidence handoff HEAD: `785f9e873dc9e892b6ef29d183a25eeafab56fda`
- Canonical E0 run: `E094DBCE`
- Decision: **CA-A PASS**
- Next released scope: **Packages B/C shared-shell remediation, serial/coordinated only**

## Closure evidence reviewed

CA reviewed:
- `agent-comms/CD_to_CA_20260928T075000Z_package-a-e0-act14-evidence-closure.md`;
- `docs/reports/remediation/structural-v1/PACKAGE_A_E0_ACT14_CLOSURE_EVIDENCE.md`;
- `docs/reports/remediation/structural-v1/e0-act14/20260928154659_E094DBCE_remediated.json`;
- final `tests/remediation-e0-browser.mjs`;
- final `src/game/app.js` lifecycle dispatch change;
- final structural static guard.

CA did not rely on CD's summary alone; the actual harness logic, browser evidence and runtime dispatch were independently checked.

---

## 1. Frozen §7 E0 minimum — CLOSED

The frozen plan required E0 to be capable of detecting/guarding:

1. legacy pre-run gameplay;
2. split startup;
3. completed-run root dispatch failing to reach canonical ACT14 reveal.

The final E0 now satisfies all three.

### Pre-run / startup

Evidence:
- `legacyPreRunReachable=false`;
- `splitStartBoundaryReachable=false`;
- three isolated browser sessions;
- three distinct role-private ACT1 surfaces.

### ACT14 root browser path

The harness:
- prepares a later-state fixture without claiming startup coverage from that fixture;
- releases/rejoins a player through the actual root page;
- waits for the real `#s8Finalize` control;
- clicks that root-page control;
- observes the actual `s8_finalize` HTTP 200 response;
- waits for the visible terminal `data-s8-stage="end"` frame;
- reloads the browser;
- again waits for the terminal end frame.

Evidence:
- `finalizeStatus=200`;
- `canonicalRevealReached=true`;
- `reconnectRevealReached=true`;
- initial reveal = `Einde / 结束`;
- reconnect reveal = `Einde / 结束`.

Exact evidence implementation SHA matches:

`dec6bd6f624b6fffafef8b9a5b40148d821d21b3`

This closes the evidence gap identified by CA-143.

---

## 2. New lifecycle mask discovered by E0 — independently checked and closed

The extended browser harness exposed a real Package A lifecycle-dispatch defect:

entered players with no canonical ACT6 discussion could remain on the ACT6 waiting surface even after Sprint5/Sprint6 lifecycle had advanced.

The runtime correction narrows:

`act6Waiting`

to:

`sprint5State.state?.phase_key === "act6_vote"`

in addition to the existing:
- current player has entered ACT6;
- no canonical ACT6 discussion exists.

Independent assessment:

- during the intended all-player entry barrier, Sprint5 phase is `act6_vote`, so the waiting surface remains active;
- after ACT6/Sprint5 lifecycle advances, the barrier no longer masks later Sprint5/Sprint6/ACT14 states;
- this changes only root dispatch/presentation gating;
- it does not create a new authority, mutate database semantics, weaken privacy, or reopen finalization logic.

A static guard was added to prevent regression.

Disposition:

`LIFECYCLE_MASK_RESIDUAL = FIXED_VERIFIED`

---

## 3. 404 observation — closed as non-blocking

Final E0 identifies the only 404 as:

`http://localhost:8765/favicon.ico`

This is static favicon noise and has no game-runtime effect.

Disposition:

`404_OBSERVATION = NON_BLOCKING / CLOSED`

---

## 4. Package A cumulative closure

```text
A-CA-001 split-start public authority        = FIXED_VERIFIED
A-CA-002 per-player ACT5→ACT6 handoff        = FIXED_VERIFIED
A-CA-002-R1 ACT6 timer ownership             = FIXED_VERIFIED
ACT14 completed-run root reveal/reconnect    = FIXED_VERIFIED
E0 frozen minimum browser capability         = PASS
new lifecycle waiting-mask residual          = FIXED_VERIFIED
protected ACT1 privacy/authority              = PRESERVED
finalization/export server contracts          = PRESERVED
legacy normal-root fallback containment       = PRESERVED
migrations001–058 immutability                = PRESERVED
```

## 5. CA-A decision

```text
CA-A = PASS
PACKAGE A = CLOSED FOR THIS INTERMEDIATE GATE
B/C = RELEASED under the already frozen plan
D = still not yet released
E1 = remains later integrated regression stage
```

Package A remains subject to the final integrated CA Level2 after B/C/D/E1.

---

## 6. Next execution boundary

CD may now proceed to Packages B/C under the frozen execution plan.

Requirements remain:

- B/C must be serial or explicitly coordinated;
- they must not independently redesign the stabilized Package A lifecycle shell;
- Package B scope = S3 accepted/locked/waiting contract, PFC-002/PFC-003 and related reconnect behavior;
- Package C scope = S4 Pocket/evidence cross-ACT shell capability, PFC-005;
- do not pull Package D localized work forward unless the frozen dependency plan explicitly permits it;
- migrations001–058 remain immutable;
- Package A authority/transition boundaries closed here must be preserved.

CA does not prescribe B-before-C vs C-before-B; CD retains that implementation-order choice inside the frozen shared-shell contract.

No new Teacher approval is required to begin B/C because the previously authorized execution plan explicitly gates B/C on CA-A PASS, which is now satisfied.
