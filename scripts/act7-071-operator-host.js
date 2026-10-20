const fs = require("node:fs/promises");
const crypto = require("node:crypto");
const readline = require("node:readline");
const { run071ProductionAdapter } = require("./act7-071-production-adapter");
const { executionContext } = require("./act7-071-source-gates");

const PROCEDURE = "CD_EXTERNAL_OPERATOR_V1";

function invariant(value, message) { if (!value) throw new Error(message); }

function createProcedureBridge({ input = process.stdin, output = process.stdout, operationId }) {
  invariant(operationId, "Operator bridge requires an operation ID");
  const pending = new Map();
  const lines = readline.createInterface({ input, crlfDelay: Infinity });
  const write = value => output.write(`${JSON.stringify(value)}\n`);
  lines.on("line", line => {
    let message;
    try { message = JSON.parse(line); } catch { return; }
    if (message?.type !== "operator_response" || message.procedure !== PROCEDURE
      || message.operation_id !== operationId || message.approved !== true) return;
    const waiter = pending.get(message.request_id);
    if (!waiter) return;
    pending.delete(message.request_id);
    waiter.resolve(message.result);
  });
  lines.on("close", () => {
    for (const waiter of pending.values()) waiter.reject(new Error("Operator bridge closed with a pending request"));
    pending.clear();
  });
  async function request(kind, payload) {
    invariant(pending.size === 0, "Operator bridge allows only one ordered pending request");
    const requestId = crypto.randomUUID();
    const response = new Promise((resolve, reject) => pending.set(requestId, { resolve, reject }));
    write({ type: "operator_request", procedure: PROCEDURE, operation_id: operationId,
      request_id: requestId, kind, payload });
    return response;
  }
  return { request, close: () => lines.close(), write };
}

async function runOperatorHost({ config, env = process.env, input, output, adapter = run071ProductionAdapter,
  probeFetch = fetch, githubFetch = fetch, publicFetch = fetch, fixtureRunner }) {
  invariant(config?.schema === "gal.act7-071.operator-host.v1", "Invalid operator-host config schema");
  invariant(env.ACT7_071_EXECUTION_CONTEXT_ID === config.operationId, "Config and environment operation IDs differ");
  const bridge = createProcedureBridge({ input, output, operationId: config.operationId });
  const context = executionContext(env);
  bridge.write({ type: "host_ready", procedure: PROCEDURE, operation_id: config.operationId,
    visible_fingerprint: context.visible_fingerprint, production_authorized: env.ACT7_071_PRODUCTION_AUTHORIZED === "YES" });
  const operator = {
    async captureAdmissionCatalog() {
      const rows = await bridge.request("capture_admission_catalog", {});
      invariant(Array.isArray(rows), "Catalog response must be an array");
      return rows;
    },
    async awaitExternalSqlEvidence(request) {
      const evidence = await bridge.request("external_sql_evidence", request);
      invariant(evidence?.operatorAvailable === true, "External SQL operator is unavailable");
      return evidence;
    },
    async awaitPagesSelection(request) {
      const result = await bridge.request("pages_selection", request);
      invariant(result?.branch === request.branch && result?.folder === request.folder,
        "Pages acknowledgement does not match the requested branch/folder");
      invariant(/^\d+$/.test(String(result.deploymentRunId || "")), "Pages acknowledgement requires a workflow run ID");
      invariant(String(result.acknowledgement || "").trim(), "Pages acknowledgement text is absent");
      return result;
    },
    async runControlledFixture(contextValue) {
      invariant(typeof fixtureRunner === "function", "Controlled fixture runner is unavailable in this host");
      return fixtureRunner(contextValue);
    },
  };
  try {
    const result = await adapter({ operator, env, files: config.files, receiptPlan: config.receiptPlan,
      deploymentRunId: config.deploymentRunId, rollbackDeploymentRunId: config.rollbackDeploymentRunId,
      probeFetch, githubFetch, publicFetch });
    bridge.write({ type: "host_complete", operation_id: config.operationId, result });
    return result;
  } catch (error) {
    bridge.write({ type: "host_failed", operation_id: config.operationId, error: String(error?.message || error) });
    throw error;
  } finally {
    bridge.close();
  }
}

async function cli() {
  const configPath = process.argv[2];
  invariant(configPath && process.argv.length === 3, "Usage: node scripts/act7-071-operator-host.js <config.json>");
  const config = JSON.parse(await fs.readFile(configPath, "utf8"));
  const fixtureRunner = async context => {
    invariant(envProductionAuthorized(), "Live fixture is unavailable without explicit production authorization");
    return require("../tests/act7-071-controlled-acceptance").runCoordinatedAcceptance(context);
  };
  await runOperatorHost({ config, fixtureRunner });
}

function envProductionAuthorized(env = process.env) {
  return env.ACT7_071_PRODUCTION_AUTHORIZED === "YES" && env.ACT7_071_EVIDENCE_PAUSE === "YES";
}

module.exports = { PROCEDURE, createProcedureBridge, envProductionAuthorized, runOperatorHost };

if (require.main === module) cli().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
