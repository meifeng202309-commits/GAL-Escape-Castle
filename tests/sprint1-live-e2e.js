const { randomUUID } = require("node:crypto");

const SUPABASE_URL = "https://qdcbdcjobzytzhnhfwyn.supabase.co";
const SUPABASE_KEY = "sb_publishable_h5mCF6rkaYWw12ssP4-1NA_KzzPJOwY";

const results = [];

async function rpc(functionName, payload = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!response.ok) {
    const message = body && (body.message || body.details || body.error_description)
      ? (body.message || body.details || body.error_description)
      : text;
    const error = new Error(message || `RPC ${functionName} failed with HTTP ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}

function unique(prefix) {
  return `${prefix}${Date.now().toString(36).slice(-5)}${randomUUID().slice(0, 4)}`.toUpperCase();
}

function pass(name, detail = "") {
  results.push({ name, result: "PASS", detail });
}

function fail(name, error) {
  results.push({ name, result: "FAIL", detail: error && error.message ? error.message : String(error) });
}

async function expectReject(name, action, expectedSubstring) {
  try {
    await action();
    throw new Error("Expected rejection, but RPC succeeded.");
  } catch (error) {
    if (expectedSubstring && !String(error.message).toLowerCase().includes(expectedSubstring.toLowerCase())) {
      throw new Error(`Expected message containing "${expectedSubstring}", got "${error.message}"`);
    }
    pass(name, sanitize(error.message));
  }
}

function sanitize(value) {
  return String(value).replace(/[A-F0-9-]{20,}/gi, "[redacted-token]");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function createRoom(roomCode, teacherToken, joinCodes) {
  return rpc("s1_create_room", {
    p_room_code: roomCode,
    p_teacher_token: teacherToken,
    p_gitte_join_code: joinCodes.gitte,
    p_anna_join_code: joinCodes.anna,
    p_linda_join_code: joinCodes.linda,
  });
}

async function testCreateRoomHardening() {
  const roomCode = unique("A");
  const teacherToken = unique("T");
  const joinCodes = {
    gitte: unique("G"),
    anna: unique("A"),
    linda: unique("L"),
  };

  await createRoom(roomCode, teacherToken, joinCodes);
  pass("A1 teacher can create a new room", roomCode);

  await expectReject("A1b invalid teacher token cannot read teacher state", () => rpc("s1_get_teacher_state", {
    p_room_code: roomCode,
    p_teacher_token: unique("WRONG"),
  }), "Invalid teacher token");

  await expectReject("A2 empty join codes are rejected", () => createRoom(unique("E"), unique("T"), {
    gitte: "",
    anna: unique("A"),
    linda: unique("L"),
  }), "All three join codes are required");

  await expectReject("A3 duplicate join codes are rejected", () => createRoom(unique("D"), unique("T"), {
    gitte: "DUPLICATE-CODE",
    anna: "DUPLICATE-CODE",
    linda: unique("L"),
  }), "mutually distinct");

  await expectReject("A4 creating an existing room_code is rejected", () => createRoom(roomCode, unique("T2"), {
    gitte: unique("G2"),
    anna: unique("A2"),
    linda: unique("L2"),
  }), "Room already exists");

  const state = await rpc("s1_get_teacher_state", {
    p_room_code: roomCode,
    p_teacher_token: teacherToken,
  });
  assert(state.room_code === roomCode, "Existing room state is unavailable with original teacher token.");
  assert(state.players.length === 3, "Existing room player rows were not preserved.");
  pass("A5 existing room data is not overwritten", "original teacher token still works and 3 players remain");
}

async function testThreePlayerFlow() {
  const roomCode = unique("B");
  const teacherToken = unique("T");
  const joinCodes = {
    gitte: unique("G"),
    anna: unique("A"),
    linda: unique("L"),
  };
  await createRoom(roomCode, teacherToken, joinCodes);

  const gitte = await rpc("s1_join_player", { p_room_code: roomCode, p_join_code: joinCodes.gitte });
  assert(gitte.display_name === "Gitte" && gitte.role_slot === "GAL-A", "Gitte received wrong role.");
  pass("B1 Gitte joins with assigned code", "GAL-A");

  const anna = await rpc("s1_join_player", { p_room_code: roomCode, p_join_code: joinCodes.anna });
  assert(anna.display_name === "Anna" && anna.role_slot === "GAL-B", "Anna received wrong role.");
  pass("B2 Anna joins with assigned code", "GAL-B");

  const linda = await rpc("s1_join_player", { p_room_code: roomCode, p_join_code: joinCodes.linda });
  assert(linda.display_name === "Linda" && linda.role_slot === "GAL-C", "Linda received wrong role.");
  pass("B3 Linda joins with assigned code", "GAL-C");
  pass("B4 each player receives the correct role", "Gitte/GAL-A, Anna/GAL-B, Linda/GAL-C");

  await expectReject("B5 used join code cannot take over active player", () => rpc("s1_join_player", {
    p_room_code: roomCode,
    p_join_code: joinCodes.gitte,
  }), "already claimed");

  await rpc("s1_submit_private_choice", {
    p_room_code: roomCode,
    p_session_token: gitte.session_token,
    p_choice_id: "map",
    p_choice_label: "tampered label from browser",
  });

  let teacherState = await rpc("s1_get_teacher_state", {
    p_room_code: roomCode,
    p_teacher_token: teacherToken,
  });
  const gitteDecisionBeforeReveal = teacherState.decisions.find((item) => item.player_id === gitte.player_id);
  assert(!teacherState.decisions.some((item) => item.choice_label), "Choice labels leaked before reveal.");
  assert(gitteDecisionBeforeReveal && gitteDecisionBeforeReveal.locked_at, "Submitted marker missing before reveal.");
  pass("C1 private choice hidden before reveal", "teacher sees submitted marker only");

  const gitteState = await rpc("s1_get_player_state", {
    p_room_code: roomCode,
    p_session_token: gitte.session_token,
  });
  assert(gitteState.my_decision.choice_label === "Study the map on the wall", "Server did not canonicalize browser-supplied choice label.");
  pass("C2 browser-supplied choice label is canonicalized", gitteState.my_decision.choice_label);

  await expectReject("C3 duplicate private choice is rejected", () => rpc("s1_submit_private_choice", {
    p_room_code: roomCode,
    p_session_token: gitte.session_token,
    p_choice_id: "keys",
    p_choice_label: "Check the old keys on the desk",
  }), "already locked");

  await expectReject("C4 advance from collecting is rejected", () => rpc("s1_advance_scene", {
    p_room_code: roomCode,
    p_teacher_token: teacherToken,
  }), "after reveal");

  await rpc("s1_submit_private_choice", {
    p_room_code: roomCode,
    p_session_token: anna.session_token,
    p_choice_id: "keys",
    p_choice_label: "Check the old keys on the desk",
  });
  await rpc("s1_submit_private_choice", {
    p_room_code: roomCode,
    p_session_token: linda.session_token,
    p_choice_id: "door",
    p_choice_label: "Go straight to the door",
  });

  teacherState = await rpc("s1_get_teacher_state", {
    p_room_code: roomCode,
    p_teacher_token: teacherToken,
  });
  assert(teacherState.phase === "revealed", `Expected revealed phase, got ${teacherState.phase}`);
  assert(teacherState.decisions.length === 3, "Reveal did not include all three decisions.");
  assert(teacherState.decisions.every((item) => item.choice_label), "Reveal did not expose canonical labels to teacher.");
  pass("C5 reveal occurs after all three private choices", "phase=revealed");

  const reconnectState = await rpc("s1_get_player_state", {
    p_room_code: roomCode,
    p_session_token: anna.session_token,
  });
  assert(reconnectState.display_name === "Anna", "Reconnect session did not restore Anna.");
  assert(reconnectState.my_decision.choice_label === "Check the old keys on the desk", "Reconnect did not preserve locked choice.");
  pass("C6 reconnect restores player and locked choice", "Anna");

  await rpc("s1_advance_scene", {
    p_room_code: roomCode,
    p_teacher_token: teacherToken,
  });
  const afterAdvance = await rpc("s1_get_teacher_state", {
    p_room_code: roomCode,
    p_teacher_token: teacherToken,
  });
  assert(afterAdvance.current_scene === 2 && afterAdvance.phase === "collecting", "Advance after reveal did not move to scene 2 collecting.");
  pass("C7 teacher can advance only after reveal", "scene=2, phase=collecting");

  await rpc("s1_reset_room", {
    p_room_code: roomCode,
    p_teacher_token: teacherToken,
  });
  const afterReset = await rpc("s1_get_teacher_state", {
    p_room_code: roomCode,
    p_teacher_token: teacherToken,
  });
  assert(afterReset.current_scene === 1 && afterReset.phase === "collecting" && afterReset.decisions.length === 0, "Reset did not clear room state.");
  pass("C8 teacher reset clears decisions and returns to scene 1", "scene=1, phase=collecting");
}

async function testRecovery() {
  const roomCode = unique("R");
  const teacherToken = unique("T");
  const joinCodes = {
    gitte: unique("G"),
    anna: unique("A"),
    linda: unique("L"),
  };
  await createRoom(roomCode, teacherToken, joinCodes);
  await rpc("s1_join_player", { p_room_code: roomCode, p_join_code: joinCodes.gitte });
  await expectReject("D1 claimed role rejects rejoin before release", () => rpc("s1_join_player", {
    p_room_code: roomCode,
    p_join_code: joinCodes.gitte,
  }), "already claimed");
  await rpc("s1_release_player_session", {
    p_room_code: roomCode,
    p_teacher_token: teacherToken,
    p_role_slot: "GAL-A",
  });
  const rejoined = await rpc("s1_join_player", { p_room_code: roomCode, p_join_code: joinCodes.gitte });
  assert(rejoined.display_name === "Gitte" && rejoined.role_slot === "GAL-A", "Released role did not allow reassignment.");
  pass("D2 teacher release allows prototype recovery rejoin", "GAL-A");
}

async function testConcurrentJoin() {
  const roomCode = unique("Q");
  const teacherToken = unique("T");
  const joinCodes = {
    gitte: unique("G"),
    anna: unique("A"),
    linda: unique("L"),
  };
  await createRoom(roomCode, teacherToken, joinCodes);

  const attempts = await Promise.allSettled([
    rpc("s1_join_player", { p_room_code: roomCode, p_join_code: joinCodes.gitte }),
    rpc("s1_join_player", { p_room_code: roomCode, p_join_code: joinCodes.gitte }),
  ]);
  const fulfilled = attempts.filter((item) => item.status === "fulfilled");
  const rejected = attempts.filter((item) => item.status === "rejected");
  assert(fulfilled.length === 1, `Expected exactly one concurrent join success, got ${fulfilled.length}.`);
  assert(rejected.length === 1, `Expected exactly one concurrent join rejection, got ${rejected.length}.`);
  assert(String(rejected[0].reason.message).includes("already claimed"), `Unexpected concurrent rejection: ${rejected[0].reason.message}`);
  pass("E1 concurrent double-join allows exactly one claim", "1 success, 1 already-claimed rejection");

  const teacherState = await rpc("s1_get_teacher_state", {
    p_room_code: roomCode,
    p_teacher_token: teacherToken,
  });
  const gitte = teacherState.players.find((player) => player.role_slot === "GAL-A");
  assert(gitte && gitte.joined === true, "Teacher state does not show Gitte claimed after concurrent join.");
  pass("E2 teacher state shows only one claimed role", "GAL-A claimed");
}

async function testInvalidChoice() {
  const roomCode = unique("I");
  const teacherToken = unique("T");
  const joinCodes = {
    gitte: unique("G"),
    anna: unique("A"),
    linda: unique("L"),
  };
  await createRoom(roomCode, teacherToken, joinCodes);
  const gitte = await rpc("s1_join_player", { p_room_code: roomCode, p_join_code: joinCodes.gitte });
  await expectReject("F1 invalid choice id is rejected", () => rpc("s1_submit_private_choice", {
    p_room_code: roomCode,
    p_session_token: gitte.session_token,
    p_choice_id: "not-a-real-choice",
    p_choice_label: "Fake label",
  }), "Invalid choice");
}

async function main() {
  const frontend = await Promise.all([
    fetch("https://meifeng202309-commits.github.io/GAL-Escape-Castle/index.html"),
    fetch("https://meifeng202309-commits.github.io/GAL-Escape-Castle/teacher.html"),
    fetch("https://meifeng202309-commits.github.io/GAL-Escape-Castle/src/game/app.js"),
    fetch("https://meifeng202309-commits.github.io/GAL-Escape-Castle/src/teacher/teacher-console.js"),
  ]);
  assert(frontend.every((response) => response.status === 200), "GitHub Pages frontend assets are not all reachable.");
  pass("G1 GitHub Pages student/teacher frontend assets reachable", "index, teacher, game JS, teacher JS all HTTP 200");

  const directTable = await fetch(`${SUPABASE_URL}/rest/v1/s1_player_decisions?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  const directTableText = await directTable.text();
  const directRows = directTableText ? JSON.parse(directTableText) : null;
  assert(Array.isArray(directRows), `Direct table check returned unexpected body: ${directTableText}`);
  assert(directRows.length === 0, `Direct anonymous table access returned ${directRows.length} decision rows.`);
  pass("G2 direct anonymous table access is not unrestricted", `HTTP ${directTable.status}, 0 rows visible`);

  await testCreateRoomHardening();
  await testThreePlayerFlow();
  await testRecovery();
  await testConcurrentJoin();
  await testInvalidChoice();

  const failed = results.filter((item) => item.result !== "PASS");
  for (const item of results) {
    console.log(`${item.result} ${item.name}${item.detail ? ` — ${item.detail}` : ""}`);
  }
  if (failed.length) {
    process.exitCode = 1;
  } else {
    console.log(`Sprint 1 live E2E passed: ${results.length} checks.`);
  }
}

main().catch((error) => {
  fail("Unhandled live E2E error", error);
  for (const item of results) {
    console.log(`${item.result} ${item.name}${item.detail ? ` — ${item.detail}` : ""}`);
  }
  console.error(`FAIL ${sanitize(error.stack || error.message)}`);
  process.exitCode = 1;
});
