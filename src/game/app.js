import { getScene } from "../content/scenes.js";
import { loadSession, saveSession, clearSession } from "../state/session.js";
import { rpc } from "../supabase/client.js";
import { escapeHtml } from "../utils/html.js";

const joinPanel = document.getElementById("joinPanel");
const gamePanel = document.getElementById("gamePanel");
const roomCodeInput = document.getElementById("roomCode");
const joinCodeInput = document.getElementById("joinCode");
const joinButton = document.getElementById("joinButton");
const leaveButton = document.getElementById("leaveButton");
const joinStatus = document.getElementById("joinStatus");
const gameStatus = document.getElementById("gameStatus");
const playerLabel = document.getElementById("playerLabel");
const sceneTitle = document.getElementById("sceneTitle");
const sceneText = document.getElementById("sceneText");
const choiceArea = document.getElementById("choiceArea");
const revealArea = document.getElementById("revealArea");
const discussionPanel = document.getElementById("discussionPanel");
const discussionTopic = document.getElementById("discussionTopic");
const discussionDeadline = document.getElementById("discussionDeadline");
const discussionMeta = document.getElementById("discussionMeta");
const initialChoiceArea = document.getElementById("initialChoiceArea");
const transcript = document.getElementById("transcript");
const messageComposer = document.getElementById("messageComposer");
const messageText = document.getElementById("messageText");
const sendMessageButton = document.getElementById("sendMessageButton");
const voteArea = document.getElementById("voteArea");
const voteHistory = document.getElementById("voteHistory");
const discussionStatus = document.getElementById("discussionStatus");

let session = loadSession();
let pollTimer = null;

joinButton.addEventListener("click", joinRoom);
sendMessageButton.addEventListener("click", sendMessage);
messageText.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});
leaveButton.addEventListener("click", () => {
  clearSession();
  session = null;
  stopPolling();
  showJoin();
});

if (session && session.room_code && session.session_token) {
  roomCodeInput.value = session.room_code;
  showGame();
  refreshState();
  startPolling();
}

async function joinRoom() {
  const roomCode = roomCodeInput.value.trim().toUpperCase();
  const joinCode = joinCodeInput.value.trim();
  if (!roomCode || !joinCode) {
    joinStatus.textContent = "Enter both room code and join code.";
    return;
  }

  joinButton.disabled = true;
  joinStatus.textContent = "Joining...";
  try {
    const result = await rpc("s1_join_player", {
      p_room_code: roomCode,
      p_join_code: joinCode,
    });
    session = {
      room_code: roomCode,
      player_id: result.player_id,
      display_name: result.display_name,
      role_slot: result.role_slot,
      session_token: result.session_token,
    };
    saveSession(session);
    joinCodeInput.value = "";
    showGame();
    await refreshState();
    startPolling();
  } catch (error) {
    joinStatus.textContent = `Join failed: ${error.message}`;
  } finally {
    joinButton.disabled = false;
  }
}

async function refreshState() {
  if (!session) return;
  try {
    const state = await rpc("s1_get_player_state", {
      p_room_code: session.room_code,
      p_session_token: session.session_token,
    });
    renderState(state);
    await refreshDiscussion();
  } catch (error) {
    gameStatus.innerHTML = `<span class="bad">${escapeHtml(error.message)}</span>`;
  }
}

async function refreshDiscussion() {
  try {
    const state = await rpc("s2_get_player_state", {
      p_room_code: session.room_code,
      p_session_token: session.session_token,
    });
    renderDiscussion(state);
  } catch (error) {
    discussionPanel.classList.add("hidden");
    if (!String(error.message).includes("Could not find the function")) {
      discussionStatus.textContent = `DiscussionRoom unavailable: ${error.message}`;
    }
  }
}

function renderDiscussion(state) {
  if (!state.active || !state.discussion) {
    discussionPanel.classList.add("hidden");
    return;
  }

  const discussion = state.discussion;
  discussionPanel.classList.remove("hidden");
  discussionTopic.textContent = discussion.topic;
  discussionMeta.textContent = `${state.run.run_mode.toUpperCase()} · vote round ${discussion.vote_round}${discussion.silent_texting_mode ? " · silent texting" : ""}`;
  discussionDeadline.textContent = formatDeadline(discussion.phase_deadline, discussion.status);
  discussionStatus.textContent = "";

  initialChoiceArea.innerHTML = state.initial_choices.length
    ? `<div class="notice"><h4>Initial choices revealed</h4>${state.initial_choices.map((choice) =>
      `<p>${escapeHtml(choice.display_name)}: <b>${escapeHtml(choice.choice_label)}</b></p>`
    ).join("")}</div>`
    : "";

  transcript.innerHTML = state.messages.length
    ? state.messages.map((message) => `
      <article class="message">
        <div><b>${escapeHtml(message.display_name)}</b><time>${escapeHtml(formatTime(message.created_at))}</time></div>
        <p>${escapeHtml(message.message_text)}</p>
      </article>`).join("")
    : "<p class='muted'>No messages yet.</p>";
  transcript.scrollTop = transcript.scrollHeight;

  messageComposer.classList.toggle("hidden", discussion.status !== "discussion");
  renderVote(state);
  renderVoteHistory(state.vote_history);
}

function renderVote(state) {
  const discussion = state.discussion;
  if (!discussion.require_final_vote) {
    voteArea.innerHTML = discussion.status === "resolved"
      ? "<div class='notice good'>Discussion complete.</div>"
      : "";
    return;
  }

  if (discussion.status === "discussion") {
    voteArea.innerHTML = "<p class='muted'>Voting opens after the discussion.</p>";
    return;
  }

  if (discussion.status === "waiting_for_missing_player") {
    voteArea.innerHTML = `<div class="notice warn"><b>WAITING FOR MISSING PLAYER</b><p>${state.submitted_vote_count}/3 votes received. No vote has been synthesized.</p></div>`;
    return;
  }

  if (discussion.status === "resolved") {
    const outcome = discussion.outcome || {};
    const heading = outcome.type === "no_consensus" ? "NO CONSENSUS. NO ACTION." : "Vote resolved";
    voteArea.innerHTML = `<div class="notice"><h4>${escapeHtml(heading)}</h4>${state.revealed_votes.map((vote) =>
      `<p>${escapeHtml(vote.display_name)}: <b>${escapeHtml(vote.choice_label)}</b></p>`
    ).join("")}</div>`;
    return;
  }

  if (state.my_vote) {
    voteArea.innerHTML = `<div class="notice"><p class="good">Your vote is locked: <b>${escapeHtml(state.my_vote.choice_label)}</b></p><p class="muted">${state.submitted_vote_count}/3 submitted. Other votes remain private.</p></div>`;
    return;
  }

  voteArea.innerHTML = `
    <h4>Final vote</h4>
    <div class="choice-list">${discussion.vote_options.map((option) =>
      `<button type="button" data-vote-id="${escapeHtml(option.id)}">${escapeHtml(option.label)}</button>`
    ).join("")}</div>
    <p class="muted">${state.submitted_vote_count}/3 submitted.</p>`;
  voteArea.querySelectorAll("[data-vote-id]").forEach((button) => {
    button.addEventListener("click", () => submitVote(button.dataset.voteId));
  });
}

function renderVoteHistory(history) {
  voteHistory.innerHTML = history.length
    ? `<details><summary>Previous vote rounds</summary>${history.map((round) => `
      <div class="history-round"><b>Round ${round.vote_round}</b><span>${escapeHtml(round.outcome?.type || "resolved")}</span></div>`
    ).join("")}</details>`
    : "";
}

async function sendMessage() {
  const text = messageText.value.trim();
  if (!text || !session) return;
  sendMessageButton.disabled = true;
  try {
    await rpc("s2_send_message", {
      p_room_code: session.room_code,
      p_session_token: session.session_token,
      p_message_text: text,
    });
    messageText.value = "";
    await refreshDiscussion();
  } catch (error) {
    discussionStatus.innerHTML = `<span class="bad">Send failed: ${escapeHtml(error.message)}</span>`;
  } finally {
    sendMessageButton.disabled = false;
  }
}

async function submitVote(choiceId) {
  voteArea.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  try {
    await rpc("s2_submit_vote", {
      p_room_code: session.room_code,
      p_session_token: session.session_token,
      p_choice_id: choiceId,
    });
    await refreshDiscussion();
  } catch (error) {
    discussionStatus.innerHTML = `<span class="bad">Vote failed: ${escapeHtml(error.message)}</span>`;
    voteArea.querySelectorAll("button").forEach((button) => { button.disabled = false; });
  }
}

function formatDeadline(value, status) {
  if (!value) return status.replaceAll("_", " ");
  const seconds = Math.max(0, Math.ceil((new Date(value).getTime() - Date.now()) / 1000));
  return `${status.replaceAll("_", " ")} · ${seconds}s`;
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function renderState(state) {
  const scene = getScene(state.current_scene);
  playerLabel.textContent = `${state.display_name} · ${state.room_code}`;
  sceneTitle.textContent = scene.title;
  sceneText.textContent = scene.text;
  gameStatus.textContent = "";

  const mine = state.my_decision;
  const isRevealed = state.phase === "revealed" || state.phase === "completed";

  if (state.phase === "completed") {
    choiceArea.innerHTML = "";
    revealArea.innerHTML = "<div class='notice'><h3>Mission complete</h3><p class='good'>Sprint 1 room state, reveal, and reconnect are working.</p></div>";
    return;
  }

  if (mine) {
    choiceArea.innerHTML = `<div class="notice"><p class="good">Your first choice is locked: <b>${escapeHtml(mine.choice_label)}</b></p></div>`;
  } else {
    choiceArea.innerHTML = `<div class="choice-list">${scene.choices.map((choice) =>
      `<button data-choice-id="${escapeHtml(choice.id)}" data-choice-label="${escapeHtml(choice.label)}">${escapeHtml(choice.label)}</button>`
    ).join("")}</div>`;
    choiceArea.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => submitChoice(button.dataset.choiceId, button.dataset.choiceLabel));
    });
  }

  if (isRevealed) {
    revealArea.innerHTML = `<div class="notice"><h3>Choices revealed</h3>${state.revealed_decisions.map((decision) =>
      `<p>${escapeHtml(decision.display_name)}: <b>${escapeHtml(decision.choice_label)}</b></p>`
    ).join("")}</div>`;
  } else {
    revealArea.innerHTML = `<p class="warn">Waiting for private choices: ${state.submitted_count}/3 submitted.</p>`;
  }
}

async function submitChoice(choiceId, choiceLabel) {
  choiceArea.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  try {
    await rpc("s1_submit_private_choice", {
      p_room_code: session.room_code,
      p_session_token: session.session_token,
      p_choice_id: choiceId,
      p_choice_label: choiceLabel,
    });
    await refreshState();
  } catch (error) {
    gameStatus.innerHTML = `<span class="bad">Submit failed: ${escapeHtml(error.message)}</span>`;
    choiceArea.querySelectorAll("button").forEach((button) => {
      button.disabled = false;
    });
  }
}

function showJoin() {
  joinPanel.classList.remove("hidden");
  gamePanel.classList.add("hidden");
  discussionPanel.classList.add("hidden");
  joinStatus.textContent = "";
}

function showGame() {
  joinPanel.classList.add("hidden");
  gamePanel.classList.remove("hidden");
}

function startPolling() {
  stopPolling();
  pollTimer = setInterval(refreshState, 1200);
}

function stopPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = null;
}
