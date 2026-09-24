# Level2 Targeted Independent Closure Re-audit — residual IDA findings

Prior correction baseline: `b4248132842a2e660ca1ba4e15605eff75c78dff`  
Re-audit correction baseline: `69fcf8fc998e8a5622dbd5e2b69447a2a2cb37d9`  
Implementation interval: `88edd63ef287976995c714575ef6145f79c8a51b..69fcf8fc998e8a5622dbd5e2b69447a2a2cb37d9`  
Additive migrations: `040`, `041`  
Audit level: **Level 2 — Targeted Independent Closure Re-audit**  
Decision: **FAIL / BLOCKED**

## 1. Closure matrix

| Finding | Re-audit result | Disposition |
|---|---|---|
| IDA-001 HIGH | **FIXED_VERIFIED** | Sprint6 deadline ownership is now single-owner; NORMAL ACT9/10/11 live closure evidence exists and reconnect converges. |
| IDA-002 MEDIUM | **PARTIALLY_FIXED / OPEN** | Persistent consumption outbox exists, but reload with restored network can flush/delete the suppressor and then replay the same occurrence using stale pre-flush player state. |
| IDA-003 HIGH | **FIXED_VERIFIED** | Prior closure retained. |
| IDA-004 HIGH | **FIXED_VERIFIED** | New NORMAL live route reaches ACT6 and ACT9 without `s5_initialize` or `s6_initialize`; reconnect observes same canonical discussion identity. |
| IDA-005 HIGH | **PARTIALLY_FIXED / OPEN** | Ordered ledger/timeline and dynamic post-run evidence exist, but actual audio playback chronology remains inaccurate while IDA-002 permits a consumed occurrence to replay. |
| IDA-006 HIGH | **NEW / CONFIRMED** | Production NORMAL-only Teacher verification RPCs can force discussion deadlines without canonical Teacher intervention provenance, creating an ungoverned gameplay authority and misattributing forced timeout as natural timeout. |

Sprint7 remains blocked.

## 2. IDA-001 — FIXED_VERIFIED

### Source authority

Migration 037 remains the effective correction:

- generic `s2_refresh_discussion` delegates `scene_id='sprint6'` rows to `s6_refresh_owned_discussion`;
- the Sprint6 owner locks `s6_run_state` and the exact discussion row;
- resolution and phase advance occur in one transaction;
- `s6_get_player_state` also invokes the owner before returning.

No second active Sprint6 deadline writer was introduced by migrations 040–041.

### New dynamic evidence

`tests/level3-closure-live-e2e.js` creates a fresh **NORMAL** run and validates all three Sprint6 discussion classes:

- ACT9 discussion;
- ACT10 discussion;
- ACT11 discussion.

For each:
- the exact discussion deadline is moved into the past;
- a different player's Sprint6 state poll performs the production owner transition;
- a third player reconnect/state read sees the same next phase;
- the discussion row is no longer exposed;
- `s6_close_discussion_v2` is not called by the closure test.

Although the test does not drive a graphical browser, the previously dangerous generic path is independently source-verified to delegate to the same Sprint6 owner, and the NORMAL deployed owner transition is now dynamically exercised.

### Disposition

**IDA-001 HIGH → FIXED_VERIFIED.**

## 3. IDA-002 — PARTIALLY_FIXED / OPEN

### What is improved

The browser now persists an occurrence-based consumption outbox in localStorage:

`gal.s6.audio-consumption-outbox`.

On audio ended/stopped:
- occurrence + outcome is stored before the RPC;
- failed sends remain in the outbox;
- hydration retries queued sends;
- an outbox occurrence suppresses replay while it remains queued;
- a later occurrence uses a distinct occurrence UUID.

This addresses the prior warning-only loss.

### Residual deterministic replay sequence

The current `hydrateSprint6(payload)` order is:

1. receive `payload.audio_consumed` from `s6_get_player_state`;
2. call `await flushSprint6AudioConsumptions()`;
3. if the queued send now succeeds, `flush...` deletes the occurrence from localStorage;
4. compute:
   `locallyConsumed = Boolean(sprint6AudioOutbox()[identity])`;
5. test the **old pre-flush** `payload.audio_consumed`;
6. on a reload, `sprint6AudioIdentity` is empty;
7. the same occurrence can therefore proceed to `playSprint6Audio(...)`.

Concrete failure boundary:

- one-shot finishes;
- consumption RPC originally fails, so outbox persists;
- page reloads;
- network is restored before/during hydration;
- server state was fetched before flush and says `audio_consumed=false`;
- hydration flush succeeds and removes local suppressor;
- stale payload still says false;
- same occurrence replays.

This is exactly the distributed failure class IDA-002 was intended to close.

### Test adequacy

The new live closure test proves:
- a directly committed server consumption survives reconnect;
- a distinct later occurrence remains available.

It does **not** inject:
- failed consumption write;
- persisted outbox;
- reload;
- network recovery during hydration.

The static test only checks the presence of outbox-related source fragments.

### Disposition

**IDA-002 MEDIUM → PARTIALLY_FIXED / OPEN.**

### Closure condition

The failed-write/reload/recovery sequence must not replay an occurrence that has already completed locally, while a genuinely new occurrence remains playable.

CA is not prescribing the ordering/storage mechanism.

## 4. IDA-004 — FIXED_VERIFIED

### Dynamic closure now exists

The new `level3-closure-live-e2e.js`:

- starts a fresh NORMAL run;
- executes ACT1–5;
- never calls `s5_initialize`;
- observes automatic ACT6 state;
- reconnects through another player and verifies the same ACT6 discussion ID;
- completes ACT6–8;
- never calls `s6_initialize`;
- observes automatic ACT9 state;
- reconnects and verifies the same ACT9 discussion ID.

Migrations 037–039 continue to provide:
- deferred cross-Sprint trigger;
- internal idempotent ensure functions;
- run-row serialization;
- canonical ACT6 DiscussionRoom creation;
- canonical ACT9 clue/discussion creation.

The legacy Teacher initialization RPCs remain compatibility wrappers, but are no longer required for the verified NORMAL flow.

### Disposition

**IDA-004 HIGH → FIXED_VERIFIED.**

## 5. IDA-005 — PARTIALLY_FIXED / OPEN

### Dynamic forensic evidence is now present

After advancing through ACT13, the new live closure test calls:

`act6_13_get_timeline`.

It verifies:
- monotonic `event_id`;
- `phase_transition`;
- `discussion_deadline_advanced`;
- `audio_triggered`;
- `audio_consumed`;
- retained cinematic-stage history after mutable current state has advanced.

CD reports a representative deployed result:

`45 events`

with event types:

- audio_consumed;
- audio_triggered;
- discussion_deadline_advanced;
- phase_transition.

This closes the prior lack of dynamic post-run timeline evidence.

### Remaining forensic inconsistency from IDA-002

The ledger can still fail to represent what the player actually heard.

In the IDA-002 residual sequence:
- the occurrence has already played once;
- a restored-network hydration successfully records one `audio_consumed` event;
- stale hydration state can then replay the **same occurrence** again;
- no new `audio_triggered` occurrence is created for that second playback.

The durable timeline therefore says one occurrence / one consumption even though the browser can audibly replay it.

That is not merely an accessibility issue; it means actual audio-playback chronology and the forensic ledger can diverge.

### Disposition

Phase/cinematic chronology closure is verified.

Audio chronology remains dependent on robust closure of IDA-002.

**IDA-005 HIGH → PARTIALLY_FIXED / OPEN.**

## 6. IDA-006 — NEW HIGH / CONFIRMED

### Remediation-created production authority

Migrations 040 and 041 add:

- `s6_verify_expire_discussion(...)`;
- `s5_verify_expire_discussion(...)`.

Both are deployed to production and granted to `anon, authenticated` with Teacher-token authentication.

Both explicitly require:

`run_mode='normal'`.

They are therefore not AUDIT-only test helpers.

### What they can do

A Teacher holding the token can select an exact current canonical discussion and move its deadline into the past.

For Sprint5, the helper then immediately invokes the generic discussion refresher, opening the next voting state.

For Sprint6, the next normal state poll performs the Sprint6-owned canonical phase advance.

This creates a new Teacher gameplay mutation surface in real NORMAL runs.

### Canonical/provenance conflict

V4.0 Teacher Console permits controls such as:
- Pause / Resume;
- Add 30 sec;
- SKIP CURRENT INTERACTION;
- RESOLVE & CONTINUE;

but requires Teacher deblock/intervention to be server-authoritative and **recorded as teacher intervention / override evidence**.

The current ACT1–5 safe-override allowlist explicitly rejects its bounded override actions outside ACT1–5.

The new verification RPCs:
- are not part of a canonical scene-owned Teacher override contract;
- do not append a Teacher intervention/override event;
- do not mark affected validity/context;
- leave the run NORMAL / behavior-dataset eligible;
- cause downstream event history to look like an ordinary deadline expiry.

Thus a Teacher can materially shorten a canonical ACT6–11 interaction and the evidence ledger can attribute the resulting transition to timeout/system flow rather than Teacher intervention.

The fact that the functions were introduced for testing does not reduce the production authority: they are deployed, executable NORMAL-run RPCs.

### Pattern classification

- Pattern C: hidden/no-UI test helper is still server authority;
- Pattern D: intervention provenance is lost/misattributed;
- Pattern E: remediation introduces a new Teacher authority surface;
- Pattern F: test support changes production semantics to make testing easier.

### Disposition

**IDA-006 HIGH → CONFIRMED.**

### Closure condition

Closure verification must not leave an ungoverned NORMAL Teacher mutation capability that can alter canonical discussion timing without the required Teacher provenance/validity semantics.

CA is not prescribing whether the verification facility is removed, constrained, or governed through an existing canonical authority.

## 7. Canonical Ownership Check

**PASS.**

The correction interval changes:
- migrations 040–041;
- player runtime;
- test code.

No protected GA/VA canonical source is modified.

IDA-006 is a runtime authority/provenance violation, not a protected-source ownership violation.

## 8. Recurring Patterns A–F

| Pattern | Result |
|---|---|
| A — local correctness / cross-module handoff | PASS for IDA-001/004; automatic handoff and deadline owner now converge. |
| B — distributed failure | **FAIL** — IDA-002 reload/network-recovery sequence still replays consumed occurrence. |
| C — UI vs server authority | **FAIL** — IDA-006 production Teacher verification RPCs create hidden NORMAL gameplay authority. |
| D — current state vs historical evidence | **FAIL** — IDA-005 audio chronology remains inaccurate under IDA-002; IDA-006 also masks Teacher intervention as natural deadline. |
| E — authority accretion | **FAIL** — IDA-006 adds a new Teacher mutation authority outside existing canonical override provenance. |
| F — self-confirming tests | **FAIL** — IDA-002 failure injection is still absent, and the new deadline tests depend on production-only verification accelerators that themselves alter authority. |

## 9. Gate disposition

**Level2 closure re-audit = FAIL / BLOCKED.**

Closed:
- IDA-001 HIGH — FIXED_VERIFIED;
- IDA-003 HIGH — FIXED_VERIFIED;
- IDA-004 HIGH — FIXED_VERIFIED.

Open:
- IDA-002 MEDIUM — PARTIALLY_FIXED / OPEN;
- IDA-005 HIGH — PARTIALLY_FIXED / OPEN;
- IDA-006 HIGH — NEW / CONFIRMED.

Sprint7 remains blocked.

Migrations `001–041` are deployed history and must remain immutable.

Next unused migration is **042**.

Next owner: **CD**.

Next action:
- close IDA-002 failed-write/reload/network-recovery replay;
- close the remaining IDA-005 audio-forensic dependency;
- remove or correctly govern the IDA-006 NORMAL Teacher verification authority/provenance regression;
- add directly adjacent regression evidence;
- submit another Level2 targeted closure request.

Because the current audit is FAIL/BLOCKED, no Sprint7 pre-approval forecast is issued.
