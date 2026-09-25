-- Reconcile canonical Teacher Override event evidence with the authoritative scope.
-- Migrations 001-056 are deployed history and remain immutable.
begin;

alter function public.teacher_apply_override(text,text,text,text) rename to teacher_apply_override_v056;
revoke all on function public.teacher_apply_override_v056(text,text,text,text) from public,anon,authenticated;

create function public.teacher_apply_override(
  p_room_code text,p_teacher_token text,p_override_action text,p_reason text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  v_result jsonb;v_override_id uuid;v_scope jsonb;v_updated integer;
begin
  v_result:=public.teacher_apply_override_v056(p_room_code,p_teacher_token,p_override_action,p_reason);

  if (v_result->>'source_scene',v_result->>'source_phase') in
     (('act2_first_contact','meeting_discussion'),('act5_route_discussion','discussion')) then
    v_override_id:=(v_result->>'override_id')::uuid;
    select o.invalidated_scope into strict v_scope
    from public.teacher_overrides o where o.override_id=v_override_id;

    update public.runtime_events e
    set details=jsonb_set(e.details,'{invalidated_scope}',v_scope,true)
    where e.interaction_id=v_override_id and e.event_type='teacher_override';
    get diagnostics v_updated=row_count;
    if v_updated<>1 then
      raise exception 'Expected one canonical Teacher Override event, updated %.',v_updated;
    end if;
  end if;
  return v_result;
end$$;

revoke all on function public.teacher_apply_override(text,text,text,text) from public;
grant execute on function public.teacher_apply_override(text,text,text,text) to anon,authenticated;
commit;
