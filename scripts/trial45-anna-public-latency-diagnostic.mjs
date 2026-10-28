import http from "node:http";
import path from "node:path";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {createRequire} from "node:module";

const require=createRequire(import.meta.url);
const {chromium}=require("playwright");
const {createPilotState,installPlayerRoutes}=require("../tests/helpers/v4-two-scene-pilot-driver.js");
const root=process.cwd();
const output=path.join(root,"docs/reports/remediation/ui/trial45-anna-latency/MEASUREMENTS.json");
const chrome=process.env.GAL_A1_BROWSER||"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const diaryPath="game-assets/prop_anna_diary_open/v001/prop_anna_diary_open__v001.webp";
const diaryUrl=`https://qdcbdcjobzytzhnhfwyn.supabase.co/storage/v1/object/public/${diaryPath}`;
const assert=(value,message)=>{if(!value)throw new Error(message)};
const json=(route,value)=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(value)});
const state=createPilotState("act3");
const role={index:1,slot:"GAL-B",name:"Anna",choice:"read_diary"};
function mime(file){return file.endsWith(".html")?"text/html":file.endsWith(".css")?"text/css":file.endsWith(".js")?"text/javascript":"application/octet-stream"}
async function server(){
  const instance=http.createServer(async(req,res)=>{
    try{
      const relative=decodeURIComponent(new URL(req.url,"http://x").pathname).replace(/^\/+/, "")||"index.html";
      const file=path.resolve(root,relative);
      assert(file.startsWith(root+path.sep),"path escape");
      const body=await readFile(file);
      res.writeHead(200,{"Content-Type":mime(file),"Cache-Control":"no-store"});
      res.end(body);
    }catch{if(!res.headersSent)res.writeHead(404);res.end()}
  });
  await new Promise(resolve=>instance.listen(0,"127.0.0.1",resolve));
  return{instance,url:`http://127.0.0.1:${instance.address().port}`};
}
function s3b(){return{active:true,run_id:"00000000-0000-4000-8000-0000000004a0",scene:{scene_id:"act1_wake_up",phase_key:"private_first_action",step_key:"consequence",text_key:"act01-g.018"},flow:{},me:{act1_stage:"consequence",act1_choice_id:"read_diary",act1_text_keys:["act01-g.023"],first_meeting_locked_at:null,grab_complete:false,left_start_room:false},queued_first_messages:[],act4_revealed:[]}}
function pocket(){return{active:true,items:[{item_key:"anna_servant_diary",name_text_key:"item.servant_diary",current_view:"front"}],inspected_item_keys:["anna_servant_diary"],group_items:[],observations:[],shared_photos:[],scene:{allow_share_photo:false}}}
async function install(page){
  await page.addInitScript(()=>{globalThis.__GAL_A1_TEST_HOOKS__={}});
  await installPlayerRoutes(page,"act3",{state,playerIndex:role.index});
  await page.route("**/rest/v1/rpc/s3b_get_player_state",route=>json(route,s3b()));
  await page.route("**/rest/v1/rpc/s3_get_player_state",route=>json(route,pocket()));
  await page.route("**/rest/v1/rpc/asset_resolve",async route=>{
    await new Promise(resolve=>setTimeout(resolve,250));
    const key=route.request().postDataJSON()?.p_asset_key;
    return json(route,key==="prop_anna_diary_open"?{ok:true,storage_path:diaryPath}:{ok:false});
  });
}
async function sample(browser,label,base,viewport,context,page,index,cacheState){
  if(!page){context=await browser.newContext({viewport,deviceScaleFactor:1});page=await context.newPage();await install(page)}
  const started=performance.now();
  await page.goto(`${base}/index.html?diagnostic=${label}-${viewport.width}-${index}-${Date.now()}`,{waitUntil:"domcontentloaded"});
  const domContentLoadedMs=Math.round(performance.now()-started);
  await page.locator("#formalSceneMount #s3bSceneImage").waitFor();
  const sceneMountedMs=Math.round(performance.now()-started);
  const refreshStarted=performance.now();
  await Promise.all([0,1,2].map(()=>page.evaluate(()=>globalThis.__GAL_A1_TEST_HOOKS__.refreshState())));
  const refreshMs=Math.round(performance.now()-refreshStarted);
  let timedOut=false;
  try{await page.waitForFunction(()=>{const n=document.querySelector('#formalSceneMount img[data-asset-key="prop_anna_diary_open"]');return n?.isConnected&&n.naturalWidth>0&&n.dataset.assetState==="decoded"},null,{timeout:4000})}catch{timedOut=true}
  const decodedMs=Math.round(performance.now()-started);
  const detail=await page.evaluate(url=>{
    const n=document.querySelector('#formalSceneMount img[data-asset-key="prop_anna_diary_open"]');
    const entries=performance.getEntriesByName(url).map(e=>({startTime:Math.round(e.startTime),duration:Math.round(e.duration),transferSize:e.transferSize,encodedBodySize:e.encodedBodySize,decodedBodySize:e.decodedBodySize}));
    return{connected:Boolean(n?.isConnected),naturalWidth:n?.naturalWidth||0,naturalHeight:n?.naturalHeight||0,state:n?.dataset.assetState||null,entries};
  },diaryUrl);
  return{record:{label,viewport,cacheState,index,domContentLoadedMs,sceneMountedMs,refreshMs,decodedMs,timedOut,...detail},context,page};
}
async function series(browser,label,base,viewport){
  const records=[];
  for(let i=0;i<3;i++){const x=await sample(browser,label,base,viewport,null,null,i,"cold-context");records.push(x.record);await x.context.close()}
  let context=null,page=null;
  for(let i=0;i<3;i++){const x=await sample(browser,label,base,viewport,context,page,i,"warm-context");records.push(x.record);context=x.context;page=x.page}
  await context.close();
  return records;
}
function summarize(records){
  const values=records.map(x=>x.decodedMs).sort((a,b)=>a-b);
  const mean=Math.round(values.reduce((a,b)=>a+b,0)/values.length);
  return{n:values.length,min:values[0],median:values[Math.floor(values.length/2)],mean,p90:values[Math.ceil(values.length*.9)-1],max:values.at(-1),over2500:values.filter(x=>x>2500).length,timeouts:records.filter(x=>x.timedOut).length};
}
async function main(){
  const local=await server(),browser=await chromium.launch({headless:true,executablePath:chrome});
  try{
    const records=[];
    for(const viewport of[{width:1280,height:720},{width:1366,height:768}]){
      records.push(...await series(browser,"recovered-public","https://meifeng202309-commits.github.io/GAL-Escape-Castle",viewport));
      records.push(...await series(browser,"accepted-candidate-local-page-production-media",local.url,viewport));
    }
    const groups={};
    for(const label of [...new Set(records.map(x=>x.label))])for(const cacheState of ["cold-context","warm-context"]){
      const subset=records.filter(x=>x.label===label&&x.cacheState===cacheState);
      groups[`${label}/${cacheState}`]=summarize(subset);
    }
    const result={generatedAt:new Date().toISOString(),clock:"performance.now immediately before page.goto through connected diary img naturalWidth>0 and data-asset-state=decoded, after DOMContentLoaded, scene mount, and three concurrent refreshState calls",resolverDelayMs:250,thresholdMs:2500,mediaUrl:diaryUrl,records,groups};
    await mkdir(path.dirname(output),{recursive:true});
    await writeFile(output,JSON.stringify(result,null,2));
    console.log(JSON.stringify({groups},null,2));
  }finally{await browser.close();await new Promise(resolve=>local.instance.close(resolve))}
}
main().catch(error=>{console.error(error.stack||error);process.exitCode=1});
