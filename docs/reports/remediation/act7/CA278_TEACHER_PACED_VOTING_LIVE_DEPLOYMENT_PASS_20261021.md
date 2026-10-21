# CA-278 Teacher-paced voting live deployment and smoke PASS

Date: 2026-10-21  
Authority: `agent-comms/CA_to_CD_20261021T033900Z_teacher-paced-voting-one-bounded-deployment-authorized.md`  
Operation: `071-20261021T040659Z-ca278`  
Outcome: **PASS — candidate remains live; rollback was not invoked**

## Exact released baseline

- Reviewed implementation: `cf5ebd8c80f7ab6bc93cc93c44169c3f394e74d1`
- Revised migration SHA-256: `933f8e210ad0e24daf8c944f1b43c817d71fe8f28fa0ecf87461e19e285e7401`
- Applied migration name: `act7_071_teacher_paced_voting_ca278`
- Pages branch: `deploy/act7-071-20261017`
- Pages commit: `6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`
- Pages workflow run: `39564088816` (`success`)
- Pages source directory: `/(root)`
- Candidate public-byte evidence: `071_CA278_CANDIDATE_PROOF_20261021.json`
- Candidate evidence SHA-256: `01faaa133cfada7dedfe75a91e518ccf41689d00911d6b60cc8166aceaf907e8`

The five public candidate resources returned HTTP 200 and matched the exact expected SHA-256 values recorded in the JSON evidence. The Teacher confirmed the Pages Save at Beijing time 15:46; GitHub subsequently reported the exact branch and commit above as successfully deployed.

## Safety and rollback preparation

Before mutation, the Teacher declared the exclusive operator window and confirmed no other person or automation would use production. Read-only preflight found 579 retained active historical runs, zero player activity in the preceding 15 minutes and zero rooms with player activity in the preceding 24 hours.

The six admission/start procedures were transactionally frozen before applying SQL. Their privileges remained frozen through migration verification and were restored before the smoke. Final readback showed:

- `s1_create_room`, `s1_join_player`, `s1_reset_room`, and `s9_start_formal_game`: `anon`, `authenticated`, and `service_role` execute; no `public` execute.
- `s2_start_run`: `service_role` only.
- `s3b_initialize_flow`: existing `public`, `anon`, `authenticated`, and `service_role` execute envelope retained.

The reviewed rollback was proved reachable before mutation:

- branch `deploy/manual-acceptance-20261003`
- commit `891feffe558a4683ac3da67e1e6b15e902c7e592`
- workflow run `39528058827` (`success`)
- five exact public hashes recorded in `071_CA278_ROLLBACK_PREFLIGHT_20261021.json`

No failure occurred, so recovery SQL and Pages rollback were not executed.

## Post-migration contract proof

Catalog and ACL readback confirmed:

- the six-argument identity-bound `s5_teacher_open_vote(text,text,uuid,text,integer,uuid)` exists and is executable by `anon`, `authenticated`, and `service_role`, not `public`;
- the old two-argument overload remains inaccessible to `anon` and `authenticated`;
- the reviewed generic NORMAL Teacher-paced policy is present;
- the six admission/start procedures stayed frozen until the deliberate restore step.

## Smallest live NORMAL smoke

Exactly one isolated Teacher + three-Player smoke was run:

- room: `S5MVHTI7A0A71V`
- run: `11ea612d-251a-455c-a0d4-06dc13be319e`
- roles: three distinct player identities assigned `GAL-A`, `GAL-B`, and `GAL-C`
- target: ACT7 vote round 2, NORMAL mode

Observed sequence:

1. Teacher Open Vote returned `phase_deadline = null`.
2. GAL-A voted `clock_a` at `2026-10-21T07:56:01.335300Z`.
3. GAL-B voted `clock_a` at `2026-10-21T07:56:01.508534Z`.
4. After more than 61 seconds, GAL-C still observed `status = voting` with all three options and submitted a genuine `clock_c` vote at `2026-10-21T07:57:03.675070Z`.
5. Round 2 resolved and exactly one round-3 discussion was created; no waiting event occurred.

Post-smoke readback confirmed three distinct player IDs, three distinct vote request IDs, a null resolved round-2 deadline, `round3_rows = 1`, `waiting_events = 0`, and current ACT7 `vote_round = 3`. The run was intentionally left at the verified continuation point; no record was deleted, reset, or rewritten. Active-run count changed from 579 to 580 solely because of this authorized smoke.

## Validation and residual observations

- Live migration application: PASS.
- Exact post-migration function signature/ACL readback: PASS.
- Candidate Pages workflow and five-byte proof: PASS.
- Late third vote beyond 60 seconds: PASS.
- Correct single continuation: PASS.
- Identity separation and vote provenance: PASS.
- Final admission/start ACL restoration: PASS.
- Retry count: zero.
- Rollback count: zero.

Supabase security advisors were checked after DDL. The reported RLS-without-policy, mutable-search-path, and broad SECURITY DEFINER notices belong to the pre-existing application architecture and were outside CA-278's narrow trial-first envelope; no optional security rewrite was attempted.

## Closure

CA-278's one authorized production attempt is consumed and passed. Production now intentionally consists of the revised 071 database contract plus candidate Pages branch `deploy/act7-071-20261017`. Next owner is CA for the single focused acceptance disposition required by the authorization.
