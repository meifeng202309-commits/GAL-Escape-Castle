import fs from "node:fs";
import {spawnSync} from "node:child_process";

const chrome=process.env.GAL_A1_BROWSER||"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const source=fs.readFileSync("src/game/app.js","utf8");
const between=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end));
const panel=between("function pocketEvidencePanel", "async function hydratePocketAssets");
const share=between("async function shareSprint5Photo", "async function flipSprint5Item");
const bind=between("function bindPocketActions", "function sprint6Identity");
if(!panel.startsWith("function pocketEvidencePanel")||!share.startsWith("async function shareSprint5Photo")||!bind.startsWith("function bindPocketActions"))throw new Error("Production share functions could not be extracted");

const html=`<!doctype html><meta charset="utf-8"><body><div id="pocketMount"></div><div id="sprint3bStatus"></div><script type="module">
const pocketMount=document.getElementById("pocketMount"),sprint3bStatus=document.getElementById("sprint3bStatus");
const session={role_slot:"GAL-B",room_code:"TRIAL01",session_token:"anna-token"};
const DISPLAY_NAME_BY_ROLE={"GAL-A":"Gitte","GAL-B":"Anna","GAL-C":"Linda"};
const escapeHtml=value=>String(value),localizedHtml=key=>key,stableHtmlByNode=new WeakMap();
let selectedPocketItem="anna_servant_diary",currentSprint6State=null,currentSprint5State=null,currentSprint3bState=null,lastConfirmedFrame=null;
let calls=[],refreshes=0,failNext=false;
function pocketItemContent(){return "<span>diary detail</span>"} function renderPocket(){}
async function rpc(name,body){calls.push({name,body});if(failNext){failNext=false;throw new Error("Photo sharing requires an open canonical discussion.")}return{ok:true}}
async function refreshState(){refreshes++}
${panel}
${share}
${bind}
const pocket={active:true,items:[{item_key:"anna_servant_diary",name_text_key:"item.servant_diary",current_view:"open"}],inspected_item_keys:["anna_servant_diary"],group_items:[],observations:[],shared_photos:[],scene:{allow_share_photo:true}};
pocketMount.innerHTML=pocketEvidencePanel(pocket,"act8_final_vote");bindPocketActions();
const a=pocketMount.querySelector('[data-share-role="GAL-A"]'),c=pocketMount.querySelector('[data-share-role="GAL-C"]');
await a.click();await new Promise(r=>setTimeout(r,0));await c.click();await new Promise(r=>setTimeout(r,0));
const success=calls.length===2&&refreshes===2&&calls.every(x=>x.name==="s3_share_photo"&&x.body.p_source_item_key==="anna_servant_diary"&&x.body.p_source_view==="open")&&calls[0].body.p_recipient_role==="GAL-A"&&calls[1].body.p_recipient_role==="GAL-C";
failNext=true;c.disabled=false;await c.click();await new Promise(r=>setTimeout(r,0));
const failure=calls.length===3&&!c.disabled&&sprint3bStatus.textContent.includes("open canonical discussion");
document.body.dataset.result=success&&failure?"PASS":"FAIL";document.body.dataset.calls=String(calls.length);document.body.dataset.refreshes=String(refreshes);document.body.dataset.failure=String(failure);
</script>`;
const url=`data:text/html;base64,${Buffer.from(html).toString("base64")}`;
const result=spawnSync(chrome,["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--dump-dom",url],{encoding:"utf8",timeout:15000});
if(result.error)throw result.error;
if(result.status!==0)throw new Error(result.stderr||`Chrome exited ${result.status}`);
if(!result.stdout.includes('data-result="PASS"'))throw new Error(`Slide 10 share-button gate failed: ${result.stdout.slice(-1500)}`);
console.log("Slide 10 share-button browser gate passed: GAL-A/GAL-C dispatch, success refresh, and visible RPC rejection recovery.");
