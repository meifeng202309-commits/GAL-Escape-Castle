-- Independent Sprint 3B audit remediation, part 1.
-- Apply after 012_sprint3b_internal_wrapper_lockdown_and_route_delivery.sql.
-- Covers IDA-001, IDA-002, IDA-005, IDA-009 and IDA-010.

do $migration$
begin
  if exists (
    select 1
    from public.discussion_sessions
    where status in ('discussion','voting','waiting_for_missing_player')
    group by run_id
    having count(*) > 1
  ) then
    raise exception 'Migration 013 blocked: a run has multiple open discussion sessions.';
  end if;
end
$migration$;

create unique index if not exists discussion_sessions_one_open_per_run
  on public.discussion_sessions(run_id)
  where status in ('discussion','voting','waiting_for_missing_player');

alter table public.dialogue_messages
  add column if not exists client_request_id uuid;

create unique index if not exists dialogue_messages_request_identity
  on public.dialogue_messages(run_id,player_id,client_request_id)
  where client_request_id is not null;

-- Generic Sprint 2 discussion creation is unavailable after a run enters the
-- canonical Sprint 3 scene flow. The renamed implementation remains internal.
alter function public.s2_open_discussion(
  text,text,text,integer,integer,boolean,boolean,jsonb,text,integer,integer,text,boolean
) rename to s2_open_discussion_pre013;

revoke execute on function public.s2_open_discussion_pre013(
  text,text,text,integer,integer,boolean,boolean,jsonb,text,integer,integer,text,boolean
) from public,anon,authenticated;

create or replace function public.s2_open_discussion(
  p_room_code text,
  p_teacher_token text,
  p_topic text,
  p_discussion_time_limit_sec integer,
  p_vote_time_limit_sec integer,
  p_show_initial_choices boolean,
  p_require_final_vote boolean,
  p_vote_options jsonb,
  p_tie_policy text,
  p_revote_window_sec integer,
  p_max_revotes integer,
  p_fallback_resolution text,
  p_silent_texting_mode boolean
) returns jsonb
language plpgsql security definer set search_path=public as $$
declare
  v_room text:=upper(trim(p_room_code));
  v_run public.game_runs%rowtype;
begin
  perform public.s1_assert_teacher(v_room,p_teacher_token);
  select * into v_run from public.game_runs
  where room_code=v_room and status='active' for update;
  if not found then raise exception 'No active formal run. Start a run first.'; end if;
  if exists(select 1 from public.s3_runtime_scene_state where run_id=v_run.run_id) then
    raise exception 'Generic DiscussionRoom is unavailable during canonical gameplay.';
  end if;
  return public.s2_open_discussion_pre013(
    p_room_code,p_teacher_token,p_topic,p_discussion_time_limit_sec,
    p_vote_time_limit_sec,p_show_initial_choices,p_require_final_vote,
    p_vote_options,p_tie_policy,p_revote_window_sec,p_max_revotes,
    p_fallback_resolution,p_silent_texting_mode
  );
end;
$$;

-- Apply an already resolved canonical discussion to Game Track exactly once.
-- This function is internal and is called in the vote transaction and during
-- reconnect reconciliation.
create or replace function public.s3b_apply_resolved_discussion_internal(
  p_run_id uuid,
  p_discussion_session_id uuid
) returns jsonb
language plpgsql security definer set search_path=public as $$
declare
  v_run public.game_runs%rowtype;
  v_session public.discussion_sessions%rowtype;
  v_state public.s3b_run_state%rowtype;
  v_result text;
  v_applied boolean:=false;
begin
  select * into v_run from public.game_runs where run_id=p_run_id for update;
  if not found then raise exception 'Formal run not found.'; end if;

  select * into v_session from public.discussion_sessions
  where discussion_session_id=p_discussion_session_id and run_id=p_run_id
  for update;
  if not found or v_session.status<>'resolved' then
    return jsonb_build_object('applied',false,'reason','not_resolved');
  end if;

  v_result:=coalesce(v_session.outcome->>'choice_id',v_session.outcome->>'resolution_id');
  if v_result is null then
    return jsonb_build_object('applied',false,'reason','no_resolution');
  end if;

  select * into v_state from public.s3b_run_state where run_id=p_run_id for update;
  if not found then
    return jsonb_build_object('applied',false,'reason','not_sprint3b');
  end if;

  if v_session.scene_id='act2_first_contact' then
    if v_result not in ('library','great_hall','main_gate','west_tower','chapel') then
      raise exception 'Invalid ACT 2 meeting resolution.';
    end if;
    if v_state.final_meeting_result is not null then
      if v_state.final_meeting_result<>v_result then
        raise exception 'ACT 2 meeting resolution conflicts with applied Game Track state.';
      end if;
      return jsonb_build_object('applied',false,'reason','already_applied','result',v_result);
    end if;
    update public.s3b_run_state
    set final_meeting_result=v_result,updated_at=now()
    where run_id=p_run_id and final_meeting_result is null;
    update public.s3_runtime_scene_state
    set current_route_target=v_result,
        wayfinding_target=case when v_result='library' then 'library' end,
        updated_at=now()
    where run_id=p_run_id;
    perform public.s3b_set_scene(
      p_run_id,'act2_route_update','route_update',v_result,
      'CRITICAL_INFO','act02.032'
    );
    v_applied:=true;
  elsif v_session.scene_id='act5_route_discussion' then
    if v_result not in ('known','unknown','inspect_first') then
      raise exception 'Invalid ACT 5 route resolution.';
    end if;
    if v_state.group_route is not null or v_state.pending_post_inspection_route then
      if v_result='inspect_first' and v_state.unknown_passage_inspected then
        return jsonb_build_object('applied',false,'reason','already_applied','result',v_result);
      elsif v_state.group_route=v_result then
        return jsonb_build_object('applied',false,'reason','already_applied','result',v_result);
      end if;
      raise exception 'ACT 5 resolution conflicts with applied Game Track state.';
    end if;
    if v_result='inspect_first' then
      update public.s3b_run_state
      set unknown_passage_inspected=true,pending_post_inspection_route=true,
          group_route=null,terminal_state=null,updated_at=now()
      where run_id=p_run_id;
      perform public.s3b_set_scene(
        p_run_id,'act5_inspect_first','post_inspection_route','inspect_sequence',
        'CRITICAL_INFO','act04-05.015'
      );
    else
      update public.s3b_run_state
      set group_route=v_result,pending_post_inspection_route=false,
          terminal_state='SPRINT3B_COMPLETE',updated_at=now()
      where run_id=p_run_id;
      perform public.s3b_set_scene(
        p_run_id,'act5_route_resolved','terminal',v_result,
        'CINEMATIC_MESSAGE',case v_result when 'known' then 'act04-05.019' else 'act04-05.024' end
      );
    end if;
    v_applied:=true;
  end if;

  if v_applied then
    perform public.s2_log_event(
      p_run_id,v_run.room_code,p_discussion_session_id,
      's3b_discussion_resolution_applied',null,
      jsonb_build_object(
        'scene_id',v_session.scene_id,
        'phase_key',v_session.phase_key,
        'step_key',v_session.step_key,
        'resolution_id',v_result,
        'resolution_source',coalesce(v_session.outcome->>'resolution_source','player_majority'),
        'behavior_scoring',false
      )
    );
  end if;
  return jsonb_build_object('applied',v_applied,'result',v_result);
end;
$$;

revoke execute on function public.s3b_apply_resolved_discussion_internal(uuid,uuid)
  from public,anon,authenticated;

-- Player messages address the exact rendered discussion and carry a stable
-- request identity. Locking the session serializes duplicate retries.
create or replace function public.s2_send_message(
  p_room_code text,
  p_session_token text,
  p_expected_discussion_session_id uuid,
  p_expected_vote_round integer,
  p_client_request_id uuid,
  p_message_text text
) returns jsonb
language plpgsql security definer set search_path=public as $$
declare
  v_room text:=upper(trim(p_room_code));
  v_player public.s1_room_players%rowtype;
  v_run public.game_runs%rowtype;
  v_session public.discussion_sessions%rowtype;
  v_message public.dialogue_messages%rowtype;
  v_text text:=trim(coalesce(p_message_text,''));
  v_latest_round integer;
begin
  if p_client_request_id is null then raise exception 'Message request identity is required.'; end if;
  v_player:=public.s1_get_player_by_session(v_room,p_session_token);
  v_run:=public.s2_get_active_run(v_room);
  if v_run.run_id is null then raise exception 'No active formal run.'; end if;

  select * into v_session from public.discussion_sessions
  where run_id=v_run.run_id
    and discussion_session_id=p_expected_discussion_session_id
    and vote_round=p_expected_vote_round
  for update;
  if not found then raise exception 'Stale discussion identity.'; end if;
  select max(vote_round) into v_latest_round from public.discussion_sessions where run_id=v_run.run_id;
  if v_latest_round<>v_session.vote_round then raise exception 'Stale discussion identity.'; end if;

  select * into v_message from public.dialogue_messages
  where run_id=v_run.run_id and player_id=v_player.player_id
    and client_request_id=p_client_request_id;
  if found then
    if v_message.discussion_session_id<>v_session.discussion_session_id or v_message.message_text<>v_text then
      raise exception 'Message request identity was reused with different content.';
    end if;
    return jsonb_build_object(
      'message_id',v_message.message_id,'created_at',v_message.created_at,
      'client_request_id',v_message.client_request_id,'idempotent_replay',true
    );
  end if;

  perform public.s2_refresh_discussion(v_session.discussion_session_id);
  select * into v_session from public.discussion_sessions
  where discussion_session_id=p_expected_discussion_session_id for update;
  if v_session.status<>'discussion' or not v_session.allow_free_text then
    raise exception 'Free-text discussion is not currently open.';
  end if;
  if v_text='' or char_length(v_text)>1000 then
    raise exception 'Message must contain 1-1000 characters.';
  end if;

  insert into public.dialogue_messages(
    run_id,discussion_session_id,scene_id,phase_key,step_key,
    player_id,message_text,client_request_id
  ) values(
    v_run.run_id,v_session.discussion_session_id,v_session.scene_id,
    v_session.phase_key,v_session.step_key,v_player.player_id,v_text,p_client_request_id
  ) returning * into v_message;

  perform public.s2_log_event(
    v_run.run_id,v_room,v_session.discussion_session_id,
    'dialogue_message_sent',v_player.player_id,
    jsonb_build_object('message_id',v_message.message_id,'client_request_id',p_client_request_id)
  );
  return jsonb_build_object(
    'message_id',v_message.message_id,'created_at',v_message.created_at,
    'client_request_id',v_message.client_request_id,'idempotent_replay',false
  );
end;
$$;

-- Votes also address the exact rendered discussion. Canonical ACT2/ACT5
-- resolution is applied inside this same transaction before success returns.
create or replace function public.s2_submit_vote(
  p_room_code text,
  p_session_token text,
  p_expected_discussion_session_id uuid,
  p_expected_vote_round integer,
  p_choice_id text
) returns jsonb
language plpgsql security definer set search_path=public as $$
declare
  v_room text:=upper(trim(p_room_code));
  v_player public.s1_room_players%rowtype;
  v_run public.game_runs%rowtype;
  v_session public.discussion_sessions%rowtype;
  v_new_session public.discussion_sessions%rowtype;
  v_existing public.runtime_player_decisions%rowtype;
  v_choice_label text;
  v_vote_count integer;
  v_winner record;
  v_distinct integer;
  v_latest_round integer;
  v_should_revote boolean:=false;
begin
  v_player:=public.s1_get_player_by_session(v_room,p_session_token);
  select * into v_run from public.game_runs
  where room_code=v_room and status='active' for update;
  if not found then raise exception 'No active formal run.'; end if;

  select * into v_session from public.discussion_sessions
  where run_id=v_run.run_id
    and discussion_session_id=p_expected_discussion_session_id
    and vote_round=p_expected_vote_round
  for update;
  if not found then raise exception 'Stale discussion identity.'; end if;
  select max(vote_round) into v_latest_round from public.discussion_sessions where run_id=v_run.run_id;
  if v_latest_round<>v_session.vote_round then raise exception 'Stale discussion identity.'; end if;

  perform public.s2_refresh_discussion(v_session.discussion_session_id);
  select * into v_session from public.discussion_sessions
  where discussion_session_id=p_expected_discussion_session_id for update;
  if v_session.status<>'voting' then raise exception 'Voting is not currently open.'; end if;

  select option_item->>'label' into v_choice_label
  from jsonb_array_elements(v_session.vote_options) option_item
  where option_item->>'id'=p_choice_id;
  if not found then raise exception 'Invalid vote option.'; end if;

  select * into v_existing from public.runtime_player_decisions
  where discussion_session_id=v_session.discussion_session_id
    and player_id=v_player.player_id and decision_type='group_vote';
  if found then
    if v_existing.choice_id<>p_choice_id then
      raise exception 'Your vote for this vote round is already locked.';
    end if;
    return jsonb_build_object(
      'ok',true,'status',v_session.status,'choice_id',v_existing.choice_id,
      'idempotent_replay',true
    );
  end if;

  insert into public.runtime_player_decisions(
    run_id,discussion_session_id,scene_id,phase_key,step_key,
    vote_round,player_id,decision_type,choice_id,choice_label
  ) values(
    v_run.run_id,v_session.discussion_session_id,v_session.scene_id,
    v_session.phase_key,v_session.step_key,v_session.vote_round,
    v_player.player_id,'group_vote',p_choice_id,v_choice_label
  );
  perform public.s2_log_event(
    v_run.run_id,v_room,v_session.discussion_session_id,
    'group_vote_locked',v_player.player_id,
    jsonb_build_object('vote_round',v_session.vote_round)
  );

  select count(*),count(distinct choice_id) into v_vote_count,v_distinct
  from public.runtime_player_decisions
  where discussion_session_id=v_session.discussion_session_id
    and decision_type='group_vote';
  if v_vote_count<3 then
    return jsonb_build_object('ok',true,'submitted_count',v_vote_count,'status','voting');
  end if;

  select choice_id,choice_label,count(*)::integer as votes into v_winner
  from public.runtime_player_decisions
  where discussion_session_id=v_session.discussion_session_id
    and decision_type='group_vote'
  group by choice_id,choice_label
  order by count(*) desc,choice_id limit 1;

  if v_winner.votes>=2 then
    update public.discussion_sessions
    set status='resolved',ended_at=now(),phase_deadline=null,
        outcome=jsonb_build_object(
          'type','majority','choice_id',v_winner.choice_id,
          'choice_label',v_winner.choice_label,'votes',v_winner.votes,
          'vote_round',v_session.vote_round
        )
    where discussion_session_id=v_session.discussion_session_id;
    perform public.s2_log_event(
      v_run.run_id,v_room,v_session.discussion_session_id,
      'vote_resolved_majority',null,
      jsonb_build_object('choice_id',v_winner.choice_id,'votes',v_winner.votes)
    );
    perform public.s3b_apply_resolved_discussion_internal(
      v_run.run_id,v_session.discussion_session_id
    );
    return jsonb_build_object(
      'ok',true,'status','resolved','resolution','majority',
      'choice_id',v_winner.choice_id,'votes',v_winner.votes
    );
  end if;

  if v_distinct=3 then
    update public.discussion_sessions
    set status='resolved',ended_at=now(),phase_deadline=null,
        outcome=jsonb_build_object(
          'type','no_consensus','message','NO CONSENSUS. NO ACTION.',
          'vote_round',v_session.vote_round
        )
    where discussion_session_id=v_session.discussion_session_id;
    perform public.s2_log_event(
      v_run.run_id,v_room,v_session.discussion_session_id,
      'vote_no_consensus',null,
      jsonb_build_object('vote_round',v_session.vote_round,'action_applied',false)
    );

    v_should_revote:=v_session.tie_policy='REPEAT_UNTIL_MAJORITY'
      or (v_session.tie_policy='SINGLE_REVOTE_THEN_FALLBACK'
          and v_session.round_no<=coalesce(v_session.max_revotes,0));
    if v_should_revote then
      insert into public.discussion_sessions(
        run_id,scene_id,phase_key,step_key,round_no,vote_round,
        topic,phase_deadline,show_initial_choices,require_final_vote,
        vote_options,tie_policy,revote_window_sec,max_revotes,
        fallback_resolution,discussion_time_limit_sec,vote_time_limit_sec,
        silent_texting_mode
      ) values(
        v_session.run_id,v_session.scene_id,v_session.phase_key,v_session.step_key,
        v_session.round_no+1,v_session.vote_round+1,v_session.topic,
        now()+make_interval(secs=>coalesce(v_session.revote_window_sec,v_session.discussion_time_limit_sec)),
        v_session.show_initial_choices,v_session.require_final_vote,
        v_session.vote_options,v_session.tie_policy,v_session.revote_window_sec,
        v_session.max_revotes,v_session.fallback_resolution,
        v_session.discussion_time_limit_sec,v_session.vote_time_limit_sec,
        v_session.silent_texting_mode
      ) returning * into v_new_session;
      perform public.s2_log_event(
        v_run.run_id,v_room,v_new_session.discussion_session_id,
        'revote_discussion_opened',null,
        jsonb_build_object(
          'previous_discussion_session_id',v_session.discussion_session_id,
          'vote_round',v_new_session.vote_round
        )
      );
      return jsonb_build_object(
        'ok',true,'status','discussion','resolution','no_consensus',
        'message','NO CONSENSUS. NO ACTION.',
        'discussion_session_id',v_new_session.discussion_session_id,
        'vote_round',v_new_session.vote_round
      );
    end if;

    if v_session.fallback_resolution is not null then
      update public.discussion_sessions
      set outcome=jsonb_build_object(
        'type','fallback','resolution_id',v_session.fallback_resolution,
        'resolution_source','system_fallback','after_no_consensus',true,
        'vote_round',v_session.vote_round
      ) where discussion_session_id=v_session.discussion_session_id;
      perform public.s2_log_event(
        v_run.run_id,v_room,v_session.discussion_session_id,
        'vote_resolved_fallback',null,
        jsonb_build_object(
          'resolution_id',v_session.fallback_resolution,
          'resolution_source','system_fallback'
        )
      );
      perform public.s3b_apply_resolved_discussion_internal(
        v_run.run_id,v_session.discussion_session_id
      );
    end if;
    return jsonb_build_object(
      'ok',true,'status','resolved','resolution',
      case when v_session.fallback_resolution is null then 'no_consensus' else 'fallback' end,
      'resolution_id',v_session.fallback_resolution,
      'resolution_source',case when v_session.fallback_resolution is null then null else 'system_fallback' end
    );
  end if;
  raise exception 'Unexpected vote tally state.';
end;
$$;

-- Reconnect reconciliation: reading formal state repairs a committed resolved
-- discussion that predates this migration or lost its client response.
alter function public.s3b_get_player_state(text,text) rename to s3b_get_player_state_pre013;
revoke execute on function public.s3b_get_player_state_pre013(text,text)
  from public,anon,authenticated;

create or replace function public.s3b_get_player_state(
  p_room_code text,p_session_token text
) returns jsonb
language plpgsql security definer set search_path=public as $$
declare
  v_room text:=upper(trim(p_room_code));
  v_run public.game_runs%rowtype;
  v_session_id uuid;
begin
  perform public.s1_get_player_by_session(v_room,p_session_token);
  v_run:=public.s2_get_active_run(v_room);
  if v_run.run_id is not null then
    select discussion_session_id into v_session_id
    from public.discussion_sessions
    where run_id=v_run.run_id and status='resolved'
      and scene_id in ('act2_first_contact','act5_route_discussion')
      and coalesce(outcome->>'choice_id',outcome->>'resolution_id') is not null
    order by vote_round desc limit 1;
    if v_session_id is not null then
      perform public.s3b_apply_resolved_discussion_internal(v_run.run_id,v_session_id);
    end if;
  end if;
  return public.s3b_get_player_state_pre013(p_room_code,p_session_token);
end;
$$;

-- Teacher state exposes whether canonical flow is active so generic controls
-- can fail closed in the UI as well as on the server.
alter function public.s2_get_teacher_state(text,text) rename to s2_get_teacher_state_pre013;
revoke execute on function public.s2_get_teacher_state_pre013(text,text)
  from public,anon,authenticated;

create or replace function public.s2_get_teacher_state(
  p_room_code text,p_teacher_token text
) returns jsonb
language plpgsql security definer set search_path=public as $$
declare
  v_room text:=upper(trim(p_room_code));
  v_run public.game_runs%rowtype;
  v_base jsonb;
  v_scene jsonb;
begin
  perform public.s1_assert_teacher(v_room,p_teacher_token);
  v_base:=public.s2_get_teacher_state_pre013(p_room_code,p_teacher_token);
  v_run:=public.s2_get_active_run(v_room);
  if v_run.run_id is not null then
    select to_jsonb(s) into v_scene from public.s3_runtime_scene_state s
    where s.run_id=v_run.run_id;
  end if;
  return v_base || jsonb_build_object(
    'canonical_flow_active',v_scene is not null,
    'canonical_scene',v_scene
  );
end;
$$;

-- Retire browser authority paths superseded by the exact-identity APIs.
revoke execute on function public.s2_send_message(text,text,text)
  from public,anon,authenticated;
revoke execute on function public.s2_submit_vote(text,text,text)
  from public,anon,authenticated;
revoke execute on function public.s3b_apply_meeting_resolution(text,text)
  from public,anon,authenticated;
revoke execute on function public.s3b_apply_act5_resolution(text,text)
  from public,anon,authenticated;

grant execute on function public.s2_open_discussion(
  text,text,text,integer,integer,boolean,boolean,jsonb,text,integer,integer,text,boolean
) to anon,authenticated;
grant execute on function public.s2_send_message(text,text,uuid,integer,uuid,text)
  to anon,authenticated;
grant execute on function public.s2_submit_vote(text,text,uuid,integer,text)
  to anon,authenticated;
grant execute on function public.s3b_get_player_state(text,text)
  to anon,authenticated;
grant execute on function public.s2_get_teacher_state(text,text)
  to anon,authenticated;
