# ACT7 V4 S5 source-only implementation evidence

Implementation baseline: `7b9eafa3` (`CD: implement V4 S5 teacher-paced voting`)

## Scope delivered

- Added additive migration `database/071_act7_v4_normal_teacher_paced_vote.sql`; no previously deployed migration was edited.
- S5 NORMAL ACT6/7/8 discussion and vote limits are configured to the V4 10,800-second compatibility sentinel; AUDIT retains phase-specific 90/15/180-second discussion limits and 60-second vote limit.
- Disabled the unsafe two-argument S5 Open Vote public caller and added an authenticated overload requiring expected run, phase, round and discussion identity with row locks and stale rejection.
- NORMAL S5 Add Time returns `applicable=false` before deadline/event mutation. Its deliberate AUDIT behavior remains available.
- Teacher caller sends the exact S5 identities and hides Add Time in NORMAL, including before authoritative mode first loads.
- `s5_submit_vote` remains the genuine Player vote/settlement owner. Shared `s2_refresh_discussion`, S6, 069 and 070 were not changed.

## Evidence tiers

### SOURCE_STATIC — PASS

`node tests/act7-v4-normal-timeout-static-check.js`

Confirmed sentinel ownership, discussion/vote consistency, exact identity arguments and row locks, NORMAL early return before Add Time writes/events, AUDIT constants, explicit SECURITY DEFINER ACL revokes/grants, UI caller identities, initial/authoritative Add Time hiding, and no shared S2 deadline rewrite.

JavaScript syntax checks for the Teacher source and both new tests passed.

### BROWSER_MOCK — PASS

`node tests/act7-v4-normal-timeout-browser.mjs`

Confirmed NORMAL hides Add Time, S5 Open Vote sends the exact current run/phase/round/discussion identity, AUDIT shows Add Time, and the existing AUDIT caller still sends its 30-second request.

Adjacent existing Teacher browser regression also passed:

`node tests/bmin-teacher-operations-browser.mjs`

### EXISTING TEST RESIDUAL

`tests/sprint5-static-check.js` does not reach this delta because it first fails on pre-existing assertions for the old `const activeSession=session` / `if(session!==activeSession)return` polling tokens removed by the later A1 polling coordinator. This is a stale-test residual, not changed or concealed in this gate.

### SQL / LIVE — NOT_RUN

- Migration 071 parsing/application: `NOT_RUN`
- Clean 001–071 replay: `NOT_RUN`
- Real PostgreSQL/Supabase ACT7 round-2 two-vote/late-third-vote behavior: `NOT_RUN`
- Concurrency/stale-click database behavior: `NOT_RUN`
- Production deployment and human rehearsal: `NOT_RUN`

These are held by CA-224. No database, cloud resource, workflow or public deployment was changed.

## Future release boundary

Frozen Pages remains `891feffe558a4683ac3da67e1e6b15e902c7e592`. Do not deploy the moving remediation branch wholesale. A future candidate must enumerate only the accepted 071 database delta plus the exact Teacher files required for identity-bearing Open Vote and NORMAL Add Time hiding, preserve a rollback ref, and independently verify public fingerprints. Source-only 069/070 remain outside this release.
