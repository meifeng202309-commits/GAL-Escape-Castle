# Teacher Hands-On Instructions — V4 Two-Scene Isolated Pilot

This review is synthetic and isolated. It does not create a room, contact production Supabase, change GitHub Pages or use the live game environment.

## One-command functional review

From the repository root in PowerShell:

```powershell
$env:NODE_PATH='C:\Users\59743\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\59743\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tests/v4-two-scene-pilot-browser.mjs
```

Expected final line:

```text
V4 two-scene pilot browser evidence passed.
```

The preceding JSON must show `act10Messages: 9`, `teacherOpenVote: 1`, `act3Submits: 1`, `pocketInspects: 1`, `pocketFlips: 1`, and `screenshots: 8`.

## Interactive ACT10 review

From the repository root in PowerShell:

```powershell
$env:NODE_PATH='C:\Users\59743\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\59743\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tests/v4-two-scene-pilot-interactive.mjs --scene=act10
```

The launcher opens three isolated Player contexts (Gitte, Anna and Linda) and one current `teacher.html` context. The terminal prints:

```text
V4_INTERACTIVE_READY scene=act10 players=3 teacher=1 network=synthetic-only
```

Freely type, send and scroll in all three Player windows. In the Teacher window, use **Open vote now** and confirm the Player windows transition away from discussion. No Supabase credentials are requested or used.

Also confirm these message-list rules:

- When the discussion scrollbar is already near the bottom, an incoming message automatically follows to the newest message.
- After deliberately scrolling upward to read older messages, incoming messages do not move that reading position.
- After a successful Send, the composer clears and remains focused for the next message.
- If a Send reports an error, the unsent draft remains in the composer.

### Required Chinese IME retest

1. In one ACT10 Player message box, enable your normal Windows Chinese IME.
2. Begin composing Chinese text (for example type `nihao`) but do **not** choose a candidate or press Enter yet.
3. Keep the composition/candidate UI open for at least 4 seconds, covering at least three 1.2-second polling periods.
4. Confirm the candidate UI and unfinished composition remain active; the field must not degrade into committed Latin letters and nothing may send automatically.
5. Choose the intended Chinese candidate, then click Send.
6. Confirm the committed Chinese message appears once in another Player window.

The automated suite verifies composition event/node preservation, but only this hands-on step validates the actual Windows IME candidate UI.

To stop, return to the PowerShell window and press **Enter**. The launcher closes all four contexts and the local server.

## Interactive ACT3 review

```powershell
$env:NODE_PATH='C:\Users\59743\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\59743\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tests/v4-two-scene-pilot-interactive.mjs --scene=act3
```

The launcher again opens three Player contexts and one Teacher context. Enter the remaining digits, inspect Pocket items, flip the watch and scroll freely. The ACT3 Teacher context is observational; Open Vote is intentionally unavailable because ACT3 has no ACT10 vote projection. Press **Enter** in PowerShell to stop.

## Visual review

Inspect the eight PNG files under `docs/reports/remediation/ui/v4-two-scene/screenshots/`:

- ACT10 at 1440×900, 1366×768, 1280×720 and 768×1024.
- ACT3 at the same four viewports.

Check that the scene remains primary, Discussion and Pocket are separate regions, mobile order is scene → discussion → Pocket, text and controls are not clipped, and no horizontal scrollbar is visible.

## Stop condition

Do not publish, change Pages, connect a real room or edit production source during this review. Record visual PASS/FAIL against the exact CD implementation commit named in the latest CD→GA/CA handoff. Any integration request requires a new CA authorization.
