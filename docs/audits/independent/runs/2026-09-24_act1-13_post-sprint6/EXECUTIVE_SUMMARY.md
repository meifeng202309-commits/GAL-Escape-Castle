# EXECUTIVE SUMMARY — Level 3 Full Independent Snapshot Audit

Audit run: `2026-09-24_act1-13_post-sprint6`  
Frozen product baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`  
Highest migration: 036  
Audit protocol: Independent Development Snapshot Audit Protocol v1.3 + current CA Rules V1.4  
Decision: **FAIL / BLOCKED**

## 1. Why this Level3 was run

The previous full independent snapshot audit was at Sprint3B. Since then the system added:
- Teacher Override;
- Asset Manager V2;
- ACT6–8;
- ACT9–13;
- multiple new discussion/state/evidence authorities;
- migrations through 036;
- browser audio/cinematic/runtime behavior.

This exceeded the milestone trigger for a new full independent reconstruction before Sprint7 Teacher Console expansion.

The audit froze the actual ACT1–13 product code after Sprint6 focused closure and re-derived the system code-first rather than relying on prior CA conclusions.

## 2. Overall result

The ACT1–13 architecture is materially stronger than the old Sprint3B baseline:
- Room/Run separation is first-class;
- private decisions and group/system resolutions are separated;
- exact discussion/round/request identities are widely used;
- evidence provenance is substantially improved;
- Teacher Override is bounded and auditable;
- Asset Manager authority is layered;
- Sprint6 branch/role/pressure state has strong guarded RPC semantics;
- canonical ownership provenance currently passes V1.4.

However the integrated baseline is **not safe to release into Sprint7**.

Five issues remain:

### IDA-001 — HIGH / CONFIRMED
Generic Sprint2 deadline refresh can resolve Sprint6 no-vote DiscussionRooms without advancing Sprint6 phase. Normal ACT9/10/11 can deadlock at timer expiry/reconnect.

### IDA-002 — MEDIUM / CONFIRMED
Sprint6 critical one-shot audio replay suppression exists only in browser memory. Reload/reconnect can replay the same already-completed cue while server state still exposes it.

### IDA-003 — HIGH / NOT_VERIFIED
`s6_station_b_progress` is the only formal runtime table created without RLS. Production anon/authenticated direct privileges are not independently available, so direct exposure is not asserted — but the authority boundary is not proven fail-closed.

### IDA-004 — HIGH / CONFIRMED
ACT5→6 and ACT8→9 require hidden Teacher-token initialization buttons. The canonical continuous state machine cannot progress through these boundaries without out-of-band Teacher intervention.

### IDA-005 — HIGH / CONFIRMED
Later-Sprint phase/cinematic/audio chronology is only partially durable. Important ACT6–13 transitions overwrite mutable current state without a complete append-only phase/audio event history, conflicting with V2.4 logging requirements and future Sprint8 integrity/export needs.

Counts:

- **3 HIGH CONFIRMED**
- **1 HIGH NOT_VERIFIED**
- **1 MEDIUM CONFIRMED**

## 3. Highest-priority architectural conclusions

### A. Shared reusable components need explicit ownership

Reusing `discussion_sessions` is correct in principle, but generic Sprint2 refresh and Sprint6 transition semantics both mutate the same row.

The problem is not reuse itself; it is two owners for one deadline transition.

### B. Sprint boundaries are still development seams

Sprint5 and Sprint6 are locally functional, but the integrated product still exposes implementation-sprint boundaries as Teacher gameplay buttons.

A release runtime must not require the Teacher to know internal Sprint boundaries.

### C. Current-state correctness is ahead of historical observability

Later Sprint state machines preserve many important decisions in dedicated tables, but phase/audio history is less complete than the current state.

This must be fixed before Sprint8 tries to assert semantic session integrity or export a canonical flat event ledger.

### D. Security protection must stay uniform when adding tables

Migration036 broke the otherwise consistent pattern of enabling RLS on every formal runtime table.

Even if the deployed table is currently protected by effective grants, that must be proven rather than assumed.

## 4. What did not become a finding

The audit did **not** reopen these already-correct boundaries:

- first-choice permanent lock;
- missing-vote non-synthesis;
- Room vs Run;
- NORMAL vs AUDIT;
- physical item vs knowledge;
- SHARE PHOTO vs physical ownership;
- ACT8 Golden Key branch semantics;
- ACT11 Linda/Silver-Key role constraint;
- ACT12 Watcher exclusion from mechanism failure;
- pressure choice not causing success;
- ACT13 only reaching ACT14 boundary;
- Sprint8 finalization/export remaining inactive;
- current V2.4 canonical ownership provenance.

## 5. Test-suite conclusion

Current tests are valuable but self-confirming at several integration seams.

Most importantly:
- Sprint6 E2E runs in AUDIT mode and directly closes discussions, so it does not execute the NORMAL deadline/poll path that causes IDA-001.
- E2E explicitly calls Teacher `s5_initialize` / `s6_initialize`, so IDA-004 is treated as setup rather than tested as a handoff.
- static audio checks do not perform reload/reconnect, so IDA-002 is invisible.
- Sprint6 static checks assert Station B table existence but not RLS/effective direct privileges, so IDA-003 is invisible.

## 6. Canonical Ownership Check

**PASS.**

The known Sprint6 localization authority incident is resolved in current baseline provenance:
GA/Teacher canonical owner commit → separate CD consumer implementation.

No unresolved protected-source ownership violation is blocking this Level3 gate.

## 7. NOT VERIFIED boundaries

In addition to IDA-003:
- production PostgreSQL effective ACL catalog was not independently queried;
- physical three-device ACT1–13 was not rerun by CA;
- six formal Sprint6 audio assets still have no ACTIVE production version;
- real target-device audio timing/autoplay remains future Sprint9/10 acceptance;
- formal completed-run restart is future Sprint8 scope.

## 8. Gate and next action

**ACT1–13 Level3 gate = FAIL / BLOCKED.**

Sprint7 remains blocked.

Next owner: **CD**.

Authorized remediation scope:
- IDA-001 through IDA-005 only;
- directly adjacent regression tests/evidence;
- additive DB changes only if needed;
- migrations 001–036 remain immutable;
- next unused migration is 037.

After CD submits a completed correction baseline, CA should perform a **Level2 Targeted Independent Closure Audit**, not rerun the full Method1–9 snapshot from scratch.

Only successful Level2 closure of all five items may release Sprint7.

Because the current gate is BLOCKED, the Conditional Pre-Approval Sprint7 risk forecast is **N/A** for this run.
