\set ON_ERROR_STOP on
begin;

create temp table ca331_payload as
select :'registry_json'::jsonb as planned;

do $$
declare
  teacher text:='CA331-ASSET-REVIEWER';
  planned jsonb;
  recovery jsonb;
  planned_digest text;
  recovery_digest text;
  result jsonb;
  base_id uuid;
  red_id uuid;
  both_id uuid;
  cue_id uuid;
  cue jsonb;
  cues jsonb:=jsonb_build_array(
    jsonb_build_object('key','audio.gate_opening','version',2,'path','game-assets/audio.gate_opening__v002.mp3','sha','e2afea0715eb8df87fb20c5df3f77233957489be4fa40a5b29b34e92e7af3e55','duration',4310),
    jsonb_build_object('key','audio.mechanism_clang','version',2,'path','game-assets/audio.mechanism_clang__v002.mp3','sha','598e52b667a712c100294de4b7d874362e18a27713b3318ee55112baee3df834','duration',1411),
    jsonb_build_object('key','audio.old_alarm_bell','version',2,'path','game-assets/audio.old_alarm_bell__v002.mp3','sha','b2fb2793f3bf5cf731e20cf997b11ae9b45140f901dd03f91f9f4d894ca3b0bf','duration',4937),
    jsonb_build_object('key','audio.snake_hiss_short','version',1,'path','game-assets/audio.snake_hiss_short__v001.mp3','sha','6e09da063bdec6da79a495ca96784ec7bbd9e0e8be0b2c40d38a64fff7aafdf6','duration',850),
    jsonb_build_object('key','audio.snakes_approaching','version',2,'path','game-assets/audio.snakes_approaching__v002.mp3','sha','f70052670176e50e631313e8c388de414a201e53b625358dfd282e232e99d8e8','duration',14864),
    jsonb_build_object('key','audio.wet_scraping','version',1,'path','game-assets/audio.wet_scraping__v001.mp3','sha','fbe5707576b680ff01363f3ac4cee9c4f2c717b5f98f362b34ee1654e846c0f9','duration',3400)
  );
  base_before jsonb;
  audio_before jsonb;
  unrelated_before jsonb;
begin
  select p.planned into planned from ca331_payload p;
  select jsonb_agg(
    case when asset->>'asset_key' in('shared.great_hall.red_first','shared.great_hall.both_open')
      then jsonb_set(asset,'{active_version}','null'::jsonb)
      else asset end order by ordinal
  ) into recovery
  from jsonb_array_elements(planned) with ordinality as item(asset,ordinal);
  planned_digest:=encode(extensions.digest(convert_to(planned::text,'UTF8'),'sha256'),'hex');
  recovery_digest:=encode(extensions.digest(convert_to(recovery::text,'UTF8'),'sha256'),'hex');

  if jsonb_array_length(planned)<>30 or jsonb_array_length(recovery)<>30 then raise exception 'Complete registry payload count changed';end if;
  if planned_digest='dd8c4a692bea7c6575b4bd76865e5a4cf336f45786fbd78e2fe9c2fc8dc20ee2' then raise exception 'RPC digest incorrectly equals source-file digest';end if;

  perform public.s1_create_room('CA331R',teacher,'CA331-G','CA331-A','CA331-L');
  insert into public.asset_manager_reviewers(token_hash,label,enabled)
  values(public.s1_hash_token(teacher),'CA331 disposable release reviewer',true);

  begin
    perform public.asset_manager_sync_registry(teacher,'dd8c4a692bea7c6575b4bd76865e5a4cf336f45786fbd78e2fe9c2fc8dc20ee2',planned);
    raise exception 'Source-file digest was incorrectly accepted by sync RPC';
  exception when others then
    if sqlerrm not like '%Registry content hash mismatch%' then raise;end if;
  end;

  result:=public.asset_manager_sync_registry(teacher,recovery_digest,recovery);
  if result->>'asset_count'<>'30' or result->>'registry_sha256'<>recovery_digest then raise exception 'Recovery projection seed failed: %',result;end if;

  result:=public.asset_manager_import_candidate('shared.great_hall',jsonb_build_object(
    'version',2,'asset_type','image','creator','VA','mime_type','image/webp','width_px',1280,'height_px',960,
    'sha256',repeat('a',64),'ui_anchors',jsonb_build_array(
      jsonb_build_object('anchor_name','great_hall_red_door'),jsonb_build_object('anchor_name','great_hall_blue_door'),jsonb_build_object('anchor_name','great_hall_black_door'))));
  base_id:=(result->>'asset_id')::uuid;
  perform public.asset_manager_submit_for_review(base_id);
  perform public.asset_manager_review(teacher,base_id,'APPROVED','CA331 disposable reviewer');
  perform public.asset_manager_mark_published(teacher,base_id,'seed/shared.great_hall/v002.webp',repeat('a',64));
  perform public.asset_manager_activate_group(teacher,array[base_id]);
  base_before:=public.asset_resolve('shared.great_hall');
  for cue in select * from jsonb_array_elements(cues) loop
    result:=public.asset_manager_import_candidate(cue->>'key',jsonb_build_object(
      'version',(cue->>'version')::int,'asset_type','audio','creator','VA','mime_type','audio/mpeg',
      'duration_ms',(cue->>'duration')::int,'loopable',false,'sha256',cue->>'sha'));
    cue_id:=(result->>'asset_id')::uuid;
    perform public.asset_manager_submit_for_review(cue_id);
    perform public.asset_manager_review(teacher,cue_id,'APPROVED','CA334 authorized audio seed');
    perform public.asset_manager_mark_published(teacher,cue_id,cue->>'path',cue->>'sha');
    perform public.asset_manager_activate_group(teacher,array[cue_id]);
  end loop;
  select jsonb_object_agg(value->>'key',public.asset_resolve(value->>'key')) into audio_before from jsonb_array_elements(cues) item(value);
  select to_jsonb(r)-'registry_sha256'-'projected_at' into unrelated_before from public.asset_registry_projection r where asset_key='opening.gitte_room';

  result:=public.asset_manager_sync_registry(teacher,planned_digest,planned);
  if result->>'asset_count'<>'30' or result->>'registry_sha256'<>planned_digest then raise exception 'Planned projection failed: %',result;end if;
  if (select count(distinct registry_sha256) from public.asset_registry_projection)<>1 then raise exception 'Projection digest is not uniform';end if;
  if (select count(*) from public.asset_registry_projection)<>30 then raise exception 'Projection did not retain all 30 rows';end if;
  if (select jsonb_object_agg(value->>'key',public.asset_resolve(value->>'key')) from jsonb_array_elements(cues) item(value))<>audio_before then raise exception 'Planned projection changed approved audio resolution';end if;

  result:=public.asset_manager_import_candidate('shared.great_hall.red_first',jsonb_build_object('version',1,'asset_type','image','creator','VA','mime_type','image/webp','width_px',1448,'height_px',1086,'sha256','af463e9ae529d5f7de8935f7e7794b4879cd2f15635d9617139fb52fb7ac9936'));
  red_id:=(result->>'asset_id')::uuid;
  perform public.asset_manager_submit_for_review(red_id);
  perform public.asset_manager_review(teacher,red_id,'APPROVED','CA331 disposable reviewer');
  perform public.asset_manager_mark_published(teacher,red_id,'release/shared.great_hall.red_first/v001.webp','af463e9ae529d5f7de8935f7e7794b4879cd2f15635d9617139fb52fb7ac9936');
  perform public.asset_manager_activate_group(teacher,array[red_id]);

  result:=public.asset_manager_import_candidate('shared.great_hall.both_open',jsonb_build_object('version',1,'asset_type','image','creator','VA','mime_type','image/webp','width_px',1448,'height_px',1086,'sha256','338bbed29fd64537741615e76f5ddd52f688263ae23c734de3ffb63b42381284'));
  both_id:=(result->>'asset_id')::uuid;
  perform public.asset_manager_submit_for_review(both_id);
  perform public.asset_manager_review(teacher,both_id,'APPROVED','CA331 disposable reviewer');
  perform public.asset_manager_mark_published(teacher,both_id,'release/shared.great_hall.both_open/v001.webp','338bbed29fd64537741615e76f5ddd52f688263ae23c734de3ffb63b42381284');
  perform public.asset_manager_activate_group(teacher,array[both_id]);

  result:=public.asset_resolve('shared.great_hall.red_first');
  if result->>'ok'<>'true' or result->>'version'<>'1' or result->>'storage_path'<>'release/shared.great_hall.red_first/v001.webp' then raise exception 'Red resolver mismatch: %',result;end if;
  result:=public.asset_resolve('shared.great_hall.both_open');
  if result->>'ok'<>'true' or result->>'version'<>'1' or result->>'storage_path'<>'release/shared.great_hall.both_open/v001.webp' then raise exception 'Both resolver mismatch: %',result;end if;
  if public.asset_resolve('shared.great_hall')<>base_before then raise exception 'Base resolver changed during variant activation';end if;

  result:=public.asset_manager_sync_registry(teacher,recovery_digest,recovery);
  if result->>'registry_sha256'<>recovery_digest then raise exception 'Recovery projection digest mismatch';end if;
  if coalesce((public.asset_resolve('shared.great_hall.red_first')->>'ok')::boolean,false) or coalesce((public.asset_resolve('shared.great_hall.both_open')->>'ok')::boolean,false) then raise exception 'Recovery did not disable variant resolution';end if;
  if public.asset_resolve('shared.great_hall')<>base_before then raise exception 'Recovery changed base resolution';end if;
  if (select jsonb_object_agg(value->>'key',public.asset_resolve(value->>'key')) from jsonb_array_elements(cues) item(value))<>audio_before then raise exception 'Recovery changed approved audio resolution';end if;
  if (select to_jsonb(r)-'registry_sha256'-'projected_at' from public.asset_registry_projection r where asset_key='opening.gitte_room')<>unrelated_before then raise exception 'Recovery changed an unrelated semantic row';end if;

  raise notice 'CA331_PLANNED_RPC_DIGEST=%',planned_digest;
  raise notice 'CA331_RECOVERY_RPC_DIGEST=%',recovery_digest;
end$$;

rollback;
\echo 'CA331 full registry projection, effective lifecycle entry points and reversal passed.'
