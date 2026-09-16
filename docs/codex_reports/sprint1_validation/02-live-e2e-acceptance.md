# Execution Report

Date/time: 2026-09-17 Asia/Shanghai  
Repository: `meifeng202309-commits/GAL-Escape-Castle`  
Branch: `main`  
Tested migration: `database/001_sprint1_core.sql`  
Step: Sprint 1 Live End-to-End Acceptance Validation  
Status: PASS

## 1. Objective

Verify the current Sprint 1 hardening deployment against the existing Supabase project and deployed GitHub Pages frontend.

Supabase project:

```text
https://qdcbdcjobzytzhnhfwyn.supabase.co
```

GitHub Pages frontend:

```text
https://meifeng202309-commits.github.io/GAL-Escape-Castle/index.html
https://meifeng202309-commits.github.io/GAL-Escape-Castle/teacher.html
```

Sprint 2 was not started.

## 2. Deployment Status

The migration was not modified during this validation pass.

The current repository migration had already been applied in Supabase SQL Editor after the `extensions.digest(...)` fix. Live RPC verification now confirms that the deployed database matches the current Sprint 1 hardening behavior.

## 3. Tests Run

Commands:

```text
node tests/sprint1-static-check.js
node --check tests/sprint1-live-e2e.js
node tests/sprint1-live-e2e.js
```

Browser checks:

- Opened deployed Teacher Console through GitHub Pages.
- Opened deployed Student page through GitHub Pages.
- Confirmed visible Teacher Console controls, including teacher token Show button.
- Confirmed visible Student Join form.

## 4. Live E2E Result

`node tests/sprint1-live-e2e.js` passed 26 checks.

Verified checks:

| Area | Check | Result |
|---|---|---|
| GitHub Pages | Student page, teacher page, student JS, and teacher JS return HTTP 200 | VERIFIED |
| Direct table access | Anonymous direct table access returns 0 visible decision rows | VERIFIED |
| Room creation | Teacher can create a new room | VERIFIED |
| Teacher access | Invalid teacher token cannot read teacher state | VERIFIED |
| Room creation | Empty join codes are rejected | VERIFIED |
| Room creation | Duplicate join codes are rejected | VERIFIED |
| Room creation | Existing `room_code` is rejected | VERIFIED |
| Room creation | Existing room data is not overwritten | VERIFIED |
| Three-player join | Gitte joins with assigned code | VERIFIED |
| Three-player join | Anna joins with assigned code | VERIFIED |
| Three-player join | Linda joins with assigned code | VERIFIED |
| Three-player join | Each player receives correct role | VERIFIED |
| Join hardening | Used join code cannot take over active player | VERIFIED |
| Privacy | Teacher sees submitted marker only before reveal | VERIFIED |
| Choice validation | Browser-supplied label is canonicalized server-side | VERIFIED |
| Choice lock | Duplicate private choice is rejected | VERIFIED |
| State machine | Advance from collecting is rejected | VERIFIED |
| Reveal | Reveal occurs after all three private choices | VERIFIED |
| Reconnect | Existing session token restores player and locked choice | VERIFIED |
| Advance | Teacher can advance after reveal | VERIFIED |
| Reset | Teacher reset clears decisions and returns to scene 1 | VERIFIED |
| Recovery | Claimed role rejects rejoin before release | VERIFIED |
| Recovery | Teacher release allows prototype recovery rejoin | VERIFIED |
| Race hardening | Concurrent double-join allows exactly one claim | VERIFIED |
| Race hardening | Teacher state shows only one claimed role | VERIFIED |
| Invalid choice | Invalid choice id is rejected | VERIFIED |

## 5. Evidence Summary

The live E2E test generated fresh random rooms and test credentials. No real classroom tokens, teacher tokens, student session tokens, or service-role keys were written to this report.

Representative output:

```text
Sprint 1 live E2E passed: 26 checks.
```

Important pass lines:

```text
PASS A4 creating an existing room_code is rejected
PASS A5 existing room data is not overwritten
PASS B5 used join code cannot take over active player
PASS C1 private choice hidden before reveal
PASS C2 browser-supplied choice label is canonicalized
PASS C4 advance from collecting is rejected
PASS E1 concurrent double-join allows exactly one claim
PASS F1 invalid choice id is rejected
```

## 6. Devil Check Findings

| Risk | Result |
|---|---|
| Existing room overwrite | VERIFIED mitigated by create-only room creation. |
| Silent join-code takeover | VERIFIED mitigated by claimed-role rejection. |
| Concurrent double-join race | VERIFIED mitigated; exactly one concurrent claim succeeded. |
| Teacher accidental advance | VERIFIED mitigated; collecting-phase advance is rejected. |
| Browser choice-label tampering | VERIFIED mitigated; canonical server label is stored. |
| Lost student incognito session | VERIFIED recoverable through teacher-authenticated release. |
| Public teacher page | KNOWN LIMITATION; controls still require room-specific teacher token, but this is not full production authentication. |
| Mis-shared unused join code | KNOWN LIMITATION; Sprint 1 has no personal account system. |

## 7. Known Limitations

- This validation used automated independent RPC sessions and browser page-load checks, not three physical student devices.
- Teacher access is still prototype-level room token protection, not full account authentication.
- Join codes remain classroom credentials; a mis-shared unused join code can claim the wrong role.
- GitHub Pages is public; secrets must not be placed in frontend source.
- Sprint 1 still uses polling, not Supabase Realtime.

## 8. What Was NOT Changed

- No migration changes were made during this validation pass.
- No Sprint 2 functionality was added.
- No DiscussionRoom was added.
- No Agent analysis was added.
- No behavior aggregation or prediction system was added.
- No Asset Manager was added.
- No full story scenes, final vote, inventory system, or clue engine was added.

## 9. Conclusion

Sprint 1 hardening deployment and live acceptance validation are VERIFIED PASS for the tested scope.

Sprint 2 remains unauthorized until the user explicitly approves it.
