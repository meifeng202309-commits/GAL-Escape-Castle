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

function operationsFrame(label, runId) {
  return {
    active: true,
    run: { run_id: runId, run_mode: "normal", audit_private_debug_view: false },
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
  const olderStarted = deferred();
  const releaseOlder = deferred();
  let operationsCalls = 0;

  await page.route("**/rest/v1/rpc/**", async (route) => {
    const rpcName = new URL(route.request().url()).pathname.split("/").pop();
    if (rpcName === "s7_get_teacher_console") {
      operationsCalls += 1;
      const call = operationsCalls;
      if (call === 1) {
        olderStarted.resolve();
        await releaseOlder.promise;
      }
      const label = call === 1 ? "older" : "newer";
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(operationsFrame(label, `run-${label}`)) });
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

    await page.click("#refreshOperationsButton");
    await olderStarted.promise;
    await page.click("#refreshOperationsButton");
    await page.waitForFunction(() => document.querySelector("#operationsState")?.textContent.includes("location-newer"));
    const confirmedNewer = await page.locator("#operationsState").textContent();
    invariant(confirmedNewer.includes("location-newer"), "Newer operations frame did not commit first.");

    releaseOlder.resolve();
    await page.waitForFunction(() => document.querySelector("#operationsState")?.textContent.includes("location-older"));
    const finalContent = await page.locator("#operationsState").textContent();
    invariant(operationsCalls === 2, `Expected two overlapping operations calls, observed ${operationsCalls}.`);
    invariant(finalContent.includes("location-older"), "Older response did not overwrite the newer confirmed frame; race was not reproduced.");
    invariant(!finalContent.includes("location-newer"), "Newer frame unexpectedly remained after older response committed.");
    console.log("REPRODUCED: older Teacher operations response overwrote the newer confirmed frame.");
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

