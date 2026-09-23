-- Normalize an eligible historical version back to APPROVED inside the same
-- activation transaction so the shared activation gates remain authoritative.
create or replace function public.asset_manager_rollback(p_teacher_token text,p_asset_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare c public.asset_candidates%rowtype;
begin
 if not exists(select 1 from public.s1_rooms where teacher_token_hash=public.s1_hash_token(p_teacher_token)) then raise exception 'Invalid teacher authority.';end if;
 select * into c from public.asset_candidates where asset_id=p_asset_id for update;
 if not found or c.status not in('APPROVED','SUPERSEDED') or c.published_at is null then raise exception 'Rollback target is not eligible.';end if;
 update public.asset_candidates set status='APPROVED' where asset_id=p_asset_id;
 return public.asset_manager_activate(p_teacher_token,p_asset_id);
end$$;
revoke execute on function public.asset_manager_rollback(text,uuid) from public,anon,authenticated;
grant execute on function public.asset_manager_rollback(text,uuid) to service_role;
