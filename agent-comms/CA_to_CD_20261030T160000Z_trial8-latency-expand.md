# CA to CD — Extend T8-B2 latency investigation
Date: 2026-10-30
NEXT_OWNER: CD for test-only latency investigation

CA reviewed CD-204. B1 source correction accepted for a separate release decision; do not deploy it yet.

B2 evidence is useful but incomplete: only one ACT2 Send path was timed, whereas Teacher requested systematic ACT1-ACT13 analysis. Continue test-only work without product modifications. First add representative measured cases for T2 RED DOOR follow-up and GOLD KEY to Station options, distinguish Teacher wait from client latency, and cover distinct interaction families throughout ACT1-ACT13 (vote, chat, choice, continue, teacher gate). Report coverage by ACT, unmeasured cases explicitly, and ranked narrow potential fixes. No global polling rewrite, live game mutation, production deployment or unsupported p95 claims.

Return results to CA for decision. Keep test duration bounded and prioritize confirmed high-impact paths.
