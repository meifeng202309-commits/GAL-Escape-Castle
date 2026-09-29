const fs = require("fs");
const app = fs.readFileSync("src/game/app.js", "utf8");
function assert(value, message) { if (!value) throw new Error(message); }

for (const fragment of [
  'const pocketState = await rpc("s3_get_player_state"',
  'function pocketEvidencePanel',
  'renderSprint3b(state,pocket)',
  'pocketEvidencePanel(pocket,scene.phase_key)',
  'sprint3bText.insertAdjacentHTML("beforeend",pocketEvidencePanel(pocketState,sprint6State.state.phase_key))',
  'function bindPocketActions',
  's3_set_item_view',
  's3_share_photo',
]) assert(app.includes(fragment), `Package C cross-ACT shell missing: ${fragment}`);

assert(!app.includes('const pocketState = sprint5State.active ?'), "Package C Pocket fetch remains gated on Sprint5 activity.");
console.log("Structural Package C static checks passed.");
