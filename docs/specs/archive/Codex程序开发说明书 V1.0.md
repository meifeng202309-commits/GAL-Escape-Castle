# Codex 程序开发说明书 V1.0
## Project: GAL Castle Escape / Skill 3

---

# 0. 文件地位与阅读顺序

本说明书是 **Codex 的执行入口文件**。

它不重复已经在以下两个母文件中定义的故事、行为分析、研发流程和视觉规则；Codex 必须先读取相关段落，再开始实现。

母文件：

1. `古堡逃脱游戏脚本 V2.0.md`
2. `从创意到游戏成品的研发流程V1.0.md`

发生冲突时：

```text
用户最新明确要求
> 本说明书明确新增的执行要求
> 古堡逃脱游戏脚本 V2.0
> 从创意到游戏成品的研发流程V1.0
```

如果 Codex 认为两个母文件互相冲突，不得自行猜测；应记录 conflict 并请求确认。

---

# 1. 开工前必须阅读的内容

## 1.1 游戏核心行为框架

- 六类行为模式：《古堡逃脱游戏脚本 V2.0》：第 59–89 行（2. 六类 Behavior Patterns：唯一允许的顶层分析维度）
- Agent 三层分析架构与 extension interface：《古堡逃脱游戏脚本 V2.0》：第 90–146 行（3. Agent 行为分析架构）
- Game Track / Behavior Track 分离：《古堡逃脱游戏脚本 V2.0》：第 147–186 行（4. 两条数据轨道）
- 正式选择“一人一次、锁定、first choice 与 final vote 分离”：《古堡逃脱游戏脚本 V2.0》：第 187–219 行（5. 正式选择规则）

Codex 不得扩大 core behavior patterns。

---

## 1.2 游戏流程与多人状态

- 总体状态机：《古堡逃脱游戏脚本 V2.0》：第 279–324 行（8. 总体状态机）
- 通用 DiscussionRoom：《古堡逃脱游戏脚本 V2.0》：第 865–937 行（11. 通用 DiscussionRoom 组件）
- Discussion Analyzer v2：《古堡逃脱游戏脚本 V2.0》：第 2068–2128 行（27. Agent Discussion Analyzer v2）

---

## 1.3 代码质量、教师端、故障恢复

- Codex 实现规格：《古堡逃脱游戏脚本 V2.0》：第 2208–2355 行（31. Codex 实现规格）
- Teacher Console：《古堡逃脱游戏脚本 V2.0》：第 2356–2389 行（32. Teacher Console）
- 数据完整性 / reconnect / health check：《古堡逃脱游戏脚本 V2.0》：第 2390–2448 行（33. 数据完整性与断线恢复）
- Agent failure degradation：《古堡逃脱游戏脚本 V2.0》：第 2449–2464 行（34. Agent Failure Degradation）
- 推荐开发顺序：《古堡逃脱游戏脚本 V2.0》：第 2465–2499 行（35. 推荐开发顺序）

---

## 1.4 Visual / Asset

- Visual Asset Plan：《古堡逃脱游戏脚本 V2.0》：第 2888–2943 行（43. Visual Asset Plan：绘图场景与表达方式）
- 图片 / 文字 / UI 分类：《古堡逃脱游戏脚本 V2.0》：第 2944–3012 行（44. 场景分类：图片 / 文字 / 混合）
- Master Style Prompt：《古堡逃脱游戏脚本 V2.0》：第 3075–3107 行（47. AI 图片统一风格规范（Apply to All Pictures））
- Game Asset Manager：《古堡逃脱游戏脚本 V2.0》：第 3187–3379 行（50. Game Asset Manager：Codex 功能规格）
- 两阶段 Visual Continuity Devil Check：《古堡逃脱游戏脚本 V2.0》：第 3380–3438 行（51. Visual Continuity Devil Check）
- Visual checklist：《古堡逃脱游戏脚本 V2.0》：第 3439–3564 行（52. Visual Continuity Devil Check Checklist）
- 图片技术默认值：《古堡逃脱游戏脚本 V2.0》：第 3565–3591 行（53. Visual Asset Technical Defaults）
- Visual asset Definition of Done：《古堡逃脱游戏脚本 V2.0》：第 3592–3608 行（54. Visual Asset Definition of Done）

---

## 1.5 强制研发方法

- 版本级 Devil Check：《从创意到游戏成品的研发流程V1.0》：第 378–441 行（10. Stage 8：把问题分类）
- 可开发脚本标准：《从创意到游戏成品的研发流程V1.0》：第 955–983 行（11. Stage 10：形成“可开发脚本”）
- Codex 增量开发方法：《从创意到游戏成品的研发流程V1.0》：第 984–1035 行（12. Stage 11：Codex 开发）
- 三层测试：《从创意到游戏成品的研发流程V1.0》：第 1056–1102 行（14. Stage 13：测试分三层）
- 发布前检查：《从创意到游戏成品的研发流程V1.0》：第 1186–1231 行（17. Stage 15：发布前检查）
- Visual Asset Workflow：《从创意到游戏成品的研发流程V1.0》：第 1367–1419 行（22. Visual Asset Development Workflow）
- Visual Continuity 两阶段模式：《从创意到游戏成品的研发流程V1.0》：第 1420–1477 行（23. Visual Continuity Devil Check：两阶段模式）
- Asset upload / approval workflow：《从创意到游戏成品的研发流程V1.0》：第 1544–1589 行（25. Visual Asset Upload / Approval Workflow）
- 并行开发原则：《从创意到游戏成品的研发流程V1.0》：第 1607–1643 行（27. 研发流程中的并行原则）

---

# 2. 当前已验证技术通路

现有最小技术实验已经验证：

```text
Supabase
↕
GitHub repository / GitHub Pages
↕
different browsers / remote clients
```

Three Doors 极简游戏已能够：

- 多浏览器进入；
- 同房间同步；
- 场景切换；
- 数据记录。

曾出现的关键故障：

> Supabase 地址配置错误，导致网页无法找到后端。

因此正式项目必须保留启动 health check 和可读错误信息。

Codex 在开始大规模开发前，先复用/确认现有 repository、Supabase project 和部署链路，不要无理由重建整套基础设施。

---

# 3. 本轮 Codex 的第一交付目标

第一轮不是追求完整美术成品，而是交付一个：

> **功能完整、视觉可使用 placeholder、可三人远程跑通全流程的 Castle Escape Prototype。**

必须覆盖：

1. room / player session；
2. scene state machine；
3. private-choice lock；
4. reveal；
5. reusable DiscussionRoom；
6. final vote；
7. shared clues / inventory；
8. soft failure / fold-back；
9. synchronized deadlines；
10. reconnect；
11. complete event log；
12. Teacher Console；
13. Agent analysis adapter；
14. prediction lock；
15. Asset Manager；
16. placeholder asset fallback；
17. GitHub Pages 可部署；
18. Supabase migration 可重复执行或清晰升级。

---

# 4. 开发架构原则

除母文件已规定的模块化要求外，本说明书增加以下执行约束。

## 4.1 Scene 必须数据驱动

新增 / 修改故事内容时，优先修改：

```text
content / scene definition
```

而不是修改核心状态机。

至少把以下内容从 engine 中抽离：

- scene copy
- choice text
- clue definitions
- image asset_key
- discussion config
- timer config
- allowed next phases
- fallback text

---

## 4.2 明确区分四类状态

建议显式区分：

```text
GameState
PlayerState
BehaviorEventState
AssetState
```

GameState：
- current act / scene / phase
- story clock
- deadlines
- route flags
- puzzle status

PlayerState：
- session
- inventory
- private clue access
- locked choices
- online status

BehaviorEventState：
- raw observable events
- dialogue messages
- response timestamps
- final votes

AssetState：
- asset assignment
- upload
- review
- active version

---

## 4.3 Story Time 不得使用系统实时时钟推导

- Real Time → deadlines / UI countdown
- Story Time → scene metadata / state transitions

不得因为现实讨论用了 5 分钟，就把故事时钟自动增加 5 分钟。

---

# 5. Supabase / 数据库执行要求

Codex 应提供 migration 文件，不要求教师手工在 Dashboard 建表。

建议：

```text
/database
  001_core.sql
  002_discussion.sql
  003_behavior_events.sql
  004_assets.sql
  005_predictions.sql
  ...
```

要求：

- 可审查；
- 有注释；
- 不把 secret key 写入 repository；
- RLS / access policy 明确；
- test-only 宽松策略必须有醒目标记；
- production-like deployment 不得使用浏览器 service-role key。

---

# 6. Player identity / reconnect

当前学生无需传统账号注册。

实现必须满足：

- 显示名为 Gitte / Anna / Linda；
- 底层 player identity 不依赖显示名；
- 第一次加入后生成/获得 session identity；
- browser refresh 可恢复；
- 不允许同一身份重复提交；
- 不允许轻易冒充其他 player slot。

---

# 7. Game Asset Manager：实现补充

功能细节以母文件为准。

额外要求：

## 7.1 Asset manifest

repository 中保存可版本控制的 asset manifest，例如：

```json
{
  "asset_key": "shared.clock_room",
  "required": true,
  "assigned_role": "teacher",
  "aspect_ratio": "16:9",
  "fallback": "/assets/placeholders/clock-room.webp"
}
```

用途：

- 程序知道 required assets；
- Asset Manager 知道分工；
- GAME READY 自动判断。

## 7.2 Placeholder-first

Codex 不等待正式图片。

Phase A 完成后：

- scene 使用 placeholder；
- core coding 与 image production 并行；
- active asset 上线后，scene 自动切换，不改代码。

## 7.3 Upload security

优先使用：

- player/session identity；
- assignment validation；
- restricted upload path。

如 prototype 暂用较宽策略：

- config 标记 `TEST_ASSET_UPLOAD_MODE=true`；
- README 明确仅供封闭课堂测试；
- 正式发布前收紧。

---

# 8. Agent integration

Agent 必须通过明确 adapter/service boundary 接入。

禁止：

- 在 component 内散落 prompt；
- gameplay progression 强依赖 Agent；
- Agent response 格式自由漂移。

建议接口：

```text
AgentAnalyzer
PredictionGenerator
```

所有输出必须 schema validation。

Agent unavailable：

- raw data 继续保存；
- game 继续；
- analysis 可之后重跑。

---

# 9. Logging / observability

至少记录：

- room events
- player join / disconnect / reconnect
- phase transitions
- private submission timestamps
- final votes
- dialogue
- hint use
- teacher intervention
- asset upload / approval
- agent request / success / failure
- prediction locked_at

教师应能 export：

- JSON
- CSV（适用于 event / behavior data）

---

# 10. Testing

Codex 每完成一个 Sprint：

```text
Build
→ automated / manual test
→ Devil Check
→ fix
→ re-test
→ update CHANGELOG
```

至少准备：

### Multiplayer
- 3人正常提交
- 1人慢
- 1人刷新
- 1人断线再回来
- 重复提交
- 两个浏览器尝试同一 player

### Discussion
- 3人一致
- 2:1
- 1:1:1（多选场景）
- timeout
- empty messages
- off-topic text

### Puzzle / branch
- success
- repeated wrong answer
- hint
- soft failure
- fold-back

### Asset
- missing
- upload
- reject
- replace
- approve
- active version switch
- broken URL / storage unavailable

### Agent
- valid output
- malformed output
- timeout
- unavailable
- insufficient evidence

---

# 11. 每个 Sprint 的交付物

每个 Sprint 结束必须提交：

1. working code；
2. changed files list；
3. migration（如有）；
4. test result；
5. Devil Check record；
6. known issues；
7. CHANGELOG entry；
8. 下一 Sprint 的依赖。

不要只回复“implemented”。

---

# 12. 最终 repository 最低结构

允许按现有框架调整，但必须达到同等分离度：

```text
/
  README.md
  CHANGELOG.md
  .env.example

  /src
    /game
    /scenes
    /components
    /state
    /supabase
    /agent
    /teacher
    /assets
    /utils

  /content
    scenes.*
    clues.*
    dialogue_templates.*
    asset_manifest.*

  /database
    migrations...

  /docs
    古堡逃脱游戏脚本 V2.0.md
    从创意到游戏成品的研发流程V1.0.md
    Codex程序开发说明书 V1.0.md
    architecture.md
    testing.md

  /tests
```

---

# 13. 首次实施顺序

### Sprint 0 — Repository audit
- 阅读三份规格；
- 检查现有 repository；
- 检查 Three Doors 原型可复用部分；
- 检查 Supabase / Pages config；
- 输出 architecture proposal；
- 不大规模写功能。

### Sprint 1 — Core multiplayer
- session / room
- state machine
- private lock
- reveal
- reconnect

### Sprint 2 — Discussion
- reusable DiscussionRoom
- vote
- transcript
- deadlines

### Sprint 3 — Scene / clue engine
- story-driven content
- inventory
- soft failure
- fold-back

### Sprint 4 — Asset Manager
- manifest
- upload
- approval
- placeholder → active asset

> 图片生产可与 Sprint 1–4 并行。

### Sprint 5 — Teacher Console

### Sprint 6 — Agent observable analysis

### Sprint 7 — six-pattern aggregation

### Sprint 8 — prediction lock + debrief

### Sprint 9 — full asset integration / visual continuity acceptance

### Sprint 10 — 3-player release-candidate test

---

# 14. Visual Continuity 与 Codex 并行规则

结论：

> **并行，但有明确 Gate。**

Codex 开工前只需要 Visual Phase A 完成；该条件已由《古堡逃脱游戏脚本 V2.0》的 Visual Asset Plan 满足。

随后：

```text
Codex core build
      ↘
       image generation / upload / review
      ↙
Scene integration gate
```

Codex 不得因为正式图片未完成而等待核心开发。

但某一 scene 要宣布完成，必须同时满足：

- code works；
- story logic works；
- required asset approved；
- visual continuity passed；
- scene-level Devil Check passed。

---

# 15. Acceptance Criteria for Prototype V1

Prototype 只有满足以下条件才能交付给真实 G-A-L 测试：

- 三名远程玩家可稳定加入；
- 每个 private choice 只能一次提交；
- discussion / vote 可同步；
- refresh 后恢复；
- Story Time 与 Real Time 正确分离；
- 关键 clue 不会因玩家前面没点某选项而永久丢失；
- 所有分支可回流；
- 不存在已知剧情死路；
- Teacher Console 可观察并恢复；
- Agent 故障不会阻断游戏；
- required assets 有 placeholder；
- Asset Manager 能 upload / review / active；
- event log 可导出；
- Devil Check 无 Critical issue；
- README 能让下一位 Codex/开发者理解如何继续。

---

# 16. Codex 回复格式

每次完成任务时，以以下结构回复：

```text
1. What I changed
2. Files changed
3. Database changes
4. Tests run
5. Devil Check findings
6. Known issues / limitations
7. What I did NOT change
8. Recommended next step
```

如果未运行某项测试，必须明确写：

> NOT TESTED

禁止用“应该可以”代替测试结果。

---

# 17. 开工指令

Codex 的第一个动作不是立即写完整游戏。

先执行：

> **Sprint 0 — Repository Audit**

并提交：

1. 当前 repository architecture；
2. 可复用 Three Doors 代码；
3. Supabase schema/config 现状；
4. GitHub Pages deploy structure；
5. 与三份规格的差距；
6. 建议的目录结构；
7. migration plan；
8. 第一轮 risk list；
9. 是否存在必须在编码前让用户确认的问题。

在 Sprint 0 获得确认后，再进入 Sprint 1。
