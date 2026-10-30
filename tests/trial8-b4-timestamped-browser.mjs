import http from "node:http";
import path from "node:path";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { performance } from "node:perf_hooks";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = process.cwd();
const manifest = JSON.parse(await readFile("tests/fixtures/trial8-b4-manifest.json", "utf8"));
const quick = process.argv.includes("--quick");
const faultsOnly = process.argv.includes("--faults");
const visibilityOnly = process.argv.includes("--visibility");
const extraOnly = process.argv.includes("--extra");
const b5Only = process.argv.includes("--b5");
const targetedOnly = process.argv.includes("--targeted");
const traceFaults = process.argv.includes("--trace-faults");
const onlyCase = process.argv.find(arg => arg.startsWith("--only="))?.slice(7);
const cases = ["ACT2_chat", "ACT2_vote", "ACT9_red", "ACT10_leave", "ACT10_continue", "ACT11_allocation", "Teacher_start", "Teacher_open_vote"];
const delays = quick ? [0] : manifest.read_delay_ms;
const repetitions = quick ? 1 : manifest.repetitions;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const server = http.createServer(async (request, response) => {
  try {
    const relative = decodeURIComponent(new URL(request.url, "http://localhost").pathname).replace(/^\/+/, "") || "index.html";
    const file = path.resolve(root, relative);
    assert(file.startsWith(root + path.sep), "path escape");
    const content = await readFile(file);
    response.writeHead(200, { "Content-Type": /\.(m?js)$/.test(file) ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html" });
    response.end(content);
  } catch { response.writeHead(404); response.end("Not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true, executablePath: process.env.GAL_A1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const rows = [], summaries = [];
const traceExports = [];
const output = "docs/reports/remediation/ui/trial8-b4";
function browserProbe({ testId, act, role }) {
  const started = performance.now();
  const trace = [];
  const probe = { trace, started, attempt: 1 };
  const emit = (event_name, detail = {}) => trace.push({ test_id: testId, ACT: act, role, action: testId.split("_").slice(0, -2).join("_"), attempt: probe.attempt, event_name, utc: new Date().toISOString(), monotonic_ms: +(performance.now() - started).toFixed(3), clock_domain: "browser", ...detail });
  probe.emit = emit;
  globalThis.__B4__ = probe;
  emit("test_setup");
  const originalAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (typeof listener !== "function" || !["click", "submit"].includes(type)) return originalAdd.call(this, type, listener, options);
    const wrapped = function(event) {
      const name = listener.name || "anonymous";
      if (/sendMessage|submitVote|submitLibraryCode|sendSprint6Message|runSprint6Action|submitSprint6Station|startRun|openVote/.test(name) || this.dataset?.s6Rpc || this.dataset?.s5Rpc || this.dataset?.s3bRpc || this.dataset?.voteId) emit("handler_entered", { handler: this.dataset?.s6Rpc ? `S6_click_${this.dataset.s6Rpc}` : this.dataset?.s5Rpc ? `S5_click_${this.dataset.s5Rpc}` : this.dataset?.s3bRpc ? `S3b_click_${this.dataset.s3bRpc}` : this.dataset?.voteId ? "vote_button_listener" : name, event_type: type });
      return listener.call(this, event);
    };
    return originalAdd.call(this, type, wrapped, options);
  };
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const url = String(args[0]);
    if (!url.includes("/rest/v1/rpc/")) return originalFetch(...args);
    const rpc = url.split("/").pop();
    let payload = {};
    try { payload = JSON.parse(args[1]?.body || "{}"); } catch {}
    const detail = { rpc, method: args[1]?.method || "GET", request_id: payload.p_client_request_id || null, phase_identity: payload.p_expected_phase || null };
    const start = performance.now();
    emit("rpc_start", detail);
    try {
      const response = await originalFetch(...args);
      emit("rpc_headers", { ...detail, http_status: response.status, elapsed_ms: +(performance.now() - start).toFixed(3) });
      const body = await response.clone().text();
      emit("rpc_end", { ...detail, http_status: response.status, error_category: response.ok ? null : `HTTP_${response.status}`, body_category: response.ok ? "success" : "error", elapsed_ms: +(performance.now() - start).toFixed(3) });
      if (response.ok && globalThis.__B4__.targetedRpc === rpc && !globalThis.__B4__.targetedStarted) {
        globalThis.__B4__.targetedStarted = true;
        const auth = { p_room_code: payload.p_room_code, p_session_token: payload.p_session_token };
        const targetUrl = url.replace(/\/[^/]+$/, "/s6_get_player_state");
        emit("targeted_read_start", { rpc: "s6_get_player_state", phase_identity: payload.p_expected_phase });
        void originalFetch(targetUrl, { ...args[1], body: JSON.stringify(auth) }).then(async read => {
          const projected = await read.json();
          const valid = read.ok && projected?.state?.run_id === "00000000-0000-4000-8000-000000000010" && projected?.state?.phase_key === "act9_console" && projected?.state?.act9_step >= 2;
          emit("targeted_read_end", { rpc: "s6_get_player_state", http_status: read.status, valid, phase_identity: projected?.state?.phase_key || null });
        }).catch(error => emit("targeted_read_error", { error_category: error.name || "network" }));
      }
      return response;
    } catch (error) {
      emit("rpc_error", { ...detail, error_category: error.name || "network", elapsed_ms: +(performance.now() - start).toFixed(3) });
      throw error;
    }
  };
  for (const type of ["pointerdown", "pointerup", "pointercancel", "click", "submit"]) document.addEventListener(type, event => {
    if (event.target.closest("button,form")) emit("input_dispatched", { input_type: type, target: event.target.id || event.target.dataset.s6Choice || event.target.dataset.voteId || event.target.tagName });
  }, true);
  for (const type of ["visibilitychange", "focus", "blur"]) window.addEventListener(type, () => emit(type, { visibility: document.visibilityState }));
  let prior = "";
  setInterval(() => {
    const state = globalThis.__GAL_A1_TEST_HOOKS__?.coordinatorState?.();
    if (!state) return;
    const current = JSON.stringify(state);
    if (current !== prior) {
      emit("refresh_state", { generation: state.generation, queued: state.queued, in_flight: state.inFlight, epoch: state.epoch, status: !state.inFlight && !state.queued ? "settled_or_idle" : state.queued ? "queued" : "in_flight" });
      prior = current;
    }
  }, 10);
  new MutationObserver(mutations => {
    const watched = globalThis.__B4__.watchTarget && document.querySelector(globalThis.__B4__.watchTarget);
    if (watched && (!globalThis.__B4__.watchText || watched.textContent.includes(globalThis.__B4__.watchText)) && !globalThis.__B4__.targetMarked) {
      globalThis.__B4__.targetMarked = true;
      emit("dom_target_visible", { target: globalThis.__B4__.watchTarget, phase_identity: document.querySelector("#sprint3bPanel")?.dataset.runtimeIdentity || null });
    }
    for (const mutation of mutations) if (mutation.type === "attributes" && mutation.attributeName === "disabled") {
      const node = mutation.target;
      if (node instanceof HTMLElement && (node.id || node.dataset.s6Choice || node.dataset.voteId)) emit("disabled_change", { target: node.id || node.dataset.s6Choice || node.dataset.voteId, disabled: node.disabled });
    }
  }).observe(document, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["disabled"] });
}
const caseInfo = {
  ACT2_chat: { act: "ACT2", role: "Player", rpc: "s2_send_message", target: "#transcript", phase: "meeting_discussion" },
  ACT2_vote: { act: "ACT2", role: "Player", rpc: "s2_submit_vote", target: "#voteArea .good", phase: "meeting_discussion" },
  ACT9_red: { act: "ACT9", role: "Player", rpc: "s6_submit_group_choice_v2", target: '[data-s6-choice="do_not_enter"]', phase: "act9_console" },
  ACT10_leave: { act: "ACT10", role: "Player", rpc: "s6_submit_private_choice_v2", target: "#s6MessageText", phase: "act10_private" },
  ACT10_continue: { act: "ACT10→11", role: "Player", rpc: "s6_advance_v2", target: '[data-s6-choice="A"]', phase: "act10_result" },
  ACT11_allocation: { act: "ACT11", role: "Player", rpc: "s6_submit_allocation_v2", target: "#s6StationForm", phase: "act11_allocation" },
  ACT12_station: { act: "ACT12", role: "Player", rpc: "s6_complete_station_v2", target: '[data-s6-rpc="s6_engage_v2"]', phase: "act12_tasks" },
  ACT13_continue: { act: "ACT13", role: "Player", rpc: "s6_advance_v2", target: "#s8Finalize", phase: "act13_escape" },
  ACT1_ack: { act: "ACT1", role: "Player", rpc: "s3b_ack_act1_opening", target: '[data-s3b-rpc="s3b_submit_act1_choice"]', phase: "act1_wake_up" },
  ACT3_code: { act: "ACT3", role: "Player", rpc: "s3b_submit_library_code", target: '[data-s3b-rpc="s3b_submit_act4_choice"]', phase: "library_box" },
  ACT4_choice: { act: "ACT4", role: "Player", rpc: "s3b_submit_act4_choice", target: ".accepted-waiting", phase: "act4_known_unknown" },
  ACT5_chat: { act: "ACT5", role: "Player", rpc: "s5_send_message", target: "#transcript", phase: "act5_discussion" },
  ACT5_route_vote: { act: "ACT5", role: "Player", rpc: "s3b_submit_post_inspection_route_vote", target: ".good", phase: "post_inspection_route" },
  ACT6_vote: { act: "ACT6", role: "Player", rpc: "s5_submit_vote", target: "#voteArea .good", phase: "act6_vote" },
  ACT6_advance: { act: "ACT6", role: "Player", rpc: "s5_advance", target: ".clock-stage", phase: "act6_answer" },
  ACT7_advance: { act: "ACT7", role: "Player", rpc: "s5_advance", target: '[data-s5-rpc="s5_submit_private_choice"]', phase: "act7_solved" },
  ACT8_private: { act: "ACT8", role: "Player", rpc: "s5_submit_private_choice", target: ".accepted-waiting", phase: "act8_private" },
  ACT8_advance: { act: "ACT8→9", role: "Player", rpc: "s5_advance", target: '[data-s6-choice="red"]', phase: "act8_route" },
  ACT11_chat: { act: "ACT11", role: "Player", rpc: "s6_send_message_v2", target: "#sprint6DiscussionMount .transcript", phase: "act11_discussion" },
  Teacher_start: { act: "Setup→ACT1", role: "Teacher", rpc: "s9_start_formal_game", target: "#discussionTeacherStatus", phase: "pre-run" },
  Teacher_open_vote: { act: "ACT2", role: "Teacher", rpc: "s2_open_vote", target: "#discussionTeacherStatus", phase: "discussion" },
};
async function runCase(name, delayMs, repetition, fault = null) {
  const info = caseInfo[name], testId = `${name}_${fault || delayMs}_${repetition}`;
  const started = performance.now();
  const page = await browser.newPage();
  let phase = info.phase, step = 1, voted = false, messages = [], teacherVoteOpen = false, serverTransition = null, faultInjected = false, transitionCount = 0, stationDone = false, act1Stage = "opening", act4Locked = false, privateChoice = false, routeVoted = false;
  await page.addInitScript(browserProbe, { testId, act: info.act, role: info.role });
  if (info.role === "Player") await page.addInitScript(() => {
    localStorage.setItem("gal_castle_escape_session_v1", JSON.stringify({ room_code: "B4MOCK", player_id: "00000000-0000-4000-8000-000000000008", display_name: "Linda", role_slot: "GAL-C", session_token: "TEST" }));
    globalThis.__GAL_A1_TEST_HOOKS__ = {};
  });
  const nodeEvent = (event_name, extra = {}) => rows.push({ test_id: testId, ACT: info.act, role: info.role, action: name, attempt: 1, event_name, utc: new Date().toISOString(), monotonic_ms: +(performance.now() - started).toFixed(3), clock_domain: "node", ...extra });
  await page.route("**/rest/v1/rpc/**", async route => {
    const rpc = new URL(route.request().url()).pathname.split("/").pop();
    const routePhase = phase, routeStep = step;
    if (fault && serverTransition && rpc === "s6_get_player_state" && !faultInjected) {
      faultInjected = true;
      nodeEvent("fault_injection", { fault, rpc });
      if (["read500", "read400"].includes(fault)) return route.fulfill({ status: fault === "read500" ? 500 : 400, contentType: "application/json", body: JSON.stringify({ message: "Synthetic read failure" }) });
      if (fault === "read_network") return route.abort("failed");
      if (fault === "stalled_read") await new Promise(resolve => setTimeout(resolve, 2000));
    }
    if (rpc.includes("get_") && delayMs) await new Promise(resolve => setTimeout(resolve, delayMs));
    let value, status = 200;
    if (rpc === "s8_get_player_state") value = { active: false };
    else if (rpc === "s2_get_player_state") value = { active: true, discussion: name.startsWith("ACT2_") ? { discussion_session_id: "00000000-0000-4000-8000-000000000009", topic: "Test", status: name === "ACT2_vote" ? "voting" : "discussion", vote_round: 1, phase_deadline: null, require_final_vote: true, vote_options: [{ id: "library", label: "Library" }] } : null, initial_choices: [], messages, submitted_vote_count: voted ? 1 : 0, my_vote: voted ? { choice_label: "Library" } : null, revealed_votes: [], vote_history: [] };
    else if (rpc === "s3b_get_player_state") { value = { active: true, run_id: "00000000-0000-4000-8000-000000000010", scene: { scene_id: routePhase === "library_box" ? "act3_library" : routePhase === "post_inspection_route" ? "act5_inspect_first" : routePhase, phase_key: routePhase, step_key: `step_${routeStep}`, text_key: routePhase === "act1_wake_up" ? "act01-g.001" : "act09.001" }, flow: { puzzle_resolved_at: routePhase === "act4_known_unknown" && name === "ACT3_code" ? "2026-10-29T15:00:00Z" : null }, me: { act1_stage: name === "ACT1_ack" ? act1Stage : "complete", act1_text_keys: [], first_meeting_locked_at: "2026-10-29T15:00:00Z", grab_complete: true, left_start_room: true, act4_locked_at: act4Locked ? "2026-10-29T15:00:00Z" : null, act6_entered_at: name.startsWith("ACT6_") || name.startsWith("ACT7_") || name.startsWith("ACT8_") ? "2026-10-29T15:00:00Z" : null }, my_post_inspection_vote: routeVoted ? "known" : null, post_inspection_vote_count: routeVoted ? 1 : 0, queued_first_messages: [], act4_revealed: [] }; if (name === "ACT4_choice") nodeEvent("act4_projection_fixture", { act4Locked, scene_id: value.scene.scene_id, locked_at: value.me.act4_locked_at }); }
    else if (rpc === "s5_get_player_state") value = name === "ACT5_chat" || name.startsWith("ACT6_") || name.startsWith("ACT7_") || name.startsWith("ACT8_") && routePhase.startsWith("act8") ? { active: true, state: { run_id: "00000000-0000-4000-8000-000000000010", act_no: routePhase.startsWith("act5") ? 5 : routePhase.startsWith("act6") ? 6 : routePhase.startsWith("act7") ? 7 : 8, phase_key: routePhase, vote_round: 1, route_taken_act8: "main_gate", act7_wrong_attempts: 0 }, private_choices_revealed: [], my_private_choice: privateChoice ? "main_gate" : null, canonical_discussion: { active: true } } : { active: false };
    else if (rpc === "s5_get_discussion_state") value = name === "ACT5_chat" || name === "ACT6_vote" ? { active: true, discussion: { discussion_session_id: "00000000-0000-4000-8000-000000000009", topic: "Test", status: name === "ACT6_vote" ? "voting" : "discussion", vote_round: 1, phase_deadline: null, require_final_vote: true, vote_options: [{ id: "library", label: "Library" }] }, initial_choices: [], messages, submitted_vote_count: voted ? 1 : 0, my_vote: voted ? { choice_label: "Library" } : null, revealed_votes: [], vote_history: [] } : { active: false };
    else if (rpc === "s6_get_player_state") value = { active: !(name.startsWith("ACT2_") || name.startsWith("ACT1_") || name.startsWith("ACT3_") || name.startsWith("ACT4_") || name.startsWith("ACT5_") || name.startsWith("ACT6_") || name.startsWith("ACT7_") || name.startsWith("ACT8_") && routePhase.startsWith("act8")), run_id: "00000000-0000-4000-8000-000000000010", state: { run_id: "00000000-0000-4000-8000-000000000010", act_no: routePhase.startsWith("act9") ? 9 : routePhase.startsWith("act10") ? 10 : routePhase.startsWith("act13") ? 13 : routePhase === "act12_tasks" ? 12 : 11, phase_key: routePhase, act9_step: routeStep, round_no: 1, gold_key: false, feedback_text_keys: [] }, scene_asset_key: null, discussion: ["act10_discussion", "act11_discussion"].includes(routePhase) ? { discussion_session_id: "00000000-0000-4000-8000-000000000011", phase_key: routePhase, status: "discussion", topic: "Gold key", messages: routePhase === "act11_discussion" ? messages : [], vote_round: 1, phase_deadline: null } : null, allocation: routePhase === "act12_tasks" ? "A" : null, station_task: stationDone ? { complete: true } : null, act13_continue_at: "2026-10-29T00:00:00Z", private_choices_revealed: [], audio_occurrence: null };
    else if (rpc === "s9_get_player_wait_state") value = { active: false };
    else if (rpc === "s3_get_player_state") value = { active: true, items: [], inspected_item_keys: [], group_items: [], observations: [], shared_photos: [], scene: { allow_share_photo: false } };
    else if (rpc === "asset_resolve") value = { ok: false };
    else if (rpc === "s1_get_teacher_state") value = { room_code: "B4MOCK", current_scene: 1, phase: "collecting", players: [], decisions: [] };
    else if (rpc === "s6_get_teacher_discussion_state") value = { sprint6_active: false };
    else if (rpc === "s5_get_teacher_discussion_state") value = { sprint5_active: false };
    else if (rpc === "s2_get_teacher_state") value = { active: name !== "Teacher_start", run: { run_id: "run", run_mode: "normal" }, discussion: name === "Teacher_open_vote" ? { discussion_session_id: "00000000-0000-4000-8000-000000000009", status: teacherVoteOpen ? "voting" : "discussion", vote_round: 1, topic: "Test", messages: [], vote_options: [{ id: "library", label: "Library" }] } : null, teacher_override: {} };
    else if (rpc === "s7_get_teacher_console") value = { active: false, players: [], operations_v1: [], discussion: { messages: [] }, pockets: [], group_items: [], audio: { recent: [] }, phase_behavior_validity: [], teacher_interventions: [], override_history: [], export: {} };
    else if (rpc === "s8_get_finalization_state") value = { export_ready: false };
    else if (rpc === "s2_send_message") { messages.push({ display_name: "Linda", message_text: route.request().postDataJSON().p_message_text, created_at: new Date().toISOString() }); value = { ok: true }; }
    else if (rpc === "s2_submit_vote") { voted = true; value = { ok: true }; }
    else if (rpc === "s5_send_message") { messages.push({ display_name: "Linda", message_text: route.request().postDataJSON().p_message_text, created_at: new Date().toISOString() }); value = { ok: true }; }
    else if (rpc === "s5_submit_vote") { voted = true; value = { ok: true }; }
    else if (rpc === "s6_submit_group_choice_v2") { step = 2; value = { ok: true, resolved: true }; }
    else if (rpc === "s6_submit_private_choice_v2") { phase = "act10_discussion"; value = { ok: true }; }
    else if (rpc === "s6_advance_v2") { phase = name === "ACT13_continue" ? "act13_boundary" : "act11_allocation"; value = { ok: true }; }
    else if (rpc === "s6_submit_allocation_v2") { phase = "act12_tasks"; value = { ok: true }; }
    else if (rpc === "s6_complete_station_v2") { stationDone = true; value = { ok: true }; }
    else if (rpc === "s3b_ack_act1_opening") { act1Stage = "action"; value = { ok: true }; }
    else if (rpc === "s3b_submit_library_code") { phase = "act4_known_unknown"; value = { ok: true }; }
    else if (rpc === "s3b_submit_act4_choice") { act4Locked = true; nodeEvent("act4_lock_fixture", { act4Locked }); value = { ok: true }; }
    else if (rpc === "s3b_submit_post_inspection_route_vote") { routeVoted = true; value = { ok: true }; }
    else if (rpc === "s5_advance") { phase = name === "ACT6_advance" ? "act7_vote" : name === "ACT8_advance" ? "act9_console" : "act8_private"; value = { ok: true }; }
    else if (rpc === "s5_submit_private_choice") { privateChoice = true; value = { ok: true }; }
    else if (rpc === "s6_send_message_v2") { messages.push({ display_name: "Linda", message_text: route.request().postDataJSON().p_message_text, created_at: new Date().toISOString() }); value = { ok: true }; }
    else if (rpc === "s9_start_formal_game") value = { run_id: "run" };
    else if (rpc === "s2_open_vote") { teacherVoteOpen = true; value = { ok: true }; }
    else { status = 400; value = { message: `Unexpected ${rpc}` }; }
    if (rpc === info.rpc && status === 200 && !serverTransition) { serverTransition = new Date().toISOString(); transitionCount++; nodeEvent("server_authoritative_transition", { rpc, server_transition_utc: serverTransition }); }
    if (rpc === info.rpc && fault === "missed_response" && !faultInjected) { faultInjected = true; nodeEvent("fault_injection", { fault, rpc }); return route.abort("failed"); }
    await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(value) });
  });
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/${info.role === "Teacher" ? "teacher.html" : "index.html"}${traceFaults ? "?perfTrace=supervised" : ""}`, { waitUntil: "networkidle" });
    if (traceFaults) await page.locator("#supervisedPerformanceTrace button").first().click();
    if (info.role === "Player") await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.stopPolling());
    else { await page.fill("#roomCode", "B4MOCK"); await page.fill("#teacherToken", "TOKEN"); await page.click("#watchButton"); }
    let target = info.target;
    await page.evaluate(({ target, name, phase }) => {
      const probe = globalThis.__B4__;
      probe.emit("initial_authoritative_visible", { phase_identity: phase });
      probe.watchTarget = target;
      probe.watchText = ["ACT2_chat", "ACT5_chat", "ACT11_chat"].includes(name) ? "__set_after__" : name === "Teacher_start" ? "Formal run ready" : name === "Teacher_open_vote" ? "Voting opened" : null;
      probe.emit("action_begin", { target, phase_identity: phase });
    }, { target, name, phase: info.phase });
    if (["ACT2_chat", "ACT5_chat", "ACT11_chat"].includes(name)) await page.evaluate(id => { globalThis.__B4__.watchText = id; }, testId);
    if (targetedOnly) await page.evaluate(rpc => { globalThis.__B4__.targetedRpc = rpc; }, info.rpc);
    let coverPage;
    if (fault === "background") {
      coverPage = await browser.newPage();
      await coverPage.goto(`http://127.0.0.1:${server.address().port}/index.html`);
      await coverPage.bringToFront();
      nodeEvent("background_entered", { visibility: await page.evaluate(() => document.visibilityState) });
    }
    if (fault === "queued_old_poll") {
      nodeEvent("old_poll_requested");
      void page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    if (name === "ACT2_chat") { await page.fill("#messageText", testId); await page.locator("#sendMessageButton").click(); }
    else if (name === "ACT2_vote") await page.locator('[data-vote-id="library"]').click();
    else if (name === "ACT9_red") await page.locator('[data-s6-choice="red"]').click();
    else if (name === "ACT10_leave") await page.locator('[data-s6-choice="leave"]').click();
    else if (name === "ACT10_continue") await page.locator('[data-s6-rpc="s6_advance_v2"]').click();
    else if (name === "ACT11_allocation") await page.locator('[data-s6-choice="A"]').click();
    else if (name === "ACT12_station") { await page.fill("#s6StationValue", "1897"); await page.locator("#s6StationForm button").click(); }
    else if (name === "ACT13_continue") await page.locator('[data-s6-rpc="s6_advance_v2"]').click();
    else if (name === "ACT1_ack") await page.locator('[data-s3b-rpc="s3b_ack_act1_opening"]').click();
    else if (name === "ACT3_code") { await page.fill("#libraryCode", "12345"); await page.locator("#libraryCodeForm button").click(); }
    else if (name === "ACT4_choice") await page.locator('[data-s3b-rpc="s3b_submit_act4_choice"]').first().click();
    else if (name === "ACT5_route_vote") await page.locator('[data-s3b-rpc="s3b_submit_post_inspection_route_vote"]').first().click();
    else if (name === "ACT5_chat") { await page.fill("#messageText", testId); await page.locator("#sendMessageButton").click(); }
    else if (name === "ACT6_vote") await page.locator('[data-vote-id="library"]').click();
    else if (name === "ACT6_advance" || name === "ACT7_advance" || name === "ACT8_advance") await page.locator('[data-s5-rpc="s5_advance"]').click();
    else if (name === "ACT8_private") await page.locator('[data-s5-rpc="s5_submit_private_choice"]').first().click();
    else if (name === "ACT11_chat") { await page.fill("#s6MessageText", testId); await page.locator("#s6MessageForm button").click(); }
    else if (name === "Teacher_start") await page.locator("#startRunButton").click();
    else await page.locator("#openVoteButton").click();
    if (fault === "background") {
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.bringToFront();
      nodeEvent("foreground_restored", { visibility: await page.evaluate(() => document.visibilityState) });
      await coverPage.close();
    }
    if (["read500", "read400", "read_network"].includes(fault)) {
      await page.locator("#gameStatus .bad").waitFor({ state: "visible", timeout: 5000 });
      nodeEvent("recovery_requested", { fault });
      await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    }
    if (fault === "missed_response") {
      await page.locator("#sprint3bStatus .bad").waitFor({ state: "visible", timeout: 5000 });
      await page.evaluate(() => { globalThis.__B4__.attempt = 2; globalThis.__B4__.emit("retry_dispatched"); });
      await page.locator('[data-s6-choice="red"]').click();
    }
    await page.waitForFunction(({ name, target }) => {
      const node = document.querySelector(target);
      if (["ACT2_chat", "ACT5_chat", "ACT11_chat"].includes(name)) return node?.textContent.includes(name);
      if (name === "Teacher_start") return node?.textContent.includes("Formal run ready");
      if (name === "Teacher_open_vote") return node?.textContent.includes("Voting opened");
      return Boolean(node);
    }, { name, target }, { timeout: 15000 }).catch(async error => { console.error(testId, rows.filter(x => x.test_id === testId), await page.evaluate(() => ({ gameStatus: document.querySelector("#gameStatus")?.textContent, status: document.querySelector("#sprint3bStatus")?.textContent, runtimeIdentity: document.querySelector("#sprint3bPanel")?.dataset.runtimeIdentity, actionHtml: document.querySelector("#sprint3bActions")?.innerHTML?.slice(0, 400), accepted: document.querySelector(".accepted-waiting")?.outerHTML?.slice(0, 200) }))); throw error; });
    await page.waitForFunction(() => globalThis.__B4__.targetMarked, null, { timeout: 5000 });
    if (targetedOnly) await page.waitForFunction(() => globalThis.__B4__.trace.some(e => e.event_name === "targeted_read_end"), null, { timeout: 5000 });
    const events = await page.evaluate(() => globalThis.__B4__.trace);
    rows.push(...events);
    const actionBegin = events.find(e => e.event_name === "action_begin");
    const click = events.find(e => e.event_name === "input_dispatched" && e.monotonic_ms >= actionBegin.monotonic_ms && ["click", "submit"].includes(e.input_type));
    const mutation = events.find(e => e.event_name === "rpc_start" && e.rpc === info.rpc);
    const response = events.find(e => e.event_name === "rpc_end" && e.rpc === info.rpc);
    const visible = events.find(e => e.event_name === "dom_target_visible");
    assert(mutation && (response || fault === "missed_response") && visible, `${testId}: missing mutation/response/DOM trace; rpc starts=${events.filter(e => e.event_name === "rpc_start").map(e => e.rpc).join(",")}; target=${Boolean(visible)}`);
    assert(transitionCount === 1, `${testId}: duplicate authoritative transition`);
    const targeted = events.find(e => e.event_name === "targeted_read_end");
    summaries.push({ test_id: testId, ACT: info.act, role: info.role, action: name, read_delay_ms: delayMs, fault, click_to_mutation_ms: click ? +(mutation.monotonic_ms - click.monotonic_ms).toFixed(3) : null, mutation_to_authoritative_ms: serverTransition ? Date.parse(serverTransition) - Date.parse(mutation.utc) : null, mutation_response_ms: response ? +(response.monotonic_ms - mutation.monotonic_ms).toFixed(3) : null, authoritative_to_visible_ms: serverTransition ? Date.parse(visible.utc) - Date.parse(serverTransition) : null, click_to_visible_ms: click ? +(visible.monotonic_ms - click.monotonic_ms).toFixed(3) : null, click_to_targeted_read_ms: targeted && click ? +(targeted.monotonic_ms - click.monotonic_ms).toFixed(3) : null, targeted_valid: targeted?.valid ?? null, server_transition_utc: serverTransition });
    if (traceFaults) {
      const downloadPromise = page.waitForEvent("download");
      await page.locator("#supervisedPerformanceTrace button").nth(1).click();
      const exported = JSON.parse(await readFile(await (await downloadPromise).path(), "utf8"));
      assert(!JSON.stringify(exported).includes("p_session_token") && !JSON.stringify(exported).includes("message_text"), `${testId}: sensitive trace field`);
      traceExports.push({ test_id: testId, fault, rows: exported.rows.length, dropped: exported.dropped, events: [...new Set(exported.rows.map(row => row.event))] });
    }
  } finally { await page.close(); }
}
try {
  if (targetedOnly) for (const delayMs of (quick ? [0] : [0, 100, 250, 1000])) for (let repetition = 1; repetition <= (quick ? 1 : 5); repetition++) {
    await runCase("ACT9_red", delayMs, repetition);
    console.log(`PASS ACT9 targeted delay=${delayMs} rep=${repetition}`);
  }
  else if (b5Only) for (const delayMs of (quick ? [0] : [0, 250, 1000])) for (let repetition = 1; repetition <= (quick ? 1 : 5); repetition++) for (const name of ["ACT1_ack", "ACT3_code", "ACT4_choice", "ACT5_route_vote", "ACT6_advance", "ACT7_advance", "ACT8_advance", "ACT11_chat"].filter(name => !onlyCase || name === onlyCase)) {
    await runCase(name, delayMs, repetition);
    console.log(`PASS ${name} delay=${delayMs} rep=${repetition}`);
  }
  else if (extraOnly) for (const delayMs of [0, 250, 1000]) for (let repetition = 1; repetition <= 5; repetition++) for (const name of ["ACT12_station", "ACT13_continue"]) {
    await runCase(name, delayMs, repetition);
    console.log(`PASS ${name} delay=${delayMs} rep=${repetition}`);
  }
  else if (visibilityOnly) for (let repetition = 1; repetition <= 5; repetition++) {
    await runCase("ACT9_red", 250, repetition, "background");
    console.log(`PASS ACT9_red background rep=${repetition}`);
  }
  else if (traceFaults) for (const fault of ["read500", "stalled_read", "queued_old_poll", "background"]) {
    await runCase("ACT9_red", fault === "queued_old_poll" ? 250 : 0, 1, fault);
    console.log(`PASS ACT9_red trace fault=${fault}`);
  }
  else if (faultsOnly) for (const fault of ["read400", "read500", "read_network", "missed_response", "stalled_read", "queued_old_poll"]) for (let repetition = 1; repetition <= 5; repetition++) {
    await runCase("ACT9_red", fault === "queued_old_poll" ? 250 : 0, repetition, fault);
    console.log(`PASS ACT9_red fault=${fault} rep=${repetition}`);
  }
  else for (const delayMs of delays) for (let repetition = 1; repetition <= repetitions; repetition++) for (const name of cases) {
    await runCase(name, delayMs, repetition);
    console.log(`PASS ${name} delay=${delayMs} rep=${repetition}`);
  }
  await mkdir(output, { recursive: true });
  rows.sort((a, b) => Date.parse(a.utc) - Date.parse(b.utc));
  const prefix = traceFaults ? "../trial8-b6/B6_REAL_CLIENT_FAULT_" : targetedOnly ? "B5_TARGETED_" : b5Only ? "B5_" : faultsOnly ? "FAULT_" : visibilityOnly ? "VISIBILITY_" : extraOnly ? "EXTRA_" : "";
  await writeFile(`${output}/${prefix}TIMELINE.jsonl`, rows.map(row => JSON.stringify(row)).join("\n") + "\n");
  await writeFile(`${output}/${prefix}SUMMARY.json`, JSON.stringify({ manifest, summaries, traceExports }, null, 2) + "\n");
  console.log(`WROTE ${summaries.length} cases, ${rows.length} events`);
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
