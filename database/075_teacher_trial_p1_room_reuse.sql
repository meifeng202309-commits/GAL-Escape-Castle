begin;

create or replace function public.s10_prepare_room_for_next_run(
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

  select * into g from public.game_runs
    where run_id=p_expected_run_id and room_code=room and status in('active','completed')
    for update;
  if not found then raise exception 'Stale or invalid reusable run identity.';end if;
  if g.status='completed' and exists(
    select 1 from public.game_runs where room_code=room and status='active' and run_id<>g.run_id
  ) then raise exception 'A different active run must be selected before preparing this room.';end if;

  if g.status='active' then
    update public.game_runs set status='interrupted',interrupted_at=clock_timestamp(),
      interruption_reason='teacher_prepare_next_run',active_override_id=null where run_id=g.run_id;
  end if;
  generation:=gen_random_uuid();
  update public.s1_rooms set session_generation=generation,updated_at=clock_timestamp()where room_code=room;
  update public.s1_room_players set session_token_hash=null,session_generation=null,joined_at=null,last_seen_at=null where room_code=room;
  insert into public.s1_game_events(room_code,event_type,details)
    values(room,'teacher_room_prepared_for_next_run',jsonb_build_object(
      'previous_run_id',g.run_id,'previous_run_status',g.status,'new_session_generation',generation,'rows_deleted',false));
  return jsonb_build_object('ok',true,'room_code',room,'previous_run_id',g.run_id,
    'previous_run_status',g.status,'session_generation',generation,'players_released',3,'rows_deleted',false);
end;
$$;

revoke all on function public.s10_prepare_room_for_next_run(text,text,uuid)from public;
grant execute on function public.s10_prepare_room_for_next_run(text,text,uuid)to anon,authenticated;

commit;
