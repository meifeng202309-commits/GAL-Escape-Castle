const fs = require("node:fs/promises");
const crypto = require("node:crypto");
const path = require("node:path");

const SCHEMA = "gal.act7-071.gate.v1";
const CANDIDATE_COMMIT = "6e3bbd1d2795bd4486b1437a0b9e107e2238fa28";
const CANDIDATE_BRANCH = "deploy/act7-071-20261017";
const PUBLIC_BASE_URL = "https://meifeng202309-commits.github.io/GAL-Escape-Castle";
const GITHUB_RUN_API_PREFIX = "https://api.github.com/repos/meifeng202309-commits/GAL-Escape-Castle/actions/runs/";
const ADMISSION_SIGNATURES = [
  "s1_create_room(text,text,text,text,text)",
  "s1_join_player(text,text)",
  "s1_reset_room(text,text)",
  "s2_start_run(text,text,text)",
  "s3b_initialize_flow(text,text)",
  "s9_start_formal_game(text,text,text)",
];
const CANDIDATE_FILES = Object.freeze({
  "/index.html": "1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4",
  "/teacher.html": "628bb101a23e312d5f69d992d0c1212665350a130f1c124af04460b1afdb6cf3",
  "/src/game/app.js": "9f19c27f92be9835ea5d9b48e196803dcee85eae032feb0f9e65fe3e97b323fa",
  "/src/teacher/teacher-console.js": "4dd355ede45e5e29619da93becb5c0e47d2e9f93c9cf544edc20e876181df1ad",
  "/src/styles/app.css": "3a375c87aeec797e2b32f8ba383d91af9ef6f9e9d01bb40cf0e3faa0f04ead7c",
});
const ROLLBACK_BRANCH = "deploy/manual-acceptance-20261003";
const ROLLBACK_COMMIT = "891feffe558a4683ac3da67e1e6b15e902c7e592";
const ROLLBACK_FILES = Object.freeze({
  "/index.html": "1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4",
  "/teacher.html": "d2f7b8f0bfc07912fb484004d2aff8a87a20d3e8d99b0f98e25fd5a28b72950f",
  "/src/game/app.js": "9f19c27f92be9835ea5d9b48e196803dcee85eae032feb0f9e65fe3e97b323fa",
  "/src/teacher/teacher-console.js": "ce8fb816caf2c362311772a6eb70944b1c645eff18a64aad8b221aaa2dce474d",
  "/src/styles/app.css": "3a375c87aeec797e2b32f8ba383d91af9ef6f9e9d01bb40cf0e3faa0f04ead7c",
});

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  }
  return value;
}
function digest(value) {
  return crypto.createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
}
function invariant(value, message) {
  if (!value) throw new Error(message);
}
async function runFailClosedSequence(stages, recoverAfterFreeze, context) {
  let boundary = "freeze";
  try {
    let value;
    for (const stage of stages) {
      boundary = stage.name;
      value = await stage.run(value);
    }
    return value;
  } catch (cause) {
    try {
      await recoverAfterFreeze({ boundary, cause, ...context });
    } catch (recoveryError) {
      throw new AggregateError([cause, recoveryError], `071 attempt failed at ${boundary}; recovery also failed`);
    }
    throw new Error(`071 attempt failed at ${boundary}; fail-closed recovery completed`, { cause });
  }
}
function normalizeSnapshotRows(rows) {
  invariant(Array.isArray(rows), "Pre-freeze catalog rows must be an array");
  const normalized = rows.map(row => ({
    signature: String(row.signature || ""),
    owner: String(row.owner || ""),
    security_definer: Boolean(row.security_definer),
    search_path: Array.isArray(row.search_path) ? [...row.search_path].map(String).sort() : [],
    raw_md5: String(row.raw_md5 || ""),
    normalized_md5: String(row.normalized_md5 || ""),
    acl: String(row.acl || ""),
    privileges: Object.fromEntries(["public", "anon", "authenticated", "service_role", "postgres"]
      .map(role => [role, Boolean(row.privileges?.[role])])),
  })).sort((a, b) => a.signature.localeCompare(b.signature));
  invariant(normalized.length === ADMISSION_SIGNATURES.length, "Pre-freeze snapshot must contain exactly six admission functions");
  invariant(JSON.stringify(normalized.map(row => row.signature)) === JSON.stringify(ADMISSION_SIGNATURES),
    "Pre-freeze snapshot signatures do not match the frozen six-function envelope");
  for (const row of normalized) {
    invariant(row.owner && row.acl && /^[0-9a-f]{32}$/.test(row.raw_md5)
      && /^[0-9a-f]{32}$/.test(row.normalized_md5), `Incomplete catalog evidence for ${row.signature}`);
  }
  return normalized;
}
async function writeAtomic(file, artifact) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(artifact, null, 2)}\n`, { flag: "wx" });
  await fs.rename(temporary, file);
}
async function writeAtomicNew(file, artifact) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  try {
    await fs.access(file);
    throw Object.assign(new Error(`EEXIST receipt already exists: ${file}`), { code: "EEXIST" });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const temporary = `${file}.${process.pid}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(artifact, null, 2)}\n`, { flag: "wx" });
  try {
    await fs.rename(temporary, file);
  } catch (error) {
    await fs.unlink(temporary).catch(() => {});
    throw error;
  }
}
async function readArtifact(file, expectedKind) {
  const artifact = JSON.parse(await fs.readFile(file, "utf8"));
  invariant(artifact.schema === SCHEMA && artifact.kind === expectedKind, `Invalid ${expectedKind} artifact schema`);
  const { sha256, ...unsigned } = artifact;
  invariant(/^[0-9a-f]{64}$/.test(sha256 || "") && digest(unsigned) === sha256,
    `${expectedKind} artifact digest mismatch`);
  return artifact;
}
async function persistPreFreezeSnapshot(rows, file, now = new Date(), operationId) {
  invariant(operationId, "Pre-freeze snapshot requires the pinned operation context ID");
  const unsigned = { schema: SCHEMA, kind: "prefreeze-catalog", operation_id: operationId, captured_at: now.toISOString(), rows: normalizeSnapshotRows(rows) };
  const artifact = { ...unsigned, sha256: digest(unsigned) };
  await writeAtomic(file, artifact);
  const reread = await readArtifact(file, "prefreeze-catalog");
  invariant(JSON.stringify(reread.rows) === JSON.stringify(artifact.rows), "Pre-freeze snapshot re-read differs from persisted rows");
  return reread;
}
async function comparePostRecovery(snapshotFile, rows) {
  const before = await readArtifact(snapshotFile, "prefreeze-catalog");
  const after = normalizeSnapshotRows(rows);
  invariant(JSON.stringify(before.rows) === JSON.stringify(after), "Post-recovery catalog does not exactly match persisted pre-freeze snapshot");
  return { ok: true, snapshot_sha256: before.sha256, compared_rows: after.length };
}
async function persistSqlStageReceipt({ outputFile, operationId, stage, sequence, previousSha256 = null,
  statementSha256, response, responseCapturedAt, corroborationQuerySha256, corroborationRows,
  corroborationCapturedAt, operatorConfirmation }) {
  invariant(operationId && stage && Number.isInteger(sequence) && sequence > 0,
    "SQL receipt requires operation ID, stage and positive sequence");
  invariant(/^[0-9a-f]{64}$/.test(statementSha256 || ""), "SQL receipt requires pinned statement SHA-256");
  invariant(sequence === 1 ? previousSha256 === null : /^[0-9a-f]{64}$/.test(previousSha256 || ""),
    "SQL receipt previous digest does not match its sequence");
  invariant(response && typeof response === "object" && Object.keys(response).length > 0,
    "SQL receipt requires durable copied connector response");
  invariant(/^[0-9a-f]{64}$/.test(corroborationQuerySha256 || "") && Array.isArray(corroborationRows)
    && corroborationRows.length > 0, "SQL receipt requires independent read-only corroboration");
  invariant(Date.parse(corroborationCapturedAt) >= Date.parse(responseCapturedAt),
    "SQL receipt corroboration predates the connector response");
  invariant(String(operatorConfirmation || "").trim(), "SQL receipt requires operator confirmation");
  const unsigned = {
    schema: SCHEMA, kind: "sql-stage-receipt", operation_id: operationId, stage, sequence,
    previous_sha256: previousSha256, statement_sha256: statementSha256,
    response_captured_at: new Date(responseCapturedAt).toISOString(), copied_connector_response: stable(response),
    copied_response_sha256: digest(response), corroboration_query_sha256: corroborationQuerySha256,
    corroboration_captured_at: new Date(corroborationCapturedAt).toISOString(),
    corroboration_rows: stable(corroborationRows), corroboration_sha256: digest(corroborationRows),
    operator_confirmation: String(operatorConfirmation),
    origin_attestation: "NOT_PROVIDED_COPY_INTEGRITY_ONLY",
  };
  const artifact = { ...unsigned, sha256: digest(unsigned) };
  await writeAtomicNew(outputFile, artifact);
  return readArtifact(outputFile, "sql-stage-receipt");
}
async function validateSqlReceiptChain({ files, expectedStages, operationId, env = process.env,
  startVisibleFingerprint, operatorAvailable }) {
  invariant(Array.isArray(files) && Array.isArray(expectedStages) && files.length === expectedStages.length
    && files.length > 0, "SQL receipt chain is incomplete");
  invariant(operatorAvailable === true, "SQL connector operator is unavailable");
  invariant(executionContext(env).visible_fingerprint === startVisibleFingerprint,
    "Visible execution context changed while awaiting SQL receipts");
  let previous = null;
  let previousTime = 0;
  const receipts = [];
  for (let index = 0; index < files.length; index++) {
    const receipt = await readArtifact(files[index], "sql-stage-receipt");
    const expected = expectedStages[index];
    invariant(receipt.operation_id === operationId && receipt.stage === expected.stage
      && receipt.sequence === index + 1, `SQL receipt order mismatch at ${expected.stage}`);
    invariant(receipt.previous_sha256 === previous, `SQL receipt chain digest mismatch at ${expected.stage}`);
    invariant(receipt.statement_sha256 === expected.statementSha256
      && receipt.corroboration_query_sha256 === expected.corroborationQuerySha256,
    `SQL receipt pinned digest mismatch at ${expected.stage}`);
    invariant(receipt.copied_response_sha256 === digest(receipt.copied_connector_response),
      `Copied connector response was altered after capture at ${expected.stage}`);
    invariant(receipt.origin_attestation === "NOT_PROVIDED_COPY_INTEGRITY_ONLY",
      `SQL receipt makes an unsupported origin claim at ${expected.stage}`);
    invariant(Array.isArray(receipt.corroboration_rows) && receipt.corroboration_rows.length > 0
      && receipt.corroboration_sha256 === digest(receipt.corroboration_rows),
    `SQL receipt independent corroboration is invalid at ${expected.stage}`);
    invariant(!expected.corroborationSha256 || receipt.corroboration_sha256 === expected.corroborationSha256,
      `SQL receipt corroboration does not match expected state at ${expected.stage}`);
    const responseTime = Date.parse(receipt.response_captured_at);
    const corroborationTime = Date.parse(receipt.corroboration_captured_at);
    invariant(Number.isFinite(responseTime) && Number.isFinite(corroborationTime)
      && responseTime >= previousTime && corroborationTime >= responseTime,
    `SQL receipt timestamps are stale or unordered at ${expected.stage}`);
    invariant(String(receipt.operator_confirmation || "").trim(),
      `SQL receipt operator confirmation missing at ${expected.stage}`);
    previous = receipt.sha256;
    previousTime = corroborationTime;
    receipts.push(receipt);
  }
  return { ok: true, operation_id: operationId, stages: receipts.map(item => item.stage), final_sha256: previous };
}
function assertWorkflowIdentity(run, { deploymentRunId, branch, commit }) {
  invariant(String(run?.id) === String(deploymentRunId)
    && run.name === "pages build and deployment"
    && run.head_branch === branch
    && run.head_sha === commit
    && run.status === "completed" && run.conclusion === "success",
  "Live GitHub workflow identity does not match the reviewed deployment");
  return { run_id: String(run.id), branch: run.head_branch, commit: run.head_sha, conclusion: run.conclusion };
}
async function verifyDeploymentPublicBytes({ outputFile, githubFetch = fetch, publicFetch = fetch, now = new Date(), deploymentRunId,
  operationId, branch, commit, expectedFiles, kind }) {
  invariant(operationId, "Candidate public-byte proof requires the pinned operation context ID");
  invariant(/^\d+$/.test(String(deploymentRunId || "")), "Candidate workflow run ID must be numeric");
  const runResponse = await githubFetch(`${GITHUB_RUN_API_PREFIX}${deploymentRunId}`, { method: "GET", cache: "no-store" });
  invariant(runResponse.status === 200, `Candidate workflow identity lookup failed HTTP ${runResponse.status}`);
  const run = await runResponse.json();
  const deployment = assertWorkflowIdentity(run, { deploymentRunId, branch, commit });
  const files = [];
  for (const [filePath, expected] of Object.entries(expectedFiles)) {
    const url = `${PUBLIC_BASE_URL}${filePath}?act7_071=${now.getTime()}`;
    const response = await publicFetch(url, { method: "GET", cache: "no-store", redirect: "follow" });
    const finalUrl = new URL(response.url || url);
    const expectedUrl = new URL(url);
    const bytes = Buffer.from(await response.arrayBuffer());
    const actual = crypto.createHash("sha256").update(bytes).digest("hex");
    invariant(finalUrl.origin === expectedUrl.origin && finalUrl.pathname === expectedUrl.pathname,
      `Candidate public response escaped the reviewed origin/path: ${filePath}`);
    invariant(response.status === 200, `Candidate public byte gate failed HTTP ${response.status}: ${filePath}`);
    invariant(actual === expected, `Candidate public byte hash mismatch: ${filePath}`);
    files.push({ path: filePath, url, status: response.status, byte_length: bytes.length, sha256: actual });
  }
  const unsigned = { schema: SCHEMA, kind, operation_id: operationId, verified_at: now.toISOString(), deployment, files };
  const artifact = { ...unsigned, sha256: digest(unsigned) };
  await writeAtomic(outputFile, artifact);
  return readArtifact(outputFile, kind);
}
async function verifyCandidatePublicBytes(options) {
  return verifyDeploymentPublicBytes({ ...options, branch: CANDIDATE_BRANCH, commit: CANDIDATE_COMMIT,
    expectedFiles: CANDIDATE_FILES, kind: "candidate-public-bytes" });
}
async function verifyRollbackPublicBytes(options) {
  return verifyDeploymentPublicBytes({ ...options, branch: ROLLBACK_BRANCH, commit: ROLLBACK_COMMIT,
    expectedFiles: ROLLBACK_FILES, kind: "rollback-public-bytes" });
}
function executionContext(env = process.env) {
  invariant(env.ACT7_071_EXECUTION_CONTEXT_ID, "ACT7_071_EXECUTION_CONTEXT_ID is required");
  const visible = {
    context_id: env.ACT7_071_EXECUTION_CONTEXT_ID,
    exec_path: process.execPath,
    exec_argv: process.execArgv,
    platform: process.platform,
    arch: process.arch,
    cwd: process.cwd(),
  };
  return { ...visible, visible_fingerprint: digest(visible) };
}
async function probeSupabaseNetwork({ url, outputFile, env = process.env, fetchImpl = fetch, now = new Date() }) {
  const context = executionContext(env);
  let response;
  try {
    response = await fetchImpl(`${String(url).replace(/\/$/, "")}/rest/v1/`, { method: "GET", cache: "no-store" });
  } catch (error) {
    const cause = error.cause || error;
    throw new Error(`Supabase network probe failed code=${cause.code || "UNKNOWN"} syscall=${cause.syscall || "UNKNOWN"} hostname=${cause.hostname || "UNKNOWN"}`, { cause: error });
  }
  invariant(Number.isInteger(response.status) && response.status >= 100,
    "Supabase network probe did not receive an HTTP response");
  const unsigned = { schema: SCHEMA, kind: "fixture-network", probed_at: now.toISOString(), url, status: response.status, context };
  const artifact = { ...unsigned, sha256: digest(unsigned) };
  await writeAtomic(outputFile, artifact);
  return readArtifact(outputFile, "fixture-network");
}
async function assertSourceGateProofs(env = process.env) {
  invariant(env.ACT7_071_PREFREEZE_SNAPSHOT, "ACT7_071_PREFREEZE_SNAPSHOT is required");
  invariant(env.ACT7_071_CANDIDATE_PROOF, "ACT7_071_CANDIDATE_PROOF is required");
  const snapshot = await readArtifact(env.ACT7_071_PREFREEZE_SNAPSHOT, "prefreeze-catalog");
  normalizeSnapshotRows(snapshot.rows);
  const candidate = await readArtifact(env.ACT7_071_CANDIDATE_PROOF, "candidate-public-bytes");
  invariant(snapshot.operation_id === env.ACT7_071_EXECUTION_CONTEXT_ID
    && candidate.operation_id === env.ACT7_071_EXECUTION_CONTEXT_ID,
  "Gate artifacts do not match the pinned execution context");
  invariant(Date.parse(candidate.verified_at) >= Date.parse(snapshot.captured_at),
    "Candidate public-byte proof predates the pre-freeze snapshot");
  invariant(candidate.deployment?.commit === CANDIDATE_COMMIT, "Candidate proof commit mismatch");
  invariant(candidate.files?.length === Object.keys(CANDIDATE_FILES).length, "Candidate proof must contain exactly five files");
  for (const [filePath, expected] of Object.entries(CANDIDATE_FILES)) {
    const file = candidate.files.find(item => item.path === filePath);
    invariant(file?.status === 200 && file.sha256 === expected && file.byte_length > 0,
      `Candidate proof is incomplete or mismatched: ${filePath}`);
  }
  return { snapshot, candidate };
}

async function runGuardedAttempt({
  env, rows, prefreezeFile, preMutationNetworkFile, candidateFile, fixtureNetworkFile,
  deploymentRunId, probeFetch, githubFetch, publicFetch,
  executeFreeze, applyMigration, requestCandidatePagesSwitch, restoreAdmissionAcl, runFixture, recoverAfterFreeze,
}) {
  for (const [name, operation] of Object.entries({ executeFreeze, applyMigration, requestCandidatePagesSwitch,
    restoreAdmissionAcl, runFixture, recoverAfterFreeze })) {
    invariant(typeof operation === "function", `Guarded attempt requires ${name} operation`);
  }
  const startContext = executionContext(env);
  await probeSupabaseNetwork({ url: "https://qdcbdcjobzytzhnhfwyn.supabase.co", outputFile: preMutationNetworkFile, env, fetchImpl: probeFetch });
  const snapshot = await persistPreFreezeSnapshot(rows, prefreezeFile, new Date(), env.ACT7_071_EXECUTION_CONTEXT_ID);
  let candidate;
  return runFailClosedSequence([
    { name: "freeze", run: () => executeFreeze({ snapshot }) },
    { name: "migration", run: () => applyMigration({ snapshot }) },
    { name: "candidate-pages-switch", run: () => requestCandidatePagesSwitch({ branch: CANDIDATE_BRANCH, folder: "/(root)", snapshot }) },
    { name: "candidate-public-proof", run: async () => {
      candidate = await verifyCandidatePublicBytes({ outputFile: candidateFile, githubFetch, publicFetch,
        deploymentRunId, operationId: env.ACT7_071_EXECUTION_CONTEXT_ID });
      return assertSourceGateProofs({ ...env, ACT7_071_PREFREEZE_SNAPSHOT: prefreezeFile,
        ACT7_071_CANDIDATE_PROOF: candidateFile });
    } },
    { name: "acl-restore", run: async proofs => {
      invariant(executionContext(env).visible_fingerprint === startContext.visible_fingerprint,
        "Visible execution context changed before ACL restoration");
      await restoreAdmissionAcl({ snapshot: proofs.snapshot, candidate: proofs.candidate });
    } },
    { name: "fixture-network-probe", run: async () => {
      await probeSupabaseNetwork({ url: "https://qdcbdcjobzytzhnhfwyn.supabase.co", outputFile: fixtureNetworkFile, env, fetchImpl: probeFetch });
      invariant(executionContext(env).visible_fingerprint === startContext.visible_fingerprint,
        "Visible execution context changed before fixture execution");
    } },
    { name: "fixture", run: () => runFixture({ snapshot, candidate }) },
  ], recoverAfterFreeze, { snapshot });
}

module.exports = {
  ADMISSION_SIGNATURES,
  CANDIDATE_BRANCH,
  CANDIDATE_COMMIT,
  CANDIDATE_FILES,
  ROLLBACK_BRANCH,
  ROLLBACK_COMMIT,
  ROLLBACK_FILES,
  PUBLIC_BASE_URL,
  assertWorkflowIdentity,
  comparePostRecovery,
  persistSqlStageReceipt,
  validateSqlReceiptChain,
  persistPreFreezeSnapshot,
  probeSupabaseNetwork,
  assertSourceGateProofs,
  verifyCandidatePublicBytes,
  verifyRollbackPublicBytes,
  runGuardedAttempt,
};

async function cli() {
  const [command, ...args] = process.argv.slice(2);
  if (command === "capture-prefreeze") {
    invariant(args.length === 2, "Usage: capture-prefreeze <catalog-rows.json> <snapshot.json>");
    const rows = JSON.parse(await fs.readFile(args[0], "utf8"));
    console.log(JSON.stringify(await persistPreFreezeSnapshot(rows, args[1], new Date(), process.env.ACT7_071_EXECUTION_CONTEXT_ID)));
    return;
  }
  if (command === "compare-recovery") {
    invariant(args.length === 2, "Usage: compare-recovery <snapshot.json> <catalog-rows.json>");
    const rows = JSON.parse(await fs.readFile(args[1], "utf8"));
    console.log(JSON.stringify(await comparePostRecovery(args[0], rows)));
    return;
  }
  if (command === "verify-candidate") {
    invariant(args.length === 2, "Usage: verify-candidate <workflow-run-id> <proof.json>");
    console.log(JSON.stringify(await verifyCandidatePublicBytes({
      deploymentRunId: args[0], outputFile: args[1],
      operationId: process.env.ACT7_071_EXECUTION_CONTEXT_ID,
    })));
    return;
  }
  throw new Error("Commands: capture-prefreeze | compare-recovery | verify-candidate. Mutations are permitted only through the separately authorized production adapter; this CLI remains read/proof-only.");
}

if (require.main === module) cli().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
if (process.env.NODE_ENV === "test") module.exports.__testOnlyRunFailClosedSequence = runFailClosedSequence;
