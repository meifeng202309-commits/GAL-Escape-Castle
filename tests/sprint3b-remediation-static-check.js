const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const migration13 = read("database/013_sprint3b_discussion_authority_and_request_identity.sql");
const migration14 = read("database/014_sprint3b_evidence_and_puzzle_integrity.sql");
const migration14a = read("database/014a_sprint3b_inspect_reconnect_idempotency_fix.sql");
const migration14b = read("database/014b_sprint3b_targeted_closure_corrections.sql");
const student = read("src/game/app.js");
const teacher = read("src/teacher/teacher-console.js");

function requireFragments(source, label, fragments) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) throw new Error(`${label} missing: ${fragment}`);
  }
}

requireFragments(migration13, "013", [
  "discussion_sessions_one_open_per_run",
  "dialogue_messages_request_identity",
  "p_expected_discussion_session_id uuid",
  "p_expected_vote_round integer",
  "p_client_request_id uuid",
  "Stale discussion identity.",
  "s3b_apply_resolved_discussion_internal",
  "Generic DiscussionRoom is unavailable during canonical gameplay.",
  "revoke execute on function public.s3b_apply_meeting_resolution",
  "revoke execute on function public.s3b_apply_act5_resolution",
]);

requireFragments(migration14, "014", [
  "act1_action_started_at",
  "first_meeting_started_at",
  "act4_choice_started_at",
  "s3b_library_attempt_request_identity",
  "s3b_post_inspection_route_votes",
  "decision_type='game_only_step_vote'",
  "behavior_scoring boolean not null default false check(not behavior_scoring)",
  "s3b_submit_post_inspection_route_vote",
  "submitted_count',v_count",
  "allow_share_photo",
  "Photo sharing requires an open canonical discussion.",
  "scene_transition",
  "event_source",
  "validity",
  "client_request_id",
  "v_had_old:=found",
  "if not v_had_old",
]);

requireFragments(migration14a, "014a", [
  "create or replace function public.s3b_apply_resolved_discussion_internal",
  "v_result='inspect_first' and v_state.unknown_passage_inspected",
  "reason','already_applied'",
  "revoke execute on function public.s3b_apply_resolved_discussion_internal",
]);

requireFragments(migration13, "013 restored deployment history", [
  "v_result='inspect_first' and v_state.pending_post_inspection_route",
]);
if (migration13.includes("v_result='inspect_first' and v_state.unknown_passage_inspected")) {
  throw new Error("013 still contains the post-deployment reconnect edit.");
}

requireFragments(migration14b, "014b", [
  "audit_private_debug_view boolean not null default false",
  "Resolve the open generic discussion before canonical gameplay initialization.",
  "s3b_log_formal_event_at_context",
  "result:=public.s3b_complete_act1_pre014",
  "not (e.phase_key=any(private_phases))",
  "g.run_mode='audit' and g.audit_private_debug_view",
  "Private debug view is restricted to AUDIT runs.",
  "s3b_audit_set_private_debug_view",
]);

const causalWrapper = /s3b_log_formal_event_at_context\([\s\S]*?result:=public\.s3b_complete_act1_pre014/;
if (!causalWrapper.test(migration14b)) {
  throw new Error("ACT 1 completion is not logged before its delegated transition.");
}

requireFragments(student, "student client", [
  "Formal game state is unavailable. Retry before taking another action.",
  "p_expected_discussion_session_id",
  "p_expected_vote_round",
  "p_client_request_id",
  "s3b_submit_post_inspection_route_vote",
  "crypto.randomUUID()",
]);

for (const forbidden of [
  "s3b_choose_post_inspection_route\"",
  "s3b_apply_meeting_resolution\"",
  "s3b_apply_act5_resolution\"",
]) {
  if (student.includes(forbidden)) throw new Error(`Browser authority call remains: ${forbidden}`);
}

requireFragments(teacher, "teacher client", [
  "canonical_flow_active",
  "openDiscussionButton.disabled = canonicalFlowActive",
]);

if (/service[_-]?role/i.test(`${migration13}\n${migration14}\n${migration14a}\n${migration14b}\n${student}\n${teacher}`)) {
  throw new Error("Service-role material is forbidden in Sprint 3B remediation.");
}

console.log("Sprint 3B remediation static checks passed.");
