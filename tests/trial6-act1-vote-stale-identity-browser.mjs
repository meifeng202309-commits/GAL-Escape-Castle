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

async function server() {
  const instance = http.createServer(async (req, res) => {
    try {
      const relative = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "index.html";
      const file = path.resolve(root, relative);
      assert(file.startsWith(root + path.sep), "path escape");
      let body = await readFile(file);
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
const discussionPayload = (discussionId, submitted, myVote = null) => ({
  active: true,
  discussion: { discussion_session_id: discussionId, topic: "Where next?", status: "voting", vote_round: 1, phase_deadline: null, require_final_vote: true, vote_options: [{ id: "library", label: "Library" }], show_initial_choices: false },
  initial_choices: [], messages: [], submitted_vote_count: submitted, my_vote: myVote, revealed_votes: [], vote_history: [],
});
const s5State = active => active ? { active: true, state: { run_id: runId, phase_key: "act6_vote", vote_round: 1, act_no: 6 }, discussion: { discussion_session_id: s5DiscussionId, vote_round: 1 }, presentation_text_key: "act06.001", private_choices_revealed: [], my_private_choice: null } : { active: false };

async function gate(browser) {
  const local = await server();
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  let mode = "s5", submitted = 2, committedAnnaVote = false, failFirstS2Response = true;
  const calls = [];
  await page.addInitScript(session => {
    localStorage.setItem("gal_castle_escape_session_v1", JSON.stringify(session));
    globalThis.__GAL_A1_TEST_HOOKS__ = {};
  }, { room_code: "TEST8", player_id: "00000000-0000-4000-8000-000000000604", display_name: "Anna", role_slot: "GAL-B", session_token: "TRIAL6-B" });
  await page.route("**/rest/v1/rpc/**", route => {
    const name = new URL(route.request().url()).pathname.split("/").pop();
    const body = route.request().postDataJSON?.() || {};
    if (name === "s5_submit_vote" || name === "s5_send_message") {
      calls.push({ name, body, outcome: "accepted" });
      return json(route, 200, { ok: true });
    }
    if (name === "s2_submit_vote") {
      assert(body.p_expected_discussion_session_id === act1DiscussionId, "S2 retry used stale discussion identity");
      if (!committedAnnaVote) { committedAnnaVote = true; submitted = 3; }
      if (failFirstS2Response) {
        failFirstS2Response = false;
        calls.push({ name, body, outcome: "synthetic lost response after commit" });
        return json(route, 500, { message: "Synthetic lost response after commit" });
      }
      calls.push({ name, body, outcome: "accepted idempotent existing vote" });
      return json(route, 200, { ok: true, submitted_vote_count: submitted });
    }
    const value = name === "s8_get_player_state" ? { active: false }
      : name === "s2_get_player_state" ? (mode === "s5" ? { active: true, discussion: null } : discussionPayload(act1DiscussionId, submitted, committedAnnaVote ? { choice_id: "library" } : null))
      : name === "s3b_get_player_state" ? s3b()
      : name === "s5_get_player_state" ? s5State(mode === "s5")
      : name === "s5_get_discussion_state" ? discussionPayload(s5DiscussionId, 0)
      : name === "s6_get_player_state" ? { active: false }
      : name === "s3_get_player_state" ? pocket()
      : name === "asset_resolve" ? { ok: false }
      : null;
    return json(route, value === null ? 400 : 200, value === null ? { message: `Unexpected RPC ${name}` } : value);
  });
  try {
    await page.goto(`${local.url}/index.html`, { waitUntil: "networkidle" });
    await page.locator("#messageText").fill("Sprint5 ownership check");
    await Promise.all([
      page.waitForResponse(response => response.url().endsWith("/rpc/s5_send_message")),
      page.locator("#sendMessageButton").click(),
    ]);
    await Promise.all([
      page.waitForResponse(response => response.url().endsWith("/rpc/s5_submit_vote")),
      page.locator('[data-vote-id="library"]').click(),
    ]);
    await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.stopPolling());
    mode = "act1";
    assert((await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())).status === "committed", "ACT1 frame did not commit");
    await Promise.all([
      page.waitForResponse(response => response.url().endsWith("/rpc/s2_submit_vote")),
      page.locator('[data-vote-id="library"]').click(),
    ]);
    await page.waitForFunction(() => document.querySelector("#discussionStatus")?.textContent.includes("Synthetic lost response"));
    await Promise.all([
      page.waitForResponse(response => response.url().endsWith("/rpc/s2_submit_vote")),
      page.locator('[data-vote-id="library"]').click(),
    ]);
    assert(submitted === 3, "ACT1 retry did not advance Teacher projection to 3/3");
    assert(calls.filter(call => call.name === "s2_submit_vote").length === 2, "ACT1 lost-response retry count mismatch");
    assert(calls.filter(call => call.name === "s5_submit_vote").length === 1, "ACT1 was misrouted to Sprint5 or S5 gate was not exercised");
    await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.stopPolling());
    return { submitted, uniqueAnnaDecisions: committedAnnaVote ? 1 : 0, calls };
  } finally {
    await context.close();
    await new Promise(resolve => local.instance.close(resolve));
  }
}

async function main() {
  await mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  try {
    const evidence = { generatedAt: new Date().toISOString(), permanentRegression: await gate(browser) };
    await writeFile(path.join(out, "TRIAL6_ACT1_VOTE_BROWSER_EVIDENCE.json"), JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify(evidence, null, 2));
    console.log("Trial 6 ACT1 stale identity permanent browser regression passed.");
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
