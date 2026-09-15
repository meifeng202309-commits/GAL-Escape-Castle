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

let session = loadSession();
let pollTimer = null;

joinButton.addEventListener("click", joinRoom);
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
  } catch (error) {
    gameStatus.innerHTML = `<span class="bad">${escapeHtml(error.message)}</span>`;
  }
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
