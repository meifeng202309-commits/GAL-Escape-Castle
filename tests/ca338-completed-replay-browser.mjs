import http from "node:http";
import path from "node:path";
import {readFile} from "node:fs/promises";
import {createRequire} from "node:module";

const require=createRequire(import.meta.url),{chromium}=require("playwright");
const root=process.cwd(),chrome=process.env.GAL_A1_BROWSER||(process.platform==="win32"?"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe":"");
const session={room_code:"CA338",player_id:"00000000-0000-0000-0000-000000000338",display_name:"Gitte",role_slot:"GAL-A",session_token:"fixture-token"};
const runId="00000000-0000-0000-0000-000000000839";
const assert=(value,message)=>{if(!value)throw new Error(message)};
function mime(file){return file.endsWith(".html")?"text/html":file.endsWith(".css")?"text/css":file.endsWith(".js")?"text/javascript":"application/octet-stream"}
async function server(){const instance=http.createServer(async(req,res)=>{try{const rel=decodeURIComponent(new URL(req.url,"http://x").pathname).replace(/^\/+/,"")||"index.html",file=path.resolve(root,rel);assert(file.startsWith(root+path.sep),"path escape");res.writeHead(200,{"Content-Type":mime(file),"Cache-Control":"no-store"});res.end(await readFile(file))}catch{res.writeHead(404);res.end()}});await new Promise(resolve=>instance.listen(0,"127.0.0.1",resolve));return{instance,url:`http://127.0.0.1:${instance.address().port}`}}
async function routeRpc(page,completed){await page.route("**/rest/v1/rpc/**",route=>{const name=new URL(route.request().url()).pathname.split("/").pop();let value;if(name==="s8_get_player_state")value=completed?{active:true,game_completed:true,run_id:runId}:{active:false};else if(name==="s2_get_player_state")value={active:false};else if(name==="asset_resolve")value={ok:false};else return route.fulfill({status:400,contentType:"application/json",body:JSON.stringify({message:`Unexpected RPC ${name}`})});return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(value)})})}

const local=await server(),browser=await chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{})}),context=await browser.newContext();
try{
  await context.addInitScript(saved=>{localStorage.setItem("gal_castle_escape_session_v1",JSON.stringify(saved));globalThis.__GAL_A1_TEST_HOOKS__={}},session);
  const page=await context.newPage();await routeRpc(page,true);await page.goto(local.url,{waitUntil:"networkidle"});
  assert(await page.locator('[data-s8-stage="fade"]').count()===1,"First completion did not start the finale");
  const firstSwitch=page.locator("#s8SwitchSession");assert(await firstSwitch.isVisible()&&await firstSwitch.isEnabled(),"Finale hid the session switch");
  await page.reload({waitUntil:"networkidle"});
  assert(await page.locator('[data-s8-stage="end"]').count()===1,"Refresh replayed a previously presented finale");
  await page.locator("#s8SwitchSession").click();
  assert(await page.locator("#joinPanel").isVisible(),"Finale switch did not return to Join");
  assert(await page.evaluate(()=>localStorage.getItem("gal_castle_escape_session_v1"))===null,"Finale switch retained the old session");
  await page.waitForTimeout(2100);assert(await page.locator(".s8-ending").count()===0,"Cancelled finale timer overlaid Join again");

  const reconnect=await context.newPage();await routeRpc(reconnect,false);await reconnect.goto(local.url,{waitUntil:"networkidle"});
  assert(await reconnect.locator("#gamePanel").isVisible()&&await reconnect.locator("#joinPanel").isHidden(),"In-progress/pre-run reconnect was incorrectly discarded");
  assert((await reconnect.locator("#sprint3bText").innerText()).includes("Wait for the Teacher"),"Reconnect did not preserve the waiting lifecycle");
  console.log("CA338 completed replay, visible switch, timer cancellation and reconnect browser checks passed.");
}finally{await context.close();await browser.close();await new Promise(resolve=>local.instance.close(resolve))}
