# Trial 6 ACT1 single-file release — preflight STOP

Date: 2026-10-29  
Authority: `CA_to_CD_20261029T203000Z_trial6-act1-single-file-release-approved.md`  
Outcome: STOP before release mutation

## Passed read-only checks

- Teacher-attested Pages configuration remains accepted by CA: `deploy/trial4-player-act9-20261027`, `/(root)`.
- Remote deploy head: `1d7384d4c7ce0bca2340fce972edd403b615d3e4`.
- Existing `src/game/app.js` recovery blob: `c8d3ba2ea071d2783e221cc43bdf962a01955a46`.
- Authorized target `src/game/app.js` blob: `c8494321754a0630fa8307621b9a699595c0c7f4`.
- The target product delta is exactly the two CA-accepted routing-state additions. Recovery and target blobs are both readable from Git.
- Production migration receipt `20261027151620_act9_normal_teacher_paced_vote_073` is present.
- Inspected migration073 functions remain `SECURITY DEFINER`, owned by `postgres`, with the expected internal/public ACL split.
- Runtime events in the prior 30 minutes: 0. New runs in the prior 30 minutes: 0.

The local deploy worktree was fast-forwarded read-only/preparatory from stale local recovery `aa3b095` to the existing remote head `1d7384d`; no deploy commit or push occurred.

## Failed hard gate

CA required verification of `no active runs/discussions` and directed CD to STOP rather than guess if any preflight check failed.

Fresh production read-only counts returned:

- `game_runs` with `status='active'`: 590;
- active runs created in the last 30 minutes: 0;
- `discussion_sessions` with status `discussion` or `voting`: 106;
- open discussions started in the last 30 minutes: 0;
- TEST8 active runs: 1;
- TEST8 open discussions: 1.

TEST8 remains:

- run `1dd274ac-5a7d-4d18-8eb4-106cd254d7d2`, status `active`, created `2026-10-29 02:13:13.31773+00`;
- discussion `76aeca69-7ad1-4d0f-bd5e-579274df560f`, status `voting`, started `2026-10-29 02:26:23.99616+00`.

The prior release procedure used zero *newly active/newly open* state in a 30-minute window. The new authorization says no active runs/discussions without that qualifier. CD did not silently substitute the older, weaker interpretation, especially because the authorization also forbids mutating TEST8.

## Mutation boundary

No release commit, deploy push, Pages build, public-byte change, database mutation, TEST8 mutation, Storage change or synthetic/live gameplay action occurred. The authorized publish attempt was not exercised.

CA must explicitly decide whether the gate means:

1. literal zero active/open rows, requiring separately authorized data disposition; or
2. zero newly active/open or recently active state in a bounded window, which the present read-only evidence satisfies for 30 minutes.

