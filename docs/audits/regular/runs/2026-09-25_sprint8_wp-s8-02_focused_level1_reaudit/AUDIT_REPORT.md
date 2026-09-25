# Sprint 8 WP-S8-02 Focused Level 1 Re-audit

Frozen baseline: `3d357ddc42e8232246bf649b5cb63a3e7ecea1fc`  
Prior failed baseline: `ec44c36e6ceaadf796e38ad2cd75c8a17fd8d884`  
Scope: S8-CA-001 / S8-RC-001 / S8-RC-002 + adjacent ISA-reported verifier defects  
Decision: **FAIL / BLOCKED — ONE NARROW S8-CA-001 RESIDUAL**

## 1. Closure matrix

| Finding | Result |
|---|---|
| S8-CA-001 HIGH | **PARTIALLY_FIXED / OPEN — ACT6 fallback effective-round evidence can be substituted by prior tie round** |
| S8-RC-001 HIGH | **FIXED_VERIFIED** |
| S8-RC-002 MEDIUM | **FIXED_VERIFIED** |
| ISA override-state collapse defect | **FIXED_VERIFIED** |
| ISA override-scope masking defect | **FIXED_VERIFIED** |
| ISA stale Sprint8 live assertion | **FIXED_VERIFIED** |

Sprint9/10 remain blocked.

---

## 2. S8-CA-001 — PARTIALLY_FIXED / OPEN

The new verifier is materially stronger and now validates most obligations by phase/step identity.

Verified improvements include:
- ACT1/2/4 exact per-player evidence accounting;
- ACT2 final-meeting discussion + exact final-round vote identity;
- ACT5 exact conditional applicability;
- ACT7 successful clock-C round;
- ACT8 direct-route-only final-vote bypass;
- ACT9 four distinct console-step obligations using step + round identity;
- ACT10 private choices / final vote / outcome;
- branch-specific Station C projection;
- ACT11–13 completion evidence;
- exact Teacher Override attribution;
- technical evidence deletion matrix.

However ACT6 still contains a wrong-round substitution path.

### 2.1 Canonical Sprint5 ACT6 behavior

The legacy Sprint5 runtime allows:

- round 1 = 1:1:1 tie → mark round 1 resolved with resolution_source=tie, open round 2;
- round 2 = 1:1:1 tie → system fallback `portrait_fixed_fallback`, advance to `act6_answer`.

In the second-tie fallback branch, the runtime sets:

`s5_run_state.act6_resolution='portrait_fixed_fallback'`

but does **not** mark the round-2 `s5_rounds` row `status='resolved'`.

Therefore the durable effective evidence for the fallback is:
- round 2's three player votes;
- plus the system fallback resolution.

Round 1 is historical tie evidence only.

### 2.2 Current verifier defect

Migration049 currently selects:

`max(vote_round) ... from s5_rounds where phase_key='act6_vote' and status='resolved'`

and then counts votes in that round.

For a legitimate two-tie ACT6 fallback:
- round 1 is `resolved`;
- round 2 remains not-resolved in `s5_rounds`;
- the verifier therefore selects round 1;
- `s5.act6_resolution` is non-null because round 2 caused the fallback;
- three round-1 votes exist;
- obligation becomes `present`.

This combines:
- final outcome from round 2,
with
- evidence from round 1.

That violates the frozen v1.1 contract:

> ACT6 must use the three votes attributable to the effective resolution; prior rounds cannot substitute.

### 2.3 Concrete corruption case

A legitimate fixture can reach:
- ACT6 round 1 = 1:1:1;
- ACT6 round 2 = 1:1:1;
- system fallback advances the game.

After progression, delete/corrupt only the three **round-2** ACT6 votes.

Current verifier can still:
- read `act6_resolution='portrait_fixed_fallback'`;
- select resolved round 1;
- count its three votes;
- return `act6.effective_vote = present`;
- leave `verified=true`.

Thus the final integrity gate can certify a run whose actual effective ACT6 vote evidence is missing.

### 2.4 Why the ISA matrix did not catch it

The ISA transactional regression deletes:

`vote_round = max(resolved ACT6 round)`

That is exactly the same selector used by the product verifier.

For the two-tie fallback fixture, both product and test target round 1.

So the test proves:
- deleting the verifier-selected round breaks verification,

but it does **not** prove:
- deleting the actual effective fallback round breaks verification.

This is a Pattern F self-confirming-test gap.

### Closure condition

CD must make ACT6 integrity distinguish:
- majority-resolved effective round;
- second-round system fallback after 1:1:1;
- prior tie history.

The actual effective round's three submissions must be required.

Add a negative regression that deletes/corrupts **round 2** evidence in the two-tie fallback path and requires:
- `act6.effective_vote = missing_technical_evidence`;
- `verified=false`.

CA is not prescribing storage/query/helper design.

---

## 3. S8-RC-001 — FIXED_VERIFIED

Finalization now requires:

`p_expected_run_id uuid`

Server behavior is bound to that run and room:
- null/omitted expected run rejected;
- finalized expected run replays that same run;
- stale non-finalized expected run cannot fall through to current room-active run;
- response run_id remains the expected run;
- client request identity is scoped to run_id.

Dedicated live E2E verifies:
- same-run concurrent convergence;
- same-request replay;
- Run A finalization;
- Run B start in same room;
- delayed/new Run A request replays Run A;
- Run B remains active/unmodified.

The Room != Run violation is closed.

---

## 4. S8-RC-002 — FIXED_VERIFIED

Migration049 makes `s8_finalizations.export_schema_version` the durable authority:
- default/check = 1.1;
- newly finalized rows persist 1.1;
- existing effective Sprint8 rows are reconciled;
- finalization state reads durable value;
- JSON header is projected from durable finalization row;
- new `session_finalized` event emits the durable value.

Live regression verifies equality across:
- finalization state;
- JSON header;
- session_finalized event.

The previous 1.0/1.1 split is closed for the effective final-closure path.

---

## 5. ISA-reported defects

### Override state collapsed to present

**FIXED_VERIFIED.**

Migration052 performs per-player present / overridden / missing accounting and emits:
- `invalid_teacher_override` when exact governed override accounts for missing player evidence.

### One override masking another player's technical loss

**FIXED_VERIFIED.**

Migration052 binds override validity by:
- run_id;
- player_id;
- semantic_field.

A different player's missing evidence remains `missing_technical_evidence`.

The integrated transactional matrix exercises this case.

### Existing Sprint8 live assertion shape

**FIXED_VERIFIED.**

The old `integrity_report.station_c.validity` assertion was updated to the structured obligations projection and exact `golden_key_watcher_path` reason.

---

## 6. Canonical Ownership Check

**PASS.**

The implementation interval contains:
- CD-owned migrations049–052;
- CD runtime integration;
- CD/ISA tests;
- governance/log/audit artifacts.

No protected canonical localization/game-script/visual source was modified by CD or ISA.

ISA changed only allocated test artifacts and did not create migrations or runtime authority.

---

## 7. CD / ISA cooperation observation

This cycle demonstrates genuine parallel execution:
- CD implemented authority/migration/RPC work;
- ISA independently implemented verification support;
- ISA found two real verifier defects plus one integration mismatch;
- CD integrated/remediated those findings;
- provenance remained separate.

No cooperation-rule escalation is warranted from this cycle.

---

## 8. Patterns A–F

| Pattern | Result |
|---|---|
| A — cross-module handoff | PASS for run-bound finalization/version authority |
| B — stale/retry/concurrency | PASS |
| C — UI vs server authority | PASS |
| D — current state vs historical evidence | **FAIL — ACT6 fallback mixes round-2 outcome with round-1 evidence** |
| E — authority accretion | PASS |
| F — self-confirming tests | **FAIL — ACT6 corruption test uses the same wrong resolved-round selector as product verifier** |

---

## 9. Gate disposition

**Sprint8 focused Level1 = FAIL / BLOCKED — one narrow residual.**

Open:
- `S8-CA-001-R2 HIGH` — ACT6 second-tie system fallback must require the actual effective round-2 vote evidence.

Closed:
- S8-RC-001;
- S8-RC-002;
- both ISA verifier defects;
- stale integration assertion.

Migrations001–052 are immutable deployed history.

Next unused migration = **053**.

Next owner: **CD**.

Authorized correction:
- ACT6 effective-round/fallback integrity semantics only;
- directly adjacent negative regression for deleting/corrupting the second fallback round;
- no Sprint9/10;
- no unrelated refactor;
- no protected canonical edits.

After correction, submit another narrow focused Sprint8 Level1 re-audit.
