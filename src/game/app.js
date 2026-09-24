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
let currentDiscussion = null;
let currentSprint5State = null;

function requestIdentity(kind, identity, payload) {
  const key = `gal.pending.${kind}.${identity}`;
  const encoded = JSON.stringify(payload);
  const existing = JSON.parse(sessionStorage.getItem(key) || "null");
  if (existing?.payload === encoded && existing?.requestId) return { key, requestId: existing.requestId };
  const requestId = crypto.randomUUID();
  sessionStorage.setItem(key, JSON.stringify({ payload: encoded, requestId }));
  return { key, requestId };
}

function clearRequestIdentity(key) {
  sessionStorage.removeItem(key);
}

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
    const sprint1State = await rpc("s1_get_player_state", {
      p_room_code: session.room_code,
      p_session_token: session.session_token,
    });
    const discussionState = await rpc("s2_get_player_state", {
      p_room_code: session.room_code,
      p_session_token: session.session_token,
    });
    if (discussionState.active) {
      const sprint3bState = await rpc("s3b_get_player_state", {
        p_room_code: session.room_code,
        p_session_token: session.session_token,
      });
      const sprint5State = await rpc("s5_get_player_state", {p_room_code:session.room_code,p_session_token:session.session_token}).catch(()=>({active:false}));
      const pocketState = sprint5State.active ? await rpc("s3_get_player_state", {p_room_code:session.room_code,p_session_token:session.session_token}) : null;
      if (!sprint3bState.active || !sprint3bState.scene) throw new Error("Formal game state is unavailable. Retry before taking another action.");
      renderDiscussion(sprint5State.active ? await rpc("s5_get_discussion_state", {p_room_code:session.room_code,p_session_token:session.session_token}) : discussionState);
      if(sprint5State.active)renderSprint5(sprint5State,pocketState);else renderSprint3b(sprint3bState);
      return;
    }
    currentDiscussion = null;
    discussionPanel.classList.add("hidden");
    sprint3bPanel.classList.add("hidden");
    renderState(sprint1State);
  } catch (error) {
    choiceArea.classList.add("hidden");
    revealArea.classList.add("hidden");
    discussionPanel.classList.add("hidden");
    sprint3bPanel.classList.add("hidden");
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
const S5_PRIVATE=[["main_gate","act08.001"],["west_tower","act08.002"],["compare","act08.003"],["follow_group","act08.004"]];

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
  else if (scene.phase_key==="post_inspection_route") {
    if (state.my_post_inspection_vote) {
      html=`<div class="notice"><p class="good">${localizedHtml("discussion.vote_locked")}</p><p class="muted">${escapeHtml(String(state.post_inspection_vote_count || 0))}/3</p></div>`;
    } else {
      html=actionButtons([["known","act04-05.010"],["unknown","act04-05.011"]],"s3b_submit_post_inspection_route_vote");
    }
  }
  else html="";
  if (state.queued_first_messages?.length) html+=`<div class="notice">${state.queued_first_messages.map(x=>{
    const location=x.location_text_key ? resolveLocalizedText(x.location_text_key) : {nl:"",zh:""};
    return `<p>${localizedTemplateHtml(x.template_text_key,{player_display_name:x.display_name,location})}</p>`;
  }).join("")}</div>`;
  sprint3bActions.innerHTML=html;
  sprint3bActions.querySelectorAll("[data-s3b-rpc]").forEach(button=>button.addEventListener("click",()=>runSprint3bAction(button)));
  document.getElementById("libraryCodeForm")?.addEventListener("submit",submitLibraryCode);
}

function s5Buttons(items,rpcName){return `<div class="choice-list">${items.map(([id,key])=>`<button type="button" data-s5-rpc="${rpcName}" data-s5-choice="${id}">${localizedHtml(key)}</button>`).join("")}</div>`}
function renderSprint5(payload,pocket){
  currentSprint5State=payload;
  choiceArea.classList.add("hidden");revealArea.classList.add("hidden");sprint3bPanel.classList.remove("hidden");sprint3bStatus.textContent="";
  const s=payload.state;let visual="",actions="";
  if(s.phase_key.startsWith("act6"))visual=`<div class="portrait-stage"><img id="s5SceneImage" alt=""><img id="s5OverlayImage" class="portrait-overlay" alt=""></div>${localizedHtml(payload.presentation_text_key||"act06.001")}${s.phase_key==="act6_answer"?`<div class="route-evidence"><img id="s5MapImage" class="s5-scene" alt=""><div class="route-board"><b>${localizedHtml("act01-g.014")}</b><span aria-hidden="true">→</span><b>${localizedHtml("act01-g.015")}</b></div></div>`:""}`;
  if(s.phase_key.startsWith("act7"))visual=`<div class="clock-stage"><img id="s5SceneImage" class="s5-scene" alt=""><div class="clock" data-anchor="clock_A_face"><b>A</b><span>23:54</span><i class="hand clockwise"></i></div><div class="clock" data-anchor="clock_B_face"><b>B</b><span>11:54</span><i class="hand counterclockwise"></i></div><div class="clock" data-anchor="clock_C_face"><b>C</b><span>23:49</span><i class="hand stopped"></i></div></div><div class="bilingual">${localizedKeys(["act07.001","act07.002","act07.003","act07.004","act07.005","act07.006","act07.007"])}</div>${s.act7_wrong_attempts?localizedHtml(s.act7_wrong_attempts===1?"act07.012":s.act7_wrong_attempts===2?"act07.013":"act07.014"):""}`;
  const shareable=(pocket?.scene?.allow_share_photo?pocket.items||[]:[]).filter(x=>x.current_view);
  const evidence=[...(pocket?.items||[]),...(pocket?.group_items||[])].map(x=>localizedHtml(x.name_text_key||x.label_text_key)).join("")+(pocket?.observations||[]).map(x=>localizedHtml(x.display_text_key)).join("")+(pocket?.shared_photos||[]).map(x=>localizedHtml(x.label_text_key)).join("");
  const shareHtml=shareable.map(item=>`<div class="button-row">${["GAL-A","GAL-B","GAL-C"].filter(role=>role!==session.role_slot).map(role=>`<button data-share-role="${role}" data-share-item="${escapeHtml(item.item_key)}" data-share-view="${escapeHtml(item.current_view)}">${localizedHtml(item.name_text_key)} · ${escapeHtml(role)}</button>`).join("")}</div>`).join("");
  const pocketHtml=pocket?`<div class="notice evidence-panel">${evidence}${shareHtml}</div>`:"";
  if(s.phase_key.startsWith("act8"))visual=`${["act8_private","act8_final_vote"].includes(s.phase_key)?`<div class="act8-evidence"><img id="s5MapImage" class="s5-scene" alt=""><img id="s5PhotoImage" class="s5-scene" alt="">${localizedHtml("item.photo_1897")}</div>`:`<img id="s5SceneImage" class="s5-scene" alt="">`}<div class="bilingual">${s.phase_key==="act8_route"?localizedKeys(s.route_taken_act8==="main_gate"?["act08.005","act08.006","act08.007"]:["act08.010","act08.011"]):""}</div>${payload.private_choices_revealed.length?`<div class="notice">${payload.private_choices_revealed.map(x=>`${escapeHtml(x.role_slot)}: ${localizedHtml(({main_gate:"act08.001",west_tower:"act08.002",compare:"act08.003",follow_group:"act08.004"})[x.choice_id])}`).join("")}</div>`:""}${pocketHtml}`;
  if(["act6_vote","act7_vote","act8_final_vote"].includes(s.phase_key))actions="";
  else if(s.phase_key==="act8_private")actions=payload.my_private_choice?`<p class="good">${localizedHtml("discussion.vote_locked")}</p>`:s5Buttons(S5_PRIVATE,"s5_submit_private_choice");
  else if(s.phase_key==="act6_answer")actions=`${localizedHtml("act06.011")}<button type="button" data-s5-rpc="s5_advance">${localizedHtml("act06.012")}</button>`;
  else if(s.phase_key==="act7_solved")actions=`${localizedKeys(["act07.015","act07.016","act07.017"])}<button type="button" data-s5-rpc="s5_advance">${localizedHtml("act07.018")}</button>`;
  else if(s.phase_key==="act8_route")actions=`<button type="button" data-s5-rpc="s5_advance">${localizedHtml(s.route_taken_act8==="main_gate"?"act08.008":"act08.012")}</button>`;
  else actions=localizedHtml(s.route_taken_act8==="main_gate"?"act08.009":"act08.013");
  sprint3bText.innerHTML=`<p class="eyebrow">ACT ${s.act_no}</p>${visual}`;sprint3bActions.innerHTML=actions;
  hydrateS5Assets(s);
  sprint3bActions.querySelectorAll("[data-s5-rpc]").forEach(button=>button.addEventListener("click",()=>runSprint5Action(button)));
  sprint3bText.querySelectorAll("[data-share-role]").forEach(button=>button.addEventListener("click",()=>shareSprint5Photo(button)));
}
function anchor(asset,name){return asset?.ui_anchors?.find(item=>item.anchor_name===name)}
async function setS5Asset(id,key){const node=document.getElementById(id);if(!node)return null;const result=await rpc("asset_resolve",{p_asset_key:key}).catch(()=>null);if(!result?.ok){sprint3bStatus.textContent=`ASSET_UNAVAILABLE · ${key}`;return null}node.src=`https://qdcbdcjobzytzhnhfwyn.supabase.co/storage/v1/object/public/${result.storage_path}`;return result}
async function hydrateS5Assets(s){if(document.getElementById("s5MapImage"))await setS5Asset("s5MapImage","prop_gitte_castle_map");if(document.getElementById("s5PhotoImage"))await setS5Asset("s5PhotoImage","prop.photo_1897");const key=s.act_no===6?"shared.portrait_hall":s.act_no===7?"shared.clock_room":s.route_taken_act8==="west_tower"?"shared.west_tower_payoff":s.route_taken_act8==="main_gate"?"shared.main_gate":null;if(!key)return;const result=await setS5Asset("s5SceneImage",key);if(!result)return;if(s.act_no===6){const overlay=await rpc("asset_resolve",{p_asset_key:"overlay.portrait_eyes_open"}).catch(()=>null),node=document.getElementById("s5OverlayImage"),base=anchor(result,"portrait_main_face"),over=anchor(overlay,"portrait_main_face");if(!overlay?.ok||!base||!over){sprint3bStatus.textContent="ANCHOR_UNAVAILABLE · portrait_main_face";return}const scale=base.width_percent/over.width_percent;Object.assign(node.style,{left:`${base.x_percent-over.x_percent*scale}%`,top:`${base.y_percent-over.y_percent*scale}%`,width:`${100*scale}%`});node.src=`https://qdcbdcjobzytzhnhfwyn.supabase.co/storage/v1/object/public/${overlay.storage_path}`;node.classList.add("ready")}if(s.act_no===7)document.querySelectorAll("[data-anchor]").forEach(node=>{const a=anchor(result,node.dataset.anchor);if(!a){node.hidden=true;sprint3bStatus.textContent=`ANCHOR_UNAVAILABLE · ${node.dataset.anchor}`;return}Object.assign(node.style,{left:`${a.x_percent}%`,top:`${a.y_percent}%`,width:`${a.width_percent}%`,height:`${a.height_percent}%`})})}
async function shareSprint5Photo(button){button.disabled=true;try{await rpc("s3_share_photo",{p_room_code:session.room_code,p_session_token:session.session_token,p_recipient_role:button.dataset.shareRole,p_source_item_key:button.dataset.shareItem,p_source_view:button.dataset.shareView});await refreshState()}catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;button.disabled=false}}
async function runSprint5Action(button){button.disabled=true;const payload={p_room_code:session.room_code,p_session_token:session.session_token};let request;if(button.dataset.s5Choice){payload.p_choice_id=button.dataset.s5Choice;request=requestIdentity("s5",`${button.dataset.s5Rpc}.${currentSprint5State.state.phase_key}.${currentSprint5State.state.vote_round}`,{choice:payload.p_choice_id});payload.p_client_request_id=request.requestId}if(button.dataset.s5Rpc==="s5_submit_vote"){payload.p_expected_discussion_session_id=currentSprint5State.discussion.discussion_session_id;payload.p_expected_vote_round=currentSprint5State.discussion.vote_round}try{await rpc(button.dataset.s5Rpc,payload);if(request)clearRequestIdentity(request.key);await refreshState()}catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;button.disabled=false}}

async function runSprint3bAction(button) {
  button.disabled=true; const payload={p_room_code:session.room_code,p_session_token:session.session_token};
  if (button.dataset.s3bChoice) payload.p_choice_id=button.dataset.s3bChoice;
  try { await rpc(button.dataset.s3bRpc,payload); await refreshState(); }
  catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;button.disabled=false;}
}

async function submitLibraryCode(event) {
  event.preventDefault(); const input=document.getElementById("libraryCode");
  const code=`${input.dataset.lockedPrefix||""}${input.value}`;
  const request=requestIdentity("library",session.room_code,{code});
  try { await rpc("s3b_submit_library_code",{p_room_code:session.room_code,p_session_token:session.session_token,p_client_request_id:request.requestId,p_code:code}); clearRequestIdentity(request.key); await refreshState(); }
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
    currentDiscussion = null;
    discussionPanel.classList.add("hidden");
    return;
  }

  const discussion = state.discussion;
  currentDiscussion = {
    discussion_session_id: discussion.discussion_session_id,
    vote_round: discussion.vote_round,
    status: discussion.status,
  };
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
  if (!text || !session || !currentDiscussion) return;
  const request = requestIdentity("message", currentDiscussion.discussion_session_id, { text });
  sendMessageButton.disabled = true;
  try {
    await rpc(currentSprint5State?.active ? "s5_send_message" : "s2_send_message", {
      p_room_code: session.room_code,
      p_session_token: session.session_token,
      p_expected_discussion_session_id: currentDiscussion.discussion_session_id,
      p_expected_vote_round: currentDiscussion.vote_round,
      p_client_request_id: request.requestId,
      p_message_text: text,
    });
    clearRequestIdentity(request.key);
    messageText.value = "";
    await refreshDiscussion();
  } catch (error) {
    discussionStatus.innerHTML = `<span class="bad">${escapeHtml(error.message)}</span>`;
  } finally {
    sendMessageButton.disabled = false;
  }
}

async function submitVote(choiceId) {
  if (!currentDiscussion) return;
  voteArea.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  try {
    const request=requestIdentity("s5-vote",currentDiscussion.discussion_session_id,{choiceId});
    await rpc(currentSprint5State?.active ? "s5_submit_vote" : "s2_submit_vote", {
      p_room_code: session.room_code,
      p_session_token: session.session_token,
      p_expected_discussion_session_id: currentDiscussion.discussion_session_id,
      p_expected_vote_round: currentDiscussion.vote_round,
      ...(currentSprint5State?.active ? {p_client_request_id:request.requestId} : {}),
      p_choice_id: choiceId,
    });
    clearRequestIdentity(request.key);
    await refreshState();
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
