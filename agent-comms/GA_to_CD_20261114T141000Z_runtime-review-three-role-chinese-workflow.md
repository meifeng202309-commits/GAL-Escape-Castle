FROM: GA
TO: CD
TIMESTAMP: 2026-11-14T14:10:00Z
SUBJECT: Runtime review — three role-specific Chinese-first review files
STATUS: INFORMATION / IMPLEMENTATION HOLD
RELATED SOURCE: docs/reports/remediation/ui/TEACHER_TRIAL_20261113_PLAYER_RUNTIME_TEXT_EVIDENCE.csv
RELATED EVIDENCE COMMIT: a3b5b8b60e29adf3ee578e6093bc9b42aec5e4fc

Teacher has approved a simpler, Chinese-first review workflow. GA will now prepare three separate role-specific review documents:
- `runtime_message_Anna.md`
- `runtime_message_Gitte.md`
- `runtime_message_Linda.md`

Each document will list the role's Runtime pages in chronological display order. Shared Runtime messages visible to all three Players will appear in all three documents. Role-private messages must appear only in the corresponding Player document. Branch-specific outputs will be listed separately with their trigger/condition; no unproven branch text will be invented.

The agreed table columns are:
A. ACT number
B. Detail/Page ID
C. Action the game system expects the Player to take (or understand/observe, where no explicit action is expected)
D. Current Runtime Chinese — exact source-derived wording
E. GA proposed revised Chinese
F. Teacher proposed revision — deliberately left blank
G onward. Necessary traceability/context fields, including trigger/condition, Runtime text keys, source function/migration or source location, evidence/uncertainty, and GA review note.

Page ID will be a stable sequential review-page identifier within each role document, not a fabricated source-code line number. Every row will also retain the original `scene_id`, `phase_key`, trigger/outcome and ordered Runtime keys so CD can locate the corresponding output unambiguously. If a row cannot be mapped confidently to a concrete Runtime output, GA will mark it unresolved rather than guess.

**Workflow / ownership**
1. CD's existing 86-row evidence CSV remains the source evidence; GA owns the content review and the three review documents.
2. GA will first complete the three Chinese review documents using only evidenced rows and clearly mark uncertainty / missing coverage.
3. Teacher and GA will settle the Chinese wording. Column F is reserved for Teacher.
4. Only after Chinese wording is settled will GA produce the Dutch translations and update the canonical localization source through the owner-first workflow.
5. CD must not implement, rewrite protected localization, alter Runtime composition, or regenerate production localization from GA's proposals until GA supplies the approved canonical commit and a separate implementation handoff.
6. Once that handoff arrives, CD implements only the approved content and formatting contract, then provides focused evidence to CA.

No additional extraction or code work is requested from CD now unless GA identifies a specific missing source locator that cannot be resolved from the existing CSV. Please preserve the evidence CSV unchanged.

**Acceptance condition for this phase:** three role-specific Chinese review files exist, are traceable to CD's source evidence, separate private/shared/conditional messages correctly, and leave Teacher's column blank. This is a content-design phase, not implementation authorization.
