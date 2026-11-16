const fs=require("fs");
const vm=require("vm");

const app=fs.readFileSync("src/game/app.js","utf8");
const registry=JSON.parse(fs.readFileSync("assets/asset-registry.json","utf8"));
const catalog=fs.readFileSync("docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv","utf8");
const generated=fs.readFileSync("src/content/localization.generated.js","utf8");
const pick=app.match(/function sprint6SceneAssetKey\(payload\)\{[^\n]+\}/)?.[0];
if(!pick)throw Error("ACT9 scene asset selector is missing");
const context={};vm.runInNewContext(`${pick};this.pick=sprint6SceneAssetKey`,context);
const payload=(red_activated,blue_activated)=>({scene_asset_key:"shared.great_hall",state:{act_no:9,red_activated,blue_activated}});
const cases=[
  [false,false,"shared.great_hall"],
  [true,false,"shared.great_hall.red_first"],
  [true,true,"shared.great_hall.both_open"],
  [false,true,"shared.great_hall"]
];
for(const [red,blue,key] of cases)if(context.pick(payload(red,blue))!==key)throw Error(`ACT9 ${red}/${blue} selected the wrong asset`);
for(const key of ["shared.great_hall.red_first","shared.great_hall.both_open"]){
  const entry=registry.assets.find(asset=>asset.asset_key===key);
  if(!entry||entry.latest_version!==1||entry.active_version!==1)throw Error(`${key} registry does not authorize the accepted v001 release`);
  if(!app.includes(`"${key}"`))throw Error(`${key} is not allowlisted by the Player runtime`);
}
if(!app.includes('{fallbackKey:payload.scene_asset_key,onFallback:restoreBase}'))throw Error("ACT9 variant failure lacks the base-image fallback");
if(!app.includes('trialAssetResolver.resolve("shared.great_hall")'))throw Error("ACT9 variants do not reuse the approved base anchors for UI labels");
if(!app.includes('node.classList.toggle("artwork-state"'))throw Error("ACT9 artwork variants do not suppress the duplicate HTML door effect");
if(!catalog.includes('act09.022')||!catalog.includes('门没有反应。')||!catalog.includes('De deur reageert niet.'))throw Error("GA-149 canonical feedback is missing");
if(!generated.includes('门没有反应。')||!generated.includes('De deur reageert niet.'))throw Error("GA-149 generated feedback is missing");
console.log("ACT9 asset variant and GA-149 localization static checks passed.");
