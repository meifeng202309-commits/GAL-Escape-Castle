-- Verify the deployed Level2 residual live fixture without mutating data.
do $$
declare v_run uuid;v_act2_override uuid;v_act5_override uuid;v_discussion uuid;v_count integer;v_route text;v_scope jsonb;v_event_scope jsonb;
begin
 select o.run_id,o.override_id into v_run,v_act2_override
 from public.teacher_overrides o
 where o.reason='R2 ACT2 discussion safe resolution'
 order by o.created_at desc limit 1;
 if v_run is null then raise exception 'Level2 residual live fixture not found';end if;

 select current_route_target into v_route from public.s3_runtime_scene_state where run_id=v_run;
 if v_route is distinct from 'library' then raise exception 'ACT2 current_route_target is %',v_route;end if;
 select discussion_session_id into v_discussion from public.discussion_sessions where run_id=v_run and scene_id='act2_first_contact' and phase_key='meeting_discussion' order by started_at desc limit 1;
 select count(*) into v_count from public.runtime_player_decisions where run_id=v_run and discussion_session_id=v_discussion;
 if v_count<>0 then raise exception 'ACT2 override fabricated % player votes',v_count;end if;
 select count(*) into v_count from public.teacher_override_validity where override_id=v_act2_override and semantic_field='act2_final_vote' and validity='invalid_teacher_override';
 if v_count<>3 then raise exception 'ACT2 missing-vote validity count is %',v_count;end if;
 select invalidated_scope into v_scope from public.teacher_overrides where override_id=v_act2_override;
 select details->'invalidated_scope' into v_event_scope from public.runtime_events where interaction_id=v_act2_override and event_type='teacher_override';
 if v_event_scope is distinct from v_scope then raise exception 'ACT2 zero-vote event scope differs from override scope';end if;

 select override_id into v_act5_override from public.teacher_overrides where run_id=v_run and reason='R2 ACT5 discussion safe resolution';
 select discussion_session_id into v_discussion from public.discussion_sessions where run_id=v_run and scene_id='act5_route_discussion' and phase_key='discussion' order by started_at desc limit 1;
 select count(*) into v_count from public.runtime_player_decisions where run_id=v_run and discussion_session_id=v_discussion;
 if v_count<>0 then raise exception 'ACT5 override fabricated % player votes',v_count;end if;
 select count(*) into v_count from public.teacher_override_validity where override_id=v_act5_override and semantic_field='act5_final_vote' and validity='invalid_teacher_override';
 if v_count<>3 then raise exception 'ACT5 missing-vote validity count is %',v_count;end if;
 select invalidated_scope into v_scope from public.teacher_overrides where override_id=v_act5_override;
 select details->'invalidated_scope' into v_event_scope from public.runtime_events where interaction_id=v_act5_override and event_type='teacher_override';
 if v_event_scope is distinct from v_scope then raise exception 'ACT5 zero-vote event scope differs from override scope';end if;

 select o.run_id,o.override_id,o.invalidated_scope into v_run,v_act2_override,v_scope
 from public.teacher_overrides o where o.reason='R2E1 ACT2 partial vote safe resolution' order by o.created_at desc limit 1;
 if v_run is null or jsonb_array_length(v_scope)<>2 then raise exception 'ACT2 partial-vote fixture/scope is invalid';end if;
 select discussion_session_id into v_discussion from public.discussion_sessions where run_id=v_run and scene_id='act2_first_contact' and phase_key='meeting_discussion' order by started_at desc limit 1;
 select count(*) into v_count from public.runtime_player_decisions where run_id=v_run and discussion_session_id=v_discussion;
 if v_count<>1 then raise exception 'ACT2 partial-vote real decision count is %',v_count;end if;
 select count(*) into v_count from public.teacher_override_validity where override_id=v_act2_override and semantic_field='act2_final_vote' and validity='invalid_teacher_override';
 if v_count<>2 then raise exception 'ACT2 partial-vote validity count is %',v_count;end if;
 select details->'invalidated_scope' into v_event_scope from public.runtime_events where interaction_id=v_act2_override and event_type='teacher_override';
 if v_event_scope is distinct from v_scope then raise exception 'ACT2 partial-vote event scope differs from override scope';end if;
end$$;
select 'PASS Level2 override route, absence-validity, and event-scope integrity' as result;
