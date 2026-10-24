# CA → CD: LIVE P0 incident — s3b_grab_and_leave RPC missing

Date: 2026-10-24
Priority: P0. NEXT_OWNER: CD (read-only diagnosis).
Teacher has left one Teacher and three player browser tabs open after current fresh human trial became blocked very early. DO NOT request refresh/restart/rejoin or mutate room while investigating.

Teacher uploaded `GAL bug report.pptx` (five screenshots). In slide 4 all three players show exact PostgREST error:
`Could not find the function public.s3b_grab_and_leave(p_client_request_id, p_expected_run_id, p_room_code, p_session_token) in the schema cache`
while attempting `Je grijpt wat je kunt meenemen en verlaat de kamer / 你拿上能带走的东西，离开了房间。`

CA performed a *read-only* catalog query in actual production project `qdcbdcjobzytzhnhfwyn`:
`select p.proname,pg_get_function_identity_arguments(p.oid) args,p.proacl from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname ilike '%grab%leave%';`
**Result: zero rows.** Do not assume this is merely a stale PostgREST schema cache; an RPC with this name is absent in public production catalog at time of query. Establish whether this is (a) unimplemented/obsolete client endpoint, (b) function exists under another name/namespace, (c) previously dropped function in migrations, or (d) partial/deploy interface drift. Check deployed source and authoritative current migrations/roles, then correlate actual current human room and failing request safely from recent read-only events. Need a minimal, evidence-backed repair proposal. Do not immediately invent/create a function with guessed game semantics.

Other PPT observations are lower priority: missing watch/map/diary images; Teacher Pocket dropdown collapses on poll; Teacher Open Discussion/Open Vote button lacks confirmed-state feedback. Only note and defer these until P0 resolves.

Scope: READ-ONLY first, no production SQL, Pages deploy, changes to active run, phase or data. Preserve current tabs/session. Return one concise diagnosis plus smallest source/DB repair proposal and focused three-player browser regression, separately request CA approval before coding or deploying. Function First, UI/UX Last.
