# CD 对 CA Debug Implementation Plan V3.0 的独立工程评估

**日期：** 2026-10-09

**评估者：** CD — Code Development Agent

**状态：** 独立评估 / 未实施 / 未授权数据库或部署变更

**评估基线：** `42d7f6d`，`remediation/sprint9-structural-v1`

**评估对象：**

- `docs/plans/Proposal of Debug Implementation Plan by CA V3.0.md`；
- `agent-comms/CA_to_CD_20261009T081300Z_ca-v30-debug-plan-independent-engineering-cost-challenge.md`；
- `docs/plans/PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V2.3_BY_CD.md`；
- 当前仓库有效 Player、Teacher、S3B、S5、S6、S7、S8 代码与 migrations 001–068。

## 本报告采用的取舍原则

> 我们的目标是事先充分评估开发中可能遇到的困难和风险，但是不纠结过于细微末节的小问题。由于这个游戏仅为教学用小游戏，并非公开发行的大众游戏。因此很多低概率风险值得列出来，最多用简单“粗糙”的方法解决，不值得如临大敌地耗费时间精细打磨。

因此，本报告区分：

- **BLOCKER：** 会阻止正常两小时课堂路线、导致明显错误写入、泄露未公开私有内容，或让后续调试证据不可信；
- **MATERIAL：** 应在冻结验收前修复，但不必阻止更早的小范围试跑；
- **MINOR：** 记录限制或采用廉价保护即可，不值得为极低概率情形重写架构。

这里的 `1–5` 是相对难度，不是人日估算。

---

# 1. 总体结论

CA V3.0 的大方向基本正确：按领域修复真实缺陷、早做一次四人浏览器试跑、不要为了 TOP 或 Observer 建第二套游戏引擎。

但从当前有效代码看，V3.0 有四处需要修正：

1. **U0 Formal Start 已经完成，不应再作为待实施包。** migration 059 已提供原子 `s9_start_formal_game`；migration 060 已撤销浏览器对 `s2_start_run` 的执行权限；Teacher UI 已调用新入口；现有静态测试通过。
2. **W03 GRAB/leave 不是当前已证实的硬阻塞。** 当前 Player UI 明确按 GRAB→leave 顺序显示；有效 S3B 函数及 live test 已存在。除非最新基线可复现，不应再改成一个新的合并事务。
3. **A1 Player polling 才是第一项确定存在、且会污染所有人工观察的缺陷。** 当前 1200 ms `setInterval` 可以叠加一次包含多次串行 RPC 的刷新；错误还被多处转换成 `{active:false}`。不先修它，H-pre 可能把旧响应覆盖误判成游戏逻辑错误。
4. **13 个 TOP 的总体成本仍不能写成确定的 3–4/5。** 现有游戏跨 S3B/S5/S6/finalization 有多套初始化、轮次、分支和任务状态。T0 映射是必要证据，不是形式工作；全部实现的验证成本很可能达到 5/5。但这不应阻塞正常路线试跑。

CD 建议的最低成本顺序是：

```text
P0（半天级基线核对，不重做已通过审计）
→ A1 Player polling
→ U0/W03 只做快速复现；不复现即关闭工作项
→ B-min Teacher 最小可信状态 + 隐私修正
→ H-pre 第一轮四人试跑
→ 按 H-pre 的第一个真实硬阻塞安排 C / D1 / E1 / F
→ D2/E2 三秒结果呈现
→ 正常路线 F0/H0

并行：Q 小型权限清理；T0 只读 TOP 映射
后置：获批 TOP 子集；UI 大改；W12 装饰；可选共享 context
```

---

# 2. 代码事实基线

本轮运行以下现有静态检查，全部通过：

- `structural-package-a-static-check.js`；
- `structural-package-b-static-check.js`；
- `sprint3b-remediation-static-check.js`；
- `sprint5-static-check.js`；
- `sprint6-static-check.js`；
- `sprint7-static-check.js`；
- `sprint8-static-check.js`。

静态 PASS 不能证明浏览器并发行为正确，但它足以说明不能把已经存在的 U0/W03 功能当作“尚未实现”。

| 事实 | 当前证据 | CD 判断 |
|---|---|---|
| Formal Start | `database/059_structural_lifecycle_transition_spine.sql`；`database/060_package_a_ca_a_bounded_corrections.sql`；Teacher `startRun()` 调用 `s9_start_formal_game` | 已实现；只需 smoke，不需新开发包 |
| Player polling | `src/game/app.js` 仍以 `setInterval(refreshState,1200)` 启动；一次刷新包含多次 RPC | 确定缺陷，A1 第一 |
| Teacher polling | `setInterval(loadState,1200)`，内部并发加载 Discussion/Operations | 有风险，但先看是否复现；A2 不阻塞 B/H-pre |
| GRAB/leave | Player renderer 分两步显示；S3B 函数和 live test 存在 | 先复现，不应凭旧报告重写 |
| generic Discussion | 有效 `s2_open_discussion` 包装最终调用带 3600 上限的 pre013 实现；canonical gameplay 中 generic 入口被拒绝 | 需要兼容修正，但优先级低于 S5/S6 |
| S5 Discussion | `s5_configure_discussion` 当前使用 90/15/180 秒并覆盖初始、重投和阶段重入 | 一个有效 helper 可集中修正，成本低 |
| S6 Discussion | `s6_open_discussion` 接收 180/60/300/45/90 等调用值；Player close 仍公开 | helper 集中转换 + 一个 Teacher close，成本中等 |
| W05 | S7 已有一个 Teacher RPC，但当前 player block 混合当前 phase、位置、submitted 和私有 locked choice | 扩展现有 RPC可行，但必须同时修正常模式隐私 |
| old S1 mutation | `s1_submit_private_choice` 仍授权 anon/authenticated，旧 JS 函数仍存在但不在 canonical refresh 路径使用 | 低概率、低成本清理；冻结前完成 |
| Override/export | 已有 `teacher_overrides`、`teacher_override_validity`、行为有效性和 S8 export | 应复用，不应再造完整 provenance 系统 |

---

# 3. 分级评估

## 3.1 BLOCKER — A1 Player polling 必须先完成

当前 `refreshState()` 的一次调用依次或条件性读取 S8、S2、S3B、S5、S6、S9、Pocket，并可能再次读取 S8。它通常不可能稳定地在 1.2 秒内完成。`setInterval` 不等待上一轮，因此 N+1 可以先完成并渲染，随后被 N 的旧结果覆盖。

另外，S5/S6/S8/Pocket 多处 `.catch(()=>({active:false}))` 把网络失败伪装成“模块未激活”，可导致界面跳回错误场景。

**最小修改：**

1. 用一次完成后再调度下一次的 single-flight 循环替代 `setInterval`；
2. 加 session epoch 和 generation；
3. 旧 generation 只丢弃，不渲染；
4. 保留最后确认的被动画面；
5. 网络失败时禁用本轮无法验证的动作；
6. 暂不重构 renderer，不引入 shared context；
7. duplicate S8 只有在等价性测试通过后才删除。

**实施：** `2–2.5/5`。

**验证：** `3/5`，因为必须人工制造响应乱序、掉线和 session 切换。

**回滚：** 单一前端提交，无数据库状态。

**客观失败测试：** 建立可控制 Promise 返回顺序的浏览器/单元 harness；让 N 晚于 N+1 返回，当前实现应失败。这个 red test 比继续讨论 Observer 更有价值。

## 3.2 BLOCKER — NORMAL Discussion 10800 必须能真实创建

CA 对 3600 上限的判断正确，但不需要全面重写 deadline engine。

### generic/S2

generic 入口在 canonical gameplay 中已被 migration 013 禁用，所以它不是主游戏路线的最高优先级。若仍要保持三套 Discussion 一致，最低成本不是复制整个旧构造器，而是：

1. 新包装接收 10800；
2. 内部用仍合法的值创建 session；
3. 在同一事务把该 NORMAL session 的 `discussion_time_limit_sec` 和 `phase_deadline` 更新为 10800；
4. 返回更新后的 identity/deadline；
5. AUDIT 和 vote limit 不变。

若数据库审计证明直接替换 pre013 的校验更短、更安全，也可采用；不应为了“纯洁”复制数百行历史函数。

### S5

有效入口集中在 `s5_configure_discussion`。最低成本做法是在 helper 内根据 run mode 选择：

```text
NORMAL discussion seconds = 10800
AUDIT/current deterministic seconds = existing phase-specific value
vote seconds = existing value
```

因为初始、重投、ACT7 进入和 ACT8 进入都调用该 helper，不需要分别改四套业务函数；只需用测试证明所有入口确实经过 helper。

### S6

在 `s6_open_discussion` 内根据 `p_run` 读取 run mode：NORMAL 把 discussion 秒数转换为 10800，AUDIT 保留 caller 的现有秒数。这样 ACT9/10/11 及 reopen/no-consensus 自动覆盖，不必逐个改调用常量。

新增一个 Teacher-token close RPC，复用现有 phase→next-phase mapping，但带 expected phase/step/round/session、request UUID 和锁。NORMAL Player close 在服务端直接拒绝；AUDIT 可保留。Teacher UI 新增一个按钮，Player UI 删除 Continue。

NORMAL Add Time 的按钮必须移除。直接 RPC 的 NORMAL no-op/reject 是很便宜的防护，应做；不用设计复杂权限体系。

**实施：** C1 `1.5–2/5`，C2 `2–2.5/5`，合计约 `2.5–3/5`。

**验证：** `3/5`。无需真实等待三小时；通过受控时间/直接设置 deadline 验证 10799、10800+ 和 Teacher 提前结束。

**接受限制：** 超过三小时后旧 refresh/message 行为仍可能发生。这是已知、不支持的课堂外情形，记录即可，不值得重写所有刷新函数。

## 3.3 MATERIAL — W05 先做最小可信投影，不等完整 20-vector

CA 提议 B-min 是合理的。当前 S7 endpoint 已经存在，不需要新 RPC，但不能直接把现有 player JSON 当成新 W05：

- 当前 physical location 基本来自 `s3b_player_progress.player_location`，进入 S5/S6 后会不足；
- `submitted` 混合多个领域但缺少明确 owner identity；
- NORMAL Teacher 响应目前仍可能带 `locked_choice_value`，这与“不显示未揭示私有选择”冲突；
- 最新 Discussion 通过 started_at 选择，不能替代当前域/轮次 identity。

**最低可用第一版只提供：**

1. 连接状态；
2. 当前 physical location；
3. 当前大类状态：等待/讨论/已投票/任务/完成；
4. Main Gate role 与 ready/engaged；
5. source domain + source identity + validity。

ACT2 Follow Sign 成功后直接显示进入 Library。NORMAL 删除 locked private choice；仅 AUDIT explicit debug 保留。

先 shadow 8–10 个主路线向量即可开始 H-pre，不要求在 U0/W03 前完成所有边缘向量。冻结前再补完整向量。

**实施：** `2–2.5/5`。

**验证：** H-pre 前 `2/5`，冻结前累计 `3/5`。

**回滚：** 只回退 Teacher table 的 W05/status binding。

## 3.4 MATERIAL — ACT3 与 ACT7 应按领域直接修，不等大 UI

ACT3 当前已有 run lock、request UUID、attempt number 和 attempt table。三秒窗口只需在同一锁内 replay-first，然后比较最后 accepted timestamp。错误 UI 只显示“密码错误”。

ACT7 当前底层可以写 `wrong_majority`，wrapper 重分类风险属于直接 bug。应让 owning result kind 只写一次，wrapper 只转发。

两项均与新 Player shell、Pocket 重组或 TOP 无关，可以在 H-pre 第一次遇到相应阶段前后独立交付。

**ACT3 实施/验证：** `2/5` / `3/5`。

**ACT7 实施/验证：** `2/5` / `2.5–3/5`。

## 3.5 MATERIAL — 四端三秒结果值得共享“展示记录”，不值得共享游戏 Resolver

CA/CD 现有方案若让三个领域分别新增一套 occurrence schema，再写三套读取适配，成本会偏高。

更便宜的实现是一个极小的 `result_occurrences` 展示记录：

```text
occurrence_id
run_id
owner_domain
interaction_identity
result_kind
text_key(s)
started_at
visible_until
```

S3B/S5/S6 仍各自在自己的锁/事务中决定结果，同时插入这条展示记录。Player 各领域状态和 S7 Teacher response 只投影当前未过期记录；前端共用一个纯展示组件。

这不是中央游戏引擎，因为它不计算结果、不允许写任意 next phase，也不成为 gameplay authority。它是本计划中少数真正满足“至少三个生产者和四个消费者、能删除重复代码”的共享边界。

**实施：** `3/5`。

**验证：** `3.5–4/5`，重点是 polling 去重、重连不重启、旧 occurrence 不覆盖新 occurrence和隐私。

**优先级：** H-pre 后、H0 前。首轮 H-pre 可以使用旧反馈 UI。

## 3.6 MATERIAL — TOP 的范围应由 T0 证据决定，不阻塞正常路线

T0 是足够的下一步，但不足以证明“全部 13 个 TOP = 3–4/5”。当前边界至少分为：

- ACT1–5：已有硬编码 Teacher Override 与 S3B 状态；
- ACT5→6：已有 S5 initializer 与逐 Player handoff/entry barrier；
- ACT6–8：S5 rounds、Discussion session、vote/revote 和 final private choice；
- ACT8→9：S6 initializer、私有 clue delivery；
- ACT9–13：S6 step、Golden Key branch、allocation、station task、engagement 与 failure state；
- ACT13→14：finalization verifier/export 边界。

这不是一个通用“补几个字段然后 act_no+1”能覆盖的同构集合。

**最低成本建议：**

1. T0 先产出 13 行粗粒度表：现有 initializer、最少输入、是否能复用、主要特殊分支、测试类别；
2. 不做全面字段血缘；只有某边界进入实施时才细化其 manifest；
3. 先选一个 S3B 内部边界和一个跨域边界作 pilot；
4. 依据 pilot 将边界分为 simple/medium/high；
5. Teacher 决定首个冻结版本必须包含哪些 TOP；
6. 正常路线 F0/H0 不等待全部 TOP。

**成本判断：** T0 `2/5`；全部 13 个 implementation 目前应写 `4/5 provisional`；完整验证 `5/5`。若只做首批高价值边界，按边界单独估算。

## 3.7 MATERIAL — OR 应复用现有 Override/export，不另建精细数据血缘

仓库已经有：

- `teacher_overrides`；
- `teacher_override_validity`；
- runtime event 的 `validity / behavior_scoring / context_provenance`；
- S8 `teacher_overrides` 与 `behavior_validity` export；
- finalization verifier 对 `invalid_teacher_override` 的识别。

因此不应新建一套平行 provenance graph。

**推荐的粗糙但安全第一版：**

1. Override record 增加 compact `or_filled_json`；
2. export 原样包含该列表；
3. 不伪造 Player vote/message/response timestamp；
4. 对确实代替 Player 行为的字段，继续写现有 `teacher_override_validity`；
5. 最省工的统计保护：发生 NEXT TOP 后，将该 run 标为不进入自动行为数据集，但仍允许导出供教师查看；
6. 如果教师以后明确需要保留 TOP 后的真实行为分析，再实现逐字段过滤。

第 5 项会牺牲一部分可分析数据，但对教学小游戏比修改每个 S3B/S5/S6/export consumer 更便宜、更不容易漏标。它符合“运行可继续、OR 不冒充学生行为”的核心目标。

**实施：** `1–2/5`，不含各 TOP 本身。

**验证：** 检查 export 有 reason/OR list、dataset eligibility 为 false、正常运行不受影响。

## 3.8 MATERIAL — H-pre 值得做，但前置条件要少而明确

H-pre 不需要等待全部 W05、D2/E2、Pocket/UI 重组或 TOP。

最低前置条件：

1. A1 完成；
2. Formal Start smoke 通过；
3. W03 GRAB/leave 最新基线 smoke 通过；
4. B-min 至少让 Teacher 看见位置和等待/讨论/已提交；
5. 使用全新测试 room，避免复用旧 session；
6. 开启浏览器 console/network 记录；
7. 明确 H-pre 只寻找“第一个阻止继续的错误”。

旧 UI 的文字或布局问题记录为 MINOR，除非玩家因此无法知道下一步。每次 H-pre 最多形成 1–3 个高优先级缺陷，不把所有观察都升级为开发任务。

**准备/执行：** `1–2/5`。

**价值：** 高。它比继续纸面推演所有 ACT 边缘状态更能降低总体成本。

## 3.9 MINOR — A2 Teacher polling

Teacher polling也可能重叠，但 Teacher页面主要是只读，实际影响低于 Player。A1完成后复用相同 coordinator 模式；若 H-pre 未复现错误，可以延后到 B2 或冻结前。

不要因此建立统一 Player/Teacher context。

## 3.10 MINOR — old `s1_submit_private_choice`

它仍授权浏览器并且旧 JS 函数仍在 bundle 中，但 canonical `refreshState()` 不再走旧 renderer。调用会写旧 `s1_*` 表，未见其直接改变 S3B/S5/S6 canonical state或当前 S8 export。

因此它是低概率、低影响但廉价的清理项：

1. 先确认当前 supported E2E 不依赖；
2. 删除/隔离死的旧 UI调用代码；
3. forward migration 撤销 anon/authenticated execute；
4. 加一个权限拒绝测试。

**实施/验证：** `1/5` / `1–2/5`。冻结前完成，不阻塞 H-pre。

## 3.11 MINOR — 超过三小时的自动行为

已列为接受限制。只需：

- UI 不承诺“永久由教师控制”；
- 测试并记录 10800+ 行为；
- 提供重新开始/使用 Teacher recovery 的操作说明。

不为这个低概率课堂外情形重写三套 deadline state machine。

---

# 4. 对 CA V3.0 六个问题的直接答复

## 4.1 P0/A1、U0、W03 与 W05 的顺序

- A1 应是第一个新代码包。
- U0 已完成，只做 smoke，不能重复开发。
- W03 当前有函数、UI 和 live test；先复现，失败才进入 F。
- B-min 在 A1 后立即做，但不要求完整 W05 vectors 才能开始 H-pre。

最便宜顺序：`P0-lite → A1 → U0/W03 smoke → B-min → H-pre`。

## 4.2 NORMAL 10800 的最小修改

- generic：只处理 3600 构造限制，不重写 refresh；canonical route 中优先级低；
- S5：集中修改 `s5_configure_discussion` 的 NORMAL 秒数；
- S6：集中修改 `s6_open_discussion` 的 NORMAL 秒数；
- 新增一个 Teacher S6 close；NORMAL Player close server-reject；
- 隐藏 Add Time/countdown，直接 NORMAL Add Time 廉价拒绝；
- 接受 10800+ residual。

可以控制在 implementation `2.5–3/5`，无需全 deadline rewrite。

## 4.3 TOP 与 OR

- T0 足以决定是否投资，不足以证明全量成本；
- initializer 跨三个 domain 与 finalization，必然需要部分 boundary adapter；
- OR 复用现有 Override/export；
- 第一版 run-level `behavior_dataset_eligible=false` 是最便宜安全方案；
- normal-route acceptance 不等待全部 TOP。

## 4.4 H-pre 与旧 UI

可行且值得。A1 和 B-min 后，旧 UI 的噪声可以通过“只记录阻止继续的问题”控制。不要在 H-pre 前完成 W02/W04/W06。

## 4.5 W05、Q、四端 result

- W05 不加 RPC，不用 ACTIVE fallback；同时修 normal private-choice leakage；
- old S1 grant 是冻结前小型清理，不是 H-pre blocker；
- 四端 result 用一个纯展示 ledger，domain 仍决定结果；成本 `3/5`，验证 `3.5–4/5`；
- 与 >3h 无关的主要风险是 stale Player frame、Teacher看到未揭示 private value、旧 mutation 仍可调用、result poll 重放。

## 4.6 何时 shared read context 值得

当前不值得建立通用 runtime context。唯一明显划算的共享边界是 result occurrence，因为有三个生产领域、四类视图，并能删除重复展示状态。

W05 仍留在 S7；Player 当前状态留在各 domain；TOP 不进入 shared context。

---

# 5. 修订后的成本与发布门槛

| 包 | 实施 | 验证 | H-pre 前？ | CD 结论 |
|---|---:|---:|---|---|
| P0-lite | `1/5` | `1/5` | 是 | 不重做已有审计 |
| A1 Player poll | `2–2.5/5` | `3/5` | 是 | 第一新代码包 |
| U0 formal start | `0/5` 新实施 | `1/5` smoke | 是 | 已完成 |
| W03 GRAB/leave | `0/5` 除非复现 | `1/5` smoke | 是 | 不复现即关闭 |
| B-min W05/privacy | `2–2.5/5` | `2/5` early | 是 | 最小向量即可 |
| A2 Teacher poll | `~2/5` | `2/5` | 否 | 证据驱动 |
| C1/C2 Discussion | `2.5–3/5` | `3/5` | 可由 H-pre 决定 | 集中改 helper |
| D1 ACT3 | `2/5` | `3/5` | 否 | 领域内直接修 |
| E1 ACT7 | `2/5` | `2.5–3/5` | 否 | 领域内直接修 |
| result ledger/UI | `3/5` | `3.5–4/5` | 否 | H0 前 |
| Q old S1 | `1/5` | `1–2/5` | 否 | freeze 前 |
| T0 | `2/5` | `1–2/5` | 并行 | 只读证据 |
| 13 TOPs | `4/5 provisional` | `5/5` | 否 | 分批授权 |
| OR run-level exclusion | `1–2/5` | `2/5` | 随首个 TOP | 粗糙但安全 |
| H-pre | 无主要代码 | `1–2/5` | — | 尽早执行 |

---

# 6. 最终评价

**对 CA V3.0 的总体 disposition：`MATERIAL CORRECTIONS, THEN USE AS EXECUTION SKELETON`。**

应采纳：

- A1 优先；
- B-min 后尽早 H-pre；
- C1/C2 不做 deadline 大改；
- normal route 不等待全部 TOP；
- shared context 默认不建；
- 独立 commit/test/rollback。

应修改：

- 删除 U0“待实施”身份，改成已实现 smoke gate；
- W03 改成“先复现再实施”；
- TOP 成本改为 provisional，并拆正常路线与 recovery release；
- OR 第一版采用 run-level behavior-dataset exclusion，避免过度精细过滤；
- W05 把 NORMAL private-value leakage 列入明确修复；
- result occurrence 采用共享展示 ledger，而非三套重复 schema。

不值得扩大：

- 超过三小时的全面 deadline 重写；
- H-pre 前的大型 UI 重组；
- 为少量教师操作建立复杂权限框架；
- 全局 Resolver、第二套状态机或 432 字段再审计；
- 在没有复现时重写 GRAB/leave；
- 为 TOP 建完整逐字段数据血缘系统。

本报告仅完成工程评估。它不授权实施、迁移、权限修改、部署或通知其他 agent。
