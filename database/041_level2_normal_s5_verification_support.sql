-- Teacher-authenticated Sprint 5 deadline acceleration for NORMAL closure verification.
begin;

create function public.s5_verify_expire_discussion(
 p_room_code text,
 p_teacher_token text,
 p_expected_discussion_session_id uuid
) returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code)); g public.game_runs%rowtype; d public.discussion_sessions%rowtype;
begin
 perform public.s1_assert_teacher(room,p_teacher_token);
 g:=public.s2_get_active_run(room);
 if g.run_mode<>'normal' then raise exception 'Closure verification requires NORMAL mode.'; end if;
 select * into d from public.discussion_sessions
 where discussion_session_id=p_expected_discussion_session_id and run_id=g.run_id and scene_id in('act6_portrait','act7_clock_room','act8_route') and status='discussion'
 for update;
 if not found then raise exception 'Current Sprint 5 discussion was not found.'; end if;
 update public.discussion_sessions set phase_deadline=clock_timestamp()-interval '1 second'
 where discussion_session_id=d.discussion_session_id;
 perform public.s2_refresh_discussion(d.discussion_session_id);
 return jsonb_build_object('ok',true,'discussion_session_id',d.discussion_session_id,'phase_key',d.phase_key);
end$$;

grant execute on function public.s5_verify_expire_discussion(text,text,uuid) to anon,authenticated;

commit;
