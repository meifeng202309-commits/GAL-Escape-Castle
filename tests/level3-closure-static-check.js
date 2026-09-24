const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const migration = fs.readFileSync(path.join(root, "database/037_level3_independent_audit_closure.sql"), "utf8");
const triggerFix = fs.readFileSync(path.join(root, "database/038_level3_cross_sprint_trigger_fix.sql"), "utf8");
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
