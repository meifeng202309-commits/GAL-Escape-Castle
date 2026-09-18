# Repository Documentation Layout

This directory separates canonical specifications, historical specifications, reports, and setup documentation.

## 1. Canonical specifications

Path:

```text
docs/specs/current/
```

Only the current approved version of each governing specification belongs here.

Current set:
- 古堡逃脱游戏脚本 V4.0.md
- Castle Visual V2.1.md
- Codex程序开发说明书 V2.3.md
- 从创意到游戏成品的研发流程V1.0.md

Agents must read these before acting in their domain.

## 2. Superseded specifications

Path:

```text
docs/specs/archive/
```

Old versions are retained for history only.

Rules:
- do not edit archived specs;
- do not treat them as current instructions;
- when a new canonical version is approved, move the superseded version here.

## 3. Reports

Path:

```text
docs/reports/
```

Use for:
- repository audits;
- sprint completion reports;
- architecture/testing reports;
- Codex validation reports.

Reports describe status/evidence. They do not silently replace canonical specifications.

## 4. Setup / deployment notes

Path:

```text
docs/setup/
```

Use for GitHub Pages, environment, deployment, and operator setup notes.

Legacy setup notes may be kept under:

```text
docs/archive/setup/
```

## 5. Runtime / implementation directories

Do not move these merely for documentation tidiness:

```text
src/
database/
tests/
index.html
teacher.html
02_player_v2.html
03_teacher_v2.html
.env.example
```

Their paths may be runtime/test/deployment-sensitive.

## 6. Asset workflow

```text
assets/
  asset-registry.json
  staging/
```

`assets/asset-registry.json` is the machine identity/version authority once created.

Production candidates go under:

```text
assets/staging/{asset_key}/vNNN/
```

Never place production assets in `agent-comms/`.

## 7. Inter-Agent communication

Path:

```text
agent-comms/
```

Use the highest ACTIVE:

```text
inter_agent_talk_protocol V*.md
```

Normal messages use timestamped CA/VA/GA/CD filenames. Historical ROUND files are communication-test history and must not be reused for new normal communication.

## 8. Root-directory rule

The repository root should remain sparse.

Allowed at root:
- runtime/GitHub Pages entry files;
- `.env.example`;
- `README.md`;
- `CHANGELOG.md`;
- top-level implementation directories.

Do not place new game-script versions, Visual specs, Codex specs, sprint reports, or ad-hoc review files in root.

## 9. ~5% governance rule

Do not reorganize or add process merely for sub-~5% hypothetical risks unless a locked hard invariant is threatened.

The directory layout itself should remain stable unless there is a practical (>~5%) failure/confusion reason to change it.
