import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require=createRequire(import.meta.url);
const {chromium}=require("playwright");
const root=process.cwd();
const browserExecutable=process.env.GAL_A1_BROWSER||"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const assert=(value,message)=>{if(!value)throw new Error(message)};

function mime(file){if(file.endsWith(".html"))return"text/html; charset=utf-8";if(file.endsWith(".js"))return"text/javascript; charset=utf-8";if(file.endsWith(".css"))return"text/css; charset=utf-8";return"application/octet-stream"}
async function startServer(){const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,"http://127.0.0.1"),relative=decodeURIComponent(url.pathname==="/"?"/teacher.html":url.pathname).replace(/^\/+/,""),file=path.resolve(root,relative);assert(file===root||file.startsWith(`${root}${path.sep}`),"Path escaped root");res.writeHead(200,{"Content-Type":mime(file),"Cache-Control":"no-store"});res.end(await readFile(file))}catch{res.writeHead(404);res.end("Not found")}});await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));return{server,url:`http://127.0.0.1:${server.address().port}/teacher.html`}}

const player=(id,name,legacyLocation="LEGACY_WRONG")=>({player_id:id,display_name:name,role_slot:`GAL-${id}`,online:true,submitted:false,player_location:legacyLocation,locked_choice_value:null,locked_choice_state:"WAITING"});
const operation=(id,overrides={})=>({version:1,player_id:id,role_slot:`GAL-${id}`,physical_location:"library",transition_state:"NONE",discussion_or_vote_state:"WAITING",assignment_role:null,engagement_state:"NOT_APPLICABLE",task_state:"NOT_APPLICABLE",connection_state:"ONLINE",source_domain:"S3B",source_identity:{run_id:"run-same",table_name:"s3b_player_progress"},validity:"VALID",reason_code:null,...overrides});
function frame(operations){return{active:true,run:{run_id:"run-same",run_mode:"normal",audit_private_debug_view:false},current:{act_no:6,scene_id:"test",phase_key:"test",step_key:"test"},players:[player("A","Gitte"),player("B","Anna"),player("C","Linda")],operations_v1:operations,discussion:{messages:[]},pockets:[],group_items:[],audio:{recent:[]},phase_behavior_validity:[],teacher_interventions:[],override_history:[],export:{export_ready:false}}}

async function main(){
  const local=await startServer(),browser=await chromium.launch({headless:true,executablePath:browserExecutable}),context=await browser.newContext(),page=await context.newPage();
  let currentFrame;
  await page.route("**/rest/v1/rpc/**",async route=>{const name=new URL(route.request().url()).pathname.split("/").pop();if(name==="s7_get_teacher_console")return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(currentFrame)});if(name==="s8_get_finalization_state")return route.fulfill({status:200,contentType:"application/json",body:"{\"export_ready\":false}"});return route.fulfill({status:400,contentType:"application/json",body:`{\"message\":\"Unexpected RPC ${name}\"}`})});
  async function render(operations){currentFrame=frame(operations);await page.evaluate(()=>{document.querySelector("#operationsStatus").textContent="TEST_REFRESH_PENDING"});await page.click("#refreshOperationsButton");await page.waitForFunction(()=>document.querySelector("#operationsStatus")?.textContent==="Live operations refreshed.");return page.locator("#operationsState").textContent()}
  try{
    await page.goto(local.url,{waitUntil:"networkidle"});await page.fill("#roomCode","BMIN1");await page.fill("#teacherToken","TEST");

    let text=await render([
      operation("A",{physical_location:"portrait_hall",transition_state:"ENTERED_PORTRAIT_WAITING_FOR_GROUP"}),
      operation("B",{physical_location:"portrait_hall",transition_state:"ENTERED_PORTRAIT_WAITING_FOR_GROUP"}),
      operation("C",{physical_location:"library",transition_state:"ACT6_ENTRY_OBSERVED_NOT_ENTERED"}),
    ]);
    assert(text.includes("portrait_hall")&&text.includes("library")&&text.includes("ENTERED_PORTRAIT_WAITING_FOR_GROUP")&&text.includes("ACT6_ENTRY_OBSERVED_NOT_ENTERED"),"Mixed ACT6 projection was not rendered");
    assert(!text.includes("LEGACY_WRONG"),"Displaced legacy player_location still controls Teacher location");

    text=await render(["A","B","C"].map(id=>operation(id,{physical_location:"portrait_hall",source_domain:"S5",source_identity:{run_id:"run-same",table_name:"s5_run_state"}})));
    assert((text.match(/portrait_hall/g)||[]).length===3&&(text.match(/S5 · VALID/g)||[]).length===3,"Activated S5 shared ownership was not rendered for all players");

    text=await render([
      operation("A",{physical_location:"main_gate",source_domain:"S6",assignment_role:"A",engagement_state:"ENGAGED",task_state:"COMPLETE"}),
      operation("B",{physical_location:"main_gate",source_domain:"S6",assignment_role:"B",engagement_state:"ASSIGNED_NOT_ENGAGED",task_state:"COMPLETE"}),
      operation("C",{physical_location:"main_gate",source_domain:"S6",assignment_role:"WATCHER",engagement_state:"ASSIGNED_NOT_ENGAGED",task_state:"PENDING"}),
    ]);
    assert((text.match(/main_gate/g)||[]).length===3&&text.includes("Role A")&&text.includes("Role B")&&text.includes("Role WATCHER"),"ACT11 role/location separation was not rendered");
    assert(!text.includes("location-WATCHER")&&!text.includes("station_b"),"Assignment leaked into physical location");

    text=await render([operation("A",{physical_location:"UNKNOWN",source_domain:"UNKNOWN",validity:"INVARIANT_BREACH",reason_code:"S6_WITHOUT_COMPLETED_S5"}),operation("B"),operation("C")]);
    assert(text.includes("UNKNOWN · INVARIANT_BREACH"),"Invalid ownership was not visible");

    currentFrame.players[0].locked_choice_value=null;currentFrame.operations_v1[0].private_choice="DO_NOT_RENDER_SECRET";
    text=await render(currentFrame.operations_v1);
    assert(!text.includes("DO_NOT_RENDER_SECRET"),"Non-contract private operations value leaked into NORMAL Teacher UI");
    console.log("B-min Teacher operations mocked browser cases passed.");
  }finally{await context.close();await browser.close();await new Promise(resolve=>local.server.close(resolve))}
}
main().catch(error=>{console.error(`FAIL ${error.stack||error.message}`);process.exitCode=1});
