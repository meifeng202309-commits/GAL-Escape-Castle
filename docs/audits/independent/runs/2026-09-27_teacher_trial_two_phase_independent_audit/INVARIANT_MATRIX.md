# INVARIANT PROTECTION MATRIX

Baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

| Invariant | Server protection | Client/test evidence | Result |
|---|---|---|---|
| 1. First Choice LOCK | formal ACT1 role/phase guard + one stored choice; legacy has unique decision | Sprint3B tests cover role identity/lock | PASS formal / legacy semantics are obsolete |
| 2. Missing player input never synthesized | discussion waits; Teacher Override stores null + invalid_teacher_override | override/integrity tests | PASS |
| 3. Room != Run | separate `s1_rooms` / `game_runs`, run_id on formal evidence | Sprint8 sequential-run tests | PASS |
| 4. NORMAL != AUDIT | run_mode established at run creation; identity protection + debug server restriction | live tests | PASS source-level |
| 5. System/Teacher resolution != player behavior | event_source, behavior_scoring=false, teacher_overrides + validity table | integrity/export tests | PASS |
| 6. Real pre-resolution evidence preserved | immutable message/vote/event ledgers; override augments rather than deletes | closure tests | PASS |
| 7. Physical ownership != knowledge | separate item / observation / knowledge tables | Sprint3A/S5 code | PASS |
| 8. SHARE PHOTO != ownership transfer | shared-photo table separate from item owner | scene/ownership guard | PASS |
| 9. One logical transition resolves once | row locks, unique constraints, request receipts, finalization uniqueness | concurrency tests in later Sprints | PASS for canonical formal paths |
| 10. Old-phase mutations rejected | exact scene/phase identity in canonical RPCs; Sprint6 expected phase/step/round | live/static tests | PASS |
| 11. Formal restart preserves old run evidence | formal completion/new run identity; `s1_reset_room` is not formal reset | spec + Sprint8 tests | PASS server model; UI legacy reset remains confusing |
| 12. Private unrevealed behavior not exposed to Teacher in NORMAL | **canonical spec now permits Teacher read-only LOCKED values**; player-to-player isolation remains hard rule | Teacher projection + formal state | N/A as originally worded for Teacher; player isolation evaluated below |
| Player-to-player canonical ACT1 privacy | formal player projection does not expose peers' locked ACT1 choice pre-reveal | Sprint3B live source | PASS formal |
| Root product must not expose obsolete pre-run behavior as canonical gameplay | no server protection; root client intentionally renders legacy Sprint1 | Teacher PPT + source | **FAIL — IDA-001** |
| Player-to-player pre-run/ACT1 privacy in actual root product | legacy Sprint1 returns all choices after legacy reveal | Teacher PPT + SQL + renderer | **FAIL — IDA-002** |
| Formal startup must have one recoverable authoritative completion boundary | two separate Teacher actions / transactions | source deterministic trace | **FAIL — IDA-003** |
| Teacher state must reflect committed active run | static DB contract says yes | Teacher live screenshot contradicts | **NOT VERIFIED root cause — IDA-004** |
| Canonical-flow generic DiscussionRoom must fail closed | migration013 server check for s3 scene state | remediation test explicitly probes direct RPC | PASS |
| Teacher Override allowlist/provenance | migration054–057 final chain | prior Level2 closure evidence + source | PASS source-level |
| Finalization/export only after integrity | run-bound `s8_finalize`, verifier, export_ready | Sprint8 tests | PASS source-level |
| Asset ACTIVE authority separate from candidate review | service-role publication/activation | migration018–026 | PASS source-level |
