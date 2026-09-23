-- Prevent one-sided activation of canonical paired assets.
alter function public.asset_manager_activate(text,uuid) rename to asset_manager_activate_pre022;
revoke execute on function public.asset_manager_activate_pre022(text,uuid) from public,anon,authenticated;
grant execute on function public.asset_manager_activate_pre022(text,uuid) to service_role;

create function public.asset_manager_activate(p_teacher_token text,p_asset_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare c public.asset_candidates%rowtype;missing_partner text;
begin
 select * into c from public.asset_candidates where asset_id=p_asset_id for update;
 if not found then raise exception 'Candidate not found.';end if;
 if c.paired_asset_group is not null then
  select r.asset_key into missing_partner from public.asset_registry_projection r
  where r.paired_asset_group=c.paired_asset_group and r.asset_key<>c.asset_key
    and (r.active_version is distinct from c.version or not exists(
      select 1 from public.asset_candidates p where p.asset_key=r.asset_key and p.version=c.version
      and p.published_at is not null and p.status in('APPROVED','ACTIVE','SUPERSEDED')))
  order by r.asset_key limit 1;
  if missing_partner is not null then raise exception 'Paired asset is not activation-ready: %',missing_partner;end if;
 end if;
 return public.asset_manager_activate_pre022(p_teacher_token,p_asset_id);
end$$;
revoke execute on function public.asset_manager_activate(text,uuid) from public,anon,authenticated;
grant execute on function public.asset_manager_activate(text,uuid) to service_role;
