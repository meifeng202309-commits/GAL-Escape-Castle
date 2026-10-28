import assert from "node:assert/strict";
import fs from "node:fs";
import { createAssetResolver } from "../src/game/asset-runtime.js";

let calls=0;
let release;
const rpc=async(name,{p_asset_key})=>{
  assert.equal(name,"asset_resolve");
  calls+=1;
  if(p_asset_key==="shared.concurrent")await new Promise(resolve=>{release=resolve});
  if(p_asset_key==="shared.retry"&&calls===2)return null;
  return {ok:true,asset_key:p_asset_key,storage_path:`${p_asset_key}.webp`,version:1};
};
const resolver=createAssetResolver(rpc);
const first=resolver.resolve("shared.concurrent");
const second=resolver.resolve("shared.concurrent");
await Promise.resolve();
assert.equal(calls,1,"concurrent same-key resolutions must share one RPC");
release();
assert.deepEqual(await first,await second);
await resolver.resolve("shared.concurrent");
assert.equal(calls,1,"successful resolutions must retain the TTL cache");

assert.equal(await resolver.resolve("shared.retry"),null);
assert.equal(calls,2);
assert.equal((await resolver.resolve("shared.retry")).ok,true);
assert.equal(calls,3,"transient null resolutions must be retried immediately");

const source=fs.readFileSync(new URL("../src/game/app.js",import.meta.url),"utf8");
assert.match(source,/function renderSprint5[\s\S]*?setStableHtml\(sprint3bText,`<p class="eyebrow">ACT/);
assert.match(source,/function renderSprint6[\s\S]*?setStableHtml\(sprint3bText,body\)/);
assert.doesNotMatch(source,/function renderSprint5[\s\S]*?sprint3bText\.innerHTML=`<p class="eyebrow">ACT/);
assert.match(source,/hydrateAct4Comparison[\s\S]*?Promise\.all/);
assert.match(source,/hydratePocketAssets\(\).*?Promise\.all/);
assert.match(source,/hydrateS5Assets\(s\).*?Promise\.all/);

console.log("asset runtime and image stability checks passed");
