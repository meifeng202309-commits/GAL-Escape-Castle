# GAL Escape Castle — 新电脑 Agent 临时接手 Prompts

> 用法：把对应段落完整复制到新电脑上的对应 Agent 聊天中。  
> 这些 prompts **不重复 onboarding training 已经包含的项目规则、角色边界、canonical 文件清单、通信规则或 Action Log 规则**。  
> 每个新 Agent 都必须先从仓库根目录 `README.md` 开始，并以 onboarding 后重新读取到的 repository 当前状态为准。  
> 本文件只补充“这次迁移本身”以及各角色目前最需要接上的工作。

---

## 1. GA — Game Design and Planning Agent

```text
你现在临时接手 GAL Escape Castle 项目的 GA — Game Design and Planning Agent。

原电脑上的 GA 聊天暂时停止执行；本聊天作为当前 GA 执行窗口。

请先从 repository 根目录：

README.md

开始，严格完成其中指向的完整 onboarding / cold-start 流程。不要把这段 prompt 当成 onboarding 的替代，也不要要求我重新解释 onboarding 已经提供的信息。

完成 onboarding 后，再处理下面这次迁移特有的交接事项：

- 截至迁移前最后一次 GA 记录，尚无已知未解决的 GA-owned canonical decision。
- 你的第一件事是检查 GA-029 之后是否出现新的、明确发给 GA 的 handoff / clarification request。
- 如果存在，按最新 repository 状态直接接手。
- 如果不存在，不要自行创造新的设计任务；保持可用，等待 Teacher trial、Sprint9 final-media integration 或其他 Agent 提出的真实 canonical/gameplay clarification。

完成接手检查后，简短报告：
1. 你确认到的最新 GA Action ID；
2. 是否存在新的 GA-targeted action；
3. 如果存在，你准备立即执行什么；如果不存在，明确说明当前无 GA action。
```

---

## 2. CA — Coding Audit Agent

```text
你现在临时接手 GAL Escape Castle 项目的 CA — Coding Audit Agent。

原电脑上的 CA 聊天暂时停止执行；本聊天作为当前 CA 执行窗口。

请先从 repository 根目录：

README.md

开始，严格完成其中指向的完整 onboarding / cold-start 流程。不要重复要求我提供 onboarding 已经包含的信息。

本次迁移需要你特别接上的当前工作状态：

- 最新已知 CA 工作已经到 CA-130。
- CA-130 已完成 placeholder-first trial runtime 的最后一次 narrow audit，并释放 repeated Teacher trial runs。
- 截至迁移前，没有已知新的 CA audit request 已经进入队列。

完成 onboarding 后，你的第一件事是检查 CA-130 之后是否出现新的、明确需要 CA 处理的 audit / gate / cooperation handoff。

如果有，直接继续该项工作。
如果没有，不要制造新的 audit；等待新的真实 trigger。下一类可能出现的 trigger 是：
- Teacher trial 中发现的 concrete runtime defect 修复后送审；
- Sprint9 final integrated asset baseline 的正式 audit request。

完成接手检查后，只需报告最新 CA Action ID、是否有新 trigger，以及下一步。
```

---

## 3. CD — Code Development Agent

```text
你现在临时接手 GAL Escape Castle 项目的 CD — Code Development Agent。

原电脑上的 CD 聊天暂时停止执行；本聊天作为当前 CD 执行窗口。

请先从 repository 根目录：

README.md

开始，严格完成完整 onboarding / cold-start。不要让我重新讲解 onboarding 已经覆盖的项目规则。

完成 onboarding 后，优先核对并接上以下两个迁移时仍然有效的最新 VA→CD handoff：

1.
agent-comms/VA_to_CD_20260926T010649Z_legacy-seven-webps-reachable-replacement-handoff.md

2.
agent-comms/VA_to_CD_20260926T011000Z_main-gate-v002-exact-source-handoff.md

当前最直接的 implementation work 是：

- 接收七个已经变成 Git-reachable 的 legacy WebP，按其既有 review state 完成 canonical staging / sidecar / registry / validator 工作；其中五个已经 APPROVED，不要重复送 Teacher review，两个仍是 PENDING_REVIEW。
- 使用第二封 handoff 指定的 exact Teacher-approved Main Gate source 完成 `shared.main_gate` v002 的机械恢复、sidecar / registry 更新和 validator 检查。
- 不要重复做 VA 已经完成的 binary-recovery / source-identification 工作。
- repeated Teacher trial runs 已经可以进行；在 final-media integration 之外，继续处理 trial 中出现的 concrete runtime defects。
- 学生后续才提供的 final images 不应阻塞当前 trial runtime；保持 placeholder-first replacement path 可继续使用。

先检查是否已经有比上述两封更晚的 CD-targeted handoff；如果有，以更新的 repository 状态为准。

完成 takeover 后，直接继续尚未完成的 CD-owned work，不要停在“已收到”。
```

---

## 4. VA — Visual Agent

```text
你现在临时接手 GAL Escape Castle 项目的 VA — Visual Agent。

原电脑上的 VA 聊天暂时停止执行；本聊天作为当前 VA 执行窗口。

请先从 repository 根目录：

README.md

开始，严格完成完整 onboarding / cold-start。不要要求我重复 onboarding 已经提供的 VA workflow 和 authority 信息。

完成 onboarding 后，注意这次迁移时 VA 的最新交接位置：

- VA-012 已把七个 legacy WebP 通过可达 Git tree 正确交给 CD。
- VA-013 已把 exact Teacher-approved Main Gate source 和 v002 repair 参数交给 CD。
- 因此不要重新执行这两项已经 handoff 给 CD 的 staging/integration 工作。

你现在应先检查 VA-013 之后是否有新的 targeted VA message。

若没有新的指令：
- 保持 student-supplied final media 的 placeholder → canonical asset replacement mapping；
- final student-provided media 到达后再按正常 candidate workflow 处理；
- 继续剩余的 VA-owned final visual/audio candidate work，但不要为了 trial runtime 人为赶制假 final media；trial 当前允许 placeholder / safe audio fallback；
- 等 CD 只把真正需要 Teacher review 或需要 VA 再处理的 candidate 返回给你。

请在 takeover 后报告：最新 VA Action ID、当前仍留在 VA 手上的真实 production work，以及是否存在新的 targeted handoff。
```

---

## 5. ISA — Implementation Support Agent

```text
你现在临时接手 GAL Escape Castle 项目的 ISA — Implementation Support Agent。

原电脑上的 ISA 聊天暂时停止执行；本聊天作为当前 ISA 执行窗口。

请先从 repository 根目录：

README.md

开始，严格完成完整 onboarding / cold-start。不要让我重新说明 onboarding 已经覆盖的 ISA cooperation rules。

完成 onboarding 后，接上以下当前工作位置：

- WP-S9-03A asset readiness validator 已经完成并于 ISA-030 handoff 给 CD。
- ISA-031 已处理最新通信协议更新。
- Sprint9 的 Class A standing support envelope 仍然存在，但截至迁移前没有已知新的 concrete ISA task 在 WP-S9-03A 之后被实例化。

你的第一件事是检查 ISA-031 之后是否有新的 CA/CD targeted task。

如果有，直接执行。
如果没有，不要自行发明任务；保持可用，等待 CD/CA 在现有 Sprint9 support envelope 内实例化新的 validator / regression / evidence tooling 工作，尤其是 final-media integration 或 Teacher trial 暴露的新验证需求。

完成 takeover 后只需报告最新 ISA Action ID、是否有新的 concrete task，以及当前状态。
```
