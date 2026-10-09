# CA review of PROPOSAL DEBUG IMPLEMENTATION PLAN V2.2 BY CD

**CA 独立内部评审｜2026-10-09**  
**审查对象：** `docs/plans/PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V2.2_BY_CD.md`；`agent-comms/CD_to_CA_20261009T041612Z_review-revised-debug-implementation-plan-v2-2.md`。  
**前序审计：** `agent-comms/CA_to_CD_20261009T050000Z_v22-targeted-plan-audit-and-required-corrections.md`（CA-167）。  
**范围限制：** 不引入、不审核 GA 的 Debug Implementation Plan V1.2；不发给 CD/GA；不修改运行代码；不解除 CD HOLD。此前 CD 03:27 来信已按新信第一句不再作为现行审查请求。本文件是 CA 的内部综合判断，非正式部署或实测 PASS。

## 一、总评及与上次审计的关系

**总体：CHALLENGE — 方向和多个局部修复可进入详细实施规划；整体 V2.2 尚不能获得无条件 PASS_TO_PLAN，更不能整体获准编码。**

CD 准确吸收了教师关于八项问题的多项低成本选择：复用领域内权威写入/只读发布、ACT2 FOLLOW SIGN、ACT3 既有锁与重放记录、ACT7 保留错误多数、四端结果 occurrence、S6 独立教师控制以及 TOP 最小必需数据 + OR 来源记录。这比大型中央 Resolver/普适补录历史更经济。尤其需支持 Teacher 的新优先级：**不为追求架构纯洁性而改写已能正常使用的旧状态机**。

但有三种成本容易被严重低估：
1. 用 10800 秒替代真正教师控制，仍然存在自动推进及玩家写入入口；必须明确是教师**接受的近似体验**，不是逻辑上的 Teacher-only。
2. TOP 的“只补缺失字段”无法保证目的 ACT 的状态机合法：预初始化、跨 S3B/S5/S6、未决选择、运行时触发器及完整性校验，不是简单的数据填充；OR 侧车记录也不会自动排除行为分析。
3. V2.2 将原有总体 Debug 骨架缩为八项子计划，漏掉明确的 Player polling、正式启动/下一步提示、W03 GRAB+leave 等既有阻塞。这并不使八项方案错误，却使其**不能单独成为完整的执行总计划**。

**建议的最省工策略**：以 V2.2 作为「八项专项分计划」，先释放低耦合、直接可验的修复包；对 TOP 做完整的只读依赖映射之后再选择是否/如何实施通用引擎。不要把 TOP 和 Observer 的完整架构实现设为 Player/Teacher 新界面调试的前置门槛。CA-167 的函数级挑战仍有效，除非 CD 的新证据逐项消除。

## 二、逐项审查（严格区分教师决定 / CD 提案 / CA 评价）

| 事项 | 教师决定与 CD V2.2 方向 | CA 判断 | 必须补证或调整 |
|---|---|---|---|
| 1. 13 个 TOP | 只补目标 ACT 最小必要数据；保留已有值；用单次 Override + OR 列表记录来源；允许连续 NEXT_TOP | **CHALLENGE；全量实施暂 BLOCKED** | 13 个边界的具体初始化函数、branch/integrity 依赖与逐项验证；先成本试验 |
| 2. NORMAL Discussion | 10800 秒兼容窗口；Teacher 提前推进；移除显示倒计时和 Add Time；增加 S6 Teacher Continue | **有条件 PASS_TO_PLAN，函数缺口未闭合** | 3600 秒参数上限、S5/S6 多种创建入口、超过 3 小时的失效模式、旧 Player/Teacher RPC |
| 3. ACT7 | wrong-majority 不得重分类；读取上一轮结果 | **PASS_TO_PLAN** | 唯一结果写入者，平票/错误/多数/重连测试 |
| 4. ACT3 | 沿用请求 UUID 与数据库锁，新增 3 秒全局拒绝窗口 | **PASS_TO_PLAN** | 事务内时间判定、排队请求、重放、成功提交后场景变化 |
| 5. 四端反馈 | 领域发布统一 occurrence UUID、三秒窗口；三 Player + Teacher 显示 | **PASS_TO_PLAN** | 客户端 1.2 秒 polling 无法严格同步开始；重连、时间偏差、延迟和隐私 |
| 6. ACT2 / W05 | FOLLOW SIGN 即确认到 Library；S7 只读显示进入图书馆 | **PASS_TO_PLAN** | 严格沿用 S3B/S5/S6 所有权，不用旧 ACTIVE 镜像猜测 |
| 7. TOP 迟到请求 | 教师取消单独专项包；TOP 保留 Teacher UUID | **尊重缩减范围，但存在不可免除的最小安全条件** | TOP 至少关闭旧交互、拒绝旧身份写入，不要求扩大成全局重构 |
| 8. Teacher 状态 | 当前范围状态分类，不做 latest-event 行为日志 | **PASS_TO_PLAN** | 准确绑定当前 run/round/interaction，不泄露私有内容，不把 offline 当未完成 |

## 三、Discussion 三小时方案：成本最低，但合同必须说实话

**已见代码事实：**
- `database/002_runtime_runs_discussion.sql` 的通用讨论创建参数校验限制 `p_discussion_time_limit_sec` 为 5–3600 秒。直接输入 10800 会被拒绝。必须在最新版有效创建入口中做适用 NORMAL 的局部放宽。
- `s5_configure_discussion` 的有效覆盖链跨 migration 031/032；每轮新建/重配均可能重置 deadline。
- `s6_open_discussion` 接收秒数，ACT9–11 的初次创建及重开讨论需审查全部调用处。
- migration 037 中的 `s2_refresh_discussion`/ `s6_refresh_owned_discussion` 保留 deadline 到期推动状态；S6 `s6_get_player_state` 会调用刷新，`s6_send_message_guarded` 在截止后拒绝发言。
- `s2_open_vote` 主要按最新轮次找 session；`s5_teacher_open_vote` 按当前 S5 轮次查，但原接口均没有浏览器当前预期 session 参数。
- `s2_add_time` 和 `s5_teacher_add_time` 的直接调用仍可改变截止时间/写教师事件；仅移除按钮不能阻止该行为。
- `s6_close_discussion_v2` 是 Player token 的现有可调用路径；仅移除按钮无法阻止旧客户端在三小时后操作。

**CA 建议：**采用 CD 的三小时妥协以降低改动，但提出两层分类：
- **必须处理（强制）：** generic 的 3600 上限；S5/S6 所有 relevant constructor；新 Teacher S6 RPC 的 Teacher 身份/当前交互 ID/锁/幂等；Teacher UI 端不提供正常 Add Time；S6 在三小时内不能由 Player 按旧按钮提前关闭。
- **不能伪装为已解决（接受的残余风险）：**超过三小时自动推进及消息失效、直接旧 RPC 调用、投票等待逻辑中的 deadline。若教师明确接受“超过三小时的自动行为”，应分别写入风险接受声明；**对玩家能够直接在三小时后关闭 S6**和**NORMAL Add Time 直接可调用**，建议 CD 做低成本服务器模式分支，除非教师另行批准残余行为。否则“由教师控制”成为前端幻象。
- **最低限度的验证：**t=3599、3601、10799、10800+ 秒；NORMAL 与 AUDIT；S2/S5/S6；新旧浏览器、教师旧请求、延迟/重连，以及投票 deadline 与讨论 deadline 严格区分。

如 CD 要维持旧函数签名，可增加仅新 UI 使用的 identity-bound Teacher RPC 并保留经过限制的旧接口，而不是将所有模块大规模改签名。

## 四、TOP required-information + OR：初衷好，但“轻量”仍未证明

**认可：**`OR` 只记录数据来源，真正值保持 canonical enum；一条 Override 事件记录教师、理由、before_state、补齐 key 列表，不必在各业务表铺设 provenance 列。利用原 domain initializer 而不是重新计算游戏剧情，符合第一性原理。

**核心质疑 A：最低必需信息并不是“列出几个字段”。** 对每个跳转须说明：
- 哪些状态是目标 ACT 的必要**输入**、哪些是已完成源 ACT 的必要**完成状态**；
- 什么叫真正“缺失”（缺行/null/false/0 不可混为一谈）；
- 如何处理已存在却和当前剧情冲突的数据；
- S3B→S5→S6 初始化前置、ACT10 Golden Key 和 ACT11/12 角色站位、终局整合；
- 是否存在必须关闭的旧讨论/开放轮次及会自动调用的触发器。
存在值只能免补值，**不能替代一致性验证**。如果 manifest 内渐渐加入复杂分支选择/写入算法，就已演变成第二个游戏引擎。

**核心质疑 B：OR 标注与行为分析排除之间还有缺失的一段实现。** 单个 JSON 条目 `{key,value,source:OR}` 不必复杂到全面血缘图，但至少要可唯一定位 run、role/player、当前交互/轮次及领域事实；各受影响的分析查询、最终化和导出必须实际使用这些标记。否则数据在 canonical 表中看似普通，分析仍会误认为学生做出的行为。

**核心质疑 C：TOP 连跳存在不可累加的复杂度。** 某个 TOP 单独满足条件，不等于经连续两三个备份结果走到第三个 TOP 时仍满足触发器/约束和分支逻辑；同样，还可能遇到来自旧浏览器的迟到请求。教师取消的是**独立大规模旧请求专项**，不意味着允许任何新 TOP 忽略旧交互合法性。安全要求可以纳入每次 TOP 事务的简短检查，不必另立新系统。

**成本立场：**CD 将全部 TOP 从 5/5 降为 3–4/5，目前属于**假设**。在 13 个交接的函数/初始化依赖表、一个代表性域边界原型和回归结果出现之前，不认可作为工程预算依据。建议先只完成 P6 **只读技术映射**，仍无需做新 TOP runtime；然后按简单/中等/高耦合三类估算，并以真实开发性价比决定推进。

## 五、其余六项的工程范围及注意点

- **ACT7**：不必改变投票选项；修正 S5 原写入和 wrapper 的结果分类，保持旧轮次结果可读，属于典型的低成本直接修复。
- **ACT3**：复用既有 `s3b_library_attempts` 和 run lock、请求 UUID；冷却与结果显示分离，避免新增独立状态表。
- **三秒四端呈现**：一个共通前端 overlay + 三个域各自的结果发生记录，不让 Observer 判断多数/胜负。结果发生的唯一身份、时间、可见范围比像素级同时弹窗更重要。
- **ACT2**：教师已明确不要额外确认或路上状态，不再重开讨论。
- **TOP late request**：接受不另建工作包，但最小状态身份防护是 TOP 事务正确性的一部分。
- **教师状态投影**：只显示游戏引擎当前已确认的类别，且 UI 只有一个正式 owner。浏览器网络错误显示 STALE/UNKNOWN，不能重新推断发生了哪个 ACT。

## 六、实施次序与工作量：提出 CA 的成本优先排序

**对 CD V2.2 P0–P9 的主要异议：**它不是覆盖游戏 Debug 全部问题的总计划。特别是已识别的 Player polling 重叠、读取失败误报 inactive、W03 GRAB+leave、正式启动/下一步可理解性等并未在 P1–P9 内。若按 V2.2 整体替换所有计划，可能在完成长时间 TOP 开发后游戏仍无法正常跑通。

**建议的最低风险顺序：**
1. **确定运行基线 + Player polling / error semantics + formal start 的最小阻塞**：确保后续试验能辨别“游戏错误”和“旧响应遮盖”。
2. **W05 + Teacher 当前状态观测**：以已有 S7 扩展，缩小教师无法判断状态的风险。
3. **直接推动核心流程的局部修复**：W03 GRAB+leave、Discussion 三小时/S6 教师结束、ACT3 冷却、ACT7 结果分类，各自单独验收并可回滚。
4. **四端三秒结果和 UI 迁移**：在真实游戏推进稳定基础上切换唯一显示 owner。
5. **TOP required-information 表（只读证据）**：可以尽早与其他工作并行调查；**不要因 TOP 表未完成阻止无依赖的 Player/Teacher UI 包**。
6. **TOP runtime**：只在逐 ACT 明确支持路径与预算后分批批准；不因教师长期目标就一次批量改完整游戏引擎。
7. **三 Player + Teacher E1 等效回归、资产/音频/结算、行为数据导出和冻结**。

这不是与 GA V1.2 做合并；只是 CA 根据现已知具体故障和 CD V2.2 的遗漏形成的独立实施风险判断。

## 七、实施审批建议与未决问题

**可独立推进到 package planning（仍须另行授权）：**W05/ACT2、ACT3 锁内冷却、ACT7 wrong-majority、四端 occurrence 契约、Teacher 状态分类；三小时 Discussion 需先补构造函数和服务端身份/权限细节。

**建议暂缓全量授权：**通用 NEXT_TOP 引擎 + 13 个 manifest；任何将 OR 标记当成“自动排除行为数据”的捷径；任何声称超过三小时仍由教师独占控制的说明。

**只需要 CD 证明的技术事实：**最新生效 SQL 的函数/调用/权限清单；10800 对 generic 构造器的合法接入方式；每个 TOP 的初始化依赖和回退；OR 标记如何被分析/导出查询读取；保留旧教师 RPC 的 stale-action 风险；前端/SQL 升级的回滚关系。

**可能需要教师再次决定的真正产品问题：**当游戏发生超过三小时的暂停，是否接受自动推进/玩家无法继续发送讨论消息；当预期 NEXT_TOP 遇到已存在而冲突的源 ACT 分支，教师希望明确失败后如何操作。以上只有在低成本技术方案无法规避时再提交教师，不用扩大成全面设计讨论。

## 八、记录与限制

- **Disposition:** CD V2.2 = **CHALLENGE（局部方向 PASS_TO_PLAN；全量 13 TOP BLOCKED）**。
- **本轮动作：**只提交内部 CA review 文档；不向 GA/CD 发信，不修改程序/数据库/部署，不解除 HOLD。
- **下一步基础：**逐条使用此文档继续分析并吸收后续意见，防止将八项专项计划误当完整 Debug 执行总表，也防止为通用 TOP 花费大量不必要工作。
