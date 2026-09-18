# Codex 程序开发说明书 V2.3
## Project: GAL Castle Escape / Skill 3

> **V2.3 specification-repair revision:** resolves Coding Audit Agent (formerly Coding Manager) implementation blockers and ambiguity. V2.1/V2.0 are no longer current source-of-truth files.

> Updated against `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`, the V4.0 visual-asset governance rules, and the latest pushed Sprint 1 completion/validation state.
>
> 核心执行原则：**最小改动、增量开发、保留已验证 Sprint 1 基线。**

---

# 0. 文件地位与阅读顺序

本说明书是 **Codex 的执行入口文件**。

它不替代剧情母文件，也不要求 Codex 重新解释已经冻结的故事。Codex 必须按以下优先级执行：

```text
用户最新明确要求
> `docs/specs/current/Codex程序开发说明书 V2.3.md`
> `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`
> `docs/specs/current/从创意到游戏成品的研发流程V1.0.md`
> 既有已验证代码行为（仅在不与以上规格冲突时保留）
```

母文件：

1. `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`
2. `docs/specs/current/从创意到游戏成品的研发流程V1.0.md`
3. `docs/specs/current/Codex程序开发说明书 V2.3.md`（本文件）

Repository hygiene：
- V4.0 / V2.3 是当前source-of-truth；current specs统一放在 `docs/specs/current/`；
- 旧V3.2/V3.1与V2.1/V2.0应移入 `docs/archive/` 或明确标记 `SUPERSEDED`；
- Codex不得从旧文件名推断current specification。

如果规格之间出现真实冲突：

- 不自行猜测；
- 不用“看起来更合理”的新设计替代已有规则；
- 在开发报告中列为 `SPEC CONFLICT`；
- 等待用户确认。

---

# 1. 当前 Repository 基线：Sprint 1 已验证，不得重做

## 1.1 GitHub 当前状态

V2.3 编写时的已知 repository：

```text
meifeng202309-commits/GAL-Escape-Castle
branch: main
```

已知最新 Sprint 1 acceptance-gap closure commit：

```text
67f20b4  Close Sprint 1 acceptance gaps
```

Sprint 1 Revision Completion Report 已记录：

```text
Sprint 1 status: VERIFIED PASS
Sprint 2 status: NOT STARTED
```

验证范围包括：

- room/session；
- authoritative shared state；
- private-choice lock；
- reveal；
- reconnect；
- player identity 与 display name 分离；
- teacher access protection；
- server-side canonical choice validation；
- join code / double-join / concurrent claim hardening；
- teacher session release recovery；
- GitHub Pages + Supabase live E2E；
- 40 automated live checks；
- actual browser interaction。

## 1.2 最小改动原则

Codex **不得因为 V4.0 剧情升级而重写 Sprint 1**。

### HARD COMPATIBILITY BOUNDARY

已验证的：

```text
s1_rooms
s1_room_state
s1_* RPCs
tests/sprint1-*
```

是：

> **legacy verified prototype baseline**

必须继续保留其tested semantics。

尤其：
- 不修改 `s1_advance_scene()` 去承载ACT 1–14；
- 不让formal runtime依赖prototype `scene >= 2 → completed` 语义；
- 不让新增discussion / route / pocket / run state破坏Sprint 1 regression assumptions。

正式Castle Escape使用新的additive runtime boundary，例如：

```text
game_runs
runtime_scene_state
discussion_sessions
runtime player decisions
pocket / knowledge / route / group-action state
new runtime RPCs
```

表名/RPC名可按现有repository最小改动调整，但**不得重新定义旧 `s1_*` 的验证语义**。

必须保留已经 live-verified 的：

- room creation / watch；
- player join；
- player session token；
- private choice single-submit lock；
- reveal；
- reconnect；
- server authoritative state；
- teacher token prototype；
- `s1_release_player_session`；
- existing Sprint 1 RLS / RPC behavior；
- existing GitHub Pages + Supabase deployment path。

除非新功能确实无法兼容，否则：

> **extend, do not replace**

尤其：

- 不重建 Supabase project；
- 不换 repository；
- 不把现有 Student / Teacher entry point 全面改写；
- 不无理由重命名已经测试过的 RPC；
- 不回滚已验证 security hardening。

## 1.3 数据库 migration 原则

现有：

```text
database/001_sprint1_core.sql
```

视为 **已部署基线**。

以后优先：

```text
002_...
003_...
004_...
```

采用 additive migration。

只有发现 `001_sprint1_core.sql` 本身存在必须修复的兼容/安全缺陷时，才能修改它；否则不得为了“整理得更漂亮”重新写 Sprint 1 schema。

---

# 2. Codex 必须优先阅读的 V4.0 章节

不要依赖任何旧版本行号。

按标题读取：

## 2.1 核心行为与状态

- `# 2. 六类 Behavior Patterns`
- `# 3. Post-game / Future Agent 行为分析架构`
- `# 4. 两条数据轨道`
- `# 5. 正式选择 / 投票 / Re-vote 规则`
- `# 8. 总体状态机`

## 2.2 Multiplayer / Pocket / Discussion

- `# 9. ACT 1`
- `# 10. ACT 2`
- `# 11. 通用 DiscussionRoom 组件`
- `# 12–22. ACT 3–12`

重点：
- `MY ITEMS`
- `MY MEMORIES & OBSERVATIONS`
- `SHARED PHOTOS`
- `GROUP FOUND ITEMS`
- `recordObservation(...)`
- `recordKnowledge(...)`
- `current_route_target`
- `silent_texting_mode`
- `NO CONSENSUS. NO ACTION.`
- ACT 12 `role_engaged`

## 2.3 Ending / Post-game boundary

- `# 23. ACT 13`
- `# 24. ACT 14`
- `# 25–28. POST-GAME / FUTURE ANALYSIS MODULE`
- `# 29. FUTURE MODULE`
- `# 30. V4.0 MAIN-GAME TERMINATION RULE`

关键：

> Castle Escape 主游戏在 **ACT 14 结束**。

原 ACT 15–16 Behavior Trace / Compare the Three 已移出active state machine。当前runtime只需完整保存并导出session data；教师之后把JSON交给GPT离线分析。

原 prediction / prediction-lock 同样不属于当前 Castle Escape 实现范围。

## 2.4 Engineering / Asset

- `# 31. Codex 实现规格`
- `# 32. Teacher Console`
- `# 33. 数据完整性与断线恢复`
- `# 34. Post-game Analysis Degradation`
- `# 35. 推荐开发顺序`
- `# 38. Multiplayer Execution Rules`
- `# 40. Audio Safety / Accessibility`
- `# 42. V4.0 Production Detail Rule`
- `# 44. 场景分类：图片 / UI / 音效`
- `# 50. Game Asset Manager：Image + Audio`
- `# 53. Visual Asset Technical Defaults`

---

# 3. 当前开发目标

V1.0 的“第一轮目标”已部分完成。

现在不要重新做：

> Sprint 0 Repository Audit  
> Sprint 1 Core Multiplayer

它们已经有代码和验证报告。

当前总体目标仍然是：

> **在保留 Sprint 1 验证基线的前提下，逐 Sprint 扩展为可让 Gitte / Anna / Linda 完整跑通 ACT 1–14 的 Castle Escape，并可靠导出完整session data。**

不要一次性把 ACT 1–14 全部塞进一个提交。

每个 Sprint：

```text
small scope
→ build
→ test
→ Devil Check
→ push
→ report
→ user approval / next instruction
```

---

# 4. 架构原则：保留现有结构，按需扩展

## 4.0 Room vs Run — first-class identity

正式runtime必须区分：

```text
Room = multiplayer access container
Run = one concrete Castle Escape playthrough
```

最低模型：

```text
game_runs
- run_id UUID primary key
- room_code
- run_started_at server timestamp
- run_mode normal | audit
- behavior_dataset_eligible boolean
- status
```

规则：
- 一个room可按时间顺序承载多个run；
- NORMAL与AUDIT必须是不同run；
- full restart创建新 `run_id`；
- 所有新增formal runtime表都应关联 `run_id`；
- export命名中的RUNID就是 `run_id`，不要再另建含义不明的session identity。

---

## 4.1 不为 V4.0 做“大重构”

现有 repository 已有：

```text
src/content
src/game
src/state
src/supabase
src/teacher
src/styles
src/utils
database
tests
docs
```

Codex 应在这些边界上继续增加模块。

只有现有目录明确无法承载新功能时，才新增目录。

建议增量扩展，例如：

```text
src/
  content/
    scenes.js
    discussion-config.js
    asset-manifest.js

  game/
    app.js
    discussion-room.js
    pocket.js
    group-actions.js
    audio.js

  state/
    session.js
    runtime-state.js

  agent/
    analyzer.js
    schemas.js

  assets/
    resolver.js
```

**不要为了符合示例目录而搬动已经工作的 Sprint 1 文件。**

## 4.2 Scene 继续数据驱动

新增剧情优先写入：

```text
scene definitions / content config
```

而不是大量：

```text
if scene === ...
```

核心 engine 只负责通用能力：

- private choice；
- lock；
- reveal；
- discussion；
- vote；
- pocket；
- group action；
- state transition；
- deadline；
- asset resolve；
- audio trigger。

剧情文本、答案和场景配置放 content。

## 4.3 Display Mode 必须成为通用能力

支持：

```text
CINEMATIC_MESSAGE
CRITICAL_INFO
ACTION_SCREEN
```

scene definition 明确提供 mode。

Codex不得根据文案自行猜 mode。

## 4.4 Student Text / Localization Contract — HARD REQUIREMENT

所有GAL-facing runtime text默认：

```text
English master source
→ Dutch display
→ Chinese display
```

实际学生界面按：

```text
Nederlands
中文
```

显示。

English master：
- 用于文案定稿；
- translation source；
- content key review；
- developer maintenance；
- **普通runtime不显示给GAL**。

语言无关元素（player name、数字、`★`、time、A/B/C）可只显示一次。

content catalog至少保存：

```text
text_type = static | template | internal | future_analysis
display_policy = bilingual | nl_only_artifact | hidden
```

### 模板不得写死

例如meeting message：

```text
{player_display_name} → {localized_location_name}
```

不得把：

```text
Gitte → Library
```

作为固定runtime string。

### 1897 Municipal Closure Order exception

该历史道具：

```text
display_policy = nl_only_artifact
```

inspect view只显示荷兰语。English继续作为master source；不显示中文。

### ACT 14 ending typography — HARD LOCK / CASE-SENSITIVE

English master：

```text
But the castle remembered everything you did.
THEY know who you are.
```

要求：
- 两句整句 `<strong>` / bold；
- sentence case；
- 只有 `THEY` uppercase；
- **禁止** `BUT THE CASTLE REMEMBERED EVERYTHING YOU DID.`;
- **禁止** `THEY KNOW WHO YOU ARE.`;
- 此组件及父组件不得使用 `text-transform: uppercase`;
- localization pipeline不得自动upper-case整句。

Dutch：

```text
Maar het kasteel herinnerde zich alles wat jullie deden.
ZIJ weten wie jullie zijn.
```

只有 `ZIJ` uppercase。

Chinese：

```text
但是城堡记住了你们做的一切。
他们知道你们是谁。
```

整句bold；中文不做伪uppercase / letter-spacing模拟。

必须为这条规则写UI regression test。

---

# 5. Runtime State：在需要时增量加入

V4.0最终需要支持：

```text
run_id
run_started_at
player_location
party_physically_reunited
player_knowledge_state
player_memories_observations
player_pocket_items
shared_photos
group_items
asset_view_state
message_mode
story_clock
phase_deadline
current_route_target
wayfinding_target
silent_texting_mode
role_assignments
role_engaged
watcher_active
audio_state
mechanism_failure_active
escape_success
game_completed
export_ready
session_integrity_verified

# run / audit integrity
run_mode
behavior_dataset_eligible
teacher_override_used
behavior_validity
context_provenance
```

## 5.1 不要求 Sprint 2 一次建完所有表

按 Sprint 实际需求增加。

原则：

> 不提前建设暂时无人使用的大型抽象系统。

但一旦某状态进入 gameplay，必须：

- server authoritative；
- reconnect 可恢复；
- event log 可追踪；
- Teacher debug 可查看必要状态。

## 5.2 Run Mode — NORMAL / AUDIT

Sprint 2开始就必须持久化：

```text
run_id
run_started_at
run_mode
behavior_dataset_eligible
```

这些是formal run metadata，不能推迟到后续override/export migration。

**Sprint 2只持久化metadata，不实现最终JSON/CSV export。**  
最终export generation仍在Sprint 8。

每次创建正式game run时，Teacher必须选择：

```text
NORMAL
AUDIT
```

服务器保存：

```text
run_mode = normal | audit
```

并在run开始后锁定，不允许中途切换。

### NORMAL

用于真实GAL游戏：

```text
behavior_dataset_eligible = true
```

真实发生的数据正常保留。

如果Teacher之后使用Emergency Override，只使**受影响的数据字段**失效；不得把整个session自动标成audit，也不得删除override前已经真实产生的学生行为。

### AUDIT

用于教师审核流程 / debug：

```text
run_mode = audit
behavior_dataset_eligible = false
```

Teacher默认仍不看未Reveal的private content。

只有显式开启：

```text
audit_private_debug_view = true
```

才可显示未揭示private content；该能力：
- 只允许AUDIT run；
- 必须写入Teacher event log；
- NORMAL中服务器必须拒绝。

Audit mode仍完整记录：

- player actions；
- discussion；
- votes；
- puzzle；
- route；
- reconnect；
- Teacher Override；
- scene transition；
- audio event；
- Agent output / error。

但：

> **AUDIT session中的行为数据永远不得进入GAL behavior analysis dataset。**

### 实现原则

NORMAL与AUDIT使用：

- 同一套Supabase schema；
- 同一套event writer；
- 同一套reconnect；
- 同一套scene engine。

不得维护两套runtime数据库或两套不同schema。

两种mode的物理文件分离发生在：

> **export / archive layer**

而不是runtime写入层。

---

# 6. DiscussionRoom V4.0 合同

DiscussionRoom 是下一阶段最重要的 reusable component。

至少支持：

```text
topic
time_limit
show_initial_choices
allow_free_text
allow_pocket
allow_memories_observations
allow_share_photo
require_final_vote
vote_options
pressure_mode
silent_texting_mode
player_knowledge_state
shared_photos
group_items
current_route_target

tie_policy
revote_window_sec
max_revotes
fallback_resolution

discussion_timeout_policy
vote_timeout_policy
```

## 6.1 默认值

```text
allow_free_text = true
allow_pocket = false
allow_memories_observations = false
allow_share_photo = false
require_final_vote = false
silent_texting_mode = false

tie_policy = NO_TIE_POSSIBLE
revote_window_sec = null
max_revotes = 0
fallback_resolution = null

discussion_timeout_policy = END_DISCUSSION_AND_OPEN_VOTE
vote_timeout_policy = WAIT_FOR_MISSING_PLAYER
```

有tie可能的scene必须显式覆盖。

## 6.2 Tie Policy — scene configurable

```text
ACT 2:
  SINGLE_REVOTE_THEN_FALLBACK
  revote_window_sec = 30
  max_revotes = 1
  fallback = library

ACT 5:
  SINGLE_REVOTE_THEN_FALLBACK
  revote_window_sec = 30
  max_revotes = 1
  fallback = inspect_first

ACT 6:
  SINGLE_REVOTE_THEN_FALLBACK
  revote_window_sec = 15
  max_revotes = 1
  fallback = portrait_fixed_fallback

ACT 7 Clock:
  REPEAT_UNTIL_MAJORITY
  revote_window_sec = 15
  max_revotes = null
  fallback = null

Great Hall:
  REPEAT_UNTIL_MAJORITY
  max_revotes = null
  fallback = null
```

DiscussionRoom不得套一个global tie rule。

## 6.3 Vote Round Identity

每轮vote一次LOCK。

合法re-vote：

```text
vote_round += 1
```

新discussion window还必须：

```text
new discussion_session_id
```

Group vote推荐唯一键：

```text
run_id
+ scene_id
+ phase_key
+ step_key
+ vote_round
+ player_id
+ decision_type
```

Behavior First Choice使用独立永久LOCK identity，不因re-vote reopen。

## 6.4 Discussion Session Identity

```text
discussion_session_id
run_id
scene_id
phase_key
step_key
round_no
started_at
phase_deadline
ended_at
outcome
```

dialogue和vote应关联正确的discussion / round。

## 6.5 Missing Vote at Deadline

绝不合成玩家输入。

如果vote deadline到且少于3名提交：

```text
phase = WAITING_FOR_MISSING_PLAYER
```

不得：
- 用两人majority直接执行；
- 自动替缺席玩家投票；
- 把timeout解释为player behavior。

允许：
- reconnect；
- Teacher `Add 30 sec`；
- Teacher合法deblock。

缺失值语义：

```text
null + invalid_teacher_override
null + missing_technical
null + not_applicable
```

## 6.6 `silent_texting_mode`

Library会合后到 `ESCAPE SUCCESSFUL` 保持true。

## 6.7 Great Hall 1:1:1

显示：

> **NO CONSENSUS. NO ACTION.**

必须：
- no door action；
- no state change；
- no penalty event；
- next vote round；
- NEVER random system choice。

---

# 7. Pocket / Knowledge：不要混成一个 inventory

必须区分：

```text
physical_owner
memory_observation_owner
shared_photo_copy
group_item
knowledge_holder
```

## 7.1 `recordObservation(...)`

非实体个人经历：

```text
recordObservation(
  player_id,
  observation_key,
  display_text,
  discovered_at_scene,
  discovered_at
)
```

写入：

> MY MEMORIES & OBSERVATIONS

不是自动分享。

## 7.2 `recordKnowledge(...)`

后台 provenance：

```text
recordKnowledge(
  player_id,
  knowledge_key,
  source,
  scene,
  delivered_at,
  source_player = null,
  source_item = null
)
```

允许 source：

```text
direct_observation
private_system_message
pocket_inspection
shared_photo
chat_from_player
group_item
```

用途：

- Agent 判断玩家什么时候知道什么；
- 区分 original sharing 与收到别人信息后复述；
- 不对学生显示后台 schema。

## 7.3 SHARE PHOTO

只分享：

> 当前 view 的照片副本

不得复制实体物品。

Sender-side UI：

```text
if allow_share_photo == true
AND current_view.shareable == true
AND current_player is physical_owner(source_item):
    show [SHARE PHOTO]
```

点击后：
- physical ownership不变；
- sender可继续inspect / FLIP；
- receiver在 `SHARED PHOTOS` 获得photo copy；
- copy必须保留 `shared_by / shared_at / source_item / source_view`；
- receiver不得把收到的photo copy再次冒充原始物品share；
- reconnect必须恢复sender/receiver状态。

---

# 8. Group Action：建立一个小型通用合同

避免每一幕自己发明同步方法。

建议仅提供少量通用模式：

```text
GROUP_INPUT_ANY_ONE
GROUP_VOTE_MAJORITY
GROUP_VOTE_REPEAT_UNTIL_MAJORITY
GROUP_SHARED_CONSOLE_STEP
```

例如：

- Library 41739 → `GROUP_INPUT_ANY_ONE`
- Portrait问题 → `GROUP_VOTE_MAJORITY`
- Clock puzzle → `GROUP_VOTE_REPEAT_UNTIL_MAJORITY`
- Great Hall → `GROUP_VOTE_REPEAT_UNTIL_MAJORITY` + step console

不要创建一个过度泛化的 workflow engine。

---

# 8.1 V4.0 content corrections that Codex must preserve

### Castle Map
- include `Main Hall` in the location model / overlay;
- known route must support `Library → Main Hall → Portrait Hall`;
- remove obsolete ink-obscured lower-left-area logic;
- Unknown Passage remains absent from the map.

### Number Note
- AI asset must not contain readable digits;
- exact `4 – 1 – 7 – 3 – 9` comes from HTML/UI only.

### Municipal Closure Order
- display Dutch only as a diegetic 1897 artifact;
- do not add Chinese beneath the document itself.

### Alarm text
English master:

```text
A harsh alarm bell rings somewhere inside the walls.
```

Do not use `mechanical bell`.

### Clock Room
- `group_action_mode = GROUP_VOTE_REPEAT_UNTIL_MAJORITY`
- 1:1:1不触碰任何钟；
- 15秒discussion后创建新 `vote_round`；
- 不随机替玩家选择Clock。

### Failed rendezvous fold-back state

当ACT 2原meeting target不可达并fold back到Library：

```text
final_meeting_result = preserve original resolved vote
current_route_target = library
wayfinding_target = library
```

不要覆盖历史 `final_meeting_result`；它仍是Behavior/Audit evidence。

### Future analysis text
`Insufficient evidence...` and generated behavior-report sentences are `future_analysis`; they must not appear in ACT 1–14 runtime UI.

---

# 8.2 Escape Penalty Events — no numeric score

V4.0不定义或显示数值Escape Score。

只记录：

```text
escape_penalty_event
```

例如：
- puzzle_hint_used
- repeated_puzzle_failure
- failed_rendezvous
- great_hall_wrong_door
- allocation_rework

不得：
- 发明初始分数 / 扣分公式；
- 因Real Time penalty改变Story Time；
- 把penalty event转成Behavior judgment。

---

# 9. ACT 12：必须按 V4.0 的 ENGAGE gate 实现

不能一进入 ACT 12 就 random failure。

## 9.1 Leave Golden Key

要求：

```text
A: input 1897 → ENGAGE
B: hold lever → ENGAGE
C: Linda inserts ★ key → ENGAGE
```

必须满足：

```text
role_engaged.A
AND role_engaged.B
AND role_engaged.C
```

才触发 random failure。

## 9.2 Take Golden Key

要求：

```text
A → ENGAGE
B → ENGAGE
WATCHER → WATCH CORRIDOR
```

必须满足：

```text
role_engaged.A
AND role_engaged.B
AND role_engaged.WATCHER
```

才触发 random failure。

Watcher：

> 永远不是 mechanism failure owner。

## 9.3 Pressure choice 之后

统一显示：

> **Nothing is getting better. Running is no longer an option. You do what you can.**

然后进入：

- audio；
- blackout；
- countdown；
- silence；
- mechanism clang；
- gate opening；
- `ESCAPE SUCCESSFUL`。

行为选择不得直接决定 escape success。

---

# 10. Audio：作为正式 Asset，不另建第二套系统

V4.0 至少需要：

```text
audio.wet_scraping
audio.snakes_approaching
audio.old_alarm_bell
audio.snake_hiss_short
audio.mechanism_clang
audio.gate_opening
```

使用现有/扩展后的 Asset Manager：

```text
asset_type = image | audio
```

音效需要：

```text
asset_key
version
status
storage_path
mime_type
duration_ms
loopable
license_source
loudness_note
```

运行要求：

- 首次用户交互后才预加载 / 播放；
- mute；
- reduced volume；
- one-shot reconnect 不重复误播；
- 关键剧情不能只靠声音表达。

建议后台记录：

```text
audio_event_key
fired_at
completed
```

---

# 11. Asset Manager：V1功能保留，做增量泛化

原有目标继续有效：

- manifest；
- placeholder；
- upload；
- review；
- APPROVED；
- ACTIVE；
- version；
- Supabase Storage；
- GitHub不保存学生运行时上传素材。

V2.3新增：

```text
asset_type = image | audio
```

Image-only字段：

```text
ui_anchors
width_px
height_px
```

Audio-only字段：

```text
mime_type
duration_ms
loopable
license_source
loudness_note
```

## 11.1 UI anchors

对于：

- Library hidden door；
- Portrait face；
- Clock A/B/C；
- Great Hall doors；
- Main Gate A/B/C；
- Watcher corridor；

支持：

```text
anchor_name
x_percent
y_percent
width_percent
height_percent
```

教师可以在图片上画框；开发工具把框转换为百分比。

Codex不需要让教师手算坐标。

---

# 11.2 V4.0 Canonical Visual Asset Workflow — Codex Responsibility

本节把 V4.0 §50.7 对CD的职责写成implementation contract。

## 11.2.1 Canonical Asset Registry

正式路径：

```text
assets/asset-registry.json
```

它是machine authority，最低支持：

```text
asset_key
display_name
aliases
asset_type
latest_version
active_version
continuity_refs
paired_asset_group
required_anchors
runtime_required
```

硬规则：
- `asset_key` opaque；不得translate / abbreviate / normalize / reconstruct；
- next candidate由 `latest_version + 1` 得到；
- runtime只解析 `active_version`；
- APPROVED != ACTIVE；
- 每个asset_key最多一个ACTIVE；
- MASTER-XX不得当runtime key，除非registry明确映射。

## 11.2.2 Staging / publishing boundary

VA负责到：

```text
assets/staging/{asset_key}/vNNN/
  {asset_key}__vNNN.webp
  {asset_key}__vNNN.json
```

并完成：
- exact registry read；
- canonical naming；
- sidecar；
- dimensions；
- SHA-256；
- pre-commit registry re-read；
- GitHub reread verification；
- PENDING_REVIEW。

CD / Asset Manager负责：

```text
APPROVED candidate
→ verify candidate metadata/checksum
→ publish/copy to Supabase Storage
→ persist runtime metadata
→ enforce one ACTIVE
→ update active_version
→ runtime resolver
→ missing/corrupt fallback
→ load/error telemetry
```

不得把Supabase publishing / resolver标为VERIFIED，直到真实E2E完成。

## 11.2.3 No second manually edited manifest

如果runtime需要：

```text
src/content/asset-manifest.js
```

它必须：
- generated from registry，或
- validated against registry。

不得变成第二套独立人工source of truth。

## 11.2.4 Missing asset behavior

普通asset load failure：

```text
safe placeholder
+ asset_load_failed event
+ asset_key/version/path
+ Teacher debug cause
```

如果缺失的是interaction-critical overlay / asset，继续会导致谜题不可解：

> 可以阻塞scene，但必须明确显示原因，并允许Teacher安全deblock。

## 11.2.5 ~5% Rule-Change Threshold

除hard invariant外：

> 对当前真实工作流中实践概率约 <=5%的假设风险，不新增流程规则、不阻塞开发、不重构已经同意的方案。

当前明确：

> **不要现在实现atomic asset version reservation / CAS。**

当前采用：

```text
fresh registry read
→ latest_version + 1
→ pre-commit registry re-read
→ immutable staging
→ post-upload verification
```

只有真实multi-writer collision风险上升到约 >5% 时再升级。

Hard-invariant例外仅限：
- credential exposure；
- destructive canonical data/asset loss；
- silent identity/integrity corruption；
- immutable-history overwrite；
- silent security bypass。

## 11.2.6 Inter-Agent protocol

CD与CA/VA/GA通信时必须遵守：

```text
agent-comms/inter_agent_talk_protocol V*.md
```

中的最高ACTIVE版本。

当前：
- CA = Coding Audit Agent
- VA = Visual Agent
- GA = Game Design Agent
- CD = Codex

---

# 12. Database 增量计划

必须additive并保护Sprint 1 legacy baseline。

示意：

```text
001_sprint1_core.sql                  # 已验证，不重写
002_runtime_runs_discussion.sql       # Sprint 2: game_runs + DiscussionRoom + vote rounds
003_runtime_items.sql                 # Pocket / knowledge / group items
004_runtime_events_override.sql       # override / validity / context provenance as needed
005_assets.sql                        # image + audio + anchors
```

文件名可按现有repository调整，但能力时序不能改变。

## 12.1 Sprint 2必须落地

```text
game_runs
run_id
run_started_at
run_mode
behavior_dataset_eligible
```

以及：

```text
discussion_session_id
phase_key
step_key
round_no
vote_round
```

Sprint 2**不生成最终export文件**。

## 12.2 Decision uniqueness

禁止把：

```text
room_code + scene_id + player_id + decision_type
```

用于所有vote。

Group vote最低唯一身份：

```text
run_id
+ scene_id
+ phase_key
+ step_key
+ vote_round
+ player_id
+ decision_type
```

## 12.3 Legacy reset

`s1_reset_room()`：
- 维持legacy tested semantics；
- 不得reset formal Castle Escape run。

formal full restart：
- new `run_id`；
- old run preserved；
- 不做destructive delete。

## 12.4 Override event / downstream provenance

Teacher Override独立记录：

```text
event_type = teacher_override
run_id
scene_id
phase_key
override_action
applied_resolution
reason
created_at
```

若override改变后续Game Track context，后续真实event保留：

```text
context_provenance.upstream_teacher_override = true
```

不要自动把所有下游真实行为判invalid。

---

# 13. Sprint 2 起的实施顺序

## Sprint 0 — CLOSED

Repository Audit 已完成。

不要重做。

## Sprint 1 — VERIFIED PASS

Core multiplayer已通过 live acceptance。

不要重做。

---

## Sprint 2 — Reusable DiscussionRoom

本 Sprint 只做通用讨论能力，不实现完整 Castle story。

交付：

- DiscussionRoom UI；
- text message send / receive；
- authoritative server timestamps；
- transcript；
- discussion session；
- server deadline；
- reveal of configured initial choices；
- configurable final vote；
- 3:0 / 2:1；
- 1:1:1保留当前step / discussion；
- reconnect restore；
- duplicate vote protection；
- `silent_texting_mode` flag；
- event logging；
- first-class `run_id / run_started_at / run_mode / behavior_dataset_eligible` metadata；
- vote-round / discussion-session identity；
- **不生成最终export文件**；只持久化Sprint 8未来export需要的metadata。

建议建立一个**测试用 generic discussion scene**，而不是立刻绑定 Great Hall 全剧情。

### Sprint 2 禁止顺手加入

- Pocket完整系统；
- Asset Manager；
- Agent分析；
- ACT 1–14全部剧情；
- Prediction；
- 音效高潮；
- 全面 UI redesign。

### Sprint 2 acceptance

至少测试：

- 3人正常聊天；
- 1人慢；
- disconnect/reconnect；
- 3:0；
- 2:1；
- 1:1:1；
- repeated re-vote；
- pre-vote privacy；
- duplicate submit；
- deadline；
- transcript order；
- Teacher观察；
- `run_id` server-side生成；
- `run_mode` persisted且run开始后不可切换；
- Sprint 2不生成final export；
- existing Sprint 1 regression suite仍 PASS。

---

## Sprint 3 — Scene / Pocket / Knowledge Foundation

增量加入：

- V4.0 scene definition；
- display modes；
- Pocket；
- Memories & Observations；
- Shared Photos；
- Group Items；
- `recordObservation`；
- `recordKnowledge`；
- current_route_target；
- wayfinding；
- soft failure / fold-back；
- scene-level `teacher_override` metadata（只定义合法safe resolution，不允许任意跳scene）；
- Teacher Console先提供最小可用的 `SKIP CURRENT INTERACTION` / `RESOLVE & CONTINUE` advanced controls，供流程审核与deblock。

优先让 ACT 1–5 使用 placeholder 跑通。

---

## Sprint 4 — Asset Manager V2

- image + audio；
- manifest；
- upload / approve / active；
- placeholder；
- anchors；
- version；
- Storage policy；
- missing asset fallback。

不得因为正式图未完成阻塞 core gameplay。

---

## Sprint 5 — ACT 6–8 + visual-dynamic UI

- Portrait overlay；
- Clock UI / CSS-SVG movement；
- West Tower branch；
- map highlight；
- route transitions。

---

## Sprint 6 — ACT 9–13

- Great Hall step console；
- `NO CONSENSUS. NO ACTION.`；
- step-specific failure；
- Golden Key；
- A/B/C or A/B/WATCHER；
- role allocation；
- `role_engaged`；
- pressure choice；
- audio triggers；
- escape cinematic。

---

## Sprint 7 — Teacher Console expansion

在已验证 Teacher Console 上增量加入：

- current act / scene / phase；
- submitted / waiting；
- Discussion transcript；
- Pocket debug；
- Group Items；
- current route；
- countdown；
- audio trigger debug；
- teacher intervention log；
- Audit / Normal mode visibility；
- Override history；
- per-phase behavior validity visibility；
- export controls / filename preview。

Sprint 3可以先有最小可用override按钮；Sprint 7负责把它完善为稳定的Teacher workflow。

不要替换现有 teacher token/session recovery。

---

## Sprint 8 — ACT 14 Final Reveal + Session Finalization / Export

只实现active ending与数据收口：

- ACT 14 bilingual final reveal；
- exact ending typography regression test；
- flush pending events；
- verify semantic `session_integrity_verified`；
- persist final state；
- `game_completed = true`；
- `export_ready = true`；
- NORMAL / AUDIT JSON + CSV export；
- JSON作为post-game GPT analysis主要输入；
- export schema包含knowledge provenance / transcript / votes / pressure choices / teacher override / behavior validity。

**不实现runtime Behavior Trace / Compare the Three。**
**不实现 prediction module。**

Post-game GPT analysis属于当前游戏之后的离线workflow，不是release blocking runtime feature。

---

## Sprint 9 — Full Asset Integration / Visual Continuity Acceptance

- active assets；
- anchor verification；
- audio；
- cross-scene continuity；
- performance；
- loading；
- fallback。

---

## Sprint 10 — 3-player Release Candidate

完整：

```text
Gitte + Anna + Linda
ACT 1 → ACT 14
→ session finalized
→ export ready
```

远程真实测试。

---

# 14. Prediction Module 明确移出当前 scope

V1.0 曾要求：

```text
prediction lock
Sprint 8 — prediction lock + debrief
```

V2.3 **取消 Castle Escape 中这一要求**。

以下不属于当前开发：

- real-life prediction scenarios；
- prediction generation；
- prediction lock；
- actual-choice comparison；
- Privacy module。

代码可以保留未来扩展接口，但：

> 不建UI、不建active state、不进入ACT 14以后流程。

---

# 15. Logging / Observability

至少记录：

- room；
- run_id / run_started_at / run_mode；
- join / disconnect / reconnect；
- phase transitions；
- private decision；
- vote round / re-vote；
- discussion_session_id；
- dialogue；
- knowledge / observation / share photo；
- group item；
- role assignment / role engaged；
- pressure choice；
- hint；
- `escape_penalty_event`；
- teacher intervention / override；
- behavior validity；
- context provenance；
- asset / audio events。

## 15.1 Export identity / filename

NORMAL：

```text
YYYY-MM-DD_HH-mm-ss_RUNID.json
YYYY-MM-DD_HH-mm-ss_RUNID.csv
```

AUDIT：

```text
YYYY-MM-DD_HH-mm-ss_RUNID_audit.json
YYYY-MM-DD_HH-mm-ss_RUNID_audit.csv
```

`RUNID = run_id`。

## 15.2 Export allowlist — SECURITY HARD RULE

Export由专门analysis DTO / allowlist生成。

**禁止直接serialize database rows。**

绝对禁止：

```text
teacher_token
teacher_token_hash
join_code
join_code_hash
player_session_token
player_session_token_hash
Supabase keys
service_role key
service credentials
internal authentication secrets
```

进入JSON / CSV。

## 15.3 Canonical JSON header

至少：

```text
run_id
room_code
run_started_at
run_mode
behavior_dataset_eligible
export_schema_version
exported_at
session_integrity_verified
```

初始：

```text
export_schema_version = "1.0"
```

规则：
- backward-compatible additive fields → minor；
- breaking meaning / structure → major。

## 15.4 Validity enum

真实missing使用JSON：

```json
null
```

validity：

```text
valid
partial
invalid_teacher_override
missing_technical
not_applicable
```

`not_applicable` = 当前合法path按设计没有该字段。

## 15.5 Session Integrity

`session_integrity_verified`：

> 当前实际path要求的数据，要么存在，要么有明确validity / absence reason。

不是“所有possible字段必须填满”。

只有满足后ACT 14才可：

```text
game_completed = true
export_ready = true
```

## 15.6 CSV contract

CSV固定为flat event ledger：

```text
timestamp
event_type
run_id
scene_id
phase_key
step_key
actor_id
payload_json
validity
```

JSON是post-game GPT分析的canonical format。

---

# 16. Testing：任何新 Sprint 都必须回归 Sprint 1

每次：

```text
new tests
+
existing Sprint 1 static/live tests
```

如果新 migration 破坏 Sprint 1：

> Sprint 不得宣布完成。

重点新增：

### Legacy compatibility
- existing Sprint 1 regression tests仍PASS
- `s1_advance_scene` semantics unchanged
- formal runtime不使用legacy scene>=2 completion rule
- `s1_reset_room`不能reset formal run

### Discussion
- message order
- reconnect
- 3:0 / 2:1 / 1:1:1
- `NO CONSENSUS. NO ACTION.`
- re-vote creates new `vote_round`
- prior vote round preserved
- tie-break opens new `discussion_session_id`
- ACT2/5/6 scene-specific fallback
- ACT7 / Great Hall repeat-until-majority
- missing vote never synthesized
- deadline with missing player → WAITING_FOR_MISSING_PLAYER
- silent_texting_mode

### Pocket / Knowledge
- ownership
- Shared Photo ≠ physical copy
- observation restore
- knowledge provenance

### Branch
- Final Vote updates route
- failed rendezvous preserves `final_meeting_result`
- fold-back sets `current_route_target = library`
- fold-back sets `wayfinding_target = library`
- Known/Unknown
- Main Gate/West Tower

### Great Hall
- each step
- no-consensus no action
- wrong-step hint
- reset behavior

### ACT 12
- ENGAGE gating
- Watcher not failure owner
- random active mechanism
- `mechanism_failure_active = true` on failure
- pressure LOCK
- cinematic auto-resolution clears failure
- impossible final state: `escape_success = true` + `mechanism_failure_active = true`

### Asset
- image
- audio
- anchor
- missing
- reject
- active version
- broken storage

### Ending / Localization / Export
- every GAL-facing runtime string resolves to Dutch + Chinese unless `nl_only_artifact`
- English master is not rendered to students
- 1897 Closure Order renders Dutch only
- template values localize dynamically
- ACT 14 exact typography: `But...` sentence case + only `THEY` uppercase
- Dutch ending: only `ZIJ` uppercase
- no parent CSS `text-transform: uppercase`
- ACT 14 flushes pending events
- semantic `session_integrity_verified` accepts legitimate `not_applicable`
- `game_completed = true`
- `export_ready = true`
- NORMAL JSON/CSV RUNID filename
- AUDIT RUNID `_audit` JSON/CSV filename
- exported JSON contains all required behavior / provenance / override validity fields
- export contains no token/hash/join-code/Supabase/service secret
- `export_schema_version = "1.0"`
- CSV matches flat event-ledger contract
- active state has no ACT 15 / ACT 16 transition

### Audit / Override
- create NORMAL room
- create AUDIT room
- `run_mode` cannot change after start
- AUDIT export filename contains `_audit`
- NORMAL export filename does not contain `_audit`
- Audit data never enters behavior dataset
- override before any player input
- override after partial real player input
- real pre-override data preserved
- affected fields become `null` where no real player value exists
- downstream genuine behavior after upstream override remains real but carries context provenance
- validity = `invalid_teacher_override`
- Teacher cannot impersonate Gitte / Anna / Linda
- Teacher cannot send arbitrary next_scene
- invalid override rejected by server
- override event is logged
- reconnect restores post-override authoritative state

---

# 17. Teacher / Security

当前 room-level teacher token 是已知 prototype mechanism。

V2.3不要求在 Sprint 2 重做 authentication。

保留：
- password/show-hide；
- teacher-authenticated recovery；
- no browser service-role key。

Known limitation 继续记录：
- 被错误分发的 join code仍可能被他人使用；
- teacher token不是正式账号级authentication。

除非用户单独要求，不要让security redesign阻塞课程原型开发。

## 17.1 Teacher Override / Emergency Override

Teacher Console新增一个默认折叠的：

> **ADVANCED / EMERGENCY OVERRIDE**

它是：

> **Game Track deblock capability**

不是：

> player impersonation capability

### 允许的两个主要动作

#### A. SKIP CURRENT INTERACTION

用于：

- discussion卡住；
- player无法继续；
- unresolved waiting；
- 某个非谜题interaction需要直接结束。

服务器使用当前scene定义的合法skip destination。

#### B. RESOLVE & CONTINUE

用于存在明确谜题答案或safe operational resolution的scene。

例如：

```text
Library Box → 41739
Clock Room → Clock C
Great Hall → canonical next correct step
```

对于没有“正确答案”的行为选择，例如：

```text
Known vs Unknown
Main Gate vs West Tower
Take vs Leave Golden Key
```

不得写成 `correct_answer`。

必须定义：

```text
safe_resolution
```

即：

> 一个能保持state machine正常运行的合法分支结果。

## 17.2 Server-authoritative override

推荐一个通用RPC / service boundary，例如：

```text
teacher_apply_override(
  room_id,
  teacher_token,
  override_action,
  reason
)
```

但Teacher端不得传任意：

```text
next_scene
player_id_to_impersonate
choice_label_as_player
```

服务器必须根据当前：

```text
scene_id
phase
scene.teacher_override config
```

确认允许的动作与结果。

非法override必须拒绝。

## 17.3 Scene definition contract

需要override的scene可增加：

```text
teacher_override: {
  can_skip: true | false,
  safe_resolution: ...,
  next_phase: ...,
  invalidate_scope: ...
}
```

只在scene config定义允许的结果。

不要在Teacher Console散落：

```text
if ACT_7 then...
if ACT_9 then...
```

## 17.4 禁止 player impersonation

Teacher Override **永远不得**：

- 以Gitte身份提交choice；
- 以Anna身份发送message；
- 以Linda身份final vote；
- 人工生成假的player response time；
- 把系统resolution写成player event。

这是保护behavior data与knowledge provenance的硬规则。

## 17.5 Normal Mode 中的数据处理

Teacher使用override时：

> **保留override之前所有真实发生的数据。**

只把因为override而没有真实产生的数据标记为missing/invalid。

例：

```json
{
  "initial_choices": {
    "Gitte": "A",
    "Anna": "C",
    "Linda": "A"
  },
  "final_vote": null,
  "teacher_override": {
    "used": true,
    "action": "RESOLVE_AND_CONTINUE"
  },
  "behavior_validity": {
    "initial_choices": "valid",
    "discussion": "partial",
    "final_vote": "invalid_teacher_override"
  }
}
```

不得因为一次override：

- 删除整个scene；
- 删除之前的真实messages；
- 把整个NORMAL session自动改成AUDIT；
- 用系统答案冒充玩家答案。

## 17.5.1 Downstream context provenance

如果Teacher Override改变了上游Game Track，例如ACT 10替团队决定Take/Leave：

- 后续真实玩家choice仍然是真实行为；
- 不自动把它们标成 `invalid_teacher_override`；
- 必须附带：

```json
{
  "context_provenance": {
    "upstream_teacher_override": true,
    "source_scene": "ACT_10",
    "source_phase": "...",
    "override_action": "RESOLVE_AND_CONTINUE"
  }
}
```

Post-game分析可以保留行为，但降低context confidence。

## 17.6 Audit Mode 中的数据处理

AUDIT session：

```text
behavior_dataset_eligible = false
```

因此可自由使用Teacher Override做流程审核。

所有技术数据仍保留，便于：

- Debug；
- state-machine review；
- timing review；
- multiplayer review；
- visual / audio integration review。

但Agent / export pipeline不得把它混入真实GAL behavior dataset。

## 17.7 UI防误触

两个override按钮都需要二次确认：

> **This action may invalidate behavior data for the current phase. Continue?**

执行后Teacher Console显示：

> **OVERRIDE USED**

并可查看：

- action；
- scene；
- phase；
- timestamp；
- reason；
- invalidated scope。

GAL端不必显示“Teacher Override”，继续看到正常剧情结果即可。

## 17.8 ACT 14 completion / export authority

Teacher不得在session finalization完成前导出“final”数据。

只有服务器满足：

```text
game_completed = true
export_ready = true
```

Teacher Console才启用：

> EXPORT SESSION DATA

浏览器下载位置由用户浏览器/操作系统决定；Codex不得写死本地Windows路径。

## 17.9 Formal Reset / Restart Safety

`s1_reset_room()` 仅用于legacy Sprint 1 prototype / regression。

Formal Castle Escape：
- NORMAL：真实behavior event产生后禁止destructive reset；
- AUDIT：restart也必须创建新 `run_id`；
- old run完整保留；
- Teacher Console不得提供 `Restart current scene` 这种会改写历史的generic control；
- deblock只使用 `SKIP CURRENT INTERACTION` / `RESOLVE & CONTINUE`。

---

# 18. Codex 每个 Sprint 的交付报告

必须：

```text
1. What I changed
2. Files changed
3. Database changes
4. Tests run
5. Existing Sprint 1 regression result
6. Devil Check findings
7. Known issues / limitations
8. What I did NOT change
9. Recommended next step
10. Commit SHA / push status
```

如果没测：

> **NOT TESTED**

禁止写：

> should work

代替实际测试。

报告继续推送 GitHub。

---

# 19. 开发时的 Devil Check

每个 Sprint 至少检查：

1. Player Knowledge / Information State
2. Multiplayer
3. Teacher / Operations
4. Story continuity
5. State Machine / Failure Path
6. Behavior Validity
7. Maintainability

同时检查：

- information provenance；
- item ownership；
- route → consequence → next scene；
- Story Time vs Real Time；
- setup → payoff；
- choice → consequence；
- evidence → observable → six patterns；
- NORMAL vs AUDIT data isolation；
- override是否只改变Game Track；
- override是否污染Player / Behavior Track；
- missing data是否使用标准 `null` + validity reason。

---

# 20. V2.3 的下一步执行指令

本文件本身**不是“自动开始 Sprint 2”的批准**。

当用户明确要求 Codex 继续开发时：

先完成一个**窄范围 Pre-Sprint2 Asset Registry Bootstrap**：

```text
建立 assets/asset-registry.json
→ 依据 V4.0 当前canonical asset list
→ 填入 display_name / aliases / asset_type
→ latest_version / active_version
→ paired_asset_group / required_anchors / runtime_required
→ commit
→ GitHub reread verify
```

这个bootstrap：
- 不是Sprint 4 Asset Manager；
- 不实现Supabase publishing；
- 不实现ACTIVE promotion；
- 不扩展成CAS / reservation系统；
- 目的只是解除VA正式出图前的唯一machine-identity blocker。

完成并commit后：

1. CD按inter-Agent protocol写信给CA，请求audit registry；
2. **CD不得直接授权VA开始正式production**；
3. CA完成audit：
   - PASS → **由CA写信给VA**，明确授权VA开始正式production candidate workflow；
   - FAIL → CA写信给CD要求修复，VA继续等待；
4. CD修复后重新commit / reread，并再次请求CA audit；
5. 只有收到CA明确PASS消息后，VA才可正式生成、命名、commit production candidate；
6. CD可在不破坏registry修复工作的前提下继续：

> **Sprint 2 — Reusable DiscussionRoom。**

说明：
- VA等待CA时可以准备prompt / review MASTER-01–05 / paired-asset planning；
- 但不能开始正式production candidate；
- 该CA gate是首次registry bootstrap / 重大identity结构重建的one-time acceptance gate，不是逐图CA审批。

开始前只做一个轻量 baseline check：

```text
git status
git log -1
confirm HEAD is 67f20b4 or a descendant
run existing Sprint 1 static/live tests as appropriate
```

如果 PASS：

> 直接开发 Sprint 2。

不得重新运行完整 Sprint 0，不得重建 Sprint 1。

---

# 21. Definition of Done — Codex Guide V2.3

V2.3 生效意味着：

- script source更新为 V4.0；
- Sprint 1 status被正确视为 VERIFIED PASS；
- development 从 Sprint 2 增量继续；
- Active Castle Escape边界更新为 ACT 1–14；
- Runtime Behavior Trace / Compare the Three移出当前游戏；
- Prediction从当前游戏移除；
- Dutch + Chinese GAL-facing localization合同明确；
- ACT 14 ending case/bold规则被硬锁并有regression test；
- DiscussionRoom / Pocket / Knowledge / Audio / Asset anchors被纳入后续计划；
- ACT 12 ENGAGE gate明确；
- Great Hall `NO CONSENSUS. NO ACTION.`明确；
- NORMAL / AUDIT run mode明确；
- export filename isolation明确；
- Teacher Override / Emergency Override合同明确；
- override不得冒充player、不得污染Behavior Track；
- `null` + behavior validity规则明确；
- minimal-change / additive-migration原则明确；
- ACT 14 session finalization + JSON/CSV export规则明确；
- legacy Sprint 1 state machine与formal runtime边界明确；
- first-class `run_id`明确；
- re-vote round / discussion session identity明确；
- tie policy scene-configurable；
- formal reset / restart不删除历史；
- export allowlist / credential redaction明确；
- `not_applicable` validity明确；
- downstream Teacher Override context provenance明确；
- CSV event ledger与export schema version明确；
- canonical specs统一存放在 `docs/specs/current/`；
- V4.0 safe visual-asset workflow已写入CD职责；
- `assets/asset-registry.json` bootstrap被列为VA正式production前的窄范围前置任务；
- 初始Asset Registry必须经过CA PASS后才能由CA授权VA开始正式production；CD不得直接绕过audit gate授权VA；
- VA staging / CD runtime publishing职责边界明确；
- ~5% rule-change threshold明确；当前不实现asset version CAS；
- highest ACTIVE inter-Agent protocol为通信规则；
- existing verified backend and security behavior受到保护。

