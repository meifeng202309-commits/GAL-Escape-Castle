const fs=require('node:fs'),p=require('node:path'),r=p.resolve(__dirname,'..'),read=x=>fs.readFileSync(p.join(r,x),'utf8');
const sql=read('database/018_sprint4_asset_manager_v2.sql');
const correction=read('database/019_sprint4_teacher_authority_correction.sql');
for(const x of ['ASSIGNED','MISSING','UPLOADED','PENDING_REVIEW','APPROVED','REJECTED','ACTIVE','SUPERSEDED','asset_registry_projection','asset_candidates_one_active','registry_sha256','asset_manager_mark_published','asset_manager_activate','asset_resolve','asset_load_failed','Required anchor is missing','Canonical registry active_version'])if(!sql.includes(x))throw Error('missing '+x);
if(/service_role|service-role key/i.test(read('src/teacher/teacher-console.js')))throw Error('browser secret boundary violated');
const html=read('teacher.html'),js=read('src/teacher/teacher-console.js');for(const x of ['Game Assets','assetReadyBadge','assetManagerState'])if(!html.includes(x))throw Error('UI missing '+x);for(const x of ['asset_manager_state','asset_manager_review','GAME READY'])if(!js.includes(x))throw Error('client missing '+x);
for(const x of ['teacher_token_hash=public.s1_hash_token(p_teacher_token)','create or replace function public.asset_manager_sync_registry'])if(!correction.includes(x))throw Error('019 missing '+x);
console.log('Sprint 4 static checks passed.');
