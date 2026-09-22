# GAL ESCAPE CASTLE — START HERE

> Universal entry point for any newly started GA / CA / CD / VA chat session.

A new chat session does **not** create a new project-role identity.

Persistent project roles are:

- GA — Game Design Agent
- CA — Coding Audit Agent
- CD — Codex
- VA — Visual Agent

Replacing a slow or retired chat does not create GA-II / CA-II / CD-II / VA-II.  
The replacement chat continues the same role and the same role Action Log sequence.

---

## 1. Cold Start — first time this chat joins the project

Read in this order:

1. `docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md`
2. `docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md`
3. `docs/onboarding/GAL_ESCAPE_CASTLE_Agent_Action_Log_Rules_V1.0.md`
4. the role-specific Minimum Reading listed in the New Member Guide
5. the highest ACTIVE `agent-comms/inter_agent_talk_protocol V*.md`
6. your own Action Log entries after the checkpoint recorded in CURRENT STATUS
7. unresolved Action Log items whose `next_owner` is your role
8. newer relevant `agent-comms` addressed to your role or ALL

CA-specific version rule:

- if the New Member Guide names an older `GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V*.md`, CA must use the **highest version marked ACTIVE** in `docs/onboarding/`;
- as of the current project state, the active CA rule is `GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.3.md`.

Then answer internally:

- What is my role?
- What is the current project state?
- What is the next action assigned to my role?
- Which files are authoritative for this task?
- What must I log when I finish?

If these are clear, begin work.

---

## 2. Warm Continuation — an already trained chat continues working

Do **not** repeat full onboarding.

Continue from current chat context while obeying:

- canonical sources remain authoritative;
- important project actions must be externalized to the Action Log;
- GitHub writes require commit-time log reconciliation;
- L3 CURRENT STATUS is updated only by the checkpoint/gate rules;
- if current chat memory conflicts with newer shared project records, the shared records win;
- when the governing workflow already defines the next owner, next action, permitted scope and closure condition, execute that procedural step without waiting for duplicate user approval.

---

## 3. Chat replacement

When a role chat becomes slow or is intentionally replaced:

1. stop using the old chat for project writes;
2. open a new chat for the same role;
3. run the Cold Start procedure above;
4. continue the same role Action Log sequence from its latest row.

Only one chat session per role may act as the **Active Writer** at a time.

The previous chat becomes retired/read-only for project-writing purposes.

---

## 4. Do not reconstruct history by default

Do not read:

- the full historical chat;
- all archived specs;
- the entire Action Log;
- all old agent-comms;

unless current sources are insufficient, a bug requires historical reconstruction, or the user explicitly asks for it.

The memory system begins from its adoption point. Earlier project history is represented by current canonical files, accepted reports, current status, and existing agent-comms—not by retroactively recreating every past conversation.
