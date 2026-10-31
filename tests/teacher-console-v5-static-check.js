const fs=require("fs");
const assert=(value,message)=>{if(!value)throw new Error(message)};
const html=fs.readFileSync("teacher.html","utf8");
const css=fs.readFileSync("src/styles/app.css","utf8");
const app=fs.readFileSync("src/teacher/teacher-console.js","utf8");
const sql=fs.readFileSync("database/074_teacher_console_v5_snapshot_and_room_reuse.sql","utf8");

for(const id of[
  "roomState","operationsState","discussionState","openVoteButton","exportCurrentSnapshotButton",
  "confirmExportSaved","clearRoomButton","roomCode","teacherToken","codeGitte","codeAnna","codeLinda",
  "createRoomButton","watchButton","startRunButton","startRunStatus"
])assert((html.match(new RegExp(`id=["']${id}["']`,"g"))||[]).length===1,`Teacher V5 ID ${id} must exist exactly once`);

for(const token of[
  "teacher-v5-main","teacher-v5-lower","teacher-v5-tools","teacher-host-panel","teacher-start-dock",
  'grid-template-areas:"live discussion"','grid-template-areas:"tools host"',"@media(max-width:999px)",
  "teacher-player-grid","button.processing","button.accepted"
])assert(html.includes(token)||css.includes(token),`Teacher V5 layout/state token missing: ${token}`);

assert(html.indexOf("teacher-v5-tools")<html.indexOf("teacher-host-panel"),"Lower tools must precede the lower-right host panel in document order");
assert(!html.includes("End discussion")&&!html.includes("结束讨论"),"Removed End Discussion control returned");
assert(!html.includes("Force advance")&&!html.includes("强制推进"),"Generic Force Advance control returned");
assert(html.includes("Phase-specific recovery actions"),"Bounded phase-specific recovery is not under Emergency / Recovery");

for(const token of[
  'joinedPlayerCount!==3','startRunButton.hidden=formalRunActive','button.textContent="Processing..."',
  'button.textContent=acceptedText','Failed ${actionError(error)}','s10_export_session_snapshot',
  's10_reset_room_for_next_session','p_expected_export_id:latestExportId','p_confirm_export_saved:true','latestExportedRunId!==currentSessionRunId'
])assert(app.includes(token),`Teacher V5 behavior contract missing: ${token}`);

for(const token of[
  "create table public.s10_teacher_exports","create function public.s10_export_session_snapshot",
  "create function public.s10_reset_room_for_next_session","'restorable',false",
  "'snapshot_consistency','single_statement_database_snapshot'","from public.dialogue_messages",
  "'legacy_decisions'","'room_events'",
  "revoke all on table public.s10_teacher_exports from public,anon,authenticated",
  "grant execute on function public.s10_export_session_snapshot(text,text,uuid)to anon,authenticated",
  "grant execute on function public.s10_reset_room_for_next_session(text,text,uuid,uuid,boolean)to anon,authenticated",
  "where export_id=p_expected_export_id and run_id=g.run_id",
  "update public.s1_room_players set session_token_hash=null,joined_at=null,last_seen_at=null"
])assert(sql.includes(token),`Migration 074 contract missing: ${token}`);

const runScopedTables=[...sql.matchAll(/delete from public\.([a-z0-9_]+) where run_id=g\.run_id/g)].map(match=>match[1]);
const resetTables=[
  "teacher_override_validity","teacher_overrides","s8_finalizations","dialogue_messages","runtime_player_decisions",
  "runtime_events","discussion_sessions","s6_run_state","act6_13_event_ledger","s6_station_b_progress",
  "s6_station_tasks","s6_engagements","s6_allocations","s6_allocation_attempts","s6_action_receipts","s6_choices",
  "s6_private_clues","s5_act8_private_choices","s5_votes","s5_rounds","s5_run_state","s3b_post_inspection_route_votes",
  "s3b_action_receipts","s3b_library_attempts","s3b_player_facts","s3b_player_progress","s3b_run_state",
  "s9_pocket_item_inspections","s3_player_item_view_state","s3_shared_photos","s3_player_knowledge",
  "s3_player_observations","s3_group_items","s3_player_items","s3_runtime_scene_state","game_runs"
];
for(const table of resetTables)assert(runScopedTables.includes(table),`Room reuse deletion coverage missing run-scoped table ${table}`);
const exportFunction=sql.slice(sql.indexOf("create function public.s10_export_session_snapshot"),sql.indexOf("create function public.s10_reset_room_for_next_session"));
for(const table of resetTables.filter(table=>table!=="game_runs"))assert(exportFunction.includes(`public.${table}`),`Snapshot export coverage missing table ${table}`);
for(const table of["s6_audio_occurrences","s6_audio_consumptions"])assert(exportFunction.includes(`public.${table}`),`Snapshot export coverage missing cascaded table ${table}`);

console.log("Teacher Console V5 static checks passed.");
