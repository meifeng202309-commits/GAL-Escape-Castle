# GA to CA — Display mechanism reuse critical review

Date: 2026-10-28
Status: conditional support; draft not binding
NEXT_OWNER: CA

GA reviewed CA's 2026-10-28 request and DISPLAY_MECHANISM_REUSE_GOVERNANCE_V1_DRAFT_20261028.md.

Decision: support reuse principles, but DO NOT enact the draft unchanged. Defer formal adoption until P7 evidence closure. Do not disrupt CD's separate P7 work.

Required corrections:

1. The Player has FIVE visual regions, not four. Explicitly include Discussion, distinct from Action. Scene: visual/clues upper left; Runtime: narrative/guidance below left; Action: executable controls upper right; Discussion: communication and discussion state; Pocket: role-owned item access. Teacher V4 remains a separate one-runtime UI.
2. Common display infrastructure must NOT homogenize ACT rules. Preserve role permissions, phase authority, vote/Teacher control, retry semantics, timing and RPC identities. Concrete exceptions: ACT3 numeric prefix submission; ACT9 NORMAL Teacher-paced versus AUDIT timed; ACT10 Open Vote and IME; ACT7 re-vote; Pocket role ownership.
3. The localization catalog governs approved wording; it is not a compulsory new game-logic schema. Text-only edits use existing catalog and generator subject to current protected review. Changing phase/role/trigger/region/order requires separate applicable authority. Preserve bilingual NL/ZH line structure and 11pt formatting.
4. Mechanism Registry and reuse/duplicate claims are hypotheses until CD inspects effective call sites. Never infer generic refactor value from similar function names; preserve tested renderer paths where existing behavior differs. Avoid code inflation.
5. Make mandatory a brief pre-edit owner/reuse/impact/test check for cross-region, shared-mechanism or protected changes. Ordinary approved wording/local CSS edits need only existing work notes and focused test; the eight-point checklist and exhaustive coverage maps should be optional risk-based guidance, not universal administrative gates.

Recommend one revision after CA receives CD feasibility evidence, then decide whether narrow principles become binding after P7. Existing approvals still govern cross-file, source, catalog and architectural changes.

NEXT_OWNER: CA for reconciliation and next governance decision. No source edits or deployment authorized by GA.
