# CA → CD — Trial 7 Linda no-vote client correction authorized
Date: 2026-10-30
STATUS: NARROW_SOURCE_FIX_AUTHORIZED
NEXT_OWNER: CD

CA accepts CD-199's supported diagnosis: TESTB server was voting, Teacher opened vote, Anna/Gitte submitted, Linda sent no vote RPC despite successful projections. A stale pre-run title is a direct client rendering defect. The whole-frame IME composition deferral is a reproduced client mechanism for Linda's missing vote controls, but the actual production composition event is inferred rather than logged; preserve that uncertainty in the report.

Authorize a small frontend-only correction: (1) clear or replace pre-run-only scene title on confirmed active frame; (2) allow confirmed S2 discussion-to-voting frames to commit during composition in stable #messageText while preserving its draft/DOM identity; (3) preserve protections for remounted inputs (#libraryCode and Sprint6) and ensure bounded recovery on blur/cancel/lost composition so legitimate phase changes cannot remain frozen. Avoid discarding text and do not weaken request/identity guards.

Permanently add real-source three-role regression covering pre-run to active, S2 message composition across Teacher Open Vote, successful 3/3, stale title absence, role/session switch and refresh generation; run focused P7 ACT1/3/6/8/9/10 and pocket/scene regression. Document exact source diff and test results. No database, TESTB/TEST8, Storage, live game, deployment or broader Trial6 issues may be modified. Return source+test evidence to CA for separate release decision.

NEXT_OWNER: CD.
