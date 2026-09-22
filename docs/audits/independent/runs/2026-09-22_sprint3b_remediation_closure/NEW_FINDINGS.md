# Sprint3B Remediation Closure — New Findings

Baseline: `20f03c3a52116ba74361c5bc6f7574c9c700c02f`

These are defects discovered independently during the Level 2 closure audit. They are separate from the original IDA-001..012 closure statuses.

| ID | Severity | Status | Problem | Deterministic evidence | Risk |
|---|---:|---|---|---|---|
| RCA-001 | MEDIUM | CONFIRMED | A deployed migration file was modified after deployment instead of remaining immutable. | `33e3169...` added migration 013. `20f03c3...`, whose commit message is the post-live reconnect correction, changes one line inside `database/013_sprint3b_discussion_authority_and_request_identity.sql` and separately adds `014a`. CD reports 013/014/014a as deployed, while 014a itself is explicitly a post-deployment correction. | Repository migration history no longer exactly represents the actual deployed sequence; clean replay and deployment forensics can diverge even if final function behavior is later overwritten by 014a. |
| RCA-002 | HIGH | CONFIRMED | New append-only behavior events expose unrevealed private choice content through Teacher state in NORMAL runs. | migration 014 logs ACT1 / first-meeting / ACT4 private choice events with `choice_id` in `runtime_events.details`; the replacement `s2_get_teacher_state` returns the full event ledger without filtering by run mode, reveal state, or `audit_private_debug_view`. V4.0 requires NORMAL Teacher view never to expose unrevealed private content; prior invariant audit verified this at server-output level. | Teacher NORMAL can receive private behavior evidence before canonical reveal, violating the privacy boundary and potentially contaminating observation/measurement. |

## RCA-001 notes

This finding is about migration-history integrity, not whether the final deployed function currently has the intended `014a` behavior.

The closure requirement is that repository migration history again satisfy the project's immutable-deployed-migration rule and remain reproducible/auditable. CA does not prescribe the implementation mechanism.

## RCA-002 notes

The current Teacher UI does not render the `events` array, but the protected Teacher RPC returns it to the Teacher browser. The canonical/privacy invariant is a server-data exposure boundary, not only a DOM-rendering rule.

Private examples introduced by migration 014 include:
- `act1_choice_locked` with `choice_id`;
- `first_meeting_choice_locked` with `choice_id`;
- `act4_choice_locked` with `choice_id`.

The remediation live suite uses an AUDIT fixture when asserting event-ledger visibility, so it does not test the NORMAL privacy boundary.
