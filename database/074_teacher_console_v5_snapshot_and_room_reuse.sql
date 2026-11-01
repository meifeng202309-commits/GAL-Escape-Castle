-- Teacher Console V5: any-time research snapshot export and non-destructive
-- run isolation for reusing one durable room identity.
-- Migrations 001-073 are deployed immutable history.
begin;

alter table public.s1_rooms
  add column session_generation uuid not null default gen_random_uuid();

alter table public.s1_room_players
  add column session_generation uuid;

-- Preserve sessions that are live when this additive migration is installed.
-- A later prepare-next-run call rotates the room generation and invalidates them.
update public.s1_room_players p
set session_generation=r.session_generation
from public.s1_rooms r
where r.room_code=p.room_code
  and p.session_token_hash is not null
  and p.session_generation is null;

alter table public.game_runs drop constraint if exists game_runs_status_check;
alter table public.game_runs
  add constraint game_runs_status_check check(status in('active','completed','interrupted')),
  add column interrupted_at timestamptz,
  add column interruption_reason text;

create or replace function public.s1_join_player(p_room_code text,p_join_code text)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  room text:=upper(trim(p_room_code));
  player public.s1_room_players%rowtype;
  generation uuid;
  token text:=gen_random_uuid()::text;
begin
  if room=''or trim(coalesce(p_join_code,''))=''then raise exception 'Room code and join code are required.';end if;
  select session_generation into generation from public.s1_rooms where room_code=room for key share;
  if not found then raise exception 'Invalid room code or join code.';end if;
  select * into player from public.s1_room_players
    where room_code=room and join_code_hash=public.s1_hash_token(p_join_code) for update;
  if not found then raise exception 'Invalid room code or join code.';end if;
  if player.session_token_hash is not null then
    raise exception 'This role is already claimed. Reopen the original browser session, or ask the teacher to release this player session.';
  end if;
  update public.s1_room_players set
    session_token_hash=public.s1_hash_token(token),session_generation=generation,
    joined_at=clock_timestamp(),last_seen_at=clock_timestamp()
    where player_id=player.player_id;
  insert into public.s1_game_events(room_code,event_type,actor_player_id,details)
    values(room,'player_joined',player.player_id,jsonb_build_object('role_slot',player.role_slot,'session_generation',generation));
  return jsonb_build_object('room_code',room,'player_id',player.player_id,'role_slot',player.role_slot,
    'display_name',player.display_name,'session_token',token,'session_generation',generation);
end;
$$;

create or replace function public.s1_get_player_by_session(p_room_code text,p_session_token text)
returns public.s1_room_players
language plpgsql
security definer
set search_path=public
as $$
declare player public.s1_room_players%rowtype;
begin
  select p.* into player from public.s1_room_players p
  join public.s1_rooms r on r.room_code=p.room_code
  where p.room_code=upper(trim(p_room_code))
    and p.session_token_hash=public.s1_hash_token(p_session_token)
    and p.session_generation is not null
    and p.session_generation=r.session_generation;
  if not found then raise exception 'Invalid or expired player session.';end if;
  update public.s1_room_players set last_seen_at=clock_timestamp() where player_id=player.player_id;
  return player;
end;
$$;

create table public.s10_teacher_exports(
  export_id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.game_runs(run_id),
  room_code text not null references public.s1_rooms(room_code) on delete cascade,
  export_kind text not null check(export_kind in('in_progress_snapshot','final_snapshot')),
  exported_at timestamptz not null default clock_timestamp()
);

create index s10_teacher_exports_run_exported_idx
  on public.s10_teacher_exports(run_id,exported_at desc);
create index s10_teacher_exports_room_exported_idx
  on public.s10_teacher_exports(room_code,exported_at desc);

alter table public.s10_teacher_exports enable row level security;
revoke all on table public.s10_teacher_exports from public,anon,authenticated;

create function public.s10_export_session_snapshot(
  p_room_code text,
  p_teacher_token text,
  p_run_id uuid default null
) returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  room text:=upper(trim(p_room_code));
  g public.game_runs%rowtype;
  exported timestamptz:=clock_timestamp();
  kind text;
  stamp text;
  suffix text;
  doc jsonb;
  csv text;
  eid uuid;
begin
  perform public.s1_assert_teacher(room,p_teacher_token);

  if p_run_id is not null then
    select * into g from public.game_runs
      where run_id=p_run_id and room_code=room;
  else
    select * into g from public.game_runs
      where room_code=room
      order by(status='active')desc,run_started_at desc
      limit 1;
  end if;
  if not found then raise exception 'No formal session is available to export.';end if;

  kind:=case when g.status='completed'and g.game_completed and g.export_ready and g.session_integrity_verified
    then'final_snapshot'else'in_progress_snapshot'end;
  stamp:=to_char(g.run_started_at at time zone'UTC','YYYY-MM-DD_HH24-MI-SS');
  suffix:=case when g.run_mode='audit'then'_audit'else''end;

  -- One SELECT supplies the research document from one statement snapshot. It
  -- deliberately excludes room/join/session token hashes and Teacher secrets.
  select jsonb_build_object(
    'header',jsonb_build_object(
      'run_id',g.run_id,'room_code',g.room_code,'run_started_at',g.run_started_at,
      'run_mode',g.run_mode,'behavior_dataset_eligible',g.behavior_dataset_eligible,
      'export_schema_version','2.0-snapshot','snapshot_type',kind,
      'snapshot_consistency','single_statement_database_snapshot','exported_at',exported,
      'game_completed',g.game_completed,'session_integrity_verified',g.session_integrity_verified,
      'restorable',false,
      'local_file_confirmation_scope','teacher_attestation_only_not_backup_validation'),
    'current_state',jsonb_build_object(
      'run',to_jsonb(g)-'active_override_id',
      'scene',(select to_jsonb(x)from public.s3_runtime_scene_state x where x.run_id=g.run_id),
      'acts1_5',(select to_jsonb(x)from public.s3b_run_state x where x.run_id=g.run_id),
      'acts6_8',(select to_jsonb(x)from public.s5_run_state x where x.run_id=g.run_id),
      'acts9_14',(select to_jsonb(x)from public.s6_run_state x where x.run_id=g.run_id),
      'finalization',(select to_jsonb(x)from public.s8_finalizations x where x.run_id=g.run_id)),
    'legacy_room_history',jsonb_build_object(
      'scope','room_history_not_current_run_evidence',
      'room_state',(select to_jsonb(x)from public.s1_room_state x where x.room_code=room),
      'decisions',(select coalesce(jsonb_agg(to_jsonb(x)order by x.locked_at,x.decision_id),'[]')from public.s1_player_decisions x where x.room_code=room),
      'events',(select coalesce(jsonb_agg(to_jsonb(x)order by x.created_at,x.event_id),'[]')from public.s1_game_events x where x.room_code=room)),
    'players',(select coalesce(jsonb_agg(jsonb_build_object(
      'player_id',player_id,'role_slot',role_slot,'display_name',display_name,
      'joined_at',joined_at,'last_seen_at',last_seen_at)order by role_slot),'[]')
      from public.s1_room_players where room_code=room),
    'discussions',(select coalesce(jsonb_agg(to_jsonb(d)order by d.started_at,d.vote_round),'[]')
      from public.discussion_sessions d where d.run_id=g.run_id),
    'discussion_transcript',(select coalesce(jsonb_agg(jsonb_build_object(
      'message_id',m.message_id,'discussion_session_id',m.discussion_session_id,
      'scene_id',m.scene_id,'phase_key',m.phase_key,'step_key',m.step_key,
      'player_id',m.player_id,'display_name',p.display_name,
      'message_text',m.message_text,'created_at',m.created_at)
      order by m.created_at,m.message_id),'[]')
      from public.dialogue_messages m
      left join public.s1_room_players p on p.player_id=m.player_id
      where m.run_id=g.run_id),
    'decisions',jsonb_build_object(
      'runtime',(select coalesce(jsonb_agg(to_jsonb(x)order by x.locked_at,x.decision_id),'[]')from public.runtime_player_decisions x where x.run_id=g.run_id),
      'act5_route_votes',(select coalesce(jsonb_agg(to_jsonb(x)order by x.locked_at,x.vote_id),'[]')from public.s3b_post_inspection_route_votes x where x.run_id=g.run_id),
      'acts6_8_votes',(select coalesce(jsonb_agg(to_jsonb(x)order by x.locked_at),'[]')from public.s5_votes x where x.run_id=g.run_id),
      'acts6_8_rounds',(select coalesce(jsonb_agg(to_jsonb(x)order by x.created_at,x.discussion_session_id),'[]')from public.s5_rounds x where x.run_id=g.run_id),
      'act8_private',(select coalesce(jsonb_agg(to_jsonb(x)order by x.locked_at),'[]')from public.s5_act8_private_choices x where x.run_id=g.run_id),
      'acts9_13',(select coalesce(jsonb_agg(to_jsonb(x)order by x.locked_at),'[]')from public.s6_choices x where x.run_id=g.run_id)),
    'evidence',jsonb_build_object(
      'physical_items',(select coalesce(jsonb_agg(to_jsonb(x)order by x.acquired_at,x.item_key),'[]')from public.s3_player_items x where x.run_id=g.run_id),
      'item_views',(select coalesce(jsonb_agg(to_jsonb(x)order by x.player_id,x.item_key),'[]')from public.s3_player_item_view_state x where x.run_id=g.run_id),
      'observations',(select coalesce(jsonb_agg(to_jsonb(x)order by x.discovered_at,x.observation_key),'[]')from public.s3_player_observations x where x.run_id=g.run_id),
      'knowledge',(select coalesce(jsonb_agg(to_jsonb(x)order by x.delivered_at,x.acquisition_id),'[]')from public.s3_player_knowledge x where x.run_id=g.run_id),
      'player_facts',(select coalesce(jsonb_agg(to_jsonb(x)order by x.discovered_at,x.player_id,x.fact_key),'[]')from public.s3b_player_facts x where x.run_id=g.run_id),
      'shared_photos',(select coalesce(jsonb_agg(to_jsonb(x)order by x.shared_at,x.photo_copy_id),'[]')from public.s3_shared_photos x where x.run_id=g.run_id),
      'group_items',(select coalesce(jsonb_agg(to_jsonb(x)order by x.acquired_at,x.item_key),'[]')from public.s3_group_items x where x.run_id=g.run_id),
      'pocket_inspections',(select coalesce(jsonb_agg(to_jsonb(x)order by x.inspected_at),'[]')from public.s9_pocket_item_inspections x where x.run_id=g.run_id)),
    'operations',jsonb_build_object(
      'player_progress',(select coalesce(jsonb_agg(to_jsonb(x)order by x.player_id),'[]')from public.s3b_player_progress x where x.run_id=g.run_id),
      'library_attempts',(select coalesce(jsonb_agg(to_jsonb(x)order by x.attempt_number),'[]')from public.s3b_library_attempts x where x.run_id=g.run_id),
      'act1_action_receipts',(select coalesce(jsonb_agg(to_jsonb(x)order by x.committed_at,x.player_id),'[]')from public.s3b_action_receipts x where x.run_id=g.run_id),
      'act9_13_action_receipts',(select coalesce(jsonb_agg(to_jsonb(x)order by x.created_at,x.player_id),'[]')from public.s6_action_receipts x where x.run_id=g.run_id),
      'allocations',(select coalesce(jsonb_agg(to_jsonb(x)order by x.locked_at),'[]')from public.s6_allocations x where x.run_id=g.run_id),
      'allocation_attempts',(select coalesce(jsonb_agg(to_jsonb(x)order by x.submitted_at,x.attempt_id),'[]')from public.s6_allocation_attempts x where x.run_id=g.run_id),
      'station_tasks',(select coalesce(jsonb_agg(to_jsonb(x)order by x.completed_at),'[]')from public.s6_station_tasks x where x.run_id=g.run_id),
      'station_b_progress',(select to_jsonb(x)from public.s6_station_b_progress x where x.run_id=g.run_id),
      'engagements',(select coalesce(jsonb_agg(to_jsonb(x)order by x.engaged_at),'[]')from public.s6_engagements x where x.run_id=g.run_id),
      'private_clues',(select coalesce(jsonb_agg(to_jsonb(x)order by x.delivered_at,x.player_id),'[]')from public.s6_private_clues x where x.run_id=g.run_id),
      'audio_occurrences',(select coalesce(jsonb_agg(to_jsonb(x)order by x.triggered_at,x.occurrence_id),'[]')from public.s6_audio_occurrences x where x.run_id=g.run_id),
      'audio_consumptions',(select coalesce(jsonb_agg(to_jsonb(c)order by c.consumed_at,c.player_id),'[]')from public.s6_audio_consumptions c join public.s6_audio_occurrences o using(occurrence_id)where o.run_id=g.run_id)),
    'teacher_overrides',(select coalesce(jsonb_agg(jsonb_build_object(
      'override',to_jsonb(o),'field_validity',(select coalesce(jsonb_agg(to_jsonb(v)),'[]')
        from public.teacher_override_validity v where v.override_id=o.override_id))order by o.created_at),'[]')
      from public.teacher_overrides o where o.run_id=g.run_id),
    'runtime_events',(select coalesce(jsonb_agg(to_jsonb(x)order by x.created_at,x.event_id),'[]')from public.runtime_events x where x.run_id=g.run_id),
    'acts6_13_event_ledger',(select coalesce(jsonb_agg(to_jsonb(x)order by x.occurred_at,x.event_id),'[]')from public.act6_13_event_ledger x where x.run_id=g.run_id)
  ) into doc;

  with rows as(
    select m.created_at ts,'dialogue'::text record_type,m.scene_id,m.phase_key,m.step_key,
      coalesce(p.display_name,m.player_id::text,'') actor,m.message_text payload,0 source_order,m.message_id ordering
    from public.dialogue_messages m left join public.s1_room_players p on p.player_id=m.player_id where m.run_id=g.run_id
    union all
    select e.created_at,'runtime_event',e.scene_id,e.phase_key,e.step_key,
      coalesce(p.display_name,e.actor_player_id::text,''),jsonb_build_object('event_type',e.event_type,'details',e.details)::text,1,e.event_id
    from public.runtime_events e left join public.s1_room_players p on p.player_id=e.actor_player_id where e.run_id=g.run_id
    union all
    select e.occurred_at,'act6_13_event',case when e.act_no is null then null else'act'||e.act_no end,e.phase_key,null,
      coalesce(p.display_name,e.player_id::text,''),jsonb_build_object('event_type',e.event_type,'details',e.details)::text,2,e.event_id
    from public.act6_13_event_ledger e left join public.s1_room_players p on p.player_id=e.player_id where e.run_id=g.run_id
  ) select 'timestamp,record_type,scene_id,phase_key,step_key,actor,payload'||E'\n'||coalesce(string_agg(
    '"'||replace(coalesce(ts::text,''),'"','""')||'","'||replace(record_type,'"','""')||'","'||replace(coalesce(scene_id,''),'"','""')||'","'||replace(coalesce(phase_key,''),'"','""')||'","'||replace(coalesce(step_key,''),'"','""')||'","'||replace(actor,'"','""')||'","'||replace(payload,'"','""')||'"',E'\n'order by ts,source_order,ordering),'') into csv from rows;

  insert into public.s10_teacher_exports(run_id,room_code,export_kind,exported_at)
    values(g.run_id,room,kind,exported)returning export_id into eid;
  insert into public.s1_game_events(room_code,event_type,details)
    values(room,'teacher_session_exported',jsonb_build_object('run_id',g.run_id,'export_id',eid,'export_kind',kind));

  return jsonb_build_object(
    'export_id',eid,'run_id',g.run_id,'snapshot_type',kind,'exported_at',exported,
    'json_filename',stamp||'_'||g.run_id||suffix||case when kind='final_snapshot'then'_final'else'_in_progress'end||'.json',
    'csv_filename',stamp||'_'||g.run_id||suffix||case when kind='final_snapshot'then'_final'else'_in_progress'end||'.csv',
    'json',doc,'csv',csv);
end;
$$;

create function public.s10_prepare_room_for_next_run(
  p_room_code text,
  p_teacher_token text,
  p_expected_run_id uuid
) returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  room text:=upper(trim(p_room_code));
  g public.game_runs%rowtype;
  generation uuid;
begin
  perform public.s1_assert_teacher(room,p_teacher_token);
  select session_generation into generation from public.s1_rooms where room_code=room for update;
  if not found then raise exception 'Room is unavailable.';end if;
  select * into g from public.game_runs where run_id=p_expected_run_id and room_code=room and status='active' for update;
  if not found then raise exception 'Stale or invalid active run identity.';end if;
  update public.game_runs set status='interrupted',interrupted_at=clock_timestamp(),
    interruption_reason='teacher_prepare_next_run',active_override_id=null where run_id=g.run_id;
  generation:=gen_random_uuid();
  update public.s1_rooms set session_generation=generation,updated_at=clock_timestamp()where room_code=room;
  update public.s1_room_players set session_token_hash=null,session_generation=null,joined_at=null,last_seen_at=null where room_code=room;
  insert into public.s1_game_events(room_code,event_type,details)
    values(room,'teacher_room_prepared_for_next_run',jsonb_build_object(
      'interrupted_run_id',g.run_id,'new_session_generation',generation,'rows_deleted',false));
  return jsonb_build_object('ok',true,'room_code',room,'interrupted_run_id',g.run_id,
    'session_generation',generation,'players_released',3,'rows_deleted',false);
end;
$$;

revoke all on function public.s10_export_session_snapshot(text,text,uuid)from public;
revoke all on function public.s10_prepare_room_for_next_run(text,text,uuid)from public;
grant execute on function public.s10_export_session_snapshot(text,text,uuid)to anon,authenticated;
grant execute on function public.s10_prepare_room_for_next_run(text,text,uuid)to anon,authenticated;

commit;
