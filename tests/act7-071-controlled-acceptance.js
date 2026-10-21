const { rpc, assert, auth, fixture, state, vote } = require("./sprint5-live-e2e");
const readline = require("node:readline/promises");
const { assertSourceGateProofs, probeSupabaseNetwork } = require("../scripts/act7-071-source-gates");

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
let evidenceInput;
function assertExecutionAuthorized(env = process.env) {
  if (env.ACT7_071_PRODUCTION_AUTHORIZED !== "YES") {
    throw new Error("Controlled production acceptance is disabled without a separate ACT7_071_PRODUCTION_AUTHORIZED=YES gate");
  }
  if (env.ACT7_071_EVIDENCE_PAUSE !== "YES") {
    throw new Error("Controlled production acceptance is disabled without ACT7_071_EVIDENCE_PAUSE=YES");
  }
  if (!env.ACT7_071_PREFREEZE_SNAPSHOT) throw new Error("Controlled production acceptance requires ACT7_071_PREFREEZE_SNAPSHOT");
  if (!env.ACT7_071_CANDIDATE_PROOF) throw new Error("Controlled production acceptance requires ACT7_071_CANDIDATE_PROOF");
  if (!env.ACT7_071_NETWORK_PROBE_OUTPUT) throw new Error("Controlled production acceptance requires ACT7_071_NETWORK_PROBE_OUTPUT");
  if (!env.ACT7_071_EXECUTION_CONTEXT_ID) throw new Error("Controlled production acceptance requires ACT7_071_EXECUTION_CONTEXT_ID");
}
async function evidenceBoundary(label, fixtureState, discussion) {
  if (process.env.ACT7_071_EVIDENCE_PAUSE !== "YES") {
    throw new Error("SQL evidence boundaries require ACT7_071_EVIDENCE_PAUSE=YES");
  }
  const projection = await teacherState(fixtureState);
  const identity = discussion || projection.discussion;
  console.log(JSON.stringify({
    type: "ACT7_071_EVIDENCE_BOUNDARY",
    label,
    run_id: projection.run.run_id,
    room_code: fixtureState.room,
    discussion_session_id: identity.discussion_session_id,
    phase_key: identity.phase_key,
    vote_round: identity.vote_round,
  }));
  evidenceInput ||= readline.createInterface({ input: process.stdin, output: process.stdout });
  await evidenceInput.question(`Save the ${label} SQL snapshot, then press Enter to continue: `);
}
const teacherState = fixtureState => rpc("s5_get_teacher_discussion_state", {
  p_room_code: fixtureState.room,
  p_teacher_token: fixtureState.teacher,
});

async function enterAct6Barrier(fixtureState) {
  const handoffs = await Promise.all([0, 1, 2].map(index => rpc("s3b_get_player_state", auth(fixtureState, index))));
  const prepared = await rpc("s5_get_discussion_state", auth(fixtureState, 0));
  assert(prepared.active && prepared.discussion === null, "ACT6 discussion started before the entry barrier");

  for (let index = 0; index < 3; index++) {
    await rpc("s9_observe_act5_handoff", {
      ...auth(fixtureState, index),
      p_expected_run_id: handoffs[index].run_id,
    });
    const entered = await rpc("s9_enter_act6", {
      ...auth(fixtureState, index),
      p_expected_run_id: handoffs[index].run_id,
    });
    assert(entered.entered_players === index + 1, `ACT6 entry count did not reach ${index + 1}`);
    const current = await rpc("s5_get_discussion_state", auth(fixtureState, 0));
    if (index < 2) assert(current.discussion === null, `ACT6 discussion started with only ${index + 1} entrants`);
    else assert(current.discussion?.vote_round === 1, "Third entrant did not create ACT6 round 1");
  }

  const created = await rpc("s5_get_discussion_state", auth(fixtureState, 0));
  const identity = created.discussion.discussion_session_id;
  const deadline = created.discussion.phase_deadline;
  await rpc("s9_enter_act6", { ...auth(fixtureState, 2), p_expected_run_id: handoffs[2].run_id });
  const replay = await rpc("s5_get_discussion_state", auth(fixtureState, 0));
  assert(replay.discussion.discussion_session_id === identity && replay.discussion.phase_deadline === deadline,
    "Repeated ACT6 entry recreated or restarted the canonical discussion");
  const full = await state(fixtureState);
  assert(full.state.phase_key === "act6_vote" && full.canonical_discussion?.discussion_session_id === identity,
    "Player state lost the canonical ACT6 phase or discussion identity");
  return { projection: created.discussion, canonical: full.canonical_discussion };
}

async function openVote(fixtureState) {
  const teacher = await teacherState(fixtureState);
  const discussion = teacher.discussion;
  assert(teacher.sprint5_active && discussion?.status === "discussion", "Current Sprint 5 discussion is not open");
  const payload = {
    p_room_code: fixtureState.room,
    p_teacher_token: fixtureState.teacher,
    p_expected_run_id: teacher.run.run_id,
    p_expected_phase: discussion.phase_key,
    p_expected_vote_round: discussion.vote_round,
    p_expected_discussion_session_id: discussion.discussion_session_id,
  };
  return { payload, result: await rpc("s5_teacher_open_vote", payload) };
}

async function submitVote(fixtureState, opened, playerIndex, choice) {
  return rpc("s5_submit_vote", {
    ...auth(fixtureState, playerIndex),
    p_expected_discussion_session_id: opened.result.discussion_session_id,
    p_expected_vote_round: opened.result.vote_round,
    p_client_request_id: crypto.randomUUID(),
    p_choice_id: choice,
  });
}

async function submitThree(fixtureState, opened, choices) {
  for (let index = 0; index < 3; index++) await submitVote(fixtureState, opened, index, choices[index]);
}

async function finishAct6(fixtureState) {
  let opened = await openVote(fixtureState);
  assert(opened.result.phase_key === "act6_vote" && opened.result.vote_round === 1, "ACT6 round 1 identity mismatch");
  await submitThree(fixtureState, opened, ["escape", "1897", "trapped"]);
  opened = await openVote(fixtureState);
  assert(opened.result.vote_round === 2, "ACT6 round 2 identity mismatch");
  await submitThree(fixtureState, opened, ["escape", "1897", "trapped"]);
  const current = await state(fixtureState);
  assert(current.state.phase_key === "act6_answer", "ACT6 fallback did not complete");
  await rpc("s5_advance", auth(fixtureState, 0));
}

async function runNormalScenario() {
  const fixtureState = await fixture("normal");
  const act6 = await enterAct6Barrier(fixtureState);
  assert(act6.canonical.discussion_time_limit_sec === 10800 && act6.canonical.vote_time_limit_sec === 10800,
    "NORMAL ACT6 timing is not 10800/10800");
  await finishAct6(fixtureState);

  let opened = await openVote(fixtureState);
  assert(opened.result.phase_key === "act7_vote" && opened.result.vote_round === 1, "ACT7 round 1 identity mismatch");
  await submitThree(fixtureState, opened, ["clock_a", "clock_b", "clock_c"]);

  opened = await openVote(fixtureState);
  assert(opened.result.phase_key === "act7_vote" && opened.result.vote_round === 2, "ACT7 round 2 identity mismatch");
  assert(opened.result.phase_deadline === null, "NORMAL ACT7 vote retained an automatic deadline");
  await evidenceBoundary("ROUND2_OPEN", fixtureState, opened.result);
  await submitVote(fixtureState, opened, 0, "clock_a");
  await submitVote(fixtureState, opened, 1, "clock_a");
  await evidenceBoundary("TWO_VOTES", fixtureState, opened.result);
  await sleep(61000);
  const lateTeacher = await teacherState(fixtureState);
  const latePlayer = await rpc("s5_get_discussion_state", auth(fixtureState, 2));
  assert(lateTeacher.discussion.status === "voting", "ACT7 entered a timeout state after the former 60-second boundary");
  assert(lateTeacher.current_votes.filter(vote => vote.submitted).length === 2, "Two genuine votes were not retained");
  assert(latePlayer.discussion.status === "voting" && latePlayer.discussion.vote_options.length === 3,
    "Third Player lost Clock A/B/C controls");
  await evidenceBoundary("AFTER_61S", fixtureState, opened.result);
  await submitVote(fixtureState, opened, 2, "clock_c");

  const nextRound = await teacherState(fixtureState);
  assert(nextRound.discussion.vote_round === 3 && nextRound.discussion.status === "discussion",
    "Third genuine vote did not create exactly one next round");
  await evidenceBoundary("THIRD_VOTE_RESOLVED", fixtureState, opened.result);
  await evidenceBoundary("BEFORE_STALE", fixtureState, nextRound.discussion);
  let rejected = false;
  try { await rpc("s5_teacher_open_vote", opened.payload); } catch { rejected = true; }
  assert(rejected, "Prior-round Open Vote payload was accepted");
  await evidenceBoundary("AFTER_STALE", fixtureState, nextRound.discussion);
  const beforeAdd = await teacherState(fixtureState);
  await evidenceBoundary("BEFORE_NORMAL_ADD", fixtureState, beforeAdd.discussion);
  const add = await rpc("s5_teacher_add_time", {
    p_room_code: fixtureState.room,
    p_teacher_token: fixtureState.teacher,
    p_seconds: 60,
  });
  const afterAdd = await teacherState(fixtureState);
  assert(add.applicable === false && add.reason === "NORMAL_TEACHER_PACED", "NORMAL Add Time was applicable");
  assert(JSON.stringify(afterAdd.discussion) === JSON.stringify(beforeAdd.discussion), "NORMAL Add Time mutated discussion state");
  await evidenceBoundary("AFTER_NORMAL_ADD", fixtureState, afterAdd.discussion);
  await evidenceBoundary("BEFORE_INVALID_TOKEN", fixtureState, nextRound.discussion);
  rejected = false;
  try {
    await rpc("s5_teacher_open_vote", {
      ...opened.payload,
      p_teacher_token: "INVALID",
      p_expected_vote_round: nextRound.discussion.vote_round,
      p_expected_discussion_session_id: nextRound.discussion.discussion_session_id,
    });
  } catch { rejected = true; }
  assert(rejected, "Invalid Teacher token opened voting");
  await evidenceBoundary("AFTER_INVALID_TOKEN", fixtureState, nextRound.discussion);

  opened = await openVote(fixtureState);
  await submitThree(fixtureState, opened, ["clock_c", "clock_c", "clock_b"]);
  let current = await state(fixtureState);
  assert(current.state.phase_key === "act7_solved", "ACT7 correct majority did not solve");
  await rpc("s5_advance", auth(fixtureState, 0));
  for (const [index, choice] of ["main_gate", "west_tower", "compare"].entries()) {
    await rpc("s5_submit_private_choice", {
      ...auth(fixtureState, index),
      p_client_request_id: crypto.randomUUID(),
      p_choice_id: choice,
    });
  }
  current = await state(fixtureState);
  assert(current.state.phase_key === "act8_final_vote", "ACT8 final vote did not initialize");
  assert(current.canonical_discussion.discussion_time_limit_sec === 10800 && current.canonical_discussion.vote_time_limit_sec === 10800,
    "NORMAL ACT8 timing is not 10800/10800");
  return { room: fixtureState.room, run_id: opened.result.run_id };
}

async function runAuditControl() {
  const fixtureState = await fixture("audit");
  const act6 = await enterAct6Barrier(fixtureState);
  assert(act6.canonical.discussion_time_limit_sec === 90 && act6.canonical.vote_time_limit_sec === 60,
    "AUDIT ACT6 timing changed");

  await vote(fixtureState, ["escape", "1897", "trapped"]);
  await vote(fixtureState, ["escape", "1897", "trapped"]);
  let current = await state(fixtureState);
  assert(current.state.phase_key === "act6_answer", "AUDIT ACT6 fallback did not complete");
  await rpc("s5_advance", auth(fixtureState, 0));
  current = await state(fixtureState);
  assert(current.state.phase_key === "act7_vote" && current.discussion.vote_round === 1,
    "AUDIT did not reach ACT7 round 1");
  assert(current.canonical_discussion.discussion_time_limit_sec === 15 && current.canonical_discussion.vote_time_limit_sec === 60,
    "AUDIT ACT7 timing is not 15/60");

  await rpc("s5_audit_expire_discussion", { p_room_code: fixtureState.room, p_teacher_token: fixtureState.teacher });
  const voting = await teacherState(fixtureState);
  assert(voting.discussion.phase_key === "act7_vote" && voting.discussion.status === "voting",
    "AUDIT ACT7 deliberate discussion timeout did not open voting");
  const voteSeconds = (Date.parse(voting.discussion.phase_deadline) - Date.now()) / 1000;
  assert(voteSeconds > 50 && voteSeconds <= 61, `AUDIT ACT7 vote deadline is not approximately 60 seconds: ${voteSeconds}`);
  await evidenceBoundary("AUDIT_VOTING", fixtureState, voting.discussion);
  await sleep(61000);
  const expired = await teacherState(fixtureState);
  assert(expired.discussion.status === "waiting_for_missing_player",
    "AUDIT ACT7 vote timeout did not wait for the missing Players");
  await evidenceBoundary("AUDIT_AFTER_61S", fixtureState, expired.discussion);
  const add = await rpc("s5_teacher_add_time", {
    p_room_code: fixtureState.room,
    p_teacher_token: fixtureState.teacher,
    p_seconds: 60,
  });
  const after = await teacherState(fixtureState);
  assert(add.applicable === true && after.discussion.status === "voting"
    && Date.parse(after.discussion.phase_deadline) > Date.parse(expired.discussion.phase_deadline || 0),
  "AUDIT ACT7 Add Time did not reopen voting with a new deadline");
  await evidenceBoundary("AUDIT_AFTER_ADD", fixtureState, after.discussion);
  return { room: fixtureState.room, run_id: voting.run.run_id };
}

async function main({ coordinated = false } = {}) {
  if (!coordinated) throw new Error("Controlled production acceptance may run only inside the reviewed in-process coordinator");
  assertExecutionAuthorized();
  await assertSourceGateProofs(process.env);
  await probeSupabaseNetwork({
    url: "https://qdcbdcjobzytzhnhfwyn.supabase.co",
    outputFile: process.env.ACT7_071_NETWORK_PROBE_OUTPUT,
    env: process.env,
  });
  try {
    const normal = await runNormalScenario();
    const audit = await runAuditControl();
    console.log(JSON.stringify({ ok: true, normal, audit }));
  } finally {
    evidenceInput?.close();
  }
}

module.exports = { assertExecutionAuthorized, enterAct6Barrier, openVote, runNormalScenario, runAuditControl,
  runCoordinatedAcceptance: () => main({ coordinated: true }) };
if (require.main === module) main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
