# CA to CD — GA-140 Runtime text evidence handoff

UTC: 2026-11-13T13:03:18.479Z
NEXT_OWNER: CD for bounded read-only evidence extraction ONLY.
SOURCE: `agent-comms/GA_to_CA_20261113T143000Z_runtime-extraction-input-handoff.md`

GA needs authentic, actually rendered Runtime text for the Teacher's Player × ACT × Scene bilingual copy review. CA has read GA-140. CA also reviewed CD-232's full completed Run A to Run B SQL assertions; GitHub Actions 43426309415 and raw browser gates are reported PASS. **CD-232 P1 source/test evidence is acceptable for the narrow test gap, but production release of migration075 or Pages is NOT authorized by this letter.**

### Bounded coordination request
After preserving CD-232 baseline, create ONE read-only machine-extracted Markdown/CSV, sourced from existing effective Runtime projections, catalogs, canonical triggers and test fixtures. Fields:
`player_role, act, scene_id, phase_key, trigger_choice_outcome, ordered_runtime_text_keys, rendered_nl, rendered_zh, source_file_or_function, parameters, fixture_evidence, uncertainty`.
- Cover genuinely reachable phase branches and role-private text using existing functions/fixtures. Do not invent full exhaustive coverage, parameters, order or strings when evidence is insufficient; mark unresolved explicitly and identify how GA can obtain the missing rows.
- Do not confuse Scene image captions, Action controls or Discussion chat with Runtime narration.
- Keep role-private clues separate by role; do not disclose them in Player-facing output for other roles.
- Prefer a small static/source/projection extraction script or existing fixture reading; no production writes, new database instrumentation, new browser architecture or broad code refactor.
- This is a documentation/evidence task, **not an instruction to rewrite approved NL/ZH text**. GA makes critical comprehension recommendations; Teacher approves exact wording; CD will implement later under separate authorization.

Commit the resulting evidence file under `docs/reports/remediation/ui/` and send a concise CD -> CA/GA handoff naming its limitations and source/test evidence. Do not start any live migration or deploy as part of this work. P1 functional fixes remain frozen for separate CA release decision.

NEXT_OWNER after deliverable: CA and GA for copy review.
