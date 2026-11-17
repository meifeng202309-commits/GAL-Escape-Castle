# 2026-11-17 真人试跑 — Player 结尾重播与 Join

记录 2026-11-17T04:50:16Z。来源为 Teacher 现场反馈及 Edge 截图（黑屏显示 “Einde / 结束”）。审查上线基线 `8a1fd0b7fb91dd30bbcb34e3ddeb05af86c3219e`。本次为只读源码核查，未访问或操作进行中的试跑房间。

## A. Edge 刷新重播旧结尾，结束画面挡住会话切换

现场观察：首次打开 Player 页进入上次游戏结尾，从“你们终于逃出来了”播到“结束”；刷新后重复，无法进入 Join。后一次查看停在 “GAL 逃出”末幅画面，未持续播放后续信息；当 Switch session 可用时，点击后可以使用更新的房间号进入新游戏。后一表现为何不同尚无该次页面状态或请求记录。

已确认的代码机制：

1. `src/state/session.js:1–15` 将会话保存在浏览器 localStorage。启动时 `src/game/app.js:42,160–165` 读回旧房间和 session token，直接显示游戏界面并请求状态。重新加载页面不会删除旧会话。
2. `src/game/app.js:244–253,292–296` 先取完成状态。当服务器仍为该旧凭证返回 completed 投影时，客户端调用结尾渲染。结尾只用页面内存变量 `sprint8RevealRunId` 去重（`58,768–799`），刷新会重置该变量，结尾从头调度。
3. `src/styles/app.css:29` 的终幕容器一直全屏覆盖（fixed/inset 0/z-index 20），最后一幕只有结束文字。Switch session 在下方游戏面板工具栏（`index.html:32` 附近），终幕自身没有退出入口。可见时点击它会清除本地旧会话并显示 Join（`src/game/app.js:151–158`）。因此问题可由通用客户端机制解释，未证实为 Edge 专属。正常的进行中断线恢复仍需保留。
4. 重用同一房间时，迁移 075 的 Teacher Prepare next run 会清除上轮玩家凭证（`database/075_teacher_trial_p1_room_reuse.sql:35`）；刷新、切换会话和 Teacher Prepare 是不同动作。

后续收敛：用完赛的虚构房间和同一浏览器配置验证刷新／重开不重复播放旧结尾，完成后可直接返回 Join 或使用持续可见的 Switch session；核对进行中重连。另查 Switch session 时是否需要取消尚未结束的终幕计时器，现有 stopPolling 未清理该计时器。

## B. Chrome Join 首次未成功，刷新后成功

现场观察：Chrome 显示 Join，首次无法接收新 Room code；刷新后可加入并显示 “Waiting for formal run”；另一台电脑的 Chrome 可正常加入。原始报告没有首试操作方式、状态文字、请求结果或准确的 Teacher 建房/Prepare 时间。

源码证据（`src/game/app.js:140,167–201,244–253,298–300`）：Join 按钮点击后即时读取两个输入值，发送 `s1_join_player`，请求结束后恢复按钮，错误显示于 Join 面板。两个码都必填，Room code 会去首尾空格并转大写；Join code 去首尾空格。页面没有给两输入框绑定 Enter 提交。进入 “Waiting for formal run” 是成功接入但尚无正式运行的状态。源码未发现必须先刷新才能接收新房间号的条件。

待定根因：缺少首次失败时的 Join 提示或请求时间/结果，无法判断是按 Enter 没触发、点击后没发请求，还是请求被后端拒绝或未完成。下一次复现时只记录是否点击、屏幕提示、`s1_join_player` 是否发出与响应状态/耗时，以及 Teacher 建房/Prepare 的先后。记录中不要包含房间凭证或会话令牌。先用虚构房间对照两种浏览器配置，不打断当前试跑。
