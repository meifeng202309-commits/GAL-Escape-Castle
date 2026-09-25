# CA → CD: Sprint8 regular Level1 Audit — FAIL / six findings

FROM: CA
TO: CD
TIMESTAMP_UTC: 2026-09-25T04:09:00Z
SUBJECT: Sprint8 ACT14 finalization/export Level1 audit disposition
STATUS: FAIL / BLOCKED

Frozen baseline:

`5882830d343f6aba9c44a25fe66ad1fb8d245002`

Full report:

`docs/audits/regular/runs/2026-09-25_sprint8_level1/AUDIT_REPORT.md`

## Decision

**Sprint8 Level1 = FAIL / BLOCKED.**

Open findings:

- **S8-CA-001 HIGH** — semantic session-integrity gate covers only a narrow late-Sprint subset, not all required actual-path evidence.
- **S8-CA-002 HIGH** — canonical JSON omits core ACT1/ACT2/ACT4 locked choices/timestamps and related early behavior evidence.
- **S8-CA-003 HIGH** — CSV violates allowlist-only export hard rule by serializing raw event `details`.
- **S8-CA-004 HIGH** — finalization leaves `game_runs.status='active'`, so completed run remains active and blocks a new run in the same room.
- **S8-CA-005 MEDIUM** — concurrent finalizers can race past the pre-lock idempotency check and one can fail on unique run_id.
- **S8-CA-006 MEDIUM** — ACT14 exact text is correct, but canonical fade / pauses / staged separate-screen reveal is not implemented.

Sprint9/10 remain unauthorized.

## S8-CA-001

Do not equate “reached ACT14” with “durable analytical record is complete.”

Current integrity verification checks only:
- players;
- Sprint6 allocations/tasks/engagements;
- ACT12 pressure choices;
- open discussions;
- Station C applicability;
- audio status.

It does not semantically verify required earlier-path evidence or explicit validity/absence reasons.

Closure requires whole actual-path integrity semantics before setting `session_integrity_verified=true`.

## S8-CA-002

Migration047's canonical JSON does not read `s3b_player_progress`.

Therefore core analysis evidence such as:
- ACT1 first choices/timestamps;
- ACT2 first-meeting choices/timestamps;
- ACT4 choices/timestamps/validity

is absent from the primary post-game JSON.

Do not require GPT to reconstruct these from incidental logs.

## S8-CA-003

The CSV ledger currently sends raw:

`runtime_events.details::text`

and raw:

`act6_13_event_ledger.details::text`

into `payload_json`.

The canonical security rule requires explicit allowlisted export DTOs and forbids direct row/blob serialization.

The current static secret-name test cannot protect this raw path.

## S8-CA-004

Sprint8 sets:
- `game_completed=true`;
- `export_ready=true`;
- `completed_at`;

but does not set:

`game_runs.status='completed'`.

Because one active run per room is enforced and `s2_start_run` rejects an active run, the room can never start its next formal run.

Correct the lifecycle coherently while preserving completed-run reconnect/export access.

## S8-CA-005

The finalization-row replay check happens before the Sprint6 row lock.

Two simultaneous callers can both observe no finalization row; the loser later attempts the same primary-key insert and errors.

Close the concurrency/retry boundary. CA does not prescribe exact locking/idempotency mechanics.

## S8-CA-006

Current ACT14 renders all five lines simultaneously.

V4.0 requires fade to black, staged lines, pauses, and a separate-screen THEY/ZIJ reveal.

Preserve the already-correct exact bilingual typography while restoring canonical sequence/timing.

## What passed

- pending audio flush precedes finalization;
- exact ACT14 canonical wording and bold/casing are preserved;
- export gating is server-side and Teacher-authenticated;
- most JSON fields are explicit allowlist objects;
- NORMAL/AUDIT filename/mode logic is source-correct;
- no ACT15/16, prediction, Behavior Trace, or Sprint9 work;
- Canonical Ownership Check PASS.

NORMAL live export remains NOT VERIFIED in the submitted evidence. The missing historical `s5_verify_expire_discussion` helper is expected because migration042 intentionally removed that temporary helper; do not restore it merely for testing.

## Correction boundary

Authorized:
- S8-CA-001..006 only;
- directly adjacent tests/live/concurrency evidence;
- additive migration(s) if required.

Not authorized:
- Sprint9;
- Sprint10;
- runtime post-game behavior analysis/prediction;
- unrelated gameplay redesign;
- protected canonical edits without owner-first provenance.

Migrations `001–047` are immutable.

Next unused migration = **048**.

## Process

This handoff is the active execution trigger:

- next owner = CD;
- next action = close S8-CA-001..006;
- permitted scope = those findings + directly adjacent regressions;
- closure = submit focused Sprint8 Level1 re-audit request.

Acknowledgement alone is not completion.

The next milestone independent snapshot remains scheduled after Sprint8 reaches regular closure and before Sprint9/10 progression.
