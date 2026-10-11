-- B-min/W05 source-only Teacher operational projection. UNAPPLIED.
-- Migration 044 remains immutable; preserve its response behind an internal helper.
begin;

alter function public.s7_get_teacher_console(text,text)
  rename to s7_get_teacher_console_pre069;

revoke all on function public.s7_get_teacher_console_pre069(text,text)
  from public,anon,authenticated;

create function public.s7_get_teacher_console(
  p_room_code text,
  p_teacher_token text
) returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  legacy jsonb;
  active_run_id uuid;
  sprint5 public.s5_run_state%rowtype;
  sprint6 public.s6_run_state%rowtype;
  entered_players integer:=0;
  owner_domain text;
  owner_validity text:='VALID';
  owner_reason text;
  operations jsonb;
begin
  -- The preserved implementation performs Teacher authentication and emits
  -- the complete legacy response. This wrapper only adds the consumed W05 view.
  legacy:=public.s7_get_teacher_console_pre069(p_room_code,p_teacher_token);
  if not coalesce((legacy->>'active')::boolean,false) then return legacy;end if;
  active_run_id:=(legacy#>>'{run,run_id}')::uuid;

  select * into sprint5 from public.s5_run_state where run_id=active_run_id;
  select * into sprint6 from public.s6_run_state where run_id=active_run_id;
  select count(*) into entered_players from public.s3b_player_progress
    where run_id=active_run_id and act6_entered_at is not null;

  if sprint6.run_id is not null and (sprint5.run_id is null or sprint5.phase_key<>'complete') then
    owner_domain:='UNKNOWN';owner_validity:='INVARIANT_BREACH';owner_reason:='S6_WITHOUT_COMPLETED_S5';
  elsif sprint5.run_id is not null and sprint5.act6_entered_at is not null and entered_players<>3 then
    owner_domain:='UNKNOWN';owner_validity:='INVARIANT_BREACH';owner_reason:='S5_ACTIVATED_WITHOUT_ALL_PLAYERS_ENTERED';
  elsif sprint6.run_id is not null then owner_domain:='S6';
  elsif sprint5.run_id is not null and sprint5.act6_entered_at is not null then owner_domain:='S5';
  else owner_domain:='S3B';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'version',1,
    'player_id',player.player_id,
    'role_slot',player.role_slot,
    'physical_location',case
      when owner_validity<>'VALID'then'UNKNOWN'
      when owner_domain='S6'then case when sprint6.act_no<=10 then'great_hall'when sprint6.act_no<=12 then'main_gate'else'castle_exterior'end
      when owner_domain='S5'then case sprint5.act_no when 6 then'portrait_hall'when 7 then'clock_room'else'great_hall'end
      else coalesce(progress.player_location,'UNKNOWN') end,
    'transition_state',case
      when owner_validity<>'VALID'then'UNKNOWN'
      when owner_domain<>'S3B'then'NONE'
      when progress.act6_entered_at is not null then'ENTERED_PORTRAIT_WAITING_FOR_GROUP'
      when progress.act6_handoff_observed_at is not null then'ACT6_ENTRY_OBSERVED_NOT_ENTERED'
      else'NONE'end,
    'discussion_or_vote_state',case
      when owner_validity<>'VALID'then'UNKNOWN'
      when owner_domain='S5'then case
        when s5_activity.has_submission then'SUBMITTED_CURRENT_ROUND'
        when s5_activity.round_status='discussion'then'DISCUSSION_ACTIVE'
        when s5_activity.round_status='resolved'then'RESOLVED'
        else'UNKNOWN_UNAVAILABLE_S5_ROUND'end
      when owner_domain='S6'then case
        when s6_activity.has_submission then'SUBMITTED_CURRENT_ROUND'
        when sprint6.phase_key like'%discussion'then'DISCUSSION_ACTIVE'
        when sprint6.phase_key in('act9_console','act10_private','act10_final_vote','act12_pressure')then'WAITING_CURRENT_ROUND'
        when sprint6.phase_key in('act11_allocation','act12_tasks','act12_cinematic','act13_escape','act13_boundary')then'NOT_APPLICABLE'
        else'UNKNOWN_UNAVAILABLE_S6_PHASE'end
      else case
        when s3b_activity.has_submission then'SUBMITTED_CURRENT_ROUND'
        when s3b_activity.session_status='discussion'then'DISCUSSION_ACTIVE'
        when s3b_activity.session_status in('voting','waiting_for_missing_player')then'WAITING_CURRENT_ROUND'
        when s3b_activity.session_status='resolved'then'RESOLVED'
        else'UNKNOWN_UNAVAILABLE_S3B_PHASE'end
      end,
    'assignment_role',case when owner_domain='S6'then allocation.role_key end,
    'engagement_state',case
      when owner_validity<>'VALID'then'UNKNOWN'
      when owner_domain<>'S6'or sprint6.act_no<11 then'NOT_APPLICABLE'
      when allocation_integrity.role_count>1 or engagement_integrity.conflict_count>0 or task_integrity.conflict_count>0 then'UNKNOWN'
      when allocation.role_key is null then'ALLOCATION_OPEN'
      when engagement_integrity.match_count=1 then'ENGAGED'
      else'ASSIGNED_NOT_ENGAGED'end,
    'task_state',case
      when owner_validity<>'VALID'then'UNKNOWN'
      when owner_domain<>'S6'or sprint6.act_no<11 or allocation.role_key is null then'NOT_APPLICABLE'
      when allocation_integrity.role_count>1 or engagement_integrity.conflict_count>0 or task_integrity.conflict_count>0 then'UNKNOWN'
      when task_integrity.match_count=1 then'COMPLETE'
      else'PENDING'end,
    'connection_state',case when player.last_seen_at>clock_timestamp()-interval'30 seconds'then'ONLINE'else'OFFLINE'end,
    'source_domain',owner_domain,
    'source_identity',jsonb_build_object('run_id',active_run_id,'table_name',case owner_domain when'S3B'then's3b_player_progress'when'S5'then's5_run_state'when'S6'then's6_run_state'end),
    'validity',case when owner_validity<>'VALID'or(owner_domain='S3B'and progress.run_id is null)
      or(owner_domain='S6'and(allocation_integrity.role_count>1 or engagement_integrity.conflict_count>0 or task_integrity.conflict_count>0))
      then'INVARIANT_BREACH'else'VALID'end,
    'reason_code',case when owner_reason is not null then owner_reason
      when owner_domain='S3B'and progress.run_id is null then'MISSING_S3B_PLAYER_PROGRESS'
      when owner_domain='S6'and allocation_integrity.role_count>1 then'DUPLICATE_S6_ROLE_ALLOCATION'
      when owner_domain='S6'and engagement_integrity.conflict_count>0 then'CONTRADICTORY_S6_ENGAGEMENT_RELATIONSHIP'
      when owner_domain='S6'and task_integrity.conflict_count>0 then'CONTRADICTORY_S6_TASK_RELATIONSHIP'end
  ) order by player.role_slot),'[]'::jsonb) into operations
  from public.s1_room_players player
  left join public.s3b_player_progress progress on progress.run_id=active_run_id and progress.player_id=player.player_id
  left join public.s6_allocations allocation on allocation.run_id=active_run_id and allocation.player_id=player.player_id
  left join lateral(select count(*)::integer role_count from public.s6_allocations a
    where a.run_id=active_run_id and allocation.role_key is not null and a.role_key=allocation.role_key)allocation_integrity on true
  left join lateral(select
      count(*)filter(where e.role_key=allocation.role_key and e.player_id=player.player_id)::integer match_count,
      count(*)filter(where(e.player_id=player.player_id and e.role_key is distinct from allocation.role_key)
        or(e.role_key=allocation.role_key and e.player_id is distinct from player.player_id))::integer conflict_count
    from public.s6_engagements e where e.run_id=active_run_id
      and(e.player_id=player.player_id or e.role_key=allocation.role_key))engagement_integrity on true
  left join lateral(select
      count(*)filter(where t.role_key=allocation.role_key and t.player_id=player.player_id)::integer match_count,
      count(*)filter(where(t.player_id=player.player_id and t.role_key is distinct from allocation.role_key)
        or(t.role_key=allocation.role_key and t.player_id is distinct from player.player_id))::integer conflict_count
    from public.s6_station_tasks t where t.run_id=active_run_id
      and(t.player_id=player.player_id or t.role_key=allocation.role_key))task_integrity on true
  left join lateral(select r.status round_status,
      exists(select 1 from public.s5_votes v where v.run_id=active_run_id and v.phase_key=sprint5.phase_key
        and v.vote_round=sprint5.vote_round and v.player_id=player.player_id)has_submission
    from public.s5_rounds r where r.run_id=active_run_id and r.phase_key=sprint5.phase_key
      and r.vote_round=sprint5.vote_round)s5_activity on true
  left join lateral(select exists(select 1 from public.s6_choices c where c.run_id=active_run_id
      and c.phase_key=sprint6.phase_key and c.round_no=sprint6.round_no and c.player_id=player.player_id)has_submission)s6_activity on true
  left join lateral(select d.status session_status,
      exists(select 1 from public.runtime_player_decisions decision where decision.run_id=active_run_id
        and decision.discussion_session_id=d.discussion_session_id and decision.player_id=player.player_id)has_submission
    from public.discussion_sessions d where d.run_id=active_run_id
      and d.phase_key=legacy#>>'{current,phase_key}' order by d.vote_round desc limit 1)s3b_activity on true
  where player.room_code=upper(trim(p_room_code));

  return legacy||jsonb_build_object('operations_v1',operations);
end;
$$;

revoke execute on function public.s7_get_teacher_console(text,text) from public;
grant execute on function public.s7_get_teacher_console(text,text) to anon,authenticated;

commit;
