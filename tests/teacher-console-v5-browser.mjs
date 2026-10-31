import http from "node:http";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import {promises as fsp} from "node:fs";
import {spawn} from "node:child_process";

const root=process.cwd();
const chrome=process.env.GAL_A1_BROWSER||"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const out=path.join(root,"docs","reports","remediation","ui","teacher-console-v5-browser");
const assert=(value,message)=>{if(!value)throw new Error(message)};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function mime(file){return file.endsWith(".html")?"text/html":file.endsWith(".css")?"text/css":file.endsWith(".js")||file.endsWith(".mjs")?"text/javascript":file.endsWith(".png")?"image/png":"application/octet-stream"}
async function startServer(){
  const server=http.createServer(async(req,res)=>{try{const relative=decodeURIComponent(new URL(req.url,"http://local").pathname).replace(/^\/+/,"")||"teacher.html",file=path.resolve(root,relative);assert(file.startsWith(root+path.sep),"path escape");const body=await fsp.readFile(file);res.writeHead(200,{"Content-Type":mime(file),"Cache-Control":"no-store"});res.end(body)}catch(error){if(!res.headersSent)res.writeHead(404);res.end(String(error.message))}});
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  return{server,url:`http://127.0.0.1:${server.address().port}`};
}

class Cdp{
  constructor(url){this.ws=new WebSocket(url);this.id=0;this.pending=new Map();this.listeners=new Map();this.ws.onmessage=event=>{const message=JSON.parse(event.data);if(message.id){const pending=this.pending.get(message.id);if(!pending)return;this.pending.delete(message.id);message.error?pending.reject(new Error(message.error.message)):pending.resolve(message.result);return}for(const listener of this.listeners.get(message.method)||[])void listener(message.params)}}
  async ready(){if(this.ws.readyState===WebSocket.OPEN)return;await new Promise((resolve,reject)=>{this.ws.onopen=resolve;this.ws.onerror=reject})}
  send(method,params={}){const id=++this.id;this.ws.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject}))}
  on(method,listener){this.listeners.set(method,[...(this.listeners.get(method)||[]),listener])}
  close(){this.ws.close()}
}

async function waitForFile(file,timeout=10000){const end=Date.now()+timeout;while(Date.now()<end){if(fs.existsSync(file))return;await sleep(50)}throw new Error(`Timed out waiting for ${file}`)}
async function waitFor(cdp,expression,message,timeout=8000){const end=Date.now()+timeout;while(Date.now()<end){const result=await evaluate(cdp,expression);if(result)return result;await sleep(40)}throw new Error(message)}
async function evaluate(cdp,expression){const result=await cdp.send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value}

const runId="00000000-0000-4000-8000-000000000074";
const exportId="00000000-0000-4000-8000-000000000e74";
const state={joined:true,active:false,failStart:true,calls:[]};
const players=()=>["Gitte","Anna","Linda"].map((display_name,index)=>({player_id:`00000000-0000-4000-8000-00000000000${index+1}`,role_slot:["GAL-A","GAL-B","GAL-C"][index],display_name,joined:state.joined,last_seen_at:"2026-10-31T06:00:00Z"}));
function responseFor(name){
  if(name==="s1_get_teacher_state")return{room_code:"V5TEST",phase:"collecting",players:players(),decisions:[]};
  if(name==="s6_get_teacher_discussion_state")return{sprint6_active:false};
  if(name==="s5_get_teacher_discussion_state")return{sprint5_active:false};
  if(name==="s2_get_teacher_state")return state.active?{active:true,canonical_flow_active:true,run:{run_id:runId,run_mode:"normal",behavior_dataset_eligible:true},discussion:null,current_votes:[],messages:[],teacher_override:{allowed_actions:[],history:[]}}:{active:false,teacher_override:{allowed_actions:[],history:[]}};
  if(name==="s7_get_teacher_console")return state.active?{active:true,run:{run_id:runId,run_mode:"normal",audit_private_debug_view:false},current:{act_no:1,scene_id:"act1_wake_up",phase_key:"private_first_action",step_key:"choice",current_route:null,display_mode:"ACTION_SCREEN"},players:[],operations_v1:[],pockets:[],group_items:[],countdown:{remaining_seconds:null},audio:{recent:[]},phase_behavior_validity:[],teacher_interventions:[],override_history:[],export:{}}:{active:false,export:{}};
  if(name==="s8_get_finalization_state")return{};
  if(name==="s9_start_formal_game"){if(state.failStart){state.failStart=false;return{error:{code:"START_FAIL",message:"Injected start failure"}}}state.active=true;return{run_id:runId,formal_state:"active"}}
  if(name==="s10_export_session_snapshot")return{export_id:exportId,run_id:runId,json_filename:"v5_in_progress.json",csv_filename:"v5_in_progress.csv",json:{header:{restorable:false}},csv:"timestamp,record_type\n"};
  if(name==="s10_reset_room_for_next_session"){state.active=false;state.joined=false;return{ok:true,room_code:"V5TEST",deleted_active_run_id:runId,players_released:3}}
  return{};
}

async function main(){
  assert(fs.existsSync(chrome),`Chrome not found: ${chrome}`);
  await fsp.mkdir(out,{recursive:true});
  const local=await startServer(),profile=await fsp.mkdtemp(path.join(os.tmpdir(),"gal-v5-cdp-"));
  const child=spawn(chrome,["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--remote-debugging-port=0",`--user-data-dir=${profile}`,"about:blank"],{stdio:"ignore"});
  let cdp;
  try{
    const activePort=path.join(profile,"DevToolsActivePort");await waitForFile(activePort);const [port]=String(await fsp.readFile(activePort,"utf8")).trim().split(/\r?\n/);
    const targets=await fetch(`http://127.0.0.1:${port}/json/list`).then(response=>response.json()),target=targets.find(item=>item.type==="page");assert(target,"Chrome page target unavailable");
    cdp=new Cdp(target.webSocketDebuggerUrl);await cdp.ready();
    cdp.on("Page.javascriptDialogOpening",()=>cdp.send("Page.handleJavaScriptDialog",{accept:true}));
    cdp.on("Fetch.requestPaused",async event=>{
      try{
        const url=new URL(event.request.url);
        if(event.request.method==="OPTIONS"){await cdp.send("Fetch.fulfillRequest",{requestId:event.requestId,responseCode:204,responseHeaders:[{name:"Access-Control-Allow-Origin",value:"*"},{name:"Access-Control-Allow-Headers",value:"*"},{name:"Access-Control-Allow-Methods",value:"POST, OPTIONS"}]});return}
        const name=url.pathname.split("/").pop();state.calls.push(name);if(["s9_start_formal_game","s10_export_session_snapshot","s10_reset_room_for_next_session"].includes(name))await sleep(180);
        const value=responseFor(name),failed=value?.error;await cdp.send("Fetch.fulfillRequest",{requestId:event.requestId,responseCode:failed?400:200,responseHeaders:[{name:"Content-Type",value:"application/json"},{name:"Access-Control-Allow-Origin",value:"*"}],body:Buffer.from(JSON.stringify(failed?value.error:value)).toString("base64")});
      }catch(error){await cdp.send("Fetch.failRequest",{requestId:event.requestId,errorReason:"Failed"}).catch(()=>{});throw error}
    });
    await cdp.send("Page.enable");await cdp.send("Runtime.enable");await cdp.send("Fetch.enable",{patterns:[{urlPattern:"*://*/rest/v1/rpc/*",requestStage:"Request"}]});
    await cdp.send("Emulation.setDeviceMetricsOverride",{width:1366,height:768,deviceScaleFactor:1,mobile:false});
    await cdp.send("Page.navigate",{url:`${local.url}/teacher.html`});await waitFor(cdp,"document.readyState==='complete'","Teacher page did not load");
    await evaluate(cdp,`(()=>{roomCode.value='V5TEST';teacherToken.value='teacher-token';codeGitte.value='G-1';codeAnna.value='A-1';codeLinda.value='L-1';watchButton.click();return true})()`);
    await waitFor(cdp,"document.querySelector('#roomState')?.innerText.includes('3/3 connected')&&!startRunButton.disabled","3/3 state did not enable Start");
    const desktop=await evaluate(cdp,`(()=>{const r=s=>{const b=document.querySelector(s).getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height}};return{live:r('.teacher-live-panel'),discussion:r('.teacher-discussion-panel'),tools:r('.teacher-v5-tools'),host:r('.teacher-host-panel'),overflow:document.documentElement.scrollWidth-innerWidth}})()`);
    assert(desktop.live.x<desktop.discussion.x&&Math.abs(desktop.live.y-desktop.discussion.y)<2,"Desktop live/discussion layout failed");assert(desktop.tools.x<desktop.host.x&&Math.abs(desktop.tools.y-desktop.host.y)<2,"Desktop tools/host layout failed");assert(desktop.overflow<=1,"Desktop horizontal overflow detected");
    await evaluate(cdp,"startRunButton.click();true");await waitFor(cdp,"startRunButton.textContent==='Processing...'","Start did not show Processing");await waitFor(cdp,"startRunStatus.textContent.includes('[START_FAIL]')&&!startRunButton.disabled","Failed start did not expose code and recover availability");
    await evaluate(cdp,"startRunButton.click();true");await waitFor(cdp,"startRunButton.textContent==='Processing...'","Successful Start did not show Processing");await waitFor(cdp,"startRunButton.hidden&&exportCurrentSnapshotButton.dataset.runId","Active run did not hide Start or enable snapshot export");
    await evaluate(cdp,"exportCurrentSnapshotButton.click();true");await waitFor(cdp,"exportCurrentSnapshotButton.textContent==='Processing...'","Snapshot did not show Processing");await waitFor(cdp,"currentExportStatus.textContent.includes('v5_in_progress.json')","Snapshot did not complete");
    await evaluate(cdp,"confirmExportSaved.checked=true;confirmExportSaved.dispatchEvent(new Event('change'));true");assert(await evaluate(cdp,"!clearRoomButton.disabled"),"Exact-export attestation did not enable Clear");
    await evaluate(cdp,"clearRoomButton.click();true");await waitFor(cdp,"clearRoomButton.textContent==='Processing...'","Clear did not show Processing");await waitFor(cdp,"document.querySelector('#roomState')?.innerText.includes('0/3 connected')","Clear did not release Players");assert(await evaluate(cdp,"!startRunButton.hidden&&startRunButton.textContent.includes('开始正式游戏')&&!startRunStatus.textContent"),"Start did not restore its normal unavailable state after room clear");
    const attestation=await evaluate(cdp,"document.querySelector('.teacher-clear-confirm').innerText");assert(attestation.includes("does not verify")&&attestation.includes("complete or readable"),"Backup attestation warning is missing");
    await cdp.send("Emulation.setDeviceMetricsOverride",{width:900,height:768,deviceScaleFactor:1,mobile:false});await sleep(150);
    const narrow=await evaluate(cdp,`(()=>{const r=s=>document.querySelector(s).getBoundingClientRect();const live=r('.teacher-live-panel'),discussion=r('.teacher-discussion-panel'),host=r('.teacher-host-panel'),tools=r('.teacher-v5-tools');return{liveY:live.y,discussionY:discussion.y,hostY:host.y,toolsY:tools.y,overflow:document.documentElement.scrollWidth-innerWidth}})()`);
    assert(narrow.liveY<narrow.discussionY&&narrow.hostY<narrow.toolsY,"Narrow whole-page order failed");assert(narrow.overflow<=1,"Narrow horizontal overflow detected");
    const shot=await cdp.send("Page.captureScreenshot",{format:"png",captureBeyondViewport:true});await fsp.writeFile(path.join(out,"teacher-v5-cdp-900x768.png"),Buffer.from(shot.data,"base64"));
    const evidence={generatedAt:new Date().toISOString(),desktop,narrow,calls:state.calls,assertions:{threeOfThreeStartGate:true,processing:true,failedCode:true,startHidesWhenActive:true,startRestoresAfterClear:true,snapshotEnablesExactExportClear:true,clearReleasesPlayers:true,backupAttestationWarning:true,responsiveWholePageScroll:true}};
    await fsp.writeFile(path.join(out,"TEACHER_V5_BROWSER_EVIDENCE.json"),JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence,null,2));console.log("Teacher Console V5 raw-CDP browser gate passed.");
  }finally{cdp?.close();child.kill();await new Promise(resolve=>local.server.close(resolve));await fsp.rm(profile,{recursive:true,force:true}).catch(()=>{})}
}

main().catch(error=>{console.error(error.stack||error);process.exitCode=1});
