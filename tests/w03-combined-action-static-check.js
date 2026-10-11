const fs=require("node:fs");
const assert=(value,message)=>{if(!value)throw new Error(message)};
const sql=fs.readFileSync("database/070_w03_combined_grab_leave.sql","utf8");
const app=fs.readFileSync("src/game/app.js","utf8");

for(const token of[
  "create table public.s3b_action_receipts(",
  "primary key(run_id,player_id,client_request_id)",
  "unique(run_id,player_id,action_key)",
  "create function public.s3b_grab_and_leave(",
  "security definer",
  "where room_code=room and status='active' for update",
  "active_run.run_id<>p_expected_run_id",
  "prior.canonical_payload<>payload",
  "prior.committed_result||jsonb_build_object('idempotent_replay',true)",
  "progress.grab_complete or progress.left_start_room",
  "public.s3b_grab_pre014",
  "public.s3b_leave_start_room_pre014",
  "'grab_completed'",
  "'start_room_left'",
  "p_client_request_id,p_client_request_id",
  "'player_location','corridor'",
  "insert into public.s3b_action_receipts(",
  "revoke all on table public.s3b_action_receipts from public,anon,authenticated",
  "grant execute on function public.s3b_grab_and_leave(text,text,uuid,uuid) to anon,authenticated",
])assert(sql.includes(token),`Missing W03 SQL contract: ${token}`);

assert(sql.indexOf("select * into prior from public.s3b_action_receipts")<sql.indexOf("progress.grab_complete or progress.left_start_room"),"Replay lookup does not precede already-committed rejection.");
assert(sql.indexOf("'grab_completed'")<sql.indexOf("public.s3b_grab_pre014")&&sql.indexOf("'start_room_left'")<sql.indexOf("public.s3b_leave_start_room_pre014"),"Canonical W03 events are not transactionally paired with delegated mutations.");
assert((sql.match(/create function public\.s3b_grab_and_leave/g)||[]).length===1,"W03 defines more than one combined public action.");
assert(!sql.includes("update public.s3b_player_progress set grab_complete")&&!sql.includes("insert into public.s3_player_items"),"W03 duplicates legacy item/progress authority instead of reusing owner mutations.");
assert(sql.includes("revoke execute on function public.s3b_grab(text,text),public.s3b_leave_start_room(text,text)"),"Displaced two-RPC client path remains executable.");

assert(app.includes('data-s3b-rpc="s3b_grab_and_leave"')&&app.includes('localizedHtml("act02.022")'),"Player UI lacks the approved bilingual combined action.");
assert(!app.includes('data-s3b-rpc="s3b_grab"')&&!app.includes('data-s3b-rpc="s3b_leave_start_room"'),"Player UI still renders the displaced two-click flow.");
assert(app.includes('requestIdentity("s3b-grab-leave",runId')&&app.includes("payload.p_expected_run_id=runId"),"Combined action does not reuse stable request identity with expected run binding.");
assert(app.includes("if(pending)clearRequestIdentity(pending.key)"),"Combined request identity is not cleared after confirmed success.");
console.log("W03 combined action static checks passed.");

