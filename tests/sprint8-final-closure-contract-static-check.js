const fs=require("fs"),path=require("path"),assert=require("assert");

const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"src/game/app.js"),"utf8");
const dbDir=path.join(root,"database");
const migration049Files=fs.readdirSync(dbDir).filter(name=>/^049.*\.sql$/i.test(name));
assert(migration049Files.length===1,"Expected exactly one CD-owned migration049 implementation");
const sql=fs.readFileSync(path.join(dbDir,migration049Files[0]),"utf8");

const finalizeMatch=sql.match(/create\s+(?:or\s+replace\s+)?function\s+public\.s8_finalize\s*\(([^)]*)\)/i);
assert(finalizeMatch,"s8_finalize replacement missing from migration049");
assert(/p_expected_run_id\s+uuid/i.test(finalizeMatch[1]),"s8_finalize public contract lacks required p_expected_run_id uuid");

const finalizeStart=app.indexOf("async function finalizeSprint8");
const finalizeEnd=app.indexOf("function renderSprint8",finalizeStart);
assert(finalizeStart>=0&&finalizeEnd>finalizeStart,"finalizeSprint8 client block missing");
const client=app.slice(finalizeStart,finalizeEnd);
assert(client.includes("p_expected_run_id"),"player finalization call does not send p_expected_run_id");
assert(/run_id/.test(client),"player finalization does not derive expected run identity from authoritative state");
assert(client.includes('requestIdentity("s8-finalize"'),"player finalization lost durable request identity");
assert(/requestIdentity\("s8-finalize"[\s\S]*run_id/.test(client),"finalization request identity is not scoped to run identity");

assert(/export_schema_version/i.test(sql),"migration049 lacks durable schema-version contract");
assert(/s8_finalizations[\s\S]*export_schema_version|export_schema_version[\s\S]*s8_finalizations/i.test(sql),"migration049 does not bind schema version to durable finalization metadata");
assert(/s8_get_finalization_state/i.test(sql),"finalization-state projection is not updated for durable schema version");
assert(/session_finalized/i.test(sql),"finalization event projection missing");

console.log("Sprint 8 final-closure public-contract static checks passed.");
