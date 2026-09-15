const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "index.html",
  "teacher.html",
  "src/game/app.js",
  "src/teacher/teacher-console.js",
  "src/supabase/client.js",
  "src/supabase/config.js",
  "src/state/session.js",
  "src/content/scenes.js",
  "src/utils/html.js",
  "src/styles/app.css",
  "database/001_sprint1_core.sql",
  "docs/sprint-1-architecture.md",
  "docs/sprint-1-testing.md",
];

for (const file of requiredFiles) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const migration = fs.readFileSync(path.join(root, "database/001_sprint1_core.sql"), "utf8");
const requiredFunctions = [
  "s1_create_room",
  "s1_join_player",
  "s1_get_player_state",
  "s1_submit_private_choice",
  "s1_get_teacher_state",
  "s1_advance_scene",
  "s1_reset_room",
];

for (const fn of requiredFunctions) {
  if (!migration.includes(`function public.${fn}`)) {
    throw new Error(`Missing migration function: ${fn}`);
  }
}

const student = fs.readFileSync(path.join(root, "index.html"), "utf8");
const teacher = fs.readFileSync(path.join(root, "teacher.html"), "utf8");

if (!student.includes('type="module" src="./src/game/app.js"')) {
  throw new Error("Student page is not wired to src/game/app.js");
}

if (!teacher.includes('type="module" src="./src/teacher/teacher-console.js"')) {
  throw new Error("Teacher page is not wired to src/teacher/teacher-console.js");
}

console.log("Sprint 1 static check passed.");
