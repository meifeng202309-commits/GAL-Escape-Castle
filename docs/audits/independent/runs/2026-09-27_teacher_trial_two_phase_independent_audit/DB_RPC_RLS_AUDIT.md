# FINAL DB / RPC / RLS AUDIT

Baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`  
Highest migration: 058

## E1. Effective function reconstruction

Repeated definitions were resolved by following rename/revoke/recreate chains through migration058.

Key effective surfaces:

- `s2_start_run`: migration002 definition remains authoritative.
- `s2_open_discussion`: migration013 wrapper; rejects generic discussion once canonical scene state exists.
- exact discussion message/vote APIs: migration013 versions.
- ACT1–5: latest remediation wrappers through 014b plus later Teacher Override interaction.
- `teacher_apply_override`: migration057 wrapper over corrected migration056/054 authority.
- ACT6–8: migration031/032 + automatic initialization correction in 039.
- ACT9–13: Sprint6 v2 guarded APIs + migration037/038 cross-sprint ownership.
- Teacher console projection: migration044, with Teacher intervention provenance from 045.
- ACT14 verifier/finalization/export: migration054 effective verifier/export chain plus 055–057 override-validity consistency.
- active storage failure telemetry: migration058.

## E2. Effective privileges

Source migrations consistently revoke superseded/internal helpers and grant browser execute only on public RPC contracts.

Notable privilege boundaries:
- generic/historical Sprint3 wrappers: revoked;
- old Sprint6 guarded APIs: revoked when v2 introduced;
- service-role Asset Manager publication/activation: not granted to anon/auth;
- internal integrity verifier: not browser-executable;
- current `teacher_apply_override`: anon/auth executable but requires Teacher token server-side;
- `asset_report_load_failure`: browser executable but exact ACTIVE identity validated server-side.

## E3. RLS

All project-owned behavioral/asset tables identified in migration history are RLS-enabled in source, including the delayed enablement of `s6_station_b_progress` in migration037.

The architecture intentionally routes browser access through SECURITY DEFINER RPCs rather than broad direct-table policies.

Deployment-effective policy state is **NOT VERIFIED live** in this CA environment.

## E4. Constraints / uniqueness

High-value source constraints include:
- role/session uniqueness in Sprint1;
- one player decision per legacy scene;
- one open discussion per run partial unique index (migration013);
- message request identity;
- formal action receipt/request identities;
- paired Asset activation controls;
- one finalization per run / run-bound integrity;
- override validity and event consistency.

## E5. SECURITY DEFINER

Reviewed runtime functions use fixed `set search_path=public` and explicit token/session validation before state mutation.

No dynamic SQL was found in the audited high-value public runtime surfaces.

## E6. Duplicate truths

Intentional layered projections exist:
- `game_runs.scene/phase` plus detailed scene tables;
- generic `discussion_sessions` plus Sprint-specific round/state tables;
- repository asset registry plus runtime Asset Manager projection.

These are generally reconciled by controlled helpers.

The problematic duplicate truth is external to the canonical formal model:
- legacy Sprint1 `s1_room_state` remains live and is actively rendered by the root player before formal run.

Teacher root UI can also mutate this legacy truth during the product lifecycle.

## E7. Clean-schema / live effective verification

**BLOCKED / NOT VERIFIED.**

Current CA tools can read the complete migration source but cannot:
- apply migrations to an isolated Postgres instance with Supabase extensions;
- execute live authenticated POST/RPC calls against the configured project;
- inspect deployed pg_proc / grants / policies directly.

Therefore this artifact distinguishes source-effective proof from deployment-effective proof.

Teacher screenshots provide live evidence only for the reported trial session, not a complete schema/privilege dump.
