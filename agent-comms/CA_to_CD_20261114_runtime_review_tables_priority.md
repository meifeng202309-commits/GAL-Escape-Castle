# CA to CD — PRIORITY: regenerate three role-specific Runtime review tables for Teacher + GA

Timestamp UTC: 2026-11-14T04:13:05.460Z
NEXT_OWNER: CD

Teacher has clarified that she and GA need CD to regenerate the Runtime review tables in the agreed review format. CD-235 has completed both previously assigned workstreams (P1 release-readiness packet and slides 7/9/10/19 investigation); do not start a new task from those packets yet. **The Runtime tables are now CD's next priority.**

Use the existing 86-row source evidence CSV unchanged as the starting evidence. Produce three files:
- `runtime_message_Anna.md`
- `runtime_message_Gitte.md`
- `runtime_message_Linda.md`

Each file must be chronological by actual Runtime appearance within that Player role. Repeat shared Runtime messages in all three files; keep role-private messages only in the corresponding role file; list branch-specific outputs separately with trigger/condition. Do not infer missing branch text or silently merge rows.

Required table columns, exactly in this order:
A. ACT number
B. Detail/Page ID (stable sequential review-page ID within that role document; NOT a fabricated source line number)
C. Action expected from Player, or what Player is expected to understand/observe when no explicit action exists
D. Current Runtime Chinese — exact source-derived wording
E. GA proposed revised Chinese — leave blank for GA to fill
F. Teacher proposed revision — leave blank for Teacher
G onward. Traceability/context fields needed to locate and assess the row: actual `scene_id`, `phase_key`, trigger/outcome, ordered Runtime text keys, source function/migration/file, source evidence/fixture, uncertainty/coverage note, and any relevant role-visibility note.

Critical acceptance:
- Use exact current Chinese text from the existing extracted evidence; preserve punctuation and ordering.
- Distinguish Runtime narration from Scene image captions, Action controls and Discussion chat. If a Runtime/Action boundary issue is found, flag it separately; do not misclassify it.
- Ensure ACT9/ACT10 private clues remain role-private.
- Shared messages appear in each applicable role's table.
- Distinguish sequential rows from conditional alternatives; never present mutually exclusive branch texts as if all are shown consecutively.
- Identify any missing or ambiguous mapping explicitly. Do not invent expected Player actions; mark `待确认` with reason if evidence is insufficient.
- Preserve the original 86-row CSV unchanged. These three review tables are a new derivative deliverable, not a replacement evidence source.
- Do not propose wording edits, translate, edit localization catalogs, modify Game Script/runtime code, or deploy anything.

When complete, commit all three files and send one CD -> GA + CA handoff with row counts by role/ACT, shared/private counts, conditional branch counts, excluded/non-Runtime rows and unresolved gaps. Stop and transfer ownership to CA. Do not resume migration075 release or slide 7/9/10/19 follow-up until CA assigns it after this handoff.
