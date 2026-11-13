const fs=require("fs");
const assert=(value,message)=>{if(!value)throw new Error(message)};
const player=fs.readFileSync("src/game/app.js","utf8");
const teacher=fs.readFileSync("src/teacher/teacher-console.js","utf8");
const html=fs.readFileSync("teacher.html","utf8");
const sql=fs.readFileSync("database/075_teacher_trial_p1_room_reuse.sql","utf8");

for(const token of[
  'selectedPocketItem=""','No projected items.','data-formal-routed-action',
  'querySelectorAll(":scope > [data-formal-routed-action]")',
  'DISPLAY_NAME_BY_ROLE={"GAL-A":"Gitte","GAL-B":"Anna","GAL-C":"Linda"}',
  'escapeHtml(DISPLAY_NAME_BY_ROLE[role]||role)'
])assert(player.includes(token),`Player P1 correction missing: ${token}`);

for(const token of[
  'Current vote/discussion stage:','p.submitted','"Submitted":"Waiting"',
  'Run this room again:','active or completed run will be preserved'
])assert(teacher.includes(token),`Teacher P1 correction missing: ${token}`);
assert(html.includes("Watch/Reconnect first"),"Existing-room reuse route is not visible to the Teacher");

for(const token of[
  "status in('active','completed')","if g.status='active' then",
  "'previous_run_status',g.status","session_generation=generation",
  "session_token_hash=null,session_generation=null,joined_at=null,last_seen_at=null"
])assert(sql.includes(token),`Migration 075 contract missing: ${token}`);
assert(!/\bdelete\s+from\b/i.test(sql),"Room reuse correction must preserve historical rows");
assert(sql.includes("A different active run must be selected"),"Completed-run reuse must reject a different active run");

console.log("Teacher trial 2026-11-13 P1 static checks passed.");
