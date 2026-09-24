-- Restore canonical discussion creation omitted by migration 031's focused wrapper.
create or replace function public.s5_configure_discussion(p_session uuid,p_phase text)
returns void language plpgsql security definer set search_path=public as $$
declare secs int;options jsonb;policy text;maxr int;fallback text;
begin
 secs:=case p_phase when'act6_vote'then 90 when'act8_final_vote'then 180 else 15 end;
 options:=case p_phase when'act6_vote'then'[{"id":"escape","label":"act06.002"},{"id":"1897","label":"act06.003"},{"id":"time_stopped","label":"act06.004"},{"id":"trapped","label":"act06.005"}]'::jsonb when'act7_vote'then'[{"id":"clock_a","label":"act07.008"},{"id":"clock_b","label":"act07.009"},{"id":"clock_c","label":"act07.010"}]'::jsonb else'[{"id":"main_gate","label":"act08.001"},{"id":"west_tower","label":"act08.002"}]'::jsonb end;
 policy:=case p_phase when'act6_vote'then'SINGLE_REVOTE_THEN_FALLBACK'when'act7_vote'then'REPEAT_UNTIL_MAJORITY'else'NO_TIE_POSSIBLE'end;maxr:=case when p_phase='act6_vote'then 1 end;fallback:=case when p_phase='act6_vote'then'portrait_fixed_fallback'end;
 insert into public.discussion_sessions(discussion_session_id,run_id,scene_id,phase_key,step_key,round_no,vote_round,topic,status,show_initial_choices,allow_free_text,require_final_vote,vote_options,tie_policy,discussion_time_limit_sec,vote_time_limit_sec,silent_texting_mode)
 select r.discussion_session_id,r.run_id,case p_phase when'act6_vote'then'act6_portrait'when'act7_vote'then'act7_clock_room'else'act8_route'end,p_phase,'sprint5_round',r.vote_round,r.vote_round,r.topic_text_key,'discussion',false,true,true,options,policy,secs,60,true from public.s5_rounds r where r.discussion_session_id=p_session on conflict(discussion_session_id)do nothing;
 update public.discussion_sessions set phase_key=p_phase,status='discussion',started_at=now(),phase_deadline=now()+make_interval(secs=>secs),ended_at=null,outcome=null,show_initial_choices=p_phase='act8_final_vote',allow_free_text=true,allow_pocket=true,allow_memories_observations=true,allow_share_photo=p_phase in('act6_vote','act8_final_vote'),require_final_vote=true,vote_options=options,tie_policy=policy,revote_window_sec=15,max_revotes=maxr,fallback_resolution=fallback,discussion_time_limit_sec=secs,vote_time_limit_sec=60,silent_texting_mode=true where discussion_session_id=p_session;
 if not found then raise exception'Sprint 5 canonical discussion link is missing.';end if;
end$$;
revoke execute on function public.s5_configure_discussion(uuid,text) from public,anon,authenticated;
