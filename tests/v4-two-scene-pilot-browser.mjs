import http from "node:http";
import {readFile,mkdir} from "node:fs/promises";
import path from "node:path";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {chromium}=require("playwright");
const {RUN,DISC,createPilotState,installPlayerRoutes,installTeacherRoutes}=require("./helpers/v4-two-scene-pilot-driver.js");
const root=process.cwd(),chrome=process.env.GAL_A1_BROWSER||"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const assert=(value,message)=>{if(!value)throw new Error(message)};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function mime(file){return file.endsWith(".html")?"text/html":file.endsWith(".css")?"text/css":file.endsWith(".js")||file.endsWith(".mjs")?"text/javascript":"application/octet-stream"}
async function server(){const instance=http.createServer(async(request,response)=>{try{const relative=decodeURIComponent(new URL(request.url,"http://x").pathname).replace(/^\/+/ ,"")||"index.html",file=path.resolve(root,relative);assert(file.startsWith(root+path.sep),"path escape");response.writeHead(200,{"Content-Type":mime(file),"Cache-Control":"no-store"});response.end(await readFile(file))}catch{response.writeHead(404);response.end()}});await new Promise(resolve=>instance.listen(0,"127.0.0.1",resolve));return{instance,url:`http://127.0.0.1:${instance.address().port}`}}

async function measure(browser,base,scene,adapted,viewport){
  const context=await browser.newContext({viewport}),page=await context.newPage(),state=createPilotState(scene);
  await installPlayerRoutes(page,scene,{state});
  await page.goto(adapted?`${base}/pilots/v4-two-scene/player.html`:`${base}/index.html`,{waitUntil:"networkidle"});
  const input=scene==="act10"?"#s6MessageText":"#libraryCode";
  const transcript=scene==="act10"?(adapted?"#v4DiscussionMount .discussion-room:has(#s6MessageForm) .transcript":"#sprint3bActions .discussion-room .transcript"):"#transcript";
  await page.locator(input).waitFor();await page.fill(input,scene==="act10"?"draft-stays":"739");await page.locator(input).focus();await page.locator(input).evaluate(node=>node.setSelectionRange(1,2));
  if(scene==="act10")await page.locator(transcript).evaluate(node=>node.scrollTop=40);else{const details=page.locator("#v4PocketMount details");if(adapted&&await details.count())await details.first().evaluate(node=>node.open=true)}
  await wait(5200);
  const result={value:await page.locator(input).inputValue(),focused:await page.locator(input).evaluate(node=>document.activeElement===node),selection:await page.locator(input).evaluate(node=>[node.selectionStart,node.selectionEnd]),scroll:scene==="act10"?await page.locator(transcript).evaluate(node=>node.scrollTop):0,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)};
  await context.close();return result;
}

async function verifyThreePlayerDiscussion(browser,base,state){
  const clients=[];
  try{
    for(let playerIndex=0;playerIndex<3;playerIndex++){const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage();await installPlayerRoutes(page,"act10",{state,playerIndex});await page.goto(`${base}/pilots/v4-two-scene/player.html`,{waitUntil:"networkidle"});await page.locator("#s6MessageText").waitFor();clients.push({context,page})}
    await clients[0].page.fill("#s6MessageText","five-second draft");await clients[0].page.locator("#s6MessageText").focus();await clients[0].page.locator("#s6MessageText").evaluate(node=>{node.setSelectionRange(5,11);node.dispatchEvent(new Event("select",{bubbles:true}))});await wait(5200);
    assert(await clients[0].page.locator("#s6MessageText").inputValue()==="five-second draft","5-second ACT10 draft pause was not preserved");
    assert(await clients[0].page.locator("#s6MessageText").evaluate(node=>document.activeElement===node&&node.selectionStart===5&&node.selectionEnd===11),"5-second ACT10 focus/selection was not preserved");
    await clients[0].page.fill("#s6MessageText","");
    for(let playerIndex=0;playerIndex<3;playerIndex++)for(let messageIndex=1;messageIndex<=3;messageIndex++){const text=`P${playerIndex+1}-message-${messageIndex}`;await clients[playerIndex].page.fill("#s6MessageText",text);await clients[playerIndex].page.locator("#s6MessageForm button").click();const transcript="#v4DiscussionMount .discussion-room:has(#s6MessageForm) .transcript";try{await clients[playerIndex].page.waitForFunction(({selector,expected})=>document.querySelector(selector)?.textContent.includes(expected),{selector:transcript,expected:text},{timeout:5000})}catch(error){throw new Error(`ACT10 transcript missed ${text}; sent=${JSON.stringify(state.sent.map(item=>item.p_message_text))}; visible=${JSON.stringify((await clients[playerIndex].page.locator(transcript).textContent())?.slice(-240))}; ${error.message}`)}}
    assert(state.sent.length===9,"expected exactly 3 players x 3 ACT10 messages");
    assert(new Set(state.sent.map(item=>item.role_slot)).size===3,"ACT10 messages did not preserve three player identities");
    for(const {page} of clients)await page.waitForFunction(()=>document.querySelectorAll("#v4DiscussionMount .discussion-room:has(#s6MessageForm) .message").length>=27);
  }finally{for(const {context} of clients)await context.close()}
}

async function verifyImeComposition(browser,base){
  const state=createPilotState("act10"),contexts=[];
  try{
    for(let playerIndex=0;playerIndex<2;playerIndex++){const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage();contexts.push(context);await installPlayerRoutes(page,"act10",{state,playerIndex});await page.goto(`${base}/pilots/v4-two-scene/player.html`,{waitUntil:"networkidle"});await page.locator("#s6MessageText").waitFor()}
    const composer=contexts[0].pages()[0],receiver=contexts[1].pages()[0];
    await composer.locator("#s6MessageText").evaluate(node=>{globalThis.__imeNode=node;node.focus();node.dispatchEvent(new CompositionEvent("compositionstart",{bubbles:true,data:"ni"}));node.value="ni";node.dispatchEvent(new InputEvent("input",{bubbles:true,data:"ni",inputType:"insertCompositionText",isComposing:true}))});
    await wait(4000);
    assert(await composer.locator("#s6MessageText").evaluate(node=>node===globalThis.__imeNode&&node.value==="ni"),"IME composing node/value changed across three polling intervals");assert(state.sent.length===0,"IME composition was auto-sent");assert(await composer.evaluate(()=>document.documentElement.dataset.v4ImeComposing==="true"&&!globalThis.__GAL_A1_TEST_HOOKS__.coordinatorState().pollingEnabled),"IME composition did not suspend isolated polling");
    await composer.locator("#s6MessageText").evaluate(node=>{node.value="你好";node.dispatchEvent(new CompositionEvent("compositionend",{bubbles:true,data:"你好"}));node.dispatchEvent(new InputEvent("input",{bubbles:true,data:"你好",inputType:"insertText",isComposing:false}))});
    await composer.waitForFunction(()=>document.documentElement.dataset.v4ImeComposing!=="true"&&globalThis.__GAL_A1_TEST_HOOKS__.coordinatorState().pollingEnabled);await wait(1500);assert(await composer.locator("#s6MessageText").inputValue()==="你好","committed IME text was lost when polling resumed");
    await composer.locator("#s6MessageForm button").click();await receiver.waitForFunction(()=>document.querySelector("#v4DiscussionMount .discussion-room:has(#s6MessageForm) .transcript")?.textContent.includes("你好"));assert(state.sent.length===1&&state.sent[0].p_message_text==="你好","committed IME message was not sent exactly once to other players");
  }finally{for(const context of contexts)await context.close()}
}

async function verifyFollowBottomAndSendDraft(browser,base){
  const state=createPilotState("act10"),contexts=[];
  try{
    for(let playerIndex=0;playerIndex<2;playerIndex++){const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage();contexts.push(context);await installPlayerRoutes(page,"act10",{state,playerIndex});await page.goto(`${base}/pilots/v4-two-scene/player.html`,{waitUntil:"networkidle"});await page.locator("#s6MessageText").waitFor()}
    const sender=contexts[0].pages()[0],reader=contexts[1].pages()[0],transcript="#v4DiscussionMount .discussion-room:has(#s6MessageForm) .transcript";
    assert(await reader.locator(transcript).evaluate(node=>node.scrollHeight-node.scrollTop-node.clientHeight<=24),"fresh discussion identity did not start at bottom");
    await sender.fill("#s6MessageText","incoming-follow-bottom");await sender.locator("#s6MessageForm button").click();await reader.waitForFunction(selector=>document.querySelector(selector)?.textContent.includes("incoming-follow-bottom"),transcript);assert(await reader.locator(transcript).evaluate(node=>node.scrollHeight-node.scrollTop-node.clientHeight<=24),"near-bottom reader did not follow incoming message");
    await reader.locator(transcript).evaluate(node=>{node.scrollTop=40;node.dispatchEvent(new Event("scroll",{bubbles:true}))});await wait(100);await sender.fill("#s6MessageText","incoming-preserve-anchor");await sender.locator("#s6MessageForm button").click();await reader.waitForFunction(selector=>document.querySelector(selector)?.textContent.includes("incoming-preserve-anchor"),transcript);assert(Math.abs(await reader.locator(transcript).evaluate(node=>node.scrollTop)-40)<=2,"scrolled-up reader lost earlier-message anchor");
    await sender.fill("#s6MessageText","successful-clear");await sender.locator("#s6MessageText").focus();await sender.locator("#s6MessageForm button").click();await sender.waitForFunction(()=>{const input=document.querySelector("#s6MessageText"),transcript=document.querySelector("#v4DiscussionMount .discussion-room:has(#s6MessageForm) .transcript");return input?.value===""&&document.activeElement===input&&input.selectionStart===0&&input.selectionEnd===0&&transcript?.textContent.includes("successful-clear")});
    state.failNextSend=true;await sender.fill("#s6MessageText","failed-must-stay");await sender.locator("#s6MessageForm button").click();await sender.waitForFunction(()=>document.querySelector("#sprint3bStatus")?.textContent.includes("Synthetic send failure"));assert(await sender.locator("#s6MessageText").inputValue()==="failed-must-stay","failed send incorrectly cleared draft");
  }finally{for(const context of contexts)await context.close()}
}

async function verifyTeacherOpenVote(browser,base,state){
  const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage();
  try{await installTeacherRoutes(page,state);await page.goto(`${base}/teacher.html`,{waitUntil:"networkidle"});await page.fill("#roomCode","V4PILOT");await page.fill("#teacherToken","PILOT-TEACHER");await page.click("#watchButton");await page.locator("#openVoteButton:not([disabled])").waitFor();await page.click("#openVoteButton");await page.waitForFunction(()=>document.querySelector("#discussionTeacherStatus")?.textContent==="Voting opened.");assert(state.teacherOpenVote.length===1,"Teacher Open Vote did not acknowledge exactly once");const body=state.teacherOpenVote[0];assert(body.p_expected_run_id===RUN&&body.p_expected_phase==="act10_discussion"&&body.p_expected_step===4&&body.p_expected_round===1&&body.p_expected_discussion_session_id===DISC,"Teacher Open Vote lost canonical run/phase/step/round/discussion identity");assert(state.phase==="act10_final_vote"&&state.discussionStatus==="voting","Teacher Open Vote did not transition the shared projection")}
  finally{await context.close()}
}

async function verifyAct3Actions(browser,base,state){
  const context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage();
  try{await installPlayerRoutes(page,"act3",{state});await page.goto(`${base}/pilots/v4-two-scene/player.html`,{waitUntil:"networkidle"});await page.locator("#libraryCode").waitFor();await page.fill("#libraryCode","739");await page.locator("#libraryCodeForm button").click();await page.waitForFunction(()=>document.querySelector("#libraryCode")?.value==="");assert(state.librarySubmits.length===1&&state.librarySubmits[0].p_code==="41739","ACT3 code was not submitted exactly once with locked prefix");await page.locator("#v4PocketMount [data-inspect-item=anna_servant_diary]").click();await page.locator("#v4PocketMount details").first().waitFor();assert(state.inspected.length===1&&state.inspected[0].p_item_key==="anna_servant_diary","Pocket inspect binding did not fire exactly once");const flip=page.locator("#v4PocketMount [data-flip-item=linda_stopped_watch]");await flip.waitFor();await flip.click();await page.waitForFunction(()=>document.querySelector("#v4PocketMount [data-flip-item=linda_stopped_watch]")?.dataset.targetView==="front");assert(state.flips.length===1&&state.flips[0].p_target_view==="back","Pocket flip binding did not fire exactly once");assert(await page.locator("#v4PocketMount details[open]").count()>=1,"Pocket expanded state was not retained")}
  finally{await context.close()}
}

async function verifyIdentityAndViewportTransitions(browser,base){
  const state=createPilotState("act10"),context=await browser.newContext({viewport:{width:768,height:600}}),page=await context.newPage();
  try{
    await installPlayerRoutes(page,"act10",{state});await page.goto(`${base}/pilots/v4-two-scene/player.html`,{waitUntil:"networkidle"});await page.locator("#s6MessageText").waitFor();
    await page.fill("#s6MessageText","old-act10-draft");const transcript="#v4DiscussionMount .discussion-room:has(#s6MessageForm) .transcript";await page.locator(transcript).evaluate(node=>node.scrollTop=40);
    state.phase="act10_final_vote";await page.locator("#s6MessageText").waitFor({state:"detached"});
    state.sceneMode="act3";await page.locator("#libraryCode").waitFor();await page.fill("#libraryCode","739");
    state.lockedPrefix="52";await page.waitForFunction(()=>document.querySelector("#libraryCode")?.dataset.lockedPrefix==="52");assert(await page.locator("#libraryCode").inputValue()==="","ACT3 draft leaked across locked-prefix identity change");
    state.sceneMode="act10";state.phase="act10_discussion";state.discussionStatus="discussion";state.discussionId="00000000-0000-4000-8000-0000000004b1";await page.locator("#s6MessageText").waitFor();assert(await page.locator("#s6MessageText").inputValue()==="","ACT10 draft leaked into a new discussion identity");assert(await page.locator(transcript).evaluate(node=>node.scrollTop)!==40,"ACT10 scroll anchor leaked into a new discussion identity");
    await page.evaluate(()=>window.scrollTo(0,Math.min(240,document.documentElement.scrollHeight-innerHeight)));const intended=await page.evaluate(()=>scrollY);await wait(2800);assert(await page.evaluate(y=>Math.abs(scrollY-y)<=2,intended),"adapter overrode an intentional viewport scroll after polling");
  }finally{await context.close()}
}

async function screenshots(browser,base,directory){for(const scene of["act10","act3"])for(const [width,height] of[[1440,900],[1366,768],[1280,720],[768,1024]]){const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();await installPlayerRoutes(page,scene);await page.goto(`${base}/pilots/v4-two-scene/player.html`,{waitUntil:"networkidle"});await page.locator(scene==="act10"?"#s6MessageText":"#libraryCode").waitFor();assert(!await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth),`horizontal overflow ${scene} ${width}x${height}`);await page.screenshot({path:path.join(directory,`${scene}-${width}x${height}.png`),fullPage:true});await context.close()}}

async function main(){const local=await server(),browser=await chromium.launch({headless:true,executablePath:chrome}),shotDirectory=path.join(root,"docs/reports/remediation/ui/v4-two-scene/screenshots");await mkdir(shotDirectory,{recursive:true});try{
  const baseline=await measure(browser,local.url,"act10",false,{width:1366,height:768}),adapted=await measure(browser,local.url,"act10",true,{width:1366,height:768});
  assert(baseline.value!=="draft-stays"||!baseline.focused||baseline.scroll!==40,"unmodified production renderer did not reproduce any rerender instability");
  assert(adapted.value==="draft-stays"&&adapted.focused&&adapted.selection[0]===1&&adapted.selection[1]===2,"adapter lost ACT10 draft/focus/selection");assert(Math.abs(adapted.scroll-40)<=2,"adapter lost earlier-message scroll anchor");
  const act3=await measure(browser,local.url,"act3",true,{width:1280,height:720});assert(act3.value==="739"&&act3.focused&&act3.selection[0]===1&&act3.selection[1]===2,"adapter lost ACT3 numeric draft/focus/selection");
  const state=createPilotState();await verifyThreePlayerDiscussion(browser,local.url,state);await verifyImeComposition(browser,local.url);await verifyFollowBottomAndSendDraft(browser,local.url);await verifyTeacherOpenVote(browser,local.url,state);const act3State=createPilotState("act3");await verifyAct3Actions(browser,local.url,act3State);await verifyIdentityAndViewportTransitions(browser,local.url);await screenshots(browser,local.url,shotDirectory);
  console.log(JSON.stringify({baseline,adapted,act3,act10Messages:state.sent.length,imeCompositionPolls:3,imeMessages:1,followBottom:1,scrolledUpAnchor:1,successfulSendClears:1,failedSendPreserves:1,teacherOpenVote:state.teacherOpenVote.length,act3Submits:act3State.librarySubmits.length,pocketInspects:act3State.inspected.length,pocketFlips:act3State.flips.length,negativeTransitions:1,screenshots:8},null,2));console.log("V4 two-scene pilot browser evidence passed.");
}finally{await browser.close();await new Promise(resolve=>local.instance.close(resolve))}}
main().catch(error=>{console.error(error.stack||error);process.exitCode=1});
