-- Narrow Level2 residual closure: IDA2-001-R1/R2 and IDA2-005-R1.
-- Migrations 001-054 are deployed history and remain immutable.
begin;

alter function public.teacher_apply_override(text,text,text,text) rename to teacher_apply_override_v054;
revoke all on function public.teacher_apply_override_v054(text,text,text,text) from public,anon,authenticated;

create function public.teacher_apply_override(
  p_room_code text,p_teacher_token text,p_override_action text,p_reason text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  result jsonb;run_id uuid;override_id uuid;source_scene text;source_phase text;
  discussion_id uuid;scope jsonb:='[]'::jsonb;semantic_field text;
begin
  result:=public.teacher_apply_override_v054(p_room_code,p_teacher_token,p_override_action,p_reason);
  override_id:=(result->>'override_id')::uuid;
  source_scene:=result->>'source_scene';source_phase:=result->>'source_phase';
  select o.run_id into strict run_id from public.teacher_overrides o where o.override_id=override_id;

  if source_scene='act2_first_contact' and source_phase='meeting_discussion' then
    update public.s3_runtime_scene_state
    set current_route_target='library',wayfinding_target='library',updated_at=now()
    where s3_runtime_scene_state.run_id=run_id;
    semantic_field:='act2_final_vote';
  elsif source_scene='act5_route_discussion' and source_phase='discussion' then
    semantic_field:='act5_final_vote';
  end if;

  if semantic_field is not null then
    select d.discussion_session_id into discussion_id
    from public.discussion_sessions d
    where d.run_id=run_id and d.scene_id=source_scene and d.phase_key=source_phase
    order by d.started_at desc limit 1;

    select coalesce(jsonb_agg(jsonb_build_object('player_id',p.player_id,'fields',jsonb_build_array(semantic_field)) order by p.role_slot),'[]'::jsonb)
    into scope
    from public.s1_room_players p
    where p.room_code=upper(trim(p_room_code))
      and not exists(
        select 1 from public.runtime_player_decisions v
        where v.run_id=run_id and v.discussion_session_id=discussion_id and v.player_id=p.player_id
      );

    insert into public.teacher_override_validity(override_id,run_id,player_id,semantic_field,value)
    select override_id,run_id,p.player_id,semantic_field,null
    from public.s1_room_players p
    where p.room_code=upper(trim(p_room_code))
      and not exists(
        select 1 from public.runtime_player_decisions v
        where v.run_id=run_id and v.discussion_session_id=discussion_id and v.player_id=p.player_id
      )
    on conflict do nothing;

    update public.teacher_overrides set invalidated_scope=scope where teacher_overrides.override_id=override_id;
    result:=jsonb_set(result,'{invalidated_scope}',scope,true);
  end if;
  return result;
end$$;

revoke all on function public.teacher_apply_override(text,text,text,text) from public;
grant execute on function public.teacher_apply_override(text,text,text,text) to anon,authenticated;
commit;
