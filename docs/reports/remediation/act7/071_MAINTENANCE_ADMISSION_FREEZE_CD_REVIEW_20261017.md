# ACT7 071 maintenance admission freeze — independent CD review

Status: `GO_WITH_CONDITIONS`; review-only catalog/source work complete. No DDL, ACL change, RPC mutation, synthetic room, 071 execution or Pages deployment occurred.

## Verdict

The five-function proposal blocks the ordinary browser create/join/formal-start/reset/initialize paths for `anon` and `authenticated`, but it is not sufficient as written for a provable maintenance boundary. Use the corrected six-function freeze below, pair it with an operational service-role lock, and establish no-current-play immediately before mutation. Otherwise HOLD.

## Live catalog findings

All exact functions are `SECURITY DEFINER`, owned by `postgres`:

| Function | Current explicit ACL | Effective anon/auth | PUBLIC grant |
|---|---|---:|---:|
| `s1_create_room(text,text,text,text,text)` | postgres, anon, authenticated, service_role | yes/yes | no |
| `s1_join_player(text,text)` | postgres, anon, authenticated, service_role | yes/yes | no |
| `s9_start_formal_game(text,text,text)` | postgres, anon, authenticated, service_role | yes/yes | no |
| `s1_reset_room(text,text)` | postgres, anon, authenticated, service_role | yes/yes | no |
| `s3b_initialize_flow(text,text)` | PUBLIC, postgres, anon, authenticated, service_role | yes/yes | yes |
| `s2_start_run(text,text,text)` | postgres, service_role | no/no | no |

Current `pg_get_functiondef` MD5 values are, in the same identity order: create `ddd2dc46a66b4003e4c9b1e41277c6d4`, join `efc37a06b7b594e6aa3a4d81e90b4c3d`, formal start `04ebbe1608095b171540da4c5b08f5ed`, reset `2a72387597fea5092584934334106082`, initialize `c6170e560fc256736ce2209c528538b5`, and direct start `6927cc457cf7a1df5cb0bbbc28dd00a4`.

`s9_start_formal_game` calls both `s2_start_run` and `s3b_initialize_flow`. Catalog/source search found no other public browser-executable room creator or run starter, but `service_role` can call `s2_start_run` directly. The repository also contains a service-role-capable publication script that invokes `s1_create_room`. Function ACLs cannot prevent a service key from direct table writes, so all service-role automation/jobs and privileged operators must be quiesced for the entire window.

## Exact corrected freeze and restore plan

Before the freeze, recapture identity, owner, `prosecdef`, full `proacl`, definition MD5 and effective privileges and compare with the table above. Any mismatch is STOP.

In one transaction, revoke `EXECUTE` from `PUBLIC, anon, authenticated, service_role` on these exact six signatures:

1. `s1_create_room(text,text,text,text,text)`
2. `s1_join_player(text,text)`
3. `s9_start_formal_game(text,text,text)`
4. `s1_reset_room(text,text)`
5. `s3b_initialize_flow(text,text)`
6. `s2_start_run(text,text,text)`

Adding `s2_start_run` and `service_role` is defense in depth against the observed privileged bypass; it does not replace the operational service-role lock. After commit, require `has_function_privilege(role, identity, 'EXECUTE') = false` for each of `anon`, `authenticated`, and `service_role` on all six. Confirm no PUBLIC grant using `aclexplode(coalesce(proacl, acldefault(...)))`, not only `proacl` text.

Restore in a separate transaction only after the release/acceptance disposition:

- grant `EXECUTE` to `anon, authenticated, service_role` on the first four functions;
- grant `EXECUTE` to `PUBLIC, anon, authenticated, service_role` on `s3b_initialize_flow(text,text)` (restoring the pre-existing broad grant is not approval of it);
- grant `EXECUTE` to `service_role` on `s2_start_run(text,text,text)`;
- do not grant PUBLIC on the other five;
- verify full `proacl`, effective privilege matrix, owner and definition MD5 equal the immediate pre-freeze snapshot.

PostgREST negative calls while frozen must return permission denial for create/join/formal-start/reset/initialize using anon and authenticated credentials. Do not invoke business-success paths. After restore, privilege checks are mandatory; functional positive probes belong only to the separately authorized synthetic-room plan.

## No-current-play evidence

`last_seen_at` is insufficient. Read-only aggregate checks added the following independent signals for ACTIVE runs: latest `runtime_events`/`s1_game_events` activity was 2026-10-04; latest dialogue was 2026-10-03; ledger, action receipt and override tables also had zero events in the last seven days. Project logs available to this review exposed pgbouncer/postgres logs but no API gateway request stream, so they cannot prove absence of browser reads, open tabs, Realtime subscriptions or unlogged RPC attempts.

Therefore objective evidence is stronger but still not conclusive. Immediately before freeze require all of:

- zero recent `last_seen_at` and zero new gameplay/event/dialogue/action-receipt/override timestamps over a declared observation interval;
- no announced class/rehearsal and explicit operator confirmation that no service-role job is running;
- if API gateway/Realtime telemetry becomes available, zero relevant room/RPC activity/subscriptions during that interval;
- repeat the aggregate checks after the ACL freeze and before 071. Any delta is STOP.

No-current-play remains `UNKNOWN` if API/Realtime visibility and operational confirmation are unavailable.

## Minimum safe sequence

1. Declare maintenance and stop admission in the UI/communications; quiesce service-role jobs and privileged operators.
2. Capture Pages fingerprint plus exact six-function catalog/ACL/MD5 recovery evidence.
3. Observe no-current-play using the checks above; ambiguity or any delta is STOP.
4. Apply the six-function ACL freeze transaction; verify effective denial and only authorized negative probes.
5. Re-run activity aggregates; any new activity is STOP and restore ACLs.
6. Apply transactional 071, verify its reviewed poststate, then immediately publish only the frozen-baseline two-file Teacher candidate. No Players admitted between steps.
7. Run the separately authorized disposable synthetic-room acceptance only after restoring the admission ACLs; otherwise the test cannot create/join a room. Keep general admission closed operationally while the one controlled room is exercised.
8. On failure, execute the already reviewed SQL/Pages recovery as authorized, restore the exact six ACLs, verify snapshots, and retain evidence. On success, restore the exact ACLs, verify, then reopen admission only after CA disposition.

STOP on catalog drift, nonzero recent activity, missing API/Realtime evidence without explicit risk acceptance, any running service-role automation, privilege verification failure, unexpected public/alternate entry path, 071 mismatch, Pages fingerprint mismatch, or inability to execute and verify both SQL and ACL recovery.

