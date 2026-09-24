-- Sprint 5 Level 1 correction: one canonical DiscussionRoom authority.
drop trigger if exists s5_round_audit_link on public.s5_rounds;

alter table public.discussion_sessions add column if not exists allow_pocket boolean not null default false;
alter table public.discussion_sessions add column if not exists allow_memories_observations boolean not null default false;
alter table public.discussion_sessions add column if not exists allow_share_photo boolean not null default false;

create or replace function public.s5_configure_discussion(p_session uuid,p_phase text)
returns void language plpgsql security definer set search_path=public as $$
declare secs int; options jsonb; policy text; maxr int; fallback text;
begin
 secs:=case p_phase when 'act6_vote' then 90 when 'act8_final_vote' then 180 else 15 end;
 options:=case p_phase
  when 'act6_vote' then '[{"id":"escape","label":"act06.002"},{"id":"1897","label":"act06.003"},{"id":"time_stopped","label":"act06.004"},{"id":"trapped","label":"act06.005"}]'::jsonb
  when 'act7_vote' then '[{"id":"clock_a","label":"act07.008"},{"id":"clock_b","label":"act07.009"},{"id":"clock_c","label":"act07.010"}]'::jsonb
  else '[{"id":"main_gate","label":"act08.001"},{"id":"west_tower","label":"act08.002"}]'::jsonb end;
 policy:=case p_phase when 'act6_vote' then 'SINGLE_REVOTE_THEN_FALLBACK' when 'act7_vote' then 'REPEAT_UNTIL_MAJORITY' else 'NO_TIE_POSSIBLE' end;
 maxr:=case p_phase when 'act6_vote' then 1 else null end;
 fallback:=case p_phase when 'act6_vote' then 'portrait_fixed_fallback' else null end;
 insert into public.discussion_sessions(
  discussion_session_id,run_id,scene_id,phase_key,step_key,round_no,vote_round,topic,status,
  show_initial_choices,allow_free_text,require_final_vote,vote_options,tie_policy,
  discussion_time_limit_sec,vote_time_limit_sec,silent_texting_mode
 ) select r.discussion_session_id,r.run_id,
  case p_phase when 'act6_vote' then 'act6_portrait' when 'act7_vote' then 'act7_clock_room' else 'act8_route' end,
  p_phase,'sprint5_round',r.vote_round,r.vote_round,r.topic_text_key,'discussion',false,true,true,
  options,policy,secs,60,true from public.s5_rounds r where r.discussion_session_id=p_session
 on conflict(discussion_session_id)do nothing;
 update public.discussion_sessions set
  scene_id=case p_phase when 'act6_vote' then 'act6_portrait' when 'act7_vote' then 'act7_clock_room' else 'act8_route' end,
  phase_key=p_phase,step_key='sprint5_round',status='discussion',started_at=now(),phase_deadline=now()+make_interval(secs=>secs),ended_at=null,outcome=null,
  show_initial_choices=p_phase='act8_final_vote',allow_free_text=true,allow_pocket=true,
  allow_memories_observations=true,allow_share_photo=p_phase='act8_final_vote',require_final_vote=true,
  vote_options=options,tie_policy=policy,revote_window_sec=15,max_revotes=maxr,
  fallback_resolution=fallback,discussion_time_limit_sec=secs,vote_time_limit_sec=60,silent_texting_mode=true
 where discussion_session_id=p_session;
 if not found then raise exception 'Sprint 5 canonical discussion link is missing.'; end if;
end$$;
revoke execute on function public.s5_configure_discussion(uuid,text) from public,anon,authenticated;

alter function public.s5_initialize(text,text) rename to s5_initialize_pre029;
revoke execute on function public.s5_initialize_pre029(text,text) from public,anon,authenticated;
create function public.s5_initialize(p_room_code text,p_teacher_token text) returns jsonb
language plpgsql security definer set search_path=public as $$
declare result jsonb; sid uuid;
begin result:=public.s5_initialize_pre029(p_room_code,p_teacher_token);select discussion_session_id into sid from public.s5_rounds where run_id=(result->>'run_id')::uuid and phase_key='act6_vote' and vote_round=1;perform public.s5_configure_discussion(sid,'act6_vote');return result;end$$;

alter function public.s5_submit_vote(text,text,uuid,integer,uuid,text) rename to s5_submit_vote_pre029;
revoke execute on function public.s5_submit_vote_pre029(text,text,uuid,integer,uuid,text) from public,anon,authenticated;
create function public.s5_submit_vote(p_room_code text,p_session_token text,p_expected_discussion_session_id uuid,p_expected_vote_round int,p_client_request_id uuid,p_choice_id text) returns jsonb
language plpgsql security definer set search_path=public as $$
declare ds public.discussion_sessions%rowtype; result jsonb; g public.game_runs%rowtype; s public.s5_run_state%rowtype; next_sid uuid;
begin
 select * into ds from public.discussion_sessions where discussion_session_id=p_expected_discussion_session_id for update;
 if not found or ds.status not in('voting','waiting_for_missing_player') then raise exception 'Sprint 5 voting is not open; complete the DiscussionRoom first.'; end if;
 result:=public.s5_submit_vote_pre029(p_room_code,p_session_token,p_expected_discussion_session_id,p_expected_vote_round,p_client_request_id,p_choice_id);
 g:=public.s2_get_active_run(upper(trim(p_room_code)));select * into s from public.s5_run_state where run_id=g.run_id;
 if coalesce((result->>'resolved')::boolean,false) or coalesce((result->>'tie')::boolean,false) then
  update public.discussion_sessions set status='resolved',ended_at=now(),phase_deadline=null,
   outcome=jsonb_build_object('resolution_source',case when s.act6_resolution='portrait_fixed_fallback' then 'system_fallback' when result->>'tie'='true' then 'no_consensus' else 'player_majority' end,'choice_id',result->>'choice_id')
  where discussion_session_id=p_expected_discussion_session_id;
  update public.s5_rounds set status='resolved',resolved_at=now(),resolution_source=case when s.act6_resolution='portrait_fixed_fallback' then 'system_fallback' when result->>'tie'='true' then 'tie' else 'player_majority' end where discussion_session_id=p_expected_discussion_session_id;
 end if;
 select discussion_session_id into next_sid from public.s5_rounds where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round and status='discussion';
 if next_sid is not null and next_sid<>p_expected_discussion_session_id then perform public.s5_configure_discussion(next_sid,s.phase_key);end if;
 return result;
end$$;

alter function public.s5_advance(text,text) rename to s5_advance_pre029;
revoke execute on function public.s5_advance_pre029(text,text) from public,anon,authenticated;
create function public.s5_advance(p_room_code text,p_session_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb;g public.game_runs%rowtype;s public.s5_run_state%rowtype;sid uuid;
begin result:=public.s5_advance_pre029(p_room_code,p_session_token);g:=public.s2_get_active_run(upper(trim(p_room_code)));select * into s from public.s5_run_state where run_id=g.run_id;if s.phase_key='act7_vote' then select discussion_session_id into sid from public.s5_rounds where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round;perform public.s5_configure_discussion(sid,s.phase_key);end if;return result;end$$;

alter function public.s5_submit_private_choice(text,text,uuid,text) rename to s5_submit_private_choice_pre029;
revoke execute on function public.s5_submit_private_choice_pre029(text,text,uuid,text) from public,anon,authenticated;
create function public.s5_submit_private_choice(p_room_code text,p_session_token text,p_client_request_id uuid,p_choice_id text) returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb;g public.game_runs%rowtype;s public.s5_run_state%rowtype;sid uuid;
begin result:=public.s5_submit_private_choice_pre029(p_room_code,p_session_token,p_client_request_id,p_choice_id);g:=public.s2_get_active_run(upper(trim(p_room_code)));select * into s from public.s5_run_state where run_id=g.run_id;if s.phase_key='act8_final_vote' then select discussion_session_id into sid from public.s5_rounds where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round;perform public.s5_configure_discussion(sid,s.phase_key);update public.s3_runtime_scene_state set allow_share_photo=true where run_id=g.run_id;end if;return result;end$$;

alter function public.s5_get_player_state(text,text) rename to s5_get_player_state_pre029;
revoke execute on function public.s5_get_player_state_pre029(text,text) from public,anon,authenticated;
create function public.s5_get_player_state(p_room_code text,p_session_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare base jsonb;g public.game_runs%rowtype;s public.s5_run_state%rowtype;ds jsonb;
begin base:=public.s5_get_player_state_pre029(p_room_code,p_session_token);if not coalesce((base->>'active')::boolean,false)then return base;end if;g:=public.s2_get_active_run(upper(trim(p_room_code)));select * into s from public.s5_run_state where run_id=g.run_id;select to_jsonb(d) into ds from public.discussion_sessions d join public.s5_rounds r using(discussion_session_id)where r.run_id=g.run_id and r.phase_key=s.phase_key and r.vote_round=s.vote_round;return base||jsonb_build_object('canonical_discussion',ds,'presentation_text_key',(select text_key from public.s3_runtime_scene_state where run_id=g.run_id));end$$;

create function public.s5_get_discussion_state(p_room_code text,p_session_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s5_run_state%rowtype;ds public.discussion_sessions%rowtype;sid uuid;msgs jsonb:='[]';initials jsonb:='[]';mine jsonb;submitted int;
begin p:=public.s1_get_player_by_session(room,p_session_token);g:=public.s2_get_active_run(room);select * into s from public.s5_run_state where run_id=g.run_id;if not found then return jsonb_build_object('active',false);end if;select d.* into ds from public.discussion_sessions d join public.s5_rounds r using(discussion_session_id)where r.run_id=g.run_id and r.phase_key=s.phase_key and r.vote_round=s.vote_round;if not found then return jsonb_build_object('active',true,'discussion',null);end if;sid:=ds.discussion_session_id;perform public.s2_refresh_discussion(sid);select * into ds from public.discussion_sessions where discussion_session_id=sid;
 select coalesce(jsonb_agg(jsonb_build_object('message_id',m.message_id,'display_name',rp.display_name,'role_slot',rp.role_slot,'message_text',m.message_text,'created_at',m.created_at)order by m.created_at,m.message_id),'[]')into msgs from public.dialogue_messages m join public.s1_room_players rp on rp.player_id=m.player_id where m.discussion_session_id=ds.discussion_session_id;
 select count(*)into submitted from public.s5_votes where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round;select jsonb_build_object('choice_id',choice_id,'choice_label',choice_id,'locked_at',locked_at)into mine from public.s5_votes where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round and player_id=p.player_id;
 if ds.show_initial_choices then select coalesce(jsonb_agg(jsonb_build_object('display_name',rp.display_name,'role_slot',rp.role_slot,'choice_id',c.choice_id,'choice_label',case c.choice_id when'main_gate'then'act08.001'when'west_tower'then'act08.002'when'compare'then'act08.003'else'act08.004'end,'locked_at',c.locked_at)order by rp.role_slot),'[]')into initials from public.s5_act8_private_choices c join public.s1_room_players rp using(player_id)where c.run_id=g.run_id;end if;
 return jsonb_build_object('active',true,'discussion',jsonb_build_object('discussion_session_id',ds.discussion_session_id,'topic',ds.topic,'status',ds.status,'vote_round',s.vote_round,'round_no',s.vote_round,'phase_deadline',ds.phase_deadline,'show_initial_choices',ds.show_initial_choices,'require_final_vote',true,'vote_options',ds.vote_options,'tie_policy',ds.tie_policy,'silent_texting_mode',true),'initial_choices',initials,'messages',msgs,'submitted_vote_count',submitted,'my_vote',mine,'revealed_votes','[]'::jsonb,'vote_history','[]'::jsonb);
end$$;

create function public.s5_audit_expire_discussion(p_room_code text,p_teacher_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s5_run_state%rowtype;sid uuid;
begin perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);if g.run_mode<>'audit'then raise exception'Audit timing control requires AUDIT run.';end if;select * into s from public.s5_run_state where run_id=g.run_id;select discussion_session_id into sid from public.s5_rounds where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round;update public.discussion_sessions set phase_deadline=now()-interval'1 second'where discussion_session_id=sid and status='discussion';perform public.s2_refresh_discussion(sid);return jsonb_build_object('ok',true,'discussion_session_id',sid);end$$;

revoke execute on function public.s5_get_discussion_state(text,text),public.s5_audit_expire_discussion(text,text) from public;
grant execute on function public.s5_initialize(text,text),public.s5_submit_vote(text,text,uuid,integer,uuid,text),public.s5_advance(text,text),public.s5_submit_private_choice(text,text,uuid,text),public.s5_get_player_state(text,text),public.s5_get_discussion_state(text,text),public.s5_audit_expire_discussion(text,text) to anon,authenticated;
