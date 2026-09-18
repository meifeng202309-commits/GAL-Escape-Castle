-- Narrow semantic cleanup requested after Sprint 2 acceptance.
-- Apply after database/003_sprint2_discussionroom_audit_fix.sql.
-- No schema or state-machine behavior changes: this only distinguishes a
-- server-authored fallback resolution from a player-submitted choice.

create or replace function public.s2_submit_vote(
  p_room_code text,
  p_session_token text,
  p_choice_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room_code text := upper(trim(p_room_code));
  v_player public.s1_room_players%rowtype;
  v_run public.game_runs%rowtype;
  v_session public.discussion_sessions%rowtype;
  v_new_session public.discussion_sessions%rowtype;
  v_choice_label text;
  v_vote_count integer;
  v_winner record;
  v_distinct integer;
  v_should_revote boolean := false;
begin
  v_player := public.s1_get_player_by_session(v_room_code, p_session_token);
  v_run := public.s2_get_active_run(v_room_code);
  if v_run.run_id is null then raise exception 'No active formal run.'; end if;

  select * into v_session
  from public.discussion_sessions
  where run_id = v_run.run_id
  order by vote_round desc
  limit 1
  for update;

  if not found then raise exception 'No discussion has been opened.'; end if;
  perform public.s2_refresh_discussion(v_session.discussion_session_id);
  select * into v_session from public.discussion_sessions
  where discussion_session_id = v_session.discussion_session_id
  for update;

  if v_session.status <> 'voting' then
    raise exception 'Voting is not currently open.';
  end if;

  select option_item->>'label' into v_choice_label
  from jsonb_array_elements(v_session.vote_options) option_item
  where option_item->>'id' = p_choice_id;

  if not found then raise exception 'Invalid vote option.'; end if;

  insert into public.runtime_player_decisions(
    run_id, discussion_session_id, scene_id, phase_key, step_key,
    vote_round, player_id, decision_type, choice_id, choice_label
  ) values (
    v_run.run_id, v_session.discussion_session_id, v_session.scene_id,
    v_session.phase_key, v_session.step_key, v_session.vote_round,
    v_player.player_id, 'group_vote', p_choice_id, v_choice_label
  );

  perform public.s2_log_event(
    v_run.run_id, v_room_code, v_session.discussion_session_id,
    'group_vote_locked', v_player.player_id,
    jsonb_build_object('vote_round', v_session.vote_round)
  );

  select count(*), count(distinct choice_id)
  into v_vote_count, v_distinct
  from public.runtime_player_decisions
  where discussion_session_id = v_session.discussion_session_id
    and decision_type = 'group_vote';

  if v_vote_count < 3 then
    return jsonb_build_object('ok', true, 'submitted_count', v_vote_count, 'status', 'voting');
  end if;

  select choice_id, choice_label, count(*)::integer as votes
  into v_winner
  from public.runtime_player_decisions
  where discussion_session_id = v_session.discussion_session_id
    and decision_type = 'group_vote'
  group by choice_id, choice_label
  order by count(*) desc, choice_id
  limit 1;

  if v_winner.votes >= 2 then
    update public.discussion_sessions
    set status = 'resolved', ended_at = now(), phase_deadline = null,
        outcome = jsonb_build_object(
          'type', 'majority', 'choice_id', v_winner.choice_id,
          'choice_label', v_winner.choice_label, 'votes', v_winner.votes,
          'vote_round', v_session.vote_round
        )
    where discussion_session_id = v_session.discussion_session_id;

    perform public.s2_log_event(
      v_run.run_id, v_room_code, v_session.discussion_session_id,
      'vote_resolved_majority', null,
      jsonb_build_object('choice_id', v_winner.choice_id, 'votes', v_winner.votes)
    );

    return jsonb_build_object(
      'ok', true, 'status', 'resolved', 'resolution', 'majority',
      'choice_id', v_winner.choice_id, 'votes', v_winner.votes
    );
  end if;

  -- With exactly three players, no majority means a 1:1:1 result.
  if v_distinct = 3 then
    update public.discussion_sessions
    set status = 'resolved', ended_at = now(), phase_deadline = null,
        outcome = jsonb_build_object(
          'type', 'no_consensus', 'message', 'NO CONSENSUS. NO ACTION.',
          'vote_round', v_session.vote_round
        )
    where discussion_session_id = v_session.discussion_session_id;

    perform public.s2_log_event(
      v_run.run_id, v_room_code, v_session.discussion_session_id,
      'vote_no_consensus', null,
      jsonb_build_object('vote_round', v_session.vote_round, 'action_applied', false)
    );

    v_should_revote := v_session.tie_policy = 'REPEAT_UNTIL_MAJORITY'
      or (
        v_session.tie_policy = 'SINGLE_REVOTE_THEN_FALLBACK'
        and v_session.round_no <= coalesce(v_session.max_revotes, 0)
      );

    if v_should_revote then
      insert into public.discussion_sessions(
        run_id, scene_id, phase_key, step_key, round_no, vote_round,
        topic, phase_deadline, show_initial_choices, require_final_vote,
        vote_options, tie_policy, revote_window_sec, max_revotes,
        fallback_resolution, discussion_time_limit_sec, vote_time_limit_sec,
        silent_texting_mode
      ) values (
        v_session.run_id, v_session.scene_id, v_session.phase_key, v_session.step_key,
        v_session.round_no + 1, v_session.vote_round + 1,
        v_session.topic,
        now() + make_interval(secs => coalesce(v_session.revote_window_sec, v_session.discussion_time_limit_sec)),
        v_session.show_initial_choices, v_session.require_final_vote,
        v_session.vote_options, v_session.tie_policy, v_session.revote_window_sec,
        v_session.max_revotes, v_session.fallback_resolution,
        v_session.discussion_time_limit_sec, v_session.vote_time_limit_sec,
        v_session.silent_texting_mode
      ) returning * into v_new_session;

      perform public.s2_log_event(
        v_run.run_id, v_room_code, v_new_session.discussion_session_id,
        'revote_discussion_opened', null,
        jsonb_build_object(
          'previous_discussion_session_id', v_session.discussion_session_id,
          'vote_round', v_new_session.vote_round
        )
      );

      return jsonb_build_object(
        'ok', true, 'status', 'discussion', 'resolution', 'no_consensus',
        'message', 'NO CONSENSUS. NO ACTION.',
        'discussion_session_id', v_new_session.discussion_session_id,
        'vote_round', v_new_session.vote_round
      );
    end if;

    if v_session.fallback_resolution is not null then
      update public.discussion_sessions
      set outcome = jsonb_build_object(
        'type', 'fallback',
        'resolution_id', v_session.fallback_resolution,
        'resolution_source', 'system_fallback',
        'after_no_consensus', true, 'vote_round', v_session.vote_round
      )
      where discussion_session_id = v_session.discussion_session_id;

      perform public.s2_log_event(
        v_run.run_id, v_room_code, v_session.discussion_session_id,
        'vote_resolved_fallback', null,
        jsonb_build_object(
          'resolution_id', v_session.fallback_resolution,
          'resolution_source', 'system_fallback'
        )
      );
    end if;

    return jsonb_build_object(
      'ok', true, 'status', 'resolved', 'resolution',
      case when v_session.fallback_resolution is null then 'no_consensus' else 'fallback' end,
      'resolution_id', v_session.fallback_resolution,
      'resolution_source', case when v_session.fallback_resolution is null then null else 'system_fallback' end
    );
  end if;

  raise exception 'Unexpected vote tally state.';
exception
  when unique_violation then
    raise exception 'Your vote for this vote round is already locked.';
end;
$$;

