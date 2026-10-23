\set ON_ERROR_STOP on
drop table if exists public.ca285_function_snapshot;
create table public.ca285_function_snapshot as
select p.oid::regprocedure::text identity,pg_get_functiondef(p.oid) definition,p.proacl
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.oid in(
 'public.s6_open_discussion(uuid,text,text,integer,text)'::regprocedure,
 'public.s6_refresh_owned_discussion(uuid)'::regprocedure,
 'public.s6_send_message_guarded(text,text,uuid,uuid,text)'::regprocedure,
 'public.s6_close_discussion_guarded(text,text,text,integer,integer,uuid)'::regprocedure,
 'public.s6_get_player_state(text,text)'::regprocedure);
do $$begin if(select count(*)from public.ca285_function_snapshot)<>5 then raise exception'CA285 snapshot count mismatch';end if;end$$;
