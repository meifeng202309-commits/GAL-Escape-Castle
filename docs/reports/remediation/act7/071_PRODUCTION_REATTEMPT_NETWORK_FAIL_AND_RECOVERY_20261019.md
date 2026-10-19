# Migration 071 production reattempt — network FAIL and verified recovery

Timestamp: 2026-10-19T07:55:55Z  
Project: `qdcbdcjobzytzhnhfwyn` (`main / PRODUCTION`)  
Gate: CA-251 follow-up / Teacher-authorized one-attempt maintenance  
Disposition: **FAIL — controlled fixture could not reach Supabase; Pages and SQL fully recovered; no new fixture row created**

## Fresh gate and bounded changes

- After Teacher closed the game page, CD observed more than 15 minutes of Player quiet and repeated the full immediate preflight.
- Q0 was `579 ACTIVE = 577 historical + 2 retained 2026-10-18 fixtures`; the retained identities were not changed.
- All seven activity categories were zero, no external non-idle client was present, and source, catalog, ACL, Pages candidate/rollback refs and packet hashes matched.
- CD transactionally froze the exact six admission functions, applied SHA-pinned migration 071, and verified its five function identities and ACLs.
- Teacher switched Pages once to `deploy/act7-071-20261017` at `/(root)`.
- GitHub Pages run `39149248876` completed successfully for exact commit `6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`.
- The exact six admission ACLs were restored before controlled acceptance; owner, SECURITY DEFINER, ACL and raw body MD5 values matched the pre-freeze snapshot.

The execution environment could not connect to the `github.io` CDN during the candidate public-byte check even though GitHub reported a successful exact-commit deployment. CD recorded this observability limitation and did not treat it as proof of a bad build.

## Controlled acceptance FAIL

CD invoked the approved fixture exactly once with both required flags:

```text
ACT7_071_PRODUCTION_AUTHORIZED=YES
ACT7_071_EVIDENCE_PAUSE=YES
node tests/act7-071-controlled-acceptance.js
```

The process failed immediately with `TypeError: fetch failed`, before the first RPC completed and before any `ACT7_071_EVIDENCE_BOUNDARY` was emitted. Under the one-attempt STOP rule CD did not retry. Q0 after recovery remained exactly `579 = 577 + 2`, proving that this attempt created no additional run. No Q1–Q4 record exists because no evidence boundary was reached.

## Fail-closed recovery

1. CD immediately re-froze PUBLIC/anon/authenticated/service_role EXECUTE on all six admission functions.
2. Teacher switched Pages once to `deploy/manual-acceptance-20261003` at `/(root)`.
3. GitHub Pages run `39206010849` started at `2026-10-19T05:43:24Z` and completed successfully at `2026-10-19T05:44:12Z` for exact commit `891feffe558a4683ac3da67e1e6b15e902c7e592`.
4. One cache-busted public pass returned HTTP 200 and exact frozen SHA-256 values:
   - `index.html` — `1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4`
   - `teacher.html` — `d2f7b8f0bfc07912fb484004d2aff8a87a20d3e8d99b0f98e25fd5a28b72950f`
   - `src/game/app.js` — `9f19c27f92be9835ea5d9b48e196803dcee85eae032feb0f9e65fe3e97b323fa`
   - `src/teacher/teacher-console.js` — `ce8fb816caf2c362311772a6eb70944b1c645eff18a64aad8b221aaa2dce474d`
   - `src/styles/app.css` — `3a375c87aeec797e2b32f8ba383d91af9ef6f9e9d01bb40cf0e3faa0f04ead7c`
5. SHA-pinned `071_RECOVERY.sql` (`e7e74f16885c730ef10d4f577420be486d8d07a774d2d9b43a97ec8a66eff683`) executed transactionally.
6. The six-argument `s5_teacher_open_vote` overload is absent. The four pre-071 S5 identities are owned by `postgres`, remain SECURITY DEFINER with `search_path=public`, and carry the reviewed pre-071 ACLs.
7. The six admission ACLs were restored exactly. Their raw body MD5s are unchanged:
   - create `d3dcb4f6f6a2622c05da82949c12e3fc`
   - join `8b3ec60fac5035208abbb5a3781afb65`
   - reset `f006dc6bed504c2da8452e9d7d88bb0a`
   - direct start `84f71e97cc493623913dbe748c05c956`
   - initialize `5bbb0d18387ea41d1a467099d82beebb`
   - formal start `7003fa6777f14382a094eadacc3dc183`
8. Final Q0 remained `579 = 577 + 2`; service_role, authenticator and other external non-idle client counts were all zero.

## Closure and next owner

The candidate is not accepted. Production is back on the frozen Pages and pre-071 SQL baseline. The failure is an executor-network failure before any controlled fixture mutation, not product acceptance evidence. The one-attempt authorization is consumed.

NEXT_OWNER: CA — independently audit the recovery evidence and decide HOLD versus a separately authorized future execution path with a production-capable network executor. Do not retry this fixture or redeploy 071 under the consumed gate.
