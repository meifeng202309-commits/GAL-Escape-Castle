-- Package B forward fix: ACT11 progress is stored in s6_allocations, not s6_choices.
begin;

create or replace function public.s9_get_player_wait_state(p_room_code text,p_session_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s6_run_state%rowtype;mine public.s6_choices%rowtype;submitted int:=0;role text;engaged boolean:=false;
begin
 p:=public.s1_get_player_by_session(room,p_session_token);g:=public.s2_get_active_run(room);
 select * into s from public.s6_run_state where run_id=g.run_id;
 if not found then return jsonb_build_object('active',false);end if;
 select * into mine from public.s6_choices where run_id=g.run_id and phase_key=s.phase_key and round_no=s.round_no and player_id=p.player_id order by locked_at desc limit 1;
 if s.phase_key='act11_allocation' then
  select count(*) into submitted from public.s6_allocations where run_id=g.run_id;
 else
  select count(*) into submitted from public.s6_choices where run_id=g.run_id and phase_key=s.phase_key and round_no=s.round_no;
 end if;
 select role_key into role from public.s6_allocations where run_id=g.run_id and player_id=p.player_id;
 if role is not null then engaged:=exists(select 1 from public.s6_engagements where run_id=g.run_id and role_key=role and player_id=p.player_id);end if;
 return jsonb_build_object('active',true,'phase_key',s.phase_key,'round_no',s.round_no,
  'my_choice_locked',mine.player_id is not null,'submitted_count',submitted,
  'my_allocation_locked',role is not null,'my_role_key',role,'my_engaged',engaged,
  'engaged_count',(select count(*) from public.s6_engagements where run_id=g.run_id));
end$$;

revoke all on function public.s9_get_player_wait_state(text,text) from public;
grant execute on function public.s9_get_player_wait_state(text,text) to anon,authenticated;
commit;
