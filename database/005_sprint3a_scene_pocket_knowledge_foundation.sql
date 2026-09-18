-- Sprint 3A: scene, pocket, observation, photo, group-item and knowledge foundation.
-- Apply after 004_sprint2_fallback_resolution_semantics.sql.

create table if not exists public.s3_runtime_scene_state (
  run_id uuid primary key references public.game_runs(run_id),
  scene_id text not null,
  phase_key text not null,
  step_key text not null default '',
  display_mode text not null check (display_mode in ('CINEMATIC_MESSAGE','CRITICAL_INFO','ACTION_SCREEN')),
  text_key text not null,
  current_route_target text,
  wayfinding_target text,
  updated_at timestamptz not null default now()
);

create table if not exists public.s3_item_catalog (
  item_key text primary key,
  name_text_key text not null,
  shareable_views jsonb not null default '[]'::jsonb check (jsonb_typeof(shareable_views) = 'array')
);

create table if not exists public.s3_observation_catalog (
  observation_key text primary key,
  display_text_key text not null
);

create table if not exists public.s3_knowledge_catalog (
  knowledge_key text primary key
);

create table if not exists public.s3_player_items (
  run_id uuid not null references public.game_runs(run_id),
  item_key text not null references public.s3_item_catalog(item_key),
  physical_owner_id uuid not null references public.s1_room_players(player_id),
  acquired_at timestamptz not null default now(),
  primary key (run_id, item_key)
);

create table if not exists public.s3_player_observations (
  run_id uuid not null references public.game_runs(run_id),
  player_id uuid not null references public.s1_room_players(player_id),
  observation_key text not null references public.s3_observation_catalog(observation_key),
  display_text_key text not null,
  discovered_at_scene text not null,
  discovered_at timestamptz not null default now(),
  primary key (run_id, player_id, observation_key)
);

create table if not exists public.s3_player_knowledge (
  acquisition_id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.game_runs(run_id),
  player_id uuid not null references public.s1_room_players(player_id),
  knowledge_key text not null references public.s3_knowledge_catalog(knowledge_key),
  source text not null check (source in ('direct_observation','private_system_message','pocket_inspection','shared_photo','chat_from_player','group_item')),
  scene_id text not null,
  source_player_id uuid references public.s1_room_players(player_id),
  source_item_key text references public.s3_item_catalog(item_key),
  delivered_at timestamptz not null default now()
);

create unique index if not exists s3_knowledge_provenance_identity
  on public.s3_player_knowledge (
    run_id, player_id, knowledge_key, source, scene_id,
    coalesce(source_player_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(source_item_key, '')
  );

create table if not exists public.s3_shared_photos (
  photo_copy_id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.game_runs(run_id),
  received_by uuid not null references public.s1_room_players(player_id),
  shared_by uuid not null references public.s1_room_players(player_id),
  source_item_key text not null references public.s3_item_catalog(item_key),
  source_view text not null,
  label_text_key text not null,
  shared_at timestamptz not null default now(),
  unique (run_id, received_by, shared_by, source_item_key, source_view)
);

create table if not exists public.s3_group_items (
  run_id uuid not null references public.game_runs(run_id),
  item_key text not null references public.s3_item_catalog(item_key),
  label_text_key text not null,
  acquired_at timestamptz not null default now(),
  primary key (run_id, item_key)
);

alter table public.s3_runtime_scene_state enable row level security;
alter table public.s3_item_catalog enable row level security;
alter table public.s3_observation_catalog enable row level security;
alter table public.s3_knowledge_catalog enable row level security;
alter table public.s3_player_items enable row level security;
alter table public.s3_player_observations enable row level security;
alter table public.s3_player_knowledge enable row level security;
alter table public.s3_shared_photos enable row level security;
alter table public.s3_group_items enable row level security;

insert into public.s3_item_catalog(item_key, name_text_key, shareable_views) values
  ('fixture.physical_item', 'common.004', '["front"]'::jsonb),
  ('fixture.group_item', 'common.005', '[]'::jsonb)
on conflict (item_key) do update set
  name_text_key = excluded.name_text_key,
  shareable_views = excluded.shareable_views;

insert into public.s3_observation_catalog(observation_key, display_text_key) values
  ('fixture.private_observation', 'common.001')
on conflict (observation_key) do update set display_text_key = excluded.display_text_key;

insert into public.s3_knowledge_catalog(knowledge_key) values
  ('fixture.direct_knowledge'), ('fixture.photo_knowledge')
on conflict do nothing;

create or replace function public.s3_record_observation(
  p_run_id uuid, p_player_id uuid, p_observation_key text, p_scene_id text
) returns void
language plpgsql security definer set search_path = public as $$
declare v_text_key text;
begin
  select display_text_key into strict v_text_key
  from public.s3_observation_catalog where observation_key = p_observation_key;
  insert into public.s3_player_observations(
    run_id, player_id, observation_key, display_text_key, discovered_at_scene
  ) values (p_run_id, p_player_id, p_observation_key, v_text_key, p_scene_id)
  on conflict (run_id, player_id, observation_key) do nothing;
exception when no_data_found then raise exception 'Invalid observation identity.';
end;
$$;

create or replace function public.s3_record_knowledge(
  p_run_id uuid, p_player_id uuid, p_knowledge_key text, p_source text,
  p_scene_id text, p_source_player_id uuid default null, p_source_item_key text default null
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_source not in ('direct_observation','private_system_message','pocket_inspection','shared_photo','chat_from_player','group_item') then
    raise exception 'Invalid knowledge source.';
  end if;
  if not exists (select 1 from public.s3_knowledge_catalog where knowledge_key = p_knowledge_key) then
    raise exception 'Invalid knowledge identity.';
  end if;
  if p_source = 'chat_from_player' and p_source_player_id is null then
    raise exception 'chat_from_player requires source_player_id.';
  end if;
  if p_source in ('pocket_inspection','shared_photo','group_item') and p_source_item_key is null then
    raise exception 'This knowledge source requires source_item_key.';
  end if;
  insert into public.s3_player_knowledge(
    run_id, player_id, knowledge_key, source, scene_id, source_player_id, source_item_key
  ) values (
    p_run_id, p_player_id, p_knowledge_key, p_source, p_scene_id, p_source_player_id, p_source_item_key
  ) on conflict do nothing;
end;
$$;

create or replace function public.s3_initialize_audit_fixture(
  p_room_code text, p_teacher_token text
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_room text := upper(trim(p_room_code));
  v_run public.game_runs%rowtype;
  v_gitte uuid;
begin
  perform public.s1_assert_teacher(v_room, p_teacher_token);
  v_run := public.s2_get_active_run(v_room);
  if v_run.run_id is null then raise exception 'No active formal run.'; end if;
  if v_run.run_mode <> 'audit' then raise exception 'Sprint 3A fixture is restricted to AUDIT runs.'; end if;
  select player_id into strict v_gitte from public.s1_room_players
  where room_code = v_room and role_slot = 'GAL-A';

  insert into public.s3_runtime_scene_state(
    run_id, scene_id, phase_key, step_key, display_mode, text_key, current_route_target, wayfinding_target
  ) values (
    v_run.run_id, 's3a-foundation-fixture', 'foundation', 'initial', 'ACTION_SCREEN', 'common.001', null, null
  ) on conflict (run_id) do update set
    scene_id=excluded.scene_id, phase_key=excluded.phase_key, step_key=excluded.step_key,
    display_mode=excluded.display_mode, text_key=excluded.text_key, updated_at=now();

  insert into public.s3_player_items(run_id,item_key,physical_owner_id)
  values (v_run.run_id,'fixture.physical_item',v_gitte) on conflict do nothing;
  insert into public.s3_group_items(run_id,item_key,label_text_key)
  values (v_run.run_id,'fixture.group_item','common.005') on conflict do nothing;
  perform public.s3_record_observation(v_run.run_id,v_gitte,'fixture.private_observation','s3a-foundation-fixture');
  perform public.s3_record_knowledge(v_run.run_id,v_gitte,'fixture.direct_knowledge','direct_observation','s3a-foundation-fixture');
  perform public.s3_record_knowledge(v_run.run_id,v_gitte,'fixture.direct_knowledge','pocket_inspection','s3a-foundation-fixture',null,'fixture.physical_item');
  perform public.s2_log_event(v_run.run_id,v_room,null,'s3a_audit_fixture_initialized',null,
    jsonb_build_object('fixture',true,'behavior_data',false));
  return jsonb_build_object('ok',true,'run_id',v_run.run_id);
end;
$$;

create or replace function public.s3_share_photo(
  p_room_code text, p_session_token text, p_recipient_role text,
  p_source_item_key text, p_source_view text
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_room text := upper(trim(p_room_code));
  v_sender public.s1_room_players%rowtype;
  v_recipient uuid;
  v_run public.game_runs%rowtype;
  v_label_key text;
  v_copy uuid;
begin
  v_sender := public.s1_get_player_by_session(v_room,p_session_token);
  v_run := public.s2_get_active_run(v_room);
  if v_run.run_id is null then raise exception 'No active formal run.'; end if;
  if not exists (select 1 from public.s3_player_items where run_id=v_run.run_id and item_key=p_source_item_key and physical_owner_id=v_sender.player_id) then
    raise exception 'Sender is not the physical owner of this item.';
  end if;
  select name_text_key into v_label_key from public.s3_item_catalog
  where item_key=p_source_item_key and shareable_views ? p_source_view;
  if not found then raise exception 'Invalid or non-shareable item view.'; end if;
  select player_id into v_recipient from public.s1_room_players
  where room_code=v_room and role_slot=upper(trim(p_recipient_role));
  if v_recipient is null or v_recipient=v_sender.player_id then raise exception 'Invalid photo recipient.'; end if;
  insert into public.s3_shared_photos(run_id,received_by,shared_by,source_item_key,source_view,label_text_key)
  values(v_run.run_id,v_recipient,v_sender.player_id,p_source_item_key,p_source_view,v_label_key)
  on conflict (run_id,received_by,shared_by,source_item_key,source_view) do update set shared_at=public.s3_shared_photos.shared_at
  returning photo_copy_id into v_copy;
  perform public.s2_log_event(v_run.run_id,v_room,null,'s3a_photo_shared',v_sender.player_id,
    jsonb_build_object('received_by',v_recipient,'source_item',p_source_item_key,'source_view',p_source_view));
  return jsonb_build_object('ok',true,'photo_copy_id',v_copy);
end;
$$;

create or replace function public.s3_get_player_state(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  if v_run.run_id is null then return jsonb_build_object('active',false); end if;
  return jsonb_build_object('active',true,'run_id',v_run.run_id,
    'scene',(select to_jsonb(s) from public.s3_runtime_scene_state s where s.run_id=v_run.run_id),
    'items',(select coalesce(jsonb_agg(jsonb_build_object('item_key',i.item_key,'name_text_key',c.name_text_key)),'[]') from public.s3_player_items i join public.s3_item_catalog c using(item_key) where i.run_id=v_run.run_id and i.physical_owner_id=v_player.player_id),
    'observations',(select coalesce(jsonb_agg(to_jsonb(o)-'run_id'-'player_id'),'[]') from public.s3_player_observations o where o.run_id=v_run.run_id and o.player_id=v_player.player_id),
    'shared_photos',(select coalesce(jsonb_agg(to_jsonb(p)-'run_id'-'received_by'),'[]') from public.s3_shared_photos p where p.run_id=v_run.run_id and p.received_by=v_player.player_id),
    'group_items',(select coalesce(jsonb_agg(to_jsonb(g)-'run_id'),'[]') from public.s3_group_items g where g.run_id=v_run.run_id),
    'knowledge',(select coalesce(jsonb_agg(to_jsonb(k)-'run_id'-'player_id'),'[]') from public.s3_player_knowledge k where k.run_id=v_run.run_id and k.player_id=v_player.player_id));
end; $$;

create or replace function public.s3_get_teacher_state(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_run public.game_runs%rowtype;
begin
  perform public.s1_assert_teacher(v_room,p_teacher_token); v_run:=public.s2_get_active_run(v_room);
  if v_run.run_id is null then return jsonb_build_object('active',false); end if;
  return jsonb_build_object('active',true,'run_id',v_run.run_id,'run_mode',v_run.run_mode,
    'scene',(select jsonb_build_object('scene_id',scene_id,'phase_key',phase_key,'step_key',step_key,'display_mode',display_mode,'text_key',text_key) from public.s3_runtime_scene_state where run_id=v_run.run_id),
    'counts',jsonb_build_object(
      'physical_items',(select count(*) from public.s3_player_items where run_id=v_run.run_id),
      'observations',(select count(*) from public.s3_player_observations where run_id=v_run.run_id),
      'shared_photos',(select count(*) from public.s3_shared_photos where run_id=v_run.run_id),
      'group_items',(select count(*) from public.s3_group_items where run_id=v_run.run_id),
      'knowledge_acquisitions',(select count(*) from public.s3_player_knowledge where run_id=v_run.run_id)));
end; $$;

revoke execute on function public.s3_record_observation(uuid,uuid,text,text) from public,anon,authenticated;
revoke execute on function public.s3_record_knowledge(uuid,uuid,text,text,text,uuid,text) from public,anon,authenticated;
revoke execute on function public.s3_initialize_audit_fixture(text,text) from public;
revoke execute on function public.s3_share_photo(text,text,text,text,text) from public;
revoke execute on function public.s3_get_player_state(text,text) from public;
revoke execute on function public.s3_get_teacher_state(text,text) from public;
grant execute on function public.s3_initialize_audit_fixture(text,text) to anon,authenticated;
grant execute on function public.s3_share_photo(text,text,text,text,text) to anon,authenticated;
grant execute on function public.s3_get_player_state(text,text) to anon,authenticated;
grant execute on function public.s3_get_teacher_state(text,text) to anon,authenticated;
