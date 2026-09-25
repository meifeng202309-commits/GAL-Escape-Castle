-- Sprint 8 final-closure narrow correction. Migration049 is immutable.
begin;

alter function public.s8_verify_integrity(uuid) rename to s8_verify_integrity_v049;
revoke all on function public.s8_verify_integrity_v049(uuid) from public,anon,authenticated;

create function public.s8_verify_integrity(p_run_id uuid)
returns jsonb language plpgsql stable security definer set search_path=public as $$
declare report jsonb; evidence jsonb; verified boolean;
begin
  report:=public.s8_verify_integrity_v049(p_run_id);
  select jsonb_build_object(
    'state','present',
    'evidence_identity',jsonb_build_object(
      'discussion_session_id',d.discussion_session_id,
      'vote_round',(d.outcome->>'vote_round')::integer,
      'vote_count',count(v.decision_id),
      'outcome',d.outcome->>'choice_id'))
  into evidence
  from public.discussion_sessions d
  join public.runtime_player_decisions v
    on v.run_id=d.run_id and v.discussion_session_id=d.discussion_session_id
   and v.vote_round=(d.outcome->>'vote_round')::integer
  where d.run_id=p_run_id and d.scene_id='act2_first_contact'
    and d.phase_key='meeting_discussion' and d.step_key='final_meeting'
    and d.status='resolved' and d.outcome->>'choice_id' is not null
  group by d.discussion_session_id,d.outcome
  having count(v.decision_id)=3 and count(distinct v.player_id)=3
  order by (d.outcome->>'vote_round')::integer desc limit 1;

  if evidence is null then
    evidence:=public.s8_integrity_obligation(false,null,'act2_resolution_evidence_missing',null,p_run_id,'act2_meeting_resolution');
  end if;
  report:=jsonb_set(report,'{obligations,act2.meeting_resolution}',evidence,true);
  select not exists(
    select 1 from jsonb_each(report->'obligations') e
    where e.value->>'state'='missing_technical_evidence'
  ) into verified;
  return jsonb_set(report,'{verified}',to_jsonb(verified),false);
end$$;
revoke all on function public.s8_verify_integrity(uuid) from public,anon,authenticated;

create or replace function public.s8_export_session(p_room_code text,p_teacher_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb; target_run_id uuid; durable_version text;
begin
  result:=public.s8_export_session_v048(p_room_code,p_teacher_token);
  target_run_id:=(result#>>'{json,header,run_id}')::uuid;
  select f.export_schema_version into strict durable_version
  from public.s8_finalizations f where f.run_id=target_run_id;
  return jsonb_set(result,'{json,header,export_schema_version}',to_jsonb(durable_version),false);
end$$;
revoke all on function public.s8_export_session(text,text) from public;
grant execute on function public.s8_export_session(text,text) to anon,authenticated;

commit;
