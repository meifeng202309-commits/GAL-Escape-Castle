-- Sprint 3A audit corrections: current-view integrity and factual provenance.
-- Apply after 005_sprint3a_scene_pocket_knowledge_foundation.sql.

create table if not exists public.s3_player_item_view_state (
  run_id uuid not null references public.game_runs(run_id),
  player_id uuid not null references public.s1_room_players(player_id),
  item_key text not null references public.s3_item_catalog(item_key),
  current_view text not null,
  updated_at timestamptz not null default now(),
  primary key (run_id, player_id, item_key)
);
alter table public.s3_player_item_view_state enable row level security;

update public.s3_item_catalog
set shareable_views='["front","back"]'::jsonb
where item_key='fixture.physical_item';

create or replace function public.s3_record_knowledge(
  p_run_id uuid, p_player_id uuid, p_knowledge_key text, p_source text,
  p_scene_id text, p_source_player_id uuid default null, p_source_item_key text default null
) returns void
language plpgsql security definer set search_path=public as $$
declare v_room text; v_actual_sender uuid;
begin
  select room_code into v_room from public.game_runs where run_id=p_run_id;
  if v_room is null then raise exception 'Invalid run identity.'; end if;
  if not exists(select 1 from public.s1_room_players where player_id=p_player_id and room_code=v_room) then
    raise exception 'Knowledge holder does not belong to this run room.';
  end if;
  if p_source_player_id is not null and not exists(select 1 from public.s1_room_players where player_id=p_source_player_id and room_code=v_room) then
    raise exception 'Knowledge source player does not belong to this run room.';
  end if;
  if not exists(select 1 from public.s3_knowledge_catalog where knowledge_key=p_knowledge_key) then raise exception 'Invalid knowledge identity.'; end if;
  if p_source not in ('direct_observation','private_system_message','pocket_inspection','shared_photo','chat_from_player','group_item') then raise exception 'Invalid knowledge source.'; end if;

  if p_source in ('direct_observation','private_system_message') then
    if p_source_player_id is not null or p_source_item_key is not null then raise exception 'This knowledge source does not accept item or player provenance.'; end if;
  elsif p_source='chat_from_player' then
    if p_source_player_id is null or p_source_item_key is not null then raise exception 'chat_from_player requires only a valid source player.'; end if;
  elsif p_source='pocket_inspection' then
    if p_source_player_id is not null or not exists(select 1 from public.s3_player_items where run_id=p_run_id and physical_owner_id=p_player_id and item_key=p_source_item_key) then
      raise exception 'Pocket provenance requires an item physically owned by the holder.';
    end if;
  elsif p_source='shared_photo' then
    select shared_by into v_actual_sender from public.s3_shared_photos
    where run_id=p_run_id and received_by=p_player_id and source_item_key=p_source_item_key
    order by shared_at desc limit 1;
    if v_actual_sender is null then raise exception 'Shared-photo provenance requires an actual received copy.'; end if;
    if p_source_player_id is not null and p_source_player_id<>v_actual_sender then raise exception 'Shared-photo source player contradicts stored provenance.'; end if;
    p_source_player_id:=v_actual_sender;
  elsif p_source='group_item' then
    if p_source_player_id is not null or not exists(select 1 from public.s3_group_items where run_id=p_run_id and item_key=p_source_item_key) then
      raise exception 'Group-item provenance requires an item present in this run.';
    end if;
  end if;

  insert into public.s3_player_knowledge(run_id,player_id,knowledge_key,source,scene_id,source_player_id,source_item_key)
  values(p_run_id,p_player_id,p_knowledge_key,p_source,p_scene_id,p_source_player_id,p_source_item_key)
  on conflict do nothing;
end; $$;

create or replace function public.s3_set_item_view(
  p_room_code text,p_session_token text,p_item_key text,p_target_view text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype; v_current text;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  if v_run.run_id is null then raise exception 'No active formal run.'; end if;
  if not exists(select 1 from public.s3_player_items where run_id=v_run.run_id and physical_owner_id=v_player.player_id and item_key=p_item_key) then raise exception 'Player does not physically own this item.'; end if;
  if not exists(select 1 from public.s3_item_catalog where item_key=p_item_key and shareable_views ? p_target_view) then raise exception 'Invalid item view.'; end if;
  select current_view into v_current from public.s3_player_item_view_state where run_id=v_run.run_id and player_id=v_player.player_id and item_key=p_item_key for update;
  if v_current is null then raise exception 'Item view state is not initialized.'; end if;
  if v_current=p_target_view then return jsonb_build_object('ok',true,'current_view',v_current); end if;
  if not ((v_current='front' and p_target_view='back') or (v_current='back' and p_target_view='front')) then raise exception 'Invalid item view transition.'; end if;
  update public.s3_player_item_view_state set current_view=p_target_view,updated_at=now() where run_id=v_run.run_id and player_id=v_player.player_id and item_key=p_item_key;
  return jsonb_build_object('ok',true,'current_view',p_target_view);
end; $$;

create or replace function public.s3_share_photo(
  p_room_code text,p_session_token text,p_recipient_role text,p_source_item_key text,p_source_view text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_sender public.s1_room_players%rowtype; v_recipient uuid; v_run public.game_runs%rowtype; v_label text; v_current text; v_copy uuid;
begin
  v_sender:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  if v_run.run_id is null then raise exception 'No active formal run.'; end if;
  if not exists(select 1 from public.s3_player_items where run_id=v_run.run_id and item_key=p_source_item_key and physical_owner_id=v_sender.player_id) then raise exception 'Sender is not the physical owner of this item.'; end if;
  select current_view into v_current from public.s3_player_item_view_state where run_id=v_run.run_id and player_id=v_sender.player_id and item_key=p_source_item_key;
  if v_current is null then raise exception 'Item view state is not initialized.'; end if;
  if p_source_view<>v_current then raise exception 'Only the current server-authoritative item view can be shared.'; end if;
  select name_text_key into v_label from public.s3_item_catalog where item_key=p_source_item_key and shareable_views ? v_current;
  if v_label is null then raise exception 'Current item view is not shareable.'; end if;
  select player_id into v_recipient from public.s1_room_players where room_code=v_room and role_slot=upper(trim(p_recipient_role));
  if v_recipient is null or v_recipient=v_sender.player_id then raise exception 'Invalid photo recipient.'; end if;
  insert into public.s3_shared_photos(run_id,received_by,shared_by,source_item_key,source_view,label_text_key)
  values(v_run.run_id,v_recipient,v_sender.player_id,p_source_item_key,v_current,v_label)
  on conflict(run_id,received_by,shared_by,source_item_key,source_view) do update set shared_at=public.s3_shared_photos.shared_at returning photo_copy_id into v_copy;
  return jsonb_build_object('ok',true,'photo_copy_id',v_copy,'source_view',v_current);
end; $$;

create or replace function public.s3_initialize_audit_fixture(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_run public.game_runs%rowtype; v_gitte uuid;
begin
  perform public.s1_assert_teacher(v_room,p_teacher_token); v_run:=public.s2_get_active_run(v_room);
  if v_run.run_id is null then raise exception 'No active formal run.'; end if;
  if v_run.run_mode<>'audit' then raise exception 'Sprint 3A fixture is restricted to AUDIT runs.'; end if;
  select player_id into strict v_gitte from public.s1_room_players where room_code=v_room and role_slot='GAL-A';
  insert into public.s3_runtime_scene_state(run_id,scene_id,phase_key,step_key,display_mode,text_key)
  values(v_run.run_id,'s3a-foundation-fixture','foundation','initial','ACTION_SCREEN','common.001') on conflict(run_id) do nothing;
  insert into public.s3_player_items(run_id,item_key,physical_owner_id) values(v_run.run_id,'fixture.physical_item',v_gitte) on conflict do nothing;
  insert into public.s3_player_item_view_state(run_id,player_id,item_key,current_view) values(v_run.run_id,v_gitte,'fixture.physical_item','front') on conflict do nothing;
  insert into public.s3_group_items(run_id,item_key,label_text_key) values(v_run.run_id,'fixture.group_item','common.005') on conflict do nothing;
  perform public.s3_record_observation(v_run.run_id,v_gitte,'fixture.private_observation','s3a-foundation-fixture');
  perform public.s3_record_knowledge(v_run.run_id,v_gitte,'fixture.direct_knowledge','direct_observation','s3a-foundation-fixture');
  perform public.s3_record_knowledge(v_run.run_id,v_gitte,'fixture.direct_knowledge','pocket_inspection','s3a-foundation-fixture',null,'fixture.physical_item');
  return jsonb_build_object('ok',true,'run_id',v_run.run_id);
end; $$;

create or replace function public.s3_audit_provenance_probe(p_room_code text,p_teacher_token text,p_case text)
returns void language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_run public.game_runs%rowtype; v_holder uuid; v_foreign uuid;
begin
  perform public.s1_assert_teacher(v_room,p_teacher_token); v_run:=public.s2_get_active_run(v_room);
  if v_run.run_mode<>'audit' then raise exception 'Provenance probe is restricted to AUDIT runs.'; end if;
  select player_id into v_holder from public.s1_room_players where room_code=v_room and role_slot='GAL-A';
  select player_id into v_foreign from public.s1_room_players where room_code<>v_room limit 1;
  if p_case='outside_holder' then perform public.s3_record_knowledge(v_run.run_id,v_foreign,'fixture.direct_knowledge','direct_observation','probe');
  elsif p_case='unowned_item' then perform public.s3_record_knowledge(v_run.run_id,v_holder,'fixture.direct_knowledge','pocket_inspection','probe',null,'fixture.group_item');
  elsif p_case='missing_photo' then perform public.s3_record_knowledge(v_run.run_id,v_holder,'fixture.photo_knowledge','shared_photo','probe',null,'fixture.physical_item');
  elsif p_case='absent_group' then perform public.s3_record_knowledge(v_run.run_id,v_holder,'fixture.direct_knowledge','group_item','probe',null,'fixture.physical_item');
  elsif p_case='cross_room_source' then perform public.s3_record_knowledge(v_run.run_id,v_holder,'fixture.direct_knowledge','chat_from_player','probe',v_foreign,null);
  else raise exception 'Invalid provenance probe case.'; end if;
end; $$;

-- Replace player state only to add reconnectable current_view to owned items.
create or replace function public.s3_get_player_state(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  if v_run.run_id is null then return jsonb_build_object('active',false); end if;
  return jsonb_build_object('active',true,'run_id',v_run.run_id,
    'scene',(select to_jsonb(s) from public.s3_runtime_scene_state s where s.run_id=v_run.run_id),
    'items',(select coalesce(jsonb_agg(jsonb_build_object('item_key',i.item_key,'name_text_key',c.name_text_key,'current_view',v.current_view)),'[]') from public.s3_player_items i join public.s3_item_catalog c using(item_key) left join public.s3_player_item_view_state v on v.run_id=i.run_id and v.player_id=i.physical_owner_id and v.item_key=i.item_key where i.run_id=v_run.run_id and i.physical_owner_id=v_player.player_id),
    'observations',(select coalesce(jsonb_agg(to_jsonb(o)-'run_id'-'player_id'),'[]') from public.s3_player_observations o where o.run_id=v_run.run_id and o.player_id=v_player.player_id),
    'shared_photos',(select coalesce(jsonb_agg(to_jsonb(p)-'run_id'-'received_by'),'[]') from public.s3_shared_photos p where p.run_id=v_run.run_id and p.received_by=v_player.player_id),
    'group_items',(select coalesce(jsonb_agg(to_jsonb(g)-'run_id'),'[]') from public.s3_group_items g where g.run_id=v_run.run_id),
    'knowledge',(select coalesce(jsonb_agg(to_jsonb(k)-'run_id'-'player_id'),'[]') from public.s3_player_knowledge k where k.run_id=v_run.run_id and k.player_id=v_player.player_id));
end; $$;

revoke execute on function public.s3_set_item_view(text,text,text,text) from public;
revoke execute on function public.s3_audit_provenance_probe(text,text,text) from public;
grant execute on function public.s3_set_item_view(text,text,text,text) to anon,authenticated;
grant execute on function public.s3_audit_provenance_probe(text,text,text) to anon,authenticated;
