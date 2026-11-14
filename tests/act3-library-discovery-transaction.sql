\set ON_ERROR_STOP on
begin;
create temporary table act3_fixture(k text primary key,v jsonb)on commit drop;

select public.s1_create_room('A3DISC76','teacher-a3','join-g','join-a','join-l');
insert into act3_fixture values('g',public.s1_join_player('A3DISC76','join-g')),
 ('a',public.s1_join_player('A3DISC76','join-a')),('l',public.s1_join_player('A3DISC76','join-l')),
 ('started',public.s9_start_formal_game('A3DISC76','teacher-a3','normal'));
select public.s3b_initialize_flow('A3DISC76','teacher-a3');

do $$
declare run_id uuid;g_token text;a_token text;l_token text;request_id uuid:=gen_random_uuid();result jsonb;state jsonb;
begin
  select (v->>'run_id')::uuid into run_id from act3_fixture where k='started';
  select v->>'session_token' into g_token from act3_fixture where k='g';
  select v->>'session_token' into a_token from act3_fixture where k='a';
  select v->>'session_token' into l_token from act3_fixture where k='l';
  update public.s3b_run_state set party_physically_reunited=true,puzzle_deadline=now()+interval'90 seconds' where s3b_run_state.run_id=run_id;
  perform public.s3b_set_scene(run_id,'act3_library','library_box','enter_code','ACTION_SCREEN','act03.009');
  result:=public.s3b_submit_library_code('A3DISC76',g_token,request_id,'41739');
  if not(result->>'correct')::boolean then raise exception'Direct success was not correct';end if;
  if (select count(*) from public.s3_group_items where s3_group_items.run_id=run_id and item_key in('library_photo_1897','library_torn_note'))<>2 then raise exception'Two discoveries missing';end if;
  if not exists(select 1 from public.s3_runtime_scene_state where s3_runtime_scene_state.run_id=run_id and phase_key='library_discovery'and step_key='box_opened')then raise exception'Discovery phase missing';end if;
  result:=public.s3b_submit_library_code('A3DISC76',g_token,request_id,'41739');
  if not(result->>'idempotent_replay')::boolean then raise exception'Lost-response retry was not idempotent';end if;
  perform public.s3b_ack_library_discovery('A3DISC76',g_token,run_id);
  perform public.s3b_ack_library_discovery('A3DISC76',g_token,run_id);
  state:=public.s3b_get_player_state('A3DISC76',g_token);
  if state#>>'{scene,phase_key}'<>'library_discovery'or(state#>>'{me,library_discovery_ack_at}')is null then raise exception'Reconnect projection lost discovery acknowledgement';end if;
  perform public.s3b_ack_library_discovery('A3DISC76',a_token,run_id);
  if not exists(select 1 from public.s3_runtime_scene_state where s3_runtime_scene_state.run_id=run_id and phase_key='library_discovery')then raise exception'ACT4 advanced before all Players acknowledged';end if;
  result:=public.s3b_ack_library_discovery('A3DISC76',l_token,run_id);
  if not(result->>'advanced_to_act4')::boolean then raise exception'Third acknowledgement did not advance';end if;
  if not exists(select 1 from public.s3_runtime_scene_state where s3_runtime_scene_state.run_id=run_id and scene_id='act4_known_unknown'and phase_key='private_route_choice')then raise exception'ACT4 handoff missing';end if;
end$$;

select public.s1_create_room('A3FALL76','teacher-f3','join-g','join-a','join-l');
insert into act3_fixture values('fg',public.s1_join_player('A3FALL76','join-g')),
 ('fa',public.s1_join_player('A3FALL76','join-a')),('fl',public.s1_join_player('A3FALL76','join-l')),
 ('fallback_started',public.s9_start_formal_game('A3FALL76','teacher-f3','normal'));
select public.s3b_initialize_flow('A3FALL76','teacher-f3');
do $$
declare run_id uuid;
begin
  select (v->>'run_id')::uuid into run_id from act3_fixture where k='fallback_started';
  update public.s3b_run_state set party_physically_reunited=true,puzzle_hint_stage=7,puzzle_deadline=now()-interval'61 seconds'where s3b_run_state.run_id=run_id;
  perform public.s3b_set_scene(run_id,'act3_library','library_box','enter_code','ACTION_SCREEN','act03.009');
  perform public.s3b_refresh_puzzle(run_id);
  if not exists(select 1 from public.s3_runtime_scene_state where s3_runtime_scene_state.run_id=run_id and phase_key='library_discovery')then raise exception'Fallback did not enter discovery';end if;
  if (select count(*) from public.s3_group_items where s3_group_items.run_id=run_id and item_key in('library_photo_1897','library_torn_note'))<>2 then raise exception'Fallback discoveries missing';end if;
end$$;

select 'ACT3_LIBRARY_DISCOVERY_TRANSACTION_PASS' result;
rollback;
