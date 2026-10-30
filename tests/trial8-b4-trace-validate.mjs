import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base = "docs/reports/remediation/ui/trial8-b4/";
const sets = [
  ["", 160],
  ["FAULT_", 30],
  ["EXTRA_", 30],
  ["B5_", 120],
  ["B5_TARGETED_", 20],
];
for (const [prefix, expected] of sets) {
  const { summaries } = JSON.parse(await readFile(`${base}${prefix}SUMMARY.json`, "utf8"));
  const rows = (await readFile(`${base}${prefix}TIMELINE.jsonl`, "utf8")).trim().split("\n").map(JSON.parse);
  assert.equal(summaries.length, expected);
  for (const summary of summaries) {
    const events = rows.filter(row => row.test_id === summary.test_id);
    for (const name of ["test_setup", "initial_authoritative_visible", "action_begin", "handler_entered", "rpc_start", "server_authoritative_transition", "dom_target_visible"]) assert(events.some(event => event.event_name === name), `${summary.test_id}: ${name} absent`);
    assert(summary.click_to_visible_ms >= 0 && summary.authoritative_to_visible_ms >= 0, `${summary.test_id}: negative timing`);
    for (const event of events) {
      assert(Number.isFinite(Date.parse(event.utc)) && Number.isFinite(event.monotonic_ms), `${summary.test_id}: invalid clocks`);
      assert(event.test_id && event.ACT && event.role && event.action && Number.isInteger(event.attempt) && event.event_name, `${summary.test_id}: missing identity`);
    }
  }
  console.log(`${prefix || "MAIN"}: ${expected} cases, ${rows.length} events validated`);
}
const concurrent = (await readFile(`${base}B5_CONCURRENT_TIMELINE.jsonl`, "utf8")).trim().split("\n").map(JSON.parse);
for (let repetition = 1; repetition <= 5; repetition++) {
  const id = `ACT2_concurrent_${repetition}`, rows = concurrent.filter(row => row.test_id === id);
  assert.equal(rows.filter(row => row.event_name === "teacher_gate_end").length, 1);
  assert.equal(rows.filter(row => row.event_name === "three_player_barrier_end").length, 1);
  assert.equal(rows.filter(row => row.event_name === "rpc_start" && row.rpc === "s2_submit_vote").length, 3);
}
console.log("B5_CONCURRENT: 5 Teacher/three-Player cases validated");
