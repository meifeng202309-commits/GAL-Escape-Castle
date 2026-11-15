const fs=require('fs');
const app=fs.readFileSync('src/game/app.js','utf8');
const css=fs.readFileSync('src/styles/app.css','utf8');
const assert=(value,message)=>{if(!value)throw new Error(message)};

for(const key of ['opening.gitte_room','opening.anna_room','opening.linda_study','shared.library','ending.castle_exterior'])assert(app.includes(key),`missing trial scene binding: ${key}`);
for(const token of ['applyTrialPlaceholder','trial-asset-placeholder','Temporary media placeholder','markSprint6AudioConsumed(identity,"stopped")'])assert(app.includes(token),`missing trial fallback behavior: ${token}`);
const resolution=app.slice(app.indexOf('async function setS5Asset'),app.indexOf('async function hydrateS5Assets'));
const resolvedAsset=app.slice(app.indexOf('function applyResolvedAsset'),app.indexOf('async function setS5Asset'));
assert(resolution.indexOf('trialAssetResolver.resolve(key)')<resolution.indexOf('applyTrialPlaceholder(node,key)'), 'runtime resolver must remain primary');
assert(resolvedAsset.includes('reportActiveLoadFailure(result)'),'ACTIVE storage failure telemetry missing');
const overlay=app.slice(app.indexOf('if(s.act_no===6){'),app.indexOf('if(s.act_no===7)document'));
assert(overlay.includes('trialAssetResolver.resolve("overlay.portrait_eyes_open")'),'ACT6 overlay bypasses the bounded resolver');
assert(overlay.includes('reportActiveLoadFailure(overlay)'),'ACTIVE overlay storage failure telemetry missing');
assert(!overlay.includes('rpc("asset_resolve"'),'ACT6 overlay still calls asset_resolve directly');
assert(!app.includes('ASSET_UNAVAILABLE · ${key}'),'unavailable images still block the trial UI');
assert(css.includes('.trial-asset-placeholder')&&css.includes('aspect-ratio:16/9'),'placeholder presentation contract missing');
console.log('Sprint9 trial placeholder static checks passed.');
