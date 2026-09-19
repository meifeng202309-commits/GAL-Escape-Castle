const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const file = path.join(root, "database/007_sprint3b_act1_5_placeholder_flow.sql");
if (!fs.existsSync(file)) throw new Error("Missing Sprint 3B migration.");
const sql = fs.readFileSync(file, "utf8");
for (const fragment of [
  "s3b_run_state", "s3b_player_progress", "s3b_library_attempts",
  "s3b_submit_act1_choice", "s3b_submit_first_meeting", "s3b_grab", "s3b_leave_start_room",
  "SINGLE_REVOTE_THEN_FALLBACK", "final_meeting_result", "current_route_target", "wayfinding_target",
  "failed_rendezvous", "s3b_follow_sign", "party_physically_reunited", "silent_texting_mode",
  "puzzle_started_at", "puzzle_deadline", "interval '90 seconds'", "puzzle_hint_stage",
  "41739", "library_photo_1897", "library_torn_note", "s3b_submit_act4_choice", "s3b_apply_act5_resolution",
  "SPRINT3B_COMPLETE", "enable row level security", "act04-05.009",
]) if (!sql.includes(fragment)) throw new Error(`Sprint 3B contract missing: ${fragment}`);
if (/teacher_override|RESOLVE & CONTINUE|SKIP CURRENT INTERACTION/i.test(sql)) throw new Error("Sprint 3C Teacher Override leaked into Sprint 3B.");
if (/service[_-]?role/i.test(sql)) throw new Error("Service-role reference is forbidden.");
console.log("Sprint 3B static checks passed.");
