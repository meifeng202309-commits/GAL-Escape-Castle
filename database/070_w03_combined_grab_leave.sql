-- W03 source-only combined GRAB + leave action. UNAPPLIED.
begin;

create table public.s3b_action_receipts(
  run_id uuid not null references public.game_runs(run_id),
  player_id uuid not null references public.s1_room_players(player_id),
  client_request_id uuid not null,
  action_key text not null check(action_key='grab_leave'),
  canonical_payload jsonb not null,
  committed_result jsonb not null,
  committed_at timestamptz not null default now(),
  primary key(run_id,player_id,client_request_id),
  unique(run_id,player_id,action_key)
);
alter table public.s3b_action_receipts enable row level security;

create function public.s3b_grab_and_leave(
  p_room_code text,
  p_session_token text,
  p_client_request_id uuid,
  p_expected_run_id uuid
)returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  room text:=upper(trim(p_room_code));
  player public.s1_room_players%rowtype;
  active_run public.game_runs%rowtype;
  progress public.s3b_player_progress%rowtype;
  scene public.s3_runtime_scene_state%rowtype;
  prior public.s3b_action_receipts%rowtype;
  payload jsonb;
  leave_result jsonb;
  result jsonb;
  item_keys jsonb;
  discussion_id uuid;
begin
  if p_client_request_id is null then raise exception 'W03 request identity is required.';end if;
  if p_expected_run_id is null then raise exception 'W03 expected run identity is required.';end if;

  player:=public.s1_get_player_by_session(room,p_session_token);
  select * into active_run from public.game_runs
    where room_code=room and status='active' for update;
  if not found then raise exception 'No active formal run.';end if;
  if active_run.run_id<>p_expected_run_id then raise exception 'W03 expected run identity is stale.';end if;

  payload:=jsonb_build_object('action','grab_leave','expected_run_id',p_expected_run_id);
  select * into prior from public.s3b_action_receipts
    where run_id=active_run.run_id and player_id=player.player_id
      and client_request_id=p_client_request_id;
  if found then
    if prior.action_key<>'grab_leave'or prior.canonical_payload<>payload then
      raise exception 'W03 request identity reused with different content.';
    end if;
    return prior.committed_result||jsonb_build_object('idempotent_replay',true);
  end if;

  select * into progress from public.s3b_player_progress
    where run_id=active_run.run_id and player_id=player.player_id for update;
  if not found then raise exception 'W03 Player progress is unavailable.';end if;
  if progress.grab_complete or progress.left_start_room then
    raise exception 'W03 combined action is already committed under another request identity.';
  end if;
  if progress.first_meeting_locked_at is null then
    raise exception 'First meeting choice must be locked before the combined action.';
  end if;
  select * into scene from public.s3_runtime_scene_state where run_id=active_run.run_id;
  if scene.scene_id is distinct from'act2_first_contact'
     or scene.phase_key is distinct from'private_first_meeting' then
    raise exception 'W03 combined action is unavailable in the current phase.';
  end if;

  perform public.s3b_log_formal_event_at_context(
    active_run.run_id,'grab_completed',player.player_id,'player',
    scene.scene_id,scene.phase_key,scene.step_key,
    jsonb_build_object('combined_action',true),'valid',false,
    p_client_request_id,p_client_request_id
  );
  perform public.s3b_grab_pre014(p_room_code,p_session_token);

  perform public.s3b_log_formal_event_at_context(
    active_run.run_id,'start_room_left',player.player_id,'player',
    scene.scene_id,scene.phase_key,scene.step_key,
    jsonb_build_object('combined_action',true),'valid',false,
    p_client_request_id,p_client_request_id
  );
  leave_result:=public.s3b_leave_start_room_pre014(p_room_code,p_session_token);

  select coalesce(jsonb_agg(item_key order by item_key),'[]'::jsonb) into item_keys
    from public.s3_player_items
    where run_id=active_run.run_id and physical_owner_id=player.player_id;
  select discussion_session_id into discussion_id from public.discussion_sessions
    where run_id=active_run.run_id and scene_id='act2_first_contact'
      and phase_key='meeting_discussion' order by vote_round desc limit 1;

  result:=jsonb_build_object(
    'ok',true,'run_id',active_run.run_id,'player_id',player.player_id,
    'client_request_id',p_client_request_id,'idempotent_replay',false,
    'grab_complete',true,'left_start_room',true,'player_location','corridor',
    'acquired_item_keys',item_keys,
    'discussion_ready',coalesce((leave_result->>'discussion_ready')::boolean,false),
    'discussion_session_id',discussion_id
  );
  insert into public.s3b_action_receipts(
    run_id,player_id,client_request_id,action_key,canonical_payload,committed_result
  )values(active_run.run_id,player.player_id,p_client_request_id,'grab_leave',payload,result);
  return result;
end;
$$;

revoke all on table public.s3b_action_receipts from public,anon,authenticated;
revoke execute on function public.s3b_grab_and_leave(text,text,uuid,uuid) from public;
grant execute on function public.s3b_grab_and_leave(text,text,uuid,uuid) to anon,authenticated;

-- The combined RPC is the only supported client mutation after this migration.
revoke execute on function public.s3b_grab(text,text),public.s3b_leave_start_room(text,text)
  from public,anon,authenticated;
revoke execute on function public.s3b_grab_pre014(text,text),public.s3b_leave_start_room_pre014(text,text),
  public.s3b_grab_pre011(text,text),public.s3b_leave_start_room_pre011(text,text)
  from public,anon,authenticated;

commit;
