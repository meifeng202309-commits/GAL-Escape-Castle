# CA Round III — 根据 CD 和 GA 的反馈的第二次内部修订 V1.2

**日期：**2026-10-09  
**性质：**CA 内部工作底稿；不发送任何 Agent；不授权开发或修改数据库  
**继承文件：**`docs/plans/CA_ROUND_III_V1.0_CD_FEEDBACK_INTERNAL_REVISION_V1.1.md`  
**原始提案：**`docs/plans/CA_ROUND_III_DOMAIN_OBSERVER_TOP_AND_FEEDBACK_SPECIFIC_SOLUTIONS_V1.0.md`  
**CD 审查信：**`agent-comms/CD_to_CA_20261008T183809Z_round-iii-technical-red-team-and-low-cost-countermeasures.md`  
**GA 正式回信：**`agent-comms/GA_to_CA_20261008T101500Z_w05-location-ownership-semantic-review.md`  
**GA 详细附件：**`docs/plans/W05_OPERATIONAL_LOCATION_SEMANTIC_CONTRACT_V1.0.md`

> **证据边界：**当前工作分支上没有找到一封明确针对 **CA Round III** 全部内容的 GA→CA red-team 回信。此次 GA 的最新正式来信回应的是 **CA-165 / Round II 的 W05 问题**，不是对 TOP、三秒反馈等 Round III 全部问题的审查。GA Action Log 后来记载 Debug Plan V1/V1.1/V1.2 均为送 Teacher 审阅的独立计划，且明确暂不通知其他 Agents。本文件不把这些计划误称为 GA 对 Round III 的正式批准。CD 八项议题保持独立、未获 GA 全面裁决。

## 1. 本轮处理原则

1. **V1.1 的 CD 八项问题全部保留，不因 GA 来信自动结案。**
2. 仅对 GA 正式提供了证据的 **W05 位置语义、ACT5→6/S5→S6 所有权交接，以及 S7 的责任边界**作进一步内部修订。
3. 教师关于 ACT2 的最终答复继续有效：点击原有 `FOLLOW SIGN` 后，主程序直接置为 `library`；Teacher 显示“某玩家进入图书馆”（采用现有规范术语），不添加新的“已看到指示牌/正在改道”状态。
4. 凡还需查找最新生效代码、用户需求尚未最终定案或涉及新成本，标为 **待验证/待讨论**；不擅自决定实施。
5. 此文件仅作后续讨论索引，不发送通信，不开放 CD HOLD。

## 2. CD 八项实质性问题：原样登记并标记是否被 GA 当前材料触及

| 编号 | CD 分类 | 事项 | 当前状态 |
|---|---|---|---|
| 1 | BLOCKER-01 | 13 个 ACT 起点 TOP 无法直接由现有 ACT1–5 特定 Override 扩展 | **待与 CD 讨论；GA 本信未审查整个 TOP 计划** |
| 2 | MATERIAL-01 | NORMAL Discussion 仍存在截止时间自动推进 | **待处理；GA W05 信未裁决** |
| 3 | MATERIAL-02 | S5/ACT7 wrong-majority 来源可能被 wrapper 覆写且上一轮结果不可见 | **待处理；GA W05 信未裁决** |
| 4 | MATERIAL-03 | ACT3 Library Box 已有锁/尝试记录，但无三秒服务器冷却 | **待处理；GA W05 信未裁决** |
| 5 | MATERIAL-04 | Player 三人 + Teacher 三秒统一反馈缺稳定 occurrence/time 投影 | **待处理；GA W05 信未裁决** |
| 6 | MATERIAL-05 | ACT2 独立“看见牌子/改道途中”事实缺失 | **教师已解决需求：无需该中间状态；GA W05 明确领域事实归属；S7 代码工作待验证** |
| 7 | MATERIAL-06 | TOP 跳转必须关停旧 interaction，拒绝迟到/重复请求 | **待处理；GA 本信未审查** |
| 8 | MATERIAL-07 | 当前操作显示必须根据当前交互/轮次权威事实，不允许 latest-event-wins | **待处理；GA W05 框架与“不猜测”原则一致，但无独立 ACT1–14 审查** |

**保留独立安全提醒：** CD MINOR-01，新建 Teacher 控制功能须服务器端 token 验证、内部 helper 权限隔离；未处理。

## 3. GA 正式反馈：可采纳的 W05 语义澄清

### 3.1 位置不是单一字段

GA 明确区分五种不同的事实，不可用一个 `player_location` 假装涵盖：
- 玩家在剧情中的**物理位置**；
- ACT 交接**过渡状态**；
- ACT11–12 的**角色/工位分配**；
- 对应工位的**ENGAGE/任务完成状态**；
- 当前**界面呈现的场景**。

**内部修订：**接受此语义分离。Teacher 页面可组合人类可读文本，但底层事实的来源与含义必须分别保留。ACT11–12 三人同在 **Main Gate**；A/B/C/WATCHER 是职责或工位，不是新的独立房间，也不能写入物理 `player_location` 当成位置。

**成本边界：**不因为区分五种事实就新增五张表或五个永久字段；优先使用 S6 已有分配/ENGAGE/任务记录，以只读投影提供需要的 UI 数据。

### 3.2 ACT5→6 是真实的逐人交接

GA 根据现有设计指出：
- 在第三名玩家进入前，S3B 的 `s3b_player_progress` 及 `act6_handoff_observed_at` / `act6_entered_at` 拥有逐人位置与交接事实；
- 已点击进入画像厅者可显示 **已进入画像厅，等待其他玩家**；尚未点击者仍未进入；
- 预先存在的 S5 数据行 **不表示 ACT6 已开始**；
- 只有第三位玩家进入、服务器设置 `s5_run_state.act6_entered_at` 并开启 barrier 后，共享位置的所有权转到 S5。

**内部修订：**将这条交接定义为 W05 的必测事实，不额外添加泛用 per-ACT `ready` 持久字段，也不要求 Observer 数人后自行开门。

### 3.3 S5→S6 有且只有有依据的所有权选择

GA 推荐的来源选择条件：
1. 有效 S6 且 S5 前置完成 → S6 拥有共享位置；
2. 否则若 S5 已通过 ACT6 全员进入 barrier → S5 拥有共享位置；
3. 否则 → S3B 拥有逐人位置。

S5 已结束而 S6 尚未激活时，S5 仍可发布其结束时的共享位置（Great Hall）。矛盾的里程碑组合输出 `INVARIANT_BREACH`，不得退回旧 `game_runs` 的 ACTIVE 场景镜像猜测。

**内部修订：**接受作为 GA 提议的明确语义合同；实施前仍由 CD 验证最新生效函数和并发状态，CA 以反例测试核查。

### 3.4 S7 是教师专用汇总窗口，不能成为第二套游戏引擎

GA 接受 CD 的低成本本地化方案，但要求明确：
- S3B、S5、S6 **分别发布自己的位置语义**，优先新增只读输出；
- S7 负责 Teacher 认证、按已明确的 server-owned 交接里程碑选择来源、汇总、来源/有效性标记及教师文本组合；
- S7 **不**自行写 ACT→位置的大型判断表，**不**判断 gate、计算投票或分工是否合法，**不**用 ACTIVE `game_runs.scene_id/phase_key/step_key` 作 fallback；
- GA 指出历史迁移 044 在 S7 中直接使用 `pp.player_location`、粗略 S5/S6 行存在性判定及类似 `coalesce(s.scene_id,g.scene_id)` 的旧镜像兜底，因此不能只改前端文字。

**内部修订：**将 W05 写成“domain publishes, S7 aggregates, Observer transports, Teacher renders”，而非“S7 自己理解 ACT1–14”。

**仍待成本验证：**GA 要求 S5/S6 新增只读语义输出，可能增加旧 SQL 修改量；是否比 S7 内部有限映射更便宜尚未由 CD 比较，不将 GA 的架构偏好误称为已证最低工时方案。

### 3.5 对 GA 20 项测试的处理

GA 附件规定 20 项 W05 验收场景，覆盖 ACT1/3 的分散位置、ACT5→6 一人/两人/第三人进入、准备但未激活的 S5、S5 已完成但 S6 尚未激活、ACT7/8/9/10、ACT11/12 A/B/C 与 WATCHER、错误分工后清除旧角色、partial ENGAGE、重连、缺失 presentation row、相互矛盾的所有权标记。

**内部修订：**完整保留 GA 的测试向量作为未来 W05 候选验收集，不在本轮批准执行；测试预期必须来自 V4/教师规则，不能以现有旧 Teacher UI 为判断真伪的标准。

## 4. 当前 GA 与 CD 的关系：已有交集及未裁决分歧

**已观察到的共识：**
- 不做宽泛中央 Resolver/新增持久 global-phase 真相；
- 先修 Player 轮询，再有界开展 W05；共享跨域 Context 以后由实际双消费者需求与测量成本决定；
- W05 不必新增 Teacher RPC，可优先复用 S7；
- S3B/S5/S6 拥有真实业务语义，Observer 不猜、不推进；
- 不允许用过时的 `game_runs` ACTIVE 镜像兜底。

**尚不能宣布解决的技术权衡：**
- CD 主张 W05 应当是廉价 S7 局部读投影；GA 则严格要求 S5/S6 自行发布 read-only shared physical location，S7 只做源选择和汇总。需要 CD 比较实际改动函数数量、回归测试、可维护性与 query/p95 成本，确认是否存在更小的相容实现。
- GA 的 20 项语义测试不意味着必须新建复杂通用运行阶段解析器；首先尝试使用现有 milestone 验证，出现大量跨 ACT 自定义规则时触发 STOP。
- GA 曾建议的 universal gate taxonomy 已从初始 W05 pilot 撤回；但长期浏览器读接口是否需要共享 runtime helper，仍须证据门槛，不先授权。

## 5. 本轮明确采纳的教师 ACT2 决定

| 状态 | Teacher 可以显示 | 不得声称 |
|---|---|---|
| 现有已确认前往某目的地的事实 | 当前确定的目的地/进度，文字与现有系统匹配 | 已亲眼阅读指示牌 |
| 点击现有 `FOLLOW SIGN` 并由服务器确认 `player_location=library` | “Anna 进入图书馆”等对应玩家/位置文字 | 还在图书馆途中，或发生额外未记录的签收动作 |

不增加新按钮、牌子阅读记录或中间 `rerouting` 状态。此变更只关乎显示规则，不能使 Observer 负责推进。

## 6. 对 Round III V1.0 的修正位置与未修正位置

**本轮明确修正：**
1. ACT2 用最简单现有 FOLLOW SIGN→Library 的教师显示；
2. W05 物理位置、交接、工位、ENGAGE 与 presentation 的语义拆分；
3. ACT5→6 和 S5→S6 的 domain ownership 条件；
4. 明确 S7 只做教师汇总，域内输出由 S3B/S5/S6 负责；
5. 记录 GA 20 项测试作为未来候选验收证据。

**本轮明确不修正、不裁决：**
1. 教师要求的 ACT-start TOP 目标、backup_story、Option B 的最终实施方式与 13 个 TOP 成本；
2. CD 提出的 S2/S5/S6 NORMAL 讨论截止时间残留；
3. CD 提出的 ACT7 wrong-majority 分类问题；
4. ACT3 三秒服务器冷却；
5. 三秒跨四界面结果 occurrence 协议；
6. TOP 迟到请求/交互编号；
7. 当前交互范围内的具体完成动作投影；
8. legacy RPC、Knowledge/Observation 迁移、权限、finalization、资产等各独立风险。

## 7. 后续审查防漂移约束

- 每次只处理 Teacher 指定的一个争议项。
- 保留标签：**教师已经决定 / GA 提出且有语义依据 / CD 代码证据及工程估算 / CA 尚待验证**。
- “GA 回信已接受 W05 的有界方案”**不等于**“GA 已独立通过 Round III 所有内容”。
- 不把 CD 的 8 项风险自动判 PASS；不把教师需求直接解读为现有代码已支持。
- 暂不发送任何 Agent 通讯、不修改 SQL/JS、不开启实施权限。
- 下一次若需讨论 TOP 或 Discussion，应另行读取对应 GA 独立审查文件；**当前分支未发现明确 Round III 总评信**。

## 8. 当前跟踪清单

- [ ] CD BLOCKER-01：13 ACT TOP 的工程范围（未处理）
- [ ] CD MATERIAL-01：NORMAL Discussion 超时推进（未处理）
- [ ] CD MATERIAL-02：S5 wrong majority 分类（未处理）
- [ ] CD MATERIAL-03：ACT3 冷却（未处理）
- [ ] CD MATERIAL-04：3 秒结果四界面协调（未处理）
- [x] CD MATERIAL-05：ACT2 中间状态设计歧义（Teacher 已决定无需新中间状态；W05 实现未核准）
- [ ] CD MATERIAL-06：TOP 迟到请求/身份轮换（未处理）
- [ ] CD MATERIAL-07：当轮具体动作显示（未处理）
- [ ] CD MINOR-01：Teacher Token 与内部函数权限（未处理）
- [ ] GA W05：domain-published 状态、S7 汇总及 20 项验收向量（设计已读；技术成本和实施待验证）

**本文件作用：内部收集 GA/CD 反馈，并对确实明确的 W05 设计作阶段性修订；不是对尚有争议问题的提前判决。**
