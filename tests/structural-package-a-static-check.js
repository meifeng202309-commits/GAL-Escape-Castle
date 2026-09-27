const fs=require("fs");

const app=fs.readFileSync("src/game/app.js","utf8");
const teacher=fs.readFileSync("src/teacher/teacher-console.js","utf8");
const html=fs.readFileSync("teacher.html","utf8");
const migration=fs.readFileSync("database/059_structural_lifecycle_transition_spine.sql","utf8");

function assert(condition,message){if(!condition)throw new Error(message)}

assert(teacher.includes('rpc("s9_start_formal_game"'),"Teacher start must use the transactional formal-start authority.");
assert(!teacher.match(/async function startRun[\s\S]*?rpc\("s2_start_run"/),"Normal Teacher start still calls the split run-only RPC.");
assert(html.includes("Legacy prototype diagnostics"),"Legacy Sprint1 controls are not isolated as diagnostics.");
assert(html.includes("Emergency canonical-flow recovery"),"Manual canonical initialization controls lack emergency-only framing.");

const completionIndex=app.indexOf('rpc("s8_get_player_state"');
const activeIndex=app.indexOf('rpc("s2_get_player_state"');
assert(completionIndex>=0&&completionIndex<activeIndex,"Completed lifecycle projection must be consulted before active-run dispatch.");
assert(app.includes('renderLifecycleNotice("pre-run"'),"Pre-run lifecycle lacks an explicit waiting surface.");
assert(!/else\s*\{?[\s\S]{0,180}renderState\(sprint1State\)/.test(app),"Formal root still falls back to legacy Sprint1.");
assert(app.includes('terminal_state==="SPRINT3B_COMPLETE"')&&app.includes("renderAct5Handoff"),"ACT5 terminal handoff is not an explicit dispatch state.");
assert(app.includes('rpc("s9_enter_act6"'),"ACT5 handoff lacks its server-authoritative entry action.");

for(const fragment of [
  "create or replace function public.s9_start_formal_game",
  "started:=public.s2_start_run",
  "initialized:=public.s3b_initialize_flow",
  "add column if not exists act6_entered_at",
  "create or replace function public.s9_enter_act6",
  "p_expected_run_id uuid",
  "grant execute on function public.s9_start_formal_game",
  "grant execute on function public.s9_enter_act6",
])assert(migration.includes(fragment),`Migration 059 missing: ${fragment}`);

console.log("Structural Package A static checks passed.");
