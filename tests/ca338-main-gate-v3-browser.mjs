import http from "node:http";
import path from "node:path";
import {readFile} from "node:fs/promises";
import {createRequire} from "node:module";

const require=createRequire(import.meta.url),{chromium}=require("playwright");
const root=process.cwd(),chrome=process.env.GAL_A1_BROWSER||(process.platform==="win32"?"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe":""),runId="00000000-0000-4000-8000-00000000c338";
const session={room_code:"CA338GATE",player_id:"00000000-0000-4000-8000-000000000338",display_name:"Gitte",role_slot:"GAL-A",session_token:"fixture-token"};
const sidecar=JSON.parse(await readFile(path.join(root,"assets/staging/shared.main_gate/v003/shared.main_gate__v003.json"),"utf8"));
const imagePath=path.join(root,"assets/staging/shared.main_gate/v003/shared.main_gate__v003.webp");
const state={goldKey:false};
const assert=(value,message)=>{if(!value)throw new Error(message)};
function mime(file){return file.endsWith(".html")?"text/html":file.endsWith(".css")?"text/css":file.endsWith(".js")?"text/javascript":"application/octet-stream"}
async function server(){const instance=http.createServer(async(req,res)=>{try{const rel=decodeURIComponent(new URL(req.url,"http://x").pathname).replace(/^\/+/,"")||"index.html",file=path.resolve(root,rel);assert(file.startsWith(root+path.sep),"path escape");res.writeHead(200,{"Content-Type":mime(file),"Cache-Control":"no-store"});res.end(await readFile(file))}catch{res.writeHead(404);res.end()}});await new Promise(resolve=>instance.listen(0,"127.0.0.1",resolve));return{instance,url:`http://127.0.0.1:${instance.address().port}`}}
function s6(){return{active:true,run_id:runId,state:{run_id:runId,act_no:11,phase_key:"act11_allocation",act9_step:4,round_no:1,gold_key:state.goldKey,feedback_text_keys:[]},scene_asset_key:"shared.main_gate",discussion:null,private_choices_revealed:[],allocation:null,audio_occurrence:null}}
function rpcValue(name,body){if(name==="s8_get_player_state")return{active:false};if(name==="s2_get_player_state")return{active:true,discussion:null};if(name==="s3b_get_player_state")return{active:true,run_id:runId,scene:{scene_id:"act11_main_gate",phase_key:"act11_allocation"},flow:{terminal_state:"ACT11"},me:{act6_entered_at:"2026-11-17T00:00:00Z"},queued_first_messages:[],act4_revealed:[]};if(name==="s5_get_player_state")return{active:false};if(name==="s6_get_player_state")return s6();if(name==="s9_get_player_wait_state")return{active:false};if(name==="s3_get_player_state")return{active:true,items:[],group_items:[],observations:[],shared_photos:[],inspected_item_keys:[],scene:{allow_share_photo:false}};if(name==="asset_resolve"&&body.p_asset_key==="shared.main_gate")return{ok:true,asset_key:"shared.main_gate",version:3,storage_path:"assets/staging/shared.main_gate/v003/shared.main_gate__v003.webp",ui_anchors:sidecar.ui_anchors};return null}

const local=await server(),browser=await chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{})}),context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage();
try{
  await page.addInitScript(saved=>{localStorage.setItem("gal_castle_escape_session_v1",JSON.stringify(saved));globalThis.__GAL_A1_TEST_HOOKS__={}},session);
  await page.route("**/rest/v1/rpc/**",route=>{const name=new URL(route.request().url()).pathname.split("/").pop(),body=route.request().postDataJSON?.()||{},value=rpcValue(name,body);return route.fulfill({status:value===null?400:200,contentType:"application/json",body:JSON.stringify(value===null?{message:`Unexpected RPC ${name}`}:value)})});
  await page.route("**/storage/v1/object/public/**",async route=>route.fulfill({status:200,contentType:"image/webp",body:await readFile(imagePath)}));
  await page.goto(local.url,{waitUntil:"networkidle"});await page.waitForFunction(()=>{const image=document.querySelector("#s6SceneImage");return image?.dataset.assetState==="decoded"&&image.naturalWidth>0});
  const embedded=page.locator('.s6-station-label[data-station-role="A"],.s6-station-label[data-station-role="B"],.s6-station-label[data-station-role="C"]');
  assert(await embedded.count()===3,"Main Gate did not retain all three station anchors");
  for(const node of await embedded.all()){assert((await node.getAttribute("class")).includes("artwork-state"),"Baked station was not marked as artwork");assert(!await node.locator(".localized").isVisible(),"Runtime duplicated a baked station letter")}
  assert(await page.locator('.s6-station-legend [data-station-role="A"] .localized').isHidden(),"Legend duplicated baked station A");
  const controls=page.locator('#sprint3bActions button[data-s6-rpc="s6_submit_allocation_v2"]');assert(await controls.count()===3,"A/B/C playable controls were lost");for(const control of await controls.all())assert(await control.isEnabled(),"Main Gate allocation control is disabled");

  state.goldKey=true;await page.evaluate(()=>globalThis.__GAL_A1_TEST_HOOKS__.refreshState());await page.waitForFunction(()=>document.querySelector('.s6-station-label[data-station-role="WATCHER"]'));
  assert(await page.locator('.s6-station-label[data-station-role="WATCHER"] .localized').isVisible(),"Watcher label was hidden even though it is not baked into the image");
  assert(await page.locator('#sprint3bActions button[data-s6-choice="WATCHER"]').isEnabled(),"Watcher playable control was lost");
  console.log("CA338 Main Gate v003 decoded image, anchors, baked-label suppression and controls passed.");
}finally{await context.close();await browser.close();await new Promise(resolve=>local.instance.close(resolve))}
