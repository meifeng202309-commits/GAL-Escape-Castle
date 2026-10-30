import http from "node:http";
import path from "node:path";
import { readFile, writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { performance } from "node:perf_hooks";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = process.cwd();
const server = http.createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, "http://localhost").pathname;
    if (pathname === "/cover") { response.writeHead(200, { "Content-Type": "text/html" }); response.end("<title>Foreground cover</title><h1>Cover</h1>"); return; }
    const relative = pathname.replace(/^\/+/, "") || "index.html";
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep)) throw Error("path escape");
    const content = await readFile(file);
    response.writeHead(200, { "Content-Type": file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html" }); response.end(content);
  } catch { response.writeHead(404); response.end("Not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const chromePath = process.env.GAL_A1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const profile = await mkdtemp(path.join(tmpdir(), "gal-hidden-probe-"));
const playerUrl = `http://127.0.0.1:${server.address().port}/index.html`;
const coverUrl = `http://127.0.0.1:${server.address().port}/cover`;
const chrome = spawn(chromePath, [
  `--user-data-dir=${profile}`, "--remote-debugging-port=0", "--no-first-run", "--no-default-browser-check", "--window-size=1000,700",
  "--enable-features=IntensiveWakeUpThrottling:grace_period_seconds/10,OptOutZeroTimeoutTimersFromThrottling,AllowAggressiveThrottlingWithWebSocket",
  playerUrl, coverUrl,
], { stdio: "ignore", windowsHide: false });
let port;
for (let attempt = 0; attempt < 100; attempt++) {
  try { port = Number((await readFile(path.join(profile, "DevToolsActivePort"), "utf8")).split(/\r?\n/)[0]); break; } catch { await new Promise(resolve => setTimeout(resolve, 100)); }
}
if (!port) throw Error("Chrome DevToolsActivePort was not created");
const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
const requests = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  const context = browser.contexts()[0];
  const player = context.pages().find(page => page.url().includes("/index.html"));
  const cover = context.pages().find(page => page.url().endsWith("/cover"));
  if (!player || !cover) throw Error("Chrome did not open both probe tabs in one window");
  await player.addInitScript(() => {
    localStorage.setItem("gal_castle_escape_session_v1", JSON.stringify({ room_code: "HIDDENPROBE", player_id: "00000000-0000-4000-8000-000000000001", display_name: "Probe", role_slot: "GAL-A", session_token: "TEST" }));
    globalThis.__GAL_A1_TEST_HOOKS__ = {};
    globalThis.__VISIBILITY_EVENTS__ = [{ utc: new Date().toISOString(), state: document.visibilityState, focus: document.hasFocus(), event: "init" }];
    for (const name of ["visibilitychange", "focus", "blur", "freeze", "resume"]) (name === "visibilitychange" || name === "freeze" || name === "resume" ? document : window).addEventListener(name, () => globalThis.__VISIBILITY_EVENTS__.push({ utc: new Date().toISOString(), state: document.visibilityState, focus: document.hasFocus(), event: name }));
  });
  await player.route("**/rest/v1/rpc/**", async route => {
    const rpc = new URL(route.request().url()).pathname.split("/").pop();
    requests.push({ rpc, utc: new Date().toISOString(), monotonic_ms: +performance.now().toFixed(3) });
    const value = rpc === "s8_get_player_state" ? { active: false } : rpc === "s2_get_player_state" ? { active: false } : rpc === "asset_resolve" ? { ok: false } : { message: `Unexpected ${rpc}` };
    await route.fulfill({ status: value.message ? 400 : 200, contentType: "application/json", body: JSON.stringify(value) });
  });
  await player.reload({ waitUntil: "networkidle" });
  await player.bringToFront();
  const visibleStart = new Date().toISOString();
  await sleep(8000);
  const visibleEnd = new Date().toISOString();
  await cover.bringToFront();
  // Manual tab selection window: the operator clicks the real Chrome tab because
  // CDP bringToFront alone does not change Page Visibility in this environment.
  await sleep(10000);
  const hiddenState = await player.evaluate(() => ({ state: document.visibilityState, focus: document.hasFocus() }));
  const hiddenStart = new Date().toISOString();
  await sleep(15000);
  const hiddenEnd = new Date().toISOString();
  await player.bringToFront();
  await sleep(4000);
  const resumedEnd = new Date().toISOString();
  const visibility = await player.evaluate(() => globalThis.__VISIBILITY_EVENTS__);
  const inWindow = (row, start, end) => row.rpc === "s8_get_player_state" && row.utc >= start && row.utc < end;
  const visibleRequests = requests.filter(row => inWindow(row, visibleStart, visibleEnd));
  const hiddenRequests = requests.filter(row => inWindow(row, hiddenStart, hiddenEnd));
  const resumedRequests = requests.filter(row => inWindow(row, hiddenEnd, resumedEnd));
  const intervals = rows => rows.slice(1).map((row, index) => +(row.monotonic_ms - rows[index].monotonic_ms).toFixed(3));
  const outcome = hiddenState.state === "hidden" ? "confirmed_hidden" : "unresolved_environment_kept_visible";
  const report = { generated_utc: new Date().toISOString(), outcome, aggressive_flag_grace_seconds: 10, manual_tab_selection_window_ms: 10000, hidden_state_after_cover: hiddenState, windows: { visible: { start: visibleStart, end: visibleEnd, poll_starts: visibleRequests.length, intervals_ms: intervals(visibleRequests) }, cover_front_attempt: { start: hiddenStart, end: hiddenEnd, poll_starts: hiddenRequests.length, intervals_ms: intervals(hiddenRequests) }, resumed: { start: hiddenEnd, end: resumedEnd, poll_starts: resumedRequests.length, intervals_ms: intervals(resumedRequests) } }, visibility_events: visibility, requests };
  await mkdir("docs/reports/remediation/ui/trial8-external", { recursive: true });
  await writeFile("docs/reports/remediation/ui/trial8-external/HIDDEN_POLLING.json", JSON.stringify(report, null, 2) + "\n");
  if (hiddenState.state === "hidden" && !visibility.some(row => row.event === "visibilitychange" && row.state === "hidden")) throw Error("Hidden state lacked visibilitychange evidence");
  console.log(JSON.stringify({ outcome, windows: report.windows }));
} finally {
  await browser.close().catch(() => {});
  chrome.kill();
  await new Promise(resolve => server.close(resolve));
  if (path.resolve(profile).startsWith(path.resolve(tmpdir()) + path.sep)) await rm(profile, { recursive: true, force: true }).catch(() => {});
}
