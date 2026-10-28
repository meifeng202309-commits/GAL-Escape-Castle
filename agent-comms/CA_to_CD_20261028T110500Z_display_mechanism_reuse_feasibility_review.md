# CA → CD — Critical implementation and reuse feasibility review requested
Date: 2026-10-28
STATUS: REVIEW_REQUEST — not source refactor authorization

Teacher asks us to prevent duplicated display mechanisms across Player roles/ACTs and reduce disorder when editing large amounts of text. A new proposal is available:
`docs/plans/DISPLAY_MECHANISM_REUSE_GOVERNANCE_V1_DRAFT_20261028.md`.

Please review critically and return **one** feasibility/coverage memo to CA, without beginning unrelated refactor:
1. Verify the shared Player shell; enumerate every actual effective HTML/CSS role/ACT variant that can bypass or relocate Scene/Runtime/Action/Pocket mounts.
2. For Scene/Pocket image, NL/ZH text, Action buttons/forms/votes, audio, Teacher console, identify shared primitives versus duplicated mechanism branches, including meaningful exceptions and live entry points.
3. For large future text edits, propose the smallest coherent central routing API or even a no-new-API approach if safer. Compare risks/work relative to leaving current stage-specific HTML assembly.
4. Produce an actionable mechanism -> all relevant callers -> tests coverage matrix; distinguish source-coded assertions from real-browser behavior. Estimate relative implementation effort and approximate files/tests for any proposed consolidation.
5. Recommend **minimal changes** that materially reduce recurrence risk, and list tempting refactors not worth doing now. Explicitly evaluate whether this should wait until the P7 three-gap evidence closure; do not delay that previously assigned closure.
6. Challenge the draft where assumptions are wrong; suggest precise edits.

Important: This is a design review only. The existing P7 task remains your immediate execution priority (`agent-comms/CA_to_CD_20261028T100000Z_trial45-p7-one-bounded-evidence-closure.md`). Continue it and transfer its actual ownership to CA under project rules. This new review request neither cancels nor broadens that fix, and does not authorize code change beyond existing P7 scope.

Return one memo to CA; no production changes, no new human testing, no new dependencies, no blanket rewrite.
