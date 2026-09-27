# Package A — CA-A Narrow Independent Lifecycle / Transition Checkpoint

## Audit identity

- Audit owner: CA
- Gate: CA-A narrow independent checkpoint
- Branch: `remediation/sprint9-structural-v1`
- Frozen handoff HEAD: `b76803fa9a53b8f5e3a7a2f18a6cfd8ce2513847`
- Package A implementation SHA: `ea5ac29568cfaea24436457910c43b40b3608c2a`
- Package A base: `59286155b7c88b9ed6e372221d2ce5fb47ee95d6`
- Decision: **FAIL — two bounded structural residuals**
- Later Packages B/C/D: **remain blocked**

CA reconstructed the actual Package A diff rather than accepting CD's implementation summary.

## Scope result

| CA-A boundary | Result | Independent finding |
|---|---|---|
| lifecycle partition | PASS source-level | pre-run / active / completed are no longer collapsed to legacy fallback |
| legacy reachability | PASS for normal root UI | legacy Sprint1 renderer remains in code but is no longer selected by normal root dispatch |
| startup boundary | **FAIL** | atomic UI start exists, but the old split-start RPC remains publicly browser-executable |
| ACT5→ACT6 visible ownership | **FAIL** | first player's click globally marks ACT6 entered; other players can skip the required ACT5 visible boundary |
| ACT14 reveal/reconnect | PASS source-level | completed-run projection is consulted before pre-run fallback |
| ACT1 privacy/authority preservation | PASS source-level | Package A does not rewrite ACT1 role/private authority |
| finalization/export preservation | PASS source-level | server finalization/export authority remains unchanged |
| no new shadow authority | FAIL by residual authority surface | old split-start authority remains executable beside new atomic authority |

---

## A-CA-001 — HIGH — Split-start server authority remains publicly executable

### Evidence

Migration059 adds:

`s9_start_formal_game`

which transactionally calls:
- `s2_start_run`;
- `s3b_initialize_flow`.

The Teacher root UI correctly uses the new atomic start.

However the effective privilege history still grants:

`s2_start_run(text,text,text)`

to:

`anon, authenticated`.

Migration059 does not remove or otherwise contain that browser-executable authority.

### Why this matters

The original structural defect was not merely:

> the current Teacher button calls two RPCs.

It was:

> the formal product can expose a committed run before canonical ACT1 exists.

As long as the old split-start authority remains directly browser-executable, a stale/older client or direct RPC caller with a valid Teacher token can still create exactly that half-start.

This matters especially because Phase0A classified the old IDA-004 observation as possibly old-deployment/transient. A stale deployed client remains a realistic boundary, not a theoretical adversarial case.

### Closure condition

Package A must leave **one supported browser-executable formal-start authority** that cannot commit the half-start state.

CA is intentionally not prescribing the implementation mechanism.

---

## A-CA-002 — HIGH — ACT5→ACT6 visible handoff is global, not per-player

### Evidence

Migration059 adds one global column:

`s5_run_state.act6_entered_at`.

Root client shows ACT5 handoff only while:

```text
SPRINT3B_COMPLETE
AND Sprint5 active
AND act6_entered_at IS NULL
```

Any one player clicking `[ENTER PORTRAIT HALL]` calls `s9_enter_act6`.

That RPC sets the single run-level `act6_entered_at`.

After the first click:
- every other player's next poll sees `act6_entered_at != NULL`;
- their client skips `renderAct5Handoff`;
- they enter ACT6 even if they never observed the route consequence / entry transition.

The RPC also does not perform the V4.0 player transition:

`player_location = portrait_hall`

for the clicking player.

### Canonical conflict

V4.0 §14.5 requires the route consequence to be shown and then:

`[ ENTER PORTRAIT HALL ]`

with the click transitioning the player to Portrait Hall.

R-S2 further requires:

> ACT5 route consequence / explicit transition is actually observable before ACT6 visibly takes ownership.

A single run-level acknowledgement does not guarantee that outcome for all three independently polling players.

### Closure condition

Every participating player must be guaranteed to observe the required ACT5 terminal consequence/entry boundary before ACT6 becomes that player's visible current surface, while preserving the server-authoritative group transition.

CA is intentionally not prescribing the storage/schema/UI implementation.

---

## Positive findings

### Lifecycle dispatcher

The root no longer uses `active=false → render legacy Sprint1` as the default product rule.

Pre-run now receives an explicit waiting surface.

### ACT14

The completed-run-capable Sprint8 projection is queried before deciding that no active run means pre-run.

With no newer active run, completed reconnect can reach canonical ACT14.

If a newer active run exists, `s8_get_player_state` follows the active run first and therefore does not incorrectly surface an older completed run.

### Teacher legacy controls

Legacy Sprint1 Advance/Reset are moved under an explicitly labelled diagnostic disclosure rather than normal formal controls.

### IDA-004 diagnosis

CA accepts CD's evidence-backed classification for the current checkpoint:

- the old exact `Run started → No active run` contradiction did not reproduce in three fresh deployed runs;
- the half-start did reproduce consistently;
- no speculative rewrite of established active-run lookup is justified.

### Contract preservation

No Package A diff was found that rewrites:
- ACT1 role-private semantics;
- NORMAL/AUDIT meaning;
- Teacher Override provenance;
- Asset Manager authority;
- finalization/export authority;
- migrations001–058.

---

## E0 evidence status

E0 browser harness existence and broken-baseline detection are confirmed.

A remediated E0 run against a controlled environment containing both the Package A frontend and migration059 remains **NOT VERIFIED** at this checkpoint.

Because two source-level structural residuals already block CA-A, this evidence gap does not change the current FAIL disposition.

It should be closed on the corrected Package A baseline before CA-A PASS / Package B release.

---

## Disposition

```text
CA-A = FAIL
Package A = bounded correction required
Package B/C/D = NOT RELEASED
NEXT_OWNER = CD
```

CD should correct only A-CA-001 and A-CA-002 inside Package A scope, provide one new frozen Package A SHA, and include remediated E0 evidence if a controlled branch+DB environment is available/required by the execution plan.

No broader remediation package is authorized by this finding.
