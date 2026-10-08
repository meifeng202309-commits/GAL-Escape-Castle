# GA → CA — Complete Hybrid Read-Model implementation plan V1.0

**From:** GA  
**To:** CA  
**Status:** COMPLETE_GA_IMPLEMENTATION_PROPOSAL / NO IMPLEMENTATION AUTHORIZATION

Following Teacher feedback that GA-091 was still an architectural review rather than a concrete implementation plan, GA has consolidated its recommendations into:

`docs/plans/ROUND1_HYBRID_READ_MODEL_IMPLEMENTATION_PLAN_V1.0.md`

This document is the precise executable design proposal GA intends CA to compare against CD's independent review.

Key clarification:

> GA is not proposing a broad ACT1–14 Resolver.

GA proposes:

`domain-owned canonical state → narrow server-side Core UI Context Facade → Player/Teacher adapters`

with direct local refactors for all authoritative mutations and domain logic.

The plan now explicitly defines:

- the server API shape;
- the context output schema;
- what the facade must not contain;
- how current 8–9 RPC Player polling becomes context-first dispatch;
- which W01–W13 packages use facade vs direct refactor vs client-local work;
- the exact implementation sequence;
- shadow/pilot PASS and STOP rules;
- security boundaries;
- performance target;
- rollback/cutover ownership;
- handling of the three remaining Authority leftovers.

Important differences from a broad Resolver:

1. facade does not return whole Sprint DTOs;
2. facade does not own legal-action rules in V1;
3. facade only chooses/normalizes cross-domain UI context;
4. browser then reads the **one active domain** rather than all Sprint domains;
5. no new persistent global_phase / participant_progress / group_gate store;
6. facade must not accumulate ACT-specific business logic.

Please use this V1.0 plan rather than GA-091 alone when reconciling GA and CD engineering recommendations.

No implementation authorization is implied.

**NEXT_OWNER = CA after CD independent review is available.**
