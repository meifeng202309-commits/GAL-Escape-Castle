# CA → CD: Level2 residual IDA closure re-audit — FAIL / IDA-002, IDA-005, IDA-006 open

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-24T16:22:00Z  
SUBJECT: Residual Level3 finding closure re-audit  
STATUS: FAIL / BLOCKED

Correction baseline:

`69fcf8fc998e8a5622dbd5e2b69447a2a2cb37d9`

Full report:

`docs/audits/independent/runs/2026-09-24_level2_residual_ida_closure_reaudit/AUDIT_REPORT.md`

## Result

Closed:

- **IDA-001 HIGH → FIXED_VERIFIED**
- **IDA-003 HIGH → FIXED_VERIFIED**
- **IDA-004 HIGH → FIXED_VERIFIED**

Open:

- **IDA-002 MEDIUM → PARTIALLY_FIXED / OPEN**
- **IDA-005 HIGH → PARTIALLY_FIXED / OPEN**
- **IDA-006 HIGH → NEW / CONFIRMED**

Sprint7 remains blocked.

## IDA-002 residual failure

The localStorage consumption outbox is a real improvement, but current hydration order still permits replay.

Failure sequence:

1. occurrence already finishes locally;
2. consumption RPC originally fails, so outbox persists;
3. reload occurs;
4. `s6_get_player_state` returns pre-flush `audio_consumed=false`;
5. `hydrateSprint6` flushes queued consumption successfully;
6. flush deletes the outbox entry;
7. hydration then computes no local suppressor but still holds the old `payload.audio_consumed=false`;
8. reload has reset in-memory `sprint6AudioIdentity`;
9. same occurrence can play again.

Close this distributed boundary without suppressing a genuinely new occurrence.

## IDA-005 residual dependency

The new event ledger and dynamic post-run timeline proof are accepted for phase/cinematic chronology.

However while IDA-002 remains possible, the forensic audio chronology can diverge from what the player actually heard: one occurrence can play twice while the ledger represents one trigger/consumption.

Close this dependency together with IDA-002 and preserve the now-verified ledger/timeline behavior.

## IDA-006 new remediation-created authority regression

Migrations 040/041 deploy:

- `s6_verify_expire_discussion`;
- `s5_verify_expire_discussion`.

They:
- are executable in production with Teacher token;
- explicitly require NORMAL mode;
- can force canonical discussion deadlines into the past;
- do not append Teacher intervention/override provenance;
- do not mark validity/context;
- can make a forced Teacher timing intervention look like a natural timeout.

These are not harmless test-only helpers once deployed.

V4.0 requires Teacher interventions/deblocks to remain governed and logged. Current bounded override authority also does not grant an unlogged ACT6–11 NORMAL timing override.

Close the authority/provenance regression. CA is not prescribing whether the verification support is removed or moved behind an already-governed authority boundary.

## What is now verified

- NORMAL ACT9/10/11 deadline convergence;
- single Sprint6 discussion owner;
- automatic ACT5→6 and ACT8→9 without Teacher initialization;
- exactly-one canonical next-Sprint discussion across reconnect;
- Station B direct table fail-closed;
- append-only phase/cinematic ledger and post-run timeline query;
- current canonical ownership provenance.

## Scope

Authorized:
- IDA-002;
- residual IDA-005 dependency;
- IDA-006;
- directly adjacent regression evidence.

Not authorized:
- Sprint7;
- Sprint8;
- unrelated gameplay changes;
- protected canonical changes without owner-first provenance.

Migrations `001–041` are immutable.

Next unused migration = **042**.

## Process

This handoff is the current execution trigger:

- next owner = CD;
- next action = close IDA-002 / IDA-005 / IDA-006;
- permitted scope = those findings + adjacent regressions;
- closure = submit another Level2 targeted independent closure request.

Acknowledgement alone is not completion.
