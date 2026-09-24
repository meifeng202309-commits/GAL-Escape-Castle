const crypto = require("crypto");
const { rpc, assert, id, auth, oldVote, state, s6state, s6id, s6group, s6private } = require("./sprint5-live-e2e");

async function fixture() {
  const room = id("L3");
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
  const f = { room, teacher, players };
  await rpc("s2_start_run", { p_room_code: room, p_teacher_token: teacher, p_run_mode: "normal" });
  await rpc("s3b_initialize_flow", { p_room_code: room, p_teacher_token: teacher });
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
  await Promise.all([0, 1, 2].map(i => rpc("s3b_submit_act4_choice", { ...auth(f, i), p_choice_id: "known" })));
  return f;
}

async function expireByPoll(f, expectedPhase) {
  const before = await s6state(f);
  assert(before.state.phase_key === expectedPhase && before.discussion, `${expectedPhase} was not open`);
  await rpc("s6_verify_expire_discussion", {
    p_room_code: f.room,
    p_teacher_token: f.teacher,
    p_expected_discussion_session_id: before.discussion.discussion_session_id,
  });
  const after = await s6state(f, 1);
  const expectedNext = { act9_discussion: "act9_console", act10_discussion: "act10_final_vote", act11_discussion: "act11_allocation" }[expectedPhase];
  assert(after.state.phase_key === expectedNext && !after.discussion, `${expectedPhase} poll did not converge atomically`);
  const reconnect = await s6state(f, 2);
  assert(reconnect.state.phase_key === expectedNext && !reconnect.discussion, `${expectedPhase} reconnect diverged`);
}

async function voteNormal(f, choices) {
  const before = await rpc("s5_get_discussion_state", auth(f, 0));
  assert(before.discussion?.status === "discussion", "NORMAL Sprint5 discussion was not open");
  await rpc("s5_verify_expire_discussion", {
    p_room_code: f.room,
    p_teacher_token: f.teacher,
    p_expected_discussion_session_id: before.discussion.discussion_session_id,
  });
  const voting = await rpc("s5_get_discussion_state", auth(f, 1));
  assert(voting.discussion.status === "voting", "NORMAL Sprint5 deadline did not open voting");
  for (let i = 0; i < 3; i++) {
    await rpc("s5_submit_vote", {
      ...auth(f, i),
      p_expected_discussion_session_id: voting.discussion.discussion_session_id,
      p_expected_vote_round: voting.discussion.vote_round,
      p_client_request_id: crypto.randomUUID(),
      p_choice_id: choices[i],
    });
  }
}

async function completeSprint5(f) {
  let s = await state(f);
  assert(s.state.phase_key === "act6_vote" && s.discussion, "ACT5→6 automatic entry failed");
  const reconnect = await state(f, 2);
  assert(reconnect.discussion.discussion_session_id === s.discussion.discussion_session_id, "ACT6 reconnect created a second discussion");
  await voteNormal(f, ["escape", "1897", "trapped"]);
  await voteNormal(f, ["escape", "1897", "trapped"]);
  await rpc("s5_advance", auth(f, 0));
  await voteNormal(f, ["clock_c", "clock_c", "clock_b"]);
  await rpc("s5_advance", auth(f, 0));
  for (const [i, choice] of ["main_gate", "west_tower", "compare"].entries()) {
    await rpc("s5_submit_private_choice", { ...auth(f, i), p_client_request_id: crypto.randomUUID(), p_choice_id: choice });
  }
  await voteNormal(f, ["west_tower", "west_tower", "main_gate"]);
  await rpc("s5_advance", auth(f, 0));
  s = await s6state(f);
  assert(s.active && s.state.phase_key === "act9_discussion", "ACT8→9 automatic entry failed");
  const sReconnect = await s6state(f, 2);
  assert(sReconnect.discussion.discussion_session_id === s.discussion.discussion_session_id, "ACT9 reconnect created a second discussion");
}

async function completeSprint6(f) {
  await expireByPoll(f, "act9_discussion");
  for (const choice of ["red", "do_not_enter", "blue", "enter_blue"]) await s6group(f, [choice, choice, choice]);
  let s = await s6state(f);
  for (let i = 0; i < 3; i++) await rpc("s6_submit_private_choice_v2", { ...auth(f, i), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_choice_id: "take" });
  await expireByPoll(f, "act10_discussion");
  await s6group(f, ["take", "take", "take"]);
  s = await s6state(f);
  const alarmOccurrence = s.audio_occurrence_id;
  assert(alarmOccurrence && !s.audio_consumed, "ACT10 audio occurrence was not durable");
  await rpc("s6_mark_audio_consumed", { ...auth(f, 0), p_occurrence_id: alarmOccurrence, p_outcome: "ended" });
  const consumedReconnect = await s6state(f);
  assert(consumedReconnect.audio_consumed && consumedReconnect.audio_occurrence_id === alarmOccurrence, "Consumed audio replay suppression did not survive reconnect");
  await rpc("s6_advance_v2", { ...auth(f, 0), ...s6id(s), p_client_request_id: crypto.randomUUID() });
  await expireByPoll(f, "act11_discussion");
  s = await s6state(f);
  for (const [i, role] of ["A", "B", "WATCHER"].entries()) await rpc("s6_submit_allocation_v2", { ...auth(f, i), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_role_key: role });
  s = await s6state(f);
  await rpc("s6_complete_station_v2", { ...auth(f, 1), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_task_value: "lever_hold" });
  await new Promise(resolve => setTimeout(resolve, 1300));
  for (const [i, value] of ["1897", "lever_center", "corridor_watched"].entries()) await rpc("s6_complete_station_v2", { ...auth(f, i), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_task_value: value });
  for (const [i, role] of ["A", "B", "WATCHER"].entries()) await rpc("s6_engage_v2", { ...auth(f, i), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_role_key: role });
  s = await s6state(f);
  await s6private(f, ["A", "B", "WATCHER"].map(role => role === s.state.mechanism_failure_station ? "one" : "hold"));
  const observedOccurrences = new Set([alarmOccurrence]);
  for (let i = 0; i < 18; i++) {
    await new Promise(resolve => setTimeout(resolve, 1100));
    s = await s6state(f);
    if (s.audio_occurrence_id) observedOccurrences.add(s.audio_occurrence_id);
    if (s.state.act_no === 13) break;
  }
  assert(s.state.act_no === 13, "Cinematic did not reach ACT13");
  const newOccurrence = [...observedOccurrences].find(occurrence => occurrence !== alarmOccurrence);
  assert(newOccurrence, "A genuinely new audio occurrence was suppressed");
  await rpc("s6_mark_audio_consumed", { ...auth(f, 0), p_occurrence_id: newOccurrence, p_outcome: "ended" });
}

async function main() {
  const f = await fixture();
  await completeSprint5(f);
  await completeSprint6(f);
  const timeline = await rpc("act6_13_get_timeline", { p_room_code: f.room, p_teacher_token: f.teacher });
  const types = new Set(timeline.map(event => event.event_type));
  assert(types.has("phase_transition") && types.has("discussion_deadline_advanced") && types.has("audio_triggered") && types.has("audio_consumed"), "Post-run timeline is incomplete");
  assert(timeline.every((event, i) => i === 0 || event.event_id > timeline[i - 1].event_id), "Timeline ordering is not monotonic");
  assert(timeline.some(event => event.details?.cinematic_stage >= 2), "Cinematic history was not retained after advancement");
  console.log(JSON.stringify({ room: f.room, events: timeline.length, eventTypes: [...types].sort() }));
  console.log("Level 3 IDA-001/002/004/005 live closure E2E passed.");
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
