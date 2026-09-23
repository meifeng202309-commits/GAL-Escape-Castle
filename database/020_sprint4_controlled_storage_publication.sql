-- Service-only publication boundary. Runtime reads use resolved object paths;
-- browsers cannot upload, register, publish or activate candidates.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('game-assets','game-assets',true,26214400,array['image/webp','image/svg+xml','audio/mpeg','audio/wav','audio/ogg'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

grant execute on function public.asset_manager_sync_registry(text,text,jsonb),public.asset_manager_register_candidate(text,jsonb),public.asset_manager_mark_published(text,uuid,text,text),public.asset_manager_activate(text,uuid) to service_role;
revoke execute on function public.asset_manager_sync_registry(text,text,jsonb),public.asset_manager_register_candidate(text,jsonb),public.asset_manager_mark_published(text,uuid,text,text),public.asset_manager_activate(text,uuid) from public,anon,authenticated;
