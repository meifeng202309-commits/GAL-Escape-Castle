// Scenario arithmetic only. These inputs are examples, never production usage estimates.
const players = 3, seconds = 60, checkSeconds = 2, heartbeatSeconds = 20;
const framesPerPlayer = Math.floor(seconds / 1.4); // illustrative 1.2 s poll delay + 0.2 s frame
const projectionCallsPerFrame = 8; // representative S6 frame; actual conditional count varies
const actionsPerPlayer = 10;
const scenarios = {
  idle: {
    A_full_upload_every_check: players * seconds / checkSeconds,
    B_change_only_uploads: 0,
    B_heartbeat_if_no_other_qualifying_success: players * seconds / heartbeatSeconds,
    existing_mutation_writes: 0,
    existing_read_rpcs: players * framesPerPlayer * projectionCallsPerFrame,
    C_consolidated_read_rpcs: players * framesPerPlayer,
  },
  active_10_actions_per_player: {
    A_full_upload_every_check: players * seconds / checkSeconds,
    B_change_uploads_if_each_action_separately_preserved: players * actionsPerPlayer,
    existing_mutation_writes: players * actionsPerPlayer,
    existing_read_rpcs: players * framesPerPlayer * projectionCallsPerFrame,
    C_consolidated_read_rpcs: players * framesPerPlayer,
  },
};
console.log(JSON.stringify({ assumptions: { players, seconds, checkSeconds, heartbeatSeconds, framesPerPlayer, projectionCallsPerFrame, actionsPerPlayer, productionEstimate: false }, scenarios }, null, 2));
