import { createRequire } from "node:module";
import { performance } from "node:perf_hooks";
import { writeFile, mkdir } from "node:fs/promises";
import { createCrossClientTrace } from "./helpers/trial8-cross-client-trace-candidate.mjs";

// Isolated four-page projection model. It deliberately does not import or edit product source.
const output = "docs/reports/remediation/ui/trial8-b6";
await mkdir(output, { recursive: true });
const { chromium } = createRequire(import.meta.url)("playwright");
const browser = await chromium.launch({ headless: true, executablePath: process.env.GAL_A1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const traces = [], results = [];
const roles = ["GAL-A", "GAL-B", "GAL-C", "Teacher"];
const assert = (ok, message) => { if (!ok) throw Error(message); };
const size = value => Buffer.byteLength(JSON.stringify(value));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const now = () => ({ utc: new Date().toISOString(), monotonic_ms: +performance.now().toFixed(3) });
try {
  for (const family of ["ACT9", "ACT10", "ACT2", "ACT6"]) for (const mode of ["full", "target", "consolidated"]) for (const delay of [0, 100, 400]) for (let rep = 1; rep <= 3; rep++) {
    const id = `${family}_${mode}_${delay}_${rep}`, pages = [], start = performance.now();
    const authority = { version: 1, gate: false, votes: new Set(), session: "S1", phase: family, private: { "GAL-A": "A-secret", "GAL-B": "B-secret", "GAL-C": "C-secret" } };
    const counters = { requests: 0, bytes: 0, work: 0 };
    const event = (role, name, extra = {}) => traces.push({ id, family, mode, role, event: name, ...now(), elapsed_ms: +(performance.now() - start).toFixed(3), version: authority.version, ...extra });
    const project = (role, kind) => {
      if (kind !== "privacy_assertion") { counters.requests++; counters.work += kind === "consolidated" ? 8 : 1; }
      const visible = authority.gate && authority.votes.size === 3;
      const state = { version: authority.version, session: authority.session, phase: visible ? family : "waiting", ready: visible, own_private: role === "Teacher" ? null : authority.private[role], vote_count: authority.votes.size };
      if (kind === "full") state.irrelevant = "x".repeat(5000);
      if (kind === "target") delete state.vote_count;
      if (kind !== "privacy_assertion") counters.bytes += size(state);
      return state;
    };
    for (const role of roles) {
      const page = await browser.newPage();
      await page.setContent(`<button id="action">Action</button><div id="next">waiting</div>`);
      await page.evaluate(() => { window.__trace = []; window.__generation = 0; window.__session = "S1"; });
      pages.push({ role, page });
    }
    const player = pages[0].page;
    event("GAL-A", "click_handler");
    await player.click("#action");
    event("GAL-A", "mutation_request_start", { request_id: `${id}:mutation` });
    authority.gate = true; authority.votes = new Set(["GAL-A", "GAL-B", "GAL-C"]); authority.version++;
    event("Server", "teacher_gate_and_barrier_commit", { request_id: `${id}:mutation` });
    event("GAL-A", "mutation_ack", { request_id: `${id}:mutation` });
    const read = async ({ role, page }, kind, extraDelay = 0, allowCommit = true) => {
      const generation = await page.evaluate(() => ++window.__generation);
      event(role, "read_begin", { kind, generation });
      await sleep(delay + extraDelay);
      const state = project(role, kind);
      event(role, "read_end", { kind, generation, bytes: size(state) });
      const committed = await page.evaluate(({ state, generation, allowCommit }) => {
        if (!allowCommit || generation !== window.__generation || state.session !== window.__session) return false;
        document.querySelector("#next").textContent = state.ready ? `${state.phase}:${state.version}` : "waiting";
        return true;
      }, { state, generation, allowCommit });
      event(role, committed ? "frame_committed" : "read_discarded", { kind, generation });
      if (committed) event(role, "dom_visible", { kind, generation, text: await page.locator("#next").textContent() });
      return { state, committed };
    };
    const kinds = mode === "full" ? ["phase", "scene", "inventory", "discussion", "pocket", "teacher", "history", "full"] : mode === "target" ? ["target"] : ["consolidated"];
    const readStarted = performance.now();
    let firstValidated = null;
    for (const kind of kinds) {
      const result = await read(pages[0], kind, 0, kind === kinds.at(-1));
      if (firstValidated === null && result.state.ready && result.state.version === authority.version) firstValidated = +(performance.now() - start).toFixed(3);
    }
    const safeVisible = +(performance.now() - start).toFixed(3);
    const others = await Promise.all(pages.slice(1).map(item => read(item, mode === "full" ? "full" : mode === "target" ? "target" : "consolidated")));
    assert(others.every(x => x.state.ready), `${id}: post-barrier role visibility`);
    for (const { role, page } of pages) {
      const state = project(role, "privacy_assertion");
      assert(!JSON.stringify(state).includes("B-secret") || role === "GAL-B", `${id}: B private leak`);
      assert(!JSON.stringify(state).includes("C-secret") || role === "GAL-C", `${id}: C private leak`);
      assert(!JSON.stringify(state).includes("A-secret") || role === "GAL-A", `${id}: A private leak`);
      await page.close();
    }
    results.push({ id, family, mode, delay, rep, first_validated_ms: firstValidated, safe_visible_ms: safeVisible, read_elapsed_ms: +(performance.now() - readStarted).toFixed(3), ...counters });
  }
  // Faults and guards are separate from happy-path medians.
  for (const fault of ["stalled", "failed", "stale_generation", "session_switch", "gate_closed"]) {
    const id = `fault_${fault}`, page = await browser.newPage();
    await page.setContent(`<div id="next">waiting</div>`);
    await page.evaluate(() => { window.__generation = 1; window.__session = "S1"; });
    const started = performance.now();
    traces.push({ id, role: "GAL-A", event: "read_begin", ...now() });
    if (fault === "stalled") await sleep(300);
    if (fault === "failed") traces.push({ id, role: "GAL-A", event: "read_error", category: "HTTP_503", ...now() });
    else {
      if (fault === "stale_generation") await page.evaluate(() => ++window.__generation);
      if (fault === "session_switch") await page.evaluate(() => { window.__session = "S2"; ++window.__generation; });
      const payload = { generation: 1, session: "S1", ready: fault !== "gate_closed" };
      const committed = await page.evaluate(({ generation, session, ready }) => {
        if (generation !== window.__generation || session !== window.__session || !ready) return false;
        document.querySelector("#next").textContent = "ACT9"; return true;
      }, payload);
      assert(committed === (fault === "stalled"), `${id}: guard result`);
      traces.push({ id, role: "GAL-A", event: committed ? "dom_visible" : "read_discarded", ...now() });
    }
    assert((await page.locator("#next").textContent()) === (fault === "stalled" ? "ACT9" : "waiting"), `${id}: unsafe DOM`);
    results.push({ id, fault, elapsed_ms: +(performance.now() - started).toFixed(3), safe: true });
    await page.close();
  }
  // Browser-side request-generation gap: a poll coordinator awaits a read with no timeout.
  {
    const page = await browser.newPage();
    await page.setContent("<div>poll gap fixture</div>");
    await page.evaluate(() => {
      window.__pollStarts = [];
      window.__resolveRead = null;
      let inFlight = false, queued = false;
      const read = () => new Promise(resolve => { window.__pollStarts.push(performance.now()); window.__resolveRead = resolve; });
      const refresh = async () => {
        if (inFlight) { queued = true; return; }
        inFlight = true;
        try { await read(); } finally { inFlight = false; if (queued) { queued = false; void refresh(); } }
      };
      void refresh();
      window.__interval = setInterval(() => void refresh(), 40);
    });
    await sleep(400);
    const startsBefore = await page.evaluate(() => window.__pollStarts.length);
    assert(startsBefore === 1, "unresolved no-timeout read should suppress new outgoing requests");
    traces.push({ id: "poll_no_timeout", role: "GAL-A", event: "request_generation_gap", duration_ms: 400, outgoing_requests: startsBefore, queued: true, ...now() });
    await page.evaluate(() => window.__resolveRead());
    await sleep(100);
    const startsAfter = await page.evaluate(() => { clearInterval(window.__interval); return window.__pollStarts.length; });
    assert(startsAfter >= 2, "queued read should resume after resolution");
    results.push({ id: "poll_no_timeout", fault: "no_timeout", before_resolution_requests: startsBefore, after_resolution_requests: startsAfter, gap_ms: 400, safe: true });
    await page.close();
  }
  // Repeated NTP-style four-timestamp calibration; uncertainty is half RTT after server processing.
  const calibration = [];
  for (const role of roles) for (let i = 0; i < 5; i++) {
    const outbound = 5 + i * 3, inbound = 9 + (4 - i) * 2, serverProcessing = 2;
    const t0 = 100000 + i * 100, serverOffset = role === "Teacher" ? 12 : role === "GAL-A" ? -17 : role === "GAL-B" ? 31 : -9;
    const serverReceive = t0 + outbound + serverOffset;
    const serverSend = serverReceive + serverProcessing;
    const t3 = t0 + outbound + serverProcessing + inbound;
    const estimate = ((serverReceive - t0) + (serverSend - t3)) / 2;
    const uncertainty = (t3 - t0 - serverProcessing) / 2;
    calibration.push({ role, sample: i + 1, t0, serverReceive, serverSend, t3, offset_estimate_ms: estimate, uncertainty_ms: uncertainty, true_offset_ms: serverOffset, within_bound: Math.abs(estimate - serverOffset) <= uncertainty });
  }
  assert(calibration.every(x => x.within_bound), "clock offset uncertainty bound");
  const disabled = createCrossClientTrace({ enabled: false, role: "GAL-A", sessionId: "fixture" });
  disabled.record("click", { message_body: "never store" });
  assert(disabled.snapshot().rows.length === 0, "disabled trace must stay empty");
  const candidate = createCrossClientTrace({ enabled: true, capacity: 3, role: "GAL-A", sessionId: "fixture" });
  const overheadStart = performance.now();
  for (let i = 0; i < 10000; i++) candidate.record("read_end", { request_id: `r${i}`, state_version: i, message_body: "private-body", session_token: "private-token" });
  const traceOverheadMs = +(performance.now() - overheadStart).toFixed(3);
  const candidateSnapshot = candidate.snapshot();
  assert(candidateSnapshot.rows.length === 3 && candidateSnapshot.dropped === 9997, "bounded trace/drop count");
  assert(!JSON.stringify(candidateSnapshot).includes("private-body") && !JSON.stringify(candidateSnapshot).includes("private-token"), "metadata allowlist");
  await writeFile(`${output}/B6_TIMELINE.jsonl`, traces.map(x => JSON.stringify(x)).join("\n") + "\n");
  await writeFile(`${output}/B6_SUMMARY.json`, JSON.stringify({ results, calibration, trace_overhead_10000_records_ms: traceOverheadMs, candidate_snapshot: candidateSnapshot }, null, 2) + "\n");
  console.log(`PASS ${results.length} cases; ${traces.length} events; ${calibration.length} calibration samples`);
} finally { await browser.close(); }
