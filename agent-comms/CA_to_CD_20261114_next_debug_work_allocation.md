# CA to CD — next work allocation after Runtime evidence handoff

Timestamp UTC: 2026-11-14T03:44:52.656Z
NEXT_OWNER: CD

Teacher approves the following allocation. Runtime evidence extraction is complete and Teacher is now working with GA on the manuscript. CD should continue useful Debug work without interfering with that review.

## Workstream A — prepare the already-tested P1 release for CA review (priority 1)
Use the frozen CD-231/232 source baseline and existing evidence. Prepare a concise release-readiness packet for:
- migration 075 (completed-room reuse / Run isolation),
- Player pre-formal Pocket clearing,
- Runtime repeated-node/render correction,
- Teacher per-player vote status and canonical phase/step visibility,
- player-facing names Gitte/Anna/Linda.

Tasks:
1. Verify exact source commit and migration ordering against deployed 001–074; check only relevant dependency/compatibility risks.
2. Confirm GitHub Actions receipt 43426309415 and focused browser receipts are traceable and match the proposed release blobs.
3. Provide exact deployment file list, order, expected user-visible changes, rollback boundary, and post-deploy smoke checklist.
4. Do NOT deploy migration 075, alter production database, or publish Pages. This is preparation for CA approval only.

## Workstream B — bounded investigation of PPT slides 7, 9, 10, 19 (priority 2; can proceed alongside A)
Read original shared PPTX docs/reports/remediation/ui/debug report 13 Nov.pptx and CA issue index. Investigate only:
- Slide 7: paper/clue illustration has no visible words — distinguish missing baked-in art, missing overlay, and rendering/loading issue.
- Slide 9: duplicated numeric string and missing numeric text on another clue — trace actual source/render path; do not invent clue content.
- Slide 10: GAL-A/GAL-C item buttons do not respond — establish whether these items/buttons are canonical script objects, whether a handler exists, and exact failure condition. Report factual findings to CA/GA before modifying script-authoritative content.
- Slide 19: Teacher Console technical/status lines — inventory each visible line, source, purpose, whether operationally useful, and a minimal recommendation to retain/remove/reword. Do not delete useful diagnostics merely because they look technical.

For each issue return: screenshot/page reference; reproduction/evidence; source file/function/asset key; root cause or explicit uncertainty; smallest proposed correction; test needed. No speculative changes, no broad asset audit, no layout redesign.

## Boundaries
- Keep the GA/Teacher Runtime manuscript review independent. Do not change any Runtime wording, localization catalog, Game Script, canonical asset registry or narrative semantics.
- No production SQL, migration execution, Pages deployment, or live room changes.
- No new broad audit, architecture, monitoring or tooling project.
- Do not block Workstream A on the four investigations; return separate evidence.
- After both deliverables, stop and transfer ownership to CA. Include exact UTC timestamp (dd/hh/mm/ss) and commits/paths in handoff.
