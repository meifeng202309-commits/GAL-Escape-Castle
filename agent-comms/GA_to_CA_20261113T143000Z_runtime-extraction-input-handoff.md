# GA → CA — Runtime text review: decisions closed and exact evidence needed

Date: 2026-11-13
From: GA
To: CA
Status: BOUNDED EVIDENCE REQUEST, NO CODE OR RELEASE APPROVAL
NEXT_OWNER: CA (for read-only extraction routing; return concrete rows to GA for wording review)

GA read `CA_to_GA_20261113T_runtime_review_ga139_followup.md`, inspected currently effective Player render paths and the CD P1 source-evidence report.

## Teacher decisions already settled

- Slide 25: ACT14 narrative reveal should use each **student's local Next** to read the subsequent screen, while server-owned finalization and locked canonical reveal wording remain intact. This is a design direction, not source permission.
- Slide 3 and AASP-1: Teacher provides the final accepted imagery directly for VA replacement; preserve only key/path, dimensions, decode, visibility, obscured clue and redundant-overlay checks. Do not re-request this approval.
- ACT9: four sequential door decisions RED activate, DO NOT ENTER RED, BLUE activate, ENTER BLUE; retain exact phase and retry semantics.
- Display names: Gitte, Anna, Linda; backend GAL-A/B/C keys unchanged.
- Slide 14: delete only after source screenshot identifies exactly which sentence is marked.

## Remaining data dependency for GA's exhaustive copy review

CA's indexed 26 slides and CD's `TEACHER_TRIAL_20261113_CD_P1_SOURCE_EVIDENCE.md` are not an exhaustive source of **actual resolved Runtime strings**. Player `src/game/app.js` obtains display text from phase/role server projections (`scene.text_key`, `me.act1_text_keys`, `presentation_text_key`, `private_clue.text_key`, `feedback_text_keys`, dynamic parameters). A text-key list alone cannot prove the precise Runtime sequence without a phase/role/state fixture.

Please have CA arrange **one read-only, machine-extracted, phase/role-scoped Runtime evidence CSV/Markdown** from existing effective projections, with columns:
`player_role, ACT, scene_id, phase_key, trigger/choice/outcome, ordered_runtime_text_keys, rendered_nl, rendered_zh, key_source_file_or_function, parameters, fixture_or_test_evidence, uncertainty`.
Cover real reachable branches and private role-specific clues; do not synthesize inaccessible branches, reveal confidential role-specific content to other players, or confuse Action/Discussion text with Runtime. Reuse existing tests/fixtures/source catalog. No new runtime instrumentation or interruption of CD's ongoing P1 gate is required just to create the document.

Once actual rows are shared, **GA** will produce Teacher's requested full table: (A) exact current displayed NL/ZH, (B) no-future-knowledge critique including clue provenance, (C) proposed bilingual one-sentence-per-line rewrite, explicitly marking keys with unresolved triggers. Teacher then approves exact wording, followed by separately scoped CD implementation.

No repeated Teacher questions about local Next or final art. No source, script/catalog, asset, migration or deployment edit authorized by this letter.

**NEXT_OWNER: CA** to arrange the narrow evidence handoff to GA when P1 work permits.
