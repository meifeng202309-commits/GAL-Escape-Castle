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
  "GAL-A": [["study_map","act01-g.019"],["check_sound","act01-g.020"],["study_number_note","act01-g.021"],["search_room","act01-g.022"]],
  "GAL-B": [["read_diary","act01-a.006"],["check_door","act01-a.007"],["check_phone","act01-a.008"],["check_vent","act01-a.009"]],
  "GAL-C": [["read_notice","act01-l.012"],["study_watch","act01-l.013"],["try_star_key","act01-l.014"],["check_mirror","act01-l.015"]],
};
const MEETING_CHOICES = [["library","act02.004"],["great_hall","act02.005"],["main_gate","act02.006"],["west_tower","act02.007"],["chapel","act02.008"],["help","act02.009"]];
const LOCATION_KEYS = {library:"act01-g.009",great_hall:"act01-g.010",main_gate:"act01-g.011",west_tower:"act01-g.012",chapel:"act01-g.013"};
const ROUTE_CHOICES = [["known","act04-05.005"],["unknown","act04-05.006"],["inspect","act04-05.007"],["ask","act04-05.008"]];

function localizedHtml(key) {
  try { const value=resolveLocalizedText(key); return `<span lang="nl">${escapeHtml(value.nl)}</span>${value.zh ? `<span lang="zh">${escapeHtml(value.zh)}</span>` : ""}`; }
  catch { return `<span class="bad">Missing text: ${escapeHtml(key)}</span>`; }
}

function localizedTemplateHtml(key, replacements={}) {
  try {
    const value=resolveLocalizedText(key);
    const apply=(text,language)=>Object.entries(replacements).reduce((result,[token,replacement])=>result.replaceAll(`{${token}}`,typeof replacement==="object" ? replacement[language]||"" : replacement||""),text||"");
    return `<span lang="nl">${escapeHtml(apply(value.nl,"nl"))}</span>${value.zh ? `<span lang="zh">${escapeHtml(apply(value.zh,"zh"))}</span>` : ""}`;
  } catch { return `<span class="bad">Missing text: ${escapeHtml(key)}</span>`; }
}

function actionButtons(items, rpcName) {
  return `<div class="choice-list">${items.map(([id,key])=>`<button type="button" data-s3b-rpc="${rpcName}" data-s3b-choice="${escapeHtml(id)}">${localizedHtml(key)}</button>`).join("")}</div>`;
}

function localizedKeys(keys=[]) { return keys.map(localizedHtml).join(""); }

function renderSprint3b(state) {
  if (!state.active || !state.scene || !state.flow || !state.me) { sprint3bPanel.classList.add("hidden"); choiceArea.classList.remove("hidden"); revealArea.classList.remove("hidden"); return; }
  choiceArea.classList.add("hidden"); revealArea.classList.add("hidden");
  sprint3bPanel.classList.remove("hidden"); sprint3bStatus.textContent="";
  const me=state.me, scene=state.scene; let html="";
  const routeLocationKey=LOCATION_KEYS[scene.current_route_target];
  sprint3bText.innerHTML=scene.phase_key==="route_update"
    ? `<div class="bilingual">${localizedTemplateHtml("act02.032",{location:routeLocationKey ? resolveLocalizedText(routeLocationKey) : ""})}${localizedHtml("act02.033")}</div>`
    : `<div class="bilingual">${localizedHtml(state.scene.text_key)}</div>${state.scene.phase_key==="post_inspection_route" ? `<div class="bilingual">${localizedHtml("act04-05.016")}${localizedHtml("act04-05.017")}</div>` : ""}`;
  if (scene.scene_id==="act1_wake_up" && me.act1_stage==="opening") html=`<div class="notice">${localizedKeys(me.act1_text_keys)}</div><button type="button" data-s3b-rpc="s3b_ack_act1_opening">${localizedHtml("common.004")}</button>`;
  else if (scene.scene_id==="act1_wake_up" && me.act1_stage==="action") html=actionButtons(ACT1_CHOICES[session.role_slot]||[],"s3b_submit_act1_choice");
  else if (scene.scene_id==="act1_wake_up" && me.act1_stage==="consequence") html=`<div class="notice">${localizedKeys(me.act1_text_keys)}</div><button type="button" data-s3b-rpc="s3b_complete_act1">${localizedHtml("common.004")}</button>`;
  else if (scene.scene_id==="act1_wake_up") html=`<p class="warn">${localizedHtml("act01-g.031")}</p>`;
  else if (!me.first_meeting_locked_at) html=actionButtons(MEETING_CHOICES,"s3b_submit_first_meeting");
  else if (!me.grab_complete) html=`<button type="button" data-s3b-rpc="s3b_grab">${localizedHtml("act02.014")}</button>`;
  else if (!me.left_start_room) html=`<button type="button" data-s3b-rpc="s3b_leave_start_room">${localizedHtml("act02.022")}</button>`;
  else if (scene.phase_key==="route_update" && !me.route_update_ack_at) html=`<button type="button" data-s3b-rpc="s3b_ack_route_update">${localizedHtml("common.004")}</button>`;
  else if (scene.phase_key==="route_consequence") html=`<button type="button" data-s3b-rpc="s3b_complete_foldback">${localizedHtml("act02.042")}</button>`;
  else if (scene.phase_key==="wayfinding" && me.player_location!=="library") html=`<button type="button" data-s3b-rpc="s3b_follow_sign">${localizedHtml("act03.003")}</button>`;
  else if (scene.phase_key==="library_box" && !state.flow.puzzle_resolved_at) { const locked=state.flow.puzzle_locked_prefix||""; const remaining=5-locked.length; html=`<form id="libraryCodeForm" class="composer"><div class="locked-wheels"><b>${escapeHtml(locked)}</b><input id="libraryCode" inputmode="numeric" maxlength="${remaining}" pattern="[0-9]{${remaining}}" data-locked-prefix="${escapeHtml(locked)}"></div><button>${localizedHtml("act03.009")}</button></form>${state.flow.puzzle_hint_stage ? `<div class="notice">${localizedHtml([null,"act03.011","act03.012","act03.013","act03.014","act03.017","act03.018","act03.019","act03.020"][state.flow.puzzle_hint_stage])}</div>` : ""}`; }
  else if (scene.scene_id==="act4_known_unknown" && !me.act4_locked_at) html=actionButtons(ROUTE_CHOICES,"s3b_submit_act4_choice");
  else if (scene.phase_key==="post_inspection_route") html=actionButtons([["known","act04-05.010"],["unknown","act04-05.011"]],"s3b_choose_post_inspection_route");
  else html="";
  if (state.queued_first_messages?.length) html+=`<div class="notice">${state.queued_first_messages.map(x=>{
    const location=x.location_text_key ? resolveLocalizedText(x.location_text_key) : {nl:"",zh:""};
    return `<p>${localizedTemplateHtml(x.template_text_key,{player_display_name:x.display_name,location})}</p>`;
  }).join("")}</div>`;
  sprint3bActions.innerHTML=html;
  sprint3bActions.querySelectorAll("[data-s3b-rpc]").forEach(button=>button.addEventListener("click",()=>runSprint3bAction(button)));
  document.getElementById("libraryCodeForm")?.addEventListener("submit",submitLibraryCode);
}

async function runSprint3bAction(button) {
  button.disabled=true; const payload={p_room_code:session.room_code,p_session_token:session.session_token};
  if (button.dataset.s3bChoice) payload[button.dataset.s3bRpc==="s3b_choose_post_inspection_route" ? "p_route" : "p_choice_id"]=button.dataset.s3bChoice;
  try { await rpc(button.dataset.s3bRpc,payload); await refreshState(); }
  catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;button.disabled=false;}
}

async function submitLibraryCode(event) {
  event.preventDefault(); const input=document.getElementById("libraryCode");
  try { await rpc("s3b_submit_library_code",{p_room_code:session.room_code,p_session_token:session.session_token,p_code:`${input.dataset.lockedPrefix||""}${input.value}`}); await refreshState(); }
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
      discussionStatus.textContent = error.message;
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
  discussionMeta.innerHTML = localizedTemplateHtml("discussion.vote_round", {round_no:String(discussion.vote_round)});
  discussionDeadline.textContent = formatDeadline(discussion.phase_deadline, discussion.status);
  discussionStatus.textContent = "";

  initialChoiceArea.innerHTML = state.initial_choices.length
    ? `<div class="notice"><h4>${localizedHtml("discussion.initial_choices")}</h4>${state.initial_choices.map((choice) =>
      `<p>${escapeHtml(choice.display_name)}: <b>${choice.choice_label.includes(".") ? localizedHtml(choice.choice_label) : escapeHtml(choice.choice_label)}</b></p>`
    ).join("")}</div>`
    : "";

  transcript.innerHTML = state.messages.length
    ? state.messages.map((message) => `
      <article class="message">
        <div><b>${escapeHtml(message.display_name)}</b><time>${escapeHtml(formatTime(message.created_at))}</time></div>
        <p>${escapeHtml(message.message_text)}</p>
      </article>`).join("")
    : `<p class="muted">${localizedHtml("discussion.no_messages")}</p>`;
  transcript.scrollTop = transcript.scrollHeight;

  messageComposer.classList.toggle("hidden", discussion.status !== "discussion");
  renderVote(state);
  renderVoteHistory(state.vote_history);
}

function renderVote(state) {
  const discussion = state.discussion;
  if (!discussion.require_final_vote) {
    voteArea.innerHTML = "";
    return;
  }

  if (discussion.status === "discussion") {
    voteArea.innerHTML = `<p class="muted">${localizedHtml("discussion.voting_after_discussion")}</p>`;
    return;
  }

  if (discussion.status === "waiting_for_missing_player") {
    voteArea.innerHTML = `<div class="notice warn"><b>${localizedHtml("discussion.waiting_missing_player")}</b><p>${localizedTemplateHtml("discussion.votes_received_progress", {submitted:String(state.submitted_vote_count)})}</p></div>`;
    return;
  }

  if (discussion.status === "resolved") {
    voteArea.innerHTML = state.revealed_votes.length ? `<div class="notice">${state.revealed_votes.map((vote) =>
      `<p>${escapeHtml(vote.display_name)}: <b>${vote.choice_label.includes(".") ? localizedHtml(vote.choice_label) : escapeHtml(vote.choice_label)}</b></p>`
    ).join("")}</div>` : "";
    return;
  }

  if (state.my_vote) {
    voteArea.innerHTML = `<div class="notice"><p class="good">${localizedHtml("discussion.vote_locked")} <b>${state.my_vote.choice_label.includes(".") ? localizedHtml(state.my_vote.choice_label) : escapeHtml(state.my_vote.choice_label)}</b></p><p class="muted">${localizedTemplateHtml("discussion.submitted_progress", {submitted:String(state.submitted_vote_count)})}</p></div>`;
    return;
  }

  voteArea.innerHTML = `
    <h4>${localizedHtml("discussion.final_vote")}</h4>
    <div class="choice-list">${discussion.vote_options.map((option) =>
      `<button type="button" data-vote-id="${escapeHtml(option.id)}">${option.label.includes(".") ? localizedHtml(option.label) : escapeHtml(option.label)}</button>`
    ).join("")}</div>
    <p class="muted">${localizedTemplateHtml("discussion.submitted_progress", {submitted:String(state.submitted_vote_count)})}</p>`;
  voteArea.querySelectorAll("[data-vote-id]").forEach((button) => {
    button.addEventListener("click", () => submitVote(button.dataset.voteId));
  });
}

function renderVoteHistory(history) {
  voteHistory.innerHTML = history.length
    ? `<details><summary>${localizedHtml("discussion.previous_vote_rounds")}</summary>${history.map((round) => `
      <div class="history-round"><b>${localizedTemplateHtml("discussion.vote_round", {round_no:String(round.vote_round)})}</b></div>`
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
    discussionStatus.innerHTML = `<span class="bad">${escapeHtml(error.message)}</span>`;
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
    discussionStatus.innerHTML = `<span class="bad">${escapeHtml(error.message)}</span>`;
    voteArea.querySelectorAll("button").forEach((button) => { button.disabled = false; });
  }
}

function formatDeadline(value, status) {
  if (!value) return "";
  const seconds = Math.max(0, Math.ceil((new Date(value).getTime() - Date.now()) / 1000));
  return `${seconds}s`;
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
