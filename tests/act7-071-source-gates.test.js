const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const {
  ADMISSION_SIGNATURES,
  CANDIDATE_COMMIT,
  CANDIDATE_FILES,
  comparePostRecovery,
  persistPreFreezeSnapshot,
  probeSupabaseNetwork,
  assertSourceGateProofs,
  verifyCandidatePublicBytes,
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
  const base = "https://example.invalid/GAL-Escape-Castle";
  await persistPreFreezeSnapshot(rows, snapshot, new Date("2026-10-19T00:00:00Z"), "test-context");
  await comparePostRecovery(snapshot, rows);
  await expectReject(comparePostRecovery(snapshot, rows.map((row, i) => i ? row : { ...row, acl: "drift" })), "does not exactly match");
  await expectReject(persistPreFreezeSnapshot(rows.slice(1), path.join(temp, "bad.json"), new Date(), "test-context"), "exactly six");

  await verifyCandidatePublicBytes({
    baseUrl: base,
    outputFile: candidate,
    deployment: { branch: "deploy/act7-071-20261017", commit: CANDIDATE_COMMIT, run_id: 123 },
    operationId: "test-context",
    now: new Date("2026-10-19T00:01:00Z"),
    fetchImpl: async url => ({ status: 200, arrayBuffer: async () => Buffer.from(url) }),
    hashBytes: (_bytes, file) => CANDIDATE_FILES[file],
  });
  await assertSourceGateProofs({ ACT7_071_PREFREEZE_SNAPSHOT: snapshot, ACT7_071_CANDIDATE_PROOF: candidate, ACT7_071_EXECUTION_CONTEXT_ID: "test-context" });
  await expectReject(assertSourceGateProofs({ ACT7_071_PREFREEZE_SNAPSHOT: snapshot }), "ACT7_071_CANDIDATE_PROOF");
  await expectReject(assertSourceGateProofs({ ACT7_071_PREFREEZE_SNAPSHOT: snapshot, ACT7_071_CANDIDATE_PROOF: candidate, ACT7_071_EXECUTION_CONTEXT_ID: "wrong-context" }), "pinned execution context");
  await expectReject(verifyCandidatePublicBytes({
    baseUrl: base,
    outputFile: path.join(temp, "http-fail.json"),
    deployment: { branch: "deploy/act7-071-20261017", commit: CANDIDATE_COMMIT, run_id: 124 },
    operationId: "test-context",
    fetchImpl: async () => ({ status: 503, arrayBuffer: async () => Buffer.from("unavailable") }),
  }), "HTTP 503");
  await expectReject(verifyCandidatePublicBytes({
    baseUrl: base,
    outputFile: path.join(temp, "hash-fail.json"),
    deployment: { branch: "deploy/act7-071-20261017", commit: CANDIDATE_COMMIT, run_id: 125 },
    operationId: "test-context",
    fetchImpl: async () => ({ status: 200, arrayBuffer: async () => Buffer.from("wrong bytes") }),
  }), "hash mismatch");

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

  await fs.rm(temp, { recursive: true, force: true });
  console.log("ACT7 071 source gate tests passed.");
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
