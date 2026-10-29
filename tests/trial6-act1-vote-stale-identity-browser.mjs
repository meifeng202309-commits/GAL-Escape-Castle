import http from "node:http";
import path from "node:path";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = process.cwd();
const out = path.join(root, "docs/reports/remediation/ui/trial6-act1-vote");
const chrome = process.env.GAL_A1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const runId = "00000000-0000-4000-8000-000000000601";
const s5DiscussionId = "00000000-0000-4000-8000-000000000602";
const act1DiscussionId = "00000000-0000-4000-8000-000000000603";
const assert = (value, message) => { if (!value) throw new Error(message); };

function mime(file) {
  if (file.endsWith(".html")) return "text/html";
  if (file.endsWith(".css")) return "text/css";
  if (file.endsWith(".js") || file.endsWith(".mjs")) return "text/javascript";
  return "application/octet-stream";
}

async function server(candidate) {
  const instance = http.createServer(async (req, res) => {
    try {
      const relative = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "index.html";
      const file = path.resolve(root, relative);
      assert(file.startsWith(root + path.sep), "path escape");
      let body = await readFile(file);
      if (candidate && relative === "src/game/app.js") {
        const source = body.toString("utf8");
        const marker = "  const runtimeViewport={top:sprint3bPanel.scrollTop,identity:sprint3bPanel.dataset.runtimeIdentity||\"\"};";
        assert(source.includes(marker), "candidate transform marker missing");
        body = Buffer.from(source.replace(marker, `  currentSprint5State = frame.sprint5State?.active ? frame.sprint5State : null;\n${marker}`));
      }
      res.writeHead(200, { "Content-Type": mime(file), "Cache-Control": "no-store" });
      res.end(body);
    } catch (error) {
      if (!res.headersSent) res.writeHead(404);
      res.end(String(error));
    }
  });
  await new Promise(resolve => instance.listen(0, "127.0.0.1", resolve));
  return { instance, url: `http://127.0.0.1:${instance.address().port}` };
}

const json = (route, status, value) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(value) });
const s3b = () => ({
  active: true, run_id: runId,
  scene: { scene_id: "act1_meeting", phase_key: "meeting_discussion", step_key: "final_meeting", text_key: "act02.001" },
  flow: {}, me: { first_meeting_locked_at: "2026-10-29T02:26:00Z", grab_complete: false, left_start_room: false },
  queued_first_messages: [], act4_revealed: [],
});
const pocket = () => ({ active: true, items: [], inspected_item_keys: [], group_items: [], observations: [], shared_photos: [], scene: { allow_share_photo: false } });
const s2Discussion = submitted => ({
  active: true,
  discussion: { discussion_session_id: act1DiscussionId, topic: "Where next?", status: "voting", vote_round: 1, phase_deadline: null, require_final_vote: true, vote_options: [{ id: "library", label: "Library" }], show_initial_choices: false },
  initial_choices: [], messages: [], submitted_vote_count: submitted, my_vote: null, revealed_votes: [], vote_history: [],
});
const s5State = active => active ? { active: true, state: { run_id: runId, phase_key: "act6_vote", vote_round: 1, act_no: 6 }, discussion: { discussion_session_id: s5DiscussionId, vote_round: 1 }, presentation_text_key: "act06.001", private_choices_revealed: [], my_private_choice: null } : { active: false };

async function gate(browser, candidate) {
  const local = await server(candidate);
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  let mode = "s5", submitted = 2;
  const calls = [];
  await page.addInitScript(session => {
    localStorage.setItem("gal_castle_escape_session_v1", JSON.stringify(session));
    globalThis.__GAL_A1_TEST_HOOKS__ = {};
  }, { room_code: "TEST8", player_id: "00000000-0000-4000-8000-000000000604", display_name: "Anna", role_slot: "GAL-B", session_token: "TRIAL6-B" });
  await page.route("**/rest/v1/rpc/**", route => {
    const name = new URL(route.request().url()).pathname.split("/").pop();
    const body = route.request().postDataJSON?.() || {};
    if (name === "s5_submit_vote") {
      calls.push({ name, body, outcome: "Stale Sprint 5 discussion identity." });
      return json(route, 400, { message: "Stale Sprint 5 discussion identity." });
    }
    if (name === "s2_submit_vote") {
      assert(body.p_expected_discussion_session_id === act1DiscussionId, "S2 retry used stale discussion identity");
      submitted = 3;
      calls.push({ name, body, outcome: "accepted" });
      return json(route, 200, { ok: true, submitted_vote_count: submitted });
    }
    const value = name === "s8_get_player_state" ? { active: false }
      : name === "s2_get_player_state" ? (mode === "s5" ? { active: true, discussion: null } : s2Discussion(submitted))
      : name === "s3b_get_player_state" ? s3b()
      : name === "s5_get_player_state" ? s5State(mode === "s5")
      : name === "s5_get_discussion_state" ? { active: false }
      : name === "s6_get_player_state" ? { active: false }
      : name === "s3_get_player_state" ? pocket()
      : name === "asset_resolve" ? { ok: false }
      : null;
    return json(route, value === null ? 400 : 200, value === null ? { message: `Unexpected RPC ${name}` } : value);
  });
  try {
    await page.goto(`${local.url}/index.html`, { waitUntil: "networkidle" });
    await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.stopPolling());
    mode = "act1";
    assert((await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())).status === "committed", "ACT1 frame did not commit");
    const expectedRpc = candidate ? "s2_submit_vote" : "s5_submit_vote";
    await Promise.all([
      page.waitForResponse(response => response.url().endsWith(`/rpc/${expectedRpc}`)),
      page.locator('[data-vote-id="library"]').click(),
    ]);
    if (candidate) {
      assert(submitted === 3, "candidate retry did not advance Teacher projection to 3/3");
      assert(calls.at(-1)?.name === "s2_submit_vote", "candidate still routed ACT1 vote to Sprint5");
    } else {
      await page.waitForFunction(() => document.querySelector("#discussionStatus")?.textContent.includes("Stale Sprint 5 discussion identity."));
      assert(submitted === 2, "baseline stale route unexpectedly changed vote count");
      assert(calls.at(-1)?.name === "s5_submit_vote", "baseline did not reproduce stale Sprint5 routing");
    }
    return { candidate, submitted, calls };
  } finally {
    await context.close();
    await new Promise(resolve => local.instance.close(resolve));
  }
}

async function main() {
  await mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  try {
    const evidence = { generatedAt: new Date().toISOString(), baseline: await gate(browser, false), candidate: await gate(browser, true) };
    await writeFile(path.join(out, "TRIAL6_ACT1_VOTE_BROWSER_EVIDENCE.json"), JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify(evidence, null, 2));
    console.log("Trial 6 ACT1 stale identity baseline/candidate browser gate passed.");
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
