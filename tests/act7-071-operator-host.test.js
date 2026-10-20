const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { PassThrough } = require("node:stream");
const readline = require("node:readline");
process.env.NODE_ENV = "test";

const { ADMISSION_SIGNATURES, CANDIDATE_BRANCH, CANDIDATE_COMMIT, CANDIDATE_FILES,
  ROLLBACK_BRANCH, ROLLBACK_COMMIT, ROLLBACK_FILES } = require("../scripts/act7-071-source-gates");
const { PROCEDURE, runOperatorHost } = require("../scripts/act7-071-operator-host");

const rows = ADMISSION_SIGNATURES.map((signature, index) => ({
  signature, owner: "postgres", security_definer: true, search_path: ["search_path=public"],
  raw_md5: crypto.createHash("md5").update(`raw-${index}`).digest("hex"),
  normalized_md5: crypto.createHash("md5").update(`normalized-${index}`).digest("hex"),
  acl: `{postgres=X/postgres,service_role=X/postgres,slot${index}=X/postgres}`,
  privileges: { public: index === 4, anon: index !== 3, authenticated: index !== 3,
    service_role: true, postgres: true },
}));

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object")
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return value;
}
const digest = value => crypto.createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
const blob = (commit, file) => execFileSync("git", ["show", `${commit}:${file.replace(/^\//, "")}`]);

function fileMap(commit, expected) {
  return Object.fromEntries(Object.keys(expected).map(file => [file, blob(commit, file)]));
}

function makeConfig(root, operationId) {
  const stageRows = Object.fromEntries(["freeze", "migration", "acl-restore", "recovery", "recovery-acl-restore"]
    .map(stage => [stage, [{ stage, verified: true }]]));
  const receiptPlan = {};
  for (const [index, stage] of ["freeze", "migration", "acl-restore"].entries()) receiptPlan[stage] = {
    chain: "attempt", sequence: index + 1, receiptFile: path.join(root, `${stage}.json`),
    corroborationQuerySha256: crypto.createHash("sha256").update(`query-${stage}`).digest("hex"),
    corroborationSha256: digest(stageRows[stage]),
  };
  for (const [index, stage] of ["recovery", "recovery-acl-restore"].entries()) receiptPlan[stage] = {
    chain: "recovery", sequence: index + 1, receiptFile: path.join(root, `${stage}.json`),
    corroborationQuerySha256: crypto.createHash("sha256").update(`query-${stage}`).digest("hex"),
    corroborationSha256: digest(stageRows[stage]),
  };
  return {
    config: { schema: "gal.act7-071.operator-host.v1", operationId,
      files: { prefreeze: path.join(root, "prefreeze.json"), preMutationNetwork: path.join(root, "pre-network.json"),
        candidate: path.join(root, "candidate.json"), fixtureNetwork: path.join(root, "fixture-network.json"),
        rollbackProof: path.join(root, "rollback.json") }, receiptPlan },
    stageRows,
  };
}

async function exercise({ failCandidate }) {
  const root = await fs.mkdtemp(path.join(process.cwd(), ".act7-071-host-test-"));
  const operationId = `host-${failCandidate ? "recovery" : "success"}`;
  const { config, stageRows } = makeConfig(root, operationId);
  const input = new PassThrough();
  const output = new PassThrough();
  const candidateBytes = fileMap(CANDIDATE_COMMIT, CANDIDATE_FILES);
  const rollbackBytes = fileMap(ROLLBACK_COMMIT, ROLLBACK_FILES);
  let proofBranch = null;
  let fixtureCalls = 0;
  const env = { ...process.env, ACT7_071_EXECUTION_CONTEXT_ID: operationId,
    ACT7_071_PRODUCTION_AUTHORIZED: "YES", ACT7_071_EVIDENCE_PAUSE: "YES" };
  const githubFetch = async url => {
    const id = String(url).split("/").pop();
    proofBranch = id === "456" ? ROLLBACK_BRANCH : CANDIDATE_BRANCH;
    return { status: 200, json: async () => ({ id: Number(id), name: "pages build and deployment",
      head_branch: proofBranch, head_sha: proofBranch === ROLLBACK_BRANCH ? ROLLBACK_COMMIT : CANDIDATE_COMMIT,
      status: "completed", conclusion: failCandidate && id === "123" ? "failure" : "success" }) };
  };
  const publicFetch = async url => {
    const pathname = new URL(url).pathname.replace("/GAL-Escape-Castle", "");
    const bytes = (proofBranch === ROLLBACK_BRANCH ? rollbackBytes : candidateBytes)[pathname];
    return { status: 200, url, arrayBuffer: async () => bytes };
  };
  let sequence = 0;
  const reader = readline.createInterface({ input: output, crlfDelay: Infinity });
  reader.on("line", line => {
    const message = JSON.parse(line);
    if (message.type !== "operator_request") return;
    let result;
    if (message.kind === "capture_admission_catalog") result = rows;
    if (message.kind === "pages_selection") result = { branch: message.payload.branch,
      folder: message.payload.folder, deploymentRunId: message.payload.branch === ROLLBACK_BRANCH ? 456 : 123,
      acknowledgement: `${message.payload.branch === ROLLBACK_BRANCH ? "PAGES_ROLLBACK_SAVED" : "PAGES_CANDIDATE_SAVED"}: mock` };
    if (message.kind === "external_sql_evidence") {
      sequence += 1;
      const stage = message.payload.stage;
      result = { operatorAvailable: true, response: { success: true, mock: true },
        responseCapturedAt: new Date(Date.UTC(2026, 9, 20, 20, 0, sequence * 2)).toISOString(),
        corroborationRows: stageRows[stage],
        corroborationCapturedAt: new Date(Date.UTC(2026, 9, 20, 20, 0, sequence * 2 + 1)).toISOString(),
        operatorConfirmation: "MOCK_EXTERNAL_PROCEDURE_CAPTURED",
        responseTranscriptRef: `mock-${stage}-response`, corroborationTranscriptRef: `mock-${stage}-readback` };
    }
    input.write(`${JSON.stringify({ type: "operator_response", procedure: PROCEDURE, operation_id: operationId,
      request_id: message.request_id, approved: true, result })}\n`);
  });
  const promise = runOperatorHost({ config, env, input, output, probeFetch: async () => ({ status: 401 }),
    githubFetch, publicFetch, fixtureRunner: async () => { fixtureCalls += 1; return { ok: true, mock: true }; } });
  if (failCandidate) await assert.rejects(promise, /fail-closed recovery completed/);
  else assert.deepEqual(await promise, { ok: true, mock: true });
  assert.equal(fixtureCalls, failCandidate ? 0 : 1);
  if (failCandidate) assert.equal(JSON.parse(await fs.readFile(config.files.rollbackProof, "utf8")).deployment.branch, ROLLBACK_BRANCH);
  else assert.equal(JSON.parse(await fs.readFile(config.files.candidate, "utf8")).deployment.branch, CANDIDATE_BRANCH);
  reader.close(); input.destroy(); output.destroy();
  await fs.rm(root, { recursive: true, force: true });
}

async function main() {
  await exercise({ failCandidate: false });
  await exercise({ failCandidate: true });
  console.log("ACT7 071 operator host tests passed.");
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
