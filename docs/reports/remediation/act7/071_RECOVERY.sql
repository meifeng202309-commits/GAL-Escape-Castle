-- Recovery after a fully applied migration 071.
-- Execute only under a separately authorized maintenance window after verifying
-- the preconditions in 071_RELEASE_PACKET.md. This restores the 2026-10-16
-- prechange function bodies/signatures and privileges; it does not alter data.
begin;

create or replace function public.s2_refresh_discussion_pre037(p_discussion_session_id uuid)
returns void language plpgsql security definer set search_path=public as $$
declare
  v_session public.discussion_sessions%rowtype;
  v_run public.game_runs%rowtype;
  v_vote_count integer;
begin
  select * into v_session from public.discussion_sessions
  where discussion_session_id=p_discussion_session_id for update;
  if not found or v_session.phase_deadline is null or now()<v_session.phase_deadline then return; end if;
  select * into v_run from public.game_runs where run_id=v_session.run_id;
  if v_session.status='discussion' then
    if v_session.require_final_vote then
      update public.discussion_sessions set status='voting',
        phase_deadline=now()+make_interval(secs=>v_session.vote_time_limit_sec)
      where discussion_session_id=v_session.discussion_session_id;
      perform public.s2_log_event(v_run.run_id,v_run.room_code,v_session.discussion_session_id,
        'vote_opened_by_deadline',null,jsonb_build_object('vote_round',v_session.vote_round));
    else
      update public.discussion_sessions set status='resolved',ended_at=now(),phase_deadline=null,
        outcome=jsonb_build_object('type','discussion_complete')
      where discussion_session_id=v_session.discussion_session_id;
      perform public.s2_log_event(v_run.run_id,v_run.room_code,v_session.discussion_session_id,
        'discussion_resolved_without_vote',null,'{}'::jsonb);
    end if;
  elsif v_session.status='voting' then
    select count(*) into v_vote_count from public.runtime_player_decisions
    where discussion_session_id=v_session.discussion_session_id and decision_type='group_vote';
    if v_vote_count<3 then
      update public.discussion_sessions set status='waiting_for_missing_player',phase_deadline=null
      where discussion_session_id=v_session.discussion_session_id;
      perform public.s2_log_event(v_run.run_id,v_run.room_code,v_session.discussion_session_id,
        'vote_waiting_for_missing_player',null,
        jsonb_build_object('submitted_count',v_vote_count,'missing_count',3-v_vote_count));
    end if;
  end if;
end$$;

create or replace function public.s2_open_vote(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  v_room_code text:=upper(trim(p_room_code));
  v_run public.game_runs%rowtype;
  v_session public.discussion_sessions%rowtype;
begin
  perform public.s1_assert_teacher(v_room_code,p_teacher_token);
  v_run:=public.s2_get_active_run(v_room_code);
  if v_run.run_id is null then raise exception 'No active formal run.'; end if;
  select * into v_session from public.discussion_sessions where run_id=v_run.run_id
  order by vote_round desc limit 1 for update;
  if not found or v_session.status<>'discussion' then
    raise exception 'There is no discussion currently ready to open voting.';
  end if;
  if not v_session.require_final_vote then
    raise exception 'This discussion is configured without a final vote.';
  end if;
  update public.discussion_sessions set status='voting',
    phase_deadline=now()+make_interval(secs=>v_session.vote_time_limit_sec)
  where discussion_session_id=v_session.discussion_session_id returning * into v_session;
  perform public.s2_log_event(v_run.run_id,v_room_code,v_session.discussion_session_id,
    'vote_opened_by_teacher',null,jsonb_build_object('vote_round',v_session.vote_round));
  return jsonb_build_object('discussion_session_id',v_session.discussion_session_id,
    'status',v_session.status,'phase_deadline',v_session.phase_deadline);
end$$;

drop function if exists public.s5_teacher_open_vote(text,text,uuid,text,integer,uuid);

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

create or replace function public.s5_teacher_open_vote(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s5_run_state%rowtype;sid uuid;
begin perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);select*into s from public.s5_run_state where run_id=g.run_id;select discussion_session_id into sid from public.s5_rounds where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round;update public.discussion_sessions set status='voting',phase_deadline=now()+make_interval(secs=>vote_time_limit_sec)where discussion_session_id=sid and status='discussion';if not found then raise exception'Current Sprint 5 discussion is not open.';end if;
insert into public.runtime_events(run_id,room_code,discussion_session_id,event_type,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,interaction_id)values(g.run_id,room,sid,'teacher_intervention_s5_vote_opened',jsonb_build_object('vote_round',s.vote_round),null,s.phase_key,null,'teacher_override','valid',false,sid);
return jsonb_build_object('ok',true,'discussion_session_id',sid);end$$;

create or replace function public.s5_teacher_add_time(p_room_code text,p_teacher_token text,p_seconds integer)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s5_run_state%rowtype;sid uuid;
begin if p_seconds<1 or p_seconds>600 then raise exception'Invalid time extension.';end if;perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);select*into s from public.s5_run_state where run_id=g.run_id;select discussion_session_id into sid from public.s5_rounds where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round;update public.discussion_sessions set phase_deadline=greatest(coalesce(phase_deadline,now()),now())+make_interval(secs=>p_seconds)where discussion_session_id=sid and status in('discussion','voting','waiting_for_missing_player');if not found then raise exception'Current Sprint 5 discussion cannot receive time.';end if;
insert into public.runtime_events(run_id,room_code,discussion_session_id,event_type,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,interaction_id)values(g.run_id,room,sid,'teacher_intervention_s5_time_added',jsonb_build_object('seconds',p_seconds,'vote_round',s.vote_round),null,s.phase_key,null,'teacher_override','valid',false,sid);
return jsonb_build_object('ok',true,'discussion_session_id',sid);end$$;

create or replace function public.s5_get_teacher_discussion_state(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s5_run_state%rowtype;d public.discussion_sessions%rowtype;sid uuid;msgs jsonb:='[]';votes jsonb:='[]';
begin perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);if g.run_id is null then return jsonb_build_object('active',false,'sprint5_active',false);end if;select*into s from public.s5_run_state where run_id=g.run_id;if not found then return jsonb_build_object('active',true,'sprint5_active',false);end if;
 select ds.* into d from public.discussion_sessions ds join public.s5_rounds r using(discussion_session_id)where r.run_id=g.run_id and r.phase_key=s.phase_key and r.vote_round=s.vote_round;if found then sid:=d.discussion_session_id;perform public.s2_refresh_discussion(sid);select*into d from public.discussion_sessions where discussion_session_id=sid;select coalesce(jsonb_agg(jsonb_build_object('display_name',rp.display_name,'role_slot',rp.role_slot,'message_text',m.message_text,'created_at',m.created_at)order by m.created_at),'[]')into msgs from public.dialogue_messages m join public.s1_room_players rp using(player_id)where m.discussion_session_id=sid;select coalesce(jsonb_agg(jsonb_build_object('display_name',rp.display_name,'role_slot',rp.role_slot,'submitted',v.player_id is not null,'choice_label',case when d.status='resolved'then v.choice_id end,'locked_at',v.locked_at)order by rp.role_slot),'[]')into votes from public.s1_room_players rp left join public.s5_votes v on v.player_id=rp.player_id and v.run_id=g.run_id and v.phase_key=s.phase_key and v.vote_round=s.vote_round where rp.room_code=room;end if;
 return jsonb_build_object('active',true,'sprint5_active',true,'canonical_flow_active',true,'run',jsonb_build_object('run_id',g.run_id,'run_mode',g.run_mode,'behavior_dataset_eligible',g.behavior_dataset_eligible),'discussion',case when d.discussion_session_id is null then null else jsonb_build_object('discussion_session_id',d.discussion_session_id,'topic',d.topic,'status',d.status,'vote_round',s.vote_round,'phase_deadline',d.phase_deadline,'outcome',d.outcome)end,'messages',msgs,'current_votes',votes,'teacher_override',jsonb_build_object('allowed_actions','[]'::jsonb,'history','[]'::jsonb));end$$;

alter function public.s5_configure_discussion(uuid,text) owner to postgres;
alter function public.s2_refresh_discussion_pre037(uuid) owner to postgres;
alter function public.s2_open_vote(text,text) owner to postgres;
alter function public.s5_teacher_open_vote(text,text) owner to postgres;
alter function public.s5_teacher_add_time(text,text,integer) owner to postgres;
alter function public.s5_get_teacher_discussion_state(text,text) owner to postgres;

revoke execute on function public.s5_configure_discussion(uuid,text) from public,anon,authenticated;
revoke execute on function public.s2_refresh_discussion_pre037(uuid) from public,anon,authenticated;
revoke execute on function public.s2_open_vote(text,text) from public;
revoke execute on function public.s5_teacher_open_vote(text,text) from public;
revoke execute on function public.s5_teacher_add_time(text,text,integer) from public;
revoke execute on function public.s5_get_teacher_discussion_state(text,text) from public;
grant execute on function public.s5_configure_discussion(uuid,text) to service_role;
grant execute on function public.s2_open_vote(text,text) to anon,authenticated,service_role;
grant execute on function public.s5_teacher_open_vote(text,text) to anon,authenticated,service_role;
grant execute on function public.s5_teacher_add_time(text,text,integer) to anon,authenticated,service_role;
grant execute on function public.s5_get_teacher_discussion_state(text,text) to anon,authenticated,service_role;

commit;
