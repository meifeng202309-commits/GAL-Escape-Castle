# CA → CD: Sprint5 Level 1 audit — FAIL / four blockers

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-24T02:21:30Z  
SUBJECT: Sprint5 ACT6–8 + visual-dynamic UI Level 1 disposition  
STATUS: FAIL / FOUR_BLOCKERS

Baseline:

`f8fdaabadd39f87fd48f965f06d85eca658c0c10`

Full report:

`docs/audits/regular/runs/2026-09-24_sprint5_level1/AUDIT_REPORT.md`

## Findings

- **S5-CA-001 HIGH** — required ACT6 / ACT7-tie / ACT8 DiscussionRoom and information-sharing behavior is missing. ACT8 disagreement goes directly from private reveal to final vote, so Pocket / Memories / SHARE PHOTO and the intended asymmetric-information interaction cannot occur.
- **S5-CA-002 HIGH** — Sprint5 bypasses the hard localization authority and omits canonical scene/presentation transitions. Student UI contains English-only hardcoded Sprint5 text and does not render the server's canonical text-key flow.
- **S5-CA-003 MEDIUM** — portrait/clock dynamic UI ignores approved asset anchors; a CSS-generated portrait-eye substitute is also present despite the canonical paired-overlay rule.
- **S5-RC-001 MEDIUM** — migration 028's audit-FK mirror creates split/stale DiscussionRoom semantics, and ACT6 second-tie fallback advances game state while leaving the real S5 round unresolved.

## Areas that pass

- teacher-authorized Sprint5 initialization;
- server-side player/session/run authority;
- RLS on Sprint5 tables;
- run-row serialization;
- expected round/session stale-request rejection;
- client request idempotency;
- ACT8 private-choice lock and delayed reveal;
- server-authoritative final route and Great Hall fold-back;
- ACT6+ remains outside the Teacher Override allowlist;
- migrations 018–026 remain preserved.

## Correction boundary

Correct only the four blockers plus directly adjacent regression coverage.

Do not begin Sprint6.

Migrations `027` and `028` are deployed history and must remain immutable. Any DB correction begins at **029+**.

CA is not prescribing schema, DiscussionRoom integration structure, renderer architecture, anchor math, or FK strategy.

## Required process reminder

Before continuing correction work, **re-read the current**:

`docs/specs/current/Codex程序开发说明书 V2.3.md`

Pay particular attention to the updated continuation / STOP CHECK rule:

- an authorized handoff with `next_owner = CD`, defined next action, permitted scope and closure condition is an execution trigger;
- **Acknowledgement is not completion**;
- do not stop after replying that the CA message was received;
- continue the authorized correction workflow in the same run unless a legitimate stop condition in V2.3 applies.

This handoff already defines:

- `next_owner = CD`;
- next action = correct the four Sprint5 blockers;
- permitted scope = Sprint5 blockers + directly adjacent regression coverage;
- closure condition = deploy/test the correction and submit a focused Level 1 re-audit request.

Therefore no additional user approval is required merely to start the correction work.

## Next governed action

CD performs the bounded Sprint5 corrections, runs relevant static/live/browser regressions, and submits exact correction commit(s), migration(s), deployment evidence and known limitations.

CA will automatically perform the focused Level 1 re-audit when that handoff arrives.
