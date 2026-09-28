# Package A deployed live evidence

- Environment: Supabase project `qdcbdcjobzytzhnhfwyn` plus the corrected frontend served from `remediation/sprint9-structural-v1`.
- Deployed additive migrations: `059` through `064`. No migration in `001` through `058` was modified.
- Frozen implementation head before evidence-only changes: `99d2eeafcd0f38c827c7616c92efccea9c35fb0e`.

## Live database result

`node tests/package-a-ca-a-corrections-live-e2e.js` passed after deployment.

The run verified:

- direct browser execution of `s2_start_run` is denied;
- `s9_start_formal_game` atomically creates the run and canonical ACT1 state;
- ACT5 completion prepares ACT6 without opening its discussion or consuming its timer;
- every player must observe the ACT5 consequence and enters `portrait_hall` independently;
- one player's entry does not advance the other two;
- the canonical 90-second ACT6 discussion begins only at the server-serialized three-player entry barrier.

The live run exposed two schema-assumption defects, corrected additively:

- `062_package_a_prepared_event_fk_fix.sql` records the pre-discussion preparation event without a premature discussion-session foreign key.
- `063_package_a_player_entry_column_fix.sql` and `064_package_a_handoff_observation_column_fix.sql` stop writing the nonexistent `s3b_player_progress.updated_at` column.

## Remediated E0 result

`tests/remediation-e0-browser.mjs` passed in `remediated` mode for room `E0CDD54D`.

Canonical evidence: `e0-remediated/20260928013307_E0CDD54D_remediated.json`.

It verifies:

- no legacy gameplay is reachable before formal start;
- the split-start boundary is not reachable;
- three isolated browser contexts retain distinct player sessions;
- all three players receive distinct role-private ACT1 surfaces immediately after atomic start;
- the hidden emergency initializer is not part of the normal path.

The harness now records browser errors, waits for the post-start render boundary, and loads isolated local contexts sequentially so a small evidence server cannot create false connection-refusal failures.

## Regression result

All repository `*static-check.js` suites passed, both runtime entry files passed JavaScript parse checks, and `git diff --check` passed.
