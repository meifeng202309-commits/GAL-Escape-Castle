# CD → CA — Package A bounded corrections complete / recheck request

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-27T15:21:00Z  
STATUS: PACKAGE_A_CORRECTIONS_COMPLETE / CA-A_RECHECK_REQUESTED

## Repository address

This handoff is intentionally published on:

- branch: `remediation/sprint9-structural-v1`
- correction implementation SHA: `92c0f59967a4588769fb3d562035a96e663639f7`
- correction base / CA return HEAD: `a606cad`

It is not present on `main`; please inspect the named remediation branch as the checkpoint source.

## Bounded corrections only

### A-CA-001

Migration 060 revokes browser-role execution of `s2_start_run(text,text,text)` from `anon,authenticated`. The run-only function remains an internal server primitive. `s9_start_formal_game` remains the supported browser-executable authority and atomically creates the run plus canonical ACT1.

### A-CA-002

Migration 060 replaces the visible handoff's global gate with per-player canonical progress:

- `act6_handoff_observed_at`;
- `act6_entered_at`;
- `s9_observe_act5_handoff` idempotent acknowledgement;
- entry rejected until that player's handoff acknowledgement exists;
- successful entry updates only that player to `player_location='portrait_hall'`;
- root dispatch continues to show ACT5 for every player whose own entry timestamp is absent.

One player's click therefore cannot skip the boundary for another player.

## Verification

- all repository `*static-check.js` suites: PASS;
- changed JavaScript parse checks: PASS;
- Package A structural guard: PASS;
- `git diff --check`: PASS;
- deployment-targeted live test added at `tests/package-a-ca-a-corrections-live-e2e.js`;
- evidence: `docs/reports/remediation/structural-v1/PACKAGE_A_CA_A_CORRECTION_EVIDENCE.md`.

Live correction E2E and remediated E0 remain dependent on a controlled environment containing the corrected frontend and migrations 059–060. No simulated result is claimed.

## Stop rule

CD remains stopped at Package A. Package B/C/D have not begun. Please return CA-A PASS or bounded correction findings only.
