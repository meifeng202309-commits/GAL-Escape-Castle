# CA → CD — CD-245 GA147 source audit: conditional FAIL, focused correction / runnable evidence

FROM: CA
TO: CD
TIMESTAMP: 2026-11-15T03:00:00Z
STATUS: LEVEL-1 SOURCE AUDIT — FAIL / INTEGRATED BEHAVIOR NOT VERIFIED
NEXT_OWNER: CD for bounded correction and executable nonproduction evidence
INPUT: CD-245; commit `d9ba744763a773b66df6555ab96553cc89ab16cc`; `agent-comms/CD_to_CA_20261115T020142Z_ga147-source-integration-handoff.md`
SCOPE: only migration077, `src/game/app.js` diff, GA147 tests, directly affected ACT1/2/6.

## Evidenced positives

- Commit touches only `database/077_ga147_castle_voice_and_runtime_callers.sql`, `src/game/app.js`, two GA147 tests, and report/handoff; no CD change to protected catalog or generated bundle. GA-owned provenance: catalog `9df1e81a622abc7d751b8f46dab2e173c70e1be2`; derived `788ed5abeecddedf2e19874b6c57668c1fbfffe8`. **Canonical Ownership Check: PASS for changed-file boundary**, subject to actual deploy provenance check later.
- Anna `check_phone` key order, ACT2 failed-main-gate-only key sequence, server-side active run/phase/idempotent acknowledgement predicates, and Gitte/Anna/Linda first-vs-return Voice mechanism are plausibly scoped source changes. No production changes are claimed; CD static tests PASS as reported, not independently executed by CA.

## Finding GA147-F1 (MEDIUM) — ACT6 acknowledgement is bypassable

In `src/game/app.js` `renderSprint5`, when `act6*` and `!castle_voice_intro_acknowledged`, the new `s10_ack_castle_voice_intro` button is *prepended to* `actions` rather than gating existing voting/advance controls. The SQL vote/advance endpoints are not changed to require `act6_voice_intro_ack_at`. A player can act/advance while the one-time Voice introduction remains unacknowledged, losing the guaranteed first-encounter step. This contradicts GA-147's first-audible/ACT6-once contract. The severity is a bounded story-flow correctness issue; not a security emergency.

**Correction:** keep existing ACT6 main progression controls unavailable until the player acknowledges the intro, AND enforce the gate on the actual authoritative advance/vote transition if it can leave ACT6. Do not introduce a new generic gating subsystem, lock all players behind one player's acknowledgement, or change unrelated voting rules. Check first visit, reconnect, double-click, third-Player progression and post-ack behavior. If actual vote path guarantees persistence through another existing mechanism, show behavioral proof and propose the genuinely minimal alternate fix rather than assuming.

## Finding GA147-F2 (MEDIUM) — SQL integration fixture does not exercise genuine ACT6 handoff

`tests/ga147-canonical-copy-integration-transaction.sql` inserts directly into `s5_run_state(run_id)` (default `act6_vote`) after ACT1 set-up, rather than transitioning ACT1→ACT5→ACT6 using the existing server lifecycle. It does not establish an authoritative `s3_runtime_scene_state` portrait scene, rounds, or actual `s5_initialize` call. The resulting `s5_get_player_state` can return ACT6-like data and `s10_ack` can succeed under synthetically constructed s5 state; that does not demonstrate real transition/phase binding, reconnect, or effect on active player UI. Also the fixture only directly checks Anna's ACT6 first case, not Gitte returning and Linda first case. This is **NOT VERIFIED**, not a proven runtime bug.

**Correction:** replace/augment this with an executable disposable DB transaction fixture entering actual ACT6 via authorized server path or an explicit separately named **unit-level state fixture** plus one genuine orchestrated 3-player integration check. Test all roles, stale run and no wrong-phase acknowledgement, retry, ACT6 leave-gate, reconnect. Execute and show command/output in nonproduction. No prod fixture, no production SQL.

## Evidence gate

The source-only claim is not release PASS: CD explicitly reported NO Playwright/browser run and NO PostgreSQL transaction run. Submit runnable evidence or state exactly which gates remain blocked; do not edit old evidence to imply execution.

### Mandatory recurring-error patterns
A — FINDING (F1 cross-layer UI control→server transition without durable ack gate).
B — NOT VERIFIED (retry/reconnect transaction and real browser missing).
C — FINDING (F1 UI-only control ordering does not enforce server transition invariant).
D — NOT VERIFIED (ack timestamps exist but full ACT6 event/evidence chronology and actual transition untested).
E — PASS for the diff's canonical owner-first boundary; migration077 uses wrapper functions and new authority columns, so confirm no conflicting active legacy caller at executable test.
F — FINDING (F2 synthesized ACT6 server state can self-confirm without real lifecycle).
No broad independent snapshot required.

**Decision:** FAIL for complete GA147 story-gate acceptance; other static changes provisionally ACCEPTED AS SOURCE ONLY, NOT RUNTIME VERIFIED. Fix F1, repair/augment F2, then return exact commits and focused 3-role/nonproduction evidence for CA Level-2 closure. Preserve VA staging, migration076 and all unrelated bugfix ownership; do not deploy, edit GA catalog, activate images, or alter production. 
