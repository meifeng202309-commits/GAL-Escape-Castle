-- Sprint 8 exact per-player Teacher Override accounting.
begin;

alter function public.s8_verify_integrity(uuid) rename to s8_verify_integrity_v051;
revoke all on function public.s8_verify_integrity_v051(uuid) from public,anon,authenticated;

create function public.s8_verify_integrity(p_run_id uuid)
returns jsonb language plpgsql stable security definer set search_path=public as $$
declare report jsonb; item jsonb; missing_count integer; override_count integer; present_count integer; verified boolean;
begin
  report:=public.s8_verify_integrity_v051(p_run_id);

  select
    count(*) filter(where p.act1_choice_id is not null and p.act1_locked_at is not null and p.act1_timing_validity<>'pending'),
    count(*) filter(where (p.act1_choice_id is null or p.act1_locked_at is null or p.act1_timing_validity='pending') and exists(
      select 1 from public.teacher_override_validity v where v.run_id=p_run_id and v.player_id=p.player_id and v.semantic_field='act1_choice_id' and v.validity='invalid_teacher_override')),
    count(*) filter(where (p.act1_choice_id is null or p.act1_locked_at is null or p.act1_timing_validity='pending') and not exists(
      select 1 from public.teacher_override_validity v where v.run_id=p_run_id and v.player_id=p.player_id and v.semantic_field='act1_choice_id' and v.validity='invalid_teacher_override'))
  into present_count,override_count,missing_count
  from public.s3b_player_progress p where p.run_id=p_run_id;
  item:=case when missing_count>0 or present_count+override_count<>3 then jsonb_build_object('state','missing_technical_evidence','reason_code','act1_player_evidence_missing','evidence_identity',jsonb_build_object('present',present_count,'overridden',override_count,'missing',missing_count))
    when override_count>0 then jsonb_build_object('state','invalid_teacher_override','reason_code','exact_governed_override','evidence_identity',jsonb_build_object('present',present_count,'overridden',override_count))
    else jsonb_build_object('state','present','evidence_identity',jsonb_build_object('present',present_count)) end;
  report:=jsonb_set(report,'{obligations,act1.player_first_choices}',item,true);

  select
    count(*) filter(where p.first_meeting_choice is not null and p.first_meeting_locked_at is not null and p.first_meeting_timing_validity<>'pending'),
    count(*) filter(where (p.first_meeting_choice is null or p.first_meeting_locked_at is null or p.first_meeting_timing_validity='pending') and exists(
      select 1 from public.teacher_override_validity v where v.run_id=p_run_id and v.player_id=p.player_id and v.semantic_field='first_meeting_choice' and v.validity='invalid_teacher_override')),
    count(*) filter(where (p.first_meeting_choice is null or p.first_meeting_locked_at is null or p.first_meeting_timing_validity='pending') and not exists(
      select 1 from public.teacher_override_validity v where v.run_id=p_run_id and v.player_id=p.player_id and v.semantic_field='first_meeting_choice' and v.validity='invalid_teacher_override'))
  into present_count,override_count,missing_count
  from public.s3b_player_progress p where p.run_id=p_run_id;
  item:=case when missing_count>0 or present_count+override_count<>3 then jsonb_build_object('state','missing_technical_evidence','reason_code','act2_player_evidence_missing','evidence_identity',jsonb_build_object('present',present_count,'overridden',override_count,'missing',missing_count))
    when override_count>0 then jsonb_build_object('state','invalid_teacher_override','reason_code','exact_governed_override','evidence_identity',jsonb_build_object('present',present_count,'overridden',override_count))
    else jsonb_build_object('state','present','evidence_identity',jsonb_build_object('present',present_count)) end;
  report:=jsonb_set(report,'{obligations,act2.player_first_choices}',item,true);

  select
    count(*) filter(where p.act4_choice_id is not null and p.act4_locked_at is not null and p.act4_timing_validity<>'pending'),
    count(*) filter(where (p.act4_choice_id is null or p.act4_locked_at is null or p.act4_timing_validity='pending') and exists(
      select 1 from public.teacher_override_validity v where v.run_id=p_run_id and v.player_id=p.player_id and v.semantic_field='act4_choice_id' and v.validity='invalid_teacher_override')),
    count(*) filter(where (p.act4_choice_id is null or p.act4_locked_at is null or p.act4_timing_validity='pending') and not exists(
      select 1 from public.teacher_override_validity v where v.run_id=p_run_id and v.player_id=p.player_id and v.semantic_field='act4_choice_id' and v.validity='invalid_teacher_override'))
  into present_count,override_count,missing_count
  from public.s3b_player_progress p where p.run_id=p_run_id;
  item:=case when missing_count>0 or present_count+override_count<>3 then jsonb_build_object('state','missing_technical_evidence','reason_code','act4_route_evidence_missing','evidence_identity',jsonb_build_object('present',present_count,'overridden',override_count,'missing',missing_count))
    when override_count>0 then jsonb_build_object('state','invalid_teacher_override','reason_code','exact_governed_override','evidence_identity',jsonb_build_object('present',present_count,'overridden',override_count))
    else (report#>'{obligations,act4.route_resolution}') end;
  report:=jsonb_set(report,'{obligations,act4.route_resolution}',item,true);

  select not exists(select 1 from jsonb_each(report->'obligations') e where e.value->>'state'='missing_technical_evidence') into verified;
  return jsonb_set(report,'{verified}',to_jsonb(verified),false);
end$$;
revoke all on function public.s8_verify_integrity(uuid) from public,anon,authenticated;

commit;
