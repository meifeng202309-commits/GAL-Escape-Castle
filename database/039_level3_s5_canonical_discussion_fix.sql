-- Preserve Sprint 5's canonical DiscussionRoom when ACT5 automatically enters ACT6.
begin;

create or replace function public.s5_ensure_initialized(p_run uuid) returns boolean
language plpgsql security definer set search_path=public as $$
declare room text; created_new boolean:=false; sid uuid;
begin
 perform 1 from public.game_runs where run_id=p_run for update;
 if not exists(select 1 from public.s3b_run_state where run_id=p_run and terminal_state='SPRINT3B_COMPLETE') then return false; end if;
 insert into public.s5_run_state(run_id) values(p_run) on conflict(run_id) do nothing;
 if found then
  created_new:=true;
  insert into public.s5_rounds(run_id,phase_key,vote_round,topic_text_key)
  values(p_run,'act6_vote',1,'act06.001') returning discussion_session_id into sid;
  perform public.s5_configure_discussion(sid,'act6_vote');
  perform public.s5_set_scene(p_run,'act6_portrait','act6_vote','round_1','ACTION_SCREEN','act06.001');
  update public.s3_runtime_scene_state set allow_share_photo=true where run_id=p_run;
  select room_code into room from public.game_runs where run_id=p_run;
  perform public.s2_log_event(p_run,room,sid,'s5_initialized',null,jsonb_build_object('event_source','automatic_transition','behavior_scoring',false));
 end if;
 return created_new;
end$$;

revoke execute on function public.s5_ensure_initialized(uuid) from public,anon,authenticated;

commit;
