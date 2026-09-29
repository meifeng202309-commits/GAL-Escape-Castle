const { rpc, assert, auth } = require("./sprint5-live-e2e");
const { fixture, completeEarlyActs, completeSprint5ToAct9 } = require("./structural-package-b-live-e2e");

async function expectReject(action, fragment) {
  try { await action(); throw new Error("Expected rejection"); }
  catch (error) { assert(error.message.includes(fragment), `Unexpected rejection: ${error.message}`); }
}

async function main() {
  const f = await fixture();
  await completeEarlyActs(f);

  let gitte = await rpc("s3_get_player_state", auth(f, 0));
  assert(!gitte.inspected_item_keys.includes("gitte_number_note"), "Carrying Number Note auto-opened its hidden content.");
  assert(!gitte.knowledge.some(item => item.knowledge_key === "gitte_number_code" || item.knowledge_key === "gitte_star_symbol"), "Carrying Number Note auto-unlocked internal knowledge.");
  await expectReject(
    () => rpc("s9_inspect_pocket_item", { ...auth(f, 0), p_item_key: "anna_servant_diary" }),
    "does not physically own",
  );
  await expectReject(
    () => rpc("s3_set_item_view", { ...auth(f, 0), p_item_key: "gitte_number_note", p_target_view: "back" }),
    "Inspect the item",
  );
  await rpc("s9_inspect_pocket_item", { ...auth(f, 0), p_item_key: "gitte_castle_map" });
  await rpc("s9_inspect_pocket_item", { ...auth(f, 0), p_item_key: "gitte_number_note" });
  gitte = await rpc("s3_get_player_state", auth(f, 0));
  assert(gitte.inspected_item_keys.includes("gitte_number_note") && gitte.knowledge.some(item => item.knowledge_key === "gitte_number_code"), "Number Note reopen did not authoritatively reveal 41739 knowledge.");
  assert(!gitte.knowledge.some(item => item.knowledge_key === "gitte_star_symbol"), "Number Note front inspection auto-unlocked the hidden back symbol.");
  await rpc("s3_set_item_view", { ...auth(f, 0), p_item_key: "gitte_number_note", p_target_view: "back" });
  gitte = await rpc("s3_get_player_state", auth(f, 0));
  assert(gitte.items.some(item => item.item_key === "gitte_number_note" && item.current_view === "back") && gitte.knowledge.some(item => item.knowledge_key === "gitte_star_symbol"), "Number Note FLIP did not reveal and preserve the star knowledge.");

  await rpc("s9_inspect_pocket_item", { ...auth(f, 1), p_item_key: "anna_servant_diary" });
  const anna = await rpc("s3_get_player_state", auth(f, 1));
  assert(anna.inspected_item_keys.includes("anna_servant_diary") && anna.knowledge.some(item => item.knowledge_key === "anna_snake_rule"), "Diary reopen did not preserve its canonical internal clue.");

  let linda = await rpc("s3_get_player_state", auth(f, 2));
  assert(linda.items.some(item => item.item_key === "linda_stopped_watch" && item.current_view === "front"), "ACT6 Pocket did not expose Linda's canonical early-game watch.");
  assert(linda.group_items.some(item => item.item_key === "library_torn_note"), "ACT6 Pocket did not expose canonical ACT3 group evidence.");
  const earlyObservationKeys = linda.observations.map(item => item.observation_key).sort();
  assert(!linda.knowledge.some(item => item.knowledge_key === "linda_tower_reason"), "Carrying Closure Order auto-unlocked its hidden reason.");
  await rpc("s9_inspect_pocket_item", { ...auth(f, 2), p_item_key: "linda_closure_order" });
  await rpc("s9_inspect_pocket_item", { ...auth(f, 2), p_item_key: "linda_stopped_watch" });
  await rpc("s3_set_item_view", { ...auth(f, 2), p_item_key: "linda_stopped_watch", p_target_view: "back" });
  linda = await rpc("s3_get_player_state", auth(f, 2));
  assert(linda.items.some(item => item.item_key === "linda_stopped_watch" && item.current_view === "back") && linda.knowledge.some(item => item.knowledge_key === "linda_watch_reminder"), "ACT6 Pocket FLIP state did not survive reconnect.");
  assert(linda.inspected_item_keys.includes("linda_closure_order") && linda.knowledge.some(item => item.knowledge_key === "linda_tower_reason"), "Closure Order reopen did not authoritatively reveal its full reason.");

  await completeSprint5ToAct9(f);
  const act9Reconnect = await rpc("s3_get_player_state", auth(f, 2));
  assert(act9Reconnect.items.some(item => item.item_key === "linda_stopped_watch" && item.current_view === "back"), "ACT9 reconnect lost the early-game Pocket view state.");
  assert(act9Reconnect.inspected_item_keys.includes("linda_stopped_watch") && act9Reconnect.inspected_item_keys.includes("linda_closure_order"), "ACT9 reconnect lost authoritative inspect state.");
  assert(act9Reconnect.group_items.some(item => item.item_key === "library_torn_note"), "ACT9 reconnect lost ACT3 evidence.");
  assert(JSON.stringify(act9Reconnect.observations.map(item => item.observation_key).sort()) === JSON.stringify(earlyObservationKeys), "ACT9 reconnect changed the canonical observation set.");

  console.log(JSON.stringify({ room: f.room, package: "C", crossActPocket: "PASS" }));
  console.log("Structural Package C live E2E passed.");
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
