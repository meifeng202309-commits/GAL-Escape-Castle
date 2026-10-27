\set ON_ERROR_STOP on
begin;

create or replace function pg_temp.expect_error(command text,expected text)returns void language plpgsql as $$
begin execute command;raise exception'Expected error containing %, but command succeeded',expected;
exception when others then if sqlerrm like 'Expected error containing %'then raise;end if;if position(expected in sqlerrm)=0 then raise exception'Expected error containing %, got %',expected,sqlerrm;end if;end$$;

do $$declare mismatches int;begin
 select count(*)into mismatches from public.act9_073_recovery_snapshot s join pg_proc p on p.oid=to_regprocedure('public.'||s.identity)
 where pg_get_functiondef(p.oid)<>s.definition
    or coalesce(array(select a::text from unnest(p.proacl)a order by a::text),'{}')is distinct from s.acl
    or p.proowner::regrole::text<>s.owner_name or p.prosecdef<>s.security_definer;
 if mismatches<>0 then raise exception'Recovery catalog mismatch for % functions',mismatches;end if;
 if(select count(*)from public.act9_073_recovery_snapshot)<>5 then raise exception'Recovery snapshot count mismatch';end if;
 if not exists(select 1 from public.s1_rooms where room_code='REC073N')then raise exception'Unrelated game data was not preserved';end if;
 if to_regprocedure('public.s3b_grab_and_leave(text,text,uuid,uuid)')is null then raise exception'Later unrelated W03 function was not preserved';end if;
end$$;

do $$declare rn uuid;ra uuid;dn uuid;da uuid;d10 uuid;state jsonb;result jsonb;begin
 select run_id into rn from public.game_runs where room_code='REC073N';select run_id into ra from public.game_runs where room_code='REC073A';
 dn:=public.s6_open_discussion(rn,'act9_discussion','step_1',180,'restored-act9');
 if not(select phase_deadline is not null from public.discussion_sessions where discussion_session_id=dn)then raise exception'Restored NORMAL ACT9 deadline is null';end if;
 state:=public.s6_get_player_state('REC073N','player-normal');
 if state#>>'{discussion,teacher_open_required}'is not null then raise exception'Restored ACT9 retained 073 Teacher marker';end if;
 perform pg_temp.expect_error(format('select public.s6_teacher_open_vote(%L,%L,%L::uuid,%L,%s,%s,%L::uuid)','REC073N','teacher-normal',rn,'act9_discussion',1,1,dn),'Stale or ineligible');
 update public.discussion_sessions set phase_deadline=clock_timestamp()-interval'1 second'where discussion_session_id=dn;
 result:=public.s6_close_discussion_guarded('REC073N','player-normal','act9_discussion',1,1,dn);
 if result->>'phase_key'<>'act9_console'then raise exception'Restored ACT9 Player close did not advance';end if;

 update public.s6_run_state set act_no=10,phase_key='act10_discussion',act9_step=4,round_no=1 where run_id=rn;
 d10:=public.s6_open_discussion(rn,'act10_discussion','reveal',300,'restored-act10');
 if(select phase_deadline is not null from public.discussion_sessions where discussion_session_id=d10)then raise exception'Restored NORMAL ACT10 deadline is not null';end if;
 state:=public.s6_get_player_state('REC073N','player-normal');
 if state#>>'{discussion,teacher_open_required}'<>'true'then raise exception'Restored ACT10 Teacher marker missing';end if;
 perform pg_temp.expect_error(format('select public.s6_teacher_open_vote(%L,%L,%L::uuid,%L,%s,%s,%L::uuid)','REC073N','teacher-normal',rn,'act10_discussion',3,1,d10),'Stale or ineligible');
 result:=public.s6_teacher_open_vote('REC073N','teacher-normal',rn,'act10_discussion',4,1,d10);
 if result->>'phase_key'<>'act10_final_vote'then raise exception'Restored ACT10 Teacher transition failed';end if;

 da:=public.s6_open_discussion(ra,'act9_discussion','step_1',60,'restored-audit');
 if not(select phase_deadline is not null from public.discussion_sessions where discussion_session_id=da)then raise exception'Restored AUDIT ACT9 deadline is null';end if;
 update public.discussion_sessions set phase_deadline=clock_timestamp()-interval'1 second'where discussion_session_id=da;
 perform public.s6_refresh_owned_discussion(ra);
 if(select phase_key from public.s6_run_state where run_id=ra)<>'act9_console'then raise exception'Restored AUDIT ACT9 expiry failed';end if;
end$$;

select 'ACT9_073_RECOVERY_TO_072_PASS' result;
rollback;
