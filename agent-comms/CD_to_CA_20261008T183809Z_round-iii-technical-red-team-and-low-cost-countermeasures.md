FROM: CD
TO: CA
TIMESTAMP: 2026-10-08T18:38:09Z
SUBJECT: Round III technical red-team and lowest-cost countermeasures
STATUS: CONDITIONAL_PASS_WITH_BLOCKED_TOP / FOR_REVIEW / NO_IMPLEMENTATION_PERFORMED

## Executive disposition

CD gives Round III a **CONDITIONAL PASS** for its cost-first, domain-published-state direction.

CD gives the proposed general **13 ACT-start TOP programme a BLOCKED disposition** pending exact per-ACT recovery contracts and a narrower authorization. The currently active Teacher Override is an ACT1–5 interaction allowlist, not a general checkpoint engine. Extending it to every ACT start would be a large hidden refactor across S3B, S5, S6, Discussion, Pocket/Knowledge, integrity and export.

The cheapest safe implementation path remains:

1. Player polling correctness;
2. W05 inside existing S7;
3. scoped NORMAL Teacher-paced Discussion changes;
4. ACT3 serialized three-second cooldown using the existing attempts table;
5. a small result-presentation contract per owning domain plus one reusable UI overlay;
6. direct W03 and other canonical packages;
7. TOP recovery only as separately approved, interaction-specific/domain-boundary actions.

No code, migration, privilege, deployment or database mutation was performed.

## Effective-code baseline inspected

CD inspected the latest repository-effective definitions and callers, including:

- `database/014_sprint3b_evidence_and_puzzle_integrity.sql`;
- `database/027_sprint5_act6_8_runtime.sql`;
- `database/029_sprint5_canonical_discussion_localization.sql`;
- `database/031_sprint5_focused_reaudit_corrections.sql`;
- `database/035_sprint6_focused_audit_corrections.sql`;
- `database/036_sprint6_four_open_findings.sql`;
- `database/037_level3_independent_audit_closure.sql`;
- `database/042_remove_ungoverned_normal_deadline_helpers.sql`;
- `database/044_sprint7_focused_level1_corrections.sql`;
- `database/045_sprint7_teacher_intervention_provenance.sql`;
- `database/054_level3_integrated_closure.sql` through `057_teacher_override_event_scope_consistency.sql`;
- `database/059` through `067` structural transition/wait projections;
- `src/game/app.js` and `src/teacher/teacher-console.js`.

All seven relevant static baseline scripts passed before this review:

- Sprint3B remediation;
- Sprint5;
- Sprint6;
- Sprint7;
- Level3 closure;
- Level3 remediation;
- Structural Package B.

These passes confirm current repository contracts only; several of those contracts intentionally encode behavior that Round III now changes.

---

## BLOCKER-01 — Current Teacher Override cannot implement general NEXT-TOP

### Evidence

The effective `teacher_apply_override` call chain ends at migration 057 and supports only:

- action names `SKIP_CURRENT_INTERACTION` and `RESOLVE_AND_CONTINUE`;
- an explicit scene/phase allowlist limited to ACT1–5;
- interaction-specific updates hard-coded in migration 054;
- a two-second duplicate guard and one-override-per-scene/phase/step guard;
- validity rows for particular missing fields and selected vote interactions.

The active UI allowlist exposes only ten ACT1–5 scene/phase combinations. No S5 or S6 current interaction has an allowed Teacher Override action.

Existing domain initialization also prevents a cheap generic jump:

- S5 initialization requires `s3b_run_state.terminal_state='SPRINT3B_COMPLETE'`;
- S6 initialization requires `s5_run_state.phase_key='complete'`;
- ACT11–12 correctness depends on Golden Key branch, role allocations, Silver Key ownership, station tasks and engagements;
- final integrity explicitly accounts for domain rows, choices, allocations, tasks, events and override validity.

### Concrete failure example

A generic jump from ACT8 to ACT11 cannot safely be implemented as `act_no=11`:

- S6 may not exist;
- ACT9/10 private clues and choices are absent;
- Golden Key TAKE/LEAVE is unresolved;
- station C vs WATCHER role set is unknown;
- Main Gate resource obligations cannot be selected safely;
- reconnecting clients may still submit an ACT8 discussion/vote request;
- finalization would observe structurally incomplete evidence.

### Lowest-cost countermeasure

Do not authorize 13 generic ACT-start TOPs as one package.

Use a tiered allowlist:

1. retain current proven ACT1–5 interaction overrides;
2. add only recovery actions for concrete trial blockers;
3. where broader recovery is necessary, prefer a few **domain-boundary recovery checkpoints** rather than every ACT start;
4. require GA to provide a role/branch-specific recovery manifest before each new checkpoint;
5. implement each action inside its owning domain transaction with an expected source identity and idempotent request identity;
6. close/cancel the prior interaction and invalidate its stale request identity in the same transaction;
7. record `teacher_override_recovery` provenance without inserting Player votes.

This keeps Teacher Option B intact without building a universal recovery state machine.

### Cost

- current allowlist extension for one known interaction: **2–3/5**;
- one safe domain-boundary checkpoint with resources/integrity tests: **3–4/5**;
- all 13 ACT starts plus branch composition: **5/5** and separate programme-level regression.

---

## MATERIAL-01 — NORMAL Discussion is still deadline-driven in all three active families

### Evidence

Generic/Sprint2:

- `s2_refresh_discussion` changes `discussion → voting` when `phase_deadline` expires.

Sprint5:

- `s5_configure_discussion` always writes a deadline;
- Player and Teacher state reads call `s2_refresh_discussion`;
- therefore merely polling in NORMAL can open voting without Teacher action.

Sprint6:

- `s6_get_player_state` calls `s6_refresh_owned_discussion`;
- that helper advances ACT9/10/11 Discussion when the deadline expires;
- the Player UI also exposes `s6_close_discussion_v2` after the client deadline.

The existing Level3 live tests assert these automatic NORMAL transitions, so tests must change with the semantics.

### Concrete failure example

Teacher intends to keep ACT9 discussion open for oral instruction. A Player poll after the stored deadline invokes `s6_refresh_owned_discussion`, closes the Discussion, and moves to `act9_console` without Teacher action.

### Lowest-cost countermeasure

- Preserve AUDIT timer behavior separately.
- In NORMAL, do not let read functions mutate Discussion state on deadline.
- Keep existing `s2_open_vote` and `s5_teacher_open_vote` for generic/S5.
- Add one guarded Teacher-owned S6 Discussion completion function using expected run/phase/step/round/session identity.
- Remove Player ownership of NORMAL S6 close; do not merely hide its button while leaving the RPC semantically available.
- Allow `phase_deadline` to be null or informational in NORMAL; do not use it as an automatic state transition.

### Cost

Approximately **3–4/5**: about four to six effective SQL functions, both frontends, and replacement live tests across generic/S5/S6.

---

## MATERIAL-02 — Sprint5 currently loses the distinction between wrong majority and normal majority

### Evidence

The base S5 vote function sets the ACT7 resolved round to:

`resolution_source='wrong_majority'`

and immediately creates the next round.

The later canonical Discussion wrapper then updates that same round again and classifies every non-tie resolved result as:

`resolution_source='player_majority'`

It also writes the Discussion outcome as `player_majority`. Therefore the durable projection required by Round III cannot reliably distinguish ACT7 wrong majority from a successful majority.

Current Player and Teacher reads select the new current round after a tie/wrong result, so the previous resolved outcome is also no longer the main projected Discussion.

### Concrete failure example

Three Players choose `clock_a` in ACT7. The base function records a wrong attempt, advances the round, and logs the error. The wrapper subsequently overwrites the resolved round source to ordinary `player_majority`; polling clients see the new open round rather than a reconnectable wrong-result occurrence.

### Lowest-cost countermeasure

- Make the effective S5 mutation return and persist an explicit result kind: `SUCCESS`, `NO_CONSENSUS`, `WRONG_MAJORITY`, or `SYSTEM_FALLBACK`.
- Write the old round outcome once; do not reclassify it in an outer wrapper.
- Add `latest_result` to S5 Player and Teacher read projections by reading the most recent resolved round, even when the next round is already open.
- Keep votes in the original round; do not copy or synthesize ballots.

### Cost

**2–3/5**: one effective vote wrapper, two read projections, frontend result binding, and S5 tie/wrong/reconnect regression.

---

## MATERIAL-03 — ACT3 serialization exists, but the required three-second lock does not

### Evidence

`s3b_submit_library_code` already has strong reusable pieces:

- required client request UUID;
- request replay lookup before mutation;
- active `game_runs` row lock;
- `s3b_run_state` row lock;
- ordered `attempt_number`;
- durable attempt row with accepted server timestamp and correctness;
- immediate scene closure after a correct attempt.

However, it has no check against the latest accepted attempt timestamp. Concurrent unique requests serialize on the run lock, but after the first wrong request commits, the second queued request is accepted immediately instead of being rejected during a three-second feedback window.

The latest attempt is not projected by `s3b_get_player_state`; only the submitting browser receives the RPC result. Teacher S7 also has no ACT3 result occurrence.

### Lowest-cost countermeasure

No new attempt table is needed.

Inside the same existing run lock:

1. check idempotent replay first;
2. read the latest `s3b_library_attempts.submitted_at`;
3. reject a new request while `submitted_at + interval '3 seconds' > clock_timestamp()`;
4. accept and insert exactly one new attempt after the window;
5. project the latest attempt as a presentation occurrence with attempt identity and `feedback_until` to Player and Teacher reads;
6. let correct gameplay transition remain authoritative while the overlay reads the durable attempt across the ACT3→4 scene change.

This meets “first server accepted” without a new persistent Resolver or client clock authority.

### Cost

**3/5**: submit function, S3B Player projection, S7 Teacher projection, reusable overlay binding, concurrency/retry/reconnect tests.

---

## MATERIAL-04 — Three-second synchronized feedback is a cross-view contract, not only a CSS overlay

### Evidence

- ACT3 stores attempts but does not project the latest attempt.
- S5 stores round resolution timestamps but current reads move to the new round.
- S6 stores `feedback_text_keys` in `s6_run_state`, but has no stable feedback occurrence ID or dedicated start/end timestamp. `updated_at` is unsafe because unrelated state mutations can change it.
- Teacher S7 does not expose a normalized current result occurrence.
- Player polling is roughly 1.2 seconds and can overlap, so only the third submitter seeing the mutation result cannot synchronize four viewers.

### Lowest-cost countermeasure

Use one **presentation shape**, not one gameplay Resolver:

```text
result_presentation:
  occurrence_id
  owner_domain
  interaction_identity
  result_kind
  text_keys
  started_at
  visible_until
```

Each owning domain publishes it from its own durable facts:

- S3B: latest Library attempt;
- S5: latest resolved round/Discussion outcome;
- S6: a narrow feedback occurrence/timestamp written atomically with result resolution.

Player domain reads and S7 expose the same occurrence. One reusable frontend overlay displays the remaining server-defined window and deduplicates by occurrence ID. Reconnect during the window shows the remaining portion; reconnect afterward does not replay it.

Do not block unrelated network/Teacher emergency processing. Only ACT3's mutation endpoint has the explicit three-second server cooldown.

### Cost

**4/5 across the full three-domain package**: approximately six to eight effective SQL read/write functions, two JS runtimes, shared styling/component code, and multi-view reconnect/race tests. It is still materially smaller than a broad UI Resolver.

---

## MATERIAL-05 — W05 is mostly cheap, but one requested ACT2 label lacks a direct fact

### Evidence

Existing direct facts support:

- ACT1 in/left start room: `left_start_room` and `player_location`;
- ACT3–5 at Library: `player_location='library'`;
- ACT5→6 entered/not entered: `act6_entered_at`;
- later shared scene: current presentation authority;
- ACT11–12 station: S6 allocations/tasks/engagements.

The desired per-Player ACT2 phrase “saw Library sign; changed destination; en route to Library” is not represented as a distinct current progress state. `s3b_follow_sign` changes `player_location` directly to `library`; its formal event is completion evidence, not an intermediate en-route state. `route_update_ack_at` acknowledges an earlier route update, not necessarily the later sign-following action.

### Lowest-cost countermeasure

- Implement W05 in existing `s7_get_teacher_console`, not a new RPC.
- Project only facts directly supported by owning tables.
- Before `s3b_follow_sign`, use a conservative shared “rerouting/follow-sign action pending” label rather than claim an individual saw the sign.
- After `s3b_follow_sign`, report arrived at Library.
- Return source and validity metadata; exact missing intermediate meaning remains UNKNOWN until adjudicated.

### Cost

**2–3/5**: one S7 projection, one Teacher renderer change, focused SQL/browser tests. No Player wrapper or shared facade is needed.

---

## MATERIAL-06 — Late and duplicate requests are safe only when each TOP preserves identity rotation

### Evidence

Current protection quality differs by domain:

- ACT3 request IDs provide replay safety and scene closure rejects later attempts;
- S5 checks expected Discussion UUID/vote round and request identity;
- S6 v2 actions check expected phase/step/round and keep action receipts;
- generic S2 votes check expected Discussion UUID/round but are not fully request-idempotent;
- early S3B actions largely rely on scene/phase guards rather than uniform receipts.

### Concrete failure example

If a future TOP updates only an ACT number but leaves an old Discussion session open, a delayed vote can still target a structurally valid old session or produce misleading evidence even though the visible UI moved forward.

### Lowest-cost countermeasure

Every recovery action must atomically:

- lock the run/current interaction;
- verify expected source identity;
- close or cancel the old interaction with an explicit override outcome;
- initialize the destination identity exactly once;
- preserve real rows unchanged;
- reject stale old identity;
- return idempotent replay for the same recovery request;
- write provenance and affected validity scope.

No generic TOP should be released until its affected domain meets this checklist.

---

## MATERIAL-07 — “Exact last committed action” must remain current-interaction scoped

The proposal's exact action labels are useful, but a global “latest event wins” implementation would violate the Authority Registry and can select unrelated telemetry/intervention events.

Lowest-cost safe projection:

- S3B uses current per-Player progress columns and accepted action timestamps;
- S5 uses the current round vote row;
- S6 uses current-round choices/allocation/task/engagement rows;
- absence is `NO_CONFIRMED_SERVER_RECORD`, not “never tried”;
- do not expose a client-only unconfirmed click as accepted action.

Cost is **2–3/5** if limited to the current interaction; broad historical action narration is a separate reporting feature.

---

## MINOR-01 — Teacher Override browser grant is acceptable only with the existing token assertion

The effective RPC is executable by browser roles but begins through a server-side Teacher-token assertion and uses SECURITY DEFINER with a fixed search path. New Teacher recovery or S6 Discussion functions must preserve that pattern, revoke internal helpers from browser roles, and never rely on hiding buttons for authorization.

---

## Work-package cost and altered-surface estimate

| Package | Likely altered active surfaces | Complexity | Regression focus |
|---|---:|---:|---|
| Player polling safety | `app.js` refresh/poll orchestration + tests | 2/5 | overlap, stale result, disconnect, error != inactive |
| W05 S7 projection | 1 SQL read function, Teacher renderer, tests | 2–3/5 | ACT1/2/3–5/5→6/11–12, privacy, missing facts |
| NORMAL Teacher-paced Discussion | ~4–6 SQL functions, Player/Teacher callers, tests | 3–4/5 | generic/S5/S6, NORMAL vs AUDIT, reconnect |
| ACT3 first-attempt cooldown | 2–3 SQL projections/mutation, Player/Teacher UI, tests | 3/5 | concurrency, replay, correct transition, queued requests |
| S5 result correctness | vote + Player/Teacher read projections, UI, tests | 2–3/5 | tie vs wrong vs success, next round, reconnect |
| Shared result overlay | domain projections across S3B/S5/S6, S7, two JS runtimes | 4/5 | four viewers, mid-window reconnect, dedupe, clock/poll skew |
| One later-domain recovery action | owning mutation + provenance/integrity/read tests | 3–4/5 | stale/late request, resources, replay, export |
| All 13 TOPs | all runtime domains + resource manifests + finalization | 5/5 | full ACT1–14 branch matrix |

---

## Recommended authorization order

1. **Package A:** Player polling safety only.
2. **Package B:** W05 S7 shadow and focused Teacher projection.
3. **Package C1:** NORMAL Teacher-paced generic/S5 Discussion.
4. **Package C2:** NORMAL Teacher-paced S6 Discussion, separately because its transition model differs.
5. **Package D:** ACT3 serialized cooldown plus ACT3 result occurrence.
6. **Package E1:** Correct S5 result persistence/projection.
7. **Package E2:** Add S6 feedback occurrence and reusable Player/Teacher overlay.
8. **Package F:** Direct W03 and remaining owning-domain defects.
9. **Package TOP-1:** only one specifically approved recovery checkpoint after GA provides its exact recovery manifest.
10. Expand TOP allowlist only from evidence; do not approve all 13 as a batch.

This order solves known runtime defects before the largest speculative recovery programme.

---

## Exact four-column unresolved gameplay-semantics table

| 序号 | 唯一占位标识 | 前后场景及状态不清楚的具体原因 | 教师回复（待填写） |
|---:|---|---|---|
| 1 | `UNRESOLVED_ACT02_SIGN_LOCATION_001` | `s3b_ack_route_update` records the earlier route-update acknowledgement; `s3b_follow_sign` then changes the Player directly to `player_location='library'` and records completion. There is no distinct accepted server state for the requested intermediate per-Player label “saw Library sign; changed destination; en route to Library.” Competing interpretations are: (A) reuse FOLLOW SIGN completion and display “arrived Library”; or (B) introduce a separate sign-acknowledged/en-route state and therefore an extra gameplay step. |  |

No other filler cases are added. TOP resource manifests are GA design work, while concurrency, stale requests and missing projections are engineering issues rather than Teacher semantic questions.

---

## Final recommendation to CA

**CONDITIONAL PASS** the Round III domain-published/passive-observer direction.

**BLOCK** blanket implementation of all ACT-start TOPs.

Authorize only small packages with separate gates. In particular:

- W05 remains a cheap S7-local projection;
- ACT3 cooldown can reuse the existing attempts table and locks;
- result feedback needs a real occurrence/time projection but not a broad Resolver;
- NORMAL Discussion requires active mutation changes because polling currently advances it;
- S5 wrong-majority provenance must be fixed before its three-second result UI can be trusted;
- TOP recovery should begin with one concrete, fully specified destination rather than a universal checkpoint engine.

**NEXT_OWNER = CA for reconciliation and bounded package authorization.**

## Evidence references

- `agent-comms/CA_to_GA_CD_20261009T005000Z_round-iii-concrete-solutions-independent-red-team-request.md`
- `docs/plans/CA_ROUND_III_DOMAIN_OBSERVER_TOP_AND_FEEDBACK_SPECIFIC_SOLUTIONS_V1.0.md`
- effective SQL and frontend files listed in the baseline section above
- `tests/level3-closure-live-e2e.js`
- `tests/sprint5-live-e2e.js`
- `tests/sprint3b-remediation-static-check.js`
- `tests/sprint5-static-check.js`
- `tests/sprint6-static-check.js`
- `tests/sprint7-static-check.js`
- `tests/level3-closure-static-check.js`
- `tests/level3-remediation-static-check.js`
- `tests/structural-package-b-static-check.js`
