#!/usr/bin/env node
import {createHash} from "node:crypto";
import {existsSync} from "node:fs";
import {readFile,readdir,stat} from "node:fs/promises";
import {dirname,extname,join,resolve} from "node:path";
import {fileURLToPath} from "node:url";

const EXPECTED_REGISTRY_COUNT=28;
const scriptDir=dirname(fileURLToPath(import.meta.url));

function parseArgs(argv){
  const out={root:resolve(scriptDir,".."),mode:"integrity",jsonOnly:false};
  for(let i=0;i<argv.length;i++){
    const arg=argv[i];
    if(arg==="--root")out.root=resolve(argv[++i]);
    else if(arg==="--mode")out.mode=argv[++i];
    else if(arg==="--json-only")out.jsonOnly=true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if(!["integrity","readiness"].includes(out.mode))throw new Error("--mode must be integrity or readiness");
  return out;
}
const uniqSorted=a=>[...new Set(a)].sort();
const sameSet=(a,b)=>JSON.stringify(uniqSorted(a||[]))===JSON.stringify(uniqSorted(b||[]));
const isPosInt=x=>Number.isInteger(x)&&x>0;
const isText=x=>typeof x==="string"&&x.trim().length>0;
const sha256=b=>createHash("sha256").update(b).digest("hex");
const vdir=n=>`v${String(n).padStart(3,"0")}`;
const canonicalBase=(key,n)=>`${key}__${vdir(n)}`;

async function listDirs(path){
  if(!existsSync(path))return[];
  return (await readdir(path,{withFileTypes:true})).filter(x=>x.isDirectory()).map(x=>x.name).sort();
}
async function listFiles(path){
  if(!existsSync(path))return[];
  return (await readdir(path,{withFileTypes:true})).filter(x=>x.isFile()).map(x=>x.name).sort();
}
function u24le(b,o){return b[o]|(b[o+1]<<8)|(b[o+2]<<16)}
function u16le(b,o){return b[o]|(b[o+1]<<8)}
function u32le(b,o){return (b[o]|(b[o+1]<<8)|(b[o+2]<<16)|(b[o+3]<<24))>>>0}
function webpDimensions(buf){
  if(buf.length<20||buf.toString("ascii",0,4)!=="RIFF"||buf.toString("ascii",8,12)!=="WEBP")return null;
  let o=12;
  while(o+8<=buf.length){
    const type=buf.toString("ascii",o,o+4),size=u32le(buf,o+4),p=o+8;
    if(p+size>buf.length)return null;
    if(type==="VP8X"&&size>=10)return{width:1+u24le(buf,p+4),height:1+u24le(buf,p+7)};
    if(type==="VP8L"&&size>=5&&buf[p]===0x2f){
      const b1=buf[p+1],b2=buf[p+2],b3=buf[p+3],b4=buf[p+4];
      return{width:1+(b1|((b2&0x3f)<<8)),height:1+((b2>>6)|(b3<<2)|((b4&0x0f)<<10))};
    }
    if(type==="VP8 "&&size>=10&&buf[p+3]===0x9d&&buf[p+4]===0x01&&buf[p+5]===0x2a){
      return{width:u16le(buf,p+6)&0x3fff,height:u16le(buf,p+8)&0x3fff};
    }
    o=p+size+(size&1);
  }
  return null;
}
function svgDimensions(buf){
  const text=buf.toString("utf8",0,Math.min(buf.length,8192));
  const head=text.match(/<svg\b[^>]*>/i)?.[0];
  if(!head)return null;
  const num=s=>{const m=s?.match(/^\s*([0-9]+(?:\.[0-9]+)?)/);return m?Number(m[1]):null};
  const w=num(head.match(/\bwidth\s*=\s*["']([^"']+)["']/i)?.[1]);
  const h=num(head.match(/\bheight\s*=\s*["']([^"']+)["']/i)?.[1]);
  if(w&&h)return{width:Math.round(w),height:Math.round(h)};
  const vb=head.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1]?.trim().split(/[ ,]+/).map(Number);
  return vb?.length===4&&vb.every(Number.isFinite)?{width:Math.round(vb[2]),height:Math.round(vb[3])}:null;
}
function imageDimensions(buf,ext){
  if(ext===".webp")return webpDimensions(buf);
  if(ext===".svg")return svgDimensions(buf);
  return null;
}
function normalizeAnchors(meta){
  const raw=meta?.ui_anchors;
  if(Array.isArray(raw))return raw;
  if(raw&&typeof raw==="object")return Object.entries(raw).map(([anchor_name,v])=>({anchor_name,...(v||{})}));
  return[];
}
function validAnchor(a){
  if(!a||!isText(a.anchor_name))return false;
  return["x_percent","y_percent","width_percent","height_percent"].every(k=>
    Number.isFinite(Number(a[k]))&&Number(a[k])>=0&&Number(a[k])<=100
  );
}
async function inspectCandidate(root,reg,version){
  const dir=join(root,"assets","staging",reg.asset_key,vdir(version));
  const base=canonicalBase(reg.asset_key,version);
  const sidecarPath=join(dir,`${base}.json`);
  const errors=[],warnings=[],blockReasons=[];
  let meta=null,binaryPath=null,actualSha=null,actualDimensions=null,binarySize=0;
  if(!existsSync(sidecarPath)){
    errors.push("missing_sidecar");
    return{version,path:dir,errors,warnings,block_reasons:blockReasons,status:null,teacher_review:null,filename:null,actual_sha256:null,declared_sha256:null,binary_size:0,dimensions:null,anchor_metadata:{required:reg.required_anchors||[],present:[],complete:false}};
  }
  try{meta=JSON.parse(await readFile(sidecarPath,"utf8"))}catch{errors.push("malformed_sidecar_json")}
  if(!meta)return{version,path:dir,errors,warnings,block_reasons:blockReasons,status:null,teacher_review:null,filename:null,actual_sha256:null,declared_sha256:null,binary_size:0,dimensions:null,anchor_metadata:{required:reg.required_anchors||[],present:[],complete:false}};
  if(meta.asset_key!==reg.asset_key)errors.push("asset_key_conflict");
  if(meta.version!==version)errors.push("version_conflict");
  if(meta.asset_type!==reg.asset_type)errors.push("asset_type_conflict");
  if(Array.isArray(meta.required_anchors)&&!sameSet(meta.required_anchors,reg.required_anchors||[]))errors.push("required_anchors_conflict");
  if(meta.paired_asset_group!=null&&meta.paired_asset_group!==reg.paired_asset_group)errors.push("paired_asset_group_conflict");
  const status=isText(meta.status)?meta.status.trim().toUpperCase():"";
  const teacherReview=isText(meta.teacher_review)?meta.teacher_review.trim().toUpperCase():"";
  const isPlaceholder=status==="PLACEHOLDER"||meta.placeholder===true||teacherReview==="TEMPORARY_PLACEHOLDER";
  const isApproved=status==="APPROVED";
  if(!isText(meta.filename))errors.push("missing_filename");
  else{
    const ext=extname(meta.filename).toLowerCase();
    if(!meta.filename.startsWith(base+"."))errors.push("filename_identity_conflict");
    if(reg.asset_type==="image"&&isApproved&&ext!==".webp")errors.push("approved_image_not_webp");
    binaryPath=join(dir,meta.filename);
    if(!existsSync(binaryPath))errors.push("missing_binary");
    else{
      const st=await stat(binaryPath);
      binarySize=st.size;
      if(!st.isFile()||st.size<=0)errors.push("empty_or_nonfile_binary");
      else{
        const bytes=await readFile(binaryPath);
        actualSha=sha256(bytes);
        if(isApproved){
          if(!/^[0-9a-f]{64}$/i.test(meta.sha256||""))errors.push("approved_missing_sha256");
          else if(actualSha!==String(meta.sha256).toLowerCase())errors.push("sha256_mismatch");
        }else if(meta.sha256&&actualSha!==String(meta.sha256).toLowerCase())warnings.push("nonapproved_sha256_mismatch");
        if(reg.asset_type==="image"){
          if(!isPosInt(meta.width_px)||!isPosInt(meta.height_px))errors.push("invalid_declared_dimensions");
          actualDimensions=imageDimensions(bytes,ext);
          if(!actualDimensions&&isApproved)errors.push("unreadable_approved_image_dimensions");
          if(actualDimensions&&isPosInt(meta.width_px)&&isPosInt(meta.height_px)&&
             (actualDimensions.width!==meta.width_px||actualDimensions.height!==meta.height_px))errors.push("dimension_mismatch");
        }
      }
    }
  }
  if(reg.asset_type==="audio"){
    if(isApproved){
      if(!isText(meta.mime_type)||!meta.mime_type.startsWith("audio/"))errors.push("invalid_audio_mime_type");
      if(!isPosInt(meta.duration_ms))errors.push("invalid_audio_duration_ms");
      if(typeof meta.loopable!=="boolean")errors.push("invalid_audio_loopable");
      if(!isText(meta.license_source))errors.push("missing_audio_license_source");
      if(!isText(meta.loudness_note))errors.push("missing_audio_loudness_note");
    }
  }
  if(isApproved&&teacherReview&&teacherReview!=="APPROVED")errors.push("review_status_conflict");
  const required=uniqSorted(reg.required_anchors||[]);
  const anchors=normalizeAnchors(meta).filter(validAnchor);
  const present=uniqSorted(anchors.map(a=>a.anchor_name));
  const missing=required.filter(a=>!present.includes(a));
  if(isApproved&&missing.length)blockReasons.push(...missing.map(a=>`missing_anchor_metadata:${a}`));
  if(isPlaceholder)blockReasons.push("temporary_placeholder");
  if(!isApproved&&!isPlaceholder)blockReasons.push(`review_status:${status||"UNKNOWN"}`);
  return{
    version,path:dir,status:status||null,teacher_review:teacherReview||null,filename:meta.filename||null,
    errors:uniqSorted(errors),warnings:uniqSorted(warnings),block_reasons:uniqSorted(blockReasons),
    actual_sha256:actualSha,declared_sha256:meta.sha256||null,binary_size:binarySize,
    dimensions:{declared:reg.asset_type==="image"?{width:meta.width_px??null,height:meta.height_px??null}:null,actual:actualDimensions},
    audio_metadata:reg.asset_type==="audio"?{
      mime_type:meta.mime_type??null,duration_ms:meta.duration_ms??null,loopable:meta.loopable??null,
      license_source:meta.license_source??null,loudness_note:meta.loudness_note??null
    }:null,
    anchor_metadata:{required,present,complete:missing.length===0,missing}
  };
}

async function main(){
  const args=parseArgs(process.argv.slice(2));
  const registryPath=join(args.root,"assets","asset-registry.json");
  const stagingRoot=join(args.root,"assets","staging");
  const globalErrors=[],globalWarnings=[];
  let registry;
  try{registry=JSON.parse(await readFile(registryPath,"utf8"))}catch(e){
    console.log(JSON.stringify({schema_version:"1.0",mode:args.mode,global_errors:["registry_unreadable"],message:e.message},null,2));
    process.exitCode=2;return;
  }
  if(!Array.isArray(registry.assets))globalErrors.push("registry_assets_not_array");
  const entries=Array.isArray(registry.assets)?registry.assets:[];
  if(entries.length!==EXPECTED_REGISTRY_COUNT)globalErrors.push(`registry_entry_count:${entries.length}:expected:${EXPECTED_REGISTRY_COUNT}`);
  const keys=entries.map(x=>x.asset_key);
  const duplicates=uniqSorted(keys.filter((k,i)=>keys.indexOf(k)!==i));
  if(duplicates.length)globalErrors.push(...duplicates.map(k=>`duplicate_asset_key:${k}`));
  if(keys.some(k=>!isText(k)))globalErrors.push("blank_asset_key");
  const known=new Set(keys);
  const stagingDirs=await listDirs(stagingRoot);
  for(const d of stagingDirs)if(!known.has(d))globalErrors.push(`unknown_staging_asset_key:${d}`);

  const assets=[];
  for(const reg of [...entries].sort((a,b)=>String(a.asset_key).localeCompare(String(b.asset_key)))){
    const assetErrors=[],assetWarnings=[];
    if(!["image","audio"].includes(reg.asset_type))assetErrors.push("invalid_registry_asset_type");
    if(!Number.isInteger(reg.latest_version)||reg.latest_version<0)assetErrors.push("invalid_registry_latest_version");
    if(reg.active_version!=null&&(!Number.isInteger(reg.active_version)||reg.active_version<1||reg.active_version>reg.latest_version))assetErrors.push("invalid_registry_active_version");
    const dir=join(stagingRoot,reg.asset_key);
    const versionNames=(await listDirs(dir)).filter(x=>/^v\d{3}$/.test(x));
    const versions=versionNames.map(x=>Number(x.slice(1))).sort((a,b)=>a-b);
    const unexpected=(await listDirs(dir)).filter(x=>!/^v\d{3}$/.test(x));
    if(unexpected.length)assetErrors.push(...unexpected.map(x=>`noncanonical_version_dir:${x}`));
    const maxVersion=versions.length?versions.at(-1):0;
    if(maxVersion!==reg.latest_version)assetErrors.push(`latest_version_staging_mismatch:registry=${reg.latest_version}:staging=${maxVersion}`);
    const candidates=[];
    for(const v of versions)candidates.push(await inspectCandidate(args.root,reg,v));
    const latest=candidates.find(x=>x.version===reg.latest_version)||null;
    assets.push({
      asset_key:reg.asset_key,asset_type:reg.asset_type,runtime_required:Boolean(reg.runtime_required),
      latest_version:reg.latest_version,active_version:reg.active_version??null,paired_asset_group:reg.paired_asset_group??null,
      required_anchors:uniqSorted(reg.required_anchors||[]),errors:assetErrors,warnings:assetWarnings,candidates,latest_candidate:latest,
      classification:null,ready:false
    });
  }

  const pairGroups=new Map();
  for(const a of assets)if(a.paired_asset_group){
    if(!pairGroups.has(a.paired_asset_group))pairGroups.set(a.paired_asset_group,[]);
    pairGroups.get(a.paired_asset_group).push(a);
  }
  const pairReport={};
  for(const [name,members] of [...pairGroups.entries()].sort(([a],[b])=>a.localeCompare(b))){
    const complete=members.every(a=>{
      const c=a.latest_candidate;
      return c&&c.status==="APPROVED"&&a.errors.length===0&&c.errors.length===0;
    });
    pairReport[name]={members:members.map(x=>x.asset_key).sort(),complete};
    if(!complete){
      for(const a of members){
        const c=a.latest_candidate;
        if(c&&c.status==="APPROVED"&&a.errors.length===0&&c.errors.length===0)c.block_reasons=uniqSorted([...c.block_reasons,`paired_group_incomplete:${name}`]);
      }
    }
  }

  const counts={valid_approved:0,placeholder:0,absent:0,invalid:0,blocked:0};
  for(const a of assets){
    const c=a.latest_candidate;
    if(!c){
      a.classification="ABSENT";counts.absent++;continue;
    }
    const hardErrors=[...a.errors,...c.errors];
    if(hardErrors.length){
      a.classification="INVALID";counts.invalid++;continue;
    }
    if(c.status==="PLACEHOLDER"||c.block_reasons.includes("temporary_placeholder")){
      a.classification="PLACEHOLDER";counts.placeholder++;continue;
    }
    if(c.status==="APPROVED"&&c.block_reasons.length===0){
      a.classification="VALID_APPROVED";a.ready=true;counts.valid_approved++;continue;
    }
    a.classification="BLOCKED";counts.blocked++;
  }
  const runtimeRequired=assets.filter(a=>a.runtime_required);
  const runtimeReady=runtimeRequired.filter(a=>a.ready);
  const integrityOk=globalErrors.length===0&&counts.invalid===0;
  const readinessOk=integrityOk&&runtimeReady.length===runtimeRequired.length;
  const report={
    schema_version:"1.0",validator:"sprint9-asset-readiness-validator",mode:args.mode,
    registry:{expected_entries:EXPECTED_REGISTRY_COUNT,observed_entries:entries.length,unique_asset_keys:new Set(keys).size},
    summary:{...counts,runtime_required:runtimeRequired.length,runtime_ready:runtimeReady.length,integrity_ok:integrityOk,readiness_ok:readinessOk},
    paired_groups:pairReport,global_errors:uniqSorted(globalErrors),global_warnings:uniqSorted(globalWarnings),assets
  };
  if(!args.jsonOnly){
    const s=report.summary;
    console.error(`Sprint9 asset staging: approved=${s.valid_approved} placeholder=${s.placeholder} absent=${s.absent} invalid=${s.invalid} blocked=${s.blocked} runtime_ready=${s.runtime_ready}/${s.runtime_required}`);
    for(const a of assets.filter(x=>x.classification!=="VALID_APPROVED")){
      const c=a.latest_candidate,detail=[...a.errors,...(c?.errors||[]),...(c?.block_reasons||[])].join(",");
      console.error(`- ${a.asset_key}: ${a.classification}${detail?` [${detail}]`:""}`);
    }
    if(report.global_errors.length)console.error(`Global errors: ${report.global_errors.join(", ")}`);
  }
  console.log(JSON.stringify(report,null,2));
  if(args.mode==="readiness")process.exitCode=readinessOk?0:3;
  else process.exitCode=integrityOk?0:2;
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=2});
