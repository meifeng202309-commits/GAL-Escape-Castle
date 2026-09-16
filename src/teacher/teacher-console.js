import { rpc } from "../supabase/client.js";
import { escapeHtml } from "../utils/html.js";

const roomCodeInput = document.getElementById("roomCode");
const teacherTokenInput = document.getElementById("teacherToken");
const toggleTeacherTokenButton = document.getElementById("toggleTeacherToken");
const codeGitteInput = document.getElementById("codeGitte");
const codeAnnaInput = document.getElementById("codeAnna");
const codeLindaInput = document.getElementById("codeLinda");
const createRoomButton = document.getElementById("createRoomButton");
const watchButton = document.getElementById("watchButton");
const advanceButton = document.getElementById("advanceButton");
const resetButton = document.getElementById("resetButton");
const teacherStatus = document.getElementById("teacherStatus");
const roomState = document.getElementById("roomState");
const releaseSessionButtons = document.querySelectorAll(".release-session");

let pollTimer = null;

createRoomButton.addEventListener("click", createRoom);
watchButton.addEventListener("click", watchRoom);
advanceButton.addEventListener("click", advanceScene);
resetButton.addEventListener("click", resetRoom);
toggleTeacherTokenButton.addEventListener("click", toggleTeacherToken);
releaseSessionButtons.forEach((button) => {
  button.addEventListener("click", () => releasePlayerSession(button.dataset.roleSlot));
});

async function createRoom() {
  const payload = baseTeacherPayload();
  if (!payload) return;
  if (!codeGitteInput.value.trim() || !codeAnnaInput.value.trim() || !codeLindaInput.value.trim()) {
    teacherStatus.textContent = "Create room requires all three join codes.";
    return;
  }

  teacherStatus.textContent = "Creating room...";
  try {
    await rpc("s1_create_room", {
      ...payload,
      p_gitte_join_code: codeGitteInput.value.trim(),
      p_anna_join_code: codeAnnaInput.value.trim(),
      p_linda_join_code: codeLindaInput.value.trim(),
    });
    teacherStatus.textContent = "Room ready. Share the three join codes with assigned students.";
    await watchRoom();
  } catch (error) {
    teacherStatus.textContent = `Create failed: ${error.message}`;
  }
}

async function watchRoom() {
  const payload = baseTeacherPayload();
  if (!payload) return;
  teacherStatus.textContent = "Watching room...";
  await loadState();
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(loadState, 1200);
}

async function loadState() {
  const payload = baseTeacherPayload(false);
  if (!payload) return;
  try {
    const state = await rpc("s1_get_teacher_state", payload);
    renderTeacherState(state);
    teacherStatus.textContent = `Watching room ${state.room_code}`;
  } catch (error) {
    roomState.innerHTML = `<p class="bad">${escapeHtml(error.message)}</p>`;
  }
}

async function advanceScene() {
  const payload = baseTeacherPayload();
  if (!payload) return;
  try {
    await rpc("s1_advance_scene", payload);
    await loadState();
  } catch (error) {
    teacherStatus.textContent = `Advance failed: ${error.message}`;
  }
}

async function resetRoom() {
  const payload = baseTeacherPayload();
  if (!payload) return;
  if (!confirm(`Reset all Sprint 1 decisions for room ${payload.p_room_code}?`)) return;
  try {
    await rpc("s1_reset_room", payload);
    await loadState();
  } catch (error) {
    teacherStatus.textContent = `Reset failed: ${error.message}`;
  }
}

async function releasePlayerSession(roleSlot) {
  const payload = baseTeacherPayload();
  if (!payload) return;
  if (!confirm(`Release ${roleSlot} session? The student will need to rejoin with their assigned join code.`)) return;
  try {
    await rpc("s1_release_player_session", {
      ...payload,
      p_role_slot: roleSlot,
    });
    teacherStatus.textContent = `${roleSlot} session released.`;
    await loadState();
  } catch (error) {
    teacherStatus.textContent = `Release failed: ${error.message}`;
  }
}

function renderTeacherState(state) {
  const playerRows = state.players.map((player) => {
    const decision = state.decisions.find((item) => item.player_id === player.player_id);
    const choiceText = state.phase === "revealed" || state.phase === "completed"
      ? (decision ? escapeHtml(decision.choice_label) : "<span class='muted'>waiting</span>")
      : (decision ? "<span class='good'>submitted</span>" : "<span class='muted'>waiting</span>");
    return `<tr><td>${escapeHtml(player.display_name)}</td><td>${escapeHtml(player.role_slot)}</td><td>${choiceText}</td></tr>`;
  }).join("");

  roomState.innerHTML = `
    <p><b>Room:</b> ${escapeHtml(state.room_code)}</p>
    <p><b>Scene:</b> ${escapeHtml(state.current_scene)} · <b>Phase:</b> ${escapeHtml(state.phase)}</p>
    <table>
      <tr><th>Player</th><th>Slot</th><th>Private choice</th></tr>
      ${playerRows}
    </table>
  `;
}

function baseTeacherPayload(showMessage = true) {
  const roomCode = roomCodeInput.value.trim().toUpperCase();
  const teacherToken = teacherTokenInput.value.trim();
  if (!roomCode || !teacherToken) {
    if (showMessage) teacherStatus.textContent = "Enter room code and teacher token.";
    return null;
  }
  return {
    p_room_code: roomCode,
    p_teacher_token: teacherToken,
  };
}

function toggleTeacherToken() {
  const isHidden = teacherTokenInput.type === "password";
  teacherTokenInput.type = isHidden ? "text" : "password";
  toggleTeacherTokenButton.textContent = isHidden ? "Hide" : "Show";
}
