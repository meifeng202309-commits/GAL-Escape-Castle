-- Level 3 independent audit closure: IDA-001..005.
begin;

alter table public.s6_station_b_progress enable row level security;
revoke all on table public.s6_station_b_progress from public, anon, authenticated;

create table public.act6_13_event_ledger(
 event_id bigint generated always as identity primary key,
 run_id uuid not null references public.game_runs(run_id) on delete cascade,
 event_type text not null,
 act_no int,
 phase_key text,
 occurrence_id uuid,
 player_id uuid references public.s1_room_players(player_id),
 details jsonb not null default '{}'::jsonb,
 occurred_at timestamptz not null default clock_timestamp()
);
create index act6_13_event_ledger_run_order on public.act6_13_event_ledger(run_id,event_id);
alter table public.act6_13_event_ledger enable row level security;
revoke all on table public.act6_13_event_ledger from public, anon, authenticated;

create table public.s6_audio_occurrences(
 occurrence_id uuid primary key default gen_random_uuid(),
 run_id uuid not null references public.game_runs(run_id) on delete cascade,
 cue_key text not null,
 phase_key text not null,
 cinematic_stage int,
 triggered_at timestamptz not null default clock_timestamp()
);
create index s6_audio_occurrences_run_order on public.s6_audio_occurrences(run_id,triggered_at,occurrence_id);
alter table public.s6_audio_occurrences enable row level security;
revoke all on table public.s6_audio_occurrences from public, anon, authenticated;

create table public.s6_audio_consumptions(
 occurrence_id uuid not null references public.s6_audio_occurrences(occurrence_id) on delete cascade,
 player_id uuid not null references public.s1_room_players(player_id) on delete cascade,
 outcome text not null check(outcome in('ended','stopped')),
 consumed_at timestamptz not null default clock_timestamp(),
 primary key(occurrence_id,player_id)
);
alter table public.s6_audio_consumptions enable row level security;
revoke all on table public.s6_audio_consumptions from public, anon, authenticated;

alter table public.s6_run_state add column feedback_audio_occurrence_id uuid references public.s6_audio_occurrences(occurrence_id);

create function public.act6_13_capture_s5_transition() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if tg_op='INSERT' or (old.phase_key,old.act_no,old.vote_round) is distinct from (new.phase_key,new.act_no,new.vote_round) then
  insert into public.act6_13_event_ledger(run_id,event_type,act_no,phase_key,details)
  values(new.run_id,'phase_transition',new.act_no,new.phase_key,jsonb_build_object('sprint',5,'from_phase',case when tg_op='INSERT'then null else old.phase_key end,'to_phase',new.phase_key,'vote_round',new.vote_round));
 end if;
 return new;
end$$;
revoke execute on function public.act6_13_capture_s5_transition() from public,anon,authenticated;
create trigger act6_13_capture_s5 after insert or update on public.s5_run_state for each row execute function public.act6_13_capture_s5_transition();

create function public.act6_13_prepare_s6_state() returns trigger language plpgsql security definer set search_path=public as $$
declare audio_occurrence uuid;
begin
 if new.feedback_audio_key is null then
  new.feedback_audio_occurrence_id:=null;
 elsif tg_op='INSERT' or old.feedback_audio_key is distinct from new.feedback_audio_key or old.feedback_audio_occurrence_id is null then
  insert into public.s6_audio_occurrences(run_id,cue_key,phase_key,cinematic_stage)
  values(new.run_id,new.feedback_audio_key,new.phase_key,new.cinematic_stage) returning occurrence_id into audio_occurrence;
  new.feedback_audio_occurrence_id:=audio_occurrence;
 end if;
 return new;
end$$;
revoke execute on function public.act6_13_prepare_s6_state() from public,anon,authenticated;
create trigger act6_13_prepare_s6 before insert or update on public.s6_run_state for each row execute function public.act6_13_prepare_s6_state();

create function public.act6_13_capture_s6_transition() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if tg_op='INSERT' or (old.phase_key,old.act_no,old.act9_step,old.round_no,old.cinematic_stage) is distinct from (new.phase_key,new.act_no,new.act9_step,new.round_no,new.cinematic_stage) then
  insert into public.act6_13_event_ledger(run_id,event_type,act_no,phase_key,details)
  values(new.run_id,'phase_transition',new.act_no,new.phase_key,jsonb_build_object('sprint',6,'from_phase',case when tg_op='INSERT'then null else old.phase_key end,'to_phase',new.phase_key,'step',new.act9_step,'round',new.round_no,'cinematic_stage',new.cinematic_stage));
 end if;
 if new.feedback_audio_occurrence_id is not null and (tg_op='INSERT' or old.feedback_audio_occurrence_id is distinct from new.feedback_audio_occurrence_id) then
  insert into public.act6_13_event_ledger(run_id,event_type,act_no,phase_key,occurrence_id,details)
  values(new.run_id,'audio_triggered',new.act_no,new.phase_key,new.feedback_audio_occurrence_id,jsonb_build_object('cue_key',new.feedback_audio_key,'cinematic_stage',new.cinematic_stage));
 end if;
 return new;
end$$;
revoke execute on function public.act6_13_capture_s6_transition() from public,anon,authenticated;
create trigger act6_13_capture_s6 after insert or update on public.s6_run_state for each row execute function public.act6_13_capture_s6_transition();

create function public.s5_ensure_initialized(p_run uuid) returns boolean language plpgsql security definer set search_path=public as $$
declare room text; created_new boolean:=false;
begin
 perform 1 from public.game_runs where run_id=p_run for update;
 if not exists(select 1 from public.s3b_run_state where run_id=p_run and terminal_state='SPRINT3B_COMPLETE') then return false; end if;
 insert into public.s5_run_state(run_id) values(p_run) on conflict(run_id) do nothing;
 if found then
  created_new:=true;
  insert into public.s5_rounds(run_id,phase_key,vote_round,topic_text_key) values(p_run,'act6_vote',1,'act06.001') on conflict do nothing;
  perform public.s5_set_scene(p_run,'act6_portrait','act6_vote','round_1','ACTION_SCREEN','act06.001');
  select room_code into room from public.game_runs where run_id=p_run;
  perform public.s2_log_event(p_run,room,null,'s5_initialized',null,jsonb_build_object('event_source','automatic_transition','behavior_scoring',false));
 end if;
 return created_new;
end$$;
revoke execute on function public.s5_ensure_initialized(uuid) from public,anon,authenticated;

create function public.s6_ensure_initialized(p_run uuid) returns boolean language plpgsql security definer set search_path=public as $$
declare room text; sid uuid; created_new boolean:=false;
begin
 perform 1 from public.game_runs where run_id=p_run for update;
 if not exists(select 1 from public.s5_run_state where run_id=p_run and phase_key='complete') then return false; end if;
 insert into public.s6_run_state(run_id) values(p_run) on conflict(run_id) do nothing;
 if found then
  created_new:=true;
  perform public.s6_deliver_clues(p_run,9);
  sid:=public.s6_open_discussion(p_run,'act9_discussion','step_1',180,'act09.004');
  perform public.s6_set_scene(p_run,'act9_great_hall','act9_discussion','step_1','CINEMATIC_MESSAGE','act09.004');
  select room_code into room from public.game_runs where run_id=p_run;
  perform public.s2_log_event(p_run,room,sid,'s6_initialized',null,jsonb_build_object('event_source','automatic_transition','behavior_scoring',false));
 end if;
 return created_new;
end$$;
revoke execute on function public.s6_ensure_initialized(uuid) from public,anon,authenticated;

create function public.act6_13_deferred_cross_sprint() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if tg_table_name='s3b_run_state' and new.terminal_state='SPRINT3B_COMPLETE' then perform public.s5_ensure_initialized(new.run_id);
 elsif tg_table_name='s5_run_state' and new.phase_key='complete' then perform public.s6_ensure_initialized(new.run_id);
 end if;
 return null;
end$$;
revoke execute on function public.act6_13_deferred_cross_sprint() from public,anon,authenticated;
create constraint trigger s3b_to_s5_automatic after insert or update on public.s3b_run_state deferrable initially deferred for each row execute function public.act6_13_deferred_cross_sprint();
create constraint trigger s5_to_s6_automatic after insert or update on public.s5_run_state deferrable initially deferred for each row execute function public.act6_13_deferred_cross_sprint();

create or replace function public.s5_initialize(p_room_code text,p_teacher_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;created boolean;
begin perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);created:=public.s5_ensure_initialized(g.run_id);return jsonb_build_object('ok',true,'run_id',g.run_id,'created',created);end$$;

create or replace function public.s6_initialize(p_room_code text,p_teacher_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;created boolean;
begin perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);created:=public.s6_ensure_initialized(g.run_id);return jsonb_build_object('ok',true,'run_id',g.run_id,'created',created);end$$;

create function public.s6_refresh_owned_discussion(p_run uuid) returns void language plpgsql security definer set search_path=public as $$
declare s public.s6_run_state%rowtype;d public.discussion_sessions%rowtype;next_phase text;
begin
 select * into s from public.s6_run_state where run_id=p_run for update;
 if not found or s.phase_key not in('act9_discussion','act10_discussion','act11_discussion') then return; end if;
 select * into d from public.discussion_sessions where run_id=p_run and scene_id='sprint6' and phase_key=s.phase_key and status='discussion' order by vote_round desc limit 1 for update;
 if not found or d.phase_deadline is null or d.phase_deadline>now() then return; end if;
 next_phase:=case s.phase_key when'act9_discussion'then'act9_console'when'act10_discussion'then'act10_final_vote'when'act11_discussion'then'act11_allocation'end;
 update public.discussion_sessions set status='resolved',ended_at=now(),phase_deadline=null,outcome=jsonb_build_object('type','discussion_complete','owner','sprint6') where discussion_session_id=d.discussion_session_id;
 update public.s6_run_state set phase_key=next_phase,feedback_text_keys='{}',feedback_audio_key=null,updated_at=now() where run_id=p_run;
 insert into public.act6_13_event_ledger(run_id,event_type,act_no,phase_key,details) values(p_run,'discussion_deadline_advanced',s.act_no,next_phase,jsonb_build_object('discussion_session_id',d.discussion_session_id,'from_phase',s.phase_key));
end$$;
revoke execute on function public.s6_refresh_owned_discussion(uuid) from public,anon,authenticated;

alter function public.s2_refresh_discussion(uuid) rename to s2_refresh_discussion_pre037;
create function public.s2_refresh_discussion(p_discussion_session_id uuid) returns void language plpgsql security definer set search_path=public as $$
declare d public.discussion_sessions%rowtype;
begin
 select * into d from public.discussion_sessions where discussion_session_id=p_discussion_session_id;
 if d.scene_id='sprint6' then perform public.s6_refresh_owned_discussion(d.run_id);return;end if;
 perform public.s2_refresh_discussion_pre037(p_discussion_session_id);
end$$;
revoke execute on function public.s2_refresh_discussion(uuid) from public,anon,authenticated;
revoke execute on function public.s2_refresh_discussion_pre037(uuid) from public,anon,authenticated;

create function public.s6_mark_audio_consumed(p_room_code text,p_session_token text,p_occurrence_id uuid,p_outcome text default 'ended') returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;o public.s6_audio_occurrences%rowtype;
begin
 p:=public.s1_get_player_by_session(room,p_session_token);g:=public.s2_get_active_run(room);
 select * into o from public.s6_audio_occurrences where occurrence_id=p_occurrence_id and run_id=g.run_id;
 if not found then raise exception'Unknown audio occurrence.';end if;
 if p_outcome not in('ended','stopped')then raise exception'Invalid audio outcome.';end if;
 insert into public.s6_audio_consumptions(occurrence_id,player_id,outcome) values(o.occurrence_id,p.player_id,p_outcome) on conflict(occurrence_id,player_id) do nothing;
 if found then insert into public.act6_13_event_ledger(run_id,event_type,phase_key,occurrence_id,player_id,details) values(g.run_id,'audio_consumed',o.phase_key,o.occurrence_id,p.player_id,jsonb_build_object('cue_key',o.cue_key,'outcome',p_outcome));end if;
 return jsonb_build_object('ok',true,'occurrence_id',o.occurrence_id,'consumed',true);
end$$;
grant execute on function public.s6_mark_audio_consumed(text,text,uuid,text) to anon,authenticated;

create or replace function public.s6_get_player_state(p_room_code text,p_session_token text)returns jsonb language plpgsql security definer set search_path=public as $$declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s6_run_state%rowtype;d public.discussion_sessions%rowtype;begin p:=public.s1_get_player_by_session(room,p_session_token);g:=public.s2_get_active_run(room);perform public.s6_refresh_owned_discussion(g.run_id);perform public.s6_tick_cinematic(g.run_id);select*into s from public.s6_run_state where run_id=g.run_id;if not found then return jsonb_build_object('active',false);end if;select*into d from public.discussion_sessions where run_id=g.run_id and status='discussion'order by vote_round desc limit 1;return jsonb_build_object('active',true,'state',to_jsonb(s),'audio_occurrence_id',s.feedback_audio_occurrence_id,'audio_consumed',case when s.feedback_audio_occurrence_id is null then false else exists(select 1 from public.s6_audio_consumptions where occurrence_id=s.feedback_audio_occurrence_id and player_id=p.player_id)end,'role_slot',p.role_slot,'scene_asset_key',case when s.act_no=9 then'shared.great_hall'when s.act_no=10 then'prop.golden_key'when s.act_no in(11,12)then'shared.main_gate'when s.act_no=13 then'ending.castle_exterior'end,'discussion',case when d.discussion_session_id is null then null else jsonb_build_object('discussion_session_id',d.discussion_session_id,'phase_key',d.phase_key,'step_key',d.step_key,'vote_round',d.vote_round,'phase_deadline',d.phase_deadline,'silent_texting_mode',d.silent_texting_mode,'messages',(select coalesce(jsonb_agg(jsonb_build_object('display_name',rp.display_name,'message_text',m.message_text,'created_at',m.created_at)order by m.message_id),'[]')from public.dialogue_messages m join public.s1_room_players rp using(player_id)where m.discussion_session_id=d.discussion_session_id))end,'private_clue',(select jsonb_build_object('knowledge_key',knowledge_key,'text_key',text_key)from public.s6_private_clues where run_id=g.run_id and player_id=p.player_id and act_no=s.act_no),'private_choices_revealed',case when s.act_no>10 or s.phase_key in('act10_discussion','act10_final_vote','act10_result')then(select coalesce(jsonb_agg(jsonb_build_object('role_slot',rp.role_slot,'choice_id',c.choice_id)order by rp.role_slot),'[]')from public.s6_choices c join public.s1_room_players rp using(player_id)where c.run_id=g.run_id and c.phase_key='act10_private')else'[]'::jsonb end,'allocation',(select role_key from public.s6_allocations where run_id=g.run_id and player_id=p.player_id),'station_task',(select task_key from public.s6_station_tasks where run_id=g.run_id and player_id=p.player_id),'station_b_stage',(select stage from public.s6_station_b_progress where run_id=g.run_id and player_id=p.player_id),'engaged_roles',(select coalesce(jsonb_agg(role_key),'[]')from public.s6_engagements where run_id=g.run_id),'act13_continue_at',case when s.phase_key='act13_escape'then s.stage_started_at+interval'3 seconds'end,'game_completed',false,'export_ready',false);end$$;

create function public.act6_13_get_timeline(p_room_code text,p_teacher_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;
begin perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);return (select coalesce(jsonb_agg(to_jsonb(e) order by event_id),'[]')from public.act6_13_event_ledger e where run_id=g.run_id);end$$;
grant execute on function public.act6_13_get_timeline(text,text) to anon,authenticated;

commit;
