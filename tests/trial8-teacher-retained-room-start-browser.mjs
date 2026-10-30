import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = process.cwd();
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const server = http.createServer(async (request, response) => {
  try {
    const relative = decodeURIComponent(new URL(request.url, "http://localhost").pathname).replace(/^\/+/, "") || "teacher.html";
    const file = path.resolve(root, relative);
    assert(file.startsWith(root + path.sep), "path escape");
    const content = await readFile(file);
    response.writeHead(200, { "Content-Type": file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html" });
    response.end(content);
  } catch { response.writeHead(404); response.end("Not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true, executablePath: process.env.GAL_A1_BROWSER || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const page = await browser.newPage();
let starts = 0;
const calls = [];
await page.route("**/rest/v1/rpc/**", async route => {
  const name = new URL(route.request().url()).pathname.split("/").pop();
  const room = route.request().postDataJSON()?.p_room_code;
  calls.push({ name, room });
  const active = room === "OLD";
  const run = { run_id: "old-run", run_mode: "normal", behavior_dataset_eligible: true };
  let value;
  if (name === "s1_get_teacher_state") value = { room_code: room, current_scene: 1, phase: "collecting", players: [], decisions: [] };
  else if (name === "s6_get_teacher_discussion_state") value = { sprint6_active: false };
  else if (name === "s5_get_teacher_discussion_state") value = { sprint5_active: false };
  else if (name === "s2_get_teacher_state") value = active ? { active: true, run, discussion: null, teacher_override: {} } : { active: false, teacher_override: {} };
  else if (name === "s7_get_teacher_console") value = { active: false, players: [], operations_v1: [], discussion: { messages: [] }, pockets: [], group_items: [], audio: { recent: [] }, phase_behavior_validity: [], teacher_interventions: [], override_history: [], export: {} };
  else if (name === "s8_get_finalization_state") value = { export_ready: false };
  else if (name === "s1_create_room") value = { room_code: room };
  else if (name === "s9_start_formal_game") { starts += 1; value = { run_id: "new-run" }; }
  else return route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ message: `Unexpected ${name}` }) });
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(value) });
});
try {
  await page.goto(`http://127.0.0.1:${server.address().port}/teacher.html`);
  await page.fill("#roomCode", "OLD");
  await page.fill("#teacherToken", "TOKEN");
  await page.click("#watchButton");
  await page.waitForFunction(() => document.querySelector("#runBadge")?.textContent === "NORMAL");
  assert(await page.locator("#startRunButton").isDisabled(), "Active run Start must be disabled");
  assert(await page.locator("#runMode").isDisabled(), "Active run mode must be disabled");
  await page.fill("#roomCode", "NEW");
  await page.fill("#codeGitte", "GITTE");
  await page.fill("#codeAnna", "ANNA");
  await page.fill("#codeLinda", "LINDA");
  await page.click("#createRoomButton");
  await page.waitForFunction(() => document.querySelector("#runBadge")?.textContent === "No active run");
  assert(await page.locator("#startRunButton").isEnabled(), "Fresh room Start retained stale disabled state");
  assert(await page.locator("#runMode").isEnabled(), "Fresh room run mode retained stale disabled state");
  await page.click("#startRunButton");
  await page.waitForFunction(() => document.querySelector("#discussionTeacherStatus")?.textContent.includes("Formal run ready"));
  assert(starts === 1 && calls.some(call => call.name === "s9_start_formal_game" && call.room === "NEW"), "Fresh room Start did not dispatch exactly once");
  console.log("Trial8 retained Teacher page active→new room Start regression passed.");
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
