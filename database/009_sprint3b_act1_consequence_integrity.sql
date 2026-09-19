-- Sprint 3B ACT 1 semantic consequences and optional-item integrity.
-- Apply after 008_sprint3b_gate_concurrency_fix.sql.

create table if not exists public.s3b_player_facts (
  run_id uuid not null references public.game_runs(run_id),
  player_id uuid not null references public.s1_room_players(player_id),
  fact_key text not null,
  discovered_at timestamptz not null default now(),
  primary key(run_id,player_id,fact_key)
);
alter table public.s3b_player_facts enable row level security;

insert into public.s3_observation_catalog(observation_key,display_text_key) values
 ('chapel_warning','act02.019'),
 ('corridor_shadow','act02.020'),
 ('great_hall_outer_lock','act01-a.005'),
 ('warm_vent_movement','act02.021'),
 ('warm_air_warning','act01-l.021')
on conflict(observation_key) do update set display_text_key=excluded.display_text_key;

create or replace function public.s3b_apply_act1_consequence()
returns trigger language plpgsql security definer set search_path=public as $$
declare v_role text;
begin
  if old.act1_choice_id is not null or new.act1_choice_id is null then return new; end if;
  select role_slot into strict v_role from public.s1_room_players where player_id=new.player_id;

  if v_role='GAL-A' then
    insert into public.s3b_player_facts values(new.run_id,new.player_id,'gitte_heard_chapel_warning',now()),(new.run_id,new.player_id,'gitte_knows_basic_map',now()),(new.run_id,new.player_id,'gitte_number_note_visible',now()) on conflict do nothing;
    perform public.s3_record_observation(new.run_id,new.player_id,'chapel_warning','act1_wake_up');
    if new.act1_choice_id='study_map' then insert into public.s3b_player_facts values(new.run_id,new.player_id,'gitte_map_detail',now()) on conflict do nothing;
    elsif new.act1_choice_id='check_sound' then insert into public.s3b_player_facts values(new.run_id,new.player_id,'gitte_saw_shadow',now()) on conflict do nothing; perform public.s3_record_observation(new.run_id,new.player_id,'corridor_shadow','act1_wake_up');
    elsif new.act1_choice_id='study_number_note' then insert into public.s3b_player_facts values(new.run_id,new.player_id,'gitte_knows_star',now()) on conflict do nothing;
    elsif new.act1_choice_id='search_room' then insert into public.s3b_player_facts values(new.run_id,new.player_id,'gitte_flashlight_found',now()) on conflict do nothing; end if;
  elsif v_role='GAL-B' then
    insert into public.s3b_player_facts values(new.run_id,new.player_id,'anna_knows_great_hall_lock',now()),(new.run_id,new.player_id,'anna_diary_visible',now()) on conflict do nothing;
    perform public.s3_record_observation(new.run_id,new.player_id,'great_hall_outer_lock','act1_wake_up');
    if new.act1_choice_id='read_diary' then insert into public.s3b_player_facts values(new.run_id,new.player_id,'anna_knows_snake_rule',now()) on conflict do nothing;
    elsif new.act1_choice_id='check_door' then insert into public.s3b_player_facts values(new.run_id,new.player_id,'anna_knows_library_passage',now()) on conflict do nothing;
    elsif new.act1_choice_id='check_phone' then insert into public.s3b_player_facts values(new.run_id,new.player_id,'anna_detected_devices',now()) on conflict do nothing;
    elsif new.act1_choice_id='check_vent' then insert into public.s3b_player_facts values(new.run_id,new.player_id,'anna_heard_vent_movement',now()) on conflict do nothing; perform public.s3_record_observation(new.run_id,new.player_id,'warm_vent_movement','act1_wake_up'); end if;
  else
    insert into public.s3b_player_facts values(new.run_id,new.player_id,'linda_watch_visible',now()),(new.run_id,new.player_id,'linda_star_key_visible',now()),(new.run_id,new.player_id,'linda_knows_tower_closed',now()),(new.run_id,new.player_id,'linda_closure_notice_visible',now()) on conflict do nothing;
    if new.act1_choice_id='read_notice' then insert into public.s3b_player_facts values(new.run_id,new.player_id,'linda_knows_tower_reason',now()) on conflict do nothing;
    elsif new.act1_choice_id='study_watch' then insert into public.s3b_player_facts values(new.run_id,new.player_id,'linda_knows_watch_message',now()) on conflict do nothing;
    elsif new.act1_choice_id='try_star_key' then insert into public.s3b_player_facts values(new.run_id,new.player_id,'linda_tested_star_key',now()) on conflict do nothing;
    elsif new.act1_choice_id='check_mirror' then insert into public.s3b_player_facts values(new.run_id,new.player_id,'linda_knows_warm_air_warning',now()) on conflict do nothing; perform public.s3_record_observation(new.run_id,new.player_id,'warm_air_warning','act1_wake_up'); end if;
  end if;
  return new;
end; $$;

drop trigger if exists s3b_act1_consequence on public.s3b_player_progress;
create trigger s3b_act1_consequence after update of act1_choice_id on public.s3b_player_progress
for each row execute function public.s3b_apply_act1_consequence();

create or replace function public.s3b_add_optional_grab_item()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if not old.grab_complete and new.grab_complete and exists(select 1 from public.s3b_player_facts where run_id=new.run_id and player_id=new.player_id and fact_key='gitte_flashlight_found') then
    insert into public.s3_player_items(run_id,item_key,physical_owner_id) values(new.run_id,'gitte_flashlight',new.player_id) on conflict do nothing;
    insert into public.s3_player_item_view_state(run_id,player_id,item_key,current_view) values(new.run_id,new.player_id,'gitte_flashlight','front') on conflict do nothing;
  end if;
  return new;
end; $$;
drop trigger if exists s3b_optional_grab_item on public.s3b_player_progress;
create trigger s3b_optional_grab_item after update of grab_complete on public.s3b_player_progress
for each row execute function public.s3b_add_optional_grab_item();

revoke execute on function public.s3b_apply_act1_consequence(),public.s3b_add_optional_grab_item() from public,anon,authenticated;

create or replace function public.s3b_get_my_facts(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_room text:=upper(trim(p_room_code)); v_player public.s1_room_players%rowtype; v_run public.game_runs%rowtype;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token); v_run:=public.s2_get_active_run(v_room);
  return (select coalesce(jsonb_agg(fact_key order by fact_key),'[]') from public.s3b_player_facts where run_id=v_run.run_id and player_id=v_player.player_id);
end; $$;
grant execute on function public.s3b_get_my_facts(text,text) to anon,authenticated;
