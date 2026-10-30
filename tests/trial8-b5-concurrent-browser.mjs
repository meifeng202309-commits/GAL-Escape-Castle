import http from "node:http";
import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { performance } from "node:perf_hooks";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = process.cwd();
const server = http.createServer(async (request, response) => {
  try {
    const relative = decodeURIComponent(new URL(request.url, "http://localhost").pathname).replace(/^\/+/, "") || "index.html";
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep)) throw new Error("path escape");
    const content = await readFile(file);
    response.writeHead(200, { "Content-Type": /\.(m?js)$/.test(file) ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html" });
    response.end(content);
  } catch { response.writeHead(404); response.end("Not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true, executablePath: process.env.GAL_A1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const allRows = [], summary = [];
const traceMode = process.argv.find(arg => arg.startsWith("--trace-mode="))?.split("=")[1] || null;
const exports = [];
function probe({ testId, role }) {
  const started = performance.now(), rows = [];
  const emit = (event_name, extra = {}) => rows.push({ test_id: testId, ACT: "ACT2", role, action: "Teacher_open_vote_plus_three_Player_votes", attempt: 1, event_name, utc: new Date().toISOString(), monotonic_ms: +(performance.now() - started).toFixed(3), clock_domain: "browser", ...extra });
  globalThis.__B5_CONCURRENT__ = { rows, emit };
  emit("test_setup");
  const originalFetch = fetch.bind(window);
  window.fetch = async (...args) => {
    const url = String(args[0]);
    if (!url.includes("/rest/v1/rpc/")) return originalFetch(...args);
    const rpc = url.split("/").pop(), start = performance.now();
    emit("rpc_start", { rpc, method: args[1]?.method || "GET" });
    try {
      const response = await originalFetch(...args);
      emit("rpc_headers", { rpc, http_status: response.status, elapsed_ms: +(performance.now() - start).toFixed(3) });
      await response.clone().text();
      emit("rpc_end", { rpc, http_status: response.status, elapsed_ms: +(performance.now() - start).toFixed(3) });
      return response;
    } catch (error) { emit("rpc_error", { rpc, error_category: error.name }); throw error; }
  };
  document.addEventListener("click", event => { if (event.target.closest("button")) emit("click_dispatched", { target: event.target.id || event.target.dataset.voteId || "button" }); }, true);
  new MutationObserver(() => {
    const node = document.querySelector(role === "Teacher" ? "#discussionTeacherStatus" : "#voteArea");
    if (node && !globalThis.__B5_CONCURRENT__.marked && node.textContent.includes(role === "Teacher" ? "Voting opened" : "Library")) { globalThis.__B5_CONCURRENT__.marked = true; emit("dom_target_visible"); }
  }).observe(document, { childList: true, subtree: true, characterData: true });
}
try {
  const repetitionCount = traceMode === "interleaved" ? 10 : 5;
  for (let repetition = 1; repetition <= repetitionCount; repetition++) {
    const caseTraceMode = traceMode === "interleaved" ? (repetition % 2 ? "off" : "on") : traceMode;
    const testId = `ACT2_concurrent_${repetition}`, start = performance.now();
    let status = "discussion";
    const votes = new Map(), serverEvents = [], pages = [];
    const serverEvent = (event_name, extra = {}) => serverEvents.push({ test_id: testId, ACT: "ACT2", role: "Server fixture", action: "Teacher_open_vote_plus_three_Player_votes", attempt: 1, event_name, utc: new Date().toISOString(), monotonic_ms: +(performance.now() - start).toFixed(3), clock_domain: "node", ...extra });
    for (const role of ["GAL-A", "GAL-B", "GAL-C", "Teacher"]) {
      const page = await browser.newPage();
      pages.push({ page, role });
      await page.addInitScript(probe, { testId, role });
      if (role !== "Teacher") await page.addInitScript(role => {
        localStorage.setItem("gal_castle_escape_session_v1", JSON.stringify({ room_code: "B5MOCK", player_id: `00000000-0000-4000-8000-${role === "GAL-A" ? "000000000001" : role === "GAL-B" ? "000000000002" : "000000000003"}`, display_name: role, role_slot: role, session_token: role }));
        globalThis.__GAL_A1_TEST_HOOKS__ = {};
      }, role);
      await page.route("**/rest/v1/rpc/**", async route => {
        const rpc = new URL(route.request().url()).pathname.split("/").pop(), token = route.request().postDataJSON()?.p_session_token;
        let value;
        if (rpc === "s8_get_player_state") value = { active: false };
        else if (rpc === "s2_get_player_state") value = { active: true, discussion: { discussion_session_id: "00000000-0000-4000-8000-000000000009", topic: "Test", status, vote_round: 1, phase_deadline: null, require_final_vote: true, vote_options: [{ id: "library", label: "Library" }] }, initial_choices: [], messages: [], submitted_vote_count: votes.size, my_vote: votes.has(token) ? { choice_label: "Library" } : null, revealed_votes: status === "resolved" ? [...votes.keys()].map(display_name => ({ display_name, choice_label: "Library" })) : [], vote_history: [] };
        else if (rpc === "s3b_get_player_state") value = { active: true, run_id: "00000000-0000-4000-8000-000000000010", scene: { scene_id: "act2_first_contact", phase_key: "meeting_discussion", step_key: "final_meeting", text_key: "act02.001" }, flow: {}, me: { act1_stage: "complete", first_meeting_locked_at: "2026-10-29T15:00:00Z", grab_complete: true, left_start_room: true }, queued_first_messages: [], act4_revealed: [] };
        else if (rpc === "s5_get_player_state" || rpc === "s6_get_player_state") value = { active: false };
        else if (rpc === "s3_get_player_state") value = { active: true, items: [], inspected_item_keys: [], group_items: [], observations: [], shared_photos: [], scene: { allow_share_photo: false } };
        else if (rpc === "s1_get_teacher_state") value = { room_code: "B5MOCK", current_scene: 2, phase: "running", players: [], decisions: [] };
        else if (rpc === "s6_get_teacher_discussion_state") value = { sprint6_active: false };
        else if (rpc === "s5_get_teacher_discussion_state") value = { sprint5_active: false };
        else if (rpc === "s2_get_teacher_state") value = { active: true, run: { run_id: "run", run_mode: "normal" }, discussion: { discussion_session_id: "00000000-0000-4000-8000-000000000009", status, vote_round: 1, topic: "Test", messages: [], vote_options: [{ id: "library", label: "Library" }] }, teacher_override: {} };
        else if (rpc === "s7_get_teacher_console") value = { active: false, players: [], operations_v1: [], discussion: { messages: [] }, pockets: [], group_items: [], audio: { recent: [] }, phase_behavior_validity: [], teacher_interventions: [], override_history: [], export: {} };
        else if (rpc === "s8_get_finalization_state") value = { export_ready: false };
        else if (rpc === "asset_resolve") value = { ok: false };
        else if (rpc === "s2_open_vote") { status = "voting"; value = { ok: true }; serverEvent("teacher_gate_end", { rpc }); }
        else if (rpc === "s2_submit_vote") { if (status !== "voting") return route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ message: "Gate closed" }) }); votes.set(token, "library"); if (votes.size === 3) { status = "resolved"; serverEvent("three_player_barrier_end", { rpc, count: 3 }); } value = { ok: true }; }
        else return route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ message: `Unexpected ${rpc}` }) });
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(value) });
      });
      await page.goto(`http://127.0.0.1:${server.address().port}/${role === "Teacher" ? "teacher.html" : "index.html"}${caseTraceMode ? "?perfTrace=supervised" : ""}`, { waitUntil: "networkidle" });
      if (caseTraceMode === "on") await page.locator("#supervisedPerformanceTrace button").first().click();
      if (role === "Teacher") { await page.fill("#roomCode", "B5MOCK"); await page.fill("#teacherToken", "TOKEN"); await page.click("#watchButton"); }
      else await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.stopPolling());
    }
    serverEvent("teacher_gate_start");
    const teacher = pages.find(item => item.role === "Teacher").page;
    await teacher.locator("#openVoteButton").click();
    await teacher.locator("#discussionTeacherStatus").filter({ hasText: "Voting opened" }).waitFor();
    await Promise.all(pages.filter(item => item.role !== "Teacher").map(({ page }) => page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())));
    serverEvent("three_player_barrier_start");
    await Promise.all(pages.filter(item => item.role !== "Teacher").map(({ page }) => page.locator('[data-vote-id="library"]').click()));
    if (votes.size !== 3 || status !== "resolved") throw new Error("Three-player vote did not resolve exactly once");
    await Promise.all(pages.filter(item => item.role !== "Teacher").map(({ page }) => page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())));
    await Promise.all(pages.filter(item => item.role !== "Teacher").map(({ page }) => page.waitForFunction(() => document.querySelector("#voteArea")?.textContent.includes("Library"))));
    allRows.push(...serverEvents);
    for (const { page, role } of pages) {
      allRows.push(...await page.evaluate(() => globalThis.__B5_CONCURRENT__.rows));
      if (caseTraceMode === "on") {
        if (role !== "Teacher") await page.locator("#leaveButton").click();
        await page.evaluate(() => {
          const trace = document.querySelector("#supervisedPerformanceTrace");
          if (!trace) throw Error("Trace panel missing");
          window.dispatchEvent(new Event("blur"));
          document.dispatchEvent(new Event("visibilitychange"));
        });
        const downloadPromise = page.waitForEvent("download");
        await page.locator("#supervisedPerformanceTrace button").nth(1).click();
        const download = await downloadPromise;
        const trace = JSON.parse(await readFile(await download.path(), "utf8"));
        if (trace.rows.some(row => JSON.stringify(row).includes("p_session_token") || JSON.stringify(row).includes("choice_label"))) throw Error("Sensitive data in trace export");
        if (!trace.rows.some(row => row.event === "visibilitychange") || !trace.rows.some(row => row.event === "blur")) throw Error("Focus/visibility trace missing");
        if (role !== "Teacher" && !trace.rows.some(row => row.event === "click" && row.target === "leaveButton")) throw Error("Session-switch trace missing");
        if (!trace.clock_note.includes("one-way latency is not identifiable")) throw Error("Clock caveat missing");
        exports.push({ test_id: testId, role, rows: trace.rows.length, dropped: trace.dropped, events: [...new Set(trace.rows.map(row => row.event))] });
      } else if (caseTraceMode === "off" && await page.locator("#supervisedPerformanceTrace").isVisible()) {
        if (!await page.locator("#supervisedPerformanceTrace button").nth(1).isDisabled()) throw Error("Default-off trace exported without opt-in");
      }
      await page.close();
    }
    summary.push({ test_id: testId, trace_mode: caseTraceMode, votes: votes.size, teacher_gate_end_utc: serverEvents.find(e => e.event_name === "teacher_gate_end").utc, barrier_end_utc: serverEvents.find(e => e.event_name === "three_player_barrier_end").utc });
    console.log(`PASS ${testId}`);
  }
  allRows.sort((a, b) => Date.parse(a.utc) - Date.parse(b.utc));
  const base = traceMode ? `docs/reports/remediation/ui/trial8-b6/B6_REAL_CLIENT_TRACE_${traceMode.toUpperCase()}` : "docs/reports/remediation/ui/trial8-b4/B5_CONCURRENT";
  await writeFile(`${base}_TIMELINE.jsonl`, allRows.map(row => JSON.stringify(row)).join("\n") + "\n");
  await writeFile(`${base}_SUMMARY.json`, JSON.stringify({ summary, exports }, null, 2) + "\n");
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
