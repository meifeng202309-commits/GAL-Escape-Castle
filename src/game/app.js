import { getScene } from "../content/scenes.js";
import { loadSession, saveSession, clearSession } from "../state/session.js";
import { rpc } from "../supabase/client.js";
import { escapeHtml } from "../utils/html.js";
import { resolveLocalizedText } from "../content/localization.generated.js";
import { createAssetResolver } from "./asset-runtime.js";

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
const formalSceneMount = document.getElementById("formalSceneMount");
const sprint6DiscussionMount = document.getElementById("sprint6DiscussionMount");
const pocketMount = document.getElementById("pocketMount");

let session = loadSession();
let pollTimer = null;
let pollingEnabled = false;
let playerSessionEpoch = 0;
let refreshGeneration = 0;
let refreshInFlight = null;
let refreshQueued = null;
let lastConfirmedFrame = null;
const refreshDisabledControls = new Set();
let currentDiscussion = null;
let currentSprint5State = null;
let currentSprint6State = null;
let currentSprint3bState = null;
let sprint8RevealRunId = "";
let sprint8RevealTimer = null;
let sprint6AudioIdentity = "";
const sprint6AudioHandles = new Map();
const sprint6AudioUrls = new Map();
let sprint6AudioArmed = false;
let sprint6PendingAudio = null;
let sprint6LeverTimer = null;
let sprint6VolumeMode = localStorage.getItem("gal.s6.audio-mode") || "full";
const SPRINT6_AUDIO_OUTBOX_KEY = "gal.s6.audio-consumption-outbox";
const trialAssetResolver=createAssetResolver(rpc);
const discussionViewportState=new Map(),pendingMessageAcks=new Map();
const stableHtmlByNode=new WeakMap(),assetUrlCache=new Map();
let selectedPocketItem="";
let playerCompositionActive=false,deferredCompositionFrame=null;

document.addEventListener("compositionstart",event=>{if(event.target?.matches?.("#messageText,#s6MessageText,#libraryCode"))playerCompositionActive=true},true);
document.addEventListener("compositionend",event=>{if(!event.target?.matches?.("#messageText,#s6MessageText,#libraryCode"))return;playerCompositionActive=false;const frame=deferredCompositionFrame;deferredCompositionFrame=null;if(frame)commitPlayerFrame(frame);queueMicrotask(()=>void refreshState())},true);

function sprint6AudioOutbox() {
  try {
    return JSON.parse(localStorage.getItem(SPRINT6_AUDIO_OUTBOX_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveSprint6AudioOutbox(outbox) {
  localStorage.setItem(SPRINT6_AUDIO_OUTBOX_KEY, JSON.stringify(outbox));
}

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
document.addEventListener("pointerdown", armSprint6Audio, { once: true });
document.addEventListener("pointerdown", retryPendingSprint6Audio);
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
    stopPolling();
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

function createRefreshDeferred() {
  let resolve;
  const promise = new Promise((settle) => { resolve = settle; });
  return { promise, resolve };
}

function refreshCanCommit(run) {
  return !run.cancelled
    && session === run.activeSession
    && playerSessionEpoch === run.epoch
    && refreshGeneration === run.generation;
}

async function readPlayerProjection(name, payload) {
  let value;
  try {
    value = await rpc(name, payload);
  } catch (error) {
    const wrapped = new Error(`${name} refresh failed: ${error.message}`);
    wrapped.name = "PlayerRefreshReadError";
    wrapped.projection = name;
    wrapped.cause = error;
    throw wrapped;
  }
  if (!value || typeof value !== "object") {
    const invariant = new Error(`${name} returned an invalid projection.`);
    invariant.name = "PlayerRefreshInvariantError";
    invariant.projection = name;
    throw invariant;
  }
  return value;
}

async function settlePlayerProjectionReads(reads) {
  const settled = await Promise.allSettled(reads);
  const failed = settled.find((result) => result.status === "rejected");
  if (failed) throw failed.reason;
  return settled.map((result) => result.value);
}

async function loadPlayerFrame(activeSession) {
  const auth = { p_room_code: activeSession.room_code, p_session_token: activeSession.session_token };
  // Completion remains the first lifecycle authority even though no active run remains.
  // Static lifecycle contract marker: rpc("s8_get_player_state") precedes active-run dispatch.
  const completedState = await readPlayerProjection("s8_get_player_state", auth);
  if (completedState.active && completedState.game_completed) return { kind: "completed", completedState };

  // Static lifecycle contract marker: rpc("s2_get_player_state") follows the completed-state read.
  const discussionState = await readPlayerProjection("s2_get_player_state", auth);
  if (!discussionState.active) return { kind: "pre-run", discussionState };

  const [sprint3bState, sprint5State, sprint6State, sprint8State, pocketState] = await settlePlayerProjectionReads([
    readPlayerProjection("s3b_get_player_state", auth),
    readPlayerProjection("s5_get_player_state", auth),
    readPlayerProjection("s6_get_player_state", auth),
    readPlayerProjection("s8_get_player_state", auth),
    readPlayerProjection("s3_get_player_state", auth),
  ]);
  const [sprint5Discussion, sprint6WaitState] = await settlePlayerProjectionReads([
    sprint5State.active ? readPlayerProjection("s5_get_discussion_state", auth) : Promise.resolve(null),
    sprint6State.active ? readPlayerProjection("s9_get_player_wait_state", auth) : Promise.resolve(null),
  ]);
  if (sprint6State.active) sprint6State.wait_state = sprint6WaitState;

  if (!sprint3bState.active || !sprint3bState.scene) {
    return { kind: "starting", discussionState, sprint3bState, sprint5State, sprint6State, sprint8State, pocketState, sprint5Discussion };
  }
  const act5Handoff = sprint3bState.flow?.terminal_state==="SPRINT3B_COMPLETE" && sprint5State.active && !sprint3bState.me?.act6_entered_at;
  if (act5Handoff) return { kind: "act5-handoff", sprint3bState, sprint5State };
  const act6Waiting = sprint5State.active && sprint5State.state?.phase_key==="act6_vote" && sprint3bState.me?.act6_entered_at && !sprint5State.canonical_discussion;
  if (act6Waiting) return { kind: "act6-waiting" };
  return {
    kind: "active",
    discussionView: sprint5State.active ? sprint5Discussion : discussionState,
    sprint3bState,
    sprint5State,
    sprint6State,
    sprint8State,
    pocketState,
  };
}

function commitPlayerFrame(frame) {
  if(playerCompositionActive){deferredCompositionFrame=frame;return}
  currentSprint5State = frame.kind === "active" && frame.sprint5State?.active ? frame.sprint5State : null;
  restoreRefreshDisabledPlayerMutations();
  gameStatus.textContent = "";
  if (frame.kind === "completed") {
    currentDiscussion = null;
    discussionPanel.classList.add("hidden");
    renderSprint8(frame.completedState);
    return;
  }
  if (frame.kind === "pre-run") {
    renderLifecycleNotice("pre-run", "You are connected. Wait for the Teacher to start the formal run.");
    return;
  }
  if (frame.kind === "starting") {
    renderLifecycleNotice("starting", "Formal game initialization is still completing. Please wait; no action has been lost.");
    return;
  }
  if (frame.kind === "act5-handoff") {
    currentDiscussion = null;
    discussionPanel.classList.add("hidden");
    renderAct5Handoff(frame.sprint3bState, frame.sprint5State);
    return;
  }
  if (frame.kind === "act6-waiting") {
    currentDiscussion = null;
    discussionPanel.classList.add("hidden");
    renderAct6EntryBarrier();
    return;
  }
  const runtimeViewport={top:sprint3bPanel.scrollTop,identity:sprint3bPanel.dataset.runtimeIdentity||""};
  renderDiscussion(frame.discussionView);
  if (frame.sprint8State.active) renderSprint8(frame.sprint8State);
  else if (frame.sprint6State.active) {
    const priorSprint6Identity=sprint6DiscussionIdentity(currentSprint6State);
    const priorSprint6Draft=captureSprint6DiscussionDraft();
    captureDiscussionViewport(sprint6DiscussionMount.querySelector(".transcript"),priorSprint6Identity);
    renderSprint6(frame.sprint6State);
    relocateSprint6Discussion();
    restoreSprint6DiscussionDraft(priorSprint6Draft,frame.sprint6State);
    const nextSprint6Identity=sprint6DiscussionIdentity(frame.sprint6State);
    restoreDiscussionViewport(sprint6DiscussionMount.querySelector(".transcript"),nextSprint6Identity);
    acknowledgePendingMessage(nextSprint6Identity,document.getElementById("s6MessageText"),sprint6DiscussionMount);
    renderPocket(frame.pocketState,frame.sprint6State.state.phase_key);
    renderSprint6AcceptedWaiting(frame.sprint6State);
  } else if (frame.sprint5State.active){renderSprint5(frame.sprint5State, frame.pocketState);renderPocket(frame.pocketState,frame.sprint5State.state.phase_key)}
  else {renderSprint3b(frame.sprint3bState, frame.pocketState);renderPocket(frame.pocketState,frame.sprint3bState.scene?.phase_key||"")}
  const nextRuntimeIdentity=sprint3bPanel.dataset.runtimeIdentity||"";
  if(runtimeViewport.identity&&runtimeViewport.identity===nextRuntimeIdentity)sprint3bPanel.scrollTop=runtimeViewport.top;
}

function disableUnverifiedPlayerMutations() {
  for (const root of [choiceArea, discussionPanel, sprint3bActions]) {
    root.querySelectorAll("button,input,textarea,select").forEach((control) => {
      if (control.disabled) return;
      control.disabled = true;
      refreshDisabledControls.add(control);
    });
  }
}

function restoreRefreshDisabledPlayerMutations() {
  for (const control of refreshDisabledControls) {
    if (control.isConnected) control.disabled = false;
  }
  refreshDisabledControls.clear();
}

function showPlayerRefreshFailure(error) {
  disableUnverifiedPlayerMutations();
  const prefix = lastConfirmedFrame ? "Refresh failed; showing the last confirmed state." : "Unable to load a confirmed game state.";
  gameStatus.innerHTML = `<span class="bad">${escapeHtml(`${prefix} ${error.message}`)}</span>`;
}

function scheduleNextPlayerPoll() {
  if (!pollingEnabled || !session || refreshInFlight || refreshQueued || pollTimer) return;
  pollTimer = setTimeout(() => {
    pollTimer = null;
    void refreshState();
  }, 1200);
}

function startQueuedPlayerRefresh() {
  const queued = refreshQueued;
  refreshQueued = null;
  if (!queued) return false;
  if (queued.epoch !== playerSessionEpoch || queued.activeSession !== session) {
    queued.deferred.resolve({ status: "invalidated" });
    return false;
  }
  startPlayerRefresh(queued.activeSession, queued.epoch, queued.generation, queued.deferred);
  return true;
}

function startPlayerRefresh(activeSession, epoch, generation, deferred = createRefreshDeferred()) {
  const run = { activeSession, epoch, generation, deferred, cancelled: false, settled: false };
  refreshInFlight = run;
  void (async () => {
    let result;
    try {
      const frame = await loadPlayerFrame(activeSession);
      if (!refreshCanCommit(run)) result = { status: "discarded" };
      else {
        commitPlayerFrame(frame);
        lastConfirmedFrame = frame;
        result = { status: "committed", generation };
      }
    } catch (error) {
      if (refreshCanCommit(run)) showPlayerRefreshFailure(error);
      const failedStatus = error.name === "PlayerRefreshInvariantError" ? "invariant_breach" : "fetch_error";
      result = { status: refreshCanCommit(run) ? failedStatus : "discarded", error };
    } finally {
      if (!run.settled) {
        run.settled = true;
        deferred.resolve(result || { status: "discarded" });
      }
      if (refreshInFlight === run) {
        refreshInFlight = null;
        if (!startQueuedPlayerRefresh()) scheduleNextPlayerPoll();
      }
    }
  })();
  return deferred.promise;
}

function refreshState() {
  const activeSession = session;
  if (!activeSession) return Promise.resolve({ status: "no_session" });
  const epoch = playerSessionEpoch;
  if (refreshInFlight) {
    if (!refreshQueued || refreshQueued.epoch !== epoch || refreshQueued.activeSession !== activeSession) {
      const deferred = createRefreshDeferred();
      refreshQueued = { activeSession, epoch, generation: ++refreshGeneration, deferred, promise: deferred.promise };
    }
    return refreshQueued.promise;
  }
  return startPlayerRefresh(activeSession, epoch, ++refreshGeneration);
}

if (globalThis.__GAL_A1_TEST_HOOKS__) {
  Object.assign(globalThis.__GAL_A1_TEST_HOOKS__, {
    refreshState,
    startPolling,
    stopPolling,
    coordinatorState: () => ({
      epoch: playerSessionEpoch,
      generation: refreshGeneration,
      inFlight: Boolean(refreshInFlight),
      queued: Boolean(refreshQueued),
      pollingEnabled,
    }),
  });
}

function renderAct6EntryBarrier(){
  formalSceneMount.replaceChildren();
  choiceArea.classList.add("hidden");
  revealArea.classList.add("hidden");
  sprint3bPanel.classList.remove("hidden");
  sprint3bText.innerHTML=`<div class="notice"><p>${localizedHtml("act04-05.022")}</p><p>Waiting for every player to enter Portrait Hall. The 90-second discussion has not started.</p></div>`;
  sprint3bActions.innerHTML="";
  sprint3bStatus.textContent="";
}

function renderLifecycleNotice(state,message){
  currentDiscussion=null;
  formalSceneMount.replaceChildren();
  choiceArea.classList.add("hidden");
  revealArea.classList.add("hidden");
  discussionPanel.classList.add("hidden");
  sprint3bPanel.classList.remove("hidden");
  playerLabel.textContent=`${session.display_name} · ${session.room_code}`;
  sceneTitle.textContent=state==="pre-run"?"Waiting for formal run":"Formal game starting";
  sceneText.textContent="";
  sprint3bText.innerHTML=`<div class="notice"><p>${escapeHtml(message)}</p></div>`;
  sprint3bActions.innerHTML="";
  sprint3bStatus.textContent="";
  gameStatus.textContent="";
}

function renderAct5Handoff(sprint3bState,sprint5State){
  formalSceneMount.replaceChildren();
  choiceArea.classList.add("hidden");
  revealArea.classList.add("hidden");
  sprint3bPanel.classList.remove("hidden");
  sprint3bStatus.textContent="";
  const route=sprint3bState.flow?.group_route;
  const keys=route==="known"?["act04-05.019","act04-05.020","act04-05.021","act04-05.022","act04-05.023"]:["act04-05.024","act04-05.025","act04-05.026","act04-05.027","act04-05.022","act04-05.023"];
  sprint3bText.innerHTML=`<div class="bilingual">${localizedKeys(keys)}</div>`;
  sprint3bActions.innerHTML=`<button id="enterAct6" type="button" disabled>${localizedHtml("act04-05.023")}</button>`;
  const enterButton=document.getElementById("enterAct6");
  rpc("s9_observe_act5_handoff",{p_room_code:session.room_code,p_session_token:session.session_token,p_expected_run_id:sprint5State.state.run_id})
    .then(()=>{if(document.getElementById("enterAct6")===enterButton)enterButton.disabled=false;})
    .catch(error=>{if(document.getElementById("enterAct6")===enterButton)sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;});
  enterButton?.addEventListener("click",async(event)=>{
    event.currentTarget.disabled=true;
    try{
      await rpc("s9_enter_act6",{p_room_code:session.room_code,p_session_token:session.session_token,p_expected_run_id:sprint5State.state.run_id});
      await refreshState();
    }catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;event.currentTarget.disabled=false;}
  });
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
const S6_DOORS=[["red","act09.011"],["blue","act09.012"],["black","act09.013"]];
const S6_SCENE_ASSETS=new Set(["shared.great_hall","prop.golden_key","shared.main_gate","ending.castle_exterior"]);
const TRIAL_PLACEHOLDER_PATHS={"opening.gitte_room":"assets/staging/opening.gitte_room/v001/opening.gitte_room__v001.svg","opening.anna_room":"assets/staging/opening.anna_room/v001/opening.anna_room__v001.svg","opening.linda_study":"assets/staging/opening.linda_study/v001/opening.linda_study__v001.svg","ending.castle_exterior":"assets/staging/ending.castle_exterior/v001/ending.castle_exterior__v001.svg"};
const EMPTY_IMAGE="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

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
function acceptedWaiting(progress=""){return `<div class="notice accepted-waiting"><p class="good">Action accepted and locked.</p><p class="muted">Waiting for the other players${progress?` · ${escapeHtml(progress)}`:""}.</p></div>`}

function setStableHtml(node,html){if(stableHtmlByNode.get(node)===html&&node.childNodes.length)return false;node.innerHTML=html;stableHtmlByNode.set(node,html);return true}

function routeFormalPresentation(){
  const desired=[];
  for(const selector of[":scope > #s3bSceneImage",":scope > .act4-comparison",":scope > #s5SceneImage",":scope > .portrait-stage",":scope > .clock-stage",":scope > .route-evidence",":scope > .act8-evidence",":scope > .s6-stage > .s6-scene-wrap",":scope > .s6-stage > .s6-station-legend"]){
    const node=sprint3bText.querySelector(selector);
    if(node){desired.push(node);if(node.parentElement!==formalSceneMount)formalSceneMount.append(node)}
  }
  if(desired.length)for(const node of[...formalSceneMount.children])if(!desired.includes(node))node.remove();
  for(const node of sprint3bActions.querySelectorAll(":scope > .notice, :scope > .bilingual, :scope > .warn, :scope > span[lang]"))sprint3bText.append(node);
  const audioControls=sprint3bText.querySelector(":scope > .s6-audio-controls");
  if(audioControls)sprint3bActions.prepend(audioControls);
}

function act4ComparisonHtml() {
  const lindaRecognition=session.role_slot==="GAL-C"?`<div class="notice act4-linda-recognition">${localizedHtml("act04-05.003")}</div>`:"";
  return `<section class="act4-comparison" aria-label="Known route and unknown passage comparison">
    <article class="act4-evidence-card">
      <div class="act4-media"><img id="act4MapImage" class="s5-scene" alt=""></div>
      <div class="act4-route-highlight">${localizedHtml("act04-05.001")}</div>
    </article>
    <article class="act4-evidence-card">
      <div class="act4-media"><img id="act4LibraryImage" class="s5-scene" alt=""><span class="act4-door-marker" data-anchor="library_unknown_door" hidden aria-hidden="true">★</span></div>
      <div class="act4-door-caption">${localizedHtml("act04-05.002")}</div>
      ${lindaRecognition}
    </article>
  </section>`;
}

function act4RevealHtml(revealed=[]) {
  if(revealed.length!==3)return"";
  const choiceKeys=Object.fromEntries(ROUTE_CHOICES);
  return `<section class="notice act4-reveal" aria-live="polite"><div class="bilingual">${localizedHtml("act04-05.018")}</div><ol>${revealed.map(item=>`<li><b>${escapeHtml(item.role_slot)}</b>${localizedHtml(choiceKeys[item.choice_id])}</li>`).join("")}</ol></section>`;
}

async function hydrateAct4Comparison() {
  const [,library]=await Promise.all([setS5Asset("act4MapImage","prop_gitte_castle_map"),setS5Asset("act4LibraryImage","shared.library")]);
  const marker=document.querySelector('.act4-door-marker[data-anchor="library_unknown_door"]');
  const door=anchor(library,"library_unknown_door");
  if(!marker||!door)return;
  Object.assign(marker.style,{left:`${door.x_percent}%`,top:`${door.y_percent}%`,width:`${door.width_percent}%`,height:`${door.height_percent}%`});
  marker.hidden=false;
}

function renderSprint3b(state,pocket) {
  const libraryDraft=captureLibraryDraft();
  currentSprint3bState=state;
  if (!state.active || !state.scene || !state.flow || !state.me) { sprint3bPanel.classList.add("hidden"); choiceArea.classList.remove("hidden"); revealArea.classList.remove("hidden"); return; }
  choiceArea.classList.add("hidden"); revealArea.classList.add("hidden");
  sprint3bPanel.classList.remove("hidden"); sprint3bStatus.textContent="";
  const me=state.me, scene=state.scene; let html="";
  const routeLocationKey=LOCATION_KEYS[scene.current_route_target];
  const showAct4Comparison=["act4_known_unknown","act5_route_discussion","act5_inspect_first"].includes(scene.scene_id);
  const act1OutcomeAsset=me.act1_stage==="consequence"?({study_map:"prop_gitte_castle_map",study_number_note:"prop_gitte_number_note_front",read_diary:"prop_anna_diary_open",read_notice:"prop_linda_closure_order",study_watch:"prop_linda_watch_face",try_star_key:"prop_linda_star_key"}[me.act1_choice_id]||null):null;
  const sceneAsset=act1OutcomeAsset||(scene.scene_id==="act1_wake_up"?({"GAL-A":"opening.gitte_room","GAL-B":"opening.anna_room","GAL-C":"opening.linda_study"}[session.role_slot]):(scene.scene_id==="act3_library"?"shared.library":null));
  if(!showAct4Comparison&&!sceneAsset)formalSceneMount.replaceChildren();
  setStableHtml(sprint3bText,(showAct4Comparison?act4ComparisonHtml():sceneAsset?`<img id="s3bSceneImage" class="s5-scene" data-asset-key="${escapeHtml(sceneAsset)}" alt="">`:"")+(scene.phase_key==="route_update"
    ? `<div class="bilingual">${localizedTemplateHtml("act02.032",{location:routeLocationKey ? resolveLocalizedText(routeLocationKey) : ""})}${localizedHtml("act02.033")}</div>`
    : `<div class="bilingual">${localizedHtml(state.scene.text_key)}</div>${state.scene.phase_key==="post_inspection_route" ? `<div class="bilingual">${localizedHtml("act04-05.016")}${localizedHtml("act04-05.017")}</div>` : ""}`)+act4RevealHtml(state.act4_revealed));
  if(sceneAsset)void setS5Asset("s3bSceneImage",sceneAsset);
  if(showAct4Comparison)hydrateAct4Comparison();
  if (scene.scene_id==="act1_wake_up" && me.act1_stage==="opening") html=`<div class="notice">${localizedKeys(me.act1_text_keys)}</div><button type="button" data-s3b-rpc="s3b_ack_act1_opening">${localizedHtml("common.004")}</button>`;
  else if (scene.scene_id==="act1_wake_up" && me.act1_stage==="action") html=actionButtons(ACT1_CHOICES[session.role_slot]||[],"s3b_submit_act1_choice");
  else if (scene.scene_id==="act1_wake_up" && me.act1_stage==="consequence") html=`<div class="notice">${localizedKeys(me.act1_text_keys)}</div><button type="button" data-s3b-rpc="s3b_complete_act1">${localizedHtml("common.004")}</button>`;
  else if (scene.scene_id==="act1_wake_up") html=`<p class="warn">${localizedHtml("act01-g.031")}</p>`;
  else if (!me.first_meeting_locked_at) html=actionButtons(MEETING_CHOICES,"s3b_submit_first_meeting");
  else if (!me.grab_complete && !me.left_start_room) html=`<button type="button" data-s3b-rpc="s3b_grab_and_leave" data-s3b-run="${escapeHtml(state.run_id)}">${localizedHtml("act02.022")}</button>`;
  else if (scene.phase_key==="private_first_meeting") html=acceptedWaiting();
  else if (scene.phase_key==="route_update" && !me.route_update_ack_at) html=`<button type="button" data-s3b-rpc="s3b_ack_route_update">${localizedHtml("common.004")}</button>`;
  else if (scene.phase_key==="route_update" && me.route_update_ack_at) html=acceptedWaiting();
  else if (scene.phase_key==="route_consequence") html=`<button type="button" data-s3b-rpc="s3b_complete_foldback">${localizedHtml("act02.042")}</button>`;
  else if (scene.phase_key==="wayfinding" && me.player_location!=="library") html=`<button type="button" data-s3b-rpc="s3b_follow_sign">${localizedHtml("act03.003")}</button>`;
  else if (scene.phase_key==="wayfinding" && me.player_location==="library") html=acceptedWaiting();
  else if (scene.phase_key==="library_box" && !state.flow.puzzle_resolved_at) { const locked=state.flow.puzzle_locked_prefix||""; const remaining=5-locked.length; html=`<form id="libraryCodeForm" class="composer"><div class="locked-wheels"><b>${escapeHtml(locked)}</b><input id="libraryCode" inputmode="numeric" maxlength="${remaining}" pattern="[0-9]{${remaining}}" data-locked-prefix="${escapeHtml(locked)}"></div><button>${localizedHtml("act03.009")}</button></form>${state.flow.puzzle_hint_stage ? `<div class="notice">${localizedHtml([null,"act03.011","act03.012","act03.013","act03.014","act03.017","act03.018","act03.019","act03.020"][state.flow.puzzle_hint_stage])}</div>` : ""}`; }
  else if (scene.scene_id==="act4_known_unknown" && !me.act4_locked_at) html=actionButtons(ROUTE_CHOICES,"s3b_submit_act4_choice");
  else if (scene.scene_id==="act4_known_unknown" && me.act4_locked_at) html=acceptedWaiting();
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
  setStableHtml(sprint3bActions,html);
  sprint3bPanel.dataset.runtimeIdentity=`${state.run_id}.${scene.scene_id}.${scene.phase_key}.${me.act1_stage||""}.${me.act1_choice_id||""}`;
  routeFormalPresentation();
  sprint3bActions.querySelectorAll("[data-s3b-rpc]").forEach(button=>button.addEventListener("click",()=>runSprint3bAction(button)));
  bindPocketActions();
  document.getElementById("libraryCodeForm")?.addEventListener("submit",submitLibraryCode);
  restoreLibraryDraft(libraryDraft,state);
}

function inputDraft(input,identity,viewport=false){return input?{identity,value:input.value,focused:document.activeElement===input,selectionStart:input.selectionStart,selectionEnd:input.selectionEnd,scrollX:viewport?window.scrollX:null,scrollY:viewport?window.scrollY:null}:null}
function restoreInputDraft(draft,input,identity,viewport=false){if(!draft||!input||draft.identity!==identity)return;input.value=draft.value;if(draft.focused){input.focus({preventScroll:true});if(draft.selectionStart!==null&&draft.selectionEnd!==null)input.setSelectionRange(draft.selectionStart,draft.selectionEnd)}if(viewport&&draft.scrollX!==null&&draft.scrollY!==null)window.scrollTo(draft.scrollX,draft.scrollY)}
function captureDiscussionViewport(node,identity){if(!node||!identity)return null;const state={identity,top:node.scrollTop,nearBottom:node.scrollHeight-node.scrollTop-node.clientHeight<=24};discussionViewportState.set(identity,state);return state}
function restoreDiscussionViewport(node,identity){if(!node||!identity)return;const state=discussionViewportState.get(identity);if(!state){node.scrollTop=node.scrollHeight;discussionViewportState.set(identity,{identity,top:node.scrollTop,nearBottom:true});return}node.scrollTop=state.nearBottom?node.scrollHeight:state.top}
function acknowledgePendingMessage(identity,input,root){const pending=pendingMessageAcks.get(identity);if(!pending||!input||!root)return;const acknowledged=[...root.querySelectorAll(".message")].some(node=>node.querySelector("b")?.textContent.trim()===pending.displayName&&node.querySelector("p")?.textContent===pending.text);if(acknowledged){input.value="";input.focus({preventScroll:true});input.setSelectionRange(0,0);pendingMessageAcks.delete(identity)}}
function libraryIdentity(state){const scene=state?.scene;return state?.active&&scene?.phase_key==="library_box"&&!state.flow?.puzzle_resolved_at?`${state.run_id}.${scene.scene_id}.${scene.phase_key}.${state.flow?.puzzle_locked_prefix||""}`:""}
function captureLibraryDraft(){const identity=libraryIdentity(currentSprint3bState);return identity?inputDraft(document.getElementById("libraryCode"),identity):null}
function restoreLibraryDraft(draft,state){const identity=libraryIdentity(state);if(identity)restoreInputDraft(draft,document.getElementById("libraryCode"),identity)}

function s5Buttons(items,rpcName){return `<div class="choice-list">${items.map(([id,key])=>`<button type="button" data-s5-rpc="${rpcName}" data-s5-choice="${id}">${localizedHtml(key)}</button>`).join("")}</div>`}
function pocketItemContent(item){
  const flip=`<button type="button" data-flip-item="${escapeHtml(item.item_key)}" data-target-view="${item.current_view==="back"?"front":"back"}">${localizedHtml("act01-g.028")}</button>`;
  const assetKey=item.item_key==="gitte_castle_map"?"prop_gitte_castle_map":item.item_key==="gitte_number_note"?(item.current_view==="back"?"prop_gitte_number_note_back":"prop_gitte_number_note_front"):item.item_key==="anna_servant_diary"?"prop_anna_diary_open":item.item_key==="linda_stopped_watch"?(item.current_view==="back"?"prop_linda_watch_back":"prop_linda_watch_face"):item.item_key==="linda_closure_order"?"prop_linda_closure_order":item.item_key==="linda_star_key"?"prop_linda_star_key":"";
  const media=assetKey?`<img class="v4-pocket-media" data-pocket-asset="${escapeHtml(assetKey)}" alt="">`:"";
  if(item.item_key==="gitte_castle_map")return `${media}${localizedKeys(["act01-g.023","act01-g.024"])}`;
  if(item.item_key==="gitte_number_note")return `${media}${localizedHtml(item.current_view==="back"?"act01-g.029":"act01-g.007")}${flip}`;
  if(item.item_key==="gitte_flashlight")return localizedHtml("act01-g.030");
  if(item.item_key==="anna_servant_diary")return `${media}${localizedHtml("act01-a.010")}`;
  if(item.item_key==="linda_stopped_watch")return `${media}${localizedHtml(item.current_view==="back"?"act01-l.017":"act01-l.002")}${flip}`;
  if(item.item_key==="linda_star_key")return `${media}${localizedHtml("act01-l.005")}`;
  if(item.item_key==="linda_closure_order")return `${media}${localizedKeys(["act01-l.009","act01-l.010","act01-l.016"])}`;
  return"";
}
function pocketEvidencePanel(pocket,phase){
  if(!pocket?.active)return"";
  const inspected=new Set(pocket.inspected_item_keys||[]);
  const items=pocket.items||[];
  if(!items.some(item=>item.item_key===selectedPocketItem))selectedPocketItem=items[0]?.item_key||"";
  const selected=items.find(item=>item.item_key===selectedPocketItem);
  const itemTabs=`<div class="pocket-item-selector" role="tablist">${items.map(item=>`<button type="button" role="tab" class="secondary" data-select-pocket-item="${escapeHtml(item.item_key)}" aria-selected="${item.item_key===selectedPocketItem}">${localizedHtml(item.name_text_key)}</button>`).join("")}</div>`;
  const itemHtml=!selected?"":inspected.has(selected.item_key)
    ? `<article class="evidence-item pocket-item-detail" data-pocket-item="${escapeHtml(selected.item_key)}"><p class="muted">${escapeHtml(selected.current_view||"")}</p>${pocketItemContent(selected)}</article>`
    : `<button type="button" class="evidence-item" data-inspect-item="${escapeHtml(selected.item_key)}" aria-expanded="false">${localizedHtml(selected.name_text_key)}</button>`;
  const groupHtml=(pocket.group_items||[]).map(item=>`<details class="evidence-item"><summary>${localizedHtml(item.label_text_key)}</summary>${item.item_key==="library_torn_note"?localizedHtml("act03.016"):localizedHtml(item.label_text_key)}</details>`).join("");
  const memoryHtml=(pocket.observations||[]).map(item=>localizedHtml(item.display_text_key)).join("")+(pocket.shared_photos||[]).map(item=>localizedHtml(item.label_text_key)).join("");
  const shareable=(pocket.scene?.allow_share_photo?pocket.items||[]:[]).filter(item=>item.current_view);
  const shareHtml=shareable.map(item=>`<div class="button-row">${["GAL-A","GAL-B","GAL-C"].filter(role=>role!==session.role_slot).map(role=>`<button data-share-role="${role}" data-share-item="${escapeHtml(item.item_key)}" data-share-view="${escapeHtml(item.current_view)}">${localizedHtml(item.name_text_key)} · ${escapeHtml(role)}</button>`).join("")}</div>`).join("");
  return `<section class="notice evidence-panel" data-s5-evidence-phase="${escapeHtml(phase)}">${itemTabs}${itemHtml}${groupHtml}${memoryHtml}${shareHtml}</section>`;
}
async function hydratePocketAssets(){await Promise.all([...pocketMount.querySelectorAll("[data-pocket-asset]")].map(async requested=>{const key=requested.dataset.pocketAsset,result=await trialAssetResolver.resolve(key),node=pocketMount.querySelector(`[data-pocket-asset="${CSS.escape(key)}"]`);if(!node||!node.isConnected||node.dataset.pocketAsset!==key)return;if(!result?.ok){applyTrialPlaceholder(node,key);return}applyResolvedAsset(node,key,result)}))}
function renderPocket(pocket,phase){const top=pocketMount.scrollTop,html=`<p class="v4-region-title">Pocket · 随身物品</p>${pocketEvidencePanel(pocket,phase)||'<p class="muted">No projected items.</p>'}`;setStableHtml(pocketMount,html);pocketMount.scrollTop=top;bindPocketActions();void hydratePocketAssets()}
function renderSprint5(payload,pocket){
  currentSprint5State=payload;
  choiceArea.classList.add("hidden");revealArea.classList.add("hidden");sprint3bPanel.classList.remove("hidden");sprint3bStatus.textContent="";
  const s=payload.state;let visual="",actions="";
  if(s.phase_key.startsWith("act6"))visual=`<div class="portrait-stage"><img id="s5SceneImage" alt=""><img id="s5OverlayImage" class="portrait-overlay" alt=""></div>${localizedHtml(payload.presentation_text_key||"act06.001")}${s.phase_key==="act6_answer"?`<div class="route-evidence"><img id="s5MapImage" class="s5-scene" alt=""><div class="route-board"><b>${localizedHtml("act01-g.014")}</b><span aria-hidden="true">→</span><b>${localizedHtml("act01-g.015")}</b></div></div>`:""}`;
  if(s.phase_key.startsWith("act7"))visual=`<div class="clock-stage"><img id="s5SceneImage" class="s5-scene" alt=""><div class="clock" data-anchor="clock_A_face"><b>A</b><span>23:54</span><i class="hand clockwise"></i></div><div class="clock" data-anchor="clock_B_face"><b>B</b><span>11:54</span><i class="hand counterclockwise"></i></div><div class="clock" data-anchor="clock_C_face"><b>C</b><span>23:49</span><i class="hand stopped"></i></div></div><div class="bilingual">${localizedKeys(["act07.001","act07.002","act07.003","act07.004","act07.005","act07.006","act07.007"])}</div>${s.act7_wrong_attempts?localizedHtml(s.act7_wrong_attempts===1?"act07.012":s.act7_wrong_attempts===2?"act07.013":"act07.014"):""}`;
  const pocketHtml="";
  if(s.phase_key.startsWith("act6")||s.phase_key.startsWith("act7"))visual+=pocketHtml;
  if(s.phase_key.startsWith("act8"))visual=`${["act8_private","act8_final_vote"].includes(s.phase_key)?`<div class="act8-evidence"><img id="s5MapImage" class="s5-scene" alt=""><img id="s5PhotoImage" class="s5-scene" alt="">${localizedHtml("item.photo_1897")}</div>`:`<img id="s5SceneImage" class="s5-scene" alt="">`}<div class="bilingual">${s.phase_key==="act8_route"?localizedKeys(s.route_taken_act8==="main_gate"?["act08.005","act08.006","act08.007"]:["act08.010","act08.011"]):""}</div>${payload.private_choices_revealed.length?`<div class="notice">${payload.private_choices_revealed.map(x=>`${escapeHtml(x.role_slot)}: ${localizedHtml(({main_gate:"act08.001",west_tower:"act08.002",compare:"act08.003",follow_group:"act08.004"})[x.choice_id])}`).join("")}</div>`:""}${pocketHtml}`;
  if(["act6_vote","act7_vote","act8_final_vote"].includes(s.phase_key))actions="";
  else if(s.phase_key==="act8_private")actions=payload.my_private_choice?acceptedWaiting(`${payload.private_choices_revealed?.length||1}/3`):s5Buttons(S5_PRIVATE,"s5_submit_private_choice");
  else if(s.phase_key==="act6_answer")actions=`${localizedHtml("act06.011")}<button type="button" data-s5-rpc="s5_advance">${localizedHtml("act06.012")}</button>`;
  else if(s.phase_key==="act7_solved")actions=`${localizedKeys(["act07.015","act07.016","act07.017"])}<button type="button" data-s5-rpc="s5_advance">${localizedHtml("act07.018")}</button>`;
  else if(s.phase_key==="act8_route")actions=`<button type="button" data-s5-rpc="s5_advance">${localizedHtml(s.route_taken_act8==="main_gate"?"act08.008":"act08.012")}</button>`;
  else actions=localizedHtml(s.route_taken_act8==="main_gate"?"act08.009":"act08.013");
  setStableHtml(sprint3bText,`<p class="eyebrow">ACT ${s.act_no}</p>${visual}`);sprint3bActions.innerHTML=actions;routeFormalPresentation();
  hydrateS5Assets(s);
  sprint3bActions.querySelectorAll("[data-s5-rpc]").forEach(button=>button.addEventListener("click",()=>runSprint5Action(button)));
  bindPocketActions();
}
function anchor(asset,name){return asset?.ui_anchors?.find(item=>item.anchor_name===name)}
function applyTrialPlaceholder(node,key){node.classList.add("trial-asset-placeholder");node.dataset.placeholderAssetKey=key;node.dataset.assetState="placeholder";node.alt=`Temporary media placeholder: ${key}`;node.src=TRIAL_PLACEHOLDER_PATHS[key]||EMPTY_IMAGE}
function applyResolvedAsset(node,key,result){const url=assetUrlCache.get(key)||`https://qdcbdcjobzytzhnhfwyn.supabase.co/storage/v1/object/public/${result.storage_path}`;assetUrlCache.set(key,url);node.classList.remove("trial-asset-placeholder");node.removeAttribute("data-placeholder-asset-key");node.dataset.assetKey=key;node.dataset.assetState="loading";node.alt="";node.onload=()=>{if(node.dataset.assetKey===key)node.dataset.assetState="decoded"};node.onerror=()=>{node.onerror=null;trialAssetResolver.reportActiveLoadFailure(result);if(node.isConnected&&node.dataset.assetKey===key)applyTrialPlaceholder(node,key)};if(node.src!==url)node.src=url;else if(node.naturalWidth>0)node.dataset.assetState="decoded"}
async function setS5Asset(id,key){const requested=document.getElementById(id);if(!requested)return null;requested.dataset.assetKey=key;const result=await trialAssetResolver.resolve(key),node=document.getElementById(id);if(!node||!node.isConnected||node.dataset.assetKey!==key)return null;if(!result?.ok){applyTrialPlaceholder(node,key);return null}applyResolvedAsset(node,key,result);return result}
async function hydrateS5Assets(s){await Promise.all([document.getElementById("s5MapImage")?setS5Asset("s5MapImage","prop_gitte_castle_map"):null,document.getElementById("s5PhotoImage")?setS5Asset("s5PhotoImage","prop.photo_1897"):null]);const key=s.act_no===6?"shared.portrait_hall":s.act_no===7?"shared.clock_room":s.route_taken_act8==="west_tower"?"shared.west_tower_payoff":s.route_taken_act8==="main_gate"?"shared.main_gate":null;if(!key)return;const result=await setS5Asset("s5SceneImage",key);if(!result)return;if(s.act_no===6){const overlay=await trialAssetResolver.resolve("overlay.portrait_eyes_open"),node=document.getElementById("s5OverlayImage"),base=anchor(result,"portrait_main_face"),over=anchor(overlay,"portrait_main_face");if(!overlay?.ok||!base||!over){sprint3bStatus.textContent="ANCHOR_UNAVAILABLE · portrait_main_face";return}const scale=base.width_percent/over.width_percent;Object.assign(node.style,{left:`${base.x_percent-over.x_percent*scale}%`,top:`${base.y_percent-over.y_percent*scale}%`,width:`${100*scale}%`});node.onerror=()=>{node.onerror=null;trialAssetResolver.reportActiveLoadFailure(overlay);node.classList.remove("ready")};node.src=`https://qdcbdcjobzytzhnhfwyn.supabase.co/storage/v1/object/public/${overlay.storage_path}`;node.classList.add("ready")}if(s.act_no===7)document.querySelectorAll("[data-anchor]").forEach(node=>{const a=anchor(result,node.dataset.anchor);if(!a){node.hidden=true;sprint3bStatus.textContent=`ANCHOR_UNAVAILABLE · ${node.dataset.anchor}`;return}Object.assign(node.style,{left:`${a.x_percent}%`,top:`${a.y_percent}%`,width:`${a.width_percent}%`,height:`${a.height_percent}%`})})}
async function shareSprint5Photo(button){button.disabled=true;try{await rpc("s3_share_photo",{p_room_code:session.room_code,p_session_token:session.session_token,p_recipient_role:button.dataset.shareRole,p_source_item_key:button.dataset.shareItem,p_source_view:button.dataset.shareView});await refreshState()}catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;button.disabled=false}}
async function flipSprint5Item(button){button.disabled=true;try{await rpc("s3_set_item_view",{p_room_code:session.room_code,p_session_token:session.session_token,p_item_key:button.dataset.flipItem,p_target_view:button.dataset.targetView});await refreshState()}catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;button.disabled=false}}
async function inspectPocketItem(button){button.disabled=true;try{await rpc("s9_inspect_pocket_item",{p_room_code:session.room_code,p_session_token:session.session_token,p_item_key:button.dataset.inspectItem});await refreshState()}catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;button.disabled=false}}
function bindPocketActions(){pocketMount.querySelectorAll("[data-select-pocket-item]").forEach(button=>button.addEventListener("click",()=>{selectedPocketItem=button.dataset.selectPocketItem;stableHtmlByNode.delete(pocketMount);const state=currentSprint6State?.active?currentSprint6State:currentSprint5State?.active?currentSprint5State:currentSprint3bState;renderPocket(lastConfirmedFrame?.pocketState,state?.state?.phase_key||state?.scene?.phase_key||"")}));pocketMount.querySelectorAll("[data-inspect-item]").forEach(button=>button.addEventListener("click",()=>inspectPocketItem(button)));pocketMount.querySelectorAll("[data-share-role]").forEach(button=>button.addEventListener("click",()=>shareSprint5Photo(button)));pocketMount.querySelectorAll("[data-flip-item]").forEach(button=>button.addEventListener("click",()=>flipSprint5Item(button)))}
function sprint6Identity(){const s=currentSprint6State.state;return{p_expected_phase:s.phase_key,p_expected_step:s.act9_step,p_expected_round:s.round_no}}
function sprint6AudioVolume(){return sprint6VolumeMode==="mute"?0:sprint6VolumeMode==="reduced"?.35:1}
async function armSprint6Audio(){sprint6AudioArmed=true;for(const key of["audio.snake_hiss_short","audio.old_alarm_bell","audio.wet_scraping","audio.snakes_approaching","audio.mechanism_clang","audio.gate_opening"]){const asset=await rpc("asset_resolve",{p_asset_key:key}).catch(()=>null);if(!asset?.ok)continue;const url=`https://qdcbdcjobzytzhnhfwyn.supabase.co/storage/v1/object/public/${asset.storage_path}`,audio=new Audio(url);audio.preload="auto";audio.load();sprint6AudioUrls.set(key,url)}}
function setSprint6Volume(mode){sprint6VolumeMode=mode;localStorage.setItem("gal.s6.audio-mode",mode);for(const audio of sprint6AudioHandles.values())audio.volume=sprint6AudioVolume();document.querySelectorAll("[data-s6-volume]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.s6Volume===mode)));retryPendingSprint6Audio()}
function fadeSprint6Audio(audio,duration){const started=performance.now();audio.volume=0;const timer=setInterval(()=>{const progress=Math.min(1,(performance.now()-started)/duration);audio.volume=sprint6AudioVolume()*progress;if(progress===1)clearInterval(timer)},50)}
async function flushSprint6AudioConsumptions(){if(!session)return;const outbox=sprint6AudioOutbox();for(const[occurrenceId,outcome]of Object.entries(outbox)){try{await rpc("s6_mark_audio_consumed",{p_room_code:session.room_code,p_session_token:session.session_token,p_occurrence_id:occurrenceId,p_outcome:outcome});delete outbox[occurrenceId];saveSprint6AudioOutbox(outbox)}catch(error){console.warn("Sprint6 audio consumption remains queued",occurrenceId,error)}}}
async function markSprint6AudioConsumed(occurrenceId,outcome="ended"){if(!occurrenceId)return;const outbox=sprint6AudioOutbox();outbox[occurrenceId]=outcome;saveSprint6AudioOutbox(outbox);await flushSprint6AudioConsumptions()}
function clearSprint6Status(){sprint3bStatus.textContent="";delete sprint3bStatus.dataset.sprint6Status}
async function playSprint6Audio(key,asset,occurrenceId){const url=sprint6AudioUrls.get(key)||`https://qdcbdcjobzytzhnhfwyn.supabase.co/storage/v1/object/public/${asset.storage_path}`,audio=new Audio(url);audio.preload="auto";audio.volume=key==="audio.wet_scraping"?0:sprint6AudioVolume();audio.dataset.occurrenceId=occurrenceId||"";sprint6AudioHandles.set(key,audio);audio.addEventListener("ended",()=>{sprint6AudioHandles.delete(key);markSprint6AudioConsumed(occurrenceId)},{once:true});try{await audio.play();sprint6PendingAudio=null;if(sprint3bStatus.dataset.sprint6Status==="audio-blocked")clearSprint6Status();if(key==="audio.wet_scraping")fadeSprint6Audio(audio,1500)}catch(error){sprint6PendingAudio={key,asset,occurrenceId};console.warn("Sprint6 audio playback paused",key,error);sprint3bStatus.dataset.sprint6Status="audio-blocked";sprint3bStatus.innerHTML=localizedHtml("runtime.audio.blocked")}}
function retryPendingSprint6Audio(){if(sprint6AudioArmed&&sprint6PendingAudio){const pending=sprint6PendingAudio;sprint6PendingAudio=null;playSprint6Audio(pending.key,pending.asset,pending.occurrenceId)}}
function setSprint6CinematicMode(state){const cinematic=state.phase_key==="act12_cinematic",stage=cinematic?state.cinematic_stage:0;document.body.classList.toggle("s6-fading",stage>=4&&stage<=9);document.body.classList.toggle("s6-blackout",stage===10);document.body.dataset.s6Stage=String(stage)}
function scheduleSprint6LeverCenter(payload){if(payload.station_b_stage!=="lever_held"||payload.station_task||sprint6LeverTimer)return;const body={p_room_code:session.room_code,p_session_token:session.session_token,...sprint6Identity(),p_task_value:"lever_center"},pending=requestIdentity("s6_complete_station_v2",`${body.p_expected_phase}.${body.p_expected_step}.${body.p_expected_round}.lever-center`,body);body.p_client_request_id=pending.requestId;sprint6LeverTimer=setTimeout(async()=>{sprint6LeverTimer=null;try{await rpc("s6_complete_station_v2",body);clearRequestIdentity(pending.key);await refreshState()}catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`}},1200)}
function sprint6AudioControls(){return `<div class="s6-audio-controls" role="group">${[["full","runtime.audio.full"],["reduced","runtime.audio.reduced"],["mute","runtime.audio.mute"]].map(([mode,key])=>`<button type="button" class="secondary" data-s6-volume="${mode}" aria-pressed="${sprint6VolumeMode===mode}">${localizedHtml(key)}</button>`).join("")}</div>`}
function sprint6Discussion(payload){const d=payload.discussion;if(!d)return"";const ready=!d.teacher_open_required&&Date.parse(d.phase_deadline)<=Date.now();return `<section class="discussion-room"><h3>${localizedHtml(d.phase_key==="act10_discussion"?"act10.004":d.phase_key==="act11_discussion"?"act11.001":"act09.004")}</h3><p class="muted">${escapeHtml(formatDeadline(d.phase_deadline,"discussion"))}</p><div class="transcript">${d.messages.length?d.messages.map(m=>`<article class="message"><b>${escapeHtml(m.display_name)}</b><p>${escapeHtml(m.message_text)}</p></article>`).join(""):localizedHtml("discussion.no_messages")}</div><form id="s6MessageForm" class="composer"><input id="s6MessageText" maxlength="1000" required><button>${localizedHtml("discussion.send_message")}</button></form><button data-s6-rpc="s6_close_discussion_v2" data-s6-discussion="${d.discussion_session_id}" ${ready?"":"disabled"}>${localizedHtml("common.004")}</button></section>`}
function relocateSprint6Discussion(){const node=sprint3bActions.querySelector(".discussion-room:has(#s6MessageForm)");if(!node){sprint6DiscussionMount.replaceChildren();return}sprint6DiscussionMount.replaceChildren(node)}
function renderSprint6AcceptedWaiting(payload){
  const wait=payload.wait_state,s=payload.state;
  if(!wait||wait.phase_key!==s.phase_key)return;
  const choiceBarrier=["act9_console","act10_private","act10_final_vote","act12_pressure"].includes(s.phase_key)&&wait.my_choice_locked;
  const allocationBarrier=s.phase_key==="act11_allocation"&&wait.my_allocation_locked;
  const engageBarrier=s.phase_key==="act12_tasks"&&payload.station_task&&wait.my_engaged;
  if(choiceBarrier||allocationBarrier||engageBarrier){
    const progress=engageBarrier?`${wait.engaged_count}/3`:`${wait.submitted_count}/3`;
    sprint3bActions.innerHTML=acceptedWaiting(progress);
  }
}
const sprint5EvidencePanel=pocketEvidencePanel;
function mainGateOverlayHtml(state){
  if(![11,12].includes(state.act_no))return"";
  const stations=state.gold_key
    ? [["main_gate_station_A","act11.002","A"],["main_gate_station_B","act11.003","B"],["main_gate_watcher_corridor","act11.015","WATCHER"]]
    : [["main_gate_station_A","act11.002","A"],["main_gate_station_B","act11.003","B"],["main_gate_station_C","act11.004","C"]];
  return `<div class="s6-station-layer">${stations.map(([anchorName,label,role])=>`<span data-anchor="${anchorName}" class="s6-station-label ${currentSprint6State?.allocation===role?"assigned":""}" hidden>${localizedHtml(label)}</span>`).join("")}</div>`;
}
function mainGateLegendHtml(state){
  if(![11,12].includes(state.act_no))return"";
  const labels=state.gold_key?["act11.002","act11.003","act11.015"]:["act11.002","act11.003","act11.004"];
  return `<div class="s6-station-legend">${labels.map(localizedHtml).join("")}</div>`;
}
function sprint6StationIdentity(payload){const s=payload?.state;return s&&payload.allocation==="A"&&!payload.station_task&&s.phase_key==="act12_tasks"?`${s.run_id}.${s.phase_key}.${s.act9_step}.${s.round_no}`:""}
function captureSprint6StationDraft(){const identity=sprint6StationIdentity(currentSprint6State);return identity?inputDraft(document.getElementById("s6StationValue"),identity,true):null}
function restoreSprint6StationDraft(draft,payload){const identity=sprint6StationIdentity(payload);if(identity)restoreInputDraft(draft,document.getElementById("s6StationValue"),identity,true)}
function sprint6DiscussionIdentity(payload){const s=payload?.state,d=payload?.discussion;return s&&d&&["act9_discussion","act10_discussion","act11_discussion"].includes(s.phase_key)&&d.phase_key===s.phase_key?`${s.run_id}.${s.phase_key}.${d.discussion_session_id}`:""}
function captureSprint6DiscussionDraft(){const identity=sprint6DiscussionIdentity(currentSprint6State);return identity?inputDraft(document.getElementById("s6MessageText"),identity):null}
function restoreSprint6DiscussionDraft(draft,payload){const identity=sprint6DiscussionIdentity(payload);if(identity)restoreInputDraft(draft,document.getElementById("s6MessageText"),identity)}
function renderSprint6(payload){const stationDraft=captureSprint6StationDraft(),discussionDraft=captureSprint6DiscussionDraft();currentSprint6State=payload;const s=payload.state;clearSprint6Status();setSprint6CinematicMode(s);choiceArea.classList.add("hidden");revealArea.classList.add("hidden");sprint3bPanel.classList.remove("hidden");const black=s.phase_key==="act12_cinematic"&&s.cinematic_stage===10;const hall=s.act_no===9?`<div class="s6-door-layer"><span data-anchor="great_hall_red_door" class="s6-door red ${s.act9_step>=2?"open":""}">${localizedHtml("act09.001")}</span><span data-anchor="great_hall_blue_door" class="s6-door blue ${s.act9_step>=3?"available":""} ${s.act9_step>=4?"open":""}">${localizedHtml("act09.002")}</span><span data-anchor="great_hall_black_door" class="s6-door black">${localizedHtml("act09.003")}</span></div>`:"",mainGate=mainGateOverlayHtml(s),mainGateLegend=mainGateLegendHtml(s);let body=`<div class="s6-stage ${black?"blackout":""}">${black?"":`<p class="eyebrow">ACT ${s.act_no}</p>${payload.scene_asset_key?`<div class="s6-scene-wrap"><img id="s6SceneImage" class="s5-scene" alt="">${hall}${mainGate}</div>${mainGateLegend}`:""}${payload.private_clue?`<div class="notice">${localizedHtml(payload.private_clue.text_key)}</div>`:""}${localizedKeys(s.feedback_text_keys||[])}`}</div>`,actions="";body+=sprint6AudioControls();if(payload.private_choices_revealed?.length)body+=`<div class="notice">${payload.private_choices_revealed.map(x=>`${escapeHtml(x.role_slot)}: ${localizedHtml(x.choice_id==="take"?"act10.004":"act10.005")}`).join("<br>")}</div>`;if(payload.discussion)actions=sprint6Discussion(payload);if(s.phase_key==="act9_console"){const choices=s.act9_step===1||s.act9_step===3?S6_DOORS:s.act9_step===2?[["enter_red","act09.015"],["do_not_enter","act09.016"]]:[["enter_blue","act09.020"],["stay","act09.021"]];actions=s5Buttons(choices,"s6_submit_group_choice_v2").replaceAll("data-s5-","data-s6-")}if(s.phase_key==="act10_private")actions=s5Buttons([["take","act10.004"],["leave","act10.005"]],"s6_submit_private_choice_v2").replaceAll("data-s5-","data-s6-");if(s.phase_key==="act10_final_vote")actions=s5Buttons([["take","act10.006"],["leave","act10.007"]],"s6_submit_group_choice_v2").replaceAll("data-s5-","data-s6-");if(s.phase_key==="act10_result")actions=`<button data-s6-rpc="s6_advance_v2">${localizedHtml("act10.010")}</button>`;if(s.phase_key==="act11_allocation")actions=s5Buttons((s.gold_key?[["A","act11.012"],["B","act11.013"],["WATCHER","act11.014"]]:[["A","act11.012"],["B","act11.013"],["C","act11.004"]]),"s6_submit_allocation_v2").replaceAll("data-s5-","data-s6-");if(s.phase_key==="act12_tasks"&&payload.allocation){const task={A:["act11.005","1897"],B:["act11.007",payload.station_b_stage==="lever_held"?"lever_center":"lever_hold"],C:["act11.008","silver_key_inserted"],WATCHER:["act11.015","corridor_watched"]}[payload.allocation];actions=payload.station_task?`<button data-s6-rpc="s6_engage_v2" data-s6-role="${escapeHtml(payload.allocation)}">${localizedHtml(payload.allocation==="WATCHER"?"act12.004":"act12.001")}</button>`:`${localizedHtml(task[0])}${payload.allocation==="B"&&payload.station_b_stage==="lever_held"?`<span class="s6-lever-track" aria-hidden="true"><span></span></span>`:""}${payload.allocation==="A"?`<form id="s6StationForm" class="composer"><input id="s6StationValue" inputmode="numeric" maxlength="4" required><button>${localizedHtml("act12.001")}</button></form>`:payload.allocation==="B"&&payload.station_b_stage==="lever_held"?"":`<button data-s6-rpc="s6_complete_station_v2" data-s6-value="${task[1]}">${localizedHtml(payload.allocation==="B"?"act12.002":payload.allocation==="C"?"act12.003":"act12.004")}</button>`}`}if(s.phase_key==="act12_pressure"){const failing=payload.allocation===s.mechanism_failure_station;actions=s5Buttons(failing?[["one","act12.008"],["two","act12.009"],["three","act12.010"],["four","act12.011"]]:[["hold","act12.012"],["encourage","act12.013"],["watch","act12.014"],["prepare","act12.015"]],"s6_submit_private_choice_v2").replaceAll("data-s5-","data-s6-")}if(s.phase_key==="act13_escape"&&Date.parse(payload.act13_continue_at)<=Date.now())actions=`<button data-s6-rpc="s6_advance_v2">${localizedHtml("common.004")}</button>`;if(s.phase_key==="act13_boundary")actions=`<button id="s8Finalize">${localizedHtml("common.004")}</button>`;setStableHtml(sprint3bText,body);if(!payload.scene_asset_key)formalSceneMount.replaceChildren();sprint3bActions.innerHTML=actions;routeFormalPresentation();restoreSprint6StationDraft(stationDraft,payload);restoreSprint6DiscussionDraft(discussionDraft,payload);hydrateSprint6(payload);sprint3bActions.querySelectorAll("[data-s6-rpc]").forEach(b=>b.addEventListener("click",()=>runSprint6Action(b)));document.getElementById("s8Finalize")?.addEventListener("click",finalizeSprint8);document.getElementById("s6MessageForm")?.addEventListener("submit",sendSprint6Message);document.getElementById("s6StationForm")?.addEventListener("submit",submitSprint6Station);document.querySelectorAll("[data-s6-volume]").forEach(button=>button.addEventListener("click",()=>setSprint6Volume(button.dataset.s6Volume)));scheduleSprint6LeverCenter(payload)}

async function finalizeSprint8(){const button=document.getElementById("s8Finalize");if(button)button.disabled=true;try{await flushSprint6AudioConsumptions();const runId=currentSprint6State?.state?.run_id;if(!runId)throw new Error("Finalization run identity is unavailable.");const pending=requestIdentity("s8-finalize",runId,{boundary:"act14",run_id:runId});await rpc("s8_finalize",{p_room_code:session.room_code,p_session_token:session.session_token,p_client_request_id:pending.requestId,p_expected_run_id:runId});clearRequestIdentity(pending.key);await refreshState()}catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;if(button)button.disabled=false}}
function renderSprint8(payload){
  setSprint6CinematicMode({phase_key:"act14_complete"});
  formalSceneMount.replaceChildren();
  choiceArea.classList.add("hidden");
  revealArea.classList.add("hidden");
  discussionPanel.classList.add("hidden");
  sprint3bPanel.classList.remove("hidden");
  sprint3bActions.innerHTML="";
  sprint3bStatus.textContent="";
  if(sprint8RevealRunId===payload.run_id)return;
  sprint8RevealRunId=payload.run_id;
  clearTimeout(sprint8RevealTimer);

  const previousExteriorSrc=document.getElementById("s6SceneImage")?.src||"";
  let stage=0;
  const stageNames=["fade","mission","escaped","remembered","they","end"];
  const frames=[
    `<div class="s8-exterior-stage"><img id="s8ExteriorImage" class="s8-exterior-image" ${previousExteriorSrc?`src="${escapeHtml(previousExteriorSrc)}"`:""} alt=""><div class="s8-fade" aria-hidden="true"></div></div>`,
    `<p>${localizedHtml("act14.001")}</p>`,
    `<p>${localizedHtml("act14.002")}</p>`,
    `<strong>${localizedHtml("act14.003")}</strong>`,
    `<strong class="s8-separate-screen">${localizedHtml("act14.004")}</strong>`,
    `<p>${localizedHtml("act14.005")}</p>`
  ],delays=[900,1100,1400,1800,1800];

  const advance=()=>{
    const fadeClass=stage===0?" s8-fade-stage":"";
    sprint3bText.innerHTML=`<section class="s8-ending${fadeClass} s8-stage-${stage}" data-s8-stage="${stageNames[stage]}" aria-live="polite">${frames[stage]}</section>`;
    if(stage===0&&!previousExteriorSrc)setS5Asset("s8ExteriorImage","ending.castle_exterior");
    if(stage<frames.length-1)sprint8RevealTimer=setTimeout(()=>{stage+=1;advance()},delays[stage]);
  };
  advance();
}
async function hydrateSprint6(payload){let scene=null;if(S6_SCENE_ASSETS.has(payload.scene_asset_key))scene=await setS5Asset("s6SceneImage",payload.scene_asset_key);if(scene&&payload.state.act_no===9)document.querySelectorAll(".s6-door[data-anchor]").forEach(node=>{const a=anchor(scene,node.dataset.anchor);if(!a){node.hidden=true;return}Object.assign(node.style,{left:`${a.x_percent}%`,top:`${a.y_percent}%`,width:`${a.width_percent}%`,height:`${a.height_percent}%`})});if(scene&&[11,12].includes(payload.state.act_no))document.querySelectorAll(".s6-station-label[data-anchor]").forEach(node=>{const a=anchor(scene,node.dataset.anchor);if(!a){node.hidden=true;return}Object.assign(node.style,{left:`${a.x_percent}%`,top:`${a.y_percent}%`,width:`${a.width_percent}%`,height:`${a.height_percent}%`});node.hidden=false});if(payload.state.phase_key==="act12_cinematic"&&payload.state.cinematic_stage===10){for(const audio of sprint6AudioHandles.values()){audio.pause();audio.currentTime=0;markSprint6AudioConsumed(audio.dataset.occurrenceId,"stopped")}sprint6AudioHandles.clear()}const key=payload.state.feedback_audio_key,identity=payload.audio_occurrence_id,locallyConsumed=Boolean(sprint6AudioOutbox()[identity]);await flushSprint6AudioConsumptions();if(!key||!identity||payload.audio_consumed||locallyConsumed||identity===sprint6AudioIdentity)return;sprint6AudioIdentity=identity;const asset=await rpc("asset_resolve",{p_asset_key:key}).catch(()=>null);if(!asset?.ok){await markSprint6AudioConsumed(identity,"stopped");return}if(!sprint6AudioArmed){sprint6PendingAudio={key,asset,occurrenceId:identity};return}await playSprint6Audio(key,asset,identity)}
async function sendSprint6Message(event){event.preventDefault();const input=document.getElementById("s6MessageText"),d=currentSprint6State.discussion,text=input.value,pending=requestIdentity("s6-message",d.discussion_session_id,{session:d.discussion_session_id,text});try{await rpc("s6_send_message_v2",{p_room_code:session.room_code,p_session_token:session.session_token,p_expected_discussion_session_id:d.discussion_session_id,p_client_request_id:pending.requestId,p_message_text:text});clearRequestIdentity(pending.key);pendingMessageAcks.set(sprint6DiscussionIdentity(currentSprint6State),{text,displayName:session.display_name});await refreshState()}catch(error){sprint3bStatus.textContent=error.message}}
async function submitSprint6Station(event){event.preventDefault();const button=event.currentTarget.querySelector("button");button.dataset.s6Rpc="s6_complete_station_v2";button.dataset.s6Value=document.getElementById("s6StationValue").value;await runSprint6Action(button)}
async function runSprint6Action(button){button.disabled=true;const rpcName=button.dataset.s6Rpc,body={p_room_code:session.room_code,p_session_token:session.session_token,...sprint6Identity()};if(rpcName==="s6_close_discussion_v2")body.p_expected_discussion_session_id=button.dataset.s6Discussion;if(button.dataset.s6Choice)body[rpcName==="s6_submit_allocation_v2"?"p_role_key":"p_choice_id"]=button.dataset.s6Choice;if(button.dataset.s6Role)body.p_role_key=button.dataset.s6Role;if(button.dataset.s6Value)body.p_task_value=button.dataset.s6Value;const identity=`${body.p_expected_phase}.${body.p_expected_step}.${body.p_expected_round}.${button.dataset.s6Discussion||""}`,pending=requestIdentity(rpcName,identity,body);body.p_client_request_id=pending.requestId;try{await rpc(rpcName,body);clearRequestIdentity(pending.key);await refreshState()}catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;button.disabled=false}}
async function runSprint5Action(button){button.disabled=true;const payload={p_room_code:session.room_code,p_session_token:session.session_token};let request;if(button.dataset.s5Choice){payload.p_choice_id=button.dataset.s5Choice;request=requestIdentity("s5",`${button.dataset.s5Rpc}.${currentSprint5State.state.phase_key}.${currentSprint5State.state.vote_round}`,{choice:payload.p_choice_id});payload.p_client_request_id=request.requestId}if(button.dataset.s5Rpc==="s5_submit_vote"){payload.p_expected_discussion_session_id=currentSprint5State.discussion.discussion_session_id;payload.p_expected_vote_round=currentSprint5State.discussion.vote_round}try{await rpc(button.dataset.s5Rpc,payload);if(request)clearRequestIdentity(request.key);await refreshState()}catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;button.disabled=false}}

async function runSprint3bAction(button) {
  button.disabled=true; const payload={p_room_code:session.room_code,p_session_token:session.session_token};
  if (button.dataset.s3bChoice) payload.p_choice_id=button.dataset.s3bChoice;
  let pending;
  if(button.dataset.s3bRpc==="s3b_grab_and_leave"){
    const runId=button.dataset.s3bRun;
    pending=requestIdentity("s3b-grab-leave",runId,{action:"grab_leave",expected_run_id:runId});
    payload.p_client_request_id=pending.requestId;payload.p_expected_run_id=runId;
  }
  try { await rpc(button.dataset.s3bRpc,payload);if(pending)clearRequestIdentity(pending.key);await refreshState(); }
  catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;button.disabled=false;}
}

async function submitLibraryCode(event) {
  event.preventDefault(); const input=document.getElementById("libraryCode");
  const code=`${input.dataset.lockedPrefix||""}${input.value}`;
  const request=requestIdentity("library",session.room_code,{code});
  try { await rpc("s3b_submit_library_code",{p_room_code:session.room_code,p_session_token:session.session_token,p_client_request_id:request.requestId,p_code:code}); clearRequestIdentity(request.key); const current=document.getElementById("libraryCode");if(current)current.value=""; await refreshState(); }
  catch(error){sprint3bStatus.innerHTML=`<span class="bad">${escapeHtml(error.message)}</span>`;}
}

function renderDiscussion(state) {
  const priorIdentity=currentDiscussion?.discussion_session_id||"";
  captureDiscussionViewport(transcript,priorIdentity);
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
  restoreDiscussionViewport(transcript,discussion.discussion_session_id);

  messageComposer.classList.toggle("hidden", discussion.status !== "discussion");
  renderVote(state);
  renderVoteHistory(state.vote_history);
  acknowledgePendingMessage(discussion.discussion_session_id,messageText,discussionPanel);
}

function renderVote(state) {
  const discussion = state.discussion;
  if (!discussion.require_final_vote) {
    voteArea.innerHTML = "";
    return;
  }

  if (discussion.status === "discussion") {
    const confirmedFirstRoundTie=Number(discussion.vote_round)===2&&(state.vote_history||[]).some(round=>Number(round.vote_round)===1&&round.outcome?.type==="no_consensus");
    voteArea.innerHTML = `${confirmedFirstRoundTie?`<div class="notice bilingual tie-retry-instruction" data-tie-session="${escapeHtml(discussion.discussion_session_id)}" data-tie-round="2">${localizedHtml("discussion.first_round_no_consensus_retry")}</div>`:""}<p class="muted voting-after-discussion">${localizedHtml("discussion.voting_after_discussion")}</p>`;
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
    pendingMessageAcks.set(currentDiscussion.discussion_session_id,{text,displayName:session.display_name});
    await refreshState();
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
  pollingEnabled = true;
  scheduleNextPlayerPoll();
}

function stopPolling() {
  pollingEnabled = false;
  playerSessionEpoch += 1;
  currentSprint5State = null;
  if (pollTimer) clearTimeout(pollTimer);
  pollTimer = null;
  lastConfirmedFrame = null;
  restoreRefreshDisabledPlayerMutations();
  if (refreshQueued) {
    refreshQueued.deferred.resolve({ status: "invalidated" });
    refreshQueued = null;
  }
  if (refreshInFlight) {
    refreshInFlight.cancelled = true;
    if (!refreshInFlight.settled) {
      refreshInFlight.settled = true;
      refreshInFlight.deferred.resolve({ status: "invalidated" });
    }
    refreshInFlight = null;
  }
}
