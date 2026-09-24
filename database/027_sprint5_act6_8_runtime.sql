-- Sprint 5: server-authoritative ACT 6-8 runtime.
create table public.s5_run_state(
 run_id uuid primary key references public.game_runs(run_id),
 act_no int not null default 6 check(act_no between 6 and 8),
 phase_key text not null default 'act6_vote',vote_round int not null default 1,
 act6_resolution text,act7_wrong_attempts int not null default 0,
 route_taken_act8 text check(route_taken_act8 in('main_gate','west_tower')),
 completed_at timestamptz,updated_at timestamptz not null default now()
);
create table public.s5_votes(
 run_id uuid not null references public.game_runs(run_id),phase_key text not null,vote_round int not null,
 player_id uuid not null references public.s1_room_players(player_id),choice_id text not null,client_request_id uuid not null,locked_at timestamptz not null default now(),
 primary key(run_id,phase_key,vote_round,player_id)
);
create unique index s5_votes_request_identity on public.s5_votes(run_id,player_id,client_request_id);
create table public.s5_rounds(
 discussion_session_id uuid primary key default gen_random_uuid(),run_id uuid not null references public.game_runs(run_id),
 phase_key text not null,vote_round int not null,topic_text_key text not null,status text not null default 'discussion' check(status in('discussion','resolved')),
 resolution_source text,created_at timestamptz not null default now(),resolved_at timestamptz,
 unique(run_id,phase_key,vote_round)
);
create table public.s5_act8_private_choices(
 run_id uuid not null references public.game_runs(run_id),player_id uuid not null references public.s1_room_players(player_id),
 choice_id text not null check(choice_id in('main_gate','west_tower','compare','follow_group')),client_request_id uuid not null,locked_at timestamptz not null default now(),
 primary key(run_id,player_id)
);
create unique index s5_act8_private_request_identity on public.s5_act8_private_choices(run_id,player_id,client_request_id);
alter table public.s5_run_state enable row level security;
alter table public.s5_votes enable row level security;
alter table public.s5_rounds enable row level security;
alter table public.s5_act8_private_choices enable row level security;

create function public.s5_set_scene(p_run uuid,p_scene text,p_phase text,p_step text,p_mode text,p_text_key text) returns void
language plpgsql security definer set search_path=public as $$begin perform public.s3b_set_scene(p_run,p_scene,p_phase,p_step,p_mode,p_text_key);end$$;
revoke execute on function public.s5_set_scene(uuid,text,text,text,text,text) from public,anon,authenticated;

create function public.s5_initialize(p_room_code text,p_teacher_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));g public.game_runs%rowtype;
begin perform public.s1_assert_teacher(r,p_teacher_token);g:=public.s2_get_active_run(r);perform 1 from public.game_runs where run_id=g.run_id for update;
 if not exists(select 1 from public.s3b_run_state where run_id=g.run_id and terminal_state='SPRINT3B_COMPLETE') then raise exception 'Sprint 5 requires completed ACT 1-5.';end if;
 if exists(select 1 from public.s5_run_state where run_id=g.run_id) then raise exception 'Sprint 5 is already initialized.';end if;
 insert into public.s5_run_state(run_id)values(g.run_id);insert into public.s5_rounds(run_id,phase_key,vote_round,topic_text_key)values(g.run_id,'act6_vote',1,'act06.001');perform public.s5_set_scene(g.run_id,'act6_portrait','act6_vote','round_1','ACTION_SCREEN','act06.001');
 perform public.s2_log_event(g.run_id,r,null,'s5_initialized',null,jsonb_build_object('event_source','server','behavior_scoring',false));return jsonb_build_object('ok',true,'run_id',g.run_id);end$$;

create function public.s5_submit_vote(p_room_code text,p_session_token text,p_expected_discussion_session_id uuid,p_expected_vote_round int,p_client_request_id uuid,p_choice_id text) returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s5_run_state%rowtype;round public.s5_rounds%rowtype;prior public.s5_votes%rowtype;n int;winner text;distinct_n int;allowed text[];
begin p:=public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);perform 1 from public.game_runs where run_id=g.run_id for update;select * into s from public.s5_run_state where run_id=g.run_id for update;
 select * into prior from public.s5_votes where run_id=g.run_id and player_id=p.player_id and client_request_id=p_client_request_id;if found then if prior.choice_id<>p_choice_id then raise exception 'Vote request identity was reused with different content.';end if;return jsonb_build_object('ok',true,'idempotent_replay',true,'choice_id',prior.choice_id);end if;
 select * into round from public.s5_rounds where discussion_session_id=p_expected_discussion_session_id and run_id=g.run_id and phase_key=s.phase_key and vote_round=p_expected_vote_round for update;if not found or round.status<>'discussion' or s.vote_round<>p_expected_vote_round then raise exception 'Stale Sprint 5 discussion identity.';end if;
 if s.phase_key='act6_vote' then allowed:=array['escape','1897','time_stopped','trapped'];elsif s.phase_key='act7_vote' then allowed:=array['clock_a','clock_b','clock_c'];elsif s.phase_key='act8_final_vote' then allowed:=array['main_gate','west_tower'];else raise exception 'No group vote is open.';end if;
 if not(p_choice_id=any(allowed))then raise exception 'Invalid vote option.';end if;
 insert into public.s5_votes(run_id,phase_key,vote_round,player_id,choice_id,client_request_id)values(g.run_id,s.phase_key,s.vote_round,p.player_id,p_choice_id,p_client_request_id);
 perform public.s2_log_event(g.run_id,r,null,'s5_vote_locked',p.player_id,jsonb_build_object('phase_key',s.phase_key,'vote_round',s.vote_round,'choice_id',p_choice_id,'behavior_scoring',false));
 select count(*) into n from public.s5_votes where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round;if n<3 then return jsonb_build_object('ok',true,'submitted',n,'resolved',false);end if;
 select count(distinct choice_id) into distinct_n from public.s5_votes where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round;
 select choice_id into winner from public.s5_votes where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round group by choice_id order by count(*) desc,choice_id limit 1;
 if distinct_n=3 then
  if s.phase_key='act6_vote' and s.vote_round>=2 then update public.s5_run_state set act6_resolution='portrait_fixed_fallback',phase_key='act6_answer',updated_at=now()where run_id=g.run_id;perform public.s5_set_scene(g.run_id,'act6_portrait','act6_answer','fallback','CINEMATIC_MESSAGE','act06.006');
  else update public.s5_rounds set status='resolved',resolution_source='tie',resolved_at=now()where discussion_session_id=round.discussion_session_id;update public.s5_run_state set vote_round=vote_round+1,updated_at=now()where run_id=g.run_id;insert into public.s5_rounds(run_id,phase_key,vote_round,topic_text_key)values(g.run_id,s.phase_key,s.vote_round+1,case s.phase_key when'act6_vote'then'act06.001'else'act07.001'end);perform public.s2_log_event(g.run_id,r,round.discussion_session_id,'s5_tie_new_round',null,jsonb_build_object('phase_key',s.phase_key,'previous_round',s.vote_round,'resolution_source','system','behavior_scoring',false));end if;
  return jsonb_build_object('ok',true,'resolved',false,'tie',true);
 end if;
 update public.s5_rounds set status='resolved',resolution_source='player_majority',resolved_at=now()where discussion_session_id=round.discussion_session_id;
 if s.phase_key='act6_vote' then update public.s5_run_state set act6_resolution=winner,phase_key='act6_answer',updated_at=now()where run_id=g.run_id;perform public.s5_set_scene(g.run_id,'act6_portrait','act6_answer',winner,'CINEMATIC_MESSAGE',case winner when'escape'then'act06.007'when'1897'then'act06.008'when'time_stopped'then'act06.009'else'act06.010'end);
 elsif s.phase_key='act7_vote' and winner='clock_c' then update public.s5_run_state set phase_key='act7_solved',updated_at=now()where run_id=g.run_id;perform public.s5_set_scene(g.run_id,'act7_clock_room','act7_solved','clock_c','CINEMATIC_MESSAGE','act07.010');
 elsif s.phase_key='act7_vote' then update public.s5_rounds set status='resolved',resolution_source='wrong_majority',resolved_at=now()where discussion_session_id=round.discussion_session_id;update public.s5_run_state set act7_wrong_attempts=act7_wrong_attempts+1,vote_round=vote_round+1,updated_at=now()where run_id=g.run_id;insert into public.s5_rounds(run_id,phase_key,vote_round,topic_text_key)values(g.run_id,'act7_vote',s.vote_round+1,'act07.001');perform public.s2_log_event(g.run_id,r,round.discussion_session_id,'clock_wrong_attempt',null,jsonb_build_object('choice_id',winner,'attempt',s.act7_wrong_attempts+1,'behavior_scoring',false));
 else update public.s5_run_state set route_taken_act8=winner,phase_key='act8_route',updated_at=now()where run_id=g.run_id;perform public.s5_set_scene(g.run_id,'act8_route','act8_route',winner,'CINEMATIC_MESSAGE',case winner when'main_gate'then'act08.005'else'act08.010'end);end if;
 return jsonb_build_object('ok',true,'resolved',true,'choice_id',winner);exception when unique_violation then raise exception 'Your vote for this round is already locked.';end$$;

create function public.s5_advance(p_room_code text,p_session_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s5_run_state%rowtype;
begin p:=public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);perform 1 from public.game_runs where run_id=g.run_id for update;select * into s from public.s5_run_state where run_id=g.run_id for update;
 if s.phase_key='act6_answer' then update public.s5_run_state set act_no=7,phase_key='act7_vote',vote_round=1,updated_at=now()where run_id=g.run_id;insert into public.s5_rounds(run_id,phase_key,vote_round,topic_text_key)values(g.run_id,'act7_vote',1,'act07.001');perform public.s5_set_scene(g.run_id,'act7_clock_room','act7_vote','round_1','ACTION_SCREEN','act07.001');
 elsif s.phase_key='act7_solved' then update public.s5_run_state set act_no=8,phase_key='act8_private',vote_round=1,updated_at=now()where run_id=g.run_id;perform public.s5_set_scene(g.run_id,'act8_route','act8_private','initial','ACTION_SCREEN','act08.001');
 elsif s.phase_key='act8_route' then update public.s5_run_state set phase_key='complete',completed_at=now(),updated_at=now()where run_id=g.run_id;perform public.s5_set_scene(g.run_id,'act9_great_hall','sprint5_complete',s.route_taken_act8,'CINEMATIC_MESSAGE',case s.route_taken_act8 when'main_gate'then'act08.009'else'act08.013'end);
 else raise exception 'No deterministic transition is available.';end if;return jsonb_build_object('ok',true);end$$;

create function public.s5_submit_private_choice(p_room_code text,p_session_token text,p_client_request_id uuid,p_choice_id text) returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s5_run_state%rowtype;prior public.s5_act8_private_choices%rowtype;n int;d int;route text;
begin p:=public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);perform 1 from public.game_runs where run_id=g.run_id for update;select * into s from public.s5_run_state where run_id=g.run_id for update;select * into prior from public.s5_act8_private_choices where run_id=g.run_id and player_id=p.player_id and client_request_id=p_client_request_id;if found then if prior.choice_id<>p_choice_id then raise exception'Private-choice request identity was reused with different content.';end if;return jsonb_build_object('ok',true,'idempotent_replay',true,'choice_id',prior.choice_id);end if;if s.phase_key<>'act8_private'then raise exception'ACT 8 private choice is unavailable.';end if;
 if p_choice_id not in('main_gate','west_tower','compare','follow_group')then raise exception'Invalid ACT 8 private choice.';end if;
 insert into public.s5_act8_private_choices(run_id,player_id,choice_id,client_request_id)values(g.run_id,p.player_id,p_choice_id,p_client_request_id);perform public.s2_log_event(g.run_id,r,null,'act8_private_choice_locked',p.player_id,jsonb_build_object('choice_id',p_choice_id,'behavior_scoring',true));
 select count(*),count(distinct choice_id)into n,d from public.s5_act8_private_choices where run_id=g.run_id;if n=3 then select min(choice_id)into route from public.s5_act8_private_choices where run_id=g.run_id;if d=1 and route in('main_gate','west_tower')then update public.s5_run_state set route_taken_act8=route,phase_key='act8_route'where run_id=g.run_id;perform public.s5_set_scene(g.run_id,'act8_route','act8_route',route,'CINEMATIC_MESSAGE',case route when'main_gate'then'act08.005'else'act08.010'end);else update public.s5_run_state set phase_key='act8_final_vote',vote_round=1 where run_id=g.run_id;insert into public.s5_rounds(run_id,phase_key,vote_round,topic_text_key)values(g.run_id,'act8_final_vote',1,'act08.001');perform public.s5_set_scene(g.run_id,'act8_route','act8_final_vote','round_1','ACTION_SCREEN','act08.001');end if;end if;return jsonb_build_object('ok',true,'submitted',n);exception when unique_violation then raise exception'ACT 8 private choice is already locked.';end$$;

create function public.s5_get_player_state(p_room_code text,p_session_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s5_run_state%rowtype;mine jsonb;votes int;revealed jsonb:='[]';
begin p:=public.s1_get_player_by_session(r,p_session_token);g:=public.s2_get_active_run(r);select * into s from public.s5_run_state where run_id=g.run_id;if not found then return jsonb_build_object('active',false);end if;
 select jsonb_build_object('choice_id',choice_id,'locked_at',locked_at)into mine from public.s5_act8_private_choices where run_id=g.run_id and player_id=p.player_id;select count(*)into votes from public.s5_votes where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round;
 if (select count(*) from public.s5_act8_private_choices where run_id=g.run_id)=3 then select coalesce(jsonb_agg(jsonb_build_object('role_slot',rp.role_slot,'choice_id',c.choice_id)order by rp.role_slot),'[]')into revealed from public.s5_act8_private_choices c join public.s1_room_players rp using(player_id)where c.run_id=g.run_id;end if;
 return jsonb_build_object('active',true,'state',to_jsonb(s),'discussion',(select jsonb_build_object('discussion_session_id',discussion_session_id,'vote_round',vote_round,'topic_text_key',topic_text_key)from public.s5_rounds where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round and status='discussion'),'my_private_choice',mine,'private_choices_revealed',revealed,'submitted_vote_count',votes,'my_vote',(select jsonb_build_object('choice_id',choice_id)from public.s5_votes where run_id=g.run_id and phase_key=s.phase_key and vote_round=s.vote_round and player_id=p.player_id));end$$;

revoke execute on function public.s5_initialize(text,text),public.s5_submit_vote(text,text,uuid,integer,uuid,text),public.s5_advance(text,text),public.s5_submit_private_choice(text,text,uuid,text),public.s5_get_player_state(text,text) from public;
grant execute on function public.s5_initialize(text,text) to anon,authenticated;
grant execute on function public.s5_submit_vote(text,text,uuid,integer,uuid,text),public.s5_advance(text,text),public.s5_submit_private_choice(text,text,uuid,text),public.s5_get_player_state(text,text) to anon,authenticated;
