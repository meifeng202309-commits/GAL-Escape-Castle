const fs=require("fs");
const app=fs.readFileSync("src/game/app.js","utf8");
const sql=fs.readFileSync("database/065_package_b_player_wait_projection.sql","utf8");
function assert(value,message){if(!value)throw new Error(message)}
for(const fragment of [
  'function acceptedWaiting',
  'scene.phase_key==="first_meeting"',
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
console.log("Structural Package B static checks passed.");
