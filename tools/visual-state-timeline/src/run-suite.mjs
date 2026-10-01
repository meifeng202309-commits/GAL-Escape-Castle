import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) out[key] = true;
    else { out[key] = next; i += 1; }
  }
  return out;
}

function safeName(value) {
  return String(value || "run")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "") || "run";
}

function waitForLine(child, matcher, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for observer readiness: ${matcher}`));
    }, timeoutMs);

    const onData = chunk => {
      const text = chunk.toString();
      buffer += text;
      process.stdout.write(text);
      if (matcher.test(buffer)) {
        cleanup();
        resolve(buffer);
      }
    };

    const onErrorData = chunk => process.stderr.write(chunk);
    const onError = error => {
      cleanup();
      reject(error);
    };
    const onExit = code => {
      cleanup();
      reject(new Error(`Observer exited before readiness with code ${code}\n${buffer}`));
    };

    const cleanup = () => {
      clearTimeout(timeout);
      child.stdout.off("data", onData);
      child.stderr.off("data", onErrorData);
      child.off("error", onError);
      child.off("exit", onExit);
    };

    child.stdout.on("data", onData);
    child.stderr.on("data", onErrorData);
    child.on("error", onError);
    child.on("exit", onExit);
  });
}

function normalizeParticipant(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Each participant must be an object.");
  if (!raw.label) throw new Error("Each participant requires label.");
  if (!raw.cdp) throw new Error(`Participant ${raw.label} requires cdp.`);

  return {
    label: String(raw.label),
    cdp: String(raw.cdp),
    url: raw.url ? String(raw.url) : null,
    navigate: Boolean(raw.navigate),
    page_url_contains: raw.page_url_contains ? String(raw.page_url_contains) : null,
    page_index: Number.isInteger(raw.page_index) ? raw.page_index : null,
    width: Number.isFinite(raw.width) ? raw.width : null,
    height: Number.isFinite(raw.height) ? raw.height : null,
  };
}

async function stopChild(child, signal = "SIGINT", timeoutMs = 10000) {
  if (!child || child.exitCode != null) return;
  const exited = new Promise(resolve => child.once("exit", resolve));
  child.kill(signal);
  await Promise.race([
    exited,
    new Promise(resolve => setTimeout(() => {
      if (child.exitCode == null) child.kill("SIGKILL");
      resolve();
    }, timeoutMs)),
  ]);
}

const args = parseArgs(process.argv.slice(2));
if (!args.config) {
  console.error("Usage: node src/run-suite.mjs --config <suite.json>");
  process.exit(2);
}

const configPath = path.resolve(args.config);
const config = JSON.parse(await readFile(configPath, "utf8"));
const runId = safeName(config.run_id);
if (!config.run_id) throw new Error("Config requires run_id.");

const participants = (config.participants || []).map(normalizeParticipant);
if (!participants.length) throw new Error("Config requires at least one participant.");

const labels = participants.map(p => safeName(p.label));
if (new Set(labels).size !== labels.length) throw new Error("Participant labels must be unique after filename normalization.");

const toolDir = path.resolve(new URL("..", import.meta.url).pathname);
const outputRoot = path.resolve(config.output || "./runs");
const runDir = path.join(outputRoot, runId);
await mkdir(runDir, { recursive: true });

const shared = {
  settle_ms: config.settle_ms ?? 450,
  action_window_ms: config.action_window_ms ?? 2200,
  network_correlation_ms: config.network_correlation_ms ?? 500,
  mutation_debounce_ms: config.mutation_debounce_ms ?? 350,
  pointer_attempt_ms: config.pointer_attempt_ms ?? 750,
};

const suiteManifest = {
  suite: "visual-state-timeline",
  run_id: runId,
  started_at: new Date().toISOString(),
  ended_at: null,
  config_path: configPath,
  output: outputRoot,
  participants: participants.map((p, index) => ({
    index,
    label: p.label,
    cdp: p.cdp,
    url: p.url,
    page_url_contains: p.page_url_contains,
    page_index: p.page_index,
    status: "starting",
    observer_pid: null,
    exit_code: null,
  })),
  shared,
};

const suiteManifestPath = path.join(runDir, "suite-manifest.json");
await writeFile(suiteManifestPath, JSON.stringify(suiteManifest, null, 2), "utf8");

const children = [];
let closing = false;

async function persistManifest() {
  await writeFile(suiteManifestPath, JSON.stringify(suiteManifest, null, 2), "utf8");
}

try {
  for (let index = 0; index < participants.length; index += 1) {
    const p = participants[index];
    const observerArgs = [
      path.join(toolDir, "src", "observer.mjs"),
      "--cdp", p.cdp,
      "--label", p.label,
      "--run-id", runId,
      "--output", outputRoot,
      "--settle-ms", String(shared.settle_ms),
      "--action-window-ms", String(shared.action_window_ms),
      "--network-correlation-ms", String(shared.network_correlation_ms),
      "--mutation-debounce-ms", String(shared.mutation_debounce_ms),
      "--pointer-attempt-ms", String(shared.pointer_attempt_ms),
    ];

    if (p.url) observerArgs.push("--url", p.url);
    if (p.navigate) observerArgs.push("--navigate");
    if (p.page_url_contains) observerArgs.push("--page-url-contains", p.page_url_contains);
    if (p.page_index != null) observerArgs.push("--page-index", String(p.page_index));
    if (p.width != null) observerArgs.push("--width", String(p.width));
    if (p.height != null) observerArgs.push("--height", String(p.height));

    const child = spawn(process.execPath, observerArgs, {
      cwd: toolDir,
      stdio: ["ignore", "pipe", "pipe"],
    });

    children.push(child);
    suiteManifest.participants[index].observer_pid = child.pid;
    suiteManifest.participants[index].status = "waiting_ready";
    await persistManifest();

    child.on("exit", code => {
      suiteManifest.participants[index].exit_code = code;
      if (!closing && suiteManifest.participants[index].status === "ready") {
        suiteManifest.participants[index].status = "unexpected_exit";
        persistManifest().catch(() => {});
      }
    });

    await waitForLine(child, /Visual State Timeline observer ready\./);
    suiteManifest.participants[index].status = "ready";
    await persistManifest();
  }

  console.log(`
Observer suite ready.
Run: ${runId}
Participants: ${participants.map(p => p.label).join(", ")}
Output: ${runDir}

The suite does not control the participants. It only observes their already-exposed browser sessions.
Press Ctrl+C when the experiment is finished.
`);

  await new Promise(resolve => {
    const stop = () => resolve();
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  });
} finally {
  closing = true;

  await Promise.all(children.map(child => stopChild(child, "SIGINT").catch(() => {})));

  for (let index = 0; index < suiteManifest.participants.length; index += 1) {
    const item = suiteManifest.participants[index];
    if (item.status !== "unexpected_exit") item.status = "stopped";
    item.exit_code = children[index]?.exitCode ?? item.exit_code;
  }

  suiteManifest.ended_at = new Date().toISOString();
  await persistManifest();

  const report = spawn(process.execPath, [
    path.join(toolDir, "src", "render-report.mjs"),
    "--run-dir", runDir,
  ], {
    cwd: toolDir,
    stdio: "inherit",
  });

  await new Promise(resolve => report.once("exit", resolve));

  console.log(`Suite stopped. Evidence and report: ${runDir}`);
}
