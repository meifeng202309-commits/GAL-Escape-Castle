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
const initializeSprint3bButton = document.getElementById("initializeSprint3bButton");
const initializeSprint5Button = document.getElementById("initializeSprint5Button");
const initializeSprint6Button = document.getElementById("initializeSprint6Button");
const overrideReasonInput = document.getElementById("overrideReason");
const overrideActions = document.getElementById("overrideActions");
const overrideStatus = document.getElementById("overrideStatus");
const overrideHistory = document.getElementById("overrideHistory");
const operationsBadge=document.getElementById("operationsBadge"),operationsStatus=document.getElementById("operationsStatus"),operationsState=document.getElementById("operationsState"),refreshOperationsButton=document.getElementById("refreshOperationsButton"),auditPrivateDebug=document.getElementById("auditPrivateDebug"),exportRunSelect=document.getElementById("exportRunSelect"),exportSessionButton=document.getElementById("exportSessionButton");
const loadAssetsButton=document.getElementById("loadAssetsButton"),assetReadyBadge=document.getElementById("assetReadyBadge"),assetStatus=document.getElementById("assetStatus"),assetManagerState=document.getElementById("assetManagerState");
const anchorDialog=document.getElementById('anchorDialog'),anchorStage=document.getElementById('anchorStage'),anchorImage=document.getElementById('anchorImage'),anchorBox=document.getElementById('anchorBox'),anchorPrompt=document.getElementById('anchorPrompt'),anchorStatus=document.getElementById('anchorStatus'),anchorNameSelect=document.getElementById('anchorNameSelect'),saveAnchorButton=document.getElementById('saveAnchorButton');let anchorDraft=null,anchorCandidate=null,anchorStart=null;

let pollTimer = null;
let sprint5TeacherActive = false;

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
initializeSprint5Button.addEventListener("click",initializeSprint5);
initializeSprint6Button.addEventListener("click",initializeSprint6);
openVoteButton.addEventListener("click", openVote);
addTimeButton.addEventListener("click", addTime);
initializeSprint3bButton.addEventListener("click", initializeSprint3b);
loadAssetsButton.addEventListener("click",loadAssets);
refreshOperationsButton.addEventListener("click",loadOperationsState);
auditPrivateDebug.addEventListener("change",setAuditPrivateDebug);
exportSessionButton.addEventListener("click",exportSprint8Session);
exportRunSelect.addEventListener("change",()=>{exportSessionButton.dataset.runId=exportRunSelect.value;exportSessionButton.disabled=!exportRunSelect.value;});

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
    await Promise.all([loadDiscussionState(),loadOperationsState()]);
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

async function initializeSprint3b() {
  const payload=baseTeacherPayload(); if(!payload)return;
  try { const result=await rpc("s3b_initialize_flow",payload); discussionTeacherStatus.textContent=`ACT 1–5 flow initialized: ${result.run_id}`; await loadDiscussionState(); }
  catch(error){discussionTeacherStatus.textContent=`Sprint 3B initialization failed: ${error.message}`;}
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
    await rpc(sprint5TeacherActive ? "s5_teacher_open_vote" : "s2_open_vote", payload);
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
    await rpc(sprint5TeacherActive ? "s5_teacher_add_time" : "s2_add_time", { ...payload, p_seconds: 30 });
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
    const s5State = await rpc("s5_get_teacher_discussion_state", payload).catch(()=>({sprint5_active:false}));
    sprint5TeacherActive = Boolean(s5State.sprint5_active);
    const state = sprint5TeacherActive ? s5State : await rpc("s2_get_teacher_state", payload);
    renderDiscussionState(state);
  } catch (error) {
    runBadge.textContent = "Unavailable";
    discussionState.innerHTML = `<p class="bad">${escapeHtml(error.message)}</p>`;
  }
}

function renderDiscussionState(state) {
  renderOverrideState(state.teacher_override);
  const canonicalFlowActive = Boolean(state.canonical_flow_active);
  openDiscussionButton.disabled = canonicalFlowActive;
  discussionTopicInput.disabled = canonicalFlowActive;
  voteOptionsInput.disabled = canonicalFlowActive;
  if (!state.active) {
    runBadge.textContent = "No active run";
    discussionState.innerHTML = "<p class='muted'>Join all three players, then start a formal run.</p>";
    return;
  }

  runBadge.textContent = state.run.run_mode.toUpperCase();
  runModeInput.disabled = true;
  startRunButton.disabled = true;
  if (canonicalFlowActive) {
    discussionTeacherStatus.textContent = "Canonical gameplay controls the discussion phases.";
  }
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

async function loadOperationsState(){
  const payload=baseTeacherPayload(false);if(!payload)return;
  try{const state=await rpc("s7_get_teacher_console",payload);state.export=await rpc("s8_get_finalization_state",payload).catch(()=>state.export||{});renderOperationsState(state);operationsStatus.textContent="Live operations refreshed.";}
  catch(error){operationsBadge.textContent="Unavailable";operationsState.innerHTML=`<p class="bad">${escapeHtml(error.message)}</p>`;}
}

async function setAuditPrivateDebug(){
  const payload=baseTeacherPayload();if(!payload)return;
  try{await rpc("s7_set_audit_private_debug",{...payload,p_enabled:auditPrivateDebug.checked});operationsStatus.textContent=auditPrivateDebug.checked?"AUDIT private debug enabled and logged.":"Private debug disabled and logged.";await loadOperationsState();}
  catch(error){auditPrivateDebug.checked=false;operationsStatus.textContent=`Private debug unavailable: ${error.message}`;}
}

function renderOperationsState(state){
  const exp=state.export||{};
  const completedRuns=exp.completed_runs||[];
  syncExportRunSelection(exportRunSelect,exportSessionButton,completedRuns,exp.run_id||"",Boolean(exp.export_ready||exp.enabled));
  if(!state.active){operationsBadge.textContent=exp.export_ready?"Completed · export ready":"No active run";operationsState.innerHTML=exp.export_ready?`<p><b>Completed run:</b> ${escapeHtml(exp.run_id||"-")}</p><p><b>Export:</b> ${escapeHtml(exp.json_filename||"ready")}</p>`:"<p class='muted'>Start a formal run to observe live operations.</p>";return;}
  const current=state.current||{},players=state.players||[],discussion=state.discussion||{};
  operationsBadge.textContent=`${state.run.run_mode.toUpperCase()} · ACT ${current.act_no||"?"}`;
  auditPrivateDebug.checked=Boolean(state.run.audit_private_debug_view);auditPrivateDebug.disabled=state.run.run_mode!=="audit";
  const playerRows=players.map(p=>`<tr><td>${escapeHtml(p.display_name)}</td><td>${p.online?"online":"offline"}</td><td>${p.submitted?"submitted":"waiting"}</td><td>${escapeHtml(p.player_location||"-")}</td><td>${p.locked_choice_value?`${escapeHtml(p.locked_choice_value)}<br><small>${escapeHtml(p.locked_choice_state)}</small>`:escapeHtml(p.locked_choice_state||"WAITING")}</td>${state.run.audit_private_debug_view?`<td>${escapeHtml(JSON.stringify(p.audit_debug||{}))}</td>`:""}</tr>`).join("");
  const pockets=(state.pockets||[]).map(p=>`<details><summary>${escapeHtml(p.display_name)} Pocket</summary><p><b>Items:</b> ${escapeHtml((p.items||[]).map(x=>x.item_key).join(", ")||"none")}</p><p><b>Observations:</b> ${escapeHtml((p.observations||[]).map(x=>x.display_text_key).join(", ")||"none")}</p><p><b>Shared photos:</b> ${escapeHtml((p.shared_photos||[]).map(x=>`${x.source_item_key}:${x.source_view}`).join(", ")||"none")}</p></details>`).join("");
  const messages=(discussion.messages||[]).map(m=>`<article class="message"><div><b>${escapeHtml(m.display_name)}</b><time>${escapeHtml(formatTime(m.created_at))}</time></div><p>${escapeHtml(m.message_text)}</p></article>`).join("");
  operationsState.innerHTML=`
    <p><b>Current:</b> ACT ${escapeHtml(current.act_no||"unknown")} · ${escapeHtml(current.scene_id||"-")} / ${escapeHtml(current.phase_key||"-")} / ${escapeHtml(current.step_key||"-")}</p>
    <p><b>Route:</b> ${escapeHtml(current.current_route||"undecided")} · <b>Countdown:</b> ${escapeHtml(state.countdown?.remaining_seconds??"-")} sec · <b>Display:</b> ${escapeHtml(current.display_mode||"-")}</p>
    <table><thead><tr><th>Player</th><th>Presence</th><th>Action</th><th>Location</th><th>Locked choice</th>${state.run.audit_private_debug_view?"<th>AUDIT debug</th>":""}</tr></thead><tbody>${playerRows}</tbody></table>
    <h3>Discussion transcript</h3><div class="transcript teacher-transcript">${messages||"<p class='muted'>No messages yet.</p>"}</div>
    <h3>Pockets and group items</h3>${pockets}<p><b>Group Items:</b> ${escapeHtml((state.group_items||[]).map(x=>x.item_key).join(", ")||"none")}</p>
    <details><summary>Audio trigger debug</summary><p><b>Current cue:</b> ${escapeHtml(state.audio?.current_cue_key||"none")}</p><pre>${escapeHtml(JSON.stringify(state.audio?.recent||[],null,2))}</pre></details>
    <details><summary>Teacher interventions and validity</summary><p><b>Per-phase validity:</b></p><pre>${escapeHtml(JSON.stringify(state.phase_behavior_validity||[],null,2))}</pre><p><b>Durable interventions:</b></p><pre>${escapeHtml(JSON.stringify({interventions:state.teacher_interventions||[],overrides:state.override_history||[]},null,2))}</pre></details>
    <p><b>Export:</b> ${escapeHtml(exp.json_filename||exp.filename_preview||"unavailable")} · ${exp.export_ready?"ready":"waiting for ACT 14 finalization"}</p>`;
}
function syncExportRunSelection(select,button,completedRuns,fallbackRunId,fallbackReady){
  const selectedRunId=select.value||button.dataset.runId;
  select.hidden=completedRuns.length===0;
  select.innerHTML=completedRuns.map(r=>`<option value="${escapeHtml(r.run_id)}">${escapeHtml(r.json_filename||r.run_id)}</option>`).join("");
  if(selectedRunId&&completedRuns.some(r=>r.run_id===selectedRunId))select.value=selectedRunId;
  button.dataset.runId=select.value||completedRuns[0]?.run_id||fallbackRunId||"";
  button.disabled=!button.dataset.runId||(!completedRuns.length&&!fallbackReady);
}
function downloadExport(filename,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const anchor=document.createElement("a");anchor.href=url;anchor.download=filename;document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function exportSprint8Session(){const payload=baseTeacherPayload();if(!payload)return;const runId=exportSessionButton.dataset.runId;exportSessionButton.disabled=true;try{const result=await rpc("s8_export_session",runId?{...payload,p_run_id:runId}:payload);downloadExport(result.json_filename,JSON.stringify(result.json,null,2),"application/json");downloadExport(result.csv_filename,result.csv,"text/csv;charset=utf-8");operationsStatus.textContent=`Exported ${result.json_filename} and ${result.csv_filename}.`}catch(error){operationsStatus.textContent=`Export failed: ${error.message}`}finally{await loadOperationsState()}}
async function initializeSprint5(){const payload=baseTeacherPayload();if(!payload)return;try{const result=await rpc("s5_initialize",payload);discussionTeacherStatus.textContent=`ACT 6–8 flow initialized: ${result.run_id}`;await loadDiscussionState()}catch(error){discussionTeacherStatus.textContent=`Sprint 5 initialization failed: ${error.message}`}}
async function initializeSprint6(){const payload=baseTeacherPayload();if(!payload)return;try{const result=await rpc("s6_initialize",payload);discussionTeacherStatus.textContent=`ACT 9–13 flow initialized: ${result.run_id}`;await loadDiscussionState()}catch(error){discussionTeacherStatus.textContent=`Sprint 6 initialization failed: ${error.message}`}}

function renderOverrideState(override) {
  const actions = override?.allowed_actions || [];
  overrideActions.innerHTML = actions.map((action) => `<button type="button" class="danger override-action" data-action="${escapeHtml(action)}">${escapeHtml(action.replaceAll("_", " "))}</button>`).join("");
  overrideActions.querySelectorAll(".override-action").forEach((button) => button.addEventListener("click", () => applyTeacherOverride(button.dataset.action)));
  const history = override?.history || [];
  overrideHistory.innerHTML = history.length ? history.map((item) => `<div class="notice"><b>OVERRIDE USED</b><p>${escapeHtml(item.override_action)} · ${escapeHtml(item.source_scene)} / ${escapeHtml(item.source_phase)}</p><p>${escapeHtml(item.reason)} · ${escapeHtml(formatTime(item.created_at))}</p></div>`).join("") : "";
  if (!actions.length) overrideActions.innerHTML = "<span class='muted'>No override is available for the current interaction.</span>";
}

async function applyTeacherOverride(action) {
  const payload = baseTeacherPayload();
  const reason = overrideReasonInput.value.trim();
  if (!payload) return;
  if (!reason) { overrideStatus.textContent = "A reason is required."; return; }
  if (!confirm("This action may invalidate behavior data for the current phase. Continue?")) return;
  try {
    const result = await rpc("teacher_apply_override", { ...payload, p_override_action: action, p_reason: reason });
    overrideStatus.textContent = `OVERRIDE USED: ${result.override_action} at ${result.source_scene} / ${result.source_phase}`;
    overrideReasonInput.value = "";
    await loadDiscussionState();
  } catch (error) {
    overrideStatus.textContent = `Override failed: ${error.message}`;
  }
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

async function loadAssets(){
  const token=teacherTokenInput.value.trim();if(!token){assetStatus.textContent="Enter a Teacher token.";return;}
  try{const state=await rpc("asset_manager_state",{p_teacher_token:token});renderAssets(state.assets||[]);assetStatus.textContent="Asset registry projection loaded.";}
  catch(error){assetStatus.textContent=`Assets unavailable: ${error.message}`;}
}

function renderAssets(assets){
  const ready=assets.length>0&&assets.filter(a=>a.runtime_required).every(a=>a.active_version&&a.candidates.some(c=>c.status==="ACTIVE"&&c.version===a.active_version));
  assetReadyBadge.textContent=`GAME READY: ${ready?"YES":"NO"}`;
  const groups={image:assets.filter(a=>a.asset_type==="image"),audio:assets.filter(a=>a.asset_type==="audio")};
  assetManagerState.innerHTML=[['Images',groups.image],['Audio',groups.audio]].map(([name,items])=>`<section><h3>${name}</h3>${items.length?items.map(a=>{
    const latest=a.candidates[0],status=latest?.status||(a.latest_version?"UPLOADED":"MISSING");
    return `<article class="notice"><div class="topline"><div><b>${escapeHtml(a.display_name)}</b><p><code>${escapeHtml(a.asset_key)}</code></p></div><span class="badge">${escapeHtml(status)}</span></div><p>Latest v${a.latest_version} · ACTIVE ${a.active_version||"none"}</p>${latest?`<p>${escapeHtml(latest.revision_note||latest.technical_notes||"")}</p>`:""}<div class="button-row">${latest?.asset_type==="image"&&latest?.storage_path&&a.required_anchors?.length?`<button class="secondary mark-anchor" data-candidate='${escapeHtml(JSON.stringify({id:latest.asset_id,path:latest.storage_path,required:a.required_anchors,anchors:latest.ui_anchors||[]}))}'>Mark anchors</button>`:""}${latest?.status==="PENDING_REVIEW"?`<button class="asset-review" data-id="${latest.asset_id}" data-decision="APPROVED">Approve</button><button class="danger asset-review" data-id="${latest.asset_id}" data-decision="REJECTED">Reject</button>`:""}</div></article>`}).join(''):"<p class='muted'>No assets.</p>"}</section>`).join('');
  assetManagerState.querySelectorAll('.asset-review').forEach(b=>b.addEventListener('click',()=>reviewAsset(b.dataset.id,b.dataset.decision)));
  assetManagerState.querySelectorAll('.mark-anchor').forEach(b=>b.addEventListener('click',()=>openAnchor(JSON.parse(b.dataset.candidate))));
}

async function reviewAsset(assetId,decision){
  const token=teacherTokenInput.value.trim();if(!confirm(`${decision} this immutable candidate?`))return;
  try{await rpc("asset_manager_review",{p_teacher_token:token,p_asset_id:assetId,p_decision:decision,p_reviewer:"Teacher"});await loadAssets();}
  catch(error){assetStatus.textContent=`Review failed: ${error.message}`;}
}

function selectAnchor(name){anchorDraft=null;anchorBox.hidden=true;anchorPrompt.textContent=`Drag a rectangle around ${name}.`;anchorStatus.textContent=''}
function openAnchor(candidate){anchorCandidate=candidate;anchorNameSelect.innerHTML=candidate.required.map(name=>`<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('');const missing=candidate.required.find(name=>!candidate.anchors.some(a=>a.anchor_name===name));anchorNameSelect.value=missing||candidate.required[0];selectAnchor(anchorNameSelect.value);anchorImage.src=`https://qdcbdcjobzytzhnhfwyn.supabase.co/storage/v1/object/public/${candidate.path}`;anchorDialog.showModal()}
anchorNameSelect.addEventListener('change',()=>selectAnchor(anchorNameSelect.value));
anchorStage.addEventListener('pointerdown',e=>{const r=anchorStage.getBoundingClientRect();anchorStart={x:e.clientX-r.left,y:e.clientY-r.top};anchorBox.hidden=false});
anchorStage.addEventListener('pointermove',e=>{if(!anchorStart)return;const r=anchorStage.getBoundingClientRect(),x=Math.max(0,Math.min(anchorStart.x,e.clientX-r.left)),y=Math.max(0,Math.min(anchorStart.y,e.clientY-r.top)),w=Math.abs(e.clientX-r.left-anchorStart.x),h=Math.abs(e.clientY-r.top-anchorStart.y);Object.assign(anchorBox.style,{left:`${x}px`,top:`${y}px`,width:`${w}px`,height:`${h}px`});anchorDraft={anchor_name:anchorNameSelect.value,x_percent:x/r.width*100,y_percent:y/r.height*100,width_percent:w/r.width*100,height_percent:h/r.height*100}});
anchorStage.addEventListener('pointerup',()=>anchorStart=null);
saveAnchorButton.addEventListener('click',async()=>{if(!anchorDraft){anchorStatus.textContent='Draw an anchor first.';return}try{const anchors=[...anchorCandidate.anchors.filter(a=>a.anchor_name!==anchorDraft.anchor_name),anchorDraft];await rpc('asset_manager_save_anchors',{p_teacher_token:teacherTokenInput.value.trim(),p_asset_id:anchorCandidate.id,p_ui_anchors:anchors});anchorCandidate.anchors=anchors;anchorStatus.textContent='Anchor saved.';await loadAssets()}catch(e){anchorStatus.textContent=`Save failed: ${e.message}`}});
