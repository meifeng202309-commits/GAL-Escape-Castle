# CA-285 migration 072 focused audit

Date: 2026-10-22
Status: SOURCE REVIEW CONDITIONAL; release NOT authorized

Reviewed `database/072_ca284_act10_teacher_open_vote.sql`, CA284 tests and current production function catalog read-only. Migration 072 is not present in live migration history.

Confirmed existing `s6_get_player_state(text,text)` is SECURITY DEFINER, currently executable by anon, authenticated and service_role; existing internal S6 helpers are mostly service_role-only. The proposed rename-to-pre072 wrapper changes function identity and privileges in a single transaction. Source uses Teacher token assertion and run/phase/step/round/session guards. This is a plausible narrowly scoped design, but source-only/static browser tests do not prove PostgreSQL actual execution, role privileges, dependency behavior, or rollback.

BLOCKING RELEASE EVIDENCE GAP: Test actual migration on an isolated matching PostgreSQL/Supabase fixture. Assert `s6_get_player_state` wrapper callable by existing player roles, `pre072` not client-callable, S6 Teacher endpoints authorized only with valid teacher token, stale/repeated vote opening rejected and final-vote transition once; ACT9/11 and AUDIT deadlines unchanged; reversal/restore of exact old body, name and grants demonstrable without history loss. Produce concise isolated test plus rollback steps. Reuse existing tools, avoid creating new audit framework. No live migration or Pages deployment authorized.

Task A client source remains previously accepted. No other changes requested.

NEXT_OWNER: CD for one bounded isolation test and corrected candidate if necessary.
