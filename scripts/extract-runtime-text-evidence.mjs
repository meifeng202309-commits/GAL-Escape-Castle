import fs from "node:fs";
import {LOCALIZATION_CATALOG} from "../src/content/localization.generated.js";

const rows=[];
const add=(role,act,scene,phase,trigger,keys,source,parameters={},fixture="",uncertainty="")=>rows.push({player_role:role,act,scene_id:scene,phase_key:phase,trigger_choice_outcome:trigger,ordered_runtime_text_keys:keys,source_file_or_function:source,parameters,fixture_evidence:fixture,uncertainty});
const all=(act,scene,phase,trigger,keys,source,parameters={},fixture="",uncertainty="")=>add("ALL",act,scene,phase,trigger,keys,source,parameters,fixture,uncertainty);

add("GAL-A / Gitte",1,"act1_wake_up","private_first_action","opening",["act01-g.001","act01-g.002","act01-g.003","act01-g.004","act01-g.005","act01-g.007","act01-g.008","act01-g.016","act01-g.017","act01-g.018"],"database/014b_sprint3b_targeted_closure_corrections.sql:s3b_initialize_flow",{},"tests/sprint3b-live-e2e.js");
add("GAL-B / Anna",1,"act1_wake_up","private_first_action","opening",["act01-a.001","act01-g.004","act01-g.005","act01-a.003","act01-a.004","act01-a.005"],"database/014b_sprint3b_targeted_closure_corrections.sql:s3b_initialize_flow",{},"tests/sprint3b-live-e2e.js");
add("GAL-C / Linda",1,"act1_wake_up","private_first_action","opening",["act01-l.001","act01-l.002","act01-g.005","act01-l.004","act01-l.005","act01-l.006","act01-l.007","act01-l.008","act01-l.009","act01-l.010","act01-l.011"],"database/014b_sprint3b_targeted_closure_corrections.sql:s3b_initialize_flow",{},"tests/sprint3b-live-e2e.js");
const act1={
  "GAL-A / Gitte":{study_map:["act01-g.023","act01-g.024"],check_sound:["act01-g.025","act01-g.026","act01-g.027"],study_number_note:["act01-g.007","act01-g.028","act01-g.029"],search_room:["act01-g.030"]},
  "GAL-B / Anna":{read_diary:["act01-a.010"],check_door:["act01-a.011","act01-a.012","act01-a.013"],check_phone:["act01-a.014","act01-g.005"],check_vent:["act01-a.015","act01-a.016"]},
  "GAL-C / Linda":{read_notice:["act01-l.016"],study_watch:["act01-l.004","act01-g.028","act01-l.017"],try_star_key:["act01-l.018","act01-l.019"],check_mirror:["act01-l.020","act01-l.021"]}
};
for(const [role,choices] of Object.entries(act1))for(const [choice,keys] of Object.entries(choices))add(role,1,"act1_wake_up","private_first_action",`choice=${choice} consequence`,keys,"database/011_sprint3b_transition_and_act1_delivery_integrity.sql:s3b_submit_act1_choice",{choice},"tests/trial6-act1-vote-stale-identity-browser.mjs");

all(2,"act2_first_contact","private_first_meeting","all ACT1 complete",["act02.002"],"database/011_sprint3b_transition_and_act1_delivery_integrity.sql:s3b_complete_act1",{},"tests/sprint3b-live-e2e.js");
const routes={library:["act02.032","act02.033"],great_hall:["act02.032","act02.033"],main_gate:["act02.032","act02.033"],west_tower:["act02.032","act02.033"],chapel:["act02.032","act02.033"]};
const locationKeys={library:"act01-g.009",great_hall:"act01-g.010",main_gate:"act01-g.011",west_tower:"act01-g.012",chapel:"act01-g.013"};
for(const [route,keys] of Object.entries(routes))all(2,"act2_route_update","route_update",`meeting result=${route}`,keys,"src/game/app.js:renderSprint3b + database/012_sprint3b_internal_wrapper_lockdown_and_route_delivery.sql:s3b_ack_route_update",{route,location_text_key:locationKeys[route]},"tests/sprint3b-remediation-live-e2e.js");
for(const [route,key] of Object.entries({library:"act03.001",great_hall:"act02.038",main_gate:"act02.043",west_tower:"act02.046",chapel:"act02.049"}))all(2,"act2_rendezvous","route_consequence",`route=${route}`,[key],"database/012_sprint3b_internal_wrapper_lockdown_and_route_delivery.sql:s3b_ack_route_update",{route},"tests/sprint3b-remediation-live-e2e.js");

all(3,"act3_library","library_box","box locked",["act03.008"],"database/054_level3_integrated_closure.sql:teacher_apply_override + src/game/app.js:renderSprint3b",{},"tests/v4-player-integrated-runtime-browser.mjs","Normal player-driven entry uses the same stored scene; this row is source-proven, not a fresh live projection capture.");
for(const [stage,key] of [[1,"act03.011"],[2,"act03.012"],[3,"act03.013"],[4,"act03.014"],[5,"act03.017"],[6,"act03.018"],[7,"act03.019"],[8,"act03.020"]])all(3,"act3_library","library_box",`fallback hint stage=${stage}`,[key],"src/game/app.js:renderSprint3b + database/011_sprint3b_transition_and_act1_delivery_integrity.sql:s3b_refresh_puzzle_fallback",{puzzle_hint_stage:stage},"tests/sprint3b-remediation-live-e2e.js",stage<4?"Stages 1-3 originate in earlier deployed fallback logic; later stages are explicit in migration 011.":"");
all(4,"act4_known_unknown","private_route_choice","initial or box resolved",["act04-05.002"],"database/014_sprint3b_evidence_and_puzzle_integrity.sql + src/game/app.js:renderSprint3b",{},"tests/sprint3b-remediation-live-e2e.js","Linda additionally sees act04-05.003 in the Scene comparison, not Runtime narration; excluded here.");
all(5,"act5_route_discussion","discussion","private choices differ",["act04-05.009"],"database/054_level3_integrated_closure.sql + src/game/app.js:renderSprint3b",{},"tests/sprint3b-remediation-live-e2e.js","Discussion UI/chat is excluded from Runtime text.");
all(5,"act5_inspect_first","post_inspection_route","inspect-first branch",["act04-05.015","act04-05.016","act04-05.017"],"database/054_level3_integrated_closure.sql + src/game/app.js:renderSprint3b",{},"tests/sprint3b-remediation-live-e2e.js");
all(5,"act5_route_resolved","terminal","known route",["act04-05.019","act04-05.020","act04-05.021","act04-05.022","act04-05.023"],"src/game/app.js:renderAct5Handoff",{group_route:"known"},"tests/v4-player-integrated-runtime-browser.mjs","act04-05.023 is also the Action button label; included because the current handoff renderer places the same key in Runtime.");
all(5,"act5_route_resolved","terminal","unknown route",["act04-05.024","act04-05.025","act04-05.026","act04-05.027","act04-05.022","act04-05.023"],"src/game/app.js:renderAct5Handoff",{group_route:"unknown"},"tests/v4-player-integrated-runtime-browser.mjs","act04-05.023 is also the Action button label; included because the current handoff renderer places the same key in Runtime.");

for(const [outcome,key] of Object.entries({fallback:"act06.006",escape:"act06.007","1897":"act06.008",time_stopped:"act06.009",same_person:"act06.010"}))all(6,"act6_portrait","act6_answer",`portrait result=${outcome}`,[key],"database/027_sprint5_act6_8_runtime.sql:s5_resolve_round + src/game/app.js:renderSprint5",{outcome},"tests/v4-player-integrated-runtime-browser.mjs");
all(7,"act7_clock_room","act7_vote","initial/revote",["act07.001","act07.002","act07.003","act07.004","act07.005","act07.006","act07.007"],"src/game/app.js:renderSprint5",{},"tests/act7-v4-normal-timeout-browser.mjs");
for(const [attempt,key] of [[1,"act07.012"],[2,"act07.013"],[3,"act07.014"]])all(7,"act7_clock_room","act7_vote",`wrong majority attempt=${attempt}`,["act07.001","act07.002","act07.003","act07.004","act07.005","act07.006","act07.007",key],"src/game/app.js:renderSprint5 + database/027_sprint5_act6_8_runtime.sql",{act7_wrong_attempts:attempt},"tests/act7-v4-normal-timeout-browser.mjs");
all(8,"act8_route","act8_route","main_gate route",["act08.005","act08.006","act08.007"],"src/game/app.js:renderSprint5",{route_taken_act8:"main_gate"},"tests/v4-player-integrated-runtime-browser.mjs");
all(8,"act8_route","act8_route","west_tower route",["act08.010","act08.011"],"src/game/app.js:renderSprint5",{route_taken_act8:"west_tower"},"tests/v4-player-integrated-runtime-browser.mjs");

for(const [role,key] of Object.entries({"GAL-A / Gitte":"act09.005","GAL-B / Anna":"act09.006","GAL-C / Linda":"act09.007"}))add(role,9,"act9_great_hall","act9_discussion","initial private clue",["act09.004",key],"database/033_sprint6_act9_13_runtime.sql:s6_deliver_clues + src/game/app.js:renderSprint6",{role_private:true},"tests/v4-player-integrated-runtime-browser.mjs","Role-private key appears only for its owner; discussion controls/chat are excluded.");
for(const [trigger,keys] of Object.entries({"1:1:1 no consensus":["act09.009"],"step1 red correct":["act09.014"],"step2 do_not_enter correct":["act09.017","act09.018"],"step3 blue correct":["act09.019"],"step4 stay":["act09.021"],"wrong step1":["act09.022"],"wrong step2":["act09.023","act09.024","act09.006"],"wrong step3":["act09.007"],"wrong step4":["act09.023","act09.024"],"step4 enter_blue correct":["act09.026","act09.027"]}))all(9,"act9_great_hall",trigger.includes("discussion")?"act9_discussion":"act9_console",trigger,keys,"database/035_sprint6_focused_audit_corrections.sql:s6_submit_group_choice_guarded + src/game/app.js:renderSprint6",{},"tests/act9-073-postgresql-transaction.sql");
for(const [role,key] of Object.entries({"GAL-A / Gitte":"act10.001","GAL-B / Anna":"act10.002","GAL-C / Linda":"act10.003"}))add(role,10,"act10_golden_key","act10_private","role-private golden-key clue",[key],"database/033_sprint6_act9_13_runtime.sql:s6_deliver_clues + src/game/app.js:renderSprint6",{role_private:true},"tests/v4-player-integrated-runtime-browser.mjs","Only the owner receives this private clue.");
all(10,"act10_golden_key","act10_result","group takes key",["act10.008"],"database/035_sprint6_focused_audit_corrections.sql:s6_submit_group_choice_guarded",{winner:"take"},"tests/ca284-act10-teacher-open-vote-browser.mjs");
all(10,"act10_golden_key","act10_result","group leaves key",["act10.009"],"database/035_sprint6_focused_audit_corrections.sql:s6_submit_group_choice_guarded",{winner:"leave"},"tests/ca284-act10-teacher-open-vote-browser.mjs");
all(11,"act11_main_gate","act11_discussion","after ACT10 result",["act11.001","act11.002","act11.003","act11.004"],"database/035_sprint6_focused_audit_corrections.sql:s6_advance_guarded",{},"tests/sprint6-static-check.js");
for(const [station,key] of Object.entries({A:"act12.005",B:"act12.006",C:"act12.007"}))all(12,"act12_main_gate","act12_pressure",`mechanism failure station=${station}`,[key],"database/035_sprint6_focused_audit_corrections.sql:s6_engage_guarded",{mechanism_failure_station:station},"tests/sprint6-static-check.js");
const cinematic={1:["act12.016"],2:["act12.017","act12.018","act12.019"],"3_take":["act12.020"],"3_leave":["act12.018"],4:["act12.021"],5:["act12.022"],6:["act12.023"],7:["act12.024"],8:["act12.025"],9:["act12.026"],13:["act12.027","act13.001","act13.002","act13.003","act02.024"]};
for(const [stage,keys] of Object.entries(cinematic))all(12,"act12_main_gate","act12_cinematic",`cinematic stage=${stage}`,keys,"database/036_sprint6_four_open_findings.sql:s6_tick_cinematic + src/game/app.js:renderSprint6",{cinematic_stage:stage},"tests/sprint6-static-check.js",stage==="13"?"Final array includes act02.024 by effective migration 036; GA should review whether this is intended Runtime copy.":"");
all(13,"act13_escape","act13_escape","cinematic completion",["act12.027","act13.001","act13.002","act13.003","act02.024"],"database/036_sprint6_four_open_findings.sql:s6_tick_cinematic + src/game/app.js:renderSprint6",{},"tests/v4-player-integrated-runtime-browser.mjs","ACT13 renderer receives the effective final feedback array; local Continue is an Action and excluded.");
all(14,"act14_final_reveal","act14_complete","finalization ready",["act14.001","act14.002","act14.003","act14.004","act14.005"],"database/048_sprint8_focused_level1_corrections.sql:s8_get_player_state + src/game/app.js:renderSprint8",{},"tests/sprint8-act14-presentation-static-check.js");

const apply=(text,replacements={})=>Object.entries(replacements).reduce((v,[token,value])=>v.replaceAll(`{${token}}`,value),text||"");
for(const row of rows){
  const resolved=row.ordered_runtime_text_keys.map(key=>{
    const item=LOCALIZATION_CATALOG[key];if(!item)throw new Error(`Missing localization key ${key}`);
    let nl=item.nl,zh=item.zh;
    if(key==="act02.032"&&row.parameters.location_text_key){const location=LOCALIZATION_CATALOG[row.parameters.location_text_key];nl=apply(nl,{location:location.nl});zh=apply(zh,{location:location.zh})}
    return{key,nl,zh};
  });
  row.rendered_nl=resolved.map(x=>x.nl).join("\n");row.rendered_zh=resolved.map(x=>x.zh).join("\n");
  row.ordered_runtime_text_keys=row.ordered_runtime_text_keys.join(" | ");row.parameters=JSON.stringify(row.parameters);
}
const columns=["player_role","act","scene_id","phase_key","trigger_choice_outcome","ordered_runtime_text_keys","rendered_nl","rendered_zh","source_file_or_function","parameters","fixture_evidence","uncertainty"];
const quote=value=>`"${String(value??"").replaceAll('"','""')}"`;
const csv=[columns.map(quote).join(","),...rows.map(row=>columns.map(key=>quote(row[key])).join(","))].join("\r\n")+"\r\n";
const output="docs/reports/remediation/ui/TEACHER_TRIAL_20261113_PLAYER_RUNTIME_TEXT_EVIDENCE.csv";
fs.writeFileSync(output,csv,"utf8");
console.log(`Wrote ${rows.length} Runtime evidence rows to ${output}`);
