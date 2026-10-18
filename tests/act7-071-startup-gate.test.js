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
assertExecutionAuthorized({
  ACT7_071_PRODUCTION_AUTHORIZED: "YES",
  ACT7_071_EVIDENCE_PAUSE: "YES",
});

console.log("ACT7 071 startup authorization gate tests passed.");
