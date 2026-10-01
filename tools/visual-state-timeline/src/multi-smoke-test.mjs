import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const toolDir = path.resolve(new URL("..", import.meta.url).pathname);
const runId = "VST-MULTI-SMOKE";
const outputRoot = path.join(toolDir, "multi-smoke-runs");
const cdpPort = Number(process.env.VST_MULTI_SMOKE_CDP_PORT || 9334);
const cdpUrl = `http://127.0.0.1:${cdpPort}`;
const demoUrl = process.env.VST_SMOKE_DEMO_URL || "http://127.0.0.1:4174/demo.html";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitFor(condition, { timeoutMs = 15000, intervalMs = 100, label = "condition" } = {}) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const value = await condition();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await delay(intervalMs);
  }
  throw new Error(`Timed out waiting for ${label}${lastError ? `: ${lastError.message}` : ""}`);
}

async function readJsonl(file) {
  const raw = await readFile(file, "utf8");
  return raw.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
}

function waitForLine(child, matcher, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for observer output matching ${matcher}`));
    }, timeoutMs);

    const onData = chunk => {
      buffer += chunk.toString();
      process.stdout.write(chunk);
      if (matcher.test(buffer)) {
        cleanup();
        resolve(buffer);
      }
    };
    const onError = error => { cleanup(); reject(error); };
    const onExit = code => {
      cleanup();
      reject(new Error(`Observer exited early with code ${code}\n${buffer}`));
    };
    const cleanup = () => {
      clearTimeout(timeout);
      child.stdout.off("data", onData);
      child.off("error", onError);
      child.off("exit", onExit);
    };

    child.stdout.on("data", onData);
    child.stderr.on("data", chunk => process.stderr.write(chunk));
    child.on("error", onError);
    child.on("exit", onExit);
  });
}

async function stopChild(child, signal = "SIGINT", timeoutMs = 10000) {
  if (!child || child.exitCode != null) return;
  const exited = new Promise(resolve => child.once("exit", resolve));
  child.kill(signal);
  await Promise.race([
    exited,
    delay(timeoutMs).then(() => {
      if (child.exitCode == null) child.kill("SIGKILL");
    }),
  ]);
}

await rm(outputRoot, { recursive: true, force: true });
const userDataDir = await mkdtemp(path.join(os.tmpdir(), "vst-multi-chrome-"));

const chrome = spawn(chromium.executablePath(), [
  `--remote-debugging-port=${cdpPort}`,
  "--remote-debugging-address=127.0.0.1",
  `--user-data-dir=${userDataDir}`,
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "about:blank",
], { stdio: ["ignore", "pipe", "pipe"] });

let controller;
let observerA;
let observerB;

try {
  await waitFor(async () => {
    const response = await fetch(`${cdpUrl}/json/version`);
    return response.ok;
  }, { label: "Chromium CDP endpoint" });

  controller = await chromium.connectOverCDP(cdpUrl);
  const context = controller.contexts()[0];
  assert(context, "No Chromium context.");

  let pageA = context.pages()[0] || await context.newPage();
  await pageA.goto(`${demoUrl}?participant=PLAYER-A`, { waitUntil: "domcontentloaded" });
  const pageB = await context.newPage();
  await pageB.goto(`${demoUrl}?participant=PLAYER-B`, { waitUntil: "domcontentloaded" });

  const common = [
    "--cdp", cdpUrl,
    "--run-id", runId,
    "--output", outputRoot,
    "--settle-ms", "120",
    "--action-window-ms", "900",
    "--network-correlation-ms", "500",
    "--mutation-debounce-ms", "120",
  ];

  observerA = spawn(process.execPath, [
    path.join(toolDir, "src", "observer.mjs"),
    ...common,
    "--label", "PLAYER-A",
    "--page-url-contains", "participant=PLAYER-A",
  ], { cwd: toolDir, stdio: ["ignore", "pipe", "pipe"] });

  observerB = spawn(process.execPath, [
    path.join(toolDir, "src", "observer.mjs"),
    ...common,
    "--label", "PLAYER-B",
    "--page-url-contains", "participant=PLAYER-B",
  ], { cwd: toolDir, stdio: ["ignore", "pipe", "pipe"] });

  await Promise.all([
    waitForLine(observerA, /Visual State Timeline observer ready\./),
    waitForLine(observerB, /Visual State Timeline observer ready\./),
  ]);

  await pageA.locator("#increment").click();
  await delay(1200);

  await pageB.locator("#network").click();
  await delay(1200);

  await Promise.all([
    stopChild(observerA, "SIGINT"),
    stopChild(observerB, "SIGINT"),
  ]);
  observerA = null;
  observerB = null;

  const [actionsA, statesA, actionsB, statesB] = await Promise.all([
    readJsonl(path.join(outputRoot, runId, "PLAYER-A", "actions.jsonl")),
    readJsonl(path.join(outputRoot, runId, "PLAYER-A", "states.jsonl")),
    readJsonl(path.join(outputRoot, runId, "PLAYER-B", "actions.jsonl")),
    readJsonl(path.join(outputRoot, runId, "PLAYER-B", "states.jsonl")),
  ]);

  assert.equal(actionsA.length, 1, `PLAYER-A expected 1 action, got ${actionsA.length}`);
  assert.equal(actionsB.length, 1, `PLAYER-B expected 1 action, got ${actionsB.length}`);
  assert.equal(actionsA[0].target.id, "increment", "PLAYER-A captured the wrong control.");
  assert.equal(actionsB[0].target.id, "network", "PLAYER-B captured the wrong control.");
  assert.notEqual(actionsA[0].before_state_id, actionsA[0].after_state_id,
    "PLAYER-A visible action should change state.");
  assert.equal(actionsB[0].before_state_id, actionsB[0].after_state_id,
    "PLAYER-B network-only action should preserve visual state.");
  assert.equal(actionsB[0].classification, "CORRELATED_NETWORK_OK_NO_VISIBLE_CHANGE",
    "PLAYER-B network-only classification mismatch.");
  assert(statesA.length >= 2, "PLAYER-A should have initial + changed state.");
  assert(statesB.length === 1, `PLAYER-B should keep one visual state, got ${statesB.length}`);

  console.log(JSON.stringify({
    ok: true,
    run_id: runId,
    participants: {
      "PLAYER-A": {
        states: statesA.length,
        actions: actionsA.map(a => ({
          id: a.action_id,
          target: a.target.id,
          before: a.before_state_id,
          after: a.after_state_id,
          classification: a.classification,
        })),
      },
      "PLAYER-B": {
        states: statesB.length,
        actions: actionsB.map(a => ({
          id: a.action_id,
          target: a.target.id,
          before: a.before_state_id,
          after: a.after_state_id,
          classification: a.classification,
        })),
      },
    },
  }, null, 2));
} finally {
  if (controller) await controller.close().catch(() => {});
  if (observerA) await stopChild(observerA, "SIGINT").catch(() => {});
  if (observerB) await stopChild(observerB, "SIGINT").catch(() => {});
  await stopChild(chrome, "SIGTERM").catch(() => {});
  await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
}
