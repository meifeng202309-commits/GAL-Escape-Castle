# ACT7 migration 071 — CA maintenance admission-freeze gate

**Audit type:** targeted Level 1 production-maintenance gate review  
**Date:** 2026-10-17  
**Decision:** `BLOCKED_FOR_PRODUCTION` / admission-freeze design `PASS_WITH_CONDITIONS`

## 1. Audit identity / baseline / exact scope

Trigger:
- `agent-comms/CD_to_CA_20261017T140500Z_071-maintenance-admission-freeze-review.md`

Repository baseline reviewed:
- branch: `remediation/sprint9-structural-v1`
- trigger HEAD: `b55c5e7f9b6200d6fd955dc5ddbaf2fe0983d7c3`
- effective 071 source/recovery preparation: `d2ceb19589e71bb848d3f880f97c830dc11f1792`
- original 071 behavior implementation: `7b9eafa74f7e2437c668f942a15f2f33e2c11eea`
- frozen Pages baseline: `891feffe558a4683ac3da67e1e6b15e902c7e592`

Live database evidence:
- Supabase project: `qdcbdcjobzytzhnhfwyn`
- read-only catalog/aggregate queries only
- no DDL, ACL mutation, gameplay RPC, business-row mutation, migration execution or deployment performed

Exact audit scope:
1. determine whether the corrected maintenance admission freeze is technically sufficient to prevent new normal game admission/start during the 071 SQL/client compatibility window;
2. independently verify the exact six-function live ACL/definition baseline;
3. challenge alternate browser/service-role bypasses and the strength of the no-current-play evidence;
4. disposition the production gate without reopening the already-reviewed 071 source design.

This audit does **not** re-audit all Round-1 remediation or authorize migrations 069/070.

## 2. Authoritative / governance sources

- `docs/specs/current/古堡逃脱游戏脚本 V4.0.md` — ACT7 / NORMAL Teacher-paced semantics and formal-run preservation rules.
- `docs/specs/current/Codex程序开发说明书 V2.4.md` — additive migration and verified-runtime/security preservation.
- `docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.4.md`.
- `docs/onboarding/GAL_ESCAPE_CASTLE_Agent_Action_Log_Rules_V1.1.md`.
- `agent-comms/inter_agent_talk_protocol V4.md`.
- `docs/reports/remediation/act7/071_RELEASE_PACKET.md`.
- `docs/reports/remediation/act7/071_PRECHANGE_CATALOG_20261016.md`.
- `docs/reports/remediation/act7/071_RECOVERY.sql`.
- `docs/reports/remediation/act7/071_CONTROLLED_ACCEPTANCE_PLAN.md`.
- `agent-comms/CA_to_CD_20261017T004000Z_act7-071-release-packet-review-disposition.md`.
- CD review/report named in the trigger above.

## 3. Independent evidence

### 3.1 Repository delta

Comparison `d2ceb195... -> b55c5e7f9b6200d6fd955dc5ddbaf2fe0983d7c3` contains only reports, logs and inter-Agent communications. No runtime source, database migration, asset or protected canonical file changed after the effective 071 source/recovery baseline.

### 3.2 Live six-function catalog verification

Independent production catalog reads reproduced CD's six exact identities and definition hashes:

| Function | anon | authenticated | service_role | PUBLIC | MD5 |
|---|---:|---:|---:|---:|---|
| `s1_create_room(text,text,text,text,text)` | yes | yes | yes | no | `ddd2dc46a66b4003e4c9b1e41277c6d4` |
| `s1_join_player(text,text)` | yes | yes | yes | no | `efc37a06b7b594e6aa3a4d81e90b4c3d` |
| `s1_reset_room(text,text)` | yes | yes | yes | no | `2a72387597fea5092584934334106082` |
| `s2_start_run(text,text,text)` | no | no | yes | no | `6927cc457cf7a1df5cb0bbbc28dd00a4` |
| `s3b_initialize_flow(text,text)` | yes | yes | yes | yes | `c6170e560fc256736ce2209c528538b5` |
| `s9_start_formal_game(text,text,text)` | yes | yes | yes | no | `04ebbe1608095b171540da4c5b08f5ed` |

All six are `SECURITY DEFINER`, owner `postgres`.

The original five-function proposal was insufficient because `service_role` could call `s2_start_run` directly. The corrected six-function proposal closes that identified run-start bypass at the function-execute boundary.

### 3.3 Important scope boundary: admission freeze is not a global mutation freeze

Independent catalog/definition inspection also found other browser-executable `SECURITY DEFINER` mutators that require an already-active run, including:
- `s3_initialize_audit_fixture(text,text)`;
- `s3b_leave_start_room(text,text)`;
- `s5_initialize(text,text)`;
- `s6_initialize(text,text)`.

Therefore the six-function control is correctly described as a **new admission / start freeze**, not as proof that every historical ACTIVE run is globally write-frozen.

That distinction is acceptable only if the separate no-current-play condition is satisfied or its remaining observability risk is explicitly accepted.

### 3.4 Current-play evidence

Independent aggregate-only production reads found:
- active `game_runs`: **577**;
- newest active run started: **2026-10-04 14:52:37 UTC**;
- active runs started in last 7 days: **0**;
- active-room player `last_seen_at` in last 24h: **0**;
- active-run `runtime_events`, `s1_game_events`, dialogue, ACT6–13 ledger, S6 action receipts and Teacher overrides in last 7 days: **0**.

This strongly supports the interpretation that the 577 ACTIVE rows are stale historical state.

However Supabase logs available to CA for the last 24h expose only `pgbouncer_logs` and `postgres_logs`; no API-gateway/Realtime stream is available. Open tabs, passive subscriptions, reads or unlogged calls therefore cannot be excluded.

Result:
- stale historical ACTIVE state: **strongly supported**;
- actual no-current-play: **NOT VERIFIED**.

## 4. Decision

### 4.1 Corrected six-function admission-freeze design

**PASS_WITH_CONDITIONS**

The technically acceptable maintenance boundary is:
1. pre-freeze exact owner / SECURITY DEFINER / full ACL / effective privilege / MD5 snapshot;
2. in one transaction revoke `EXECUTE` from `PUBLIC, anon, authenticated, service_role` on the six exact functions listed above;
3. verify effective denial for `anon`, `authenticated`, and `service_role`, and verify no PUBLIC execute grant;
4. keep every service-role automation/job and privileged operator quiescent because function ACLs cannot prevent direct privileged table writes;
5. restore the exact pre-freeze ACLs and reverify owner/MD5/effective privileges before reopening general admission.

### 4.2 Production execution

**BLOCKED_FOR_PRODUCTION**

The block is not a new 071 source defect. It is a production gate condition:

1. **No-current-play remains NOT VERIFIED.** Aggregate evidence is strong, but API/Realtime observability is unavailable and historical ACTIVE sessions retain other callable mutators.
2. **The revised privilege-change scope has not yet received exact Teacher/User risk authorization.** The prior five-function planning approval did not authorize this six-function `PUBLIC/anon/authenticated/service_role` production ACL mutation plus operational service-role quiescence.
3. **Live execution is still NOT RUN:** ACL freeze/restore, migration 071, two-file Pages switch, three-player late-vote acceptance and recovery execution are unverified in production.

No database or deployment action may start under this CA disposition.

## 5. Canonical Ownership Check

**PASS.**

The implementation interval after `d2ceb195...` contains no protected canonical-source changes. This gate review modifies governance/audit artifacts only.

## 6. Codex recurring-error Pattern scan

| Pattern | Result | Audit disposition |
|---|---|---|
| A — local correctness / cross-module handoff | PASS at design; live NOT VERIFIED | SQL -> Pages -> ACL restore -> synthetic acceptance sequencing is defined, but not executed. |
| B — distributed happy-path assumptions | NOT VERIFIED | Stale/open clients and unlogged calls cannot be disproved with current telemetry. |
| C — UI rule mistaken for server rule | PASS for admission scope | Corrected freeze is server-side ACL enforcement; it is not a universal mutation freeze. |
| D — current state / historical evidence loss | PASS | 577 historical ACTIVE rows are preserved; no blanket cleanup/deletion is authorized. |
| E — authority accretion / legacy reachability | PASS_WITH_CONDITIONS | `s2_start_run` service-role bypass is incorporated; privileged direct writes still require operational quiescence. |
| F — self-confirming tests | NOT VERIFIED live | No real freeze/deny/restore or production 071/late-third-vote run has occurred. |

## 7. NOT VERIFIED boundaries

- actual absence of every live browser/open tab/Realtime subscriber;
- temporary ACL freeze and exact ACL restoration;
- production SQL compilation/execution of 071;
- real third vote after the former 60-second boundary;
- frozen two-file Pages publication/fingerprint;
- actual SQL/Pages/ACL recovery execution.

## 8. Next owner / closure condition

**NEXT_OWNER: Teacher/User**

One discrete GO/HOLD decision is required on the revised maintenance risk envelope:

- temporary six-function production ACL freeze including `service_role`;
- explicit operational quiescence of service-role jobs/operators;
- acceptance that no-current-play is supported by strong stale/activity evidence but remains technically `NOT VERIFIED` without API/Realtime telemetry;
- if GO, the already bounded 071 + two Teacher files + one synthetic three-player acceptance + pre-authorized recovery sequence may proceed under a fresh CA execution gate.

Until that decision: **PRODUCTION HOLD**.
