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

async function server() {
  const instance = http.createServer(async (req, res) => {
    try {
      const relative = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "index.html";
      const file = path.resolve(root, relative);
      assert(file.startsWith(root + path.sep), "path escape");
      const body = await readFile(file);
      res.writeHead(200, { "Content-Type": mime(file), "Cache-Control": "no-store" });
      res.end(body);
    } catch (error) { res.writeHead(404); res.end(String(error)); }
  });
  await new Promise(resolve => instance.listen(0, "127.0.0.1", resolve));
  return { instance, url: `http://127.0.0.1:${instance.address().port}` };
}

const json = (route, status, value) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(value) });
const s3b = role => ({ active: true, run_id: runId, scene: { scene_id: "act2_first_contact", phase_key: "meeting_discussion", step_key: "final_meeting", text_key: "act02.001" }, flow: {}, me: { act1_stage: "complete", first_meeting_locked_at: "2026-10-29T13:20:00Z", grab_complete: true, left_start_room: true, player_location: "corridor" }, queued_first_messages: [], act4_revealed: [], role_slot: role.slot });
const discussion = (phase, votes, role, messages) => ({ active: phase !== "pre-run", discussion: phase === "pre-run" ? null : { discussion_session_id: discussionId, topic: "act02.001", status: phase, vote_round: 1, phase_deadline: null, require_final_vote: true, vote_options: [{ id: "library", label: "act02.004" }], show_initial_choices: false }, initial_choices: [], messages, submitted_vote_count: votes.size, my_vote: votes.has(role.slot) ? { choice_id: "library" } : null, revealed_votes: [], vote_history: [] });

async function gate(browser) {
  const local = await server();
  let phase = "pre-run";
  const votes = new Set(), messages = [], sends = [];
  const clients = [];
  try {
    for (const role of roles) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
      const page = await context.newPage();
      await page.addInitScript(({ role, runId }) => { localStorage.setItem("gal_castle_escape_session_v1", JSON.stringify({ room_code: "TESTB", player_id: `${runId}-${role.slot}`, display_name: role.name, role_slot: role.slot, session_token: role.token })); globalThis.__GAL_A1_TEST_HOOKS__ = {}; }, { role, runId });
      await page.route("**/rest/v1/rpc/**", route => {
        const name = new URL(route.request().url()).pathname.split("/").pop();
        const value = name === "s8_get_player_state" ? { active: false }
          : name === "s2_get_player_state" ? discussion(phase, votes, role, messages)
          : name === "s3b_get_player_state" ? s3b(role)
          : ["s5_get_player_state", "s6_get_player_state"].includes(name) ? { active: false }
          : name === "s3_get_player_state" ? { active: true, items: [], inspected_item_keys: [], group_items: [], observations: [], shared_photos: [], scene: { allow_share_photo: false } }
          : name === "asset_resolve" ? { ok: false }
          : null;
        if (name === "s2_submit_vote") { votes.add(role.slot); return json(route, 200, { ok: true, submitted_vote_count: votes.size }); }
        if (name === "s2_send_message") { const body=route.request().postDataJSON();sends.push({role:role.slot,...body});messages.push({display_name:role.name,message_text:body.p_message_text,created_at:new Date().toISOString()});return json(route,200,{ok:true,message_id:messages.length}); }
        return json(route, value === null ? 400 : 200, value === null ? { message: `Unexpected RPC ${name}` } : value);
      });
      await page.goto(`${local.url}/index.html`, { waitUntil: "networkidle" });
      await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.stopPolling());
      clients.push({ role, context, page });
    }

    phase = "discussion";
    await Promise.all(clients.map(({ page }) => page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())));
    const linda = clients[2].page;
    const input=linda.locator("#messageText");
    await input.focus();
    await input.evaluate(node=>{node.dataset.identityProbe="stable";node.value="你";node.dispatchEvent(new CompositionEvent("compositionstart",{data:"ni",bubbles:true}));node.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",keyCode:229,isComposing:true,bubbles:true,cancelable:true}))});
    assert(sends.length===0,"IME candidate-confirmation Enter triggered Send");
    for(let i=0;i<3;i++)await linda.evaluate(()=>globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    assert(await input.inputValue()==="你","IME draft was lost across polling");
    assert(await input.getAttribute("data-identity-probe")==="stable","stable message input DOM was replaced across polling");
    await input.evaluate(node=>node.dispatchEvent(new CompositionEvent("compositionend",{data:"你",bubbles:true})));
    await input.fill("你好");
    await Promise.all([linda.waitForResponse(response=>response.url().endsWith("/rpc/s2_send_message")),linda.locator("#sendMessageButton").click()]);
    await linda.evaluate(()=>globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    assert(sends.length===1,"deliberate Send was not committed exactly once");
    assert(await linda.locator("#transcript .message").count()===1,"sent message was not acknowledged exactly once");
    assert(await input.inputValue()==="","acknowledged draft was not cleared");
    await input.focus();
    await input.evaluate(node=>{node.value="lin";node.dispatchEvent(new CompositionEvent("compositionstart",{data:"lin",bubbles:true}))});
    const generationBefore=await linda.evaluate(()=>globalThis.__GAL_A1_TEST_HOOKS__.coordinatorState().generation);
    phase = "voting";
    await Promise.all(clients.map(({ page }) => page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())));

    const state = await linda.evaluate(() => ({ title: document.querySelector("#sceneTitle")?.textContent, composerVisible: !document.querySelector("#messageComposer")?.classList.contains("hidden"), voteButtons: document.querySelectorAll("#voteArea [data-vote-id]").length, generation:globalThis.__GAL_A1_TEST_HOOKS__.coordinatorState().generation }));
    assert(state.title === "", "active frame retained pre-run title");
    assert(!state.composerVisible && state.voteButtons === 1, "Teacher voting frame did not commit during S2 message composition");
    assert(state.generation>generationBefore,"refresh generation did not advance");
    for (const { page } of clients) {
      await Promise.all([page.waitForResponse(response => response.url().endsWith("/rpc/s2_submit_vote")), page.locator('[data-vote-id="library"]').click()]);
      await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    }
    assert(votes.size === 3, "real-source regression did not accept exactly three role votes");
    await linda.locator("#leaveButton").click();
    assert(await linda.locator("#messageText").inputValue()==="","session switch leaked Linda draft");
    assert(await linda.locator("#joinPanel").isVisible(),"session switch did not return to join state");
    return { state, sends:sends.length, transcriptMessages:messages.length, votes: votes.size, roles: [...votes], sessionDraftAfterLeave:await linda.locator("#messageText").inputValue() };
  } finally {
    await Promise.all(clients.map(({ context }) => context.close()));
    await new Promise(resolve => local.instance.close(resolve));
  }
}

async function main() {
  await mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  try {
    const evidence = { generatedAt: new Date().toISOString(), permanentRegression: await gate(browser) };
    await writeFile(path.join(out, "TRIAL7_MIXED_LIFECYCLE_BROWSER_EVIDENCE.json"), JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify(evidence, null, 2));
    console.log("Trial 7 mixed lifecycle/discussion permanent real-source regression passed.");
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
