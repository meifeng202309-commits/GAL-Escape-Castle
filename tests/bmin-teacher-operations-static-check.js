const fs=require("node:fs");
const assert=(value,message)=>{if(!value)throw new Error(message)};
const sql=fs.readFileSync("database/069_bmin_teacher_operational_projection.sql","utf8");
const ui=fs.readFileSync("src/teacher/teacher-console.js","utf8");
const ddl=["database/007_sprint3b_act1_5_placeholder_flow.sql","database/027_sprint5_act6_8_runtime.sql","database/033_sprint6_act9_13_runtime.sql","database/034_sprint6_contract_hardening.sql","database/035_sprint6_focused_audit_corrections.sql","database/059_structural_lifecycle_transition_spine.sql","database/061_package_a_act6_entry_timer_barrier.sql"].map(file=>fs.readFileSync(file,"utf8")).join("\n");

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
  "SUBMITTED_CURRENT_ROUND",
  "UNKNOWN_UNAVAILABLE_S5_ROUND",
  "UNKNOWN_UNAVAILABLE_S6_PHASE",
  "UNKNOWN_UNAVAILABLE_S3B_PHASE",
  "DUPLICATE_S6_ROLE_ALLOCATION",
  "CONTRADICTORY_S6_ENGAGEMENT_RELATIONSHIP",
  "CONTRADICTORY_S6_TASK_RELATIONSHIP",
  "legacy||jsonb_build_object('operations_v1',operations)",
])assert(sql.includes(token),`Missing B-min SQL contract: ${token}`);

assert(!sql.includes("insert into")&&!sql.includes("update public")&&!sql.includes("delete from"),"B-min projection migration contains a gameplay/data write.");
assert(sql.includes("sprint6.act_no<=10 then'great_hall'")&&sql.includes("sprint6.act_no<=12 then'main_gate'"),"S6 physical-location ownership mapping is incomplete.");
assert(sql.includes("when 6 then'portrait_hall'when 7 then'clock_room'else'great_hall'"),"S5 shared-location mapping is incomplete.");
assert(sql.includes("allocation.role_key")&&sql.includes("engagement_integrity.match_count")&&sql.includes("task_integrity.match_count"),"ACT11/12 operational facts do not come from owner tables.");
assert(sql.includes("jsonb_build_object('run_id',active_run_id,'table_name'"),"Source identity is not explicitly run-scoped.");
assert(ui.includes("state.operations_v1||[]")&&ui.includes("operation.physical_location")&&ui.includes("operation.source_domain"),"Teacher UI does not consume operations_v1.");
assert(!ui.includes("escapeHtml(p.player_location||\"-\")"),"Teacher UI still consumes displaced legacy player_location.");
assert(ui.includes("operationsLoadGeneration"),"A2 generation guard was lost.");
for(const producer of ["create table if not exists public.s3b_player_progress","player_location text","act6_handoff_observed_at","act6_entered_at","create table public.s5_run_state","create table public.s6_run_state","create table public.s6_allocations","create table public.s6_engagements","s6_station_tasks"]){assert(ddl.includes(producer),`Referenced owner producer is absent from repository DDL: ${producer}`)}
assert((sql.match(/left join public\.s6_allocations allocation/g)||[]).length===1,"Allocation lookup is not singular per player.");
assert(!sql.includes("left join public.s6_engagements engagement")&&!sql.includes("left join public.s6_station_tasks task"),"Role-keyed S6 tables are still directly joined by player and may multiply projection rows.");
assert(sql.includes("count(*)filter(where e.role_key=allocation.role_key")&&sql.includes("count(*)filter(where t.role_key=allocation.role_key"),"S6 engagement/task reads are not cardinality-safe scalar aggregates.");
assert(sql.includes("a.role_key=allocation.role_key)allocation_integrity")&&sql.includes("allocation_integrity.role_count>1"),"Duplicate S6 role allocation is not detected.");
assert(sql.includes("decision.discussion_session_id=d.discussion_session_id")&&sql.includes("v.vote_round=sprint5.vote_round")&&sql.includes("c.round_no=sprint6.round_no"),"Discussion/vote status is not bound to owner phase/round identity.");
assert(sql.includes("order by player.role_slot")&&sql.includes("where player.room_code=upper(trim(p_room_code))"),"Projection aggregation is not deterministically room-scoped.");
console.log("B-min Teacher operational projection static checks passed.");
