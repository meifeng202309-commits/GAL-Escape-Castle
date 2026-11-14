# Teacher trial P1 release-readiness packet

UTC checkpoint: 2026-11-14T04:09:25Z

## Frozen candidate

- Product source commit: `f82512acd512cd76534d17a4ddace205339a3a48`.
- Acceptance-test commit: `1b225234ea0003fb4b420da93b4c03cb65934f66`.
- Current branch retains identical release blobs; no later diff exists for the four deployment files.
- Exact blobs: migration075 `5cc730d6a0b63a8d3903feb7b84012463c3f0be1`; Player `198b3af8ee6b8dd8b3ce4bf4b69adb5760f9809f`; Teacher JS `0ea920e4f09ddacd51cb5e273b31ef8b15b28c6f`; Teacher HTML `6429d263b9ce698dbdfcbc95732d08b0e6ec6521`.

## Dependency and compatibility check

Migration 075 is additive and follows deployed 001–074. It replaces only `public.s10_prepare_room_for_next_run(text,text,uuid)`, whose tables, columns, teacher assertion, event table and `gen_random_uuid()` dependency already exist by 074. It expands the accepted selected run from active-only to active-or-completed, rejects a completed selection when another active run exists, preserves completed history, interrupts an active selected run, rotates the room session generation and clears Player sessions. Grants remain limited to `anon, authenticated` after revoking `public`.

Relevant risk boundary: migration 075 cannot be treated as a disposable frontend toggle. It changes the database function definition. The safe rollback is a separately reviewed restoration of the 074 function definition, not a blind migration-file deletion. Frontend rollback can independently restore the prior Pages blobs, but doing so after 075 leaves the expanded server capability present and unused.

## Receipt traceability

GitHub Actions run `43426309415` was re-read through the GitHub connector. Job `two-run-isolation` is completed/success. Steps 5, 6 and 7 are success: migrations 001–073; revised 074 plus the active/interrupted matrix; then 075 plus the completed-room two-run matrix. The workflow at the test commit names the exact migration and fixture paths. The fixture blob is `028346c734370f257dccf555fcb5f58c0de70eee`.

Focused browser evidence is traceable to the same accepted baseline: Player raw-Chrome gate exercises the actual `renderLifecycleNotice()` stale-Pocket clearing and five repeated `routeFormalPresentation()` renders; Teacher raw-CDP evidence asserts completed-run Prepare visibility, operator route, released sessions, per-player submission state and phase visibility. Player fixture blob is `f460b2ea1b5b21cf9d4e3812f58653a22e659987`; Teacher fixture blob is `faf40ef5be1040f0659b2460622b04de66c5ee55`.

Fresh local rerun at 2026-11-14T04:11Z: JS syntax, both static gates, Player raw-Chrome gate and Teacher raw-CDP gate PASS. The browser gates required the established outside-sandbox Chrome launch; the initial restricted launch failed before test execution and was not counted as product evidence.

## Exact deployment payload and order

1. Database: `database/075_teacher_trial_p1_room_reuse.sql`.
2. Pages source, as one coherent frontend release: `src/game/app.js`, `src/teacher/teacher-console.js`, `teacher.html`.

Tests, evidence JSON/PNG and workflow files are verification inputs, not deployment payloads. Apply 075 first so the newly exposed completed-run Prepare route cannot call the old active-only function. Publish all three frontend files from the frozen blobs together.

## Expected visible changes

- A completed room exposes a clear Prepare-next-run route; three Players can rejoin the same Room Code without leaking Run A state into Run B.
- Pre-formal Player Pocket is empty rather than retaining prior DOM content.
- Repeated polling retains one current Runtime status block rather than accumulating duplicates.
- Teacher shows Gitte, Anna and Linda with Submitted/Waiting plus raw phase, step and discussion status.
- Player-facing role labels use Gitte, Anna and Linda while backend role slots remain GAL-A/B/C.

## Post-deploy smoke checklist

1. Reconnect Teacher to a completed room and confirm Prepare is enabled and the preserved-history warning is visible.
2. Prepare once; confirm old Player tokens fail, then rejoin Gitte/Anna/Linda with the same Room Code and original join codes.
3. Start Run B; verify exactly one active run and a distinct run ID. Confirm Run A remains completed and exportable.
4. Before formal start, confirm all three Player Pockets are empty. After start, refresh five times and confirm Runtime status does not duplicate.
5. On Teacher, confirm names, Submitted/Waiting and raw phase/step/discussion status update correctly.
6. Confirm Run B has no Run A Pocket, discussion or vote rows. Confirm no unexpected console/RPC error.

## Approval boundary

This packet is release preparation only. It does not authorize SQL execution, Pages publication, production room mutation or rollback. CA must approve the exact payload and release window.
