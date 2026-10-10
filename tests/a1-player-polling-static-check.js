const fs = require("fs");

const app = fs.readFileSync("src/game/app.js", "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(!app.includes("setInterval(refreshState, 1200)"), "A1 still uses an overlapping refresh interval.");
assert(app.includes("setTimeout(() =>") && app.includes("scheduleNextPlayerPoll"), "A1 lacks one-shot post-settlement polling.");

for (const marker of [
  "playerSessionEpoch",
  "refreshGeneration",
  "refreshInFlight",
  "refreshQueued",
  "lastConfirmedFrame",
  "refreshCanCommit(run)",
  "startQueuedPlayerRefresh",
]) assert(app.includes(marker), `A1 coordinator marker missing: ${marker}`);

assert(app.includes('run.cancelled = true') || app.includes('refreshInFlight.cancelled = true'), "Session invalidation does not cancel the logical in-flight refresh.");
assert(app.includes('deferred.resolve({ status: "invalidated" })'), "Leave/rejoin does not settle queued refresh callers.");
assert(app.includes('refreshInFlight.deferred.resolve({ status: "invalidated" })'), "Leave/rejoin does not settle the in-flight caller.");

assert(app.includes('error.name = "PlayerRefreshInvariantError"') || app.includes('invariant.name = "PlayerRefreshInvariantError"'), "Invariant failures are not distinguished from transport failures.");
assert(app.includes('wrapped.name = "PlayerRefreshReadError"'), "Transport failures lack an explicit classification.");
assert(!/s[2568]_get_[a-z0-9_]+"[^\n]*\.catch\(\(\)=>\(\{active:false\}\)\)/.test(app), "A Player projection still converts transport failure into active:false.");

const loadIndex = app.indexOf("async function loadPlayerFrame");
const commitIndex = app.indexOf("function commitPlayerFrame");
const coordinatorIndex = app.indexOf("function startPlayerRefresh");
assert(loadIndex >= 0 && commitIndex > loadIndex && coordinatorIndex > commitIndex, "Candidate-frame load/commit/coordinator structure is missing.");
assert(app.includes('sprint5State.active ? readPlayerProjection("s5_get_discussion_state", auth)'), "S5 Discussion is not collected before frame commit.");
assert(app.includes("Promise.allSettled(reads)"), "Failed parallel reads may leave unawaited projection work overlapping the next refresh.");
assert(app.includes("const frame = await loadPlayerFrame(activeSession)"), "Coordinator does not await the complete candidate frame.");
assert(app.includes("if (!refreshCanCommit(run))"), "Candidate frame lacks a final stale epoch/generation gate.");

const s8Index = app.indexOf('readPlayerProjection("s8_get_player_state", auth)');
const s2Index = app.indexOf('readPlayerProjection("s2_get_player_state", auth)');
assert(s8Index >= 0 && s8Index < s2Index, "Completed S8 projection no longer precedes active-run dispatch.");
assert(app.includes('kind: "act5-handoff"') && app.includes('kind: "act6-waiting"'), "ACT5/ACT6 lifecycle handoffs were lost.");

assert(!app.includes("async function refreshDiscussion()"), "A direct partial Discussion refresh still bypasses A1.");
assert(!app.includes("async function refreshSprint3b()"), "A direct partial Sprint3b refresh still bypasses A1.");
assert(/async function sendMessage\([\s\S]*?await refreshState\(\)/.test(app), "Message mutation does not request a coordinated full refresh.");

assert(app.includes("if (globalThis.__GAL_A1_TEST_HOOKS__)"), "Deterministic A1 browser hooks are not gated behind an explicit test object.");

console.log("A1 Player polling static checks passed.");
