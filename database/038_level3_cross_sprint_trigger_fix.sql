-- Keep the deferred cross-Sprint trigger valid for both source row types.
begin;

create or replace function public.act6_13_deferred_cross_sprint() returns trigger
language plpgsql security definer set search_path=public as $$
begin
 if tg_table_name='s3b_run_state' and (to_jsonb(new)->>'terminal_state')='SPRINT3B_COMPLETE' then
  perform public.s5_ensure_initialized(new.run_id);
 elsif tg_table_name='s5_run_state' and (to_jsonb(new)->>'phase_key')='complete' then
  perform public.s6_ensure_initialized(new.run_id);
 end if;
 return null;
end$$;

revoke execute on function public.act6_13_deferred_cross_sprint() from public,anon,authenticated;

commit;
