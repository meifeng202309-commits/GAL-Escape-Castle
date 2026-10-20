const { execFileSync } = require("node:child_process");
const { CANDIDATE_BRANCH, CANDIDATE_COMMIT, CANDIDATE_FILES,
  ROLLBACK_BRANCH, ROLLBACK_COMMIT, ROLLBACK_FILES } = require("../../scripts/act7-071-source-gates");

const blob = (commit, file) => execFileSync("git", ["show", `${commit}:${file.replace(/^\//, "")}`]);
const files = (commit, expected) => Object.fromEntries(Object.keys(expected).map(file => [file, blob(commit, file)]));

module.exports = async config => {
  const candidate = files(CANDIDATE_COMMIT, CANDIDATE_FILES);
  const rollback = files(ROLLBACK_COMMIT, ROLLBACK_FILES);
  let proofBranch;
  return {
    probeFetch: async () => ({ status: 401 }),
    githubFetch: async url => {
      const id = String(url).split("/").pop();
      proofBranch = id === "456" ? ROLLBACK_BRANCH : CANDIDATE_BRANCH;
      return { status: 200, json: async () => ({ id: Number(id), name: "pages build and deployment",
        head_branch: proofBranch, head_sha: config.testWrongRollbackIdentity && id === "456" ? "bad" :
          (proofBranch === ROLLBACK_BRANCH ? ROLLBACK_COMMIT : CANDIDATE_COMMIT),
        status: "completed", conclusion: config.testFailCandidate && id === "123" ? "failure" : "success" }) };
    },
    publicFetch: async url => {
      const pathname = new URL(url).pathname.replace("/GAL-Escape-Castle", "");
      const bytes = config.testWrongPublicBytes ? Buffer.from("wrong") :
        (proofBranch === ROLLBACK_BRANCH ? rollback : candidate)[pathname];
      return { status: 200, url, arrayBuffer: async () => bytes };
    },
    fixtureRunner: async () => ({ ok: true, mock: true }),
  };
};
