# Round-1 Remediation Workload Estimate V2.0

Date: 2026-10-05  
Purpose: re-estimate **remaining** Round-1 remediation workload after Teacher approval of the new full-width Player/Teacher UI layouts and GA's architecture-impact review.  
Comparison baseline: `docs/plans/ROUND1_REMEDIATION_WORKLOAD_ESTIMATE_V1.0.md`

Additional basis:
- `docs/plans/ROUND1_UI_LAYOUT_ARCHITECTURE_IMPACT_REVIEW_V1.0.md`
- current `index.html`, `teacher.html`
- current `src/game/app.js`, `src/teacher/teacher-console.js`, `src/styles/app.css`
- current E0/E1/manual-smoke browser harnesses
- `agent-comms/CD_to_GA_20261004T145436Z_wpr4a-image-runtime-closure-pass.md`

## 1. Scale and interpretation

Workload scale:
- 5 = very large / very high workload
- 4 = large / high
- 3 = medium
- 2 = small
- 1 = very small
- 0 = implementation work effectively closed; only ordinary regression evidence remains elsewhere

Important:
- These are **planning ratings, not additive linear units**.
- V2.0 estimates **remaining work from now**, not total historical effort already spent.
- CA's new V2.0 estimate is **pending independent review**. The table retains V1.0 CA/GA numbers as the comparison baseline and adds GA's revised estimate.
- "新增风险" means risk newly introduced or materially amplified by the approved V4 layout compared with V1.0.

## 2. Revised concrete-work table

| 工作序号 | 工作名 | V1.0 CA | V1.0 GA | GA V2.0 剩余工作量 | 与 V1.0 的工作量变化 | 对比 V1.0 新增的风险（及理由） |
|---|---|---:|---:|---:|---|---|
| W01 | Teacher-paced Discussion lifecycle（generic + Sprint5 + Sprint6） | 3.5/5 | 3.5/5 | **3.5/5** | **基本不变** | **中** — 新 layout 把 Discussion 提升为稳定大区域，但 generic/Sprint5 与 Sprint6 目前走不同 renderer path。若视觉统一与 pacing semantics 同时改，容易把“UI adapter 问题”和“deadline/authority 问题”混在一起。应保持：W01 只改 pacing/authority；视觉挂载归 W02。 |
| W02 | Responsive Player shell / stable scene-action-discussion-Pocket regions | 3/5 | 3/5 | **4/5** | **↑ 明显增加（约 +1）** | **高** — 现在不是普通 responsive CSS，而是 full-viewport shared-shell 重组；必须保留现有 DOM IDs/test selectors；要容纳 generic/Sprint5/Sprint6 不同 render path；Scene、Action、Discussion、Pocket 从动态纵向流变成稳定区域。若直接替换 prototype HTML，会破坏 `app.js` module-load bindings。 |
| W03 | GRAB → authoritative automatic leave + cinematic presentation | 3/5 | 2.5–3/5 | **2.5–3/5** | **基本不变** | **中** — 新增 generic scene-transition overlay 后，GRAB 的 authoritative leave、GRAB 自身 cinematic、全局 2 秒 scene transition 可能出现重复/遮挡/错误触发。工作量不单独上调，前提是 W12 提供通用 transition presentation 层。 |
| W04 | Generic Pocket / evidence image renderer | 3/5 | 3/5 | **3.5/5** | **↑ 小幅增加（约 +0.5）** | **高** — V1.0 主要是 item/view → asset/text/flip/share renderer；现在 Pocket 还必须迁移到稳定 mount，而当前 `pocketEvidencePanel(...)` 被注入动态 story HTML。需要保留 inspect/share/flip RPC authority、reconnect state、front/back/open view，同时避免 story 与 Pocket 双重渲染。 |
| W05 | Canonical Teacher operational-location projection | 2.5–3/5 | 2.5–3/5 | **2.5–3/5** | **基本不变** | **低–中** — backend projection 本身未因 layout 变复杂，但新 Teacher Live Operations 会更突出地显示 current location；错误 projection 将更直接误导主持。主要新增的是 integration regression，而不是新算法工作。 |
| W06 | Teacher Console panel recomposition + Emergency/Recovery + Maintenance/Developer internal views | 2.5/5 | 2.5/5 | **3.5/5** | **↑ 明显增加（约 +1）** | **高** — V1.0 只要求 panel recomposition；现在 Teacher 已批准 main + 两个子 view。当前 `teacher-console.js` 在 module load 时绑定大量 controls/event listeners，且 production 仍需要 pre-run room setup。三个视图应留在同一个 Teacher runtime；若拆成独立页面或移除绑定节点，容易 null-bind、丢 Teacher token/room state/polling。 |
| W07 | Asset publication / ACTIVE / runtime readiness gate | 2.5/5 | 2.5/5 | **0/5 remaining implementation** | **↓ 已完成** | **低（本项）/ 中（转移到回归）** — CD 已报告 22/22 ACTIVE、resolve、HTTP、checksum、anchors runtime closure PASS。新的 full-width layout 仍可能暴露 anchor/letterbox/browser-visible 问题，但这不应重新算回 W07；应在 W13 的新 frontend regression 中验证。 |
| W08 | Five-slot Library lock UI | 2/5 | 2/5 | **2/5** | **基本不变** | **低–中** — server locked-prefix logic 不变，但 widget 现在必须稳定落在新的 Action region，并在不同 viewport 下保持五 slot 清晰可操作。主要是 layout integration，不增加 server complexity。 |
| W09 | Preserve Pocket / Teacher detail expansion state | 1.5–2/5 | 1.5–2/5 | **2/5** | **↑ 轻微** | **中** — 除原 1.2s polling / innerHTML rerender 外，现在 Teacher 还有 internal-view navigation，Pocket 也移动到稳定 mount。展开/折叠、当前选中 item/view、返回主 Teacher view 后的状态更容易被刷新丢失。 |
| W10 | Central Player identity/runtime header | 1.5/5 | 1.5/5 | **1.5/5** | **基本不变** | **中** — full-width responsive header 使 identity/status 成为固定主区域；reconnect 后 blank `#playerLabel` 或 stale join copy 会更显眼。仍属局部前端修复，但必须保持 pre-run / in-run / reconnect 三种状态一致。 |
| W11 | Low-risk UI/text cleanup | 1/5 | 1/5 | **1/5** | **基本不变** | **低** — 主要风险是双语文本、label cleanup 若被 browser tests 用 visible text 定位可能造成脆弱测试；优先保留 ID/semantic selectors，可把风险维持很低。 |
| W12 | **NEW — Generic 2-second Scene Transition presentation layer** | — | — | **2/5** | **新增工作** | **中–高** — 必须只在真实 authoritative scene/location change 时触发一次：不能把 phase refresh 当 scene change，不能因 polling 重复显示，不能通过 browser navigation/reload 实现，也不能与 ACT12 cinematic/blackout、GRAB cinematic 相互覆盖。 |
| W13 | **NEW — Integrated frontend regression + new frozen baseline / acceptance reset** | — | — | **3.5/5** | **新增工作** | **高（验证/流程风险）** — V1.0 的 E1/CA Level2/manual-acceptance browser-visible evidence针对旧 frontend。新 layout 改 root DOM composition、Discussion、Pocket placement、Teacher views、image dimensions，因此必须重跑 E1-equivalent browser regression，增加 1920×1080 / 1366×768 / ~900px responsive checks、anchor alignment、Teacher subview navigation、transition-once timing，并冻结新的 integrated SHA。Manual Acceptance V0.2 不能作为新 build 的当前 acceptance；需 successor plan。 |

## 3. Main workload shifts

### 3.1 Largest increases

**W02 Player shell: 3 → 4/5**

Reason:
- full-browser-width responsive layout;
- stable Scene / Action / Discussion / Pocket regions;
- preservation of current DOM/test contracts;
- different discussion/render paths must project into one visual shell;
- ACT1–14 frontend regression becomes more important.

This is now the single largest **frontend implementation** item.

**W06 Teacher Console: 2.5 → 3.5/5**

Reason:
- Teacher approved three logical views, not only a panel rearrangement;
- production still needs pre-run room setup;
- existing JS assumes many controls exist simultaneously;
- safest design is internal view switching inside one `teacher.html`, preserving state/polling/IDs.

**W04 Pocket renderer: 3 → 3.5/5**

Reason:
- image/text/front-back binding remains;
- in addition, Pocket must move from dynamic story injection to a stable shell mount without changing backend authority.

### 3.2 New work created by the layout decision

**W12 — Scene Transition layer: 2/5**

This is a genuinely new presentation behavior, not present in V1.0.

**W13 — Integrated frontend regression / new acceptance baseline: 3.5/5**

This is the largest new **verification/process** cost. It is required because previous browser-visible evidence does not automatically cover a materially changed root UI.

### 3.3 Work that did not materially grow

W01, W03, W05, W08, W10 and W11 remain roughly the same workload if architecture boundaries are respected.

Their **integration risk** increases in some cases, but that should not be double-counted as implementation workload.

### 3.4 Work that fell

**W07 falls from 2.5/5 to effectively 0 remaining implementation** because WP-R4A runtime closure is now reported PASS.

Any new visual/anchor issue exposed by the responsive layout belongs to W13 regression or to the relevant renderer task, not back to asset publication.

## 4. Revised risk center

V1.0's main engineering center was:

`Teacher-paced semantics + Player shell + Pocket renderer + remaining asset closure`

After the V4 layout decision and WP-R4A completion, the center shifts to:

`Player shared-shell integration + Teacher same-runtime view composition + Pocket stable mount + cross-ACT frontend regression`

This is a significant change in **where** the risk lives, even though it does not require rewriting the database/game engine.

## 5. Consequence for sequencing

Recommended sequence for discussion with CA before further CD direction:

1. Freeze the five Teacher-approved V4 visual targets.
2. Agree GA/CA architecture boundary:
   - one Player runtime;
   - one Teacher runtime;
   - prototypes are visual contracts, not replacement applications;
   - stable DOM IDs/test contracts preserved where possible.
3. Agree the revised workload/risk split in this V2.0.
4. Only after GA/CA agreement, ask CD for a bounded implementation/change-impact plan.
5. Implement UI shell work.
6. Continue remaining semantic remediation.
7. Run W13 integrated frontend/E1-equivalent regression on one integrated commit.
8. Freeze a new baseline.
9. CA targeted closure for changed surfaces.
10. Revised human acceptance, then E2.

## 6. Items still not estimated

`Failed to fetch` remains unestimated because root cause is still not established.

## 7. GA planning conclusion

The approved layout does **not** invalidate the existing backend architecture, but it materially increases the frontend integration and verification burden.

GA's main changes from V1.0 are therefore:

- W02: **3 → 4**
- W04: **3 → 3.5**
- W06: **2.5 → 3.5**
- W09: **1.5–2 → 2**
- W07: **2.5 → 0 remaining**
- new W12: **2**
- new W13: **3.5**

CA independent re-rating is requested before this becomes the final shared estimate.
