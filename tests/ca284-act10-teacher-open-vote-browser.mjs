import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = process.cwd();
const executablePath = process.env.GAL_A1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const assert = (value, message) => { if (!value) throw new Error(message); };

function mime(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  return "application/octet-stream";
}

async function startServer() {
  const value = http.createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url, "http://127.0.0.1").pathname;
      const relative = decodeURIComponent(pathname === "/" ? "/teacher.html" : pathname).replace(/^\/+/, "");
      const file = path.resolve(root, relative);
      assert(file.startsWith(`${root}${path.sep}`), "path escape");
      response.writeHead(200, { "Content-Type": mime(file), "Cache-Control": "no-store" });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
  await new Promise((resolve) => value.listen(0, "127.0.0.1", resolve));
  return { value, url: `http://127.0.0.1:${value.address().port}/teacher.html` };
}

const runId = "00000000-0000-0000-0000-000000000284";
const discussionId = "00000000-0000-0000-0000-000000000285";
let phase = "act10_private";
let openBody = null;

function s6State() {
  const discussion = ["act9_discussion","act10_discussion"].includes(phase) ? {
    discussion_session_id: discussionId, phase_key: phase, topic: "act10.004", status: "discussion",
    vote_round: 1, phase_deadline: null, outcome: null,
  } : null;
  return {
    active: true, sprint6_active: true, canonical_flow_active: true,
    run: { run_id: runId, run_mode: "normal", behavior_dataset_eligible: true },
    s6: { phase_key: phase, act9_step: 4, round_no: 1 }, discussion,
    messages: [], current_votes: [], teacher_override: { allowed_actions: [], history: [] },
  };
}

function operations() {
  return {
    active: true, run: { run_id: runId, run_mode: "normal", audit_private_debug_view: false },
    current: { act_no: phase.startsWith("act9") ? 9 : 10, scene_id: phase.startsWith("act9") ? "act9_great_hall" : "act10_golden_key", phase_key: phase, step_key: "reveal" },
    players: [], operations_v1: [], discussion: { messages: [] }, pockets: [], group_items: [],
    audio: { recent: [] }, phase_behavior_validity: [], teacher_interventions: [], override_history: [],
    export: { export_ready: false },
  };
}

async function main() {
  const local = await startServer();
  const browser = await chromium.launch({ headless: true, executablePath });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.route("**/rest/v1/rpc/**", async (route) => {
    const name = new URL(route.request().url()).pathname.split("/").pop();
    const body = route.request().postDataJSON?.() || {};
    let value;
    if (name === "s1_get_teacher_state") value = { room_code: "CA284", players: [] };
    else if (name === "s6_get_teacher_discussion_state") value = s6State();
    else if (name === "s7_get_teacher_console") value = operations();
    else if (name === "s8_get_finalization_state") value = { export_ready: false };
    else if (name === "s6_teacher_open_vote") { openBody = body; phase = phase === "act9_discussion" ? "act9_console" : "act10_final_vote"; value = { ok: true, phase_key: phase }; }
    else return route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ message: `Unexpected RPC ${name}` }) });
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(value) });
  });
  try {
    await page.goto(local.url, { waitUntil: "networkidle" });
    await page.fill("#roomCode", "CA284");
    await page.fill("#teacherToken", "TOKEN");
    await page.click("#watchButton");
    await page.waitForFunction(() => document.querySelector("#runBadge")?.textContent === "NORMAL", null, { timeout: 5000 });
    assert(await page.locator("#openVoteButton").isDisabled(), "ACT10 private phase exposed Teacher Open Vote");

    phase = "act9_discussion";
    await page.click("#watchButton");
    await page.waitForFunction(() => !document.querySelector("#openVoteButton")?.disabled, null, { timeout: 5000 });
    assert(await page.locator("#openVoteButton").isEnabled(), "ACT9 discussion did not enable Teacher Open Vote");
    await page.click("#openVoteButton");
    for(let attempt=0;attempt<100&&openBody?.p_expected_phase!=="act9_discussion";attempt+=1)await new Promise((resolve)=>setTimeout(resolve,25));
    assert(openBody?.p_expected_phase === "act9_discussion" && openBody?.p_expected_step === 4 && openBody?.p_expected_round === 1, "ACT9 Teacher Open Vote omitted phase identity");
    assert(openBody?.p_expected_run_id === runId && openBody?.p_expected_discussion_session_id === discussionId, "ACT9 Teacher Open Vote omitted run/discussion identity");

    openBody = null;
    phase = "act10_discussion";
    await page.click("#watchButton");
    await page.waitForFunction(() => document.querySelector("#discussionState")?.textContent.includes("act10.004"), null, { timeout: 5000 });
    assert(await page.locator("#openVoteButton").isEnabled(), "ACT10 discussion did not enable Teacher Open Vote");

    await page.click("#openVoteButton");
    for(let attempt=0;attempt<100&&!openBody;attempt+=1)await new Promise((resolve)=>setTimeout(resolve,25));
    assert(openBody,"ACT10 Teacher Open Vote RPC was not called");
    assert(openBody?.p_expected_run_id === runId, "ACT10 Teacher Open Vote omitted run identity");
    assert(openBody?.p_expected_phase === "act10_discussion" && openBody?.p_expected_step === 4 && openBody?.p_expected_round === 1, "ACT10 Teacher Open Vote omitted phase identity");
    assert(openBody?.p_expected_discussion_session_id === discussionId, "ACT10 Teacher Open Vote omitted discussion identity");
    console.log("ACT9/10 Teacher Open Vote browser routing passed.");
  } finally {
    await context.close();
    await browser.close();
    await new Promise((resolve) => local.value.close(resolve));
  }
}

main().catch((error) => { console.error(`FAIL ${error.stack || error.message}`); process.exitCode = 1; });
