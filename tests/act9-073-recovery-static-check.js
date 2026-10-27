const fs=require("node:fs");
const assert=require("node:assert/strict");
const recovery=fs.readFileSync("docs/reports/remediation/act9/073_RECOVERY_TO_072.sql","utf8");
for(const fragment of[
  "mode='normal'and p_phase='act10_discussion'",
  "mode='normal'and s.phase_key='act10_discussion'",
  "g.run_mode='normal'and d.phase_key='act10_discussion'",
  "s.phase_key='act10_discussion'and result->'discussion'is not null",
  "p_expected_phase<>'act10_discussion'",
  "update public.s6_run_state set phase_key='act10_final_vote'",
])assert.ok(recovery.includes(fragment),`Missing migration072 recovery fragment: ${fragment}`);
assert.ok(!recovery.includes("p_phase in('act9_discussion','act10_discussion')"),"Recovery retained migration073 ACT9 deadline exemption");
assert.ok(recovery.trimEnd().endsWith("commit;"),"Recovery is not transaction-bounded");
console.log("ACT9 migration073 recovery static checks passed.");
