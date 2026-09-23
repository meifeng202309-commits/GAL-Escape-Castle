-- Sprint 4: Asset Manager V2 runtime projection and lifecycle authority.
create table public.asset_registry_projection(
 asset_key text primary key,display_name text not null,aliases jsonb not null default '[]',asset_type text not null check(asset_type in('image','audio')),
 scene_id text,assigned_to text,latest_version int not null default 0 check(latest_version>=0),active_version int,
 continuity_refs jsonb not null default '[]',paired_asset_group text,required_anchors jsonb not null default '[]',runtime_required boolean not null default true,
 registry_sha256 text not null check(registry_sha256~'^[0-9a-f]{64}$'),projected_at timestamptz not null default now(),
 check(active_version is null or active_version between 1 and latest_version)
);
create table public.asset_candidates(
 asset_id uuid primary key default gen_random_uuid(),asset_key text not null references public.asset_registry_projection(asset_key),version int not null check(version>0),
 asset_type text not null check(asset_type in('image','audio')),scene_id text,assigned_to text,creator text not null,storage_path text,
 status text not null check(status in('ASSIGNED','MISSING','UPLOADED','PENDING_REVIEW','APPROVED','REJECTED','ACTIVE','SUPERSEDED')),
 approved_by text,approved_at timestamptz,created_at timestamptz not null default now(),final_prompt text,revision_note text,technical_notes text,
 paired_asset_group text,view_name text,ui_anchors jsonb not null default '[]',width_px int,height_px int,mime_type text,duration_ms int,loopable boolean,
 license_source text,loudness_note text,continuity_refs jsonb not null default '[]',required_anchors jsonb not null default '[]',sha256 text,
 published_at timestamptz,unique(asset_key,version),check(sha256 is null or sha256~'^[0-9a-f]{64}$'),
 check((asset_type='image' and duration_ms is null) or asset_type='audio')
);
create unique index asset_candidates_one_active on public.asset_candidates(asset_key) where status='ACTIVE';
create table public.asset_events(event_id uuid primary key default gen_random_uuid(),asset_key text not null,event_type text not null,version int,details jsonb not null default '{}',created_at timestamptz not null default now());
alter table public.asset_registry_projection enable row level security;alter table public.asset_candidates enable row level security;alter table public.asset_events enable row level security;

create function public.asset_manager_sync_registry(p_teacher_token text,p_registry_sha256 text,p_assets jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare a jsonb;k text;seen int:=0;
begin
 if not exists(select 1 from public.s1_rooms where teacher_token=p_teacher_token) then raise exception 'Invalid teacher authority.';end if;
 if p_registry_sha256!~'^[0-9a-f]{64}$' or jsonb_typeof(p_assets)<>'array' then raise exception 'Invalid registry projection.';end if;
 for a in select * from jsonb_array_elements(p_assets) loop
  k:=a->>'asset_key';if k is null or k='' or a->>'asset_type' not in('image','audio') then raise exception 'Invalid canonical asset entry.';end if;
  insert into public.asset_registry_projection(asset_key,display_name,aliases,asset_type,latest_version,active_version,continuity_refs,paired_asset_group,required_anchors,runtime_required,registry_sha256,projected_at)
  values(k,a->>'display_name',coalesce(a->'aliases','[]'),a->>'asset_type',coalesce((a->>'latest_version')::int,0),(a->>'active_version')::int,coalesce(a->'continuity_refs','[]'),a->>'paired_asset_group',coalesce(a->'required_anchors','[]'),coalesce((a->>'runtime_required')::boolean,true),p_registry_sha256,now())
  on conflict(asset_key) do update set display_name=excluded.display_name,aliases=excluded.aliases,asset_type=excluded.asset_type,latest_version=excluded.latest_version,active_version=excluded.active_version,continuity_refs=excluded.continuity_refs,paired_asset_group=excluded.paired_asset_group,required_anchors=excluded.required_anchors,runtime_required=excluded.runtime_required,registry_sha256=excluded.registry_sha256,projected_at=now();seen:=seen+1;
 end loop;
 if seen<>(select count(*) from public.asset_registry_projection) then raise exception 'Registry projection would leave drifted keys.';end if;
 return jsonb_build_object('ok',true,'asset_count',seen,'registry_sha256',p_registry_sha256);
end$$;

create function public.asset_manager_register_candidate(p_teacher_token text,p_candidate jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r public.asset_registry_projection%rowtype;id uuid;v int;anchors jsonb;
begin
 if not exists(select 1 from public.s1_rooms where teacher_token=p_teacher_token) then raise exception 'Invalid teacher authority.';end if;
 select * into r from public.asset_registry_projection where asset_key=p_candidate->>'asset_key' for update;if not found then raise exception 'ASSET KEY NOT FOUND';end if;
 v:=(p_candidate->>'version')::int;if v<>r.latest_version then raise exception 'Candidate version disagrees with canonical registry.';end if;
 if p_candidate->>'asset_type'<>r.asset_type or p_candidate->>'sha256'!~'^[0-9a-f]{64}$' then raise exception 'Candidate identity or checksum mismatch.';end if;
 anchors:=coalesce(p_candidate->'ui_anchors','[]');
 insert into public.asset_candidates(asset_key,version,asset_type,scene_id,assigned_to,creator,storage_path,status,final_prompt,revision_note,technical_notes,paired_asset_group,view_name,ui_anchors,width_px,height_px,mime_type,duration_ms,loopable,license_source,loudness_note,continuity_refs,required_anchors,sha256)
 values(r.asset_key,v,r.asset_type,p_candidate->>'scene_id',p_candidate->>'assigned_to',coalesce(p_candidate->>'creator','VA'),p_candidate->>'storage_path','PENDING_REVIEW',p_candidate->>'final_prompt',p_candidate->>'revision_note',p_candidate->>'technical_notes',r.paired_asset_group,p_candidate->>'view_name',anchors,(p_candidate->>'width_px')::int,(p_candidate->>'height_px')::int,p_candidate->>'mime_type',(p_candidate->>'duration_ms')::int,(p_candidate->>'loopable')::boolean,p_candidate->>'license_source',p_candidate->>'loudness_note',r.continuity_refs,r.required_anchors,p_candidate->>'sha256') returning asset_id into id;
 insert into public.asset_events values(default,r.asset_key,'candidate_registered',v,jsonb_build_object('asset_id',id),default);return jsonb_build_object('ok',true,'asset_id',id);
end$$;

create function public.asset_manager_review(p_teacher_token text,p_asset_id uuid,p_decision text,p_reviewer text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare c public.asset_candidates%rowtype;
begin if not exists(select 1 from public.s1_rooms where teacher_token=p_teacher_token) then raise exception 'Invalid teacher authority.';end if;
 if p_decision not in('APPROVED','REJECTED') then raise exception 'Invalid review decision.';end if;select * into c from public.asset_candidates where asset_id=p_asset_id for update;
 if c.status<>'PENDING_REVIEW' then raise exception 'Candidate is not pending review.';end if;
 update public.asset_candidates set status=p_decision,approved_by=case when p_decision='APPROVED' then p_reviewer end,approved_at=case when p_decision='APPROVED' then now() end where asset_id=p_asset_id;
 insert into public.asset_events values(default,c.asset_key,lower(p_decision),c.version,jsonb_build_object('reviewer',p_reviewer),default);return jsonb_build_object('ok',true,'status',p_decision);end$$;

create function public.asset_manager_mark_published(p_teacher_token text,p_asset_id uuid,p_storage_path text,p_sha256 text)
returns jsonb language plpgsql security definer set search_path=public as $$ declare c public.asset_candidates%rowtype;
begin if not exists(select 1 from public.s1_rooms where teacher_token=p_teacher_token) then raise exception 'Invalid teacher authority.';end if;select * into c from public.asset_candidates where asset_id=p_asset_id for update;
 if c.status<>'APPROVED' or c.sha256<>p_sha256 or p_storage_path is null then raise exception 'Only checksum-matching APPROVED candidates may publish.';end if;
 update public.asset_candidates set storage_path=p_storage_path,published_at=now() where asset_id=p_asset_id;insert into public.asset_events values(default,c.asset_key,'published',c.version,jsonb_build_object('storage_path',p_storage_path),default);return jsonb_build_object('ok',true);end$$;

create function public.asset_manager_activate(p_teacher_token text,p_asset_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$ declare c public.asset_candidates%rowtype;r public.asset_registry_projection%rowtype;missing text;
begin if not exists(select 1 from public.s1_rooms where teacher_token=p_teacher_token) then raise exception 'Invalid teacher authority.';end if;select * into c from public.asset_candidates where asset_id=p_asset_id for update;if c.status<>'APPROVED' or c.published_at is null then raise exception 'Candidate is not eligible for ACTIVE.';end if;select * into r from public.asset_registry_projection where asset_key=c.asset_key for update;
 if r.active_version is distinct from c.version then raise exception 'Canonical registry active_version does not authorize this promotion.';end if;
 select x into missing from jsonb_array_elements_text(r.required_anchors)x where not exists(select 1 from jsonb_array_elements(c.ui_anchors)a where a->>'anchor_name'=x) limit 1;if missing is not null then raise exception 'Required anchor is missing: %',missing;end if;
 update public.asset_candidates set status='SUPERSEDED' where asset_key=c.asset_key and status='ACTIVE';update public.asset_candidates set status='ACTIVE' where asset_id=p_asset_id;insert into public.asset_events values(default,c.asset_key,'activated',c.version,'{}',default);return jsonb_build_object('ok',true,'asset_key',c.asset_key,'active_version',c.version);end$$;

create function public.asset_resolve(p_asset_key text) returns jsonb language plpgsql security definer set search_path=public as $$ declare r public.asset_registry_projection%rowtype;c public.asset_candidates%rowtype;
begin select * into r from public.asset_registry_projection where asset_key=p_asset_key;if not found then return jsonb_build_object('ok',false,'fallback',true,'reason','ASSET_KEY_NOT_FOUND','asset_key',p_asset_key);end if;
 select * into c from public.asset_candidates where asset_key=p_asset_key and version=r.active_version and status='ACTIVE';if not found then insert into public.asset_events(asset_key,event_type,version,details)values(r.asset_key,'asset_load_failed',r.active_version,jsonb_build_object('reason','NO_ACTIVE_ASSET'));return jsonb_build_object('ok',false,'fallback',true,'reason','NO_ACTIVE_ASSET','asset_key',r.asset_key,'asset_type',r.asset_type);end if;
 return jsonb_build_object('ok',true,'asset_key',c.asset_key,'asset_type',c.asset_type,'version',c.version,'storage_path',c.storage_path,'ui_anchors',c.ui_anchors,'width_px',c.width_px,'height_px',c.height_px,'mime_type',c.mime_type,'duration_ms',c.duration_ms,'loopable',c.loopable);end$$;

create function public.asset_manager_state(p_teacher_token text) returns jsonb language plpgsql security definer set search_path=public as $$
begin if not exists(select 1 from public.s1_rooms where teacher_token=p_teacher_token) then raise exception 'Invalid teacher authority.';end if;return jsonb_build_object('assets',(select coalesce(jsonb_agg(to_jsonb(r)||jsonb_build_object('candidates',(select coalesce(jsonb_agg(to_jsonb(c) order by version desc),'[]') from public.asset_candidates c where c.asset_key=r.asset_key)) order by display_name),'[]') from public.asset_registry_projection r));end$$;
revoke execute on function public.asset_manager_sync_registry(text,text,jsonb),public.asset_manager_register_candidate(text,jsonb),public.asset_manager_mark_published(text,uuid,text,text),public.asset_manager_activate(text,uuid) from public,anon,authenticated;
grant execute on function public.asset_manager_review(text,uuid,text,text),public.asset_manager_state(text),public.asset_resolve(text) to anon,authenticated;
