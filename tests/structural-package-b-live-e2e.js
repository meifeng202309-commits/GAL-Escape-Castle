const crypto = require("crypto");
const { rpc, assert, id, auth, oldVote, vote, state, s6state, s6id } = require("./sprint5-live-e2e");

async function waitState(f, i) {
  return rpc("s9_get_player_wait_state", auth(f, i));
}

async function fixture() {
  const room = id("PB");
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
  return f;
}

async function completeEarlyActs(f) {
  await Promise.all([0, 1, 2].map(i => rpc("s3b_ack_act1_opening", auth(f, i))));
  for (const [i, choice] of [[0, "study_map"], [1, "read_diary"], [2, "study_watch"]]) {
    await rpc("s3b_submit_act1_choice", { ...auth(f, i), p_choice_id: choice });
  }
  await Promise.all([0, 1, 2].map(i => rpc("s3b_complete_act1", auth(f, i))));

  await rpc("s3b_submit_first_meeting", { ...auth(f, 0), p_choice_id: "library" });
  let reconnect = await rpc("s3b_get_player_state", auth(f, 0));
  assert(reconnect.me.first_meeting_locked_at, "ACT2 accepted meeting choice did not survive reconnect.");
  assert(!reconnect.me.grab_complete, "ACT2 accepted state skipped to the next action.");
  await Promise.all([1, 2].map(i => rpc("s3b_submit_first_meeting", { ...auth(f, i), p_choice_id: "library" })));
  await Promise.all([0, 1, 2].map(i => rpc("s3b_grab", auth(f, i))));

  await rpc("s3b_leave_start_room", auth(f, 0));
  reconnect = await rpc("s3b_get_player_state", auth(f, 0));
  assert(reconnect.me.left_start_room && reconnect.scene.phase_key === "private_first_meeting", `ACT2 leave acceptance did not survive reconnect at the peer barrier: ${JSON.stringify({ me: reconnect.me, scene: reconnect.scene })}`);
  await Promise.all([1, 2].map(i => rpc("s3b_leave_start_room", auth(f, i))));
  await oldVote(f, ["library", "library", "library"]);

  await rpc("s3b_ack_route_update", auth(f, 0));
  reconnect = await rpc("s3b_get_player_state", auth(f, 0));
  assert(reconnect.me.route_update_ack_at && reconnect.scene.phase_key === "route_update", "ACT2 route acknowledgement did not survive reconnect at the peer barrier.");
  await Promise.all([1, 2].map(i => rpc("s3b_ack_route_update", auth(f, i))));
  await rpc("s3b_complete_foldback", auth(f, 0));

  await rpc("s3b_follow_sign", auth(f, 0));
  reconnect = await rpc("s3b_get_player_state", auth(f, 0));
  assert(reconnect.me.player_location === "library" && reconnect.scene.phase_key === "wayfinding", "ACT3 reunion acceptance did not survive reconnect at the peer barrier.");
  await Promise.all([1, 2].map(i => rpc("s3b_follow_sign", auth(f, i))));
  await rpc("s3b_submit_library_code", { ...auth(f, 0), p_client_request_id: crypto.randomUUID(), p_code: "41739" });

  await rpc("s3b_submit_act4_choice", { ...auth(f, 0), p_choice_id: "known" });
  reconnect = await rpc("s3b_get_player_state", auth(f, 0));
  assert(reconnect.me.act4_locked_at && reconnect.scene.scene_id === "act4_known_unknown", "ACT4 private choice did not survive reconnect at the peer barrier.");
  assert(!JSON.stringify(reconnect).includes('"choice_id":"unknown"'), "ACT4 reconnect disclosed a peer private choice.");
  await Promise.all([1, 2].map(i => rpc("s3b_submit_act4_choice", { ...auth(f, i), p_choice_id: "known" })));
  await rpc("s5_initialize", { p_room_code: f.room, p_teacher_token: f.teacher });
  const handoffs = await Promise.all([0, 1, 2].map(i => rpc("s3b_get_player_state", auth(f, i))));
  for (let i = 0; i < 3; i++) {
    await rpc("s9_observe_act5_handoff", { ...auth(f, i), p_expected_run_id: handoffs[i].run_id });
    await rpc("s9_enter_act6", { ...auth(f, i), p_expected_run_id: handoffs[i].run_id });
  }
}

async function completeSprint5ToAct9(f) {
  await vote(f, ["escape", "1897", "trapped"]);
  await vote(f, ["escape", "1897", "trapped"]);
  await rpc("s5_advance", auth(f, 0));
  await vote(f, ["clock_c", "clock_c", "clock_b"]);
  await rpc("s5_advance", auth(f, 0));

  await rpc("s5_submit_private_choice", { ...auth(f, 0), p_client_request_id: crypto.randomUUID(), p_choice_id: "main_gate" });
  let reconnect = await state(f, 0);
  assert(reconnect.state.phase_key === "act8_private" && reconnect.my_private_choice?.choice_id === "main_gate", "ACT8 private choice did not survive reconnect.");
  assert(reconnect.private_choices_revealed.length === 0, "ACT8 disclosed private choices before the barrier completed.");
  for (const [i, choice] of [[1, "west_tower"], [2, "compare"]]) {
    await rpc("s5_submit_private_choice", { ...auth(f, i), p_client_request_id: crypto.randomUUID(), p_choice_id: choice });
  }
  await vote(f, ["west_tower", "west_tower", "main_gate"]);
  await rpc("s5_advance", auth(f, 0));
  const s = await s6state(f);
  assert(s.active && s.state.phase_key === "act9_discussion", "ACT8 did not reach ACT9.");
}

async function closeDiscussion(f) {
  const s = await s6state(f);
  await rpc("s6_close_discussion_v2", {
    ...auth(f, 0), ...s6id(s),
    p_expected_discussion_session_id: s.discussion.discussion_session_id,
    p_client_request_id: crypto.randomUUID(),
  });
}

async function submitAndAssertChoiceBarrier(f, rpcName, choices) {
  const s = await s6state(f);
  await rpc(rpcName, { ...auth(f, 0), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_choice_id: choices[0] });
  const mine = await waitState(f, 0);
  const peer = await waitState(f, 1);
  assert(mine.active && mine.my_choice_locked && mine.submitted_count === 1, `${s.state.phase_key} did not project the current player's accepted choice.`);
  assert(!peer.my_choice_locked && peer.submitted_count === 1, `${s.state.phase_key} projected a peer choice as the current player's choice.`);
  assert(!("choice_id" in mine) && !JSON.stringify(mine).includes(choices[0]), `${s.state.phase_key} wait projection disclosed private choice content.`);
  for (let i = 1; i < 3; i++) {
    await rpc(rpcName, { ...auth(f, i), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_choice_id: choices[i] });
  }
}

async function completeSprint6Barriers(f) {
  await closeDiscussion(f);
  for (const choice of ["red", "do_not_enter", "blue"]) {
    await submitAndAssertChoiceBarrier(f, "s6_submit_group_choice_v2", [choice, choice, choice]);
  }
  await submitAndAssertChoiceBarrier(f, "s6_submit_group_choice_v2", ["enter_blue", "enter_blue", "enter_blue"]);
  await submitAndAssertChoiceBarrier(f, "s6_submit_private_choice_v2", ["take", "leave", "leave"]);
  await closeDiscussion(f);
  await submitAndAssertChoiceBarrier(f, "s6_submit_group_choice_v2", ["take", "take", "take"]);

  let s = await s6state(f);
  await rpc("s6_advance_v2", { ...auth(f, 0), ...s6id(s), p_client_request_id: crypto.randomUUID() });
  await closeDiscussion(f);
  s = await s6state(f);
  const roles = ["A", "B", "WATCHER"];
  await rpc("s6_submit_allocation_v2", { ...auth(f, 0), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_role_key: roles[0] });
  let mine = await waitState(f, 0);
  let peer = await waitState(f, 1);
  assert(mine.my_allocation_locked && mine.my_role_key === "A" && mine.submitted_count === 1, "ACT11 allocation acceptance did not survive reconnect.");
  assert(!peer.my_allocation_locked && peer.my_role_key === null && peer.submitted_count === 1, "ACT11 allocation projection disclosed a peer role.");
  for (let i = 1; i < 3; i++) await rpc("s6_submit_allocation_v2", { ...auth(f, i), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_role_key: roles[i] });

  s = await s6state(f);
  await rpc("s6_complete_station_v2", { ...auth(f, 0), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_task_value: "1897" });
  await rpc("s6_engage_v2", { ...auth(f, 0), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_role_key: "A" });
  mine = await waitState(f, 0);
  peer = await waitState(f, 1);
  assert(mine.my_engaged && mine.engaged_count === 1, "ACT12 ENGAGE acceptance did not survive reconnect.");
  assert(!peer.my_engaged && peer.engaged_count === 1, "ACT12 ENGAGE projection attributed a peer engagement to the current player.");
}

async function main() {
  const f = await fixture();
  await completeEarlyActs(f);
  await completeSprint5ToAct9(f);
  await completeSprint6Barriers(f);
  console.log(JSON.stringify({ room: f.room, package: "B", reconnectBarriers: "PASS" }));
  console.log("Structural Package B live E2E passed.");
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
