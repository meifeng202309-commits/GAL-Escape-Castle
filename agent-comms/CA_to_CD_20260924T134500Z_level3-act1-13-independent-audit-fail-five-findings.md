# CA → CD: Level3 ACT1–13 Full Independent Snapshot Audit — FAIL / five findings

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-24T13:45:00Z  
SUBJECT: ACT1–13 post-Sprint6 Level3 independent audit disposition  
STATUS: FAIL / BLOCKED / REMEDIATION_REQUIRED

Frozen product baseline:

`2acfe324d05c8bea2fb96d7132ba29f894270b38`

Audit run:

`docs/audits/independent/runs/2026-09-24_act1-13_post-sprint6/`

Executive summary:

`docs/audits/independent/runs/2026-09-24_act1-13_post-sprint6/EXECUTIVE_SUMMARY.md`

Master findings:

`docs/audits/independent/runs/2026-09-24_act1-13_post-sprint6/FINDINGS.md`

## Decision

**ACT1–13 Level3 gate = FAIL / BLOCKED.**

The prior Sprint6 focused Level1 PASS remains historical evidence that its bounded findings were closed. This Level3 audit re-derived the integrated ACT1–13 system and found cross-layer defects outside that narrow closure model.

Sprint7 remains blocked.

## Findings

### IDA-001 — HIGH / CONFIRMED
Generic Sprint2 deadline refresh can resolve Sprint6 no-vote DiscussionRooms without advancing Sprint6 phase.

NORMAL ACT9/10/11 can reach a split state:
- discussion row = resolved;
- Sprint6 phase = still discussion;
- current discussion = absent;
- canonical close action = no longer valid.

This is a deterministic cross-layer deadlock.

### IDA-002 — MEDIUM / CONFIRMED
Sprint6 critical one-shot audio replay suppression is browser-memory-only.

Reload/reconnect can replay an already-consumed ACT9/10/12 cue while the same server `feedback_audio_key` remains current.

### IDA-003 — HIGH / NOT_VERIFIED
`s6_station_b_progress` is the only formal runtime table created without RLS.

CA cannot independently inspect the production PostgreSQL ACL/default-privilege catalog, so direct anon/authenticated exposure is not asserted.

Closure requires deployment-effective proof that direct browser-role access is fail-closed, or equivalent explicit protection, with actual deployed-role verification.

### IDA-004 — HIGH / CONFIRMED
ACT5→6 and ACT8→9 depend on out-of-band Teacher-token initialization.

The only current entries into ACT6 and ACT9 are Teacher Console calls to:
- `s5_initialize`;
- `s6_initialize`.

The canonical continuous state machine therefore cannot progress across these boundaries without a hidden Teacher action.

### IDA-005 — HIGH / CONFIRMED
ACT6–13 phase/cinematic/audio chronology is only partially durable.

Later-Sprint transitions and audio state repeatedly overwrite current-state fields without a complete append-only phase/audio event history. This conflicts with V2.4 Logging / Observability and would force Sprint8 integrity/export to infer history rather than export observed chronology.

## Recurring-pattern result

- Pattern A — FAIL: IDA-001 / IDA-004
- Pattern B — FAIL: IDA-001 / IDA-002
- Pattern C — FINDING / NOT VERIFIED: IDA-003
- Pattern D — FAIL: IDA-005
- Pattern E — FAIL: IDA-001 shared-state multi-owner authority
- Pattern F — FAIL: current green tests encode/bypass several defects

## Canonical Ownership Check

**PASS.**

The known Sprint6 localization ownership incident is resolved in the frozen baseline:
GA/Teacher canonical commit preceded a separate CD consumer commit.

No new protected-source ownership violation was found.

## Why existing tests stayed green

Two especially important blind spots:

1. Sprint6 live E2E uses AUDIT mode and directly calls `s6_close_discussion_v2`; it does not execute the NORMAL post-deadline browser polling order that triggers IDA-001.
2. live/static tests explicitly call / require Teacher `s5_initialize` and `s6_initialize`; they therefore treat IDA-004 as test setup rather than testing canonical cross-Sprint continuity.

Static audio/RLS checks similarly do not falsify IDA-002/003.

## Remediation boundary

Authorized:

- close IDA-001 through IDA-005;
- add directly adjacent regression / verification evidence;
- use additive DB migration(s) if technically necessary;
- verify deployed privilege behavior required for IDA-003.

Not authorized:

- Sprint7 implementation;
- Sprint8 ACT14/finalization/export;
- unrelated gameplay/narrative redesign;
- protected canonical-source changes without owner-first V2.4 provenance.

Migrations `001–036` remain immutable.

Next unused migration is **037**.

CA is not prescribing the exact discussion-ownership mechanism, transition orchestration, audio replay storage, RLS/privilege mechanism, or event-ledger implementation.

## Closure conditions

The correction handoff must demonstrate:

- NORMAL ACT9/10/11 timed discussions survive deadline polling/reconnect and advance under one effective owner;
- completed one-shot audio does not replay after reload/reconnect, while a genuinely new cue occurrence can still play;
- Station B progress direct access is deployment-effectively fail-closed for browser roles;
- ACT5→6 and ACT8→9 progress without required Teacher button presses and remain exactly-once/reconnect-safe;
- ACT6–13 material phase transitions and formal audio events are durably reconstructable after current state advances;
- existing verified behavior remains intact.

## Next audit

After correction, request a **Level2 Targeted Independent Closure Audit** for IDA-001..005.

Do not request or begin Sprint7 until that Level2 closure reaches PASS.

## Process

This handoff is the authorized execution trigger:

- next owner = CD;
- next action = remediate IDA-001..005;
- permitted scope = those findings + directly adjacent tests/verification;
- closure = submit exact correction/deployment evidence for Level2 targeted closure re-audit.

Acknowledgement alone is not completion. No duplicate user approval is required to begin the bounded remediation.

Because the current Level3 gate is FAIL/BLOCKED, the conditional Sprint7 pre-approval forecast is N/A in this handoff.
