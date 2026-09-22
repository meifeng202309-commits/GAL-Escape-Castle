-- Sprint 3C: minimal server-authoritative Teacher deblock / override.
-- Canonical allowlist source: Game Script V4.0 section 5.5.

create table public.teacher_overrides (
  override_id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.game_runs(run_id),
  source_scene text not null,
  source_phase text not null,
  source_step text not null,
  override_action text not null check(override_action in ('SKIP_CURRENT_INTERACTION','RESOLVE_AND_CONTINUE')),
  applied_resolution text,
  resolution_source text not null default 'teacher_override' check(resolution_source='teacher_override'),
  reason text not null check(char_length(reason) between 1 and 500),
  invalidated_scope jsonb not null default '[]'::jsonb check(jsonb_typeof(invalidated_scope)='array'),
  behavior_scoring boolean not null default false check(not behavior_scoring),
  created_at timestamptz not null default now(),
  unique(run_id,source_scene,source_phase,source_step)
);

create table public.teacher_override_validity (
  override_id uuid not null references public.teacher_overrides(override_id),
  run_id uuid not null references public.game_runs(run_id),
  player_id uuid references public.s1_room_players(player_id),
  semantic_field text not null,
  value jsonb,
  validity text not null default 'invalid_teacher_override' check(validity='invalid_teacher_override'),
  primary key(override_id,semantic_field,player_id)
);

alter table public.teacher_overrides enable row level security;
alter table public.teacher_override_validity enable row level security;
alter table public.game_runs add column if not exists active_override_id uuid references public.teacher_overrides(override_id);

-- Later real behavior remains player-authored and valid while carrying the
-- active upstream Game Track intervention as explicit context provenance.
create or replace function public.s3b_log_formal_event_at_context(
  p_run_id uuid,p_event_type text,p_actor_player_id uuid,p_event_source text,
  p_scene_id text,p_phase_key text,p_step_key text,p_details jsonb default '{}'::jsonb,
  p_validity text default 'valid',p_behavior_scoring boolean default false,
  p_interaction_id uuid default null,p_client_request_id uuid default null
) returns void language plpgsql security definer set search_path=public as $$
declare v_room text;v_override public.teacher_overrides%rowtype;v_details jsonb:=coalesce(p_details,'{}'::jsonb);
begin
  if p_event_source not in ('player','server','system_fallback','teacher_override') then raise exception 'Invalid formal event source.';end if;
  select room_code into v_room from public.game_runs where run_id=p_run_id;
  select o.* into v_override from public.game_runs g join public.teacher_overrides o on o.override_id=g.active_override_id where g.run_id=p_run_id;
  if v_override.override_id is not null then
    v_details:=v_details||jsonb_build_object('context_provenance',jsonb_build_object(
      'upstream_teacher_override',true,'override_id',v_override.override_id,
      'source_scene',v_override.source_scene,'source_phase',v_override.source_phase,
      'override_action',v_override.override_action));
  end if;
  insert into public.runtime_events(run_id,room_code,discussion_session_id,event_type,actor_player_id,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,interaction_id,client_request_id)
  values(p_run_id,v_room,null,p_event_type,p_actor_player_id,v_details,p_scene_id,p_phase_key,p_step_key,p_event_source,p_validity,p_behavior_scoring,p_interaction_id,p_client_request_id);
end;$$;

revoke execute on function public.s3b_log_formal_event_at_context(uuid,text,uuid,text,text,text,text,jsonb,text,boolean,uuid,uuid) from public,anon,authenticated;

create or replace function public.teacher_apply_override(
  p_room_code text,p_teacher_token text,p_override_action text,p_reason text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  r text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;
  o_id uuid:=gen_random_uuid();scope jsonb:='[]'::jsonb;resolution text;route text;text_key text;
begin
  perform public.s1_assert_teacher(r,p_teacher_token);
  if p_override_action not in ('SKIP_CURRENT_INTERACTION','RESOLVE_AND_CONTINUE') then raise exception 'Unknown override action.';end if;
  if p_reason is null or char_length(trim(p_reason)) not between 1 and 500 then raise exception 'Override reason must contain 1 to 500 characters.';end if;
  select * into g from public.game_runs where room_code=r and status='active' for update;
  if not found then raise exception 'No active formal run.';end if;
  select * into s from public.s3_runtime_scene_state where run_id=g.run_id for update;
  if not found then raise exception 'Canonical gameplay is not initialized.';end if;

  if s.scene_id='act1_wake_up' and s.phase_key='private_first_action' and p_override_action='SKIP_CURRENT_INTERACTION' then
    select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'fields',jsonb_build_array('act1_choice_id','act1_locked_at','act1_response_duration_ms'))),'[]'::jsonb) into scope
    from public.s3b_player_progress where run_id=g.run_id and act1_choice_id is null;
    insert into public.teacher_overrides values(o_id,g.run_id,s.scene_id,s.phase_key,s.step_key,p_override_action,null,'teacher_override',trim(p_reason),scope,false,now());
    insert into public.runtime_events(run_id,room_code,event_type,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,interaction_id)
    values(g.run_id,r,'teacher_override',jsonb_build_object('override_action',p_override_action,'applied_resolution',null,'reason',trim(p_reason),'invalidated_scope',scope),s.scene_id,s.phase_key,s.step_key,'teacher_override','valid',false,o_id);
    insert into public.teacher_override_validity(override_id,run_id,player_id,semantic_field,value)
    select o_id,g.run_id,player_id,f,null from public.s3b_player_progress cross join unnest(array['act1_choice_id','act1_locked_at','act1_response_duration_ms']) f
    where run_id=g.run_id and act1_choice_id is null;
    update public.s3b_player_progress set act1_stage='complete',act1_text_keys='[]'::jsonb,act1_timing_validity='invalid_teacher_override'
    where run_id=g.run_id and act1_choice_id is null;
    perform public.s3b_set_scene(g.run_id,'act2_first_contact','private_first_meeting','signal_unstable','ACTION_SCREEN','act02.002');
  elsif s.scene_id='act2_route_update' and s.phase_key='route_update' and p_override_action='SKIP_CURRENT_INTERACTION' then
    select final_meeting_result into route from public.s3b_run_state where run_id=g.run_id for update;
    if route is null then raise exception 'Route update has no canonical result.';end if;
    text_key:=case route when 'library' then 'act03.001' when 'great_hall' then 'act02.038' when 'main_gate' then 'act02.043' when 'west_tower' then 'act02.046' else 'act02.049' end;
    insert into public.teacher_overrides values(o_id,g.run_id,s.scene_id,s.phase_key,s.step_key,p_override_action,route,'teacher_override',trim(p_reason),scope,false,now());
    insert into public.runtime_events(run_id,room_code,event_type,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,interaction_id)
    values(g.run_id,r,'teacher_override',jsonb_build_object('override_action',p_override_action,'applied_resolution',route,'reason',trim(p_reason),'invalidated_scope',scope),s.scene_id,s.phase_key,s.step_key,'teacher_override','valid',false,o_id);
    perform public.s3b_set_scene(g.run_id,'act2_rendezvous','route_consequence',route,'CINEMATIC_MESSAGE',text_key);
  elsif s.scene_id='act3_library' and s.phase_key='library_box' and p_override_action='RESOLVE_AND_CONTINUE' then
    perform 1 from public.s3b_run_state where run_id=g.run_id and puzzle_resolved_at is null for update;
    if not found then raise exception 'Library Box is already resolved.';end if;
    resolution:='41739';
    insert into public.teacher_overrides values(o_id,g.run_id,s.scene_id,s.phase_key,s.step_key,p_override_action,resolution,'teacher_override',trim(p_reason),scope,false,now());
    insert into public.runtime_events(run_id,room_code,event_type,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring,interaction_id)
    values(g.run_id,r,'teacher_override',jsonb_build_object('override_action',p_override_action,'applied_resolution',resolution,'reason',trim(p_reason),'invalidated_scope',scope),s.scene_id,s.phase_key,s.step_key,'teacher_override','valid',false,o_id);
    update public.s3b_run_state set puzzle_resolved_at=now(),puzzle_locked_prefix='41739',updated_at=now() where run_id=g.run_id;
    insert into public.s3_group_items(run_id,item_key,label_text_key) values(g.run_id,'library_photo_1897','item.photo_1897'),(g.run_id,'library_torn_note','item.torn_note') on conflict do nothing;
    perform public.s3b_set_scene(g.run_id,'act4_known_unknown','private_route_choice','initial','ACTION_SCREEN','act04-05.002');
  else
    raise exception 'Override action is unsupported for the current interaction.';
  end if;

  update public.game_runs set active_override_id=o_id where run_id=g.run_id;
  return jsonb_build_object('ok',true,'override_id',o_id,'override_action',p_override_action,'source_scene',s.scene_id,'source_phase',s.phase_key,'source_step',s.step_key,'applied_resolution',resolution,'invalidated_scope',scope,'created_at',now());
exception when unique_violation then raise exception 'Current interaction was already overridden.';
end;$$;

alter function public.s2_get_teacher_state(text,text) rename to s2_get_teacher_state_pre015;
revoke execute on function public.s2_get_teacher_state_pre015(text,text) from public,anon,authenticated;

create or replace function public.s2_get_teacher_state(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;base jsonb;actions jsonb:='[]'::jsonb;history jsonb:='[]'::jsonb;
begin
  perform public.s1_assert_teacher(r,p_teacher_token);base:=public.s2_get_teacher_state_pre015(p_room_code,p_teacher_token);g:=public.s2_get_active_run(r);
  if g.run_id is null then return base;end if;select * into s from public.s3_runtime_scene_state where run_id=g.run_id;
  actions:=case
    when s.scene_id='act1_wake_up' and s.phase_key='private_first_action' then '["SKIP_CURRENT_INTERACTION"]'::jsonb
    when s.scene_id='act2_route_update' and s.phase_key='route_update' then '["SKIP_CURRENT_INTERACTION"]'::jsonb
    when s.scene_id='act3_library' and s.phase_key='library_box' then '["RESOLVE_AND_CONTINUE"]'::jsonb
    else '[]'::jsonb end;
  select coalesce(jsonb_agg(jsonb_build_object('override_id',override_id,'source_scene',source_scene,'source_phase',source_phase,'source_step',source_step,'override_action',override_action,'applied_resolution',applied_resolution,'reason',reason,'invalidated_scope',invalidated_scope,'created_at',created_at) order by created_at),'[]'::jsonb) into history from public.teacher_overrides where run_id=g.run_id;
  return base||jsonb_build_object('teacher_override',jsonb_build_object('allowed_actions',actions,'history',history));
end;$$;

grant execute on function public.teacher_apply_override(text,text,text,text),public.s2_get_teacher_state(text,text) to anon,authenticated;
