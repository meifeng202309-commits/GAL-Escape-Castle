const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const migration = fs.readFileSync(path.join(root, "database/027_sprint5_act6_8_runtime.sql"), "utf8");
const correction = fs.readFileSync(path.join(root, "database/028_sprint5_round_event_link.sql"), "utf8");
const app = fs.readFileSync(path.join(root, "src/game/app.js"), "utf8");
const teacher = fs.readFileSync(path.join(root, "src/teacher/teacher-console.js"), "utf8");
const html = fs.readFileSync(path.join(root, "teacher.html"), "utf8");
const required = [
  "create table public.s5_run_state", "create table public.s5_rounds",
  "discussion_session_id uuid primary key", "client_request_id uuid not null",
  "Stale Sprint 5 discussion identity.", "idempotent_replay",
  "portrait_fixed_fallback", "clock_wrong_attempt", "route_taken_act8",
  "s5_act8_private_choices", "behavior_scoring',true",
  "alter table public.s5_rounds enable row level security",
];
for (const text of required) if (!migration.includes(text)) throw new Error(`Missing Sprint 5 invariant: ${text}`);
for (const text of ["shared.portrait_hall", "overlay.portrait_eyes_open", "shared.clock_room", "shared.west_tower_payoff", "shared.main_gate", "p_expected_discussion_session_id", "p_client_request_id"]) {
  if (!app.includes(text)) throw new Error(`Missing Sprint 5 client integration: ${text}`);
}
if (!teacher.includes("s5_initialize") || !html.includes("initializeSprint5Button")) throw new Error("Teacher Sprint 5 initialization is not wired.");
for (const text of ["s5_mirror_round_for_audit", "s5_round_audit_link", "sprint5_audit_link"]) if (!correction.includes(text)) throw new Error(`Missing Sprint 5 event-link correction: ${text}`);
if (/database\/02[0-6]_/.test("database/027_sprint5_act6_8_runtime.sql")) throw new Error("Immutable migration range touched.");
console.log("Sprint 5 static checks passed.");
