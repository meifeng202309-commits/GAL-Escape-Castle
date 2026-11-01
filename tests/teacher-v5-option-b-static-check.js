const fs=require("fs"),assert=(v,m)=>{if(!v)throw new Error(m)};
const sql=fs.readFileSync("database/074_teacher_console_v5_snapshot_and_room_reuse.sql","utf8");
const player=fs.readFileSync("src/game/app.js","utf8");
const teacher=fs.readFileSync("src/teacher/teacher-console.js","utf8");
const prepare=sql.slice(sql.indexOf("create function public.s10_prepare_room_for_next_run"));
for(const token of["session_generation uuid not null default gen_random_uuid()","status in('active','completed','interrupted')","p.session_generation=r.session_generation","status='interrupted'","interruption_reason='teacher_prepare_next_run'","session_token_hash=null,session_generation=null","'rows_deleted',false"])
  assert(sql.includes(token),`Option B SQL token missing: ${token}`);
assert(!/\bdelete\s+from\b/i.test(prepare),"Option B prepare RPC contains a destructive DELETE");
assert(!sql.includes("s10_reset_room_for_next_session"),"Superseded destructive RPC remains in migration074");
assert(!sql.includes("p_expected_export_id")&&!sql.includes("p_confirm_export_saved"),"Superseded export gate remains in prepare path");
for(const token of["expiredPlayerSession","expirePlayerSession","resetRunScopedClientState","startsWith(\"gal.pending.\")","lastObservedRunId"])
  assert(player.includes(token),`Player stale-session/cache boundary missing: ${token}`);
assert(teacher.includes('rpc("s10_prepare_room_for_next_run"'),"Teacher does not call the Option B RPC");
assert(!teacher.includes("latestExportId")&&!teacher.includes("confirmExportSaved"),"Teacher retains superseded destructive/export gate state");
console.log("Teacher V5 Option B static checks passed.");
