-- Sprint 5 correction: exact-session messaging without legacy global round ordering.
create function public.s5_send_message(
 p_room_code text,p_session_token text,p_expected_discussion_session_id uuid,
 p_expected_vote_round integer,p_client_request_id uuid,p_message_text text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare room text:=upper(trim(p_room_code));p public.s1_room_players%rowtype;g public.game_runs%rowtype;s public.s5_run_state%rowtype;ds public.discussion_sessions%rowtype;prior public.dialogue_messages%rowtype;body text:=trim(p_message_text);m public.dialogue_messages%rowtype;
begin
 p:=public.s1_get_player_by_session(room,p_session_token);g:=public.s2_get_active_run(room);perform 1 from public.game_runs where run_id=g.run_id for update;select * into s from public.s5_run_state where run_id=g.run_id;
 select * into prior from public.dialogue_messages where run_id=g.run_id and player_id=p.player_id and client_request_id=p_client_request_id;if found then if prior.discussion_session_id<>p_expected_discussion_session_id or prior.message_text<>body then raise exception'Message request identity was reused with different content.';end if;return jsonb_build_object('ok',true,'message_id',prior.message_id,'idempotent_replay',true);end if;
 select d.* into ds from public.discussion_sessions d join public.s5_rounds r using(discussion_session_id)where d.discussion_session_id=p_expected_discussion_session_id and r.run_id=g.run_id and r.phase_key=s.phase_key and r.vote_round=p_expected_vote_round for update;
 if not found or ds.status<>'discussion' or not ds.allow_free_text then raise exception'Stale Sprint 5 discussion identity.';end if;if body=''or char_length(body)>1000 then raise exception'Message must contain 1-1000 characters.';end if;
 insert into public.dialogue_messages(run_id,discussion_session_id,scene_id,phase_key,step_key,player_id,message_text,client_request_id)values(g.run_id,ds.discussion_session_id,ds.scene_id,ds.phase_key,ds.step_key,p.player_id,body,p_client_request_id)returning * into m;
 perform public.s2_log_event(g.run_id,room,ds.discussion_session_id,'dialogue_message_sent',p.player_id,jsonb_build_object('message_id',m.message_id,'client_request_id',p_client_request_id));return jsonb_build_object('ok',true,'message_id',m.message_id,'idempotent_replay',false);
end$$;
revoke execute on function public.s5_send_message(text,text,uuid,integer,uuid,text) from public;
grant execute on function public.s5_send_message(text,text,uuid,integer,uuid,text) to anon,authenticated;
