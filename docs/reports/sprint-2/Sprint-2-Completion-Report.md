# Sprint 2 Completion Report — Reusable DiscussionRoom

Status: **READY_FOR_CA RE-AUDIT**

Implementation commit: `24ebea418c93d76038c477783970df4c53dd3d90`
Audit-fix commit: `a74a5b25d5cf9081cdd0f7320c0c724b47ae08b6`

Supabase project: `qdcbdcjobzytzhnhfwyn`
Scope: Sprint 2 only

## 0. CA Audit Corrections

**VERIFIED AFTER DEPLOYMENT**

- Added `database/003_sprint2_discussionroom_audit_fix.sql`; deployed history in `001` and `002` remains unchanged.
- `fallback_resolution` is now a server-authored resolution identifier and may be a non-option value such as `portrait_fixed_fallback`; player `choice_id` validation remains canonical and unchanged.
- Each independent discussion starts with local `round_no = 1`; re-votes increment local `round_no`, while run-wide `vote_round` remains monotonic and preserves decision identity.
- Player and teacher `messages` now contain only the current `discussion_session_id` transcript.
- Teacher `message_history` separately preserves the run-wide transcript for audit/history use.
- Expanded live coverage includes ACT2/ACT5 option fallbacks, ACT6 non-option fallback, exactly one re-vote, a second independent discussion in the same run, transcript isolation/history preservation, invalid choice rejection, and anonymous direct-write rejection.
- Post-deployment evidence: Sprint 1 **40/40 PASS**; Sprint 2 **23/23 PASS**.
- Physical multi-device classroom verification remains **NOT VERIFIED**.

Localization boundary acknowledged: `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv` is canonical for later ACT 1–14 text binding. Localization was intentionally not mixed into this Sprint 2 correction.

### Accepted follow-up semantic cleanup

- Added and deployed `database/004_sprint2_fallback_resolution_semantics.sql` after Sprint 2 acceptance.
- System-authored fallbacks now persist and return `resolution_id` with `resolution_source = system_fallback`.
- Fallback `choice_id` was removed entirely; genuine majority outcomes retain player-choice `choice_id` and `choice_label` semantics.
- Post-deployment live regression remains Sprint 1 **40/40 PASS** and Sprint 2 **23/23 PASS**.

## 1. What I Changed

**VERIFIED**

- Added an additive formal-runtime migration without modifying Sprint 1 database semantics.
- Added server-generated `run_id`, `run_started_at`, immutable `run_mode`, and persisted `behavior_dataset_eligible`.
- Added reusable discussion sessions with `discussion_session_id`, `round_no`, `vote_round`, server deadline, transcript, and event history.
- Added token-protected message send/read with server timestamps and deterministic transcript order.
- Added server-owned vote options and canonical label storage.
- Added one-vote-per-player-per-round protection.
- Added privacy-safe pre-reveal state for players and teacher.
- Added 3:0 and 2:1 majority resolution.
- Added 1:1:1 `NO CONSENSUS. NO ACTION.` resolution, new discussion identity, new vote round, and retained history.
- Added missing-player deadline state and teacher-authenticated time extension.
- Added reconnect restoration, `silent_texting_mode`, and Teacher Console observation.
- Added generic DiscussionRoom controls to the existing GitHub Pages student and teacher clients.
- Restored Sprint 1 static test compatibility after canonical documentation was moved under `docs/reports/`.
- Removed the stale non-canonical Asset Registry `audit_status` field after CA PASS.

## 2. Files Changed

**VERIFIED**

- `database/002_runtime_runs_discussion.sql`
- `index.html`
- `teacher.html`
- `src/game/app.js`
- `src/teacher/teacher-console.js`
- `src/styles/app.css`
- `tests/sprint1-static-check.js`
- `tests/sprint2-static-check.js`
- `tests/sprint2-live-e2e.js`
- `docs/reports/sprint-2/sprint-2-architecture.md`
- `docs/reports/sprint-2/sprint-2-testing.md`
- `docs/reports/sprint-2/Sprint-2-Completion-Report.md`
- `README.md`
- `CHANGELOG.md`
- `assets/asset-registry.json` — removed only the stale non-canonical audit-status field; no asset identity/version entry changed.

## 3. Database Changes

**VERIFIED — DEPLOYED**

Migration:

```text
database/002_runtime_runs_discussion.sql
```

Supabase SQL Editor result:

```text
Success. No rows returned
```

New RLS-protected tables:

- `game_runs`
- `discussion_sessions`
- `dialogue_messages`
- `runtime_player_decisions`
- `runtime_events`

New public browser RPC boundary:

- `s2_start_run`
- `s2_open_discussion`
- `s2_open_vote`
- `s2_add_time`
- `s2_send_message`
- `s2_submit_vote`
- `s2_get_player_state`
- `s2_get_teacher_state`

Internal helper functions are not executable by `anon` or `authenticated`.

`database/001_sprint1_core.sql` was not changed.

## 4. Tests Run

### VERIFIED — Static

- `node --check src/game/app.js` — PASS
- `node --check src/teacher/teacher-console.js` — PASS
- `node --check tests/sprint2-live-e2e.js` — PASS
- `node tests/sprint1-static-check.js` — PASS
- `node tests/sprint2-static-check.js` — PASS
- JSON parse and 28-entry Asset Registry identity check — PASS
- `git diff --check` — PASS

### VERIFIED — Sprint 1 Live Regression

`node tests/sprint1-live-e2e.js` — **40/40 PASS** against the current GitHub Pages deployment and Supabase project after Sprint 2 migration deployment.

This includes room creation hardening, three-player identity, private-choice privacy, reveal, reconnect, recovery, canonical choice validation, completed phase, RLS, and concurrent double-join protection.

### VERIFIED — Sprint 2 Live E2E

`node tests/sprint2-live-e2e.js` — **17/17 PASS** against the deployed Supabase project.

Verified cases:

- server-generated NORMAL run metadata;
- active run cannot be replaced to change run mode;
- shared discussion identity;
- initial-choice reveal;
- persisted silent-texting mode;
- three-player chat and server timestamps;
- transcript order;
- reconnect restore;
- Teacher observation of transcript and all three slots;
- pre-vote privacy for teacher and other players;
- duplicate vote rejection;
- 3:0 resolution;
- 2:1 resolution;
- 1:1:1 creates a new discussion session and vote round;
- repeated re-vote resolves without overwriting round 1;
- AUDIT run is dataset-ineligible;
- slow player remains pending;
- deadline enters `WAITING_FOR_MISSING_PLAYER` without synthesized input;
- Teacher Add 30 seconds resumes voting;
- all five Sprint 2 tables return zero rows to direct anonymous reads.

### VERIFIED — Deployed Frontend Smoke

- GitHub Pages deployment for implementation commit completed successfully.
- Student page HTTP 200 and join controls visible.
- Teacher page HTTP 200 and all Sprint 2 controls visible.
- Student and teacher page browser console error/warning check: none found.

### NOT VERIFIED

- A full joined-state UI walkthrough using three separate physical student devices and one teacher device.
- Classroom network behavior under real Wi-Fi/mobile latency and packet loss.
- Long-duration session behavior beyond the automated acceptance windows.

## 5. Devil Check Findings

**VERIFIED**

- Private votes are omitted from other-player and teacher state before resolution; only submission status is exposed.
- Browser-supplied vote labels are not trusted. The server resolves labels from stored `vote_options`.
- Vote submission locks the selected discussion row, serializing resolution and re-vote creation.
- The formal vote uniqueness key contains run, scene, phase, step, round, player, and decision type.
- A 1:1:1 result records `action_applied = false`; no random or partial-majority action occurs.
- Vote deadline with fewer than three submissions does not synthesize behavior.
- Run identity, mode, start time, and dataset eligibility are protected by a database trigger.
- All new tables use RLS and no broad public table policy.
- All `SECURITY DEFINER` functions set `search_path = public`.
- No service-role key or reusable teacher secret was added to browser source.
- No destructive formal-run reset or DELETE workflow was introduced.
- Sprint 1 live regression remained fully green after migration deployment.

**KNOWN LIMITATION**

- Browser clients poll at approximately 1.2 seconds; Supabase Realtime is not used in Sprint 2.
- Test runs remain in the database by design because formal history is non-destructive.
- The teacher token remains a room-scoped classroom prototype credential rather than full account authentication.

## 6. Known Issues / Limitations

**KNOWN LIMITATION**

- Sprint 2 uses a generic discussion scene and is not connected to the ACT 1–14 state machine.
- The UI does not yet provide a formal run-completion/restart workflow. A future restart must preserve the old run and create a new `run_id`.
- Final JSON/CSV exports are intentionally absent.
- Pocket, memories, knowledge provenance, photos, and group items are not implemented.
- Teacher emergency override is not implemented.
- No Supabase Storage publishing, ACTIVE promotion, or runtime asset resolver is implemented or claimed as verified.

## 7. What I Did NOT Change

**VERIFIED**

- Did not modify `database/001_sprint1_core.sql`.
- Did not redefine any existing `s1_*` RPC behavior.
- Did not move or remove the validated root fallback prototypes.
- Did not implement the full story, Great Hall binding, Pocket, Agent analysis, behavior aggregation, prediction, Asset Manager, audio climax, or final export.
- Did not authorize or modify VA production work.
- Did not modify canonical game, visual, or Codex specification documents.

## 8. Recommended Next Step

Submit this implementation and evidence to CA for independent Sprint 2 audit.

CA should distinguish:

- code/spec audit;
- deployed migration verification;
- automated live E2E verification;
- the remaining physical multi-device classroom test boundary.

Do not start Sprint 3 until CA reports its result and the user approves the next sprint.
