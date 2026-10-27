-- ACT9 NORMAL discussion is Teacher-paced; AUDIT keeps its existing deadlines.
-- Development source only. Do not apply without separate release authorization.
begin;

create or replace function public.s6_open_discussion(p_run uuid,p_phase text,p_step text,p_seconds int,p_topic text)
returns uuid language plpgsql security definer set search_path=public as $$
declare sid uuid;vr int;mode text;deadline timestamptz;
begin
 select run_mode into mode from public.game_runs where run_id=p_run;
 if not found then raise exception 'Sprint 6 run is unavailable.';end if;
 update public.discussion_sessions set status='resolved',ended_at=now(),phase_deadline=null,outcome=jsonb_build_object('type','superseded_by_sprint6_transition')where run_id=p_run and status in('discussion','voting','waiting_for_missing_player');
 select coalesce(max(vote_round),0)+1 into vr from public.discussion_sessions where run_id=p_run;
 deadline:=case when mode='normal'and p_phase in('act9_discussion','act10_discussion')then null else now()+make_interval(secs=>p_seconds)end;
 insert into public.discussion_sessions(run_id,scene_id,phase_key,step_key,round_no,vote_round,topic,status,phase_deadline,show_initial_choices,allow_free_text,require_final_vote,vote_options,tie_policy,discussion_time_limit_sec,vote_time_limit_sec,silent_texting_mode)
 values(p_run,'sprint6',p_phase,p_step,vr,vr,p_topic,'discussion',deadline,false,true,false,'[]','REPEAT_UNTIL_MAJORITY',p_seconds,60,true)returning discussion_session_id into sid;
 return sid;
end$$;
revoke execute on function public.s6_open_discussion(uuid,text,text,int,text)from public,anon,authenticated;

create or replace function public.s6_refresh_owned_discussion(p_run uuid)
returns void language plpgsql security definer set search_path=public as $$
declare s public.s6_run_state%rowtype;d public.discussion_sessions%rowtype;next_phase text;mode text;
begin
 select * into s from public.s6_run_state where run_id=p_run for update;
 if not found or s.phase_key not in('act9_discussion','act10_discussion','act11_discussion')then return;end if;
 select run_mode into mode from public.game_runs where run_id=p_run;
 if mode='normal'and s.phase_key in('act9_discussion','act10_discussion')then return;end if;
 select * into d from public.discussion_sessions where run_id=p_run and scene_id='sprint6'and phase_key=s.phase_key and status='discussion'order by vote_round desc limit 1 for update;
 if not found or d.phase_deadline is null or d.phase_deadline>now()then return;end if;
 next_phase:=case s.phase_key when'act9_discussion'then'act9_console'when'act10_discussion'then'act10_final_vote'when'act11_discussion'then'act11_allocation'end;
 update public.discussion_sessions set status='resolved',ended_at=now(),phase_deadline=null,outcome=jsonb_build_object('type','discussion_complete','owner','sprint6')where discussion_session_id=d.discussion_session_id;
 update public.s6_run_state set phase_key=next_phase,feedback_text_keys='{}',feedback_audio_key=null,updated_at=now()where run_id=p_run;
 insert into public.act6_13_event_ledger(run_id,event_type,act_no,phase_key,details)values(p_run,'discussion_deadline_advanced',s.act_no,next_phase,jsonb_build_object('discussion_session_id',d.discussion_session_id,'from_phase',s.phase_key));
end$$;
revoke execute on function public.s6_refresh_owned_discussion(uuid)from public,anon,authenticated;

create or replace function public.s6_close_discussion_guarded(p_room_code text,p_session_token text,p_expected_phase text,p_expected_step int,p_expected_round int,p_expected_discussion_session_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s6_run_state%rowtype;d public.discussion_sessions%rowtype;nextphase text;
begin
 p:=public.s1_get_player_by_session(room,p_session_token);g:=public.s2_get_active_run(room);
 select*into s from public.s6_run_state where run_id=g.run_id for update;perform public.s6_assert_identity(s,p_expected_phase,p_expected_step,p_expected_round);
 select*into d from public.discussion_sessions where discussion_session_id=p_expected_discussion_session_id and run_id=g.run_id for update;
 if not found or d.status<>'discussion'or d.phase_key<>p_expected_phase then raise exception'Stale Sprint 6 discussion identity.';end if;
 if g.run_mode='normal'and d.phase_key in('act9_discussion','act10_discussion')then raise exception'Teacher must open the ACT9 or ACT10 vote.';end if;
 if d.phase_deadline>now()and g.run_mode<>'audit'then raise exception'Discussion timer is still active.';end if;
 update public.discussion_sessions set status='resolved',ended_at=now(),phase_deadline=null,outcome=jsonb_build_object('type','discussion_complete')where discussion_session_id=d.discussion_session_id;
 nextphase:=case p_expected_phase when'act9_discussion'then'act9_console'when'act10_discussion'then'act10_final_vote'when'act11_discussion'then'act11_allocation'else null end;
 if nextphase is null then raise exception'Invalid Sprint 6 discussion transition.';end if;
 update public.s6_run_state set phase_key=nextphase,feedback_text_keys='{}',feedback_audio_key=null,updated_at=now()where run_id=g.run_id;
 return jsonb_build_object('ok',true,'phase_key',nextphase);
end$$;
revoke execute on function public.s6_close_discussion_guarded(text,text,text,int,int,uuid)from public,anon,authenticated;

create or replace function public.s6_get_player_state(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb;room text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s6_run_state%rowtype;
begin
 result:=public.s6_get_player_state_pre072(p_room_code,p_session_token);
 if coalesce((result->>'active')::boolean,false)then
  g:=public.s2_get_active_run(room);select*into s from public.s6_run_state where run_id=g.run_id;
  if g.run_mode='normal'and s.phase_key in('act9_discussion','act10_discussion')and result->'discussion'is not null then result:=jsonb_set(result,'{discussion,teacher_open_required}','true'::jsonb,true);end if;
 end if;
 return result;
end$$;
revoke execute on function public.s6_get_player_state(text,text)from public;
grant execute on function public.s6_get_player_state(text,text)to anon,authenticated;

create or replace function public.s6_teacher_open_vote(p_room_code text,p_teacher_token text,p_expected_run_id uuid,p_expected_phase text,p_expected_step int,p_expected_round int,p_expected_discussion_session_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s6_run_state%rowtype;d public.discussion_sessions%rowtype;nextphase text;actno int;
begin
 perform public.s1_assert_teacher(room,p_teacher_token);
 select*into g from public.game_runs where run_id=p_expected_run_id and room_code=room and status='active'for update;
 if not found then raise exception'Stale Sprint 6 run identity.';end if;
 select*into s from public.s6_run_state where run_id=g.run_id for update;
 if not found or g.run_mode<>'normal'or p_expected_phase not in('act9_discussion','act10_discussion')or s.phase_key<>p_expected_phase or s.act9_step<>p_expected_step or s.round_no<>p_expected_round then raise exception'Stale or ineligible Sprint 6 phase identity.';end if;
 select*into d from public.discussion_sessions where discussion_session_id=p_expected_discussion_session_id and run_id=g.run_id and scene_id='sprint6'and phase_key=p_expected_phase for update;
 if not found or d.status<>'discussion'then raise exception'Current ACT9 or ACT10 discussion is not open.';end if;
 nextphase:=case p_expected_phase when'act9_discussion'then'act9_console'else'act10_final_vote'end;actno:=case p_expected_phase when'act9_discussion'then 9 else 10 end;
 update public.discussion_sessions set status='resolved',ended_at=now(),phase_deadline=null,outcome=jsonb_build_object('type','teacher_open_vote','owner','teacher')where discussion_session_id=d.discussion_session_id and status='discussion';
 if not found then raise exception'ACT9 or ACT10 discussion changed before Teacher Open Vote.';end if;
 update public.s6_run_state set phase_key=nextphase,feedback_text_keys='{}',feedback_audio_key=null,updated_at=now()where run_id=g.run_id;
 insert into public.runtime_events(run_id,room_code,discussion_session_id,event_type,details)values(g.run_id,room,d.discussion_session_id,'teacher_intervention_s6_vote_opened',jsonb_build_object('from_phase',p_expected_phase,'to_phase',nextphase,'round_no',p_expected_round,'behavior_scoring',false));
 insert into public.act6_13_event_ledger(run_id,event_type,act_no,phase_key,details)values(g.run_id,'teacher_open_vote',actno,nextphase,jsonb_build_object('discussion_session_id',d.discussion_session_id,'from_phase',p_expected_phase,'round_no',p_expected_round));
 return jsonb_build_object('ok',true,'run_id',g.run_id,'discussion_session_id',d.discussion_session_id,'phase_key',nextphase,'round_no',s.round_no);
end$$;
revoke execute on function public.s6_teacher_open_vote(text,text,uuid,text,int,int,uuid)from public;
grant execute on function public.s6_teacher_open_vote(text,text,uuid,text,int,int,uuid)to anon,authenticated;

commit;
