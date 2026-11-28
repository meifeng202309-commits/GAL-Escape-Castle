# CA → GA — Teacher specifies ACT4/ACT5 Runtime action guidance (Nov 28)

FROM: CA — Code Audit Agent
TO: GA — Game Design Agent
TIMESTAMP: 2026-11-28T05:30:00Z
STATUS: TEACHER CONTENT DIRECTION / GA OWNERSHIP
NEXT_OWNER: GA (canonical bilingual Runtime text)
RELATED: GA-153 Runtime action-indication review; GA_RUNTIME_ACTION_INDICATION_AUDIT_20261127.csv; CA-358; Nov27 trial slide 9

Teacher explicitly requires, as part of GA's **ongoing** complete Runtime-message revision, three *phase-specific* messages. Please integrate with GA-153's 222-record inventory and universal action-guidance principle instead of a new separate pass. Teacher's Chinese proposed copy:

1. **ACT4 private first choice** (before private Action choice): **“你个人倾向于走哪个通道？在ACTION区做出选择。注意，这只是你私下的意见，你的朋友并不知道。”** Key semantic requirements: personally favored route, Action choice, no disclosure of other GAL's private choices at this phase. Bilingual NL/ZH.
2. **ACT5 true group ballot** (only when actual voting is open, not during discussion countdown): **“现在开始投票，所有人按照获得多数票的选择行动。”** Clarify it is separate from private first choices; only show when authoritative vote controls available; adapt action location if necessary and ensure 3 live votes needed.
3. **ACT5 no-majority genuine tie** (when 1:1:1 no consensus, before newly opened revote): **“没有形成多数票，重新讨论并再次投票。”** Do not show this on a 2:1 majority. Include Discussion-vs-Action phase correct timing in NL/ZH.

CA independently verified the Nov27 TEST-1 case: ACT4 private first choices were inspect / inspect / known (2:1); ACT5 first formal group ballot actually inspect_first / known / unknown (1:1:1); the next ballot was unknown x2 / inspect_first x1 (2:1). The server calculation is **correct**, but visible old first-choice list led Teacher to interpret 2:1 as the current ballot. New Runtime messaging must distinguish both phases with action indication and privacy constraints.

Please use existing GA-approved Runtime manifest/role Page IDs; avoid revealing private votes in shared text. Compose exact NL/ZH versions and revise only canonical GA-owned files when Teacher's textual direction allows, or mark remaining editorial details for brief Teacher review. Send **one consolidated** GA→CA/CD handoff for this and other GA-153 Runtime changes; no deployment authority and no functional SQL/vote modification. Source-only. Keep CA's physical UI/share/server tasks outside GA.

Ownership: GA for story/copy, CD for later implementation of approved text, CA for coordinating non-Runtime changes.
