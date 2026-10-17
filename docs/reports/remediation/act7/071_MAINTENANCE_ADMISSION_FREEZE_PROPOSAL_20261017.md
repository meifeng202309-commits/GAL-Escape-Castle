# ACT7 071 maintenance admission freeze — read-only findings and reversible proposal
Status: READ_ONLY_COMPLETE; ACL_FREEZE_NOT_EXECUTED; 071_NOT_APPLIED; PAGES_UNCHANGED.
Teacher authorized reconsidering zero ACTIVE rows conditional on demonstrably no-current-play plus enforceable admission freeze. No separate production privilege alteration was authorized yet.

## Existing activity
577 active game_runs: 369 AUDIT, 208 NORMAL. Newest started 2026-10-04; none started within last 7 days. Rooms associated with active runs had zero player last_seen_at within prior 24 hours (latest 2026-10-04). last_seen_at alone is not a guaranteed heartbeat or proof of no live session.

## Effective browser-facing paths (live catalog, SELECT only)
s1_create_room(text,text,text,text,text), s1_join_player(text,text), s9_start_formal_game(text,text,text), s1_reset_room(text,text) all SECURITY DEFINER, owned by postgres, explicit EXECUTE grants postgres/anon/authenticated/service_role, no PUBLIC. s1_reset_room modifies Sprint1 decisions and should be disabled during maintenance.
s3b_initialize_flow(text,text) additionally has PUBLIC EXECUTE; requires valid Teacher token and an active run, then mutates S3B, so it is another maintenance-era write path.
s2_start_run(text,text,text) currently grants EXECUTE only postgres/service_role, but s9_start_formal_game calls it. Potential other service_role/internal pathways were not exhaustively examined.

## Candidate freeze — DO NOT EXECUTE until independent verification and explicit release gate
Capture exact live ACL/owner/signature MD5 before starting. Inside a transaction REVOKE EXECUTE from anon/authenticated for s1_create_room, s1_join_player, s9_start_formal_game and s1_reset_room. For s3b_initialize_flow revoke from PUBLIC,anon,authenticated. Verify effective has_function_privilege is FALSE for anon and authenticated on all five identities. Verify no alternative exposed initiator or privileged backend bypass and no presently active players. Service-role remains administrative and is not frozen; this limitation must be assessed.
Following 071 SQL and synchronized minimal two-file Pages cutover, restore exactly original ACLs inside a separate transaction, including the preexisting PUBLIC grant on s3b_initialize_flow; restoration of a broad preexisting grant is NOT an endorsement of that privilege.
Actual browser/RPC negative tests must establish entry rejection and subsequent restoration. Merely hiding UI or knowing no recently started games is not adequate.

## Stop and safety rules
STOP on any evidence of current participation, active admission during maintenance, privilege mismatch, uncovered public entrypoint, unexpected concurrent service_role activity, failed rollback verification, mismatched 071 prechange source, inability to restore Pages or SQL, or inability to block new admissions.
Keep 577 historical ACTIVE records unchanged: no blanket completion/deletion. No mutation performed. 071 execution and real 3-player validation remain pending.
Next: one independent CD review of bounded freeze scope and restoration; then CA may request the exact production privilege-change approval before execution.