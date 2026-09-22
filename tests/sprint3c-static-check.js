const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"..");
const read=f=>fs.readFileSync(path.join(root,f),"utf8");
const sql=read("database/015_sprint3c_minimal_safe_teacher_override.sql"),correction=read("database/016_sprint3c_level1_narrow_corrections.sql"),entryCorrection=read("database/017_sprint3c_override_act2_entry_correction.sql"),html=read("teacher.html"),js=read("src/teacher/teacher-console.js");
const requireAll=(source,label,parts)=>parts.forEach(part=>{if(!source.includes(part))throw new Error(`${label} missing: ${part}`)});
requireAll(sql,"015",[
  "create table public.teacher_overrides","create table public.teacher_override_validity",
  "enable row level security","active_override_id","teacher_apply_override",
  "Unknown override action.","Override action is unsupported for the current interaction.",
  "for update","invalid_teacher_override","resolution_source text not null default 'teacher_override'",
  "behavior_scoring boolean not null default false","upstream_teacher_override",
  "act1_wake_up","act2_route_update","act3_library","Library Box is already resolved.",
  "s2_get_teacher_state_pre015","allowed_actions","teacher_override"
]);
for(const forbidden of ["p_next_scene","p_player_id","p_choice_id","p_resolution","p_safe_resolution"]){if(sql.includes(forbidden))throw new Error(`Override RPC exposes forbidden input: ${forbidden}`)}
requireAll(html,"Teacher HTML",["Advanced / Emergency Override","overrideReason","overrideActions","overrideHistory"]);
requireAll(js,"Teacher client",["teacher_apply_override","This action may invalidate behavior data for the current phase. Continue?","A reason is required.","OVERRIDE USED"]);
requireAll(correction,"016",["teacher_apply_override_pre016","set act1_stage='complete'","act1_stage<>'complete'","create or replace function public.s2_log_event","active_override_id","'upstream_teacher_override',true","'override_id',v_override.override_id"]);
requireAll(entryCorrection,"017",["create or replace function public.s3b_submit_first_meeting","progress.act1_stage<>'complete'","first_meeting_choice=p_choice_id","s3b_log_formal_event_at_context"]);
console.log("Sprint 3C static checks passed.");
