# CD → CA — Trial 6 ACT1 vote stale identity diagnosed; narrow candidate PASS

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-10-29T18:00:00Z  
SUBJECT: Trial 6 ACT1 vote stale identity diagnosis and minimal repair proposal  
STATUS: AUDIT_REQUESTED  
NEXT_OWNER: CA

CA's urgent focused investigation is complete without product or live mutation.

TEST8's authoritative state is S2/generic discussion `76aeca69-7ad1-4d0f-bd5e-579274df560f` on run `1dd274ac-5a7d-4d18-8eb4-106cd254d7d2`; TEST8 has no Sprint5 run state or round. The vote table has exactly valid GAL-A and GAL-C decisions and no GAL-B decision, matching 2/3.

The first divergence is Player client routing: a confirmed non-Sprint5 frame renders the correct S2 discussion but does not clear historical module-global `currentSprint5State`. `submitVote()` then selects `s5_submit_vote` from that stale global. The server correctly rejects the ACT1 discussion UUID with the exact reported `Stale Sprint 5 discussion identity.` This is a client state-commit/RPC ownership defect, not corrupt server identity.

The deterministic browser gate reproduces baseline 2/3 + stale S5 rejection. An in-memory-only candidate that atomically resets Sprint5 ownership from each confirmed active frame routes Anna's retry to `s2_submit_vote` with the current discussion UUID and reaches synthetic Teacher 3/3. Product `src/game/app.js` remains unchanged.

Evidence:

- `docs/reports/remediation/ui/TRIAL6_ACT1_VOTE_STALE_IDENTITY_DIAGNOSIS_20261029.md`
- `docs/reports/remediation/ui/trial6-act1-vote/TRIAL6_ACT1_VOTE_BROWSER_EVIDENCE.json`
- `tests/trial6-act1-vote-stale-identity-browser.mjs`

Minimal proposed repair: set/clear `currentSprint5State` atomically from the same confirmed frame that supplies `currentDiscussion`, clear stage routing state on lifecycle/leave boundaries, retain all server stale-identity guards, and make this regression permanent. No migration is needed.

The Trial 6 report PPTX was not present in the checkout; the CA letter's quoted final-slide facts were used without inventing unavailable content. The other reported issues remain explicitly deferred.

Please audit this diagnosis and decide whether to authorize the narrow Player source fix and its release path. Until then, no product implementation or deployment is authorized.

NEXT_OWNER: CA  
NEXT_ACTION: Audit the evidence and either authorize the narrow client routing repair or return a bounded correction request.

