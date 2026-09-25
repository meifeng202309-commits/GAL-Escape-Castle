const crypto=require('crypto');
const URL='https://qdcbdcjobzytzhnhfwyn.supabase.co',KEY='sb_publishable_h5mCF6rkaYWw12ssP4-1NA_KzzPJOwY';
const assert=(v,m)=>{if(!v)throw new Error(m)};
const id=p=>`${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`.toUpperCase().slice(0,14);
async function rpc(name,body){const r=await fetch(`${URL}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,'Content-Type':'application/json'},body:JSON.stringify(body)}),t=await r.text(),j=t?JSON.parse(t):null;if(!r.ok)throw new Error(j?.message||j?.details||t);return j}
const auth=(f,i)=>({p_room_code:f.room,p_session_token:f.players[i].session_token});
const teacher=f=>({p_room_code:f.room,p_teacher_token:f.teacher});
const override=(f,action,reason)=>rpc('teacher_apply_override',{...teacher(f),p_override_action:action,p_reason:reason});
const state=(f,i=0)=>rpc('s3b_get_player_state',auth(f,i));
async function fixture(){const room=id('R2'),teacherToken=id('T'),joins=[id('G'),id('A'),id('L')];await rpc('s1_create_room',{p_room_code:room,p_teacher_token:teacherToken,p_gitte_join_code:joins[0],p_anna_join_code:joins[1],p_linda_join_code:joins[2]});const players=await Promise.all(joins.map(p_join_code=>rpc('s1_join_player',{p_room_code:room,p_join_code})));const f={room,teacher:teacherToken,players};await rpc('s2_start_run',{p_room_code:room,p_teacher_token:teacherToken,p_run_mode:'audit'});await rpc('s3b_initialize_flow',teacher(f));return f}
async function reachAct2Discussion(f){
 await Promise.all([0,1,2].map(i=>rpc('s3b_ack_act1_opening',auth(f,i))));
 for(const [i,p_choice_id]of [[0,'study_map'],[1,'read_diary'],[2,'study_watch']])await rpc('s3b_submit_act1_choice',{...auth(f,i),p_choice_id});
 await Promise.all([0,1,2].map(i=>rpc('s3b_complete_act1',auth(f,i))));
 await Promise.all(['library','library','great_hall'].map((p_choice_id,i)=>rpc('s3b_submit_first_meeting',{...auth(f,i),p_choice_id})));
 await Promise.all([0,1,2].map(i=>rpc('s3b_grab',auth(f,i))));
 await Promise.all([0,1,2].map(i=>rpc('s3b_leave_start_room',auth(f,i))));
}
async function main(){
 const f=await fixture();
 await Promise.all([0,1,2].map(i=>rpc('s3b_ack_act1_opening',auth(f,i))));
 for(const [i,p_choice_id]of [[0,'study_map'],[1,'read_diary'],[2,'study_watch']])await rpc('s3b_submit_act1_choice',{...auth(f,i),p_choice_id});
 await Promise.all([0,1,2].map(i=>rpc('s3b_complete_act1',auth(f,i))));

 let result=await override(f,'SKIP_CURRENT_INTERACTION','R2 ACT2 missing first meetings');
 assert(result.source_phase==='private_first_meeting'&&result.invalidated_scope.length===3,'ACT2 private-first override evidence missing');
 result=await override(f,'RESOLVE_AND_CONTINUE','R2 ACT2 discussion safe resolution');
 assert(result.source_phase==='meeting_discussion'&&result.applied_resolution==='library'&&result.invalidated_scope.length===3,'ACT2 discussion absence validity missing');
 let s=await state(f);assert(s.scene.phase_key==='route_update'&&s.scene.current_route_target==='library','ACT2 override did not project Library route target');

 await new Promise(resolve=>setTimeout(resolve,2100));
 await override(f,'SKIP_CURRENT_INTERACTION','R2 route update barrier');
 await new Promise(resolve=>setTimeout(resolve,2100));
 await override(f,'SKIP_CURRENT_INTERACTION','R2 route consequence foldback');
 await new Promise(resolve=>setTimeout(resolve,2100));
 await override(f,'SKIP_CURRENT_INTERACTION','R2 wayfinding completion');
 await override(f,'RESOLVE_AND_CONTINUE','R2 library game-track resolution');
 await new Promise(resolve=>setTimeout(resolve,2100));
 result=await override(f,'SKIP_CURRENT_INTERACTION','R2 ACT4 missing private choices');
 assert(result.invalidated_scope.length===3,'ACT4 override evidence missing');
 result=await override(f,'RESOLVE_AND_CONTINUE','R2 ACT5 discussion safe resolution');
 assert(result.applied_resolution==='inspect_first'&&result.invalidated_scope.length===3,'ACT5 discussion absence validity missing');
 await new Promise(resolve=>setTimeout(resolve,2100));
 result=await override(f,'RESOLVE_AND_CONTINUE','R2 post-inspection safe resolution');
 s=await state(f);assert(result.applied_resolution==='known'&&s.flow.group_route==='known'&&s.flow.terminal_state==='SPRINT3B_COMPLETE','ACT5 terminal override failed');

 const teacherState=await rpc('s2_get_teacher_state',teacher(f));
 const act2=teacherState.teacher_override.history.find(x=>x.reason==='R2 ACT2 discussion safe resolution');
 const act5=teacherState.teacher_override.history.find(x=>x.reason==='R2 ACT5 discussion safe resolution');
 assert(act2.invalidated_scope.length===3&&act5.invalidated_scope.length===3,'Teacher reconnect lost discussion absence provenance');

 const partial=await fixture();
 await reachAct2Discussion(partial);
 const discussion=await rpc('s2_get_teacher_state',teacher(partial));
 await rpc('s2_open_vote',teacher(partial));
 await rpc('s2_submit_vote',{...auth(partial,0),p_expected_discussion_session_id:discussion.discussion.discussion_session_id,p_expected_vote_round:discussion.discussion.vote_round,p_choice_id:'library'});
 result=await override(partial,'RESOLVE_AND_CONTINUE','R2E1 ACT2 partial vote safe resolution');
 assert(result.invalidated_scope.length===2,'ACT2 partial-vote missing-player scope is not exact');
 console.log('Level2 residual override live E2E passed: seven migration054 paths plus partial-vote evidence exercised.');
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1});
