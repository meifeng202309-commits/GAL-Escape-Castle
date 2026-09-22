-- Sprint 3B targeted closure corrections. Apply after 014a.
-- Closes IDA-005, IDA-012 and RCA-002. Migration 013 is restored to its
-- originally deployed content; 014a remains the additive reconnect correction.

alter table public.game_runs
  add column if not exists audit_private_debug_view boolean not null default false;

-- Canonical initialization must not carry a generic Sprint 2 discussion into
-- ACT 1 private gameplay. The teacher can finish that discussion and retry.
create or replace function public.s3b_initialize_flow(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  v_room text:=upper(trim(p_room_code));
  v_run public.game_runs%rowtype;
  v_result jsonb;
begin
  perform public.s1_assert_teacher(v_room,p_teacher_token);
  select * into v_run from public.game_runs
  where room_code=v_room and status='active' for update;
  if not found then raise exception 'No active formal run.'; end if;
  if exists(select 1 from public.s3b_run_state where run_id=v_run.run_id) then
    raise exception 'Sprint 3B flow is already initialized.';
  end if;
  if exists(select 1 from public.discussion_sessions
    where run_id=v_run.run_id and status in ('discussion','voting','waiting_for_missing_player')) then
    raise exception 'Resolve the open generic discussion before canonical gameplay initialization.';
  end if;
  v_result:=public.s3b_initialize_flow_pre011(p_room_code,p_teacher_token);
  update public.s3b_player_progress p set act1_text_keys=case rp.role_slot
    when 'GAL-A' then '["act01-g.001","act01-g.002","act01-g.003","act01-g.004","act01-g.005","act01-g.007","act01-g.008","act01-g.016","act01-g.017","act01-g.018"]'
    when 'GAL-B' then '["act01-a.001","act01-g.004","act01-g.005","act01-a.003","act01-a.004","act01-a.005"]'
    else '["act01-l.001","act01-l.002","act01-g.005","act01-l.004","act01-l.005","act01-l.006","act01-l.007","act01-l.008","act01-l.009","act01-l.010","act01-l.011"]' end::jsonb
  from public.s1_room_players rp
  where p.run_id=v_run.run_id and rp.player_id=p.player_id;
  return v_result;
end;
$$;

-- Capture an action's source context before delegated mutation. Because the
-- event and mutation share one transaction, a rejected mutation rolls back the
-- provisional event while a successful transition keeps causal ledger order.
create or replace function public.s3b_log_formal_event_at_context(
  p_run_id uuid,
  p_event_type text,
  p_actor_player_id uuid,
  p_event_source text,
  p_scene_id text,
  p_phase_key text,
  p_step_key text,
  p_details jsonb default '{}'::jsonb,
  p_validity text default 'valid',
  p_behavior_scoring boolean default false,
  p_interaction_id uuid default null,
  p_client_request_id uuid default null
) returns void
language plpgsql security definer set search_path=public as $$
declare v_room text;
begin
  if p_event_source not in ('player','server','system_fallback','teacher_override') then
    raise exception 'Invalid formal event source.';
  end if;
  select room_code into v_room from public.game_runs where run_id=p_run_id;
  insert into public.runtime_events(
    run_id,room_code,discussion_session_id,event_type,actor_player_id,details,
    scene_id,phase_key,step_key,event_source,validity,behavior_scoring,
    interaction_id,client_request_id
  ) values(
    p_run_id,v_room,null,p_event_type,p_actor_player_id,coalesce(p_details,'{}'::jsonb),
    p_scene_id,p_phase_key,p_step_key,p_event_source,p_validity,p_behavior_scoring,
    p_interaction_id,p_client_request_id
  );
end;
$$;

revoke execute on function public.s3b_log_formal_event_at_context(
  uuid,text,uuid,text,text,text,text,jsonb,text,boolean,uuid,uuid
) from public,anon,authenticated;

create or replace function public.s3b_ack_act1_opening(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;result jsonb;
begin
  p:=public.s1_get_player_by_session(r,p_session_token);select * into g from public.game_runs where room_code=r and status='active' for update;if not found then raise exception 'No active formal run.';end if;select * into s from public.s3_runtime_scene_state where run_id=g.run_id;
  perform public.s3b_log_formal_event_at_context(g.run_id,'act1_opening_acknowledged',p.player_id,'player',s.scene_id,s.phase_key,s.step_key,'{}','valid',false);
  result:=public.s3b_ack_act1_opening_pre014(p_room_code,p_session_token);
  update public.s3b_player_progress set act1_action_started_at=coalesce(act1_action_started_at,now()),act1_timing_validity='valid' where run_id=g.run_id and player_id=p.player_id;
  return result;
end;$$;

create or replace function public.s3b_submit_act1_choice(p_room_code text,p_session_token text,p_choice_id text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;result jsonb;started timestamptz;validity text;duration_ms bigint;
begin
  p:=public.s1_get_player_by_session(r,p_session_token);select * into g from public.game_runs where room_code=r and status='active' for update;if not found then raise exception 'No active formal run.';end if;select * into s from public.s3_runtime_scene_state where run_id=g.run_id;
  select act1_action_started_at into started from public.s3b_player_progress where run_id=g.run_id and player_id=p.player_id;
  validity:=case when started is null then 'legacy_missing_start' else 'valid' end;duration_ms:=case when started is null then null else round(extract(epoch from(now()-started))*1000)::bigint end;
  perform public.s3b_log_formal_event_at_context(g.run_id,'act1_choice_locked',p.player_id,'player',s.scene_id,s.phase_key,s.step_key,jsonb_build_object('choice_id',p_choice_id,'response_duration_ms',duration_ms),validity,true);
  result:=public.s3b_submit_act1_choice_pre014(p_room_code,p_session_token,p_choice_id);
  update public.s3b_player_progress set act1_timing_validity=validity where run_id=g.run_id and player_id=p.player_id;
  return result;
end;$$;

create or replace function public.s3b_complete_act1(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;result jsonb;
begin p:=public.s1_get_player_by_session(r,p_session_token);select * into g from public.game_runs where room_code=r and status='active' for update;if not found then raise exception 'No active formal run.';end if;select * into s from public.s3_runtime_scene_state where run_id=g.run_id;perform public.s3b_log_formal_event_at_context(g.run_id,'act1_consequence_completed',p.player_id,'player',s.scene_id,s.phase_key,s.step_key);result:=public.s3b_complete_act1_pre014(p_room_code,p_session_token);return result;end;$$;

create or replace function public.s3b_submit_first_meeting(p_room_code text,p_session_token text,p_choice_id text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;result jsonb;started timestamptz;validity text;duration_ms bigint;
begin
  p:=public.s1_get_player_by_session(r,p_session_token);select * into g from public.game_runs where room_code=r and status='active' for update;if not found then raise exception 'No active formal run.';end if;select * into s from public.s3_runtime_scene_state where run_id=g.run_id;select first_meeting_started_at into started from public.s3b_player_progress where run_id=g.run_id and player_id=p.player_id;
  validity:=case when started is null then 'legacy_missing_start' else 'valid' end;duration_ms:=case when started is null then null else round(extract(epoch from(now()-started))*1000)::bigint end;
  perform public.s3b_log_formal_event_at_context(g.run_id,'first_meeting_choice_locked',p.player_id,'player',s.scene_id,s.phase_key,s.step_key,jsonb_build_object('choice_id',p_choice_id,'response_duration_ms',duration_ms),validity,true);
  result:=public.s3b_submit_first_meeting_pre014(p_room_code,p_session_token,p_choice_id);update public.s3b_player_progress set first_meeting_timing_validity=validity where run_id=g.run_id and player_id=p.player_id;return result;
end;$$;

create or replace function public.s3b_grab(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;result jsonb;
begin p:=public.s1_get_player_by_session(r,p_session_token);select * into g from public.game_runs where room_code=r and status='active' for update;if not found then raise exception 'No active formal run.';end if;select * into s from public.s3_runtime_scene_state where run_id=g.run_id;perform public.s3b_log_formal_event_at_context(g.run_id,'grab_completed',p.player_id,'player',s.scene_id,s.phase_key,s.step_key);result:=public.s3b_grab_pre014(p_room_code,p_session_token);return result;end;$$;

create or replace function public.s3b_leave_start_room(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;result jsonb;
begin p:=public.s1_get_player_by_session(r,p_session_token);select * into g from public.game_runs where room_code=r and status='active' for update;if not found then raise exception 'No active formal run.';end if;select * into s from public.s3_runtime_scene_state where run_id=g.run_id;perform public.s3b_log_formal_event_at_context(g.run_id,'start_room_left',p.player_id,'player',s.scene_id,s.phase_key,s.step_key);result:=public.s3b_leave_start_room_pre014(p_room_code,p_session_token);return result;end;$$;

create or replace function public.s3b_ack_route_update(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;result jsonb;
begin p:=public.s1_get_player_by_session(r,p_session_token);select * into g from public.game_runs where room_code=r and status='active' for update;if not found then raise exception 'No active formal run.';end if;select * into s from public.s3_runtime_scene_state where run_id=g.run_id;perform public.s3b_log_formal_event_at_context(g.run_id,'route_update_acknowledged',p.player_id,'player',s.scene_id,s.phase_key,s.step_key);result:=public.s3b_ack_route_update_pre014(p_room_code,p_session_token);return result;end;$$;

create or replace function public.s3b_complete_foldback(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;result jsonb;
begin p:=public.s1_get_player_by_session(r,p_session_token);select * into g from public.game_runs where room_code=r and status='active' for update;if not found then raise exception 'No active formal run.';end if;select * into s from public.s3_runtime_scene_state where run_id=g.run_id;perform public.s3b_log_formal_event_at_context(g.run_id,'route_foldback_completed',p.player_id,'player',s.scene_id,s.phase_key,s.step_key);result:=public.s3b_complete_foldback_pre014(p_room_code,p_session_token);return result;end;$$;

create or replace function public.s3b_follow_sign(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;result jsonb;
begin p:=public.s1_get_player_by_session(r,p_session_token);select * into g from public.game_runs where room_code=r and status='active' for update;if not found then raise exception 'No active formal run.';end if;select * into s from public.s3_runtime_scene_state where run_id=g.run_id;perform public.s3b_log_formal_event_at_context(g.run_id,'follow_sign_completed',p.player_id,'player',s.scene_id,s.phase_key,s.step_key);result:=public.s3b_follow_sign_pre014(p_room_code,p_session_token);return result;end;$$;

create or replace function public.s3b_submit_act4_choice(p_room_code text,p_session_token text,p_choice_id text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;result jsonb;started timestamptz;validity text;duration_ms bigint;
begin
  p:=public.s1_get_player_by_session(r,p_session_token);select * into g from public.game_runs where room_code=r and status='active' for update;if not found then raise exception 'No active formal run.';end if;select * into s from public.s3_runtime_scene_state where run_id=g.run_id;select act4_choice_started_at into started from public.s3b_player_progress where run_id=g.run_id and player_id=p.player_id;
  validity:=case when started is null then 'legacy_missing_start' else 'valid' end;duration_ms:=case when started is null then null else round(extract(epoch from(now()-started))*1000)::bigint end;
  perform public.s3b_log_formal_event_at_context(g.run_id,'act4_choice_locked',p.player_id,'player',s.scene_id,s.phase_key,s.step_key,jsonb_build_object('choice_id',p_choice_id,'response_duration_ms',duration_ms),validity,true);
  result:=public.s3b_submit_act4_choice_pre014(p_room_code,p_session_token,p_choice_id);update public.s3b_player_progress set act4_timing_validity=validity where run_id=g.run_id and player_id=p.player_id;return result;
end;$$;

-- Private evidence is never returned to NORMAL Teacher clients. AUDIT clients
-- receive it only when the explicit privileged debug flag is enabled.
create or replace function public.s2_get_teacher_state(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  r text:=upper(trim(p_room_code));
  g public.game_runs%rowtype;
  base jsonb;
  events jsonb:='[]'::jsonb;
  private_phases text[]:=array['private_first_action','private_first_meeting','private_route_choice'];
begin
  perform public.s1_assert_teacher(r,p_teacher_token);
  base:=public.s2_get_teacher_state_pre014(p_room_code,p_teacher_token);
  g:=public.s2_get_active_run(r);
  if g.run_id is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'event_id',e.event_id,'event_type',e.event_type,
      'discussion_session_id',e.discussion_session_id,'scene_id',e.scene_id,
      'phase_key',e.phase_key,'step_key',e.step_key,'actor_player_id',e.actor_player_id,
      'event_source',e.event_source,'validity',e.validity,
      'behavior_scoring',e.behavior_scoring,'interaction_id',e.interaction_id,
      'client_request_id',e.client_request_id,'details',e.details,'created_at',e.created_at
    ) order by e.created_at,e.event_id),'[]'::jsonb) into events
    from public.runtime_events e
    where e.run_id=g.run_id
      and (not (e.phase_key=any(private_phases))
        or (g.run_mode='audit' and g.audit_private_debug_view));
  end if;
  return jsonb_set(
    jsonb_set(base,'{run,audit_private_debug_view}',to_jsonb(coalesce(g.audit_private_debug_view,false)),true),
    '{events}',events,true
  );
end;
$$;

create or replace function public.s3b_audit_set_private_debug_view(
  p_room_code text,p_teacher_token text,p_enabled boolean
) returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));g public.game_runs%rowtype;
begin
  perform public.s1_assert_teacher(r,p_teacher_token);
  select * into g from public.game_runs where room_code=r and status='active' for update;
  if not found then raise exception 'No active formal run.'; end if;
  if g.run_mode<>'audit' then raise exception 'Private debug view is restricted to AUDIT runs.'; end if;
  update public.game_runs set audit_private_debug_view=coalesce(p_enabled,false) where run_id=g.run_id;
  return jsonb_build_object('ok',true,'audit_private_debug_view',coalesce(p_enabled,false));
end;
$$;

grant execute on function public.s3b_initialize_flow(text,text),
  public.s3b_ack_act1_opening(text,text),
  public.s3b_submit_act1_choice(text,text,text),
  public.s3b_complete_act1(text,text),
  public.s3b_submit_first_meeting(text,text,text),
  public.s3b_grab(text,text),
  public.s3b_leave_start_room(text,text),
  public.s3b_ack_route_update(text,text),
  public.s3b_complete_foldback(text,text),
  public.s3b_follow_sign(text,text),
  public.s3b_submit_act4_choice(text,text,text),
  public.s2_get_teacher_state(text,text),
  public.s3b_audit_set_private_debug_view(text,text,boolean)
to anon,authenticated;
