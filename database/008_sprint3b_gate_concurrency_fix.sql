-- Sprint 3B concurrency correction: serialize player gate mutations per run.
-- Apply after 007_sprint3b_act1_5_placeholder_flow.sql.

create or replace function public.s3b_lock_run_for_player_progress()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  perform 1 from public.s3b_run_state where run_id=new.run_id for update;
  if not found then raise exception 'Sprint 3B run state is not initialized.'; end if;
  return new;
end;
$$;

drop trigger if exists s3b_player_progress_serialize_gate on public.s3b_player_progress;
create trigger s3b_player_progress_serialize_gate
before insert or update on public.s3b_player_progress
for each row execute function public.s3b_lock_run_for_player_progress();

revoke execute on function public.s3b_lock_run_for_player_progress() from public,anon,authenticated;
