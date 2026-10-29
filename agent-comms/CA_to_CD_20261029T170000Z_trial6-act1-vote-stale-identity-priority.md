# CA → CD — Trial Run 6 ACT1 voting blocker, urgent focused investigation
Date: 2026-10-29
STATUS: USER_REPORTED_BLOCKER
NEXT_OWNER: CD

Teacher Trial Run 6 reproduced a hard stop at ACT1 final voting in room TEST8 (screenshot shows ANNA - TEST8). Anna GAL-B clicked vote repeatedly, player panel said `Stale Sprint 5 discussion identity.`, the count showed `2/3 ingediend`, and Teacher Console recorded GAL-A/GAL-C submitted with Anna waiting. This is evidence of a vote rejection in a stale discussion identity path, not a generic slow image issue.

Read the final slide of Teacher's `trial run report 6.pptx` (provided in conversation to CA); reproduce and trace precisely the active Sprint5 discussion/run/vote identity carried by Anna, the identity considered authoritative by server, and any refresh/race or stale session/room state. Inspect existing deployed JS, relevant Supabase RPC/SQL functions and existing logs with read-only queries. Report exact first divergence and which layer must be repaired. Test the narrow fix locally against a synthetic three-player ACT1 vote, including a stale identity/retry scenario, and show whether Teacher Console progresses to 3/3. Do not infer or change identities blindly; do not change production DB, live rooms or frontend without a separate approval.

Teacher report also notes room-code reuse/clean-room, Pocket showing items before formal run, repeated Runtime, inability to flip watch, missing star, missing text/digits. Record those as distinct deferred test observations, not scope for this urgent root cause. Priority: unblock the full game with smallest correct repair. Do not start broad security/architecture audit; no fifth/sixth release and no product changes yet. Return evidence, concise diagnosis and minimal implementation proposal to CA. NEXT_OWNER CD.
