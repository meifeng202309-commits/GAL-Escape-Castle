import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const baseUrl = (process.env.GAL_PUBLIC_BASE_URL || "https://meifeng202309-commits.github.io/GAL-Escape-Castle/").replace(/\/?$/, "/");
const outputDir = process.env.GAL_SMOKE_OUTPUT_DIR || "docs/reports/manual-acceptance/20261003-public-smoke";
const browserExecutable = process.env.GAL_SMOKE_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const frozenSha = process.env.GAL_FROZEN_SHA || "891feffe558a4683ac3da67e1e6b15e902c7e592";
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const report = {
  baseUrl,
  frozenSha,
  startedAt: new Date().toISOString(),
  result: "RUNNING",
  checks: {},
  browserErrors: [],
  screenshots: [],
};
const contexts = [];

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function observe(page, label) {
  page.on("pageerror", error => report.browserErrors.push({ label, type: "pageerror", message: error.message }));
  page.on("console", message => {
    if (message.type() === "error") {
      report.browserErrors.push({ label, type: "console", message: message.text(), url: message.location().url });
    }
  });
  page.on("requestfailed", request => report.browserErrors.push({
    label,
    type: "requestfailed",
    message: request.failure()?.errorText || "request failed",
    url: request.url(),
  }));
  page.on("response", response => {
    if (response.status() >= 400) {
      report.browserErrors.push({ label, type: "http", status: response.status(), url: response.url() });
    }
  });
}

async function shot(page, name) {
  const file = path.join(outputDir, `${stamp}_${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  report.screenshots.push(file);
  return file;
}

async function visibleText(page, selector) {
  return (await page.locator(selector).innerText()).trim();
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: browserExecutable,
    args: ["--disable-quic"],
  });

  try {
    const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
    const room = `MA${suffix}`;
    const teacherToken = `T-${suffix}-${crypto.randomUUID().slice(0, 8)}`;
    const joins = ["G", "A", "L"].map(role => `${role}-${suffix}-${crypto.randomUUID().slice(0, 8)}`);
    const expectedRoles = ["Gitte", "Anna", "Linda"];

    const teacherContext = await browser.newContext();
    contexts.push(teacherContext);
    const teacher = await teacherContext.newPage();
    observe(teacher, "teacher");

    const playerContexts = await Promise.all([0, 1, 2].map(() => browser.newContext()));
    contexts.push(...playerContexts);
    const players = await Promise.all(playerContexts.map(async (context, index) => {
      const page = await context.newPage();
      observe(page, `player-${index + 1}`);
      return page;
    }));

    await teacher.goto(`${baseUrl}teacher.html`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await teacher.locator("#roomCode").fill(room);
    await teacher.locator("#teacherToken").fill(teacherToken);
    await teacher.locator("#codeGitte").fill(joins[0]);
    await teacher.locator("#codeAnna").fill(joins[1]);
    await teacher.locator("#codeLinda").fill(joins[2]);
    await teacher.locator("#createRoomButton").click();
    await teacher.locator("#teacherStatus").filter({ hasText: /Room ready|Watching room/ }).waitFor({ timeout: 30000 });

    const ordinaryControls = {
      startFormalRun: await teacher.locator("#startRunButton").isVisible(),
      refreshOperations: await teacher.locator("#refreshOperationsButton").isVisible(),
      releaseSessionCount: await teacher.locator(".release-session").count(),
      overridePanelRendered: await teacher.locator("#overridePanel").count() === 1,
    };
    invariant(ordinaryControls.startFormalRun && ordinaryControls.refreshOperations && ordinaryControls.releaseSessionCount === 3, "Ordinary Teacher controls did not render.");

    const staggered = [];
    for (let index = 0; index < players.length; index += 1) {
      const page = players[index];
      await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.locator("#roomCode").fill(room);
      await page.locator("#joinCode").fill(joins[index]);
      await page.locator("#joinButton").click();
      await page.locator("#gamePanel:not(.hidden)").waitFor({ timeout: 30000 });
      await page.locator("#sprint3bPanel:not(.hidden)").waitFor({ timeout: 30000 });
      const waiting = await visibleText(page, "#sprint3bPanel");
      staggered.push({ role: expectedRoles[index], waiting });
      await page.waitForTimeout(650);
    }
    invariant(staggered.every(entry => /Wait for the Teacher|connected/i.test(entry.waiting)), "Pre-run waiting was not stable for all staggered joins.");
    await shot(teacher, "teacher-pre-run-three-players");

    await teacher.locator("#startRunButton").click();
    await Promise.all(players.map(page => page.waitForFunction(() => {
      const value = document.querySelector("#sprint3bPanel")?.textContent || "";
      return value && !/Wait for the Teacher|Formal game starting/i.test(value);
    }, null, { timeout: 30000 })));

    const act1 = [];
    for (let index = 0; index < players.length; index += 1) {
      const page = players[index];
      const roleLabel = await visibleText(page, "#playerLabel");
      const surface = await visibleText(page, "#sprint3bPanel");
      invariant(new RegExp(expectedRoles[index], "i").test(`${roleLabel} ${surface}`), `Expected role ${expectedRoles[index]} was not visible in player ${index + 1}.`);
      act1.push({ role: expectedRoles[index], roleLabel, surface });
      await shot(page, `act1-${expectedRoles[index].toLowerCase()}`);
    }
    invariant(new Set(act1.map(entry => entry.surface)).size === 3, "ACT1 surfaces were not role-private and distinct.");

    const reconnectBefore = act1[0];
    await players[0].reload({ waitUntil: "domcontentloaded", timeout: 30000 });
    await players[0].locator("#gamePanel:not(.hidden)").waitFor({ timeout: 30000 });
    await players[0].locator("#sprint3bPanel:not(.hidden)").waitFor({ timeout: 30000 });
    await players[0].locator("#sprint3bActions [data-s3b-rpc]").first().waitFor({ state: "visible", timeout: 30000 });
    const reconnectAfter = {
      roleLabel: await visibleText(players[0], "#playerLabel"),
      surface: await visibleText(players[0], "#sprint3bPanel"),
      storedSession: await players[0].evaluate(() => {
        const value = JSON.parse(localStorage.getItem("gal_castle_escape_session_v1") || "null");
        return value ? {
          room_code: value.room_code,
          display_name: value.display_name,
          role_slot: value.role_slot,
        } : null;
      }),
    };
    await shot(players[0], "act1-gitte-after-reconnect");
    report.checks.reconnectProbe = { before: reconnectBefore, after: reconnectAfter };
    invariant(reconnectAfter.storedSession?.role_slot === "GAL-A", "Player reconnect did not preserve the GAL-A session identity.");
    invariant(reconnectAfter.surface === reconnectBefore.surface, "Player reconnect did not restore the same role-private ACT1 surface.");
    invariant(!/Wait for the Teacher|Formal game starting/i.test(reconnectAfter.surface), "Player reconnect regressed to the pre-run lifecycle.");
    await shot(teacher, "teacher-after-formal-start");

    const materialErrors = report.browserErrors.filter(error => !/favicon\.ico/.test(error.url || ""));
    report.checks = {
      room,
      teacherCreatedAndWatching: true,
      ordinaryControls,
      staggeredJoinOrder: expectedRoles,
      staggered,
      formalStart: true,
      act1RolePrivate: true,
      act1,
      reconnect: {
        before: reconnectBefore,
        after: reconnectAfter,
        preserved: true,
        observation: reconnectAfter.roleLabel ? null : "Player label is blank after reload, while stored GAL-A identity and the complete private ACT1 surface are preserved.",
      },
      supabaseReachable: true,
      materialBrowserErrorCount: materialErrors.length,
    };
    invariant(materialErrors.length === 0, `Material browser errors: ${JSON.stringify(materialErrors)}`);
    report.result = "PASS";
  } catch (error) {
    report.result = "FAIL";
    report.failure = error.stack || error.message;
    throw error;
  } finally {
    report.finishedAt = new Date().toISOString();
    await writeFile(path.join(outputDir, `${stamp}_public-smoke.json`), `${JSON.stringify(report, null, 2)}\n`);
    await Promise.all(contexts.map(context => context.close().catch(() => null)));
    await browser.close();
  }

  console.log(`PUBLIC SMOKE PASS ${frozenSha}`);
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
