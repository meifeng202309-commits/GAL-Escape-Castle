# ACT1–ACT14 通关最小必要信息表 V1.0（CD）

**日期：** 2026-10-09

**Owner：** CD — Code Development Agent

**状态：** `FOR_GA_CRITICAL_REVIEW_AND_FILL`

**用途：** 教师在任一 ACT 使用 Override / TOP 后，系统能够进入下一 ACT 并继续正常运行
**实施授权：** 无；本文件是语义审计表，不是迁移或数据写入脚本

---

## 1. 口径

本表中的“最小必要信息”不只指物品，还包括：

- 玩家与运行身份；
- 当前场景、阶段和轮次；
- 物品、记忆、私密线索和已知事实；
- 路线、选择与剧情分支；
- Discussion、投票、密码盒、工位和终局所需的服务器状态；
- 进入下一 ACT 时必须已经存在的数据库行；
- 必须保留但不能用 backup 伪造的真实玩家行为。

目标不是替玩家“演完”被跳过的 ACT，而是：

> 保留所有真实数据，只对下一 ACT 无法启动时缺少的最小系统事实进行补齐；补齐值带 `OR` 来源标记，不伪造玩家投票、消息、反应时间、个人选择或详细操作历史。

### 1.1 分类

| 标记 | 含义 | Override 处理 |
|---|---|---|
| `HARD` | 代码初始化、推进或终局验证直接依赖 | 缺少时必须由受控恢复逻辑补齐，或由专用恢复合同绕过 |
| `SOLVE` | 玩家正常解题所需，但代码未必强制检查 | 若跳过来源 ACT 且后续仍需玩家使用，可补服务器发放的线索/物品 |
| `CONT` | 剧情和分支连续性需要 | 保留真实值；缺失时由 GA 指定唯一恢复值 |
| `REAL_ONLY` | 玩家真实行为或观察结果 | 不得生成 backup 假数据；保持真实值或空值/无效 |
| `OPTIONAL` | 不影响后续通关 | 不补 |
| `OR` | Override Recovery 来源 | 值与来源分开存储；不得把 `OR` 拼到真实值字符串中 |

### 1.2 GA 需要填写的内容

表中“GA 批准的 backup 值/规则”留给 GA：

1. 确认该行是否确属通关最小必要信息；
2. 在候选值存在剧情选择时，指定唯一 backup 值；
3. 指定展示给教师/学生的最小文案（如需要）；
4. 对 ACT12–14 的“直接结束游戏”恢复语义作最终决定；
5. 删除不应补齐的项目，补充 CD 漏掉但脚本必须保留的项目。

---

## 2. 所有 ACT 共用的不变量

这些不是每次都需要新写入的数据，但每次 TOP 事务都必须验证。

| 编号 | 最小信息/条件 | 类别 | CD 技术要求 | GA 批准的 backup 值/规则 |
|---|---|---|---|---|
| G01 | 唯一 active run、稳定的 `run_id` | HARD | 只操作教师当前明确选择的 run；不得新建第二个平行 run | **待 GA 确认** |
| G02 | 三名玩家 GAL-A / GAL-B / GAL-C 及稳定 player id | HARD | 必须正好三名；TOP 不代替登录、不改变角色归属 | **待 GA 确认** |
| G03 | 当前 source ACT、target ACT、场景和阶段身份 | HARD | 请求携带 expected source identity；锁行后再次核对 | **待 GA 确认** |
| G04 | 教师身份、教师理由、唯一请求 id | HARD | 同一请求可安全重放；冲突 payload 拒绝 | **待 GA 确认** |
| G05 | 真实数据原样保留 | HARD | 非空真实值不被 backup 覆盖 | **待 GA 确认** |
| G06 | backup 来源 | HARD | 恢复字段/恢复包记录 `source=OR`；run 标记曾使用 TOP | **待 GA 确认** |
| G07 | 行为数据资格 | CONT | CD 候选：一旦使用 NEXT TOP，整局 `behavior_dataset_eligible=false`；导出仍保留 | **待 GA 决定** |
| G08 | 旧交互停止接受新操作 | HARD | 关闭被跳过的当前 Discussion/投票/谜题；旧请求用 source identity 拒绝 | **待 GA 确认** |
| G09 | 不伪造玩家行为 | REAL_ONLY | 不生成假投票、假消息、假个人选择、假延迟、假点击、假工位操作 | **待 GA 确认** |
| G10 | target 初始化只执行一次 | HARD | target initializer 与恢复补值同一事务；重复请求不重复创建轮次/线索 | **待 GA 确认** |
| G11 | 当前 canonical owner 唯一 | HARD | S3B/S5/S6 中只能有一个有效的当前阶段；矛盾即失败并回滚 | **待 GA 确认** |
| G12 | 媒体不是通关数据 | OPTIONAL | 最终图片缺失不阻塞；继续使用 placeholder-first 路径 | **待 GA 确认** |

---

## 3. 全局物品、记忆和线索清单

| 信息 | 首次产生 | 后续用途 | 最小性 | TOP 规则 | GA 批准的 backup 值/规则 |
|---|---:|---|---|---|---|
| Castle Map / `gitte_castle_map` | ACT2 GRAB | 连续性、路线理解 | CONT | 若在进入 ACT3 前缺失，放入 GAL-A pocket，`source=OR` | **待 GA 填写** |
| Number Note / `gitte_number_note` | ACT2 GRAB | 重复线索、ACT3 密码盒理解 | SOLVE/CONT | 若进入 ACT3 前缺失，放入 GAL-A pocket，`source=OR` | **待 GA 填写** |
| Servant Diary / `anna_servant_diary` | ACT2 GRAB | 剧情连续性 | CONT | 若进入 ACT3 前缺失，放入 GAL-B pocket，`source=OR` | **待 GA 填写** |
| Stopped Watch / `linda_stopped_watch` | ACT2 GRAB | ACT7 时钟谜题线索 | SOLVE/CONT | 若进入 ACT3 或 ACT7 前缺失，放入 GAL-C pocket，`source=OR` | **待 GA 填写** |
| Silver Star Key / `linda_star_key` | ACT2 GRAB | LEAVE 分支 Station C 必需 | HARD（LEAVE） | 若进入 ACT3 前缺失，放入 GAL-C pocket；不得在 ACT12 才临时伪造成玩家发现 | **待 GA 填写** |
| Closure Order / `linda_closure_order` | ACT2 GRAB | 城堡背景连续性 | CONT | 若进入 ACT3 前缺失，放入 GAL-C pocket，`source=OR` | **待 GA 填写** |
| Flashlight / `gitte_flashlight` | ACT1 条件发现 | 氛围/可选辅助 | OPTIONAL/REAL_ONLY | **永不 backup 补齐**；只保留真实发现 | **待 GA 确认** |
| 1897 Photograph / `library_photo_1897` | ACT3 密码盒成功 | ACT8 识别、ACT12 Station A 输入 `1897` | SOLVE/CONT | 若跳过 ACT3 且仍继续到 ACT4+，加入 group pocket，`source=OR` | **待 GA 填写** |
| Torn Note / `library_torn_note` | ACT3 密码盒成功 | 路线/剧情连续性 | CONT | 若跳过 ACT3 且仍继续到 ACT4+，加入 group pocket，`source=OR` | **待 GA 填写** |
| ACT9 三份私密线索 | ACT9 initializer | ACT9 四步控制台 | HARD/SOLVE | 由服务器 initializer 向三名玩家分别发放；是系统线索，不是玩家行为 | **待 GA 审核具体文本/键** |
| ACT10 三份私密线索 | ACT10 initializer | Golden Key TAKE/LEAVE 决策 | SOLVE | 由服务器 initializer 发放；不得伪造玩家选择 | **待 GA 审核具体文本/键** |
| Golden Key / `golden_key` | ACT10 TAKE 结果 | 决定 A/B/WATCHER 分支 | HARD（TAKE 分支）/CONT | 只在恢复分支被明确设为 TAKE 时加入 group pocket；LEAVE 时必须不存在 | **待 GA 指定恢复分支** |

说明：Silver Key 已在现有 ACT2 GRAB 逻辑中强制进入 Linda pocket；Golden Key、Flashlight 不是所有路线的通关必需品。Main Gate 使用 C 还是 WATCHER 仍由 ACT10 的 TAKE/LEAVE 分支决定。

---

## 4. ACT1–ACT14 最小续关信息主表

“在 ACT n 使用 NEXT”表示恢复目标是 ACT n+1。ACT14 没有 ACT15，使用的是终局恢复/Finalize。

| TOP 边界 | 进入目标时必须存在的信息 | 类别 | CD 候选恢复动作 | 明确不得伪造 | GA 批准的 backup 值/规则 |
|---|---|---|---|---|---|
| ACT1 → ACT2 | S3B run/progress rows；三名玩家 ACT1 stage 可结束；当前场景为 First Meeting；每人的真实 ACT1 choice 若已提交则保留 | HARD/REAL_ONLY | 为缺失的结构行补 initializer 数据；未提交的 ACT1 choice 保持空/无效；把三人带到 ACT2 可执行入口 | ACT1 choice、发现 Flashlight、点击时间 | **待 GA 填写 ACT1 未完成时的展示语义** |
| ACT2 → ACT3 | 六个强制 pocket items；三人 GRAB/leave barrier 已满足；三人 location=Library；party reunited；ACT3 puzzle state/attempt counter 可初始化；旧 ACT2 Discussion 关闭 | HARD/SOLVE/CONT | 只补缺失强制物品并标 OR；直接设置系统位置/屏障事实；初始化密码盒，不生成玩家路线选择 | first-meeting choice、Discussion 消息、路线投票、Follow Sign 点击 | **待 GA 确认 route 恢复值及展示文案** |
| ACT3 → ACT4 | `puzzle_resolved_at` 或等价恢复证明；1897 photo、torn note；三人在 Library；ACT4 三个 private-choice slot 可用 | HARD/SOLVE/CONT | 不伪造密码尝试；建立“教师跳过密码盒”的 OR resolution，发放两件 group items，初始化 ACT4 | 密码输入、错误次数、反应时间、谁先作答 | **待 GA 指定恢复 resolution code** |
| ACT4 → ACT5 | 三个真实 ACT4 choice 已有则保留；缺失 choice 允许为空/无效；ACT5 route discussion/round 可初始化；Library items 保留 | HARD/REAL_ONLY | 结束未完成 private-choice window；初始化 ACT5，不为缺席玩家选答案 | ACT4 private choice、选择时间 | **待 GA 确认空 choice 的统计口径** |
| ACT5 → ACT6 | S3B terminal complete；`group_route` 有一个可继续的系统值；S5 run state；ACT6 round + Discussion；三名玩家已跨过 Portrait Hall entry barrier；所有 pocket/group items 保留 | HARD/CONT | GA 指定 route backup；同一事务完成 S3B terminal、初始化 S5 ACT6 与 Discussion | ACT5 玩家投票/消息 | **待 GA 指定 `group_route`：`known` / `unknown`；是否允许 `inspect_first`** |
| ACT6 → ACT7 | ACT6 有可解释的 group resolution；S5 act=7、正确 round/Discussion；Stopped Watch 仍在 GAL-C pocket | HARD/SOLVE/CONT | 建立 OR 的 ACT6 系统结论并初始化 ACT7；不补投票 | 玩家 ACT6 vote、发言、多数形成过程 | **待 GA 指定 ACT6 backup resolution** |
| ACT7 → ACT8 | ACT7 谜题被标为 solved/teacher-recovered；错误多数历史若真实存在必须保持；S5 act=8 private phase；1897 photo 与 torn note 存在 | HARD/SOLVE/CONT | 创建独立 OR recovery result，不能把真实 wrong-majority 重分类为 ordinary majority；初始化 ACT8 | ACT7 vote、错误尝试、玩家是否识别时钟 | **待 GA 指定恢复 result code** |
| ACT8 → ACT9 | S5 complete；`route_taken_act8` 有唯一恢复值；S6 run state；ACT9 三份私密线索；ACT9 Discussion；Pocket 连续 | HARD/SOLVE/CONT | GA 指定 converged route 值；调用 S6 initializer 正常发线索并开 Discussion | ACT8 private choice、最终路线 vote | **待 GA 指定 `main_gate` / `west_tower`；说明两路线汇合是否允许任一固定值** |
| ACT9 → ACT10 | ACT9 console sequence 有 OR completion；S6 act=10/private；ACT10 三份私密线索；控制台完成后的机关状态一致 | HARD/SOLVE | 不生成四个玩家按钮输入；记录 Teacher recovery completion，初始化 ACT10 | 红/蓝按钮点击、输入顺序、协作延迟 | **待 GA 指定 ACT9 recovery completion code/剧情解释** |
| ACT10 → ACT11 | 唯一 TAKE/LEAVE 分支；分支 flags 一致；TAKE 时 group pocket 有 Golden Key、LEAVE 时没有；ACT11 Discussion 可用 | HARD/CONT | 只使用 GA 批准的默认分支；一次性写齐 branch flags 与物品，然后初始化 ACT11 | ACT10 private choice、最终 vote、谁主张哪条路线 | **必须由 GA 指定默认 TAKE 或 LEAVE** |
| ACT11 → ACT12 | 正常路线需要三个不重复且分支合法的角色：TAKE=A/B/WATCHER，LEAVE=A/B/C 且 C=GAL-C；或使用“未分配即直接终局恢复”的专用合同 | HARD | **CD 首选按用户决定：若尚未分配任务就 TOP，不伪造分工，进入专用 terminal recovery，而不是生成三名玩家的假 allocation** | 玩家分工、协商、角色接受时间 | **GA 必须确认：直接终局恢复；若不接受则填写默认角色表** |
| ACT12 → ACT13 | 正常路线需 Station A=`1897`、B=`lever_center`、C=`silver_key_inserted` 或 WATCHER=`corridor_watched`；3 个 engagement；3 个 pressure choice；failure/cinematic 状态一致；或专用 terminal recovery | HARD | 已有真实任务全部保留；缺失时不制造玩家工位行为，使用 GA 批准的 terminal recovery proof；关闭 active failure | 工位输入、engagement、pressure choice、失败者及时间 | **GA 必须定义 terminal recovery outcome 和最小展示文案** |
| ACT13 → ACT14 | `escape_success=true`；mechanism failure inactive；failure resolution 合法；`act14_boundary_reached=true`；无 open Discussion；终局 verifier 可接受正常证据或 override recovery proof | HARD | 正常完成数据不足时用专用 override finalization contract；不得伪造 station/task/pressure rows；标记数据不可用于行为分析 | 三人任务、压力选择、逃生动作 | **GA 必须批准 override finalization 的叙事结果** |
| ACT14 → Finalized | run terminal/finalized；三人可见同一终局；无待处理交互；导出保留真实+OR provenance；可识别为 Override-assisted completion | HARD/CONT | 幂等 finalize；普通 run 继续严格验证全部正常证据，OR run 走独立受限验证分支 | 正常通关证据 | **GA 指定最终文案及是否称为“通关/教师补救完成”** |

---

## 5. 各目标 ACT 的技术落点（供 GA 审核语义，不要求 GA 写 SQL）

| 目标 ACT | 代码侧最低结构要求 | 若缺失会怎样 |
|---:|---|---|
| 1 | active run、3 players、S3B run/progress rows | 页面无当前玩家阶段或无法提交 |
| 2 | 三人 ACT1 完成屏障、First Meeting/GRAB 状态 | 无法进入共同会面/拿取必需物品 |
| 3 | 必需 pockets、三人 Library location、party reunited、puzzle initialized | 密码盒不开放或后续缺 Silver Key/Watch |
| 4 | puzzle resolved、photo/note group items、ACT4 slots | ACT4 被前置条件拒绝，后续缺 1897 线索 |
| 5 | ACT4 window closed、ACT5 discussion/round | 路线讨论或投票不能开始 |
| 6 | S3B terminal、S5 initialized、ACT6 barrier/round/discussion | S5 initializer 不运行或三人无法同步 |
| 7 | ACT6 resolution、ACT7 current round/discussion | ACT7 时钟题无合法入口 |
| 8 | ACT7 solved/recovered、ACT8 private phase | ACT8 选择无法提交 |
| 9 | S5 complete、S6 initialized、ACT9 private clues/discussion | S6 initializer 拒绝或玩家没有各自线索 |
| 10 | ACT9 completion、ACT10 state/private clues | Golden Key 决策流程无法开始 |
| 11 | TAKE/LEAVE branch flags、Golden Key 一致性、ACT11 discussion | 角色集合无法决定 |
| 12 | 正常 allocation，或明确 terminal-recovery identity | 工位 API 无法授权玩家 |
| 13 | 正常 tasks/engagement/pressure，或明确 terminal-recovery proof | cinematic/escape 及 verifier 无法成立 |
| 14 | boundary reached、escape success、failure inactive、无开放交互 | finalization verifier 拒绝 |

---

## 6. 推荐的 backup 数据形态

不采用把 `OR` 直接拼接到业务值后的形式。建议最小结构如下：

```text
run_id
source_act
target_act
field_key
effective_value
source = OR
teacher_reason
request_id
created_at
```

若一组字段必须原子一致（例如 ACT10 TAKE 同时意味着 Golden Key、alarm、Watcher 分支），应使用服务器内部命名的恢复包，而不是允许浏览器逐字段写值：

```text
recovery_package = act10_take_or_v1
```

这个包可以展开成多字段，但所有值必须先由 GA 在本表中批准，并由 CD 固定在服务器端；教师客户端只选择“跳到下一 ACT”和填写原因，不能提交任意表名、字段名或值。

---

## 7. ACT11–14 的关键设计决定

现有正常终局验证会检查：

- 3 名玩家；
- 3 个合法工位分配；
- 3 个 station task；
- 3 个 engagement；
- 3 个 ACT12 pressure choice；
- 没有开放 Discussion；
- ACT14 boundary reached；
- escape success；
- 没有 active failure。

因此，“没有分配工位时直接 Override，游戏就结束”不能只把 act number 改成 14。最低成本、且不污染真实行为数据的实现是：

1. 保留普通 finalization verifier，不放宽普通通关；
2. 新增一个窄的、教师授权的 Override terminal proof；
3. 该 proof 记录 source ACT、teacher reason、request id、`source=OR`；
4. OR finalization 只验证三人身份、请求身份、无开放交互、逃生/终局一致性；
5. 不插入假的 allocation/task/engagement/pressure rows；
6. 导出仍可查看，但整局排除在行为数据集之外；
7. 学生和教师看到 GA 批准的同一终局文案。

这项语义必须由 GA 明确批准后才能实施。

---

## 8. GA 填表验收清单

GA review 完成时应逐项给出：

- [ ] 所有 `待 GA` 单元都有明确 disposition；
- [ ] ACT5→6 的 route backup 已唯一化；
- [ ] ACT6→7、ACT7→8 的恢复结果语义已命名；
- [ ] ACT8→9 的 converged route backup 已唯一化；
- [ ] ACT9→10 的恢复剧情解释已确认；
- [ ] ACT10→11 的 TAKE/LEAVE backup 已唯一化；
- [ ] ACT11–14 是否直接 terminal recovery 已明确；
- [ ] ACT14 最终文案与“通关”称谓已明确；
- [ ] OR run 是否整体排除行为分析已确认；
- [ ] 没有要求伪造玩家行为数据；
- [ ] GA 确认没有脚本必须信息被遗漏。

在以上项目完成前，CD 可以继续 normal-route bug fix，但不得把 TOP backup 值写死进运行时代码。
