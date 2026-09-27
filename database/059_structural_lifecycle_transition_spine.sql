-- Package A: one formal startup boundary and an observable ACT5 -> ACT6 handoff.
begin;

create or replace function public.s9_start_formal_game(
  p_room_code text,
  p_teacher_token text,
  p_run_mode text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  started jsonb;
  initialized jsonb;
begin
  -- Both calls execute in this transaction. Any initialization failure rolls
  -- back the run insert, so clients can never observe a committed half-start.
  started:=public.s2_start_run(p_room_code,p_teacher_token,p_run_mode);
  initialized:=public.s3b_initialize_flow(p_room_code,p_teacher_token);
  return started || jsonb_build_object(
    'formal_state','active',
    'canonical_flow_initialized',true,
    'canonical_run_id',initialized->'run_id'
  );
end;
$$;

revoke all on function public.s9_start_formal_game(text,text,text) from public;
grant execute on function public.s9_start_formal_game(text,text,text) to anon,authenticated;

alter table public.s5_run_state
  add column if not exists act6_entered_at timestamptz;

-- Rows that existed before this migration were already visibly inside ACT6+.
update public.s5_run_state set act6_entered_at=coalesce(act6_entered_at,updated_at);

create or replace function public.s9_enter_act6(
  p_room_code text,
  p_session_token text,
  p_expected_run_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  room text:=upper(trim(p_room_code));
  player public.s1_room_players%rowtype;
  active_run public.game_runs%rowtype;
  sprint5 public.s5_run_state%rowtype;
begin
  player:=public.s1_get_player_by_session(room,p_session_token);
  active_run:=public.s2_get_active_run(room);
  if active_run.run_id is null or active_run.run_id<>p_expected_run_id then
    raise exception 'The formal run changed. Refresh before entering ACT 6.';
  end if;
  perform 1 from public.game_runs where run_id=active_run.run_id for update;
  if not exists(select 1 from public.s3b_run_state where run_id=active_run.run_id and terminal_state='SPRINT3B_COMPLETE') then
    raise exception 'ACT 5 is not complete.';
  end if;
  select * into sprint5 from public.s5_run_state where run_id=active_run.run_id for update;
  if not found then raise exception 'ACT 6 preparation is unavailable.'; end if;
  if sprint5.act6_entered_at is null then
    update public.s5_run_state set act6_entered_at=now(),updated_at=now() where run_id=active_run.run_id;
    perform public.s2_log_event(active_run.run_id,room,null,'act6_entered',player.player_id,
      jsonb_build_object('event_source','player_transition','behavior_scoring',false));
  end if;
  return jsonb_build_object('ok',true,'run_id',active_run.run_id,'act6_entered',true);
end;
$$;

revoke all on function public.s9_enter_act6(text,text,uuid) from public;
grant execute on function public.s9_enter_act6(text,text,uuid) to anon,authenticated;

commit;
