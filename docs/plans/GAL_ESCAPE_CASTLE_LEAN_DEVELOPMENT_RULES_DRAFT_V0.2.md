# GAL Escape Castle — 提高开发效率，简化繁复流程规则 V0.2（Teacher 待批准）

Date: 2026-11-23
Author: CA, on Teacher request, after separate CD/GA critical reviews
Status: **DRAFT — NOT ACTIVE UNTIL TEACHER APPROVAL**
Inputs:
- `docs/plans/GAL_ESCAPE_CASTLE_LEAN_DEVELOPMENT_RULES_DRAFT_V0.1.md`
- `agent-comms/CD_to_CA_20261123T_lean-development-v01-critical-review.md` (AMEND)
- `agent-comms/GA_to_CA_20261123T090600Z_lean-development-v01-critical-review.md` (AMEND)
- `docs/plans/DEBUG_V4_TRIAL_FIRST_AUDIT_PROCESS_V1.0.md` (currently active)

## 1. 教学目的和规模

游戏不是商业产品；每局只有 **Teacher 一人 + 三名匿名 GAL Players（Anna、Gitte、Linda）**。无真实个人隐私收集，不按大型公开服务的负载、通用法规、安全体系进行额外工程化。游戏通过互联网可访问这一技术事实不改变**课堂四人**的实际设计目标。

唯一优先目标：**尽快让四人玩通 ACT1–ACT14，看到完整、正确的获批中荷 Runtime、图片与 Action，投票/状态/换局正确，可简单恢复。** 交付以真实玩家可见、可玩判断，不以内建模块 PASS、文档完备或测试数量判断。

最低限度保留：角色私有线索不串角色（玩法公平）、服务器权威的三人推进、历史数据不误删、可恢复的前一版本、生产 DB/Storage/ACTIVE/Pages 写入必须具备有效明确授权和来源权威性；无授权时 STOP。匿名不等于取消游戏角色隔离。

## 2. 不做无意义工作

任何新提案，只问：**不做是否现实地阻止教学试玩、获批内容正确呈现、基本恢复、或者明确生产权限？** 若否，则不进关键路径；P2 保留 backlog。已见浏览器 P0 **或源码能够无歧义证明正常可达的高影响失败**，可直接修，不能强制等待真人复现。不得以推测性安全、完整证据链、架构洁癖阻断试玩。

停止试玩/源码修复的条件：实际或明确可达的 P0、严重数据损坏、关键角色私有线索错误暴露、无法恢复。生产发布另有不可豁免 STOP：缺少当前有效生产权限、对应正式文案/批准图来源不明、不可用恢复方案、真实不可接受的生产漂移。不得混淆“暂不阻断诊断试玩”与“可以无授权写生产”。

## 3. 一次交付的开发方式

每轮以 Teacher 实测缺陷列表为**一个完整的功能包**；优先 P0 → 批准文案与图片 → P1 → P2 后置。CD 自主连续完成可确定的源码、绑定和已有自动测试，直至一个玩家可见的候选包，不因 routine 子阶段等 CA 指令。使用 **smallest correct change**：优先现有事件 handler、resolver、renderer、状态；禁止无必要新数据库字段/迁移、状态机、框架或通用恢复系统。

GA 一次提交已批准 216 页面出现位置（不是 216 独立 keys）的 CN/NL 原文与准确 key/scene/role 映射。132 单 key 候选、80 composed 页面、3 ACT14 locked、1 device removal 需按语义处理；用已有 renderer 组合，不粗暴合并，不改获批句子。少量真的不能确定的 key/phase 用一份简短异常表交给 GA；不得因此冻结无关工作。ACT6 first/return voice 和 phone text、ACT9 red-first retry、ACT10、ACT11、ACT14 等实际关键分支仍需正确。

VA 对正式获批图片只核对准确字节/sidecar 与素材来源；CD 不加工像素，不自行改叠字。已有 approved 图片按一批集成，保证 ACT3 线索、ACT4/5 小门、ACT9 门、ACT11 主门等使用**正确** Scene/Pocket 和权威触发。仍未解决的 Linda watch 原件问题可独立列缺项，是否从上线包排除仅 Teacher 决定；缺图则诚实保留原图，不宣称已更新。

## 4. 测试预算 — 现有工具优先

一份完整包默认：
1. 现有语法/静态检查；
2. 一次有代表性的三玩家/Teacher 主流程，尽可能跑 ACT1–14；
3. 与改动有关的一个关键相反分支或失败／重连场景（若影响多个实质不同的剧情分支，则覆盖受影响分支，不测试无关组合）；
4. 在真实浏览器检查**每个修改过的** Scene / Runtime / Action 的可见结果，能截图即截图；不存在获准的真实环境就明确记 `NOT_RUN`，不可冒称 PASS。

在**最接近的现有测试**补断言。不得为普通修图、文案、按钮单独创建新的 SQL/Playwright suites 或工作流；只有已有测试无法检测明确 P0 或不可逆发布故障时，才可新增。完整历史 migration replay 仅在实际变更迁移语义或合并发布有具体必要时运行，不能以一次图像映射为由默认重复。已有低成本自动 CI 可以沿用，其 PASS 不生成独立审计任务。

## 5. 一包一审一批发布

常规工作包最多：**一封 CA→CD 明确需求信、CD→CA 一封完整成果信、CA 一次审核结论、一次所需 Teacher 生产授权决策**；CD 自测过程保留在 commits/tests，不另写每个来源、资产、浏览器及发布准备阶段的独立报告。除非发现具体真实重大 blocker，CA 不得创建下一轮泛化审计或新 gate；一次审核最多提出三项必要修正，其余 backlog。

正式生产发布仍在**实际上线前**一次性核对：本批真实资源原件/上传哈希、当前生产基础状态、一次最小的全量受影响 Registry apply/recovery 方案、前一 Pages 可恢复版本和明确授权。不要在每次 source/mock/rehearsal 交接重复封存全部 hash/projection。已有版本化资源和 Asset Manager 机制可继续使用，不为每张图设计独立发布计划。

发布后执行最小端到端 smoke：Join、Start、关键投票/推进、修改过的 Runtime/Scene/Action、Reconnect、Switch Session/Prepare Next Run，并分清哪些路径未测。禁止把源码 PASS 说成已部署，或把局部图片 PASS 说成已完成 Teacher 全部报告。

## 6. 最小通信与保留现有责任

一份包只更新一个简要结果：已修 Teacher 可见问题／未修具体问题／已测与 NOT_RUN／目前真正部署状态／下一负责人。按现行 Agent 协议保留 UTC 时间、必要 ownership、Append-only Action Log；不为每个子阶段单独写提案或 FYI。

先前 CA audit Level-3、CD–ISA T1–T9、周期性 checkpoint 等**不能自动因教学试玩或普通 CD-only 修改触发**；只有实际跨层重大风险、真实 ISA 子任务或重大状态变更才采用相应部分。若此条与当前上位强制协议冲突，需在正式批准后修订具体条款，而不是未经授权悄悄跳过。不得产生新的 Dashboard/指标维护；Teacher 请求复盘时由既有 Git/Action Log 计算。

## 7. 立即适用的唯一剩余任务包：CA-338

- CD 在一个候选包中集成已修的旧结尾 replay/Session、已批准并可用的 8 张图片和其他确定的映射；
- GA 一次完成三角色获批 Runtime 正式 CN/NL key/bundle；CD 完整展示并做角色/时机验证；
- VA 仅解决 Linda watch v002 原件字节不一致；未解决时清楚标记，不修改图片；
- CD 展示本轮 Teacher 实测报告的问题解决对照表，不把部分 PASS 当完成；
- CA 一次审计整体候选并请求**一次具体生产授权**；获批准后合并发布并测试；个别非 P0 项阻塞时，由 Teacher 决定是否允许显式缺项的诊断试玩。

## 8. 与旧规则的优先关系（避免再多一套流程）

本规则一旦获 Teacher 批准，作为 `DEBUG_V4_TRIAL_FIRST_AUDIT_PROCESS_V1.0.md` 的**单一可操作效率补充／特定冲突优先条款**：在 CA-338 及后续同类教学修复的任务打包、文档、测试、子阶段审批和交接上，以本规则为准；不要求执行两套重复检查。原 Trial-First 的 P0/P1/P2 和生产安全底线继续有效；具体受保护写入、作者权威、Agent Action Log 强制事项优先于本草案，直到经合法权限正式修订相关条款。不得以本文件自动增加一次独立 review。

**Only becomes ACTIVE after explicit Teacher approval.** Discussions alone cannot change permissions, rules or production.
