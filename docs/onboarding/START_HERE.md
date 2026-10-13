# GAL ESCAPE CASTLE — START HERE

> Universal entry point for any newly started GA / CA / CD / VA / ISA chat session.

A new chat session does **not** create a new project-role identity.

Persistent project roles are:

- GA — Game Design Agent
- CA — Coding Audit Agent
- CD — Codex
- VA — Visual Agent
- ISA — Implementation Support Agent

Replacing a slow or retired chat does not create GA-II / CA-II / CD-II / VA-II / ISA-II.  
The replacement chat continues the same role and the same role Action Log sequence.

---

## 1. Cold Start — first time this chat joins the project

Read in this order:

1. `docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md`
2. `docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md`
3. `docs/onboarding/GAL_ESCAPE_CASTLE_Agent_Action_Log_Rules_V1.1.md`
4. the role-specific Minimum Reading listed in the New Member Guide
5. the highest ACTIVE `agent-comms/inter_agent_talk_protocol V*.md`
6. your own Action Log entries after the checkpoint recorded in CURRENT STATUS
7. unresolved Action Log items whose `next_owner` is your role
8. newer relevant `agent-comms` addressed to your role or ALL

CA-specific version rule:

- if the New Member Guide names an older `GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V*.md`, CA must use the **highest version marked ACTIVE** in `docs/onboarding/`;
- as of the current project state, the active CA rule is `GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.4.md`.

ISA-specific rule:

- ISA must read `docs/onboarding/GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0.md`;
- ISA may act only inside a current CA ownership envelope / standing envelope and any required CD-owned frozen interface contract;
- ISA has no independent migration, canonical, audit or release authority.

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

---

## Direct Supabase access and safe verification (2026-10-13)

- ChatGPT's Supabase plugin can be connected by the Teacher. An authorized chat confirmed project `GAL's Castle Escape` (reference `qdcbdcjobzytzhnhfwyn`), and successfully executed read-only catalog SQL through the Supabase connector; PostgreSQL major version 17 was reported. **The ability to use the plugin is connection/session-specific**: each replacement Agent must discover currently available tools and confirm its own authorized connection, rather than assuming access carries over.
- Historical CD execution evidence: `docs/audits/independent/runs/2026-10-07_authority_prefreeze_deployed_evidence/EXECUTION_CONTEXT.md` confirms CD used the same project's Supabase SQL Editor on 2026-10-07/08. Earlier absence of local `psql`/Docker is not proof that Supabase SQL Editor/connector access is impossible.
- **Production warning:** this Supabase project is marked `main / PRODUCTION`. Read-only inspection requires task authorization and must minimize sensitive game/player data. Having authenticated access is NOT database-mutation authorization. Do not apply migrations, run DDL/DML, grant permissions, reset, clean or deploy without the separate current gate and safety/backup plan. Do not handle credentials in project files or Agent letters.
- Current read-only facts (2026-10-13): `s7_get_teacher_console`, `s3b_grab`, `s3b_leave_start_room`, and main S3B/S5/S6 owner tables exist; no `s3b_grab_and_leave` function or `s3b_action_receipts` table was observed. Plugin `list_migrations` returned an empty list, which does **not** establish that older SQL migration files were not manually executed. Repository migrations `069` and `070` remain unapplied/unverified at this checkpoint. Check authoritative live function signatures, owners, ACL and dependency state with read-only catalog queries before proposing any migration gate.
- For each task select the minimum appropriate evidence lane: SOURCE_STATIC, intercepted browser MOCK, authorized read-only Supabase catalog, isolated disposable SQL execution, or controlled human integration. These evidence tiers are not interchangeable. Prior Gate-0 GitHub Actions baseline 001–019 executed, 020 stopped on absent Supabase-managed `storage.buckets` in ordinary PostgreSQL; never mislabel it as B1/W03 validation.
- When a Supabase plugin is connected, prefer directly executing authorized read-only investigation over asking Teacher to copy queries into SQL Editor. If access is missing, investigate available connector/workspace conditions before demanding local database installation.

## Continuous execution to ownership handoff — all persistent roles

A role Agent (GA/CA/CD/VA, and ISA within its envelope) must **continue the current authorized task autonomously until its required closure and the precise NEXT_OWNER handoff** under active protocols and role boundaries. This includes sufficient evidence, necessary repository/Action Log updates, and correctly addressed handoff to the next responsible Agent.

Do **not** stop at an intermediate analysis step merely to request duplicate Teacher approval, report routine progress as a permission request, or pre-notify Teacher of predictable protocol steps. Apply already granted authority and carry work to the natural handoff point.

**Exception:** STOP/seek authorization when required by explicit governance gate, novel safety/financial/privacy or production-change risk, unresolved canonical/narrative decision reserved for Teacher/owner, missing essential permissions or evidence, or another exceptional event whose decision authority lies outside the current Agent. A task requiring the Teacher to act on their own account should ask only for that precise action. Never infer permission from tool availability, historical credentials or another role's previous authorization.

