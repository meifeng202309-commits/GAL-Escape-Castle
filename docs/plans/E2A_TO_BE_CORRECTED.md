# E2-A — To Be Corrected / Teacher Decisions Pending

Status: WORKING NOTE — NOT CANONICAL — NO IMPLEMENTATION AUTHORIZED
Created by: CA
Date: 2026-09-30
Purpose: preserve correction items discovered during E2-A protocol review before they are converted into an approved spec/change request.

## TBC-E2A-001 — Discussion deadline must not prematurely terminate educational discussion

### Current observed behavior

The current canonical/runtime model contains hard discussion deadlines:

- Generic DiscussionRoom: when `phase_deadline` expires, `discussion` transitions to `voting` (`discussion_timeout_policy = END_DISCUSSION_AND_OPEN_VOTE`). Free-text discussion is therefore closed rather than allowed to continue.
- Sprint 5 ACT6 uses 90 seconds.
- Sprint 5 ACT8 uses 180 seconds.
- Sprint 6 discussions include 180 seconds (ACT9), 60 seconds (wrong-door recovery), 300 seconds (ACT10), and 90/45 seconds (ACT11 allocation).
- Sprint 6 message RPC explicitly rejects messages at/after the deadline.
- V4.0 defines no numeric Escape Score; it records discrete `escape_penalty_event` events instead.

### Teacher concern / desired direction

GAL Escape Castle is a teaching game rather than a speed-challenge game. A nominal discussion timer must not prevent students from completing a meaningful discussion merely because the displayed time expires.

Before implementation, the canonical rule should be re-decided. Candidate direction raised by Teacher:

- allow discussion to continue after the nominal target time;
- treat exceeding the target as a pacing/soft-failure event rather than a hard conversational cutoff;
- if a penalty concept is retained, reconcile it with V4.0's current **no numeric score** rule (for example, a discrete `escape_penalty_event` rather than silently inventing a numeric deduction);
- preserve Teacher controls and audit provenance.

No implementation is authorized until the canonical timing/penalty semantics are approved.

## TBC-E2A-002 — ACT7 discussion-duration spec/runtime mismatch

Canonical script V4.0 describes the ACT7 Group Question DiscussionRoom as 90 seconds, with a later 15-second discussion only for a 1:1:1 re-vote.

Current Sprint 5 runtime `s5_configure_discussion` assigns:
- ACT6: 90 seconds
- ACT8: 180 seconds
- all other phases, including ACT7: 15 seconds

Therefore the initial ACT7 discussion currently appears to receive 15 seconds rather than the canonical 90 seconds.

This is a concrete spec/runtime mismatch and should be corrected once the broader discussion-timing policy in TBC-E2A-001 is decided.
