# Sprint 3B Testing

## Deployment

The user applied migrations 007, 008, 009, 010, 011, and 012 to Supabase project `qdcbdcjobzytzhnhfwyn`; each returned `Success. No rows returned`.

## Static

- Sprint 1 static: PASS
- Sprint 2 static: PASS
- Sprint 3A static: PASS
- Sprint 3B static: PASS
- localization generation: deterministic 333-entry PASS
- relevant JavaScript syntax and `git diff --check`: PASS

## Live

- Sprint 1: 40/40 PASS
- Sprint 2: 23/23 PASS
- Sprint 3A: 15/15 PASS
- Sprint 3B: 44/44 PASS

Sprint 3B live coverage includes initialization and public-transition replay rejection, role-specific ACT 1 opening/action/consequence/completion delivery, ACT 1 privacy and all-three completion gate, queued ACT 2 sender-aware canonical templates, reconnect-safe route-update delivery and acknowledgement replay rejection, optional-item inclusion/exclusion, ACT 2 majority and system fallback, idempotent fold-back, per-player wayfinding/reunion, server-owned locked-wheel prefixes at 90/105/120/135/150 seconds, reconnect restoration, locked-position mutation rejection, sub-90-second deadline preservation, ordered and concurrent puzzle attempts, final auto-resolution with zero synthetic attempts, unanimous ACT 4 known/unknown, ACT 5 known/unknown majority, non-terminal Inspect First and post-inspection route, run isolation, terminal ACT 6 boundary, and anonymous RLS reads/writes.

Migration 012 evidence additionally proves that representative renamed internal implementations (`s3b_follow_sign_pre011`, `s3b_apply_meeting_resolution_pre011`, and `s3b_submit_library_code_pre011`) are not browser-executable. Route-update delivery is acknowledged per player: one and two distinct ACKs retain the global update, an unacknowledged reconnect retains the same canonical location, duplicate ACK is rejected, and only the third distinct ACK advances exactly once.

The active GAL-facing DiscussionRoom now uses the ten GA-approved `discussion.*` localization keys. The four GA-designated developer/status labels are absent from the student UI. Vote privacy, missing-player blocking, re-vote visibility, and system-fallback provenance remain server-authoritative.

The first post-011 Sprint 3B run stopped on an obsolete negative-test error-message substring: the server correctly rejected the premature request as `unavailable`, while the test expected the earlier `out of phase` wording. The assertion was aligned with the guarded RPC contract, and the complete 39-check suite then passed with exit code 0.

## Not verified

- physical three-student plus teacher device walkthrough;
- classroom latency/packet loss and long-duration behavior;
- production assets through Asset Manager runtime resolution;
- Sprint 3C Teacher Override behavior.
