const fs=require("node:fs");
const assert=require("node:assert/strict");
const sql=fs.readFileSync("database/073_act9_normal_teacher_paced_vote.sql","utf8");
const player=fs.readFileSync("src/game/app.js","utf8");
const teacher=fs.readFileSync("src/teacher/teacher-console.js","utf8");
for(const fragment of ["p_phase in('act9_discussion','act10_discussion')","s.phase_key in('act9_discussion','act10_discussion')","d.phase_key in('act9_discussion','act10_discussion')","p_expected_phase not in('act9_discussion','act10_discussion')","when'act9_discussion'then'act9_console'","g.run_mode<>'normal'","grant execute on function public.s6_teacher_open_vote(text,text,uuid,text,int,int,uuid)to anon,authenticated"]){
  assert.ok(sql.includes(fragment),`Missing migration073 policy fragment: ${fragment}`);
}
assert.ok(sql.includes("result:=jsonb_set(result,'{discussion,teacher_open_required}','true'::jsonb,true)"),"ACT9/10 Player projection lacks Teacher marker");
assert.ok(player.includes('!d.teacher_open_required&&Date.parse(d.phase_deadline)<=Date.now()'),"Player close is not Teacher-gated");
assert.ok(teacher.includes('["act9_discussion","act10_discussion"].includes(state.discussion.phase_key)'),"Teacher ACT9 button gate missing");
assert.ok(teacher.includes('["act9_discussion","act10_discussion"].includes(discussion?.phase_key)'),"Teacher ACT9 identity payload gate missing");
console.log("ACT9 migration073 NORMAL Teacher-paced static checks passed.");
