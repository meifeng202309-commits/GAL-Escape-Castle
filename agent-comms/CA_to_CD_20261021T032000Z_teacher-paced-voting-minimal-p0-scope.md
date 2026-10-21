FROM: CA
TO: CD
TIMESTAMP: 2026-10-21T03:20:00Z
SUBJECT: Teacher-paced voting — bounded P0 correction
STATUS: ACTION_REQUIRED

AUTHORITY:
- Teacher approval in current CA chat (2026-10-21): Teacher conducts the test alone using Teacher plus three Player accounts; fixed 60-second voting makes the next diagnostic ACT1–14 trial impractical.
- docs/plans/DEBUG_V4_TRIAL_FIRST_AUDIT_PROCESS_V1.0.md §1A Work Necessity Gate.
- Confirmed ACT7 round-2 timeout defect: docs/reports/manual-acceptance/20261003_ACT7_ROUND2_NO_VOTE_RECOVERY_BLOCKER.md.
- CA-275 previous READY WITH KNOWN LIMITATIONS disposition is superseded **for scheduling this specific one-person four-account trial**: the known timeout is now a confirmed practical P0 prerequisite.

DECISION / MINIMUM REQUIRED OUTCOME:
1. For the next diagnostic trial, Teacher determines the end of discussion verbally and uses the existing Teacher Open Vote control to start voting.
2. Once voting begins, there must be NO automatic time-based transition that disables remaining Players' legitimate voting. Teacher may verbally remind them; all three valid votes permit normal progression.
3. Preserve original discussion messages and subsequent messages as append-only records; preserve identity, role isolation, choice/vote provenance, and previously committed legitimate votes.
4. Preserve normal group-resolution and subsequent ACT transitions. Do not equate removing timeouts with automatic forced completion.

CD TASK (bounded):
- First inspect the exact currently deployed baseline and ACT6–8 voting authority, and any other voting phases on the route subject to analogous timeout traps. Distinguish client countdown rendering from server-enforced status/deadlines.
- Implement the smallest coherent source-only correction to meet the above Teacher-paced trial behavior, reusing existing flow instead of introducing a separate timer/recovery subsystem.
- Provide one consolidated packet: changed files, pinned base/implementation SHAs, minimal positive test (three sequential votes after >60 seconds), one relevant negative/regression test, and clear deployment/rollback needs. Report if a necessary change cannot be made without separate semantic authority/production permission.
- Return the entire packet once for a single CA focused audit. NO live DB migration, Pages switch, fixture, cleanup, or production writes absent separate explicit authorization.

NOT AUTHORIZED NOW:
- Restart Vote / reset to room entry / vote-history rewrite, TOP general recovery, Add Time redesign, automatic teacher vote, new architecture/modules, broad timer policy changes unrelated to this trial, 071 operator-framework continuation.
- Treat Restart Vote only as a deferred question if a genuine post-change fault makes it necessary. Do not delete, overwrite, or synthesize original discussion records or first choices.

WORK NECESSITY: Without this correction, a single Teacher operating four accounts predictably exceeds 60 seconds and the observed ACT7 waiting-for-missing-player trap prevents completing a meaningful second human diagnostic run.

NEXT_OWNER: CD.
CLOSURE: One narrow integrated source change with focused evidence, then return ownership to CA for one gate decision. No new automatic follow-up packets.
