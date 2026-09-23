# CD -> CA: Sprint4 Level 1 narrow corrections ready for focused re-audit

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-23T09:28:23Z  
SUBJECT: Sprint4 Level 1 findings S4-CA-001 through S4-CA-007 closure  
STATUS: READY_FOR_FOCUSED_LEVEL_1_REAUDIT

Correction commit:

`2234814289cf5cb95decd70cdd3df05240f826db`

## Corrections

- S4-CA-001: migration 024 introduces an explicit hashed reviewer allowlist. Ordinary self-issued room tokens cannot read Asset Manager state, review, or save anchors.
- S4-CA-002: publication now requires an existing matching `APPROVED` candidate and never registers or reviews it.
- S4-CA-003: service publication uses `asset_manager_activate_group`; incomplete paired groups are rejected and complete groups activate in one transaction. Legacy single activation and rollback are revoked from `service_role`.
- S4-CA-004: registry sync computes the canonical JSONB digest in PostgreSQL, rejects mismatched hashes and duplicate keys, and deletes omitted projection rows.
- S4-CA-005: the Teacher anchor dialog exposes every required anchor and defaults to the first missing anchor.
- S4-CA-006: import is idempotent and creates `UPLOADED`; a separate idempotent call submits it to `PENDING_REVIEW`, so retry does not collide with the immutable version key.
- S4-CA-007: the publisher rereads the stored object and verifies its SHA-256 before recording publication.

## Deployment and verification

Migration 024 was applied to Supabase. The reviewer allowlist stores only the SHA-256 token digest.

Database transaction checks passed and were rolled back after assertion:

- bad registry hash rejected, duplicate key rejected, omitted key removed from the projection;
- one-member paired activation rejected with zero ACTIVE leakage, complete pair activated atomically;
- import returned `UPLOADED`, retry reused the candidate, submission returned `PENDING_REVIEW`, and submission retry was idempotent.

Regression results:

- all static suites: PASS
- Sprint1 live: 40/40 PASS
- Sprint2 live: 23/23 PASS
- Sprint3A live: 15/15 PASS
- Sprint3B live: 44/44 PASS
- Sprint3B remediation live: 15/15 PASS
- Sprint3C live: 15/15 PASS
- Sprint4 live: 15/15 PASS

## Scope and limitations

- Migrations 018 through 023 were not modified.
- No Sprint5 work was started.
- Existing `shared.library` v1 remains ACTIVE and resolver-valid.
- A second immutable real media version and real audio publication remain not verified; transaction tests cover lifecycle retry and paired atomicity without retaining test rows.
- Physical multi-device Teacher/student UX remains not verified.

CA owns the next governed step: freeze correction commit `2234814289cf5cb95decd70cdd3df05240f826db` and perform the focused Level 1 re-audit of S4-CA-001 through S4-CA-007 plus adjacent regression risk.
