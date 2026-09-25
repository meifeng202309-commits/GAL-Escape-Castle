const fs=require("fs");
const path=require("path");

const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"src/game/app.js"),"utf8");
const css=fs.readFileSync(path.join(root,"src/styles/app.css"),"utf8");

function assert(condition,message){
  if(!condition)throw new Error(message);
}

const start=app.indexOf("function renderSprint8");
const end=app.indexOf("async function hydrateSprint6",start);
assert(start>=0&&end>start,"renderSprint8 block not found");
const render=app.slice(start,end);

assert(render.includes('const stageNames=["fade","mission","escaped","remembered","they","end"]'),"ACT14 stage order changed");
assert(render.includes('document.getElementById("s6SceneImage")?.src||""'),"ACT13 exterior is not preserved for the ACT14 fade");
assert(render.includes('setS5Asset("s8ExteriorImage","ending.castle_exterior")'),"ACT14 reconnect fade lacks canonical exterior fallback");
assert(render.includes('data-s8-stage="${stageNames[stage]}"'),"ACT14 stages are not independently identified");
assert(render.includes('delays=[900,1100,1400,1800,1800]'),"ACT14 staged pause timing changed unexpectedly");

const keys=["act14.001","act14.002","act14.003","act14.004","act14.005"];
for(let i=1;i<keys.length;i++)assert(render.indexOf(keys[i-1])<render.indexOf(keys[i]),"ACT14 canonical reveal order changed");
assert(render.includes('<strong>${localizedHtml("act14.003")}</strong>'),"Castle-remembered line is not whole-sentence bold");
assert(render.includes('class="s8-separate-screen">${localizedHtml("act14.004")}</strong>'),"THEY/ZIJ line is not isolated on its own bold screen");

assert(css.includes(".s8-ending.s8-fade-stage{padding:0;background:transparent;animation:none}"),"Fade stage obscures the exterior before fade begins");
assert(css.includes(".s8-exterior-image{display:block;width:100%;height:100%;object-fit:cover}"),"ACT14 exterior does not fill the cinematic screen");
assert(css.includes("animation:s8Blackout .9s ease both"),"ACT14 fade-to-black animation missing");
assert(css.includes(".s8-ending{")&&css.includes("text-transform:none"),"ACT14 ending does not explicitly protect canonical casing");
assert(!/\.s8-ending\{[^}]*text-transform\s*:\s*uppercase/.test(css),"ACT14 ending is uppercased by its own presentation style");

console.log("Sprint 8 ACT14 presentation static checks passed.");
