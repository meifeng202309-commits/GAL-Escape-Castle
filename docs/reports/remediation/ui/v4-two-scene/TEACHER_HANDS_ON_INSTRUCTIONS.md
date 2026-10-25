# Teacher Review Instructions — V4 Two-Scene Isolated Pilot

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

## Visual review

Inspect the eight PNG files under `docs/reports/remediation/ui/v4-two-scene/screenshots/`:

- ACT10 at 1440×900, 1366×768, 1280×720 and 768×1024.
- ACT3 at the same four viewports.

Check that the scene remains primary, Discussion and Pocket are separate regions, mobile order is scene → discussion → Pocket, text and controls are not clipped, and no horizontal scrollbar is visible.

## Stop condition

Do not publish, change Pages, connect a real room or edit production source during this review. Record visual PASS/FAIL against the exact CD implementation commit named in the CD→GA/CA handoff. Any integration request requires a new CA authorization.
