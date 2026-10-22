const assert=require("node:assert/strict");
const state={mode:"normal",phase:"act10_private",step:4,round:1,session:null,privateChoices:0,discussionStatus:null,deadline:null,finalVotes:[],events:[]};
function privateChoice(){assert.equal(state.phase,"act10_private");state.privateChoices+=1;if(state.privateChoices===3){state.phase="act10_discussion";state.session="discussion-1";state.discussionStatus="discussion";state.deadline=null}}
function refresh(){if(state.mode==="normal"&&state.phase==="act10_discussion")return;if(state.deadline!==null&&Date.now()>=state.deadline)state.phase="act10_final_vote"}
function playerClose(){if(state.mode==="normal"&&state.phase==="act10_discussion")throw new Error("Teacher must open")}
function finalVote(choice){if(state.phase!=="act10_final_vote")throw new Error("No final vote");state.finalVotes.push(choice);if(state.finalVotes.length===3){state.phase="act10_result";state.goldKey=state.finalVotes.filter(x=>x==="take").length>=2}}
function teacherOpen(expected){assert.equal(expected.run,"run-1");assert.equal(expected.phase,state.phase);assert.equal(expected.step,state.step);assert.equal(expected.round,state.round);assert.equal(expected.session,state.session);assert.equal(state.mode,"normal");assert.equal(state.phase,"act10_discussion");assert.equal(state.discussionStatus,"discussion");state.discussionStatus="resolved";state.phase="act10_final_vote";state.events.push("teacher_open_vote")}
privateChoice();privateChoice();assert.throws(()=>finalVote("take"),/No final vote/);privateChoice();
for(let i=0;i<5;i++)refresh();assert.equal(state.phase,"act10_discussion","NORMAL ACT10 auto-advanced");assert.throws(playerClose,/Teacher must open/);assert.throws(()=>teacherOpen({run:"run-1",phase:"act10_discussion",step:3,round:1,session:"discussion-1"}));
teacherOpen({run:"run-1",phase:"act10_discussion",step:4,round:1,session:"discussion-1"});assert.throws(()=>teacherOpen({run:"run-1",phase:"act10_discussion",step:4,round:1,session:"discussion-1"}));
finalVote("take");finalVote("leave");finalVote("take");assert.equal(state.goldKey,true);assert.deepEqual(state.events,["teacher_open_vote"]);assert.equal(state.privateChoices,3);
console.log("CA284 ACT10 Teacher Open Vote policy checks passed.");
