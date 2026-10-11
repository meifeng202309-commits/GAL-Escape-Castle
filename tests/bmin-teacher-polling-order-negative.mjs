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
  return "application/octet-stream";
}

async function startServer() {
  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://127.0.0.1");
      const relative = decodeURIComponent(url.pathname === "/" ? "/teacher.html" : url.pathname).replace(/^\/+/, "");
      const file = path.resolve(root, relative);
      invariant(file === root || file.startsWith(`${root}${path.sep}`), "Path escaped repository root.");
      response.writeHead(200, { "Content-Type": mime(file), "Cache-Control": "no-store" });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Not found");
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}/teacher.html` };
}

function operationsFrame(label) {
  return {
    active: true,
    run: { run_id: "run-same", run_mode: "normal", audit_private_debug_view: false },
    current: { act_no: 7, scene_id: `scene-${label}`, phase_key: `phase-${label}`, step_key: label },
    players: [{
      display_name: "Gitte",
      online: true,
      submitted: false,
      player_location: `location-${label}`,
      locked_choice_value: null,
      locked_choice_state: "WAITING",
    }],
    discussion: { messages: [] },
    pockets: [], group_items: [], teacher_interventions: [], override_history: [], phase_behavior_validity: [],
    audio: { recent: [] }, export: { export_ready: false, filename_preview: `${label}.json` },
  };
}

async function main() {
  const { server, baseUrl } = await startServer();
  const browser = await chromium.launch({ headless: true, executablePath: browserExecutable });
  const context = await browser.newContext();
  const page = await context.newPage();
  let scenario;

  function setScenario(first, second = null) {
    scenario = { calls: 0, first, second };
  }

  await page.route("**/rest/v1/rpc/**", async (route) => {
    const rpcName = new URL(route.request().url()).pathname.split("/").pop();
    if (rpcName === "s7_get_teacher_console") {
      scenario.calls += 1;
      const plan = scenario.calls === 1 ? scenario.first : scenario.second;
      invariant(plan, `Unexpected operations call ${scenario.calls}.`);
      plan.started?.resolve();
      if (plan.release) await plan.release.promise;
      if (plan.error) {
        await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ message: plan.error }) });
        return;
      }
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(operationsFrame(plan.label)) });
      return;
    }
    if (rpcName === "s8_get_finalization_state") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ export_ready: false }) });
      return;
    }
    await route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ message: `Unexpected RPC ${rpcName}` }) });
  });

  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.fill("#roomCode", "ORDER1");
    await page.fill("#teacherToken", "TEST-TOKEN");

    const olderStarted = deferred();
    const releaseOlder = deferred();
    setScenario({ label: "older", started: olderStarted, release: releaseOlder }, { label: "newer" });
    await page.click("#refreshOperationsButton");
    await olderStarted.promise;
    await page.click("#refreshOperationsButton");
    await page.waitForFunction(() => document.querySelector("#operationsState")?.textContent.includes("location-newer"));
    const confirmedNewer = await page.locator("#operationsState").textContent();
    invariant(confirmedNewer.includes("location-newer"), "Newer operations frame did not commit first.");

    releaseOlder.resolve();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const finalContent = await page.locator("#operationsState").textContent();
    invariant(scenario.calls === 2, `Expected two overlapping operations calls, observed ${scenario.calls}.`);
    invariant(finalContent.includes("location-newer"), "Older same-run success overwrote the newer confirmed frame.");
    invariant(!finalContent.includes("location-older"), "Stale same-run success remained authoritative.");
    invariant(await page.locator("#operationsStatus").textContent() === "Live operations refreshed.", "Stale success changed operations status.");

    const staleFailureStarted = deferred();
    const releaseStaleFailure = deferred();
    setScenario({ error: "stale failure", started: staleFailureStarted, release: releaseStaleFailure }, { label: "success-after-stale" });
    await page.click("#refreshOperationsButton");
    await staleFailureStarted.promise;
    await page.click("#refreshOperationsButton");
    await page.waitForFunction(() => document.querySelector("#operationsState")?.textContent.includes("location-success-after-stale"));
    releaseStaleFailure.resolve();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const afterStaleFailure = await page.locator("#operationsState").textContent();
    invariant(afterStaleFailure.includes("location-success-after-stale"), "Stale failure replaced newer success content.");
    invariant(await page.locator("#operationsBadge").textContent() !== "Unavailable", "Stale failure replaced newer success badge.");
    invariant(await page.locator("#operationsStatus").textContent() === "Live operations refreshed.", "Stale failure replaced newer success status.");

    setScenario({ error: "latest failure" });
    await page.click("#refreshOperationsButton");
    await page.waitForFunction(() => document.querySelector("#operationsState")?.textContent.includes("latest failure"));
    invariant(await page.locator("#operationsBadge").textContent() === "Unavailable", "Latest failure was not exposed in the badge.");
    invariant(await page.locator("#operationsStatus").textContent() === "Operations refresh failed.", "Latest failure status was not committed.");
    console.log("PASS: Teacher operations generation guard rejects stale same-run success and failure while preserving latest failure.");
  } finally {
    await context.close();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(`FAIL ${error.stack || error.message}`);
  process.exitCode = 1;
});
