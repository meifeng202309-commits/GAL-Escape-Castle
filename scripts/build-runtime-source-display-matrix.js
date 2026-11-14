const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const dir=path.join(root,"docs/reports/remediation/ui");
const roles=["Anna","Gitte","Linda"];

function splitRow(line){
  const values=[];let value="";
  for(let i=1;i<line.length-1;i++){
    const c=line[i];
    if(c==="|"&&line[i-1]!=="\\"){values.push(value.trim());value=""}else value+=c;
  }
  values.push(value.trim());
  return values.map(v=>v.replaceAll("\\|","|"));
}
function rows(file){return fs.readFileSync(file,"utf8").split(/\r?\n/).filter(line=>/^\|\s*\d+\s*\|/.test(line)).map(splitRow)}
function csv(value){const text=String(value??"");return `"${text.replaceAll('"','""')}"`}

const output=[];
for(const role of roles){
  const zh=rows(path.join(dir,`runtime_message_${role}.md`));
  const nl=new Map(rows(path.join(dir,`runtime_message_${role}_NL.md`)).map(row=>[row[1],row]));
  if(zh.length!==72||nl.size!==72)throw new Error(`${role} expected 72 rows, got zh=${zh.length}, nl=${nl.size}`);
  for(const row of zh){
    const translated=nl.get(row[1]);if(!translated)throw new Error(`Missing NL row ${row[1]}`);
    const keys=row[9].split("|").map(x=>x.trim()).filter(Boolean);
    const approvedZh=row[4],approvedNl=translated[3];
    let need=keys.length===0?"NEW_STATE_OR_KEY_REVIEW":keys.length===1?"EXISTING_KEY_COPY_CANDIDATE":"COMPOSED_EXISTING_KEYS_DO_NOT_COLLAPSE";
    if(row[0]==="14")need="LOCKED_ACT14_NO_COPY_CHANGE_WITHOUT_OWNER";
    if(row[1]==="ANNA-004")need="REMOVE_DEVICE_DISCOVERY_AFTER_CONSUMER_CHECK";
    const enterPortrait=/ENTER PORTRAIT HALL|进入肖像大厅/i.test(`${approvedZh} ${approvedNl}`);
    const surface=enterPortrait?"Action control (exclude from Runtime)":"Runtime (source-evidenced)";
    const voice=/神秘的声音|低沉[^<]*声音|\bstem\b|\bvoice\b/i.test(`${approvedZh} ${approvedNl}`)?(role==="Gitte"&&row[0]==="1"?"FIRST_AUDIBLE_CASTLE_VOICE":"VOICE_COPY_REVIEW"):"";
    const sms=/UNKNOWN SENDER|未知发件人|ONBEKENDE AFZENDER/i.test(`${approvedZh} ${approvedNl}`)?"SMS_TEXT_NOT_AUDIO":"";
    output.push([role,row[0],row[1],row[6],row[7],row[8],row[9],row[10],surface,`runtime_message_${role}.md#${row[1]}`,`runtime_message_${role}_NL.md#${row[1]}`,need,voice||sms,row[12],row[13]]);
  }
}
const header=["role","act","page_id","scene_id","phase_key","trigger_outcome","ordered_runtime_keys","sql_projection_or_js_caller","current_surface","approved_chinese_reference","approved_dutch_reference","state_key_disposition","voice_sms_contract","uncertainty_coverage","role_visibility"];
const text=[header,...output].map(row=>row.map(csv).join(",")).join("\r\n")+"\r\n";
fs.writeFileSync(path.join(dir,"RUNTIME_GA146_SOURCE_TO_DISPLAY_MATRIX_20261114.csv"),text,"utf8");
console.log(`Generated ${output.length} rows (${roles.map(role=>`${role}=72`).join(", ")}).`);
