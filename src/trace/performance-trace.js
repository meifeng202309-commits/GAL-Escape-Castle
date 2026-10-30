// Supervised, local-only performance trace. No payloads, credentials, or network export.
export function installPerformanceTrace({ role, rpc, phase = () => null, version = () => null }) {
  if (new URL(location.href).searchParams.get("perfTrace") !== "supervised") return {
    record() {}, recordVisibleAction() {}, rpc, snapshot: () => ({ schema_version: 1, role, dropped: 0, rows: [] }), addClockCalibration: () => false, isEnabled: () => false,
  };
  const rows = new Array(2048);
  const clockCalibration = [];
  let enabled = false, next = 0, count = 0, dropped = 0, currentInteraction = null, indicatorPending = false;
  const safe = value => typeof value === "string" ? value.slice(0, 80) : (typeof value === "number" || typeof value === "boolean" || value === null ? value : null);
  const record = (event, details = {}) => {
    if (!enabled) return;
    const row = { schema_version: 1, event, role, utc: new Date().toISOString(), monotonic_ms: +performance.now().toFixed(3), interaction_id: currentInteraction, phase: safe(phase()), state_version: safe(version()) };
    for (const key of ["request_id", "rpc", "generation", "session_epoch", "status", "error_category", "visibility", "focus", "target", "gate", "phase", "state_version"]) if (details[key] !== undefined) row[key] = safe(details[key]);
    if (count === rows.length) dropped++; else count++;
    rows[next] = row;
    next = (next + 1) % rows.length;
    if ((count === 1 || count % 128 === 0 || dropped > 0) && !indicatorPending) {
      indicatorPending = true;
      requestAnimationFrame(() => { indicatorPending = false; indicator.textContent = `Trace ${count}/${rows.length}; dropped ${dropped}`; });
    }
  };
  const addClockCalibration = ({ client_send_utc_ms: t0, server_receive_utc_ms: t1, server_send_utc_ms: t2, client_receive_utc_ms: t3 }) => {
    if (![t0, t1, t2, t3].every(Number.isFinite) || t3 < t0 || t2 < t1) return false;
    clockCalibration.push({ offset_estimate_ms: ((t1 - t0) + (t2 - t3)) / 2, uncertainty_ms: Math.max(0, (t3 - t0 - (t2 - t1)) / 2), client_send_utc_ms: t0, server_receive_utc_ms: t1, server_send_utc_ms: t2, client_receive_utc_ms: t3 });
    if (clockCalibration.length > 16) clockCalibration.shift();
    return true;
  };
  const snapshot = () => ({ schema_version: 1, role, dropped, exported_utc: new Date().toISOString(), clock_calibration: clockCalibration, clock_note: "Offset is an RTT estimate with uncertainty; one-way latency is not identifiable from one observation.", rows: Array.from({ length: count }, (_, i) => rows[(next - count + i + rows.length) % rows.length]) });
  const panel = document.createElement("div");
  panel.id = "supervisedPerformanceTrace";
  panel.style.cssText = "position:fixed;bottom:0;right:0;z-index:9999;padding:6px;background:#17202a;color:#fff;font:12px sans-serif";
  const toggle = document.createElement("button");
  toggle.type = "button"; toggle.textContent = "Enable supervised trace";
  const exportButton = document.createElement("button");
  exportButton.type = "button"; exportButton.textContent = "Download trace"; exportButton.disabled = true;
  const indicator = document.createElement("span"); indicator.textContent = "Trace off; dropped 0";
  toggle.addEventListener("click", () => { enabled = !enabled; toggle.textContent = enabled ? "Disable trace" : "Enable supervised trace"; exportButton.disabled = !enabled; record("trace_toggle"); });
  exportButton.addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot())], { type: "application/json" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `gal-${role.toLowerCase()}-trace.json`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 30000);
  });
  panel.append(toggle, exportButton, indicator); document.body.append(panel);
  document.addEventListener("click", event => {
    if (!enabled || panel.contains(event.target)) return;
    const target = event.target.closest("button,form");
    if (!target) return;
    currentInteraction = crypto.randomUUID();
    record("click", { target: target.id || target.tagName });
    queueMicrotask(() => record("handler_turn_end"));
  }, true);
  for (const name of ["visibilitychange", "focus", "blur"]) (name === "visibilitychange" ? document : window).addEventListener(name, () => record(name, { visibility: document.visibilityState, focus: document.hasFocus() }));
  const recordVisibleAction = selector => {
    if (!enabled) return;
    requestAnimationFrame(() => {
      const node = document.querySelector(selector);
      if (node && node.getBoundingClientRect().width && node.getBoundingClientRect().height) record("action_dom_visible", { target: node.id || node.tagName });
    });
  };
  const tracedRpc = async (name, payload) => {
    if (!enabled) return rpc(name, payload);
    const request_id = payload?.p_client_request_id || crypto.randomUUID();
    record("rpc_start", { rpc: name, request_id });
    try { const result = await rpc(name, payload); record("rpc_end", { rpc: name, request_id, state_version: result?.state?.state_version ?? result?.state_version ?? result?.version ?? null, phase: result?.state?.phase_key ?? result?.scene?.phase_key ?? null }); return result; }
    catch (error) { record("rpc_error", { rpc: name, request_id, error_category: error.name || "Error" }); throw error; }
  };
  const api = { record, recordVisibleAction, rpc: tracedRpc, snapshot, addClockCalibration, isEnabled: () => enabled };
  globalThis.__GAL_PERFORMANCE_TRACE__ = api;
  return api;
}
