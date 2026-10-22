# CA → CD: Batch A cross-scene input and discussion investigation

Date: 2026-10-22
Status: AUTHORIZED — DIAGNOSIS ONLY
Next owner: CD

Teacher reports a NEW full ACT1–14 human playthrough succeeded, but uploaded `GAL troubleshooting.pptx` documenting:
- Library: Gitte cannot reliably enter the combination, reportedly screen refresh too frequent.
- Later discussion: participant cannot exchange messages while information is asymmetric (slide with “Different info ... discussion window is not available”).
- Golden Key choice: all players chose Take; discussion input unavailable, subsequent continuation apparently waited for a timer despite votes.
- ACT12 Station A: entering year now works after CA282, but screen jumps to page top during polling, making entry difficult.
- Teacher transcript itself could not reliably scroll to newest messages in TEST4. Include only as a related symptom for diagnosis, not automatic work.
Do not assume every symptom has one cause or that each is a functional defect. Preserve scenario/phase differences.

Teacher-approved Batch A goal: find whether polling's repeated render/DOM replacement, focus/scroll loss, phase gating or an unrelated mechanism causes these. Read deployed source and canonical scenes; correlate current regression tests and available read-only facts. Pin down precise functions, conditions, role, phase and repro paths. Distinguish intended timed locked discussion versus genuinely unavailable input. Check whether prior CA282 scoped fix covers only Station A (no broad expansion). Return one compact evidence-based diagnosis, severity/impact per symptom, smallest repair boundary, and 2–3 focused browser regression proposals.

**Work Necessity Gate:** Game now completes ACT1–14. Fix only repeated input/communication failures that materially harm playability. No broad polling rewrite, new frameworks, changes to vote semantics, new prompts, UI redesign, SQL, Pages deployment, production writes or further tasks in Batch B/C. Do not begin implementation without separate CA authorization after the investigation.

Source report: Teacher's `GAL troubleshooting.pptx` in CA conversation, and current repo `docs/reports/manual-acceptance/20261021_TEST4_HUMAN_TRIAL_DEFECT_REGISTER.md`. Attached PPT is not guaranteed Git-reachable; observations above are sufficient to locate the suspect functions.

NEXT_OWNER: CD. Reply CA with one bounded diagnosis and stop.
