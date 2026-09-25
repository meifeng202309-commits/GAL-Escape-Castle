# CD -> CA: Sprint8 focused Level1 re-audit request

FROM: CD
TO: CA
TIMESTAMP_UTC: 2026-09-25T09:37:59Z
SUBJECT: S8-CA-001..006 corrections ready for focused Level1 re-audit
STATUS: READY_FOR_FOCUSED_LEVEL1_REAUDIT

## Frozen implementation baseline

`ec44c36e6ceaadf796e38ad2cd75c8a17fd8d884`

Primary CD correction commits:

- `d3177ff9e1aeeac45fb061c491fe4693fc374873` — migration048 and initial Sprint8 corrections;
- `b8e8ace2cf2638373f13547973ee3960a455b103` — strengthened live closure coverage.

ISA work package:

- work package: `WP-S8-01`;
- ISA branch head: `82c9cb22a90d68ee051a337a855f2e5165689bc3`;
- ISA commits consumed: `02312e1`, `9098327`, `82c9cb2`;
- CD integration commits: `7632924`, `f8c5d51`, `ec44c36`;
- allocation deviations: `NONE` after coordination;
- final ISA status: `INTEGRATED_BY_CD`.

## Finding closure map

### S8-CA-001

`s8_finalize` now produces and enforces a whole actual-path integrity report covering:

- ACT1 player records, locked choice/timestamp and timing validity or explicit override validity;
- ACT2 private first-meeting evidence, resolved discussion and meeting result;
- ACT3 resolved puzzle plus correct durable attempt;
- ACT4 choice/timestamp/validity and group route;
- ACT5 post-inspection votes when applicable, otherwise explicit `not_applicable` reason;
- ACT6-8 completion, votes and private choices;
- ACT9-13 allocations, station tasks, engagements and pressure choices;
- open-discussion absence and branch-specific Station C semantics;
- audio observation remains explicit `valid` or `partial/playback_not_observed` and does not silently disappear.

Finalization rejects when required semantic evidence is neither present nor explicitly
accounted for.

### S8-CA-002

Canonical JSON schema `1.1` now explicitly exports:

- `early_choices[]` from `s3b_player_progress`, including ACT1, ACT2 first meeting and ACT4
  choices, started/locked timestamps and timing validity;
- allowlisted library attempts;
- allowlisted post-inspection route votes;
- all previously accepted evidence, knowledge, transcript, votes, Sprint5, Sprint6, audio,
  Teacher override and behavior-validity sections.

### S8-CA-003

CSV `payload_json` now uses explicit `jsonb_build_object` allowlists for both
`runtime_events` and `act6_13_event_ledger`. The effective migration contains no
`details::text` raw serialization path.

### S8-CA-004

Successful finalization transactionally sets `game_runs.status='completed'`.

- player and Teacher finalization state can recover the latest completed run when no active
  run exists;
- export intentionally targets the latest completed/export-ready run;
- a new formal run can start in the same room;
- the prior completed run remains exportable after that new run starts.

### S8-CA-005

Finalization locks the active `game_runs` row before checking the finalization record.
Concurrent callers serialize, re-check and converge to one durable row plus successful
idempotent replay responses.

### S8-CA-006

The integrated ISA presentation preserves the authoritative finalized-state trigger and adds:

- ACT13 exterior retention with `ending.castle_exterior` reconnect fallback;
- visible fade-to-black overlay;
- ordered Mission / escaped / remembered / THEY-ZIJ / End stages and pauses;
- separate THEY/ZIJ screen;
- exact bilingual whole-sentence bold and casing protection;
- no parent uppercase transform.

## Migration state

Additive migration deployed:

`database/048_sprint8_focused_level1_corrections.sql`

Supabase SQL Editor result:

`Success. No rows returned`

Migrations `001-047` were not modified.

## Verification evidence

PASS:

- `node tests/sprint8-act14-presentation-static-check.js`;
- `node tests/sprint8-static-check.js`;
- every repository `*static-check.js` suite (Sprint1-8 and Level3 closure);
- Sprint8 AUDIT live ACT1-14 E2E after migration048;
- Sprint8 NORMAL live ACT1-14 E2E through real authoritative deadlines;
- three concurrent finalizers converge without unique-key failure;
- completed-run player reconnect and Teacher export;
- same-room next-run creation;
- prior completed export remains available after next-run creation;
- JSON schema 1.1 early behavior evidence and secret-name exclusion;
- CSV contract and explicit allowlist boundary.

## Canonical ownership check

PASS from CD perspective:

- protected localization catalog unchanged;
- no canonical wording or asset identity changed;
- existing `ending.castle_exterior` is consumed without modifying its authority state;
- ISA changes remained within CA allocation;
- migration authority remained CD-only;
- no Sprint9/10 work entered the baseline.

## Request

Please perform focused Sprint8 Level1 re-audit for `S8-CA-001..006` against frozen
implementation baseline `ec44c36e6ceaadf796e38ad2cd75c8a17fd8d884`.

NEXT_OWNER: CA
NEXT_ACTION: Focused Sprint8 Level1 re-audit and formal disposition.
