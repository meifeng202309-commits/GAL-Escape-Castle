import {createHash} from "node:crypto";
import {mkdtemp,mkdir,writeFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const validator=resolve(fileURLToPath(new URL("../tools/sprint9-asset-readiness-validator.mjs",import.meta.url)));
const hash=b=>createHash("sha256").update(b).digest("hex");
const assert=(v,m)=>{if(!v)throw new Error(m)};

function tinyWebp(width=8,height=6){
  const payload=Buffer.alloc(10);
  payload.writeUInt32LE(0,0);
  let w=width-1,h=height-1;
  payload[4]=w&255;payload[5]=(w>>8)&255;payload[6]=(w>>16)&255;
  payload[7]=h&255;payload[8]=(h>>8)&255;payload[9]=(h>>16)&255;
  const out=Buffer.alloc(30);
  out.write("RIFF",0,"ascii");out.writeUInt32LE(22,4);out.write("WEBP",8,"ascii");
  out.write("VP8X",12,"ascii");out.writeUInt32LE(10,16);payload.copy(out,20);
  return out;
}
const entry=(i,overrides={})=>({
  asset_key:`asset.${String(i).padStart(2,"0")}`,display_name:`Asset ${i}`,aliases:[],
  asset_type:"image",latest_version:0,active_version:null,continuity_refs:[],paired_asset_group:null,
  required_anchors:[],runtime_required:false,...overrides
});
async function makeRoot(){
  const root=await mkdtemp(join(tmpdir(),"gal-s9-validator-"));
  await mkdir(join(root,"assets","staging"),{recursive:true});
  const assets=Array.from({length:28},(_,i)=>entry(i));
  await writeFile(join(root,"assets","asset-registry.json"),JSON.stringify({schema_version:"1.0",assets},null,2));
  return{root,assets};
}
async function saveRegistry(root,assets){
  await writeFile(join(root,"assets","asset-registry.json"),JSON.stringify({schema_version:"1.0",assets},null,2));
}
async function candidate(root,asset,metaOverrides={},binary=tinyWebp()){
  asset.latest_version=1;
  const dir=join(root,"assets","staging",asset.asset_key,"v001");
  await mkdir(dir,{recursive:true});
  const filename=`${asset.asset_key}__v001.webp`;
  await writeFile(join(dir,filename),binary);
  const meta={
    asset_key:asset.asset_key,asset_type:asset.asset_type,version:1,status:"APPROVED",teacher_review:"APPROVED",
    filename,width_px:8,height_px:6,sha256:hash(binary),required_anchors:asset.required_anchors||[],...metaOverrides
  };
  await writeFile(join(dir,`${asset.asset_key}__v001.json`),JSON.stringify(meta,null,2));
}
function run(root,mode="integrity"){
  const p=spawnSync(process.execPath,[validator,"--root",root,"--mode",mode,"--json-only"],{encoding:"utf8"});
  let report=null;try{report=JSON.parse(p.stdout)}catch{}
  return{status:p.status,stderr:p.stderr,report};
}

const roots=[];
try{
  {
    const f=await makeRoot();roots.push(f.root);
    f.assets[0].runtime_required=true;await candidate(f.root,f.assets[0]);await saveRegistry(f.root,f.assets);
    let r=run(f.root,"integrity");
    assert(r.status===0,"healthy integrity fixture failed");
    assert(r.report.summary.valid_approved===1&&r.report.summary.absent===27,"healthy counts wrong");
    r=run(f.root,"readiness");assert(r.status===0&&r.report.summary.readiness_ok,"healthy readiness fixture failed");
  }
  {
    const f=await makeRoot();roots.push(f.root);
    f.assets[0].runtime_required=true;await candidate(f.root,f.assets[0],{sha256:"0".repeat(64)});await saveRegistry(f.root,f.assets);
    const r=run(f.root,"integrity");
    assert(r.status===2&&r.report.assets.find(x=>x.asset_key===f.assets[0].asset_key).classification==="INVALID","approved hash mismatch not rejected");
  }
  {
    const f=await makeRoot();roots.push(f.root);
    f.assets[0].runtime_required=true;f.assets[0].required_anchors=["door"];await candidate(f.root,f.assets[0]);await saveRegistry(f.root,f.assets);
    let r=run(f.root,"integrity");assert(r.status===0,"missing anchor metadata must block readiness, not corrupt package integrity");
    r=run(f.root,"readiness");
    assert(r.status===3&&r.report.assets.find(x=>x.asset_key===f.assets[0].asset_key).classification==="BLOCKED","required anchor gap not blocked");
  }
  {
    const f=await makeRoot();roots.push(f.root);
    f.assets[0].runtime_required=true;f.assets[0].latest_version=1;
    const dir=join(f.root,"assets","staging",f.assets[0].asset_key,"v001");await mkdir(dir,{recursive:true});
    const filename=`${f.assets[0].asset_key}__v001.svg`;
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6"></svg>';
    await writeFile(join(dir,filename),svg);
    await writeFile(join(dir,`${f.assets[0].asset_key}__v001.json`),JSON.stringify({
      asset_key:f.assets[0].asset_key,asset_type:"image",version:1,status:"PLACEHOLDER",
      teacher_review:"TEMPORARY_PLACEHOLDER",filename,width_px:8,height_px:6,placeholder:true,required_anchors:[]
    }));
    await saveRegistry(f.root,f.assets);
    const r=run(f.root,"readiness");
    assert(r.status===3&&r.report.summary.placeholder===1,"placeholder readiness classification failed");
  }
  {
    const f=await makeRoot();roots.push(f.root);
    f.assets[0].runtime_required=true;f.assets[0].paired_asset_group="pair";f.assets[1].paired_asset_group="pair";
    await candidate(f.root,f.assets[0],{paired_asset_group:"pair"});await saveRegistry(f.root,f.assets);
    const r=run(f.root,"readiness");
    const a=r.report.assets.find(x=>x.asset_key===f.assets[0].asset_key);
    assert(r.status===3&&a.classification==="BLOCKED"&&a.latest_candidate.block_reasons.includes("paired_group_incomplete:pair"),"incomplete paired group not blocked");
  }
  {
    const f=await makeRoot();roots.push(f.root);
    f.assets[1].asset_key=f.assets[0].asset_key;await saveRegistry(f.root,f.assets);
    const r=run(f.root,"integrity");
    assert(r.status===2&&r.report.global_errors.some(x=>x.startsWith("duplicate_asset_key:")),"duplicate registry identity not rejected");
  }
  console.log("Sprint9 asset readiness validator focused tests passed.");
}finally{
  for(const root of roots)await rm(root,{recursive:true,force:true});
}
