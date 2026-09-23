-- Sprint 4 Level 1 corrections: independent review authority, canonical sync,
-- recoverable lifecycle and atomic paired activation.
create table public.asset_manager_reviewers(token_hash text primary key,label text not null,enabled boolean not null default true,created_at timestamptz not null default now());
alter table public.asset_manager_reviewers enable row level security;
create function public.asset_manager_assert_reviewer(p_token text) returns void language plpgsql security definer set search_path=public as $$begin if not exists(select 1 from public.asset_manager_reviewers where token_hash=public.s1_hash_token(p_token) and enabled) then raise exception 'Invalid Asset Manager reviewer authority.';end if;end$$;
revoke execute on function public.asset_manager_assert_reviewer(text) from public,anon,authenticated;

alter function public.asset_manager_review(text,uuid,text,text) rename to asset_manager_review_pre024;
alter function public.asset_manager_state(text) rename to asset_manager_state_pre024;
alter function public.asset_manager_save_anchors(text,uuid,jsonb) rename to asset_manager_save_anchors_pre024;
revoke execute on function public.asset_manager_review_pre024(text,uuid,text,text),public.asset_manager_state_pre024(text),public.asset_manager_save_anchors_pre024(text,uuid,jsonb) from public,anon,authenticated;
create function public.asset_manager_review(p_teacher_token text,p_asset_id uuid,p_decision text,p_reviewer text) returns jsonb language plpgsql security definer set search_path=public as $$begin perform public.asset_manager_assert_reviewer(p_teacher_token);return public.asset_manager_review_pre024(p_teacher_token,p_asset_id,p_decision,p_reviewer);end$$;
create function public.asset_manager_state(p_teacher_token text) returns jsonb language plpgsql security definer set search_path=public as $$begin perform public.asset_manager_assert_reviewer(p_teacher_token);return public.asset_manager_state_pre024(p_teacher_token);end$$;
create function public.asset_manager_save_anchors(p_teacher_token text,p_asset_id uuid,p_ui_anchors jsonb) returns jsonb language plpgsql security definer set search_path=public as $$begin perform public.asset_manager_assert_reviewer(p_teacher_token);return public.asset_manager_save_anchors_pre024(p_teacher_token,p_asset_id,p_ui_anchors);end$$;
grant execute on function public.asset_manager_review(text,uuid,text,text),public.asset_manager_state(text),public.asset_manager_save_anchors(text,uuid,jsonb) to anon,authenticated;

create or replace function public.asset_manager_sync_registry(p_teacher_token text,p_registry_sha256 text,p_assets jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare a jsonb;computed text;total int;distinct_total int;
begin
 perform public.asset_manager_assert_reviewer(p_teacher_token);
 if jsonb_typeof(p_assets)<>'array' then raise exception 'Invalid registry projection.';end if;
 select count(*),count(distinct x->>'asset_key') into total,distinct_total from jsonb_array_elements(p_assets)x;
 if total<>distinct_total or exists(select 1 from jsonb_array_elements(p_assets)x where coalesce(x->>'asset_key','')='' or x->>'asset_type' not in('image','audio')) then raise exception 'Registry contains duplicate or invalid keys.';end if;
 computed:=encode(extensions.digest(convert_to(p_assets::text,'UTF8'),'sha256'),'hex');if computed<>p_registry_sha256 then raise exception 'Registry content hash mismatch.';end if;
 delete from public.asset_registry_projection r where not exists(select 1 from jsonb_array_elements(p_assets)x where x->>'asset_key'=r.asset_key);
 for a in select * from jsonb_array_elements(p_assets) loop
  insert into public.asset_registry_projection(asset_key,display_name,aliases,asset_type,latest_version,active_version,continuity_refs,paired_asset_group,required_anchors,runtime_required,registry_sha256,projected_at)
  values(a->>'asset_key',a->>'display_name',coalesce(a->'aliases','[]'),a->>'asset_type',coalesce((a->>'latest_version')::int,0),(a->>'active_version')::int,coalesce(a->'continuity_refs','[]'),a->>'paired_asset_group',coalesce(a->'required_anchors','[]'),coalesce((a->>'runtime_required')::boolean,true),computed,now())
  on conflict(asset_key) do update set display_name=excluded.display_name,aliases=excluded.aliases,asset_type=excluded.asset_type,latest_version=excluded.latest_version,active_version=excluded.active_version,continuity_refs=excluded.continuity_refs,paired_asset_group=excluded.paired_asset_group,required_anchors=excluded.required_anchors,runtime_required=excluded.runtime_required,registry_sha256=computed,projected_at=now();
 end loop;return jsonb_build_object('ok',true,'asset_count',total,'registry_sha256',computed);
end$$;
revoke execute on function public.asset_manager_sync_registry(text,text,jsonb) from public,anon,authenticated;grant execute on function public.asset_manager_sync_registry(text,text,jsonb) to service_role;

create function public.asset_manager_import_candidate(p_asset_key text,p_candidate jsonb) returns jsonb language plpgsql security definer set search_path=public as $$
declare r public.asset_registry_projection%rowtype;c public.asset_candidates%rowtype;v int;
begin select * into r from public.asset_registry_projection where asset_key=p_asset_key for update;if not found then raise exception 'ASSET KEY NOT FOUND';end if;v:=(p_candidate->>'version')::int;if v<>r.latest_version or p_candidate->>'asset_type'<>r.asset_type or p_candidate->>'sha256'!~'^[0-9a-f]{64}$' then raise exception 'Candidate identity mismatch.';end if;
 select * into c from public.asset_candidates where asset_key=p_asset_key and version=v for update;if found then return jsonb_build_object('ok',true,'asset_id',c.asset_id,'status',c.status,'reused',true);end if;
 insert into public.asset_candidates(asset_key,version,asset_type,creator,status,final_prompt,revision_note,technical_notes,paired_asset_group,view_name,ui_anchors,width_px,height_px,mime_type,duration_ms,loopable,license_source,loudness_note,continuity_refs,required_anchors,sha256)
 values(p_asset_key,v,r.asset_type,coalesce(p_candidate->>'creator','VA'),'UPLOADED',p_candidate->>'final_prompt',p_candidate->>'revision_note',p_candidate->>'technical_notes',r.paired_asset_group,p_candidate->>'view_name',coalesce(p_candidate->'ui_anchors','[]'),(p_candidate->>'width_px')::int,(p_candidate->>'height_px')::int,p_candidate->>'mime_type',(p_candidate->>'duration_ms')::int,(p_candidate->>'loopable')::boolean,p_candidate->>'license_source',p_candidate->>'loudness_note',r.continuity_refs,r.required_anchors,p_candidate->>'sha256') returning * into c;return jsonb_build_object('ok',true,'asset_id',c.asset_id,'status',c.status,'reused',false);end$$;
create function public.asset_manager_submit_for_review(p_asset_id uuid) returns jsonb language plpgsql security definer set search_path=public as $$declare c public.asset_candidates%rowtype;begin select * into c from public.asset_candidates where asset_id=p_asset_id for update;if c.status='PENDING_REVIEW' then return jsonb_build_object('ok',true,'status',c.status,'reused',true);end if;if c.status<>'UPLOADED' then raise exception 'Candidate is not uploaded.';end if;update public.asset_candidates set status='PENDING_REVIEW' where asset_id=p_asset_id;return jsonb_build_object('ok',true,'status','PENDING_REVIEW','reused',false);end$$;
revoke execute on function public.asset_manager_import_candidate(text,jsonb),public.asset_manager_submit_for_review(uuid) from public,anon,authenticated;grant execute on function public.asset_manager_import_candidate(text,jsonb),public.asset_manager_submit_for_review(uuid) to service_role;

revoke execute on function public.asset_manager_activate(text,uuid),public.asset_manager_activate_pre022(text,uuid) from service_role;
create function public.asset_manager_activate_group(p_teacher_token text,p_asset_ids uuid[]) returns jsonb language plpgsql security definer set search_path=public as $$
declare cand public.asset_candidates%rowtype;grp text;expected int;provided int;missing text;
begin if cardinality(p_asset_ids)=0 then raise exception 'Activation group is empty.';end if;
 perform public.asset_manager_assert_reviewer(p_teacher_token);
 perform 1 from public.asset_candidates where asset_id=any(p_asset_ids) order by asset_key for update;
 select paired_asset_group into grp from public.asset_candidates where asset_id=p_asset_ids[1];
 if grp is null and cardinality(p_asset_ids)<>1 then raise exception 'Unpaired activation accepts one candidate.';end if;
 if grp is not null then select count(*) into expected from public.asset_registry_projection where paired_asset_group=grp;select count(*) into provided from public.asset_candidates where asset_id=any(p_asset_ids) and paired_asset_group=grp;if expected<>provided or provided<>cardinality(p_asset_ids) then raise exception 'Complete paired activation group is required.';end if;end if;
 if exists(select 1 from public.asset_candidates ac join public.asset_registry_projection r using(asset_key) where ac.asset_id=any(p_asset_ids) and (ac.status<>'APPROVED' or ac.published_at is null or r.active_version is distinct from ac.version)) then raise exception 'Activation group is not eligible.';end if;
 for cand in select * from public.asset_candidates where asset_id=any(p_asset_ids) loop
  select x into missing from jsonb_array_elements_text(cand.required_anchors)x where not exists(select 1 from jsonb_array_elements(cand.ui_anchors)a where a->>'anchor_name'=x) limit 1;
  if missing is not null then raise exception 'Required anchor is missing: %',missing;end if;
 end loop;
 update public.asset_candidates set status='SUPERSEDED' where asset_key in(select asset_key from public.asset_candidates where asset_id=any(p_asset_ids)) and status='ACTIVE';update public.asset_candidates set status='ACTIVE' where asset_id=any(p_asset_ids);return jsonb_build_object('ok',true,'activated',cardinality(p_asset_ids));end$$;
revoke execute on function public.asset_manager_activate_group(text,uuid[]) from public,anon,authenticated;grant execute on function public.asset_manager_activate_group(text,uuid[]) to service_role;

revoke execute on function public.asset_manager_rollback(text,uuid) from service_role;
create function public.asset_manager_rollback_group(p_teacher_token text,p_asset_ids uuid[]) returns jsonb language plpgsql security definer set search_path=public as $$
begin
 perform public.asset_manager_assert_reviewer(p_teacher_token);
 if cardinality(p_asset_ids)=0 or exists(select 1 from public.asset_candidates where asset_id=any(p_asset_ids) and (status not in('APPROVED','SUPERSEDED') or published_at is null)) then raise exception 'Rollback group is not eligible.';end if;
 update public.asset_candidates set status='APPROVED' where asset_id=any(p_asset_ids);
 return public.asset_manager_activate_group(p_teacher_token,p_asset_ids);
end$$;
revoke execute on function public.asset_manager_rollback_group(text,uuid[]) from public,anon,authenticated;grant execute on function public.asset_manager_rollback_group(text,uuid[]) to service_role;
