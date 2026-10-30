// Review-only opt-in candidate. No product import, persistence or network export.
export function createCrossClientTrace({ enabled = false, capacity = 1024, role, sessionId } = {}) {
  const rows = new Array(capacity);
  let next = 0, count = 0, dropped = 0;
  const allowed = new Set(["interaction_id", "request_id", "role", "phase", "state_version", "generation", "session_epoch", "rpc", "http_status", "error_category", "visibility", "focus", "gate", "barrier", "elapsed_ms"]);
  function record(event, details = {}) {
    if (!enabled) return;
    const metadata = {};
    for (const [key, value] of Object.entries(details)) if (allowed.has(key) && (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null)) metadata[key] = typeof value === "string" ? value.slice(0, 96) : value;
    const row = { schema_version: 1, event, role, session_id: sessionId, utc: new Date().toISOString(), monotonic_ms: +performance.now().toFixed(3), ...metadata };
    if (count === capacity) dropped++; else count++;
    rows[next] = row;
    next = (next + 1) % capacity;
  }
  function snapshot() {
    return { schema_version: 1, role, dropped, rows: Array.from({ length: count }, (_, i) => rows[(next - count + i + capacity) % capacity]) };
  }
  return { record, snapshot };
}
