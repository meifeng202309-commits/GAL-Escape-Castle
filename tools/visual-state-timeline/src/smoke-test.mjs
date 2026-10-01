import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const toolDir = path.resolve(new URL("..", import.meta.url).pathname);
const runId = "VST-SMOKE";
const label = "DEMO";
const outputRoot = path.join(toolDir, "smoke-runs");
const participantDir = path.join(outputRoot, runId, label);
const cdpPort = Number(process.env.VST_SMOKE_CDP_PORT || 9333);
const cdpUrl = `http://127.0.0.1:${cdpPort}`;
const demoUrl = process.env.VST_SMOKE_DEMO_URL || "http://127.0.0.1:4174/demo.html";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
    const onError = error => {
      cleanup();
      reject(error);
    };
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
const userDataDir = await mkdtemp(path.join(os.tmpdir(), "vst-chrome-"));

const chromeArgs = [
  `--remote-debugging-port=${cdpPort}`,
  "--remote-debugging-address=127.0.0.1",
  `--user-data-dir=${userDataDir}`,
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "about:blank",
];

const chrome = spawn(chromium.executablePath(), chromeArgs, {
  stdio: ["ignore", "pipe", "pipe"],
});

chrome.stderr.on("data", chunk => {
  const text = chunk.toString();
  if (/ERROR|FATAL/i.test(text)) process.stderr.write(text);
});

let observer;
let controller;

try {
  await waitFor(async () => {
    const response = await fetch(`${cdpUrl}/json/version`);
    return response.ok;
  }, { label: "Chromium CDP endpoint" });

  observer = spawn(process.execPath, [
    path.join(toolDir, "src", "observer.mjs"),
    "--cdp", cdpUrl,
    "--url", demoUrl,
    "--navigate",
    "--label", label,
    "--run-id", runId,
    "--output", outputRoot,
    "--settle-ms", "120",
    "--action-window-ms", "900",
    "--mutation-debounce-ms", "120",
    "--pointer-attempt-ms", "250",
  ], {
    cwd: toolDir,
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForLine(observer, /Visual State Timeline observer ready\./);

  controller = await chromium.connectOverCDP(cdpUrl);
  const context = controller.contexts()[0];
  assert(context, "CDP controller did not find a browser context.");
  const page = context.pages().find(p => p.url().includes("demo.html")) || context.pages()[0];
  assert(page, "CDP controller did not find the observed page.");

  await page.locator("#increment").click();
  await delay(1100);

  await page.locator("#noop").click();
  await delay(1100);

  await page.locator("#delayed").click();
  await delay(1800);

  await page.locator("#network").click();
  await delay(1100);

  await page.locator("#error").click();
  await delay(1100);

  await stopChild(observer, "SIGINT");
  observer = null;

  const [states, actions, events, errors, snapshotFiles] = await Promise.all([
    readJsonl(path.join(participantDir, "states.jsonl")),
    readJsonl(path.join(participantDir, "actions.jsonl")),
    readJsonl(path.join(participantDir, "events.jsonl")),
    readJsonl(path.join(participantDir, "errors.jsonl")),
    readdir(path.join(participantDir, "snapshots")),
  ]);

  assert.equal(actions.length, 5, `Expected 5 actions, got ${actions.length}`);
  assert(states.length >= 4, `Expected at least 4 distinct states, got ${states.length}`);
  assert.equal(snapshotFiles.filter(x => x.endsWith(".png")).length, states.length,
    "Snapshot file count must equal persisted state count.");

  const [increment, noop, delayed, networkOnly, errorAction] = actions;

  assert.notEqual(increment.before_state_id, increment.after_state_id,
    "Visible counter action should create a new visual state.");

  assert.equal(noop.before_state_id, increment.after_state_id,
    "State inheritance failed: increment.after should equal noop.before.");
  assert.equal(noop.before_state_id, noop.after_state_id,
    "No-op action should reuse the same state ID and should not duplicate a screenshot.");

  assert.notEqual(delayed.before_state_id, delayed.after_state_id,
    "Delayed action should first create the immediate waiting state.");

  const delayedIndex = states.findIndex(s => s.state_id === delayed.after_state_id);
  assert(delayedIndex >= 0, "Delayed action after-state is missing from state timeline.");
  assert(states.length > delayedIndex + 1,
    "Expected an automatic state after delayed action finalization.");

  assert.equal(networkOnly.before_state_id, networkOnly.after_state_id,
    "Network-only action should reuse the same visual state.");
  assert.equal(networkOnly.classification, "NETWORK_OK_NO_VISIBLE_CHANGE",
    `Expected NETWORK_OK_NO_VISIBLE_CHANGE, got ${networkOnly.classification}`);
  assert(networkOnly.network.some(n => n.ok && /\/ping\.txt$/.test(n.url)),
    "Network-only action did not correlate the successful ping.txt response.");

  assert.equal(errorAction.classification, "ERROR_OBSERVED",
    `Expected ERROR_OBSERVED, got ${errorAction.classification}`);
  assert(errors.some(e => /Deliberate observer demo error/.test(e.message || "")),
    "Deliberate page error was not captured.");

  const autoStateEvents = events.filter(e =>
    e.type === "state_change"
    && ["dom_mutation", "navigation"].includes(e.trigger)
  );
  assert(autoStateEvents.length > 0,
    "Expected at least one observer-driven automatic state capture.");

  console.log(JSON.stringify({
    ok: true,
    states: states.length,
    actions: actions.map(a => ({
      id: a.action_id,
      target: a.target?.id || a.target?.text,
      before: a.before_state_id,
      after: a.after_state_id,
      classification: a.classification,
    })),
    errors: errors.length,
    automatic_state_events: autoStateEvents.length,
    screenshots: snapshotFiles.filter(x => x.endsWith(".png")).length,
  }, null, 2));
} finally {
  if (controller) await controller.close().catch(() => {});
  if (observer) await stopChild(observer, "SIGINT").catch(() => {});
  await stopChild(chrome, "SIGTERM").catch(() => {});
  await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
}
