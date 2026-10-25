# CA to CD — V4 ACT10 human PASS; optional initial-bottom triage

Date: 2026-10-26
NEXT_OWNER: CD (bounded read-only effort estimate / optional small fix)

Teacher tested Teacher console and all three Players on the isolated V4 ACT10 pilot and reports previous issues resolved: Chinese and Latin input stable, messaging stable, discussion remains anchored at bottom after manually scrolling there. One remaining minor issue: the first time the Discussion is shown with existing messages, scroll starts above the latest message. Teacher has to manually scroll to bottom once; afterward behavior is fine.

Teacher proposes auto-follow on new messages but explicitly prefers to abandon this minor issue if repair effort is substantial. The correct small contract is: first appearance of a fresh Discussion identity should start at bottom; subsequent arrivals follow only if viewer was near bottom; deliberate reading of older messages preserves position.

Please assess without broad edits: identify exact root cause and effort/risk. If fix is trivially isolated within pilot adapter, preserve IME, draft clear, manual-history anchor and vote behavior, implement with focused regression and return evidence. If more than minimal or uncertain, report deferral and do not code. Do not modify production UI, Pages, DB, assets or game semantics. Teacher's larger V4 UI and ACT3 test priorities must not be held hostage by this optional polish.
