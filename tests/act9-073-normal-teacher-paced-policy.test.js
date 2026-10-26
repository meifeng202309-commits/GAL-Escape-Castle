const assert=require("node:assert/strict");
function openDiscussion(mode,round=1,seconds=180){return{mode,phase:"act9_discussion",step:1,round,session:`discussion-${round}`,deadline:mode==="audit"?seconds:null,events:[],votes:[]}}
function refresh(state,seconds){if(state.deadline!==null&&seconds>=state.deadline){state.phase="act9_console";state.events.push("deadline_advanced")}}
function teacherOpen(state,identity){assert.equal(state.mode,"normal");assert.deepEqual(identity,{phase:state.phase,step:state.step,round:state.round,session:state.session});state.phase="act9_console";state.events.push("teacher_open_vote")}
function vote(state,choice){assert.equal(state.phase,"act9_console");state.votes.push(choice)}
for(const round of[1,2,3]){const normal=openDiscussion("normal",round);refresh(normal,3600);assert.equal(normal.phase,"act9_discussion");teacherOpen(normal,{phase:"act9_discussion",step:1,round,session:`discussion-${round}`});vote(normal,"red");vote(normal,"red");vote(normal,"blue");assert.deepEqual(normal.votes,["red","red","blue"]);assert.deepEqual(normal.events,["teacher_open_vote"])}
const auditInitial=openDiscussion("audit");refresh(auditInitial,179);assert.equal(auditInitial.phase,"act9_discussion");refresh(auditInitial,180);assert.equal(auditInitial.phase,"act9_console");
const auditRetry=openDiscussion("audit",2,60);refresh(auditRetry,59);assert.equal(auditRetry.phase,"act9_discussion");refresh(auditRetry,60);assert.equal(auditRetry.phase,"act9_console");
assert.throws(()=>teacherOpen(openDiscussion("normal"),{phase:"act9_discussion",step:2,round:1,session:"discussion-1"}));
console.log("ACT9 NORMAL/AUDIT Teacher-paced policy model passed.");
