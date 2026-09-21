# Independent Audit Findings

Baseline: 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe  
Audit run: 2026-09-21_sprint3b_baseline  
Protocol: Independent_Development_Snapshot_Audit_Protocol_v1.1.md  
Status: IN PROGRESS

# 1. Master Findings List

| Issue ID | Severity | Status | Problem description | Evidence / reproduction | Code file(s) | Symbol / function / line range | Baseline SHA | Violated invariant / risk | Recommended fix | Audit method | Owner | Fix commit | Re-test result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IDA-001 | HIGH | CONFIRMED | DiscussionRoom vote resolution and Sprint 3B Game Track progression are separate transactions; progression depends on the final voter's browser issuing a second RPC. | Commit final vote, then lose/stop client execution before s3b_apply_*; discussion is resolved while Sprint 3B scene remains at discussion. Static control-flow proof complete; live failure injection pending. | src/game/app.js; database/004_sprint2_fallback_resolution_semantics.sql; database/011_sprint3b_transition_and_act1_delivery_integrity.sql | app.js submitVote() lines 309–323; s2_submit_vote(...); s3b_apply_meeting_resolution(...); s3b_apply_act5_resolution(...) | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Cross-module authority handoff is not server-atomic/recoverable; valid run may stall after committed behavior resolution. | Make authoritative resolved discussion server-recoverable/idempotently applicable without depending on one browser's next JS line. | Method 1 + Method 5; later Method 8 verification | CD | — | NOT YET RETESTED |
| IDA-002 | MEDIUM | CONFIRMED | Sprint 3B direct DiscussionRoom inserts can bypass the generic single-open-discussion guard and create more than one open session in one run. | Open generic Teacher discussion first, then reach Sprint 3B ACT 2/ACT 5 discussion creation path; generic guard is not reused by direct inserts. Live reproduction pending. | database/003_sprint2_discussionroom_audit_fix.sql; database/007_sprint3b_act1_5_placeholder_flow.sql | s2_open_discussion(...); s3b_leave_start_room(...) lines 129–147; s3b_submit_act4_choice(...) lines 233–256 | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Active-discussion uniqueness is an RPC convention, not a shared DB/server invariant; zombie sessions and ambiguous authority possible. | Centralize discussion creation or enforce one shared server/database invariant across all creation paths. | Method 2 + Method 4 + Method 5 | CD | — | NOT YET RETESTED |
| IDA-003 | MEDIUM | CONFIRMED | Formal player UI can fail open to legacy Sprint 1 controls if Sprint 1 state loads but Sprint 3B state retrieval fails. | During formal run, allow s1_get_player_state to succeed and make s3b_get_player_state fail; renderState() has already rendered legacy controls and refreshSprint3b() only hides Sprint3B panel. | src/game/app.js; src/content/scenes.js; database/001_sprint1_core.sql | refreshState() lines 96–105; refreshSprint3b() lines 111–118; renderState() lines 340–374; s1_submit_private_choice(...) | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Formal UI failure path can expose a non-authoritative legacy interaction and create misleading legacy evidence. | Once formal flow is active, fail closed to reconnect/error state; do not expose legacy interactive controls because a higher-layer fetch failed. | Method 5 + Method 7 + later Method 8 verification | CD | — | NOT YET RETESTED |

| IDA-004 | MEDIUM | CONFIRMED | Library Box locked-prefix enforcement has a TOCTOU window: wrapper validates against a stale prefix before delegated timeout refresh can lock additional wheels. | Let puzzle deadline elapse while persisted prefix is still stale; submit code incompatible with the prefix that refresh should lock. Wrapper validates old prefix, delegated body refreshes prefix, then records attempt without revalidation. Static control-flow proof complete; live timing reproduction pending. | database/011_sprint3b_transition_and_act1_delivery_integrity.sql; database/007_sprint3b_act1_5_placeholder_flow.sql | s3b_submit_library_code(...) migration011 line 92; delegated pre011 body migration007 lines 212–230; s3b_refresh_puzzle(...) migration011 lines 98–100 | 3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe | Locked Game Track state can advance between validation and write, allowing an attempt inconsistent with newly locked wheels and producing internally inconsistent puzzle evidence. | Refresh/lock authoritative puzzle state before prefix validation, then validate and record attempt under the same locked transaction. | Method 1/B3 + later Method 8 verification | CD | — | NOT YET RETESTED |

# 2. Detailed Findings

## IDA-001 — Non-atomic DiscussionRoom → Sprint 3B progression

Severity: HIGH  
Status: CONFIRMED by static control-flow proof; live failure-injection reproduction pending.

### Problem

Resolving the final group vote and applying the result to the Sprint 3B Game Track are separate RPC transactions. The second transaction is initiated only by the browser that receives `result.status === "resolved"`.

### Risk

A successful final vote may be permanently committed while the Game Track remains in the previous discussion phase if the response or browser execution is lost before the follow-up apply RPC.

### Closure condition

Inject failure after `s2_submit_vote` commits but before any `s3b_apply_*` request. On reconnect, the server must deterministically reach the correct post-resolution Game Track state exactly once without fabricating player behavior.

---

## IDA-002 — Single-open-Discussion invariant can be bypassed

Severity: MEDIUM  
Status: CONFIRMED by static control-flow proof; live reproduction pending.

### Problem

`s2_open_discussion` checks for any existing open discussion, but Sprint 3B ACT 2 and ACT 5 creation paths directly insert into `discussion_sessions` without enforcing the same global invariant.

### Risk

Two open discussion sessions may coexist; reads use the latest round while the older one becomes a hidden/zombie open session.

### Closure condition

Attempt generic-open-discussion + Sprint3B discussion creation. The server must never persist two simultaneously open sessions for the same run.

---

## IDA-003 — Formal player UI can fail open to legacy Sprint 1 controls

Severity: MEDIUM  
Status: CONFIRMED by client control-flow proof; live UI reproduction pending.

### Problem

The player refresh renders Sprint 1 first, then fetches Sprint 3B. If the Sprint 3B fetch fails, the error path hides only the Sprint 3B panel and leaves the just-rendered legacy interaction available.

### Risk

Students can see/call non-authoritative Sprint 1 interactions during a formal run, creating misleading legacy state/events and user confusion.

### Closure condition

Force `s3b_get_player_state` failure while Sprint 1 state remains healthy during a formal run. No legacy interactive controls may become actionable; the UI must fail closed to an explicit recover/reconnect state.

# 3. Closed / Retested Findings

None yet.


## IDA-004 — Library Box locked-prefix TOCTOU

Severity: MEDIUM  
Status: CONFIRMED by static control-flow proof; live timing reproduction pending.

### Problem

The public Library Box submission wrapper validates `p_code` against a snapshot of `puzzle_locked_prefix` before the delegated implementation invokes timeout refresh.

If the timeout becomes due (or is already due but unrefreshed), `s3b_refresh_puzzle` can advance the authoritative prefix after that validation. The delegated submission body does not validate the same code again.

### Evidence sequence

1. `puzzle_locked_prefix` is still empty or shorter than the timeout-derived authoritative prefix.
2. Deadline is elapsed.
3. Player request enters final `s3b_submit_library_code` wrapper.
4. Wrapper reads stale prefix and accepts the submitted code.
5. Delegated pre011 implementation calls final `s3b_refresh_puzzle`.
6. Refresh locks the row and advances the prefix.
7. Submission continues and records the attempt without checking the new prefix.

### Existing test gap

The current B8/B8a live test explicitly expires/refreshes the puzzle first, reads prefix `4`, then submits `51111` and verifies rejection. It does not exercise a request in which refresh occurs between prefix check and attempt recording.

### Risk

The server can persist an attempt that changes a wheel which became server-locked earlier in the same request. This is a Game Track integrity and evidence-consistency defect, though it does not by itself let an incorrect code resolve the canonical puzzle.

### Recommended fix

Acquire/refresh the authoritative puzzle row first, then perform locked-prefix validation and attempt insertion under the same serialization boundary. Avoid validating against an unlocked pre-refresh snapshot.

### Closure condition

Create a test where the deadline is elapsed but the stored prefix has not yet been refreshed; submit a code incompatible with the newly due prefix. The request must reject without inserting an attempt or mutating player evidence.
