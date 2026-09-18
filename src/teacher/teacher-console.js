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
const runModeInput = document.getElementById("runMode");
const discussionSecondsInput = document.getElementById("discussionSeconds");
const voteSecondsInput = document.getElementById("voteSeconds");
const discussionTopicInput = document.getElementById("discussionTopicInput");
const tiePolicyInput = document.getElementById("tiePolicy");
const revoteSecondsInput = document.getElementById("revoteSeconds");
const maxRevotesInput = document.getElementById("maxRevotes");
const fallbackResolutionInput = document.getElementById("fallbackResolution");
const voteOptionsInput = document.getElementById("voteOptions");
const showInitialChoicesInput = document.getElementById("showInitialChoices");
const requireFinalVoteInput = document.getElementById("requireFinalVote");
const silentTextingModeInput = document.getElementById("silentTextingMode");
const startRunButton = document.getElementById("startRunButton");
const openDiscussionButton = document.getElementById("openDiscussionButton");
const openVoteButton = document.getElementById("openVoteButton");
const addTimeButton = document.getElementById("addTimeButton");
const runBadge = document.getElementById("runBadge");
const discussionTeacherStatus = document.getElementById("discussionTeacherStatus");
const discussionState = document.getElementById("discussionState");

let pollTimer = null;

createRoomButton.addEventListener("click", createRoom);
watchButton.addEventListener("click", watchRoom);
advanceButton.addEventListener("click", advanceScene);
resetButton.addEventListener("click", resetRoom);
toggleTeacherTokenButton.addEventListener("click", toggleTeacherToken);
releaseSessionButtons.forEach((button) => {
  button.addEventListener("click", () => releasePlayerSession(button.dataset.roleSlot));
});
startRunButton.addEventListener("click", startRun);
openDiscussionButton.addEventListener("click", openDiscussion);
openVoteButton.addEventListener("click", openVote);
addTimeButton.addEventListener("click", addTime);

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
    await loadDiscussionState();
    teacherStatus.textContent = `Watching room ${state.room_code}`;
  } catch (error) {
    roomState.innerHTML = `<p class="bad">${escapeHtml(error.message)}</p>`;
  }
}

async function startRun() {
  const payload = baseTeacherPayload();
  if (!payload) return;
  discussionTeacherStatus.textContent = "Starting formal run...";
  try {
    const run = await rpc("s2_start_run", {
      ...payload,
      p_run_mode: runModeInput.value,
    });
    discussionTeacherStatus.textContent = `Run started: ${run.run_id}`;
    await loadDiscussionState();
  } catch (error) {
    discussionTeacherStatus.textContent = `Start failed: ${error.message}`;
  }
}

async function openDiscussion() {
  const payload = baseTeacherPayload();
  if (!payload) return;
  let voteOptions;
  try {
    voteOptions = parseVoteOptions(voteOptionsInput.value);
  } catch (error) {
    discussionTeacherStatus.textContent = error.message;
    return;
  }

  try {
    await rpc("s2_open_discussion", {
      ...payload,
      p_topic: discussionTopicInput.value.trim(),
      p_discussion_time_limit_sec: Number(discussionSecondsInput.value),
      p_vote_time_limit_sec: Number(voteSecondsInput.value),
      p_show_initial_choices: showInitialChoicesInput.checked,
      p_require_final_vote: requireFinalVoteInput.checked,
      p_vote_options: voteOptions,
      p_tie_policy: tiePolicyInput.value,
      p_revote_window_sec: Number(revoteSecondsInput.value),
      p_max_revotes: Number(maxRevotesInput.value),
      p_fallback_resolution: fallbackResolutionInput.value.trim() || null,
      p_silent_texting_mode: silentTextingModeInput.checked,
    });
    discussionTeacherStatus.textContent = "Discussion opened.";
    await loadDiscussionState();
  } catch (error) {
    discussionTeacherStatus.textContent = `Open failed: ${error.message}`;
  }
}

async function openVote() {
  const payload = baseTeacherPayload();
  if (!payload) return;
  try {
    await rpc("s2_open_vote", payload);
    discussionTeacherStatus.textContent = "Voting opened.";
    await loadDiscussionState();
  } catch (error) {
    discussionTeacherStatus.textContent = `Open vote failed: ${error.message}`;
  }
}

async function addTime() {
  const payload = baseTeacherPayload();
  if (!payload) return;
  try {
    await rpc("s2_add_time", { ...payload, p_seconds: 30 });
    discussionTeacherStatus.textContent = "Added 30 seconds.";
    await loadDiscussionState();
  } catch (error) {
    discussionTeacherStatus.textContent = `Add time failed: ${error.message}`;
  }
}

async function loadDiscussionState() {
  const payload = baseTeacherPayload(false);
  if (!payload) return;
  try {
    const state = await rpc("s2_get_teacher_state", payload);
    renderDiscussionState(state);
  } catch (error) {
    runBadge.textContent = "Unavailable";
    discussionState.innerHTML = `<p class="bad">${escapeHtml(error.message)}</p>`;
  }
}

function renderDiscussionState(state) {
  if (!state.active) {
    runBadge.textContent = "No active run";
    discussionState.innerHTML = "<p class='muted'>Join all three players, then start a formal run.</p>";
    return;
  }

  runBadge.textContent = state.run.run_mode.toUpperCase();
  runModeInput.disabled = true;
  startRunButton.disabled = true;
  if (!state.discussion) {
    discussionState.innerHTML = `<p><b>Run:</b> ${escapeHtml(state.run.run_id)}</p><p class="muted">No discussion opened yet.</p>`;
    return;
  }

  const discussion = state.discussion;
  const voteRows = state.current_votes.map((vote) => `
    <tr><td>${escapeHtml(vote.display_name)}</td><td>${escapeHtml(vote.role_slot)}</td><td>${vote.submitted ? "<span class='good'>submitted</span>" : "<span class='muted'>waiting</span>"}</td>${discussion.status === "resolved" ? `<td>${escapeHtml(vote.choice_label || "missing")}</td>` : ""}</tr>`
  ).join("");

  discussionState.innerHTML = `
    <p><b>Run:</b> ${escapeHtml(state.run.run_id)} · <b>Eligible:</b> ${state.run.behavior_dataset_eligible ? "yes" : "no"}</p>
    <p><b>Session:</b> ${escapeHtml(discussion.discussion_session_id)} · <b>Round:</b> ${discussion.vote_round}</p>
    <p><b>Status:</b> ${escapeHtml(discussion.status)} · <b>Deadline:</b> ${escapeHtml(formatDeadline(discussion.phase_deadline))}</p>
    <p><b>Topic:</b> ${escapeHtml(discussion.topic)}</p>
    <div class="transcript teacher-transcript">${state.messages.length ? state.messages.map((message) => `
      <article class="message"><div><b>${escapeHtml(message.display_name)}</b><time>${escapeHtml(formatTime(message.created_at))}</time></div><p>${escapeHtml(message.message_text)}</p></article>
    `).join("") : "<p class='muted'>No messages yet.</p>"}</div>
    <table><thead><tr><th>Player</th><th>Role</th><th>Vote</th>${discussion.status === "resolved" ? "<th>Revealed choice</th>" : ""}</tr></thead><tbody>${voteRows}</tbody></table>
    ${discussion.outcome ? `<div class="notice"><b>Outcome:</b> ${escapeHtml(JSON.stringify(discussion.outcome))}</div>` : ""}
  `;
}

function parseVoteOptions(raw) {
  const options = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const separator = line.indexOf("|");
    if (separator < 1) throw new Error("Each vote option must use id|label.");
    return { id: line.slice(0, separator).trim(), label: line.slice(separator + 1).trim() };
  });
  if (options.some((option) => !option.id || !option.label)) throw new Error("Vote option IDs and labels cannot be empty.");
  return options;
}

function formatDeadline(value) {
  return value ? new Date(value).toLocaleString() : "none";
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
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
