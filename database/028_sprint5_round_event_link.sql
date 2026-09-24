-- Sprint 5 narrow correction: preserve runtime_events discussion-session FK.
create or replace function public.s5_mirror_round_for_audit()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.discussion_sessions(
    discussion_session_id,run_id,scene_id,phase_key,step_key,round_no,vote_round,
    topic,status,ended_at,outcome,show_initial_choices,allow_free_text,
    require_final_vote,vote_options,tie_policy,discussion_time_limit_sec,
    vote_time_limit_sec,silent_texting_mode
  ) values(
    new.discussion_session_id,new.run_id,
    case new.phase_key when 'act6_vote' then 'act6_portrait' when 'act7_vote' then 'act7_clock_room' else 'act8_route' end,
    new.phase_key,'sprint5_round',new.vote_round,new.vote_round,new.topic_text_key,
    'resolved',now(),jsonb_build_object('type','sprint5_audit_link'),false,false,
    false,'[]'::jsonb,'NO_TIE_POSSIBLE',5,5,false
  ) on conflict (discussion_session_id) do nothing;
  return new;
end$$;

revoke execute on function public.s5_mirror_round_for_audit() from public,anon,authenticated;

drop trigger if exists s5_round_audit_link on public.s5_rounds;
create trigger s5_round_audit_link
after insert on public.s5_rounds
for each row execute function public.s5_mirror_round_for_audit();

insert into public.discussion_sessions(
  discussion_session_id,run_id,scene_id,phase_key,step_key,round_no,vote_round,
  topic,status,ended_at,outcome,show_initial_choices,allow_free_text,
  require_final_vote,vote_options,tie_policy,discussion_time_limit_sec,
  vote_time_limit_sec,silent_texting_mode
)
select r.discussion_session_id,r.run_id,
  case r.phase_key when 'act6_vote' then 'act6_portrait' when 'act7_vote' then 'act7_clock_room' else 'act8_route' end,
  r.phase_key,'sprint5_round',r.vote_round,r.vote_round,r.topic_text_key,
  'resolved',now(),jsonb_build_object('type','sprint5_audit_link'),false,false,
  false,'[]'::jsonb,'NO_TIE_POSSIBLE',5,5,false
from public.s5_rounds r
on conflict (discussion_session_id) do nothing;
