# CA V4 综合审计底稿：早期 Debug 事项覆盖 + TOP 真实行为数据保全

日期：2026-10-09；Owner：CA；审查结论：PASS_WITH_REQUIRED_CHANGES（仅实施计划，不是代码实施许可）。

## 资料与证据边界

已核查：GA_to_CA_20261009T132100Z、Debug Implementation Plan V4、CA-170、2026-09-27 Teacher trial 原始问题镜像、Player-Facing State Matrix、Completeness Supplement、Consolidated Findings、Round1 workload V1/V2.1、safest sequence V1/V1.1、UI architecture impact、2026-10-04 GA/CA 六封早期往来。旧 GA-102 已撤回作为 CD 行动依据。当前教师新决定取代 V4 §14.8 和 §19 的整局数据排除假设。

本审查为仓库静态核对；未执行生产数据库查询或四浏览器实测。“V4 已覆盖”不代表缺陷已经修复。

## 一、最早 14 项已确认缺陷与 V4 对照

| 历史发现 | 归类 | V4 对应与剩余验收问题 |
|---|---|---|
| IDA-001：正式启动前根页面会进入旧 Sprint1 | PRESERVED_IMPLICITLY | V4 P0/U0 和 F1 关注正式启动与终局，但应明确测试未启动 Player 看不到旧游戏交互 |
| IDA-002：旧根页面泄露其他人的首次秘密选择 | PRESERVED_IMPLICITLY | Q 旧 RPC 安全不足以证明前端展示已安全；补一个未启动的三玩家隐私负例 |
| IDA-003：旧两步启动产生 active 但 ACT1 未初始化 | PRESERVED_IMPLICITLY | V4 称 s9_start_formal_game 已实现；P0 应验证当前部署的原子启动、重复点击与中断，而非推定早期问题必然消失 |
| IDA-004：Teacher 显示 Run started 后又显示 No active run | PRESERVED_IMPLICITLY | A1/A2/B 涉及刷新，但根因未曾证实；增加 Teacher 局部失败/缓存混合快照 smoke，复现时才开 A2 |
| IDA-005：Teacher 正常页面并列旧 Advance/Reset | PRESERVED_IMPLICITLY | F9/UI 调整提及；需明确正常页面不出现旧控制，Maintenance 中权限受约束 |
| IDA-006：仅跑 RPC 绕过真实网页路径 | PRESERVED_EXPLICITLY | V4 H-pre、F0/H0/F1 和四客户端真实交互明确覆盖 |
| PFC-001：完成 ACT14 后反而回旧界面 | PRESERVED_EXPLICITLY | V4 F1；CA-170 另要求尽早做 ACT13→S8→ACT14 单链 smoke |
| PFC-002：ACT2/3/4/8 已提交后无等待确认 | PRESERVED_EXPLICITLY | V4 F2；验证断线恢复后仍显示已提交及等待 |
| PFC-003：ACT9–12 已提交但仍可操作 | PRESERVED_EXPLICITLY | V4 F3；验证服务器轮次对应和重复提交 |
| PFC-004：S6 错误或音频状态残留 | PRESERVED_EXPLICITLY | V4 F4；成功后清除不再适用的错误 |
| PFC-005：ACT1–5 缺 Pocket、Memories、Shared Photos、Group Items | PRESERVED_EXPLICITLY | V4 F5；验收必须证明图像实际载入、查看/翻转/分享、角色私密权限、重连，而非仅有数据库记录 |
| PFC-006：ACT4/Main Gate 图像锚点未绑定 | PRESERVED_EXPLICITLY | V4 F6；响应式锚点和缺失时安全退化 |
| PFC-007：ACT4 同步公开结果未展示 | PRESERVED_EXPLICITLY | V4 F7；确保全部有效提交前不得提前揭示 |
| PFC-008：ACT5 结果/进入画像厅被 S5 初始化覆盖 | PRESERVED_EXPLICITLY | V4 F8；必须看到剧情后果，再按各玩家交接进入 ACT6 |

结论：14/14 在 V4 至少有文档级覆盖，但 IDA-001 至 IDA-005 的描述偏间接；不能标记为 CLOSED_BY_EVIDENCE。将其转成 P0/U0/Q/Teacher/UI 的五项非常具体的浏览器/权限验收，不另建大型工作包。

## 二、早期 W01–W13 及其他界面需求核对

| 早期事项 | 分类 | 审查保留内容 |
|---|---|---|
| W01 老的 NORMAL 90/15 秒投票讨论与 Add Time | SUPERSEDED_BY_TEACHER_DECISION（局部） | 以教师接受的 10800 秒兼容窗口 + Teacher 开投票/S6 Continue 为准；过期理论边界不要求全面重构，但当前 3600 秒构造器上限是真实阻碍 |
| W02 响应式 Player shell | PRESERVED_IMPLICITLY | F9 过笼统；新增 desktop 双栏、mobile 折叠、稳定 DOM/监听器验收 |
| W03 一次选择物品并 GRAB+leave | PRESERVED_EXPLICITLY | V4 §7 明确一个服务器事务与两个 canonical 事实 |
| W04 Pocket 资产、翻转、分享 | PRESERVED_EXPLICITLY | F5 明确，但必须实际打开/翻转图片、权限和断线复现 |
| W05 Teacher 正确位置 | PRESERVED_EXPLICITLY | S3B/S5/S6 真实所有权，ACT11 角色≠物理位置 |
| W06 Teacher 主控布局、Emergency vs Maintenance | PRESERVED_IMPLICITLY | F9 需明确三个同 runtime 内部页面、教师 token 与事件监听不丢失、正常页主控 |
| W07 22 张图发布 | CLOSED_BY_EVIDENCE / NO_LONGER_NEEDED（图片发布） | 保留图片在 Pocket/页面浏览器实际加载验收；六项音频另在 M 中未 ACTIVE |
| W08 图书馆密码五格 UI | PRESERVED_IMPLICITLY | F9 需要具体显示锁定前缀、五格输入/提交按钮的验收 |
| W09 本地短期 UI 状态 | PRESERVED_IMPLICITLY，重大验收缺口 | 轮询后讨论草稿、focus、scroll、Pocket 展开、教师当前页保持；A1 正确不自动保证这些 |
| W10 Player identity/ACT header | PRESERVED_IMPLICITLY | F9 测试重新连接后的角色/当前 ACT，正式运行不得残留 Waiting for formal run |
| W11 普适数值重复、开发术语 | PRESERVED_IMPLICITLY / MISSING_MINOR | 41739 / ★ 不双语重复；用课堂语言代替 Sprint 等技术术语；低优先 |
| W12 两秒双语过场 | PRESERVED_IMPLICITLY | F9/F1 加 2 秒纯展示、首屏和重连不误触发的验收 |
| W13 四浏览器全流程、responsive、frozen SHA | PRESERVED_EXPLICITLY | V4 15–17 清楚覆盖 |
| Teacher UI 重排后按钮/绑定失效 | PRESERVED_IMPLICITLY | 加正常 Run/Recovery/维护页监听器和会话保持测试 |
| 音频 browser 实听 / ACTIVE | PRESERVED_EXPLICITLY | M：六项候选 ready 不代表 live ACTIVE；诊断运行可停止 fallback，最终候选要验收 |

没有证据表明某个早期完整工作包从 V4 完全消失；关键风险是 F9 一句话覆盖了多个曾确定的 UI 验收要求，可能被开发时忽略。因此提出小型验收清单，而非新的大架构。

## 三、TOP 真实行为数据：教师现行固定规则

禁止将「只要使用任意 TOP → 全局 behavior_dataset_eligible=false → 整局真实行为一律不可用于分析」作为默认处理。最早的首次游玩行为尤其宝贵。新 V4 必须保留：

1. REAL_VALID：服务器实际收到的真实行为，覆盖前和覆盖后均保留；
2. REAL_AFTER_UPSTREAM_OVERRIDE：之后真实操作，但标记上游曾经历恢复，供分析时区分条件；
3. MISSING_INVALID_OVERRIDE：跳过但没有被确认为实际发生的行为，null + invalid_teacher_override；
4. OR_GAME_TRACK：教师/系统为恢复游戏补的物品、剧情和状态，绝不计为 Player 行为。

“未收到服务器记录”不等于“玩家没有尝试”；若有客户端未确认尝试，也不得冒充已提交行为。

### 现有数据结构可复用的证据

database/054_level3_integrated_closure.sql 已使用 teacher_overrides、teacher_override_validity、runtime_events 中 event_source='teacher_override'、validity 和 behavior_scoring；还对 ACT1、First Meeting、ACT4 的 timing_validity 写 invalid_teacher_override。055/056 修复了覆盖字段记录。可沿用这些结构产生按交互和被跳过行为的标记。GA 信提到 behavior_validity 和 context_provenance.upstream_teacher_override，但本次读取的 SQL 未证明它们是所有领域都存在的字段；CD 应在真实导出结构中验证，而非直接新增一整套字段血缘架构。

### 最小数据/导出修正

- Override 收据列出 run / 当前 ACT / 目标 ACT / 影响的 interaction / OR 补值；旧真实行为保持；
- 仅对跳过的期望行为写对应 null/invalid，之后真实行为继续作为 REAL，附适当 upstream override context；
- 若旧 behavior_dataset_eligible 布尔字段存在，可仅表达“完全没有教师恢复帮助的完整可比运行”，**不能作为抽取该 run 中所有真实行为的排除条件**；或将其从真实行为抽取条件中弃用；
- 让现有 exporter/analyzer 以 event / interaction / feature-level 有效性筛选，而不是因为 override_id 存在就 WHERE run_id NOT IN (...);
- 原生完整 JSON/CSV 导出不得丢真实记录，也不得将系统恢复写成观察行为；
- 最小示例测试：同一 run 有跳转前 REAL 投票、跳转时缺失行为、OR 路线补值、跳转后 REAL 行为；导出四类各有明确证据。再测连续两次 NEXT TOP。

session_integrity_verified=true（技术上可审计的恢复完成）和“全部学生行为真实完整”不能同义；保留独立的恢复状态/缺失范围。不得将新行为分析选择规则与终局交易逻辑混为一谈。

### 性价比约束

先追踪实际 s8_export_session 等导出路径和真正用于研究的 analyzer，看看既有 validity/provenance 是否够用；若没有下游自动分析系统，不需要提前构造通用可查询的行为数仓。只要求导出不丢失且字段来源区分足够明确；后续分析按需求限定增加查询即可。

## 四、CA-170 问题延续（不因历史回查而重新放大）

- 10800 秒讨论兼容，教师已接受预期 <=2 小时的折中：不再反复索取三小时风险决策，也不重写整套 deadline。必须修复当前 generic 3600 秒检查以及 S5/S6 创建/重开。
- Teacher Open Vote、S6 Continue 的精确轮次与身份校验保留；旧玩家 S6 close 和 NORMAL Add Time 直接函数写入应以简单模式 guard 处理。
- Lane R 有界 ACT3→4 + 一个跨域 TOP pilot，实际成本再决定批次；NEXT TOP 应关闭旧交互/定时器，且第一项新 ACT 操作可执行。
- 音频 M 的 registry/live ACTIVE 先核实发布同步顺序；已批准资产无需重新审稿。
- ACT13→S8→ACT14 提前 focused smoke，避免仅在末端回归才发现无法展示结局。
- 四端结果 occurrence 的共享新表 vs 领域已存事实，按实际 SQL 修改和调用数量比较，别引入第二套结果判断。
- Legacy RPC 安全 Q 在公开冻结前完成；Player/Teacher 真实浏览器 smoke 要贯穿。

## 五、审查评级

**PASS_WITH_REQUIRED_CHANGES（针对 V4 计划）**，并非 PASS_TO_IMPLEMENTATION。

新增的必要文档修改：
1. V4 §14.8/19 改用教师固定的选择性真实行为保留规则；明确 OR、缺失无效、后续真实行为的导出/统计语义。
2. V4 P0/U0/F0 增加早期 IDA-001~005 的五项明确负例与 Teacher 运行一致性 smoke。
3. V4 F9/F0/F1 将响应式布局、Pocket 实际图片、Teacher 同一 runtime 的 3 个页面、五格密码、轮询草稿/展开、身份栏、两秒过场等从“其他 UI”提升为具体可验收事项。
4. CA-170 其他函数级限制继续有效，若与最新教师固定决策冲突则以新决策为准。
5. 两条发布通道独立验收；诊断 H-pre 不等待 13 TOP 完工。

任何代码、迁移、发布、资产变动仍处 HOLD。
