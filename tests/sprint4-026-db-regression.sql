-- Run as postgres after migration 026. All setup is rolled back.
begin;
insert into public.asset_manager_reviewers(token_hash,label)
values(public.s1_hash_token('correction-test'),'transaction test') on conflict do nothing;

do $$
declare existing uuid;cases int:=0;
begin
 select asset_id into existing from public.asset_candidates limit 1;
 begin perform public.asset_manager_activate_group('correction-test',null::uuid[]);exception when others then if sqlerrm like '%non-null candidate ids%' then cases:=cases+1;else raise;end if;end;
 begin perform public.asset_manager_activate_group('correction-test','{}'::uuid[]);exception when others then if sqlerrm like '%non-null candidate ids%' then cases:=cases+1;else raise;end if;end;
 begin perform public.asset_manager_activate_group('correction-test',array[null]::uuid[]);exception when others then if sqlerrm like '%non-null candidate ids%' then cases:=cases+1;else raise;end if;end;
 begin perform public.asset_manager_activate_group('correction-test',array[existing,existing]);exception when others then if sqlerrm like '%duplicate candidate ids%' then cases:=cases+1;else raise;end if;end;
 begin perform public.asset_manager_activate_group('correction-test',array[gen_random_uuid()]);exception when others then if sqlerrm like '%target does not exist%' then cases:=cases+1;else raise;end if;end;
 begin perform public.asset_manager_activate_group('correction-test',array[existing,gen_random_uuid()]);exception when others then if sqlerrm like '%target does not exist%' then cases:=cases+1;else raise;end if;end;
 begin perform public.asset_manager_rollback_group('correction-test',array[gen_random_uuid()]);exception when others then if sqlerrm like '%target does not exist%' then cases:=cases+1;else raise;end if;end;
 if cases<>7 then raise exception 'Target rejection matrix incomplete.';end if;
end$$;

select 'PASS null, empty, null-element, duplicate, nonexistent, partial and rollback targets rejected' as result;
rollback;

-- Concurrency check, session A:
-- begin; update the existing shared.library candidate to APPROVED; call
-- asset_manager_activate_group(...); select pg_sleep(20); rollback;
-- Concurrent session B:
-- set lock_timeout='1s'; update asset_registry_projection set projected_at=now()
-- where asset_key='shared.library';
-- Expected: SQLSTATE 55P03 lock timeout while session A retains the registry lock.
