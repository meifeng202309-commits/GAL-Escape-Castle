const fs=require("node:fs"),assert=require("node:assert/strict");
const sql=fs.readFileSync("database/072_ca284_act10_teacher_open_vote.sql","utf8");
const teacher=fs.readFileSync("src/teacher/teacher-console.js","utf8");
const player=fs.readFileSync("src/game/app.js","utf8");
for(const token of[
  "mode='normal'and p_phase='act10_discussion'then null",
  "mode='normal'and s.phase_key='act10_discussion'then return",
  "d.phase_deadline is not null and d.phase_deadline<=now()",
  "Teacher must open the ACT10 final vote.",
  "teacher_open_required",
  "create function public.s6_get_teacher_discussion_state",
  "create function public.s6_teacher_open_vote",
  "p_expected_phase<>'act10_discussion'",
  "phase_key='act10_final_vote'",
  "teacher_intervention_s6_vote_opened",
  "revoke execute on function public.s6_teacher_open_vote",
  "grant execute on function public.s6_teacher_open_vote",
])assert.ok(sql.includes(token),`CA284 migration missing ${token}`);
assert.ok(teacher.includes('teacherDiscussionOwner==="s6"?"s6_teacher_open_vote"'),"Teacher Open Vote does not route ACT10 to S6");
assert.ok(teacher.includes('p_expected_step:s6.act9_step')&&teacher.includes('p_expected_round:s6.round_no'),"Teacher ACT10 request lacks rendered identity");
assert.ok(player.includes('!d.teacher_open_required&&Date.parse(d.phase_deadline)<=Date.now()'),"Player ACT10 Continue is not Teacher-gated");
console.log("CA284 ACT10 Teacher Open Vote static checks passed.");
