import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require=createRequire(import.meta.url);
const {chromium}=require("playwright");
const {createPilotState,installPlayerRoutes}=require("./helpers/v4-two-scene-pilot-driver.js");
const live="https://meifeng202309-commits.github.io/GAL-Escape-Castle";
const out=path.resolve("docs/reports/remediation/ui/trial45-p0p1");
const roles=[
  {index:0,slot:"GAL-A",name:"Gitte",items:["gitte_castle_map","gitte_number_note"]},
  {index:1,slot:"GAL-B",name:"Anna",items:["anna_servant_diary"]},
  {index:2,slot:"GAL-C",name:"Linda",items:["linda_stopped_watch","linda_star_key","linda_closure_order"]},
];
const assets={
  gitte_castle_map:"game-assets/prop_gitte_castle_map/v001/prop_gitte_castle_map__v001.webp",
  gitte_number_note:"game-assets/prop_gitte_number_note_front/v001/prop_gitte_number_note_front__v001.webp",
  anna_servant_diary:"game-assets/prop_anna_diary_open/v001/prop_anna_diary_open__v001.webp",
  linda_stopped_watch:"game-assets/prop_linda_watch_face/v001/prop_linda_watch_face__v001.webp",
  linda_star_key:"game-assets/prop_linda_star_key/v001/prop_linda_star_key__v001.webp",
  linda_closure_order:"game-assets/prop_linda_closure_order/v001/prop_linda_closure_order__v001.webp",
};
const names={gitte_castle_map:"item.castle_map",gitte_number_note:"item.number_note",anna_servant_diary:"item.servant_diary",linda_stopped_watch:"item.stopped_watch",linda_star_key:"item.silver_star_key",linda_closure_order:"item.municipal_closure_order"};
const assetKeys={gitte_castle_map:"prop_gitte_castle_map",gitte_number_note:"prop_gitte_number_note_front",anna_servant_diary:"prop_anna_diary_open",linda_stopped_watch:"prop_linda_watch_face",linda_star_key:"prop_linda_star_key",linda_closure_order:"prop_linda_closure_order"};
const sharedAssets={"shared.library":"game-assets/shared.library/v002/shared.library__v002.webp"};

function pocket(role,active=true){return active?{active:true,items:role.items.map(item_key=>({item_key,name_text_key:names[item_key],current_view:item_key==="gitte_castle_map"?"map":item_key==="anna_servant_diary"?"open":"front"})),inspected_item_keys:[...role.items],group_items:[],observations:[],shared_photos:[],scene:{allow_share_photo:false}}:{active:false}}
async function open(browser,role,viewport={width:1366,height:768}){
  const state=createPilotState("act3"),context=await browser.newContext({viewport,deviceScaleFactor:1}),page=await context.newPage();
  const network=[];page.on("response",r=>{if(r.url().includes("/storage/v1/object/public/"))network.push({url:r.url(),status:r.status(),type:r.headers()["content-type"]||""})});
  await installPlayerRoutes(page,"act3",{state,playerIndex:role.index});
  await page.route("**/rest/v1/rpc/**",async route=>{
    const rpc=new URL(route.request().url()).pathname.split("/").pop();
    if(rpc==="s3_get_player_state")return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(pocket(role))});
    if(rpc==="asset_resolve"){
      const key=route.request().postDataJSON()?.p_asset_key,item=Object.keys(assetKeys).find(k=>assetKeys[k]===key),storage_path=item?assets[item]:sharedAssets[key]||null;
      return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(storage_path?{ok:true,storage_path}:{ok:false})});
    }
    return route.fallback();
  });
  // The deployed client polls continuously, so networkidle is not a stable readiness gate.
  await page.goto(`${live}/?p0p1=${role.slot}`,{waitUntil:"domcontentloaded"});
  await page.locator("#libraryCode").waitFor();
  await page.waitForFunction(expected=>document.querySelectorAll("#pocketMount [data-pocket-item]").length===expected,role.items.length);
  // Observe rather than require image decode: a zero natural size after HTTP 200 is
  // the production race this investigation is intended to preserve as evidence.
  await page.waitForTimeout(3000);
  return{context,page,network};
}
const rect=node=>{const r=node.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height),scrollHeight:node.scrollHeight,clientHeight:node.clientHeight}};

async function main(){
  await mkdir(out,{recursive:true});
  const browser=await chromium.launch({headless:true,executablePath:process.env.GAL_A1_BROWSER||"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"}),evidence=[];
  try{
    for(const role of roles){
      for(const viewport of[{width:1366,height:768},{width:1280,height:720}]){
        const {context,page,network}=await open(browser,role,viewport);
        const metrics=await page.evaluate(()=>{
          const q=s=>document.querySelector(s),imgs=[...document.querySelectorAll("img")];
          return{regions:{scene:(q(".v4-scene-region")),runtime:q(".v4-story-region"),action:q(".v4-action-region"),discussion:q(".v4-discussion-region"),pocket:q(".v4-pocket-region")},images:imgs.map(n=>({id:n.id||null,key:n.dataset.pocketAsset||null,naturalWidth:n.naturalWidth,naturalHeight:n.naturalHeight,visible:n.getBoundingClientRect().width>0&&n.getBoundingClientRect().height>0})),pocketItems:[...document.querySelectorAll("#pocketMount [data-pocket-item]")].map(n=>n.dataset.pocketItem),bilingual:[...document.querySelectorAll(".bilingual")].slice(0,3).map(n=>({fontSize:getComputedStyle(n).fontSize,lineHeight:getComputedStyle(n).lineHeight,nl:n.querySelector('[lang="nl"]')?.textContent||"",zh:n.querySelector('[lang="zh"]')?.textContent||""}))};
        });
        for(const [key,node] of Object.entries(metrics.regions))metrics.regions[key]=await page.locator(`.v4-${key==="runtime"?"story":key}-region`).evaluate(rect);
        const shot=`${role.name.toLowerCase()}-act3-${viewport.width}x${viewport.height}.png`;await page.screenshot({path:path.join(out,shot),fullPage:true});
        evidence.push({role:role.slot,name:role.name,phase:"act3_library/library_box",viewport,screenshot:shot,...metrics,network});
        await context.close();
      }
    }
    const teacher=await browser.newPage({viewport:{width:1366,height:768}});await teacher.goto(`${live}/teacher.html?p0p1=teacher`,{waitUntil:"domcontentloaded"});
    const teacherMetrics=await teacher.evaluate(()=>({title:document.title,shellWidth:Math.round(document.querySelector("main")?.getBoundingClientRect().width||0),approvedPrototypeStructure:{top:!!document.querySelector(".top"),main:!!document.querySelector(".main"),collapsed:document.querySelectorAll(".collapsed").length},productionPanels:document.querySelectorAll(".panel").length,bodyText:document.body.innerText.slice(0,500)}));
    await teacher.screenshot({path:path.join(out,"teacher-deployed-1366x768.png"),fullPage:true});await teacher.close();
    await writeFile(path.join(out,"P0P1_BROWSER_EVIDENCE.json"),JSON.stringify({live,generatedAt:new Date().toISOString(),players:evidence,teacher:{...teacherMetrics,screenshot:"teacher-deployed-1366x768.png"}},null,2));
    console.log(JSON.stringify({players:evidence.map(e=>({role:e.role,viewport:e.viewport,pocketItems:e.pocketItems,regions:e.regions,images:e.images,network:e.network})),teacher:teacherMetrics},null,2));
  }finally{await browser.close()}
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1});
