-- Teacher anchor marking plus service-only governed rollback.
create function public.asset_manager_save_anchors(p_teacher_token text,p_asset_id uuid,p_ui_anchors jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare c public.asset_candidates%rowtype;a jsonb;
begin
 if not exists(select 1 from public.s1_rooms where teacher_token_hash=public.s1_hash_token(p_teacher_token)) then raise exception 'Invalid teacher authority.';end if;
 if jsonb_typeof(p_ui_anchors)<>'array' then raise exception 'Anchors must be an array.';end if;
 select * into c from public.asset_candidates where asset_id=p_asset_id for update;if not found or c.asset_type<>'image' or c.status not in('PENDING_REVIEW','APPROVED') then raise exception 'Candidate cannot accept anchors.';end if;
 for a in select * from jsonb_array_elements(p_ui_anchors) loop
  if coalesce(a->>'anchor_name','')='' or (a->>'x_percent')::numeric not between 0 and 100 or (a->>'y_percent')::numeric not between 0 and 100 or (a->>'width_percent')::numeric<=0 or (a->>'height_percent')::numeric<=0 or (a->>'x_percent')::numeric+(a->>'width_percent')::numeric>100 or (a->>'y_percent')::numeric+(a->>'height_percent')::numeric>100 then raise exception 'Invalid percentage anchor.';end if;
 end loop;
 update public.asset_candidates set ui_anchors=p_ui_anchors where asset_id=p_asset_id;
 insert into public.asset_events values(default,c.asset_key,'anchors_saved',c.version,jsonb_build_object('anchor_count',jsonb_array_length(p_ui_anchors)),default);
 return jsonb_build_object('ok',true,'ui_anchors',p_ui_anchors);
end$$;
grant execute on function public.asset_manager_save_anchors(text,uuid,jsonb) to anon,authenticated;

create function public.asset_manager_rollback(p_teacher_token text,p_asset_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$ declare c public.asset_candidates%rowtype;
begin if not exists(select 1 from public.s1_rooms where teacher_token_hash=public.s1_hash_token(p_teacher_token)) then raise exception 'Invalid teacher authority.';end if;select * into c from public.asset_candidates where asset_id=p_asset_id for update;if c.status not in('APPROVED','SUPERSEDED') or c.published_at is null then raise exception 'Rollback target is not eligible.';end if;return public.asset_manager_activate(p_teacher_token,p_asset_id);end$$;
revoke execute on function public.asset_manager_rollback(text,uuid) from public,anon,authenticated;grant execute on function public.asset_manager_rollback(text,uuid) to service_role;
