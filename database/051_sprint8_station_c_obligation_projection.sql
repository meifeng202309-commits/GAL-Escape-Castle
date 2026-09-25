-- Sprint 8 final-closure branch-specific Station C projection.
begin;

alter function public.s8_verify_integrity(uuid) rename to s8_verify_integrity_v050;
revoke all on function public.s8_verify_integrity_v050(uuid) from public,anon,authenticated;

create function public.s8_verify_integrity(p_run_id uuid)
returns jsonb language plpgsql stable security definer set search_path=public as $$
declare report jsonb; bypassed boolean; station_c_count integer; obligation jsonb; verified boolean;
begin
  report:=public.s8_verify_integrity_v050(p_run_id);
  select station_c_bypassed into bypassed from public.s6_run_state where run_id=p_run_id;
  select count(*) into station_c_count from public.s6_station_tasks
  where run_id=p_run_id and role_key='C';
  obligation:=public.s8_integrity_obligation(
    station_c_count=1,
    jsonb_build_object('role_key','C','count',station_c_count),
    'station_c_evidence_missing',
    case when bypassed then 'golden_key_watcher_path' end,
    p_run_id,
    'act12_station_c');
  report:=jsonb_set(report,'{obligations,act12.station_c}',obligation,true);
  select not exists(
    select 1 from jsonb_each(report->'obligations') e
    where e.value->>'state'='missing_technical_evidence'
  ) into verified;
  return jsonb_set(report,'{verified}',to_jsonb(verified),false);
end$$;
revoke all on function public.s8_verify_integrity(uuid) from public,anon,authenticated;

commit;
