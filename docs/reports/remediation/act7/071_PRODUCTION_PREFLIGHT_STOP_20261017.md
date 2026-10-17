# ACT7 071 production maintenance — CD preflight STOP

Timestamp: `2026-10-17T15:45:44Z`  
Gate: CA-232 / `PRECHECK_ONLY_UNTIL_ALL_GATES_PASS`  
Outcome: `STOP_BEFORE_MUTATION / SERVICE_ROLE_QUIESCENCE_NOT_VERIFIED`

No `REVOKE`, DDL, migration, RPC mutation, synthetic room, Pages switch or production data change occurred.

## Preflight results

### 1. Privileged/service-role jobs and operators — NOT VERIFIED (blocking)

Point-in-time technical evidence was clean:

- Supabase has no deployed Edge Functions;
- `pg_cron` is not installed;
- `pg_stat_activity` at `2026-10-17T15:44:24.482807Z` showed zero active `service_role`, zero active `authenticator`, and zero other non-idle external client backends;
- GitHub Actions reported zero queued and zero in-progress runs;
- repository Actions contains one manual `workflow_dispatch` workflow and no scheduled workflow;
- repository search identifies four scripts that can consume `SUPABASE_SERVICE_ROLE_KEY`, including `wp-r4a-publish-activate-images.mjs`, which can call `s1_create_room`.

This proves no observed in-project automation was active at the sampled time. It does **not** identify every external service-role key holder or provide an owner attestation that all external scripts/operators are paused for one uninterrupted execution window. CA-232 expressly forbids replacing that positive owner/evidence requirement with an assumption. Therefore mandatory precondition 1 is `NOT_VERIFIED` and production mutation must not start.

### 2. Immediate no-current-play observation — PASS under Teacher-accepted residual

At `2026-10-17T15:44:24.482807Z`:

- ACTIVE-run gameplay/event/dialogue/ledger/action-receipt/override activity: `0` in 15 minutes and `0` in 24 hours; latest observed event remains `2026-10-04T14:52:37.624037Z`;
- ACTIVE-room Player `last_seen_at`: `0` in 15 minutes and `0` in 24 hours; latest remains `2026-10-04T15:50:50.479594Z`;
- no active external database client backend was observed.

Teacher already accepted the absent API/Realtime telemetry residual. No actual gameplay activity was observed.

### 3. Pages live identity and rollback source — PASS

All five public URLs returned HTTP 200 and exactly matched frozen `891feffe558a4683ac3da67e1e6b15e902c7e592`:

| File | SHA-256 |
|---|---|
| `index.html` | `1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4` |
| `teacher.html` | `d2f7b8f0bfc07912fb484004d2aff8a87a20d3e8d99b0f98e25fd5a28b72950f` |
| `src/game/app.js` | `9f19c27f92be9835ea5d9b48e196803dcee85eae032feb0f9e65fe3e97b323fa` |
| `src/teacher/teacher-console.js` | `ce8fb816caf2c362311772a6eb70944b1c645eff18a64aad8b221aaa2dce474d` |
| `src/styles/app.css` | `3a375c87aeec797e2b32f8ba383d91af9ef6f9e9d01bb40cf0e3faa0f04ead7c` |

Remote refs are intact:

- `deploy/manual-acceptance-20261003` -> `891feffe558a4683ac3da67e1e6b15e902c7e592`;
- `safety/pages-before-manual-acceptance-20261003` -> `652b7c4cc49bf247e4ce7e59620f05ffe8a16825`.

### 4. Six-function ACL/MD5 and 071 prechange — PASS

Immediate catalog reads reproduced the reviewed six admission/start identities, owners, `SECURITY DEFINER` flags, ACLs and MD5 values exactly. The four deployed S5 functions still match the 071 prechange catalog and only the legacy two-argument `s5_teacher_open_vote` exists. Recovery sources remain present. No privilege or definition drift was observed.

### 5. Coordinated uninterrupted executor path — NOT AVAILABLE

Because external privileged caller ownership/quiescence is not positively established, CD cannot guarantee an uninterrupted freeze -> 071 -> two-file Pages -> acceptance/recovery window. Starting the freeze would risk leaving a partial live maintenance state unattended and violates the explicit CA stop rule.

## Exact closure condition

CA must obtain and record a time-bounded owner attestation identifying the external service-role key/job/operator envelope and confirming it is paused for the full maintenance window, with a named coordinator available through ACL restore/recovery. After that evidence is canonicalized, a fresh immediate activity/Pages/catalog preflight is required because these snapshots are time-sensitive. Until then: production remains unchanged and HOLD.

