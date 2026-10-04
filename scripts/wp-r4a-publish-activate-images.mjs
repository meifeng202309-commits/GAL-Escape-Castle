import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SUPABASE_KEY, SUPABASE_URL } from "../src/supabase/config.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const apply = process.argv.includes("--apply");
const outputArg = process.argv.indexOf("--output");
const outputPath = outputArg >= 0
  ? path.resolve(process.argv[outputArg + 1])
  : path.join(root, "docs", "reports", "remediation", "wp-r4a", "WP_R4A_IMAGE_RUNTIME_CLOSURE.json");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let reviewerToken = process.env.ASSET_MANAGER_REVIEWER_TOKEN;
const temporaryReviewer = process.argv.includes("--temporary-reviewer");
const startedAt = new Date().toISOString();
const report = {
  schema_version: "1.0",
  work_package: "WP-R4A",
  scope: "image_runtime_publication_activation",
  started_at: startedAt,
  result: apply ? "RUNNING" : "PLAN_ONLY",
  registry_sync: null,
  activation_groups: [],
  assets: [],
  active_load_failure_telemetry: null,
};

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function jsonbKeyCompare(a, b) {
  const aBytes = Buffer.byteLength(a, "utf8");
  const bBytes = Buffer.byteLength(b, "utf8");
  return aBytes - bBytes || Buffer.from(a).compare(Buffer.from(b));
}

function jsonbText(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return `[${value.map(jsonbText).join(", ")}]`;
  if (typeof value === "object") {
    return `{${Object.keys(value).sort(jsonbKeyCompare).map(key => `${JSON.stringify(key)}: ${jsonbText(value[key])}`).join(", ")}}`;
  }
  return JSON.stringify(value);
}

function vdir(version) {
  return `v${String(version).padStart(3, "0")}`;
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = text;
  try { body = text ? JSON.parse(text) : null; } catch { /* retain text */ }
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${url}: ${response.status} ${typeof body === "string" ? body : JSON.stringify(body)}`);
  }
  return { response, body, bytes: Buffer.from(text) };
}

function serviceHeaders(json = true) {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    ...(json ? { "Content-Type": "application/json" } : {}),
  };
}

async function rpc(name, payload, key = serviceKey) {
  const { body } = await request(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return body;
}

async function candidateRow(assetId) {
  const select = "asset_id,asset_key,version,status,sha256,storage_path,published_at,ui_anchors,required_anchors";
  const { body } = await request(`${SUPABASE_URL}/rest/v1/asset_candidates?asset_id=eq.${assetId}&select=${select}`, { headers: serviceHeaders(false) });
  invariant(Array.isArray(body) && body.length === 1, `Candidate row unavailable for ${assetId}.`);
  return body[0];
}

async function loadFailureEvents(since) {
  const query = new URLSearchParams({
    select: "event_id,asset_key,version,details,created_at",
    event_type: "eq.asset_load_failed",
    created_at: `gte.${since}`,
    order: "created_at.asc",
  });
  const { body } = await request(`${SUPABASE_URL}/rest/v1/asset_events?${query}`, { headers: serviceHeaders(false) });
  return body.filter(event => event.details?.reason === "ACTIVE_STORAGE_OBJECT_LOAD_FAILED");
}

async function installTemporaryReviewer() {
  reviewerToken = `R4A-REVIEWER-${crypto.randomUUID()}-${crypto.randomUUID()}`;
  const tokenHash = sha256(Buffer.from(reviewerToken, "utf8"));
  await request(`${SUPABASE_URL}/rest/v1/asset_manager_reviewers`, {
    method: "POST",
    headers: { ...serviceHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify({ token_hash: tokenHash, label: `WP-R4A temporary reviewer ${startedAt}`, enabled: true }),
  });
  report.reviewer_authority = { type: "temporary_service_bootstrap", token_recorded: false, cleanup: "PENDING" };
  return tokenHash;
}

async function removeTemporaryReviewer(tokenHash) {
  await request(`${SUPABASE_URL}/rest/v1/asset_manager_reviewers?token_hash=eq.${tokenHash}`, {
    method: "DELETE",
    headers: { ...serviceHeaders(false), Prefer: "return=minimal" },
  });
  report.reviewer_authority.cleanup = "REMOVED";
}

async function publishCandidate(meta, binaryPath, assetId, publisherToken) {
  let row = await candidateRow(assetId);
  const versionPath = vdir(meta.version);
  const objectPath = `${meta.asset_key}/${versionPath}/${path.basename(binaryPath)}`;
  const storagePath = `game-assets/${objectPath}`;
  const bytes = await readFile(binaryPath);
  const localSha = sha256(bytes);
  invariant(localSha === meta.sha256, `${meta.asset_key}: local SHA-256 mismatch.`);

  if (!row.published_at || row.storage_path !== storagePath) {
    const mime = meta.mime_type || "image/webp";
    const upload = await fetch(`${SUPABASE_URL}/storage/v1/object/game-assets/${objectPath}`, {
      method: "POST",
      headers: { ...serviceHeaders(false), "Content-Type": mime, "x-upsert": "false" },
      body: bytes,
    });
    const uploadText = await upload.text();
    if (!upload.ok && !uploadText.includes("Duplicate")) {
      throw new Error(`${meta.asset_key}: storage upload ${upload.status} ${uploadText}`);
    }
    const reread = await fetch(`${SUPABASE_URL}/storage/v1/object/authenticated/${storagePath}`, { headers: serviceHeaders(false) });
    const storedBytes = Buffer.from(await reread.arrayBuffer());
    invariant(reread.ok, `${meta.asset_key}: authenticated storage reread failed (${reread.status}).`);
    invariant(sha256(storedBytes) === localSha, `${meta.asset_key}: published object SHA-256 mismatch.`);
    await rpc("asset_manager_mark_published", {
      p_teacher_token: publisherToken,
      p_asset_id: assetId,
      p_storage_path: storagePath,
      p_sha256: localSha,
    });
    row = await candidateRow(assetId);
    return { row, result: upload.ok ? "PUBLISHED" : "DUPLICATE_OBJECT_REUSED_AND_MARKED" };
  }

  const reread = await fetch(`${SUPABASE_URL}/storage/v1/object/authenticated/${storagePath}`, { headers: serviceHeaders(false) });
  const storedBytes = Buffer.from(await reread.arrayBuffer());
  invariant(reread.ok, `${meta.asset_key}: existing published object is not readable (${reread.status}).`);
  invariant(sha256(storedBytes) === localSha, `${meta.asset_key}: existing published object SHA-256 mismatch.`);
  return { row, result: "REUSED_VERIFIED" };
}

async function main() {
  const registry = JSON.parse(await readFile(path.join(root, "assets", "asset-registry.json"), "utf8"));
  const images = registry.assets.filter(asset => asset.asset_type === "image");
  invariant(images.length === 22, `Expected 22 image assets; observed ${images.length}.`);
  invariant(images.every(asset => asset.active_version === asset.latest_version), "Every image active_version must equal its latest approved version before publication.");

  const prepared = [];
  for (const asset of images) {
    const versionDir = vdir(asset.latest_version);
    const base = `${asset.asset_key}__${versionDir}`;
    const sidecarPath = path.join(root, "assets", "staging", asset.asset_key, versionDir, `${base}.json`);
    const meta = JSON.parse(await readFile(sidecarPath, "utf8"));
    const binaryPath = path.join(path.dirname(sidecarPath), meta.filename);
    const bytes = await readFile(binaryPath);
    invariant(meta.asset_key === asset.asset_key && meta.version === asset.latest_version, `${asset.asset_key}: sidecar identity mismatch.`);
    invariant(meta.status === "APPROVED" && meta.teacher_review === "APPROVED", `${asset.asset_key}: latest sidecar is not Teacher-approved.`);
    invariant(sha256(bytes) === meta.sha256, `${asset.asset_key}: staged binary checksum mismatch.`);
    const presentAnchors = new Set((meta.ui_anchors || []).map(anchor => anchor.anchor_name));
    invariant((asset.required_anchors || []).every(anchor => presentAnchors.has(anchor)), `${asset.asset_key}: required anchor metadata is incomplete.`);
    prepared.push({ asset, meta, sidecarPath, binaryPath });
    report.assets.push({
      asset_key: asset.asset_key,
      approved_version: asset.latest_version,
      active_version: apply ? null : asset.active_version,
      publish_result: apply ? "PENDING" : "PLANNED",
      resolver_result: apply ? "PENDING" : "PLANNED",
      http_load_result: apply ? "PENDING" : "PLANNED",
      required_anchor_result: asset.required_anchors.length ? "LOCAL_PASS" : "NOT_REQUIRED",
      residual_issue: null,
      sha256: meta.sha256,
      storage_path: null,
    });
  }

  const groups = new Map();
  for (const entry of prepared) {
    const name = entry.asset.paired_asset_group || `single:${entry.asset.asset_key}`;
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(entry.asset.asset_key);
  }
  report.activation_groups = [...groups].map(([group, asset_keys]) => ({ group, asset_keys, result: apply ? "PENDING" : "PLANNED" }));

  if (!apply) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  invariant(serviceKey, "SUPABASE_SERVICE_ROLE_KEY is required for --apply.");
  const temporaryReviewerHash = temporaryReviewer ? await installTemporaryReviewer() : null;
  invariant(reviewerToken, "ASSET_MANAGER_REVIEWER_TOKEN is required for --apply unless --temporary-reviewer is used.");
  try {
    const telemetryStart = new Date(Date.now() - 1000).toISOString();
    const assetsJsonbText = jsonbText(registry.assets);
    const registryHash = sha256(Buffer.from(assetsJsonbText, "utf8"));
    report.registry_sync = await rpc("asset_manager_sync_registry", {
      p_teacher_token: reviewerToken,
      p_registry_sha256: registryHash,
      p_assets: registry.assets,
    });

    const publicationSuffix = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
    const publicationRoom = `R4A${publicationSuffix}`.slice(0, 12);
    const publisherToken = reviewerToken;
    await rpc("s1_create_room", {
      p_room_code: publicationRoom,
      p_teacher_token: publisherToken,
      p_gitte_join_code: `G-${publicationSuffix}-${crypto.randomUUID().slice(0, 8)}`,
      p_anna_join_code: `A-${publicationSuffix}-${crypto.randomUUID().slice(0, 8)}`,
      p_linda_join_code: `L-${publicationSuffix}-${crypto.randomUUID().slice(0, 8)}`,
    }, SUPABASE_KEY);
    report.publisher_authority = { type: "disposable_teacher_room", room_code: publicationRoom, token_recorded: false };

    const runtime = new Map();
    for (const entry of prepared) {
    const imported = await rpc("asset_manager_import_candidate", { p_asset_key: entry.meta.asset_key, p_candidate: entry.meta });
    let status = imported.status;
    if (status === "UPLOADED") status = (await rpc("asset_manager_submit_for_review", { p_asset_id: imported.asset_id })).status;
    if (status === "PENDING_REVIEW") {
      status = (await rpc("asset_manager_review", {
        p_teacher_token: reviewerToken,
        p_asset_id: imported.asset_id,
        p_decision: "APPROVED",
        p_reviewer: "Teacher-approved canonical sidecar",
      }, SUPABASE_KEY)).status;
    }
    invariant(["APPROVED", "ACTIVE", "SUPERSEDED"].includes(status), `${entry.meta.asset_key}: unexpected candidate status ${status}.`);
    const published = await publishCandidate(entry.meta, entry.binaryPath, imported.asset_id, publisherToken);
    runtime.set(entry.meta.asset_key, { ...entry, assetId: imported.asset_id, row: published.row });
    const evidence = report.assets.find(asset => asset.asset_key === entry.meta.asset_key);
    evidence.publish_result = published.result;
    evidence.storage_path = published.row.storage_path;
    }

    for (const groupEvidence of report.activation_groups) {
    const members = groupEvidence.asset_keys.map(key => runtime.get(key));
    const rows = await Promise.all(members.map(member => candidateRow(member.assetId)));
    if (rows.every(row => row.status === "ACTIVE")) {
      groupEvidence.result = "ALREADY_ACTIVE_VERIFIED";
      continue;
    }
    invariant(rows.every(row => row.status === "APPROVED"), `${groupEvidence.group}: activation candidates are not uniformly APPROVED.`);
    const activated = await rpc("asset_manager_activate_group", {
      p_teacher_token: reviewerToken,
      p_asset_ids: members.map(member => member.assetId),
    });
    invariant(activated?.ok, `${groupEvidence.group}: activation failed.`);
    groupEvidence.result = "ACTIVATED";
    }

    for (const entry of prepared) {
    const evidence = report.assets.find(asset => asset.asset_key === entry.meta.asset_key);
    const resolved = await rpc("asset_resolve", { p_asset_key: entry.meta.asset_key }, SUPABASE_KEY);
    invariant(resolved?.ok && resolved.version === entry.asset.latest_version, `${entry.meta.asset_key}: resolver did not return the target ACTIVE version.`);
    invariant(resolved.storage_path === evidence.storage_path, `${entry.meta.asset_key}: resolver storage_path mismatch.`);
    const presentAnchors = new Set((resolved.ui_anchors || []).map(anchor => anchor.anchor_name));
    invariant((entry.asset.required_anchors || []).every(anchor => presentAnchors.has(anchor)), `${entry.meta.asset_key}: resolver required anchors incomplete.`);
    const publicResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${resolved.storage_path}`, { cache: "no-store" });
    const publicBytes = Buffer.from(await publicResponse.arrayBuffer());
    invariant(publicResponse.ok, `${entry.meta.asset_key}: public object load failed (${publicResponse.status}).`);
    invariant(sha256(publicBytes) === entry.meta.sha256, `${entry.meta.asset_key}: public object checksum mismatch.`);
    evidence.active_version = resolved.version;
    evidence.resolver_result = "PASS";
    evidence.http_load_result = `PASS_${publicResponse.status}_SHA256`;
    evidence.required_anchor_result = entry.asset.required_anchors.length ? "PASS" : "NOT_REQUIRED";
    }

    const telemetry = await loadFailureEvents(telemetryStart);
    report.active_load_failure_telemetry = { since: telemetryStart, count: telemetry.length, events: telemetry };
    invariant(telemetry.length === 0, "ACTIVE object load-failure telemetry was recorded during WP-R4A verification.");
  } finally {
    if (temporaryReviewerHash) await removeTemporaryReviewer(temporaryReviewerHash);
  }
  report.result = "PASS";
  report.finished_at = new Date().toISOString();
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ result: report.result, images: report.assets.length, output: path.relative(root, outputPath) }, null, 2));
}

main().catch(async error => {
  report.result = "FAIL";
  report.finished_at = new Date().toISOString();
  report.failure = error.message;
  if (apply) {
    await mkdir(path.dirname(outputPath), { recursive: true }).catch(() => null);
    await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`).catch(() => null);
  }
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
