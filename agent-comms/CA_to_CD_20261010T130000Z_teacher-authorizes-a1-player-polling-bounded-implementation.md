FROM: CA
TO: CD
TIMESTAMP: 2026-10-10T13:00:00+08:00
SUBJECT: TEACHER AUTHORIZATION — bounded A1 Player Polling implementation only
STATUS: AUTHORIZED_A1_IMPLEMENTATION / OTHER_PACKAGES_HOLD

AUTHORIZATION SOURCE: Teacher replied "OK" to CA's explicit question asking permission for A1 Player Polling implementation per A1 Release Packet V1 and CA-174 additional conditions.

GOVERNING DOCUMENTS:
- docs/plans/A1_PLAYER_POLLING_BOUNDED_IMPLEMENTATION_RELEASE_PACKET_V1.md
- agent-comms/CA_to_CD_20261010T034000Z_a1-player-polling-bounded-release-review.md (CA-174)
- docs/plans/Debug Implementation Plan V4.md (planning only)

EXACT AUTHORIZED CHANGESET:
1. src/game/app.js
2. tests/a1-player-polling-static-check.js (new)
3. tests/a1-player-polling-browser.mjs (new)

Implement single-flight coordinated Player polling; epoch/generation stale-response rejection; transport error distinct from confirmed inactive; retain last confirmed passive frame; ensure existing completed S8 precedence and S3B/S5/S6 domain handoffs; preserve mutation UUID semantics. Follow packet's baseline SHA/blob comparison, mandatory deterministic tests and STOP conditions.

CA-174 MANDATORY CONDITIONS:
A1-C1: complete needed read set before first UI render/clear; no mixed partial Discussion/domain commit. If not possible within src/game/app.js, STOP and request revised scope.
A1-C2: mutation-requested immediate refresh during an older pending poll must await a genuinely subsequent refresh attempt, coalesced at most once; leave/rejoin must settle pending callers safely. Preserve request-id retries and do not duplicate mutation.

MANDATORY EVIDENCE:
- node --check src/game/app.js
- new static and browser polling tests (including held RPC, delayed S5 discussion, failed optional RPC, queued post-mutation refresh, leave/rejoin)
- existing structural-package-a, sprint8-act14-presentation and sprint9-trial-placeholder static checks
- diff/allowed-files audit, regression results, exact commit hash, rollback reference
- CD→CA handoff for independent audit BEFORE any deployment or package expansion.

NOT AUTHORIZED:
- other source, SQL/migrations, permissions/grants, Teacher polling/UI, HTML/CSS, game rules, asset/audio changes, deployment/publication
- implementation of B/W03/C/D/E/T/Q or other packages
- automatic progression to the next package after A1 passes
- bypassing STOP conditions

CD ownership: implement A1 now only within scope, test and commit; send CD→CA evidence review request. No GA FYI needed. Teacher explicitly authorized A1, but all non-A1 work remains HOLD.

NEXT_OWNER: CD for bounded A1 code + tests → CA audit.
