const fs=require("fs");

const app=fs.readFileSync("src/game/app.js","utf8");
const teacher=fs.readFileSync("src/teacher/teacher-console.js","utf8");
const html=fs.readFileSync("teacher.html","utf8");
const migration=fs.readFileSync("database/059_structural_lifecycle_transition_spine.sql","utf8");
const correction=fs.readFileSync("database/060_package_a_ca_a_bounded_corrections.sql","utf8");
const timerBarrier=fs.readFileSync("database/061_package_a_act6_entry_timer_barrier.sql","utf8");
const preparedEventFix=fs.readFileSync("database/062_package_a_prepared_event_fk_fix.sql","utf8");
const playerEntryFix=fs.readFileSync("database/063_package_a_player_entry_column_fix.sql","utf8");
const handoffObservationFix=fs.readFileSync("database/064_package_a_handoff_observation_column_fix.sql","utf8");

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
assert(app.includes('rpc("s9_observe_act5_handoff"'),"ACT5 handoff is not durably observed per player before entry.");
assert(app.includes('!sprint3bState.me?.act6_entered_at'),"ACT6 visibility is not gated by per-player entry state.");
assert(app.includes("renderAct6EntryBarrier"),"Entered players lack a pre-timer all-player barrier surface.");
assert(app.includes('sprint5State.state?.phase_key==="act6_vote"'),"ACT6 entry barrier can mask later Sprint5/Sprint6 lifecycle states.");

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

for(const fragment of [
  "revoke execute on function public.s2_start_run(text,text,text) from anon,authenticated",
  "add column if not exists act6_handoff_observed_at",
  "add column if not exists act6_entered_at",
  "create or replace function public.s9_observe_act5_handoff",
  "progress.act6_handoff_observed_at is null",
  "player_location='portrait_hall'",
  "create or replace function public.s9_enter_act6",
])assert(correction.includes(fragment),`Migration 060 missing: ${fragment}`);

for(const fragment of [
  "create or replace function public.s5_ensure_initialized",
  "do not call s5_configure_discussion",
  "entered_count=3 and sprint5.act6_entered_at is null",
  "perform public.s5_configure_discussion(sid,'act6_vote')",
  "'act6_discussion_started'",
  "'all_player_entry_barrier'",
])assert(timerBarrier.includes(fragment),`Migration 061 missing: ${fragment}`);

assert(preparedEventFix.includes("s2_log_event(p_run,room,null,'s5_prepared'"),
  "Prepared event still references a not-yet-created discussion session.");
assert(playerEntryFix.includes("set player_location='portrait_hall',act6_entered_at=now()")&&
  !playerEntryFix.includes("set player_location='portrait_hall',act6_entered_at=now(),updated_at=now()"),
  "ACT6 entry still writes a nonexistent player-progress timestamp column.");
assert(handoffObservationFix.includes("set act6_handoff_observed_at=coalesce(act6_handoff_observed_at,now())")&&
  !handoffObservationFix.includes("updated_at=now()"),
  "ACT5 observation still writes a nonexistent player-progress timestamp column.");

console.log("Structural Package A static checks passed.");
