# CA 临时评审二：GA Debug Plan V1.2

日期：2026-10-09。内部分析，不通知 GA/CD，不授权代码。

来源：GA_to_CA_20261009T061300Z_debug-implementation-plan-v12-critical-review-request.md；docs/plans/PROPOSAL_DEBUG_IMPLEMENTATION_PLAN_V1.2_BY_GA.md（Part II §36–59 优先）；对照 CD V2.3。GA-098 已撤回，不作当前指令。

## 总评：有条件认可规划，不认可所有评分及强制顺序

GA 将真实卡关、状态权威、界面替换和验收分离：G1 polling，U0 formal start，W05 教师观测，W03 GRAB+leave，W01 Discussion，L3 Library，R0 Recovery，随后 UI migration，F0/H0 早于 W12，F1 最终验收。W09 并入 UI 包、W10 并入 W02、W07 图像已关闭、G4 共享接口仅成本证实后才建立，均值得接受。

## MATERIAL 挑战

1. **Discussion W01=4/5 或高估。** 该复杂度偏向取消全部超时的旧假设，而教师已认可正常两小时游戏采用 10800 秒兼容窗口。CD V2.3 可局部修改通用创建器 3600 秒上限、S5/S6 创建路径，再增加 S6 教师 Continue。维持较高测试复杂度，不在无证据时要求重写旧自动计时。
2. **TOP 交付范围不能擅自降级。** GA 的 R0-B 全 TOP 可选，与教师要求连续 NEXT_TOP 存在潜在冲突。CD T0 13 边界的只读依赖表先证明实际成本，再由教师决定上线优先级。也不能让全 TOP 阻断正常通关验收。
3. **早期包串行过强。** 在 G1 稳定后，U0 正式启动、W03 GRAB 和 W05 最小观测按实际依赖分别推进；不能等待全部 W05 完成才修已复现 hard blocker。
4. **真人贯通太晚。** GA H0 排在新 Player/Pocket/Teacher 界面之后。建议在旧 UI 修完关键阻断后加入轻量 H-pre 三玩家+教师走通试验，发现下一处 Bug；正式 F0/H0 仍用于新版界面验收。
5. **W04-D 历史归一化需依赖驱动。** 只将当前运行 Pocket/Memories 真正需要的 canonical 数据修复列为显示前置；不为历史回填延迟无关 UI。不允许旧字段 fallback。
6. **旧 RPC 安全包需早收口。** 浏览器可执行的 s1_submit_private_choice 先验证真实调用，再单独做限定 revoke 和负权限测试，在真实公开候选冻结前完成，不等到整个 S0 末尾。
7. **估分需有函数级工量支持。** W01/W05/W02/W06/R0-B 的数字是判断而非测量；必须分开实施难度、验证难度、实际游戏风险和工作优先级。

## MINOR

W12 两秒过场放到 F0/H0 之后合理，但早期试玩也必须提供清晰当前场景和下一步说明，不必等正式动画。

## 建议

保留 GA 大框架和 F0/F1，优先 G1、真实 U0/W03 卡点及 W05，尽早进行旧 UI 贯通测试；采用 CD V2.3 小范围 Discussion 兼容方案；T0 先量化 TOP 依赖，再分期考虑；共享 Context 默认不做。

结论：CONDITIONAL PASS_TO_PLAN with MATERIAL objections。仅供 CA 下轮提炼，不是代码授权或部署验证。
