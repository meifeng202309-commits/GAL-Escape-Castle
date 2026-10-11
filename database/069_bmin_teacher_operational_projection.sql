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
    'discussion_or_vote_state',case when legacy_player->>'submitted'='true'then'SUBMITTED'else'WAITING'end,
    'assignment_role',case when owner_domain='S6'then allocation.role_key end,
    'engagement_state',case
      when owner_validity<>'VALID'then'UNKNOWN'
      when owner_domain<>'S6'or sprint6.act_no<11 then'NOT_APPLICABLE'
      when allocation.role_key is null then'ALLOCATION_OPEN'
      when engagement.player_id is not null then'ENGAGED'
      else'ASSIGNED_NOT_ENGAGED'end,
    'task_state',case
      when owner_validity<>'VALID'then'UNKNOWN'
      when owner_domain<>'S6'or sprint6.act_no<11 or allocation.role_key is null then'NOT_APPLICABLE'
      when task.player_id is not null then'COMPLETE'
      else'PENDING'end,
    'connection_state',case when player.last_seen_at>clock_timestamp()-interval'30 seconds'then'ONLINE'else'OFFLINE'end,
    'source_domain',owner_domain,
    'source_identity',jsonb_build_object('run_id',active_run_id,'table_name',case owner_domain when'S3B'then's3b_player_progress'when'S5'then's5_run_state'when'S6'then's6_run_state'end),
    'validity',case when owner_validity<>'VALID'or(owner_domain='S3B'and progress.run_id is null)then'INVARIANT_BREACH'else'VALID'end,
    'reason_code',case when owner_reason is not null then owner_reason when owner_domain='S3B'and progress.run_id is null then'MISSING_S3B_PLAYER_PROGRESS'end
  ) order by player.role_slot),'[]'::jsonb) into operations
  from public.s1_room_players player
  left join public.s3b_player_progress progress on progress.run_id=active_run_id and progress.player_id=player.player_id
  left join public.s6_allocations allocation on allocation.run_id=active_run_id and allocation.player_id=player.player_id
  left join public.s6_engagements engagement on engagement.run_id=active_run_id and engagement.player_id=player.player_id
  left join public.s6_station_tasks task on task.run_id=active_run_id and task.player_id=player.player_id
  left join lateral(
    select value as legacy_player from jsonb_array_elements(coalesce(legacy->'players','[]'::jsonb))
    where value->>'player_id'=player.player_id::text limit 1
  )legacy_row on true
  where player.room_code=upper(trim(p_room_code));

  return legacy||jsonb_build_object('operations_v1',operations);
end;
$$;

revoke execute on function public.s7_get_teacher_console(text,text) from public;
grant execute on function public.s7_get_teacher_console(text,text) to anon,authenticated;

commit;
