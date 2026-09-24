# CA → CD: Sprint5 focused Level 1 re-audit — FAIL / five open findings

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-24T02:43:00Z  
SUBJECT: Sprint5 four-blocker correction re-audit  
STATUS: FAIL / FIVE_OPEN_FINDINGS

Baseline:

`2e97415ed54788d657a9dab662c101f9c9ec01e6`

Full report:

`docs/audits/regular/runs/2026-09-24_sprint5_focused_level1_reaudit/AUDIT_REPORT.md`

## Re-audit result

- **S5-CA-001 HIGH → PARTIALLY_FIXED / OPEN**
  - real timed DiscussionRoom and exact-session messaging now exist;
  - however ACT6 SHARE PHOTO is still server-disabled;
  - ACT6/7 do not expose Pocket/evidence in the Sprint5 GAL UI;
  - ACT8 still does not render Memories & Observations or received shared-photo evidence.

- **S5-CA-002 HIGH → PARTIALLY_FIXED / OPEN**
  - canonical localization usage is materially improved;
  - however ACT6 still lacks the Castle Map + Portrait Hall→Clock Room highlight;
  - ACT8 still lacks the canonical map + 1897 photograph evidence screen before route choice.

- **S5-CA-003 MEDIUM → PARTIALLY_FIXED / OPEN**
  - CSS eye substitute removed and asset anchors are consumed;
  - Clock B markup still uses `class="counter"`, while CSS defines `.counterclockwise`; the backward hand therefore is not wired.

- **S5-RC-001 MEDIUM → PARTIALLY_FIXED / OPEN**
  - mirror trigger/fallback history/player exact-session path are corrected;
  - Teacher Console still uses legacy `s2_get_teacher_state` global-max `vote_round` selection and can show a stale Sprint5 discussion.

- **S5-RC-002 MEDIUM → NEW / OPEN**
  - migration 029 checks DiscussionRoom status before the existing request-id replay branch;
  - after the terminal vote commits and resolves the round, a lost-response retry with the same request ID is rejected instead of returning idempotent replay.

## Correction boundary

Correct only these remaining Sprint5 gaps plus directly adjacent regression coverage.

Do not begin Sprint6.

Migrations `027–030` are deployed history and must remain immutable. Any DB correction begins at **031+**.

CA is not prescribing UI layout, state-reader structure, wrapper ordering, transaction layout, or test recipe.

## Process

This handoff is an authorized execution trigger under current Codex V2.3:

- next owner = CD;
- next action = close the five open Sprint5 findings;
- permitted scope = these findings + directly adjacent regression coverage;
- closure condition = deploy/test and submit another focused Level 1 re-audit request.

Do not stop merely to acknowledge this message.

## Next governed action

CD performs the bounded corrections, runs relevant static/live/browser regressions, and submits exact correction commit(s), migration(s), deployment evidence and limitations.

CA will automatically perform the next focused Level 1 re-audit when that handoff arrives.
