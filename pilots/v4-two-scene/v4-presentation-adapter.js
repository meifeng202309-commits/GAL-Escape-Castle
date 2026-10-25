const root=document.documentElement;
if(root.dataset.v4Pilot!=="true")throw new Error("V4 adapter may run only in the isolated pilot shell.");

const saved={inputs:new Map(),transcripts:new Map(),pockets:new Map(),pendingSends:new Map(),viewport:{x:0,y:0},sceneMount:document.getElementById("v4SceneMount"),discussionMount:document.getElementById("v4DiscussionMount"),pocketMount:document.getElementById("v4PocketMount")};
let adapting=false,observer=null,composing=false;
const nearBottom=node=>node.scrollHeight-node.scrollTop-node.clientHeight<=24;
const discussionIdentity=node=>node.id==="transcript"?`generic:${document.getElementById("discussionTopic")?.textContent||""}:${document.getElementById("discussionMeta")?.textContent||""}`:`s6:${node.closest(".discussion-room")?.querySelector("[data-s6-discussion]")?.dataset.s6Discussion||"pending"}`;
const inputIdentity=node=>node.id==="libraryCode"?`library:${node.dataset.lockedPrefix||""}`:node.id==="s6MessageText"?`${discussionIdentity(node.closest(".discussion-room")?.querySelector(".transcript"))}:message`:`generic:${document.getElementById("discussionTopic")?.textContent||""}:message`;
const pocketIdentity=details=>details.querySelector("summary")?.textContent?.trim()||"";
const playerDisplayName=()=>{try{return JSON.parse(localStorage.getItem("gal_castle_escape_session_v1")||"null")?.display_name||""}catch{return""}};
window.addEventListener("v4-pilot-rpc-receipt",event=>{const receipt=document.getElementById("v4PilotReceipt"),detail=event.detail||{};if(!receipt||detail.rpc!=="s3b_submit_library_code")return;receipt.textContent=`PILOT RECEIPT · ${detail.status} · code ${detail.code} · request ${detail.requestId||"-"} · count ${detail.count}`;receipt.className=`status ${detail.status==="accepted"?"good":"bad"}`});

function captureInput(node){if(!node?.matches?.("#messageText,#s6MessageText,#libraryCode"))return;const key=inputIdentity(node),prior=saved.inputs.get(key);if(prior?.source&&prior.source!==node)return;saved.inputs.set(key,{source:node,value:node.value,focused:document.activeElement===node,start:node.selectionStart,end:node.selectionEnd});}
function captureTranscript(node){if(!node?.matches?.("#transcript,.discussion-room .transcript"))return;saved.transcripts.set(discussionIdentity(node),{top:node.scrollTop,bottom:nearBottom(node)});}
function capturePocket(details){if(!details?.matches?.(".evidence-panel details"))return;saved.pockets.set(pocketIdentity(details),details.open);}

document.addEventListener("input",event=>captureInput(event.target),true);
document.addEventListener("focusin",event=>captureInput(event.target),true);
document.addEventListener("selectionchange",()=>captureInput(document.activeElement),true);
document.addEventListener("select",event=>captureInput(event.target),true);
document.addEventListener("scroll",event=>{if(event.target instanceof Element)captureTranscript(event.target);else saved.viewport={x:scrollX,y:scrollY}},true);
document.addEventListener("toggle",event=>capturePocket(event.target),true);
document.addEventListener("submit",event=>{if(composing||event.target?.id!=="s6MessageForm")return;const input=event.target.querySelector("#s6MessageText"),key=input&&inputIdentity(input),value=input?.value;if(!key||!value)return;saved.pendingSends.set(key,{value,displayName:playerDisplayName()||(document.getElementById("playerLabel")?.textContent||"").split("·")[0].trim()})},true);
document.addEventListener("compositionstart",event=>{if(!event.target?.matches?.("#messageText,#s6MessageText,#libraryCode"))return;composing=true;captureInput(event.target);globalThis.__GAL_A1_TEST_HOOKS__?.stopPolling?.();root.dataset.v4ImeComposing="true"},true);
document.addEventListener("compositionend",event=>{if(!event.target?.matches?.("#messageText,#s6MessageText,#libraryCode"))return;captureInput(event.target);composing=false;delete root.dataset.v4ImeComposing;queueMicrotask(()=>{globalThis.__GAL_A1_TEST_HOOKS__?.startPolling?.();void globalThis.__GAL_A1_TEST_HOOKS__?.refreshState?.()})},true);

function restore(){
  if(adapting||composing)return;adapting=true;
  try{
    saved.discussionMount.querySelectorAll(".discussion-room:has(#s6MessageForm) .transcript").forEach(captureTranscript);
    const scene=document.querySelector("#sprint3bText>.s6-stage,#sprint3bText>#s3bSceneImage");if(scene&&scene.parentElement!==saved.sceneMount){saved.sceneMount.replaceChildren(scene)}
    const embedded=document.querySelector("#sprint3bActions>.discussion-room");if(embedded&&embedded.parentElement!==saved.discussionMount){saved.discussionMount.querySelectorAll(".discussion-room:has(#s6MessageForm)").forEach(node=>node.remove());saved.discussionMount.append(embedded)}else if(!embedded)saved.discussionMount.querySelectorAll(".discussion-room:has(#s6MessageForm)").forEach(node=>node.remove());
    const pocket=document.querySelector("#sprint3bText .evidence-panel");if(pocket&&pocket.parentElement!==saved.pocketMount){saved.pocketMount.querySelectorAll(".evidence-panel").forEach(node=>node.remove());saved.pocketMount.append(pocket)}
    document.querySelectorAll("#messageText,#s6MessageText,#libraryCode").forEach(node=>{const key=inputIdentity(node),pending=saved.pendingSends.get(key);if(pending){const acknowledged=[...node.closest(".discussion-room")?.querySelectorAll(".message")||[]].some(message=>message.querySelector("b")?.textContent.trim()===pending.displayName&&message.querySelector("p")?.textContent===pending.value);if(acknowledged){saved.inputs.set(key,{source:node,value:"",focused:true,start:0,end:0});saved.pendingSends.delete(key)}}const state=saved.inputs.get(key);if(!state)return;node.value=state.value;if(state.focused){node.focus({preventScroll:true});if(state.start!==null&&state.end!==null)node.setSelectionRange(state.start,state.end)}state.source=node});
    document.querySelectorAll("#transcript,.discussion-room .transcript").forEach(node=>{const key=discussionIdentity(node),state=saved.transcripts.get(key);if(!state){node.scrollTop=node.scrollHeight;saved.transcripts.set(key,{top:node.scrollTop,bottom:true});return}node.scrollTop=state.bottom?node.scrollHeight:state.top});
    saved.pocketMount.querySelectorAll(".evidence-panel details").forEach(node=>{const open=saved.pockets.get(pocketIdentity(node));if(open!==undefined)node.open=open});
    scrollTo(saved.viewport.x,saved.viewport.y);
    root.dataset.v4AdapterReady="true";
    observer?.takeRecords();
  }finally{queueMicrotask(()=>{adapting=false})}
}
observer=new MutationObserver(()=>queueMicrotask(restore));
observer.observe(document.getElementById("sprint3bText"),{subtree:true,childList:true});
observer.observe(document.getElementById("sprint3bActions"),{subtree:true,childList:true});
restore();
