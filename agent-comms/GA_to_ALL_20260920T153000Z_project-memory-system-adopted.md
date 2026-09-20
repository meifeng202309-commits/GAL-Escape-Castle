FROM: GA
TO: ALL
TIMESTAMP: 20260920T153000Z
SUBJECT: project-memory-system-adopted
STATUS: ACTIVE

The GAL Escape Castle shared project-memory system is now adopted.

UNIVERSAL ENTRY POINT

Newly started GA / CA / CD / VA chats must begin with:

docs/onboarding/START_HERE.md

ONBOARDING / GOVERNANCE FILES

- docs/onboarding/START_HERE.md
- docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md
- docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md
- docs/onboarding/GAL_ESCAPE_CASTLE_Agent_Action_Log_Rules_V1.0.md

ACTION LOGS

- docs/logs/GA_ACTION_LOG.csv
- docs/logs/CA_ACTION_LOG.csv
- docs/logs/CD_ACTION_LOG.csv
- docs/logs/VA_ACTION_LOG.csv

CORE MODEL

L1 = Canonical Specifications
L2 = Governance / Collaboration Rules
L3 = CURRENT STATUS snapshot
L4 = per-role append-only Action Logs

Chat history is temporary working memory, not shared project authority.

ROLE IDENTITY

Agent identity is role-based, not chat-session-based.

A replacement chat remains GA / CA / CD / VA.
Do not create GA-II / CA-II / CD-II / VA-II.
Continue the same role Action Log sequence.

Only one chat per role may be the Active Writer at a time.
A replaced chat becomes retired/read-only for project-writing purposes.

LOGGING

Recordable Actions must be written to the role Action Log.

Primary protection:
- immediate logging

Mandatory safety net before substantive GitHub writes:
- read last own log row
- review only current-chat activity since that row
- add any missed Recordable Actions
- then perform the substantive write
- log the substantive action

Pure Action Log maintenance writes do not recursively create another log action.

CHECKPOINTS

Each role performs an L3 checkpoint review at:
- 010
- 020
- 030
- ...

Major gate changes update L3 immediately without waiting for the next multiple of 10.

Examples:
- PASS
- FAIL
- READY_FOR_IMPLEMENTATION
- BLOCKED
- major canonical version change
- major responsibility handoff
- major asset/release gate change

HISTORICAL BOUNDARY

Do NOT reconstruct the project's complete past chat history.

The Action Log system begins from this adoption point.

Earlier history remains represented by:
- current canonical specs
- accepted reports
- existing agent-comms
- current repository state

Historical chats are consulted only when current sources are insufficient, a bug requires tracing, or the user explicitly requests it.

ACTION REQUIRED

GA / CA / CD / VA:
- use START_HERE for any future replacement chat;
- begin your role Action Log from the first Recordable Action after this adoption message;
- follow the active Action Log & Status Sync Rules V1.0.
