const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const {
  ROLLBACK_BRANCH,
  comparePostRecovery,
  executionContext,
  persistAndValidateExternalSqlStage,
  runGuardedAttempt,
  verifyRollbackPublicBytes,
} = require("./act7-071-source-gates");

const ROOT = path.resolve(__dirname, "..");
const MIGRATION = Object.freeze({
  name: "071 migration",
  path: path.join(ROOT, "database/071_act7_v4_normal_teacher_paced_vote.sql"),
  sha256: "933f8e210ad0e24daf8c944f1b43c817d71fe8f28fa0ecf87461e19e285e7401",
});
const RECOVERY = Object.freeze({
  name: "071 recovery",
  path: path.join(ROOT, "docs/reports/remediation/act7/071_RECOVERY.sql"),
  sha256: "335187913459ec322d4dd1efb140a147e431b2d25c54f4a884220623cccf0fcd",
});
const FREEZE_SQL = `begin;
revoke execute on function public.s1_create_room(text,text,text,text,text) from public, anon, authenticated, service_role;
revoke execute on function public.s1_join_player(text,text) from public, anon, authenticated, service_role;
revoke execute on function public.s9_start_formal_game(text,text,text) from public, anon, authenticated, service_role;
revoke execute on function public.s1_reset_room(text,text) from public, anon, authenticated, service_role;
revoke execute on function public.s3b_initialize_flow(text,text) from public, anon, authenticated, service_role;
revoke execute on function public.s2_start_run(text,text,text) from public, anon, authenticated, service_role;
commit;`;
const RESTORE_SQL = `begin;
grant execute on function public.s1_create_room(text,text,text,text,text) to anon, authenticated, service_role;
grant execute on function public.s1_join_player(text,text) to anon, authenticated, service_role;
grant execute on function public.s9_start_formal_game(text,text,text) to anon, authenticated, service_role;
grant execute on function public.s1_reset_room(text,text) to anon, authenticated, service_role;
grant execute on function public.s3b_initialize_flow(text,text) to public, anon, authenticated, service_role;
grant execute on function public.s2_start_run(text,text,text) to service_role;
commit;`;

function invariant(value, message) { if (!value) throw new Error(message); }
async function pinnedSql(spec) {
  const sql = await fs.readFile(spec.path, "utf8");
  invariant(crypto.createHash("sha256").update(sql).digest("hex") === spec.sha256,
    `${spec.name} source hash changed; refuse production execution`);
  return sql;
}
function requireOperator(operator) {
  for (const name of ["captureAdmissionCatalog", "awaitExternalSqlEvidence", "awaitPagesSelection", "runControlledFixture"])
    invariant(typeof operator?.[name] === "function", `071 production adapter requires operator.${name}`);
}

async function run071ProductionAdapter({ operator, env = process.env, files, deploymentRunId,
  rollbackDeploymentRunId, receiptPlan, probeFetch = fetch, githubFetch = fetch, publicFetch = fetch }) {
  requireOperator(operator);
  invariant(env.ACT7_071_PRODUCTION_AUTHORIZED === "YES",
    "Separate Teacher production authorization is required");
  invariant(files?.prefreeze && files?.preMutationNetwork && files?.candidate && files?.fixtureNetwork
    && files?.rollbackProof, "All durable 071 evidence paths are required");
  const [migrationSql, recoverySql, rows] = await Promise.all([
    pinnedSql(MIGRATION), pinnedSql(RECOVERY), operator.captureAdmissionCatalog(),
  ]);
  const startVisibleFingerprint = executionContext(env).visible_fingerprint;
  const attemptReceipts = [];
  const recoveryReceipts = [];
  const stageSql = { freeze: FREEZE_SQL, migration: migrationSql, "acl-restore": RESTORE_SQL,
    recovery: recoverySql, "recovery-acl-restore": RESTORE_SQL };
  const recordSqlStage = async ({ stage, name, sql, chain }) => {
    const plan = receiptPlan?.[stage];
    invariant(plan?.receiptFile && plan?.corroborationQuerySha256 && plan?.corroborationSha256,
      `071 adapter requires receipt plan for ${stage}`);
    const statementSha256 = crypto.createHash("sha256").update(sql).digest("hex");
    const evidence = await operator.awaitExternalSqlEvidence({ stage, name, sql, statementSha256,
      operationId: env.ACT7_071_EXECUTION_CONTEXT_ID, corroborationQuerySha256: plan.corroborationQuerySha256,
      humanRequired: true });
    const expectedStages = Object.entries(receiptPlan).filter(([, value]) => value.chain === chain)
      .sort((a, b) => a[1].sequence - b[1].sequence).map(([expectedStage, value]) => ({ stage: expectedStage,
        statementSha256: crypto.createHash("sha256").update(stageSql[expectedStage]).digest("hex"),
        corroborationQuerySha256: value.corroborationQuerySha256,
        corroborationSha256: value.corroborationSha256 }));
    invariant(expectedStages.every(item => /^[0-9a-f]{64}$/.test(item.statementSha256 || "")),
      `071 adapter receipt plan has unpinned SQL digest for ${chain}`);
    return persistAndValidateExternalSqlStage({ evidence: { ...evidence, stage, statementSha256,
      corroborationQuerySha256: plan.corroborationQuerySha256 }, receiptFile: plan.receiptFile,
      completedFiles: chain === "attempt" ? attemptReceipts : recoveryReceipts, expectedStages,
      operationId: env.ACT7_071_EXECUTION_CONTEXT_ID, env, startVisibleFingerprint,
      operatorAvailable: evidence?.operatorAvailable === true });
  };
  return runGuardedAttempt({
    env, rows, prefreezeFile: files.prefreeze, preMutationNetworkFile: files.preMutationNetwork,
    candidateFile: files.candidate, fixtureNetworkFile: files.fixtureNetwork, deploymentRunId,
    probeFetch, githubFetch, publicFetch,
    executeFreeze: () => recordSqlStage({ stage: "freeze", name: "071-admission-freeze", sql: FREEZE_SQL, chain: "attempt" }),
    applyMigration: () => recordSqlStage({ stage: "migration", name: MIGRATION.name, sql: migrationSql, chain: "attempt" }),
    requestCandidatePagesSwitch: request => operator.awaitPagesSelection({ ...request,
      humanRequired: true, acknowledgement: "PAGES_CANDIDATE_SAVED: <timestamp>" }),
    restoreAdmissionAcl: () => recordSqlStage({ stage: "acl-restore", name: "071-admission-restore", sql: RESTORE_SQL, chain: "attempt" }),
    runFixture: context => operator.runControlledFixture(context),
    recoverAfterFreeze: async ({ boundary, cause, snapshot }) => {
      const rollbackAcknowledgement = await operator.awaitPagesSelection({ branch: ROLLBACK_BRANCH, folder: "/(root)", humanRequired: true,
        acknowledgement: "PAGES_ROLLBACK_SAVED: <timestamp>", recoveryOfBoundary: boundary,
        failure: String(cause?.message || cause) });
      await verifyRollbackPublicBytes({ outputFile: files.rollbackProof, githubFetch, publicFetch,
        deploymentRunId: rollbackAcknowledgement?.deploymentRunId ?? rollbackDeploymentRunId,
        operationId: env.ACT7_071_EXECUTION_CONTEXT_ID });
      await recordSqlStage({ stage: "recovery", name: RECOVERY.name, sql: recoverySql, chain: "recovery" });
      await recordSqlStage({ stage: "recovery-acl-restore", name: "071-admission-restore", sql: RESTORE_SQL, chain: "recovery" });
      const recoveredRows = await operator.captureAdmissionCatalog();
      await comparePostRecovery(files.prefreeze, recoveredRows);
      return { recovered: true, boundary, snapshot_sha256: snapshot.sha256 };
    },
  });
}

module.exports = { FREEZE_SQL, MIGRATION, RECOVERY, RESTORE_SQL, run071ProductionAdapter };

if (require.main === module) {
  throw new Error("071 adapter has no standalone CLI. Invoke run071ProductionAdapter from an explicitly authorized operator host; Pages selections are human-only.");
}
