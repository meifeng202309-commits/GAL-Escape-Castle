const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const {
  ROLLBACK_BRANCH,
  comparePostRecovery,
  runGuardedAttempt,
  verifyRollbackPublicBytes,
} = require("./act7-071-source-gates");

const ROOT = path.resolve(__dirname, "..");
const MIGRATION = Object.freeze({
  name: "071 migration",
  path: path.join(ROOT, "database/071_act7_v4_normal_teacher_paced_vote.sql"),
  sha256: "720cb598d7ead56d3ed1ff53bcf7d62af94f795357efe7e60ef1bff504b0ab04",
});
const RECOVERY = Object.freeze({
  name: "071 recovery",
  path: path.join(ROOT, "docs/reports/remediation/act7/071_RECOVERY.sql"),
  sha256: "e7e74f16885c730ef10d4f577420be486d8d07a774d2d9b43a97ec8a66eff683",
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
  for (const name of ["captureAdmissionCatalog", "executeExactSql", "awaitPagesSelection", "runControlledFixture"])
    invariant(typeof operator?.[name] === "function", `071 production adapter requires operator.${name}`);
}

async function run071ProductionAdapter({ operator, env = process.env, files, deploymentRunId,
  rollbackDeploymentRunId, probeFetch = fetch, githubFetch = fetch, publicFetch = fetch }) {
  requireOperator(operator);
  invariant(env.ACT7_071_PRODUCTION_AUTHORIZED === "YES",
    "Separate Teacher production authorization is required");
  invariant(files?.prefreeze && files?.preMutationNetwork && files?.candidate && files?.fixtureNetwork
    && files?.rollbackProof, "All durable 071 evidence paths are required");
  const [migrationSql, recoverySql, rows] = await Promise.all([
    pinnedSql(MIGRATION), pinnedSql(RECOVERY), operator.captureAdmissionCatalog(),
  ]);
  return runGuardedAttempt({
    env, rows, prefreezeFile: files.prefreeze, preMutationNetworkFile: files.preMutationNetwork,
    candidateFile: files.candidate, fixtureNetworkFile: files.fixtureNetwork, deploymentRunId,
    probeFetch, githubFetch, publicFetch,
    executeFreeze: () => operator.executeExactSql({ name: "071-admission-freeze", sql: FREEZE_SQL }),
    applyMigration: () => operator.executeExactSql({ name: MIGRATION.name, sha256: MIGRATION.sha256, sql: migrationSql }),
    requestCandidatePagesSwitch: request => operator.awaitPagesSelection({ ...request,
      humanRequired: true, acknowledgement: "PAGES_CANDIDATE_SAVED: <timestamp>" }),
    restoreAdmissionAcl: () => operator.executeExactSql({ name: "071-admission-restore", sql: RESTORE_SQL }),
    runFixture: context => operator.runControlledFixture(context),
    recoverAfterFreeze: async ({ boundary, cause, snapshot }) => {
      await operator.awaitPagesSelection({ branch: ROLLBACK_BRANCH, folder: "/(root)", humanRequired: true,
        acknowledgement: "PAGES_ROLLBACK_SAVED: <timestamp>", recoveryOfBoundary: boundary,
        failure: String(cause?.message || cause) });
      await verifyRollbackPublicBytes({ outputFile: files.rollbackProof, githubFetch, publicFetch,
        deploymentRunId: rollbackDeploymentRunId, operationId: env.ACT7_071_EXECUTION_CONTEXT_ID });
      await operator.executeExactSql({ name: RECOVERY.name, sha256: RECOVERY.sha256, sql: recoverySql });
      await operator.executeExactSql({ name: "071-admission-restore", sql: RESTORE_SQL });
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
