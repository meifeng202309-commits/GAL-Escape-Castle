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
async function verifyCandidatePublicBytes({ outputFile, githubFetch = fetch, publicFetch = fetch, now = new Date(), deploymentRunId, operationId,
  hashBytes = bytes => crypto.createHash("sha256").update(bytes).digest("hex") }) {
  invariant(operationId, "Candidate public-byte proof requires the pinned operation context ID");
  invariant(/^\d+$/.test(String(deploymentRunId || "")), "Candidate workflow run ID must be numeric");
  const runResponse = await githubFetch(`${GITHUB_RUN_API_PREFIX}${deploymentRunId}`, { method: "GET", cache: "no-store" });
  invariant(runResponse.status === 200, `Candidate workflow identity lookup failed HTTP ${runResponse.status}`);
  const run = await runResponse.json();
  invariant(String(run.id) === String(deploymentRunId)
    && run.name === "pages build and deployment"
    && run.head_branch === CANDIDATE_BRANCH
    && run.head_sha === CANDIDATE_COMMIT
    && run.status === "completed" && run.conclusion === "success",
  "Live GitHub workflow identity does not match the reviewed candidate deployment");
  const deployment = { run_id: String(run.id), branch: run.head_branch, commit: run.head_sha, conclusion: run.conclusion };
  const files = [];
  for (const [filePath, expected] of Object.entries(CANDIDATE_FILES)) {
    const url = `${PUBLIC_BASE_URL}${filePath}?act7_071=${now.getTime()}`;
    const response = await publicFetch(url, { method: "GET", cache: "no-store", redirect: "follow" });
    const finalUrl = new URL(response.url || url);
    const expectedUrl = new URL(url);
    const bytes = Buffer.from(await response.arrayBuffer());
    const actual = hashBytes(bytes, filePath);
    invariant(finalUrl.origin === expectedUrl.origin && finalUrl.pathname === expectedUrl.pathname,
      `Candidate public response escaped the reviewed origin/path: ${filePath}`);
    invariant(response.status === 200, `Candidate public byte gate failed HTTP ${response.status}: ${filePath}`);
    invariant(actual === expected, `Candidate public byte hash mismatch: ${filePath}`);
    files.push({ path: filePath, url, status: response.status, byte_length: bytes.length, sha256: actual });
  }
  const unsigned = { schema: SCHEMA, kind: "candidate-public-bytes", operation_id: operationId, verified_at: now.toISOString(), deployment, files };
  const artifact = { ...unsigned, sha256: digest(unsigned) };
  await writeAtomic(outputFile, artifact);
  return readArtifact(outputFile, "candidate-public-bytes");
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
  candidateHashBytes,
  executeFreeze, applyMigration, restoreAdmissionAcl, runFixture,
}) {
  for (const [name, operation] of Object.entries({ executeFreeze, applyMigration, restoreAdmissionAcl, runFixture })) {
    invariant(typeof operation === "function", `Guarded attempt requires ${name} operation`);
  }
  const startContext = executionContext(env);
  await probeSupabaseNetwork({ url: "https://qdcbdcjobzytzhnhfwyn.supabase.co", outputFile: preMutationNetworkFile, env, fetchImpl: probeFetch });
  const snapshot = await persistPreFreezeSnapshot(rows, prefreezeFile, new Date(), env.ACT7_071_EXECUTION_CONTEXT_ID);
  await executeFreeze({ snapshot });
  await applyMigration({ snapshot });
  const candidate = await verifyCandidatePublicBytes({
    outputFile: candidateFile, githubFetch, publicFetch, deploymentRunId,
    operationId: env.ACT7_071_EXECUTION_CONTEXT_ID, hashBytes: candidateHashBytes,
  });
  const proofs = await assertSourceGateProofs({
    ...env, ACT7_071_PREFREEZE_SNAPSHOT: prefreezeFile, ACT7_071_CANDIDATE_PROOF: candidateFile,
  });
  invariant(executionContext(env).visible_fingerprint === startContext.visible_fingerprint,
    "Visible execution context changed before ACL restoration");
  await restoreAdmissionAcl({ snapshot: proofs.snapshot, candidate: proofs.candidate });
  await probeSupabaseNetwork({ url: "https://qdcbdcjobzytzhnhfwyn.supabase.co", outputFile: fixtureNetworkFile, env, fetchImpl: probeFetch });
  invariant(executionContext(env).visible_fingerprint === startContext.visible_fingerprint,
    "Visible execution context changed before fixture execution");
  return runFixture({ snapshot, candidate });
}

module.exports = {
  ADMISSION_SIGNATURES,
  CANDIDATE_BRANCH,
  CANDIDATE_COMMIT,
  CANDIDATE_FILES,
  PUBLIC_BASE_URL,
  comparePostRecovery,
  persistPreFreezeSnapshot,
  probeSupabaseNetwork,
  assertSourceGateProofs,
  verifyCandidatePublicBytes,
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
  throw new Error("Commands: capture-prefreeze | compare-recovery | verify-candidate. ACL restoration is permitted only inside runGuardedAttempt; no production adapter is included.");
}

if (require.main === module) cli().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
