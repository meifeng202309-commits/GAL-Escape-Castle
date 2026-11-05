import assert from "node:assert/strict";
import path from "node:path";
import { execFileSync } from "node:child_process";

const incidentRef = "61fbb08291ccf1796a9051c5f61264bf43870157";
const validatedSourceRef = "f08c04a8b7f0d4e4af3d04a3d0bfd03e22f174d2";

function gitText(ref, file) {
  try {
    return execFileSync("git", ["show", `${ref}:${file}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}

function moduleImports(source) {
  return [...source.matchAll(/(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g)]
    .map(match => match[1])
    .filter(specifier => specifier.startsWith("."));
}

function resolveImport(importer, specifier) {
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(importer), specifier));
  return path.posix.extname(resolved) ? resolved : `${resolved}.js`;
}

function moduleClosure(ref, entry) {
  const missing = new Set();
  const visited = new Set();
  const visit = file => {
    if (visited.has(file)) return;
    visited.add(file);
    const source = gitText(ref, file);
    if (source === null) {
      missing.add(file);
      return;
    }
    for (const specifier of moduleImports(source)) visit(resolveImport(file, specifier));
  };
  visit(entry);
  return { missing: [...missing].sort(), visited: [...visited].sort() };
}

const incident = moduleClosure(incidentRef, "src/teacher/teacher-console.js");
assert.deepEqual(
  incident.missing,
  ["src/trace/performance-trace.js"],
  "The incident deploy must remain reproducible as exactly one missing static module dependency.",
);

const source = moduleClosure(validatedSourceRef, "src/teacher/teacher-console.js");
assert.deepEqual(source.missing, [], "Validated Teacher source must have a complete static module dependency closure.");
assert(source.visited.includes("src/trace/performance-trace.js"), "Trace dependency was not traversed from the Teacher entrypoint.");

console.log(JSON.stringify({
  result: "TEACHER_V5_PAGES_MODULE_CLOSURE_PASS",
  incident_ref: incidentRef,
  incident_missing: incident.missing,
  validated_source_ref: validatedSourceRef,
  validated_module_count: source.visited.length,
}));
