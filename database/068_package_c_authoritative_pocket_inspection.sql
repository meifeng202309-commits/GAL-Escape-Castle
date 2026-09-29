-- Package C bounded correction: authoritative, reconnectable Pocket inspection.
begin;

create table if not exists public.s9_pocket_item_inspections(
 run_id uuid not null references public.game_runs(run_id),
 player_id uuid not null references public.s1_room_players(player_id),
 item_key text not null references public.s3_item_catalog(item_key),
 inspected_at timestamptz not null default now(),
 primary key(run_id,player_id,item_key)
);
alter table public.s9_pocket_item_inspections enable row level security;

insert into public.s3_knowledge_catalog(knowledge_key) values
 ('gitte_map_routes'),('gitte_number_code'),('gitte_star_symbol'),
 ('anna_snake_rule'),('linda_watch_reminder'),('linda_tower_reason')
on conflict do nothing;

create or replace function public.s9_inspect_pocket_item(p_room_code text,p_session_token text,p_item_key text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;scene text;
begin
 p:=public.s1_get_player_by_session(room,p_session_token);g:=public.s2_get_active_run(room);
 if not exists(select 1 from public.s3_player_items where run_id=g.run_id and physical_owner_id=p.player_id and item_key=p_item_key) then raise exception 'Player does not physically own this item.';end if;
 select scene_id into scene from public.s3_runtime_scene_state where run_id=g.run_id;
 insert into public.s9_pocket_item_inspections(run_id,player_id,item_key) values(g.run_id,p.player_id,p_item_key) on conflict do nothing;
 if p_item_key='gitte_castle_map' then
  perform public.s3_record_knowledge(g.run_id,p.player_id,'gitte_map_routes','pocket_inspection',scene,null,p_item_key);
 elsif p_item_key='gitte_number_note' then
  perform public.s3_record_knowledge(g.run_id,p.player_id,'gitte_number_code','pocket_inspection',scene,null,p_item_key);
 elsif p_item_key='anna_servant_diary' then
  insert into public.s3b_player_facts values(g.run_id,p.player_id,'anna_knows_snake_rule',now()) on conflict do nothing;
  perform public.s3_record_knowledge(g.run_id,p.player_id,'anna_snake_rule','pocket_inspection',scene,null,p_item_key);
 elsif p_item_key='linda_closure_order' then
  insert into public.s3b_player_facts values(g.run_id,p.player_id,'linda_knows_tower_reason',now()) on conflict do nothing;
  perform public.s3_record_knowledge(g.run_id,p.player_id,'linda_tower_reason','pocket_inspection',scene,null,p_item_key);
 end if;
 return jsonb_build_object('ok',true,'item_key',p_item_key,'inspected',true);
end$$;

create or replace function public.s3_set_item_view(p_room_code text,p_session_token text,p_item_key text,p_target_view text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;currentview text;scene text;
begin
 p:=public.s1_get_player_by_session(room,p_session_token);g:=public.s2_get_active_run(room);
 if not exists(select 1 from public.s3_player_items where run_id=g.run_id and physical_owner_id=p.player_id and item_key=p_item_key) then raise exception 'Player does not physically own this item.';end if;
 if not exists(select 1 from public.s9_pocket_item_inspections where run_id=g.run_id and player_id=p.player_id and item_key=p_item_key) then raise exception 'Inspect the item before changing its view.';end if;
 if not exists(select 1 from public.s3_item_catalog where item_key=p_item_key and shareable_views ? p_target_view) then raise exception 'Invalid item view.';end if;
 select current_view into currentview from public.s3_player_item_view_state where run_id=g.run_id and player_id=p.player_id and item_key=p_item_key for update;
 if currentview is null then raise exception 'Item view state is not initialized.';end if;
 if currentview<>p_target_view and not ((currentview='front' and p_target_view='back') or(currentview='back' and p_target_view='front')) then raise exception 'Invalid item view transition.';end if;
 update public.s3_player_item_view_state set current_view=p_target_view,updated_at=now() where run_id=g.run_id and player_id=p.player_id and item_key=p_item_key;
 select scene_id into scene from public.s3_runtime_scene_state where run_id=g.run_id;
 if p_target_view='back' and p_item_key='gitte_number_note' then
  insert into public.s3b_player_facts values(g.run_id,p.player_id,'gitte_knows_star',now()) on conflict do nothing;
  perform public.s3_record_knowledge(g.run_id,p.player_id,'gitte_star_symbol','pocket_inspection',scene,null,p_item_key);
 elsif p_target_view='back' and p_item_key='linda_stopped_watch' then
  insert into public.s3b_player_facts values(g.run_id,p.player_id,'linda_watch_reminder',now()) on conflict do nothing;
  perform public.s3_record_knowledge(g.run_id,p.player_id,'linda_watch_reminder','pocket_inspection',scene,null,p_item_key);
 end if;
 return jsonb_build_object('ok',true,'current_view',p_target_view);
end$$;

create or replace function public.s3_get_player_state(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;
begin
 p:=public.s1_get_player_by_session(room,p_session_token);g:=public.s2_get_active_run(room);
 if g.run_id is null then return jsonb_build_object('active',false);end if;
 return jsonb_build_object('active',true,'run_id',g.run_id,
  'scene',(select to_jsonb(s) from public.s3_runtime_scene_state s where s.run_id=g.run_id),
  'items',(select coalesce(jsonb_agg(jsonb_build_object('item_key',i.item_key,'name_text_key',c.name_text_key,'current_view',v.current_view)order by i.acquired_at),'[]') from public.s3_player_items i join public.s3_item_catalog c using(item_key) left join public.s3_player_item_view_state v on v.run_id=i.run_id and v.player_id=i.physical_owner_id and v.item_key=i.item_key where i.run_id=g.run_id and i.physical_owner_id=p.player_id),
  'inspected_item_keys',(select coalesce(jsonb_agg(x.item_key order by x.inspected_at),'[]') from public.s9_pocket_item_inspections x where x.run_id=g.run_id and x.player_id=p.player_id),
  'observations',(select coalesce(jsonb_agg(to_jsonb(o)-'run_id'-'player_id'),'[]') from public.s3_player_observations o where o.run_id=g.run_id and o.player_id=p.player_id),
  'shared_photos',(select coalesce(jsonb_agg(to_jsonb(ph)-'run_id'-'received_by'),'[]') from public.s3_shared_photos ph where ph.run_id=g.run_id and ph.received_by=p.player_id),
  'group_items',(select coalesce(jsonb_agg(to_jsonb(gi)-'run_id'),'[]') from public.s3_group_items gi where gi.run_id=g.run_id),
  'knowledge',(select coalesce(jsonb_agg(to_jsonb(k)-'run_id'-'player_id'),'[]') from public.s3_player_knowledge k where k.run_id=g.run_id and k.player_id=p.player_id));
end$$;

revoke all on function public.s9_inspect_pocket_item(text,text,text) from public;
grant execute on function public.s9_inspect_pocket_item(text,text,text) to anon,authenticated;
grant execute on function public.s3_set_item_view(text,text,text,text) to anon,authenticated;
commit;
