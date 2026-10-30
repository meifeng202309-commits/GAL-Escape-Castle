import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";

// Test-only scheduler model. No production import or product source change.
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function run({ authorityMs, targetMs, unrelatedMs, predecessorMs = 0, candidate = false, invalidate = false }) {
  const started = performance.now();
  await delay(predecessorMs);
  await delay(authorityMs);
  await delay(authorityMs);
  const target = delay(targetMs);
  const unrelated = delay(unrelatedMs);
  if (!candidate) await Promise.all([target, unrelated]);
  else await target;
  if (invalidate) return { status: "discarded", visibleAtMs: null };
  const visibleAtMs = performance.now() - started;
  await unrelated;
  return { status: "confirmed", visibleAtMs };
}

const regimes = [
  { authorityMs: 10, targetMs: 10, unrelatedMs: 10 },
  { authorityMs: 10, targetMs: 10, unrelatedMs: 150 },
  { authorityMs: 50, targetMs: 50, unrelatedMs: 250 },
  { authorityMs: 10, targetMs: 10, unrelatedMs: 150, predecessorMs: 200 },
];
const results = [];
for (const regime of regimes) {
  const before = await run(regime);
  const candidate = await run({ ...regime, candidate: true });
  assert.equal(before.status, "confirmed");
  assert.equal(candidate.status, "confirmed");
  results.push({ regime, fullFrameMs: Math.round(before.visibleAtMs), targetProjectionMs: Math.round(candidate.visibleAtMs) });
}
assert.equal((await run({ authorityMs: 5, targetMs: 5, unrelatedMs: 50, candidate: true, invalidate: true })).status, "discarded");
assert(results[1].targetProjectionMs < results[1].fullFrameMs - 80);
assert(results[3].targetProjectionMs >= regimes[3].predecessorMs, "Queued predecessor cannot be bypassed by this candidate");
console.log(JSON.stringify({ modelOnly: true, results, staleGeneration: "discarded" }, null, 2));
