# CA → CD: Level2 IDA-001..005 closure audit — FAIL / four not fully closed

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-24T16:02:00Z  
SUBJECT: Level3 IDA-001..005 targeted closure disposition  
STATUS: FAIL / BLOCKED

Correction baseline:

`b4248132842a2e660ca1ba4e15605eff75c78dff`

Full report:

`docs/audits/independent/runs/2026-09-24_level2_ida001-005_closure/AUDIT_REPORT.md`

## Result

Closed:

- **IDA-003 HIGH → FIXED_VERIFIED**

Not fully closed:

- **IDA-001 HIGH → PARTIALLY_FIXED / NOT VERIFIED**
- **IDA-002 MEDIUM → PARTIALLY_FIXED / OPEN**
- **IDA-004 HIGH → PARTIALLY_FIXED / NOT VERIFIED**
- **IDA-005 HIGH → PARTIALLY_FIXED / OPEN**

Sprint7 remains blocked.

## IDA-001

The new Sprint6-owned deadline resolver is structurally sound and generic Sprint2 now delegates Sprint6 sessions instead of consuming them independently.

However the required closure test is still absent.

Current live E2E still runs AUDIT and directly calls `s6_close_discussion_v2`; it does not exercise the NORMAL deadline/poll/reconnect path for ACT9/10/11.

Required closure evidence:
- NORMAL expiry;
- actual runtime polling/reconnect;
- ACT9, ACT10 and ACT11 discussion classes;
- one-owner atomic convergence.

No exact test implementation is prescribed.

## IDA-002

Durable audio occurrence/consumption state is a real improvement.

Residual defect:

If audio finishes but the `s6_mark_audio_consumed` network request does not commit, the browser only logs a warning. That failed consumption is not durably retried.

After reload/reconnect:
- browser memory is reset;
- server still says unconsumed;
- the already-completed one-shot can play again.

Required closure:
completed/stopped occurrence consumption must remain recoverable across that failed-write/reconnect boundary while a genuinely new occurrence must still play.

## IDA-004

The new automatic deferred triggers + idempotent ensure functions are structurally credible.

But the current live E2E still explicitly calls both:
- `s5_initialize(...teacher...)`;
- `s6_initialize(...teacher...)`.

Therefore it can pass even if automatic ACT5→6 / ACT8→9 handoff is broken.

Required closure evidence:
- actual ACT5→6 without Teacher initializer;
- reconnect;
- exactly one canonical ACT6 discussion;
- actual ACT8→9 without Teacher initializer;
- reconnect;
- exactly one canonical ACT9 state/discussion.

## IDA-005

The new append-only ledger and timeline reader materially improve forensic durability.

Two closure gaps remain:

1. no dynamic post-run test/query demonstrates the ordered ACT6–13 phase/cinematic/audio timeline after current state has advanced;
2. audio outcome history is still incomplete when the IDA-002 consumption write is lost before commit.

Close IDA-002 first or in the same correction, then demonstrate representative timeline reconstruction.

## What passed

- Station B RLS/direct privilege source boundary is now fail-closed.
- CD supplied deployed REST denial evidence for IDA-003.
- no protected canonical source was modified in the correction interval.
- migration 038 fixes heterogeneous trigger-row compatibility.
- migration 039 restores canonical ACT6 DiscussionRoom construction.
- no new double-initialization/second-owner defect was confirmed in the automatic transition design.

## Scope

Authorized:
- residual IDA-001/002/004/005 closure only;
- directly adjacent dynamic regression/evidence;
- additive DB change only if actually needed.

Not authorized:
- Sprint7;
- Sprint8;
- unrelated gameplay redesign;
- protected canonical source edits without owner-first provenance.

Migrations `001–039` are immutable.

Next unused migration is **040**.

## Process

This handoff is the active execution trigger:

- next owner = CD;
- next action = close the four remaining Level2 closure gaps;
- permitted scope = IDA-001/002/004/005 + directly adjacent regressions/evidence;
- closure = submit another Level2 targeted closure request.

Acknowledgement alone is not completion.
