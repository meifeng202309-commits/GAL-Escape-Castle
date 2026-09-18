const SUPABASE_URL = "https://qdcbdcjobzytzhnhfwyn.supabase.co";
const SUPABASE_KEY = "sb_publishable_h5mCF6rkaYWw12ssP4-1NA_KzzPJOwY";

const results = [];
const options3 = [
  { id: "known", label: "Take the known route" },
  { id: "unknown", label: "Try the unknown passage" },
  { id: "inspect", label: "Inspect before deciding" },
];
const options2 = options3.slice(0, 2);

function unique(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pass(name, detail = "") {
  results.push({ result: "PASS", name, detail });
}

async function rpc(name, payload) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(body?.message || body?.details || text || `HTTP ${response.status}`);
  return body;
}

async function expectReject(name, action, expected) {
  try {
    await action();
    throw new Error("Expected request to fail, but it succeeded.");
  } catch (error) {
    assert(String(error.message).includes(expected), `Unexpected rejection: ${error.message}`);
    pass(name, error.message);
  }
}

async function createFixture(runMode = "normal") {
  const room = unique("S2").slice(0, 14);
  const teacher = unique("T");
  const joins = [unique("G"), unique("A"), unique("L")];
  await rpc("s1_create_room", {
    p_room_code: room,
    p_teacher_token: teacher,
    p_gitte_join_code: joins[0],
    p_anna_join_code: joins[1],
    p_linda_join_code: joins[2],
  });
  const players = await Promise.all(joins.map((code) => rpc("s1_join_player", {
    p_room_code: room,
    p_join_code: code,
  })));
  await Promise.all([
    rpc("s1_submit_private_choice", { p_room_code: room, p_session_token: players[0].session_token, p_choice_id: "map", p_choice_label: "ignored" }),
    rpc("s1_submit_private_choice", { p_room_code: room, p_session_token: players[1].session_token, p_choice_id: "keys", p_choice_label: "ignored" }),
    rpc("s1_submit_private_choice", { p_room_code: room, p_session_token: players[2].session_token, p_choice_id: "door", p_choice_label: "ignored" }),
  ]);
  const run = await rpc("s2_start_run", {
    p_room_code: room,
    p_teacher_token: teacher,
    p_run_mode: runMode,
  });
  return { room, teacher, players, run };
}

async function openDiscussion(fixture, overrides = {}) {
  return rpc("s2_open_discussion", {
    p_room_code: fixture.room,
    p_teacher_token: fixture.teacher,
    p_topic: overrides.topic || "Generic route discussion",
    p_discussion_time_limit_sec: overrides.discussionSeconds || 300,
    p_vote_time_limit_sec: overrides.voteSeconds || 300,
    p_show_initial_choices: overrides.showInitial ?? true,
    p_require_final_vote: overrides.requireVote ?? true,
    p_vote_options: overrides.options || options3,
    p_tie_policy: overrides.tiePolicy || "REPEAT_UNTIL_MAJORITY",
    p_revote_window_sec: overrides.revoteSeconds || 30,
    p_max_revotes: overrides.maxRevotes ?? 0,
    p_fallback_resolution: overrides.fallback || null,
    p_silent_texting_mode: overrides.silent ?? true,
  });
}

function playerState(fixture, index) {
  return rpc("s2_get_player_state", {
    p_room_code: fixture.room,
    p_session_token: fixture.players[index].session_token,
  });
}

function teacherState(fixture) {
  return rpc("s2_get_teacher_state", {
    p_room_code: fixture.room,
    p_teacher_token: fixture.teacher,
  });
}

async function openVote(fixture) {
  return rpc("s2_open_vote", { p_room_code: fixture.room, p_teacher_token: fixture.teacher });
}

async function vote(fixture, playerIndex, choiceId) {
  return rpc("s2_submit_vote", {
    p_room_code: fixture.room,
    p_session_token: fixture.players[playerIndex].session_token,
    p_choice_id: choiceId,
  });
}

async function sendMessage(fixture, playerIndex, messageText) {
  return rpc("s2_send_message", {
    p_room_code: fixture.room,
    p_session_token: fixture.players[playerIndex].session_token,
    p_message_text: messageText,
  });
}

async function submitThreeWayTie(fixture) {
  await vote(fixture, 0, "known");
  await vote(fixture, 1, "unknown");
  return vote(fixture, 2, "inspect");
}

async function testChatPrivacyAndThreeZero() {
  const f = await createFixture("normal");
  assert(/^[0-9a-f-]{36}$/i.test(f.run.run_id), "run_id was not server-generated UUID.");
  assert(f.run.run_mode === "normal" && f.run.behavior_dataset_eligible === true, "NORMAL metadata incorrect.");
  pass("A1 server creates NORMAL run metadata", f.run.run_id);

  await expectReject("A2 active run mode cannot be replaced", () => rpc("s2_start_run", {
    p_room_code: f.room, p_teacher_token: f.teacher, p_run_mode: "audit",
  }), "already has an active formal run");

  const opened = await openDiscussion(f);
  const states = await Promise.all([playerState(f, 0), playerState(f, 1), playerState(f, 2)]);
  assert(states.every((state) => state.discussion.discussion_session_id === opened.discussion_session_id), "Players did not share one discussion session.");
  assert(states.every((state) => state.initial_choices.length === 3), "Configured initial choices were not revealed.");
  assert(states.every((state) => state.run.silent_texting_mode === true), "silent_texting_mode was not persisted.");
  pass("A3 shared session, initial reveal, and silent mode restore", opened.discussion_session_id);

  for (let index = 0; index < 3; index += 1) {
    await rpc("s2_send_message", {
      p_room_code: f.room,
      p_session_token: f.players[index].session_token,
      p_message_text: `message-${index + 1}`,
    });
  }
  const chatState = await playerState(f, 1);
  assert(chatState.messages.length === 3, "Transcript did not persist all three messages.");
  assert(chatState.messages.map((item) => item.message_text).join(",") === "message-1,message-2,message-3", "Transcript order is incorrect.");
  assert(chatState.messages.every((item) => item.created_at), "Messages lack server timestamps.");
  pass("A4 three-player chat persists in server order", "3 messages");

  const reconnect = await playerState(f, 1);
  assert(reconnect.run.run_id === f.run.run_id && reconnect.messages.length === 3, "Reconnect did not restore run/transcript.");
  pass("A5 reconnect restores DiscussionRoom state", reconnect.run.run_id);

  const observed = await teacherState(f);
  assert(observed.messages.length === 3 && observed.current_votes.length === 3, "Teacher observation is incomplete.");
  pass("A6 teacher observes transcript and all player slots");

  await openVote(f);
  await vote(f, 0, "known");
  const beforeRevealTeacher = await teacherState(f);
  const submitted = beforeRevealTeacher.current_votes.find((item) => item.player_id === f.players[0].player_id);
  assert(submitted.submitted === true && submitted.choice_id === undefined, "Teacher saw a private vote before reveal.");
  const otherPlayer = await playerState(f, 1);
  assert(otherPlayer.my_vote == null && otherPlayer.revealed_votes.length === 0, "Another player saw a private vote before reveal.");
  pass("A7 pre-vote privacy holds for teacher and other players");

  await expectReject("A8 duplicate vote is rejected", () => vote(f, 0, "unknown"), "already locked");
  await vote(f, 1, "known");
  const result = await vote(f, 2, "known");
  assert(result.status === "resolved" && result.votes === 3, "3:0 did not resolve.");
  const resolved = await playerState(f, 2);
  assert(resolved.revealed_votes.length === 3 && resolved.discussion.outcome.votes === 3, "3:0 reveal is incomplete.");
  pass("A9 3:0 vote resolves and reveals", "known 3/3");
}

async function testTwoOne() {
  const f = await createFixture();
  await openDiscussion(f, { options: options2, tiePolicy: "NO_TIE_POSSIBLE", silent: false });
  await openVote(f);
  await vote(f, 0, "known");
  await vote(f, 1, "known");
  const result = await vote(f, 2, "unknown");
  assert(result.status === "resolved" && result.votes === 2 && result.choice_id === "known", "2:1 majority incorrect.");
  pass("B1 2:1 vote resolves to majority", "known 2/3");
}

async function testTieAndRevote() {
  const f = await createFixture();
  const first = await openDiscussion(f, { revoteSeconds: 30 });
  await openVote(f);
  await vote(f, 0, "known");
  await vote(f, 1, "unknown");
  const tie = await vote(f, 2, "inspect");
  assert(tie.resolution === "no_consensus" && tie.vote_round === 2, "1:1:1 did not create vote round 2.");
  assert(tie.discussion_session_id !== first.discussion_session_id, "Re-vote reused discussion_session_id.");
  const afterTie = await playerState(f, 0);
  assert(afterTie.discussion.status === "discussion" && afterTie.discussion.vote_round === 2, "Re-vote discussion is not open.");
  assert(afterTie.vote_history[0].outcome.type === "no_consensus", "No-consensus history was not retained.");
  assert(afterTie.submitted_vote_count === 0 && afterTie.my_vote == null, "Old votes leaked into the new round.");
  pass("C1 1:1:1 creates a new discussion session and vote round", tie.discussion_session_id);

  await rpc("s2_send_message", {
    p_room_code: f.room,
    p_session_token: f.players[2].session_token,
    p_message_text: "Let us reconsider.",
  });
  await openVote(f);
  await vote(f, 0, "inspect");
  await vote(f, 1, "inspect");
  const result = await vote(f, 2, "known");
  assert(result.status === "resolved" && result.choice_id === "inspect" && result.votes === 2, "Repeated re-vote did not resolve 2:1.");
  pass("C2 repeated re-vote resolves without overwriting round 1", "round 2, inspect 2/3");
}

async function testDeadlineAndAudit() {
  const f = await createFixture("audit");
  assert(f.run.run_mode === "audit" && f.run.behavior_dataset_eligible === false, "AUDIT metadata incorrect.");
  pass("D1 AUDIT run is persisted and dataset-ineligible");
  await openDiscussion(f, { options: options2, tiePolicy: "NO_TIE_POSSIBLE", discussionSeconds: 5, voteSeconds: 5, silent: false });
  await openVote(f);
  await vote(f, 0, "known");
  let slowState = await teacherState(f);
  assert(slowState.current_votes.filter((item) => item.submitted).length === 1, "Slow-player state did not preserve one submitted vote.");
  pass("D2 one slow player leaves vote pending", "1/3 submitted");
  await new Promise((resolve) => setTimeout(resolve, 5600));
  slowState = await teacherState(f);
  assert(slowState.discussion.status === "waiting_for_missing_player", "Deadline did not enter WAITING_FOR_MISSING_PLAYER.");
  assert(slowState.current_votes.filter((item) => item.submitted).length === 1, "Deadline synthesized missing votes.");
  pass("D3 server deadline waits without synthesizing input");
  await rpc("s2_add_time", { p_room_code: f.room, p_teacher_token: f.teacher, p_seconds: 30 });
  const resumed = await playerState(f, 1);
  assert(resumed.discussion.status === "voting" && resumed.discussion.phase_deadline, "Teacher Add 30 sec did not resume voting.");
  pass("D4 teacher adds time and reconnect restores voting");
}

async function testSingleRevoteFallbackAndIsolation() {
  const f = await createFixture();

  const act2 = await openDiscussion(f, {
    topic: "ACT2-style meeting vote",
    tiePolicy: "SINGLE_REVOTE_THEN_FALLBACK",
    maxRevotes: 1,
    fallback: "known",
  });
  await sendMessage(f, 0, "ACT2 transcript marker");
  await openVote(f);
  const act2Tie = await submitThreeWayTie(f);
  let state = await playerState(f, 0);
  assert(act2Tie.status === "discussion" && state.discussion.round_no === 2, "ACT2-style tie did not open exactly one local re-vote.");
  assert(state.messages.length === 0, "Re-vote current transcript accidentally inherited the previous session transcript.");
  await openVote(f);
  const act2Fallback = await submitThreeWayTie(f);
  assert(act2Fallback.resolution === "fallback" && act2Fallback.choice_id === "known", "ACT2-style option fallback did not resolve after one re-vote.");
  pass("E1 ACT2-style tie allows one re-vote then option fallback", act2.discussion_session_id);

  const act6 = await openDiscussion(f, {
    topic: "ACT6 portrait question",
    tiePolicy: "SINGLE_REVOTE_THEN_FALLBACK",
    maxRevotes: 1,
    fallback: "portrait_fixed_fallback",
  });
  state = await playerState(f, 1);
  assert(state.discussion.round_no === 1, "Second independent discussion did not reset local round_no to 1.");
  assert(state.discussion.vote_round > 2, "Second independent discussion did not keep a distinct run-wide vote_round.");
  assert(state.messages.length === 0, "Independent discussion current transcript contains earlier messages.");
  await sendMessage(f, 1, "ACT6 transcript marker");
  const teacher = await teacherState(f);
  assert(teacher.messages.length === 1 && teacher.messages[0].message_text === "ACT6 transcript marker", "Teacher current transcript is not isolated to ACT6.");
  assert(teacher.message_history.some((item) => item.message_text === "ACT2 transcript marker"), "Earlier transcript was not preserved in teacher audit history.");
  pass("E2 sequential discussion resets local round and isolates transcript", act6.discussion_session_id);

  await openVote(f);
  const act6Tie = await submitThreeWayTie(f);
  state = await playerState(f, 2);
  assert(act6Tie.status === "discussion" && state.discussion.round_no === 2, "ACT6 first tie skipped its allowed re-vote.");
  await openVote(f);
  const act6Fallback = await submitThreeWayTie(f);
  assert(act6Fallback.resolution === "fallback" && act6Fallback.choice_id === "portrait_fixed_fallback", "ACT6 non-option fallback failed.");
  pass("E3 ACT6 supports a non-option fallback after exactly one re-vote");

  const act5Fixture = await createFixture();
  await openDiscussion(act5Fixture, {
    topic: "ACT5-style route vote",
    tiePolicy: "SINGLE_REVOTE_THEN_FALLBACK",
    maxRevotes: 1,
    fallback: "inspect",
  });
  await openVote(act5Fixture);
  await submitThreeWayTie(act5Fixture);
  await openVote(act5Fixture);
  const act5Fallback = await submitThreeWayTie(act5Fixture);
  assert(act5Fallback.resolution === "fallback" && act5Fallback.choice_id === "inspect", "ACT5-style fallback failed.");
  pass("E4 ACT5-style option fallback resolves after one re-vote");

  const invalidFixture = await createFixture();
  await openDiscussion(invalidFixture);
  await openVote(invalidFixture);
  await expectReject("E5 invalid choice_id is rejected", () => vote(invalidFixture, 0, "not_configured"), "Invalid vote option");
}

async function testRls() {
  for (const table of ["game_runs", "discussion_sessions", "dialogue_messages", "runtime_player_decisions", "runtime_events"]) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    const rows = await response.json();
    assert(response.ok && Array.isArray(rows) && rows.length === 0, `Anonymous direct read exposed ${table}.`);
  }
  pass("F1 Sprint 2 tables are hidden from anonymous direct reads", "5 tables");

  const response = await fetch(`${SUPABASE_URL}/rest/v1/dialogue_messages`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ message_text: "anonymous direct write must fail" }),
  });
  assert(!response.ok, "Anonymous direct write unexpectedly succeeded.");
  pass("F2 anonymous direct table write is rejected", `HTTP ${response.status}`);
}

async function main() {
  await testChatPrivacyAndThreeZero();
  await testTwoOne();
  await testTieAndRevote();
  await testDeadlineAndAudit();
  await testSingleRevoteFallbackAndIsolation();
  await testRls();

  for (const item of results) console.log(`PASS ${item.name}${item.detail ? ` — ${item.detail}` : ""}`);
  console.log(`Sprint 2 live E2E passed: ${results.length} checks.`);
}

main().catch((error) => {
  for (const item of results) console.log(`PASS ${item.name}${item.detail ? ` — ${item.detail}` : ""}`);
  console.error(`FAIL ${error.stack || error.message}`);
  process.exitCode = 1;
});
