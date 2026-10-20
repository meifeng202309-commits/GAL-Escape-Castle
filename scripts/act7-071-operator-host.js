const fs = require("node:fs/promises");
const crypto = require("node:crypto");
const readline = require("node:readline");
const { run071ProductionAdapter } = require("./act7-071-production-adapter");
const { comparePostRecovery, executionContext, persistPreFreezeSnapshot, probeSupabaseNetwork,
  verifyRollbackPublicBytes } = require("./act7-071-source-gates");

const PROCEDURE = "CD_EXTERNAL_OPERATOR_V1";
const MIN_RESPONSE_TIMEOUT_MS = 100;
const MAX_RESPONSE_TIMEOUT_MS = 900000;

function invariant(value, message) { if (!value) throw new Error(message); }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object")
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return value;
}
const digest = value => crypto.createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
async function writeAtomic(file, value) {
  await fs.mkdir(require("node:path").dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
  await fs.rename(temporary, file);
}

function createProcedureBridge({ input = process.stdin, output = process.stdout, operationId, responseTimeoutMs = 300000 }) {
  invariant(operationId, "Operator bridge requires an operation ID");
  invariant(Number.isInteger(responseTimeoutMs) && responseTimeoutMs >= MIN_RESPONSE_TIMEOUT_MS
    && responseTimeoutMs <= MAX_RESPONSE_TIMEOUT_MS,
  `Operator response timeout must be ${MIN_RESPONSE_TIMEOUT_MS}-${MAX_RESPONSE_TIMEOUT_MS} ms`);
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
    clearTimeout(waiter.timeout);
    waiter.resolve(message.result);
  });
  lines.on("close", () => {
    for (const waiter of pending.values()) {
      clearTimeout(waiter.timeout);
      waiter.reject(new Error("Operator bridge closed with a pending request; rollback is not verified"));
    }
    pending.clear();
  });
  async function request(kind, payload) {
    invariant(pending.size === 0, "Operator bridge allows only one ordered pending request");
    const requestId = crypto.randomUUID();
    const response = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(requestId);
        reject(new Error(`Operator response timeout at ${kind}; rollback is not verified`));
      }, responseTimeoutMs);
      pending.set(requestId, { resolve, reject, timeout });
    });
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
  const bridge = createProcedureBridge({ input, output, operationId: config.operationId,
    responseTimeoutMs: config.operatorResponseTimeoutMs });
  const context = executionContext(env);
  bridge.write({ type: "host_ready", procedure: PROCEDURE, operation_id: config.operationId,
    pid: process.pid, visible_fingerprint: context.visible_fingerprint,
    read_only_drill: config.readOnlyDrill === true,
    production_authorized: env.ACT7_071_PRODUCTION_AUTHORIZED === "YES" });
  if (config.readOnlyDrill === true) {
    try {
      invariant(!envProductionAuthorized(env) && env.ACT7_071_PRODUCTION_AUTHORIZED !== "YES"
        && env.ACT7_071_EVIDENCE_PAUSE !== "YES", "Read-only drill rejects every production authorization flag");
      const files = config.readOnlyFiles;
      invariant(files?.catalogSnapshot && files?.drillReceipt && files?.networkProof && files?.rollbackProof,
        "Read-only drill requires all evidence paths");
      const primary = await bridge.request("catalog_read_primary", { read_only: true });
      const primaryTime = Date.parse(primary?.capturedAt);
      invariant(Array.isArray(primary?.rows) && String(primary?.transcriptRef || "").trim()
        && String(primary?.operatorConfirmation || "").trim() && Number.isFinite(primaryTime),
      "Primary catalog evidence is incomplete");
      const snapshot = await persistPreFreezeSnapshot(primary.rows, files.catalogSnapshot,
        new Date(primaryTime), config.operationId);
      const readback = await bridge.request("catalog_readback", { read_only: true,
        primary_transcript_ref: primary.transcriptRef });
      const readbackTime = Date.parse(readback?.capturedAt);
      invariant(Array.isArray(readback?.rows) && String(readback?.transcriptRef || "").trim()
        && readback.transcriptRef !== primary.transcriptRef && String(readback?.operatorConfirmation || "").trim()
        && Number.isFinite(readbackTime) && readbackTime >= primaryTime,
      "Independent catalog readback evidence is incomplete or unordered");
      await comparePostRecovery(files.catalogSnapshot, readback.rows);
      await probeSupabaseNetwork({ url: "https://qdcbdcjobzytzhnhfwyn.supabase.co",
        outputFile: files.networkProof, env, fetchImpl: probeFetch });
      const pages = await bridge.request("pages_readonly_proof", { read_only: true,
        branch: "deploy/manual-acceptance-20261003", folder: "/(root)" });
      invariant(pages?.branch === "deploy/manual-acceptance-20261003" && pages?.folder === "/(root)"
        && /^\d+$/.test(String(pages?.deploymentRunId || "")), "Read-only Pages proof target is invalid");
      const rollback = await verifyRollbackPublicBytes({ outputFile: files.rollbackProof, githubFetch, publicFetch,
        deploymentRunId: pages.deploymentRunId, operationId: config.operationId });
      const unsigned = { schema: "gal.act7-071.readonly-drill.v1", operation_id: config.operationId,
        completed_at: new Date().toISOString(), pid: process.pid, visible_fingerprint: context.visible_fingerprint,
        requests: { primary: primary.transcriptRef, readback: readback.transcriptRef },
        captured_at: { primary: new Date(primaryTime).toISOString(), readback: new Date(readbackTime).toISOString() },
        catalog_snapshot_sha256: snapshot.sha256, catalog_readback_sha256: digest(readback.rows),
        network_proof: files.networkProof, rollback_proof_sha256: rollback.sha256 };
      const receipt = { ...unsigned, sha256: digest(unsigned) };
      await writeAtomic(files.drillReceipt, receipt);
      bridge.write({ type: "readonly_drill_complete", operation_id: config.operationId, receipt });
      return receipt;
    } catch (error) {
      bridge.write({ type: "readonly_drill_failed", operation_id: config.operationId,
        error: String(error?.message || error), mutation_performed: false });
      throw error;
    } finally {
      bridge.close();
    }
  }
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
    if (error instanceof AggregateError) bridge.write({ type: "host_incident", operation_id: config.operationId,
      rollback_verified: false, production_state: "UNKNOWN_REQUIRES_MANUAL_INCIDENT_RESPONSE",
      error: String(error?.message || error), causes: [...error.errors].map(item => String(item?.message || item)) });
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
  let overrides = {};
  if (process.env.NODE_ENV === "test" && process.env.ACT7_071_HOST_TEST_DRIVER)
    overrides = await require(process.env.ACT7_071_HOST_TEST_DRIVER)(config);
  const fixtureRunner = overrides.fixtureRunner || (async context => {
    invariant(envProductionAuthorized(), "Live fixture is unavailable without explicit production authorization");
    return require("../tests/act7-071-controlled-acceptance").runCoordinatedAcceptance(context);
  });
  await runOperatorHost({ config, fixtureRunner, ...overrides });
}

function envProductionAuthorized(env = process.env) {
  return env.ACT7_071_PRODUCTION_AUTHORIZED === "YES" && env.ACT7_071_EVIDENCE_PAUSE === "YES";
}

module.exports = { PROCEDURE, MIN_RESPONSE_TIMEOUT_MS, MAX_RESPONSE_TIMEOUT_MS,
  createProcedureBridge, envProductionAuthorized, runOperatorHost };

if (require.main === module) cli().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
