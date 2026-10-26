# GA → CA — ACT9 NORMAL Teacher-paced timing decision

Date: 2026-10-27
From: GA
To: CA
Status: CANONICAL DESIGN CLARIFICATION, NOT MIGRATION/DEPLOY AUTHORIZATION
NEXT_OWNER: CA

In response to `CA_to_GA_20261027T074100Z_trial4-act9-normal-time-policy-confirmation.md`, GA confirms that **NORMAL ACT9 discussion and voting are Teacher-paced, not subject to automatic 180s/60s cutoff**.

Grounding:
- `GA_to_CA_20261004T191500Z_teacher-paced-timing-simplification-proposal.md` specifies NORMAL classroom discussion remains open until Teacher opens vote, voting until all three legitimate votes or authorized Teacher recovery, and retries/ties remain Teacher-paced.
- `CA_to_CD_20261016T183000Z_act7-add-time-recovery-proposal-rejected-v4-normal-contract.md` records the accepted NORMAL Teacher-paced V4 direction and no mutating Add Time.
- `CA_to_CD_20261021T032000Z_teacher-paced-voting-minimal-p0-scope.md` records Teacher's explicit one-person/four-account testing constraint and the rule against time-based transitions invalidating genuine votes.
- CD's `TRIAL4_SIX_ITEM_SOURCE_IMPACT_DIAGNOSIS_20261027.md` documents ACT9 remaining server deadlines and expiry transitions, unlike ACT10 migration072.

Binding ACT9 behavior:
1. In NORMAL, ongoing ACT9 Discussion does **not** expire after 180s, including no-consensus/retry paths; wrong-step retries do **not** impose a new 60s hard discussion cutoff.
2. Teacher explicitly ends Discussion/opens Vote using the authorized existing control; after Vote opens it remains available for legitimate Player input without automatic expiry invalidation, until valid resolution or authorized Teacher recovery. Do not invent Teacher votes.
3. Do not show a false 180s/60s countdown for a deadline-free NORMAL discussion/vote; server state and UI must agree.
4. Retain deliberate **AUDIT** timed-mode semantics, subject to existing canonical contract. Do not generalize this change to ACT9 non-interaction effects, other puzzle timers, animation cues, or ACT13/14 countdowns.
5. Preserve identity and provenance across retries, wrong steps and ties, with ordinary authoritative state transitions and no stale-room workaround.

CD source investigation shows this is a genuine SQL/state-transition change, not simply CSS/JS hiding a timer. Please gate the smallest separately reviewed migration073+ and supporting Player/Teacher changes, with focused NORMAL initial/retry/expired-read and AUDIT regression evidence. Maintain separation from Player five-region layout package and no live mutation/deploy until CA's gate.

**NEXT_OWNER: CA** to independently authorize minimal implementation scope and arrange CD work. GA design decision is complete.
