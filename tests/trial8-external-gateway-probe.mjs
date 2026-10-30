import { performance } from "node:perf_hooks";
import { writeFile, mkdir } from "node:fs/promises";
import { SUPABASE_KEY, SUPABASE_URL } from "../src/supabase/config.js";

const selectedHeaders = ["date", "server", "via", "cf-ray", "x-request-id", "sb-request-id", "sb-gateway-version", "x-kong-proxy-latency", "x-kong-upstream-latency", "x-envoy-upstream-service-time", "content-type"];
const probes = [];
const cases = [
  { name: "known_read_fake_identity", path: "/rest/v1/rpc/s8_get_player_state", body: { p_room_code: "CDLATENCYPROBE", p_session_token: "00000000-0000-0000-0000-000000000000" } },
  { name: "missing_rpc", path: "/rest/v1/rpc/cd_latency_probe_missing", body: {} },
];

for (let repetition = 1; repetition <= 8; repetition++) for (const item of cases) {
  const startedUtc = new Date().toISOString();
  const started = performance.now();
  let response;
  try {
    response = await fetch(`${SUPABASE_URL}${item.path}`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(item.body),
      signal: AbortSignal.timeout(15000),
    });
    await response.arrayBuffer();
    const headers = Object.fromEntries(selectedHeaders.map(name => [name, response.headers.get(name)]).filter(([, value]) => value !== null));
    probes.push({ name: item.name, repetition, started_utc: startedUtc, elapsed_ms: +(performance.now() - started).toFixed(3), status: response.status, headers });
  } catch (error) {
    probes.push({ name: item.name, repetition, started_utc: startedUtc, elapsed_ms: +(performance.now() - started).toFixed(3), status: null, error: error.name });
  }
}

const summarize = name => {
  const rows = probes.filter(row => row.name === name);
  const sorted = rows.map(row => row.elapsed_ms).sort((a, b) => a - b);
  return {
    count: rows.length,
    status_counts: Object.fromEntries([...new Set(rows.map(row => String(row.status)))].map(status => [status, rows.filter(row => String(row.status) === status).length])),
    min_ms: sorted[0], median_ms: sorted[Math.floor(sorted.length / 2)], max_ms: sorted.at(-1),
    observed_headers: [...new Set(rows.flatMap(row => Object.keys(row.headers || {})))],
    gateway_versions: [...new Set(rows.map(row => row.headers?.["sb-gateway-version"]).filter(Boolean))],
    servers: [...new Set(rows.map(row => row.headers?.server).filter(Boolean))],
  };
};
const report = { generated_utc: new Date().toISOString(), mutation: false, note: "Fake-identity read and missing-RPC probes traverse the hosted Data API but do not represent a valid GAL RPC or database origin time.", summary: Object.fromEntries(cases.map(item => [item.name, summarize(item.name)])), probes };
await mkdir("docs/reports/remediation/ui/trial8-external", { recursive: true });
await writeFile("docs/reports/remediation/ui/trial8-external/GATEWAY_PROBE.json", JSON.stringify(report, null, 2) + "\n");
if (probes.some(row => row.status === null)) throw Error("One or more gateway probes failed before an HTTP response");
console.log(JSON.stringify(report.summary));
