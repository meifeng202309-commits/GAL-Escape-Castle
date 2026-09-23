-- Sprint 4 adjacent corrections: exact group identity and serialized registry authority.
create or replace function public.asset_manager_transition_group(p_teacher_token text,p_asset_ids uuid[],p_event_type text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare cand public.asset_candidates%rowtype;grp text;expected int;provided int;resolved int;missing text;
begin
 if p_event_type not in('activated','rolled_back') then raise exception 'Invalid asset transition event.';end if;
 if p_asset_ids is null or cardinality(p_asset_ids)=0 or array_position(p_asset_ids,null) is not null then raise exception 'Activation group requires non-null candidate ids.';end if;
 select count(distinct id) into provided from unnest(p_asset_ids) as u(id);
 if provided<>cardinality(p_asset_ids) then raise exception 'Activation group contains duplicate candidate ids.';end if;
 select count(*) into resolved from public.asset_candidates where asset_id=any(p_asset_ids);
 if resolved<>cardinality(p_asset_ids) then raise exception 'Activation group target does not exist.';end if;
 perform public.asset_manager_assert_reviewer(p_teacher_token);

 -- Registry rows are the canonical version authority. Lock them before the
 -- candidate rows and retain both locks through event and status writes.
 perform 1 from public.asset_registry_projection r
 where r.asset_key in(select ac.asset_key from public.asset_candidates ac where ac.asset_id=any(p_asset_ids))
 order by r.asset_key for update;
 perform 1 from public.asset_candidates where asset_id=any(p_asset_ids) order by asset_key for update;

 select count(*) into resolved from public.asset_candidates where asset_id=any(p_asset_ids);
 if resolved<>cardinality(p_asset_ids) then raise exception 'Activation group target changed during transition.';end if;
 select paired_asset_group into grp from public.asset_candidates where asset_id=p_asset_ids[1];
 if grp is null and cardinality(p_asset_ids)<>1 then raise exception 'Unpaired activation accepts one candidate.';end if;
 if grp is not null then
  select count(*) into expected from public.asset_registry_projection where paired_asset_group=grp;
  select count(*) into provided from public.asset_candidates where asset_id=any(p_asset_ids) and paired_asset_group=grp;
  if expected<>provided or provided<>cardinality(p_asset_ids) then raise exception 'Complete paired activation group is required.';end if;
 end if;
 if exists(select 1 from public.asset_candidates ac join public.asset_registry_projection r using(asset_key) where ac.asset_id=any(p_asset_ids) and (ac.status<>'APPROVED' or ac.published_at is null or r.active_version is distinct from ac.version)) then raise exception 'Activation group is not eligible.';end if;
 for cand in select * from public.asset_candidates where asset_id=any(p_asset_ids) loop
  select x into missing from jsonb_array_elements_text(cand.required_anchors)x where not exists(select 1 from jsonb_array_elements(cand.ui_anchors)a where a->>'anchor_name'=x) limit 1;
  if missing is not null then raise exception 'Required anchor is missing: %',missing;end if;
 end loop;
 insert into public.asset_events(asset_key,event_type,version,details)
 select ac.asset_key,p_event_type,ac.version,jsonb_build_object('asset_id',ac.asset_id,'paired_asset_group',ac.paired_asset_group,'group_asset_ids',to_jsonb(p_asset_ids),'previous_active_version',(select old.version from public.asset_candidates old where old.asset_key=ac.asset_key and old.status='ACTIVE' limit 1))
 from public.asset_candidates ac where ac.asset_id=any(p_asset_ids);
 update public.asset_candidates set status='SUPERSEDED' where asset_key in(select asset_key from public.asset_candidates where asset_id=any(p_asset_ids)) and status='ACTIVE';
 update public.asset_candidates set status='ACTIVE' where asset_id=any(p_asset_ids);
 return jsonb_build_object('ok',true,'activated',cardinality(p_asset_ids),'event_type',p_event_type);
end$$;
revoke execute on function public.asset_manager_transition_group(text,uuid[],text) from public,anon,authenticated,service_role;
