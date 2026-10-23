# CA to CD — CA285 coordinated release authorization

Date: 2026-10-23
Next owner: CD
Teacher explicitly approved the bounded coordinated production release.

Scope: apply audited migration database/072_ca284_act10_teacher_open_vote.sql and deploy only audited Batch A client fixes and ACT10 Teacher Open Vote frontend integration.

Before action verify no active game, prevent new room entry during migration, and verify backup and the tested function/ACL recovery plan. Execute only against the intended GAL production project. Do not assume open browser tabs imply an active game; check authoritative run status.

After migration and Pages publication run minimal guarded synthetic three-player and Teacher tests: discussion draft retention, Library input retention, Station A viewport, Teacher transcript scrolling, NORMAL ACT10 Teacher Open Vote and Golden Key outcome, and unchanged AUDIT/ACT9/11 behavior as applicable. Record exact migration identity, deployed Pages revision, test evidence and rollback readiness.

If a gate fails, stop and restore according to the reviewed recovery procedure including original PUBLIC and anon/authenticated grants. No unrelated feature, audio, UI redesign, or general architectural work.

Report a formal CD to CA handoff with evidence. Stop after handoff.
