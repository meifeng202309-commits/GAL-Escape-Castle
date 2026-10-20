const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
process.env.NODE_ENV = "test";
const {
  ADMISSION_SIGNATURES,
  CANDIDATE_COMMIT,
  CANDIDATE_FILES,
  ROLLBACK_BRANCH,
  ROLLBACK_COMMIT,
  PUBLIC_BASE_URL,
  comparePostRecovery,
  persistSqlStageReceipt,
  validateSqlReceiptChain,
  persistAndValidateExternalSqlStage,
  persistPreFreezeSnapshot,
  probeSupabaseNetwork,
  assertSourceGateProofs,
  verifyCandidatePublicBytes,
  runGuardedAttempt,
  assertWorkflowIdentity,
  __testOnlyRunFailClosedSequence,
} = require("../scripts/act7-071-source-gates");

const rows = ADMISSION_SIGNATURES.map((signature, index) => ({
  signature,
  owner: "postgres",
  security_definer: true,
  search_path: ["search_path=public"],
  raw_md5: crypto.createHash("md5").update(`raw-${index}`).digest("hex"),
  normalized_md5: crypto.createHash("md5").update(`normalized-${index}`).digest("hex"),
  acl: index === 3 ? "{postgres=X/postgres,service_role=X/postgres}" : "{postgres=X/postgres}",
  privileges: { public: index === 4, anon: index !== 3, authenticated: index !== 3, service_role: true, postgres: true },
}));

async function expectReject(promise, text) {
  await assert.rejects(promise, error => error.message.includes(text));
}

async function main() {
  const temp = await fs.mkdtemp(path.join(process.cwd(), ".act7-071-gates-test-"));
  const snapshot = path.join(temp, "prefreeze.json");
  const candidate = path.join(temp, "candidate.json");
  const network = path.join(temp, "network.json");
  const run = { id: 123, name: "pages build and deployment", head_branch: "deploy/act7-071-20261017", head_sha: CANDIDATE_COMMIT, status: "completed", conclusion: "success" };
  const rollbackRun = { id: 39206010849, name: "pages build and deployment", head_branch: ROLLBACK_BRANCH,
    head_sha: "891feffe558a4683ac3da67e1e6b15e902c7e592", status: "completed", conclusion: "success" };
  const githubFetch = async () => ({ status: 200, json: async () => run });
  const publicFetch = async url => ({ status: 200, url, arrayBuffer: async () => Buffer.from(url) });
  await persistPreFreezeSnapshot(rows, snapshot, new Date("2026-10-19T00:00:00Z"), "test-context");
  await comparePostRecovery(snapshot, rows);
  await expectReject(comparePostRecovery(snapshot, rows.map((row, i) => i ? row : { ...row, acl: "drift" })), "does not exactly match");
  await expectReject(persistPreFreezeSnapshot(rows.slice(1), path.join(temp, "bad.json"), new Date(), "test-context"), "exactly six");
  assert.equal(ROLLBACK_COMMIT, rollbackRun.head_sha, "Rollback constant does not equal the reviewed exact identity");
  assert.deepEqual(assertWorkflowIdentity(rollbackRun, {
    deploymentRunId: 39206010849, branch: ROLLBACK_BRANCH, commit: ROLLBACK_COMMIT,
  }), { run_id: "39206010849", branch: ROLLBACK_BRANCH, commit: ROLLBACK_COMMIT, conclusion: "success" });
  assert.throws(() => assertWorkflowIdentity({ ...rollbackRun, head_sha: "891feffe40f3d2a1169c28d82085900c0edb72bd" }, {
    deploymentRunId: 39206010849, branch: ROLLBACK_BRANCH, commit: ROLLBACK_COMMIT,
  }), /workflow identity/);

  await expectReject(assertSourceGateProofs({ ACT7_071_PREFREEZE_SNAPSHOT: snapshot }), "ACT7_071_CANDIDATE_PROOF");
  await expectReject(verifyCandidatePublicBytes({
    outputFile: path.join(temp, "http-fail.json"),
    deploymentRunId: 123,
    operationId: "test-context",
    githubFetch,
    publicFetch: async url => ({ status: 503, url, arrayBuffer: async () => Buffer.from("unavailable") }),
  }), "HTTP 503");
  await expectReject(verifyCandidatePublicBytes({
    outputFile: path.join(temp, "hash-fail.json"),
    deploymentRunId: 123,
    operationId: "test-context",
    githubFetch,
    publicFetch: async url => ({ status: 200, url, arrayBuffer: async () => Buffer.from("wrong bytes") }),
  }), "hash mismatch");
  await expectReject(verifyCandidatePublicBytes({
    outputFile: path.join(temp, "redirect-fail.json"), deploymentRunId: 123, operationId: "test-context", githubFetch,
    publicFetch: async url => ({ status: 200, url: url.replace("meifeng202309-commits.github.io", "evil.example"), arrayBuffer: async () => Buffer.from("bytes") }),
  }), "escaped the reviewed origin/path");
  await expectReject(verifyCandidatePublicBytes({
    outputFile: path.join(temp, "run-fail.json"), deploymentRunId: 123, operationId: "test-context",
    githubFetch: async () => ({ status: 200, json: async () => ({ ...run, head_sha: "bad" }) }), publicFetch,
  }), "workflow identity");

  await probeSupabaseNetwork({
    url: "https://example.invalid",
    outputFile: network,
    env: { ACT7_071_EXECUTION_CONTEXT_ID: "test-context" },
    fetchImpl: async () => ({ status: 401 }),
    now: new Date("2026-10-19T00:02:00Z"),
  });
  await expectReject(probeSupabaseNetwork({
    url: "https://example.invalid",
    outputFile: path.join(temp, "failed-network.json"),
    env: { ACT7_071_EXECUTION_CONTEXT_ID: "test-context" },
    fetchImpl: async () => { const cause = Object.assign(new Error("dns"), { code: "ENOTFOUND", syscall: "getaddrinfo", hostname: "example.invalid" }); throw Object.assign(new TypeError("fetch failed"), { cause }); },
  }), "code=ENOTFOUND syscall=getaddrinfo hostname=example.invalid");
  await expectReject(probeSupabaseNetwork({ url: "https://example.invalid", outputFile: network, env: {}, fetchImpl: async () => ({ status: 401 }) }), "ACT7_071_EXECUTION_CONTEXT_ID");

  let forbiddenCalled = false;
  await expectReject(runGuardedAttempt({
    env: { ACT7_071_EXECUTION_CONTEXT_ID: "blocked-context" }, rows,
    prefreezeFile: path.join(temp, "blocked-prefreeze.json"), preMutationNetworkFile: path.join(temp, "blocked-network.json"),
    candidateFile: path.join(temp, "blocked-candidate.json"), fixtureNetworkFile: path.join(temp, "blocked-fixture-network.json"),
    deploymentRunId: 123,
    probeFetch: async () => { const cause = Object.assign(new Error("dns"), { code: "ENOTFOUND", syscall: "getaddrinfo", hostname: "supabase.invalid" }); throw Object.assign(new TypeError("fetch failed"), { cause }); },
    githubFetch, publicFetch,
    executeFreeze: async () => { forbiddenCalled = true; }, applyMigration: async () => { forbiddenCalled = true; },
    requestCandidatePagesSwitch: async () => { forbiddenCalled = true; },
    restoreAdmissionAcl: async () => { forbiddenCalled = true; }, runFixture: async () => { forbiddenCalled = true; },
    recoverAfterFreeze: async () => { forbiddenCalled = true; },
  }), "code=ENOTFOUND");
  assert.equal(forbiddenCalled, false, "A guarded production operation ran after the pre-mutation network gate failed");

  const candidateFailureOrder = [];
  await expectReject(runGuardedAttempt({
    env: { ACT7_071_EXECUTION_CONTEXT_ID: "candidate-blocked-context" }, rows,
    prefreezeFile: path.join(temp, "candidate-blocked-prefreeze.json"), preMutationNetworkFile: path.join(temp, "candidate-blocked-network.json"),
    candidateFile: path.join(temp, "candidate-blocked-proof.json"), fixtureNetworkFile: path.join(temp, "candidate-blocked-fixture-network.json"),
    deploymentRunId: 123, probeFetch: async () => ({ status: 401 }),
    githubFetch: async () => ({ status: 200, json: async () => ({ ...run, conclusion: "failure" }) }), publicFetch,
    executeFreeze: async () => candidateFailureOrder.push("freeze"),
    applyMigration: async () => candidateFailureOrder.push("migration"),
    requestCandidatePagesSwitch: async () => candidateFailureOrder.push("candidate-switch"),
    restoreAdmissionAcl: async () => candidateFailureOrder.push("restore"),
    runFixture: async () => candidateFailureOrder.push("fixture"),
    recoverAfterFreeze: async ({ boundary }) => candidateFailureOrder.push(`recover:${boundary}`),
  }), "fail-closed recovery completed");
  assert.deepEqual(candidateFailureOrder, ["freeze", "migration", "candidate-switch", "recover:candidate-public-proof"],
    "Candidate proof failure did not enter recovery or allowed a later mutation");

  const mutationBoundaries = ["freeze", "migration", "candidate-pages-switch", "candidate-public-proof",
    "acl-restore", "fixture-network-probe", "fixture"];
  for (const failedBoundary of mutationBoundaries) {
    const seen = [];
    const stages = mutationBoundaries.map(name => ({ name, run: async () => {
      seen.push(name);
      if (name === failedBoundary) throw new Error(`injected:${name}`);
    } }));
    await expectReject(__testOnlyRunFailClosedSequence(stages, async ({ boundary }) => seen.push(`recover:${boundary}`), {}),
      "fail-closed recovery completed");
    assert.deepEqual(seen, [...mutationBoundaries.slice(0, mutationBoundaries.indexOf(failedBoundary) + 1),
      `recover:${failedBoundary}`], `Failure at ${failedBoundary} did not recover immediately`);
  }
  await assert.rejects(__testOnlyRunFailClosedSequence([
    { name: "freeze", run: async () => { throw new Error("primary"); } },
  ], async () => { throw new Error("recovery"); }, {}), AggregateError);

  const receiptRoot = path.join(temp, "receipts");
  const receiptEnv = { ACT7_071_EXECUTION_CONTEXT_ID: "receipt-context" };
  const visibleFingerprint = crypto.createHash("sha256").update(JSON.stringify(Object.fromEntries(Object.entries({
    context_id: "receipt-context", exec_path: process.execPath, exec_argv: process.execArgv,
    platform: process.platform, arch: process.arch, cwd: process.cwd(),
  }).sort(([a], [b]) => a.localeCompare(b))))).digest("hex");
  const freezeRows = [{ signature: "six-functions", effective_execute: false }];
  const recoveryRows = [{ signature: "six-functions", restored: true }];
  const freeze = await persistSqlStageReceipt({ outputFile: path.join(receiptRoot, "01-freeze.json"),
    operationId: "receipt-context", stage: "freeze", sequence: 1, statementSha256: "1".repeat(64),
    response: { result: "copied connector success" }, responseCapturedAt: "2026-10-20T01:00:00Z",
    corroborationQuerySha256: "2".repeat(64), corroborationRows: freezeRows,
    corroborationCapturedAt: "2026-10-20T01:00:01Z", operatorConfirmation: "CD_CONNECTOR_CAPTURED",
    responseTranscriptRef: "connector-call-freeze", corroborationTranscriptRef: "connector-call-freeze-readback" });
  const recovery = await persistSqlStageReceipt({ outputFile: path.join(receiptRoot, "02-recovery.json"),
    operationId: "receipt-context", stage: "recovery", sequence: 2, previousSha256: freeze.sha256,
    statementSha256: "3".repeat(64), response: { result: "copied recovery success" },
    responseCapturedAt: "2026-10-20T01:00:02Z", corroborationQuerySha256: "4".repeat(64),
    corroborationRows: recoveryRows, corroborationCapturedAt: "2026-10-20T01:00:03Z",
    operatorConfirmation: "CD_CONNECTOR_CAPTURED", responseTranscriptRef: "connector-call-recovery",
    corroborationTranscriptRef: "connector-call-recovery-readback" });
  await assert.rejects(persistSqlStageReceipt({ outputFile: path.join(receiptRoot, "01-freeze.json"),
    operationId: "receipt-context", stage: "freeze", sequence: 1, statementSha256: "1".repeat(64),
    response: { result: "replacement" }, responseCapturedAt: "2026-10-20T01:00:04Z",
    corroborationQuerySha256: "2".repeat(64), corroborationRows: freezeRows,
    corroborationCapturedAt: "2026-10-20T01:00:05Z", operatorConfirmation: "CD_CONNECTOR_CAPTURED",
    responseTranscriptRef: "replacement-call", corroborationTranscriptRef: "replacement-readback" }),
  /EEXIST/);
  const recoveryExpectations = [
    { stage: "freeze", statementSha256: "1".repeat(64), corroborationQuerySha256: "2".repeat(64), corroborationSha256: freeze.corroboration_sha256 },
    { stage: "recovery", statementSha256: "3".repeat(64), corroborationQuerySha256: "4".repeat(64), corroborationSha256: recovery.corroboration_sha256 },
  ];
  await validateSqlReceiptChain({ files: [path.join(receiptRoot, "01-freeze.json"), path.join(receiptRoot, "02-recovery.json")],
    expectedStages: recoveryExpectations, operationId: "receipt-context", env: receiptEnv,
    startVisibleFingerprint: visibleFingerprint, operatorAvailable: true });
  await expectReject(validateSqlReceiptChain({ files: [path.join(receiptRoot, "01-freeze.json")],
    expectedStages: recoveryExpectations, operationId: "receipt-context", env: receiptEnv,
    startVisibleFingerprint: visibleFingerprint, operatorAvailable: true }), "chain is incomplete");
  await expectReject(validateSqlReceiptChain({ files: [path.join(receiptRoot, "01-freeze.json"), path.join(receiptRoot, "02-recovery.json")],
    expectedStages: recoveryExpectations, operationId: "receipt-context", env: receiptEnv,
    startVisibleFingerprint: "0".repeat(64), operatorAvailable: true }), "execution context changed");
  await expectReject(validateSqlReceiptChain({ files: [path.join(receiptRoot, "01-freeze.json"), path.join(receiptRoot, "02-recovery.json")],
    expectedStages: recoveryExpectations, operationId: "receipt-context", env: receiptEnv,
    startVisibleFingerprint: visibleFingerprint, operatorAvailable: false }), "operator is unavailable");
  const forgedPath = path.join(receiptRoot, "02-forged.json");
  const forged = JSON.parse(await fs.readFile(path.join(receiptRoot, "02-recovery.json"), "utf8"));
  forged.copied_connector_response.result = "forged after capture";
  await fs.writeFile(forgedPath, JSON.stringify(forged));
  await expectReject(validateSqlReceiptChain({ files: [path.join(receiptRoot, "01-freeze.json"), forgedPath],
    expectedStages: recoveryExpectations, operationId: "receipt-context", env: receiptEnv,
    startVisibleFingerprint: visibleFingerprint, operatorAvailable: true }), "artifact digest mismatch");
  const mismatchedExpectations = [recoveryExpectations[0], { ...recoveryExpectations[1], corroborationSha256: "f".repeat(64) }];
  await expectReject(validateSqlReceiptChain({ files: [path.join(receiptRoot, "01-freeze.json"), path.join(receiptRoot, "02-recovery.json")],
    expectedStages: mismatchedExpectations, operationId: "receipt-context", env: receiptEnv,
    startVisibleFingerprint: visibleFingerprint, operatorAvailable: true }), "does not match expected state");

  const bridgeFiles = [];
  const bridgeExpected = [{ stage: "freeze", statementSha256: "a".repeat(64),
    corroborationQuerySha256: "b".repeat(64), corroborationSha256: freeze.corroboration_sha256 }];
  await expectReject(persistAndValidateExternalSqlStage({ evidence: null,
    receiptFile: path.join(receiptRoot, "bridge-missing.json"), completedFiles: bridgeFiles,
    expectedStages: bridgeExpected, operationId: "receipt-context", env: receiptEnv,
    startVisibleFingerprint: visibleFingerprint, operatorAvailable: true }), "evidence is absent");
  await expectReject(persistAndValidateExternalSqlStage({ evidence: { stage: "freeze", statementSha256: "a".repeat(64),
    response: { result: "success" }, responseCapturedAt: "2026-10-20T02:00:00Z",
    corroborationQuerySha256: "b".repeat(64), corroborationRows: [{ wrong: true }],
    corroborationCapturedAt: "2026-10-20T02:00:01Z", operatorConfirmation: "CD_CONNECTOR_CAPTURED",
    responseTranscriptRef: "bridge-freeze", corroborationTranscriptRef: "bridge-freeze-readback" },
    receiptFile: path.join(receiptRoot, "bridge-wrong.json"), completedFiles: bridgeFiles,
    expectedStages: bridgeExpected, operationId: "receipt-context", env: receiptEnv,
    startVisibleFingerprint: visibleFingerprint, operatorAvailable: true }), "does not match expected state");
  assert.equal(bridgeFiles.length, 0, "Failed bridge stage advanced the completed receipt chain");

  await fs.rm(temp, { recursive: true, force: true });
  console.log("ACT7 071 source gate tests passed.");
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
