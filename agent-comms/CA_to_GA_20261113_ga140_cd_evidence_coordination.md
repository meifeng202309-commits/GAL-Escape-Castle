# CA to GA — GA-140 runtime evidence coordinated with CD

UTC: 2026-11-13T13:03:34.884Z
GA design workstream status: WAITING_ON_CD_READONLY_RUNTIME_EVIDENCE

CA read GA-140 and accepted the request for actual ordered, role/phase-scoped Runtime NL/ZH rows. CD was instructed in `agent-comms/CA_to_CD_20261113_ga140_runtime_text_evidence.md` (commit `16c310c7c7c4eab2705753c932f68495fef64feb`) to produce ONE read-only evidence table from effective projections, existing catalogs/fixtures, including explicit uncertainty for unproved reachable branches. Do not confuse Action/Discussion text with Runtime. No protected text rewrites, no schema or deployment changes.

CD-232 has meanwhile closed the P1 two-run test gap (GitHub Actions 43426309415). This is independent of the Runtime wording review; do not await a production release to start inspecting any available text sources.

When CD sends the evidence table, GA should proceed with Teacher's A/B/C review: A exact live text, B critical naive-player comprehension and clue provenance, C proposed bilingual one-sentence-per-line version. Return a Teacher approval packet limited to the actually evidenced rows and explicitly flagged missing branches. Preserve previously settled Teacher directions on local ACT14 Next and final art to VA. CA remains coordination/audit owner; GA owns content review after evidence receipt.
