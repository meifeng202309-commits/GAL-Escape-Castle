import http from "node:http";
import path from "node:path";
import {readFile} from "node:fs/promises";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url),{chromium}=require("playwright"),{RUN,createPilotState,installPlayerRoutes}=require("./helpers/v4-two-scene-pilot-driver.js");
const root=process.cwd(),chrome=process.env.GAL_A1_BROWSER||"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const assert=(v,m)=>{if(!v)throw new Error(m)};
function mime(f){return f.endsWith(".html")?"text/html":f.endsWith(".css")?"text/css":f.endsWith(".js")?"text/javascript":f.endsWith(".webp")?"image/webp":"application/octet-stream"}
async function server(){const instance=http.createServer(async(req,res)=>{try{const rel=decodeURIComponent(new URL(req.url,"http://x").pathname).replace(/^\/+/,"")||"index.html",file=path.resolve(root,rel);assert(file.startsWith(root+path.sep),"path escape");res.writeHead(200,{"Content-Type":mime(file),"Cache-Control":"no-store"});res.end(await readFile(file))}catch{res.writeHead(404);res.end()}});await new Promise(r=>instance.listen(0,"127.0.0.1",r));return{instance,url:`http://127.0.0.1:${instance.address().port}`}}
async function main(){const local=await server(),browser=await chromium.launch({headless:true,executablePath:chrome}),state=createPilotState("act3Discovery"),context=await browser.newContext(),page=await context.newPage();try{
  await installPlayerRoutes(page,"act3Discovery",{state,playerIndex:0});
  await page.goto(`${local.url}/index.html`,{waitUntil:"networkidle"});
  await page.locator('[data-library-discovery]').waitFor();
  assert(await page.locator('#libraryDiscoveryPhoto').count()===1&&await page.locator('#libraryDiscoveryNote').count()===1,"Both discovery images were not rendered");
  assert(await page.locator('[data-s3b-rpc="s3b_ack_library_discovery"]').getAttribute('data-s3b-run')===RUN,"Discovery acknowledgement omitted run identity");
  assert(await page.locator('#pocketMount [data-group-item="library_photo_1897"] img[data-pocket-asset="prop.photo_1897"]').count()===1,"Photo was not retained in Group Pocket");
  assert(await page.locator('#pocketMount [data-group-item="library_torn_note"] img[data-pocket-asset="prop.library_clock_clue_note"]').count()===1,"Note was not retained in Group Pocket");
  for(let i=0;i<5;i++)await page.evaluate(()=>globalThis.__GAL_A1_TEST_HOOKS__.refreshState());
  assert(await page.locator('[data-library-discovery]').count()===1,"Polling duplicated or lost discovery presentation");
  await page.locator('[data-s3b-rpc="s3b_ack_library_discovery"]').click();
  await page.waitForFunction(()=>document.querySelector('#sprint3bActions')?.textContent.includes('Accepted'));
  await page.reload({waitUntil:"networkidle"});
  assert(await page.locator('[data-library-discovery]').count()===1,"Reconnect lost durable discovery presentation");
  assert(await page.locator('[data-s3b-rpc="s3b_ack_library_discovery"]').count()===0,"Acknowledged Player was offered duplicate acknowledgement");
  console.log("ACT3 Library discovery browser reconnect/polling gate passed.");
}finally{await context.close();await browser.close();await new Promise(r=>local.instance.close(r))}}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1});
