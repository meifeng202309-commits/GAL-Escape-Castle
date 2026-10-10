# P01 — Library Five-Slot Input Model

Status: **DRAFT_SUBMITTED_FOR_CA_REVIEW** (not STATIC_READY / not integrated)
V4 work package: F5 / F9, ACT3 Library five-slot input affordance.
Authority: CA P01 isolated-draft gate in `agent-comms/CA_to_GA_20261010T194000Z_tca-v01-p01-source-audit-and-startup-gate.md`.
Protocol V0.1 is a GA proposal, not globally enacted governance.

## Exact source anchor
- Development branch: `remediation/sprint9-structural-v1`.
- Frozen TCA fork point: `5935f21cc7a056471e4283781bb53a8dd96026c8`.
- Source: `src/game/app.js` blob `c6d049dececb16af386418253d5dc55103f935a0`.
- Anchors: `scene.phase_key==="library_box"` near line 509; `submitLibraryCode` near lines 668–673.
- Existing contract: five total digits, server `puzzle_locked_prefix`, suffix entered by player, `s3b_submit_library_code` unchanged.

## API
`buildLibraryCodeModel(lockedPrefix, enteredSlots)`: ESM pure function.
- `lockedPrefix`: REQUIRED string of zero to five ASCII digits. No coercion or repair.
- `enteredSlots`: string of suffix digits or array of editable-slot strings (one digit or empty string). No coercion or truncation; array input may include gaps.
- `slots`: **all five positions** (fixed-length array); locked digits first; editable digits thereafter; vacant editable slots are `null`.
- `remainingSlotCount`: `5 - lockedPrefix.length`; `isComplete`: all five positions filled.
- `code`: exact five ASCII digits ONLY when complete; otherwise `null`.
- Invalid prefix, invalid player-slot types/content, or excess suffix => `TypeError`. Caller decides presentation; never repair server-owned prefix.

Dependencies: standard JavaScript only (ES modules); Node built-in `node:test` and `node:assert/strict` only for tests.
Allowed side effects: NONE. Prohibited: DOM, RPC, session, persistence, retries, request identities, attempts, cooldown, correctness, schema or deployments.

## Deliverables
- `implementation/library-code-model.mjs`: real source.
- `tests/library-code-model.test.mjs`: seven deterministic unit tests.
- `integration.patch`: **UNAPPLIED** integration sketch for exact anchor; future CD must inspect it and copy source to runtime path if approved.
- `INTEGRATE_OR_DISCARD.md`: short optional consumption instructions.

## Execution evidence
Executed locally in Node v22.16.0 on 2026-10-10:
- `node --check implementation/library-code-model.mjs`: PASS
- `node --check tests/library-code-model.test.mjs`: PASS
- `node --test tests/library-code-model.test.mjs`: **7/7 PASS**
Not executed: actual production integration, browser / 3-player test, RPC, Supabase, cooldown server behavior, application-wide regression, deployment, GitHub CI.

## Stop conditions
STOP and ask CA if source blob/anchor, prefix semantics, five-digit length, or imported interface differs; if target already implements an equivalent; if any live code or backend modification would be needed. Do NOT apply patch during TCA trial. Future CD may discard immediately without porting.
