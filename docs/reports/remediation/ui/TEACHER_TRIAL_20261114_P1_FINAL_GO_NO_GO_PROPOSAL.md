# P1 final controlled-release proposal

UTC: 2026-11-14T06:00:57Z

## Recommendation

**GO for a separately authorized, controlled release window. NO-GO for any deployment under the current letter alone.**

The candidate remains byte-identical to the accepted frozen source baseline `f82512acd512cd76534d17a4ddace205339a3a48`. The accepted test baseline is `1b225234ea0003fb4b420da93b4c03cb65934f66`. No blocking mismatch was found since CD-235.

Exact payload and blobs:

1. `database/075_teacher_trial_p1_room_reuse.sql` — `5cc730d6a0b63a8d3903feb7b84012463c3f0be1`
2. `src/game/app.js` — `198b3af8ee6b8dd8b3ce4bf4b69adb5760f9809f`
3. `src/teacher/teacher-console.js` — `0ea920e4f09ddacd51cb5e273b31ef8b15b28c6f`
4. `teacher.html` — `6429d263b9ce698dbdfcbc95732d08b0e6ec6521`

## Controlled order

1. Record the current production database function definition and current Pages deployment/recovery ref.
2. Apply migration 075 after confirmed deployed 074. Verify the transaction commits and `s10_prepare_room_for_next_run(text,text,uuid)` has the candidate definition/grants.
3. Publish the three frontend files together from the exact blobs above. Migration precedes Pages so the completed-run Prepare UI never calls the old active-only function.
4. Compare public bytes for all published frontend files against the candidate blobs before gameplay smoke testing.
5. Run the public smoke checklist below. Stop and recover on any failed gate.

## Recovery boundaries

- Frontend failure before/after publication: restore the recorded Pages recovery ref and verify all public bytes. This can be done independently of database recovery.
- Migration 075 is an additive function replacement, not a disposable file toggle. Database recovery requires a separately reviewed restoration of the 074 function definition and grants. Do not delete history or reverse session generations created after a successful Prepare.
- If 075 succeeds but Pages fails, restoring Pages leaves the expanded server capability present but unused; record that split state explicitly.
- No recovery action may mutate or delete completed Run A history.

## Required post-release gates

1. Public-byte equality: `src/game/app.js`, `src/teacher/teacher-console.js` and `teacher.html` match the approved candidate.
2. Completed Room Code path: Watch/Reconnect, Prepare, reject all old Player tokens, rejoin Gitte/Anna/Linda with original join codes, then start a distinct Run B.
3. Database isolation: exactly one active run; Run A remains completed/exportable; Run B contains no Run A Pocket, discussion or vote rows.
4. Player UI: Pocket empty before formal start; five refreshes retain exactly one current routed Runtime status.
5. Teacher UI: completed-run Prepare is enabled/discoverable; real Gitte/Anna/Linda Submitted/Waiting and raw phase/step/discussion state are visible.
6. Browser health: no unexpected console or RPC error on the bounded path; responsive Teacher layout remains usable.

## Evidence

- GitHub Actions `43426309415`: job `two-run-isolation` SUCCESS, including 001–073, revised 074 matrix, then 075 completed-room matrix.
- Fresh 2026-11-14T06:00Z checks: Player/Teacher JS syntax PASS; P1 and Teacher static gates PASS; Player raw-Chrome Pocket/dedupe gate PASS; Teacher raw-CDP completed-run/visibility/responsive gate PASS.
- Full dependency, rollback and smoke detail remains in `docs/reports/remediation/ui/TEACHER_TRIAL_20261114_P1_RELEASE_READINESS.md`.

## Remaining non-blockers

Slide 10 sender acknowledgement awaits CA persistence scope and GA/Teacher wording. Slides 7/19 await presentation/information-hierarchy decisions. These are independent and do not alter the four-file P1 payload. Runtime manuscript edits are excluded.

## Authorization boundary

CA/Teacher must separately authorize production SQL and Pages publication. This proposal does not execute either action and does not authorize live-room mutation.
