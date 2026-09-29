const fs = require("fs");
const app = fs.readFileSync("src/game/app.js", "utf8");
const sql = fs.readFileSync("database/068_package_c_authoritative_pocket_inspection.sql", "utf8");
function assert(value, message) { if (!value) throw new Error(message); }

for (const fragment of [
  'const pocketState = await rpc("s3_get_player_state"',
  'function pocketEvidencePanel',
  'renderSprint3b(state,pocket)',
  'pocketEvidencePanel(pocket,scene.phase_key)',
  'sprint3bText.insertAdjacentHTML("beforeend",pocketEvidencePanel(pocketState,sprint6State.state.phase_key))',
  'function bindPocketActions',
  'function pocketItemContent',
  'item.item_key==="gitte_number_note"',
  '"act01-g.007"',
  'item.item_key==="anna_servant_diary"',
  '"act01-a.010"',
  'item.item_key==="linda_closure_order"',
  '"act01-l.016"',
  's9_inspect_pocket_item',
  's3_set_item_view',
  's3_share_photo',
]) assert(app.includes(fragment), `Package C cross-ACT shell missing: ${fragment}`);

assert(!app.includes('const pocketState = sprint5State.active ?'), "Package C Pocket fetch remains gated on Sprint5 activity.");
for (const fragment of [
  "create table if not exists public.s9_pocket_item_inspections",
  "Player does not physically own this item.",
  "'gitte_number_code'",
  "'anna_snake_rule'",
  "'linda_tower_reason'",
  "'inspected_item_keys'",
  "Inspect the item before changing its view.",
]) assert(sql.includes(fragment), `Package C authoritative inspection migration missing: ${fragment}`);
console.log("Structural Package C static checks passed.");
