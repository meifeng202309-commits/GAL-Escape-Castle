# 2026-11-17 真人试跑中止 — Runtime 文案与 VA 图片核查

记录时间 2026-11-17T05:01:28Z。Teacher 中止本轮真人试跑，报告 Runtime 大量内容未更新且感觉更短，以及绝大多数图片未更新。核查基线为本轮 Player Pages `8a1fd0b7fb91dd30bbcb34e3ddeb05af86c3219e`，对照上轮部署 `6e08aeacef397ea2b6c5020f8c594c5181a2d854`、CA-335 生产回执、GA-146 批准稿与 VA 交接。以下是源码及发布记录核查，未在真人房间复现后续各 ACT。

## Runtime

- **R1 — 整体批准稿未完成落地。** GA 交付 Anna、Gitte、Linda 各 72 条中荷稿，CD 已建 216 行映射，含条件分支和共享重复行。对两个部署版本的 `LOCALIZATION_CATALOG` 对象做逐键比较，只有 5 个已有条目变化（`act01-g.001`、`act01-a.014`、`act03.008`、`act03.016`、`act09.022`）和 3 个新增（`act01-a.014b`、`runtime.castle_voice.first_audible`、`runtime.castle_voice.returning`），没有删除条目。这只统计文案包，实际可见内容还取决于调用及界面位置。不能由此次比较推出删掉更多 Runtime；下列实例证明上线页比批准稿短。
- **R2 — ACT1 GITTE-002（查看地图）。** 已部署 `act01-g.023/024` 显示图书馆的连通路线和大厅附近的铁门，缺批准稿的“地图没有告诉你西塔为什么被封闭”。迁移 077 的 `study_map` 输出仍只引用这两条旧内容。
- **R3 — ACT1 ANNA-002（打开日记）。** `read_diary` 仍仅引用 `act01-a.010`，显示日记内两句线索。批准稿还包含打开桌上旧仆人日记的动作和记住线索的句子。分别核对 Runtime 叙事及 Action 的归属，保留剧情所需信息。
- **R4 — ACT2 GITTE/ANNA-006（手机恢复弱信号）。** 已部署 `act02.002` 仍为 “SIGNAAL ONSTABIEL / 信号不稳定”。批准稿该页描述微弱而不稳定的信号，并引导联络两位伙伴。核对叙事句和 Action 引导在实际界面的归属。
- **R5 — 已上线的局部项。** Anna 查手机的替换、Gitte 首次声音、ACT2 主门失败三键、ACT3 发现流程、ACT6 声音确认、ACT9 重投提示有具体实现或发布证据。应逐条验证实际表面、角色及触发；未对未走到的分支宣称通过。旧结尾重播及 Chrome Join 首次失败另见 CA-337。

## VA 已批准批次

VA 12 项主记录是审批和素材清单，较新的 CD 记录证明剩余 10 WebP + 10 sidecar 已进入专用 staging 分支 `codex/va-image-staging-20261114`（`e1fdccfa921aad403a95278bba213763e888b875`）。本轮生产回执仅记录 ACT9 两张变体启用。另九项在已核查的登记表和调用中没有切换到本批次的目标版本；第十二项 blue-first 在 Teacher 后续批准的红门先开方案中保持不接入。

| VA 图 | 上线状态或源码证据 |
|---|---|
| Linda 怀表背面 v002 | `prop_linda_watch_back` 仍为 v001 |
| Gitte 古堡地图 v002 | `prop_gitte_castle_map` 仍为 v001；MASTER-03 参考图的更新不等于游戏地图切换 |
| Linda 公告 v002 | `prop_linda_closure_order` 仍为 v001 |
| Gitte 数字纸条正面 v002 | `prop_gitte_number_note_front` 仍为 v001 |
| Gitte 数字纸条背面 v002 | `prop_gitte_number_note_back` 仍为 v001 |
| Anna 日记 v002 | `prop_anna_diary_open` 仍为 v001 |
| 图书馆小门半开 | 没有变体运行时绑定；Player 使用 `shared.library`，对照画面使用 `library_unknown_door` 的 ★ 标记 |
| 箱中碎纸条 v002 | ACT3 发现画面及 Group Pocket 已调用 `prop.library_clock_clue_note`，登记仍为 v001；源码含 `act03.016` 文本，切换后按 VA 交接核对是否重复 |
| 主门 A/B/C v003 | `shared.main_gate` 仍为 v002，Player 仍创建站位标签；新版需分别查角色标识、可操作控件及重复叠字 |
| 大厅红门先开 v001、红蓝两门都开 v001 | 生产回执确认两张已激活；Player 按服务端门状态选择 |
| 大厅蓝门先开 | Teacher 后续确认为红门先开规则，本轮不接入 |

## 项目缺口

CA-336 验收只覆盖 CA-335 的发布清单。现有记录缺少一张把 Teacher 已批准的完整文本和图片逐项连到实际 Player 界面及生产发布状态的清单。关闭局部发布时，我没有把此范围差异和剩余漏项明确告诉 Teacher，导致真人试跑才暴露这批工作尚未完成。应沿用现有 216 行映射和 VA 清单补齐状态及证据。优先验证随正常全流程必经和阻断试跑的项，保留此前明确暂缓项。
