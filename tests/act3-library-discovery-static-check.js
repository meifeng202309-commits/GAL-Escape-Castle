const fs=require("fs");
const assert=(value,message)=>{if(!value)throw new Error(message)};
const sql=fs.readFileSync("database/076_act3_library_discovery_gate.sql","utf8");
const app=fs.readFileSync("src/game/app.js","utf8");

for(const token of[
  "library_discovery_ack_at","s10_enter_library_discovery","'library_discovery','box_opened'",
  "s3b_ack_library_discovery","p_expected_run_id","acknowledged_players","advanced_to_act4"
])assert(sql.includes(token),`ACT3 durable SQL contract missing: ${token}`);
assert((sql.match(/perform public\.s10_enter_library_discovery/g)||[]).length===2,"Direct and fallback resolution do not share the discovery transition");
assert(!/delete\s+from/i.test(sql),"ACT3 discovery migration must not delete historical data");

for(const token of[
  'scene.phase_key==="library_discovery"','libraryDiscoveryPhoto','libraryDiscoveryNote',
  '"prop.photo_1897"','"prop.library_clock_clue_note"','data-group-item=',
  'button.dataset.s3bRpc==="s3b_ack_library_discovery"'
])assert(app.includes(token),`ACT3 Player presentation missing: ${token}`);

console.log("ACT3 Library durable discovery static checks passed.");
