import http from "node:http";
import path from "node:path";
import {readFile} from "node:fs/promises";
import {createRequire} from "node:module";

const require=createRequire(import.meta.url),{chromium}=require("playwright"),{createPilotState,installPlayerRoutes}=require("./helpers/v4-two-scene-pilot-driver.js");
const root=process.cwd(),chrome=process.env.GAL_A1_BROWSER;
const assert=(value,message)=>{if(!value)throw new Error(message)};
const files={"shared.great_hall":"assets/staging/shared.great_hall/v001/shared.great_hall__v001.webp","shared.great_hall.red_first":"assets/staging/shared.great_hall.red_first/v001/shared.great_hall.red_first__v001.webp","shared.great_hall.both_open":"assets/staging/shared.great_hall.both_open/v001/shared.great_hall.both_open__v001.webp"};
const anchors=[{anchor_name:"great_hall_red_door",x_percent:5,y_percent:20,width_percent:20,height_percent:60},{anchor_name:"great_hall_blue_door",x_percent:40,y_percent:20,width_percent:20,height_percent:60},{anchor_name:"great_hall_black_door",x_percent:75,y_percent:20,width_percent:20,height_percent:60}];
function mime(file){return file.endsWith(".html")?"text/html":file.endsWith(".css")?"text/css":file.endsWith(".js")||file.endsWith(".mjs")?"text/javascript":file.endsWith(".webp")?"image/webp":"application/octet-stream"}
async function server(){const instance=http.createServer(async(req,res)=>{try{const relative=decodeURIComponent(new URL(req.url,"http://x").pathname).replace(/^\/+/,"")||"index.html",file=path.resolve(root,relative);assert(file.startsWith(root+path.sep),"path escape");res.writeHead(200,{"Content-Type":mime(file),"Cache-Control":"no-store"});res.end(await readFile(file))}catch{res.writeHead(404);res.end("Not found")}});await new Promise(resolve=>instance.listen(0,"127.0.0.1",resolve));return{instance,url:`http://127.0.0.1:${instance.address().port}`}}
async function snapshot(page){return page.locator("#s6SceneImage").evaluate(node=>({key:node.dataset.assetKey,state:node.dataset.assetState,width:node.naturalWidth,height:node.naturalHeight,src:new URL(node.src).pathname,doors:[...document.querySelectorAll(".s6-door")].map(door=>({text:door.textContent.trim(),artwork:door.classList.contains("artwork-state"),hidden:door.hidden})),controls:document.querySelectorAll("#sprint3bActions button:not([disabled]), #s6MessageForm button:not([disabled])").length}))}
async function waitForKey(page,key){await page.waitForFunction(expected=>{const node=document.querySelector("#s6SceneImage");return node?.dataset.assetKey===expected&&node.dataset.assetState==="decoded"&&node.naturalWidth>0},key);return snapshot(page)}

const local=await server(),browser=await chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{})}),state=createPilotState("act9"),context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage();
let mode="healthy",failedVariantRequests=0;
try{
  await page.addInitScript(()=>{globalThis.__GAL_A1_TEST_HOOKS__={}});
  await installPlayerRoutes(page,"act9",{state,playerIndex:0});
  await page.route("**/rest/v1/rpc/asset_resolve",route=>{const key=route.request().postDataJSON()?.p_asset_key;if(mode==="missing"&&key!=="shared.great_hall")return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({ok:false,asset_key:key})});const file=files[key];return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(file?{ok:true,asset_key:key,storage_path:file,ui_anchors:key==="shared.great_hall"?anchors:[]}:{ok:false,asset_key:key})})});
  await page.route("**/storage/v1/object/public/**",async route=>{const relative=new URL(route.request().url()).pathname.split("/storage/v1/object/public/")[1];if(mode==="request-failure"&&relative.includes("shared.great_hall.red_first")){failedVariantRequests++;return route.fulfill({status:404,contentType:"text/plain",body:"missing"})}return route.fulfill({status:200,contentType:"image/webp",body:await readFile(path.resolve(root,relative))})});
  await page.goto(`${local.url}/index.html`,{waitUntil:"networkidle"});
  await waitForKey(page,"shared.great_hall");
  state.redActivated=true;await page.evaluate(()=>globalThis.__GAL_A1_TEST_HOOKS__.refreshState());const red=await waitForKey(page,"shared.great_hall.red_first");
  assert(red.src.endsWith(files["shared.great_hall.red_first"]),"Red-first did not render the exact checked-in WebP");assert(red.doors.every(door=>door.artwork&&!door.hidden)&&red.doors.every(door=>door.text),"Red-first lost door decoration or labels");
  await page.reload({waitUntil:"networkidle"});const redRefresh=await waitForKey(page,"shared.great_hall.red_first");assert(redRefresh.width>0&&redRefresh.controls>0,"Red-first did not survive refresh with playable controls");
  state.blueActivated=true;await page.evaluate(()=>globalThis.__GAL_A1_TEST_HOOKS__.refreshState());const both=await waitForKey(page,"shared.great_hall.both_open");assert(both.src.endsWith(files["shared.great_hall.both_open"]),"Both-open did not render the exact checked-in WebP");assert(both.doors.every(door=>door.artwork&&!door.hidden)&&both.controls>0,"Both-open lost decoration or controls");
  await page.reload({waitUntil:"networkidle"});await waitForKey(page,"shared.great_hall.both_open");
  mode="missing";await page.evaluate(()=>globalThis.__GAL_A1_TEST_HOOKS__.refreshState());const missing=await waitForKey(page,"shared.great_hall");assert(missing.doors.every(door=>!door.artwork&&!door.hidden)&&missing.controls>0,"Missing metadata did not restore base decoration and controls");
  mode="request-failure";state.blueActivated=false;await page.evaluate(()=>globalThis.__GAL_A1_TEST_HOOKS__.refreshState());const failed=await waitForKey(page,"shared.great_hall");assert(failedVariantRequests>0,"Real variant HTTP failure was not exercised");assert(failed.doors.every(door=>!door.artwork&&!door.hidden)&&failed.doors.every(door=>door.text)&&failed.controls>0,"HTTP failure did not restore the labeled playable base state");
  console.log(JSON.stringify({runtime:"index.html + src/game/app.js",httpBase:local.url,red,redRefresh,both,missing,failed,failedVariantRequests},null,2));
  console.log("ACT9 real-browser checked-in WebP, refresh, metadata fallback and HTTP failure checks passed.");
}finally{await context.close();await browser.close();await new Promise(resolve=>local.instance.close(resolve))}
