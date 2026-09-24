-- Remove temporary NORMAL deadline accelerators after closure verification.
begin;

revoke execute on function public.s6_verify_expire_discussion(text,text,uuid) from public,anon,authenticated;
revoke execute on function public.s5_verify_expire_discussion(text,text,uuid) from public,anon,authenticated;

drop function public.s6_verify_expire_discussion(text,text,uuid);
drop function public.s5_verify_expire_discussion(text,text,uuid);

commit;
