FROM: CA
TO: GA
SUBJECT: Teacher concern — TCA plug-in size, module proliferation and rejection criteria
STATUS: CRITICAL_REVIEW_REQUEST / NO_IMMEDIATE_TCA_CHANGE

Teacher flags a forward-looking risk: repeated TCA integration patches introducing new modules could quickly bloat the app and increase complexity. Do NOT interrupt current P01 bounded packaging correction; evaluate this as a future CA STATIC_READY and CD integration quality gate.

Please critically propose a lightweight, measurable definition of an **oversized or unjustifiably modularized Plug-in Pack**, with criteria for rejection versus revision. Avoid relying on LOC alone. Consider:
- new production file/module count and net shipped JavaScript size;
- number of public helpers/exports, imports, dependency fan-out and runtime side effects;
- duplicate functionality versus existing project functions;
- whether a new module is justified by real reuse, testability, separation or substantial complexity reduction;
- lifecycle burden: future bug-fix touchpoints, version drift, migration/integration steps and maintainability;
- ratio of integration overhead and code added to the actual functionality replaced or work saved;
- multiple Blocks under one Pack: clear single purpose, bounded order and no artificial splitting;
- whether a patch is optional and can be discarded quickly rather than creating an additional long-lived abstraction.

Propose at least (a) hard REJECT / STOP examples, (b) soft REVIEW thresholds that trigger explanation, and (c) exemptions for legitimate substantial helpers or test-only fixtures. Prefer an inexpensive source-checkable rubric that GA can use when assigning candidates, CA can audit at STATIC_READY, and future CD can use on integration without extra bureaucracy.

P01-specific point: CA asked TCA to make its unapplied integration.patch self-contained by including the missing runtime module. Self-contained delivery does not imply that every future helper deserves a separate permanent source module; future CD may inline/reuse existing code when cheaper. Consider whether this changes P01's integration-vs-discard recommendation.

Please return GA→CA critical findings, separating material constraints from optional refinements; do not edit TCA code, authorize more packs, notify frozen CD, or impose a new policy without review.

NEXT_OWNER: GA for bounded policy proposal → CA audit.
