import fs from "node:fs";
import path from "node:path";

const inputPath = "docs/reports/remediation/ui/TEACHER_TRIAL_20261113_PLAYER_RUNTIME_TEXT_EVIDENCE.csv";
const outputDir = "docs/reports/remediation/ui";

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ""; }
    else if (ch === '\n') { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell.replace(/\r$/, "")); rows.push(row); }
  const headers = rows.shift();
  return rows.filter(r => r.some(Boolean)).map(values => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""])));
}

function md(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\r\n", "<br>").replaceAll("\n", "<br>");
}

function expected(row) {
  const trigger = row.trigger_choice_outcome.toLowerCase();
  if (trigger === "opening") return "阅读并理解本角色的初始处境与线索，然后按 Action 区继续。";
  if (trigger.includes("private clue")) return "阅读并记住仅对本角色可见的线索。";
  if (trigger.includes("wrong") || trigger.includes("error") || trigger.includes("invalid") || trigger.includes("no consensus")) return "理解失败或未达成共识的原因，并按 Action 区重试或继续。";
  if (trigger.includes("choice=") || trigger.includes("outcome") || trigger.includes("result")) return "观察该选择或结果产生的 Runtime 信息；后续操作以 Action 区为准。";
  if (trigger.includes("cinematic") || row.phase_key.includes("escape") || row.phase_key.includes("ending")) return "观察剧情推进并理解当前状态。";
  return "理解或观察该 Runtime 信息；如需操作，以 Action 区为准。";
}

const roles = [
  { name: "Anna", source: "GAL-B / Anna", prefix: "ANNA" },
  { name: "Gitte", source: "GAL-A / Gitte", prefix: "GITTE" },
  { name: "Linda", source: "GAL-C / Linda", prefix: "LINDA" },
];
const sourceBytes = fs.readFileSync(inputPath);
const rows = parseCsv(sourceBytes.toString("utf8"));
if (rows.length !== 86) throw new Error(`Expected 86 source rows, found ${rows.length}`);

for (const role of roles) {
  const visible = rows.filter(row => row.player_role === "ALL" || row.player_role === role.source);
  const lines = [
    `# Runtime message review — ${role.name}`,
    "",
    "Status: SOURCE-DERIVED REVIEW TABLE — NOT CANONICAL / NOT IMPLEMENTED",
    `Source evidence: \`${inputPath}\` (unchanged, 86 rows).`,
    "Ordering: source-evidenced Runtime appearance order. Conditional alternatives remain separate rows and are not implied to appear consecutively.",
    "Columns E and F are intentionally blank for GA and Teacher.",
    "",
    "| A. ACT number | B. Detail/Page ID | C. Action expected from Player / expected understanding | D. Current Runtime Chinese | E. GA proposed revised Chinese | F. Teacher proposed revision | G. scene_id | H. phase_key | I. trigger/outcome | J. ordered Runtime text keys | K. source function/migration/file | L. source evidence/fixture | M. uncertainty/coverage note | N. role-visibility note |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];
  visible.forEach((row, index) => {
    const id = `${role.prefix}-${String(index + 1).padStart(3, "0")}`;
    const visibility = row.player_role === "ALL" ? "Shared Runtime; repeated in all three role review files." : `Private to ${role.name}; excluded from the other two role files.`;
    const evidence = [row.parameters && row.parameters !== "{}" ? `parameters=${row.parameters}` : "", row.fixture_evidence].filter(Boolean).join("; ");
    lines.push(`| ${md(row.act)} | ${id} | ${md(expected(row))} | ${md(row.rendered_zh)} |  |  | ${md(row.scene_id)} | ${md(row.phase_key)} | ${md(row.trigger_choice_outcome)} | ${md(row.ordered_runtime_text_keys)} | ${md(row.source_file_or_function)} | ${md(evidence)} | ${md(row.uncertainty)} | ${md(visibility)} |`);
  });
  lines.push("", `Row count: ${visible.length}. Shared: ${visible.filter(r => r.player_role === "ALL").length}. Role-private: ${visible.filter(r => r.player_role !== "ALL").length}.`, "");
  fs.writeFileSync(path.join(outputDir, `runtime_message_${role.name}.md`), `${lines.join("\n")}\n`);
}

console.log(JSON.stringify({ sourceRows: rows.length, outputs: roles.map(role => ({ role: role.name, rows: rows.filter(row => row.player_role === "ALL" || row.player_role === role.source).length })) }, null, 2));
