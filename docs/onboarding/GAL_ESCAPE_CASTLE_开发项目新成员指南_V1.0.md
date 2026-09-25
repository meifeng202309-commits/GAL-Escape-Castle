# GAL ESCAPE CASTLE 开发项目新成员指南 V1.0

> Project: GAL Escape Castle / Learn to Survive AI Age — Skill 3  
> Purpose: cold-start / onboarding guide for GA, CA, VA, CD  
> Status: operational guide — NOT a replacement for canonical specifications

---

# 0. 这份指南的用途

新开的 GA / CA / CD / VA / ISA 聊天必须首先从：

    docs/onboarding/START_HERE.md

进入项目。

START_HERE 定义完整的 Cold Start 顺序；本文件是其中的项目培训主手册。

本项目已经从“依赖长聊天历史推进”进入“依赖当前规范与仓库状态推进”的阶段。

本指南的目标是：

**让一个全新的 GA / CA / VA / CD / ISA 聊天，在不了解历史讨论的情况下，只阅读本指南、CURRENT STATUS 和与自己任务有关的少量 canonical files，就能正确继续工作。**

因此：

- 不要默认回顾整个聊天历史；
- 不要默认读取全部 archived specs；
- 不要为了理解“为什么以前这样讨论”而阻塞当前工作；
- 先依赖 current canonical sources；
- 只有当 current sources 真的不足、互相矛盾或需要追溯决策原因时，才查历史。

本指南是导航文件，不是新的总规格书。

如果本指南与 current canonical source 冲突：

**以 current canonical source 为准。**

如果 CURRENT STATUS 过期：

**以 current canonical files + 最新有效 gate / audit message 为准。**

---

# 1. 10分钟上岗：Cold-Start Procedure

完整 Cold Start 以 `START_HERE.md` 为准。

任何新开的 GA / CA / VA / CD / ISA 对话，核心顺序是：

## Step 0 — 进入统一入口

    docs/onboarding/START_HERE.md

## Step 1 — 阅读本培训主手册

    docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md

## Step 2 — 阅读当前状态

    docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md

只确认：

- 当前开发到哪个 Sprint；
- 当前 gate 是 PASS / FAIL / READY / BLOCKED；
- 现在轮到哪个 Agent；
- 当前有哪些未解决 blocker。

## Step 3 — 阅读 Action Log / Status Sync 规则

    docs/onboarding/GAL_ESCAPE_CASTLE_Agent_Action_Log_Rules_V1.0.md

然后读取 CURRENT STATUS 指定checkpoint之后的本角色 Action Log，以及 `next_owner` 指向本角色的未结事项。

## Step 4 — 只读取自己角色所需的 canonical files

见本指南第6节。

**不要因为“可能有用”而一次性读完整仓库。**

## Step 5 — 检查 Agent 通信协议

读取最高版本且标记 ACTIVE 的：

    agent-comms/inter_agent_talk_protocol V*.md

## Step 6 — 检查最新来信

只优先读取：

    <other-agent>_to_<your-role>_*.md
    <other-agent>_to_ALL_*.md

按时间从新到旧。

通常只需要最近与当前任务有关的几封，不需要遍历全部通信历史。

## Step 7 — 确认任务是否已被 canonicalized / authorized

开始工作前确认：

- narrative / gameplay semantics 是否已由 GA 定义；
- coding scope 是否已由 current development spec / CA gate允许；
- visual production 是否已有合法 asset identity 与 gate；
- GAL-facing wording 是否有 canonical text_key；
- 当前 Sprint 是否已被允许开始。

## Step 8 — 开始工作

如果 current sources 已经回答问题：

**直接执行，不回看旧聊天。**

如果需要在两个不同 narrative meanings 中做选择：

**STOP，发送 clarification，不要自己发明答案。**

---

# 2. 项目一页概览

## 2.1 项目是什么

GAL Escape Castle 是一个三人合作式网络互动逃脱游戏。

玩家：

- Gitte
- Anna
- Linda

主游戏：

    ACT 1 → ACT 14

ACT 14 后 active game 结束。

历史版本中的 ACT 15/16 Behavior Trace、Compare the Three 以及 prediction module：

**不属于当前 active runtime。**

后续行为分析属于 post-game / future analysis workflow。

## 2.2 教育目标

游戏不是心理测验问卷。

核心设计是：

**在真实合作、路线选择、信息分享、分歧、压力等游戏行为中产生可观察 evidence。**

当前六类核心 behavior patterns：

1. Planning vs spontaneity
2. Group role
3. Novelty vs familiarity
4. Social initiative
5. Handling disagreement
6. Reaction under pressure

重要原则：

**“选对 / 选错”本身不得直接变成行为价值判断。**

## 2.3 技术形态

当前正式方向：

- GitHub repository / GitHub Pages；
- Supabase server-authoritative multiplayer state；
- 三名学生端 + Teacher Console；
- run-based data identity；
- reconnect / concurrency / audit semantics；
- post-game export在后续Sprint完成。

---

# 3. Source of Truth：遇到问题应该看哪里

不要试图建立一个绝对的“所有文件全局排序”。

按问题类型找 authority。

## 3.1 用户最新明确要求

用户在当前任务中的明确要求始终需要遵守。

如果用户要求改变已锁定规则，而该改变会影响其他 canonical sources：

- 不要只在聊天里临时改；
- 应同步更新相关 current canonical source。

## 3.2 Gameplay / Narrative / Behavior semantics

首要：

    docs/specs/current/古堡逃脱游戏脚本 V4.0.md

它定义：

- ACT 1–14剧情；
- choices；
- group votes；
- fallback；
- Pocket / knowledge；
- route；
- behavior semantics；
- teacher override gameplay semantics；
- ending；
- active/post-game boundary。

GA负责维护。

## 3.3 Program implementation / Sprint contract

首要：

    docs/specs/current/Codex程序开发说明书 V2.4.md

它定义：

- incremental architecture；
- Sprint顺序；
- server authority；
- migration规则；
- tests；
- Teacher Console engineering contract；
- export contract；
- regression expectations。

CD执行；CA审核。

## 3.4 Visual canon

首要：

    docs/specs/current/Castle Visual V2.1.md

它定义：

- architecture；
- lighting；
- materials；
- forbidden elements；
- recurring props；
- scene-specific visual requirements；
- UI anchor requirements；
- visual continuity。

VA负责视觉生产与review。

## 3.5 Asset identity / version authority

首要：

    assets/asset-registry.json

这是 machine-readable asset identity/version authority。

它负责：

- asset_key
- latest_version
- active_version
- continuity refs
- paired groups
- anchors
- runtime-required identity

注意：

**Visual Master identity ≠ runtime asset identity。**

MASTER-01 / MASTER-02 等可作为 canonical visual reference，而不自动拥有 runtime asset_key。

## 3.6 GAL-facing runtime wording

唯一 canonical translation source：

    docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv

规则：

    English = master/review source
    Dutch   = student runtime
    Chinese = student runtime

默认学生显示顺序：

    Nederlands
    中文

CD不得自行创建第二套人工翻译表，也不得runtime auto-translate。

## 3.7 Inter-Agent communication

使用：

    agent-comms/

以及最高 ACTIVE：

    inter_agent_talk_protocol V*.md

通信是handoff / audit / clarification history。

它不自动覆盖 canonical specs。

## 3.8 Reports

    docs/reports/

用于：

- audit result；
- test evidence；
- sprint completion；
- deployment evidence。

Reports说明“当前验证到了什么”，不静默改写 gameplay/spec semantics。

## 3.9 Archive

    docs/specs/archive/

只用于历史追溯。

默认规则：

**不要把 archive 当 current instruction。**

---

## 3.9 Canonical ownership boundary — universal rule

项目中的 canonical source 有明确的维护 authority。**发现某个实现缺口，不会自动把 canonical definition authority 转移给发现者。**

统一规则：

- Agent只能在自己被明确授权的 canonical domain 中定义/修改 canonical content；
- 如果实现需要修改另一个角色维护的 canonical source，必须先 STOP 并向 canonical owner 发出 clarification / ACTION_REQUIRED；
- canonical owner先更新 source of truth 并产生 owner-role commit；
- consumer Agent随后在**单独的 implementation commit**中消费该 canonical change；
- 同一个GitHub账号的 `author / committer` 不能证明 Agent role authority；
- role provenance以 Action Log、inter-Agent handoff 与 commit boundary 为准；
- 内容“看起来正确”不能替代正确的 authority chain。

典型例子：

```text
CD发现缺少GAL-facing text_key
≠ CD可以自行写canonical localization

正确：
CD/CA → GA gap request
→ GA/Teacher canonicalize
→ GA canonical commit
→ CD separate implementation commit
→ CA audit
```

该原则同样适用于 gameplay semantics、visual canon、asset identity 及其他明确有 owner 的 canonical source。

---

# 4. Repository 地图

    docs/
      onboarding/            ← 本指南 + CURRENT STATUS
      specs/current/         ← 当前 canonical specs
      specs/archive/         ← superseded history
      reports/               ← audit / test / sprint reports
      setup/                 ← deployment / environment notes

    agent-comms/              ← Agent正式通信

    assets/
      asset-registry.json    ← asset identity/version authority
      staging/               ← production candidates

    database/                 ← additive migrations
    src/                      ← runtime code
    tests/                    ← static/live regression tests

    index.html
    teacher.html
    02_player_v2.html
    03_teacher_v2.html       ← deployment/runtime-sensitive entry files

不要为了“整理目录”随意移动 runtime-sensitive files。

---

# 5. 五个 Agent 的职责边界

## 5.1 GA — Game Design Agent

负责：

- game script；
- narrative；
- interaction semantics；
- branch/fallback；
- behavior-observation logic；
- canonical gameplay clarification；
- GAL-facing wording语义；
- gameplay与visual需求的一致性。

GA可以改：

- V4.0；
- canonical localization catalog；
- 与gameplay semantics相关的说明。

GA不应：

- 代替CD完成常规implementation；
- 代替CA宣布代码PASS；
- 代替VA决定视觉production细节；
- 无说明地推翻V2.4已锁定engineering boundary。

## 5.2 CD — Codex

负责：

- code；
- database migrations；
- runtime systems；
- tests；
- deployment-related implementation；
- technical fixes。

CD必须：

- implement current canonical specs；
- extend, do not replace verified baselines；
- 遇到 narrative ambiguity 时请求GA clarification；
- 遇到 engineering gate / audit问题时与CA沟通。

CD不得：

- 自己发明story consequence；
- 自己新增player choice；
- 把system fallback伪装成player behavior；
- 自己翻译GAL文案；
- 自己发明asset key；
- 因实现需要而自行修改其他角色维护的 canonical source；
- 把“发现 canonical 缺口”当成“获得 canonical 定义权”；
- 把未经 owner-role approval 的 canonical change 混入自己的 implementation commit。

## 5.3 CA — Coding Audit Agent

CA coding audit必须同时遵守：

    docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.4.md

负责：

- code/spec compliance；
- state machine；
- concurrency；
- reconnect；
- security/privacy；
- regression；
- test adequacy；
- deployment/live verification；
- PASS / FAIL / BLOCKED / NOT VERIFIED判定。

CA不得：

- 因为缺少gameplay rule就替GA设计；
- 因为代码有问题就默认承担主开发；
- 把静态阅读当成live verification。

遇到canonical缺口：

**指出缺口 → 要求GA/CD补齐 → 再audit。**

## 5.4 VA — Visual Agent

Primary responsibility：

- scene / prop visual production；
- visual continuity；
- recurring-prop consistency；
- staging candidate；
- paired visual review；
- UI-safe composition；
- Castle Visual compliance。

Bounded auxiliary responsibility：

VA可在project workflow明确分配时承担**fragmented / temporary production-support work**，条件是：
- semantic / product requirement已经固定；
- 没有冲突canonical owner；
- 工作本身不是runtime-authoritative；
- 不改变gameplay、database、security、lifecycle、localization authority、asset identity、approval authority或ACTIVE publication authority。

Sprint9六个既有canonical audio candidates的candidate production / legal sourcing属于该辅助职责。

VA不得：

- 改gameplay；
- 发明runtime asset_key或audio key/trigger；
- 把exact text / numbers烧进AI scene artwork；
- 把Master reference当成runtime asset；
- 自行宣布APPROVED / ACTIVE；
- 接管runtime publication / resolver / fallback / telemetry；
- 在CA audit gate未通过时越权进入正式production（若该gate适用）。

## 5.5 ISA — Implementation Support Agent

ISA 的 active cooperation contract：

    docs/onboarding/GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0.md

负责：

- CA ownership envelope 内的 bounded mechanical/support implementation；
- frozen semantic/interface contract 下的 tests / fixtures / validators / tooling / presentation implementation；
- 向CD交付 `IMPLEMENTATION_READY_FOR_CD_REVIEW`；
- 在依赖CD决定时使用 `BLOCKED_NEEDS_CD_DECISION`，同时继续不受影响的工作。

ISA不得：

- 取得或重新定义 architecture / server-authoritative semantics；
- 创建、编号、部署 migration；
- 自行改变 persistence / security / lifecycle / provenance semantics；
- 修改 protected canonical source；
- 宣布 PASS / SPRINT_COMPLETE / RELEASED；
- 直接成为 central runtime writer、mutation RPC authority、asset activation authority；
- 把“机械实现”扩大为新的 semantic decision。

CD仍是进入audit baseline的ISA产物的最终integration/accountability owner；CA负责allocation/governance与独立audit。

---

# 6. Role-Specific Minimum Reading

目标：

**只读完成当前任务所需的最小文件集。**

## 6.1 GA 新聊天

必读：

1. 本Guide
2. CURRENT STATUS
3. 古堡逃脱游戏脚本 V4.0
4. 最新发给GA的 agent-comms 信件

按需：

- localization问题 → canonical CSV
- visual问题 → Castle Visual V2.1 + asset registry
- engineering冲突 → Codex V2.4
- audit clarification → CA相关报告/来信

默认不必读：

- 全部database migrations
- 全部tests
- 全部旧聊天
- archived game scripts

## 6.2 CD 新聊天

必读：

1. 本Guide
2. CURRENT STATUS
3. Codex程序开发说明书 V2.4
4. 当前Sprint相关的V4.0章节
5. 最新CA / GA发给CD的信

按需：

- GAL wording → canonical CSV
- asset integration → asset registry + Castle Visual relevant section
- prior regression semantics → relevant deployed migrations/tests

默认不必读：

- 完整视觉Bible（除非当前任务涉及asset）
- 历史chat
- superseded specs

## 6.3 CA 新聊天

必读：

1. 本Guide
2. CURRENT STATUS
3. docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.4.md
4. CD当前audit request
5. 当前Sprint的V2.4章节
6. 当前功能相关V4.0章节
7. implementation diff / migrations / tests

按需：

- localization → canonical CSV
- visual runtime identity → asset registry
- previous accepted invariant → relevant previous PASS report

默认不必读：

- 全部旧聊天
- 与当前Sprint无关的整个V4.0
- 所有旧FAIL报告（除非检查是否已修）

## 6.4 VA 新聊天

必读：

1. 本Guide
2. CURRENT STATUS
3. Castle Visual V2.1
4. assets/asset-registry.json
5. 当前asset对应的V4.0 scene section
6. 最新VA相关 agent-comms

按需：

- recurring props → relevant Master
- paired recognition → paired asset spec
- runtime anchor → registry + scene requirement

默认不必读：

- database migrations
- entire Codex spec
- old visual versions
- whole conversation history

## 6.5 ISA 新聊天

必读：

1. 本Guide
2. CURRENT STATUS
3. `GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0.md`
4. highest ACTIVE `agent-comms/inter_agent_talk_protocol V*.md`
5. Agent Action Log Rules V1.1
6. 当前 CA ownership envelope / Work Package
7. Class B/C 时的 CD-owned frozen interface contract
8. 最新 CA/CD 发给 ISA 的 agent-comms

按需：

- UI/presentation → relevant V4.0 + Codex V2.4 contract
- tests/validators → relevant runtime contract + current audit finding
- asset support → registry + Castle Visual relevant section

默认不必读：

- unrelated migrations
- complete project history
- unrelated canonical domains
- CA future adversarial audit reasoning

---

# 7. Core Invariants：任何新Agent都不能破坏

这些不是完整spec，只是“最容易做坏项目”的硬边界摘要。

## 7.1 Behavior First Choice永久LOCK

同一decision identity中：

- 每人只提交一次；
- LOCK后不修改；
- 后续vote不覆盖first choice。

## 7.2 Missing player input绝不伪造

不得：

- 替未提交玩家投票；
- 合成response time；
- 伪造message；
- 伪造player choice。

缺失必须是：

    null + validity

## 7.3 System / Teacher resolution ≠ player behavior

例如：

- system fallback；
- teacher safe resolution；
- timeout auto-resolution；

必须有自己的resolution provenance。

不得写成：

- player vote；
- player choice；
- player actor。

## 7.4 Real pre-override evidence永远保留

Teacher Override：

- 不删除已有真实choice；
- 不删除messages；
- 不改写timestamps；
- 不把整个NORMAL run变成AUDIT；
- 只使因intervention而缺失的scope失效。

## 7.5 Room ≠ Run

    Room = multiplayer access container
    Run  = one concrete playthrough

正式数据必须关联 run_id。

## 7.6 NORMAL ≠ AUDIT

NORMAL：

    behavior_dataset_eligible = true

AUDIT：

    behavior_dataset_eligible = false

run开始后不可随意切换。

## 7.7 Physical item ≠ knowledge

拿到物品不等于读懂全部隐藏信息。

    GRAB object ≠ read all information

## 7.8 SHARE PHOTO ≠ transfer ownership

Shared Photo：

- 是当前真实view的副本；
- 不转移physical item ownership；
- 保留provenance；
- receiver不能把副本冒充original ownership。

## 7.9 Branch → Local Consequence → Fold Back

默认设计原则：

- choice有局部后果；
- 可以有少量delayed consequence；
- 主线最终回流；
- 不制造branch explosion。

## 7.10 ACT 14 = active game终点

ACT15/16、prediction等历史设计不进入当前runtime。

## 7.11 Runtime text必须走canonical localization

不得：

- hardcode另一套Dutch/Chinese；
- runtime auto-translate；
- 拿剧情句子充当item label；
- 把English master当普通学生第三语言。

## 7.12 Visual exact text由UI负责

AI artwork负责：

- architecture；
- atmosphere；
- static objects；
- visual continuity。

HTML/SVG/CSS负责：

- exact words；
- digits；
- labels；
- arrows；
- route highlight；
- ★；
- moving clock hands；
- countdown；
- indicators。

## 7.13 Master reference ≠ runtime asset

Master可作为 continuity reference。

只有明确成为runtime-loaded production asset时才进入runtime asset identity/version workflow。

---

# 8. Development Workflow / Gate

当前开发原则：

    small scope
    → build
    → test
    → Devil Check
    → audit
    → PASS
    → next scope

不要一次实现ACT 1–14。

## 8.1 Sprint sequence

Current V2.4 high-level sequence：

    Sprint 0  Repository Audit
    Sprint 1  Core Multiplayer
    Sprint 2  Reusable DiscussionRoom
    Sprint 3  Scene / Pocket / Knowledge Foundation
    Sprint 4  Asset Manager V2
    Sprint 5  ACT 6–8
    Sprint 6  ACT 9–13
    Sprint 7  Teacher Console expansion
    Sprint 8  ACT 14 + Finalization / Export
    Sprint 9  Full Asset Integration / Visual Continuity
    Sprint 10 3-player Release Candidate

Sprint 3可拆成经过CA批准的窄slice，例如3A / 3B / 3C。

## 8.2 Standard coding gate

正常流程：

    CD implements
    → CD sends CA audit request
    → CA audits current scope
    → CA performs mandatory Codex recurring-error pattern scan
    → if otherwise PASS-ready: CA performs Next-Scope Failure Forecast
    → CA tells CD only high-risk areas + invariants/failure classes, not implementation solutions
    → CD independently designs/implements
    → CA later independently reverse-audits the implementation
    → PASS: next authorized slice may proceed
    → FAIL/BLOCKED: CD fixes exact current blockers
    → re-audit

如果发现 narrative / wording canonical gap：

    CA or CD → GA clarification request
    → GA updates canonical source
    → GA replies with commit SHA
    → CD implements
    → CA audits

关键规则：

**Agent通信中的设计决定，应在需要时先进入canonical source，再实施。**

## 8.2A CD / ISA parallel support gate

当CA启用ISA ownership envelope时，遵守：

    docs/onboarding/GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0.md

核心：

    CA allocates ownership envelope
    → CD owns architecture/interface/integration
    → ISA implements bounded support lane
    → CD integrates
    → CA independently audits integrated baseline

Class A 不需要额外 plan approval。

Class B/C 只对 material interface / authority change重新请求CA review。

已由该workflow授权的 procedural step 不得再次要求 user/Teacher approval。

## 8.3 Devil Check

从创意到游戏成品的研发流程V1.0要求：

每个新的可交付版本在标记完成前进行多视角 Devil Check。

至少考虑：

- player；
- team；
- teacher；
- story continuity；
- server/state machine；
- behavior validity；
- maintainability。

---

# 9. Database / Git / History Rules

## 9.1 已部署migration不重写

数据库修正优先使用：

    new additive migration

不要为了“更漂亮”改写已部署历史。

## 9.2 Verified baseline不无理由重构

Sprint 1 verified baseline必须持续回归。

原则：

**extend, do not replace**

## 9.3 Agent通信不可覆盖历史

每次reply：

    创建新的 timestamped message

不要overwrite旧message。

## 9.4 Commit SHA用于handoff

重大canonical update / implementation correction / audit应给出commit SHA。

## 9.5 写入后重新读取

对关键handoff文件：

**写入GitHub后重新读取，确认main中真实存在。**

不要只因为API返回成功就假设内容正确。

---

# 10. Visual Asset Workflow

## 10.1 Registry first

正式runtime asset必须先有合法 asset_key。

VA不得自行发明。

## 10.2 Initial Registry Audit Gate

已建立的正式逻辑：

    CD / canonical registry
    → CA structural audit
    → PASS
    → VA formal production

准备prompt、检查Master、规划paired set可以提前做；
正式production必须遵守gate。

## 10.3 Candidate ≠ Active

Registry语义：

    latest_version = highest candidate
    active_version = sole runtime-selected version

因此：

**APPROVED不自动等于ACTIVE。**

## 10.4 Staging

production candidate：

    assets/staging/{asset_key}/vNNN/

不要放入 agent-comms/。

## 10.5 Visual continuity

重点：

- same late-19th-century Belgian/Flemish neo-Gothic castle；
- abandoned / damp / decayed；
- cold blue-grey moonlight；
- rusted black iron / aged brass / worn dark oak；
- no random modern objects；
- no accidental readable AI text；
- anchors稳定；
- paired setup/payoff一致。

---

# 11. Localization Workflow

唯一source：

    docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv

如果runtime需要JS/JSON：

    canonical CSV
    → generated derived artifact

derived artifact：

**不得成为第二个人工source of truth。**

如果需要新GAL文案：

    CD/CA发现缺口
    → STOP canonical wording work
    → 向GA发送 ACTION_REQUIRED，说明 semantic purpose + scene/phase + UI context
    → GA/Teacher定义 English master + Dutch + Chinese
    → GA更新canonical CSV并产生GA-owned canonical commit
    → GA发送commit SHA / handoff
    → CD在单独的implementation commit中消费approved text_key
    → CD regenerate runtime localization
    → CA audit

对CD而言：

    docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv

是 WRITE-PROTECTED CANONICAL SOURCE。

CD不得自行新增/删除 text_key，不得自行补翻译，不得为了让测试或runtime通过而先写入canonical CSV再要求事后追认。

Canonical-source commit 与 CD implementation commit 必须分离。

---

# 12. Inter-Agent Communication：最小阅读策略

先读取最高ACTIVE protocol。

Normal filename：

    <sender>_to_<receiver>_<YYYYMMDDTHHmmssZ>_<subject>.md

Broadcast：

    <sender>_to_ALL_<timestamp>_<subject>.md

新session只优先查：

1. 发给自己的最新ACTION_REQUIRED；
2. 最近与当前Sprint有关的PASS / FAIL / READY；
3. 最新broadcast governance变化。

不需要把 agent-comms/ 从第一封读到最后一封。

---

# 13. 什么时候必须STOP并询问

以下情况不要自己猜：

- current specs出现真实冲突；
- 需要新增或改变player choice；
- 需要改变branch consequence；
- 需要选择一个新的fallback；
- 需要新增GAL-facing wording但没有text_key；
- 实现需要新增 / 删除 / 改写 canonical localization row；
- 实现需要修改由另一个Agent角色维护的 canonical source；
- 发现canonical缺口但当前角色不是该domain的owner；
- 需要决定一个物品是否属于physical ownership / knowledge；
- 找不到合法asset identity；
- 需要把Master变成runtime asset；
- 需要改变behavior semantics；
- 需要定义teacher safe resolution；
- 需要引入新ACT或改变ACT顺序；
- 当前Sprint是否允许开始不明确。

Engineering-only mapping如果不改变game meaning，可以由CD/CA解决。

---

# 14. 什么时候不应该询问

如果：

- current canonical source已经清楚回答；
- 只是纯implementation detail；
- 不改变gameplay semantics；
- 不改变behavior validity；
- 不改变asset identity；
- 不改变student-facing meaning；

就直接执行。

不要为了理论上极小概率的风险不断新增process。

---

# 15. ~5% Governance Rule

项目已经采用：

**对实际工作流中合理判断约 ≤5% 的纯假设风险，不新增规则、流程、blocker或重开已解决议题。**

这是heuristic，不是统计证明。

例外：

- secrets/security；
- destructive data loss；
- silent canonical/runtime identity corruption；
- overwrite immutable history；
- silent security bypass。

如果不是这类hard invariant，而且实际失败概率很低：

**不要继续堆流程。**

---

# 16. 历史资料什么时候才值得读

只有以下情况才回查旧资料：

1. current canonical file自身引用旧decision但含义不完整；
2. 两个current source发生冲突，需要知道哪个决策更新；
3. regression需要确认过去verified behavior；
4. 用户明确要求回顾“当初为什么这么决定”；
5. audit需要定位某项已接受contract的来源。

否则：

**不读旧聊天，不读archive，不做历史考古。**

---

# 17. CURRENT STATUS 的维护规则

文件：

    docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md

只在“gate-changing event”时更新，例如：

- Sprint PASS / FAIL / READY；
- canonical version变化；
- 新blocker；
- major asset workflow milestone；
- current owner / next handoff变化。

不需要每个小commit都更新。

CURRENT STATUS不是canonical spec。

若它和最新有效audit / canonical source不一致：

**以最新有效source为准，然后更新CURRENT STATUS。**

---

# 18. 新Agent开场时可采用的简短指令

一个全新对话只需要收到类似：

> 你是 GAL Escape Castle 项目的 GA / CA / VA / CD / ISA。  
> 先阅读：
> 1. docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md
> 2. docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md
> 3. 指南中属于你角色的 Minimum Reading  
> 然后检查最新发给你的 agent-comms。  
> 不要回顾完整聊天历史，除非 current canonical sources 无法回答问题。

这应成为今后新聊天的默认cold-start方式。

---

# 19. Onboarding成功标准

新开的Agent session如果完全不知道旧聊天历史，但可以在阅读：

    Guide
    + Current Status
    + Role-specific canonical files
    + latest relevant agent-comms

之后正确回答：

- 项目是什么；
- 自己是什么角色；
- 当前开发到哪里；
- 当前该做什么；
- 哪些source有权威；
- 哪些事情不能自己猜；
- 如何把结果交给下一个Agent；

那么onboarding就是成功的。

目标：

**让历史聊天成为archive，而不是日常运行依赖。**


---

# 20. Persistent Role / Chat Lifecycle

项目身份属于角色，不属于聊天窗口。

永久角色只有：

- GA
- CA
- CD
- VA

如果某个承担Agent任务的聊天变慢或被放弃：

1. 旧聊天停止project-writing；
2. 新聊天按 `START_HERE.md` 完成Cold Start；
3. 新聊天继续同一个角色；
4. 继续同一份角色Action Log及其编号；
5. 不创建 GA-II / CA-II / CD-II / VA-II。

同一角色任何时刻只能有一个 **Active Writer chat**。

被替换的旧聊天视为 retired / read-only for project-writing purposes。

区分：

- **Cold Start** = 新聊天第一次加入/接管该角色；
- **Warm Continuation** = 已受训的现有聊天继续工作。

Warm Continuation 不需要重复完整培训，但必须持续遵守 Action Log / Status Sync Rules。
