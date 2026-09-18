# Castle Visual V2.1
## Project: GAL Castle Escape / Skill 3
## Visual Agent Production Guide

> Updated against `docs/specs/current/古堡逃脱游戏脚本 V4.0.md` and the V4.0 safe visual-asset workflow.
>
> 核心原则：**已经生成并批准的 MASTER-01–05 不做无理由重画；只处理 V4.0 造成的功能性冲突。**
>
> **Correction note (2026-09-18): 当前项目不存在 MASTER-06。此前 V2.1 草稿中关于“MASTER-06 已存在”的表述为文档错误，现已更正。当前正式 Master 集合为 MASTER-01–05。**

---

# 0. 文档定位

本文件是 Visual Agent 的执行入口。

它负责：

- 城堡视觉世界；
- scene / prop image requirements；
- continuity；
- recurring props；
- UI-safe composition；
- paired visual assets；
- revision / approval。

它**不负责**：

- 游戏状态机；
- 精确文字；
-按钮；
- 聊天；
- 倒计时；
-钟表运动；
-音频；
-行为分析。

如果视觉与游戏功能冲突：

```text
用户最新明确要求
> `docs/specs/current/古堡逃脱游戏脚本 V4.0.md`
> `docs/specs/current/Castle Visual V2.1.md`
> `assets/asset-registry.json`（一旦建立：machine identity/version authority）
> existing approved visual canon
```

Visual Agent 不得为了“更漂亮”改变谜题。

---

# 0.1 V2.1 Operational Governance Synchronization

V2.1 不重新设计已冻结视觉；本次升级只同步 V4.0 已批准的跨Agent生产规则。

## 0.1.1 Source-of-truth separation

Human visual source of truth：

```text
docs/specs/current/Castle Visual V2.1.md
```

Game / scene source of truth：

```text
docs/specs/current/古堡逃脱游戏脚本 V4.0.md
```

Machine asset identity / version source of truth（一旦建立）：

```text
assets/asset-registry.json
```

规则：
- Castle Visual定义“图应该长什么样”；
- Asset Registry定义“它是谁、版本是多少、哪个版本ACTIVE”；
- MASTER-01–05是视觉canon，不自动等于runtime `asset_key`；
- VA不得自行发明、翻译、缩写或normalize `asset_key`。

## 0.1.2 Initial Registry Audit Gate — BEFORE FORMAL PRODUCTION

在 `assets/asset-registry.json` 首次由CD建立后：

```text
CD commit + GitHub reread
→ CA audit
→ CA PASS message to VA
→ VA starts formal production
```

VA在收到CA明确PASS / production-start message之前：
- 可以review MASTER-01–05；
- 可以准备prompt；
- 可以准备paired-asset方案；
- **不得正式生成 / 命名 / commit production candidate。**

如果CA要求修复registry，VA等待CD修复并等待CA重新PASS。

该gate只针对registry首次bootstrap / 重大identity结构重建，不要求CA逐张审核VA后续candidate。

## 0.1.3 Production candidate workflow — HARD RULE

正式production image必须：

```text
fresh exact-path registry read
→ exact display_name / alias resolution
→ exact asset_key
→ latest_version + 1
→ generate
→ canonical post-generation filename
→ matched JSON sidecar
→ width / height / SHA-256
→ pre-commit registry re-read
→ GitHub assets/staging/
→ GitHub reread verification
→ PENDING_REVIEW
→ Teacher review
```

推荐candidate pair：

```text
{asset_key}__vNNN.webp
{asset_key}__vNNN.json
```

VA不得：
- 把production asset放入 `agent-comms/`；
- 覆盖existing version；
- 直接promote ACTIVE；
- 直接把未验证candidate发布到live Supabase runtime storage。

CD / Asset Manager负责：

```text
APPROVED
→ Supabase Storage
→ runtime metadata
→ unique ACTIVE
→ runtime resolver
→ fallback / telemetry
```

## 0.1.4 Existing MASTER-01–05

V2.1不要求为了新的registry/staging流程重新命名、重新生成或重新上传已经批准的MASTER-01–05。

只有当某个Master以后正式映射为runtime candidate时，才进入canonical registry / staging workflow。

## 0.1.5 ~5% Rule-Change Threshold

除hard invariant例外：

> 如果一个新提出的workflow failure在当前真实项目流程中的实践概率经合理工程判断约不超过5%，不要为了它增加新规则、阻塞生产或重开已经同意的流程。

这只是工程heuristic，不是假装精确统计。

低概率仍可升级的狭窄例外：
- secret / credential exposure；
- destructive loss of canonical asset / student data；
- silent corruption of asset/runtime identity；
- overwrite of immutable history；
- silent security bypass。

当前结论：

> 暂不引入atomic reservation / CAS。fresh registry read + pre-commit reread + immutable staging + post-upload verification足够。只有真实multi-writer collision风险约超过5%时再升级。

## 0.1.6 Inter-Agent communication

VA进行跨Agent通信前必须读取并遵守：

```text
agent-comms/inter_agent_talk_protocol V*.md
```

中的最高ACTIVE版本。

当前alias：
- CA = Coding Audit Agent
- VA = Visual Agent
- GA = Game Design Agent
- CD = Codex

---

# 1. MASTER-01–05：默认保留，不 blanket redraw

用户已完成 Visual Agent 的 MASTER-01–05。

V2.1 不要求重新从 MASTER-01 开始。

原则：

> **Approved reference remains canon unless a V4.0 functional requirement makes it unusable.**

优先级：

1. 保留原图；
2. 用 HTML/SVG overlay 解决；
3. 做 crop / companion overlay；
4. 只修改冲突区域；
5. 最后才考虑整张重画。

## 1.1 Master ID 规则

当前正式 Master 集合只有：

```text
MASTER-01
MASTER-02
MASTER-03
MASTER-04
MASTER-05
```

规则：

- 当前不存在 MASTER-06；
- 不为凑编号自行新增 Master；
- 不重新分配已有 Master ID；
- 只有当用户明确批准一个新视觉母版成为跨场景 canon 时，才可创建新的 `MASTER-XX`；
- 新增 Master 时，必须同步更新本文件 / Asset Registry，避免 asset reality 与 documentation 再次漂移。

---

# 2. MASTER-01–05 Compatibility Review

## MASTER-01 Castle Exterior

默认：

> **KEEP**

只要仍满足：

- tower arrangement；
- central entrance；
- stone bridge / cliff relationship；
- distant mountains / lake；
- same neo-Gothic material language；
- night / moonlight continuity。

### V4.0新增要求

Final Exterior：

> **直接复用 MASTER-01 作为基础背景 / crop。**

不要重新生成另一座“相似的城堡”。

如果需要逃出后的三人：

- 只加很小的 silhouette / foreground overlay；
- 不改变castle主体。

---

## MASTER-02 Castle Interior

默认：

> **KEEP**

只要仍满足：

- abandoned；
- decayed；
- damp neo-Gothic；
- cracked stone；
- dark oak；
- black iron / aged brass；
- cold blue-grey moonlight only。

V4.0没有要求重做MASTER-02。

---

## MASTER-03 Castle Map / Spatial Master

默认：

> **KEEP，先做功能review。**

必须检查：

1. 地图空间模型中必须存在 `Main Hall`；
2. `Library → Main Hall → Portrait Hall` 可以被HTML/SVG高亮；
3. Clock Room / Great Hall / Main Gate / West Tower等相对关系不冲突；
4. **Unknown Passage 不得画在地图上；**
5. **删除旧版“左下区域被墨迹遮挡”的设定；不得用墨迹替代Unknown Passage逻辑；**
6. 不依赖AI生成准确标签；
7. route highlight由HTML/SVG负责。

如果当前MASTER-03已经符合：

> 不重画。

如果只是标签/箭头不合适：

> 修改overlay，不重画底图。

只有当地图本体真的包含Unknown Passage或空间关系冲突，才需要修改底图。

---

## MASTER-04 Recurring Props

默认：

> **KEEP，针对 ★ Silver Key 做一次spec review。**

其他prop没有功能冲突则保留。

### ★ Silver Key V4.0 locked spec

以当前已批准 MASTER-04 为canon，不为迁就旧文字重新设计。

同一把钥匙必须：

- aged / darkened silver；
- 轻微磨损；
- gothic / quatrefoil-inspired ornate bow，与MASTER-04轮廓一致；
- bow中央固定star medallion / ★ motif；
- shaft长度与比例固定；
- 固定同一不对称teeth轮廓；
- 手掌长度量级；
- 不烧入文字。

必须同一reference用于：

- Linda opening；
- Pocket；
- Unknown Passage；
- Main Gate Station C。

如果 MASTER-04 当前★钥匙已经可满足：

> **KEEP**

如果不满足：

> 只重做/替换 Silver Key prop reference，不重画无关prop。

---

## MASTER-05 West Tower Continuity

这一张需要：

> **MANDATORY REVIEW**

因为V4.0把1897 Photograph → present West Tower变成真正的visual recognition puzzle。

旧版只要求“容易认出”已经不够。

必须同时锁定三项：

1. servants' passage = pointed arch / 尖拱小门；
2. 尖拱右上有一块明显缺损石块；
3. 长黑铁 fork-shaped strap hinge；
4. 门框左侧有一个小 quatrefoil / 四叶饰纹。

> 注意：上面实际是三组识别信息，其中缺损石块、strap hinge、四叶饰纹是三个强识别点。

`prop.photo_1897` 与 `shared.west_tower_payoff` 必须同时出现这些特征。

### 是否需要重画？

- 如果现有 MASTER-05 已经具备这三项 → **KEEP**
- 如果缺1项但可局部修补 → **TARGETED REVISION**
- 如果现有结构根本无法建立同一门的visual recognition → **REDRAW MASTER-05 ONLY**

不要因此重画 MASTER-01/02/03。

---

# 3. Global Visual Canon：V1.1规则继续有效

以下不改变：

- late-19th-century Belgian/Flemish neo-Gothic；
- abandoned / decayed / damp；
- cold grey-brown stone；
- worn dark oak；
- rusted black iron；
- aged brass；
- cold blue-grey moonlight；
- moonlight = scene artwork唯一光源；
- frightening / oppressive，但不graphic / gory；
- realistic scale；
- eye-level；
- 28–35mm cinematic perspective；
- readable gameplay structures；
- UI-safe negative space。

---

# 4. 强制禁止元素

除scene明确要求，不得：

- readable text；
- logo；
- watermark；
- modern furniture；
- sockets / modern switches；
- fluorescent light；
- active warm lamp；
- lit candle；
- torch；
- fireplace glow；
- warm windows；
- smartphones；
- random people；
- random snakes；
- weapons；
- occult decoration；
- skull piles；
- gore；
- fantasy monsters。

---

# 5. V4.0 最重要的新职责边界

## 图片负责

- architecture；
- atmosphere；
- static spatial structure；
- prop appearance；
- visual continuity；
- setup/payoff recognition。

## HTML / SVG / CSS 负责

- exact text；
- numbers；
- labels；
- arrows；
- route highlights；
- ★ exact overlay if needed；
- clock hands / motion；
- door labels；
- blue indicator；
- station labels；
- countdown；
- eye overlay fade timing；
- all buttons/UI。

Student-facing runtime text默认由Codex按 **Dutch + Chinese** 双语显示。Visual Agent不负责翻译，也不得把双语文字烧进scene artwork。

唯一明确例外：
- 1897 Municipal Closure Order是diegetic historical document，runtime overlay只显示Dutch；
- Visual Agent仍不得依赖AI生成可读正文，准确Dutch文字由HTML/UI overlay。

## Audio

不属于 Visual Agent。

Visual Agent不要制作：

- wet scraping；
- snake approaching；
- alarm；
- clang；
- gate opening。

这些由 Audio Asset workflow处理。

---

# 6. UI Anchor Requirement

V4.0有多处需要网页精确叠加UI。

Visual Agent只需要：

> 把关键物体画清楚，并让位置稳定。

不要求Visual Agent手算坐标。

需要anchor的典型scene：

- Library hidden door；
- Portrait main face；
- Clock A/B/C；
- Great Hall Red/Blue/Black doors；
- Main Gate Station A/B/C；
- Watcher corridor。

### Teacher workflow

最终图生成后：

1. 用户/教师在图上画方框；
2. 标注名字；
3. Codex/工具转换为百分比；
4. Preview；
5. Teacher确认。

所以 Visual Agent必须避免：

- 关键物体太小；
- 太靠边；
- 被其他物体遮挡；
- 强透视让overlay无法准确贴合。

---

# 7. Scene-specific V4.0 Requirements

## 7.1 Opening Rooms

### Gitte

继续需要：

- old wooden bed；
- desk；
- old keys；
- Castle Map；
- note area。

不要画：

- readable 41739；
- **任何可读数字替代41739**；
- readable warning；
- dream text；
- Snake King。

`prop_gitte_number_note_front`：
- 可以有模糊、不可辨识的旧笔迹 / 压痕；
- 必须保留干净的overlay区域；
- exact `4 – 1 – 7 – 3 – 9`只由HTML显示。

### Anna

继续需要：

- old diary；
- unlit candle；
- wooden door；
- vent；
- plaque area。

准确文字由UI。

### Linda

继续需要：

- stopped watch；
- ★ Silver Key；
- thick old book；
- cracked mirror。

Government Order可作为paper prop，但准确正文由UI；该1897 artifact只显示Dutch，不做中文叠加。

---

## 7.2 Library — UPDATED

`shared.library`

必须：

- tall old bookshelves；
- central dark-oak table；
- five-digit puzzle box location；
- cold moonlight；
- damp decay；
- **背墙已经存在一扇不显眼的小旧门**。

关键：

> Unknown Passage在ACT 3已经物理存在，但玩家此时不应明显注意它。

所以：

- 不高亮；
- 不烧入★；
- 不画成发光secret door；
- 但ACT 4 crop后必须能清楚看见。

记录一个 anchor：

```text
library_unknown_door
```

---

# 8. Known Route vs Unknown Passage — 不再生成独立AI图

V1.1曾把它当成一张scene comparison image。

V4.0取消这一做法。

不要生成新的：

```text
choice.known_unknown
```

作为独立AI场景。

Codex网页组合：

```text
LEFT:
MASTER-03 / Castle Map crop
+ Known Route highlight

RIGHT:
shared.library hidden-door crop
+ ★ overlay
+ NOT SHOWN ON MAP
```

因此：

> Unknown Passage绝不能被补进Castle Map。

---

# 9. Portrait Hall — paired overlay asset

这里的“paired”是：

> **一张完整base scene + 一张透明局部eye overlay**

不是两张完整Portrait Hall AI场景图。

需要：

```text
shared.portrait_hall
overlay.portrait_eyes_open
```

## Base

- long portrait hall；
- faded portraits；
- one dominant central portrait；
- face area清楚；
- no readable text；
- no people；
- no snake。

## Eye overlay

透明 PNG/WebP：

- 只含睁开的眼睛和最小必要眼睑；
- 与base portrait透视完全一致；
- 不能重新画整张脸；
- 不能改变背景；
- 最终由Codex opacity fade。

如果已有 Portrait Hall base很好：

> 不重画base，只补 eye overlay。

---

# 10. Clock Room — static room, dynamic clocks in UI

`shared.clock_room`

必须：

- round / polygonal stone room；
- 12 old clocks；
- 3 key clocks clearly placed；
- A/B/C faces足够大；
- 尽量 front-facing；
- 为overlay留出干净表盘区域。

Visual Agent不要承担：

- 23:54；
- 11:54；
- 23:49；
- backward second hand；
- stopped hand；
- A/B/C labels。

这些由HTML/SVG。

### 现有图处理

如果现有Clock Room已经好看且三只关键表可overlay：

> KEEP

即使AI已经画了模糊的表针，只要不会和UI冲突，可由overlay遮盖。

如果三个关键表盘太小/倾斜严重：

> targeted redraw of Clock Room。

---

# 11. Great Hall — UPDATED

`shared.great_hall`

必须：

- large ruined hall；
- 3 distinguishable door positions；
- 3 old stone control positions；
- stable anchor zones；
- cold moonlight；
- no snakes initially。

门色：

- 可用暗红；
- 暗蓝；
- 黑色；

但：

> **颜色只是辅助，不是唯一识别方式。**

Codex会叠：

```text
RED DOOR
BLUE DOOR
BLACK DOOR
```

Visual Agent不烧入文字。

Door open/closed / indicator变化：

> Codex overlay负责，不要求每个state重新生图。

---

# 12. Golden Key

独立prop：

```text
prop.golden_key
```

- aged gold / brass-gold；
- heavier than Silver Key；
- mechanically plausible；
- clearly different silhouette；
- no readable text。

不需要完整Golden Key room背景。

---

# 13. Main Gate — UPDATED

`shared.main_gate`

构图必须一次解决：

- large heavy Main Gate；
- Station A；
- Station B；
- Station C；
- one dark corridor for WATCHER。

推荐布局：

```text
Station A — left foreground
Station B — center foreground
Station C — right foreground
Main Gate — center/back
Watcher corridor — one outer side
top/side negative space — UI
```

不要烧入：

- A/B/C；
- 1897；
- countdown。

Station labels由HTML。

---

# 14. 1897 Photograph ↔ West Tower Payoff

这是V2.1最高优先级的paired asset continuity。

## `prop.photo_1897`

- 4:3；
- archival；
- West Tower before sealing；
- servants' passage visible；
- three locked recognition features。

## `shared.west_tower_payoff`

- present night；
- main entrance sealed；
- servants' passage half-open；
- same three recognition features；
- same stone geometry；
- same iron hardware。

Visual Agent必须把两张图当：

> **one Teacher-controlled paired production task**

不是两次独立prompt。

Production ownership：
- Teacher负责paired prompt / continuity lock / final approval；
- 学生可以协助生成variation或局部素材；
- 但不得把 `prop.photo_1897` 与 `shared.west_tower_payoff` 分给不同学生独立生产并分别直接APPROVED；
- 两张图必须一起review三项recognition features。

---

# 15. Final Exterior

不要重新生成一个新的castle master。

`ending.castle_exterior` 必须是：

> **MASTER-01 derivative / composite**

允许：
- MASTER-01 crop；
- atmosphere-preserving composite；
- optional small silhouettes；
- minor foreground treatment。

禁止：
- 重新生成castle architecture；
- 改塔楼/桥/悬崖/湖泊关系；
- 把Final Exterior作为普通student text-to-image任务。

---

# 16. Recurring Props Canon V2.1

## ★ Silver Key

严格按Section 2 / MASTER-04 review。

## Linda Pocket Watch

保持：

- late-19th-century；
- same case shape；
- same material；
- exact 23:49 UI负责。

## Golden Key

保持独特。

## Torn Note / Government Order

纸张风格一致。

Accurate text：

> UI负责。

---

# 17. Master Style Prompt V2.1

沿用V1.1，不需要为了版本号重新生成全部图：

> **MASTER CASTLE ESCAPE STYLE**  
> Cinematic realistic game concept art set inside the same late-19th-century Belgian/Flemish neo-Gothic stone castle. The castle must feel abandoned, decayed, damp and ominous: cracked stone, worn dark oak, peeling surfaces, rusted black iron, aged brass, dust, scattered debris, faded textiles and restrained cobwebs. Maintain consistent architecture, window shapes, door design, stonework and recurring props across every image. The atmosphere should be eerie, frightening and oppressive, but not graphic or gory. **Cold blue-grey moonlight is the only illumination source in the scene artwork.** Moonlight may enter through narrow windows, broken roofs, door gaps, courtyards or reflected damp stone, but there must be no lit candles, gaslights, torches, fireplaces, lamps or warm glowing windows. Preserve deep shadows while keeping gameplay-critical structures readable. Rich environmental detail but uncluttered gameplay composition. Realistic scale and perspective, eye-level cinematic camera, approximately 28–35 mm lens feel. Leave useful negative space for web UI overlays. No readable text, no logos, no watermarks, no modern objects, no UI elements inside the artwork, no random fantasy creatures, no gore. Do not add people unless the scene-specific prompt explicitly requests them. Do not add snakes unless the scene-specific prompt explicitly requests them. High-detail, coherent with the same ruined castle and the same moonlit night.

---

# 18. Prompt Structure

每个新/修改asset：

```text
A. ASSET KEY / FUNCTION
B. REQUIRED CONTENT
C. MUST NOT
D. CONTINUITY REFERENCES
E. UI ANCHOR / COMPOSITION NEEDS
F. MASTER STYLE BLOCK
```

如果是paired asset：

```text
G. PAIRED-ASSET LOCKS
```

---

# 19. Existing Asset Revision Policy

每个旧asset review只能给下面四种结论：

```text
KEEP
KEEP + UI OVERLAY
TARGETED REVISION
REDRAW
```

默认：

> KEEP

只有功能冲突才能升级。

## 19.1 REDRAW的合法原因

- spatial relationship错；
- Unknown Passage错误烧入map；
- West Tower recognition无法成立；
- recurring prop完全不一致；
- key object不可见；
- scene与月光-only canon冲突；
- overlay-critical structure完全无法定位。

## 19.2 不能作为REDRAW理由

- “新版本更漂亮”；
- “我想换一种构图”；
- “颜色可以更高级”；
- “风格想试试别的”；
- AI agent个人偏好。

---

# 19.1 Active-game visual boundary

当前active Castle Escape在ACT 14结束。

原Behavior Trace / Compare the Three属于Post-game/Future Analysis，因此：
- 不需要为ACT15/16生成active-game scene backgrounds；
- ending visual payoff仍是MASTER-01 derivative/composite；
- ACT14文字全部由Codex/UI渲染，不烧入图片。

# 20. Recommended V2.1 Visual Production Order

因为 MASTER-01–05 已存在，不从1重新开始。

先做：

```text
1. Compatibility review MASTER-01–05
2. MASTER-05 recognition features review
3. ★ Silver Key review
4. Library hidden-door review / asset
5. Portrait Hall + eye overlay
6. Clock Room
7. Great Hall
8. 1897 Photo / West Tower **Teacher-controlled** paired production
9. Golden Key
10. Main Gate
11. Final Exterior = MASTER-01 derivative/composite only
12. remaining small props
```

如果对应asset已经存在且通过：

> skip generation

直接标：

> KEEP

---

# 21. Visual Continuity Gate

每张新图/修改图检查：

### Architecture
同一城堡？

### Material
stone / oak / iron / brass一致？

### Lighting
moonlight only？

### Spatial
不违背MASTER-03？

### Props
key/watch一致？

### Setup–Payoff
1897 photo → West Tower真的能认出来？

### Overlay
anchor能准确放？

### Readability
laptop尺寸仍可辨认？

### Artifact
无乱码、现代物件、随机蛇/人物？

---

# 22. Visual Agent交付格式

每个asset输出：

```text
Asset key:
Status: KEEP / NEW / TARGETED REVISION / REDRAW
Continuity references:
Required content:
UI anchor notes:
Must not:
Prompt:
Revision reason:
Known uncertainty:
```

如果是保留旧图：

```text
Status: KEEP
Reason: no V4.0 functional conflict
```

不要为了“有交付”而重新生成。

---

# 23. V2.1 Definition of Done

Castle Visual V2.1 生效意味着：

- V4.0是当前game-script母文件；
- 正式production candidate遵守registry → canonical naming → sidecar/checksum → GitHub staging → Teacher review；
- VA与CD的runtime publishing边界已经锁定；
- ~5% rule-change threshold生效；
- 最高ACTIVE inter-Agent protocol生效；

- V4.0成为剧情/功能母文件；
- MASTER-01–05默认保留；
- MASTER-03包含Main Hall、删除旧墨迹遮挡设定，并明确Unknown Passage不得进入地图；
- MASTER-04 ★ Silver Key接受locked spec review；
- MASTER-05接受三项recognition feature review；1897 Photo / West Tower作为Teacher-controlled paired task；
- Library hidden door从ACT 3存在；
- Known/Unknown改为web composite；
- Portrait只使用base scene + transparent eye overlay，不生成第二张完整睁眼场景图；
- Clock运动归UI；
- Great Hall door state归UI；
- Main Gate包含Watcher corridor；
- Final Exterior只能做MASTER-01 derivative/composite；
- Number Note不得生成可读数字；
- 1897 Closure Order准确文字由UI以Dutch-only artifact方式显示；
- UI anchor workflow明确；
- Audio不属于Visual Agent；
- 不进行无理由blanket redraw。

