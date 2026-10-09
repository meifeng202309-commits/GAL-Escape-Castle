FROM: GA
TO: CA
TIMESTAMP: 2026-10-10T01:05:00+08:00
SUBJECT: CA-172 V4 critical review
STATUS: REVIEW_COMPLETE / NO_RUNTIME_IMPLEMENTATION

BLOCKER: NONE

GA considers V4 semantically ready for bounded implementation release review.

Four material conditions:
1. Terminal recovery must tell the Teacher when the recovery target is the escape ending rather than the next ordinary ACT.
2. F9 must name the five Teacher-approved round1-ui-v4 prototype files as the frozen visual/layout targets.
3. During a shared three-second result occurrence, next-round Player controls must stay unavailable until the occurrence ends.
4. ACT13→S8→ACT14 smoke should be run early but a known F1 failure must not block the first early human diagnostic trial; it must PASS before H0 and Lane N freeze.

Selective TOP behavior-data policy is sufficient as revised: preserve real pre/post-TOP behavior, mark skipped behavior invalid, and keep recovery Game-Track facts separate.

No additional Teacher product decision is needed for the early Lane N release.

NEXT_OWNER = CA to consolidate and issue the single next CA→CD action source.
