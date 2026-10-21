const fs = require("node:fs");
const assert = require("node:assert/strict");

const sql = fs.readFileSync("database/071_act7_v4_normal_teacher_paced_vote.sql", "utf8");

// Bind the executable scenario to the SQL policy that owns both the generic
// route and Sprint 5. This is source-only evidence; production remains closed.
for (const token of [
  "if v_run.run_mode='normal' and v_session.status in('discussion','voting') then return; end if",
  "phase_deadline=case when v_run.run_mode='normal' then null",
  "phase_deadline=case when g.run_mode='normal' then null",
]) assert.ok(sql.includes(token), `Missing Teacher-paced SQL policy: ${token}`);

function openVote(mode, openedAtMs) {
  return {
    mode,
    status: "voting",
    deadlineMs: mode === "normal" ? null : openedAtMs + 60_000,
    votes: [],
  };
}

function refresh(state, nowMs) {
  if (state.mode === "normal" && ["discussion", "voting"].includes(state.status)) return;
  if (state.deadlineMs !== null && nowMs >= state.deadlineMs && state.votes.length < 3) {
    state.status = "waiting_for_missing_player";
    state.deadlineMs = null;
  }
}

function vote(state, player, nowMs) {
  refresh(state, nowMs);
  assert.equal(state.status, "voting", `${player} lost a legitimate voting opportunity`);
  assert.ok(!state.votes.includes(player), `${player} voted twice`);
  state.votes.push(player);
  if (state.votes.length === 3) state.status = "resolved";
}

const normal = openVote("normal", 0);
vote(normal, "GAL-A", 61_000);
vote(normal, "GAL-B", 122_000);
vote(normal, "GAL-C", 183_000);
assert.deepEqual(normal.votes, ["GAL-A", "GAL-B", "GAL-C"]);
assert.equal(normal.status, "resolved", "Three delayed sequential NORMAL votes did not resolve normally");

const audit = openVote("audit", 0);
vote(audit, "GAL-A", 1_000);
refresh(audit, 61_000);
assert.equal(audit.status, "waiting_for_missing_player", "AUDIT timeout regression was not preserved");
assert.deepEqual(audit.votes, ["GAL-A"], "AUDIT timeout rewrote a committed vote");

console.log("Teacher-paced voting policy positive and AUDIT regression tests passed.");
