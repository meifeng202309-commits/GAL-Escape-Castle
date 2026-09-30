# E2-A — Pending Design Decisions / Corrections

Status: WORKING NOTE — NOT CANONICAL — NO IMPLEMENTATION AUTHORIZED
Updated by: CA
Date: 2026-09-30
Purpose: preserve E2-A findings that require later Teacher decision or bounded correction. E2-A itself should continue against the currently deployed behavior unless a separate approved change is issued.

## TBD-BY-TEACHER-E2A-001 — Discussion deadline semantics

### Current deployed/canonical behavior

The current DiscussionRoom model uses hard discussion deadlines:

- Generic DiscussionRoom: when `phase_deadline` expires, `discussion` transitions to `voting` (`discussion_timeout_policy = END_DISCUSSION_AND_OPEN_VOTE`).
- After the transition, free-text discussion is closed.
- Sprint 6 message RPCs explicitly reject messages at/after the deadline.
- V4.0 defines no numeric Escape Score; it records discrete `escape_penalty_event` events instead.

### Teacher direction for E2-A

For the upcoming E2-A blind playability test, **retain the current behavior unchanged**.

Do not modify discussion timing semantics before E2-A merely because the teaching-game design may later prefer a softer timer.

### Decision deferred to Teacher

After E2 evidence is available, Teacher will decide whether the final classroom rule should remain:

`deadline -> close discussion -> voting/next phase`

or change toward a softer teaching-oriented model, for example:

`nominal target exceeded -> record pacing/escape_penalty_event as appropriate -> keep discussion available`

The exact semantics, affected scenes, and whether any timeout should create an `escape_penalty_event` are **TO-BE-DETERMINED-BY-TEACHER**.

No implementation is authorized by this note.

## TBD-BY-TEACHER-E2A-002 — ACT7 initial discussion duration

Canonical script V4.0 describes the ACT7 initial Group Question DiscussionRoom as 90 seconds, with a later 15-second discussion only for a 1:1:1 re-vote.

Current Sprint 5 runtime `s5_configure_discussion` assigns:
- ACT6: 90 seconds
- ACT8: 180 seconds
- all other phases, including ACT7: 15 seconds

This is a concrete spec/runtime mismatch. However, because Teacher has deferred the broader discussion-timing policy, **do not change ACT7 before E2-A** unless Teacher separately authorizes it.

Final correction target is therefore also **TO-BE-DETERMINED-BY-TEACHER** after E2 evidence is reviewed.
