const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const migrationPath = path.join(root, "database/005_sprint3a_scene_pocket_knowledge_foundation.sql");
if (!fs.existsSync(migrationPath)) throw new Error("Missing Sprint 3A migration.");
if (!fs.existsSync(path.join(root, "tests/sprint3a-live-e2e.js"))) throw new Error("Missing Sprint 3A live suite.");
const sql = fs.readFileSync(migrationPath, "utf8");

for (const fragment of [
  "s3_runtime_scene_state", "s3_player_items", "s3_player_observations", "s3_player_knowledge",
  "s3_shared_photos", "s3_group_items", "CINEMATIC_MESSAGE", "CRITICAL_INFO", "ACTION_SCREEN",
  "s3_record_observation", "s3_record_knowledge", "restricted to AUDIT runs",
  "Sender is not the physical owner", "Invalid or non-shareable item view",
]) if (!sql.includes(fragment)) throw new Error(`Sprint 3A contract missing: ${fragment}`);

if (!sql.includes("enable row level security")) throw new Error("Sprint 3A tables lack RLS.");
if (/service[_-]?role/i.test(sql)) throw new Error("Service-role reference is forbidden.");

execFileSync(process.execPath, [path.join(root, "scripts/generate-localization.js")], { stdio: "inherit" });
const generated = path.join(root, "src/content/localization.generated.js");
const first = fs.readFileSync(generated, "utf8");
execFileSync(process.execPath, [path.join(root, "scripts/generate-localization.js")], { stdio: "inherit" });
if (fs.readFileSync(generated, "utf8") !== first) throw new Error("Localization generation is not deterministic.");
if (!first.includes('"displayPolicy": "nl_only_artifact"')) throw new Error("nl_only_artifact is missing.");
if (!first.includes("Missing canonical localization text_key")) throw new Error("Missing text_key does not fail visibly.");
console.log("Sprint 3A static checks passed.");
