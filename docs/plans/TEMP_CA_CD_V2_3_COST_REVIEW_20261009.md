# CA 临时评审一：CD Debug Plan V2.3（成本优先修订）

日期：2026-10-09。内部工作文件；不通知 Agent；无实施授权。

来源：docs/plans/PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V2.3_BY_CD.md；原 CA V2.2 review；教师明确游戏正常最长约两小时。

## 综合结论：CONDITIONAL PASS_TO_PLAN

V2.3 已补回 V2.2 缺失的 Player/Teacher polling、W05、遗留 RPC 隔离、W01–W13 对应关系、完整回归/版本冻结。此前“八项不能代替完整 Debug”批评已获解决，不应继续重复。CD 按实际模块做最小修复，Observer 不自行判断游戏的方向正确。

## 两个曾被 CA 高估的风险

**Discussion：**在两小时以内的课堂，10800 秒后自动推进的理论风险不足以推动大规模生命周期重写。旧 database/002_runtime_runs_discussion.sql 中参数上限 3600 秒却是真正实施阻碍；必须小范围修改有效 constructor 的 NORMAL 条件，核对 S5/S6 所有新建和重开函数。S6 新 Teacher Continue 是真实缺口，必须完成身份、当前互动、幂等及按钮。对三小时以后的行为记录为接受的限制，不应阻止现实运行。

**TOP：**用户要求最小必要信息与 OR 来源，并非完整重建历史。单 Override 记录和 OR JSON 可以；无需逐字段血缘图。但 OR 标记必须真正让分析/导出排除系统补齐的行为事实。最大的难点在于目标 ACT 初始化及第一项动作能否正常执行，而不是 JSON 格式。CD 的全部 13 TOP 成本 3–4/5 仍待 T0 边界函数依赖及样本跳转验证；先做只读技术表，按实际难度确定分批实现。完整 TOP 不应阻断正常路线首次验收。

## 对 V2.3 的两项实质挑战

1. F 正常路线 hard blocker 排得偏晚。如果 GRAB+leave、正式启动、下一步交互存在已复现阻塞，应在 Player polling 基线稳定后优先修，而非等待完整四端结果动画。
2. G 完整验收排在 TOP 之后，存在将复杂紧急恢复系统作为正常路线前置的风险。分开普通 ACT1–14 功能验收、已上线恢复点验收及全 TOP 扩展验收。

## 保留的高优先事项

A1 Player polling（重叠/旧响应/网络失败误判）；W05 Teacher 可靠观测；U0 formal start；W03 authoritative GRAB+leave；三小时 Discussion 中 S6 教师推进；ACT3 冷却；ACT7 wrong majority；三玩家+教师真实贯通。Q 旧 RPC 权限在正式真人运行前验证。H 共享 context 只有数据证明节省成本才实施。

成本准则：真实两小时内的故障概率 × 后果 × 最小修复/验证量，而非理论最坏情形。静态审阅不等于部署 PASS。保留 CD HOLD。
