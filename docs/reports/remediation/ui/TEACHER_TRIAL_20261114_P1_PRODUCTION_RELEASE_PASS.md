# Teacher Trial P1 production release — PASS

Date: 2026-11-14
Owner: CD
Disposition: PASS; ownership returned to CA

## Released baseline

- Migration `075_teacher_trial_p1_room_reuse` remains live at production migration version `20261114060753`; it was not rerun during the bounded retry.
- Pages deploy head: `6e08aeacef397ea2b6c5020f8c594c5181a2d854`.
- GitHub Pages run: `43581749807`, conclusion `success`, exact head match.
- Prior Pages recovery ref/head remains `a2e54cabcaf43f588d83069ecb736fe1138753d6`.
- The deploy tree changed only the three frozen authorized files.

## LF-normalized public byte gate

| Public file | Frozen input bytes / CRLF count | Expected LF bytes | Expected/public SHA-256 | Result |
|---|---:|---:|---|---|
| `src/game/app.js` | 85697 / 1060 | 84637 | `7bfeed92c448db31d6ac0276366856ba3dc6f439f7fa6bc5a618b750148b7634` | HTTP 200, exact PASS |
| `src/teacher/teacher-console.js` | 39413 / 483 | 38930 | `ee1f93813c19693b0529111ff3898fabc2c615fbb94a949d6927dc47bd8dffac` | HTTP 200, exact PASS |
| `teacher.html` | 10402 / 108 | 10294 | `23bcc790fe5b37d3badfc69bbf849c0d31e3dbd2646eac55a9f7fe86eaee3997` | HTTP 200, exact PASS |

The expected artifacts were computed solely by replacing every frozen `CRLF` pair with `LF`; no other byte transformation was accepted.

## Bounded production smoke

Fresh preflight at `2026-11-14 09:40:14 UTC` found zero rooms, players, or events active in the preceding twenty minutes.

Disposable room `P1655698` produced completed Run A `52305507-4545-45dc-8f30-205ba306c3c4`. The canonical public Teacher UI successfully performed Watch/Reconnect and displayed the completed-run reuse route, then Prepare preserved Run A and rotated the room session. All three old Player tokens returned HTTP 400 after Prepare. The same three join codes rejoined, and formal Run B `f4a185cb-9dda-47bc-bede-75b46f1356f6` was distinct from Run A.

Run B checks passed:

- all five repeated Runtime reads had one stable identity (no refresh duplication);
- Pocket count remained zero on all five pre-formal reads;
- Run A did not leak Pocket, discussion, or vote state into Run B;
- canonical Teacher UI showed ACT 1 / `private_first_action`, Gitte `Submitted · LOCKED`, Anna and Linda `Waiting`;
- canonical Teacher browser console contained zero warnings or errors.

## Cleanup

Cleanup used the exact disposable room code plus its generated Teacher-token hash. Post-cleanup counts were `rooms=0`, `runs=0`, and `events=0` for `P1655698`. No historical room or gameplay record was targeted.

NEXT_OWNER: CA
