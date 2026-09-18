const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "database/001_sprint1_core.sql",
  "database/002_runtime_runs_discussion.sql",
  "database/003_sprint2_discussionroom_audit_fix.sql",
  "index.html",
  "teacher.html",
  "src/game/app.js",
  "src/teacher/teacher-console.js",
  "tests/sprint1-static-check.js",
  "tests/sprint1-live-e2e.js",
  "tests/sprint2-live-e2e.js",
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
}

const migration = fs.readFileSync(path.join(root, "database/002_runtime_runs_discussion.sql"), "utf8");
const correction = fs.readFileSync(path.join(root, "database/003_sprint2_discussionroom_audit_fix.sql"), "utf8");
const student = fs.readFileSync(path.join(root, "src/game/app.js"), "utf8");
const teacher = fs.readFileSync(path.join(root, "src/teacher/teacher-console.js"), "utf8");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const teacherHtml = fs.readFileSync(path.join(root, "teacher.html"), "utf8");

const requiredSql = [
  "create table if not exists public.game_runs",
  "create table if not exists public.discussion_sessions",
  "create table if not exists public.dialogue_messages",
  "create table if not exists public.runtime_player_decisions",
  "create table if not exists public.runtime_events",
  "unique (run_id, scene_id, phase_key, step_key, vote_round, player_id, decision_type)",
  "waiting_for_missing_player",
  "NO CONSENSUS. NO ACTION.",
  "create or replace function public.s2_start_run",
  "create or replace function public.s2_open_discussion",
  "create or replace function public.s2_send_message",
  "create or replace function public.s2_submit_vote",
  "create or replace function public.s2_get_player_state",
  "create or replace function public.s2_get_teacher_state",
  "alter table public.game_runs enable row level security",
  "alter table public.runtime_events enable row level security",
];

for (const fragment of requiredSql) {
  if (!migration.includes(fragment)) throw new Error(`Sprint 2 migration missing: ${fragment}`);
}

for (const fragment of [
  "create or replace function public.s2_open_discussion",
  "create or replace function public.s2_submit_vote",
  "create or replace function public.s2_get_player_state",
  "create or replace function public.s2_get_teacher_state",
  "1, v_round, trim(p_topic)",
  "m.discussion_session_id = v_session.discussion_session_id",
  "'message_history', v_message_history",
]) {
  if (!correction.includes(fragment)) throw new Error(`Sprint 2 correction migration missing: ${fragment}`);
}

if (correction.includes("fallback_resolution must match a configured vote option id")) {
  throw new Error("Correction migration still restricts fallback_resolution to a vote option.");
}

if ((correction.match(/m\.discussion_session_id = v_session\.discussion_session_id/g) || []).length < 2) {
  throw new Error("Current transcript must be session-scoped for both player and teacher state.");
}

if (migration.includes("delete from public.game_runs") || migration.includes("delete from public.runtime_player_decisions")) {
  throw new Error("Sprint 2 migration must not destructively reset formal run data.");
}

if (!migration.includes("run_mode <> old.run_mode") || !migration.includes("behavior_dataset_eligible <> old.behavior_dataset_eligible")) {
  throw new Error("Run identity/mode immutability trigger is incomplete.");
}

for (const fragment of ["s2_get_player_state", "s2_send_message", "s2_submit_vote", "discussionPanel"]) {
  if (!student.includes(fragment) && !indexHtml.includes(fragment)) throw new Error(`Student DiscussionRoom missing: ${fragment}`);
}

for (const fragment of ["s2_start_run", "s2_open_discussion", "s2_open_vote", "s2_add_time", "discussionState"]) {
  if (!teacher.includes(fragment) && !teacherHtml.includes(fragment)) throw new Error(`Teacher DiscussionRoom missing: ${fragment}`);
}

for (const file of [student, teacher, migration]) {
  if (/service[_-]?role/i.test(file)) throw new Error("Browser/runtime source must not contain a service-role credential.");
}

console.log("Sprint 2 static checks passed.");
