const { rpc, assert, auth } = require("./sprint5-live-e2e");
const { fixture, completeEarlyActs, completeSprint5ToAct9 } = require("./structural-package-b-live-e2e");

async function main() {
  const f = await fixture();
  await completeEarlyActs(f);

  let linda = await rpc("s3_get_player_state", auth(f, 2));
  assert(linda.items.some(item => item.item_key === "linda_stopped_watch" && item.current_view === "front"), "ACT6 Pocket did not expose Linda's canonical early-game watch.");
  assert(linda.group_items.some(item => item.item_key === "library_torn_note"), "ACT6 Pocket did not expose canonical ACT3 group evidence.");
  const earlyObservationKeys = linda.observations.map(item => item.observation_key).sort();
  await rpc("s3_set_item_view", { ...auth(f, 2), p_item_key: "linda_stopped_watch", p_target_view: "back" });
  linda = await rpc("s3_get_player_state", auth(f, 2));
  assert(linda.items.some(item => item.item_key === "linda_stopped_watch" && item.current_view === "back"), "ACT6 Pocket FLIP state did not survive reconnect.");

  await completeSprint5ToAct9(f);
  const act9Reconnect = await rpc("s3_get_player_state", auth(f, 2));
  assert(act9Reconnect.items.some(item => item.item_key === "linda_stopped_watch" && item.current_view === "back"), "ACT9 reconnect lost the early-game Pocket view state.");
  assert(act9Reconnect.group_items.some(item => item.item_key === "library_torn_note"), "ACT9 reconnect lost ACT3 evidence.");
  assert(JSON.stringify(act9Reconnect.observations.map(item => item.observation_key).sort()) === JSON.stringify(earlyObservationKeys), "ACT9 reconnect changed the canonical observation set.");

  console.log(JSON.stringify({ room: f.room, package: "C", crossActPocket: "PASS" }));
  console.log("Structural Package C live E2E passed.");
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
