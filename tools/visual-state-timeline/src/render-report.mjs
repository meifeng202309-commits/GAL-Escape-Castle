import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) out[key] = true;
    else { out[key] = next; i += 1; }
  }
  return out;
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function readJsonl(file) {
  try {
    const raw = await readFile(file, "utf8");
    return raw.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
  } catch {
    return [];
  }
}

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return null;
  }
}

const args = parseArgs(process.argv.slice(2));
if (!args["run-dir"]) {
  console.error("Usage: node src/render-report.mjs --run-dir <run-directory> [--output index.html]");
  process.exit(2);
}

const runDir = path.resolve(args["run-dir"]);
const outputFile = path.resolve(runDir, args.output || "index.html");
const entries = await readdir(runDir, { withFileTypes: true });
const participantNames = entries.filter(x => x.isDirectory()).map(x => x.name).sort();
const participants = [];

for (const name of participantNames) {
  const dir = path.join(runDir, name);
  const manifest = await readJson(path.join(dir, "manifest.json"));
  if (!manifest) continue;
  const states = await readJsonl(path.join(dir, "states.jsonl"));
  const actions = await readJsonl(path.join(dir, "actions.jsonl"));
  const errors = await readJsonl(path.join(dir, "errors.jsonl"));
  participants.push({ name, dir, manifest, states, actions, errors });
}

const merged = [];
for (const p of participants) {
  for (const s of p.states) {
    merged.push({
      timestamp: s.timestamp,
      label: p.manifest.label || p.name,
      kind: "STATE",
      id: s.state_id,
      detail: s.trigger || "",
    });
  }
  for (const a of p.actions) {
    merged.push({
      timestamp: a.started_at,
      label: p.manifest.label || p.name,
      kind: "ACTION",
      id: a.action_id,
      detail: `${a.target?.text || a.target?.aria_label || a.target?.id || a.target?.tag || ""} → ${a.classification || ""}`,
    });
  }
}
merged.sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));

const css = `
:root{font-family:Inter,Segoe UI,Arial,sans-serif;color:#1f2937;background:#f6f7f9}
body{margin:0;padding:24px}
main{max-width:1500px;margin:auto}
h1,h2,h3{color:#111827}
.card{background:white;border:1px solid #d1d5db;border-radius:10px;padding:16px;margin:14px 0}
.meta{font-size:13px;color:#6b7280}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:14px}
.state img{width:100%;height:auto;border:1px solid #d1d5db;border-radius:6px;background:#fff}
table{border-collapse:collapse;width:100%;background:white}
th,td{border:1px solid #d1d5db;padding:7px 9px;text-align:left;vertical-align:top;font-size:13px}
th{background:#f3f4f6}
code{background:#f3f4f6;padding:1px 4px;border-radius:4px}
.bad{font-weight:600}
section{margin-top:32px}
`;

const mergedRows = merged.map(x => `
<tr>
  <td>${esc(x.timestamp)}</td>
  <td>${esc(x.label)}</td>
  <td>${esc(x.kind)}</td>
  <td><code>${esc(x.id)}</code></td>
  <td>${esc(x.detail)}</td>
</tr>`).join("");

const participantHtml = participants.map(p => {
  const relBase = path.relative(runDir, p.dir).replaceAll(path.sep, "/");
  const stateCards = p.states.map(s => {
    const img = `${relBase}/${String(s.screenshot).replaceAll("\\", "/")}`;
    return `
    <article class="card state">
      <h3><code>${esc(s.state_id)}</code> · ${esc(s.trigger)}</h3>
      <p class="meta">${esc(s.timestamp)} · previous ${esc(s.previous_state_id || "—")}</p>
      <a href="${esc(img)}"><img loading="lazy" src="${esc(img)}" alt="${esc(s.state_id)} screenshot"></a>
    </article>`;
  }).join("");

  const actionRows = p.actions.map(a => `
  <tr>
    <td>${esc(a.started_at)}</td>
    <td><code>${esc(a.action_id)}</code></td>
    <td>${esc(a.event_type)}</td>
    <td>${esc(a.target?.text || a.target?.aria_label || a.target?.id || a.target?.tag || "")}</td>
    <td><code>${esc(a.before_state_id)}</code></td>
    <td><code>${esc(a.after_state_id)}</code></td>
    <td>${esc(a.classification)}</td>
  </tr>`).join("");

  return `
  <section>
    <h2>${esc(p.manifest.label || p.name)}</h2>
    <div class="card">
      <p><b>Mode:</b> ${esc(p.manifest.mode)} · <b>States:</b> ${p.states.length} · <b>Actions:</b> ${p.actions.length} · <b>Errors:</b> ${p.errors.length}</p>
      <p class="meta">Started ${esc(p.manifest.started_at)} · Ended ${esc(p.manifest.ended_at || "not finalized")}</p>
    </div>
    <h3>Action/control log</h3>
    <table>
      <thead><tr><th>Time</th><th>Action</th><th>Type</th><th>Control</th><th>Before</th><th>After</th><th>Observer result</th></tr></thead>
      <tbody>${actionRows || '<tr><td colspan="7">No completed actions recorded.</td></tr>'}</tbody>
    </table>
    <h3>Visual state timeline</h3>
    <div class="grid">${stateCards || '<p>No states recorded.</p>'}</div>
  </section>`;
}).join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Visual State Timeline Report</title>
<style>${css}</style>
</head>
<body>
<main>
  <h1>Visual State Timeline + Action/Control Event Log</h1>
  <p class="meta">Run directory: ${esc(runDir)} · generated ${esc(new Date().toISOString())}</p>

  <section>
    <h2>Merged chronological index</h2>
    <table>
      <thead><tr><th>Time</th><th>Participant</th><th>Kind</th><th>ID</th><th>Detail</th></tr></thead>
      <tbody>${mergedRows || '<tr><td colspan="5">No timeline entries.</td></tr>'}</tbody>
    </table>
  </section>

  ${participantHtml}
</main>
</body>
</html>
`;

await writeFile(outputFile, html, "utf8");
console.log(`Report written: ${outputFile}`);
