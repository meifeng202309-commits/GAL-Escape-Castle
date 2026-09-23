-- Sprint 4 focused re-audit corrections: one import authority and durable
-- operational evidence for grouped activation and rollback.
revoke execute on function public.asset_manager_register_candidate(text,jsonb) from service_role;

create or replace function public.asset_manager_import_candidate(p_asset_key text,p_candidate jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r public.asset_registry_projection%rowtype;c public.asset_candidates%rowtype;v int;
begin
 select * into r from public.asset_registry_projection where asset_key=p_asset_key for update;
 if not found then raise exception 'ASSET KEY NOT FOUND';end if;
 v:=(p_candidate->>'version')::int;
 if v<>r.latest_version or p_candidate->>'asset_type'<>r.asset_type or p_candidate->>'sha256'!~'^[0-9a-f]{64}$' then raise exception 'Candidate identity mismatch.';end if;
 select * into c from public.asset_candidates where asset_key=p_asset_key and version=v for update;
 if found then
  if c.sha256 is distinct from p_candidate->>'sha256'
   or c.asset_type is distinct from p_candidate->>'asset_type'
   or c.mime_type is distinct from p_candidate->>'mime_type'
   or c.width_px is distinct from (p_candidate->>'width_px')::int
   or c.height_px is distinct from (p_candidate->>'height_px')::int
   or c.duration_ms is distinct from (p_candidate->>'duration_ms')::int
   or c.loopable is distinct from (p_candidate->>'loopable')::boolean
  then raise exception 'Conflicting candidate replay identity.';end if;
  return jsonb_build_object('ok',true,'asset_id',c.asset_id,'status',c.status,'reused',true);
 end if;
 insert into public.asset_candidates(asset_key,version,asset_type,creator,status,final_prompt,revision_note,technical_notes,paired_asset_group,view_name,ui_anchors,width_px,height_px,mime_type,duration_ms,loopable,license_source,loudness_note,continuity_refs,required_anchors,sha256)
 values(p_asset_key,v,r.asset_type,coalesce(p_candidate->>'creator','VA'),'UPLOADED',p_candidate->>'final_prompt',p_candidate->>'revision_note',p_candidate->>'technical_notes',r.paired_asset_group,p_candidate->>'view_name',coalesce(p_candidate->'ui_anchors','[]'),(p_candidate->>'width_px')::int,(p_candidate->>'height_px')::int,p_candidate->>'mime_type',(p_candidate->>'duration_ms')::int,(p_candidate->>'loopable')::boolean,p_candidate->>'license_source',p_candidate->>'loudness_note',r.continuity_refs,r.required_anchors,p_candidate->>'sha256') returning * into c;
 insert into public.asset_events(asset_key,event_type,version,details) values(c.asset_key,'candidate_uploaded',c.version,jsonb_build_object('asset_id',c.asset_id,'sha256',c.sha256));
 return jsonb_build_object('ok',true,'asset_id',c.asset_id,'status',c.status,'reused',false);
end$$;
revoke execute on function public.asset_manager_import_candidate(text,jsonb) from public,anon,authenticated;
grant execute on function public.asset_manager_import_candidate(text,jsonb) to service_role;

create function public.asset_manager_transition_group(p_teacher_token text,p_asset_ids uuid[],p_event_type text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare cand public.asset_candidates%rowtype;grp text;expected int;provided int;missing text;
begin
 if p_event_type not in('activated','rolled_back') then raise exception 'Invalid asset transition event.';end if;
 if cardinality(p_asset_ids)=0 then raise exception 'Activation group is empty.';end if;
 perform public.asset_manager_assert_reviewer(p_teacher_token);
 perform 1 from public.asset_candidates where asset_id=any(p_asset_ids) order by asset_key for update;
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

create or replace function public.asset_manager_activate_group(p_teacher_token text,p_asset_ids uuid[])
returns jsonb language sql security definer set search_path=public as $$select public.asset_manager_transition_group(p_teacher_token,p_asset_ids,'activated')$$;
revoke execute on function public.asset_manager_activate_group(text,uuid[]) from public,anon,authenticated;
grant execute on function public.asset_manager_activate_group(text,uuid[]) to service_role;

create or replace function public.asset_manager_rollback_group(p_teacher_token text,p_asset_ids uuid[])
returns jsonb language plpgsql security definer set search_path=public as $$
begin
 perform public.asset_manager_assert_reviewer(p_teacher_token);
 if cardinality(p_asset_ids)=0 or exists(select 1 from public.asset_candidates where asset_id=any(p_asset_ids) and (status not in('APPROVED','SUPERSEDED') or published_at is null)) then raise exception 'Rollback group is not eligible.';end if;
 update public.asset_candidates set status='APPROVED' where asset_id=any(p_asset_ids);
 return public.asset_manager_transition_group(p_teacher_token,p_asset_ids,'rolled_back');
end$$;
revoke execute on function public.asset_manager_rollback_group(text,uuid[]) from public,anon,authenticated;
grant execute on function public.asset_manager_rollback_group(text,uuid[]) to service_role;
