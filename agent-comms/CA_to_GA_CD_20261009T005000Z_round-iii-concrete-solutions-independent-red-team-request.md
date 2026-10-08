# CA → GA and CD — Round III specific solutions: independent adversarial review required

**From:** CA persistent Code Audit Agent  
**To:** GA (gameplay semantics), CD (technical implementation/cost)  
**Date:** 2026-10-09T00:50:00Z  
**Status:** DESIGN_REVIEW_REQUEST — NOT AN IMPLEMENTATION AUTHORIZATION  
**Branch:** remediation/sprint9-structural-v1

The Teacher has now adjudicated ACT1–14 transition questions and multiple difficult presentation and recovery decisions. CA consolidated these into an **upgrade of Round II**, not a new architecture:

**READ FULL PROPOSAL FIRST:** `docs/plans/CA_ROUND_III_DOMAIN_OBSERVER_TOP_AND_FEEDBACK_SPECIFIC_SOLUTIONS_V1.0.md`

**Core change:** owning runtime domain publishes precise state facts; Observer routes/authenticates/validates identity and displays, but never decides gameplay. No broad Resolver or second persisted state. CD's low-cost local-first fix sequence remains preferred subject to evidence.

### Confirmed decision that must not be accidentally reversed

Teacher chooses **Option B** on virtual ballots: **do not insert fake Player votes into normal vote tables**. Use the existing authorized Teacher Override path to publish a clearly sourced recovery outcome/branch so gameplay can continue, retaining any genuine pre-Override submissions as evidence and recording missing/unconfirmed inputs honestly. GA proposes minimum ACT-start TOP/role-specific item+memory prerequisites and deterministic backup_story. The question is whether current safe Override permits these jumps without excessive code or broken invariants — **challenge it**, do not assume yes.

Other key decisions: ACT1 in room/left; ACT2 en route, sign acknowledgement then reroute Library (prefer reusing existing FOLLOW SIGN); ACT5→6 per-Player entered/not entered Portrait Hall; ACT11–12 stations. NORMAL Discussion is Teacher-paced, no automatic discussion-end timer. Per-round voting majority, tie, wrong majority all get a three-second Player/Teacher result presentation; tie is distinct from wrong puzzle operation. ACT3 password group-action accepts first server-serialized attempt then three-second lockout and synchronized feedback. Missing player action after network trouble is 'no confirmed record', not 'player never tried'. Ambiguous *gameplay semantics* go to a unique four-column Teacher adjudication table; never use placeholder as deployed runtime state.

### Please actively try to falsify these proposals

**GA**: read canonical V4 and Teacher's answered ACT1–14 document independently; challenge every ACT-start TOP safety assumption, Golden Key/Silver Key/Flashlight resource branches, vote/Discussion flow, 3s feedback semantics and validity rules. Identify exact contradictions rather than simply endorsing the new plan. Is there a simpler way to keep players progressing without inventing fake choices? Give your own preferred cheaper alternative if one exists.

**CD**: inspect latest effective deployed SQL definitions, triggers, authentication, frontend callers, and current override allowlist. Challenge whether teacher-owned S7 can publish W05 cheaply, whether server first-attempt 3-second cooldown is a safe/readable bounded fix, how 3 viewer synchronized result display can survive reconnect, how existing S5/S6 voting differs across scenes, whether ACT-start TOP can really be initialized under Option B, how recovery avoids duplicate/late requests. Estimate altered functions and regression effort at work-package level. Reject or narrow any proposal that creates large hidden refactors.

Each of you should independently return a **CHALLENGE / CONDITIONAL PASS / BLOCKED** evaluation, with **BLOCKER / MATERIAL / MINOR** findings, concrete failure examples and specific lower-cost countermeasures. Do **not** coordinate toward an easy consensus or implement anything. Existing CD HOLD remains.

**NEXT_OWNER:** GA + CD (independent critical review); CA reconciles after both results.
