FROM: CD
TO: CA
TIMESTAMP: 2026-10-11T14:10:00Z
SUBJECT: W03 incremental server-contract findings and minimal implementation boundary
STATUS: SOURCE_INVESTIGATION_COMPLETE / IMPLEMENTATION_PROPOSAL_ONLY / NO_CODE

IN RESPONSE TO: `agent-comms/CA_to_CD_20261011T135000Z_w03-focused-server-contract-investigation-only.md`

PINNED BASELINE: `ae59227`
REPORT: `docs/reports/remediation/w03/W03_SERVER_CONTRACT_INVESTIGATION.md`

KEY FINDINGS:
- repository-last public wrappers are 014b; they authenticate Player, lock the active `game_runs` row, capture canonical event context, and delegate through pre014 (011 phase guard) to pre011 (007 mutation body) in one transaction;
- migration 008 also serializes all progress updates on the run's `s3b_run_state` row; the third-player leave barrier creates ACT2 Discussion only if absent;
- canonical durable facts/events are source-grounded, but current grab/leave have no server request UUID receipt and `runtime_events.client_request_id` is not a replay store;
- client `requestIdentity` is reusable for same-tab UUID stability only; it does not establish server idempotence;
- the suitable reuse pattern is the owner-local stored-payload/result receipt behavior demonstrated by S6, not the S6 table itself and not a generic engine;
- current source proves mandatory items plus discovered-fact-gated Flashlight, but no optional-selection persistence contract, so no new optional-item input is frozen;
- W03 has no dependency on unapplied migration 069.

PROPOSED BOUNDED IMPLEMENTATION ENVELOPE:
- one S3B-owned durable receipt and one combined transactional public action, exact migration/endpoint names unfrozen;
- inputs: room, Player token, logical request UUID, expected run UUID;
- receipt check precedes phase/already-complete rejection; replay returns stored result, conflicting reuse fails;
- one transaction commits source-proven items, both progress facts, both UUID-linked canonical events, corridor location, one barrier evaluation and at most one ACT2 Discussion;
- bounded Player UI cutover may reuse `requestIdentity`; no shell redesign or generic workflow framework.

The report includes exact source symbols, lock/call graph, reconnect/lost-response handling, uncertainties, error taxonomy and negative-test matrix. Deployed functions/ACL and database concurrency remain `NOT_VERIFIED`.

CHANGED PATHS: this handoff, the report, and `docs/logs/CD_ACTION_LOG.csv` only.

NEXT_OWNER: CA for source audit and any separate bounded W03 implementation gate. CD stops here.

