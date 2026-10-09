# Proposal of Debug Implementation Plan V3.0 by CD

**Date:** 2026-10-09

**Owner:** CD — Code Development Agent

**Status:** `FOR_GA_CRITICAL_REVIEW / NO IMPLEMENTATION PERFORMED`

**Implementation authorization:** NONE
**Branch:** `remediation/sprint9-structural-v1`

**Supersedes for current CD planning:**

- `PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V2.3_BY_CD.md`;
- `CD_CRITICAL_REVIEW_OF_CA_DEBUG_IMPLEMENTATION_PLAN_V3.0.md`.

**Companion semantic manifest:**

- `docs/plans/CD_ACT1_ACT14_MINIMUM_CONTINUATION_INFORMATION_TABLE_V1.0.md`

V3.0 保留 V2.3 的完整工作范围，并吸收 CD 对 CA V3.0 的成本/风险复核。它把普通课堂路线和 Override recovery 拆成两个 release lane，使当前正常测试不必等待全部 13 个 TOP 完成，同时把 TOP 所需的 ACT1–ACT14 最小续关信息正式交给 GA 审核。

---

## 0. 决策尺度

> 我们的目标是事先充分评估开发中可能遇到的困难和风险，但是不纠结过于细微末节的小问题。由于这个游戏仅为教学用小游戏，并非公开发行的大众游戏。因此很多低概率风险值得列出来，最多用简单“粗糙”的方法解决，不值得如临大敌地耗费时间精细打磨。

据此，V3.0 使用以下原则：

1. 优先修复已复现、会阻塞课堂测试的缺陷；
2. 选择最小、可回滚、由现有 canonical owner 承担的改动；
3. 低概率风险保留记录，但不自动升级为大型架构工程；
4. 不为一个教学游戏建立第二套通用状态机、全局 Resolver 或逐字段数据血缘系统；
5. 只要 placeholder 能完成正常路线，final media 不阻塞 runtime；
6. TOP recovery 不伪造玩家行为，允许采用粗粒度的整局行为数据排除；
7. 所有 runtime 修改仍需独立测试、CA audit 和明确发布授权。

---

## 1. V3.0 的两个交付通道

### Lane N — Normal-route classroom trial

目标：让三名学生和教师不使用 TOP 也能稳定跑完 ACT1–14。

包括：

- Player polling safety；
- W05/教师状态级显示；
- Discussion 教师控制兼容方案；
- ACT3 三秒冷却；
- ACT7 错误多数分类；
- 四界面统一三秒结果；
- 可达 legacy RPC 隔离；
- 已复现的普通路线缺陷；
- 集成验证、冻结和发布。

### Lane R — Override recovery

目标：教师可在 ACT1–ACT13 任一边界跳到下一 ACT，并在 ACT14 做终局恢复；缺失的通关最小信息由已审核的 OR backup 补齐。

包括：

- ACT1–ACT14 minimum continuation manifest；
- GA 填写/批准 backup 值；
- OR provenance 与 run-level analysis exclusion；
- 通用 TOP 事务骨架；
- 每个边界的窄适配器；
- ACT11–14 专用 terminal recovery；
- 13 边界回归。

**Release rule：** Lane N 可以独立形成下一轮可信测试版本。Lane R 分批实现，不阻塞不使用 TOP 的正常试跑。

---

## 2. 不做的事情

V3.0 明确不建设：

- 持久化 universal `global_phase` / `participant_progress`；
- 第二套 gameplay engine；
- browser 可提交任意表名/字段名/值的 recovery writer；
- 用“最新事件”推断教师页面当前状态；
- 假投票、假消息、假个人选择、假反应时间和假工位行为；
- 把 `OR` 拼接进业务值；
- 为每个 OR 字段做复杂分析过滤；第一版使用整局 behavior dataset exclusion；
- 为 Discussion 删除整套 deadline 架构；
- 为未复现的 GRAB/leave 风险重写流程；
- 把 UI 大改、最终图片或 shared context 抽象放在 bug fix 前面；
- 修改已经应用的历史 migration。

---

## 3. 实施顺序

```text
P0  固定基线、复现矩阵、W01–W13 放置图
 |
A1  Player polling single-flight / stale-frame rejection
 |
B1  W05 最小服务器投影 + privacy vectors
B2  单区域 cutover（含 ACT2 Follow Sign 直接到 Library）
 |
H-pre 重新测量是否真的需要 shared context（默认不建）
 |
C1  Generic/S5 Discussion 10,800 秒兼容配置
C2  S6 Teacher Continue 窄 mutation
 |
D1  ACT3 三秒错误冷却 + occurrence
D2  ACT3 四界面三秒展示
 |
E1  ACT7 wrong-majority durable classification
E2  S5/S6 shared presentation occurrence adapters
 |
Q   legacy RPC quarantine
F   其他已复现 normal-route defects
 |
N-GATE  Lane N 全量回归、人工三学生+教师测试、冻结

T0  ACT1–ACT14 minimum continuation manifest（文档，可并行）
T0-GA  GA critical review + backup value approval
T1  OR provenance / run exclusion / generic transaction
T2  ACT1–ACT5 adapters
T3  ACT6–ACT10 adapters
T4  ACT11–ACT14 terminal recovery
R-GATE  13 boundary recovery regression、audit、冻结
```

依赖规则：

- A1 是 Lane N 第一项代码授权单元；
- B-min 完成后立即执行 H-pre，不先假定大型 shared context 有价值；
- C 在 D/E 前完成，避免在不稳定 lifecycle 上测试展示；
- E1 必须先于 ACT7 overlay cutover；
- T0 文档可并行，但 T1–T4 在 GA 填表前不得写死 backup 值；
- U0/教师在线时长基础功能已经存在，只做 smoke gate，不另建工作包；
- W03 GRAB/leave 必须先复现，再决定是否实施修复。

---

## 4. P0 — 基线、复现与范围防火墙

**成本：** `1/5`

**代码权限变化：** 无

1. 记录 exact commit、migration 集合、GitHub Pages build 和 Supabase target；
2. 在干净 schema 和当前 live schema 分别建立 smoke 基线；
3. 为 W01–W13 建立“当前 owner / 读路径 / 写路径 / UI consumer”放置图；
4. 对每个 defect 标记 `REPRODUCED / NOT REPRODUCED / ALREADY IMPLEMENTED / SEMANTIC BLOCKED`；
5. 固定四浏览器接受矩阵：3 Players + 1 Teacher；
6. 记录 rollback 边界和 release candidate SHA。

**STOP：** 目标环境或 effective function overload 不可识别。

---

## 5. A1 — Player polling safety

**成本：** `2/5`

**主要位置：** `src/game/app.js` 与 focused browser/static tests

使用 self-scheduling single-flight coordinator：

1. 同一时刻只允许一个 Player refresh；
2. 每轮携带 session epoch 与单调 generation；
3. 所有读结果先组成 candidate frame，再一次性提交；
4. 旧 epoch/generation 结果丢弃；
5. logout/rejoin 增加 epoch；
6. 区分成功、不适用、读取失败、状态矛盾；
7. 临时失败保留最后确认的被动画面，同时禁用无法确认身份的 mutation；
8. mutation 丢失响应时用同一 request id 重试；
9. 等价性证明后才删除重复 S8 read。

测试：逆序响应、刷新重叠、退出重进、部分域失败、提交成功但响应丢失、投票中重连、ACT5→6 barrier。

**PASS：** 不发生 stale overwrite，错误不再伪装成 inactive。

---

## 6. B-min — W05 和教师状态级显示

**成本：** `2–2.5/5`

**目标：** 只提供教师真正需要的当前状态，不做全局事件推断。

### 6.1 每名玩家最小投影

```text
physical_location
transition_state
discussion_or_vote_state
assignment_role
task_state
connection_state
source_domain
source_identity
validity / reason_code
```

显示粒度：

1. 在线 / 离线 / 重连；
2. 进入、位于或离开某房间；
3. 已进入转场屏障、等待其他人；
4. 讨论中 / 等待教师；
5. 尚未投票 / 已投票 / 等待结果；
6. 谜题进行 / 错误 / 已解决；
7. Main Gate A/B/C/WATCHER 就位；
8. 工位未准备 / ready / task complete / ENGAGED；
9. 逃生中 / 已到城堡外 / 等待终局 / 完成。

不显示未 reveal 的私人答案，不逐动作监控，不用全局 latest event。

### 6.2 ACT2 Follow Sign

成功调用后，服务器直接把该玩家 canonical location 设为 Library；Teacher 使用现有文案风格显示相当于“XXX进入图书馆”。不新增“已看到指示牌、正在改道”中间状态。

### 6.3 Cutover

1. 先返回 versioned shadow projection；
2. 用独立 fixtures 校验 S3B/S5/S6 handoff 和 privacy；
3. 只切 W05/status 区域；
4. 同一 commit 删除或禁用旧 binding；
5. 不新增第二 endpoint 或额外 polling call。

**H-pre：** B-min 后测量请求数、查询工作和剩余重复。如果没有两处以上真实 consumer 可删除，不建设 shared context。

---

## 7. C1/C2 — 教师控制 Discussion 的最小影响方案

**成本：** `2.5–3/5`

### 7.1 统一课堂规则

NORMAL Discussion duration = `3 × 60 × 60 = 10,800 seconds`。

保留现有 deadline machinery，但在受支持的课堂时段内，归零不能成为流程推进依据；实际推进由教师打开投票或继续。UI 隐藏普通倒计时或显示“由教师控制”。

不能机械替换所有时间常量：旧 generic constructor 有上限校验，且密码盒、cinematic、result overlay、AUDIT 模式均不应改成三小时。

### 7.2 C1 — Generic/S5

1. 找到 repository-last effective constructor/helper；
2. 只允许批准的 NORMAL Teacher-paced Discussion 使用 10,800；
3. 审计 initial、revote、reopen、reconfigure 路径；
4. 教师 Open Vote/Continue 携带 expected run/phase/round/discussion identity；
5. NORMAL 隐藏 Add Time；直接调用返回 not applicable 且不写事件；
6. 投票结果只使用真实提交。

### 7.3 C2 — S6

增加一个窄的 Teacher mutation，仅允许：

- `act9_discussion → act9_console`；
- `act10_discussion → act10_final_vote`；
- `act11_discussion → act11_allocation`。

要求教师 token、request id、expected identity、当前行锁、同请求幂等和 stale rejection。Player 的 NORMAL close path 在服务器端拒绝，不只是 UI 隐藏。

**接受的粗糙边界：** 超过三小时暂停课堂仍可能触发旧 expiry 兼容行为；这不是当前教学使用的高价值精修目标，文档明确即可。

---

## 8. D1/D2 — ACT3 密码盒三秒冷却和结果展示

**成本：** `2–3/5`

用户要求是：错误提交后屏幕只显示“密码错误”三秒；这三秒内后台拒绝新的不同输入，不需要显示“暂不接受新投票”。

实现：

1. 服务器锁定当前 puzzle/run row；
2. 先处理同 request id 的幂等重放；
3. accepted-attempt 后写 `cooldown_until = server_now + 3 seconds`；
4. 在窗口内，不同 request id 返回 cooldown/rejected，不增加 attempt，不产生第二结果；
5. 正确答案、fallback、Teacher recovery 分别保留明确 result code；
6. accepted result 写入统一 presentation occurrence：唯一 occurrence id、server start、server end=+3s、audience=3 Players+Teacher；
7. 四个界面都按 server window 展示；重连在窗口内恢复，窗口外不重新播放。

只在服务端存一次事实，不给四个浏览器各自启动不可核对的三秒真相。

---

## 9. E1/E2 — ACT7 分类和四界面结果

**成本：** `3–3.5/5`（含共享展示 ledger）

### 9.1 ACT7 wrong-majority

问题：ACT7 第一轮如果错误答案形成多数，后续重新开 round 的函数可能只看到“有多数”，把旧结果压成普通 majority，丢失“多数答案是错的”这一教学事实。

修复：

1. 首次结算时把 `wrong_majority` 写成 durable result code；
2. result occurrence 引用该 immutable classification；
3. reopen/revote 只创建新 round，不回写上一 round 分类；
4. no consensus、wrong majority、correct、fallback 分开；
5. 导出按 round 保留真实历史。

### 9.2 Shared presentation occurrence

ACT3、S5、S6 使用一套很小的展示 ledger，只共享“何时、向谁、展示哪个已完成结果”，不共享 gameplay resolution：

```text
occurrence_id
run_id
domain
source_identity
result_code
visible_from
visible_until
audience
```

所有结果持续三秒，3 Players + Teacher 看到同一编号和同一 server window。Renderer 根据 result code 使用现有本地化文案。游戏结算仍在 S3B/S5/S6 owner 中。

---

## 10. Q — Reachable legacy RPC quarantine

**成本：** `1–2/5`

1. 重新探测部署环境中的实际 overload 和 grant；
2. 证明当前前端与支持的 E2E 不调用候选 legacy mutation；
3. forward migration 撤销 browser role 执行权限；
4. 验证 anon/authenticated denial 与 canonical RPC success；
5. 不删除历史数据。

此项在 Lane N freeze 前必须完成。

---

## 11. F — 其他普通路线缺陷

只处理能复现且影响当前课堂路线的 defect：

- W03 GRAB/leave：先构造迟到响应、重连、重复请求；未复现则不重写；
- ACT5→6 / S5→S6 initializer handoff；
- reconnect 后丢失当前 phase、round、result window；
- Teacher polling 局部失败覆盖有效画面；只有复现时才做 A2；
- placeholder media 路径、资源 404、页面阻塞；
- live schema 与 clean schema 行为差异。

每项独立 commit、focused test、rollback。不得借机做 UI recomposition。

---

## 12. T0 — ACT1–ACT14 minimum continuation manifest

**成本：** CD 提取 `2/5`；GA 审核为外部语义依赖。

控制文件：

`docs/plans/CD_ACT1_ACT14_MINIMUM_CONTINUATION_INFORMATION_TABLE_V1.0.md`

该表覆盖：

- 六个 ACT2 强制 pocket items；
- Flashlight 明确排除；
- ACT3 1897 photo/torn note；
- S3B/S5/S6 初始化和屏障；
- ACT9/10 server-issued private clues；
- ACT10 TAKE/LEAVE + Golden Key 一致性；
- ACT11 allocation；
- ACT12 task/engagement/pressure；
- ACT13/14 escape/finalization；
- 哪些数据必须真实、不得 backup；
- GA 必须填写的唯一恢复值。

GA 未完成 critical review 和填表前，T1–T4 不实施。

---

## 13. T1 — OR provenance 与通用事务骨架

**成本：** `2.5–3/5`

### 13.1 最小 provenance

每次恢复记录：source ACT、target ACT、field/package key、effective value、`source=OR`、teacher reason、request id、timestamp。

第一版使用粗粒度规则：

```text
any NEXT TOP used => behavior_dataset_eligible = false
```

仍保留完整导出供人工查看，不再实现复杂逐字段分析过滤。

### 13.2 事务

1. 验证 Teacher token；
2. 锁定 run 和 canonical owner state；
3. 核对 expected source identity；
4. 同 request id 幂等重放；
5. 保存已有真实数据；
6. 关闭当前旧交互；
7. 只补 manifest 声明且确实为空的字段；
8. 调用 target initializer；
9. 验证 target 不变量；
10. 写 OR receipt/event 并一次提交；
11. 任一不变量失败则完整回滚。

客户端不能提交任意 field/value，只能请求已批准的 source→target adapter。

---

## 14. T2/T3 — ACT1–ACT10 边界适配器

**成本：** `3.5–4/5`，分批 review。

### T2: ACT1–ACT5

- ACT1→2：建立结构入口，不伪造 ACT1 choice；
- ACT2→3：补六个强制 items、Library location、party barrier、puzzle initializer；
- ACT3→4：OR puzzle resolution + 1897 photo/torn note；
- ACT4→5：缺失 private choice 保持空/无效；
- ACT5→6：使用 GA 批准的 group route，完成 S3B terminal 后调用 S5 initializer。

### T3: ACT6–ACT10

- ACT6→7：GA 批准的 ACT6 recovery resolution；
- ACT7→8：独立 recovery code，保留真实 wrong-majority 历史；
- ACT8→9：GA 批准的 converged route，调用 S6 initializer 发 ACT9 线索；
- ACT9→10：OR console completion，不制造按钮点击；
- ACT10→11：GA 批准的 TAKE/LEAVE branch package，一次写齐 flags 与 Golden Key 一致性。

每个 adapter 至少测试：空白、部分真实、全部真实、重复请求、冲突请求、stale source、initializer failure 和 reconnect。

---

## 15. T4 — ACT11–ACT14 terminal recovery

**成本：** `3–4/5`，但语义清晰后代码可以保持窄。

用户已明确：如果尚未分配 Main Gate 工位就 Override，游戏可以直接结束，不必为继续工位玩法而补假分工。

CD 建议：

1. 普通 finalization verifier 保持严格，不放宽正常通关；
2. 增加教师授权的 `override_terminal_proof`；
3. ACT11/12/13 TOP 可生成该 proof，并直接进入一致的 escape/final state；
4. 不插入假 allocation、station task、engagement 或 pressure choice；
5. OR verifier 只验证三名玩家、source identity、无开放交互、escape/final state、Teacher reason 和 idempotency；
6. 学生和教师看到 GA 批准的同一 recovery ending；
7. run 自动排除行为数据集。

若 GA 拒绝 terminal recovery，GA 必须在 manifest 提供唯一默认分工和每个 station 的 backup 值；CD 不自行设计。

---

## 16. 测试与验收

### 16.1 静态和数据库

- migration 顺序和 repository-last overload；
- grants/RLS/function security；
- clean schema apply；
- current live schema forward apply；
- SQL contract/pgTAP 或等价 focused tests；
- lint/static tests；
- 旧 RPC denial。

### 16.2 并发和恢复

- polling response reverse order；
- same request replay / conflicting payload；
- Teacher click 与 Player late request 并发；
- ACT3 三秒内多客户端提交；
- Discussion stale identity；
- TOP 空白/部分/完整真实数据；
- target initializer 抛错回滚；
- 每个边界连续 TOP；
- refresh/reconnect 在三秒 result window 内外。

### 16.3 四界面

3 Players + Teacher 验证：

- W05 房间/讨论/投票/工位状态；
- private data 不泄漏；
- Follow Sign 直接 Library；
- Discussion 等待教师；
- ACT3 错误仅显示“密码错误”三秒；
- 同 occurrence id/result window；
- ACT7 wrong-majority 不被重分类；
- placeholder media 完成路线；
- Lane R 中 OR provenance 和终局一致。

### 16.4 Release gates

Lane N 和 Lane R 分别冻结：

1. exact SHA；
2. exact migration list；
3. automated evidence；
4. human trial record；
5. CA independent audit；
6. deployment authorization；
7. rollback note。

冻结后任何修复创建新 candidate，不能原地改变验收对象。

---

## 17. 工作量与取舍

| 工作包 | CD 复杂度 | 是否阻塞 Lane N | 取舍 |
|---|---:|---|---|
| P0 | 1/5 | 是 | 必做，防止修错环境 |
| A1 Player polling | 2/5 | 是 | 第一实施单元 |
| B-min W05 | 2–2.5/5 | 是 | 只做状态级投影 |
| H-pre | 1/5 | 否 | 先测量，默认不建 shared context |
| C Discussion | 2.5–3/5 | 是 | 10,800 秒 + 窄 Teacher Continue |
| D ACT3 | 2–3/5 | 是 | 领域内冷却 + 展示 occurrence |
| E ACT7/result | 3–3.5/5 | 是 | 分类先于展示 |
| Q legacy RPC | 1–2/5 | 是 | freeze 前完成 |
| F defects | 证据驱动 | 视缺陷而定 | 不复现不重写 |
| T0 manifest | 2/5 | 否 | GA 审核是 T1 前置 |
| T1 provenance/transaction | 2.5–3/5 | 否 | run-level 排除，避免精细过度设计 |
| T2/T3 ACT1–10 | 3.5–4/5 | 否 | 分两批实施/审计 |
| T4 terminal recovery | 3–4/5 | 否 | 不伪造 Main Gate 行为 |
| 全 13 TOP 集成验证 | 5/5 | 否 | 高成本主要来自状态组合和验证，不是代码行数 |

---

## 18. STOP 条件

立即停止当前工作包并报告，而不是扩大设计：

- canonical script 与 GA 填表冲突；
- live overload/grant 与 repository 不一致；
- 需要 browser 任意写字段；
- 需要伪造玩家行为才能通过 verifier；
- 一个局部修复要求建立第二 gameplay engine；
- shared abstraction 不能在同一 release 删除实际 consumer 调用/分支；
- W05 必须向 Player 泄漏 peers/private facts；
- normal-route 只能靠 TOP 才能通关；
- final media 被错误变成 runtime 前置；
- 同一 run 出现两个 canonical current owner。

---

## 19. 请求 GA 的 critical review

GA 需要同时审核：

1. 本 V3.0 的剧情语义、工作顺序和最低成本取舍；
2. companion ACT1–ACT14 表中的所有物品、记忆、分支和恢复值；
3. 明确填写每个“待 GA”单元；
4. 特别决定 ACT5 route、ACT6 resolution、ACT7 recovery、ACT8 route、ACT10 branch、ACT11–14 terminal recovery；
5. 确认 OR run 整局排除行为分析是否可接受；
6. 指出任何脚本必需但代码表遗漏的信息；
7. 不把玩家行为结果当作 backup 值填写。

GA review 只解决语义和 backup manifest。代码实现仍需后续授权、独立 commit/test 和 CA audit。
