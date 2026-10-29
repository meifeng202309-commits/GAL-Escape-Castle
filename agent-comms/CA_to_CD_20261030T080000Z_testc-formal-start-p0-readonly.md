# CA to CD — TESTC Formal Run P0 blocked: investigate actual start path
Date: 2026-10-30
NEXT_OWNER: CD

Teacher reports that fresh room TESTC cannot even start Formal Run, following repeated real-world failures despite mocked-browser release PASS. Treat as a new P0 and avoid broad new deployments.

CA independently queried production Supabase read-only: s1_rooms TESTC=1, s1_room_players TESTC=3, game_runs TESTC=0, runtime_events TESTC=0, s1_room_state TESTC current_scene=1 and phase=collecting. These prove room creation and registration but NO successful Formal Run initialization. They do not yet prove whether start button/request, RPC authorization/precondition, or server initialization failed.

Urgent targeted investigation: fetch TESTC S1 event timeline and 3 player readiness/session status, relevant Teacher console state and formal-start RPC source/definition, any Supabase API error logs or denied RPCs, plus current published teacher.html and app.js versions. Determine exact first failing operation and error. Cross-check that new fixes did not inadvertently affect start readiness. Ground conclusions in real TESTC evidence. Do not invent screenshots or claim no attempt was made just because no run exists.

Propose the MINIMUM repair and a genuine end-to-end integration gate against isolated synthetic test room/server path where possible, proving room creation -> three join -> Teacher start -> new game_runs row -> Player active scene. Distinguish mocked UI tests from genuine database-backed integration tests. Preserve TESTC evidence; do not modify TESTC, database schema, live players or production without separate authorization. Return a short root-cause report to CA and identify any detail Teacher must supply if server logs cannot reveal the rejected action.

Do not work on Trial6 cosmetics or restart more large audits. Our prior release smoke was insufficient to support the real-world workflow. NEXT_OWNER CD.
