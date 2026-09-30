import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { rpc, auth, oldVote, vote, state, fixture, sprint6, s6state, s6id, id } = require("./sprint5-live-e2e.js");
const { completeSprint5ToAct9 } = require("./structural-package-b-live-e2e.js");
const { fixtureAtAct4 } = require("./structural-package-d-live-e2e.js");

const baseUrl = (process.env.GAL_E1_BASE_URL || "http://127.0.0.1:4173/").replace(/\/?$/, "/");
const outputDir = process.env.GAL_E1_OUTPUT_DIR || "docs/reports/remediation/structural-v1/e1";
const browserExecutable = process.env.GAL_E1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const implementationSha = process.env.GAL_E1_IMPLEMENTATION_SHA;
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const report = { baseUrl, implementationSha, startedAt: new Date().toISOString(), checks: {}, network: { rpcTotal: 0, statusCounts: {}, rpcNames: {} }, browserErrors: [], screenshots: [] };
const contexts = [];

function invariant(condition, message) { if (!condition) throw new Error(message); }
const sessionFor = (f, index) => ({ room_code: f.room, player_id: f.players[index].player_id, display_name: f.players[index].display_name, role_slot: f.players[index].role_slot, session_token: f.players[index].session_token });

function observe(page, label) {
  page.on("pageerror", error => report.browserErrors.push({ label, type: "pageerror", message: error.message }));
  page.on("console", message => { if (message.type() === "error") report.browserErrors.push({ label, type: "console", message: message.text(), url: message.location().url }); });
  page.on("requestfailed", request => report.browserErrors.push({ label, type: "requestfailed", message: request.failure()?.errorText || "request failed", url: request.url() }));
  page.on("response", response => {
    if (response.status() >= 400) report.browserErrors.push({ label, type: "http", status: response.status(), url: response.url() });
    if (response.url().includes("/rest/v1/rpc/")) {
      const rpcName = response.url().split("/rest/v1/rpc/")[1].split("?")[0];
      const status = String(response.status());
      report.network.rpcTotal += 1;
      report.network.statusCounts[status] = (report.network.statusCounts[status] || 0) + 1;
      report.network.rpcNames[rpcName] = (report.network.rpcNames[rpcName] || 0) + 1;
    }
  });
}

async function shot(page, name) {
  const file = path.join(outputDir, `${stamp}_${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  report.screenshots.push(file);
}

async function text(page, selector) { return (await page.locator(selector).innerText()).trim(); }

async function seededPage(browser, f, index, label) {
  const context = await browser.newContext();
  contexts.push(context);
  const page = await context.newPage();
  observe(page, label);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate(session => localStorage.setItem("gal_castle_escape_session_v1", JSON.stringify(session)), sessionFor(f, index));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#gamePanel:not(.hidden)").waitFor({ timeout: 20000 });
  return page;
}

async function initialLifecycle(browser) {
  const teacherContext = await browser.newContext();
  contexts.push(teacherContext);
  const teacher = await teacherContext.newPage();
  observe(teacher, "lifecycle-teacher");
  const playerContexts = await Promise.all([0, 1, 2].map(() => browser.newContext()));
  contexts.push(...playerContexts);
  const players = await Promise.all(playerContexts.map((context, index) => context.newPage().then(page => (observe(page, `lifecycle-player-${index + 1}`), page))));
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
  const room = `E1${suffix}`;
  const teacherToken = `T-${suffix}-${crypto.randomUUID().slice(0, 8)}`;
  const joins = ["G", "A", "L"].map(role => `${role}-${suffix}-${crypto.randomUUID().slice(0, 8)}`);

  await teacher.goto(`${baseUrl}teacher.html`, { waitUntil: "domcontentloaded" });
  await teacher.locator("#roomCode").fill(room);
  await teacher.locator("#teacherToken").fill(teacherToken);
  await teacher.locator("#codeGitte").fill(joins[0]);
  await teacher.locator("#codeAnna").fill(joins[1]);
  await teacher.locator("#codeLinda").fill(joins[2]);
  await teacher.locator("#createRoomButton").click();
  await teacher.locator("#teacherStatus").filter({ hasText: /Room ready|Watching room/ }).waitFor({ timeout: 20000 });

  const staggered = [];
  for (let index = 0; index < players.length; index += 1) {
    const page = players[index];
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.locator("#roomCode").fill(room);
    await page.locator("#joinCode").fill(joins[index]);
    await page.locator("#joinButton").click();
    await page.locator("#gamePanel:not(.hidden)").waitFor({ timeout: 20000 });
    await page.locator("#sprint3bPanel:not(.hidden)").waitFor({ timeout: 20000 });
    staggered.push({ index, visible: await text(page, "#sprint3bPanel") });
  }
  invariant(staggered.every(entry => /Wait for the Teacher|connected/i.test(entry.visible)), "Pre-run waiting was not stable across staggered joins.");

  await teacher.locator("#startRunButton").click();
  await Promise.all(players.map(page => page.waitForFunction(() => {
    const value = document.querySelector("#sprint3bPanel")?.textContent || "";
    return value && !/Wait for the Teacher|Formal game starting/i.test(value);
  }, null, { timeout: 20000 })));
  const act1 = await Promise.all(players.map(async page => text(page, "#sprint3bPanel")));
  invariant(new Set(act1).size === 3, "ACT1 player surfaces are not role-private and distinct.");
  report.checks.lifecycle = { room, staggeredJoinOrder: ["GAL-A", "GAL-B", "GAL-C"], preRun: staggered, act1RolePrivate: true, act1 };
  await Promise.all(players.map((page, index) => shot(page, `lifecycle-act1-player${index + 1}`)));
  await shot(teacher, "lifecycle-teacher");
  await Promise.all([teacherContext, ...playerContexts].map(context => context.close()));
}

async function act4ThroughAct6(browser) {
  const f = await fixtureAtAct4();
  const pages = await Promise.all([0, 1, 2].map(i => seededPage(browser, f, i, `act4-player-${i + 1}`)));
  await Promise.all(pages.map(page => page.locator(".act4-comparison").waitFor({ state: "visible", timeout: 20000 })));
  const lindaRecognition = await Promise.all(pages.map(page => page.locator(".act4-linda-recognition").count()));
  invariant(JSON.stringify(lindaRecognition) === JSON.stringify([0, 0, 1]), `Linda-only recognition boundary failed: ${JSON.stringify(lindaRecognition)}`);
  invariant(await pages[0].locator('.act4-door-marker[data-anchor="library_unknown_door"]').isVisible(), "ACTIVE Library door anchor marker is not visible.");
  report.checks.act4Comparison = { room: f.room, lindaRecognition, mapPlaceholder: await pages[0].locator("#act4MapImage.trial-asset-placeholder").count(), doorMarkerVisible: true };
  await shot(pages[2], "act4-comparison-linda");

  await rpc("s3b_submit_act4_choice", { ...auth(f, 0), p_choice_id: "known" });
  await rpc("s3b_submit_act4_choice", { ...auth(f, 1), p_choice_id: "unknown" });
  await pages[0].locator(".accepted-waiting").waitFor({ state: "visible", timeout: 10000 });
  invariant(await pages[0].locator(".act4-reveal").count() === 0, "ACT4 reveal appeared before the final private choice.");
  await shot(pages[0], "act4-missing-player-wait");
  await rpc("s3b_submit_act4_choice", { ...auth(f, 2), p_choice_id: "ask" });
  await Promise.all(pages.map(page => page.locator(".act4-reveal li").nth(2).waitFor({ state: "visible", timeout: 12000 })));
  const reveals = await Promise.all(pages.map(page => text(page, ".act4-reveal")));
  invariant(reveals.every(value => /GAL-A/.test(value) && /GAL-B/.test(value) && /GAL-C/.test(value)), "ACT4 reveal omitted a canonical position.");
  await pages[0].locator("#discussionPanel:not(.hidden)").waitFor({ state: "visible", timeout: 12000 });
  report.checks.act4Reveal = { simultaneous: true, discussionVisible: true, reveals };
  await shot(pages[0], "act4-reveal-discussion");

  await oldVote(f, ["known", "known", "unknown"]);
  let s3 = await rpc("s3b_get_player_state", auth(f, 0));
  if (s3.flow.terminal_state !== "SPRINT3B_COMPLETE") await rpc("s3b_apply_act5_resolution", auth(f, 0));
  await rpc("s5_initialize", { p_room_code: f.room, p_teacher_token: f.teacher }).catch(() => null);
  await Promise.all(pages.map(page => page.locator("#enterAct6").waitFor({ state: "visible", timeout: 12000 })));
  report.checks.act5Handoff = { visible: true, text: await text(pages[0], "#sprint3bPanel") };
  await shot(pages[0], "act5-terminal-handoff");

  await pages[0].locator("#enterAct6").waitFor({ state: "visible", timeout: 12000 });
  await pages[0].waitForFunction(() => !document.querySelector("#enterAct6")?.disabled, null, { timeout: 12000 });
  await pages[0].locator("#enterAct6").click();
  await pages[0].waitForFunction(() => /Waiting for every player/.test(document.querySelector("#sprint3bPanel")?.textContent || ""), null, { timeout: 12000 });
  for (const i of [1, 2]) {
    s3 = await rpc("s3b_get_player_state", auth(f, i));
    await rpc("s9_observe_act5_handoff", { ...auth(f, i), p_expected_run_id: s3.run_id });
    await rpc("s9_enter_act6", { ...auth(f, i), p_expected_run_id: s3.run_id });
  }
  await pages[0].locator("#discussionPanel:not(.hidden)").waitFor({ state: "visible", timeout: 12000 });
  await pages[0].locator('.evidence-panel[data-s5-evidence-phase^="act6"]').waitFor({ state: "visible", timeout: 12000 });
  const earlyPocketText = await text(pages[0], '.evidence-panel[data-s5-evidence-phase^="act6"]');
  invariant(earlyPocketText.length > 0, "ACT6 early Pocket/evidence shell is empty.");
  report.checks.act6Entry = { firstPlayerWaited: true, allPlayerDiscussionStarted: true, earlyPocketVisible: true, earlyPocketText };
  await shot(pages[0], "act6-discussion-started");
  return { f, pages };
}

async function submitS6All(f, rpcName, choices) {
  const s = await s6state(f);
  for (let i = 0; i < 3; i += 1) await rpc(rpcName, { ...auth(f, i), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_choice_id: choices[i] });
}

async function closeS6Discussion(f) {
  const s = await s6state(f);
  await rpc("s6_close_discussion_v2", { ...auth(f, 0), ...s6id(s), p_expected_discussion_session_id: s.discussion.discussion_session_id, p_client_request_id: crypto.randomUUID() });
}

async function act9ThroughAct12(f, page) {
  await completeSprint5ToAct9(f);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#gamePanel:not(.hidden)").waitFor({ timeout: 20000 });
  await page.locator("#sprint3bActions .discussion-room").waitFor({ state: "visible", timeout: 12000 });
  report.checks.act9Discussion = { visible: true, text: await text(page, "#sprint3bActions .discussion-room") };
  await shot(page, "act9-discussion");
  await closeS6Discussion(f);

  let s = await s6state(f);
  await rpc("s6_submit_group_choice_v2", { ...auth(f, 0), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_choice_id: "red" });
  await page.locator(".accepted-waiting").waitFor({ state: "visible", timeout: 12000 });
  await shot(page, "act9-choice-locked-waiting");
  for (const i of [1, 2]) await rpc("s6_submit_group_choice_v2", { ...auth(f, i), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_choice_id: "red" });
  for (const choice of ["do_not_enter", "blue", "enter_blue"]) await submitS6All(f, "s6_submit_group_choice_v2", [choice, choice, choice]);

  s = await s6state(f);
  await rpc("s6_submit_private_choice_v2", { ...auth(f, 0), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_choice_id: "take" });
  await page.locator(".accepted-waiting").waitFor({ state: "visible", timeout: 12000 });
  for (const i of [1, 2]) await rpc("s6_submit_private_choice_v2", { ...auth(f, i), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_choice_id: "leave" });
  await closeS6Discussion(f);
  await submitS6All(f, "s6_submit_group_choice_v2", ["take", "take", "take"]);
  s = await s6state(f);
  await rpc("s6_advance_v2", { ...auth(f, 0), ...s6id(s), p_client_request_id: crypto.randomUUID() });
  await closeS6Discussion(f);

  s = await s6state(f);
  await rpc("s6_submit_allocation_v2", { ...auth(f, 0), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_role_key: "A" });
  await page.locator(".accepted-waiting").waitFor({ state: "visible", timeout: 12000 });
  await page.locator(".s6-station-legend").waitFor({ state: "visible", timeout: 12000 });
  invariant(await page.locator(".s6-station-legend").isVisible(), "Main Gate station legend is not readable in placeholder mode.");
  await page.locator("#s6SceneImage.trial-asset-placeholder").waitFor({ state: "visible", timeout: 12000 });
  const mainGatePlaceholder = await page.locator("#s6SceneImage.trial-asset-placeholder").count();
  await shot(page, "act11-allocation-waiting-main-gate");
  for (const [i, role] of [[1, "B"], [2, "WATCHER"]]) await rpc("s6_submit_allocation_v2", { ...auth(f, i), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_role_key: role });

  s = await s6state(f);
  await rpc("s6_complete_station_v2", { ...auth(f, 0), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_task_value: "1897" });
  await rpc("s6_engage_v2", { ...auth(f, 0), ...s6id(s), p_client_request_id: crypto.randomUUID(), p_role_key: "A" });
  await page.locator(".accepted-waiting").waitFor({ state: "visible", timeout: 12000 });
  await page.evaluate(() => { document.querySelector("#sprint3bStatus").textContent = "STALE_STATUS_SENTINEL"; });
  await page.waitForFunction(() => document.querySelector("#sprint3bStatus")?.textContent === "", null, { timeout: 5000 });
  report.checks.act9To12 = { act9LockedWaiting: true, act10LockedWaiting: true, act11AllocationWaiting: true, act12EngageWaiting: true, staleSprint6StatusCleared: true, mainGatePlaceholder: Boolean(mainGatePlaceholder), stationLegendVisible: true };
  await shot(page, "act12-engage-waiting-status-recovered");
}

async function prepareAct14Boundary() {
  const f = await fixture("audit");
  const initial = await Promise.all([0, 1, 2].map(index => rpc("s3b_get_player_state", auth(f, index))));
  for (let index = 0; index < 3; index += 1) {
    await rpc("s9_observe_act5_handoff", { ...auth(f, index), p_expected_run_id: initial[index].run_id });
    await rpc("s9_enter_act6", { ...auth(f, index), p_expected_run_id: initial[index].run_id });
  }
  await vote(f, ["escape", "1897", "trapped"]);
  await vote(f, ["escape", "1897", "trapped"]);
  await rpc("s5_advance", auth(f, 0));
  await rpc("s9_inspect_pocket_item", { ...auth(f, 2), p_item_key: "linda_stopped_watch" });
  await rpc("s3_set_item_view", { ...auth(f, 2), p_item_key: "linda_stopped_watch", p_target_view: "back" });
  await vote(f, ["clock_a", "clock_a", "clock_c"]);
  await vote(f, ["clock_c", "clock_c", "clock_b"]);
  await rpc("s5_advance", auth(f, 0));
  for (const [index, p_choice_id] of [[0, "main_gate"], [1, "west_tower"], [2, "compare"]]) await rpc("s5_submit_private_choice", { ...auth(f, index), p_client_request_id: crypto.randomUUID(), p_choice_id });
  await vote(f, ["west_tower", "west_tower", "main_gate"]);
  await rpc("s5_advance", auth(f, 0));
  invariant((await state(f)).state.phase_key === "complete", "ACT14 fixture did not complete Sprint5.");
  await sprint6(f, "take");
  return f;
}

async function act14(browser) {
  const f = await prepareAct14Boundary();
  const page = await seededPage(browser, f, 0, "act14-player");
  await page.locator("#s8Finalize").waitFor({ state: "visible", timeout: 20000 });
  const responsePromise = page.waitForResponse(response => response.url().includes("/rest/v1/rpc/s8_finalize") && response.request().method() === "POST", { timeout: 20000 });
  await page.locator("#s8Finalize").click();
  const response = await responsePromise;
  await page.locator('[data-s8-stage="end"]').waitFor({ state: "visible", timeout: 15000 });
  const initial = await text(page, "#sprint3bText");
  await shot(page, "act14-finalized");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('[data-s8-stage="end"]').waitFor({ state: "visible", timeout: 15000 });
  const reconnect = await text(page, "#sprint3bText");
  await shot(page, "act14-reconnect");
  invariant(response.status() === 200 && /END|EINDE|\u7ed3\u675f/i.test(initial) && /END|EINDE|\u7ed3\u675f/i.test(reconnect), "ACT14 finalization/reconnect failed.");
  report.checks.act14 = { room: f.room, finalizeStatus: response.status(), initial, reconnect };
}

async function main() {
  invariant(implementationSha, "GAL_E1_IMPLEMENTATION_SHA is required.");
  await mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: browserExecutable, args: ["--disable-quic"] });
  try {
    await initialLifecycle(browser);
    const { f, pages } = await act4ThroughAct6(browser);
    await act9ThroughAct12(f, pages[0]);
    await Promise.all(pages.map(page => page.context().close()));
    await act14(browser);
    const materialErrors = report.browserErrors.filter(error => !/favicon\.ico/.test(error.url || ""));
    report.checks.browserErrorCount = materialErrors.length;
    invariant(materialErrors.length === 0, `Material browser errors: ${JSON.stringify(materialErrors)}`);
  } finally {
    report.finishedAt = new Date().toISOString();
    await writeFile(path.join(outputDir, `${stamp}_E1.json`), `${JSON.stringify(report, null, 2)}\n`);
    await Promise.all(contexts.map(context => context.close().catch(() => null)));
    await browser.close();
  }
  console.log(`E1 PASS ${implementationSha}`);
}

main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
