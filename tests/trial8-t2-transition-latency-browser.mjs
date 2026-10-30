import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { installLatencyObserver, decomposeLatency } from "./helpers/trial8-latency-observer.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = process.cwd();
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const server = http.createServer(async (request, response) => {
  try {
    const relative = decodeURIComponent(new URL(request.url, "http://localhost").pathname).replace(/^\/+/, "") || "index.html";
    const file = path.resolve(root, relative);
    assert(file.startsWith(root + path.sep), "path escape");
    response.writeHead(200, { "Content-Type": file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html" });
    response.end(await readFile(file));
  } catch { response.writeHead(404); response.end("Not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true, executablePath: process.env.GAL_A1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const samples = [];
try {
  for (const delayMs of [0, 250]) {
    let phase = "act9_console", step = 1, round = 1, sends = 0;
    const page = await browser.newPage();
    await page.addInitScript(installLatencyObserver);
    await page.addInitScript(() => {
      localStorage.setItem("gal_castle_escape_session_v1", JSON.stringify({ room_code: "T8MOCK", player_id: "00000000-0000-4000-8000-000000000008", display_name: "Gitte", role_slot: "GAL-A", session_token: "TEST" }));
      globalThis.__GAL_A1_TEST_HOOKS__ = {};
    });
    await page.route("**/rest/v1/rpc/**", async route => {
      const rpc = new URL(route.request().url()).pathname.split("/").pop();
      if (rpc.includes("get_")) await new Promise(resolve => setTimeout(resolve, delayMs));
      let value;
      if (rpc === "s8_get_player_state") value = { active: false };
      else if (rpc === "s2_get_player_state") value = { active: true, discussion: null };
      else if (rpc === "s3b_get_player_state") value = { active: true, run_id: "00000000-0000-4000-8000-000000000010", scene: { scene_id: "act9_great_hall", phase_key: phase, step_key: `step_${step}`, text_key: "act09.001" }, flow: {}, me: { act1_stage: "complete", first_meeting_locked_at: "2026-10-29T15:00:00Z", grab_complete: true, left_start_room: true }, queued_first_messages: [], act4_revealed: [] };
      else if (rpc === "s5_get_player_state") value = { active: false };
      else if (rpc === "s6_get_player_state") value = { active: true, run_id: "00000000-0000-4000-8000-000000000010", state: { run_id: "00000000-0000-4000-8000-000000000010", act_no: phase.startsWith("act9") ? 9 : phase.startsWith("act10") ? 10 : 11, phase_key: phase, act9_step: step, round_no: round, gold_key: false, feedback_text_keys: [] }, scene_asset_key: null, discussion: phase === "act10_discussion" ? { discussion_session_id: "00000000-0000-4000-8000-000000000011", phase_key: phase, status: "discussion", topic: "Gold key", messages: [], vote_round: 1, phase_deadline: null } : null, private_choices_revealed: [], audio_occurrence: null };
      else if (rpc === "s9_get_player_wait_state") value = { active: false };
      else if (rpc === "s3_get_player_state") value = { active: true, items: [], inspected_item_keys: [], group_items: [], observations: [], shared_photos: [], scene: { allow_share_photo: false } };
      else if (rpc === "asset_resolve") value = { ok: false };
      else if (rpc === "s6_submit_group_choice_v2") { phase = "act9_console"; step = 2; round = 2; value = { ok: true, resolved: true, choice_id: "red" }; }
      else if (rpc === "s6_submit_private_choice_v2") { phase = "act10_discussion"; value = { ok: true, discussion_session_id: "00000000-0000-4000-8000-000000000011" }; }
      else if (rpc === "s6_advance_v2") { phase = "act11_allocation"; value = { ok: true }; }
      else if (rpc === "s6_send_message_v2") { sends += 1; value = { ok: true, message_id: sends }; }
      else return route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ message: `Unexpected ${rpc}` }) });
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(value) });
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/index.html`, { waitUntil: "networkidle" });
    await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.stopPolling());
    const measure = async (label, rpc, action, selector) => {
      const start = await page.evaluate(selector => { const probe = globalThis.__TRIAL8_LATENCY__; probe.watchSelector = selector; probe.watchText = null; return performance.now(); }, selector);
      await action();
      await page.locator(selector).waitFor({ state: "visible", timeout: 10000 });
      const evidence = await page.evaluate(({ start, selector, rpc }) => {
        const probe = globalThis.__TRIAL8_LATENCY__;
        const mutation = probe.records.find(record => record.rpc === rpc && record.started >= start);
        const visibleAt = probe.visible.find(marker => marker.at >= mutation.finished && marker.targetVisible)?.at;
        return { records: probe.records, visibleAt };
      }, { start, selector, rpc });
      const at = evidence.visibleAt || await page.evaluate(() => performance.now());
      const timing = decomposeLatency(evidence.records, start, at, rpc);
      samples.push({ label, delayMs, timing });
    };
    await measure("ACT9 RED→DO_NOT_ENTER", "s6_submit_group_choice_v2", () => page.locator('[data-s6-choice="red"]').click(), '[data-s6-choice="do_not_enter"]');
    phase = "act10_private"; step = 4; round = 1;
    await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    await measure("ACT10 LEAVE→discussion", "s6_submit_private_choice_v2", () => page.locator('[data-s6-choice="leave"]').click(), "#s6MessageText");
    assert(phase === "act10_discussion", "Private choice did not reach discussion");
    assert(await page.locator('[data-s6-choice="A"]').count() === 0, "Station appeared before Teacher gate and result advance");
    phase = "act10_result";
    await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    await measure("ACT10 result Continue→ACT11 Station", "s6_advance_v2", () => page.locator('[data-s6-rpc="s6_advance_v2"]').click(), '[data-s6-choice="A"]');
    await page.close();
  }
  console.log(JSON.stringify({ measured: samples, teacherGate: "ACT10 discussion intentionally has no Station action; Teacher Open Vote and three votes precede result Continue" }, null, 2));
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
