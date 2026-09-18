-- Sprint 2 audit corrections.
-- Apply after 001_sprint1_core.sql and 002_runtime_runs_discussion.sql.
-- This migration preserves existing run, discussion, message, vote, and event history.
--
-- Corrections:
-- 1. fallback_resolution is a server-authored resolution identifier and need not
--    match a player vote option.
-- 2. round_no is local to an independent discussion/re-vote chain and therefore
--    starts at 1; vote_round remains monotonic within the run.
-- 3. messages is the current discussion transcript. Teacher-only message_history
--    remains run-wide for audit/history access.

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
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room_code text := upper(trim(p_room_code));
  v_run public.game_runs%rowtype;
  v_session public.discussion_sessions%rowtype;
  v_round integer;
  v_policy text := upper(trim(coalesce(p_tie_policy, '')));
  v_require_vote boolean := coalesce(p_require_final_vote, true);
  v_option_count integer;
  v_distinct_count integer;
begin
  perform public.s1_assert_teacher(v_room_code, p_teacher_token);

  select * into v_run
  from public.game_runs
  where room_code = v_room_code and status = 'active'
  for update;

  if not found then
    raise exception 'No active formal run. Start a run first.';
  end if;

  if exists (
    select 1 from public.discussion_sessions
    where run_id = v_run.run_id
      and status in ('discussion', 'voting', 'waiting_for_missing_player')
  ) then
    raise exception 'The active run already has an open discussion or vote.';
  end if;

  if trim(coalesce(p_topic, '')) = '' then
    raise exception 'Discussion topic is required.';
  end if;

  if p_discussion_time_limit_sec not between 5 and 3600
     or p_vote_time_limit_sec not between 5 and 3600 then
    raise exception 'Discussion and vote time limits must be between 5 and 3600 seconds.';
  end if;

  if v_policy not in ('SINGLE_REVOTE_THEN_FALLBACK', 'REPEAT_UNTIL_MAJORITY', 'NO_TIE_POSSIBLE') then
    raise exception 'Invalid tie policy.';
  end if;

  if v_require_vote then
    if p_vote_options is null or jsonb_typeof(p_vote_options) <> 'array' then
      raise exception 'Vote options must be a JSON array.';
    end if;

    select count(*), count(distinct (option_item->>'id'))
    into v_option_count, v_distinct_count
    from jsonb_array_elements(p_vote_options) option_item
    where trim(coalesce(option_item->>'id', '')) <> ''
      and trim(coalesce(option_item->>'label', '')) <> '';

    if v_option_count < 2 or v_option_count > 12
       or v_distinct_count <> v_option_count
       or v_option_count <> jsonb_array_length(p_vote_options) then
      raise exception 'Vote options require 2-12 distinct non-empty id/label entries.';
    end if;

    if v_policy = 'NO_TIE_POSSIBLE' and v_option_count > 2 then
      raise exception 'NO_TIE_POSSIBLE supports at most two options for a three-player vote.';
    end if;
  else
    p_vote_options := '[]'::jsonb;
  end if;

  if v_require_vote and v_policy = 'SINGLE_REVOTE_THEN_FALLBACK' then
    if coalesce(p_max_revotes, 0) < 1
       or trim(coalesce(p_fallback_resolution, '')) = ''
       or p_revote_window_sec is null
       or p_revote_window_sec not between 5 and 3600 then
      raise exception 'SINGLE_REVOTE_THEN_FALLBACK requires max_revotes, fallback_resolution, and a 5-3600 second revote window.';
    end if;

  end if;

  if v_require_vote and v_policy = 'REPEAT_UNTIL_MAJORITY'
     and (p_revote_window_sec is null or p_revote_window_sec not between 5 and 3600) then
    raise exception 'REPEAT_UNTIL_MAJORITY requires a 5-3600 second revote window.';
  end if;

  select coalesce(max(vote_round), 0) + 1 into v_round
  from public.discussion_sessions where run_id = v_run.run_id;

  insert into public.discussion_sessions(
    run_id, scene_id, phase_key, step_key, round_no, vote_round,
    topic, phase_deadline, show_initial_choices, require_final_vote,
    vote_options, tie_policy, revote_window_sec, max_revotes,
    fallback_resolution, discussion_time_limit_sec, vote_time_limit_sec,
    silent_texting_mode
  ) values (
    v_run.run_id, v_run.scene_id, v_run.phase_key, v_run.step_key,
    1, v_round, trim(p_topic),
    now() + make_interval(secs => p_discussion_time_limit_sec),
    coalesce(p_show_initial_choices, false), v_require_vote,
    p_vote_options, v_policy, p_revote_window_sec, p_max_revotes,
    nullif(trim(coalesce(p_fallback_resolution, '')), ''),
    p_discussion_time_limit_sec, p_vote_time_limit_sec,
    coalesce(p_silent_texting_mode, false)
  ) returning * into v_session;

  update public.game_runs
  set silent_texting_mode = v_session.silent_texting_mode
  where run_id = v_run.run_id;

  perform public.s2_log_event(
    v_run.run_id, v_room_code, v_session.discussion_session_id,
    'discussion_opened', null,
    jsonb_build_object('vote_round', v_session.vote_round, 'topic', v_session.topic)
  );

  return jsonb_build_object(
    'discussion_session_id', v_session.discussion_session_id,
    'vote_round', v_session.vote_round,
    'phase_deadline', v_session.phase_deadline,
    'status', v_session.status
  );
end;
$$;

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
        'type', 'fallback', 'choice_id', v_session.fallback_resolution,
        'after_no_consensus', true, 'vote_round', v_session.vote_round
      )
      where discussion_session_id = v_session.discussion_session_id;

      perform public.s2_log_event(
        v_run.run_id, v_room_code, v_session.discussion_session_id,
        'vote_resolved_fallback', null,
        jsonb_build_object('choice_id', v_session.fallback_resolution)
      );
    end if;

    return jsonb_build_object(
      'ok', true, 'status', 'resolved', 'resolution',
      case when v_session.fallback_resolution is null then 'no_consensus' else 'fallback' end,
      'choice_id', v_session.fallback_resolution
    );
  end if;

  raise exception 'Unexpected vote tally state.';
exception
  when unique_violation then
    raise exception 'Your vote for this vote round is already locked.';
end;
$$;

create or replace function public.s2_get_player_state(
  p_room_code text,
  p_session_token text
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
  v_messages jsonb := '[]'::jsonb;
  v_initial jsonb := '[]'::jsonb;
  v_my_vote jsonb;
  v_revealed_votes jsonb := '[]'::jsonb;
  v_history jsonb := '[]'::jsonb;
  v_submitted integer := 0;
begin
  v_player := public.s1_get_player_by_session(v_room_code, p_session_token);
  v_run := public.s2_get_active_run(v_room_code);

  if v_run.run_id is null then
    return jsonb_build_object('active', false);
  end if;

  select * into v_session
  from public.discussion_sessions
  where run_id = v_run.run_id
  order by vote_round desc
  limit 1;

  if found then
    perform public.s2_refresh_discussion(v_session.discussion_session_id);
    select * into v_session from public.discussion_sessions
    where discussion_session_id = v_session.discussion_session_id;

    select coalesce(jsonb_agg(jsonb_build_object(
      'message_id', m.message_id,
      'discussion_session_id', m.discussion_session_id,
      'display_name', p.display_name,
      'role_slot', p.role_slot,
      'message_text', m.message_text,
      'created_at', m.created_at
    ) order by m.created_at, m.message_id), '[]'::jsonb)
    into v_messages
    from public.dialogue_messages m
    join public.s1_room_players p on p.player_id = m.player_id
    where m.run_id = v_run.run_id
      and m.discussion_session_id = v_session.discussion_session_id;

    select count(*) into v_submitted
    from public.runtime_player_decisions
    where discussion_session_id = v_session.discussion_session_id
      and decision_type = 'group_vote';

    select jsonb_build_object(
      'choice_id', d.choice_id,
      'choice_label', d.choice_label,
      'locked_at', d.locked_at
    ) into v_my_vote
    from public.runtime_player_decisions d
    where d.discussion_session_id = v_session.discussion_session_id
      and d.player_id = v_player.player_id
      and d.decision_type = 'group_vote';

    if v_session.status = 'resolved' then
      select coalesce(jsonb_agg(jsonb_build_object(
        'display_name', p.display_name,
        'role_slot', p.role_slot,
        'choice_id', d.choice_id,
        'choice_label', d.choice_label,
        'locked_at', d.locked_at
      ) order by p.role_slot), '[]'::jsonb)
      into v_revealed_votes
      from public.runtime_player_decisions d
      join public.s1_room_players p on p.player_id = d.player_id
      where d.discussion_session_id = v_session.discussion_session_id
        and d.decision_type = 'group_vote';
    end if;

    if v_session.show_initial_choices then
      select coalesce(jsonb_agg(jsonb_build_object(
        'display_name', p.display_name,
        'role_slot', p.role_slot,
        'choice_id', d.choice_id,
        'choice_label', d.choice_label,
        'locked_at', d.locked_at
      ) order by p.role_slot), '[]'::jsonb)
      into v_initial
      from public.s1_player_decisions d
      join public.s1_room_players p on p.player_id = d.player_id
      join public.s1_room_state s on s.room_code = d.room_code
      where d.room_code = v_room_code
        and d.scene_id = s.current_scene
        and d.decision_type = 'private_choice'
        and s.phase in ('revealed', 'completed');
    end if;

    select coalesce(jsonb_agg(jsonb_build_object(
      'discussion_session_id', ds.discussion_session_id,
      'vote_round', ds.vote_round,
      'outcome', ds.outcome,
      'votes', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'display_name', p.display_name,
          'role_slot', p.role_slot,
          'choice_id', d.choice_id,
          'choice_label', d.choice_label
        ) order by p.role_slot), '[]'::jsonb)
        from public.runtime_player_decisions d
        join public.s1_room_players p on p.player_id = d.player_id
        where d.discussion_session_id = ds.discussion_session_id
          and d.decision_type = 'group_vote'
      )
    ) order by ds.vote_round), '[]'::jsonb)
    into v_history
    from public.discussion_sessions ds
    where ds.run_id = v_run.run_id and ds.status = 'resolved';
  end if;

  return jsonb_build_object(
    'active', true,
    'run', jsonb_build_object(
      'run_id', v_run.run_id,
      'run_started_at', v_run.run_started_at,
      'run_mode', v_run.run_mode,
      'behavior_dataset_eligible', v_run.behavior_dataset_eligible,
      'silent_texting_mode', v_run.silent_texting_mode
    ),
    'player', jsonb_build_object(
      'player_id', v_player.player_id,
      'display_name', v_player.display_name,
      'role_slot', v_player.role_slot
    ),
    'discussion', case when v_session.discussion_session_id is null then null else jsonb_build_object(
      'discussion_session_id', v_session.discussion_session_id,
      'topic', v_session.topic,
      'status', v_session.status,
      'vote_round', v_session.vote_round,
      'round_no', v_session.round_no,
      'phase_deadline', v_session.phase_deadline,
      'show_initial_choices', v_session.show_initial_choices,
      'require_final_vote', v_session.require_final_vote,
      'vote_options', v_session.vote_options,
      'tie_policy', v_session.tie_policy,
      'silent_texting_mode', v_session.silent_texting_mode,
      'outcome', v_session.outcome
    ) end,
    'initial_choices', v_initial,
    'messages', v_messages,
    'submitted_vote_count', v_submitted,
    'my_vote', v_my_vote,
    'revealed_votes', v_revealed_votes,
    'vote_history', v_history
  );
end;
$$;

create or replace function public.s2_get_teacher_state(
  p_room_code text,
  p_teacher_token text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room_code text := upper(trim(p_room_code));
  v_run public.game_runs%rowtype;
  v_session public.discussion_sessions%rowtype;
  v_messages jsonb := '[]'::jsonb;
  v_message_history jsonb := '[]'::jsonb;
  v_votes jsonb := '[]'::jsonb;
  v_events jsonb := '[]'::jsonb;
begin
  perform public.s1_assert_teacher(v_room_code, p_teacher_token);
  v_run := public.s2_get_active_run(v_room_code);
  if v_run.run_id is null then return jsonb_build_object('active', false); end if;

  select * into v_session
  from public.discussion_sessions
  where run_id = v_run.run_id
  order by vote_round desc
  limit 1;

  if found then
    perform public.s2_refresh_discussion(v_session.discussion_session_id);
    select * into v_session from public.discussion_sessions
    where discussion_session_id = v_session.discussion_session_id;

    select coalesce(jsonb_agg(jsonb_build_object(
      'message_id', m.message_id,
      'discussion_session_id', m.discussion_session_id,
      'display_name', p.display_name,
      'role_slot', p.role_slot,
      'message_text', m.message_text,
      'created_at', m.created_at
    ) order by m.created_at, m.message_id), '[]'::jsonb)
    into v_messages
    from public.dialogue_messages m
    join public.s1_room_players p on p.player_id = m.player_id
    where m.run_id = v_run.run_id
      and m.discussion_session_id = v_session.discussion_session_id;

    select coalesce(jsonb_agg(
      case when v_session.status = 'resolved' and d.decision_id is not null then
        jsonb_build_object(
          'player_id', p.player_id, 'display_name', p.display_name,
          'role_slot', p.role_slot, 'submitted', true,
          'choice_id', d.choice_id, 'choice_label', d.choice_label,
          'locked_at', d.locked_at
        )
      else
        jsonb_build_object(
          'player_id', p.player_id, 'display_name', p.display_name,
          'role_slot', p.role_slot, 'submitted', d.decision_id is not null,
          'locked_at', d.locked_at
        )
      end order by p.role_slot
    ), '[]'::jsonb)
    into v_votes
    from public.s1_room_players p
    left join public.runtime_player_decisions d
      on d.player_id = p.player_id
      and d.discussion_session_id = v_session.discussion_session_id
      and d.decision_type = 'group_vote'
    where p.room_code = v_room_code;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'message_id', m.message_id,
    'discussion_session_id', m.discussion_session_id,
    'display_name', p.display_name,
    'role_slot', p.role_slot,
    'message_text', m.message_text,
    'created_at', m.created_at
  ) order by m.created_at, m.message_id), '[]'::jsonb)
  into v_message_history
  from public.dialogue_messages m
  join public.s1_room_players p on p.player_id = m.player_id
  where m.run_id = v_run.run_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_id', e.event_id,
    'event_type', e.event_type,
    'discussion_session_id', e.discussion_session_id,
    'details', e.details,
    'created_at', e.created_at
  ) order by e.created_at, e.event_id), '[]'::jsonb)
  into v_events
  from public.runtime_events e
  where e.run_id = v_run.run_id;

  return jsonb_build_object(
    'active', true,
    'run', jsonb_build_object(
      'run_id', v_run.run_id,
      'run_started_at', v_run.run_started_at,
      'run_mode', v_run.run_mode,
      'behavior_dataset_eligible', v_run.behavior_dataset_eligible,
      'silent_texting_mode', v_run.silent_texting_mode
    ),
    'discussion', case when v_session.discussion_session_id is null then null else jsonb_build_object(
      'discussion_session_id', v_session.discussion_session_id,
      'topic', v_session.topic,
      'status', v_session.status,
      'vote_round', v_session.vote_round,
      'round_no', v_session.round_no,
      'phase_deadline', v_session.phase_deadline,
      'show_initial_choices', v_session.show_initial_choices,
      'require_final_vote', v_session.require_final_vote,
      'vote_options', v_session.vote_options,
      'tie_policy', v_session.tie_policy,
      'silent_texting_mode', v_session.silent_texting_mode,
      'outcome', v_session.outcome
    ) end,
    'messages', v_messages,
    'message_history', v_message_history,
    'current_votes', v_votes,
    'events', v_events
  );
end;
$$;
