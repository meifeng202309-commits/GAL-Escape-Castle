# Level2 Targeted Independent Closure Re-audit — final IDA closure

Original Level3 baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`  
Prior Level2 correction baseline: `69fcf8fc998e8a5622dbd5e2b69447a2a2cb37d9`  
Final correction baseline: `96dd6a867aa0edab25cd3a68a30b2710a99fdcbe`  
Implementation interval: `16d0d835e46333319e198b9242d596b663d1e451..96dd6a867aa0edab25cd3a68a30b2710a99fdcbe`  
Additive migration: `042_remove_ungoverned_normal_deadline_helpers.sql`  
Audit level: **Level 2 — Targeted Independent Closure Re-audit**  
Decision: **PASS — LEVEL3 FINDINGS CLOSED / SPRINT7 RELEASED**

## 1. Final closure matrix

| Finding | Final result |
|---|---|
| IDA-001 HIGH | **FIXED_VERIFIED** |
| IDA-002 MEDIUM | **FIXED_VERIFIED** |
| IDA-003 HIGH | **FIXED_VERIFIED** |
| IDA-004 HIGH | **FIXED_VERIFIED** |
| IDA-005 HIGH | **FIXED_VERIFIED** |
| IDA-006 HIGH | **FIXED_VERIFIED** |

The ACT1–13 Level3 remediation set is closed at this Level2 gate.

## 2. IDA-002 — FIXED_VERIFIED

The residual defect was the stale-payload replay race during hydration.

Before the final correction, hydration could:

1. receive server payload with `audio_consumed=false`;
2. flush a queued local consumption successfully;
3. delete the local suppressor;
4. continue evaluating the old payload;
5. replay the same occurrence.

At the final baseline, `hydrateSprint6(payload)` now captures:

`locallyConsumed = Boolean(sprint6AudioOutbox()[identity])`

**before** calling:

`await flushSprint6AudioConsumptions()`.

The current hydration decision then uses:
- the pre-flush persistent suppressor;
- server `payload.audio_consumed`;
- in-memory occurrence identity.

Therefore the exact stale-payload sequence is closed:

- failed completion acknowledgement remains in localStorage;
- reload may obtain stale server state;
- retry may subsequently succeed and remove the queued entry;
- the current hydration still retains the captured suppressor and does not replay that occurrence;
- a genuinely new occurrence ID has no matching suppressor and remains eligible to play.

The suppression identity is occurrence-based rather than cue-name-based, so repeated legitimate future use of the same cue is not globally blocked.

**IDA-002 MEDIUM → FIXED_VERIFIED.**

Evidence level:
- deterministic browser control-flow proof;
- static regression assertion specifically checking suppressor capture precedes outbox flush;
- prior deployed occurrence/consumption/reconnect evidence.

Actual target-device audio playback remains a later Sprint9/10 integration boundary because formal audio assets are not yet ACTIVE.

## 3. IDA-005 — FIXED_VERIFIED

Previously accepted closure evidence remains intact:

- append-only `act6_13_event_ledger`;
- durable phase transitions;
- durable discussion deadline advancement events;
- durable audio occurrence triggers;
- durable audio consumption outcomes;
- Teacher-authenticated ordered timeline;
- representative NORMAL post-run timeline with retained cinematic stages after mutable current state advanced.

The only remaining blocker in the prior audit was that IDA-002 could cause one occurrence to audibly replay while the durable ledger still represented one trigger/consumption.

That replay path is now closed.

No change in the final correction removes or weakens the event ledger/timeline implementation.

The resulting durable model is sufficient for current V2.4 ACT6–13 observability requirements:
- current state is not the sole record of material transitions;
- phase/cinematic history remains reconstructable;
- formal audio occurrence/outcome state is durable.

**IDA-005 HIGH → FIXED_VERIFIED.**

Verification note:
the server-side `audio_consumed` timestamp represents durable acknowledgement/recording time. Exact acoustic end-time on an offline browser is not treated as a current behavior-analysis field or Sprint8 integrity blocker.

## 4. IDA-006 — FIXED_VERIFIED

Migration 042 performs additive cleanup of the temporary NORMAL verification helpers.

It:

- revokes execute on `s6_verify_expire_discussion(text,text,uuid)` from `public`, `anon`, and `authenticated`;
- revokes execute on `s5_verify_expire_discussion(text,text,uuid)` from the same roles;
- drops both functions.

Therefore the final source chain no longer contains an active NORMAL Teacher mutation authority capable of forcing canonical discussion deadlines through those verification helpers.

CD reports deployment-effective PostgREST verification for both names:

- HTTP 404;
- `PGRST202`;
- no schema-cache match.

CA cannot independently issue production POST requests with the available repository tooling, but the final migration definition itself removes the functions rather than merely hiding UI access, and the supplied deployment evidence is consistent with the source.

No downstream runtime code depends on either helper.

**IDA-006 HIGH → FIXED_VERIFIED.**

## 5. Previously closed findings retained

### IDA-001

Sprint6 timed discussion deadline ownership remains single-owner:
generic Sprint2 delegates Sprint6 sessions to the Sprint6 owner; NORMAL ACT9/10/11 deployed closure evidence demonstrated convergence across poll/reconnect.

No final correction changed this authority.

### IDA-003

Station B progress remains RLS-protected and direct browser table privileges remain revoked.

No final correction changed this boundary.

### IDA-004

Automatic ACT5→6 and ACT8→9 transitions remain server-owned and idempotent.

The accepted NORMAL live closure evidence showed:
- no `s5_initialize`;
- no `s6_initialize`;
- exactly one canonical next-Sprint discussion across reconnect.

No final correction changed these transitions.

## 6. Canonical Ownership Check

**PASS.**

Changed files in the final implementation interval are:

- `database/042_remove_ungoverned_normal_deadline_helpers.sql`;
- `src/game/app.js`;
- `tests/level3-closure-static-check.js`.

No protected GA/VA/Teacher canonical content source is modified.

The final correction is implementation/governance cleanup only.

## 7. Codex Recurring-Error Pattern Scan

| Pattern | Result | Evidence |
|---|---|---|
| A — local correctness / cross-module handoff | **PASS** | audio local outbox/server consumption handoff now remains safe across stale hydration; cross-Sprint handoff remains verified. |
| B — distributed failure | **PASS** | failed audio acknowledgement survives reload; restored-network flush cannot cause same-occurrence replay. |
| C — UI rule vs server rule | **PASS** | temporary NORMAL Teacher deadline authority is removed at RPC/database level, not merely hidden from UI. |
| D — current state vs historical evidence | **PASS** | phase/cinematic/audio history remains append-only and no longer diverges through the known duplicate-playback path. |
| E — authority accretion | **PASS** | verification-only NORMAL Teacher authority is deleted; no second discussion owner or new protected-source authority remains. |
| F — self-confirming tests | **PASS, with documented test-lifecycle limitation** | CA challenged the ordering defect independently; static regression now asserts the relevant ordering. Prior NORMAL live closure evidence for IDA-001/004 remains valid because the final diff does not alter those state-machine paths. |

## 8. Test / evidence limitation that does not block this gate

`tests/level3-closure-live-e2e.js` used temporary verification RPCs from migrations 040/041 to accelerate NORMAL deadlines.

Those helpers are intentionally removed in migration 042.

Therefore that exact live fixture is now a **historical closure fixture** and cannot be rerun unchanged against the final production baseline.

This does not invalidate the accepted IDA-001/004 evidence because:
- the live run was executed against the same production state-machine implementation being verified;
- the final correction does not alter Sprint5/Sprint6 automatic handoff or discussion-owner logic;
- migration 042 only removes the verification authority;
- final source inspection confirms those production transitions remain unchanged.

However future changes touching those boundaries must not rely solely on this now-historical fixture; fresh runtime evidence will be required in the relevant future audit.

## 9. Remaining NOT VERIFIED boundaries

These are not blockers for the ACT1–13 integrated logic gate:

- physical three-device ACT1–13 classroom playthrough;
- actual production audio playback/volume/timing on target browsers while formal audio assets remain inactive;
- full ACTIVE asset integration;
- ACT14 finalization/export, which is Sprint8 scope.

## 10. Mandatory Pre-Approval Gate — Sprint7 risk forecast

Next authorized scope from Codex V2.4 is:

**Sprint7 — Teacher Console expansion.**

The forecast below is risk-only; it does not prescribe implementation or CA's future adversarial test plan.

| Risk ID | Next-scope area / interface | Why this area is high-risk | Invariant / failure class to watch |
|---|---|---|---|
| S7-RISK-01 | Aggregate current act / scene / phase | ACT1–13 now spans legacy Sprint2, Sprint3B, Sprint5 and Sprint6 state layers; Teacher display can accidentally surface stale lower-Sprint truth | one current runtime authority; reconnect/Teacher observation must match mutation authority |
| S7-RISK-02 | submitted / waiting + private visibility | Teacher Console must observe progress without revealing unrevealed private choices in NORMAL | NORMAL privacy; AUDIT privileged view must be explicit and logged |
| S7-RISK-03 | Pause / Resume / Add 30 sec / deblock controls | Teacher controls intersect deadlines, in-flight player requests and evidence validity; IDA-006 showed how test/support authority can silently become gameplay authority | server-authoritative intervention, provenance, stale-action rejection, no fabricated player behavior |
| S7-RISK-04 | countdown + story-time display | Real discussion time and fixed Story Time coexist; Teacher UI can accidentally treat one clock as authority for the other | Real Time ≠ Story Time; observation/control must not create a second clock owner |
| S7-RISK-05 | audio trigger / playback debug | Audio now has occurrence/consumption state and reconnect semantics; debug surfaces can accidentally replay or mutate one-shot state | observation must not become a second audio writer; occurrence identity must remain stable |
| S7-RISK-06 | event log / behavior validity / Override history | evidence is distributed across multiple ledgers and validity/provenance tables | current state must not replace history; system/Teacher/player provenance and null reasons must remain distinct |
| S7-RISK-07 | export controls / filename preview | Sprint7 may show controls/preview, but Sprint8 owns finalization and actual export readiness | preview must not set `game_completed`, `export_ready`, or cross the ACT14 finalization boundary |
| S7-RISK-08 | Teacher token/session recovery | existing Teacher auth/recovery is a verified baseline that Sprint7 UI expansion will touch | do not weaken or replace Teacher authentication/session recovery; no new ungoverned Teacher authority |

This forecast does not reveal a defect already present in the final ACT1–13 baseline.

Therefore it does not reopen the current closure gate.

## 11. Gate disposition

**PASS — all Level3 IDA findings and remediation-created IDA-006 are closed.**

The ACT1–13 integrated Level3 gate is now closed by this Level2 targeted audit.

Sprint7 is released for implementation under Codex V2.4.

Migrations `001–042` are deployed history and immutable.

Next unused migration = **043**.

Next owner: **CD**.

Next action:
- implement Sprint7 Teacher Console expansion within the canonical Sprint7 scope;
- preserve existing Teacher token/session recovery;
- keep Sprint8 ACT14 finalization/export out of scope;
- submit Sprint7 for a regular Level1 CA audit when implementation is complete.

No additional user approval is required for CD to begin the already-authorized Sprint7 scope.
