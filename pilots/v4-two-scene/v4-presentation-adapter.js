const root=document.documentElement;
if(root.dataset.v4Pilot!=="true")throw new Error("V4 adapter may run only in the isolated pilot shell.");

const saved={inputs:new Map(),transcripts:new Map(),pockets:new Map(),viewport:{x:0,y:0},discussionMount:document.getElementById("v4DiscussionMount"),pocketMount:document.getElementById("v4PocketMount")};
let adapting=false;
const nearBottom=node=>node.scrollHeight-node.scrollTop-node.clientHeight<=24;
const discussionIdentity=node=>node.id==="transcript"?`generic:${document.getElementById("discussionTopic")?.textContent||""}:${document.getElementById("discussionMeta")?.textContent||""}`:`s6:${node.closest(".discussion-room")?.querySelector("[data-s6-discussion]")?.dataset.s6Discussion||"pending"}`;
const inputIdentity=node=>node.id==="libraryCode"?`library:${node.dataset.lockedPrefix||""}`:node.id==="s6MessageText"?`${discussionIdentity(node.closest(".discussion-room")?.querySelector(".transcript"))}:message`:`generic:${document.getElementById("discussionTopic")?.textContent||""}:message`;
const pocketIdentity=details=>details.querySelector("summary")?.textContent?.trim()||"";

function captureInput(node){if(!node?.matches?.("#messageText,#s6MessageText,#libraryCode"))return;const key=inputIdentity(node),prior=saved.inputs.get(key);if(prior?.source&&prior.source!==node)return;saved.inputs.set(key,{source:node,value:node.value,focused:document.activeElement===node,start:node.selectionStart,end:node.selectionEnd});}
function captureTranscript(node){if(!node?.matches?.("#transcript,.discussion-room .transcript"))return;saved.transcripts.set(discussionIdentity(node),{top:node.scrollTop,bottom:nearBottom(node)});}
function capturePocket(details){if(!details?.matches?.(".evidence-panel details"))return;saved.pockets.set(pocketIdentity(details),details.open);}

document.addEventListener("input",event=>captureInput(event.target),true);
document.addEventListener("focusin",event=>captureInput(event.target),true);
document.addEventListener("selectionchange",()=>captureInput(document.activeElement),true);
document.addEventListener("scroll",event=>{if(event.target instanceof Element)captureTranscript(event.target);else saved.viewport={x:scrollX,y:scrollY}},true);
document.addEventListener("toggle",event=>capturePocket(event.target),true);

function restore(){
  if(adapting)return;adapting=true;
  try{
    const embedded=document.querySelector("#sprint3bActions>.discussion-room");if(embedded&&embedded.parentElement!==saved.discussionMount){saved.discussionMount.querySelectorAll(".discussion-room:has(#s6MessageForm)").forEach(node=>node.remove());saved.discussionMount.append(embedded)}
    const pocket=document.querySelector("#sprint3bText .evidence-panel");if(pocket&&pocket.parentElement!==saved.pocketMount){saved.pocketMount.querySelectorAll(".evidence-panel").forEach(node=>node.remove());saved.pocketMount.append(pocket)}
    document.querySelectorAll("#messageText,#s6MessageText,#libraryCode").forEach(node=>{const state=saved.inputs.get(inputIdentity(node));if(!state)return;node.value=state.value;if(state.focused){node.focus({preventScroll:true});if(state.start!==null&&state.end!==null)node.setSelectionRange(state.start,state.end)}state.source=node});
    document.querySelectorAll("#transcript,.discussion-room .transcript").forEach(node=>{const state=saved.transcripts.get(discussionIdentity(node));if(!state)return;node.scrollTop=state.bottom?node.scrollHeight:state.top});
    saved.pocketMount.querySelectorAll(".evidence-panel details").forEach(node=>{const open=saved.pockets.get(pocketIdentity(node));if(open!==undefined)node.open=open});
    scrollTo(saved.viewport.x,saved.viewport.y);
    root.dataset.v4AdapterReady="true";
  }finally{queueMicrotask(()=>{adapting=false})}
}
new MutationObserver(()=>queueMicrotask(restore)).observe(document.getElementById("gamePanel"),{subtree:true,childList:true});
restore();
