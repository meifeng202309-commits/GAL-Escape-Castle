import http from "node:http";
import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = process.cwd();
const server = http.createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, "http://localhost").pathname;
    if (pathname === "/fixture") {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(`<button id="action">Action</button><script type="module">import {installPerformanceTrace} from '/src/trace/performance-trace.js'; window.trace=installPerformanceTrace({role:'Player',rpc:async()=>({state:{phase_key:'act9_console',state_version:7}}),phase:()=> 'act9_console',version:()=>7});</script>`);
      return;
    }
    const file = path.resolve(root, pathname.replace(/^\/+/, ""));
    if (!file.startsWith(root + path.sep)) throw Error("path escape");
    const content = await readFile(file);
    response.writeHead(200, { "Content-Type": "text/javascript" });
    response.end(content);
  } catch { response.writeHead(404); response.end("Not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true, executablePath: process.env.GAL_A1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
try {
  const ordinary = await browser.newPage();
  await ordinary.goto(`http://127.0.0.1:${server.address().port}/fixture`);
  await ordinary.waitForFunction(() => window.trace);
  if (await ordinary.locator("#supervisedPerformanceTrace").count() || await ordinary.evaluate(() => Boolean(window.__GAL_PERFORMANCE_TRACE__))) throw Error("ordinary URL exposed supervised trace controls");
  await ordinary.close();
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/fixture?perfTrace=supervised`);
  await page.waitForFunction(() => window.trace);
  const disabled = await page.evaluate(() => { window.trace.record("disabled"); return window.trace.snapshot(); });
  if (disabled.rows.length) throw Error("default-off recorder captured data");
  await page.locator("#supervisedPerformanceTrace button").first().click();
  const result = await page.evaluate(async () => {
    const start = performance.now();
    for (let i = 0; i < 2055; i++) window.trace.record("probe", { request_id: `r${i}`, session_token: "SECRET", message_body: "PRIVATE", vote: "A" });
    const record_elapsed_ms = performance.now() - start;
    const calibrated = window.trace.addClockCalibration({ client_send_utc_ms: 1000, server_receive_utc_ms: 1017, server_send_utc_ms: 1019, client_receive_utc_ms: 1030 });
    const invalidCalibration = window.trace.addClockCalibration({ client_send_utc_ms: 5, server_receive_utc_ms: 2, server_send_utc_ms: 1, client_receive_utc_ms: 0 });
    await window.trace.rpc("fixture_rpc", { p_session_token: "SECRET", p_message_text: "PRIVATE", p_client_request_id: "safe-request-id" });
    window.trace.recordVisibleAction("#action");
    await new Promise(requestAnimationFrame);
    return { record_elapsed_ms, calibrated, invalidCalibration, snapshot: window.trace.snapshot() };
  });
  const serialized = JSON.stringify(result.snapshot);
  if (!result.calibrated || result.invalidCalibration || result.snapshot.rows.length !== 2048 || result.snapshot.dropped < 7) throw Error("bounded/calibration contract failed");
  if (serialized.includes("SECRET") || serialized.includes("PRIVATE")) throw Error("sensitive trace data leaked");
  if (!result.snapshot.rows.some(row => row.event === "rpc_end" && row.state_version === 7 && row.phase === "act9_console")) throw Error("RPC correlation metadata missing");
  if (!result.snapshot.rows.some(row => row.event === "action_dom_visible")) throw Error("visible Action trace missing");
  await writeFile("docs/reports/remediation/ui/trial8-b6/B6_TRACE_SOURCE_CONTRACT.json", JSON.stringify({ record_elapsed_ms: result.record_elapsed_ms, rows: result.snapshot.rows.length, dropped: result.snapshot.dropped, calibration: result.snapshot.clock_calibration, sensitive_fields_absent: true, one_way_caveat: result.snapshot.clock_note }, null, 2) + "\n");
  console.log(`PASS rows=${result.snapshot.rows.length} dropped=${result.snapshot.dropped} elapsed=${result.record_elapsed_ms.toFixed(3)}ms`);
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
