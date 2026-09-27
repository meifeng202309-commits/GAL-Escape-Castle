import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const baseUrl = (process.env.GAL_E0_BASE_URL || "https://meifeng202309-commits.github.io/GAL-Escape-Castle/").replace(/\/?$/, "/");
const expectation = process.env.GAL_E0_EXPECTATION || "baseline";
const outputDir = process.env.GAL_E0_OUTPUT_DIR || "docs/reports/remediation/structural-v1/e0";
const browserExecutable = process.env.GAL_E0_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
const room = `E0${suffix}`;
const teacherToken = `T-${suffix}-${crypto.randomUUID().slice(0, 8)}`;
const joins = ["G", "A", "L"].map((role) => `${role}-${suffix}-${crypto.randomUUID().slice(0, 8)}`);
const report = { baseUrl, expectation, startedAt: new Date().toISOString(), room, checks: {}, network: [] };

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function text(page, selector) {
  return (await page.locator(selector).innerText()).trim();
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: browserExecutable });
  const teacherContext = await browser.newContext();
  const playerContexts = await Promise.all([0, 1, 2].map(() => browser.newContext()));
  const teacher = await teacherContext.newPage();
  const players = await Promise.all(playerContexts.map((context) => context.newPage()));

  for (const page of [teacher, ...players]) {
    page.on("response", async (response) => {
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

    await Promise.all(players.map(async (page, index) => {
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.locator("#roomCode").fill(room);
      await page.locator("#joinCode").fill(joins[index]);
      await page.locator("#joinButton").click();
      await page.locator("#gamePanel:not(.hidden)").waitFor({ timeout: 20000 });
    }));
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
    await teacher.locator("#startRunButton").click();
    await teacher.locator("#discussionTeacherStatus").filter({ hasText: /Run started|Formal run ready|Start failed/ }).waitFor({ timeout: 20000 });
    const postStartCanonicalStates = await Promise.all(postStartStateResponses.map(async (pending) => {
      const response = await pending;
      return response.json();
    }));
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
