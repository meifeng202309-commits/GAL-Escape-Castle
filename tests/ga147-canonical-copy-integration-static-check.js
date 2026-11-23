const fs=require("fs");
const assert=(value,message)=>{if(!value)throw new Error(message)};
const sql=fs.readFileSync("database/077_ga147_castle_voice_and_runtime_callers.sql","utf8");
const phaseGuard=fs.readFileSync("database/078_ca327_castle_voice_phase_guard.sql","utf8");
const consumerIntegration=fs.readFileSync("database/079_ca347_runtime_consumer_integration.sql","utf8");
const app=fs.readFileSync("src/game/app.js","utf8");
const bundle=fs.readFileSync("src/content/localization.generated.js","utf8");

for(const token of[
  "castle_voice_heard_at timestamptz",
  "act6_voice_intro_ack_at timestamptz",
  "player.role_slot='GAL-A'",
  '["act01-a.014","act01-g.005","act01-a.014b"]',
  "runtime.castle_voice.first_audible",
  "runtime.castle_voice.returning",
  "s10_ack_castle_voice_intro",
  "Castle Voice introduction must be acknowledged before ACT 6 voting.",
  "All players must acknowledge the Castle Voice introduction before leaving ACT 6.",
  "s5_submit_vote_pre077",
  "s5_advance_pre077",
  "run.run_id<>p_expected_run_id",
  "s.phase_key not like'act6%'",
  "Castle Voice player progress is unavailable."
])assert(sql.includes(token),`GA147 database contract missing: ${token}`);

for(const token of[
  "s10_ack_castle_voice_intro_pre078",
  "state.act6_entered_at is null",
  "progress.act6_entered_at is null",
  "Castle Voice introduction is unavailable."
])assert(phaseGuard.includes(token),`CA327 ACT6 phase guard missing: ${token}`);
assert(!/\b(delete|truncate)\b/i.test(phaseGuard),"CA327 phase guard must not delete gameplay history");
for(const token of[
  "s3b_submit_act1_choice_pre079",
  "p_choice_id='check_phone'",
  `'["act01-a.014","act01-g.005"]'::jsonb`
])assert(consumerIntegration.includes(token),`CA347 Runtime consumer integration missing: ${token}`);

for(const token of[
  'scene.phase_key==="route_consequence"&&scene.current_route_target==="main_gate"',
  'localizedKeys(["act02.043","act02.044","act02.045"])',
  'payload.castle_voice_intro_acknowledged',
  'data-s5-rpc="s10_ack_castle_voice_intro"',
  'payload.p_expected_run_id=button.dataset.s5Run'
])assert(app.includes(token),`GA147 player caller missing: ${token}`);
assert(app.includes('<span class="localized-line" lang="nl">'),"Canonical Runtime spans do not preserve approved line breaks");
assert(!app.includes('${localizedHtml("common.004")}</button>${actions}'),"ACT6 progression controls remain visible before Voice acknowledgement");

for(const key of[
  '"act01-a.014b"',
  '"runtime.castle_voice.first_audible"',
  '"runtime.castle_voice.returning"',
  '"act02.043"',
  '"act02.044"',
  '"act02.045"'
])assert(bundle.includes(key),`GA147 protected-copy bundle key missing: ${key}`);

console.log("GA147 canonical copy integration static checks passed.");
