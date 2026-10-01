import { chromium } from "playwright";
import { mkdir, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import process from "node:process";

const VERSION = "0.1.0";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      out[key] = true;
    } else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

function boolArg(value, fallback = false) {
  if (value === undefined) return fallback;
  if (value === true) return true;
  return !["0", "false", "no", "off"].includes(String(value).toLowerCase());
}

function numberArg(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function safeName(value) {
  return String(value || "participant")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "") || "participant";
}

function isoCompact() {
  return new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
}

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function stripUrl(raw) {
  try {
    const u = new URL(raw);
    return `${u.origin}${u.pathname}`;
  } catch {
    return String(raw || "");
  }
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function usage() {
  console.log(`
Visual State Timeline + Action/Control Event Log v${VERSION}

Launch mode:
  node src/observer.mjs --url <url> --label <name> --run-id <id> [--output ./runs]

Attach mode:
  node src/observer.mjs --cdp <http://127.0.0.1:9222> --label <name> --run-id <id> [--url <url>]

Options:
  --headless                  Launch Chromium headless (default: false)
  --browser-executable PATH   Optional Chromium/Chrome executable
  --width N                   Viewport width (default: 1440)
  --height N                  Viewport height (default: 1000)
  --settle-ms N               Post-action capture delay (default: 450)
  --action-window-ms N        Action correlation/finalization window (default: 2200)
  --mutation-debounce-ms N    Browser mutation debounce (default: 350)
  --pointer-attempt-ms N      Pointerdown-without-click threshold (default: 750)
  --page-index N              Page index in attach mode (default: 0)
`);
}

const args = parseArgs(process.argv.slice(2));
if (args.help || (!args.url && !args.cdp)) {
  usage();
  process.exit(args.help ? 0 : 2);
}

const label = safeName(args.label || "participant");
const runId = safeName(args["run-id"] || `VST-${isoCompact()}`);
const outputRoot = path.resolve(args.output || "./runs");
const participantDir = path.join(outputRoot, runId, label);
const snapshotsDir = path.join(participantDir, "snapshots");

const options = {
  headless: boolArg(args.headless, false),
  width: numberArg(args.width, 1440),
  height: numberArg(args.height, 1000),
  settleMs: numberArg(args["settle-ms"], 450),
  actionWindowMs: numberArg(args["action-window-ms"], 2200),
  mutationDebounceMs: numberArg(args["mutation-debounce-ms"], 350),
  pointerAttemptMs: numberArg(args["pointer-attempt-ms"], 750),
  pageIndex: numberArg(args["page-index"], 0),
};

await mkdir(snapshotsDir, { recursive: true });

const files = {
  manifest: path.join(participantDir, "manifest.json"),
  states: path.join(participantDir, "states.jsonl"),
  events: path.join(participantDir, "events.jsonl"),
  actions: path.join(participantDir, "actions.jsonl"),
  actionsCsv: path.join(participantDir, "actions.csv"),
  network: path.join(participantDir, "network.jsonl"),
  errors: path.join(participantDir, "errors.jsonl"),
};

async function appendJsonl(file, value) {
  await appendFile(file, JSON.stringify(value) + "\n", "utf8");
}

async function appendCsv(file, cells) {
  await appendFile(file, cells.map(csvCell).join(",") + "\n", "utf8");
}

await writeFile(
  files.actionsCsv,
  [
    "action_id",
    "timestamp",
    "label",
    "event_type",
    "target_tag",
    "target_id",
    "target_name",
    "target_type",
    "target_text",
    "before_state_id",
    "after_state_id",
    "network_ok_count",
    "network_error_count",
    "browser_error_count",
    "classification",
  ].map(csvCell).join(",") + "\n",
  "utf8",
);

const manifest = {
  observer: "visual-state-timeline",
  observer_version: VERSION,
  run_id: runId,
  label,
  mode: args.cdp ? "attach" : "launch",
  target_url: stripUrl(args.url || ""),
  cdp: args.cdp ? stripUrl(args.cdp) : null,
  started_at: new Date().toISOString(),
  ended_at: null,
  options,
  state_count: 0,
  action_count: 0,
  event_count: 0,
  notes: [
    "The observer records rendered behavior only and does not know target-app expected semantics.",
    "Form-field values are not intentionally written to textual logs.",
  ],
};
await writeFile(files.manifest, JSON.stringify(manifest, null, 2), "utf8");

let browser;
let context;
let page;
let ownsBrowser = false;
let closing = false;

if (args.cdp) {
  browser = await chromium.connectOverCDP(args.cdp);
  const contexts = browser.contexts();
  context = contexts[0] || await browser.newContext({
    viewport: { width: options.width, height: options.height },
  });
  const pages = context.pages();
  page = pages[options.pageIndex] || pages[0] || await context.newPage();
  if (args.url && (page.url() === "about:blank" || boolArg(args.navigate, false))) {
    await page.goto(args.url, { waitUntil: "domcontentloaded" });
  }
} else {
  const launchOptions = { headless: options.headless };
  if (args["browser-executable"]) launchOptions.executablePath = args["browser-executable"];
  browser = await chromium.launch(launchOptions);
  ownsBrowser = true;
  context = await browser.newContext({
    viewport: { width: options.width, height: options.height },
  });
  page = await context.newPage();
}

let serial = Promise.resolve();
function enqueue(work) {
  serial = serial.then(work).catch(async error => {
    await recordError("observer_internal", error?.message || String(error), {
      stack: error?.stack || null,
    });
  });
  return serial;
}

let stateSeq = 0;
let eventSeq = 0;
let actionSeq = 0;
let currentStateId = null;
let currentSemanticHash = null;
let currentScreenshotHash = null;
let activeAction = null;
let actionTimer = null;
let autoCaptureTimer = null;

function nextId(prefix, seq) {
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

async function recordEvent(type, details = {}) {
  eventSeq += 1;
  manifest.event_count = eventSeq;
  const row = {
    event_id: nextId("E", eventSeq),
    timestamp: new Date().toISOString(),
    label,
    type,
    ...details,
  };
  await appendJsonl(files.events, row);
  return row;
}

async function recordError(type, message, details = {}) {
  const row = {
    timestamp: new Date().toISOString(),
    label,
    type,
    message,
    ...details,
    action_id: activeAction?.action_id || null,
    state_id: currentStateId,
  };
  await appendJsonl(files.errors, row);
  if (activeAction) activeAction.browser_errors.push(row);
  return row;
}

async function semanticProjection() {
  return page.evaluate(() => {
    const visible = element => {
      if (!(element instanceof Element)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== "hidden"
        && style.display !== "none"
        && Number(style.opacity || "1") !== 0
        && rect.width > 0
        && rect.height > 0;
    };

    const clean = value => String(value || "").replace(/\s+/g, " ").trim();
    const normalizeTimers = value => clean(value)
      .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, "<TIME>")
      .replace(/\b\d+(?:\.\d+)?\s*(?:seconds?|secs?|minutes?|mins?)\b/gi, "<DURATION>")
      .replace(/\b(remaining|left)\s*[:=-]?\s*\d+\b/gi, "$1 <N>");

    const interactiveSelector = [
      "button",
      "a[href]",
      "input",
      "select",
      "textarea",
      "[role='button']",
      "[role='link']",
      "[role='checkbox']",
      "[role='radio']",
      "[role='menuitem']",
      "[tabindex]",
    ].join(",");

    const interactives = [...document.querySelectorAll(interactiveSelector)]
      .filter(visible)
      .slice(0, 250)
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || "",
        name: el.getAttribute("name") || "",
        type: el.getAttribute("type") || "",
        role: el.getAttribute("role") || "",
        text: normalizeTimers(el.innerText || el.getAttribute("aria-label") || el.getAttribute("title") || ""),
        disabled: Boolean(el.disabled || el.getAttribute("aria-disabled") === "true"),
        checked: "checked" in el ? Boolean(el.checked) : null,
        expanded: el.getAttribute("aria-expanded"),
        pressed: el.getAttribute("aria-pressed"),
        selected: el.getAttribute("aria-selected"),
      }));

    const landmarks = [...document.querySelectorAll(
      "main,section,article,dialog,[role='dialog'],[role='alert'],[role='status'],[aria-live]"
    )]
      .filter(visible)
      .slice(0, 120)
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || "",
        role: el.getAttribute("role") || "",
        class_name: typeof el.className === "string" ? el.className : "",
        text: normalizeTimers((el.innerText || "").slice(0, 1200)),
      }));

    const images = [...document.images]
      .filter(visible)
      .slice(0, 100)
      .map(img => {
        let src = img.currentSrc || img.src || "";
        try {
          const u = new URL(src, location.href);
          src = `${u.origin}${u.pathname}`;
        } catch {}
        return {
          id: img.id || "",
          alt: clean(img.alt),
          src,
        };
      });

    const bodyText = normalizeTimers((document.body?.innerText || "").slice(0, 40000));
    let url = location.href;
    try {
      const u = new URL(location.href);
      url = `${u.origin}${u.pathname}`;
    } catch {}

    return {
      url,
      title: document.title,
      body_class: typeof document.body?.className === "string" ? document.body.className : "",
      body_text: bodyText,
      interactives,
      landmarks,
      images,
      viewport: {
        width: innerWidth,
        height: innerHeight,
        scroll_width: document.documentElement.scrollWidth,
        scroll_height: document.documentElement.scrollHeight,
      },
    };
  });
}

async function captureState(trigger, { force = false } = {}) {
  if (closing || page.isClosed()) return currentStateId;

  let projection;
  try {
    projection = await semanticProjection();
  } catch (error) {
    await recordError("semantic_projection_failed", error.message || String(error));
    return currentStateId;
  }

  const semanticHash = sha256(JSON.stringify(projection));
  if (!force && currentStateId && semanticHash === currentSemanticHash) {
    return currentStateId;
  }

  let image;
  try {
    image = await page.screenshot({ fullPage: true, type: "png" });
  } catch (error) {
    await recordError("screenshot_failed", error.message || String(error), { trigger });
    return currentStateId;
  }

  const imageHash = sha256(image);
  if (currentStateId && imageHash === currentScreenshotHash) {
    currentSemanticHash = semanticHash;
    return currentStateId;
  }

  stateSeq += 1;
  const stateId = nextId("S", stateSeq);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${stateId}_${stamp}.png`;
  const relativeScreenshot = path.posix.join("snapshots", filename);

  await writeFile(path.join(snapshotsDir, filename), image);

  const previousStateId = currentStateId;
  const state = {
    state_id: stateId,
    timestamp: new Date().toISOString(),
    label,
    trigger,
    previous_state_id: previousStateId,
    screenshot: relativeScreenshot,
    screenshot_sha256: imageHash,
    semantic_sha256: semanticHash,
    url: projection.url,
    title: projection.title,
    viewport: projection.viewport,
    interactive_count: projection.interactives.length,
  };

  await appendJsonl(files.states, state);
  currentStateId = stateId;
  currentSemanticHash = semanticHash;
  currentScreenshotHash = imageHash;
  manifest.state_count = stateSeq;

  await recordEvent("state_change", {
    trigger,
    from_state_id: previousStateId,
    to_state_id: stateId,
  });

  if (activeAction) activeAction.last_observed_state_id = stateId;
  return stateId;
}

function scheduleAutoCapture(trigger, delay = options.mutationDebounceMs) {
  clearTimeout(autoCaptureTimer);
  autoCaptureTimer = setTimeout(() => {
    enqueue(() => captureState(trigger));
  }, delay);
}

function targetSummary(raw = {}) {
  return {
    tag: raw.tag || "",
    id: raw.id || "",
    name: raw.name || "",
    type: raw.input_type || raw.type || "",
    role: raw.role || "",
    text: String(raw.text || "").slice(0, 500),
    aria_label: String(raw.aria_label || "").slice(0, 500),
    title: String(raw.title || "").slice(0, 500),
    disabled: Boolean(raw.disabled),
    checked: raw.checked == null ? null : Boolean(raw.checked),
  };
}

function classifyAction(action) {
  const before = action.before_state_id;
  const after = action.after_state_id || action.last_observed_state_id || currentStateId;
  const visibleChange = Boolean(before && after && before !== after);
  const okCount = action.network.filter(x => x.status >= 200 && x.status < 400).length;
  const networkErrorCount = action.network.filter(x => x.status >= 400 || x.failed).length;
  const browserErrorCount = action.browser_errors.length;

  if (networkErrorCount > 0 || browserErrorCount > 0) return "ERROR_OBSERVED";
  if (visibleChange && okCount > 0) return "VISIBLE_CHANGE_NETWORK_OK";
  if (visibleChange) return "VISIBLE_CHANGE";
  if (okCount > 0) return "NETWORK_OK_NO_VISIBLE_CHANGE";
  return "NO_OBSERVABLE_CHANGE";
}

async function finalizeActiveAction(reason = "window_elapsed") {
  if (!activeAction) return;
  clearTimeout(actionTimer);
  actionTimer = null;

  await captureState("action_finalize");
  activeAction.after_state_id = currentStateId;
  activeAction.finished_at = new Date().toISOString();
  activeAction.finalize_reason = reason;
  activeAction.classification = classifyAction(activeAction);

  const networkOk = activeAction.network.filter(x => x.status >= 200 && x.status < 400).length;
  const networkError = activeAction.network.filter(x => x.status >= 400 || x.failed).length;

  await appendJsonl(files.actions, activeAction);
  await appendCsv(files.actionsCsv, [
    activeAction.action_id,
    activeAction.started_at,
    label,
    activeAction.event_type,
    activeAction.target.tag,
    activeAction.target.id,
    activeAction.target.name,
    activeAction.target.type,
    activeAction.target.text || activeAction.target.aria_label || activeAction.target.title,
    activeAction.before_state_id,
    activeAction.after_state_id,
    networkOk,
    networkError,
    activeAction.browser_errors.length,
    activeAction.classification,
  ]);

  await recordEvent("action_finished", {
    action_id: activeAction.action_id,
    before_state_id: activeAction.before_state_id,
    after_state_id: activeAction.after_state_id,
    classification: activeAction.classification,
    finalize_reason: reason,
  });

  activeAction = null;
  manifest.action_count = actionSeq;
}

async function beginAction(signal) {
  if (!currentStateId) await captureState("initial_before_action", { force: true });
  if (activeAction) await finalizeActiveAction("next_action_started");

  actionSeq += 1;
  const actionId = nextId("A", actionSeq);
  activeAction = {
    action_id: actionId,
    started_at: new Date().toISOString(),
    finished_at: null,
    label,
    event_type: signal.type,
    target: targetSummary(signal.target),
    before_state_id: currentStateId,
    after_state_id: null,
    last_observed_state_id: currentStateId,
    network: [],
    browser_errors: [],
    classification: null,
    finalize_reason: null,
  };

  await recordEvent("action_started", {
    action_id: actionId,
    event_type: signal.type,
    target: activeAction.target,
    before_state_id: currentStateId,
  });

  setTimeout(() => scheduleAutoCapture("post_action_settle", 0), options.settleMs);
  actionTimer = setTimeout(() => {
    enqueue(() => finalizeActiveAction("action_window_elapsed"));
  }, options.actionWindowMs);
}

async function handlePageSignal(signal) {
  if (!signal || typeof signal !== "object") return;

  if (signal.type === "click" || signal.type === "form_submit") {
    await beginAction(signal);
    return;
  }

  if (signal.type === "pointer_attempt_no_click") {
    await recordEvent("pointer_attempt_no_click", {
      target: targetSummary(signal.target),
      state_id: currentStateId,
    });
    return;
  }

  if (signal.type === "mutation") {
    scheduleAutoCapture("dom_mutation");
    return;
  }

  if (signal.type === "history" || signal.type === "hashchange" || signal.type === "popstate") {
    scheduleAutoCapture(signal.type, 50);
    return;
  }

  await recordEvent("browser_signal", { signal });
}

function browserProbe(config) {
  if (globalThis.__VST_PROBE_INSTALLED__) return;
  globalThis.__VST_PROBE_INSTALLED__ = true;

  const emit = payload => {
    const fn = globalThis[config.bindingName];
    if (typeof fn === "function") {
      Promise.resolve(fn({ ...payload, page_timestamp: new Date().toISOString() })).catch(() => {});
    }
  };

  const clean = value => String(value || "").replace(/\s+/g, " ").trim();

  const interactiveTarget = node => {
    if (!(node instanceof Element)) return null;
    return node.closest([
      "button",
      "a[href]",
      "input",
      "select",
      "textarea",
      "[role='button']",
      "[role='link']",
      "[role='checkbox']",
      "[role='radio']",
      "[role='menuitem']",
      "[tabindex]",
    ].join(","));
  };

  const describe = node => {
    const el = interactiveTarget(node) || node;
    if (!(el instanceof Element)) return {};
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || "",
      name: el.getAttribute("name") || "",
      input_type: el.getAttribute("type") || "",
      role: el.getAttribute("role") || "",
      text: clean(el.innerText || ""),
      aria_label: clean(el.getAttribute("aria-label") || ""),
      title: clean(el.getAttribute("title") || ""),
      disabled: Boolean(el.disabled || el.getAttribute("aria-disabled") === "true"),
      checked: "checked" in el ? Boolean(el.checked) : null,
    };
  };

  let pointerToken = 0;
  let lastClickAt = 0;

  document.addEventListener("pointerdown", event => {
    const target = interactiveTarget(event.target);
    if (!target) return;
    pointerToken += 1;
    const token = pointerToken;
    const targetInfo = describe(target);
    setTimeout(() => {
      if (pointerToken === token) {
        emit({ type: "pointer_attempt_no_click", target: targetInfo });
      }
    }, config.pointerAttemptMs);
  }, true);

  document.addEventListener("click", event => {
    const target = interactiveTarget(event.target);
    if (!target) return;
    pointerToken += 1;
    lastClickAt = performance.now();
    emit({ type: "click", target: describe(target) });
  }, true);

  document.addEventListener("submit", event => {
    pointerToken += 1;
    const submittedImmediatelyAfterClick = performance.now() - lastClickAt < 750;
    if (submittedImmediatelyAfterClick) return;
    const submitter = event.submitter;
    emit({
      type: "form_submit",
      target: describe(submitter || event.target),
    });
  }, true);

  let mutationTimer = null;
  const observer = new MutationObserver(() => {
    clearTimeout(mutationTimer);
    mutationTimer = setTimeout(() => emit({ type: "mutation" }), config.mutationDebounceMs);
  });

  const startObserver = () => {
    if (!document.documentElement) return;
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });
  };

  if (document.documentElement) startObserver();
  else document.addEventListener("DOMContentLoaded", startObserver, { once: true });

  const wrapHistory = method => {
    const original = history[method];
    if (typeof original !== "function") return;
    history[method] = function (...historyArgs) {
      const result = original.apply(this, historyArgs);
      emit({ type: "history", method });
      return result;
    };
  };

  wrapHistory("pushState");
  wrapHistory("replaceState");
  addEventListener("popstate", () => emit({ type: "popstate" }));
  addEventListener("hashchange", () => emit({ type: "hashchange" }));
}

const bindingName = `__vst_emit_${crypto.randomUUID().replaceAll("-", "")}`;
await page.exposeBinding(bindingName, async (_source, signal) => {
  enqueue(() => handlePageSignal(signal));
});
await page.addInitScript(browserProbe, {
  bindingName,
  mutationDebounceMs: options.mutationDebounceMs,
  pointerAttemptMs: options.pointerAttemptMs,
});

if (page.url() !== "about:blank") {
  await page.evaluate(browserProbe, {
    bindingName,
    mutationDebounceMs: options.mutationDebounceMs,
    pointerAttemptMs: options.pointerAttemptMs,
  }).catch(async error => {
    await recordError("probe_install_failed", error.message || String(error));
  });
}

page.on("response", response => {
  enqueue(async () => {
    const request = response.request();
    const row = {
      timestamp: new Date().toISOString(),
      label,
      method: request.method(),
      url: stripUrl(response.url()),
      status: response.status(),
      ok: response.status() >= 200 && response.status() < 400,
      action_id: activeAction?.action_id || null,
      state_id: currentStateId,
    };
    await appendJsonl(files.network, row);
    if (activeAction) activeAction.network.push(row);
  });
});

page.on("requestfailed", request => {
  enqueue(async () => {
    const row = {
      timestamp: new Date().toISOString(),
      label,
      method: request.method(),
      url: stripUrl(request.url()),
      status: null,
      ok: false,
      failed: true,
      failure: request.failure()?.errorText || "request failed",
      action_id: activeAction?.action_id || null,
      state_id: currentStateId,
    };
    await appendJsonl(files.network, row);
    if (activeAction) activeAction.network.push(row);
    await recordError("request_failed", row.failure, {
      method: row.method,
      url: row.url,
    });
  });
});

page.on("pageerror", error => {
  enqueue(() => recordError("pageerror", error.message || String(error), {
    stack: error.stack || null,
  }));
});

page.on("console", message => {
  if (message.type() !== "error") return;
  enqueue(() => recordError("console_error", message.text(), {
    url: stripUrl(message.location().url || ""),
    line_number: message.location().lineNumber,
    column_number: message.location().columnNumber,
  }));
});

page.on("framenavigated", frame => {
  if (frame !== page.mainFrame()) return;
  enqueue(async () => {
    await recordEvent("navigation", { url: stripUrl(frame.url()) });
    scheduleAutoCapture("navigation", 100);
  });
});

if (!args.cdp && args.url) {
  await page.goto(args.url, { waitUntil: "domcontentloaded" });
}

await captureState("observer_started", { force: true });
await recordEvent("observer_ready", {
  url: stripUrl(page.url()),
  mode: manifest.mode,
  state_id: currentStateId,
});

console.log(`Visual State Timeline observer ready.
Run:   ${runId}
Label: ${label}
Mode:  ${manifest.mode}
URL:   ${stripUrl(page.url())}
Output:${participantDir}

Interact with the observed browser normally. Press Ctrl+C to stop.`);

async function shutdown(reason) {
  if (closing) return;
  closing = true;
  clearTimeout(actionTimer);
  clearTimeout(autoCaptureTimer);

  try {
    closing = false;
    await enqueue(async () => {
      await finalizeActiveAction(reason);
      await captureState("observer_stopped");
      await recordEvent("observer_stopped", { reason, state_id: currentStateId });
    });
    await serial;
  } finally {
    closing = true;
  }

  manifest.ended_at = new Date().toISOString();
  manifest.state_count = stateSeq;
  manifest.action_count = actionSeq;
  manifest.event_count = eventSeq;
  manifest.final_state_id = currentStateId;
  await writeFile(files.manifest, JSON.stringify(manifest, null, 2), "utf8");

  if (ownsBrowser) {
    await browser.close().catch(() => {});
  }

  console.log(`Observer stopped. Evidence written to ${participantDir}`);
}

process.on("SIGINT", () => {
  shutdown("SIGINT").finally(() => process.exit(0));
});
process.on("SIGTERM", () => {
  shutdown("SIGTERM").finally(() => process.exit(0));
});

await new Promise(resolve => {
  if (page.isClosed()) resolve();
  page.on("close", resolve);
});

if (!closing) {
  await shutdown("page_closed");
}
