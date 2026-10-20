# CA-265 migration 071 attempt — STOP and verified recovery

Status: `ATTEMPT_CONSUMED / FIXTURE_NOT_STARTED / RECOVERY_VERIFIED / PRODUCTION_HOLD`

Operation ID: `071-20261020T104053Z-ca265`

## Fresh preflight

- Teacher confirmed a live exclusive window and that no person or automation would use production until completion.
- The final database observation at `2026-10-20T10:40:53.489570Z` found zero Player, run, runtime-event, S1-event, dialogue and S6-receipt activity in 15 minutes; zero other non-idle/privileged sessions; and `579 ACTIVE = 577 historical + 2 retained`.
- The ten reviewed pre-071 functions matched owner, SECURITY DEFINER, search path, ACL and definition MD5 baselines; the six-argument Open Vote overload was absent.
- Supabase was `ACTIVE_HEALTHY`; Edge Functions were empty; pg_cron was not installed; GitHub Actions had no queued/in-progress runs; rollback Pages five-file bytes matched.
- Migration SHA-256: `720cb598d7ead56d3ed1ff53bcf7d62af94f795357efe7e60ef1bff504b0ab04`.
- Recovery SHA-256: `e7e74f16885c730ef10d4f577420be486d8d07a774d2d9b43a97ec8a66eff683`.
- Source-gate and startup-gate tests passed.

## Attempt and STOP

1. A persistent networked Node process was started with context `071-20261020T104053Z-ca265`; its visible fingerprint was `ca1729be4c239f5349d163777e14f07ceadbf2aee8ffa7455583b4279ad6db81` and its Supabase probe received HTTP 401.
2. The exact six admission/start functions were transactionally frozen. An independently executed read-only query confirmed PUBLIC/anon/authenticated/service_role EXECUTE were false for all six.
3. Migration 071 was applied and an independent catalog read confirmed the reviewed five-function poststate.
4. Teacher saved candidate Pages. Fresh Actions run `39411268064` succeeded for exact branch `deploy/act7-071-20261017` and commit `6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`.
5. Before ACL restoration or fixture start, CD found that the live persistent Node process did not expose the candidate verification operation required to prove Actions identity and five public hashes inside that same process. Using a replacement process would violate the reviewed continuity gate. CD therefore stopped immediately, did not restore ACL, did not invoke the fixture and instructed rollback.

This is an execution-host integration failure, not product acceptance evidence. The one attempt is consumed and must not be retried under CA-265.

## Recovery

- The first Teacher rollback selection accidentally deployed `safety/pages-before-manual-acceptance-20261003`; CD detected the wrong branch and did not advance recovery.
- Teacher corrected the source to `deploy/manual-acceptance-20261003` at `/(root)`.
- Fresh Pages run `39412338627` completed successfully for exact commit `891feffe558a4683ac3da67e1e6b15e902c7e592` (`2026-10-20T11:04:13Z` to `11:05:09Z`).
- All five public files returned HTTP 200 and exact rollback hashes.
- SHA-pinned `071_RECOVERY.sql` executed successfully; the six-argument Open Vote overload is absent.
- The exact six admission ACLs were restored.
- Final readback at `2026-10-20T11:09:33.338239Z` reproduced all ten pre-071 owner/SECURITY DEFINER/search-path/ACL/MD5 identities, zero other non-idle sessions, and `579 ACTIVE = 577 historical + 2 retained`.
- No NORMAL or AUDIT fixture was created; Q1-Q4 were not reached.
- The persistent Node process was then stopped cleanly.

## Process finding

The repository production adapter defines the correct same-process ordering, but there is still no runnable operator host connecting its external SQL/Page callbacks to the live tools. The ad-hoc persistent process used here proved network continuity but did not implement the adapter's candidate-proof command. This gap must be resolved and independently reviewed before any future authorization; it must not be bypassed by manual cross-process substitution.

NEXT_OWNER: CA

NEXT_ACTION: Audit the STOP/recovery evidence, record the attempt as consumed, and decide HOLD/future operator-host remediation. Production remains on the frozen rollback baseline.
