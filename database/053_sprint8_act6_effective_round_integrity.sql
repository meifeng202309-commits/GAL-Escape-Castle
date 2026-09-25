-- Sprint 8 ACT6 effective-round integrity correction.
begin;

alter function public.s8_verify_integrity(uuid) rename to s8_verify_integrity_v052;
revoke all on function public.s8_verify_integrity_v052(uuid) from public,anon,authenticated;

create function public.s8_verify_integrity(p_run_id uuid)
returns jsonb language plpgsql stable security definer set search_path=public as $$
declare report jsonb; resolution text; effective_round integer; submission_count integer;
  winning_count integer; distinct_choices integer; item jsonb; verified boolean;
begin
  report:=public.s8_verify_integrity_v052(p_run_id);
  select act6_resolution into resolution from public.s5_run_state where run_id=p_run_id;

  if resolution='portrait_fixed_fallback' then
    effective_round:=2;
    select count(*),count(distinct choice_id)
    into submission_count,distinct_choices
    from public.s5_votes
    where run_id=p_run_id and phase_key='act6_vote' and vote_round=effective_round;
    if submission_count=3 and distinct_choices=3 then
      item:=jsonb_build_object('state','present','evidence_identity',jsonb_build_object(
        'resolution',resolution,'vote_round',effective_round,'submission_count',submission_count,
        'distinct_choices',distinct_choices,'resolution_source','system_fallback'));
    else
      item:=jsonb_build_object('state','missing_technical_evidence','reason_code','act6_fallback_round_2_evidence_missing','evidence_identity',jsonb_build_object(
        'resolution',resolution,'vote_round',effective_round,'submission_count',submission_count,
        'distinct_choices',distinct_choices));
    end if;
  else
    select r.vote_round into effective_round
    from public.s5_rounds r
    where r.run_id=p_run_id and r.phase_key='act6_vote' and r.status='resolved'
      and r.resolution_source='player_majority'
    order by r.vote_round desc limit 1;
    select count(*),count(*) filter(where choice_id=resolution)
    into submission_count,winning_count
    from public.s5_votes
    where run_id=p_run_id and phase_key='act6_vote' and vote_round=effective_round;
    if resolution is not null and effective_round is not null and submission_count=3 and winning_count>=2 then
      item:=jsonb_build_object('state','present','evidence_identity',jsonb_build_object(
        'resolution',resolution,'vote_round',effective_round,'submission_count',submission_count,
        'winning_count',winning_count,'resolution_source','player_majority'));
    else
      item:=jsonb_build_object('state','missing_technical_evidence','reason_code','act6_majority_effective_round_evidence_missing','evidence_identity',jsonb_build_object(
        'resolution',resolution,'vote_round',effective_round,'submission_count',submission_count,
        'winning_count',winning_count));
    end if;
  end if;

  report:=jsonb_set(report,'{obligations,act6.effective_vote}',item,true);
  select not exists(select 1 from jsonb_each(report->'obligations') e where e.value->>'state'='missing_technical_evidence') into verified;
  return jsonb_set(report,'{verified}',to_jsonb(verified),false);
end$$;
revoke all on function public.s8_verify_integrity(uuid) from public,anon,authenticated;

commit;
