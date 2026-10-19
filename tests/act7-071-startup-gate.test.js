const { assertExecutionAuthorized } = require("./act7-071-controlled-acceptance");

const expectRefusal = (env, expected) => {
  let error = null;
  try { assertExecutionAuthorized(env); } catch (caught) { error = caught; }
  if (!error || !error.message.includes(expected)) {
    throw new Error(`Startup gate did not refuse before fixture execution: ${expected}`);
  }
};

expectRefusal({}, "ACT7_071_PRODUCTION_AUTHORIZED=YES");
expectRefusal({ ACT7_071_EVIDENCE_PAUSE: "YES" }, "ACT7_071_PRODUCTION_AUTHORIZED=YES");
expectRefusal({ ACT7_071_PRODUCTION_AUTHORIZED: "YES" }, "ACT7_071_EVIDENCE_PAUSE=YES");
expectRefusal({ ACT7_071_PRODUCTION_AUTHORIZED: "YES", ACT7_071_EVIDENCE_PAUSE: "YES" }, "ACT7_071_PREFREEZE_SNAPSHOT");
expectRefusal({ ACT7_071_PRODUCTION_AUTHORIZED: "YES", ACT7_071_EVIDENCE_PAUSE: "YES", ACT7_071_PREFREEZE_SNAPSHOT: "a" }, "ACT7_071_CANDIDATE_PROOF");
expectRefusal({ ACT7_071_PRODUCTION_AUTHORIZED: "YES", ACT7_071_EVIDENCE_PAUSE: "YES", ACT7_071_PREFREEZE_SNAPSHOT: "a", ACT7_071_CANDIDATE_PROOF: "b" }, "ACT7_071_NETWORK_PROBE_OUTPUT");
expectRefusal({ ACT7_071_PRODUCTION_AUTHORIZED: "YES", ACT7_071_EVIDENCE_PAUSE: "YES", ACT7_071_PREFREEZE_SNAPSHOT: "a", ACT7_071_CANDIDATE_PROOF: "b", ACT7_071_NETWORK_PROBE_OUTPUT: "c" }, "ACT7_071_EXECUTION_CONTEXT_ID");
assertExecutionAuthorized({
  ACT7_071_PRODUCTION_AUTHORIZED: "YES",
  ACT7_071_EVIDENCE_PAUSE: "YES",
  ACT7_071_PREFREEZE_SNAPSHOT: "snapshot.json",
  ACT7_071_CANDIDATE_PROOF: "candidate.json",
  ACT7_071_NETWORK_PROBE_OUTPUT: "network.json",
  ACT7_071_EXECUTION_CONTEXT_ID: "operator-window-id",
});

console.log("ACT7 071 startup authorization gate tests passed.");
