# GAL Escape Castle

Three-player classroom escape game hosted with GitHub Pages and Supabase.

## Start active work

If you are a new project Agent or a replacement chat for an existing role, begin here:

[`docs/onboarding/START_HERE.md`](docs/onboarding/START_HERE.md)

Do not reconstruct project state from historical chat or assumptions. The cold-start / replacement-chat workflow is owned by `START_HERE.md`, not by this README.

## Project roles

The repository currently uses these persistent role codes:

- GA — Game Design
- CA — Code Audit
- CD — Code Development
- VA — Visual
- ISA — Implementation Support

For persistent-role semantics, role authority, role-specific minimum reading, and replacement-chat procedure, use `docs/onboarding/START_HERE.md` and the New Member Guide. This README does not restate those rules.

## Canonical project sources

Current canonical specifications live under:

`docs/specs/current/`

Key current specifications:

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`
- `docs/specs/current/Castle Visual V2.1.md`
- `docs/specs/current/Codex程序开发说明书 V2.4.md`
- `docs/specs/current/从创意到游戏成品的研发流程V1.0.md`

For the complete current canonical / governance set and the current operational checkpoint, use:

`docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md`

Do not infer current sprint, gate, owner, blocker, migration number, or release state from this README.

## Repository map

- root — GitHub Pages/runtime entry files and project-level metadata only
- `src/` — application source modules
- `database/` — database migrations
- `tests/` — automated tests
- `assets/` — canonical Asset Registry and production asset staging/runtime asset metadata
- `docs/specs/current/` — current canonical specifications
- `docs/specs/archive/` — superseded specification versions; read-only history
- `docs/reports/` — audits, sprint reports, validation reports
- `docs/setup/` — setup/deployment notes
- `docs/onboarding/` — mandatory cold-start and project-memory entry point for new/replacement Agents
- `docs/logs/` — persistent role Action Logs
- `agent-comms/` — inter-Agent messages/protocol only; never production assets

See `docs/README.md` for storage/layout rules.

The legacy `02_player_v2.html` and `03_teacher_v2.html` files remain fallback prototypes.

Database migrations are applied in numeric order. For migration immutability, the current next-unused migration number, and deployment authority, use the current canonical Codex specification plus `GAL_ESCAPE_CASTLE_CURRENT_STATUS.md`; README is not the authority for those details.

## Governance entry points

Use references rather than duplicated rule text:

- onboarding / chat replacement: `docs/onboarding/START_HERE.md`
- project training / role-specific minimum reading: `docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md`
- current operational snapshot: `docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md`
- Action Log rules: highest ACTIVE `docs/onboarding/GAL_ESCAPE_CASTLE_Agent_Action_Log_Rules_V*.md`
- inter-Agent communication: highest ACTIVE `agent-comms/inter_agent_talk_protocol V*.md`
- CA audit rules: highest ACTIVE `docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V*.md`
- CD/ISA cooperation: `docs/onboarding/GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0.md`

Detailed authority, ownership, cooperation, audit, and handoff rules belong to those governing files and are intentionally not duplicated here.

## Current state and historical implementation evidence

Current sprint/gate/owner/blocker information belongs in:

`docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md`

Historical implementation evidence belongs in the sprint reports, for example:

- Sprint 1: `docs/reports/sprint-1/Sprint-1-Completion-Report.md`
- Sprint 2: `docs/reports/sprint-2/Sprint-2-Completion-Report.md`
- Sprint 2 architecture: `docs/reports/sprint-2/sprint-2-architecture.md`

In particular, the historical Sprint 2 generic DiscussionRoom scope and its relationship to the complete ACT 1–14 story are documented in the Sprint 2 architecture/report rather than repeated in README.
