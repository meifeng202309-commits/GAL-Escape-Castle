\set ON_ERROR_STOP on
begin;

create or replace function pg_temp.expect_error(command text,expected text)returns void language plpgsql as $$
begin execute command;raise exception'Expected error containing %, but command succeeded',expected;
exception when others then if sqlerrm like 'Expected error containing %'then raise;end if;if position(expected in sqlerrm)=0 then raise exception'Expected error containing %, got %',expected,sqlerrm;end if;end$$;

select public.s1_create_room('ACT973N','teacher-normal','a','b','c');
select public.s1_create_room('ACT973A','teacher-audit','d','e','f');
with tokens(role_slot,token)as(values('GAL-A','player-a'),('GAL-B','player-b'),('GAL-C','player-c'))
update public.s1_room_players p set session_token_hash=public.s1_hash_token(t.token)from tokens t where p.room_code='ACT973N'and p.role_slot=t.role_slot;
insert into public.game_runs(room_code,run_mode,behavior_dataset_eligible,status,scene_id,phase_key,step_key)values
('ACT973N','normal',true,'active','sprint6','act9_discussion','step_1'),
('ACT973A','audit',false,'active','sprint6','act9_discussion','step_1');
set local session_replication_role=replica;
insert into public.s6_run_state(run_id,act_no,phase_key,act9_step,round_no)select run_id,9,'act9_discussion',1,1 from public.game_runs where room_code in('ACT973N','ACT973A');
set local session_replication_role=origin;

do $$declare rn uuid;ra uuid;dn uuid;dn_retry uuid;da uuid;da_retry uuid;state jsonb;result jsonb;begin
 select run_id into rn from public.game_runs where room_code='ACT973N';select run_id into ra from public.game_runs where room_code='ACT973A';
 dn:=public.s6_open_discussion(rn,'act9_discussion','step_1',180,'normal-initial');
 if(select phase_deadline is not null from public.discussion_sessions where discussion_session_id=dn)then raise exception'NORMAL ACT9 initial deadline not null';end if;
 update public.discussion_sessions set phase_deadline=clock_timestamp()-interval'1 second'where discussion_session_id=dn;
 perform public.s6_refresh_owned_discussion(rn);
 if(select phase_key from public.s6_run_state where run_id=rn)<>'act9_discussion'then raise exception'NORMAL ACT9 auto-advanced';end if;
 update public.discussion_sessions set phase_deadline=null where discussion_session_id=dn;
 state:=public.s6_get_player_state('ACT973N','player-a');
 if state#>>'{discussion,teacher_open_required}'<>'true'or state#>>'{discussion,phase_deadline}'is not null then raise exception'NORMAL Player projection is not Teacher-paced';end if;
 perform public.s6_send_message_guarded('ACT973N','player-a',dn,gen_random_uuid(),'still open after old deadline');
 perform pg_temp.expect_error(format('select public.s6_close_discussion_guarded(%L,%L,%L,%s,%s,%L::uuid)','ACT973N','player-a','act9_discussion',1,1,dn),'Teacher must open');
 perform pg_temp.expect_error(format('select public.s6_teacher_open_vote(%L,%L,%L::uuid,%L,%s,%s,%L::uuid)','ACT973N','teacher-normal',rn,'act9_discussion',2,1,dn),'Stale or ineligible');
 result:=public.s6_teacher_open_vote('ACT973N','teacher-normal',rn,'act9_discussion',1,1,dn);
 if result->>'phase_key'<>'act9_console'then raise exception'NORMAL Teacher transition failed';end if;
 perform pg_temp.expect_error(format('select public.s6_teacher_open_vote(%L,%L,%L::uuid,%L,%s,%s,%L::uuid)','ACT973N','teacher-normal',rn,'act9_discussion',1,1,dn),'Stale or ineligible');
 perform public.s6_submit_group_choice_v2('ACT973N','player-a',gen_random_uuid(),'red','act9_console',1,1);
 perform public.s6_submit_group_choice_v2('ACT973N','player-b',gen_random_uuid(),'red','act9_console',1,1);
 result:=public.s6_submit_group_choice_v2('ACT973N','player-c',gen_random_uuid(),'blue','act9_console',1,1);
 if coalesce((result->>'resolved')::boolean,false)is not true then raise exception'Legitimate NORMAL Player votes did not resolve';end if;
 update public.s6_run_state set phase_key='act9_discussion',round_no=2 where run_id=rn;
 dn_retry:=public.s6_open_discussion(rn,'act9_discussion','step_1',60,'normal-retry');
 if(select phase_deadline is not null from public.discussion_sessions where discussion_session_id=dn_retry)then raise exception'NORMAL ACT9 retry deadline not null';end if;

 da:=public.s6_open_discussion(ra,'act9_discussion','step_1',180,'audit-initial');
 if not(select phase_deadline is not null from public.discussion_sessions where discussion_session_id=da)then raise exception'AUDIT ACT9 initial deadline null';end if;
 update public.discussion_sessions set phase_deadline=clock_timestamp()-interval'1 second'where discussion_session_id=da;
 perform public.s6_refresh_owned_discussion(ra);
 if(select phase_key from public.s6_run_state where run_id=ra)<>'act9_console'then raise exception'AUDIT ACT9 180-second transition failed';end if;
 update public.s6_run_state set phase_key='act9_discussion',round_no=2 where run_id=ra;
 da_retry:=public.s6_open_discussion(ra,'act9_discussion','step_1',60,'audit-retry');
 if not(select phase_deadline is not null from public.discussion_sessions where discussion_session_id=da_retry)then raise exception'AUDIT ACT9 retry deadline null';end if;
 update public.discussion_sessions set phase_deadline=clock_timestamp()-interval'1 second'where discussion_session_id=da_retry;
 perform public.s6_refresh_owned_discussion(ra);
 if(select phase_key from public.s6_run_state where run_id=ra)<>'act9_console'then raise exception'AUDIT ACT9 60-second transition failed';end if;
 perform pg_temp.expect_error(format('select public.s6_teacher_open_vote(%L,%L,%L::uuid,%L,%s,%s,%L::uuid)','ACT973A','teacher-audit',ra,'act9_discussion',1,2,da_retry),'Stale or ineligible');
end$$;

select 'ACT9_073_POSTGRESQL_TRANSACTION_PASS' result;
rollback;
