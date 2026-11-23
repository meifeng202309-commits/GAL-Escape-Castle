\set ON_ERROR_STOP on
begin;
create temp table ca342_payload as select :'registry_json'::jsonb as recovery;
do $$
declare
  teacher text:='CA342-ASSET-REVIEWER'; original jsonb; recovery jsonb; planned jsonb; result jsonb; candidate_id uuid; seed_id uuid; cue jsonb;
  planned_digest text; recovery_digest text; base_before jsonb; audio_before jsonb;
  cues jsonb:=jsonb_build_array(
    jsonb_build_object('key','audio.gate_opening','version',2,'sha','e2afea0715eb8df87fb20c5df3f77233957489be4fa40a5b29b34e92e7af3e55'),
    jsonb_build_object('key','audio.mechanism_clang','version',2,'sha','598e52b667a712c100294de4b7d874362e18a27713b3318ee55112baee3df834'),
    jsonb_build_object('key','audio.old_alarm_bell','version',2,'sha','b2fb2793f3bf5cf731e20cf997b11ae9b45140f901dd03f91f9f4d894ca3b0bf'),
    jsonb_build_object('key','audio.snake_hiss_short','version',1,'sha','6e09da063bdec6da79a495ca96784ec7bbd9e0e8be0b2c40d38a64fff7aafdf6'),
    jsonb_build_object('key','audio.snakes_approaching','version',2,'sha','f70052670176e50e631313e8c388de414a201e53b625358dfd282e232e99d8e8'),
    jsonb_build_object('key','audio.wet_scraping','version',1,'sha','fbe5707576b680ff01363f3ac4cee9c4f2c717b5f98f362b34ee1654e846c0f9'));
begin
  select p.recovery into original from ca342_payload p;
  recovery:=original||jsonb_build_array(jsonb_build_object(
    'asset_key','shared.library.hidden_door_ajar','display_name','Library — Hidden Door Ajar',
    'aliases',jsonb_build_array('Library 2nd scene','12 图书馆-2nd scene.png'),'asset_type','image',
    'latest_version',1,'active_version',null,'continuity_refs',jsonb_build_array('shared.library'),
    'paired_asset_group',null,'required_anchors','[]'::jsonb,'runtime_required',false));
  planned:=original||jsonb_build_array(jsonb_build_object(
    'asset_key','shared.library.hidden_door_ajar','display_name','Library — Hidden Door Ajar',
    'aliases',jsonb_build_array('Library 2nd scene','12 图书馆-2nd scene.png'),'asset_type','image',
    'latest_version',1,'active_version',1,'continuity_refs',jsonb_build_array('shared.library'),
    'paired_asset_group',null,'required_anchors','[]'::jsonb,'runtime_required',false));
  if jsonb_array_length(original)<>30 or jsonb_array_length(recovery)<>31 or jsonb_array_length(planned)<>31 then raise exception 'Unexpected registry projection size';end if;
  recovery_digest:=encode(extensions.digest(convert_to(recovery::text,'UTF8'),'sha256'),'hex');
  planned_digest:=encode(extensions.digest(convert_to(planned::text,'UTF8'),'sha256'),'hex');
  perform public.s1_create_room('CA342R',teacher,'CA342-G','CA342-A','CA342-L');
  insert into public.asset_manager_reviewers(token_hash,label,enabled)values(public.s1_hash_token(teacher),'CA342 disposable reviewer',true);
  perform public.asset_manager_sync_registry(teacher,encode(extensions.digest(convert_to(original::text,'UTF8'),'sha256'),'hex'),original);

  result:=public.asset_manager_import_candidate('shared.library',jsonb_build_object('version',2,'asset_type','image','creator','VA','mime_type','image/webp','width_px',1536,'height_px',1024,'sha256','1744eadaa32a5b5827004f70d7c420fb23a8c279875901adb7c09cbb64b045a3','ui_anchors',jsonb_build_array(jsonb_build_object('anchor_name','library_unknown_door','x_percent',66,'y_percent',48,'width_percent',4.5,'height_percent',13))));
  seed_id:=(result->>'asset_id')::uuid;perform public.asset_manager_submit_for_review(seed_id);perform public.asset_manager_review(teacher,seed_id,'APPROVED','base seed');perform public.asset_manager_mark_published(teacher,seed_id,'seed/shared.library/v002.webp','1744eadaa32a5b5827004f70d7c420fb23a8c279875901adb7c09cbb64b045a3');perform public.asset_manager_activate_group(teacher,array[seed_id]);
  base_before:=public.asset_resolve('shared.library');
  for cue in select * from jsonb_array_elements(cues) loop
    result:=public.asset_manager_import_candidate(cue->>'key',jsonb_build_object('version',(cue->>'version')::int,'asset_type','audio','creator','VA','mime_type','audio/mpeg','duration_ms',1000,'loopable',false,'sha256',cue->>'sha'));
    seed_id:=(result->>'asset_id')::uuid;perform public.asset_manager_submit_for_review(seed_id);perform public.asset_manager_review(teacher,seed_id,'APPROVED','audio seed');perform public.asset_manager_mark_published(teacher,seed_id,'seed/'||(cue->>'key')||'.mp3',cue->>'sha');perform public.asset_manager_activate_group(teacher,array[seed_id]);
  end loop;
  select jsonb_object_agg(value->>'key',public.asset_resolve(value->>'key')) into audio_before from jsonb_array_elements(cues) item(value);

  result:=public.asset_manager_sync_registry(teacher,planned_digest,planned);
  if result->>'asset_count'<>'31' then raise exception 'Planned projection failed: %',result;end if;
  result:=public.asset_manager_import_candidate('shared.library.hidden_door_ajar',jsonb_build_object('version',1,'asset_type','image','creator','VA','mime_type','image/webp','width_px',1448,'height_px',1086,'sha256','44592196fbc7462b9d00345262b44e7316cde88334ec29af0c6d906a828e419a'));
  candidate_id:=(result->>'asset_id')::uuid;perform public.asset_manager_submit_for_review(candidate_id);perform public.asset_manager_review(teacher,candidate_id,'APPROVED','Teacher-approved CA-341 Library mapping');perform public.asset_manager_mark_published(teacher,candidate_id,'game-assets/shared.library.hidden_door_ajar/v001/shared.library.hidden_door_ajar__v001.webp','44592196fbc7462b9d00345262b44e7316cde88334ec29af0c6d906a828e419a');perform public.asset_manager_activate_group(teacher,array[candidate_id]);
  result:=public.asset_resolve('shared.library.hidden_door_ajar');
  if result->>'ok'<>'true' or result->>'version'<>'1' or result->>'sha256'<>'44592196fbc7462b9d00345262b44e7316cde88334ec29af0c6d906a828e419a' then raise exception 'Ajar resolver mismatch: %',result;end if;
  if public.asset_resolve('shared.library')<>base_before then raise exception 'Ajar activation changed original Library';end if;
  if (select jsonb_object_agg(value->>'key',public.asset_resolve(value->>'key')) from jsonb_array_elements(cues) item(value))<>audio_before then raise exception 'Ajar activation changed live audio';end if;

  result:=public.asset_manager_sync_registry(teacher,recovery_digest,recovery);
  if coalesce((public.asset_resolve('shared.library.hidden_door_ajar')->>'ok')::boolean,false) then raise exception 'Recovery did not disable ajar resolver';end if;
  if public.asset_resolve('shared.library')<>base_before then raise exception 'Recovery changed original Library';end if;
  if (select jsonb_object_agg(value->>'key',public.asset_resolve(value->>'key')) from jsonb_array_elements(cues) item(value))<>audio_before then raise exception 'Recovery changed live audio';end if;
  raise notice 'CA342_PLANNED_RPC_DIGEST=%',planned_digest;raise notice 'CA342_RECOVERY_RPC_DIGEST=%',recovery_digest;
end$$;
rollback;
\echo 'CA342 Library ajar isolated registration/publication/activation/recovery rehearsal passed.'
