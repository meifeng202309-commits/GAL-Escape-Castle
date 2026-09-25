-- Distinguish bounded ACTIVE-object failures from expected NO_ACTIVE trial fallbacks.
-- Migrations 001-057 are deployed history and remain immutable.
begin;

create function public.asset_report_load_failure(
  p_asset_key text,p_version integer,p_storage_path text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare v_recorded boolean:=false;
begin
  perform pg_advisory_xact_lock(hashtextextended('asset-load:'||coalesce(p_asset_key,''),0));
  if not exists(
    select 1 from public.asset_registry_projection r
    join public.asset_candidates c on c.asset_key=r.asset_key and c.version=r.active_version
    where r.asset_key=p_asset_key and c.status='ACTIVE' and c.version=p_version
      and c.storage_path=p_storage_path and c.published_at is not null
  ) then
    raise exception 'Asset failure report does not match current ACTIVE metadata.';
  end if;

  if not exists(
    select 1 from public.asset_events e
    where e.asset_key=p_asset_key and e.event_type='asset_load_failed' and e.version=p_version
      and e.details->>'reason'='ACTIVE_STORAGE_OBJECT_LOAD_FAILED'
      and e.details->>'storage_path'=p_storage_path
      and e.created_at>=now()-interval '5 minutes'
  ) then
    insert into public.asset_events(asset_key,event_type,version,details)
    values(p_asset_key,'asset_load_failed',p_version,jsonb_build_object(
      'reason','ACTIVE_STORAGE_OBJECT_LOAD_FAILED','storage_path',p_storage_path
    ));
    v_recorded:=true;
  end if;
  return jsonb_build_object('ok',true,'recorded',v_recorded,'reason','ACTIVE_STORAGE_OBJECT_LOAD_FAILED');
end$$;

revoke all on function public.asset_report_load_failure(text,integer,text) from public;
grant execute on function public.asset_report_load_failure(text,integer,text) to anon,authenticated;
commit;
