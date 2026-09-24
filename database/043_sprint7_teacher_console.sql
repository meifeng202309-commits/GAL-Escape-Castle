-- Sprint 7: authoritative Teacher Console projection for ACT 1-13.
-- ACT 14 completion and export remain Sprint 8 responsibilities.
begin;

alter table public.game_runs
  add column if not exists audit_private_debug_view boolean not null default false;

create or replace function public.s7_set_audit_private_debug(
  p_room_code text,p_teacher_token text,p_enabled boolean
) returns jsonb language plpgsql security definer set search_path=public as $$
declare r text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;
begin
  perform public.s1_assert_teacher(r,p_teacher_token);
  select * into g from public.game_runs where room_code=r and status='active' for update;
  if not found then raise exception 'No active formal run.';end if;
  if p_enabled and g.run_mode<>'audit' then raise exception 'Private debug view is available only in AUDIT mode.';end if;
  update public.game_runs set audit_private_debug_view=p_enabled where run_id=g.run_id;
  select * into s from public.s3_runtime_scene_state where run_id=g.run_id;
  insert into public.runtime_events(run_id,room_code,event_type,details,scene_id,phase_key,step_key,event_source,validity,behavior_scoring)
  values(g.run_id,r,'teacher_audit_private_debug_changed',jsonb_build_object('enabled',p_enabled),s.scene_id,s.phase_key,s.step_key,'teacher_override','valid',false);
  return jsonb_build_object('ok',true,'enabled',p_enabled,'run_mode',g.run_mode);
end$$;

create or replace function public.s7_get_teacher_console(
  p_room_code text,p_teacher_token text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  r text:=upper(trim(p_room_code));g public.game_runs%rowtype;s public.s3_runtime_scene_state%rowtype;
  s5 public.s5_run_state%rowtype;s6 public.s6_run_state%rowtype;d public.discussion_sessions%rowtype;
  act_no int;players jsonb;transcript jsonb;pockets jsonb;group_items jsonb;events jsonb;validity_summary jsonb;audio jsonb;
begin
  perform public.s1_assert_teacher(r,p_teacher_token);
  select * into g from public.game_runs where room_code=r and status='active';
  if not found then return jsonb_build_object('active',false);end if;
  select * into s from public.s3_runtime_scene_state where run_id=g.run_id;
  select * into s6 from public.s6_run_state where run_id=g.run_id;
  if found then act_no:=s6.act_no;else select * into s5 from public.s5_run_state where run_id=g.run_id;end if;
  if act_no is null and s5.run_id is not null then act_no:=s5.act_no;end if;
  if act_no is null then act_no:=nullif(substring(coalesce(s.scene_id,g.scene_id) from 'act([0-9]+)'),'')::int;end if;
  select * into d from public.discussion_sessions where run_id=g.run_id order by started_at desc limit 1;

  select coalesce(jsonb_agg(jsonb_build_object(
    'player_id',p.player_id,'display_name',p.display_name,'role_slot',p.role_slot,
    'online',p.last_seen_at>clock_timestamp()-interval '30 seconds','player_location',pp.player_location,
    'submitted',exists(select 1 from public.runtime_player_decisions x where x.run_id=g.run_id and x.player_id=p.player_id and x.phase_key=coalesce(s.phase_key,g.phase_key))
      or (s.phase_key='private_first_action' and pp.act1_choice_id is not null)
      or (s.phase_key='private_first_meeting' and pp.first_meeting_choice is not null)
      or (s.phase_key='private_route_choice' and pp.act4_choice_id is not null)
      or exists(select 1 from public.s5_votes x where x.run_id=g.run_id and x.player_id=p.player_id and x.phase_key=coalesce(s5.phase_key,s.phase_key))
      or (coalesce(s5.phase_key,'')='act8_private' and exists(select 1 from public.s5_act8_private_choices x where x.run_id=g.run_id and x.player_id=p.player_id))
      or exists(select 1 from public.s6_choices x where x.run_id=g.run_id and x.player_id=p.player_id and x.phase_key=s6.phase_key and x.round_no=s6.round_no)
      or (s6.phase_key='act11_allocation' and exists(select 1 from public.s6_allocations x where x.run_id=g.run_id and x.player_id=p.player_id))
      or (s6.phase_key='act12_stations' and exists(select 1 from public.s6_station_tasks x where x.run_id=g.run_id and x.player_id=p.player_id)),
    'private_value',case when g.run_mode='audit' and g.audit_private_debug_view then coalesce(
      (select x.choice_id from public.s6_choices x where x.run_id=g.run_id and x.player_id=p.player_id and x.phase_key=s6.phase_key and x.round_no=s6.round_no),
      (select x.choice_id from public.s5_act8_private_choices x where x.run_id=g.run_id and x.player_id=p.player_id),
      pp.act4_choice_id,pp.first_meeting_choice,pp.act1_choice_id) end
  ) order by p.role_slot),'[]'::jsonb) into players
  from public.s1_room_players p left join public.s3b_player_progress pp on pp.run_id=g.run_id and pp.player_id=p.player_id where p.room_code=r;

  select coalesce(jsonb_agg(jsonb_build_object('display_name',p.display_name,'role_slot',p.role_slot,'message_text',m.message_text,'created_at',m.created_at) order by m.message_id),'[]'::jsonb)
  into transcript from public.dialogue_messages m join public.s1_room_players p using(player_id) where m.run_id=g.run_id;

  select coalesce(jsonb_agg(jsonb_build_object('player_id',p.player_id,'display_name',p.display_name,'role_slot',p.role_slot,
    'items',(select coalesce(jsonb_agg(jsonb_build_object('item_key',i.item_key,'acquired_at',i.acquired_at) order by i.acquired_at),'[]') from public.s3_player_items i where i.run_id=g.run_id and i.physical_owner_id=p.player_id),
    'observations',(select coalesce(jsonb_agg(jsonb_build_object('observation_key',o.observation_key,'display_text_key',o.display_text_key) order by o.discovered_at),'[]') from public.s3_player_observations o where o.run_id=g.run_id and o.player_id=p.player_id),
    'shared_photos',(select coalesce(jsonb_agg(jsonb_build_object('source_item_key',x.source_item_key,'source_view',x.source_view,'label_text_key',x.label_text_key) order by x.shared_at),'[]') from public.s3_shared_photos x where x.run_id=g.run_id and x.received_by=p.player_id)
  ) order by p.role_slot),'[]'::jsonb) into pockets from public.s1_room_players p where p.room_code=r;

  select coalesce(jsonb_agg(jsonb_build_object('item_key',item_key,'label_text_key',label_text_key,'acquired_at',acquired_at) order by acquired_at),'[]'::jsonb) into group_items from public.s3_group_items where run_id=g.run_id;
  select coalesce(jsonb_agg(jsonb_build_object('event_type',event_type,'scene_id',scene_id,'phase_key',phase_key,'validity',validity,'behavior_scoring',behavior_scoring,'details',details,'created_at',created_at) order by event_id desc),'[]'::jsonb) into events from (select * from public.runtime_events where run_id=g.run_id order by event_id desc limit 50)x;
  select coalesce(jsonb_object_agg(coalesce(x.validity,'unclassified'),x.n),'{}'::jsonb) into validity_summary from (select e.validity,count(*) n from public.runtime_events e where e.run_id=g.run_id group by e.validity)x;
  select jsonb_build_object('current_cue_key',s6.feedback_audio_key,'current_occurrence_id',s6.feedback_audio_occurrence_id,
    'recent',(select coalesce(jsonb_agg(jsonb_build_object('occurrence_id',o.occurrence_id,'cue_key',o.cue_key,'phase_key',o.phase_key,'triggered_at',o.triggered_at,'consumed_count',(select count(*) from public.s6_audio_consumptions c where c.occurrence_id=o.occurrence_id)) order by o.triggered_at desc),'[]') from (select * from public.s6_audio_occurrences where run_id=g.run_id order by triggered_at desc limit 10)o)) into audio;

  return jsonb_build_object('active',true,'run',jsonb_build_object('run_id',g.run_id,'run_mode',g.run_mode,'behavior_dataset_eligible',g.behavior_dataset_eligible,'status',g.status,'audit_private_debug_view',g.audit_private_debug_view),
    'current',jsonb_build_object('act_no',act_no,'scene_id',coalesce(s.scene_id,g.scene_id),'phase_key',coalesce(s.phase_key,g.phase_key),'step_key',coalesce(s.step_key,g.step_key),'display_mode',s.display_mode,'text_key',s.text_key,'current_route',coalesce(s.current_route_target,(select group_route from public.s3b_run_state where run_id=g.run_id)),'wayfinding_target',s.wayfinding_target),
    'countdown',case when d.discussion_session_id is null then null else jsonb_build_object('status',d.status,'phase_deadline',d.phase_deadline,'remaining_seconds',greatest(0,extract(epoch from d.phase_deadline-clock_timestamp())::int)) end,
    'players',players,'discussion',jsonb_build_object('discussion_session_id',d.discussion_session_id,'status',d.status,'topic',d.topic,'messages',transcript),
    'pockets',pockets,'group_items',group_items,'audio',audio,'events',events,'behavior_validity',validity_summary,
    'override_history',(select coalesce(jsonb_agg(to_jsonb(o) order by o.created_at desc),'[]') from public.teacher_overrides o where o.run_id=g.run_id),
    'export',jsonb_build_object('game_completed',false,'export_ready',false,'enabled',false,'filename_preview','GAL_CASTLE_'||r||'_'||g.run_id||'.json'));
end$$;

revoke execute on function public.s7_set_audit_private_debug(text,text,boolean),public.s7_get_teacher_console(text,text) from public;
grant execute on function public.s7_set_audit_private_debug(text,text,boolean),public.s7_get_teacher_console(text,text) to anon,authenticated;
commit;
