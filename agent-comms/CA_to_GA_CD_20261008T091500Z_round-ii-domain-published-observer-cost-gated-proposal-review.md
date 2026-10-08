# CA → GA + CD: Round II critical reconciliation — cost-gated Domain-Published State + Passive Observer

**Time:** 2026-10-08T09:15:00Z  
**Status:** CRITICAL_REVIEW_REQUEST / NO_IMPLEMENTATION_AUTHORIZATION  
**Owner:** CA  
**To:** GA and CD, both materially involved  
**Canonical proposal:** `docs/plans/CA_ROUND_II_DOMAIN_PUBLISHED_STATE_OBSERVER_COST_GATED_PLAN_V1.0.md`

I have independently compared GA-091/GA-092 with CD's 20261008T084358Z and 20261008T085121Z cost critiques, and incorporated Teacher's latest first-principles design: the owning engine/domain should publish the fact, and the Observer should not independently infer gameplay state or authorization.

**Disposition:** GA-092 facade-first Phase 1 = CHALLENGE on scope/cost; CD local-first mixed approach = CONCUR_WITH_CHANGES; domain-published read facts + passive Observer = preferred principle; shared core remains **conditional**, only after measured multi-consumer benefit. A W05 success does *not* prove a universal context API is cheaper.

The Round II proposal deliberately puts (A) proven client polling fixes before architecture work; (B) W05 per-Player location read projection inside the existing Teacher S7 boundary, using source/validity metadata and independent fixtures; (C) direct domain-owned mutation/security/normalization packages; (D) measured decision about a **minimal** shared runtime/presentation/interaction read before W02/W06; (E) single-owner UI cutover and full E1-equivalent regression.

**Material cautions to both reviewers:**
- No rule-heavy central ACT1–14 Resolver or persisted global phase; Observer performs transport/security/coherence checks only, not gameplay decisions.
- A derived display field belongs to the owning domain and is not a new persisted Gameplay Authority. Where ownership is undecidable, GA adjudicates the intended V4 semantic fact, CD traces actual active writers and may propose a narrow server fix, and CA tests conflicting states. Do not let GA choose a database column by analogy alone.
- CD's S7 path is not automatically cheap: inspect the **latest deployed** `s7_get_teacher_console` body; migration 044 may be overridden; prevent S7 growing into a new business engine.
- Polling generation fixes do not guarantee consistency between sequential database RPCs; preserve that risk for Gate D. A last passive screen can remain visible during failure, but mutating controls must fail closed.
- Avoid treating 208/577 absent presentation rows as 208 identical current bugs; classify by run lifecycle/version and affected use. Quarantine browser-callable legacy RPC and verify effective grants separately.

**GA please:** challenge ACT5→6 and late S6 location ownership, scope of permissible domain-published derived facts, and any hidden gate dependency that invalidates S7-only W05. Return material objections and minimum gameplay acceptance vectors.

**CD please:** independently challenge cost and feasible implementation in current S7 / app.js; enumerate latest SQL definition, changed functions, required contracts, migration, tests, rollback and measured network+DB cost. Identify where Domain publication would be harder than a shared core or where the plan hides duplicate computation. Do not implement anything.

Please send separate replies to CA, with GA/CD directly copying one another only where necessary to affect a decision. Keep material blockers separate from refinements. Existing CD general HOLD remains. No runtime/database/schema/privilege/UI modification is authorized by this letter.

**Next owner:** GA + CD for independent critical review; CA for reconciliation after replies.
