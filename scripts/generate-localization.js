const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const input = path.join(root, "docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv");
const output = path.join(root, "src/content/localization.generated.js");

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ""; }
    else if (char === '\n') { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += char;
  }
  if (field || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  if (quoted) throw new Error("Unclosed quoted CSV field.");
  return rows;
}

const rows = parseCsv(fs.readFileSync(input, "utf8"));
const headers = rows.shift();
const expected = ["text_key","scene_usage","text_type","display_policy","english_master","nederlands","chinese","v4_status","notes"];
if (JSON.stringify(headers) !== JSON.stringify(expected)) throw new Error("Unexpected localization CSV headers.");

const catalog = {};
for (const values of rows) {
  if (values.length !== headers.length) throw new Error(`Malformed localization row: ${values[0] || "unknown"}`);
  const entry = Object.fromEntries(headers.map((key, index) => [key, values[index]]));
  if (!entry.text_key || catalog[entry.text_key]) throw new Error(`Missing or duplicate text_key: ${entry.text_key}`);
  if (!entry.english_master || !entry.nederlands || !entry.chinese) throw new Error(`Blank required text: ${entry.text_key}`);
  if (!['static','template'].includes(entry.text_type)) throw new Error(`Invalid text_type: ${entry.text_key}`);
  if (!['bilingual','nl_only_artifact'].includes(entry.display_policy)) throw new Error(`Invalid display_policy: ${entry.text_key}`);
  catalog[entry.text_key] = {
    textType: entry.text_type,
    displayPolicy: entry.display_policy,
    englishMaster: entry.english_master,
    nl: entry.nederlands,
    zh: entry.chinese,
  };
}

const source = `// GENERATED from docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv.\n// Do not edit manually. Run: node scripts/generate-localization.js\nexport const LOCALIZATION_CATALOG = ${JSON.stringify(catalog, null, 2)};\n\nexport function resolveLocalizedText(textKey) {\n  const entry = LOCALIZATION_CATALOG[textKey];\n  if (!entry) throw new Error(\`Missing canonical localization text_key: \${textKey}\`);\n  return entry.displayPolicy === \"nl_only_artifact\"\n    ? { nl: entry.nl, displayPolicy: entry.displayPolicy }\n    : { nl: entry.nl, zh: entry.zh, displayPolicy: entry.displayPolicy };\n}\n`;
fs.writeFileSync(output, source, "utf8");
console.log(`Generated ${Object.keys(catalog).length} localization entries.`);
