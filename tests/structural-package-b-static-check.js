const fs=require("fs");
const app=fs.readFileSync("src/game/app.js","utf8");
const sql=fs.readFileSync("database/065_package_b_player_wait_projection.sql","utf8");
const fix=fs.readFileSync("database/066_package_b_wait_projection_locked_at_fix.sql","utf8");
const allocationFix=fs.readFileSync("database/067_package_b_allocation_progress_fix.sql","utf8");
function assert(value,message){if(!value)throw new Error(message)}
for(const fragment of [
  'function acceptedWaiting',
  'scene.phase_key==="private_first_meeting"',
  'scene.phase_key==="route_update" && me.route_update_ack_at',
  'scene.phase_key==="wayfinding" && me.player_location==="library"',
  'scene.scene_id==="act4_known_unknown" && me.act4_locked_at',
  'function renderSprint6AcceptedWaiting',
  '"act9_console","act10_private","act10_final_vote","act12_pressure"',
  's.phase_key==="act11_allocation"&&wait.my_allocation_locked',
  's.phase_key==="act12_tasks"&&payload.station_task&&wait.my_engaged',
])assert(app.includes(fragment),`Package B client contract missing: ${fragment}`);
for(const fragment of [
  "create function public.s9_get_player_wait_state",
  "'my_choice_locked'",
  "'submitted_count'",
  "'my_allocation_locked'",
  "'my_engaged'",
  "grant execute on function public.s9_get_player_wait_state",
])assert(sql.includes(fragment),`Package B projection missing: ${fragment}`);
assert(!sql.includes("choice_id',mine.choice_id"),"Package B projection exposes private choice content.");
assert(fix.includes("order by locked_at desc"),"Package B forward fix does not use the canonical s6_choices acceptance timestamp.");
assert(!fix.includes("submitted_at"),"Package B forward fix still references the nonexistent submitted_at column.");
assert(allocationFix.includes("if s.phase_key='act11_allocation'"),"Package B allocation progress is not phase-aware.");
assert(allocationFix.includes("from public.s6_allocations where run_id=g.run_id"),"Package B ACT11 progress does not use the allocation authority table.");
console.log("Structural Package B static checks passed.");
