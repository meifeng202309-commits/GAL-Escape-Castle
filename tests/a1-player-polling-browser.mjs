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
  rejectHeld: false,
  frameVersion: null,
  gate: null,
  started: null,
  calls: [],
  stationTask: false,
  libraryResolved: false,
  discussionSession: "00000000-0000-0000-0000-000000000030",
  sentMessages: [],
};

function setScenario(mode, options = {}) {
  scenario.mode = mode;
  scenario.holdRpc = options.holdRpc || null;
  scenario.holdToken = options.holdToken || null;
  scenario.holdUsed = false;
  scenario.rejectHeld = Boolean(options.rejectHeld);
  scenario.frameVersion = options.frameVersion || null;
  scenario.gate = options.holdRpc ? deferred() : null;
  scenario.started = options.holdRpc ? deferred() : null;
  scenario.calls = [];
  scenario.stationTask = false;
  scenario.libraryResolved = false;
  scenario.discussionSession = "00000000-0000-0000-0000-000000000030";
  scenario.sentMessages = [];
}

function projection(name, body, mode, frameVersion) {
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
  if (mode === "activeLibrary" && name === "s3b_get_player_state") return {
    active: true, run_id: "00000000-0000-0000-0000-000000000019",
    scene: { scene_id: "act3_library", phase_key: scenario.libraryResolved ? "act4_known_unknown" : "library_box", text_key: "act03.008" },
    flow: { puzzle_resolved_at: scenario.libraryResolved ? "2026-10-22T00:00:00Z" : null, puzzle_locked_prefix: "41" },
    me: { first_meeting_locked_at: "2026-10-10T00:00:00Z", grab_complete: true, left_start_room: true, player_location: "library" },
    act4_revealed: [], queued_first_messages: [],
  };
  if ((mode === "activeAct7" || mode === "activeStationA" || mode === "activeAct10Discussion") && name === "s3b_get_player_state") return {
    active: true,
    scene: { scene_id: "act7_clock_room", phase_key: "act7_vote", text_key: "act07.001" },
    flow: { terminal_state: "SPRINT3B_COMPLETE" },
    me: { act6_entered_at: "2026-10-10T00:00:00Z" },
    act4_revealed: [],
    queued_first_messages: [],
  };
  if (name === "s3b_get_player_state") return { active: false, scene: null };
  if (["activeStationA","activeLibrary","activeAct10Discussion"].includes(mode) && name === "s5_get_player_state") return { active: false };
  if (name === "s5_get_player_state") return {
    active: true,
    state: {
      phase_key: frameVersion === "confirmed" ? "act7_solved" : "act7_vote",
      act_no: 7,
      act7_wrong_attempts: frameVersion === "next" ? 1 : frameVersion === "rejected" ? 2 : 0,
    },
    canonical_discussion: { discussion_session_id: "00000000-0000-0000-0000-000000000010" },
    private_choices_revealed: [],
    my_private_choice: null,
  };
  if (mode === "activeStationA" && name === "s6_get_player_state") return {
    active: true,
    state: { run_id: "00000000-0000-0000-0000-000000000020", act_no: 12, phase_key: "act12_tasks", act9_step: 4, round_no: 1, gold_key: true, feedback_text_keys: [] },
    allocation: "A", station_task: scenario.stationTask ? "municipal_year" : null,
    station_b_stage: null, engaged_roles: [], private_choices_revealed: [], discussion: null,
  };
  if (mode === "activeAct10Discussion" && name === "s6_get_player_state") return {
    active: true,
    state: { run_id: "00000000-0000-0000-0000-000000000020", act_no: 10, phase_key: "act10_discussion", act9_step: 4, round_no: 1, gold_key: null, feedback_text_keys: [] },
    allocation: null, station_task: null, station_b_stage: null, engaged_roles: [],
    private_choices_revealed: [{role_slot:"GAL-A",choice_id:"take"},{role_slot:"GAL-B",choice_id:"leave"},{role_slot:"GAL-C",choice_id:"take"}],
    discussion: { discussion_session_id: scenario.discussionSession, phase_key: "act10_discussion", step_key: "reveal", vote_round: 1, phase_deadline: null, teacher_open_required: true, messages: scenario.sentMessages },
  };
  if (mode === "activeStationA" && name === "s6_complete_station_v2") {
    invariant(body.p_task_value === "1897", `Station A submitted unexpected value ${body.p_task_value}.`);
    scenario.stationTask = true;
    return { ok: true, role_key: "A", task_key: "municipal_year" };
  }
  if (mode === "activeLibrary" && name === "s3b_submit_library_code") {
    invariant(body.p_code === "41739", `Library submitted unexpected code ${body.p_code}.`);
    scenario.libraryResolved = true;
    return { ok: true };
  }
  if (mode === "activeAct10Discussion" && name === "s6_send_message_v2") {
    invariant(body.p_expected_discussion_session_id === scenario.discussionSession, "ACT10 message used stale discussion identity.");
    scenario.sentMessages.push({ display_name: "Old Player", message_text: body.p_message_text, created_at: "2026-10-22T00:00:00Z" });
    return { ok: true, message_id: scenario.sentMessages.length };
  }
  if (name === "s6_get_player_state") return { active: false };
  if (name === "s3_get_player_state") return {
    active: true,
    items: [],
    group_items: [],
    observations: [],
    shared_photos: [],
    inspected_item_keys: [],
    scene: { allow_share_photo: false },
  };
  if (name === "s5_get_discussion_state") return {
    active: true,
    discussion: {
      discussion_session_id: "00000000-0000-0000-0000-000000000010",
      topic: frameVersion === "confirmed" ? "Confirmed ACT7 discussion" : frameVersion === "next" ? "Next ACT7 discussion" : "Rejected ACT7 discussion",
      status: "discussion",
      vote_round: 1,
      phase_deadline: null,
      require_final_vote: true,
      vote_options: [],
    },
    initial_choices: [],
    messages: frameVersion === "confirmed" ? [{ display_name: "Old Player", created_at: "2026-10-10T00:00:00Z", message_text: "Confirmed frame" }] : [],
    submitted_vote_count: 0, my_vote: null, revealed_votes: [], vote_history: [],
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
    const frameVersion = scenario.frameVersion;
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
      if (scenario.rejectHeld) {
        expectedOptionalFailures += 1;
        await route.abort("failed");
        return;
      }
    }
    try {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(projection(name, body, mode, frameVersion)),
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

    // Establish a real active ACT7 frame with scene, Discussion, and action DOM.
    setScenario("activeAct7", { frameVersion: "confirmed" });
    const confirmedAct7Result = await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    invariant(confirmedAct7Result.status === "committed", "Initial active ACT7 frame did not commit.");
    invariant(!(await page.locator("#discussionPanel").evaluate((node) => node.classList.contains("hidden"))), "Initial active ACT7 Discussion did not render.");
    invariant(await page.locator("#sprint3bActions button").count() === 1, "Initial active ACT7 action did not render.");
    const confirmedAct7Dom = await page.evaluate(() => ({
      scene: document.querySelector("#sprint3bText").innerHTML,
      discussion: document.querySelector("#discussionPanel").innerHTML,
      actions: document.querySelector("#sprint3bActions").innerHTML,
    }));

    // A newer active ACT7 candidate cannot partially replace any of those regions
    // while its S5 Discussion read is still pending.
    setScenario("activeAct7", { frameVersion: "next", holdRpc: "s5_get_discussion_state" });
    await page.evaluate(() => { globalThis.__a1DiscussionRefresh = globalThis.__GAL_A1_TEST_HOOKS__.refreshState(); });
    await scenario.started.promise;
    const heldAct7Dom = await page.evaluate(() => ({
      scene: document.querySelector("#sprint3bText").innerHTML,
      discussion: document.querySelector("#discussionPanel").innerHTML,
      actions: document.querySelector("#sprint3bActions").innerHTML,
    }));
    invariant(JSON.stringify(heldAct7Dom) === JSON.stringify(confirmedAct7Dom), "Active ACT7 scene, Discussion, or actions changed before the delayed read completed.");
    scenario.gate.resolve();
    const discussionResult = await page.evaluate(() => globalThis.__a1DiscussionRefresh);
    invariant(discussionResult.status === "committed", "Complete S5 candidate frame did not commit.");
    const nextAct7Dom = await page.evaluate(() => ({
      scene: document.querySelector("#sprint3bText").innerHTML,
      discussion: document.querySelector("#discussionPanel").innerHTML,
      discussionText: document.querySelector("#discussionPanel").innerText,
      actions: document.querySelector("#sprint3bActions").innerHTML,
      actionsText: document.querySelector("#sprint3bActions").innerText,
    }));
    invariant(nextAct7Dom.scene !== confirmedAct7Dom.scene, "Released active ACT7 scene did not advance coherently.");
    invariant(nextAct7Dom.discussion !== confirmedAct7Dom.discussion, "Released active ACT7 Discussion did not advance coherently.");
    invariant(nextAct7Dom.actions !== confirmedAct7Dom.actions, "Released active ACT7 actions did not advance coherently.");

    // A rejected delayed Discussion read preserves that entire confirmed ACT7 frame.
    setScenario("activeAct7", { frameVersion: "rejected", holdRpc: "s5_get_discussion_state", rejectHeld: true });
    await page.evaluate(() => { globalThis.__a1RejectedDiscussionRefresh = globalThis.__GAL_A1_TEST_HOOKS__.refreshState(); });
    await scenario.started.promise;
    scenario.gate.resolve();
    const rejectedDiscussionResult = await page.evaluate(() => globalThis.__a1RejectedDiscussionRefresh);
    invariant(rejectedDiscussionResult.status === "fetch_error", `Rejected Discussion read was not classified: ${JSON.stringify(rejectedDiscussionResult)}`);
    const afterRejectedAct7Dom = await page.evaluate(() => ({
      scene: document.querySelector("#sprint3bText").innerHTML,
      discussion: document.querySelector("#discussionPanel").innerHTML,
      discussionText: document.querySelector("#discussionPanel").innerText,
      actions: document.querySelector("#sprint3bActions").innerHTML,
      actionsText: document.querySelector("#sprint3bActions").innerText,
    }));
    invariant(afterRejectedAct7Dom.scene === nextAct7Dom.scene, "Rejected Discussion read replaced the confirmed ACT7 scene.");
    invariant(afterRejectedAct7Dom.discussionText === nextAct7Dom.discussionText, "Rejected Discussion read replaced the confirmed ACT7 Discussion content.");
    invariant(afterRejectedAct7Dom.actionsText === nextAct7Dom.actionsText, "Rejected Discussion read replaced the confirmed ACT7 action content.");
    invariant(!afterRejectedAct7Dom.discussionText.includes("Rejected ACT7 discussion"), "Rejected candidate Discussion leaked into the confirmed frame.");
    invariant((await page.locator("#gameStatus").innerText()).includes("showing the last confirmed state"), "Rejected Discussion read lacks a stale-state notice.");

    // Library code remains editable across same-authority polls and clears
    // after the accepted submission advances the authoritative state.
    setScenario("activeLibrary");
    invariant((await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())).status === "committed", "Initial Library frame did not commit.");
    const libraryInput = page.locator("#libraryCode");
    await libraryInput.fill("739");
    await libraryInput.focus();
    invariant((await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())).status === "committed", "Library same-state poll did not commit.");
    invariant(await libraryInput.inputValue() === "739", "Library draft was lost across a same-state poll.");
    invariant(await libraryInput.evaluate((node) => document.activeElement === node), "Library focus was lost across a same-state poll.");
    await libraryInput.press("Enter");
    await page.waitForFunction(() => !document.querySelector("#libraryCode"));
    invariant(scenario.calls.some((call) => call.name === "s3b_submit_library_code"), "Library real form handler did not submit.");

    // ACT10 discussion draft remains local to the same run/phase/session,
    // is discarded for a new discussion identity, and clears after send.
    setScenario("activeAct10Discussion");
    invariant((await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())).status === "committed", "Initial ACT10 discussion frame did not commit.");
    const messageInput = page.locator("#s6MessageText");
    invariant(await page.locator('[data-s6-rpc="s6_close_discussion_v2"]').isDisabled(), "NORMAL ACT10 exposed premature player Continue.");
    await messageInput.fill("draft across poll");
    await messageInput.focus();
    invariant((await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())).status === "committed", "ACT10 discussion same-session poll did not commit.");
    invariant(await messageInput.inputValue() === "draft across poll", "ACT10 discussion draft was lost across a same-session poll.");
    invariant(await messageInput.evaluate((node) => document.activeElement === node), "ACT10 discussion focus was lost across a same-session poll.");
    await messageInput.evaluate(node=>{globalThis.__a1ImeNode=node;node.dispatchEvent(new CompositionEvent("compositionstart",{bubbles:true,data:"ni"}));node.value="ni";node.dispatchEvent(new InputEvent("input",{bubbles:true,data:"ni",inputType:"insertCompositionText",isComposing:true}))});
    await page.evaluate(()=>globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    invariant(await messageInput.evaluate(node=>node===globalThis.__a1ImeNode&&node.value==="ni"),"Native IME node/value changed during a polling commit.");
    await messageInput.evaluate(node=>{node.value="draft across poll";node.dispatchEvent(new CompositionEvent("compositionend",{bubbles:true,data:"draft across poll"}))});
    await page.waitForTimeout(50);
    for(const size of [{width:1366,height:768},{width:1280,height:720}]){await page.setViewportSize(size);const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,columns:getComputedStyle(document.querySelector(".v4-runtime-grid")).gridTemplateColumns,zoom:devicePixelRatio}));invariant(!layout.overflow,`V4 Player layout overflowed at ${size.width}x${size.height}.`);invariant(layout.columns.split(" ").length>=2,`V4 Player layout did not retain two columns at ${size.width}x${size.height}.`)}
    scenario.discussionSession = "00000000-0000-0000-0000-000000000031";
    invariant((await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState())).status === "committed", "ACT10 new-session frame did not commit.");
    invariant(await messageInput.inputValue() === "", "Stale ACT10 draft crossed a discussion-session boundary.");
    await messageInput.fill("send once");
    await messageInput.press("Enter");
    await page.waitForFunction(() => document.querySelector("#s6MessageText")?.value === "");
    invariant(scenario.calls.some((call) => call.name === "s6_send_message_v2"), "ACT10 real message handler did not submit.");

    // Station A remains editable and viewport-stable across complete polling commits and still
    // submits through the real form handler when the authoritative state changes.
    setScenario("activeStationA");
    const stationResult = await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
    invariant(stationResult.status === "committed", "Initial Station A frame did not commit.");
    const stationInput = page.locator("#s6StationValue");
    await stationInput.focus();
    await stationInput.type("18");
    await page.evaluate(() => { document.body.style.minHeight = "4000px"; window.scrollTo(0, 900); });
    const stationScrollY = await page.evaluate(() => window.scrollY);
    for (let cycle = 0; cycle < 2; cycle++) {
      const pollResult = await page.evaluate(() => globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
      invariant(pollResult.status === "committed", `Station A poll ${cycle + 1} did not commit.`);
      invariant(await stationInput.inputValue() === "18", `Station A draft was lost on poll ${cycle + 1}.`);
      invariant(await stationInput.evaluate((node) => document.activeElement === node), `Station A focus was lost on poll ${cycle + 1}.`);
      invariant(Math.abs((await page.evaluate(() => window.scrollY)) - stationScrollY) <= 1, `Station A viewport moved on poll ${cycle + 1}.`);
    }
    await stationInput.type("97");
    await stationInput.press("Enter");
    await page.waitForFunction(() => document.querySelector("#sprint3bActions [data-s6-rpc='s6_engage_v2']"));
    invariant(scenario.calls.some((call) => call.name === "s6_complete_station_v2"), "Station A Enter did not call the guarded RPC.");
    invariant(await page.locator("#s6StationValue").count() === 0, "Completed Station A field survived authoritative state change.");

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
    invariant(expectedOptionalFailures === 2, `Expected two injected transport failures, observed ${expectedOptionalFailures}.`);
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
