# 071 failed-acceptance root cause and recovery provenance

Timestamp: 2026-10-18T03:45:00Z  
Authority: CA-235 read-only targeted investigation  
Disposition: `ROOT_CAUSE_VERIFIED / 071_RUNTIME_NOT_VALIDLY_TESTED / NO_PRODUCTION_MUTATION`

## Executive finding

The two missing `discussion_sessions` rows are not evidence that migration 071 failed to create ACT6 discussion state. They are the intentional prepared state introduced by migrations 061/062 and retained by 063/064. The production acceptance harness used the older Sprint5 sequence and omitted the three-Player ACT5-handoff observation and ACT6-entry barrier.

The four recovery MD5 differences are fully explained by function-body newline provenance. The 2026-10-16 production functions used CRLF inside `prosrc`; recovery execution installed semantically identical LF bodies. A read-only simulated CRLF conversion reproduces all four catalog MD5 values exactly.

## ACT6 call-chain evidence

Current live functions and repository history agree:

1. `s5_initialize(text,text)` calls `s5_ensure_initialized(run_id)`.
2. Since migration 061, `s5_ensure_initialized(uuid)` deliberately inserts `s5_run_state` and the ACT6 round-1 `s5_rounds` row but does **not** call `s5_configure_discussion` or start the timer.
3. Migration 062 corrected only the prepared audit-event foreign key and retained the same prepared-state behavior.
4. `s9_observe_act5_handoff` records each Player's observation.
5. `s9_enter_act6` records per-Player entry. Only when `entered_count=3` and run-level `act6_entered_at` is null does it call `s5_configure_discussion`, create/start the canonical DiscussionRoom, set the ACT6 scene and log `act6_discussion_started`.
6. `src/game/app.js` calls `s9_enter_act6`; current Package A/B live tests perform observe + enter for all three Players before expecting a canonical discussion.

The legacy helper in `tests/sprint5-live-e2e.js` ends with `s5_initialize` and returns immediately. Its downstream assertions assume a DiscussionRoom already exists. That assumption became obsolete at migration 061.

## Synthetic-run read-only proof

Both retained runs are in the expected pre-barrier state:

| Room | Run | Player handoff observed | Player ACT6 entered | Run ACT6 entered | Location |
|---|---|---:|---:|---|---|
| `S5MVD7U6BFWE39` | `11fe60fc-ec56-4fa0-be6f-5d1a2de42003` | 0/3 | 0/3 | null | all `library` |
| `S5MVD7VJRH9CIC` | `e5161467-afe5-4c1c-839b-3c625a1e8f8b` | 0/3 | 0/3 | null | all `library` |

Therefore `s9_enter_act6` never reached its three-Player barrier and `s5_configure_discussion` was never expected to run. No swallowed configure error or partial configure transaction is evidenced. Whether 071 passes the intended late-third-vote acceptance remains **NOT VERIFIED** because the scenario never entered ACT6 discussion.

## Recovery MD5 provenance

Read-only SQL compared live `pg_get_functiondef` with the same definition after replacing only `prosrc` LF with CRLF:

| Function | Live LF MD5 | Simulated CRLF-body MD5 | 2026-10-16 expected |
|---|---|---|---|
| `s5_configure_discussion(uuid,text)` | `4cf7dd872a634dcc4a06b98b222a073f` | `6789065a3f46b7771c1f7608ee80b391` | `6789065a3f46b7771c1f7608ee80b391` |
| `s5_get_teacher_discussion_state(text,text)` | `f4168be69f971c54b491334b01498182` | `352e1dd5729fa0ababd7f332aa3de1e5` | `352e1dd5729fa0ababd7f332aa3de1e5` |
| `s5_teacher_add_time(text,text,integer)` | `e71b9488e2970ba405126d0cbdb48ddf` | `b66ea3897c710cb381be330d6797bc30` | `b66ea3897c710cb381be330d6797bc30` |
| `s5_teacher_open_vote(text,text)` | `33f2df3abac4d12a985ce267b10762a2` | `d63a8861832ee33092632553eacc753c` | `d63a8861832ee33092632553eacc753c` |

All four exact matches make newline provenance verified, not speculative. Current signatures, owners, SECURITY DEFINER flags and ACLs remain the reviewed pre-071 set. Exact raw `pg_get_functiondef` byte restoration is not presently true because live bodies are LF; semantic behavior is restored.

## Minimal corrective proposal — not implemented

1. Update the controlled acceptance fixture after `s5_initialize` to assert prepared state (`discussion:null`), call `s9_observe_act5_handoff` and `s9_enter_act6` for each of three Players using the current run identity, then assert the third entry creates exactly one canonical ACT6 discussion.
2. Reuse the already-current Package A/B helper sequence rather than duplicating the obsolete Sprint5 assumption.
3. Preserve explicit checks that one and two entrants do not start the timer, the third entrant starts it once, and NORMAL ACT6 stored discussion/vote limits are 10,800 only after 071 is deployed.
4. Continue the reviewed ACT6→ACT7 round-2→61-second late-third-vote→ACT8 scenario only under a new production gate. No new production run is authorized by CA-235.
5. For future recovery gates, record both raw MD5 and newline-normalized semantic MD5. If raw prechange-byte identity remains mandatory, the execution path must preserve CRLF inside `prosrc`; repository text equivalence alone is insufficient.

## Remaining NOT VERIFIED

- Migration 071 behavior under the corrected three-Player barrier acceptance is NOT VERIFIED.
- No proof was collected that an actual production browser flow under 071 reaches and completes ACT7; no further run was authorized.
- Whether CA wants raw CRLF byte restoration or accepts the semantically identical LF definitions requires a separate production-mutation decision.
- Disposition of the two synthetic ACTIVE runs remains separate and unauthorized.

No database, ACL, Pages, runtime source, test source, synthetic row or canonical specification was modified during this investigation.
