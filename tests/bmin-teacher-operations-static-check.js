const fs=require("node:fs");
const assert=(value,message)=>{if(!value)throw new Error(message)};
const sql=fs.readFileSync("database/069_bmin_teacher_operational_projection.sql","utf8");
const ui=fs.readFileSync("src/teacher/teacher-console.js","utf8");

for(const token of [
  "rename to s7_get_teacher_console_pre069",
  "revoke all on function public.s7_get_teacher_console_pre069",
  "create function public.s7_get_teacher_console(",
  "legacy:=public.s7_get_teacher_console_pre069",
  "S6_WITHOUT_COMPLETED_S5",
  "S5_ACTIVATED_WITHOUT_ALL_PLAYERS_ENTERED",
  "MISSING_S3B_PLAYER_PROGRESS",
  "progress.act6_handoff_observed_at",
  "progress.act6_entered_at",
  "sprint5.act6_entered_at",
  "'assignment_role'",
  "'engagement_state'",
  "'task_state'",
  "'source_domain'",
  "'source_identity'",
  "'validity'",
  "'reason_code'",
  "legacy||jsonb_build_object('operations_v1',operations)",
])assert(sql.includes(token),`Missing B-min SQL contract: ${token}`);

assert(!sql.includes("insert into")&&!sql.includes("update public")&&!sql.includes("delete from"),"B-min projection migration contains a gameplay/data write.");
assert(sql.includes("sprint6.act_no<=10 then'great_hall'")&&sql.includes("sprint6.act_no<=12 then'main_gate'"),"S6 physical-location ownership mapping is incomplete.");
assert(sql.includes("when 6 then'portrait_hall'when 7 then'clock_room'else'great_hall'"),"S5 shared-location mapping is incomplete.");
assert(sql.includes("allocation.role_key")&&sql.includes("engagement.player_id")&&sql.includes("task.player_id"),"ACT11/12 operational facts do not come from owner tables.");
assert(sql.includes("jsonb_build_object('run_id',active_run_id,'table_name'"),"Source identity is not explicitly run-scoped.");
assert(ui.includes("state.operations_v1||[]")&&ui.includes("operation.physical_location")&&ui.includes("operation.source_domain"),"Teacher UI does not consume operations_v1.");
assert(!ui.includes("escapeHtml(p.player_location||\"-\")"),"Teacher UI still consumes displaced legacy player_location.");
assert(ui.includes("operationsLoadGeneration"),"A2 generation guard was lost.");
console.log("B-min Teacher operational projection static checks passed.");
