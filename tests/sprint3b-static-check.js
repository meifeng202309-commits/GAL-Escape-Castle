const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const file = path.join(root, "database/007_sprint3b_act1_5_placeholder_flow.sql");
if (!fs.existsSync(file)) throw new Error("Missing Sprint 3B migration.");
const sql = fs.readFileSync(file, "utf8");
const concurrencyFile = path.join(root, "database/008_sprint3b_gate_concurrency_fix.sql");
if (!fs.existsSync(concurrencyFile)) throw new Error("Missing Sprint 3B gate concurrency correction.");
const concurrency = fs.readFileSync(concurrencyFile, "utf8");
const consequenceFile = path.join(root, "database/009_sprint3b_act1_consequence_integrity.sql");
if (!fs.existsSync(consequenceFile)) throw new Error("Missing Sprint 3B ACT 1 consequence correction.");
const consequence = fs.readFileSync(consequenceFile, "utf8");
const integrityFile = path.join(root, "database/010_sprint3b_flow_integrity_and_inspect_fix.sql");
if (!fs.existsSync(integrityFile)) throw new Error("Missing Sprint 3B flow-integrity correction.");
const integrity = fs.readFileSync(integrityFile, "utf8");
const deliveryFile = path.join(root, "database/011_sprint3b_transition_and_act1_delivery_integrity.sql");
if (!fs.existsSync(deliveryFile)) throw new Error("Missing Sprint 3B transition/content-delivery correction.");
const delivery = fs.readFileSync(deliveryFile, "utf8");
const lockdownFile = path.join(root, "database/012_sprint3b_internal_wrapper_lockdown_and_route_delivery.sql");
if (!fs.existsSync(lockdownFile)) throw new Error("Missing Sprint 3B internal-wrapper/route-delivery correction.");
const lockdown = fs.readFileSync(lockdownFile, "utf8");
const student = fs.readFileSync(path.join(root, "src/game/app.js"), "utf8");
const teacher = fs.readFileSync(path.join(root, "src/teacher/teacher-console.js"), "utf8");
for (const fragment of [
  "s3b_run_state", "s3b_player_progress", "s3b_library_attempts",
  "s3b_submit_act1_choice", "s3b_submit_first_meeting", "s3b_grab", "s3b_leave_start_room",
  "SINGLE_REVOTE_THEN_FALLBACK", "final_meeting_result", "current_route_target", "wayfinding_target",
  "failed_rendezvous", "s3b_follow_sign", "party_physically_reunited", "silent_texting_mode",
  "puzzle_started_at", "puzzle_deadline", "interval '90 seconds'", "puzzle_hint_stage", "s3b_audit_expire_puzzle",
  "41739", "library_photo_1897", "library_torn_note", "s3b_submit_act4_choice", "s3b_apply_act5_resolution",
  "SPRINT3B_COMPLETE", "enable row level security", "act04-05.009",
]) if (!sql.includes(fragment)) throw new Error(`Sprint 3B contract missing: ${fragment}`);
if (/teacher_override|RESOLVE & CONTINUE|SKIP CURRENT INTERACTION/i.test(sql)) throw new Error("Sprint 3C Teacher Override leaked into Sprint 3B.");
if (/service[_-]?role/i.test(sql)) throw new Error("Service-role reference is forbidden.");
for (const fragment of ["s3b_player_progress_serialize_gate", "for update", "Sprint 3B run state is not initialized"]) {
  if (!concurrency.includes(fragment)) throw new Error(`Sprint 3B concurrency correction missing: ${fragment}`);
}
for (const fragment of ["s3b_initialize_flow_pre011", "s3b_get_player_state_pre011", "act1_stage", "s3b_ack_act1_opening", "s3b_complete_act1", "puzzle_locked_prefix", "Locked puzzle wheels cannot be changed", "s3b_ack_route_update", "template_text_key", "display_name", "s3b_follow_sign_pre011"]) {
  if (!delivery.includes(fragment)) throw new Error(`Sprint 3B transition/content-delivery correction missing: ${fragment}`);
}
for (const helper of ["s3b_initialize_flow_pre011", "s3b_submit_first_meeting_pre011", "s3b_grab_pre011", "s3b_leave_start_room_pre011", "s3b_apply_meeting_resolution_pre011", "s3b_complete_foldback_pre011", "s3b_follow_sign_pre011", "s3b_submit_library_code_pre011", "s3b_submit_act4_choice_pre011", "s3b_apply_act5_resolution_pre011", "s3b_choose_post_inspection_route_pre011", "s3b_get_player_state_pre011"]) {
  if (!lockdown.includes(`revoke execute on function public.${helper}`)) throw new Error(`Internal Sprint 3B helper revoke missing: ${helper}`);
}
for (const fragment of ["route_update_ack_at", "v_ack_count=3", "Route update is already acknowledged for this player."]) {
  if (!lockdown.includes(fragment)) throw new Error(`Per-player route-update delivery missing: ${fragment}`);
}
for (const fragment of ["s3b_player_progress_phase_guard", "Fold-back is out of phase or already complete", "pending_post_inspection_route", "s3b_choose_post_inspection_route", "Post-inspection route is out of phase", "act03.017", "act03.020", "puzzle_resolved_system_fallback", "item.castle_map", "item.torn_note"]) {
  if (!integrity.includes(fragment)) throw new Error(`Sprint 3B flow-integrity correction missing: ${fragment}`);
}
for (const fragment of ["s3b_player_facts", "s3b_act1_consequence", "chapel_warning", "great_hall_outer_lock", "warm_air_warning", "gitte_flashlight_found", "s3b_optional_grab_item"]) {
  if (!consequence.includes(fragment)) throw new Error(`Sprint 3B ACT 1 consequence missing: ${fragment}`);
}
for (const fragment of ["resolveLocalizedText", "localizedTemplateHtml", "s3b_get_player_state", "s3b_submit_act1_choice", "s3b_ack_route_update", "s3b_submit_library_code", "s3b_apply_act5_resolution"]) {
  if (!student.includes(fragment)) throw new Error(`Sprint 3B student binding missing: ${fragment}`);
}
if (!teacher.includes("s3b_initialize_flow") || /teacher_override/i.test(teacher)) throw new Error("Sprint 3B Teacher binding is missing or exceeds scope.");
console.log("Sprint 3B static checks passed.");
