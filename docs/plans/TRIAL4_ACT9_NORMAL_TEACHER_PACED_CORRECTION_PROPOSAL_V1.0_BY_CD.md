# Trial 4 ACT9 NORMAL Teacher-Paced Correction Proposal V1.0

Date: 2026-10-27
Status: proposal only; no implementation or live mutation authorized

## Confirmed rule

NORMAL ACT9 discussion and voting are Teacher-paced. They do not auto-expire after 180 or 60 seconds, including retries and ties. AUDIT timing remains unchanged.

## Proposed bounded correction

1. Add a new immutable migration beginning at `073` only after explicit CA authorization. Do not edit migrations `001-072`.
2. In the effective ACT9 discussion-opening RPC, produce no deadline for NORMAL ACT9. Preserve current 180-second discussion and 60-second vote deadlines for AUDIT.
3. In owned-discussion refresh/transition logic, skip deadline-driven ACT9 transitions in NORMAL while retaining AUDIT auto-transition behavior.
4. Keep guarded message submission valid for a null NORMAL deadline and retain run, phase, round, and discussion-session identity checks.
5. Provide a Teacher-only, idempotent ACT9 advance/open-vote path using exact current identities. Player clients must not gain a close or advance command.
6. Project an explicit Teacher-open-required state to Player UI so NORMAL ACT9 presents no countdown and never enables a local deadline-based close action. Do not infer policy solely from missing text.
7. Preserve retry and tie semantics: each NORMAL retry remains Teacher-paced; AUDIT retries retain their configured deadlines.

## Targeted verification

- NORMAL ACT9 discussion remains open past the former 180-second boundary.
- NORMAL ACT9 vote remains open past the former 60-second boundary.
- Teacher advances or opens voting exactly once; duplicate/stale requests are idempotent or rejected.
- Player close/advance attempts are absent from UI and rejected server-side.
- Retry and tie rounds receive fresh identity while remaining Teacher-paced in NORMAL.
- AUDIT retains existing 180/60 automatic transitions, including retries and ties.
- Three Player projections, reconnect, message submission, vote submission, and stale run/phase/round/session guards remain valid.
- Static source checks plus PostgreSQL transactional tests cover both modes before any live migration request.

## Authorization boundary

This proposal requires CA to authorize the exact migration/RPC/frontend files and the test/live-validation envelope. It does not authorize database application, deployment, production room mutation, tie-text changes, or broader Teacher-console redesign.
