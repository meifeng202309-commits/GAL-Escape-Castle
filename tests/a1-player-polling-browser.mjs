import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = process.cwd();
const browserExecutable = process.env.GAL_A1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function deferred() {
  let resolve;
  const promise = new Promise((settle) => { resolve = settle; });
  return { promise, resolve };
}

function mime(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".js") || file.endsWith(".mjs")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  if (file.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

async function startServer() {
  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://127.0.0.1");
      const relative = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname).replace(/^\/+/, "");
      const file = path.resolve(root, relative);
      invariant(file === root || file.startsWith(`${root}${path.sep}`), "Path escaped repository root.");
      const body = await readFile(file);
      response.writeHead(200, { "Content-Type": mime(file), "Cache-Control": "no-store" });
      response.end(body);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Not found");
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}/` };
}

const session = {
  room_code: "ROOM1",
  player_id: "00000000-0000-0000-0000-000000000001",
  display_name: "Old Player",
  role_slot: "GAL-A",
  session_token: "TOKEN-OLD",
};

const scenario = {
  mode: "preRun",
  holdRpc: null,
  holdToken: null,
  holdUsed: false,
  gate: null,
  started: null,
  calls: [],
};

function setScenario(mode, options = {}) {
  scenario.mode = mode;
  scenario.holdRpc = options.holdRpc || null;
  scenario.holdToken = options.holdToken || null;
  scenario.holdUsed = false;
  scenario.gate = options.holdRpc ? deferred() : null;
  scenario.started = options.holdRpc ? deferred() : null;
  scenario.calls = [];
}

function projection(name, body, mode) {
  if (name === "s1_join_player") return {
    player_id: "00000000-0000-0000-0000-000000000002",
    display_name: "New Player",
    role_slot: "GAL-B",
    session_token: "TOKEN-NEW",
  };
  if (name === "asset_resolve") return { ok: false, reason: "NO_ACTIVE_ASSET" };
  if (mode === "completed" && name === "s8_get_player_state") {
    return { active: true, game_completed: true, run_id: "00000000-0000-0000-0000-000000000099" };
  }
  if (name === "s8_get_player_state") return { active: false };
  if (mode === "preRun" || mode === "heldPreRun" || mode === "rejoin") {
    if (name === "s2_get_player_state") return { active: false };
  }
  if (name === "s2_get_player_state") return { active: true };
  if (name === "s3b_get_player_state") return { active: false, scene: null };
  if (name === "s5_get_player_state") return {
    active: true,
    state: { phase_key: "act7_vote" },
    canonical_discussion: { discussion_session_id: "00000000-0000-0000-0000-000000000010" },
  };
  if (name === "s6_get_player_state") return { active: false };
  if (name === "s3_get_player_state") return { active: true, items: [] };
  if (name === "s5_get_discussion_state") return {
    active: true,
    discussion: {
      discussion_session_id: "00000000-0000-0000-0000-000000000010",
      topic: "act07.001",
      status: "discussion",
      vote_round: 1,
      phase_deadline: null,
      require_final_vote: true,
      vote_options: [],
    },
    initial_choices: [], messages: [], submitted_vote_count: 0, my_vote: null, revealed_votes: [], vote_history: [],
  };
  if (name === "s9_get_player_wait_state") return { waiting: false };
  throw new Error(`Unhandled RPC ${name} in mode ${mode}: ${JSON.stringify(body)}`);
}

async function main() {
  const { server, baseUrl } = await startServer();
  const browser = await chromium.launch({ headless: true, executablePath: browserExecutable });
  const context = await browser.newContext();
  await context.addInitScript((savedSession) => {
    localStorage.setItem("gal_castle_escape_session_v1", JSON.stringify(savedSession));
    globalThis.__GAL_A1_TEST_HOOKS__ = {};
  }, session);
  const page = await context.newPage();
  const browserErrors = [];
  let expectedOptionalFailures = 0;
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") browserErrors.push(message.text()); });

  await page.route("**/rest/v1/rpc/**", async (route) => {
    const request = route.request();
    const name = new URL(request.url()).pathname.split("/").pop();
    const body = request.postDataJSON?.() || {};
    const mode = scenario.mode;
    scenario.calls.push({ name, token: body.p_session_token || null, at: Date.now(), mode });

    if (mode === "failOptional" && name === "s6_get_player_state") {
      expectedOptionalFailures += 1;
      await route.abort("failed");
      return;
    }
    if (!scenario.holdUsed && scenario.holdRpc === name && (!scenario.holdToken || scenario.holdToken === body.p_session_token)) {
      scenario.holdUsed = true;
      scenario.started.resolve();
      await scenario.gate.promise;
    }
    try {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(projection(name, body, mode)),
      });
    } catch (error) {
      if (!String(error.message).includes("Route is already handled")) throw error;
    }
  });

  try {
    setScenario("preRun");
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelector("#sceneTitle")?.textContent === "Waiting for formal run");
    await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.stopPolling());

    // Held passive poll + mutation-requested immediate refresh: one in flight,
    // one coalesced follow-up, and the queued caller waits for the newer attempt.
    setScenario("heldPreRun", { holdRpc: "s8_get_player_state", holdToken: "TOKEN-OLD" });
    await page.evaluate(() => { globalThis.__a1OldPoll = globalThis.__GAL_A1_TEST_HOOKS__.refreshState(); });
    await scenario.started.promise;
    await new Promise((resolve) => setTimeout(resolve, 1400));
    invariant(scenario.calls.filter((call) => call.name === "s8_get_player_state").length === 1, "Held poll overlapped another passive refresh.");
    await page.evaluate(() => { globalThis.__a1MutationRefresh = globalThis.__GAL_A1_TEST_HOOKS__.refreshState(); });
    const releasedAt = Date.now();
    scenario.gate.resolve();
    const [oldResult, mutationResult] = await Promise.all([
      page.evaluate(() => globalThis.__a1OldPoll),
      page.evaluate(() => globalThis.__a1MutationRefresh),
    ]);
    const s8Calls = scenario.calls.filter((call) => call.name === "s8_get_player_state");
    invariant(oldResult.status === "discarded", `Older held frame was not discarded: ${JSON.stringify(oldResult)}`);
    invariant(mutationResult.status === "committed", `Queued post-mutation refresh did not commit: ${JSON.stringify(mutationResult)}`);
    invariant(s8Calls.length === 2, `Expected exactly two serialized S8 reads, received ${s8Calls.length}.`);
    invariant(s8Calls[1].at >= releasedAt, "Queued refresh started before the older poll was released.");

    // Delayed S5 Discussion is part of the candidate frame and cannot render early.
    setScenario("activeStarting", { holdRpc: "s5_get_discussion_state" });
    const beforeTitle = await page.locator("#sceneTitle").innerText();
    await page.evaluate(() => { globalThis.__a1DiscussionRefresh = globalThis.__GAL_A1_TEST_HOOKS__.refreshState(); });
    await scenario.started.promise;
    invariant((await page.locator("#sceneTitle").innerText()) === beforeTitle, "UI changed before delayed S5 Discussion completed.");
    invariant(await page.locator("#discussionPanel").evaluate((node) => node.classList.contains("hidden")), "Discussion rendered before the full frame completed.");
    scenario.gate.resolve();
    const discussionResult = await page.evaluate(() => globalThis.__a1DiscussionRefresh);
    invariant(discussionResult.status === "committed", "Complete S5 candidate frame did not commit.");
    invariant((await page.locator("#sceneTitle").innerText()) === "Formal game starting", "Expected starting frame was not committed.");

    // A failed optional-domain transport read preserves the last confirmed frame.
    setScenario("failOptional");
    const confirmedTitle = await page.locator("#sceneTitle").innerText();
    const failureResult = await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    invariant(failureResult.status === "fetch_error", `Optional RPC failure was not classified: ${JSON.stringify(failureResult)}`);
    invariant((await page.locator("#sceneTitle").innerText()) === confirmedTitle, "Transport failure replaced the last confirmed view.");
    invariant((await page.locator("#gameStatus").innerText()).includes("showing the last confirmed state"), "Transport failure lacks a stale-state notice.");

    // Completed S8 remains authoritative and short-circuits active-run dispatch.
    setScenario("completed");
    const completedResult = await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    invariant(completedResult.status === "committed", "Completed S8 frame did not commit.");
    invariant(scenario.calls.filter((call) => call.name === "s2_get_player_state").length === 0, "Active-run dispatch ran after completed S8 authority.");
    await page.locator('[data-s8-stage="fade"]').waitFor({ state: "visible" });

    // Leaving settles the old caller immediately; rejoin can render while the
    // invalidated HTTP response finishes later and can never overwrite it.
    setScenario("heldPreRun", { holdRpc: "s8_get_player_state", holdToken: "TOKEN-OLD" });
    await page.evaluate(() => { globalThis.__a1LeavingRefresh = globalThis.__GAL_A1_TEST_HOOKS__.refreshState(); });
    await scenario.started.promise;
    await page.locator("#leaveButton").evaluate((button) => button.click());
    const leavingResult = await page.evaluate(() => globalThis.__a1LeavingRefresh);
    invariant(leavingResult.status === "invalidated", `Leave did not settle the old caller: ${JSON.stringify(leavingResult)}`);

    scenario.mode = "rejoin";
    await page.locator("#roomCode").fill("NEW1");
    await page.locator("#joinCode").fill("JOIN-NEW");
    await page.locator("#joinButton").click();
    await page.waitForFunction(() => document.querySelector("#playerLabel")?.textContent?.includes("New Player · NEW1"));
    const rejoinedLabel = await page.locator("#playerLabel").innerText();
    scenario.gate.resolve();
    await page.waitForTimeout(150);
    invariant((await page.locator("#playerLabel").innerText()) === rejoinedLabel, "Late old-session response overwrote the rejoined Player view.");
    await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.stopPolling());

    const unexpectedBrowserErrors = browserErrors.filter((message) => !message.includes("net::ERR_FAILED"));
    invariant(expectedOptionalFailures === 1, `Expected one optional-domain failure, observed ${expectedOptionalFailures}.`);
    invariant(unexpectedBrowserErrors.length === 0, `Browser errors: ${unexpectedBrowserErrors.join(" | ")}`);
  } finally {
    await context.close();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  console.log("A1 Player polling browser checks passed.");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
