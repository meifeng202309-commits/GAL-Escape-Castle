import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { rpc, auth, fixture, vote, state, sprint6 } = require("./sprint5-live-e2e.js");

const baseUrl = (process.env.GAL_E0_BASE_URL || "https://meifeng202309-commits.github.io/GAL-Escape-Castle/").replace(/\/?$/, "/");
const expectation = process.env.GAL_E0_EXPECTATION || "baseline";
const outputDir = process.env.GAL_E0_OUTPUT_DIR || "docs/reports/remediation/structural-v1/e0";
const browserExecutable = process.env.GAL_E0_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
const room = `E0${suffix}`;
const teacherToken = `T-${suffix}-${crypto.randomUUID().slice(0, 8)}`;
const joins = ["G", "A", "L"].map((role) => `${role}-${suffix}-${crypto.randomUUID().slice(0, 8)}`);
const report = { baseUrl, expectation, implementationSha: process.env.GAL_E0_IMPLEMENTATION_SHA || null, startedAt: new Date().toISOString(), room, checks: {}, network: [], browserErrors: [] };

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function text(page, selector) {
  return (await page.locator(selector).innerText()).trim();
}

async function prepareAct14Boundary() {
  const f = await fixture("audit");
  const initial = await Promise.all([0, 1, 2].map((index) => rpc("s3b_get_player_state", auth(f, index))));
  for (let index = 0; index < 3; index += 1) {
    await rpc("s9_observe_act5_handoff", { ...auth(f, index), p_expected_run_id: initial[index].run_id });
    await rpc("s9_enter_act6", { ...auth(f, index), p_expected_run_id: initial[index].run_id });
  }
  await vote(f, ["escape", "1897", "trapped"]);
  await vote(f, ["escape", "1897", "trapped"]);
  await rpc("s5_advance", auth(f, 0));
  await rpc("s3_set_item_view", { ...auth(f, 2), p_item_key: "linda_stopped_watch", p_target_view: "back" });
  await vote(f, ["clock_a", "clock_a", "clock_c"]);
  await vote(f, ["clock_c", "clock_c", "clock_b"]);
  await rpc("s5_advance", auth(f, 0));
  for (const [index, p_choice_id] of [[0, "main_gate"], [1, "west_tower"], [2, "compare"]]) {
    await rpc("s5_submit_private_choice", { ...auth(f, index), p_client_request_id: crypto.randomUUID(), p_choice_id });
  }
  await rpc("s3_share_photo", { ...auth(f, 2), p_recipient_role: "GAL-B", p_source_item_key: "linda_closure_order", p_source_view: "front" });
  await vote(f, ["west_tower", "west_tower", "main_gate"]);
  await rpc("s5_advance", auth(f, 0));
  const sprint5 = await state(f);
  invariant(sprint5.state.phase_key === "complete", "ACT14 browser fixture did not complete Sprint 5.");
  await sprint6(f, "take");
  return f;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: browserExecutable });
  const teacherContext = await browser.newContext();
  const playerContexts = await Promise.all([0, 1, 2].map(() => browser.newContext()));
  const teacher = await teacherContext.newPage();
  const players = await Promise.all(playerContexts.map((context) => context.newPage()));

  for (const page of [teacher, ...players]) {
    page.on("pageerror", (error) => report.browserErrors.push({ at: new Date().toISOString(), message: error.message }));
    page.on("console", (message) => {
      const location = message.location();
      if (message.type() === "error") report.browserErrors.push({
        at: new Date().toISOString(),
        message: `${message.text()}${location.url ? `: ${location.url}` : ""}`,
      });
    });
    page.on("requestfailed", (request) => report.browserErrors.push({
      at: new Date().toISOString(),
      message: `${request.failure()?.errorText || "request failed"}: ${request.url()}`,
    }));
    page.on("response", async (response) => {
      if (response.status() >= 400) report.browserErrors.push({
        at: new Date().toISOString(),
        message: `HTTP ${response.status()}: ${response.url()}`,
      });
      if (!response.url().includes("/rest/v1/rpc/")) return;
      report.network.push({ at: new Date().toISOString(), method: response.request().method(), url: response.url(), status: response.status() });
    });
  }

  try {
    await teacher.goto(`${baseUrl}teacher.html`, { waitUntil: "networkidle" });
    await teacher.locator("#roomCode").fill(room);
    await teacher.locator("#teacherToken").fill(teacherToken);
    await teacher.locator("#codeGitte").fill(joins[0]);
    await teacher.locator("#codeAnna").fill(joins[1]);
    await teacher.locator("#codeLinda").fill(joins[2]);
    await teacher.locator("#createRoomButton").click();
    await teacher.locator("#teacherStatus").filter({ hasText: /Room ready|Watching room/ }).waitFor({ timeout: 20000 });

    // Load isolated player contexts sequentially. This avoids exhausting small
    // local static-server connection backlogs while preserving session isolation.
    for (const [index, page] of players.entries()) {
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.locator("#roomCode").fill(room);
      await page.locator("#joinCode").fill(joins[index]);
      await page.locator("#joinButton").click();
      await page.locator("#gamePanel:not(.hidden)").waitFor({ timeout: 20000 });
    }
    await Promise.all(players.map((page) => page.waitForFunction(() => {
      const legacy = document.querySelector("#sceneTitle")?.textContent?.trim();
      const formal = document.querySelector("#sprint3bText")?.textContent?.trim();
      const error = document.querySelector("#gameStatus")?.textContent?.trim();
      return Boolean(legacy || formal || error);
    }, null, { timeout: 20000 })));

    const isolatedSessions = await Promise.all(players.map((page) => page.evaluate(() => JSON.parse(localStorage.getItem("gal_castle_escape_session_v1") || "null"))));
    invariant(new Set(isolatedSessions.map((entry) => entry?.session_token)).size === 3, "Player contexts did not retain three distinct sessions.");
    report.checks.isolatedContexts = isolatedSessions.map(({ player_id, display_name, role_slot }) => ({ player_id, display_name, role_slot }));

    report.checks.preRun = await Promise.all(players.map(async (page, index) => ({
      index,
      title: await text(page, "#sceneTitle"),
      sceneText: await text(page, "#sceneText"),
      choices: await text(page, "#choiceArea"),
      formal: await text(page, "#sprint3bPanel"),
    })));
    const legacyReachable = report.checks.preRun.some((state) => /Scene 1|Study the map|old keys|Go straight to the door/i.test(`${state.title} ${state.choices}`));
    report.checks.legacyPreRunReachable = legacyReachable;

    const postStartStateResponses = players.map((page) => page.waitForResponse(
      (response) => response.url().includes("/rest/v1/rpc/s3b_get_player_state") && response.request().method() === "POST",
      { timeout: 20000 },
    ));
    const startResponse = teacher.waitForResponse(
      (response) => response.url().includes("/rest/v1/rpc/s9_start_formal_game") && response.request().method() === "POST",
      { timeout: 20000 },
    );
    await teacher.locator("#startRunButton").click();
    const started = await startResponse;
    invariant(started.status() === 200, `Atomic formal start returned HTTP ${started.status()}.`);
    const postStartCanonicalStates = await Promise.all(postStartStateResponses.map(async (pending) => {
      const response = await pending;
      return response.json();
    }));
    await Promise.all(players.map((page) => page.waitForFunction(() => {
      const formal = document.querySelector("#sprint3bPanel")?.textContent || "";
      return formal && !formal.includes("Wait for the Teacher to start the formal run");
    }, null, { timeout: 20000 })));
    report.checks.startBoundary = {
      teacherStatus: await text(teacher, "#discussionTeacherStatus"),
      runBadge: await text(teacher, "#runBadge"),
      playerStates: await Promise.all(players.map(async (page) => ({
        gameStatus: await text(page, "#gameStatus"),
        formal: await text(page, "#sprint3bPanel"),
      }))),
      initializeControlVisible: await teacher.locator("#initializeSprint3bButton").isVisible(),
      canonicalStatesBeforeInitialization: postStartCanonicalStates,
    };
    const splitBoundary = report.checks.startBoundary.initializeControlVisible && (
      postStartCanonicalStates.some((state) => !state?.active || !state?.scene)
      || report.checks.startBoundary.playerStates.some((state) => /unavailable|Retry/i.test(state.gameStatus))
    );
    report.checks.splitStartBoundaryReachable = splitBoundary;

    if (report.checks.startBoundary.initializeControlVisible) {
      const initializationResponse = teacher.waitForResponse(
        (response) => response.url().includes("/rest/v1/rpc/s3b_initialize_flow") && response.request().method() === "POST",
        { timeout: 20000 },
      );
      await teacher.locator("#initializeSprint3bButton").click();
      const response = await initializationResponse;
      report.checks.initializationStatus = response.status();
      await players[0].waitForTimeout(1800);
    }

    report.checks.act1 = await Promise.all(players.map(async (page) => ({
      player: await text(page, "#playerLabel"),
      formal: await text(page, "#sprint3bPanel"),
    })));
    report.checks.act1RolePrivate = new Set(report.checks.act1.map((state) => state.formal)).size === 3;

    if (expectation === "remediated") {
      const finalFixture = await prepareAct14Boundary();
      await rpc("s1_release_player_session", {
        p_room_code: finalFixture.room,
        p_teacher_token: finalFixture.teacher,
        p_role_slot: "GAL-A",
      });
      const finalContext = await browser.newContext();
      const finalPage = await finalContext.newPage();
      finalPage.on("pageerror", (error) => report.browserErrors.push({ at: new Date().toISOString(), message: error.message }));
      finalPage.on("console", (message) => {
        const location = message.location();
        if (message.type() === "error") report.browserErrors.push({
          at: new Date().toISOString(),
          message: `${message.text()}${location.url ? `: ${location.url}` : ""}`,
        });
      });
      finalPage.on("requestfailed", (request) => report.browserErrors.push({
        at: new Date().toISOString(),
        message: `${request.failure()?.errorText || "request failed"}: ${request.url()}`,
      }));
      finalPage.on("response", (response) => {
        if (response.status() >= 400) report.browserErrors.push({
          at: new Date().toISOString(),
          message: `HTTP ${response.status()}: ${response.url()}`,
        });
      });
      await finalPage.goto(baseUrl, { waitUntil: "networkidle" });
      await finalPage.locator("#roomCode").fill(finalFixture.room);
      await finalPage.locator("#joinCode").fill(finalFixture.joins[0]);
      await finalPage.locator("#joinButton").click();
      await finalPage.locator("#s8Finalize").waitFor({ state: "visible", timeout: 20000 });
      const finalizeResponse = finalPage.waitForResponse(
        (response) => response.url().includes("/rest/v1/rpc/s8_finalize") && response.request().method() === "POST",
        { timeout: 20000 },
      );
      await finalPage.locator("#s8Finalize").click();
      const finalized = await finalizeResponse;
      await finalPage.locator('[data-s8-stage="end"]').waitFor({ state: "visible", timeout: 15000 });
      const initialReveal = await text(finalPage, "#sprint3bText");
      await finalPage.screenshot({ path: path.join(outputDir, `${stamp}_${room}_act14-finalized.png`), fullPage: true });
      await finalPage.reload({ waitUntil: "networkidle" });
      await finalPage.locator('[data-s8-stage="end"]').waitFor({ state: "visible", timeout: 15000 });
      const reconnectReveal = await text(finalPage, "#sprint3bText");
      await finalPage.screenshot({ path: path.join(outputDir, `${stamp}_${room}_act14-reconnect.png`), fullPage: true });
      report.checks.act14 = {
        fixtureRoom: finalFixture.room,
        finalizeStatus: finalized.status(),
        canonicalRevealReached: /END|EINDE|结束/i.test(initialReveal),
        reconnectRevealReached: /END|EINDE|结束/i.test(reconnectReveal),
        initialReveal,
        reconnectReveal,
      };
      await finalContext.close();
    }

    for (let index = 0; index < players.length; index += 1) {
      await players[index].screenshot({ path: path.join(outputDir, `${stamp}_${room}_player${index + 1}.png`), fullPage: true });
    }
    await teacher.screenshot({ path: path.join(outputDir, `${stamp}_${room}_teacher.png`), fullPage: true });

    if (expectation === "baseline") {
      invariant(legacyReachable, "Baseline no longer exposes legacy pre-run gameplay; update the E0 expectation.");
      invariant(splitBoundary, "Baseline no longer exposes the split startup boundary; update the E0 expectation.");
    } else if (expectation === "remediated") {
      invariant(!legacyReachable, "Legacy pre-run gameplay remains reachable.");
      invariant(!splitBoundary, "Split formal startup remains reachable.");
      invariant(report.checks.act1RolePrivate, "ACT1 role-private player surfaces are not distinct.");
      invariant(report.checks.act14?.finalizeStatus === 200, "Root browser finalization did not succeed.");
      invariant(report.checks.act14?.canonicalRevealReached, "Canonical ACT14 reveal was not reached through the root browser.");
      invariant(report.checks.act14?.reconnectRevealReached, "Reconnect did not return to the canonical ACT14 reveal.");
    } else {
      throw new Error(`Unknown GAL_E0_EXPECTATION: ${expectation}`);
    }
  } finally {
    report.finishedAt = new Date().toISOString();
    await writeFile(path.join(outputDir, `${stamp}_${room}_${expectation}.json`), `${JSON.stringify(report, null, 2)}\n`);
    await browser.close();
  }
  console.log(`E0 ${expectation} PASS ${room}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
