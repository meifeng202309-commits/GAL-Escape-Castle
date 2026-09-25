import {createAssetResolver} from '../src/game/asset-runtime.js';
const assert=(value,message)=>{if(!value)throw new Error(message)};
let time=1000,calls=[];
const rpc=async(name,body)=>{calls.push({name,body});return name==='asset_resolve'?{ok:false,reason:'NO_ACTIVE_ASSET',asset_key:body.p_asset_key}:{ok:true,recorded:true}};
const resolver=createAssetResolver(rpc,{ttlMs:30000,now:()=>time});

for(let i=0;i<20;i++)await resolver.resolve('missing.scene');
assert(calls.filter(x=>x.name==='asset_resolve').length===1,'unchanged missing asset resolved once per render');
time+=30001;
await resolver.resolve('missing.scene');
assert(calls.filter(x=>x.name==='asset_resolve').length===2,'changed/new state cannot be observed after cache expiry');

calls=[];
const act6Rpc=async(name,body)=>{calls.push({name,body});if(body.p_asset_key==='shared.portrait_hall')return{ok:true,asset_key:body.p_asset_key,version:4,storage_path:'game-assets/portrait.webp'};return{ok:false,reason:'NO_ACTIVE_ASSET',asset_key:body.p_asset_key}};
const act6Resolver=createAssetResolver(act6Rpc,{ttlMs:30000,now:()=>time});
for(let i=0;i<20;i++){
  const base=await act6Resolver.resolve('shared.portrait_hall');
  assert(base?.ok,'ACT6 base must remain ACTIVE in the regression fixture');
  await act6Resolver.resolve('overlay.portrait_eyes_open');
}
assert(calls.filter(x=>x.name==='asset_resolve'&&x.body.p_asset_key==='shared.portrait_hall').length===1,'ACT6 ACTIVE base resolution was not bounded');
assert(calls.filter(x=>x.name==='asset_resolve'&&x.body.p_asset_key==='overlay.portrait_eyes_open').length===1,'ACT6 missing overlay resolution was not bounded');

calls=[];
await resolver.reportActiveLoadFailure({ok:true,asset_key:'active.scene',version:2,storage_path:'game-assets/active.webp'});
const report=calls.find(x=>x.name==='asset_report_load_failure');
assert(report?.body.p_asset_key==='active.scene'&&report.body.p_version===2&&report.body.p_storage_path==='game-assets/active.webp','ACTIVE storage failure was not reported distinctly');
await resolver.reportActiveLoadFailure({ok:false,asset_key:'missing.scene'});
assert(calls.filter(x=>x.name==='asset_report_load_failure').length===1,'NO_ACTIVE placeholder incorrectly reported as ACTIVE storage failure');
console.log('Sprint9 bounded asset telemetry behavior passed.');
