const crypto = require("crypto");
const { rpc, assert, id, auth, oldVote } = require("./sprint5-live-e2e");

async function fixtureAtAct4() {
  const room = id("PD");
  const teacher = id("T");
  const joins = [id("G"), id("A"), id("L")];
  await rpc("s1_create_room", {
    p_room_code: room,
    p_teacher_token: teacher,
    p_gitte_join_code: joins[0],
    p_anna_join_code: joins[1],
    p_linda_join_code: joins[2],
  });
  const players = await Promise.all(joins.map(p_join_code => rpc("s1_join_player", { p_room_code: room, p_join_code })));
  const f = { room, teacher, joins, players };
  await rpc("s9_start_formal_game", { p_room_code: room, p_teacher_token: teacher, p_run_mode: "audit" });
  await Promise.all([0, 1, 2].map(i => rpc("s3b_ack_act1_opening", auth(f, i))));
  for (const [i, p_choice_id] of [[0, "study_map"], [1, "read_diary"], [2, "study_watch"]]) {
    await rpc("s3b_submit_act1_choice", { ...auth(f, i), p_choice_id });
  }
  await Promise.all([0, 1, 2].map(i => rpc("s3b_complete_act1", auth(f, i))));
  await Promise.all([0, 1, 2].map(i => rpc("s3b_submit_first_meeting", { ...auth(f, i), p_choice_id: "library" })));
  await Promise.all([0, 1, 2].map(i => rpc("s3b_grab", auth(f, i))));
  await Promise.all([0, 1, 2].map(i => rpc("s3b_leave_start_room", auth(f, i))));
  await oldVote(f, ["library", "library", "library"]);
  await Promise.all([0, 1, 2].map(i => rpc("s3b_ack_route_update", auth(f, i))));
  await rpc("s3b_complete_foldback", auth(f, 0));
  await Promise.all([0, 1, 2].map(i => rpc("s3b_follow_sign", auth(f, i))));
  await rpc("s3b_submit_library_code", { ...auth(f, 0), p_client_request_id: crypto.randomUUID(), p_code: "41739" });
  return f;
}

async function main() {
  const library = await rpc("asset_resolve", { p_asset_key: "shared.library" });
  assert(library.ok && library.ui_anchors.some(anchor => anchor.anchor_name === "library_unknown_door"), "ACTIVE Library does not project library_unknown_door.");
  const gate = await rpc("asset_resolve", { p_asset_key: "shared.main_gate" });
  const gateAnchors = new Set((gate.ui_anchors || []).map(anchor => anchor.anchor_name));
  if(gate.ok)for (const name of ["main_gate_station_A", "main_gate_station_B", "main_gate_station_C", "main_gate_watcher_corridor"]) assert(gateAnchors.has(name), `ACTIVE Main Gate does not project ${name}.`);
  else assert(gate.reason === "NO_ACTIVE_ASSET" && gate.fallback, "Main Gate returned neither canonical ACTIVE metadata nor the typed placeholder fallback.");

  const f = await fixtureAtAct4();
  const choices = ["known", "unknown", "ask"];
  for (let i = 0; i < 2; i += 1) await rpc("s3b_submit_act4_choice", { ...auth(f, i), p_choice_id: choices[i] });
  let state = await rpc("s3b_get_player_state", auth(f, 0));
  assert(state.act4_revealed.length === 0, "ACT4 choices revealed before the three-player barrier.");
  await rpc("s3b_submit_act4_choice", { ...auth(f, 2), p_choice_id: choices[2] });
  state = await rpc("s3b_get_player_state", auth(f, 0));
  assert(state.scene.scene_id === "act5_route_discussion", "ACT4 disagreement did not enter the canonical ACT5 discussion.");
  assert(state.act4_revealed.length === 3, "Canonical ACT4 reveal projection did not contain all three positions.");
  assert(JSON.stringify(state.act4_revealed.map(({ role_slot, choice_id }) => [role_slot, choice_id])) === JSON.stringify([["GAL-A", "known"], ["GAL-B", "unknown"], ["GAL-C", "ask"]]), "ACT4 reveal projection changed canonical role/choice identity.");
  console.log(JSON.stringify({ room: f.room, package: "D", act4Reveal: "PASS", libraryAnchor: "PASS", mainGateRuntime: gate.ok ? `ACTIVE_V${gate.version}` : "PLACEHOLDER_NO_ACTIVE" }));
  console.log("Structural Package D live E2E passed.");
}

module.exports = { fixtureAtAct4 };
if (require.main === module) main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
