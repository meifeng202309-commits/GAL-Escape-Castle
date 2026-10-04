# Round-1 Remediation Workload Estimate V1.0

Date: 2026-10-04  
Purpose: retained reference for Round-1 manual-acceptance remediation planning.  
Basis:
- `agent-comms/CA_to_GA_20261004T193000Z_teacher-paced-difficulty-reassessment.md`
- `agent-comms/CA_to_GA_20261004T200000Z_revised-workload-after-asset-scope-clarification.md`
- `agent-comms/GA_to_CA_20261004T203000Z_round1-workload-reconciliation.md`

Workload scale:
- 5 = very large / very high workload
- 4 = large / high
- 3 = medium
- 2 = small
- 1 = very small

Agreement rule:
- **Y** = CA and GA are materially aligned; ranges overlap without a meaningful planning disagreement.
- **N** = there is still a meaningful difference in workload estimate.

| 工作序号 | 工作名 | 工作内容解释 | CA 对工作量的预估 | GA 对工作量的预估 | GA/CA 是否一致 |
|---|---|---|---:|---:|:---:|
| W01 | Teacher-paced Discussion lifecycle（generic + Sprint5 + Sprint6） | Normal classroom mode 取消 hard input deadline；discussion 由 Teacher 主动结束/开启 vote；vote 一直开放到三人提交或合法 recovery；统一 generic DiscussionRoom、Sprint5、Sprint6 的 pacing semantics，同时保留 timestamps / latency。 | 3.5/5 | 3.5/5 | Y |
| W02 | Responsive Player shell | 重构 Player 页面为稳定的 scene / action / Pocket / identity 区域；desktop 使用稳定布局，mobile 有明确 collapse 顺序；现有 authoritative RPC/state contract 不重写；需要 ACT1–14 visual regression。 | 3/5 | 3/5 | Y |
| W03 | GRAB → authoritative automatic leave + cinematic presentation | 修正 GRAB 后的 canonical transition：GRAB 完成后 server-authoritative 地离开起始房间，再显示 cinematic message；可保留 CONTINUE 作为 pacing/skip，但不能让按钮承担 `player_left_start_room` authority。 | 3/5 | 2.5–3/5 | N |
| W04 | Generic Pocket / evidence image renderer | 建立统一 `item_key + current_view -> asset_key + text + flip/share` renderer，使 Castle Map、Number Note、Diary、Watch 等真实显示对应 asset，并支持 front/back/open view 与 inspect/reconnect。 | 3/5 | 3/5 | Y |
| W05 | Canonical Teacher operational-location projection | 修复 Teacher Live Operations 使用 ACT1–5 旧 `player_location` 导致后期场景 location 漂移的问题；建立一个按当前 authoritative runtime/scene 推导 operational location 的统一 projection。 | 2.5–3/5 | 2.5–3/5 | Y |
| W06 | Teacher Console panel recomposition | 重组 Teacher Console 信息架构：Live Operations / Run Control 为主；Discussion control + observation 合并；Emergency/Recovery 与 Maintenance/Developer 分离；去掉 competing room-state monitor 与无关开发标签。 | 2.5/5 | 2.5/5 | Y |
| W07 | Asset publication / ACTIVE / readiness gate | 在 VA 22/22 final visual baseline 后完成 runtime publish、唯一 ACTIVE、`asset_resolve`、HTTP load、required anchors 与 machine-enforced readiness gate；renderer binding 不在此项重复计算。 | 2.5/5 | 2.5/5 | Y |
| W08 | Five-slot Library lock UI | 将目前的 locked prefix + ambiguous input 改为清晰的五位 slot/wheel UI：已锁定数字固定，剩余位置可输入，并提供明确的 Submit Code action；复用现有 server-authoritative lock/fallback logic。 | 2/5 | 2/5 | Y |
| W09 | Preserve Pocket / Teacher detail expansion state | 修复 1.2s polling / innerHTML rerender 造成 `<details>` 展开状态丢失或被强制展开的问题；expanded/collapsed 属于 client-owned ephemeral UI state，不写 gameplay DB。 | 1.5–2/5 | 1.5–2/5 | Y |
| W10 | Central Player identity/runtime header | 建立统一 runtime header，例如 `I am ANNA` + current ACT/status；formal run 后隐藏 stale landing/join copy，避免 reconnect 后 identity/header 空白或仍显示 `Waiting for formal run`。 | 1.5/5 | 1.5/5 | Y |
| W11 | Low-risk UI/text cleanup | Universal-value dedupe（如 41739 / ★ 只显示一次）；移除 Sprint jargon / developer wording；调整 Start formal run 位置与普通 label 文案。 | 1/5 | 1/5 | Y |

## Interpretation notes

1. **W03 is the only remaining numerical mismatch.**  
   CA gives 3/5; GA gives 2.5–3/5. The difference is small, but this table marks it **N** because the numerical estimate is not identical. GA additionally separates **workload** from **semantic/regression risk**: W03 workload is 2.5–3/5, while its semantic/regression risk is about 3.5/5.

2. **WP-R4 / asset work was revised downward.**  
   Earlier estimates treated the entire visual pipeline as unresolved. Current evidence shows 22/22 image production is closed for VA purposes and the publication/ACTIVE/resolver/storage infrastructure already exists. Remaining W07 is therefore integration + gating work, not a new asset platform.

3. **Normal-mode ACT7 Add-Time reopening is no longer a separate production task.**  
   Teacher adopted Teacher-paced normal classroom interaction, so the old normal-mode hard-timeout recovery path is superseded for the next classroom release. Timed/AUDIT parity may remain non-blocking technical debt unless separately authorized.

4. **Broad unified ACT ViewModel rewrite is out of scope.**  
   Current evidence supports bounded contract repairs rather than a full renderer/runtime rewrite.

5. **`Failed to fetch` remains unestimated.**  
   Root cause is not established; no development workload is assigned until reproduced.
