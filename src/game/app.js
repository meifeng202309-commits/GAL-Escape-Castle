import { getScene } from "../content/scenes.js";
import { loadSession, saveSession, clearSession } from "../state/session.js";
import { rpc } from "../supabase/client.js";
import { escapeHtml } from "../utils/html.js";
import { resolveLocalizedText } from "../content/localization.generated.js";

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
const sprint3bPanel = document.getElementById("sprint3bPanel");
const sprint3bText = document.getElementById("sprint3bText");
const sprint3bActions = document.getElementById("sprint3bActions");
const sprint3bStatus = document.getElementById("sprint3bStatus");

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
    await refreshSprint3b();
  } catch (error) {
    gameStatus.innerHTML = `<span class="bad">${escapeHtml(error.message)}</span>`;
  }
}

async function refreshSprint3b() {
  try {
    const state = await rpc("s3b_get_player_state", { p_room_code: session.room_code, p_session_token: session.session_token });
    renderSprint3b(state);
  } catch (error) {
    sprint3bPanel.classList.add("hidden");
    if (!String(error.message).includes("Could not find the function")) sprint3bStatus.textContent = error.message;
  }
}

const ACT1_CHOICES = {
  "GAL-A": [["study_map","act01-g.010"],["check_sound","act01-g.011"],["study_number_note","act01-g.012"],["search_room","act01-g.013"]],
  "GAL-B": [["read_diary","act01-a.007"],["check_door","act01-a.009"],["check_phone","act01-a.011"],["check_vent","act01-a.014"]],
  "GAL-C": [["read_notice","act01-l.009"],["study_watch","act01-l.012"],["try_star_key","act01-l.018"],["check_mirror","act01-l.020"]],
};
const MEETING_CHOICES = [["library","act02.004"],["great_hall","act02.005"],["main_gate","act02.006"],["west_tower","act02.007"],["chapel","act02.008"],["help","act02.009"]];
const ROUTE_CHOICES = [["known","act04-05.005"],["unknown","act04-05.006"],["inspect","act04-05.007"],["ask","act04-05.008"]];

function localizedHtml(key) {
  try { const value=resolveLocalizedText(key); return `<span lang="nl">${escapeHtml(value.nl)}</span>${value.zh ? `<span lang="zh">${escapeHtml(value.zh)}</span>` : ""}`; }
  catch { return `<span class="bad">Missing text: ${escapeHtml(key)}</span>`; }
}

function actionButtons(items, rpcName) {
  return `<div class="choice-list">${items.map(([id,key])=>`<button type="button" data-s3b-rpc="${rpcName}" data-s3b-choice="${escapeHtml(id)}">${localizedHtml(key)}</button>`).join("")}</div>`;
}

function renderSprint3b(state) {
  if (!state.active || !state.scene || !state.flow || !state.me) { sprint3bPanel.classList.add("hidden"); return; }
  sprint3bPanel.classList.remove("hidden"); sprint3bStatus.textContent="";
  sprint3bText.innerHTML=`<h3>${escapeHtml(state.scene.scene_id.replaceAll("_"," "))}</h3><div class="bilingual">${localizedHtml(state.scene.text_key)}</div>`;
  const me=state.me, scene=state.scene; let html="";
  if (!me.act1_locked_at) html=actionButtons(ACT1_CHOICES[session.role_slot]||[],"s3b_submit_act1_choice");
  else if (scene.scene_id==="act1_wake_up") html="<p class='warn'>Waiting for the other players…</p>";
  else if (!me.first_meeting_locked_at) html=actionButtons(MEETING_CHOICES,"s3b_submit_first_meeting");
  else if (!me.grab_complete) html=`<button type="button" data-s3b-rpc="s3b_grab">${localizedHtml("act02.014")}</button>`;
  else if (!me.left_start_room) html=`<button type="button" data-s3b-rpc="s3b_leave_start_room">${localizedHtml("act02.022")}</button>`;
  else if (scene.phase_key==="route_consequence") html="<button type='button' data-s3b-rpc='s3b_complete_foldback'>Continue toward Library</button>";
  else if (scene.phase_key==="wayfinding" && me.player_location!=="library") html=`<button type="button" data-s3b-rpc="s3b_follow_sign">${localizedHtml("act03.003")}</button>`;
  else if (scene.phase_key==="library_box" && !state.flow.puzzle_resolved_at) html=`<form id="libraryCodeForm" class="composer"><input id="libraryCode" inputmode="numeric" maxlength="5" pattern="[0-9]{5}" aria-label="5-digit lock"><button>Submit</button></form><p class="muted">Attempt ${state.flow.puzzle_attempt_number+1} · hint stage ${state.flow.puzzle_hint_stage} · deadline ${formatDeadline(state.flow.puzzle_deadline,"puzzle")}</p>`;
  else if (scene.scene_id==="act4_known_unknown" && !me.act4_locked_at) html=actionButtons(ROUTE_CHOICES,"s3b_submit_act4_choice");
  else if (state.flow.terminal_state) html="<div class='notice good'>Sprint 3B flow complete. ACT 6 is not active.</div>";
  else html="<p class='muted'>Waiting for the group state to advance.</p>";
  if (state.queued_first_messages?.length) html+=`<div class="notice">${state.queued_first_messages.map(x=>`<p>${escapeHtml(x.role_slot)}: ${escapeHtml(x.choice_id)}</p>`).join("")}</div>`;
  sprint3bActions.innerHTML=html;
  sprint3bActions.querySelectorAll("[data-s3b-rpc]").forEach(button=>button.addEventListener("click",()=>runSprint3bAction(button)));
  document.getElementById("libraryCodeForm")?.addEventListener("submit",submitLibraryCode);
}

async function runSprint3bAction(button) {
  button.disabled=true; const payload={p_room_code:session.room_code,p_session_token:session.session_token};
  if (button.dataset.s3bChoice) payload.p_choice_id=button.dataset.s3bChoice;
  try { await rpc(button.dataset.s3bRpc,payload); await refreshState(); }
  catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;button.disabled=false;}
}

async function submitLibraryCode(event) {
  event.preventDefault(); const input=document.getElementById("libraryCode");
  try { await rpc("s3b_submit_library_code",{p_room_code:session.room_code,p_session_token:session.session_token,p_code:input.value}); await refreshState(); }
  catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;}
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
  discussionTopic.innerHTML = discussion.topic.includes(".") ? localizedHtml(discussion.topic) : escapeHtml(discussion.topic);
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
      `<button type="button" data-vote-id="${escapeHtml(option.id)}">${option.label.includes(".") ? localizedHtml(option.label) : escapeHtml(option.label)}</button>`
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
    const result = await rpc("s2_submit_vote", {
      p_room_code: session.room_code,
      p_session_token: session.session_token,
      p_choice_id: choiceId,
    });
    if (result.status === "resolved") {
      const flow = await rpc("s3b_get_player_state", { p_room_code: session.room_code, p_session_token: session.session_token });
      if (flow.scene?.scene_id === "act2_first_contact") await rpc("s3b_apply_meeting_resolution", { p_room_code: session.room_code, p_session_token: session.session_token });
      if (flow.scene?.scene_id === "act5_route_discussion") await rpc("s3b_apply_act5_resolution", { p_room_code: session.room_code, p_session_token: session.session_token });
    }
    await refreshDiscussion();
    await refreshSprint3b();
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
