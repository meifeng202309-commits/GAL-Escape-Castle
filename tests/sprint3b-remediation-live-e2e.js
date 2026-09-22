const URL = "https://qdcbdcjobzytzhnhfwyn.supabase.co";
const KEY = "sb_publishable_h5mCF6rkaYWw12ssP4-1NA_KzzPJOwY";
const results = [];
const unique = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase().slice(0, 14);
const assert = (value, message) => { if (!value) throw new Error(message); };
const pass = (name) => { results.push(name); console.log(`PASS ${name}`); };

async function rpc(name, body) {
  const response = await fetch(`${URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(parsed?.message || parsed?.details || text);
  return parsed;
}

async function reject(name, action, expected) {
  try { await action(); throw new Error("Expected rejection"); }
  catch (error) {
    assert(expected.some((item) => error.message.includes(item)), `${name}: ${error.message}`);
    pass(name);
  }
}

async function fixture(mode = "audit") {
  const room = unique("R");
  const teacher = unique("T");
  const joins = [unique("G"), unique("A"), unique("L")];
  await rpc("s1_create_room", { p_room_code: room, p_teacher_token: teacher, p_gitte_join_code: joins[0], p_anna_join_code: joins[1], p_linda_join_code: joins[2] });
  const players = await Promise.all(joins.map((p_join_code) => rpc("s1_join_player", { p_room_code: room, p_join_code })));
  await rpc("s2_start_run", { p_room_code: room, p_teacher_token: teacher, p_run_mode: mode });
  return { room, teacher, players };
}

const auth = (f, index) => ({ p_room_code: f.room, p_session_token: f.players[index].session_token });
const teacherState = (f) => rpc("s2_get_teacher_state", { p_room_code: f.room, p_teacher_token: f.teacher });
const playerState = (f, index = 0) => rpc("s2_get_player_state", auth(f, index));

async function openGenericDiscussion(f) {
  return rpc("s2_open_discussion", {
    p_room_code: f.room, p_teacher_token: f.teacher, p_topic: "remediation audit",
    p_discussion_time_limit_sec: 300, p_vote_time_limit_sec: 300,
    p_show_initial_choices: false, p_require_final_vote: true,
    p_vote_options: [{ id: "known", label: "Known" }, { id: "unknown", label: "Unknown" }],
    p_tie_policy: "NO_TIE_POSSIBLE", p_revote_window_sec: 30, p_max_revotes: 0,
    p_fallback_resolution: null, p_silent_texting_mode: true,
  });
}

async function main() {
  const f = await fixture();
  const discussion = await openGenericDiscussion(f);
  await reject("one open discussion per run", () => openGenericDiscussion(f), ["duplicate key", "already has", "open discussion"]);

  const requestId = crypto.randomUUID();
  const messagePayload = {
    ...auth(f, 0), p_expected_discussion_session_id: discussion.discussion_session_id,
    p_expected_vote_round: discussion.vote_round, p_client_request_id: requestId,
    p_message_text: "stable retry",
  };
  const first = await rpc("s2_send_message", messagePayload);
  const retry = await rpc("s2_send_message", messagePayload);
  assert(first.message_id === retry.message_id && retry.idempotent_replay, "Message retry duplicated or changed identity.");
  pass("message retry is idempotent");
  await reject("message request ID cannot change content", () => rpc("s2_send_message", { ...messagePayload, p_message_text: "changed" }), ["reused with different content"]);

  await rpc("s2_open_vote", { p_room_code: f.room, p_teacher_token: f.teacher });
  const exactVote = (index, choice) => rpc("s2_submit_vote", {
    ...auth(f, index), p_expected_discussion_session_id: discussion.discussion_session_id,
    p_expected_vote_round: discussion.vote_round, p_choice_id: choice,
  });
  await exactVote(0, "known");
  await reject("conflicting locked vote rejected", () => exactVote(0, "unknown"), ["already locked"]);
  await exactVote(1, "known");
  await exactVote(2, "unknown");
  await reject("stale resolved discussion rejected", () => exactVote(2, "unknown"), ["Voting is not currently open", "Stale discussion identity"]);

  const carryover = await fixture();
  await openGenericDiscussion(carryover);
  await reject("pre-init generic discussion blocks canonical initialization", () => rpc("s3b_initialize_flow", {
    p_room_code: carryover.room, p_teacher_token: carryover.teacher,
  }), ["Resolve the open generic discussion"]);

  const normal = await fixture("normal");
  await rpc("s3b_initialize_flow", { p_room_code: normal.room, p_teacher_token: normal.teacher });
  await rpc("s3b_ack_act1_opening", auth(normal, 0));
  await rpc("s3b_submit_act1_choice", { ...auth(normal, 0), p_choice_id: "study_map" });
  const normalTeacher = await teacherState(normal);
  assert(!normalTeacher.events.some((event) => event.phase_key === "private_first_action"), "NORMAL Teacher received private ACT 1 evidence.");
  await reject("NORMAL cannot enable private debug view", () => rpc("s3b_audit_set_private_debug_view", {
    p_room_code: normal.room, p_teacher_token: normal.teacher, p_enabled: true,
  }), ["restricted to AUDIT runs"]);
  pass("NORMAL Teacher private evidence is server-filtered");

  const canonical = await fixture();
  await rpc("s3b_initialize_flow", { p_room_code: canonical.room, p_teacher_token: canonical.teacher });
  await reject("generic discussion fails closed in canonical flow", () => openGenericDiscussion(canonical), ["unavailable during canonical gameplay"]);
  await reject("browser ACT2 apply authority revoked", () => rpc("s3b_apply_meeting_resolution", auth(canonical, 0)), ["permission denied", "Could not find the function", "not exist"]);
  await reject("photo share rejected outside allowed scene", () => rpc("s3_share_photo", { ...auth(canonical, 0), p_recipient_role: "GAL-B", p_source_item_key: "gitte_map", p_source_view: "front" }), ["unavailable in the current scene"]);

  const state = await rpc("s3b_get_player_state", auth(canonical, 0));
  assert(state.me.act1_timing_validity === "pending", "Timing validity did not reconnect.");
  await rpc("s3b_ack_act1_opening", auth(canonical, 0));
  const timed = await rpc("s3b_get_player_state", auth(canonical, 0));
  assert(timed.me.act1_action_started_at && timed.me.act1_timing_validity === "valid", "Authoritative action start was not persisted.");
  pass("authoritative timing start survives reconnect");

  let teacher = await teacherState(canonical);
  assert(!teacher.events.some((event) => event.event_type === "act1_opening_acknowledged"), "AUDIT private evidence leaked without explicit debug view.");
  await rpc("s3b_audit_set_private_debug_view", {
    p_room_code: canonical.room, p_teacher_token: canonical.teacher, p_enabled: true,
  });
  teacher = await teacherState(canonical);
  assert(teacher.canonical_flow_active === true && teacher.events.some((event) => event.event_type === "act1_opening_acknowledged" && event.scene_id && event.event_source === "player" && event.validity === "valid"), "Explicit event evidence is incomplete.");
  pass("AUDIT private evidence requires explicit debug view");

  await rpc("s3b_submit_act1_choice", { ...auth(canonical, 0), p_choice_id: "study_map" });
  await rpc("s3b_complete_act1", auth(canonical, 0));
  await rpc("s3b_ack_act1_opening", auth(canonical, 1));
  await rpc("s3b_submit_act1_choice", { ...auth(canonical, 1), p_choice_id: "read_diary" });
  await rpc("s3b_complete_act1", auth(canonical, 1));
  await rpc("s3b_ack_act1_opening", auth(canonical, 2));
  await rpc("s3b_submit_act1_choice", { ...auth(canonical, 2), p_choice_id: "read_notice" });
  await rpc("s3b_complete_act1", auth(canonical, 2));
  teacher = await teacherState(canonical);
  const lastAction = [...teacher.events].reverse().find((event) => event.event_type === "act1_consequence_completed");
  const transition = teacher.events.find((event) => event.event_type === "scene_transition" && event.scene_id === "act2_first_contact");
  assert(lastAction && transition && lastAction.event_id < transition.event_id, "Causal player action was not persisted before the scene transition.");
  assert(lastAction.scene_id === "act1_wake_up" && lastAction.phase_key === "private_first_action", "Causal action lost its source interaction context.");
  pass("transition-triggering action preserves causal order and source context");

  const direct = await fetch(`${URL}/rest/v1/s3b_post_inspection_route_votes?select=*`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  const rows = await direct.json();
  assert(direct.ok && rows.length === 0, "Post-inspection private votes leaked through RLS.");
  pass("post-inspection vote table is private");
  console.log(`Sprint 3B remediation live E2E passed: ${results.length} checks.`);
}

main().catch((error) => { console.error(`FAIL ${error.stack || error.message}`); process.exitCode = 1; });
