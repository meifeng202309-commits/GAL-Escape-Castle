import http from "node:http";
import path from "node:path";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = process.cwd();
const out = path.join(root, "docs/reports/remediation/ui/trial7-mixed-lifecycle");
const chrome = process.env.GAL_A1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const runId = "00000000-0000-4000-8000-0000000007b1";
const discussionId = "00000000-0000-4000-8000-0000000007b2";
const roles = [
  { slot: "GAL-A", name: "Gitte", token: "TRIAL7-A" },
  { slot: "GAL-B", name: "Anna", token: "TRIAL7-B" },
  { slot: "GAL-C", name: "Linda", token: "TRIAL7-C" },
];
const assert = (value, message) => { if (!value) throw new Error(message); };
const mime = file => file.endsWith(".html") ? "text/html" : file.endsWith(".css") ? "text/css" : file.endsWith(".js") ? "text/javascript" : "application/octet-stream";

async function server(candidate) {
  const instance = http.createServer(async (req, res) => {
    try {
      const relative = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "index.html";
      const file = path.resolve(root, relative);
      assert(file.startsWith(root + path.sep), "path escape");
      let body = await readFile(file);
      if (candidate && relative === "src/game/app.js") {
        const source = body.toString("utf8");
        const guard = "if(playerCompositionActive){deferredCompositionFrame=frame;return}";
        const active = "  const runtimeViewport={top:sprint3bPanel.scrollTop,identity:sprint3bPanel.dataset.runtimeIdentity||\"\"};";
        assert(source.includes(guard) && source.includes(active), "candidate transform marker missing");
        body = Buffer.from(source
          .replace(guard, 'if(playerCompositionActive&&document.activeElement?.id!=="messageText"){deferredCompositionFrame=frame;return}')
          .replace(active, `  sceneTitle.textContent="";\n${active}`));
      }
      res.writeHead(200, { "Content-Type": mime(file), "Cache-Control": "no-store" });
      res.end(body);
    } catch (error) { res.writeHead(404); res.end(String(error)); }
  });
  await new Promise(resolve => instance.listen(0, "127.0.0.1", resolve));
  return { instance, url: `http://127.0.0.1:${instance.address().port}` };
}

const json = (route, status, value) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(value) });
const s3b = role => ({ active: true, run_id: runId, scene: { scene_id: "act2_first_contact", phase_key: "meeting_discussion", step_key: "final_meeting", text_key: "act02.001" }, flow: {}, me: { act1_stage: "complete", first_meeting_locked_at: "2026-10-29T13:20:00Z", grab_complete: true, left_start_room: true, player_location: "corridor" }, queued_first_messages: [], act4_revealed: [], role_slot: role.slot });
const discussion = (phase, votes, role) => ({ active: phase !== "pre-run", discussion: phase === "pre-run" ? null : { discussion_session_id: discussionId, topic: "act02.001", status: phase, vote_round: 1, phase_deadline: null, require_final_vote: true, vote_options: [{ id: "library", label: "act02.004" }], show_initial_choices: false }, initial_choices: [], messages: [], submitted_vote_count: votes.size, my_vote: votes.has(role.slot) ? { choice_id: "library" } : null, revealed_votes: [], vote_history: [] });

async function gate(browser, candidate) {
  const local = await server(candidate);
  let phase = "pre-run";
  const votes = new Set();
  const clients = [];
  try {
    for (const role of roles) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
      const page = await context.newPage();
      await page.addInitScript(({ role, runId }) => { localStorage.setItem("gal_castle_escape_session_v1", JSON.stringify({ room_code: "TESTB", player_id: `${runId}-${role.slot}`, display_name: role.name, role_slot: role.slot, session_token: role.token })); globalThis.__GAL_A1_TEST_HOOKS__ = {}; }, { role, runId });
      await page.route("**/rest/v1/rpc/**", route => {
        const name = new URL(route.request().url()).pathname.split("/").pop();
        const value = name === "s8_get_player_state" ? { active: false }
          : name === "s2_get_player_state" ? discussion(phase, votes, role)
          : name === "s3b_get_player_state" ? s3b(role)
          : ["s5_get_player_state", "s6_get_player_state"].includes(name) ? { active: false }
          : name === "s3_get_player_state" ? { active: true, items: [], inspected_item_keys: [], group_items: [], observations: [], shared_photos: [], scene: { allow_share_photo: false } }
          : name === "asset_resolve" ? { ok: false }
          : null;
        if (name === "s2_submit_vote") { votes.add(role.slot); return json(route, 200, { ok: true, submitted_vote_count: votes.size }); }
        return json(route, value === null ? 400 : 200, value === null ? { message: `Unexpected RPC ${name}` } : value);
      });
      await page.goto(`${local.url}/index.html`, { waitUntil: "networkidle" });
      await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.stopPolling());
      clients.push({ role, context, page });
    }

    phase = "discussion";
    await Promise.all(clients.map(({ page }) => page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())));
    const linda = clients[2].page;
    await linda.locator("#messageText").focus();
    await linda.locator("#messageText").dispatchEvent("compositionstart", { data: "lin" });
    phase = "voting";
    await Promise.all(clients.map(({ page }) => page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())));

    const state = await linda.evaluate(() => ({ title: document.querySelector("#sceneTitle")?.textContent, composerVisible: !document.querySelector("#messageComposer")?.classList.contains("hidden"), voteButtons: document.querySelectorAll("#voteArea [data-vote-id]").length }));
    if (!candidate) {
      assert(state.title === "Waiting for formal run", "baseline did not retain stale pre-run title");
      assert(state.composerVisible && state.voteButtons === 0, "baseline did not freeze Linda on discussion frame during composition");
      return { candidate, state, votes: votes.size };
    }

    assert(state.title === "", "candidate retained pre-run title on active frame");
    assert(!state.composerVisible && state.voteButtons === 1, "candidate did not commit Teacher voting frame during S2 message composition");
    for (const { page } of clients) {
      await Promise.all([page.waitForResponse(response => response.url().endsWith("/rpc/s2_submit_vote")), page.locator('[data-vote-id="library"]').click()]);
      await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    }
    assert(votes.size === 3, "candidate did not accept exactly three role votes");
    return { candidate, state, votes: votes.size, roles: [...votes] };
  } finally {
    await Promise.all(clients.map(({ context }) => context.close()));
    await new Promise(resolve => local.instance.close(resolve));
  }
}

async function main() {
  await mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  try {
    const evidence = { generatedAt: new Date().toISOString(), baseline: await gate(browser, false), candidate: await gate(browser, true) };
    await writeFile(path.join(out, "TRIAL7_MIXED_LIFECYCLE_BROWSER_EVIDENCE.json"), JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify(evidence, null, 2));
    console.log("Trial 7 mixed lifecycle/discussion deterministic baseline/candidate gate passed.");
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
