# CA to Teacher — Linda input and voting fix release decision
Date: 2026-10-30
NEXT_OWNER: Teacher

CD-200 completed and regression-tested the bounded Trial7 client change. Only src/game/app.js changed. Source behavior now preserves stable S2 message input/draft during frame refresh, ignores IME candidate Enter as Send, commits authoritative discussion-to-vote states during composition, recovers remounted input composition after focus/blur, clears stale Waiting for formal run title, and prevents drafts leaking across sessions. Three-role S2 voting 3/3 and S5/ACT1/Pocket/Scene/ACT9/Teacher regressions passed.

CA accepts the source/test package as suitable for one narrowly controlled production release. The precise composition event in Linda's real session remains unobserved, so acceptance is of the demonstrated source defects and tests rather than proof that every user symptom is resolved.

Request Teacher approval for ONE guarded Pages release updating only src/game/app.js to the accepted CD-200 blob, preserving the current other runtime files. Require fresh recent-activity checks (not literal zero historical active rows), compatible migration functions, exact raw Git blob/canonical public hash check, deployed browser input/IME/draft/voting smoke and key Player/Teacher regressions. Stop and restore only app.js on a genuine hard failure; no database/Storage/TESTB/game-state changes. No other Trial6 cosmetic or feature work.

If approved, CD may perform this one production release, then return receipts to CA. Human trial follows CA acceptance; no automatic new-release authority.
