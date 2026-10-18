const fs=require("fs");
const sql=fs.readFileSync("database/071_act7_v4_normal_teacher_paced_vote.sql","utf8");
const teacher=fs.readFileSync("src/teacher/teacher-console.js","utf8");
const html=fs.readFileSync("teacher.html","utf8");
const recovery=fs.readFileSync("docs/reports/remediation/act7/071_RECOVERY.sql","utf8");
const acceptance=fs.readFileSync("tests/act7-071-controlled-acceptance.js","utf8");
const invariants=fs.readFileSync("docs/reports/remediation/act7/071_ACCEPTANCE_READONLY_INVARIANTS.sql","utf8");
const requireAll=(source,label,tokens)=>{for(const token of tokens)if(!source.includes(token))throw new Error(`${label} missing: ${token}`)};

if(!/^--[\s\S]*\nbegin;/.test(sql)||!sql.trimEnd().endsWith("commit;"))throw new Error("Migration 071 is not transaction-bounded");

requireAll(sql,"S5 NORMAL sentinel",[
  "when mode='normal' then 10800",
  "when g.run_mode='normal' then 10800",
  "discussion_time_limit_sec=discussion_secs",
  "vote_time_limit_sec=vote_secs",
]);
requireAll(sql,"identity-bound open vote",[
  "p_expected_run_id uuid",
  "p_expected_phase text",
  "p_expected_vote_round integer",
  "p_expected_discussion_session_id uuid",
  "for update",
  "Stale Sprint 5 run identity.",
  "Stale Sprint 5 phase or round identity.",
  "Stale Sprint 5 discussion identity.",
]);
requireAll(sql,"NORMAL nonmutating Add Time",[
  "if g.run_mode='normal' then",
  "'applicable',false",
  "'reason','NORMAL_TEACHER_PACED'",
]);
const normalReturn=sql.indexOf("return jsonb_build_object('ok',false,'applicable',false");
const addTimeUpdate=sql.indexOf("set status=case when status='waiting_for_missing_player'");
const addTimeEvent=sql.indexOf("'teacher_intervention_s5_time_added'");
if(!(normalReturn>=0&&normalReturn<addTimeUpdate&&normalReturn<addTimeEvent))throw new Error("NORMAL Add Time does not return before mutation/event code");
requireAll(sql,"AUDIT preservation",["when p_phase='act6_vote' then 90","when p_phase='act8_final_vote' then 180","else 15","else 60"]);
requireAll(sql,"ACL",[
  "revoke execute on function public.s5_teacher_open_vote(text,text) from public,anon,authenticated",
  "revoke execute on function public.s5_teacher_open_vote(text,text,uuid,text,integer,uuid) from public",
  "grant execute on function public.s5_teacher_open_vote(text,text,uuid,text,integer,uuid) to anon,authenticated",
]);
requireAll(teacher,"Teacher caller identity",["p_expected_run_id:run.run_id","p_expected_phase:discussion.phase_key","p_expected_vote_round:discussion.vote_round","p_expected_discussion_session_id:discussion.discussion_session_id"]);
if(!teacher.includes('addTimeButton.hidden=state.run.run_mode==="normal"'))throw new Error("NORMAL Add Time is not hidden by current run mode");
if(!html.includes('id="addTimeButton" class="secondary" type="button" hidden'))throw new Error("Add Time is visible before authoritative mode loads");
if(sql.includes("create or replace function public.s2_refresh_discussion"))throw new Error("Shared S2 deadline owner was changed");
requireAll(recovery,"Recovery SQL",[
  "drop function if exists public.s5_teacher_open_vote(text,text,uuid,text,integer,uuid)",
  "secs:=case p_phase when'act6_vote'then 90 when'act8_final_vote'then 180 else 15 end",
  "create or replace function public.s5_teacher_open_vote(p_room_code text,p_teacher_token text)",
  "grant execute on function public.s5_teacher_open_vote(text,text) to anon,authenticated,service_role",
]);
if(!recovery.trimEnd().endsWith("commit;"))throw new Error("Recovery SQL is not transaction-bounded");
requireAll(acceptance,"controlled acceptance barrier",[
  'prepared.active && prepared.discussion === null',
  'rpc("s9_observe_act5_handoff"',
  'rpc("s9_enter_act6"',
  'if (index < 2) assert(current.discussion === null',
  'full.state.phase_key === "act6_vote"',
  'replay.discussion.discussion_session_id === identity',
]);
requireAll(acceptance,"controlled acceptance identities",[
  "p_expected_run_id: teacher.run.run_id",
  "p_expected_phase: discussion.phase_key",
  "p_expected_vote_round: discussion.vote_round",
  "p_expected_discussion_session_id: discussion.discussion_session_id",
]);
requireAll(acceptance,"controlled late-third scenario",[
  "await sleep(61000)",
  'lateTeacher.current_votes.filter(vote => vote.submitted).length === 2',
  'latePlayer.discussion.vote_options.length === 3',
  'await submitVote(fixtureState, opened, 2, "clock_c")',
  'nextRound.discussion.vote_round === 3',
]);
requireAll(acceptance,"controlled AUDIT ACT7 scenario",[
  'await vote(fixtureState, ["escape", "1897", "trapped"])',
  'current.state.phase_key === "act7_vote"',
  'current.canonical_discussion.discussion_time_limit_sec === 15',
  'current.canonical_discussion.vote_time_limit_sec === 60',
  'voting.discussion.phase_key === "act7_vote"',
  'await sleep(61000)',
  'expired.discussion.status === "waiting_for_missing_player"',
  'after.discussion.status === "voting"',
]);
requireAll(acceptance,"controlled SQL evidence gates",[
  'env.ACT7_071_PRODUCTION_AUTHORIZED !== "YES"',
  'env.ACT7_071_EVIDENCE_PAUSE !== "YES"',
  'function assertExecutionAuthorized(env = process.env)',
  'async function main() {\n  assertExecutionAuthorized();',
  'type: "ACT7_071_EVIDENCE_BOUNDARY"',
  'evidenceBoundary("ROUND2_OPEN"',
  'evidenceBoundary("THIRD_VOTE_RESOLVED"',
  'evidenceBoundary("AUDIT_AFTER_ADD"',
]);
const startupGate=acceptance.indexOf('async function main() {\n  assertExecutionAuthorized();');
const firstScenario=acceptance.indexOf('const normal = await runNormalScenario()',startupGate);
if(startupGate<0||firstScenario<0||startupGate>firstScenario)throw new Error("Both authorization gates are not ahead of the first fixture scenario");
requireAll(invariants,"protected SQL evidence",[
  "current_round_vote_count",
  "distinct_current_round_voters",
  "discussion_row_md5",
  "s5_state_md5",
  "waiting_event_count",
  "teacher_open_event_count",
  "teacher_add_time_event_count",
  "next_round_row_count",
  "wrong_attempt_events",
  "e.discussion_session_id=p.discussion_session_id",
  "(e.details->>'vote_round')::integer=p.vote_round",
]);
const executableInvariantSql=invariants.replace(/^\s*--.*$/gm,"");
if(/\b(insert|update|delete|merge|grant|revoke|create|drop|alter|truncate)\b/i.test(executableInvariantSql))throw new Error("Protected acceptance evidence is not SELECT-only");
console.log("ACT7 V4 NORMAL timeout static checks passed.");
