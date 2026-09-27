# BASELINE — Teacher Trial Level3 Independent Snapshot Audit

- **Protocol:** `Independent_Development_Snapshot_Audit_Protocol_v1.3.md`
- **Product baseline SHA:** `93bd15ca36dd985685a0706bad9ec56ba4002a6e`
- **Audit restart / protocol-complete execution:** 2026-09-27
- **Highest included migration:** `database/058_sprint9_active_asset_load_failure_telemetry.sql`
- **Database migration history:** 001–058 inclusive; immutable history assumption under current governance
- **Deployment model:** GitHub Pages frontend + Supabase REST/RPC backend
- **Configured Supabase project URL at frozen baseline:** `https://qdcbdcjobzytzhnhfwyn.supabase.co`
- **Dynamic-access status for this CA runtime:** direct authenticated/live RPC execution is not available through the current audit toolchain; deployment-effective claims requiring live POST/RPC are marked **NOT VERIFIED** unless supported by Teacher screenshots or prior frozen evidence
- **Teacher live evidence:** original `GAL问题报告.pptx` inspected; repository mirror `docs/tmp files/GAL问题报告_20260927_teacher-trial-evidence.md`
- **Previous released trial baseline:** `6b8730f999a7de4aa58f0444d9a2f75f76377302`

## Runtime entry files

- `index.html`
- `teacher.html`
- `src/game/app.js`
- `src/game/asset-runtime.js`
- `src/teacher/teacher-console.js`
- `src/supabase/client.js`
- `src/supabase/config.js`
- `src/state/session.js`
- `src/content/scenes.js`
- `src/content/localization.generated.js`

## Test surface

35 repository tests are in scope, including Sprint1–Sprint9 static/live E2E scripts, SQL integrity regressions, and Level2/Level3 closure tests. Exact inventory is recorded in `TEST_BLIND_SPOTS.md`.

## Included scope

- room creation / join / session recovery;
- pre-run and formal-run startup;
- ACT1–ACT14 reachable current product behavior;
- DiscussionRoom/voting;
- Teacher controls and Override;
- reconnect/stale/retry authority;
- finalization/export;
- image/audio resolver + placeholder/fallback;
- post-CA-130 media integration;
- final effective database/RPC/RLS source state through migration058;
- legacy/shadow runtime paths;
- persisted evidence reconstruction.

## Excluded / NOT VERIFIED scope

- production-class identity/authentication redesign beyond current prototype canon;
- physical three-device browser execution from this CA runtime;
- live Supabase POST/RPC mutation tests not executable by current tool access;
- actual CDN/browser latency and audio-autoplay behavior except where deterministically inferable from source or Teacher evidence.

Any excluded area that affects a hard invariant is recorded as NOT VERIFIED rather than silently passed.
