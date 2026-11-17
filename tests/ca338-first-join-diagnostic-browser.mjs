import http from "node:http";
import path from "node:path";
import {readFile} from "node:fs/promises";
import {createRequire} from "node:module";

const require=createRequire(import.meta.url),{chromium}=require("playwright");
const root=process.cwd(),chrome=process.env.GAL_A1_BROWSER||(process.platform==="win32"?"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe":""),assert=(value,message)=>{if(!value)throw new Error(message)};
function mime(file){return file.endsWith(".html")?"text/html":file.endsWith(".css")?"text/css":file.endsWith(".js")?"text/javascript":"application/octet-stream"}
async function server(){const instance=http.createServer(async(req,res)=>{try{const rel=decodeURIComponent(new URL(req.url,"http://x").pathname).replace(/^\/+/,"")||"index.html",file=path.resolve(root,rel);assert(file.startsWith(root+path.sep),"path escape");res.writeHead(200,{"Content-Type":mime(file),"Cache-Control":"no-store"});res.end(await readFile(file))}catch{res.writeHead(404);res.end()}});await new Promise(resolve=>instance.listen(0,"127.0.0.1",resolve));return{instance,url:`http://127.0.0.1:${instance.address().port}`}}
async function install(page,calls){await page.route("**/rest/v1/rpc/**",route=>{const name=new URL(route.request().url()).pathname.split("/").pop(),body=route.request().postDataJSON?.()||{};calls.push({name,body});let value;if(name==="s1_join_player")value={player_id:"00000000-0000-0000-0000-000000000338",display_name:"Gitte",role_slot:"GAL-A",session_token:"joined-first-try"};else if(name==="s8_get_player_state")value={active:false};else if(name==="s2_get_player_state")value={active:false};else if(name==="asset_resolve")value={ok:false};else value={ok:true,diagnostic_unexpected_rpc:name};return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(value)})})}

const local=await server(),browser=await chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{})}),context=await browser.newContext(),page=await context.newPage(),calls=[],errors=[];
page.on("console",message=>{if(message.type()==="error")errors.push(message.text())});page.on("pageerror",error=>errors.push(error.message));
try{
  await install(page,calls);await page.goto(local.url,{waitUntil:"networkidle"});
  await page.locator("#roomCode").fill(" ca338 ");await page.locator("#joinCode").fill("FIRST");await page.locator("#joinButton").click();
  await page.waitForFunction(()=>document.querySelector("#sprint3bText")?.textContent.includes("Wait for the Teacher"));
  const joins=calls.filter(call=>call.name==="s1_join_player"),unexpected=calls.filter(call=>!["s1_join_player","s8_get_player_state","s2_get_player_state","asset_resolve"].includes(call.name));assert(joins.length===1,"First Join click did not issue exactly one RPC");assert(joins[0].body.p_room_code==="CA338"&&joins[0].body.p_join_code==="FIRST","Join normalization changed the supplied credentials");assert(await page.locator("#gamePanel").isVisible(),"Successful first Join required a refresh before showing the game");assert(unexpected.length===0,`First Join issued unexpected RPCs: ${unexpected.map(call=>call.name).join(",")}`);assert(errors.length===0,`First Join emitted browser errors: ${errors.join(" | ")}`);

  await page.evaluate(()=>localStorage.removeItem("gal_castle_escape_session_v1"));
  const enterPage=await context.newPage(),enterCalls=[];await install(enterPage,enterCalls);await enterPage.goto(local.url,{waitUntil:"networkidle"});await enterPage.locator("#roomCode").fill("CA338E");await enterPage.locator("#joinCode").fill("ENTER");await enterPage.locator("#joinCode").press("Enter");await enterPage.waitForTimeout(100);
  assert(enterCalls.filter(call=>call.name==="s1_join_player").length===0,"Diagnostic assumption changed: Enter now submits Join");
  console.log(JSON.stringify({firstClick:"PASS_WITHOUT_REFRESH",enterKey:"NO_SUBMISSION_CURRENT_BEHAVIOR",rpcCount:joins.length,browserErrors:errors.length}));
  console.log("CA338 first Join diagnostic browser check passed.");
}finally{await context.close();await browser.close();await new Promise(resolve=>local.instance.close(resolve))}
