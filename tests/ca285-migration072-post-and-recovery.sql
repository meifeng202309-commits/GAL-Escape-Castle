\set ON_ERROR_STOP on
create or replace function pg_temp.expect_error(command text,expected text)returns void language plpgsql as $$
begin execute command;raise exception'Expected error containing %, but command succeeded',expected;
exception when others then if sqlerrm like 'Expected error containing %'then raise;end if;if position(expected in sqlerrm)=0 then raise exception'Expected error containing %, got %',expected,sqlerrm;end if;end$$;

do $$begin
 if to_regprocedure('public.s6_get_player_state_pre072(text,text)')is null then raise exception'pre072 missing';end if;
 if not has_function_privilege('anon','public.s6_get_player_state(text,text)','execute')or not has_function_privilege('authenticated','public.s6_get_player_state(text,text)','execute')then raise exception'player ACL missing';end if;
 if has_function_privilege('anon','public.s6_get_player_state_pre072(text,text)','execute')or has_function_privilege('authenticated','public.s6_get_player_state_pre072(text,text)','execute')then raise exception'pre072 leaked';end if;
 if not has_function_privilege('anon','public.s6_teacher_open_vote(text,text,uuid,text,integer,integer,uuid)','execute')then raise exception'teacher endpoint ACL missing';end if;
end$$;

select public.s1_create_room('CA285N','teacher-normal','a','b','c');
select public.s1_create_room('CA285A','teacher-audit','d','e','f');
update public.s1_room_players set session_token_hash=public.s1_hash_token('player-token')where room_code='CA285N'and role_slot='GAL-A';
insert into public.game_runs(room_code,run_mode,behavior_dataset_eligible,status,scene_id,phase_key,step_key)values
('CA285N','normal',true,'active','sprint6','act10_discussion','step_1'),('CA285A','audit',false,'active','sprint6','act10_discussion','step_1');
set session_replication_role=replica;
insert into public.s6_run_state(run_id,act_no,phase_key,act9_step,round_no)select run_id,10,'act10_discussion',1,1 from public.game_runs where room_code in('CA285N','CA285A');
set session_replication_role=origin;

do $$declare rn uuid;ra uuid;dn uuid;da uuid;state jsonb;result jsonb;begin
 select run_id into rn from public.game_runs where room_code='CA285N';select run_id into ra from public.game_runs where room_code='CA285A';
 dn:=public.s6_open_discussion(rn,'act10_discussion','step_1',180,'normal');da:=public.s6_open_discussion(ra,'act10_discussion','step_1',180,'audit');
 if(select phase_deadline is not null from public.discussion_sessions where discussion_session_id=dn)then raise exception'NORMAL ACT10 deadline not null';end if;
 if not(select phase_deadline is not null from public.discussion_sessions where discussion_session_id=da)then raise exception'AUDIT ACT10 deadline null';end if;
 state:=public.s6_get_player_state('CA285N','player-token');if state#>>'{discussion,teacher_open_required}'<>'true'then raise exception'player marker absent';end if;
 perform pg_temp.expect_error(format('select public.s6_get_teacher_discussion_state(%L,%L)','CA285N','wrong'),'Invalid teacher token');
 perform pg_temp.expect_error(format('select public.s6_close_discussion_guarded(%L,%L,%L,%s,%s,%L::uuid)','CA285N','player-token','act10_discussion',1,1,dn),'Teacher must open');
 perform public.s6_send_message_guarded('CA285N','player-token',dn,gen_random_uuid(),'still open');
 perform pg_temp.expect_error(format('select public.s6_teacher_open_vote(%L,%L,%L::uuid,%L,%s,%s,%L::uuid)','CA285N','teacher-normal',rn,'act10_discussion',2,1,dn),'Stale or ineligible');
 result:=public.s6_teacher_open_vote('CA285N','teacher-normal',rn,'act10_discussion',1,1,dn);if result->>'phase_key'<>'act10_final_vote'then raise exception'transition failed';end if;
 if(select count(*)from public.runtime_events where run_id=rn and event_type='teacher_intervention_s6_vote_opened')<>1 then raise exception'event not exactly once';end if;
 perform pg_temp.expect_error(format('select public.s6_teacher_open_vote(%L,%L,%L::uuid,%L,%s,%s,%L::uuid)','CA285N','teacher-normal',rn,'act10_discussion',1,1,dn),'Stale or ineligible');
 perform pg_temp.expect_error(format('select public.s6_teacher_open_vote(%L,%L,%L::uuid,%L,%s,%s,%L::uuid)','CA285A','teacher-audit',ra,'act10_discussion',1,1,da),'Stale or ineligible');
 update public.s6_run_state set act_no=9,phase_key='act9_discussion'where run_id=rn;
 if(select phase_deadline is null from public.discussion_sessions where discussion_session_id=public.s6_open_discussion(rn,'act9_discussion','step_1',180,'act9'))then raise exception'ACT9 deadline changed';end if;
 update public.s6_run_state set act_no=11,phase_key='act11_discussion'where run_id=rn;
 if(select phase_deadline is null from public.discussion_sessions where discussion_session_id=public.s6_open_discussion(rn,'act11_discussion','step_1',180,'act11'))then raise exception'ACT11 deadline changed';end if;
end$$;

drop function public.s6_teacher_open_vote(text,text,uuid,text,integer,integer,uuid);
drop function public.s6_get_teacher_discussion_state(text,text);
drop function public.s6_get_player_state(text,text);
alter function public.s6_get_player_state_pre072(text,text)rename to s6_get_player_state;
do $$declare r record;begin for r in select definition from public.ca285_function_snapshot where identity<>'s6_get_player_state(text,text)'loop execute r.definition;end loop;end$$;
do $$declare n integer;begin
 select count(*)into n from public.ca285_function_snapshot s join pg_proc p on p.oid=to_regprocedure('public.'||s.identity)where pg_get_functiondef(p.oid)<>s.definition or p.proacl is distinct from s.proacl;
 if n<>0 then raise exception'Recovery mismatch for % functions',n;end if;
 if to_regprocedure('public.s6_get_player_state_pre072(text,text)')is not null or to_regprocedure('public.s6_teacher_open_vote(text,text,uuid,text,integer,integer,uuid)')is not null then raise exception'Recovery left 072 identities';end if;
end$$;
select 'CA285_MIGRATION072_ISOLATED_SQL_PASS' result;
