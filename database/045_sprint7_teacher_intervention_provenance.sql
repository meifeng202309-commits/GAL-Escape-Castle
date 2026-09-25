-- Sprint 7 residual S7-CA-003: complete durable Teacher intervention provenance.
begin;

create function public.s7_mirror_teacher_discussion_event() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  if new.event_type in('vote_opened_by_teacher','teacher_added_time') then
    insert into public.runtime_events(run_id,room_code,discussion_session_id,event_type,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,interaction_id)
    values(new.run_id,new.room_code,new.discussion_session_id,'teacher_intervention_'||new.event_type,
      new.details||jsonb_build_object('source_event_id',new.event_id),new.scene_id,new.phase_key,new.step_key,'teacher_override','valid',false,new.interaction_id);
  end if;
  return new;
end$$;
revoke execute on function public.s7_mirror_teacher_discussion_event() from public,anon,authenticated;
create trigger s7_mirror_teacher_discussion_event after insert on public.runtime_events
for each row execute function public.s7_mirror_teacher_discussion_event();

insert into public.runtime_events(run_id,room_code,discussion_session_id,event_type,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,interaction_id)
select e.run_id,e.room_code,e.discussion_session_id,'teacher_intervention_'||e.event_type,e.details||jsonb_build_object('source_event_id',e.event_id),e.scene_id,e.phase_key,e.step_key,'teacher_override','valid',false,e.interaction_id
from public.runtime_events e where e.event_type in('vote_opened_by_teacher','teacher_added_time')
and not exists(select 1 from public.runtime_events x where x.run_id=e.run_id and x.event_type='teacher_intervention_'||e.event_type and(x.details->>'source_event_id')::bigint=e.event_id);

create or replace function public.s5_teacher_open_vote(p_room_code text,p_teacher_token text)returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s5_run_state%rowtype;sid uuid;
begin perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);select*into s from public.s5_run_state where run_id=g.run_id;select discussion_session_id into sid from public.s5_rounds where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round;update public.discussion_sessions set status='voting',phase_deadline=now()+make_interval(secs=>vote_time_limit_sec)where discussion_session_id=sid and status='discussion';if not found then raise exception'Current Sprint 5 discussion is not open.';end if;
insert into public.runtime_events(run_id,room_code,discussion_session_id,event_type,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,interaction_id)values(g.run_id,room,sid,'teacher_intervention_s5_vote_opened',jsonb_build_object('vote_round',s.vote_round),null,s.phase_key,null,'teacher_override','valid',false,sid);
return jsonb_build_object('ok',true,'discussion_session_id',sid);end$$;

create or replace function public.s5_teacher_add_time(p_room_code text,p_teacher_token text,p_seconds integer)returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s5_run_state%rowtype;sid uuid;
begin if p_seconds<1 or p_seconds>600 then raise exception'Invalid time extension.';end if;perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);select*into s from public.s5_run_state where run_id=g.run_id;select discussion_session_id into sid from public.s5_rounds where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round;update public.discussion_sessions set phase_deadline=greatest(coalesce(phase_deadline,now()),now())+make_interval(secs=>p_seconds)where discussion_session_id=sid and status in('discussion','voting','waiting_for_missing_player');if not found then raise exception'Current Sprint 5 discussion cannot receive time.';end if;
insert into public.runtime_events(run_id,room_code,discussion_session_id,event_type,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,interaction_id)values(g.run_id,room,sid,'teacher_intervention_s5_time_added',jsonb_build_object('seconds',p_seconds,'vote_round',s.vote_round),null,s.phase_key,null,'teacher_override','valid',false,sid);
return jsonb_build_object('ok',true,'discussion_session_id',sid);end$$;

revoke execute on function public.s5_teacher_open_vote(text,text),public.s5_teacher_add_time(text,text,integer) from public;
grant execute on function public.s5_teacher_open_vote(text,text),public.s5_teacher_add_time(text,text,integer) to anon,authenticated;
commit;
