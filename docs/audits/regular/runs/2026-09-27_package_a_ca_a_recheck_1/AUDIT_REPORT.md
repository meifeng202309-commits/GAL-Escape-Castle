# Package A — CA-A Narrow Recheck 1

## Audit identity

- Audit owner: CA
- Branch: `remediation/sprint9-structural-v1`
- CD correction implementation SHA: `92c0f59967a4588769fb3d562035a96e663639f7`
- CD correction handoff HEAD: `966e1c6a4b29af89ec13e8dddcc537018eab9f23`
- Previous Package A implementation SHA: `ea5ac29568cfaea24436457910c43b40b3608c2a`
- Decision: **FAIL — one transition residual + remediated E0 evidence still missing**
- Packages B/C/D: **remain blocked**

CA independently reconstructed the correction diff and re-traced the effective startup and ACT5→ACT6 state transitions.

---

## A-CA-001 — FIXED_VERIFIED source-level

Migration060 revokes:

`s2_start_run(text,text,text)`

from:
- `anon`
- `authenticated`

Migration002 had already revoked it from `public`.

The supported browser formal-start authority is now:

`s9_start_formal_game`

which runs:
- `s2_start_run`
- `s3b_initialize_flow`

inside one transaction.

No later source grant restoring browser execution of `s2_start_run` was found in the correction scope.

Disposition:

`A-CA-001 = FIXED_VERIFIED`

---

## A-CA-002 — PARTIALLY FIXED

The original residual had two concrete failures:
1. one global `act6_entered_at` could advance all players;
2. entry did not set the clicking player's `player_location='portrait_hall'`.

Migration060 correctly fixes both.

### Verified corrections

Per-player progress now contains:
- `act6_handoff_observed_at`
- `act6_entered_at`

`s9_observe_act5_handoff`:
- binds to exact room/session/run;
- records the observation idempotently per player.

`s9_enter_act6`:
- rejects entry before that player's handoff acknowledgement;
- updates only that player's progress;
- writes `player_location='portrait_hall'`;
- records that player's `act6_entered_at`;
- does not advance peers.

The final effective `s3b_get_player_state` still derives `me` through `to_jsonb(s3b_player_progress)`, so the newly added per-player fields are projected to the client without a separate projection migration.

Root dispatch correctly gates the ACT5 handoff on:

`!sprint3bState.me?.act6_entered_at`

Thus one player's entry no longer hides the ACT5 boundary for another player.

### Residual A-CA-002-R1 — HIGH

**ACT6 canonical DiscussionRoom starts before the player-visible ACT5→ACT6 boundary completes.**

Effective source trace:

```text
ACT5 resolution
→ s3b_run_state.terminal_state = SPRINT3B_COMPLETE
→ deferred cross-Sprint trigger
→ s5_ensure_initialized
→ insert ACT6 round
→ s5_configure_discussion('act6_vote')
→ discussion_sessions.started_at = now()
→ phase_deadline = now() + 90 seconds
→ ACT5 handoff is then shown per player
→ each player later clicks ENTER PORTRAIT HALL
```

V4.0 ACT6 states:

- players enter Portrait Hall;
- then the Portrait scene is presented;
- then DiscussionRoom opens for 90 seconds.

Current source instead starts the 90-second canonical ACT6 discussion at ACT5 terminal completion, before any player is guaranteed to have crossed the explicit transition.

Consequences:
- a player can spend part of the ACT6 90-second window while still on ACT5 payoff;
- staggered players receive different effective discussion time;
- a sufficiently delayed player may enter ACT6 after the discussion has already advanced to voting/fallback;
- the server can therefore own ACT6 behavior time before the player-visible ACT6 boundary is complete.

This violates R-S2's requirement that player-visible transition ownership and runtime transition ownership remain coherent.

### Closure condition

The canonical ACT6 discussion/timer must not begin consuming player interaction time before the required ACT5→ACT6 visible entry boundary is complete for the participants required by the canonical group scene.

CA does not prescribe whether CD should:
- defer discussion activation,
- separate prepared vs entered state,
- introduce a barrier,
- or use another coherent design.

The implementation choice remains CD-owned.

Disposition:

`A-CA-002 = PARTIALLY_FIXED`  
`A-CA-002-R1 = OPEN_HIGH`

---

## Remediated E0 evidence

CD correctly states that:
- the browser harness exists;
- broken-baseline detection was previously captured;
- a live correction test exists.

However, the remediation plan requires E0 browser evidence on the corrected lifecycle before Package A is accepted.

Current handoff explicitly states that:
- remediated E0 has not run against one controlled environment containing corrected frontend + migrations059–060;
- the new live correction test is also deployment-dependent and not yet executed there.

Therefore:

`REMEDIATED_E0 = NOT_VERIFIED`

This remains a release gate for CA-A PASS.

---

## Preserved PASS boundaries

No regression was found in:
- explicit pre-run waiting;
- normal root legacy fallback containment;
- ACT14 completed-run reveal/reconnect dispatch;
- ACT1 privacy/authority;
- finalization/export authority;
- Teacher legacy-control containment;
- migrations001–058 immutability;
- IDA-004 non-speculative disposition.

---

## Decision

```text
A-CA-001 = FIXED_VERIFIED
A-CA-002 = PARTIALLY_FIXED
A-CA-002-R1 = OPEN_HIGH
REMEDIATED_E0 = NOT_VERIFIED

CA-A = FAIL
Packages B/C/D = NOT RELEASED
NEXT_OWNER = CD
```

CD should:
1. correct only the ACT6 timer/ownership residual inside Package A;
2. preserve the per-player handoff and startup fixes already verified;
3. run remediated E0 / bounded live correction evidence in one controlled environment with corrected frontend + migrations059–forward correction;
4. freeze one new Package A SHA;
5. return to CA for narrow recheck.

No broader package is authorized.
