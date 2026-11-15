\set ON_ERROR_STOP on
begin;

do $$
declare
  teacher text:='ACT9-ASSET-TEACHER';
  red_id uuid;
  both_id uuid;
  result jsonb;
begin
  perform public.s1_create_room('A9ASSET',teacher,'A9-GITTE','A9-ANNA','A9-LINDA');
  insert into public.asset_manager_reviewers(token_hash,label,enabled)values(public.s1_hash_token(teacher),'isolated ACT9 lifecycle reviewer',true);
  result:=public.asset_manager_sync_registry(teacher,repeat('a',64),jsonb_build_array(
    jsonb_build_object('asset_key','shared.great_hall.red_first','display_name','Great Hall — Red Door Open','aliases','[]'::jsonb,'asset_type','image','latest_version',1,'active_version',1,'continuity_refs','["shared.great_hall"]'::jsonb,'required_anchors','[]'::jsonb,'runtime_required',false),
    jsonb_build_object('asset_key','shared.great_hall.both_open','display_name','Great Hall — Red and Blue Doors Open','aliases','[]'::jsonb,'asset_type','image','latest_version',1,'active_version',1,'continuity_refs','["shared.great_hall"]'::jsonb,'required_anchors','[]'::jsonb,'runtime_required',false)
  ));
  if result->>'asset_count'<>'2' then raise exception 'Variant registry projection count mismatch: %',result;end if;

  result:=public.asset_manager_register_candidate(teacher,jsonb_build_object('asset_key','shared.great_hall.red_first','version',1,'asset_type','image','creator','VA','width_px',1448,'height_px',1086,'sha256','af463e9ae529d5f7de8935f7e7794b4879cd2f15635d9617139fb52fb7ac9936'));
  red_id:=(result->>'asset_id')::uuid;
  perform public.asset_manager_review(teacher,red_id,'APPROVED','Teacher-approved VA handoff');
  perform public.asset_manager_mark_published(teacher,red_id,'isolated/shared.great_hall.red_first/v001.webp','af463e9ae529d5f7de8935f7e7794b4879cd2f15635d9617139fb52fb7ac9936');
  perform public.asset_manager_activate(teacher,red_id);
  result:=public.asset_resolve('shared.great_hall.red_first');
  if result->>'ok'<>'true' or result->>'storage_path'<>'isolated/shared.great_hall.red_first/v001.webp' then raise exception 'Red-first resolve failed: %',result;end if;

  result:=public.asset_manager_register_candidate(teacher,jsonb_build_object('asset_key','shared.great_hall.both_open','version',1,'asset_type','image','creator','VA','width_px',1448,'height_px',1086,'sha256','338bbed29fd64537741615e76f5ddd52f688263ae23c734de3ffb63b42381284'));
  both_id:=(result->>'asset_id')::uuid;
  perform public.asset_manager_review(teacher,both_id,'APPROVED','Teacher-approved VA handoff');
  perform public.asset_manager_mark_published(teacher,both_id,'isolated/shared.great_hall.both_open/v001.webp','338bbed29fd64537741615e76f5ddd52f688263ae23c734de3ffb63b42381284');
  perform public.asset_manager_activate(teacher,both_id);
  result:=public.asset_resolve('shared.great_hall.both_open');
  if result->>'ok'<>'true' or result->>'storage_path'<>'isolated/shared.great_hall.both_open/v001.webp' then raise exception 'Both-open resolve failed: %',result;end if;
end$$;

rollback;
\echo 'ACT9 isolated registry/register/review/publish/activate/resolve transaction passed.'
