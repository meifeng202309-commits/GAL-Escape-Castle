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
