import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SUPABASE_URL } from "../src/supabase/config.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const closurePath = path.join(root, "docs", "reports", "remediation", "wp-r4a", "WP_R4A_IMAGE_RUNTIME_CLOSURE.json");
const smokeDir = path.join(root, "docs", "reports", "remediation", "wp-r4a", "public-smoke");
const smokeReportName = process.argv[2];

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(route) {
  const response = await fetch(`${SUPABASE_URL}${route}`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  invariant(response.ok, `GET ${route}: ${response.status} ${text}`);
  return body;
}

async function main() {
  invariant(serviceKey, "SUPABASE_SERVICE_ROLE_KEY is required.");
  invariant(smokeReportName && !path.isAbsolute(smokeReportName), "Pass the public-smoke JSON filename.");

  const closure = JSON.parse(await readFile(closurePath, "utf8"));
  const smokePath = path.join(smokeDir, smokeReportName);
  const smoke = JSON.parse(await readFile(smokePath, "utf8"));
  invariant(closure.result === "PASS", "WP-R4A closure report is not PASS.");
  invariant(smoke.result === "PASS", "Public smoke report is not PASS.");

  const activeRows = await request("/rest/v1/asset_candidates?status=eq.ACTIVE&select=asset_id,asset_key,version,storage_path");
  const imageKeys = new Set(closure.assets.map(asset => asset.asset_key));
  const activeImages = activeRows.filter(row => imageKeys.has(row.asset_key));
  const counts = new Map();
  for (const row of activeImages) counts.set(row.asset_key, (counts.get(row.asset_key) || 0) + 1);
  const activeMismatches = closure.assets.flatMap(asset => {
    const rows = activeImages.filter(row => row.asset_key === asset.asset_key);
    return rows.length === 1 && rows[0].version === asset.approved_version
      ? []
      : [{ asset_key: asset.asset_key, approved_version: asset.approved_version, active_rows: rows }];
  });
  invariant(activeImages.length === 22 && counts.size === 22 && activeMismatches.length === 0, "Unique ACTIVE image verification failed.");

  const eventQuery = new URLSearchParams({
    select: "event_id,asset_key,version,details,created_at",
    event_type: "eq.asset_load_failed",
    created_at: `gte.${smoke.startedAt}`,
    order: "created_at.asc",
  });
  const events = await request(`/rest/v1/asset_events?${eventQuery}`);
  const activeLoadFailures = events.filter(event => event.details?.reason === "ACTIVE_STORAGE_OBJECT_LOAD_FAILED");
  invariant(activeLoadFailures.length === 0, "Public smoke produced ACTIVE object load-failure telemetry.");

  const reviewerLabel = `WP-R4A temporary reviewer ${closure.started_at}`;
  const reviewerQuery = new URLSearchParams({ select: "label,enabled", label: `eq.${reviewerLabel}` });
  const reviewerRows = await request(`/rest/v1/asset_manager_reviewers?${reviewerQuery}`);
  invariant(reviewerRows.length === 0, "Temporary WP-R4A reviewer row still exists.");

  closure.unique_active_verification = {
    result: "PASS",
    image_key_count: 22,
    active_row_count: activeImages.length,
    mismatches: activeMismatches,
  };
  closure.normal_public_smoke = {
    result: smoke.result,
    report_path: path.relative(root, smokePath),
    started_at: smoke.startedAt,
    finished_at: smoke.finishedAt,
    material_browser_error_count: smoke.checks?.materialBrowserErrorCount,
    active_load_failure_telemetry: {
      since: smoke.startedAt,
      count: activeLoadFailures.length,
      events: activeLoadFailures,
    },
  };
  closure.temporary_reviewer_cleanup_verification = {
    result: "PASS",
    matching_rows: reviewerRows.length,
  };
  closure.finished_at = new Date().toISOString();
  await writeFile(closurePath, `${JSON.stringify(closure, null, 2)}\n`);
  console.log(JSON.stringify({ result: "PASS", active_images: activeImages.length, smoke_load_failures: 0, temporary_reviewers: 0 }, null, 2));
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
