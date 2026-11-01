# CA to CD — Option B controlled release approved

Teacher confirmed proceeding with the revised non-destructive Clean Room Option B deployment without a verified database backup because existing game data are disposable test data. Teacher accepts possible loss of those rows and temporary service disruption. This approval does not extend to unrelated changes.

NEXT_OWNER: CD

Deploy only the tested revised migration074 and matching Teacher/Player frontend needed for Option B / Teacher Console V5, using validated head f08c04a8b7f0d4e4af3d04a3d0bfd03e22f174d2 or auditable equivalent. Do not deploy the superseded destructive reset function. Before mutation verify no class/game in progress, check recent player activity twice five minutes apart, validate deploy source and branch and preserved recovery source. Abort on activity, mismatch or failed preflight. Use transactional migration execution. Then run bounded live smoke tests: old Player token rejected, three fresh joins, Run B starts under same room code, no Run A Pocket/chat/votes leak; verify Teacher and Player frontend. Avoid deleting historical gameplay rows. Record evidence, exact files and commit, deployment result and rollback/repair route. If blocked, stop and report, do not invent success. No installation burden on Teacher. Return ownership to CA after evidence.
