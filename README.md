# GAL Escape Castle

Three-player classroom escape game hosted with GitHub Pages and Supabase.

## Current canonical specifications

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`
- `docs/specs/current/Castle Visual V2.1.md`
- `docs/specs/current/Codex程序开发说明书 V2.3.md`
- `docs/specs/current/从创意到游戏成品的研发流程V1.0.md`

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
- `agent-comms/` — inter-Agent messages/protocol only; never production assets

See `docs/README.md` for storage rules.

Inter-Agent communication must use the highest ACTIVE:
`agent-comms/inter_agent_talk_protocol V*.md`.

## Current implementation

- Sprint 1: verified room/session, private-choice lock, reveal, and reconnect baseline.
- Sprint 2: reusable generic DiscussionRoom implementation in `database/002_runtime_runs_discussion.sql` and the existing student/teacher pages.
- The legacy `02_player_v2.html` and `03_teacher_v2.html` files remain fallback prototypes.

Apply database migrations in numeric order. Sprint 2 is intentionally a generic discussion test scene; it does not implement the complete ACT 1-14 story.
