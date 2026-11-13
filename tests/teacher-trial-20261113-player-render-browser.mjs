import fs from "node:fs";
import {spawnSync} from "node:child_process";

const chrome=process.env.GAL_A1_BROWSER||"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const source=fs.readFileSync("src/game/app.js","utf8");
const between=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end));
const lifecycle=between("function renderLifecycleNotice", "function renderAct5Handoff");
const route=between("function routeFormalPresentation", "function act4ComparisonHtml");
if(!lifecycle.startsWith("function renderLifecycleNotice")||!route.startsWith("function routeFormalPresentation"))throw new Error("Production render functions could not be extracted");

const html=`<!doctype html><meta charset="utf-8"><body>
<div id="formalSceneMount"></div><div id="choiceArea"></div><div id="revealArea"></div><div id="discussionPanel"></div><div id="sprint3bPanel"></div>
<div id="playerLabel"></div><div id="sceneTitle"></div><div id="sceneText"></div><div id="sprint3bText"></div><div id="sprint3bActions"></div><div id="sprint3bStatus"></div><div id="gameStatus"></div><div id="pocketMount"><img data-stale-pocket src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="></div>
<script>
const ids=["formalSceneMount","choiceArea","revealArea","discussionPanel","sprint3bPanel","playerLabel","sceneTitle","sceneText","sprint3bText","sprint3bActions","sprint3bStatus","gameStatus","pocketMount"];
for(const id of ids)globalThis[id]=document.getElementById(id);
let currentDiscussion={stale:true},selectedPocketItem="linda_stopped_watch";
const session={display_name:"Linda",room_code:"P1REUSE"},stableHtmlByNode=new WeakMap();
const escapeHtml=value=>String(value);function setStableHtml(node,html){if(stableHtmlByNode.get(node)===html&&node.childNodes.length)return false;node.innerHTML=html;stableHtmlByNode.set(node,html);return true}
${lifecycle}
${route}
renderLifecycleNotice("pre-run","Waiting for formal run");
const pocketPass=selectedPocketItem===""&&!pocketMount.querySelector("img")&&pocketMount.textContent.includes("No projected items.");
sprint3bText.innerHTML='<p id="story">Canonical story</p><div data-formal-routed-action="true">stale status</div>';
for(let i=0;i<5;i++){sprint3bActions.innerHTML='<div class="notice">current status '+i+'</div>';routeFormalPresentation()}
const routed=[...sprint3bText.querySelectorAll(':scope > [data-formal-routed-action]')];
const repeatPass=routed.length===1&&routed[0].textContent==="current status 4"&&sprint3bText.querySelectorAll("#story").length===1;
document.body.dataset.result=pocketPass&&repeatPass?"PASS":"FAIL";
document.body.dataset.pocket=String(pocketPass);document.body.dataset.repeat=String(repeatPass);document.body.dataset.routed=String(routed.length);
</script>`;
const url=`data:text/html;base64,${Buffer.from(html).toString("base64")}`;
const result=spawnSync(chrome,["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--dump-dom",url],{encoding:"utf8",timeout:15000});
if(result.error)throw result.error;
if(result.status!==0)throw new Error(result.stderr||`Chrome exited ${result.status}`);
if(!result.stdout.includes('data-result="PASS"'))throw new Error(`Player render gate failed: ${result.stdout.slice(-1000)}`);
console.log("Teacher trial Player render browser gate passed: pre-run Pocket empty; five Runtime refreshes retained one routed status.");
