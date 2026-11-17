const fs=require("fs");
const crypto=require("crypto");
const app=fs.readFileSync("src/game/app.js","utf8"),css=fs.readFileSync("src/styles/app.css","utf8");
const sidecar=JSON.parse(fs.readFileSync("assets/staging/shared.main_gate/v003/shared.main_gate__v003.json","utf8"));
const image=fs.readFileSync("assets/staging/shared.main_gate/v003/shared.main_gate__v003.webp");
const assert=(value,message)=>{if(!value)throw new Error(message)};
assert(crypto.createHash("sha256").update(image).digest("hex")===sidecar.sha256,"Main Gate v003 bytes do not match the approved sidecar");
assert(sidecar.version===3&&sidecar.ui_anchors_status==="CD_SOURCE_VALIDATED_PENDING_BROWSER_GATE","Main Gate v003 source-validation state is missing");
assert(new Set(sidecar.ui_anchors.map(anchor=>anchor.anchor_name)).size===4,"Main Gate v003 must define four unique anchors");
for(const required of sidecar.required_anchors){const anchor=sidecar.ui_anchors.find(item=>item.anchor_name===required);assert(anchor,`Missing ${required}`);for(const field of["x_percent","y_percent","width_percent","height_percent"])assert(Number.isFinite(anchor[field]),`${required} ${field} is not numeric`);assert(anchor.x_percent>=0&&anchor.y_percent>=0&&anchor.x_percent+anchor.width_percent<=100&&anchor.y_percent+anchor.height_percent<=100,`${required} exceeds image bounds`)}
for(const token of['data-station-role="${role}"','Number(scene.version)>=3','node.dataset.stationRole!=="WATCHER"'])assert(app.includes(token),`Missing baked-label runtime contract: ${token}`);
assert(css.includes(".s6-station-label.artwork-state .localized")&&css.includes("visibility:hidden"),"Baked A/B/C labels are still duplicated by runtime text");
console.log("CA338 Main Gate v003 hash, anchor and baked-label static checks passed.");
