# CA → CD: Sprint6 ACT9–13 Level 1 audit — FAIL / six findings

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-24T08:33:00Z  
SUBJECT: Sprint6 ACT9–13 Level 1 disposition  
STATUS: FAIL / SIX_FINDINGS

Frozen baseline:

`605c2fc277bfa9933cc8124b3eacafc6887b2020`

Full report:

`docs/audits/regular/runs/2026-09-24_sprint6_level1/AUDIT_REPORT.md`

## Findings

- **S6-CA-001 HIGH** — canonical Sprint6 DiscussionRoom behavior is missing. ACT9/10/11 bypass required silent-texting discussion/timing, while the player client remains coupled to Sprint5 discussion authority.
- **S6-CA-002 HIGH** — Great Hall no-consensus / soft-failure presentation is incomplete; several migration-034 feedback keys describe the wrong state and the client discards the returned feedback.
- **S6-CA-003 HIGH** — ACT11/12 station work is reduced to allocation + direct ENGAGE. Station A 1897 input, Station B lever task, Station C Silver Key insertion and canonical allocation timing are not implemented as authoritative preconditions.
- **S6-CA-004 HIGH** — ACT12 horror cinematic/audio and ACT13 visual transition are not implemented. Direct-RPC E2E reaches the ACT14 boundary, but the browser path has no equivalent canonical transition.
- **S6-RC-001 HIGH** — state-changing actions are not bound to the screen/step/round observed by the player. Delayed ACT9 actions can retarget later state; `s6_open_act9_console` can also rewrite shared scene state even when its guarded state update changed zero rows.
- **S6-RC-002 MEDIUM** — invalid role-allocation evidence is erased; same-request conflicting private-choice content is not rejected; Great Hall group penalty events attribute the group result to the third network submitter.

Directly adjacent canonical issue: the Golden Key is labeled with `act10.006` (**TAKE**) in item/group-item state rather than a Golden Key item identity.

## Areas that pass

The following submitted work is materially correct and should be preserved:

- player-specific ACT9 private clues;
- `private_system_message` knowledge provenance;
- Great Hall current-step option validation;
- 1:1:1 does not directly mutate door state;
- STAY is non-penalty;
- coherent TAKE/LEAVE branch booleans;
- branch-specific A/B/C vs A/B/WATCHER allowlists;
- GAL-C requirement for role C;
- three-role ENGAGE gate;
- WATCHER exclusion from mechanism-failure selection;
- pressure latency / role context capture;
- system-owned cinematic resolution provenance;
- Sprint6 keeps `game_completed=false` and `export_ready=false`;
- ACT14/export remains outside scope.

## Correction boundary

Correct only the six Sprint6 findings plus directly adjacent regression coverage.

Do not begin Sprint7.

Migrations `033` and `034` are deployed history and must remain immutable. Any DB correction begins at **035+**.

CA is not prescribing the DiscussionRoom schema, request-identity shape, cinematic scheduler, station UI mechanics, evidence ledger structure or exact test recipe.

## Process

This handoff is an authorized execution trigger under current Codex V2.3:

- next owner = CD;
- next action = close the six Sprint6 findings;
- permitted scope = Sprint6 ACT9–13 findings + directly adjacent regressions;
- closure condition = deploy/test corrections and submit a focused Level 1 re-audit request.

Acknowledgement alone is not completion. No additional user approval is required merely to begin the bounded correction work.

## Next governed action

CD performs the bounded Sprint6 corrections, runs relevant static/live/browser regressions, and submits exact correction commit(s), migration(s), deployment evidence and known limitations.

CA will automatically perform focused Level 1 re-audit when that handoff arrives.
