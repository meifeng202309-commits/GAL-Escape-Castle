import fs from "node:fs";
import vm from "node:vm";

const app=fs.readFileSync("src/game/app.js","utf8");
const resolved=app.match(/function applyResolvedAsset\(node,key,result,onFailure=null\)\{[^\n]+\}/)?.[0];
const setter=app.match(/async function setS5Asset\(id,key,options=\{\}\)\{[^\n]+\}/)?.[0];
if(!resolved||!setter)throw new Error("Asset resolver functions were not found");
const assert=(value,message)=>{if(!value)throw new Error(message)};

const makeNode=()=>({
  dataset:{},isConnected:true,src:"",naturalWidth:0,alt:"",
  classList:{remove(){}},removeAttribute(){},onload:null,onerror:null
});

async function scenario(variantResult){
  const node=makeNode(),calls=[],failures=[],placeholders=[];
  const base={ok:true,asset_key:"shared.great_hall",storage_path:"base.webp"};
  const context={
    assetUrlCache:new Map(),
    document:{getElementById:id=>id==="scene"?node:null},
    trialAssetResolver:{
      resolve:async key=>{calls.push(key);return key==="shared.great_hall"?base:variantResult},
      reportActiveLoadFailure:result=>failures.push(result.asset_key)
    },
    applyTrialPlaceholder:(target,key)=>placeholders.push(key)
  };
  vm.runInNewContext(`${resolved}\n${setter}\nthis.setS5Asset=setS5Asset`,context);
  let restored=0;
  const result=await context.setS5Asset("scene","shared.great_hall.red_first",{fallbackKey:"shared.great_hall",onFallback:()=>restored++});
  return{node,calls,failures,placeholders,result,get restored(){return restored}};
}

const missing=await scenario({ok:false,asset_key:"shared.great_hall.red_first"});
assert(missing.result?.asset_key==="shared.great_hall","Missing metadata did not return the base asset");
assert(missing.node.dataset.assetKey==="shared.great_hall"&&missing.restored===1,"Missing metadata did not restore base state");
assert(missing.placeholders.length===0,"Missing variant metadata displayed a placeholder instead of the base");

const loadFailure=await scenario({ok:true,asset_key:"shared.great_hall.red_first",storage_path:"red.webp"});
assert(loadFailure.node.dataset.assetKey==="shared.great_hall.red_first","Resolved variant was not initially selected");
loadFailure.node.onerror();
await new Promise(resolve=>setImmediate(resolve));
assert(loadFailure.failures.includes("shared.great_hall.red_first"),"Variant decode failure telemetry was not emitted");
assert(loadFailure.node.dataset.assetKey==="shared.great_hall"&&loadFailure.restored===1,"Decode failure did not restore the base asset and decoration");
assert(loadFailure.placeholders.length===0,"Decode failure displayed a placeholder instead of the base");
console.log("ACT9 missing-metadata and load/decode fallback browser contract passed.");
