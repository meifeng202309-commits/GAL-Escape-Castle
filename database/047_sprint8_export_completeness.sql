-- Sprint 8 additive export-completeness correction. Migration 046 remains immutable.
begin;
create or replace function public.s8_export_session(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));g public.game_runs%rowtype;f public.s8_finalizations%rowtype;stamp text;suffix text;doc jsonb;csv text;
begin
 perform public.s1_assert_teacher(room,p_teacher_token);g:=public.s2_get_active_run(room);select*into f from public.s8_finalizations where run_id=g.run_id;
 if not g.export_ready or not g.session_integrity_verified or not found then raise exception 'Session export is not ready.';end if;
 stamp:=to_char(g.run_started_at at time zone 'UTC','YYYY-MM-DD_HH24-MI-SS');suffix:=case when g.run_mode='audit'then'_audit'else''end;
 doc:=jsonb_build_object(
  'header',jsonb_build_object('run_id',g.run_id,'room_code',g.room_code,'run_started_at',g.run_started_at,'run_mode',g.run_mode,'behavior_dataset_eligible',g.behavior_dataset_eligible,'export_schema_version',f.export_schema_version,'exported_at',f.finalized_at,'session_integrity_verified',g.session_integrity_verified),
  'final_state',jsonb_build_object('scene_id',g.scene_id,'phase_key',g.phase_key,'step_key',g.step_key,'game_completed',g.game_completed,'export_ready',g.export_ready,'completed_at',g.completed_at,'integrity_report',f.integrity_report),
  'players',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'role_slot',role_slot,'display_name',display_name)order by role_slot),'[]')from public.s1_room_players where room_code=room),
  'evidence',jsonb_build_object(
    'physical_items',(select coalesce(jsonb_agg(jsonb_build_object('item_key',item_key,'physical_owner_id',physical_owner_id,'acquired_at',acquired_at)order by acquired_at,item_key),'[]')from public.s3_player_items where run_id=g.run_id),
    'observations',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'observation_key',observation_key,'display_text_key',display_text_key,'discovered_at_scene',discovered_at_scene,'discovered_at',discovered_at)order by discovered_at,observation_key),'[]')from public.s3_player_observations where run_id=g.run_id),
    'shared_photos',(select coalesce(jsonb_agg(jsonb_build_object('received_by',received_by,'shared_by',shared_by,'source_item_key',source_item_key,'source_view',source_view,'label_text_key',label_text_key,'shared_at',shared_at)order by shared_at,photo_copy_id),'[]')from public.s3_shared_photos where run_id=g.run_id),
    'group_items',(select coalesce(jsonb_agg(jsonb_build_object('item_key',item_key,'label_text_key',label_text_key,'acquired_at',acquired_at)order by acquired_at,item_key),'[]')from public.s3_group_items where run_id=g.run_id)
  ),
  'knowledge_provenance',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'knowledge_key',knowledge_key,'source',source,'scene_id',scene_id,'source_player_id',source_player_id,'source_item_key',source_item_key,'delivered_at',delivered_at)order by delivered_at,acquisition_id),'[]')from public.s3_player_knowledge where run_id=g.run_id),
  'discussion_transcript',(select coalesce(jsonb_agg(jsonb_build_object('message_id',message_id,'discussion_session_id',discussion_session_id,'scene_id',scene_id,'phase_key',phase_key,'step_key',step_key,'player_id',player_id,'message_text',message_text,'created_at',created_at)order by created_at,message_id),'[]')from public.dialogue_messages where run_id=g.run_id),
  'votes',(select coalesce(jsonb_agg(jsonb_build_object('decision_id',decision_id,'discussion_session_id',discussion_session_id,'scene_id',scene_id,'phase_key',phase_key,'step_key',step_key,'vote_round',vote_round,'player_id',player_id,'choice_id',choice_id,'locked_at',locked_at,'validity',validity,'context_provenance',context_provenance)order by locked_at,decision_id),'[]')from public.runtime_player_decisions where run_id=g.run_id),
  'sprint5',jsonb_build_object(
    'votes',(select coalesce(jsonb_agg(jsonb_build_object('phase_key',phase_key,'vote_round',vote_round,'player_id',player_id,'choice_id',choice_id,'locked_at',locked_at,'validity','valid')order by locked_at),'[]')from public.s5_votes where run_id=g.run_id),
    'private_choices',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'choice_id',choice_id,'locked_at',locked_at,'validity','valid','context_provenance',jsonb_build_object('source','player'))order by locked_at),'[]')from public.s5_act8_private_choices where run_id=g.run_id)
  ),
  'sprint6',jsonb_build_object(
    'choices',(select coalesce(jsonb_agg(jsonb_build_object('phase_key',phase_key,'round_no',round_no,'player_id',player_id,'choice_id',choice_id,'response_latency_ms',response_latency_ms,'role_context',role_context,'locked_at',locked_at,'validity','valid','context_provenance',jsonb_build_object('source','player'))order by locked_at),'[]')from public.s6_choices where run_id=g.run_id),
    'allocations',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'role_key',role_key,'locked_at',locked_at,'validity','valid')order by locked_at),'[]')from public.s6_allocations where run_id=g.run_id),
    'station_tasks',(select coalesce(jsonb_agg(jsonb_build_object('role_key',role_key,'player_id',player_id,'task_key',task_key,'completed_at',completed_at,'validity','valid')order by completed_at),'[]')from public.s6_station_tasks where run_id=g.run_id),
    'engagements',(select coalesce(jsonb_agg(jsonb_build_object('role_key',role_key,'player_id',player_id,'engaged_at',engaged_at,'validity','valid')order by engaged_at),'[]')from public.s6_engagements where run_id=g.run_id),
    'audio',(select coalesce(jsonb_agg(jsonb_build_object('occurrence_id',o.occurrence_id,'cue_key',o.cue_key,'phase_key',o.phase_key,'cinematic_stage',o.cinematic_stage,'triggered_at',o.triggered_at,'consumptions',(select coalesce(jsonb_agg(jsonb_build_object('player_id',c.player_id,'outcome',c.outcome,'consumed_at',c.consumed_at)order by c.consumed_at),'[]')from public.s6_audio_consumptions c where c.occurrence_id=o.occurrence_id))order by o.triggered_at,o.occurrence_id),'[]')from public.s6_audio_occurrences o where o.run_id=g.run_id)
  ),
  'pressure_choices',(select coalesce(jsonb_agg(jsonb_build_object('player_id',player_id,'choice_id',choice_id,'role_context',role_context,'response_latency_ms',response_latency_ms,'locked_at',locked_at,'validity','valid','context_provenance',jsonb_build_object('source','player'))order by locked_at),'[]')from public.s6_choices where run_id=g.run_id and phase_key='act12_pressure'),
  'teacher_overrides',(select coalesce(jsonb_agg(jsonb_build_object('override_id',o.override_id,'override_action',o.override_action,'reason',o.reason,'source_scene',o.source_scene,'source_phase',o.source_phase,'source_step',o.source_step,'invalidated_scope',o.invalidated_scope,'created_at',o.created_at,'field_validity',(select coalesce(jsonb_agg(jsonb_build_object('player_id',v.player_id,'semantic_field',v.semantic_field,'value',v.value,'validity',v.validity)),'[]')from public.teacher_override_validity v where v.override_id=o.override_id))order by o.created_at),'[]')from public.teacher_overrides o where o.run_id=g.run_id),
  'behavior_validity',(select coalesce(jsonb_agg(jsonb_build_object('scene_id',scene_id,'phase_key',phase_key,'step_key',step_key,'validity',coalesce(validity,'partial'),'context_provenance',coalesce(details->'context_provenance','{}'::jsonb))order by event_id),'[]')from public.runtime_events where run_id=g.run_id)
 );
 with ledger as(
  select created_at as ts,event_type,run_id,scene_id,phase_key,step_key,actor_player_id as actor_id,details,coalesce(validity,'partial')validity,0 source_order,event_id from public.runtime_events where run_id=g.run_id
  union all
  select occurred_at,event_type,run_id,case when act_no is null then null else'act'||act_no end,phase_key,null,player_id,details,'valid',1,event_id from public.act6_13_event_ledger where run_id=g.run_id
 )select 'timestamp,event_type,run_id,scene_id,phase_key,step_key,actor_id,payload_json,validity'||E'\n'||coalesce(string_agg(
  '"'||replace(coalesce(ts::text,''),'"','""')||'","'||replace(event_type,'"','""')||'","'||run_id||'","'||replace(coalesce(scene_id,''),'"','""')||'","'||replace(coalesce(phase_key,''),'"','""')||'","'||replace(coalesce(step_key,''),'"','""')||'","'||coalesce(actor_id::text,'')||'","'||replace(details::text,'"','""')||'","'||replace(validity,'"','""')||'"',E'\n' order by ts,source_order,event_id),'')into csv from ledger;
 return jsonb_build_object('json_filename',stamp||'_'||g.run_id||suffix||'.json','csv_filename',stamp||'_'||g.run_id||suffix||'.csv','json',doc,'csv',csv);
end$$;
revoke all on function public.s8_export_session(text,text) from public;
grant execute on function public.s8_export_session(text,text) to anon,authenticated;
commit;
