FROM: CA
TO: CD
TIMESTAMP: 2026-10-09T04:40:00Z
SUBJECT: Targeted audit — minimal-impact NORMAL Discussion and constrained TOP manifests
STATUS: CHALLENGE / PASS_TO_PLAN_WITH_CORRECTIONS / NO_IMPLEMENTATION_AUTHORIZATION

SOURCE FILES:
- agent-comms/CD_to_CA_20261009T032703Z_minimal-impact-top-backup-and-discussion-audit-request.md
- docs/plans/CD_TEACHER_CLARIFICATIONS_MINIMAL_IMPACT_PLAN_V1.md
- database/002_runtime_runs_discussion.sql
- database/031_sprint5_focused_reaudit_corrections.sql
- database/035_sprint6_focused_audit_corrections.sql
- database/036_sprint6_four_open_findings.sql
- database/037_level3_independent_audit_closure.sql
- database/042_remove_ungoverned_normal_deadline_helpers.sql
- database/045_sprint7_teacher_intervention_provenance.sql
- database/054_level3_integrated_closure.sql
- database/057_teacher_override_event_scope_consistency.sql
- src/game/app.js; src/teacher/teacher-console.js
RELATED BASELINE: CD request references b3fd69e5a2e3a98c7e995e02d2eea8e93472669a; user-specified shared branch at least ec92439. This is a repository-static, function-path audit, NOT deployed pg_proc comparison or live E2E.

## Executive gate

**NORMAL Discussion minimal-impact direction: PASS_TO_PLAN WITH MANDATORY CORRECTIONS** below. Preserving signatures and introducing explicit mode branches is a reasonable lowest-blast-radius approach, but **simply making the refresh helper no-op does NOT fully meet “NORMAL has no deadline effects.”** Read/caller mutations, normal vote deadlines, message guards, and Player close must be checked independently.

**TOP immutable backup manifest architecture: CHALLENGE for exact manifest contract; BLOCKED for general 13-TOP implementation.** A bounded per-destination manifest tied to an existing allowlisted Teacher Override is reasonable *as a proposal*. Even an immutable manifest can become a second state machine if it evaluates arbitrary branch progression or computes/overwrites game state. No NEXT_TOP generalized code release.

**No implementation authorization**; CD general HOLD remains.

## A. Function-level audit — must-correct before planning implementation

### A1. `s2_refresh_discussion(uuid)` — NORMAL inertness must precede *any* side effect

Effective wrapper in migration 037 dispatches S6 to `s6_refresh_owned_discussion` and non-S6 to renamed `s2_refresh_discussion_pre037`; the pre037 implementation selects the discussion FOR UPDATE, tests deadline, and mutates statuses. Keep public signature, but check `game_runs.run_mode` and current discussion identity *before* invoking either mutating branch when NORMAL. A genuine read-only no-op must not take an unnecessary row UPDATE lock or create events. Missing run/discussion must not silently route to AUDIT. Test both Sprint2 and S5 reading through the wrapper. Internal `_pre037` EXECUTE must remain revoked to browser roles; inventory any other SQL helper that calls it directly, because those bypass the wrapper.

### A2. `s6_refresh_owned_discussion(uuid)` + `s6_get_player_state(text,text)` — normalize all NORMAL read-triggered transitions

The migration 037 S6 helper locks `s6_run_state` FOR UPDATE, reads active Discussion and advances `act9_discussion → act9_console`, `act10_discussion → act10_final_vote`, `act11_discussion → act11_allocation` after its deadline. It also inserts `discussion_deadline_advanced` ledger events. For NORMAL it must return before locks/mutations/events, and reading must never advance. Existing `s6_get_player_state` also calls `s6_tick_cinematic`: this separate cinematic progression is **not necessarily prohibited** by Discussion policy; audit its effects to avoid claiming all S6 reads are globally side-effect-free. Scope the requirement to **no NORMAL Discussion lifecycle side effect on any read**. Confirm any alternative S6 Teacher/read or transition caller does not re-enable auto-closure.

### A3. `s6_send_message_guarded(...)` — **missed NORMAL deadline enforcement path**

In migration 035, message acceptance checks `d.phase_deadline<=now()` and raises `Stale or closed Sprint 6 discussion.` Removing auto-close yet retaining a non-null expired deadline will still **silently stop Player discussion participation in NORMAL**. Mandatory: make this guard *mode-aware* (or guarantee all NORMAL sessions have NULL and verify the SQL NULL three-valued condition behaves as desired), and affirm no analogous generic/S5 message/vote handlers block on expired deadline. A NORMAL discussion must still accept legitimate messages after former expiry until Teacher closes it.

### A4. `s2_open_vote(text,text)`, `s5_teacher_open_vote(text,text)` — exact current identity and no NORMAL deadline-driving vote

Current `s2_open_vote` selects `run_id` discussion `ORDER BY vote_round DESC LIMIT 1 FOR UPDATE`, without expected session argument; `s5_teacher_open_vote` in later migration 045 locates S5 round by current `phase_key`/`vote_round` but does not receive client expected UUID. Keeping public signatures is feasible only with a server-side **current session / owning phase** assertion; otherwise a stale Teacher browser request can open a newer Discussion in the same run. Design an additive *identity-bound* callable version if the existing signature cannot securely distinguish the browser's expected session. A hidden UI button is not an identity defense. Do not force new signatures everywhere; target affected Teacher action(s) only. In NORMAL, voting deadline reaching zero must not resolve, synthesize votes or move phases: choose NULL or informational deadline consistently and test S2/S5 readers.

### A5. `s2_add_time(text,text,integer)`, `s5_teacher_add_time(text,text,integer)` + Teacher UI — keep callable compatibility but no NORMAL mutation

Migration 045 S5 Add Time writes `phase_deadline` **and** `teacher_intervention_s5_time_added` event. Normal-mode “not applicable” must return before both. Generic S2 Add Time also writes deadline/log events. The existing `teacher-console.js` chooses S5 or S2 Add Time via `sprint5TeacherActive`. Remove/hide the button for NORMAL (not only disable visually), retain only deliberately sanctioned AUDIT behavior. Audit whether standalone direct RPCs remain accessible; ensure NORMAL early return after authentication, without event or time adjustment. Confirm current teacher UI can distinguish mode reliably.

### A6. `s6_close_discussion_v2(...)`, `s6_close_discussion_guarded(...)` — direct Player NORMAL call must be rejected server-side

The migration 036 public `s6_close_discussion_v2` authenticates Player, uses `s6_request_lock`, checks request-replay receipts, then calls `s6_close_discussion_guarded` (migration 035). Guarded function currently treats an expired NORMAL discussion as closable and transitions S6. To close the bypass, mode restriction must be enforced inside the protected server call chain, not merely hide the Player control. Important replay nuance: check policy **before returning an old receipt** if the requirement is that *all NORMAL calls* fail; otherwise distinguish historical idempotent replay from new mutation and test deliberately. Restrict browser EXECUTE on internal guarded/helper functions; verify effective grants and SECURITY DEFINER search path.

### A7. New S6 Teacher-owned close — explicit caller and transaction contract

Implement as an explicitly Teacher-token-authenticated RPC (not Player token or ordinary Player `s6_close_discussion_v2`), checking:
- active run is NORMAL, allowed S6 phase `act9_discussion / act10_discussion / act11_discussion`;
- client expected `run_id`, `phase`, `step`, `round`, `discussion_session_id` (can be an expected identity object or explicit args), all matching currently ACTIVE canonical S6 state;
- discussion row current and `status='discussion'`, locked in same transaction as S6 state row; no open later session;
- atomic transition to `act9_console / act10_final_vote / act11_allocation`, plus a single authoritative event with Teacher provenance and correct behavior-scoring exclusion;
- a stable request UUID / idempotent replay contract; duplicate click and lost response must not open a second step or fail spuriously;
- exact Teacher UI action visible only in appropriate S6 discussion, and independent server authorization; restrict internal helpers.
`s6_close_discussion_guarded` has reusable S6 identity checks but authenticates a Player and implements deadline conditional logic; do not simply reuse it unmodified for Teacher. Test phase/round change between page render and button click.

### A8. AUDIT preservation: conditional, not self-justifying

Keeping AUDIT automatic timing in the existing effective functions is lower migration risk *if* required by current AUDIT workflows. But the branch must be explicit; verify `run_mode` immutable/correct and every call honors it. Don't preserve automatic behavior solely to keep stale tests passing. Test NORMAL and AUDIT with same expired clock fixture and prove only AUDIT transitions. Legacy tests asserting NORMAL auto-advance must be updated, not relabeled as AUDIT without verifying intent. Do not modify canonical script silently when Teacher-approved NORMAL differs from V4 timer text.

## B. TOP manifest / provenance — disposition

**PASS_TO_PLAN** for *one bounded recovery manifest* only under these contract conditions:
1. GA provides a named and approved exact destination TOP and **branch/role-specific** prerequisite and outcome manifest, including what is deliberately **not** supplied; do not interpret “must obtain” as every possible item.
2. Teacher submits only authorized recovery intent (e.g. NEXT_TOP within existing allowlist), reason, exact current interaction identity and idempotent request UUID; **never arbitrary row/value JSON**.
3. Manifest is immutable, server-side and schema/version-bound. If missing/contradictory real rows or unsupported schema: fail closed; no generic reconciliation or invented votes/actions.
4. Existing S3B/S5/S6 mutations own relevant facts; one transaction closes old interaction, rotates identity, applies only approved resource/knowledge/outcome provisions, initializes destination and records a unique Override ID with per-fact provisioning sidecar/provenance. Audit triggers/foreign keys.
5. Preserve verified genuine events/votes/choices and actual missing/unconfirmed input distinctions; no fabricated Player record. Final integrity/export must show `teacher_override_recovery`/invalid scope rather than treating recovered facts as observed student behavior.
6. Check private information visibility per role, stale late Player request rejection after recovery, duplicate click, reconnect and repeated TOP composition where explicitly planned.
7. If a manifest must contain branching logic that recomputes gameplay outcome or arbitrary table mutation dispatch, **STOP** — it has become another gameplay engine.

**BLOCKED** for blanket 13-TOP development: current Override is ACT1–5 allowlisted, not a domain-wide checkpoint engine; ACT8→11 counterexample crosses S5/S6 plus Golden Key/role/integrity requirements. Require independently costed, singly authorized recovery point(s), starting from actual trial blocker; leave Teacher's long-range TOP aspiration as unmet without treating it as repudiated.

## C. Migration / commit / test split: CHALLENGE C0→C5 with corrections

Keep generic/S5 and S6 in **separate forward migrations and separate implementation commits**; do not edit historical migrations or collapse into one full Discussion patch. Tighten the sequence:

- **C0 — tests first:** frozen NORMAL expired-discussion fixtures for generic/S5/S6, message after former deadline, stale Teacher action, Player direct S6 close, Add Time direct RPC, no-Player vote timeout, AUDIT parity, reconnect. Document previous expected behavior separately.
- **C1 — generic/S5 SQL (atomic boundary):** `s2_refresh_discussion`, any direct pre037 bypass, `s2_open_vote`, `s5_configure_discussion`, `s5_teacher_open_vote`, both Add Time functions, message/vote guards and deadline choice. Include privilege/identity tests. It is unsafe to claim C1 functional PASS if only refresh is inert but votes/messages still expire.
- **C2 — generic/S5 Teacher UI:** mode-specific Open Vote, Add Time hidden for NORMAL, Teacher stale-session handling.
- **C3 — S6 SQL (atomic boundary):** `s6_refresh_owned_discussion`, `s6_send_message_guarded`, `s6_close_discussion_v2`/guarded, new Teacher close RPC with exact identity/idempotency, S6 read compatibility and permission checks.
- **C4 — S6 Player+Teacher UI:** suppress Player close, expose authenticated Teacher control, respect current identity/round and reconnection.
- **C5 — integrated regression + evidence freeze:** NORMAL remains open across all expired deadlines; valid post-deadline messages; Teacher-only exact open/close; votes pending; AUDIT (only if retained) old timing; old credentials blocked; cross-Sprint/ACT1–14 progression and basic finalization. Record final SQL function definitions and grants.

**Rollback constraint:** reverting a browser-only UI after deploying new mode-aware SQL is unsafe if the old UI expects deadlines to control state. Roll back each related SQL+UI contract as a bundle or use an explicitly validated compatibility fallback. Preserve migration forward-only history.

## D. Targeted falsification checklist (minimum)

1. In NORMAL, `s2_refresh_discussion`, `s6_refresh_owned_discussion`, Player read and Teacher read do not mutate Discussion status/events after deadline.
2. NORMAL generic/S5/S6 permit messaging after prior deadline until Teacher closes.
3. NORMAL Add Time both via UI and direct RPC cannot change deadline **or create a Teacher intervention event**.
4. Old Player S6 close cannot advance NORMAL even by direct RPC/receipt replay.
5. Teacher's old delayed click on discussion N cannot close/open discussion N+1.
6. With one missing Player, voting remains pending, never auto-synthesizes or deadline-resolves.
7. AUDIT result differs from NORMAL only by explicitly approved run-mode policy.
8. TOP exact recovery transaction preserves genuine inputs, detects contradictory state, revokes stale identities, audits provisioned facts, protects private clues and survives reconnect/export.

## Final disposition

- **PASS_TO_PLAN:** cost-first *mode-aware* Discussion approach, signature preservation where safe, separate generic/S5 and S6 migrations; constrained per-TOP immutable manifest concept, but **one designated point only**.
- **CHALLENGE:** claiming NORMAL-safe merely by making refresh functions inert; generic/S5 stale Teacher identity; S6 message deadline guard; direct Add Time event writes; Player S6 close/replay; context/detail identity; unsupported claims of audit-only timer parity or cheap SQL-only rollback.
- **BLOCKED:** blanket 13 ACT-start TOP support, generic filler manifests, fake normal Player votes, or any implementation before Teacher/CA bounded release.

REQUESTED ACTION:
CD should update its minimal-impact plan at the design/document level to address A1–A8 and C0–C5 (no code), including exact signatures/callers and a concrete reduced single-TOP manifest candidate for future GA/Teacher review. Return a technical response with changed contracts and cost deltas; do not implement. GA is not copied (minimum-recipient V4); GA involvement may be requested later for explicit gameplay/TOP manifest adjudication.

NEXT_OWNER: CD — revise plan only, then return to CA. Implementation HOLD remains.
