// Test-only browser probe. Install before navigation; never included by product pages.
export function installLatencyObserver() {
  const records = [];
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const url = String(args[0]);
    if (!url.includes("/rest/v1/rpc/")) return originalFetch(...args);
    const record = { rpc: url.split("/").pop(), started: performance.now(), response: null, finished: null };
    records.push(record);
    try {
      const response = await originalFetch(...args);
      record.response = performance.now();
      return response;
    } finally { record.finished = performance.now(); }
  };
  const visible = [];
  new MutationObserver(() => visible.push({ at: performance.now(), text: document.body?.innerText?.slice(0, 300) || "" }))
    .observe(document, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["disabled", "class"] });
  globalThis.__TRIAL8_LATENCY__ = { records, visible, mark: () => performance.now() };
}

export const interactionFamilies = Object.freeze({
  ACT1: ["s3b_ack_act1_opening", "s3b_submit_act1_choice", "s3b_complete_act1"],
  ACT2: ["s3b_submit_first_meeting", "s3b_grab_and_leave", "s3b_ack_route_update", "s3b_complete_foldback", "s2_send_message", "s2_submit_vote"],
  ACT3: ["s3b_follow_sign", "s3b_submit_library_code", "s9_inspect_pocket_item", "s3_set_item_view", "s3_share_photo"],
  ACT4: ["s3b_submit_act4_choice"],
  ACT5: ["s5_send_message", "s5_submit_vote", "s5_advance"],
  ACT6: ["s5_send_message", "s5_submit_vote", "s5_advance"],
  ACT7: ["s5_submit_vote", "s5_advance"],
  ACT8: ["s5_submit_private_choice", "s5_submit_vote", "s5_advance"],
  ACT9: ["s6_send_message_v2", "s6_submit_group_choice_v2"],
  ACT10: ["s6_submit_private_choice_v2", "s6_send_message_v2", "s6_submit_group_choice_v2", "s6_advance_v2"],
  ACT11: ["s6_send_message_v2", "s6_submit_allocation_v2"],
  ACT12: ["s6_complete_station_v2", "s6_engage_v2", "s6_submit_private_choice_v2"],
  ACT13: ["s6_advance_v2"],
  Teacher: ["s9_start_formal_game", "s2_open_vote", "s5_teacher_open_vote", "s6_teacher_open_vote"],
});

export function decomposeLatency(records, start, visibleAt, mutationRpc) {
  const mutation = records.find(record => record.rpc === mutationRpc && record.started >= start);
  if (!mutation || visibleAt < mutation.finished) throw new Error("Missing mutation or visible marker before response");
  const reads = records.filter(record => record.started >= mutation.finished && record.finished <= visibleAt && record.rpc.includes("get_")).sort((a,b) => a.started-b.started);
  const readEnd = reads.length ? Math.max(...reads.map(record => record.finished)) : mutation.finished;
  return {
    clickToRequestMs: mutation.started-start,
    mutationResponseMs: mutation.finished-mutation.started,
    followUpReadMs: readEnd-mutation.finished,
    renderToVisibleMs: visibleAt-readEnd,
    clickToVisibleMs: visibleAt-start,
    readRpcNames: reads.map(record => record.rpc),
  };
}
