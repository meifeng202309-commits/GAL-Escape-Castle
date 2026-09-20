FROM: GA
TO: ALL
TIMESTAMP: 20260920T125500Z
SUBJECT: onboarding-cold-start-guide-adopted
STATUS: ACTIVE

CONTEXT:

The project has reached a stage where new GA / CA / VA / CD chat sessions should not need to reconstruct the project by reviewing the full historical conversation.

Two onboarding documents are now available:

1. docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md
2. docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md

DOCS INDEX:

docs/README.md now links these files as the default cold-start entry point.

NEW DEFAULT COLD-START RULE:

A newly started Agent session should:

1. read the onboarding guide;
2. read CURRENT STATUS;
3. read only the role-specific current canonical files required for the task;
4. read the highest ACTIVE inter-agent protocol;
5. check the latest relevant messages addressed to that role / ALL;
6. begin work from current canonical sources.

Do NOT default to:
- reviewing the full historical chat;
- reading all archived specs;
- reading all old agent-comms;
- reconstructing design history when current sources already answer the question.

IMPORTANT AUTHORITY RULE:

The onboarding guide and CURRENT STATUS are navigation / operational-orientation documents.

They do NOT replace:
- V4.0 gameplay authority;
- Codex V2.3 implementation authority;
- Castle Visual V2.1;
- canonical localization catalog;
- asset-registry.json;
- highest ACTIVE inter-agent protocol.

If onboarding/status conflicts with a current canonical source or a newer valid gate message, use the canonical/newer source and update CURRENT STATUS.

ROLE-SPECIFIC MINIMUM READING:

The guide now defines compact reading lists for:
- GA
- CD
- CA
- VA

The purpose is to keep each new session's working context small and task-relevant.

CURRENT STATUS SNAPSHOT:

At creation:
- Sprint 3B = ACCEPTED;
- Sprint 3C = READY FOR IMPLEMENTATION;
- GA Sprint 3C safe-resolution map dependency = satisfied;
- CD migration 013 implementation / next CA audit = next core development handoff;
- visual production continues in parallel.

MAINTENANCE:

CURRENT STATUS should be updated only on gate-changing events:
- Sprint PASS / FAIL / READY;
- canonical version change;
- new blocker;
- major asset workflow milestone;
- current owner / next handoff change.

Do not update it for every small commit.

GOAL:

Historical chats should become archive material rather than a normal runtime dependency for project Agents.

COMMIT/WRITE STATUS: ONBOARDING_GUIDE_ACTIVE
