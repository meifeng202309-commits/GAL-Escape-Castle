# GAL ESCAPE CASTLE — START HERE

> Universal onboarding entry point for any newly started GA / CA / CD / VA / ISA chat session.

This file owns the **entry / resume procedure**. It does not replace canonical specifications, current status, role rules, or audit/cooperation rules.

---

## 0. Persistent-role rule

The project uses five persistent role codes:

- GA
- CA
- CD
- VA
- ISA

A new chat session does **not** create a new project-role identity.

Replacing a slow or retired chat does not create GA-II / CA-II / CD-II / VA-II / ISA-II. The replacement chat continues the same persistent role and the same role Action Log sequence.

Role definitions, authority boundaries, and role-specific minimum reading are owned by the New Member Guide and the current governing role/audit/cooperation rules; they are not duplicated here.

---

## 1. Cold Start — first time this chat joins the project

Read in this order:

1. `docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md`
2. `docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md`
3. the highest ACTIVE `docs/onboarding/GAL_ESCAPE_CASTLE_Agent_Action_Log_Rules_V*.md`
4. the role-specific Minimum Reading listed in the New Member Guide
5. the highest ACTIVE `agent-comms/inter_agent_talk_protocol V*.md`
6. your own Action Log entries after the checkpoint recorded in CURRENT STATUS
7. unresolved Action Log items whose `next_owner` is your role
8. newer relevant `agent-comms` addressed to your role or ALL

CA-specific version rule:

- CA must use the **highest ACTIVE** `GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V*.md` identified by the current governance/status sources;
- if another guide names an older version, do not treat the older version as authoritative merely because it is mentioned there.

ISA-specific rule:

- ISA must read `docs/onboarding/GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0.md`;
- ISA must also read the current CA ownership envelope / Work Package and any required CD-owned frozen interface contract;
- detailed ISA authority and cooperation semantics are owned by those governing sources and are not restated here.

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
3. copy the relevant launcher prompt from `docs/onboarding/GAL_ESCAPE_CASTLE_AGENT_TAKEOVER_PROMPTS.md` if a ready-to-paste role prompt is useful;
4. run the Cold Start procedure above;
5. continue the same role Action Log sequence from its latest row.

The takeover-prompt file is a launcher utility only. It is intentionally state-light and does not replace CURRENT STATUS, Action Logs, canonical sources, or ACTIVE governance rules.

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

---

## 5. Document responsibilities — reference, do not duplicate

Use the repository documents by responsibility:

- `README.md` — repository overview, major entry points, and repository map: **what this repository is and where things are**.
- `docs/onboarding/START_HERE.md` — cold start, warm continuation, chat replacement, and retrieval procedure: **how to enter or resume work safely**.
- `docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md` — current sprint/gate/owner/blocker/checkpoint snapshot: **where the project is now**.
- `docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md` — project training and role-specific minimum reading.
- `docs/onboarding/GAL_ESCAPE_CASTLE_AGENT_TAKEOVER_PROMPTS.md` — ready-to-paste launcher prompts for new/replacement role chats; state-light and non-authoritative.
- current canonical specs and ACTIVE governance rules — detailed game, implementation, authority, audit, cooperation, and communication requirements.

**Reference, do not duplicate:** README and START_HERE may identify an authoritative file and summarize its purpose, but they should not restate detailed rules owned by that file.

If a navigation/onboarding summary conflicts with a newer authoritative canonical/governance/status source, follow the authoritative source and then repair the stale summary.
