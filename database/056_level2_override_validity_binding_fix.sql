-- Correct migration055 PL/pgSQL variable/column ambiguity additively.
-- Migrations 001-055 are deployed history and remain immutable.
begin;

alter function public.teacher_apply_override(text,text,text,text) rename to teacher_apply_override_v055;
revoke all on function public.teacher_apply_override_v055(text,text,text,text) from public,anon,authenticated;

create function public.teacher_apply_override(
  p_room_code text,p_teacher_token text,p_override_action text,p_reason text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  v_result jsonb;v_run_id uuid;v_override_id uuid;v_source_scene text;v_source_phase text;
  v_discussion_id uuid;v_scope jsonb:='[]'::jsonb;v_semantic_field text;
begin
  v_result:=public.teacher_apply_override_v054(p_room_code,p_teacher_token,p_override_action,p_reason);
  v_override_id:=(v_result->>'override_id')::uuid;
  v_source_scene:=v_result->>'source_scene';v_source_phase:=v_result->>'source_phase';
  select o.run_id into strict v_run_id from public.teacher_overrides o where o.override_id=v_override_id;

  if v_source_scene='act2_first_contact' and v_source_phase='meeting_discussion' then
    update public.s3_runtime_scene_state
    set current_route_target='library',wayfinding_target='library',updated_at=now()
    where s3_runtime_scene_state.run_id=v_run_id;
    v_semantic_field:='act2_final_vote';
  elsif v_source_scene='act5_route_discussion' and v_source_phase='discussion' then
    v_semantic_field:='act5_final_vote';
  end if;

  if v_semantic_field is not null then
    select d.discussion_session_id into v_discussion_id
    from public.discussion_sessions d
    where d.run_id=v_run_id and d.scene_id=v_source_scene and d.phase_key=v_source_phase
    order by d.started_at desc limit 1;

    select coalesce(jsonb_agg(jsonb_build_object('player_id',p.player_id,'fields',jsonb_build_array(v_semantic_field)) order by p.role_slot),'[]'::jsonb)
    into v_scope
    from public.s1_room_players p
    where p.room_code=upper(trim(p_room_code))
      and not exists(
        select 1 from public.runtime_player_decisions d
        where d.run_id=v_run_id and d.discussion_session_id=v_discussion_id and d.player_id=p.player_id
      );

    insert into public.teacher_override_validity(override_id,run_id,player_id,semantic_field,value)
    select v_override_id,v_run_id,p.player_id,v_semantic_field,null
    from public.s1_room_players p
    where p.room_code=upper(trim(p_room_code))
      and not exists(
        select 1 from public.runtime_player_decisions d
        where d.run_id=v_run_id and d.discussion_session_id=v_discussion_id and d.player_id=p.player_id
      )
    on conflict do nothing;

    update public.teacher_overrides o set invalidated_scope=v_scope where o.override_id=v_override_id;
    v_result:=jsonb_set(v_result,'{invalidated_scope}',v_scope,true);
  end if;
  return v_result;
end$$;

revoke all on function public.teacher_apply_override(text,text,text,text) from public;
grant execute on function public.teacher_apply_override(text,text,text,text) to anon,authenticated;
commit;
