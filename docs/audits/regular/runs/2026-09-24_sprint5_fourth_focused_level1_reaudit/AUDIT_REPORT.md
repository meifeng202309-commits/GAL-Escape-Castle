# Sprint5 ACT 6–8 + visual-dynamic UI — Fourth Focused Level 1 Re-audit

Baseline: `e38db52e04211e746628f884f88bcbfd0bb7be50`  
Scope: final closure of `S5-CA-001` Stopped Watch front/back evidence-content mapping, plus directly adjacent regression risk  
Audit level: Level 1 — Focused re-audit  
Decision: **PASS — SPRINT5 VERIFIED**

## 1. Independent closure result

The submitted correction is minimal and directly addresses the sole remaining blocker.

Current renderer behavior for `linda_stopped_watch` is now driven by the authoritative reconnect-restored `item.current_view`:

- `front` → `act01-l.002` → **TIME — 23:49**;
- `back` → `act01-l.017` → **REMEMBER WHEN YOU WOKE.**

The same authoritative view also determines the next FLIP target.

This closes the prior mismatch where persisted state said `back` while player-visible evidence still showed front-side content.

## 2. Adjacent regression review

No new blocker was found.

The correction:

- does not change ownership semantics;
- does not alter `s3_set_item_view(...)` authority;
- does not change SHARE PHOTO provenance;
- does not modify migrations 027–032;
- does not widen Sprint5 scope;
- preserves the previously verified ACT6/ACT7 evidence panel mounting, ACT6 SHARE PHOTO controls, Torn Note inspection, reconnect current-view persistence, exact-session Teacher path, terminal-vote idempotent replay, localization and visual-anchor behavior.

## 3. Evidence boundary

CD reports:

- `node tests/sprint5-static-check.js` PASS;
- `node tests/sprint5-live-e2e.js` PASS against production Supabase;
- `node --check src/game/app.js` PASS;
- `git diff --check` PASS.

The new static assertion explicitly requires:

- authoritative back/front key selection;
- `localizedHtml(watchEvidenceKey)`.

The live E2E continues to verify front → back persistence and reconnect restoration.

CA independently verified the source mapping at the frozen baseline.

Physical three-device Sprint5 playthrough and final production-pixel alignment of all ACTIVE artwork remain outside this narrow closure proof. No current source-level blocker was identified from those unverified areas.

## 4. Sprint5 closure matrix

| Finding | Final status |
|---|---|
| S5-CA-001 HIGH | **FIXED_VERIFIED** |
| S5-CA-002 HIGH | **FIXED_VERIFIED** |
| S5-CA-003 MEDIUM | **FIXED_VERIFIED** |
| S5-RC-001 MEDIUM | **FIXED_VERIFIED** |
| S5-RC-002 MEDIUM | **FIXED_VERIFIED** |

All Sprint5 audit findings are closed.

## 5. Mandatory recurring-error pattern scan

| Pattern | Result | Final Sprint5 result |
|---|---|---|
| A — local correctness / cross-module handoff | PASS | authoritative item view and rendered evidence now agree. |
| B — happy-path / distributed boundary | PASS | previously verified reconnect and terminal-vote replay semantics remain intact. |
| C — UI/server authority mismatch | PASS | UI content derives from authoritative current view. |
| D — current state vs historical evidence | PASS | reconnect preserves the persisted view and corresponding displayed evidence. |
| E — authority accretion / legacy reachability | PASS | no new authority path introduced. |
| F — self-confirming tests | PASS WITH LIMITATION | final static assertion checks the exact mapping; full physical multi-device coverage remains outside this narrow closure. |

## 6. Gate disposition

**Sprint5 ACT 6–8 + visual-dynamic UI = VERIFIED PASS.**

Verified correction baseline:

`e38db52e04211e746628f884f88bcbfd0bb7be50`

Deployed migrations `027–032` remain immutable.

No Sprint5 DB migration was added by the final correction. Next unused migration remains **033**.

The next canonical roadmap scope is:

**Sprint6 — ACT 9–13**

CD may proceed within current V4.0 / Codex V2.3 scope. No ACT14 finalization/export work and no Sprint7 Teacher Console expansion are authorized by this release.

## 7. Next-Scope Failure Forecast — Sprint6 ACT 9–13

| Risk ID | Next-scope area / interface | Why this area is high-risk | Invariant / failure class to watch |
|---|---|---|---|
| S6-RISK-01 | ACT9 private clues + DiscussionRoom | Three players receive different private system messages that must become knowledge provenance but not shared-photo objects. | Private clue delivery/provenance must remain player-specific; later knowledge sharing must come from real dialogue, not automatic group visibility. |
| S6-RISK-02 | Great Hall step console / repeated consensus | Each step permits 3:0/2:1 execution but 1:1:1 must execute nothing and keep the same step open. | Tie must not mutate door state, create penalty events, or fabricate an executor; re-votes must preserve prior-round evidence while targeting the same unresolved step. |
| S6-RISK-03 | Great Hall step-specific soft failure | Different wrong actions reset different parts of the console and some valid choices such as STAY are intentionally non-failures. | Failure/reset effects and `escape_penalty_event` must match the actual step/action; no generic reset may erase valid history or penalize no-consensus/STAY. |
| S6-RISK-04 | ACT10 Golden Key branch | TAKE/LEAVE changes several downstream facts at once: key possession, alarm, Station C bypass, role set, danger timing and group item state. | One authoritative final vote must commit one internally consistent branch; no mixed TAKE/LEAVE state may survive reconnect or retry. |
| S6-RISK-05 | ACT11 role allocation + physical ownership | Leave branch requires A+B+C with Linda at C because Silver Key physical ownership is not transferable; Take branch requires A+B+WATCHER. | Allocation validity must follow the active branch and real physical ownership; invalid/repeated allocation must reopen allocation without inventing a new behavior choice or silently moving ownership. |
| S6-RISK-06 | ACT12 ENGAGE gate + random mechanism failure | Failure must occur only after every required active role is engaged; WATCHER is never a mechanism-failure owner. | Server must not trigger failure early, select an inactive/non-mechanism role, reveal private role actions prematurely, or create multiple active failures through retry/reconnect. |
| S6-RISK-07 | ACT12 pressure choices + cinematic auto-resolution | Private pressure choices are behavior evidence but explicitly do not determine success/failure. Audio/cinematic then resolves the mechanism automatically. | Choices must remain locked/private evidence with real latency/role context; game success must not be attributed to a “better” choice, and audio may not become the sole carrier of critical state. |
| S6-RISK-08 | ACT13 boundary to future ACT14 | Sprint6 includes escape cinematic but not ACT14 final reveal/session finalization/export. | ACT13 may set escape success and reach the ACT14 boundary, but must not prematurely set `game_completed`, `export_ready`, final integrity state, or implement Sprint8 export/finalization behavior. |

This forecast identifies risk areas and invariants only. Implementation mechanics, schema choices and CA's later adversarial test plan remain CD-owned / CA-independent.
