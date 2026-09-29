# Packages B/C — CA Shared-Shell Checkpoint

## Audit identity

- Audit owner: CA
- Branch: `remediation/sprint9-structural-v1`
- CA-A PASS baseline: `97e94ad6ddcf76d5452323baa9c3e67e6915c2eb`
- CD frozen B/C checkpoint: `e692dfa7de8130caefb2cae5a9534cf06a7a7471`
- CD handoff: `agent-comms/CD_to_CA_20260929T022820Z_packages-b-c-complete-request-package-d-release.md`
- Decision: **Package B PASS; Package C FAIL with one bounded HIGH residual; Package D remains blocked**

CA reconstructed the B/C diff and source/runtime contracts independently rather than accepting CD's evidence summary.

---

# 1. Package B — PASS for this checkpoint

## Scope checked

S3 accepted / locked / waiting contract:
- PFC-002;
- PFC-003;
- reconnect behavior;
- no unrevealed peer-private disclosure.

## Independent findings

### Early ACT barriers

The client now renders explicit accepted/waiting states for:
- ACT2 leave;
- ACT2 route acknowledgement;
- ACT3 reunion/follow-sign;
- ACT4 private choice.

The state used is existing server-authoritative per-player progress.

### ACT8 private choice

The current player's locked private choice now produces an explicit waiting surface rather than only a lock notice.

### ACT9–ACT12

Migration065–067 provides a current-player wait projection.

CA checked the potential multi-step ACT9 identity risk independently:
- `s6_choices` is keyed by `phase_key + round_no + player_id`;
- ACT9 increments `round_no` after each resolved console step;
- therefore prior-step choices do not falsely lock the next step.

The projection exposes:
- current player's lock state;
- aggregate submitted / engaged count;
- current player's allocation / engagement state.

It does not expose peer private choice content.

### Forward-fix discipline

Migrations066–067 correctly repair:
- nonexistent `submitted_at` → canonical `locked_at`;
- ACT11 progress count from `s6_allocations`, not `s6_choices`.

No rewrite of deployed migrations was found.

### Package B disposition

```text
PACKAGE B = PASS
PFC-002 = source/dynamic closure sufficient for this checkpoint
PFC-003 = source/dynamic closure sufficient for this checkpoint
```

Final integrated Level2 still applies later.

---

# 2. Package C — one bounded HIGH residual

## What Package C correctly added

The client now fetches `s3_get_player_state` throughout the active canonical run rather than only while Sprint5 is active.

A shared evidence panel is mounted in:
- early ACT / Sprint3B shell;
- Sprint5 shell;
- Sprint6 / ACT9–13 shell.

Existing server authority remains authoritative for:
- owned items;
- item view state;
- observations;
- shared photos;
- group items;
- photo sharing.

Reconnect persistence for the tested Linda watch view and group evidence is source/live coherent.

These are meaningful improvements.

---

## C-CA-001 — HIGH — Pocket is mounted, but most canonical items are not actually inspectable

### Canonical requirement

V4.0 §9.0.2 states:

> Pocket only contains carryable objects, and an object's internal information is shown when the player reopens / inspects that object.

Each Pocket item must define, at minimum:
- item identity;
- display name;
- asset/view;
- available actions;
- exact UI text;
- hidden/optional information.

The original PFC-005 specifically identified the gameplay consequence that Gitte must be able to reopen the Number Note and recover `41739`, and that later object inspection remains available rather than forcing memory or fallback hints.

### Current implementation

Current `pocketEvidencePanel` renders generic owned items as:

```text
item name
current_view
```

Only `linda_stopped_watch` has special-case internal content and a FLIP action.

The renderer does not provide corresponding inspect content/actions for canonical early items such as:
- `gitte_number_note`;
- `anna_servant_diary`;
- `linda_closure_order`;
- `gitte_castle_map` as a reopenable evidence object;
- other carryable clue objects where canonical internal information is required.

In particular, `gitte_number_note` is inserted into the player's Pocket at mandatory GRAB, but its Pocket entry does not render the exact note content / `41739`.

The server projection also contains `knowledge`, but the current evidence panel does not render `pocket.knowledge`; this reinforces that "state exists" is not equivalent to "player can inspect the evidence".

### Why this is still PFC-005

Package C has solved:

> Pocket state is available across ACTs.

It has **not yet fully solved**:

> early-game evidence can be reopened and used later as canonical gameplay evidence.

That distinction is material. A list of item names is not the canonical Pocket capability.

### Test blind spot

The Package C live test verifies:
- Linda's stopped watch;
- FLIP persistence;
- ACT3 torn-note group evidence;
- observation-set persistence.

It does **not** verify:
- Gitte Number Note reopen → `41739`;
- Anna diary reopen;
- Linda closure-order reopen;
- other required early-object inspect content.

Therefore the live test currently validates the one item type that has a renderer special case and does not falsify the missing generic inspect capability.

### Required outcome

Package C must make canonical carryable evidence genuinely reopenable/inspectable across the permitted ACTs.

At minimum, closure evidence must prove:
- Gitte can reopen the Number Note after GRAB and recover `41739`;
- canonical internal content is available for the other required early carryable clues;
- reconnect preserves the current view/inspect state;
- hidden/optional information is not auto-unlocked merely because the item is in Pocket;
- server authority/provenance remains intact.

CA is intentionally not prescribing the data structure, content mapping, or renderer decomposition.

---

# 3. Package D release decision

```text
Package B = PASS
Package C = FAIL — C-CA-001 OPEN_HIGH
Package D = NOT RELEASED
NEXT_OWNER = CD
```

CD should correct **Package C only**, with no Package D work.

After correction:
1. freeze a new B/C checkpoint SHA;
2. provide factual source/live evidence that the Number Note and representative other canonical early items are actually inspectable;
3. preserve Package B and Package A regressions;
4. return ownership to CA for a narrow Package C recheck.

No Teacher approval is required for this bounded Package C correction.
