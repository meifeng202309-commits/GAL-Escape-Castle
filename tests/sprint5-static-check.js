const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const migration = fs.readFileSync(path.join(root, "database/027_sprint5_act6_8_runtime.sql"), "utf8");
const correction = fs.readFileSync(path.join(root, "database/028_sprint5_round_event_link.sql"), "utf8");
const level1 = fs.readFileSync(path.join(root, "database/029_sprint5_canonical_discussion_localization.sql"), "utf8");
const exactMessages = fs.readFileSync(path.join(root, "database/030_sprint5_exact_session_messages.sql"), "utf8");
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
for (const text of ["drop trigger if exists s5_round_audit_link", "s5_configure_discussion", "allow_pocket", "allow_memories_observations", "allow_share_photo", "Sprint 5 voting is not open", "s5_get_discussion_state"]) if (!level1.includes(text)) throw new Error(`Missing Sprint 5 Level 1 correction: ${text}`);
if (app.includes("portrait-eyes") || app.includes("How do we escape?") || app.includes("ONE SHOWS NOW.")) throw new Error("Sprint 5 renderer contains a prohibited substitute or hardcoded canonical text.");
for (const text of ["s5_send_message", "Stale Sprint 5 discussion identity", "client_request_id"]) if (!exactMessages.includes(text)) throw new Error(`Missing exact-session message correction: ${text}`);
const focused = fs.readFileSync("database/031_sprint5_focused_reaudit_corrections.sql", "utf8");
for (const text of ["allow_share_photo=p_phase in('act6_vote','act8_final_vote')", "s5_get_teacher_discussion_state", "s5_teacher_open_vote", "s5_teacher_add_time", "idempotent_replay"]) if (!focused.includes(text)) throw new Error(`Missing focused re-audit correction: ${text}`);
for (const text of ["counterclockwise", "prop_gitte_castle_map", "prop.photo_1897", "pocket?.observations", "pocket?.shared_photos", "data-share-item"]) if (!app.includes(text)) throw new Error(`Missing Sprint 5 evidence UI: ${text}`);
if (/database\/02[0-6]_/.test("database/027_sprint5_act6_8_runtime.sql")) throw new Error("Immutable migration range touched.");
console.log("Sprint 5 static checks passed.");
