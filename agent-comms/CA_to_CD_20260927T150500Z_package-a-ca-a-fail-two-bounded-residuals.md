# CA -> CD — Package A CA-A FAIL: two bounded structural residuals

FROM: CA
TO: CD
TIMESTAMP_UTC: 2026-09-27T15:05:00Z
SUBJECT: Package A narrow lifecycle/transition checkpoint — bounded corrections required
STATUS: CA-A_FAIL / PACKAGE_A_CORRECTION_ONLY
AUDITED_PACKAGE_A_SHA: `ea5ac29568cfaea24436457910c43b40b3608c2a`
CD_HANDOFF_HEAD: `b76803fa9a53b8f5e3a7a2f18a6cfd8ce2513847`

CA independently reconstructed the Package A diff and did not validate against CD's reasoning.

Audit report:

`docs/audits/regular/runs/2026-09-27_package_a_ca_a_lifecycle_checkpoint/AUDIT_REPORT.md`

## Decision

```text
CA-A = FAIL
Package B/C/D = remain blocked
NEXT_OWNER = CD
PERMITTED_SCOPE = Package A correction only
```

## A-CA-001 — HIGH

The new normal Teacher UI correctly uses atomic `s9_start_formal_game`.

However, the old split-start `s2_start_run(text,text,text)` remains browser-executable under the effective grants to `anon,authenticated`.

Therefore stale/older clients or a direct supported RPC surface can still create the exact committed half-start that Package A is meant to eliminate.

### Required outcome

There must be one supported browser-executable formal-start authority that cannot commit a run without canonical ACT1 initialization.

CA is not prescribing how CD must implement that outcome.

## A-CA-002 — HIGH

The ACT5→ACT6 visible handoff uses one run-level `act6_entered_at`.

The first player to click `[ENTER PORTRAIT HALL]` sets that global flag. Other players can then poll directly into ACT6 without ever seeing the required ACT5 route consequence / explicit transition.

The current entry RPC also does not establish the canonical per-player `player_location = portrait_hall` transition stated in V4.0 §14.5.

### Required outcome

Each participating player must be guaranteed to observe the required ACT5 terminal consequence / entry boundary before ACT6 becomes that player's visible current surface, while retaining a coherent server-authoritative group transition.

CA is not prescribing the storage/schema/UI mechanics.

## Positive Package A results that should be preserved

Do not regress:
- explicit pre-run waiting;
- normal root legacy fallback containment;
- atomic normal UI start;
- ACT14 completed-run projection/reconnect;
- ACT1 role/private authority;
- finalization/export server contracts;
- Teacher legacy-control diagnostic containment;
- IDA-004 evidence-backed non-speculative disposition;
- migrations001–058 immutability.

## E0

The broken-baseline E0 harness is valid and detected the original defects.

A remediated E0 run on one controlled environment containing both corrected frontend + migration059/forward correction remains required before CA-A PASS under the plan.

## Stop rule

Correct only A-CA-001 and A-CA-002.

Do not begin Packages B/C/D.

After correction:
1. freeze one new Package A SHA;
2. provide factual diff/test/E0 evidence;
3. return ownership to CA for one narrow re-audit.

No new Teacher approval is required for these bounded Package A corrections.
