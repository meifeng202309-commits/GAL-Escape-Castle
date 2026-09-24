import fs from "node:fs";
import assert from "node:assert/strict";

const sql=fs.readFileSync(new URL("../database/043_sprint7_teacher_console.sql",import.meta.url),"utf8").toLowerCase();
const html=fs.readFileSync(new URL("../teacher.html",import.meta.url),"utf8");
const js=fs.readFileSync(new URL("../src/teacher/teacher-console.js",import.meta.url),"utf8");

for(const token of ["s7_get_teacher_console","s7_set_audit_private_debug","run_mode<>'audit'","teacher_audit_private_debug_changed","'export_ready',false","'enabled',false","from public.s3_player_items","from public.s3_group_items","from public.s6_audio_occurrences","from public.teacher_overrides"]){assert(sql.includes(token),`missing SQL contract: ${token}`);}
for(const id of ["operationsState","auditPrivateDebug","exportSessionButton"]){assert(html.includes(`id=\"${id}\"`),`missing teacher control: ${id}`);}
for(const token of ["loadOperationsState","setAuditPrivateDebug","s7_get_teacher_console","s7_set_audit_private_debug"]){assert(js.includes(token),`missing UI behavior: ${token}`);}
assert(!sql.includes("status='completed'"),"Sprint 7 must not finalize a game run.");
console.log("Sprint 7 static contract checks passed.");
