const fs = require("fs");
const app = fs.readFileSync("src/game/app.js", "utf8");
const css = fs.readFileSync("src/styles/app.css", "utf8");
const mainGate = JSON.parse(fs.readFileSync("assets/staging/shared.main_gate/v002/shared.main_gate__v002.json", "utf8"));
function assert(value, message) { if (!value) throw new Error(message); }

for (const fragment of [
  "function clearSprint6Status",
  "clearSprint6Status();setSprint6CinematicMode",
  'sprint3bStatus.dataset.sprint6Status="audio-blocked"',
  'sprint3bStatus.dataset.sprint6Status==="audio-blocked"',
]) assert(app.includes(fragment), `Package D1 stale-status recovery missing: ${fragment}`);

for (const fragment of [
  "function act4ComparisonHtml",
  'setS5Asset("act4MapImage","prop_gitte_castle_map")',
  'setS5Asset("act4LibraryImage","shared.library")',
  'anchor(library,"library_unknown_door")',
  'localizedHtml("act04-05.001")',
  'localizedHtml("act04-05.002")',
  'localizedHtml("act04-05.003")',
  "function mainGateOverlayHtml",
  "main_gate_station_A",
  "main_gate_station_B",
  "main_gate_station_C",
  "main_gate_watcher_corridor",
  'anchor(scene,node.dataset.anchor)',
]) assert(app.includes(fragment), `Package D2 canonical visual integration missing: ${fragment}`);

for (const fragment of [
  "function act4RevealHtml",
  "revealed.length!==3",
  "Object.fromEntries(ROUTE_CHOICES)",
  "act4RevealHtml(state.act4_revealed)",
]) assert(app.includes(fragment), `Package D3 projected reveal renderer missing: ${fragment}`);

for (const fragment of [
  ".act4-comparison",
  ".act4-door-marker",
  ".act4-reveal",
  ".s6-station-label",
  ".s6-station-legend",
]) assert(css.includes(fragment), `Package D visual style missing: ${fragment}`);

assert(!app.includes("act4_revealed.map(item=>item.choice_id"), "Package D client derives reveal authority instead of rendering the canonical projection.");
assert(mainGate.status === "APPROVED" && mainGate.teacher_review === "APPROVED", "Package D changed the preserved Main Gate Teacher approval state.");
for (const name of ["main_gate_station_A", "main_gate_station_B", "main_gate_station_C", "main_gate_watcher_corridor"]) {
  assert(mainGate.ui_anchors.some(anchor => anchor.anchor_name === name), `Main Gate v002 sidecar is missing ${name}.`);
}
console.log("Structural Package D static checks passed.");
