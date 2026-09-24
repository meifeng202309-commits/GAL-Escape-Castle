# Sprint5 ACT 6–8 + visual-dynamic UI — Third Focused Level 1 Re-audit

Baseline: `502ce58`  
Scope: closure of remaining `S5-CA-001` only, plus directly adjacent regression risk  
Audit level: Level 1 — Focused re-audit  
Decision: **FAIL / BLOCKED — ONE NARROW CANONICAL DISPLAY GAP REMAINS**

## 1. What is fixed

The submitted correction materially closes almost all of the remaining ACT6/ACT7 evidence-interaction gap:

- the shared evidence panel is mounted in ACT6, ACT7 and ACT8;
- ACT6 exposes owned Pocket items and user-executable SHARE PHOTO controls while server authority allows sharing;
- ACT7 exposes group Torn Note and Linda's Stopped Watch as inspectable evidence;
- Torn Note expands to canonical `act03.016`;
- Stopped Watch exposes a FLIP control wired to authoritative `s3_set_item_view(...)`;
- reconnect/state refresh restores the persisted `current_view`;
- the async refresh path snapshots the active session and drops stale poll responses after a session switch;
- focused live E2E verifies Stopped Watch front → back transition and reconnect persistence.

These are valid corrections.

## 2. Remaining S5-CA-001 gap

The Stopped Watch view state changes correctly, but the displayed evidence content does not change with it.

Current renderer behavior:

- it always renders `act01-l.002` for `linda_stopped_watch`;
- `act01-l.002` is canonical front evidence: **TIME — 23:49**;
- the FLIP changes only `current_view` and the next button target;
- there is no conditional rendering of canonical back evidence `act01-l.017`: **REMEMBER WHEN YOU WOKE.**

Therefore after FLIP to `back`, the UI can show:

- current_view = `back`;
- but still display the front-side evidence text.

This contradicts V4.0 ACT7 §16.3, which requires the back-side discovery to expose **REMEMBER WHEN YOU WOKE.**

## 3. Why this remains blocking

The remaining closure condition was not merely “persist a back/front flag.” It required the Stopped Watch to be inspectable as evidence, including the permitted FLIP/current-view path.

A back state that still displays front evidence is an authority/presentation mismatch: persisted item state says “back,” while the player-visible evidence says “front.”

Because ACT7 reasoning explicitly depends on inspectable evidence, this is still part of the canonical behavior surface rather than optional polish.

## 4. Adjacent regression review

No new blocker was found in the submitted correction.

The session-snapshot guard is directionally correct: stale async refresh results are prevented from rendering into a newly switched session.

ACT6 SHARE PHOTO still uses the server-authoritative current item view and preserves the existing ownership/provenance rules.

Torn Note rendering is now reachable in ACT7.

## 5. Test adequacy

CD reports:

- Sprint5 static PASS;
- Sprint5 live E2E PASS;
- production browser ACT6 Pocket / SHARE PHOTO visible;
- production browser ACT7 Stopped Watch / Torn Note controls visible;
- live E2E verifies Stopped Watch front → back and reconnect persistence.

These prove interaction reachability and persistence.

They do **not** currently assert that the player-visible Stopped Watch evidence text changes from front content to canonical back content after FLIP.

## 6. Recurring-error pattern scan

| Pattern | Result | Focused result |
|---|---|---|
| A — local correctness / cross-module handoff | **FINDING** | DB/current_view changes, but rendered evidence content does not follow the same authoritative view. |
| B — distributed/retry boundary | PASS | reconnect preserves back state; stale session poll guard is present. |
| C — UI/server authority mismatch | **FINDING** | server says `back`; UI still presents front evidence text. |
| D — current state vs historical evidence | PASS | persisted view survives reconnect. |
| E — authority accretion | PASS | no new writer/authority path introduced. |
| F — self-confirming tests | **FINDING** | tests verify state transition and presence of controls, but not content correctness after FLIP. |

## 7. Gate disposition

**Sprint5 remains BLOCKED.**

Remaining finding:

- `S5-CA-001 HIGH → PARTIALLY_FIXED / OPEN`

Exact remaining closure condition:

- when Stopped Watch `current_view=front`, render canonical front evidence;
- when `current_view=back`, render canonical back evidence `act01-l.017`;
- reconnect must continue to render the evidence content corresponding to the authoritative persisted view.

No Sprint6 implementation is authorized.

Migrations `027–032` remain immutable. No DB correction is currently required; if one becomes necessary, it must begin at `033+`.

Next owner: **CD**.
