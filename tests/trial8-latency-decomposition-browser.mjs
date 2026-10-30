import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { installLatencyObserver, interactionFamilies, decomposeLatency } from "./helpers/trial8-latency-observer.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = process.cwd();
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const server = http.createServer(async (request, response) => {
  try {
    const relative = decodeURIComponent(new URL(request.url, "http://localhost").pathname).replace(/^\/+/, "") || "index.html";
    const file = path.resolve(root, relative);
    assert(file.startsWith(root + path.sep), "path escape");
    response.writeHead(200, { "Content-Type": file.endsWith(".js") || file.endsWith(".mjs") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html" });
    response.end(await readFile(file));
  } catch { response.writeHead(404); response.end("Not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true, executablePath: process.env.GAL_A1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const cases = [];
try {
  for (const delayMs of [0, 250, 1000]) {
    const page = await browser.newPage();
    const messages = [];
    let voted = false;
    let voting = false;
    await page.addInitScript(installLatencyObserver);
    await page.addInitScript(() => {
      localStorage.setItem("gal_castle_escape_session_v1", JSON.stringify({ room_code: "T8MOCK", player_id: "00000000-0000-4000-8000-000000000008", display_name: "Linda", role_slot: "GAL-C", session_token: "TEST" }));
      globalThis.__GAL_A1_TEST_HOOKS__ = {};
    });
    await page.route("**/rest/v1/rpc/**", async route => {
      const rpc = new URL(route.request().url()).pathname.split("/").pop();
      if (rpc.includes("get_")) await new Promise(resolve => setTimeout(resolve, delayMs));
      let value;
      if (rpc === "s8_get_player_state") value = { active: false };
      else if (rpc === "s2_get_player_state") value = { active: true, discussion: { discussion_session_id: "00000000-0000-4000-8000-000000000009", topic: "Test", status: voting ? "voting" : "discussion", vote_round: 1, phase_deadline: null, require_final_vote: true, vote_options: [{ id: "library", label: "Library" }] }, initial_choices: [], messages, submitted_vote_count: voted ? 1 : 0, my_vote: voted ? { choice_label: "Library" } : null, revealed_votes: [], vote_history: [] };
      else if (rpc === "s3b_get_player_state") value = { active: true, run_id: "00000000-0000-4000-8000-000000000010", scene: { scene_id: "act2_first_contact", phase_key: "meeting_discussion", step_key: "final_meeting", text_key: "act02.001" }, flow: {}, me: { act1_stage: "complete", first_meeting_locked_at: "2026-10-29T15:00:00Z", grab_complete: true, left_start_room: true }, queued_first_messages: [], act4_revealed: [] };
      else if (rpc === "s5_get_player_state" || rpc === "s6_get_player_state") value = { active: false };
      else if (rpc === "s3_get_player_state") value = { active: true, items: [], inspected_item_keys: [], group_items: [], observations: [], shared_photos: [], scene: { allow_share_photo: false } };
      else if (rpc === "asset_resolve") value = { ok: false };
      else if (rpc === "s2_send_message") { messages.push({ display_name: "Linda", message_text: route.request().postDataJSON().p_message_text, created_at: new Date().toISOString() }); value = { ok: true, message_id: messages.length }; }
      else if (rpc === "s2_submit_vote") { voted = true; value = { ok: true }; }
      else return route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ message: `Unexpected ${rpc}` }) });
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(value) });
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/index.html`, { waitUntil: "networkidle" });
    await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.stopPolling());
    await page.fill("#messageText", `delay-${delayMs}`);
    const started = await page.evaluate(text => { const probe = globalThis.__TRIAL8_LATENCY__; probe.watchSelector = "#transcript"; probe.watchText = text; return performance.now(); }, `delay-${delayMs}`);
    await page.click("#sendMessageButton");
    await page.waitForFunction(text => document.querySelector("#transcript")?.textContent.includes(text), `delay-${delayMs}`);
    const evidence = await page.evaluate(({ started, delayMs }) => {
      const probe = globalThis.__TRIAL8_LATENCY__;
      const mutation = probe.records.find(record => record.rpc === "s2_send_message" && record.started >= started);
      const visibleAt = probe.visible.find(marker => marker.at >= mutation.finished && marker.targetVisible)?.at;
      return { records: probe.records, visibleAt };
    }, { started, delayMs });
    const mutation = evidence.records.find(record => record.rpc === "s2_send_message" && record.started >= started);
    assert(mutation && evidence.visibleAt, "Transcript did not produce a post-mutation visible marker");
    const timing = decomposeLatency(evidence.records, started, evidence.visibleAt, "s2_send_message");
    assert(messages.length === 1 && timing.readRpcNames.includes("s2_get_player_state"), "Missing exact-once mutation or follow-up projection");
    cases.push({ delayMs, family: "ACT2 Chat", timing });
    voting = true;
    await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    await page.locator('[data-vote-id="library"]').waitFor({ state: "visible" });
    const voteStarted = await page.evaluate(() => { const probe = globalThis.__TRIAL8_LATENCY__; probe.watchSelector = "#voteArea .good"; probe.watchText = null; return performance.now(); });
    await page.locator('[data-vote-id="library"]').click();
    await page.locator("#voteArea .good").waitFor({ state: "visible" });
    const voteEvidence = await page.evaluate(start => { const probe = globalThis.__TRIAL8_LATENCY__; const mutation = probe.records.find(record => record.rpc === "s2_submit_vote" && record.started >= start); return { records: probe.records, visibleAt: probe.visible.find(marker => marker.at >= mutation.finished && marker.targetVisible)?.at }; }, voteStarted);
    assert(voted && voteEvidence.visibleAt, "Vote did not render the locked acknowledgement");
    cases.push({ delayMs, family: "ACT2 Vote", timing: decomposeLatency(voteEvidence.records, voteStarted, voteEvidence.visibleAt, "s2_submit_vote") });
    await page.close();
  }
  assert(Object.keys(interactionFamilies).length === 14, "ACT1–ACT13 inventory is incomplete");
  console.log(JSON.stringify({ coverage: "ACT2 chat and vote measured; ACT1–ACT13 RPC families catalogued", cases }, null, 2));
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
