const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const migration = fs.readFileSync(path.join(root, "database/037_level3_independent_audit_closure.sql"), "utf8");
const triggerFix = fs.readFileSync(path.join(root, "database/038_level3_cross_sprint_trigger_fix.sql"), "utf8");
const discussionFix = fs.readFileSync(path.join(root, "database/039_level3_s5_canonical_discussion_fix.sql"), "utf8");
const verificationSupport = fs.readFileSync(path.join(root, "database/040_level2_closure_verification_support.sql"), "utf8");
const normalS5Support = fs.readFileSync(path.join(root, "database/041_level2_normal_s5_verification_support.sql"), "utf8");
const authorityCleanup = fs.readFileSync(path.join(root, "database/042_remove_ungoverned_normal_deadline_helpers.sql"), "utf8");
const app = fs.readFileSync(path.join(root, "src/game/app.js"), "utf8");

function requireAll(source, label, fragments) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) throw new Error(`${label} missing: ${fragment}`);
  }
}

requireAll(migration, "IDA-001 discussion ownership", [
  "function public.s6_refresh_owned_discussion",
  "d.scene_id='sprint6'",
  "perform public.s6_refresh_owned_discussion(g.run_id)",
  "discussion_deadline_advanced",
]);

requireAll(migration, "IDA-002 durable audio occurrence", [
  "create table public.s6_audio_occurrences",
  "create table public.s6_audio_consumptions",
  "feedback_audio_occurrence_id",
  "function public.s6_mark_audio_consumed",
  "'audio_triggered'",
  "'audio_consumed'",
]);
requireAll(app, "IDA-002 client consumption", [
  "identity=payload.audio_occurrence_id",
  "payload.audio_consumed",
  'rpc("s6_mark_audio_consumed"',
]);

requireAll(migration, "IDA-003 Station B access", [
  "alter table public.s6_station_b_progress enable row level security",
  "revoke all on table public.s6_station_b_progress from public, anon, authenticated",
]);

requireAll(migration, "IDA-004 automatic continuity", [
  "function public.s5_ensure_initialized",
  "function public.s6_ensure_initialized",
  "create constraint trigger s3b_to_s5_automatic",
  "create constraint trigger s5_to_s6_automatic",
  "deferrable initially deferred",
  "on conflict(run_id) do nothing",
]);
requireAll(triggerFix, "IDA-004 heterogeneous trigger rows", [
  "create or replace function public.act6_13_deferred_cross_sprint",
  "to_jsonb(new)->>'terminal_state'",
  "to_jsonb(new)->>'phase_key'",
]);
requireAll(discussionFix, "IDA-004 canonical ACT6 entry", [
  "create or replace function public.s5_ensure_initialized",
  "returning discussion_session_id into sid",
  "perform public.s5_configure_discussion(sid,'act6_vote')",
]);
requireAll(verificationSupport, "IDA-001 NORMAL deadline verification", [
  "function public.s6_verify_expire_discussion",
  "g.run_mode<>'normal'",
  "scene_id='sprint6'",
  "phase_deadline=clock_timestamp()-interval '1 second'",
]);
requireAll(normalS5Support, "IDA-004 NORMAL boundary verification", [
  "function public.s5_verify_expire_discussion",
  "g.run_mode<>'normal'",
  "perform public.s2_refresh_discussion",
]);
requireAll(authorityCleanup, "IDA-006 authority cleanup", [
  "revoke execute on function public.s6_verify_expire_discussion",
  "revoke execute on function public.s5_verify_expire_discussion",
  "drop function public.s6_verify_expire_discussion",
  "drop function public.s5_verify_expire_discussion",
]);
requireAll(app, "IDA-002 durable retry outbox", [
  "SPRINT6_AUDIO_OUTBOX_KEY",
  "flushSprint6AudioConsumptions",
  "Sprint6 audio consumption remains queued",
  "locallyConsumed=Boolean(sprint6AudioOutbox()[identity])",
]);
const localSuppressor = app.indexOf("locallyConsumed=Boolean(sprint6AudioOutbox()[identity])");
const outboxFlush = app.indexOf("await flushSprint6AudioConsumptions()", localSuppressor);
if (localSuppressor < 0 || outboxFlush < localSuppressor) {
  throw new Error("IDA-002 hydration must capture the local suppressor before flushing the outbox.");
}

requireAll(migration, "IDA-005 append-only chronology", [
  "create table public.act6_13_event_ledger",
  "act6_13_capture_s5_transition",
  "act6_13_capture_s6_transition",
  "function public.act6_13_get_timeline",
]);

if (/\b(update|delete)\s+public\.act6_13_event_ledger\b/i.test(migration)) {
  throw new Error("ACT6-13 ledger must remain append-only.");
}

console.log("Level 3 IDA-001..005 static closure checks passed.");
