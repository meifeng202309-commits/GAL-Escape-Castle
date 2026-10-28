# Trial4+5 image fix read-only release preflight

Date: 2026-10-29  
Authority: `CA_to_CD_20261029T013000Z_image_fix-source-accepted-release-preflight.md`

## Disposition

**NOT READY FOR RELEASE DECISION.** The accepted runtime target is source commit `ca0e2ba`. The preflight found two evidence/test blockers that cannot be corrected under the present read-only authorization:

1. Existing `tests/sprint9-asset-resolution-cache-behavior-check.mjs` still requires failed/missing resolutions to be cached for 30 seconds. It fails against the newly accepted rule that transient failed/null results must retry immediately.
2. No existing browser fixture directly exercises an unchanged ACT6 or ACT8 image cycle. Common-path/static coverage exists, but CA explicitly requested at least one direct ACT6/8 cycle.

No production change was made.

## Exact runtime delta and payload

Recovered public-compatible baseline: `727ed7cd360c970b20874c7d5d0fc1b64826a92b` (also restored by `d3e3da984b5a83b0d6406de723f27072834e721f`). Target: `ca0e2ba`.

The prior four-file payload is no longer sufficient because `src/game/app.js` imports `src/game/asset-runtime.js`. A future exact release/recovery must treat these **five** files atomically:

| File | baseline blob | target blob |
|---|---|---|
| `teacher.html` | `7788b46939a52ad61ec188019b48d0e7381b4eec` | `d07667b2fa3eac5d8d168d52136fa7db647ec697` |
| `src/game/app.js` | `bb00ebf922eaa7af03118efdd564527b68fe901b` | `c8d3ba2ea071d2783e221cc43bdf962a01955a46` |
| `src/game/asset-runtime.js` | `9c98a4b56dfa2526281517973e02a453f18e07af` | `608063351c4d10eac800f52ec14e673747e9cf2e` |
| `src/styles/app.css` | `7174f36e5407360c03364b7df758dd2b94d2f581` | `5b0a0fa18042b469084a59397088927fe259d65f` |
| `src/content/localization.generated.js` | `ef37d7e251280d7eab620454e98eb028dcc51229` | `dc644f4a8fba6e583d4764f38f0cba44a55b575e` |

The GA-protected canonical catalog CSV has no delta from the previously accepted candidate `8594f2e` to `ca0e2ba`. P7 role/Pocket, Teacher, tie-ordering and layout gates still pass.

## Read-only verification

PASS: `asset-runtime-image-stability`, V4 Player static, ACT9 migration073 static/policy, Sprint5 static, A1 polling static/browser, Trial4+5 P7 browser, and V4 integrated browser. The integrated browser directly passed ACT9 Scene identity persistence, ACT9→ACT10 real no-asset scene removal, Runtime viewport persistence, and role Pocket decoded media. P7 passed all three roles and Pocket at both approved viewports.

FAIL: `sprint9-asset-resolution-cache-behavior-check.mjs`, solely at its obsolete expectation that missing assets resolve once per 30 seconds. This conflicts with the newly accepted failure-retry semantics.

GAP: no direct unchanged ACT6/8 browser image-cycle fixture exists under current tests. This cannot honestly be reported as PASS from shared-path inference alone.

## V1.1 shared-mechanism check

Scene/Pocket ownership, state/RPC producers, ACT/role semantics, localization authority, failure behavior, DOM identity, protected catalog and regression consumers were reviewed. The new resolver dependency changes release packaging but not database, Storage, room, gameplay or canonical-text authority.

## Exact future recovery and smoke plan

If separately authorized after blockers close: verify branch/head and all five target blobs; release only those five files; require built Pages state and public SHA-256 equality. Smoke all roles/Pocket at 1280×720 and 1366×768, direct ACT6/8 unchanged cycle, ACT9 persistence, real scene change/removal, Teacher/tie/layout gates, connected decoded positive-dimension images, correct role asset keys and zero endpoint failures. Record cold-load latency as telemetry, retain existing hard gates unchanged, and treat any 29-second-level stall as failure. On any gate failure, restore all five files to the `727ed7c` blobs, await built Pages state, and verify public recovery hashes before stopping.

Required next authorization: a narrow test-only correction updating the obsolete cache test and adding one deterministic ACT6 or ACT8 unchanged-image browser cycle. A release decision should follow only after those gates pass.

